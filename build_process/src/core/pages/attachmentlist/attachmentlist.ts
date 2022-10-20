import { Component, ApplicationRef, OnInit, ViewChild, Inject, Input, ElementRef } from '@angular/core';
import { NavController, LoadingController,AlertController, IonSlides, ModalController } from '@ionic/angular';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { ActivatedRoute, Router } from '@angular/router';
import { attachmentDbProvider } from 'src/core/db/attachmentDbProvider';
import { attachmentCouchDbProvider } from 'src/core/db/attachmentCouchDbProvider';
import { appUtility } from 'src/core/utils/appUtility';
import * as lodash from 'lodash';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { saveAs } from 'file-saver';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Zip } from '@awesome-cordova-plugins/zip/ngx';
import { Broadcaster } from '@awesome-cordova-plugins/broadcaster/ngx';
import { appConstant } from 'src/core/utils/appConstant';
import { cspfmAttachmentUpload } from '../cspfmAttachmentUpload/cspfmAttachmentUpload';
import { cspfmdocumentuploadconfiguration } from '../cspfmdocumentuploadconfiguration/cspfmdocumentuploadconfiguration';
import { cspfmAttachementUploadDbProvider } from 'src/core/db/cspfmAttachementUploadDbProvider';
import { attachmentDbConfiguration } from 'src/core/db/attachmentDbConfiguration';
import { couchdbProvider } from 'src/core/db/couchdbProvider';
import { dbProvider } from 'src/core/db/dbProvider';
import { CarouselComponent } from 'ng-carousel-cdk';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { dataProvider } from 'src/core/utils/dataProvider';
import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';
import { HttpClient } from '@angular/common/http';
import * as FileType from 'file-type/core'
// declare const Buffer

@Component({
  selector: 'page-attachmentlist',
  templateUrl: 'attachmentlist.html',
  styleUrls: ['./attachmentlist.scss']
})
export class attachmentlist implements OnInit {
  segmentStyle: string;

  segmentDefault() {
    this.segmentStyle = 'cs-segment-styles';
  }

  segmentChange() {
    this.segmentStyle = 'cs-segment-styles-active';
  }

  @ViewChild('sliderView') sliderView: IonSlides;
// Variable to store list of data to display
  public resultList: Array<any> = [];
  public selectFlag = true;

  // Parent Id from navigation parameter
  private parentId: any;

  // Parent Type from navigation parameter
  private parentType: any;

  // variable for errorMessage
  public errorMessageToDisplay = "No Records";

  // Selected Object Display Name
  public selectedObjDisplayName = "";

  // Navigation Parameter
  public navParameters;

  // Selected Object Holding Variable
  public selectedObj = {};

  public documentDataArray = [];
  // Selected Segment For default selection
  public selectedSegment = "";

  public searchText = '';

  public isSelectOption = false;
  public isFilterOption = false;
  public isMultiselect = false;
  public searchTerm = '';
  public filteredResultList: Array<any> = [];
  // public frequencyArray: Array<any> = ['AnyDate', 'Daily', 'Weekly', 'Monthly', 'Quaterly', 'Yearly'];
  public frequencyArray: Array<any> = [];
  public documentTypeArray: Array<any> = ['Single','Multiple'];
  public documentToExpand = -1;
  public filteredDocObjectArray: Array<any> = [];
  public attachmentInfoDict: {};
  public selectedFrequencyVal = -1;
  public selectedDocTypeVal = -1;
  loading;
  private redirectUrl = "/";
  public groupedResultList;
  public keyGroupedResult = [];
  public fileToWrite;
  public selectedFileName;
  public filesizeVal;
  public selectedFileSize;
  public selectedFileType;
  public selectedFileUploadDate;
  public fileNameStr;
  public disableUploadButton = true;
  public attachmentExtnArray = [];
  public parentObject = {};
  public isAscendingOrder = true;
  public prominentFieldDetails = {};
  public displayLoadingIndicator = false
  public intervalId = null;
  public isPageAlive = true
  @ViewChild(CarouselComponent) carouselRef: CarouselComponent;
  @Input() queryParams: any;
  @ViewChild('myInput') myInput: ElementRef;
  public corUsersObjectHierarchyJSON = {
    "objectId": this.metaDbconfig.corUsersObject,
    "objectName": this.metaDbconfig.corUsersObject,
    "fieldId": 0,
    "objectType": "PRIMARY",
    "relationShipType": null,
    "childObject": []
  };
  public isFilterApplied = false;
  public isMultipleDocSelected = false;
  public isSelectedFrequency = false;
  public searchFieldDisplayName ='';
  public selectedAttachmentFile = {};
  constructor(private dialogRef: MatDialogRef<attachmentlist>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, public dataProvider: dataProvider, public navCtrl: NavController, public activatedRoute: ActivatedRoute, public broadcaster: Broadcaster,
    public loadingCtrl: LoadingController, public applicationRef: ApplicationRef, public router: Router,
     public attachmentDbObject: attachmentDbProvider,private alertCtrl: AlertController,
    public attachmentCouchDbObject: attachmentCouchDbProvider, public appUtilityConfig: appUtility, public modalController: ModalController,
    public file: File, public observableListenerUtils: cspfmObservableListenerUtils,public fileOpener: FileOpener, private zip: Zip,private httpClient:HttpClient,
    public cspfmAttachementUploadDbObj: cspfmAttachementUploadDbProvider, public attachmentDbConfig: attachmentDbConfiguration, public couchdbProvider: couchdbProvider, public dbprovider: dbProvider,
    public metaDbconfig: metaDbConfiguration, public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, private metaDataDbProvider: metaDataDbProvider) {
    if (!this.appUtilityConfig.isMobileResolution) {
      const queryParams = JSON.parse(JSON.stringify(data['queryParams']));
      this.navParameters = JSON.parse(queryParams['params']);
      this.selectedObj = this.navParameters[0];
       this.parentType = this.selectedObj['parentType'];
      this.parentId = this.selectedObj['parentId'];
      this.selectedObjDisplayName = this.selectedObj['parentDisplayName'];
      this.prominentFieldDetails = this.selectedObj['prominentFieldDetails'];
      if (this.selectedObj['isAttachmentShow']) {
        this.searchFieldDisplayName = 'Search File Name,File Extension';
        this.attachmentInfoDict = this.selectedObj['attachmentInfo'];
        const attachmentInfoDataDict = this.attachmentInfoDict[0]['fileExtension'];
        this.attachmentExtnArray = [];
        for (let j = 0; j < attachmentInfoDataDict.length; j++) {
          this.attachmentExtnArray.push(attachmentInfoDataDict[j]['type'].toLowerCase());
        }
        this.selectedSegment = "Attachment"
       this.fetchAllData(this.selectedObj['attachmentType'], true)
      } else if (this.selectedObj['isDocumentShow']) {
        this.searchFieldDisplayName = 'Search Document Name';
        this.documentDataArray = this.selectedObj['documentInfo'];
        this.filteredDocObjectArray = this.selectedObj['documentInfo'];
        this.selectedSegment = "Document"
         this.fetchAllData(this.selectedObj['documentType'], true);
      }
      this.fetchSelectedObject()
      this.registerRecordChangeListener(this.selectedObj['attachmentType'], this.selectedObj['documentType']);
    }
  }
  ngAfterViewInit() {
    Array.from(document.getElementsByClassName("mat-tab-body-content"), x => x.classList.add("cs-custom-scroll"))
  }
 async fetchSelectedObject() {
    let idVal = this.parentType + '_2_' + this.parentId;
    let serviceObject;
    if (this.selectedObj['serviceObjectAttachment'] === "PouchDB") {
      serviceObject = this.dbprovider;
    } else {
      serviceObject = this.couchdbProvider;
    }
    serviceObject.fetchDocsWithDocIds([idVal])
      .then(result => {
        if (result["status"] !== "SUCCESS") {
          this.errorMessageToDisplay = result["message"];
          if (this.errorMessageToDisplay === "No internet") {
            this.appUtilityConfig.presentToast('No internet connection. Please check your internet connection and try again.');
            this.retryButtonPressed()
          }
          return;
        }
        this.parentObject = result["response"];
        this.applicationRef.tick();
      })
  }
  expandParentObjectData = {}
  expandAndCollapseParentObjectData(index) {
    if (this.expandParentObjectData[index]) {
      this.expandParentObjectData[index] = false
    } else {
      this.expandParentObjectData[index] = true
    }
  }
  sortingButtonPressed() {
    //sort
    if (this.isAscendingOrder) {
      this.isAscendingOrder = false;
      var sortedArray = lodash.orderBy(this.filteredResultList, 'file_name', 'asc');
      this.filteredResultList = sortedArray;
      return;
    } else {
      this.isAscendingOrder = true;
      this.filteredResultList = this.filteredResultList.reverse();
    }

  }
  doRefresh(refresher) {
    if (this.selectedObj['serviceObjectAttachment'] === appConstant.couchDBStaticName) {
      if (this.selectedObj['isAttachmentShow']) {
        this.fetchAllData(this.selectedObj['attachmentType'], true, refresher)
      }
    }
  }
  ngOnInit() {
    if (this.appUtilityConfig.isMobileResolution) {
      this.navParameters = JSON.parse(this.queryParams['params']);
      this.selectedObj = this.navParameters[0];
      this.parentType = this.selectedObj['parentType'];
      this.parentId = this.selectedObj['parentId'];
      this.selectedObjDisplayName = this.selectedObj['parentDisplayName'];
      this.prominentFieldDetails = this.selectedObj['prominentFieldDetails'];
      if (this.selectedObj['isAttachmentShow']) {
        this.attachmentInfoDict = this.selectedObj['attachmentInfo'];
        const attachmentInfoDataDict = this.attachmentInfoDict[0]['fileExtension'];
        this.attachmentExtnArray = [];
        for (let j = 0; j < attachmentInfoDataDict.length; j++) {
          this.attachmentExtnArray.push(attachmentInfoDataDict[j]['type'].toLowerCase());
        }
        this.selectedSegment = "Attachment"
        this.fetchAllData(this.selectedObj['attachmentType'], true)
      } else if (this.selectedObj['isDocumentShow']) {
        this.documentDataArray = this.selectedObj['documentInfo'];
        this.filteredDocObjectArray = this.selectedObj['documentInfo'];
        this.selectedSegment = "Document"
        this.fetchAllData(this.selectedObj['documentType'], true);
      }
      this.fetchSelectedObject()
      this.registerRecordChangeListener(this.selectedObj['attachmentType'], this.selectedObj['documentType']);
    }
    this.registerEventForInterruptCase();
  }
  registerRecordChangeListener(attachmentType, DocumentType) {
    this.observableListenerUtils.subscribe(attachmentType, (modified) => {

      if (modified['doc']['data'][this.parentType] && modified['doc']['data'][this.parentType] === this.parentId && this.selectedSegment === "Attachment") {
       
          this.fetchAllData(this.selectedObj['attachmentType'], false).catch(error => { console.log(error) 
          })
        
      }

    });
    this.observableListenerUtils.subscribe(DocumentType, (modified) => {

      if (modified['doc']['data'][this.parentType] && modified['doc']['data'][this.parentType] === this.parentId && this.selectedSegment !== "Attachment") {
       
          this.fetchAllData(this.selectedObj['documentType'], false).catch(error =>{
             console.log(error) })
        
      }

    });
  }
  ngOnDestroy() {
      this.clearInterval()
      this.isPageAlive = false
      this.observableListenerUtils.remove("uploadfailure","==")
  }
 
