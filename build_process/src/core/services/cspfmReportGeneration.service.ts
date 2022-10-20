import { Injectable } from '@angular/core';
import { couchdbProvider } from '../db/couchdbProvider';
import { MatDialog } from '@angular/material/dialog';
import { cspfmAlertDialog } from '../components/cspfmAlertDialog/cspfmAlertDialog';
import { dataProvider } from '../utils/dataProvider';
import { appConstant } from '../utils/appConstant';
import { appUtility } from '../utils/appUtility';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CspfmReportGenerationService {

  public result: any;
  public type = "pfmstaticreport";
  public failed = 'FAILED';
  public success = 'SUCCESS';
  public objectHierarchyJSON = {
    objectName: "report",
    objectType: "PRIMARY",
    relationShipType: "",
    fieldId: "",
    objectId: this.type,
    childObject: []
  }

  constructor(public couchdbProvider: couchdbProvider, public dialog: MatDialog, public dataProvider: dataProvider,private httpClient:HttpClient,
    public appUtility: appUtility, public toastCtrl: ToastController) { }

  getReport(inputData) {
    inputData['orgId'] = this.appUtility.orgId
    inputData['userId'] = this.appUtility.userId
    const dataFetchingInput = {
      'objectHierarchyJSON': this.objectHierarchyJSON,
      'dataSource': appConstant.couchDBStaticName,
      'searchListQuery': "type: " + this.type + " AND recordId:" + inputData['recordId'] + " AND elementId:" + inputData['elementId'] + " AND layoutId:" + inputData['layoutId']
    }
    return this.dataProvider.fetchDataFromDataSource(dataFetchingInput).then(res => {
      console.log("builder service input : ", inputData)
      if (res['status'] === "SUCCESS") {
        if (res['records'].length > 0) {
          return res
        } else {
          this.putNewCouchRecord(inputData)
        }
      } else {
        if (inputData['isLoading']) {
          inputData['isLoading'] = false
          this.appUtility.presentToast("Report fetch failed")
        }
      }
    }).catch(e => {
      if (inputData['isLoading']) {
        inputData['isLoading'] = false
        this.appUtility.presentToast("Report fetch failed")
      }
    })
  }

  putNewCouchRecord(inputData) {
    this.dataProvider.save(this.type, this.makeCouchReportRecord(inputData), appConstant.couchDBStaticName).then(res => {
     
      if (res['status'] === "SUCCESS") {
        inputData['couchId'] = res['id']
        this.callWebservice(inputData, res)
      } else {
        if (inputData['isLoading']) {
          inputData['isLoading'] = false
          this.appUtility.presentToast("Report generation failed")
        }
      }
    }).catch(e => {
      if (inputData['isLoading']) {
        inputData['isLoading'] = false
        this.appUtility.presentToast("Report generation failed")
      }
    })
  }

  callWebservice(requestInput, result) {
    if (this.appUtility.isMobile) {
      requestInput['sessionToken'] = this.appUtility.accessToken
      requestInput['sessionType'] = "OAUTH"
    } else {
      requestInput['sessionToken'] = this.appUtility.sessionId
      requestInput['sessionType'] = "NODEJS"
    }
    const inputparams = {
      "inputparams": requestInput
    }
    console.log('web service input : ', inputparams);
    const serviceURl = this.appUtility.appBuilderURL + '/appcontainer/intiateReportGeneration'
    return this.httpClient.post(serviceURl, inputparams, { responseType: "json" }).toPromise().then(res => {
      
      if (res) {
        if (res['status'] === "SUCCESS") {
          if (requestInput['isLoading']) {
            this.appUtility.presentToast("Report generation initiated...")
            return res;
          }
        } else {
          this.changeRecStatusToError(requestInput, result)
          return res;
        }
      }
    }).catch(error => {
     return this.changeRecStatusToError(requestInput, result)
    });
  }

  regenerateReport(inputData, newDoc) {
    return this.dataProvider.save(this.type, this.makeCouchReportRecord(inputData, newDoc), appConstant.couchDBStaticName).then(res => {
      
      inputData['couchId'] = res['id']
     return this.callWebservice(inputData, res)
    })
  }

  changeRecStatusToError(requestInput, result) {
    const additionalObjectdata = {};
    additionalObjectdata['id'] = result['id']
    const fetchParams = {
      'objectHierarchyJSON': this.objectHierarchyJSON,
      'additionalInfo': additionalObjectdata,
      'dataSource': appConstant.couchDBStaticName
    };
    return this.dataProvider.querySingleDoc(fetchParams).then(res => {
      
      if (res && res['records'].length > 0) {
        res['records'][0]['reportStatus'] = "ERROR"
        res['records'][0]['statusMessage'] = "Report Generation Failed"
        return this.dataProvider.save(this.type, res['records'][0], appConstant.couchDBStaticName).then(res => {
          
          if (requestInput['isLoading']) {
            this.appUtility.presentToast("Report generation failed...")
            return res;
          }
        }).catch(e=>{
          requestInput['isLoading'] = false
          this.appUtility.presentToast("Report generation failed...")
          return e;
        })
      }
    }).catch(e=>{
      requestInput['isLoading'] = false
      this.appUtility.presentToast("Report generation failed...")
      return e;
    })
  }

  makeCouchReportRecord(inputData, resultObject?) {
    var saveObject = resultObject ? resultObject : JSON.parse(JSON.stringify(this.dataProvider.tableStructure()['pfmstaticreport']))
    saveObject["recordId"] = inputData['recordId']
    saveObject["reportFormat"] = inputData['reportFormat']
    saveObject["reportStatus"] = "INITIATED"
    saveObject["statusMessage"] = "Report Generation Initiated"
    saveObject["elementId"] = inputData['elementId']
    saveObject["layoutId"] = inputData['layoutId']
    saveObject["type"] = this.type
    saveObject["userId"] = this.appUtility.userId
    return saveObject
  }

  // if (type === 'pdf') {
  //   url = 'https://dev.chainsys.com/appdesigner/fscontroller/downloadfile?fileName=/CSP/Reports/3/InvoiceReportMemo_4.pdf&nodeGUID=rhiunyydhdtf';
  // } else {
  //   url = 'https://dev.chainsys.com/appdesigner/fscontroller/downloadfile?fileName=/CSP/Reports/3/InvoiceReportMemo_3.html&nodeGUID=rhiunyydhdtf';
  // }

}

