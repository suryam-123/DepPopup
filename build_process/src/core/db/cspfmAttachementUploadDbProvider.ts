import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { dbConfiguration } from './dbConfiguration';
import { appUtility } from '../utils/appUtility';
import { appConfiguration } from '../utils/appConfiguration';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { attachmentDbProvider } from 'src/core/db/attachmentDbProvider';
import { attachmentCouchDbProvider } from 'src/core/db/attachmentCouchDbProvider';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators'
import { stringify } from 'querystring';
import { appConstant } from '../utils/appConstant';
import { attachmentDbConfiguration } from './attachmentDbConfiguration';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { cspfmAlertDialog } from '../components/cspfmAlertDialog/cspfmAlertDialog';
import { HttpClient } from '@angular/common/http';
@Injectable()

export class cspfmAttachementUploadDbProvider {
  private isUploadProgress = false;
  private attachUploadDB;
  private dbChanges;
  private docToUpload;
  private pouchSaveDoc;
  private localNotifIdVal = 0;
  public isAlertFlag = false;
  loading;
  private failed = "FAILED"
  private success = 'SUCCESS';
  // private localNotifications: LocalNotifications
  constructor(public dbConfigurationObj: dbConfiguration,
    public appUtilityObj: appUtility, public appconfig: appConfiguration, public observableListenerUtils: cspfmObservableListenerUtils,
    public file: File, public attachmentDbProviderObj: attachmentDbProvider, public localNotifcation: LocalNotifications,
    public attachmentCouchDbProviderObj: attachmentCouchDbProvider, private httpClient:HttpClient,
    public attachmentDbConfig: attachmentDbConfiguration, public dialog: MatDialog) {
    if (this.appUtilityObj.isMobile) {
      this.initializeAttachUploadDB();
    }
  }

  initializeAttachUploadDB() {
    const attachmentdatabaseName = "attachment" + '_' + this.appUtilityObj.orgId + '_' + "upload";
    this.attachUploadDB = new PouchDB(attachmentdatabaseName + '.db', { adapter: 'cordova-sqlite', location: 'default' });
    this.startChangeListner();

  }

  public startChangeListner() {
    if (this.dbChanges === undefined) {
      this.dbChanges = this.attachUploadDB.changes({ live: true, since: 'now', include_docs: true, attachments: true })
        .on('change', this.onDatabaseChange);
    }
  }

  // Pouch Database change listener callback
  private onDatabaseChange = (change) => {
    if (this.isUploadProgress === false && change.doc.status === 'initiated') {
      this.docToUpload = change.doc;
      this.pouchSaveDoc = this.docToUpload.pouchSaveObject;
      // Deveopment
      const attachment = "att";
      const dataType = change['doc']['data']['type'];
      if (dataType.indexOf(attachment) !== -1) {
        this.fileManageDBSave(appConstant.fileType.document);
      } else {
        this.fileManageDBSave(appConstant.fileType.attachment);
      }
    }
  }
  saveAttachmentInfo(tempSaveRecord) {
    this.pouchSaveDoc = tempSaveRecord.pouchSaveObject;
    this.attachUploadDB.post(tempSaveRecord).catch(err => {
      console.log('temp record save error', err);
    });
  }

  saveAttachmentInfoWithContentForWeb(tempSaveRecord, imgUpload, uploadedFileType) {
    this.docToUpload = tempSaveRecord;
    this.pouchSaveDoc = tempSaveRecord.pouchSaveObject;
    this.isUploadProgress = false;
    return this.fileManageDBSave(uploadedFileType, imgUpload).then(res => {
      return Promise.resolve(res)
    });
  }