  unSubscribeChangeListener(attachmentType, DocumentType) {
    this.observableListenerUtils.remove(attachmentType,"==");
    this.observableListenerUtils.remove(DocumentType,"==");
  }
  ionViewWillEnter() {
    console.log("ionViewWillEnter in list")
  }
  // Un subscribe event listener
  ionViewWillUnload() {
    this.unSubscribeChangeListener(this.selectedObj['attachmentType'], this.selectedObj['documentType'])
  }
  closeButtonClick() {
    if (this.appUtilityConfig.isMobileResolution) {
      this.modalController.dismiss(true);
    } else if (!this.appUtilityConfig.isMobileResolution) {
      this.dialogRef.close();
    }
  }
  refreshButtonClick() {
    this.allDeSelectAction();
    if (this.selectedObj['isAttachmentShow'] && this.selectedSegment === "Attachment") {
      this.fetchAllData(this.selectedObj['attachmentType'], true);
      this.clearInterval()
    } else if (this.selectedObj['isDocumentShow'] && this.selectedSegment === "Document") {
      this.fetchAllData(this.selectedObj['documentType'], true);
    }
  }
  public isLoading = false;
  async fetchAllData(dataType, isShowIndicator, event?) {
    if (isShowIndicator && this.appUtilityConfig.isMobileResolution) {
      this.loading = await this.loadingCtrl.create({ message: 'Data sync ...' });
      this.loading.present();
       } else if (isShowIndicator && !this.appUtilityConfig.isMobileResolution) {
      this.isLoading = true;
    }
    const queryMaking = this.queryMakingBasedOnMethodCalled('fetchAllData',dataType);
    this.dataProvider.fileManageDbSelection(queryMaking).then(res => {   
      if (res['status'] === 'SUCCESS') {
        if (res['records'].length > 0) {
          const data = res['records'];
          this.resultList = data;
          this.getCoreUserName(data);
          let initiatedList = this.resultList.filter(object => object['status'] === 'initiated');
          if(initiatedList && initiatedList.length===0){
            this.clearInterval() 
          }  else{
              if(initiatedList && initiatedList.length>0 && this.isPageAlive && this.selectedObj['isAttachmentShow'] &&
              initiatedList[0]['type']===(this.selectedObj['parentType']+"att") ){
                this.scheduleFetchMethod() 
              }else if(initiatedList && initiatedList.length>0 && this.isPageAlive && this.selectedObj['isDocumentShow'] &&
              initiatedList[0]['type']===(this.selectedObj['parentType']+"doc") ){
                this.scheduleFetchMethodforDocument()
              }
             
            }
       
        } else {
          this.resultList = [];
          this.groupedResultList = [];
          this.filteredResultList = [];
          this.errorMessageToDisplay = "No Records";
        }
      } else {
        this.resultList = [];
        this.groupedResultList = [];
        this.filteredResultList = [];
        this.errorMessageToDisplay = res['message'];
        if (this.errorMessageToDisplay === 'No internet') {
          this.appUtilityConfig.presentToast('No internet connection. Please check your internet connection and try again.');
          this.retryButtonPressed()
        }
      }
      if (isShowIndicator && this.appUtilityConfig.isMobileResolution) {
         this.loading.dismiss();
       } else if (isShowIndicator && !this.appUtilityConfig.isMobileResolution) {
        this.isLoading = false;
      }
      if (event !== undefined) {
        event.target.complete();
      }
    })
  }
  async documentUploadAction(object) {
    if (!navigator.onLine) {
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
   if (object) {
      const params = {
        "documentInfo": JSON.stringify(object),
        "redirectUrl": "/menu/attachmentlist",
        "selectedObj": JSON.stringify(this.selectedObj),
        "retryUpload": false
      }
      if (this.appUtilityConfig.isMobileResolution) {
        const documentUploadPopUpModel = await this.modalController.create({
          component: cspfmdocumentuploadconfiguration,
          componentProps: {
            parentPage: this,
            queryParams: params,
          },
          backdropDismiss: false
        });
        await documentUploadPopUpModel.present();
        documentUploadPopUpModel.onDidDismiss().then(() => {
          this.fetchAllData(this.selectedObj['documentType'], true)
        })
      } else if (!this.appUtilityConfig.isMobileResolution) {
        const dialogConfig = new MatDialogConfig()

        dialogConfig.data = {
          serviceObject: this.dataProvider.getDbServiceProvider(appConstant.couchDBStaticName),
          parentPage: this,
          dataSource: appConstant.couchDBStaticName,
          queryParams: params,
          objectName: 'placement',
        };
        dialogConfig.panelClass = 'cs-attachment-dialog'
        let dialogRef = this.dialog.open(cspfmdocumentuploadconfiguration, dialogConfig);
        dialogRef.afterClosed().subscribe(() => {
          this.fetchAllData(this.selectedObj['documentType'], true);
        });
         }
    }
  }
  async uploadButtonAction() {
    if (!navigator.onLine) {
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
    const navigationParams = JSON.stringify([
      {
        "documentInfo": this.documentDataArray,
        "attachmentInfo": this.attachmentInfoDict,
        "selectedObj": this.selectedObj
      }
    ])

    const infoParams = {
      "params": navigationParams,
      redirectUrl: "/menu/attachmentlist"
    }

    const attachmentUploadPopUpModel = await this.modalController.create({
      component: cspfmAttachmentUpload,
      componentProps: {
        parentPage: this,
        queryParams: infoParams,
      },
      backdropDismiss: false
    });
    await attachmentUploadPopUpModel.present();
  }
  groupRecordsBasedOnName(data) {
    let groupaganistname;
    let tempResultGroup = [];
    this.groupedResultList = lodash.groupBy(data, function (arrayObj) {
      return arrayObj.obj_document_config_id;
    })
    this.keyGroupedResult = Object.keys(this.groupedResultList);
    tempResultGroup = this.groupedResultList;
    for (const i of this.keyGroupedResult) {
      const keyArray = tempResultGroup[i];
      groupaganistname = lodash.groupBy(keyArray, function (groupedelement) {
        return groupedelement.file_name;
      })
      const groupedValues = Object.values(groupaganistname);
      this.groupedResultList[i] = groupedValues;
    }
  }

  downloadClickAction(indexVal, event) {
    event.stopPropagation();
    this.downloadSingleFile(indexVal);
  }


  downloadSingleFileRequstBuilder(indexVal,docDataObject?) {
    let objectIdVal = '';
    let configIdVal = '';
    let fileSaveVal = ''; 

    let fileTypeVal = '';
    let fileIdStr = '';
    let downloadObj = [];
    if (this.selectedSegment === "Attachment") {
      objectIdVal = this.attachmentInfoDict[0]['objectId'];
      configIdVal = this.attachmentInfoDict[0]['objAttachmentConfigId'];
      fileSaveVal = this.attachmentInfoDict[0]['fileSaveAs'];
    
      fileIdStr = 'csp_' + objectIdVal + '_att_id';
      fileTypeVal = appConstant.fileType.attachment;
      downloadObj = this.filteredResultList[indexVal];
    } else {
      objectIdVal = this.documentDataArray[indexVal]['objectId'];
      configIdVal = this.documentDataArray[indexVal]["objDocumentConfigId"];
      fileSaveVal = this.documentDataArray[indexVal]["fileSaveAs"] 
     
      fileIdStr = 'csp_' + objectIdVal + '_doc_id';
      fileTypeVal = appConstant.fileType.document;
     
      downloadObj = docDataObject;
    }

    const requestInput = {
      "inputparams": {
        "orgId": this.appUtilityConfig.orgId,
        "userId": this.appUtilityConfig.userId,
        "recordId": this.selectedObj['recordId'],
        "objectId": objectIdVal,
        "fileType": fileTypeVal,
        "configId": configIdVal,
        "fileSaveAs": fileSaveVal,
        "pfmFileVOSet": [
          {
            "fileId": downloadObj[fileIdStr],
            "GUID": downloadObj["guid"],
            "filePath": downloadObj["file_path"],
            "fileName": downloadObj["file_name"],
            "fileExtension": downloadObj["file_extension"],
            "fileSize": downloadObj["file_size"],
            "fileContent": []
          }
        ]
      }
    }
    if (this.appUtilityConfig.isMobile) {
      requestInput.inputparams['sessionToken'] = this.appUtilityConfig.accessToken
      requestInput.inputparams['sessionType'] = "OAUTH"
    } else {
      requestInput.inputparams['sessionToken'] = this.appUtilityConfig.sessionId
      requestInput.inputparams['sessionType'] = "NODEJS"
    }

    return requestInput;
  }

  downloadMultiFileRequstBuilder(downloadArray, indexVal) {
    let objectIdVal = '';
    let configIdVal = '';
    let fileSaveVal = '';
    let recordIdStr = '';
    let fileTypeVal = '';
    let fileIdStr = '';
    if (this.selectedSegment === 'Attachment') {
      objectIdVal = this.attachmentInfoDict[0]['objectId'];
      configIdVal = this.attachmentInfoDict[0]['objAttachmentConfigId']
      fileSaveVal = this.attachmentInfoDict[0]['fileSaveAs'];
      recordIdStr = 'pfm_' + objectIdVal + '_id';
      fileIdStr = 'csp_' + objectIdVal + '_att_id'
      fileTypeVal = appConstant.fileType.attachment;
    } else {
      objectIdVal = this.documentDataArray[indexVal]['objectId'];
      configIdVal = this.documentDataArray[indexVal]["objDocumentConfigId"];
      fileSaveVal = this.documentDataArray[indexVal]["fileSaveAs"]
      recordIdStr = 'pfm_' + objectIdVal + '_id';
      fileIdStr = 'csp_' + objectIdVal + '_doc_id';
      fileTypeVal = appConstant.fileType.document;
    }
    const fileSetArray = [];
   
    for (let i = 0; i < downloadArray.length; i++) {
      if (downloadArray[i]['status'] === 'finished') {
        const dataDict = {
          "fileId": downloadArray[i][fileIdStr],
          "GUID": downloadArray[i]["guid"],
          "filePath": downloadArray[i]["file_path"],
          "fileName": downloadArray[i]["file_name"],
          "fileExtension": downloadArray[i]["file_extension"],
          "fileSize": downloadArray[i]["file_size"],
          "fileContent": []
        }
        fileSetArray.push(dataDict);
      }
    }
    if (fileSetArray.length === 0) {
      this.appUtilityConfig.presentToast("Selected files are not uploded successfully");
      this.loading.dismiss();
      return
    }
    const requestInput = {
      "inputparams": {
        "orgId": this.appUtilityConfig.orgId,
        "userId": this.appUtilityConfig.userId,
        "recordId": this.selectedObj['recordId'],
        "objectId": objectIdVal,
        "fileType": fileTypeVal,
        "configId": configIdVal,
        "fileSaveAs": fileSaveVal,
        "pfmFileVOSet": fileSetArray
      }
    }

    if (this.appUtilityConfig.isMobile) {
      requestInput.inputparams['sessionToken'] = this.appUtilityConfig.accessToken
      requestInput.inputparams['sessionType'] = "OAUTH"
    } else {
      requestInput.inputparams['sessionToken'] = this.appUtilityConfig.sessionId
      requestInput.inputparams['sessionType'] = "NODEJS"
    }
    return requestInput;
  }
  downloadWebserviceCall(requestInput) {
    const appBuilderUrl = this.appUtilityConfig.appBuilderURL;
    const downloadUrlStr = '/filemanage/download'; 
    const serviceURl = appBuilderUrl + downloadUrlStr;
    return  this.httpClient
      // tslint:disable-next-line: deprecation
      .post(serviceURl, requestInput, { responseType: 'arraybuffer' }).toPromise()
      .then(res => {
        const response = res;
        return Promise.resolve(response);
      }).catch(error => {
        return Promise.reject(error);
      });
  }
  async downloadSingleFile(indexVal,docDataObject?) {
    if (!navigator.onLine) {
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
   
  this.displayLoadingIndicator = true
    let folderName = '';
    if (this.selectedSegment === "Attachment") {
      folderName = 'Attachment';
    } else {
      folderName = 'Document';
    }
    let recordIdFolder = '';
    const requestInput = this.downloadSingleFileRequstBuilder(indexVal,docDataObject)
    const inputParamsData = requestInput['inputparams']
    const objectIdStr = JSON.stringify(inputParamsData['objectId']);
    const configIdStr = JSON.stringify(inputParamsData['configId']);
    if (this.selectedSegment === "Attachment") {
      recordIdFolder = JSON.stringify(inputParamsData['recordId']);
    } else {
      recordIdFolder = String(inputParamsData['recordId']);
    }
    const fileInfo = inputParamsData['pfmFileVOSet'];
    const fileNameStr = fileInfo[0]["fileName"];
    const fileName = fileNameStr + '.' + fileInfo[0]["fileExtension"]
    let blobData;
    this.downloadWebserviceCall(requestInput).then((response) => {
      try {
        const decodedString = String.fromCharCode.apply(null, new Uint8Array(response));
        const obj = JSON.parse(decodedString);
        this.appUtilityConfig.presentToast(obj.message);
        this.displayLoadingIndicator = false
        if (obj.message === "Invalid sessiontoken" || obj.message === "Session expired") {
          if (this.appUtilityConfig.isMobile) {
            this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'Logout' });
          } else {
            window.location.replace('/apps/applist?metaFailureAction=Logout');
          }
        }
        return;
      } catch (error) {
        blobData = new Blob([response], { type: 'application/octet-stream' });
        if (!this.appUtilityConfig.isMobile) {
          saveAs(blobData, fileName);
          this.displayLoadingIndicator = false
          return;
        }
        const writeDirectory = this.file.dataDirectory;
        this.checkAndCreateDirectory(writeDirectory, folderName).then(res1 => {
          this.checkAndCreateDirectory(writeDirectory + folderName + '/', objectIdStr).then(res2 => {
            this.checkAndCreateDirectory(writeDirectory + folderName + '/' + objectIdStr + '/', configIdStr).then(res3 => {
              this.checkAndCreateDirectory(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr + '/',
                recordIdFolder).then(res4 => {
                  if (this.selectedSegment === 'Attachment') {
                    this.file.writeFile(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr + '/' + recordIdFolder,
                      fileName, blobData, { replace: true }).then(() => {
                        this.displayLoadingIndicator = false
                        console.log('Sucessfully downloaded');
                      }).catch(error => {
                        this.displayLoadingIndicator = false
                        console.log('error msg', error);
                      });
                  } else {
                    this.checkAndCreateDirectory(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr + '/' +
                      recordIdFolder + '/', fileNameStr).then(res5 => {
                        this.file.writeFile(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr + '/' + recordIdFolder
                          + '/' + fileNameStr, fileName, blobData, { replace: true }).then(() => {
                            this.displayLoadingIndicator = false
                            console.log('Sucessfully downloaded');
                          }).catch(error => {
                            this.displayLoadingIndicator = false
                            console.log('error msg', error);
                          });
                      })
                  }
                })
            })
          })
        })
      }
    })
      .catch(error => {
        this.errorBlock(error);
      });
  }

  async multiselectAttachementdownloadAction() {
    if (!navigator.onLine) {
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
    this.isMultiselect = false;
    const downloadArray = [];
    let indexValueForSingleObj = 0;
    for (let iVal = 0; iVal < this.filteredResultList.length; iVal++) {      
        if (this.filteredResultList[iVal]['isSelected'] === true && this.filteredResultList[iVal]['status'] === "finished" ) {
      
         downloadArray.push(this.filteredResultList[iVal])
        indexValueForSingleObj = iVal;
          }else if (this.filteredResultList[iVal]['isSelected'] === true){
            this.appUtilityConfig.presentToast("Please Unselect the failed files.");
        return;
          }
    }
      if (downloadArray.length === 1) {
      this.downloadSingleFile(indexValueForSingleObj);
      return;
    } else if (downloadArray.length === 0) {
      if (this.appUtilityConfig.isMobileResolution) {
        alert('select file to download');
      } else if (!this.appUtilityConfig.isMobileResolution) {
        this.appUtilityConfig.showAlert(this,'select file to download');
      }
      return;
    } else {
   
  
      this.displayLoadingIndicator = true
      const requestInput = this.downloadMultiFileRequstBuilder(downloadArray, 0)
      const inputParamsData = requestInput['inputparams']
      const folderName = 'Attachment';
      const zipFolderName = 'attachmentTemp.zip';
      const unzipFolderName = 'attachmentTemp';
      const objectIdStr = JSON.stringify(inputParamsData['objectId']);
      const configIdStr = JSON.stringify(inputParamsData['configId']);
      const recordIdData = JSON.stringify(inputParamsData['recordId']);
      let blobData;
      this.downloadWebserviceCall(requestInput).then((response) => {
        try {
          const decodedString = String.fromCharCode.apply(null, new Uint8Array(response));
          const obj = JSON.parse(decodedString);
          this.appUtilityConfig.presentToast(obj.message);
          this.displayLoadingIndicator = false
          if (obj['message'] === "Invalid sessiontoken" || obj['message'] === "Session expired") {
            if (this.appUtilityConfig.isMobile) {
              this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'Logout' });
            } else {
              window.location.replace('/apps/applist?metaFailureAction=Logout');
            }
          }
        
          return;
        } catch (error) {
          blobData = new Blob([response], { type: 'application/octet-stream' });
          if (!this.appUtilityConfig.isMobile) {
            saveAs(blobData, zipFolderName);
            this.displayLoadingIndicator = false
            return;
          }
          const writeDirectory = this.file.dataDirectory;
          this.file.writeFile(writeDirectory, zipFolderName, blobData, { replace: true }).then(() => {
            this.zip.unzip(writeDirectory + zipFolderName, writeDirectory + unzipFolderName)
              .then((result) => {
                if (result === 0) {
                  console.log('SUCCESS');
                  this.file.removeFile(writeDirectory, zipFolderName);
                  this.file.listDir(writeDirectory, unzipFolderName).then(data => {
                    data.forEach(element => {
                      this.checkAndCreateDirectory(writeDirectory, folderName).then(res1 => {
                        this.checkAndCreateDirectory(writeDirectory + folderName + '/', objectIdStr).then(res2 => {
                          this.checkAndCreateDirectory(writeDirectory + folderName + '/' + objectIdStr + '/', configIdStr).then(res3 => {
                            this.checkAndCreateDirectory(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr + '/',
                              recordIdData).then(res4 => {
                                this.displayLoadingIndicator = false
                                this.file.checkFile(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr + '/' +
                                  recordIdData + '/', element.name).then(chkfile => {
                                    console.log('chkfile exist', chkfile);
                                    this.file.removeFile(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr + '/' +
                                      recordIdData + '/', element.name).then(removeFile => {
                                        console.log('remove under process');
                                        this.moveFileCatchBlock(writeDirectory, unzipFolderName, element, folderName, objectIdStr, configIdStr, recordIdData);
                                      }).catch(() => {
                                        this.moveFileCatchBlock(writeDirectory, unzipFolderName, element, folderName, objectIdStr, configIdStr, recordIdData);
                                      })
                                  }).catch(() => {
                                    this.moveFileCatchBlock(writeDirectory, unzipFolderName, element, folderName, objectIdStr, configIdStr, recordIdData);
                                  })
                              })
                          })
                        })
                      })
                    });
                  });
                }
                if (result === -1) {
                  this.displayLoadingIndicator = false
                  this.appUtilityConfig.presentToast('Download Failed');
                }
              });
          })
        }
      }).catch(error => {
        this.errorBlock(error);

      });
    }
  }

