

/*   
 *   File: cspfmAttachmentUpload.ts
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */
import { Component, ApplicationRef, OnInit } from '@angular/core';
import { NavController, LoadingController,IonSlides,  NavParams, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { attachmentDbProvider } from 'src/core/db/attachmentDbProvider';
import { attachmentCouchDbProvider } from 'src/core/db/attachmentCouchDbProvider';
import { appUtility } from 'src/core/utils/appUtility';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Zip } from '@awesome-cordova-plugins/zip/ngx';
import { cspfmAttachementUploadDbProvider } from 'src/core/db/cspfmAttachementUploadDbProvider';
import {attachmentDbConfiguration} from 'src/core/db/attachmentDbConfiguration';
import { appConstant } from 'src/core/utils/appConstant';

@Component({
  selector: 'page-cspfmAttachmentUpload',
  templateUrl: 'cspfmAttachmentUpload.html',
  styleUrls: ['./cspfmAttachmentUpload.scss']
})
export class cspfmAttachmentUpload implements OnInit {


  // Navigation Parameter
  public selectedFileName;
  public filesizeVal;
  public selectedFileSize;
  public selectedFileType;
  public selectedFileUploadDate;
  public attachmentExtnArray = [];
  public selectedObject;
  public docExtnArray = [];
  public attachmentInfo;
  public documentInfo;
  public fileToWrite;
  public fileNameStr;
  public disableUploadButton = true;
  loading;
  private redirectUrl = "/";
  constructor(public navCtrl: NavController, public activatedRoute: ActivatedRoute,
    public loadingCtrl: LoadingController, public applicationRef: ApplicationRef, public router: Router,
     public attachmentDbObject: attachmentDbProvider,
    public attachmentCouchDbObject: attachmentCouchDbProvider, public appUtilityConfig: appUtility,
    public file: File, public fileOpener: FileOpener, private zip: Zip, 
    public cspfmAttachementUploadDbObj: cspfmAttachementUploadDbProvider, public attachmentDbConfig: attachmentDbConfiguration,
    public navParams: NavParams, public modalController: ModalController
  ) {
      const params = this.navParams.get('queryParams')
      const navParameters = JSON.parse(params['params']);
      this.redirectUrl = params['redirectUrl'];
      const docinfoParams = navParameters[0];
      this.selectedObject = docinfoParams['selectedObj'];
      this.attachmentInfo = docinfoParams['attachmentInfo'][0];
      const attachmentInfoDataDict = this.attachmentInfo['fileExtension'];
      this.attachmentExtnArray = [];
      for (let j = 0; j < attachmentInfoDataDict.length; j++) {

        this.attachmentExtnArray.push(attachmentInfoDataDict[j]['type'].toLowerCase());
      }
      this.documentInfo = docinfoParams['documentInfo'];
      for (let i = 0; i < this.documentInfo.length; i++) {
        const docFileEtxnArray = this.documentInfo[0]['fileExtension'];
        this.docExtnArray = [];
        for (let j = 0; j < docFileEtxnArray.length; j++) {
          this.docExtnArray.push(docFileEtxnArray[j]['type']);
        }
      }
  }
  