  fileManageDBSave(uploadedFileType, imageToUpload?) {
    let serviceObject;
    if (this.docToUpload.pouchServiceObj === "PouchDB") {
      serviceObject = this.attachmentDbProviderObj;
    } else {
      serviceObject = this.attachmentCouchDbProviderObj;
    }
    return serviceObject.save(this.docToUpload.pouchParentType, this.pouchSaveDoc).then(result => {
      
      if (result["status"] !== "SUCCESS") {
        // local notification... and retry when user click it...
        console.log(JSON.stringify(result["message"]));
        return;
      } else if (this.isUploadProgress === false && this.docToUpload.status === 'initiated') {
        var liveSelector = { '$or': this.attachmentDbConfig.configuration.pouchDBSyncEnabledObjectSelectors };
        return serviceObject.oneTimeReplicationToServerWithSelector(liveSelector).then(response => {
          
          if (response["ok"]) {
            return serviceObject.fetchDocWithRelationshipByTypeAndId(this.pouchSaveDoc.type, result.id, false).then(res => {
              if (res['status'] === "SUCCESS" && res['records'] && res['records'].length > 0) {
                this.pouchSaveDoc = res['records'][0];
                if (this.appUtilityObj.isMobile) {
                  this.uploadToServer(this.docToUpload, result.id, uploadedFileType);
                } else {
                  const url = this.appUtilityObj.appBuilderURL;
                  const path = url + '/filemanage/upload';
                  console.log('path', path);
                  const formData = new FormData();
                  formData.append("image", imageToUpload);
                  console.log('formData', formData);
                  return this.postRequest(path, formData, this.docToUpload, result.id,
                     uploadedFileType, this.pouchSaveDoc).then(postResponse => {
                    console.log("postRequest ==> ", postResponse);
                    if (postResponse["status"] === this.success) {
                      return Promise.resolve(postResponse)
                    } else {
                      const pouchSaveDocument = postResponse["pouchDocument"]
                      console.log("pouchSaveDocument => ", pouchSaveDocument);
                      return serviceObject.save(this.docToUpload.pouchParentType, pouchSaveDocument).then(updateResult => {
                        console.log("updateResult==>", updateResult);
                        return Promise.resolve(postResponse)
                      })
                    }
                  }).catch(err => {
                    console.log("postRequest ==> ", err);
                    return serviceObject.save(this.docToUpload.pouchParentType, this.pouchSaveDoc).then(updateResult => {
                      console.log("updateResult==>", updateResult);
                      return Promise.resolve(err)
                    })

                  })
                }
              }
            })
          }
        });
      }
    })
  }
  fetchDataFromDB(fileType) {
    const selector = {}
    selector['status'] = 'initiated';
    const options = {};
    options['selector'] = selector;
    this.attachUploadDB.find(options).then(function (doc) {
      
      if (doc['docs'].length === 0) {
        return;
      } else {
        const docsArray = doc['docs'];
        const firstObj = docsArray[0];
        this.docToUpload = firstObj
        this.pouchSaveDoc = this.docToUpload.pouchSaveObject;
        this.fileManageDBSave(fileType);
      }
    }).then(function (response) {
      // handle response
    }).catch(function (err) {
      console.log(err);
    });
  }

  uploadToServer(doc, id, fileType) {
    this.presentLocalNotification('Upload process has been started');
    const url = this.appUtilityObj.appBuilderURL;
    // const docId = doc._id;
    const filePath = doc.file_path;
    this.file.readAsDataURL(filePath, doc.file_name)
      .then(async entry => {
        this.isUploadProgress = true;
        const blobData = this.convertBase64ToBlob(entry);
        const formData = new FormData();
        formData.append("image", blobData, doc.file_name);
        console.log('formData', formData);
        const path = url + '/filemanage/upload';
        console.log('path', path);
        this.postRequest(path, formData, doc, id, fileType)
      }).catch(err => {
        console.log('Error while reading file.', err);
        this.isUploadProgress = false;
        this.pouchSaveDoc.status = 'error';
        this.docToUpload.status = 'error';
        this.fileManageDBSave(fileType);
        if (this.appUtilityObj.isMobile) {
          this.saveAttachmentInfo(document);
          this.fetchDataFromDB(fileType);
        }
      });
  }