  errorBlock(error) {
    console.log('An error occurred', error);
 
   this.displayLoadingIndicator = false
    this.appUtilityConfig.presentToast(error.message);
    this.loading.dismiss();
  }

  moveFileCatchBlock(writeDirectory, unzipFolderName, element, folderName, objectIdStr, configIdStr, recordIdData) {
    this.file.moveFile(writeDirectory + unzipFolderName, element.name, writeDirectory + folderName + '/' +
      objectIdStr + '/' + configIdStr + '/' + recordIdData, element.name).then((moveRes) => {
        console.log('move sucess');
      })

  }

  async multiselectDocumentClickAction(indexVal) {
    if (!navigator.onLine) {
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
    
    this.isMultiselect = false;
    const downloadArray = [];
    const folderName = 'Document';
    const zipFolderName = 'documentTemp.zip';
    const unzipFolderName = 'documentTemp';
    const configIdVal = this.documentDataArray[indexVal]["objDocumentConfigId"];
    const hasIndex = lodash.has(this.groupedResultList, [configIdVal])
    if (hasIndex === false) {
      if (this.appUtilityConfig.isMobileResolution) {
        alert('select file to download');
      } else if (!this.appUtilityConfig.isMobileResolution) {
        this.appUtilityConfig.showAlert(this,'select file to download');
      }
      return;
    }
    const downloadObj = this.groupedResultList[configIdVal];
    for (let i = 0; i < downloadObj.length; i++) {
      const innerArray = downloadObj[i];
      for (let j = 0; j < innerArray.length; j++) {
         if(innerArray[j]['status']==='finished'){
          downloadArray.push(innerArray[j]);
       }
    
      }
    }
    if(downloadArray.length===0) {
      this.appUtilityConfig.presentToast("No records available to download")
      return;
    }
    if (downloadArray.length === 1) {
      this.downloadSingleFile(indexVal,downloadArray[0]);
      return;
    } else {
      
      this.displayLoadingIndicator = true
      const requestInput = this.downloadMultiFileRequstBuilder(downloadArray, indexVal)
      const inputParamsData = requestInput['inputparams']
      const recordIdFolder = JSON.stringify(inputParamsData['recordId']);
      const objectIdStr = JSON.stringify(inputParamsData['objectId']);
      const configIdStr = JSON.stringify(inputParamsData['configId']);
      let blobData;
      this.downloadWebserviceCall(requestInput).then((response) => {
        try {
          const decodedString = String.fromCharCode.apply(null, new Uint8Array(response));
          const obj = JSON.parse(decodedString);
          if (obj['message'] === "Invalid sessiontoken" || obj['message'] === "Session expired") {
            if (this.appUtilityConfig.isMobile) {
              this.broadcaster.fireNativeEvent('ionicNativeBroadcast', { action: 'Logout' });
            } else {
              window.location.replace('/apps/applist?metaFailureAction=Logout');
            }
          }
          console.log("Document upload Failed", obj.message);
          this.appUtilityConfig.presentToast(obj.message);
          this.displayLoadingIndicator = false
            return;
        } catch (error) {
          blobData = new Blob([response], { type: 'application/octet-stream' });
          if (!this.appUtilityConfig.isMobile) {
            saveAs(blobData, zipFolderName);
            this.displayLoadingIndicator = false
            return;
          }
          const writeDirectory = this.file.dataDirectory;
          this.file.writeFile(writeDirectory, zipFolderName, blobData, { replace: true }).then(() => {
            this.zip.unzip(writeDirectory + zipFolderName, writeDirectory + unzipFolderName)
              .then((result) => {
                if (result === 0) {
                  console.log('SUCCESS');
                  this.file.removeFile(writeDirectory, zipFolderName);
                  this.file.listDir(writeDirectory, unzipFolderName).then(data => {
                    data.forEach(element => {
                      this.checkAndCreateDirectory(writeDirectory, folderName).then(res1 => {
                        this.checkAndCreateDirectory(writeDirectory + folderName + '/', objectIdStr).then(res2 => {
                          this.checkAndCreateDirectory(writeDirectory + folderName + '/' + objectIdStr + '/', configIdStr).then(res3 => {
                            this.checkAndCreateDirectory(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr + '/',
                              recordIdFolder).then(res4 => {
                                this.loading.dismiss();
                                this.file.checkDir(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr + '/'
                                  + recordIdFolder + '/', element.name).then(chkfile => {
                                    this.file.removeRecursively(writeDirectory + folderName + '/' + objectIdStr + '/' + configIdStr
                                      + '/' + recordIdFolder + '/', element.name).then(removeFile => {
                                        console.log('remove under process');
                                        this.moveDirectoryCatchBlock(writeDirectory, unzipFolderName, element, folderName, objectIdStr, configIdStr, recordIdFolder);
                                      }).catch(() => {
                                        this.moveDirectoryCatchBlock(writeDirectory, unzipFolderName, element, folderName, objectIdStr, configIdStr, recordIdFolder);
                                      })
                                  }).catch(() => {
                                    this.moveDirectoryCatchBlock(writeDirectory, unzipFolderName, element, folderName, objectIdStr, configIdStr, recordIdFolder);
                                  })
                              })
                          })
                        })
                      })
                    });
                  });
                }
                if (result === -1) {
                  console.log('FAILED');
                  this.appUtilityConfig.presentToast('Download Failed');
                  this.displayLoadingIndicator = false
                }
              });
          })
        }
      }).catch(error => {
        this.errorBlock(error);
      });
    }
  }

  moveDirectoryCatchBlock(writeDirectory, unzipFolderName, element, folderName, objectIdStr, configIdStr, recordIdFolder) {
    this.file.moveDir(writeDirectory + unzipFolderName, element.name, writeDirectory + folderName + '/' +
      objectIdStr + '/' + configIdStr + '/' + recordIdFolder, element.name).then((moveRes) => {
        console.log('move sucess');
      })
  }

   checkAndCreateDirectory(pathStr, newDirectory) {
    console.log('pathStr', pathStr, newDirectory)
    return this.file.checkDir(pathStr, newDirectory).then(responseCheck => {
      return Promise.resolve(true);
    }).catch(errorCreate => {
      return this.file.createDir(pathStr, newDirectory, false).then(responseCreate => {
        return Promise.resolve(true);
      }).catch(error => {
        return Promise.resolve(false);
      })
    })
  }

  showAttachmentDownloadedFile(indexVal) {
    if (this.isMultiselect === true) {
      return;
    }
    const downloadObj = this.filteredResultList[indexVal];
    const folderName = 'Attachment';
    const objectId = JSON.stringify(this.attachmentInfoDict[0]['objectId']);
    const configId = JSON.stringify(this.attachmentInfoDict[0]['objAttachmentConfigId']);
    const fileIdStr = 'pfm_' + objectId + '_id';
    const fileId = JSON.stringify(downloadObj[fileIdStr]);
    const fileName = downloadObj["file_name"] + '.' + downloadObj["file_extension"]
    const writeDirectory = this.file.dataDirectory;
    const pathStr = writeDirectory + folderName + '/' + objectId + '/' + configId + '/' + fileId + '/';
    console.log('str path', pathStr);
    if (this.appUtilityConfig.isMobile) {
      this.file.checkFile(pathStr, fileName).then(responseCheck => {
        const fileExtn = fileName.split('.').reverse()[0];
        const fileMIMEType = this.getMIMEtype(fileExtn);
        this.fileOpener.open(pathStr + fileName, fileMIMEType)
          .then(() => console.log('File is opened'))
          .catch(e => {
            if (this.appUtilityConfig.isMobileResolution) {
              alert('file is not in correct format');
            } else if (!this.appUtilityConfig.isMobileResolution) {
              this.appUtilityConfig.showAlert(this,'file is not in correct format');
            }
          });
      }).catch(async () => {
        this.showDownloadAlert(indexVal);
      })
    } else {
      this.showDownloadAlert(indexVal);
    }
  }
  async showDownloadAlert(indexVal) {
    if (this.appUtilityConfig.isMobileResolution) {
      const alert = await this.alertCtrl.create({
        header: '',
        subHeader: '',
        message: 'Do you need to download this file?',
        buttons: [{
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Ok');
            this.downloadSingleFile(indexVal);
          }
        }]
      });
      alert.present();
    } else if (!this.appUtilityConfig.isMobileResolution) {
      const dialogConfig = new MatDialogConfig()

      dialogConfig.data = {
        title: 'Do you need to download this file?',
        buttonInfo: [
          {
            "name": "No",
            "handler": () => {
              console.log('Confirm Cancel');
            }
          },
          {
            "name": "Yes",
            "handler": () => {
              console.log('Confirm Ok');
              this.downloadSingleFile(indexVal);
            }
          }
        ],
        parentContext: this,
        type: "Alert"
      };
      dialogConfig.autoFocus = false

      this.dialog.open(cspfmAlertDialog, dialogConfig);
    }
  }
  getMIMEtype(extn) {
    const ext = extn.toLowerCase();
    const MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
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
  showDocumentDownloadedFile(indexrow, indexFordata, indexItem) {
    const folderName = 'Document';
    const objectIdVal = JSON.stringify(this.documentDataArray[indexrow]['objectId']);
    const configIdVal = JSON.stringify(this.documentDataArray[indexrow]["objDocumentConfigId"]);
    const fileIdStr = 'pfm_' + objectIdVal + '_id';
    const viewArray = this.groupedResultList[configIdVal];
    const downloadObject = viewArray[indexFordata];
    const downloadObj = downloadObject[indexItem];
    const fileId = downloadObj[fileIdStr];
    const fileNameFolder = downloadObj["file_name"];
    const fileCount = indexItem + 1;
    let fileName = '';
    if (downloadObject.length === 1 && viewArray.length === 1) {
      fileName = downloadObj["file_name"] + '.' + downloadObj["file_extension"]
    } else {
      fileName = downloadObj["file_name"] + '_' + fileCount + '.' + downloadObj["file_extension"]
    }
    const writeDirectory = this.file.dataDirectory;
    const pathStr = writeDirectory + folderName + '/' + objectIdVal + '/' + configIdVal + '/' + fileId + '/' + fileNameFolder + '/';
    console.log('str path', pathStr, fileName);
    if (this.appUtilityConfig.isMobile) {
      this.file.checkFile(pathStr, fileName).then(responseCheck => {        
        
        const fileExtn = fileName.split('.').reverse()[0];
        const fileMIMEType = this.getMIMEtype(fileExtn);
        this.fileOpener.open(pathStr + fileName, fileMIMEType)
          .then(() => console.log('File is opened'))
          .catch(e => alert('file is not in correct format'));
      }).catch(async () => {
        this.showAlertDownloadClickAction(indexrow);
      })
    } else {
      this.showAlertDownloadClickAction(indexrow);
    }


  }
  async showAlertDownloadClickAction(indexrow) {
    if (this.appUtilityConfig.isMobileResolution) {
      const alert = await this.alertCtrl.create({
        header: '',
        subHeader: '',
        message: 'Do you need to download this file?',
        buttons: [{
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Ok');
            this.multiselectDocumentClickAction(indexrow);
          }
        }]
      });
      await alert.present();
    } else if (!this.appUtilityConfig.isMobileResolution) {
      const dialogConfig = new MatDialogConfig()

      dialogConfig.data = {
        title: 'Do you need to download this file?',
        buttonInfo: [
          {
            "name": "No",
            "handler": () => {
              console.log('Confirm Cancel');
            }
          },
          {
            "name": "Yes",
            "handler": () => {
              console.log('Confirm Ok');
              this.multiselectDocumentClickAction(indexrow);
            }
          }
        ],
        parentContext: this,
        type: "Alert"
      };
      dialogConfig.autoFocus = false

      this.dialog.open(cspfmAlertDialog, dialogConfig);
    }
  }
  // Method to present toast  
  retryButtonPressed() {
    if (this.selectedSegment === "Attachment") {
      this.fetchAllData(this.selectedObj['attachmentType'], true)
    }
  }