  closeButtonClick() {
    this.modalController.dismiss(true);
  }
  imageSelected(fileEvent) {
    const imageFiles = fileEvent.target.files[0];
    let selectImageUrl;
    if (imageFiles) {
    this.fileToWrite = imageFiles;
    this.selectedFileName = this.fileToWrite.name;
    this.fileNameStr = this.selectedFileName.split('.')[0];
    this.selectedFileType = this.selectedFileName.split('.')[1];
    this.selectedFileSize = this.bytesToSize(this.fileToWrite.size);
    const fileSizeArray = this.selectedFileSize.split(' ');
    this.filesizeVal = parseInt(fileSizeArray[0].toString(), 0);
    const filesizeExtn = fileSizeArray[1].toString();
    this.selectedFileUploadDate=this.fileToWrite['lastModifiedDate'];
     this.disableUploadButton = false;
    if (this.selectedFileName.length > 50) {
      this.disableUploadButton = true
      alert('file name length should be less than 50');
      return;
    }
    if (filesizeExtn === 'GB' || filesizeExtn === 'TB' || (filesizeExtn === 'MB' && this.filesizeVal > 15)) {
      this.disableUploadButton = true
      alert('file size should be less than 15 MB');
      return;
    }
    if (!this.attachmentExtnArray.includes(this.selectedFileType)) {
      this.disableUploadButton = true
      alert('file format not support for this upload');
      return;
    }
    if (this.appUtilityConfig.isMobile) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
    selectImageUrl = event.target.result;
    this.file.writeFile(this.file.dataDirectory, this.fileToWrite.name, selectImageUrl, { replace: true }).then(() => {
    }).catch(error => {
    console.log('error msg', error);
      });
    }
    reader.onabort = (err: any) => {
      console.log('onabort', err);
     };
    reader.onloadend = () => { 
      
    reader.readAsArrayBuffer(this.fileToWrite);
    }
    } else {
    selectImageUrl = "";
    }
  }
}
  uploadButtonPressed() {
    if(!navigator.onLine){
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
    this.disableUploadButton = true;
    const pfmObj_str = 'pfm_' + this.attachmentInfo['objectId'] + '_id';
    const pfmObj_str1 = 'pfm' + this.attachmentInfo['objectId'];

    const tableStructure = this.attachmentDbConfig.configuration.tableStructure
    const selectedObj = this.selectedObject['attachmentType'];
    const saveObject = JSON.parse(JSON.stringify(tableStructure[selectedObj]));
    saveObject[pfmObj_str] = this.attachmentInfo['objectId'];
    saveObject.obj_attachment_config_id = this.attachmentInfo['objAttachmentConfigId'];
    saveObject.file_name = this.fileNameStr;
    saveObject.display_name = this.selectedFileName;
    saveObject.file_size = this.filesizeVal; // this.selectedFileSize;
    saveObject.file_extension = this.selectedFileType;
    saveObject[pfmObj_str1] = this.selectedObject['parentId'];
    saveObject.type = this.selectedObject['attachmentType'];
    saveObject.status = 'initiated';

    const tempSaveRecord = {
      "file_path": this.file.dataDirectory,
      "file_size": this.selectedFileSize,
      "file_name": this.selectedFileName,
      "file_type": this.selectedFileType,
      "status": 'initiated',
      "recordId": this.selectedObject['recordId'],
      "objectId": this.attachmentInfo['objectId'],
      "configId" : this.attachmentInfo['objAttachmentConfigId'],
      'pouchSaveObject': saveObject,
      'pouchServiceObj': this.selectedObject['serviceObjectAttachment'],
      'pouchParentType': this.selectedObject['parentType'] + 'att',
      'fileSaveAs' : this.attachmentInfo['fileSaveAs']

    }
    if (this.appUtilityConfig.isMobile) {
      this.cspfmAttachementUploadDbObj.saveAttachmentInfo(tempSaveRecord);
    } else {
      this.cspfmAttachementUploadDbObj.saveAttachmentInfoWithContentForWeb(tempSaveRecord, this.fileToWrite, appConstant.fileType.attachment);
    } 
   }
  previewButtonPressed() {
    const writeDirectory = this.file.dataDirectory;
    this.file.checkFile(writeDirectory, this.selectedFileName).then(responseCheck => {
      const fileExtn = this.selectedFileName.split('.').reverse()[0];
      const fileMIMEType = this.getMIMEtype(fileExtn);
      this.fileOpener.open(writeDirectory + this.selectedFileName, fileMIMEType)
        .then(() => console.log('File is opened'))
        .catch(e => {
          this.appUtilityConfig.presentToast('file is not in correct format');
        });
    }).catch(async () => {
      this.appUtilityConfig.presentToast('file not found');
    })
  }
  cancelButtonPressed() {
    const writeDirectory = this.file.dataDirectory;
    this.file.checkFile(writeDirectory, this.selectedFileName).then(responseCheck => {
      this.file.removeFile(writeDirectory, this.selectedFileName)
        .then(() => this.appUtilityConfig.presentToast('File is deleted'))
        .catch(e => {
          this.appUtilityConfig.presentToast('file is not in correct format');
        });
    }).catch(err => {
      console.log('error =>', err);
    })
  }

bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 bytes';
  }
  const value = Math.floor(Math.log(bytes) / Math.log(1024))
  const i = parseInt(value.toString(), 0);
  if (i === 0) {
    return bytes + ' ' + sizes[i];
  }
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};
  ngOnInit() {
  }

  ionViewWillEnter() {
  }
  // Un subscribe event listener
  ionViewWillUnload() {

  }



  getMIMEtype(extn) {
    const ext = extn.toLowerCase();
    const MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    return MIMETypes[ext];
  } 
 
}