  private convertBase64ToBlob(base64: string) {
    const info = this.getInfoFromBase64(base64);
    const sliceSize = 512;
    const byteCharacters = window.atob(info.rawBase64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: info.mime });
  }
  private getInfoFromBase64(base64: string) {
    const meta = base64.split(',')[0];
    const rawBase64 = base64.split(',')[1].replace(/\s/g, '');
    const mime = /:([^;]+);/.exec(meta)[1];
    const extension = /\/([^;]+);/.exec(meta)[1];

    return {
      mime,
      extension,
      meta,
      rawBase64
    };
  }

  postRequest(path, postParams, document, idVal, fileType, pouchSaveDocument?) {
    let sessionTokenStr;
    let sessionType = '';

    if (this.appUtilityObj.isMobile) {
      sessionTokenStr = this.appUtilityObj.accessToken;
      sessionType = "OAUTH";
    } else {
      sessionTokenStr = this.appUtilityObj.sessionId;
      sessionType = "NODEJS";
    }
    let attachmentFileType = ''
    if (fileType === appConstant.fileType.document) {
      attachmentFileType = "doc_2_"
    } else {
      attachmentFileType = "att_2_"
    }
    let header ={
      'input_json': JSON.stringify({
        "orgId": this.appUtilityObj.orgId,
        "couch_id": "pfm" + document.objectId + attachmentFileType + idVal,
        "fileType": fileType,
        "fileSaveAs": document.fileSaveAs,
        "recordId": document.recordId,
        "objectId": document.objectId,
        "configId": document.configId,
        "userId": this.appUtilityObj.userId,
        "sessionType": sessionType,
        "sessionToken": sessionTokenStr
      })
    };
    
    return new Promise(resolve => {
       this.httpClient.post(path, postParams, {headers : header,
        responseType: 'text'})
       .pipe(timeout(250000))
       .pipe(
        catchError( err => {
        if (this.appUtilityObj.isMobileResolution) {
          this.presentLocalNotification('Upload has been failed');
        }
        this.isUploadProgress = false;
        this.pouchSaveDoc.status = 'error';
        this.docToUpload.status = 'error';
        if (this.appUtilityObj.isMobile) {
          this.fileManageDBSave(fileType);
          this.saveAttachmentInfo(document);
          this.fetchDataFromDB(fileType);
        } else {
          console.log("err => ", err);
          pouchSaveDocument.status = 'error';
          this.observableListenerUtils.emit("uploadfailure", pouchSaveDocument)
          return throwError({ status: this.failed, message: "Upload has been failed", pouchDocument: pouchSaveDocument })
        }
      }))
      .subscribe((data:any) => {
        if (this.appUtilityObj.isMobileResolution) {
          this.presentLocalNotification('Upload process Completed');
        }
        this.isUploadProgress = false;
        let toastStr = '';
        if (data !== "Success") {
          this.pouchSaveDoc.status = 'error';
          this.docToUpload.status = 'error';
          toastStr = 'upload has been failed';
          const obj = JSON.parse(data);
          
        if (obj['message'] === "Invalid sessiontoken" || obj['message']  === "Session expired") {
          this.pouchSaveDoc.status_message = 'Session expired';
          this.docToUpload.status_message = 'Session expired';
          pouchSaveDocument.status_message = "Session expired";
          window.location.replace('/apps/applist?metaFailureAction=Logout');           
        }
          if (this.appUtilityObj.isMobile) {
            this.fileManageDBSave(fileType);
            this.saveAttachmentInfo(document);
            this.fetchDataFromDB(fileType);
          } else {
            pouchSaveDocument.status = 'error';
            return resolve({ status: this.failed, message: "Upload has been failed", pouchDocument: pouchSaveDocument });
          }
        } else {
          if (this.appUtilityObj.isMobileResolution) {
            this.fileManageDBSave(fileType);
            this.appUtilityObj.presentToast('upload has been completed');
          } else {
            return resolve({ status: this.success, message: "Upload has been completed", pouchDocument: pouchSaveDocument });
          }
        }
      });
    })
  }


  presentLocalNotification(displayStr) {
    if (this.appUtilityObj.isMobile) {
      this.localNotifIdVal = this.localNotifIdVal + 1;
      try {
        this.localNotifcation.schedule({
          id: this.localNotifIdVal,
          text: displayStr,
          foreground: true
        });
      } catch (error) {
        console.log(error);
      }
    }
  }   
  
  removeAttchFile(pouchParentType, pouchSaveDoc) {
    return this.attachmentCouchDbProviderObj.save(pouchParentType, pouchSaveDoc).then(result => {
      return result;
    });
  }
}