  // Navigation button click options
  selectOptionButtonAction() {
    this.multiselectcancelPressed();
    this.isSelectOption = !this.isSelectOption;
    this.isFilterOption = false;
  }
  filterButtonAction() {
    console.log('filterAction');
    this.isSelectOption = false;
    if (this.isFilterOption) {
      this.isFilterOption = false;
    } else {
      this.isFilterOption = true;
    }
  }

  // document or attachement select events
  documentSelected() {
    this.isFilterOption = false;
    this.isSelectOption = false;
    this.isMultiselect = false;
    this.onCancel();
    this.selectedFrequencyVal = -1;
    this.selectedDocTypeVal = -1;
    console.log('document selected');
    this.selectedSegment = "Document";
    this.documentDataArray = this.selectedObj['documentInfo'];
    this.filteredDocObjectArray = this.selectedObj['documentInfo'];
    this.frequencyArray = lodash.uniq(lodash.map(this.filteredDocObjectArray, 'frequency'))
    this.filteredResultList = [];
    this.searchTerm = ""
    this.clearInterval()
    this.fetchAllData(this.selectedObj['documentType'], true);
    document.getElementsByClassName("mat-tab-body")[0].classList.add("cs-custom-scroll");
  }
  attachementSelected() {


    this.isFilterApplied = false;
    this.isFilterOption = false;
    this.isSelectOption = false;
    this.onCancel()
    this.selectedFrequencyVal = -1;
    this.selectedDocTypeVal = -1;
    console.log('attachement selected');
    this.selectedSegment = "Attachment"
    this.attachmentInfoDict = this.selectedObj['attachmentInfo'];
     this.attachmentExtnArray = [];
        const attachmentInfoDataDict = this.attachmentInfoDict[0]['fileExtension'];
      for (let j = 0; j < attachmentInfoDataDict.length; j++) {
        this.attachmentExtnArray.push(attachmentInfoDataDict[j]['type'].toLowerCase());
      }
    this.filteredResultList = [];
    this.searchTerm = ""
    this.fetchAllData(this.selectedObj['attachmentType'], true);
    document.getElementsByClassName("mat-tab-body")[0].classList.add("cs-custom-scroll");
  }

  // Method to filter searched Items
  getSearchedItems(searchText) {
    this.isSelectOption = false;
    this.isFilterOption = false;
    this.searchTerm = searchText
    this.allDeSelectAction();
    if (this.selectedSegment === 'Attachment') {
      const params = ["file_name", "file_extension"]; // define the data which need to be filter aganist the text
      this.filteredResultList = this.resultList.filter((item) => {
        for (const param of params) {
          if (item[param] && item[param].toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
           
            return true;
          }
        }  

        return false;
      });
    } else {
      const params = ['documentName', 'fileSaveAs'];
      const documentObj = this.filteredDocObjectArray;
      this.documentDataArray = documentObj.filter((item) => {
        for (const param of params) {
          if (item[param] && item[param].toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
            return true;
          }
        }
        return false;
      });
    }
  }

  // cancel search action
  multiselectAction() {
    this.isSelectOption = false;
    this.isMultiselect = true;
  }
  multiselectcancelPressed() {
    this.isMultiselect = false;
    this.filteredResultList.forEach(element => {
      element['isSelected'] = false;
    });
  }
  onCancel() {
    this.searchText = '';
    console.log('onCancel');
  }
  // fab button action

  multiselectdeleteAction() {
    console.log('multiselectdeleteAction')
  }
  allSelectAction() {
    console.log('allSelectAction');
    this.filteredResultList.forEach(element => {
      element['isSelected'] = true;
    });
    this.selectFlag = false;
  }
  allDeSelectAction() {
    console.log('allDeSelectAction')
    this.filteredResultList.forEach(element => {
      element['isSelected'] = false;
    });
    this.selectFlag = true;
  }
  cancelAction() {
    this.isMultiselect = false;
  }
  // radio button actions for select and non-select
  multiSelectRadioButton(indexVal) {
    const selectedObject = this.filteredResultList[indexVal];
    if (selectedObject['isSelected'] === true) {
      selectedObject['isSelected'] = false;
    } else {
      selectedObject['isSelected'] = true;
    }
    this.filteredResultList[indexVal] = selectedObject;
    this.applicationRef.tick()
  }

  // Navigation button select action for attachement
  attachementSelectOption(selectedObject) {
    if(selectedObject && !selectedObject['isRecordAvailable']){
     
         this.appUtilityConfig.presentToast("Records not available for this object.So you can't able to access file manage")
         return
    }
    this.prominentFieldDetails=selectedObject['prominentFieldDetails']
    this.unSubscribeChangeListener(this.selectedObj['attachmentType'], this.selectedObj['documentType'])
    this.isSelectOption = false;
    this.selectedObj = selectedObject;
    this.registerRecordChangeListener(this.selectedObj['attachmentType'], this.selectedObj['documentType'])
    this.parentType = this.selectedObj['parentType'];
    this.parentId = this.selectedObj['parentId'];
    this.selectedObjDisplayName = this.selectedObj['parentDisplayName'];
    this.fetchSelectedObject()
    this.isFilterApplied = false
    this.isFilterOption = false;
    this.selectedDocTypeVal = -1;
    if( (this.selectedSegment === "Document" && this.selectedObj['isAttachmentShow'] && this.selectedObj['isDocumentShow'])
    || (this.selectedSegment === "Document" &&  this.selectedObj['isDocumentShow'] && !this.selectedObj['isAttachmentShow']) ||  
    (this.selectedSegment === "Attachment" && this.selectedObj['isDocumentShow'] && !this.selectedObj['isAttachmentShow'])){
     this.selectedSegment = "Document"
     this.searchFieldDisplayName = 'Search Document Name';
   }else if( (this.selectedSegment === "Attachment" &&  this.selectedObj['isAttachmentShow']&& this.selectedObj['isDocumentShow']) ||
   (this.selectedSegment === "Attachment" &&  this.selectedObj['isAttachmentShow'] && !this.selectedObj['isDocumentShow']) ||
   (this.selectedSegment === "Document" && !this.selectedObj['isDocumentShow'] && this.selectedObj['isAttachmentShow'])){
     this.selectedSegment = "Attachment"
     this.searchFieldDisplayName = 'Search File Name,File Extension';
   }
 
      
      this.clearInterval()
    if (this.selectedObj['isAttachmentShow'] && this.selectedSegment==='Attachment') {
      this.searchFieldDisplayName = 'Search File Name,File Extension';
      this.attachmentInfoDict = this.selectedObj['attachmentInfo'];
      this.selectedSegment = "Attachment"
      this.attachmentExtnArray = [];
     const attachmentInfoDataDict = this.attachmentInfoDict[0]['fileExtension'];
     for (let j = 0; j < attachmentInfoDataDict.length; j++) {
       this.attachmentExtnArray.push(attachmentInfoDataDict[j]['type'].toLowerCase());
     }
      this.fetchAllData(this.selectedObj['attachmentType'], true);
      return
    }
    if (this.selectedObj['isDocumentShow']  && this.selectedSegment==='Document') {
      this.searchFieldDisplayName = 'Search Document Name';
      this.documentDataArray = this.selectedObj['documentInfo'];
      this.filteredDocObjectArray = this.selectedObj['documentInfo'];
      this.selectedSegment = "Document"
      this.fetchAllData(this.selectedObj['documentType'], true);
      return
    }
  }

  frequencyCloseButton() {
    this.isFilterOption = false;
  }
  // Navigation button select action for document
  selectedFrequency(indexVal) {
    this.onCancel()
    this.documentDataArray = [];
    if (this.selectedFrequencyVal === indexVal) {
      if (!this.isMultipleDocSelected) {
        this.isFilterApplied = false;
      }
      this.isSelectedFrequency= false;
      this.selectedFrequencyVal = -1;
      if (this.selectedDocTypeVal === -1) {
        this.documentDataArray = this.selectedObj['documentInfo'];
      } else {
        const tempArrayToFilter = this.selectedObj['documentInfo'];
        const item = this.documentTypeArray[this.selectedDocTypeVal];
        const tempFilterArray = [];
        if (item === 'Multiple') {
          tempArrayToFilter.forEach(element => {
            if (element['canUploadMultipleFile'] === 'Y') {
              tempFilterArray.push(element)
            }
          });
        } else {
          tempArrayToFilter.forEach(elements => {
            if (elements['canUploadMultipleFile'] === 'N') {
              tempFilterArray.push(elements)
            }
          });
        }
        this.documentDataArray = tempFilterArray;
      }
    } else {
      this.selectedFrequencyVal = indexVal;
      this.isSelectedFrequency = true;
      this.isFilterApplied = true;
      let firstArrayToFilter = [];
      if (this.selectedDocTypeVal === -1) {
        firstArrayToFilter = this.selectedObj['documentInfo'];
      } else {
        const arrayToFilter = this.selectedObj['documentInfo'];
        const item1 = this.documentTypeArray[this.selectedDocTypeVal];
        if (item1 === 'Multiple') {
          arrayToFilter.forEach(element => {
            if (element['canUploadMultipleFile'] === 'Y') {
              firstArrayToFilter.push(element)
            }
          });
        } else {
          arrayToFilter.forEach(elements => {
            if (elements['canUploadMultipleFile'] === 'N') {
              firstArrayToFilter.push(elements)
            }
          });
        }
      }
      const item = this.frequencyArray[indexVal];
      const tempFilterArray = [];
      firstArrayToFilter.forEach(element => {
        if (element['frequency'] === item) {
          tempFilterArray.push(element)
        }
      });
      this.documentDataArray = tempFilterArray;
    }
  }
  multipleDocSelect(indexVal) {
    this.onCancel()
    this.documentDataArray = [];
    if (this.selectedDocTypeVal === indexVal) {
      if (!this.isSelectedFrequency) {
        this.isFilterApplied = false;
      }
      this.isMultipleDocSelected = false;
      this.selectedDocTypeVal = -1;
      if (this.selectedFrequencyVal === -1) {
        this.documentDataArray = this.selectedObj['documentInfo'];
      } else {
        const tempArrayToFilter = this.selectedObj['documentInfo'];
        const item = this.frequencyArray[this.selectedFrequencyVal];
        const tempFilterArray = [];
        tempArrayToFilter.forEach(elements => {
          if (elements['frequency'] === item) {
            tempFilterArray.push(elements)
          }
        });
        this.documentDataArray = tempFilterArray;
      }
    } else {
      this.selectedDocTypeVal = indexVal;
      this.isFilterApplied = true;
      this.isMultipleDocSelected = true;
      let firstArrayToFilter: any = [];
      if (this.selectedFrequencyVal === -1) {
        firstArrayToFilter = this.selectedObj['documentInfo'];
      } else {
        const tempArrayToFilter = this.selectedObj['documentInfo'];
        const itemtext = this.frequencyArray[this.selectedFrequencyVal];
        const tempFilterArray = [];
        tempArrayToFilter.forEach(element => {
          if (element['frequency'] === itemtext) {
            tempFilterArray.push(element)
          }
        });
        firstArrayToFilter = tempFilterArray;
      }
      const item = this.documentTypeArray[indexVal];
      const tempArrayTobeFilter = [];
      if (item === 'Multiple') {
        firstArrayToFilter.forEach(element => {
          if (element['canUploadMultipleFile'] === 'Y') {
            tempArrayTobeFilter.push(element)
          }
        });
      } else {
        firstArrayToFilter.forEach(elements => {
          if (elements['canUploadMultipleFile'] === 'N') {
            tempArrayTobeFilter.push(elements)
          }
        });
      }
      this.documentDataArray = tempArrayTobeFilter;
    }
  }

  nextButtonPressed(selectedSlides: IonSlides, event, item?, object?, carouselRef?) {
    if (this.appUtilityConfig.isMobileResolution) {
      event.stopPropagation();
      selectedSlides.slideNext();
    } else if (!this.appUtilityConfig.isMobileResolution) {
      if (object.indexOf(item) + 1 !== object.length) {
        carouselRef.next();
      }
    }
  }
  prevButtonPressed(selectedSlides: IonSlides, event, item?, object?, carouselRef?) {
    if (this.appUtilityConfig.isMobileResolution) {
      event.stopPropagation();
      selectedSlides.slidePrev();
    } else if (!this.appUtilityConfig.isMobileResolution) {
      if (object.indexOf(item) + 1 !== 1) {
        carouselRef.prev();
      }
    }
  }
  slideChanged() {
    console.log('slideChanged');
  }

  imageSelected(fileEvent) {
    const imageFiles = fileEvent.target.files[0];
    fileEvent.target.value = ''
    let selectImageUrl;
    if (imageFiles) {
      this.fileToWrite = imageFiles;
      this.selectedFileName = this.fileToWrite.name;      
      this.fileNameStr = this.selectedFileName.split('.').slice(0, -1).join('.');
      this.selectedFileType = this.selectedFileName.split('.').pop();
      this.selectedFileSize = this.bytesToSize(this.fileToWrite.size);
      const fileSizeArray = this.selectedFileSize.split(' ');
      const filesizeValCalculation = parseFloat(fileSizeArray[0].toString());
      this.filesizeVal = Math.floor(this.fileToWrite.size / 1024);
      const filesizeExtn = fileSizeArray[1].toString();
      this.selectedFileUploadDate = this.fileToWrite['lastModifiedDate'];
      this.disableUploadButton = false;
      

      let filesizeValConfigSize = 0
      let filesizeValConfigMesaurment = "kb"
      if(this.selectedObj['attachmentInfo'][0]['fileSize']>=1024 && this.selectedObj['attachmentInfo'][0]['fileSizeMeasurement'].toLowerCase()==='kb'){
        filesizeValConfigSize  =  parseFloat((this.selectedObj['attachmentInfo'][0]['fileSize']/1024).toFixed(2))
        filesizeValConfigMesaurment = "mb"
      }else if(this.selectedObj['attachmentInfo'][0]['fileSizeMeasurement'].toLowerCase()==='mb'){
      filesizeValConfigSize  = this.selectedObj['attachmentInfo'][0]['fileSize']
        filesizeValConfigMesaurment = "mb"
      }
      if (this.selectedFileName.length > 50) {
        this.selectedFileName = "";
        this.disableUploadButton = true;
        this.myInput.nativeElement.value = "";
        if (this.appUtilityConfig.isMobileResolution) {
          alert('file name length should be less than 50');
        } else if (!this.appUtilityConfig.isMobileResolution) {
          this.appUtilityConfig.showAlert(this,'file name length should be less than 50');
        }
        return;
      }

      if (filesizeExtn === 'GB' || filesizeExtn === 'TB' || 
      (filesizeValConfigSize===0 && filesizeValConfigMesaurment.toLocaleLowerCase()===filesizeExtn.toLocaleLowerCase() && filesizeValCalculation>this.selectedObj['attachmentInfo'][0]['fileSize']) || 
      (filesizeValConfigSize===0 && filesizeValConfigMesaurment.toLocaleLowerCase()==='kb' && filesizeExtn.toLocaleLowerCase()==='mb') || 
      (filesizeValConfigMesaurment.toLocaleLowerCase()===filesizeExtn.toLocaleLowerCase() && filesizeValConfigSize>0 && filesizeValCalculation > filesizeValConfigSize) ) {
        this.selectedFileName = "";
        this.disableUploadButton = true
        this.myInput.nativeElement.value = "";
        if (this.appUtilityConfig.isMobileResolution) {
          
          alert('file size should be less than '+this.selectedObj['attachmentInfo'][0]['fileSizeMeasurement']+''+this.selectedObj['attachmentInfo'][0]['fileSize']);
        } else if (!this.appUtilityConfig.isMobileResolution) {
         
          if(this.selectedObj['attachmentInfo'][0]['fileSize']>=1024 && this.selectedObj['attachmentInfo'][0]['fileSizeMeasurement'].toLowerCase()==='kb'){
            var docSize = (this.selectedObj['attachmentInfo'][0]['fileSize']/1024).toFixed(1)
            this.appUtilityConfig.showAlert(this,'file size should be less than '+ docSize+" MB");
          }else{
            this.appUtilityConfig.showAlert(this,'file size should be less than '+this.selectedObj['attachmentInfo'][0]['fileSize']+''+this.selectedObj['attachmentInfo'][0]['fileSizeMeasurement']);
        }
      }
        return;
      }
     
      if  (this.attachmentExtnArray.toString().toLowerCase().indexOf(this.selectedFileType.toLowerCase()) === -1) {
        this.selectedFileName = "";
        this.disableUploadButton = true;
        if (this.appUtilityConfig.isMobileResolution) {
          alert('file format not support for this upload');
        } else if (!this.appUtilityConfig.isMobileResolution) {
          this.appUtilityConfig.showAlert(this,'file format not support for this upload');
        }
        return;
      }
        const reader = new FileReader();
        reader.onload = (event: any) => {
          selectImageUrl = event.target.result;
          const ValidationExtenstionSet = [...FileType.extensions]
          if (ValidationExtenstionSet.includes(this.selectedFileType.toLowerCase())) {
            FileType.fromBuffer(selectImageUrl).then(res => {
              if (res?.ext === this.selectedFileType.toLowerCase()) {
                if (this.appUtilityConfig.isMobile) {
                  this.file.writeFile(this.file.dataDirectory, this.fileToWrite.name, selectImageUrl, { replace: true }).then((res) => {
                  }).catch(error => {
                    console.log('error msg', error);
                  });
                } else {
                  selectImageUrl = "";
                }
              } else {
                this.selectedFileName = "";
                this.disableUploadButton = true;
                this.appUtilityConfig.showAlert(this, `The uploaded file-'${this.selectedFileName}' is not of type '${this.selectedFileType.toLowerCase()}'`);
                return;
              }
            }).catch(err => {
              console.log('Invalid fileType', err)
              return;
            })
          }else {
            if (this.appUtilityConfig.isMobile) {
              this.file.writeFile(this.file.dataDirectory, this.fileToWrite.name, selectImageUrl, { replace: true }).then((res) => {
              }).catch(error => {
                console.log('error msg', error);
              });
            }else {
              selectImageUrl = "";
            }
          }
        }
        reader.onabort = (err: any) => {
          console.log('onabort', err);
        };
        reader.onloadend = () => { 
          console.log('DONE', reader.readyState);
         }
        reader.readAsArrayBuffer(this.fileToWrite);
      }
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
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }

  uploadButtonPressed(oldRecord?) {
    if (!navigator.onLine) {
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
    this.displayLoadingIndicator = true;
      this.checkRecordAlreadySaved().then(alreadyUploaded=>{

          if(oldRecord){
            this.uploadSaveAndServiceCall(oldRecord)
          }else if(!alreadyUploaded && this.selectedAttachmentFile !== undefined && Object.keys(this.selectedAttachmentFile).length ===0 && !oldRecord){
              this.uploadSaveAndServiceCall()
          }else if(alreadyUploaded && this.selectedAttachmentFile !== undefined && this.selectedAttachmentFile !== null &&Object.keys(this.selectedAttachmentFile).length > 0){
                 if(alreadyUploaded['records'] && alreadyUploaded['records'][0]['file_name']===this.selectedAttachmentFile['file_name']){
                     this.uploadSaveAndServiceCall()
                    }else if(alreadyUploaded['records'] && alreadyUploaded['records'][0]['file_name']!==this.selectedAttachmentFile['file_name']){
                      this.displayLoadingIndicator = false;
                      this.appUtilityConfig.presentToast("This file already uploaded.You can't override it in other file");
                     return;
     
                    } 
                   }else if(alreadyUploaded===false && this.selectedAttachmentFile !== undefined && this.selectedAttachmentFile !== null &&Object.keys(this.selectedAttachmentFile).length > 0 ){
            this.displayLoadingIndicator = false;     
            this.showAlertForExisitingFileOverrideOption()
                
                }else{
            this.displayLoadingIndicator = false;
            this.appUtilityConfig.presentToast("This file already uploaded.For update use override option");
            return;
          }
               
       
            
               
        }).catch(err=>{
            this.displayLoadingIndicator = false;
          })
  
    

}

//To save the uplaoded file and call builder web service  
  uploadSaveAndServiceCall(oldRecord?){
    if (this.selectedAttachmentFile !== undefined && Object.keys(this.selectedAttachmentFile).length > 0
    && this.selectedAttachmentFile !== null) {
     oldRecord = this.selectedAttachmentFile
   }
   this.allDeSelectAction();
   this.disableUploadButton = true;
   const pfmObj_str = 'pfm_' + this.attachmentInfoDict[0]['objectId'] + '_id';
   const pfmObj_str1 = 'pfm' + this.attachmentInfoDict[0]['objectId'];

   const tableStructure = this.attachmentDbConfig.configuration.tableStructure
   const selectedObj = this.selectedObj['attachmentType'];
   const saveObject = JSON.parse(JSON.stringify(tableStructure[selectedObj]));
   saveObject[pfmObj_str] = this.selectedObj['recordId'];
   saveObject.obj_attachment_config_id = this.attachmentInfoDict[0]['objAttachmentConfigId'];
   saveObject.file_name = this.fileNameStr;
   saveObject.display_name = this.selectedFileName;
   saveObject.file_size = this.filesizeVal; 
   saveObject.file_extension = this.selectedFileType;
   saveObject[pfmObj_str1] = this.selectedObj['parentId'];
   saveObject.type = this.selectedObj['attachmentType'];
   saveObject.status = 'initiated';
   saveObject.isRemoved = false;

   

   const tempSaveRecord = {
     "file_path": this.file.dataDirectory,
     "file_size": this.selectedFileSize,
     "file_name": this.selectedFileName,
     "file_type": this.selectedFileType,
     "status": 'initiated',
     "isRemoved": false,
     "recordId": this.selectedObj['recordId'],
     "objectId": this.attachmentInfoDict[0]['objectId'],
     "configId": this.attachmentInfoDict[0]['objAttachmentConfigId'],
     'pouchSaveObject': saveObject,
     'pouchServiceObj': this.selectedObj['serviceObjectAttachment'],
     'pouchParentType': this.selectedObj['parentType'] + 'att',
     'fileSaveAs': this.attachmentInfoDict[0]['fileSaveAs']

   }
   if (oldRecord !== undefined && Object.keys(oldRecord).length > 0 && oldRecord !== null) {
     oldRecord.file_name = this.fileNameStr;
     oldRecord.display_name = this.selectedFileName;
     oldRecord.file_size = this.filesizeVal; 
     oldRecord.file_extension = this.selectedFileType;
     oldRecord.status = 'initiated';
     tempSaveRecord['pouchSaveObject'] = oldRecord;
   }
   if (this.appUtilityConfig.isMobile) {
     this.cspfmAttachementUploadDbObj.saveAttachmentInfo(tempSaveRecord);
     this.displayLoadingIndicator = false;
   } else {
     this.cspfmAttachementUploadDbObj.saveAttachmentInfoWithContentForWeb(tempSaveRecord,
       this.fileToWrite, appConstant.fileType.attachment).then(res => {
         this.selectedAttachmentFile = {}
         this.displayLoadingIndicator = false;
         this.appUtilityConfig.presentToast(res["message"])
       })
   }

 

   this.selectedFileName = "";
   if (saveObject.file_name) {
     setTimeout(() => {
       this.fetchAllData(this.selectedObj['attachmentType'], true);
     }, 10000);
   }
  }

  selectedAttachmentFileClearAction(){
    this.disableUploadButton = true;
    this.selectedAttachmentFile = {}
    this.selectedFileName = ""
  }

  onTabClick(event) {
    if (event.tab.textLabel === "Attachment") {
      this.searchFieldDisplayName = 'Search File Name,File Extension';
      this.attachementSelected();
    } else if (event.tab.textLabel === "Document") {
      this.searchFieldDisplayName = 'Search Document Name';
      this.documentSelected();
    }
  }

  

  getCoreUserName(data) {
    const taskList = [];
    data.forEach(dataObject => {
      taskList.push(this.getUserNameAgainstUserId(dataObject).then((res) => {
        if (res['status'] === 'SUCCESS' && res["records"].length > 0) {          
          
          const coreUserObject = res["records"][0]
          dataObject["username"] = coreUserObject["username"]
        }
      }))
    });
    Promise.all(taskList).then(res => {
      if (this.selectedSegment === "Attachment") {
        const sortData = lodash.orderBy(data, ['createdon', 'display_name'], ['desc', 'asc']);

        if (this.searchTerm!=='') {
          const params = ["file_name", "file_extension"]; // define the data which need to be filter aganist the text
          this.filteredResultList = sortData.filter((item) => {
            for (const param of params) {
              if (item[param] && item[param].toString().toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {                

                return true;
              }
            }
            return false;
          });
        }else{
         this.filteredResultList = sortData;
        }

      
      } else {
        this.groupRecordsBasedOnName(data);
      }
      this.applicationRef.tick()
    })
  }

  getUserNameAgainstUserId(userObject) {
    if (navigator.onLine) {
      const query = "type: " + this.metaDbconfig.corUsersObject + " AND " + "user_id: " + userObject['lastmodifiedby']
      return this.cspfmMetaCouchDbProvider.fetchRecordsBySearchFilterPhrases(query,
        this.corUsersObjectHierarchyJSON).then(corUserResult => {
          return Promise.resolve(corUserResult);
        })
    } else {
      const options = {};
      const selector = {};
      selector['data.type'] = this.metaDbconfig.corUsersObject;
      selector['data.user_id'] = userObject['lastmodifiedby'];
      options['selector'] = selector;
      this.corUsersObjectHierarchyJSON['options'] = options;
      return this.metaDataDbProvider.fetchDataWithReference(this.corUsersObjectHierarchyJSON).then(result => {
        return Promise.resolve(result);
      });
    }
  }

  retryAttachmentUploadAction(index, message) {
    const retryFileObject = this.filteredResultList[index]
    const fileName = retryFileObject["file_name"] + "." + retryFileObject["file_extension"]
  
    let selectedFileName = "";
    var displayMessage = "Are you want to replace upload ?"
    if (this.fileToWrite) {
      selectedFileName = this.fileToWrite.name
    }
  if(this.selectedObj["attachmentInfo"][0]['fileSaveAs'].toLowerCase()==='git' &&  message==='Override'){
      displayMessage = "Are you sure?As per your file selection,we are going to generate a new file version for this process"
  
      
    }
    if(( this.selectedObj["attachmentInfo"][0]['fileSaveAs'].toLowerCase()==='file' || 
    this.selectedObj["attachmentInfo"][0]['fileSaveAs'].toLowerCase()==='table') &&  message==='Override'){
      displayMessage = "Are you sure?As per your file selection,There is no file version for this process"

    }
    if (fileName === selectedFileName && message!=='Override') {
      const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        title: displayMessage,
        buttonInfo: [
          {
            "name": "OK"
          },
          {
            "name": "Retry",
            "handler": () => {
              console.log('Confirm Ok');
              this.uploadButtonPressed(retryFileObject)
            }
          }
        ],
        parentContext: this,
        type: "Alert"
      };
      dialogConfig.autoFocus = false
      this.dialog.open(cspfmAlertDialog, dialogConfig);
    } else {
      const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        title: displayMessage,
        buttonInfo: [
          {
            "name": "Cancel"
          },
          {
            "name": "Replace",
            "handler": () => {
              this.selectedAttachmentFile = retryFileObject;
              console.log('Confirm Ok');
              var input = document.getElementById('fileSelection');
              input.click();
            }
          }
        ],
        parentContext: this,
        type: "Alert"
      };
      dialogConfig.autoFocus = false
      this.dialog.open(cspfmAlertDialog, dialogConfig);
    }
  }
  cancelImageSelectionAction() {
    console.log("cancelImageSelectionAction");
    this.selectedAttachmentFile = {}
  }

  async retryDocumentAction(object, documentRecord, totalDocument,uploadType) {
    if (!navigator.onLine) {
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
    if (object) {
      const params = {
        "documentInfo": JSON.stringify(object),
        "redirectUrl": "/menu/attachmentlist",
        "selectedObj": JSON.stringify(this.selectedObj),
        "retryUpload": true,
        "documentRecord": JSON.stringify(documentRecord),
        "groupedResultList": this.groupedResultList,
        "totalDocument": totalDocument,
        "uploadType":uploadType
      }
      if (this.appUtilityConfig.isMobileResolution) {
        const documentUploadPopUpModel = await this.modalController.create({
          component: cspfmdocumentuploadconfiguration,
          componentProps: {
            parentPage: this,
            queryParams: params,
          },
          backdropDismiss: false
        });
        await documentUploadPopUpModel.present();
        documentUploadPopUpModel.onDidDismiss().then(() => {
          this.fetchAllData(this.selectedObj['documentType'], true)
        })
      } else if (!this.appUtilityConfig.isMobileResolution) {
        const dialogConfig = new MatDialogConfig()

        dialogConfig.data = {
          serviceObject: this.dataProvider.getDbServiceProvider(appConstant.couchDBStaticName),
          parentPage: this,
          dataSource: appConstant.couchDBStaticName,
          queryParams: params,
          objectName: 'placement',
        };
        dialogConfig.panelClass = 'cs-attachment-dialog'
        let dialogRef = this.dialog.open(cspfmdocumentuploadconfiguration, dialogConfig);
        dialogRef.afterClosed().subscribe(() => {
          this.fetchAllData(this.selectedObj['documentType'], true);
        });
      }
    }
  } 

  scheduleFetchMethod(){
    if (!this.intervalId){
            this.intervalId = setInterval(() => { 
                console.log("set intervalId called");
                  this.fetchAllData(this.selectedObj['attachmentType'], true)
                 }, 10000);
      }
    } 
    scheduleFetchMethodforDocument(){
      if (!this.intervalId){
            this.intervalId = setInterval(() => { 
                console.log("set intervalId called document");
                  this.fetchAllData(this.selectedObj['documentType'], true)
                 }, 10000);
      }
    } 
    clearInterval(){
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log("clear interval called");
    } 
  }
  
 //To show the confirmation alert while doc retry and override action
  ShowConfirmationAlertForDocOverrideAndRetryAction(object, documentRecord, totalDocument,uplaodType){
  let message = "Are you want to replace upload ?"
  if(uplaodType==="Override" && object&& (object['fileSaveAs'].toLowerCase()==='file' || object['fileSaveAs'].toLowerCase()==='table')){
     message= "Are you sure?As per your file selection,There is no file version for this process"
  }else if(uplaodType==="Override" && object&& object['fileSaveAs'].toLowerCase()==='git'){
    message = "Are you sure?As per your file selection,we are going to generate a new file version for this process"
  }
  const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        title: message,
        buttonInfo: [
          {
            "name": "Cancel"
          },
          {
            "name": "ok",
            "handler": () => {
                this.retryDocumentAction(object, documentRecord, totalDocument,uplaodType)
             
            }
          }
        ],
        parentContext: this,
        type: "Alert"
      };
      dialogConfig.autoFocus = false
      this.dialog.open(cspfmAlertDialog, dialogConfig);
}

//To check uploading file name already exits in db
checkRecordAlreadySaved(){
  const query = this.queryMakingBasedOnMethodCalled('checkRecordAlreadySaved');
  return this.dataProvider.fileManageDbSelection(query).then(res => {
    
      if(res && res['status']==='SUCCESS' && res['records'].length>0){
        return Promise.resolve(res);
      }else{
        return Promise.resolve(false);
      }
   
           
    }).catch(err=>{
        return Promise.resolve(false);
      })
  }
//this method show the confirmation alert to save as new file when replcaing the exiting file with neww file 
  showAlertForExisitingFileOverrideOption( ) {

      var displayMessage = "You can't override existing file as another file name.Are you want to save as new file ?"
   
          const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        title: displayMessage,
        buttonInfo: [
          {
            "name": "Cancel"
           
          },
          {
            "name": "Ok",
     
            "handler": () => {
              console.log('Confirm Ok');
              this.displayLoadingIndicator = true;
              this.selectedAttachmentFile = {}
              this.uploadSaveAndServiceCall()
            }
          }
        ],
        parentContext: this,
        type: "Alert"
      };
      dialogConfig.autoFocus = false
      this.dialog.open(cspfmAlertDialog, dialogConfig);
    }
    // Handle File Interrupted 
   // This event will publish only on session expire case.
    registerEventForInterruptCase(){
      
   this.observableListenerUtils.subscribe("uploadfailure", (modified) => {
    let serviceObject;
    if (this.selectedObj['serviceObjectAttachment'] === "PouchDB") {
      serviceObject = this.attachmentDbObject;
    } else {
      serviceObject = this.attachmentCouchDbObject;
    }
    if(modified['type'].includes("doc")){
      return
    }

    serviceObject.save(modified["type"], modified).then(updateResult => {
      
      this.selectedAttachmentFile = {}
      this.isLoading = false;
      this.displayLoadingIndicator = false;
      this.appUtilityConfig.presentToast("Upload has been interrupted")
   
    })
    
  
    
  })
    }
   
    onRemoveActionDoc(item){
      if (!navigator.onLine) {
        this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
        return;
      }
      const removeFileObject = item;
      var displayMessage = "Are you sure want to delete this file - "+ removeFileObject.display_name +" ?";
      const dialogConfig = new MatDialogConfig()
      dialogConfig.data = {
        title: displayMessage,
        buttonInfo: [
          {
            "name": "Cancel"
          },
          {
            "name": "Delete",
            "handler": () => {
              console.log('Confirm Ok');
              removeFileObject.isRemoved = true;
              this.cspfmAttachementUploadDbObj.removeAttchFile(this.selectedObj['parentType'] + 'doc', removeFileObject).then(result => {
                if (result["status"] === "SUCCESS") {
                this.refreshButtonClick();
                this.appUtilityConfig.presentToast("File deleted successfully")
                } else {
                  this.appUtilityConfig.presentToast("File delete Failed")
                }
              })
            }
          }
        ],
        parentContext: this,
        type: "Alert"
      };
      dialogConfig.autoFocus = false
      this.dialog.open(cspfmAlertDialog, dialogConfig);
       }
    
  onRemoveAction(index) {
    if (!navigator.onLine) {
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
    const removeFileObject = this.filteredResultList[index];
    var displayMessage = "Are you sure want to delete this file - "+ removeFileObject.display_name +" ?";
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      title: displayMessage,
      buttonInfo: [
        {
          "name": "Cancel"
        },
        {
          "name": "Delete",
          "handler": () => {
            console.log('Confirm Ok');
            removeFileObject.isRemoved = true;
            this.cspfmAttachementUploadDbObj.removeAttchFile(this.selectedObj['parentType'] + 'att', removeFileObject).then(result => {
              if (result["status"] === "SUCCESS") {
                this.refreshButtonClick();
                this.appUtilityConfig.presentToast("File deleted successfully")
              } else {
                this.appUtilityConfig.presentToast("File delete Failed")
              }
            })
          }
        }
      ],
      parentContext: this,
      type: "Alert"
    };
    dialogConfig.autoFocus = false
    this.dialog.open(cspfmAlertDialog, dialogConfig);    
  }
  queryMakingBasedOnMethodCalled(methodCalled, dataType?) {
    let options = {};
    if (this.selectedObj['serviceObjectDocument'] === 'PouchDB') {
      let selector = {
        '$or': [{ 'data.isRemoved': false }, { 'data.isRemoved': { '$exists': false } }],
      };
      options['dbProvider'] = appConstant.pouchDBStaticName;
      if (methodCalled === 'fetchAllData') {
        selector['data.type'] = dataType;
        selector['data.' + this.parentType] = this.parentId;
        options['selector'] = selector;
        return options
      } else {
        selector['data.type'] = this.selectedObj['attachmentType'];
        selector['data.file_name'] = this.fileNameStr;
        selector['data.obj_attachment_config_id'] = this.attachmentInfoDict[0]['objAttachmentConfigId'];
        selector['data.file_extension'] = this.selectedFileType;
        selector['data.' + this.selectedObj['parentType']] = this.selectedObj['parentId']
        return options
      }
    } else {
      options['queryFlags'] = { 'include_docs': true, 'include_fields': false }
      options['design_doc'] = 'filemanage_search';
      options["dbProvider"] = appConstant.couchDBStaticName;
      if (methodCalled === 'fetchAllData') {
        options['query'] = 'type:' + dataType + ' AND ' + this.parentType + ':' + this.parentId + ' AND ' + 'isRemoved:' + false;
        return options
      } else {
        const fileName = this.appUtilityConfig.makeRegexQuery(this.fileNameStr)
        options['query'] = 'type:' + this.selectedObj['attachmentType'] + ' AND ' + this.selectedObj['parentType'] + ':' + this.selectedObj['parentId'] + ' AND ' + 'isRemoved:' + false + ' AND ' + 'file_name:' + '_' + fileName + ' AND ' + 'attachment_config_id:' + this.attachmentInfoDict[0]['objAttachmentConfigId'] + ' AND ' + 'file_extension:' + this.selectedFileType;
        return options
      }
    }
  } 
}

