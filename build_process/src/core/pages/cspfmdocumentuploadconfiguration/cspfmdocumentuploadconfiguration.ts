

/* 
 *    File: cspfmdocumentuploadconfiguration.ts 
 *    Copyright(c) 2022 Chain-Sys Corporation Inc.
 *    Duplication or distribution of this code in part or in whole by any media
 *    without the express written permission of Chain-Sys Corporation or its agents is
 *    strictly prohibited.
 */
import {
  Component,
  ApplicationRef,
  OnInit,
  Input,
  Inject
} from '@angular/core';
import {
  NavController,
  LoadingController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  attachmentDbProvider
} from 'src/core/db/attachmentDbProvider';
import {
  attachmentCouchDbProvider
} from 'src/core/db/attachmentCouchDbProvider';
import {
  appUtility
} from 'src/core/utils/appUtility';
import * as lodash from 'lodash';
import {
  File
} from '@awesome-cordova-plugins/file/ngx';
import {
  Broadcaster
} from '@awesome-cordova-plugins/broadcaster/ngx';
import * as moment from 'moment';
import {
  attachmentDbConfiguration
} from 'src/core/db/attachmentDbConfiguration';
import {
  cspfmAttachementUploadDbProvider
} from 'src/core/db/cspfmAttachementUploadDbProvider';
import {
  appConstant
} from 'src/core/utils/appConstant';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
import { metaDataDbProvider } from 'src/core/db/metaDataDbProvider';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { getWeekOfMonth } from 'date-fns';
import { dataProvider } from 'src/core/utils/dataProvider';
import * as FileType from 'file-type/core';


@Component({
  selector: 'app-cspfmdocumentuploadconfiguration',
  templateUrl: 'cspfmdocumentuploadconfiguration.html',
  styleUrls: ['./cspfmdocumentuploadconfiguration.scss']
})
export class cspfmdocumentuploadconfiguration implements OnInit {

  // Redirect URL
  public redirectUrl;

  // Document Configuration Object
  public documentInfo;

  // Can upload multiple File flag
  public canUploadMultipleFile = false;

  public fileFormat;

  public displayFileName = [];

  public selectedObj = {};

  public formatOptionArray = [];

  public acceptedFileType = "";

  public fileTypeTitle = ""

  private fileExtension = [];

  public uploadedFiles = {};
  public isLoading  = false;
  public loadingIndicatorQue = 0;
  public retryUpload  = false;
  public documentRecord;
  public groupedResultList;
  public showUploadedFiles = []
  public corUsersObjectHierarchyJSON = {
    "objectId": this.metaDbconfig.corUsersObject,
    "objectName": this.metaDbconfig.corUsersObject,
    "fieldId": 0,
    "objectType": "PRIMARY",
    "relationShipType": null,
    "childObject": []
  };

  @Input() queryParams: any;
  public monthsInString;
  public totalMonths;
  public totalYears = Array(100).fill(0).map((x, i) => i);
  public totalsDays;
  // To know override uplaod action
  public uploadType =""
  constructor(private dialogRef: MatDialogRef<cspfmdocumentuploadconfiguration>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, public attachmentDbConfig: attachmentDbConfiguration, public cspfmAttachementUploadDbObj: cspfmAttachementUploadDbProvider,
    public navCtrl: NavController, public activatedRoute: ActivatedRoute, public broadcaster: Broadcaster,
    public loadingCtrl: LoadingController, public applicationRef: ApplicationRef, public router: Router,
    public attachmentDbObject: attachmentDbProvider,
    public attachmentCouchDbObject: attachmentCouchDbProvider, public appUtilityConfig: appUtility,
    public file: File,
    private alertCtrl: AlertController, public modelVC: ModalController, public observableListenerUtils: cspfmObservableListenerUtils,
    private metaDataDbProvider: metaDataDbProvider, public metaDbconfig: metaDbConfiguration,
    public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider,
    public dataProviderObject:dataProvider
  ) {

    if (!this.appUtilityConfig.isMobileResolution) {
      const params = JSON.parse(JSON.stringify(data['queryParams']));
      this.documentInfo = JSON.parse(params['documentInfo']);
      this.redirectUrl = params['redirectUrl'];
      this.selectedObj = JSON.parse(params['selectedObj']);
      this.retryUpload = params["retryUpload"];
      if(params["uploadType"]){
        this.uploadType = params["uploadType"]
      }


      this.fileExtension = lodash.map(this.documentInfo['fileExtension'], "type")
      if (this.documentInfo['canUploadMultipleFile'] && this.documentInfo['canUploadMultipleFile'] === 'Y') {
        this.canUploadMultipleFile = true
        this.fileTypeTitle = "Multiple File " + String(this.documentInfo['fileCount'])
      } else {
        this.canUploadMultipleFile = false
        this.fileTypeTitle = "Single File"
      }
      this.fileFormat = this.documentInfo['fileFormat'];
      this.getDisplayfileName();
      if (this.documentInfo['fileExtension'] && this.documentInfo['fileExtension'].length > 0) {
        this.documentInfo['fileExtension'].forEach((element, index) => {
          if (index === this.documentInfo['fileExtension'].length - 1) {
            if (this.getMIMEtype(element['type']) !== "") {
              this.acceptedFileType = this.acceptedFileType + this.getMIMEtype(element['type'])
            }
          } else {
            if (this.getMIMEtype(element['type']) !== "") {
              this.acceptedFileType = this.acceptedFileType + this.getMIMEtype(element['type']) + ","
            }
          }
        });
      }

      if (this.retryUpload) {
        this.documentRecord = JSON.parse(params['documentRecord']);
        this.groupedResultList = params["groupedResultList"]
        const totalDocument = params["totalDocument"]
        this.getRetryFileInfo(totalDocument)
      }
    }
  }
 
 getRetryFileInfo(totalUploadedDocument) {
    this.showUploadedFiles = []
    if (this.canUploadMultipleFile) {
       this.showUploadedFiles.push(this.documentRecord)
    
    } else {
      this.showUploadedFiles = totalUploadedDocument
    }
  }
  closeButtonClick() {
    if (this.appUtilityConfig.isMobileResolution) {
      this.modelVC.dismiss(true)
    } else if (!this.appUtilityConfig.isMobileResolution) {
      this.dialogRef.close();
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
    if (MIMETypes[ext]) {
      return MIMETypes[ext];
    } else {
      return "";
    }
  }
  getDisplayfileName() {
    const currentDate = new Date();
    const formatOptionArray = this.documentInfo['fileFormatOptions'];
    this.fileFormatGeneration(formatOptionArray)
    if (this.documentInfo['frequency'] === "AnyDate" || this.documentInfo['frequency'] === "Daily") {
      this.dateGeneration(currentDate, 'days', formatOptionArray)
    } else if (this.documentInfo['frequency'] === "Monthly") {
      this.dateGeneration(currentDate, 'months', formatOptionArray)
    } else if (this.documentInfo['frequency'] === "Yearly") {
      this.dateGeneration(currentDate, 'years', formatOptionArray)
    } else if (this.documentInfo['frequency'] === "Weekly") {
      this.dateGeneration(currentDate, 'weeks', formatOptionArray)
    } else if (this.documentInfo['frequency'] === "Quaterly") {
      this.dateGeneration(currentDate, 'quarters', formatOptionArray)
    }
  }

  fileFormatGeneration(formatOptionArray) {
    const monthOptions = ["MM", "MON", "MONTH"];
    const daysOptions = ["DD"];
    const yearOptions = ["YY", "YYYY"];
    this.monthsInString = [];
    this.totalMonths = [];
    this.totalsDays = [];
    const optionArr = []
    const seperators = []
    for (let i of formatOptionArray) {
      if (i['isSeperator']) {
        seperators.push(i['option']);
      } else {
        optionArr.push(i['option']);
      }
    }

    if (seperators.indexOf("Sep") > -1) {
      this.showAlert("Can't Choose the Default Seperator. Please reach us Admin")
    } else {
      const tempArr = []
      optionArr.forEach((element, index) => {
        if (monthOptions.indexOf(element) > -1 || daysOptions.indexOf(element) > -1 || yearOptions.indexOf(element) > -1) {
          tempArr.push(element)
        }
      })

      formatOptionArray.forEach((element, indexofformat) => {
        element['value'] = ""
        if (!element['isSeperator']) {
          element['isSeperator'] = false
          element['isDateFormat'] = false
          element['isStaticContent'] = false
          if ( element['option'] === "Q") {
            element['displayName'] = element['option']
            element['displayOption'] = [element['option']]
            element['value'] = "Q"
            element['isStaticContent'] = true
          } else
            if (element['option'] === "W" ) {
            element['displayName'] = element['option']
            element['displayOption'] = [element['option']]
            element['value'] = "W"
            element['isStaticContent'] = true
          } else if (element['option'] === "{0}") {
            element['displayName'] = "NO"
            element['displayOption'] = []
          } else if (tempArr.indexOf(element['option']) > -1) {
            element['displayName'] = element['option']
            element['isDateFormat'] = true
            element['displayOption'] = []
          } else {          
            element['value'] = element['option']
            element['displayName'] = "Sep"
            element['isDateFormat'] = false
            element['displayOption'] = ["Sep", element['option']]
            element['isSeperator'] = true
            element['isStaticContent'] = true


          }
        } else {
          
          element['displayName'] = "Sep"
          element['value'] = element['option']         
          element['isDateFormat'] = false
          element['displayOption'] = ["Sep", element['option']]
          element['isSeperator'] = true
          element['isStaticContent'] = true
        }
      });
      this.formatOptionArray = formatOptionArray;
    }
  }
  quarterGeneration(formatOptionArray) {
    const dateArray = []

    dateArray.push(this.getQuarterDetail("Previous", 3))
    dateArray.push(this.getQuarterDetail("Previous", 2))
    dateArray.push(this.getQuarterDetail("Previous", 1))


    dateArray.push(this.getQuarterDetail('Current'))

    dateArray.push(this.getQuarterDetail("Next", 1))
    dateArray.push(this.getQuarterDetail("Next", 2))
    dateArray.push(this.getQuarterDetail("Next", 3))

    dateArray.forEach((element, i) => {
      const optionsValue = []
      formatOptionArray.forEach((optionData, index) => {

        if (!optionData['isSeperator']) {

          if (optionData['option'] === "W") {
            optionsValue.push("W")
          } else if (optionData['option'] === "Q") {
            optionsValue.push("Q")
          } else if (optionData['option'] === "{0}") {
            let componentVal = ""

            componentVal = String(moment(element['quarterStart']).quarter())

            optionsValue.push(componentVal)
          } else if (optionData['option'] === "MON") {
            if (optionsValue.length < 6) {
              optionsValue.push(moment(element['quarterStart']).format('MMM'))
            } else {
              optionsValue.push(moment(element['quarterEnd']).format('MMM'))
            }

          } else if (optionData['option'] === "MONTH") {
            if (optionsValue.length < 6) {
              optionsValue.push(moment(element['quarterStart']).format('MMMM'))
            } else {
              optionsValue.push(moment(element['quarterEnd']).format('MMMM'))
            }

          } else if (optionData['option'] === "MM") {
            if (optionsValue.length < 6) {
              optionsValue.push(moment(element['quarterStart']).format(optionData['option']))
            } else {
              optionsValue.push(moment(element['quarterEnd']).format(optionData['option']))
            }
          } else if (optionData['option'] === "DD" || optionData['option'] === "YY" || optionData['option'] === "YYYY") {
            optionsValue.push(moment(element['quarterStart']).format(optionData['option']))
          } else {

            optionsValue.push(optionData['option'])

          }
        } else {
          optionsValue.push(optionData['option'])
        }

      })
      const dateStrVal = optionsValue.join("")
      if (i === 3) {
        this.displayFileName.push({
          "date": dateStrVal,
          "recordCount": 0,
          "current": true
        })
      } else {
        this.displayFileName.push({
          "date": dateStrVal,
          "recordCount": 0,
          "current": false
        })
      }
      this.fetchCurrentDateRecordCount(dateStrVal, this.selectedObj['parentType'] + 'doc')
    })
  }
  weeklyGeneration(formatOptionArray, currentDate) {
    this.displayFileName = []
    var totalNoOfWeek = this.weekCount(new Date().getMonth() + 1, new Date().getFullYear())
    var currentWeekNo = this.countWeekdayOccurrencesInMonth(currentDate)
    var currentMonthWeekArray = []
    for (let k = 1; k <= totalNoOfWeek; k++) {
      if (k < currentWeekNo) {
        var previousObjectData = { 'date': currentDate, 'weekNo': k, 'action': 'Previous' }
        currentMonthWeekArray.push(previousObjectData)
      } else {
        var nextObjectData = { 'date': currentDate, 'weekNo': k, 'action': 'Next' }
        currentMonthWeekArray.push(nextObjectData)
      }
    }
    var nextWeekList = currentMonthWeekArray.filter(app => app.action === 'Next');
    var totalPreviousWeekList = currentMonthWeekArray.filter(app => app.action === 'Previous');
    var previousWeekListAlreadyAdded = 0;
    if (nextWeekList.length > 4) {
      nextWeekList = nextWeekList.slice(0, 4)
    }
    if (totalPreviousWeekList.length > 3) {
      totalPreviousWeekList = totalPreviousWeekList.slice().reverse().slice(0, 3)
    } else {
      totalPreviousWeekList = totalPreviousWeekList.slice().reverse()
    }
    var initialPreviousWeekList = []
    if (totalPreviousWeekList.length > 0) {
      previousWeekListAlreadyAdded = totalPreviousWeekList.length;
      initialPreviousWeekList = JSON.parse(JSON.stringify(totalPreviousWeekList))
    }
    var additionalPreviousWeekList = []
    if (totalPreviousWeekList.length < 3) {
      var previousMonthTotalWeek = this.weekCount(new Date().getMonth(), new Date().getFullYear())
      for (let kx = totalPreviousWeekList.length; totalPreviousWeekList.length < 3; kx++) {
        var additionalPreviousData = { 'date': new Date(currentDate.getFullYear(), currentDate.getMonth() - 1), 'weekNo': previousMonthTotalWeek, 'action': 'Previous' }

        totalPreviousWeekList.push(additionalPreviousData)
        if (previousWeekListAlreadyAdded > 0) {
          additionalPreviousWeekList.push(additionalPreviousData)
        }

        previousMonthTotalWeek--;
      }
    }
    if (nextWeekList.length < 4) {
      var weekId = 1;
      for (let y = nextWeekList.length; nextWeekList.length < 4; y++) {

        var additionalNextWeekData = { 'date': new Date(currentDate.getFullYear(), currentDate.getMonth() + 1), 'weekNo': weekId, 'action': 'Next' }
        nextWeekList.push(additionalNextWeekData)
        weekId++
      }
    }
    var totalWeekList;
    if (previousWeekListAlreadyAdded === 0) {
      totalWeekList = totalPreviousWeekList.slice().reverse().concat(nextWeekList)
    } else {
      totalWeekList = additionalPreviousWeekList.slice().reverse().concat(initialPreviousWeekList.slice().reverse(), nextWeekList)
    }
    totalWeekList.forEach((element, i) => {
      const optionsValue = []
      formatOptionArray.forEach((optionData, index) => {
        if (!optionData['isSeperator']) {

          if (optionData['option'] === "W") {
            optionsValue.push("W")
          } else if (optionData['option'] === "{0}") {

            optionsValue.push(element['weekNo'])
          } else if (optionData['option'] === "MON") {
            optionsValue.push(moment(element['date']).format('MMM'))
          } else if (optionData['option'] === "MONTH") {
            optionsValue.push(moment(element['date']).format('MMMM'))
          } else if (optionData['option'] === "DD" || optionData['option'] === "MM" || optionData['option'] === "YY" || optionData['option'] === "YYYY") {
            optionsValue.push(moment(element['date']).format(optionData['option']))
          } else {
            optionsValue.push(optionData)
          }
        } else {
          optionsValue.push(optionData['option'])
        }
      })
      const dateStrVal = optionsValue.join("")
      
      if (i === 3) {
        this.displayFileName.push({
          "date": dateStrVal,
          "recordCount": 0,
          "current": true
        })
      } else {
        this.displayFileName.push({
          "date": dateStrVal,
          "recordCount": 0,
          "current": false
        })
      }
      this.fetchCurrentDateRecordCount(dateStrVal, this.selectedObj['parentType'] + 'doc')
    })
  }

  daysInMonth(anyDateInMonth) {
    return new Date(anyDateInMonth.getFullYear(),
      anyDateInMonth.getMonth() + 1,
      0).getDate();
  }

  dateGeneration(currentDate, component, formatOptionArray) {
    if (component === 'weeks') {
      this.weeklyGeneration(formatOptionArray, currentDate)
      return
    } else if (component === 'quarters') {
      this.quarterGeneration(formatOptionArray)
      return
    }


    const dateArray = []
    dateArray.push(moment(currentDate).subtract(3, component))
    dateArray.push(moment(currentDate).subtract(2, component))
    dateArray.push(moment(currentDate).subtract(1, component))
    dateArray.push(moment(currentDate))
    dateArray.push(moment(currentDate).add(1, component))
    dateArray.push(moment(currentDate).add(2, component))
    dateArray.push(moment(currentDate).add(3, component))
    dateArray.forEach((element, i) => {
      const optionsValue = []
      formatOptionArray.forEach((optionData, index) => {
        if (!optionData['isSeperator']) {
          if (optionData['option'] === "W") {
            optionsValue.push("W")
          } else if (optionData['option'] === "Q") {
            optionsValue.push("Q")
          } else if (optionData['option'] === "{0}") {
            let componentVal = ""
            if (component === "weeks") {
              const cdomponentVal = element.week() - moment(element).startOf('month').week() + 1
              componentVal = String(cdomponentVal)
            } else {
              componentVal = element.quarter()
            }
            optionsValue.push("{" + componentVal + "}")
          } else if (optionData['option'] === "MON") {
            optionsValue.push(element.format('MMM'))
          } else if (optionData['option'] === "MONTH") {
            optionsValue.push(element.format('MMMM'))
          } else if (optionData['option'] === "DD" || optionData['option'] === "MM" || optionData['option'] === "YY" || optionData['option'] === "YYYY") {
            optionsValue.push(element.format(optionData['option']))
          } else {
            optionsValue.push(optionData['option'])
          }
        } else {
          optionsValue.push(optionData['option'])
        }

      })
      const dateStrVal = optionsValue.join("")

      if (i === 3) {
        this.displayFileName.push({
          "date": dateStrVal,
          "recordCount": 0,
          "current": true
        })
      } else {
        this.displayFileName.push({
          "date": dateStrVal,
          "recordCount": 0,
          "current": false
        })
      }
      this.fetchCurrentDateRecordCount(dateStrVal, this.selectedObj['parentType'] + 'doc')
    })
  }

  fetchCurrentDateRecordCount(date, type) {
    const options = {};
    options['type'] = type;
    options['file_name'] = date;
    const query = this.queryMakingBasedOnMethodCalled('fetchCurrentDateRecordCount', options);
    this.dataProviderObject.fileManageDbSelection(query).then(res => {

      if (res['status'] === 'SUCCESS') {
        const dateString = lodash.map(res['records'], 'file_name');
        if (dateString.length > 0) {
          this.displayFileName.forEach(element => {
            if (element['date'] === dateString[0]) {
              element['recordCount'] = dateString.length
              if (!this.canUploadMultipleFile) {
                element['id'] = res['records'][0]['id']
                element['status'] = res['records'][0]['status']
                element['rev'] = res['records'][0]['rev']
              }
              this.applicationRef.tick()
            }
          })
        }
      }
    }).catch(err => {
      console.log(err);
    })
  }

  addDateToDisplayFileName() {
    let dateString = ""
    const isValidDate = []
    this.formatOptionArray.forEach(element => {
      if (element['value'] !== "") {
        if (element['isDateFormat']) {
          if (this.appUtilityConfig.isMobileResolution) {
            dateString = dateString + moment(element['value']).format(element['option']);
          } else if (!this.appUtilityConfig.isMobileResolution) {
            if (element['option'] === "DD" || element['option'] === "MM" || element['option'] === "YY") {
              if (element['value'] < 10) {
                dateString = dateString + "0" + element['value'].toString();
              } else if (element['value'] === 100) {
                dateString = dateString + (element['value'].toString()).substring(1, 3);
              } else {
                dateString = dateString + element['value'].toString();
              }
            } else if (element['option'] === "MON") {
              dateString = dateString + (element['value'].substring(0, 1)).toUpperCase() + (element['value'].substring(1, 3)).toLowerCase();
            } else if (element['option'] === "MONTH") {
              dateString = dateString + element['value'].substring(0, 1).toUpperCase() + (element['value'].slice(1)).toLowerCase();
            } else if (element['option'] === "YYYY") {
              if (element['value'] < 10) {
                dateString = dateString + "200" + element['value'].toString();
              } else if (element['value'] === 100) {
                dateString = dateString + "2" + element['value'].toString();
              } else {
                dateString = dateString + "20" + element['value'].toString();
              }
            }
          }
          isValidDate.push(true)
        } else if (dateString.indexOf('Sep') > -1) {
          isValidDate.push(false)
        } else if (element['option'] === "{0}") {
          // dateString = dateString + "{" + element['value'].replace(/\s/g, "") + "}"
          dateString = dateString + element['value']
        } else {
          if (element['value'] === "") {
            dateString = dateString + element['value']
          } else {
            dateString = dateString + element['value'].replace(/\s/g, "")
          }

          isValidDate.push(true)
        }
      } else {
        isValidDate.push(false)
      }
    })

    if (isValidDate.indexOf(false) > -1) {
      this.showAlert("Please Choose the file format")
    } else if (dateString !== "") {//&& dateString.length === this.fileFormat.length) {

      const dateArray = lodash.map(this.displayFileName, 'date');
      const optionArr = []
      const seperators = []
      for (let i of this.formatOptionArray) {

        if (i['isSeperator']) {
          seperators.push(i['option']);

        } else {
          optionArr.push(i['option']);
        }
      }

      if (dateArray.toString().toLowerCase().indexOf(dateString.toLowerCase()) > -1) {

        this.showAlert("File Name Already Exist")
      } else {
        const dateObj = {
          "date": dateString,
          "recordCount": 0
        }
        this.displayFileName.splice(0, 0, dateObj);
        this.fileFormatGeneration(this.formatOptionArray);
        this.fetchCurrentDateRecordCount(dateString, this.selectedObj['parentType'] + 'doc')
      }
    } else {
      this.showAlert("Please Choose the file format")
    }

  }
  async showAlert(message, status?) {
    if (this.appUtilityConfig.isMobileResolution) {
      const method = await this.alertCtrl.create({
        message: message,
        buttons: [{
          text: 'Ok',
          cssClass: 'method-color',
          handler: () => {
            console.log('Individual clicked');
            if(this.retryUpload){
              this.closeButtonClick()
            }
          }
        }]
      });
      await method.present();
    } else if (!this.appUtilityConfig.isMobileResolution) {
      const dialogConfig = new MatDialogConfig()

      dialogConfig.data = {
        title: message,
        buttonInfo: [
          {
            "name": "OK",
            handler: () => {
              console.log('Individual clicked');
              if (status === "interrupted") {
                this.observableListenerUtils.remove('uploadfailure',"==")
                this.dialogRef.close();
              }
              if(this.retryUpload){
                this.closeButtonClick()
              }
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

  uploadAction() {
    if (!navigator.onLine) {
      this.appUtilityConfig.presentToast("No internet connection. Please check your internet connection and try again.");
      return;
    }
    const uploadedFiles = this.uploadedFiles;
    this.uploadedFiles = {};
    const uploadFiles = Object.keys(uploadedFiles);
    if (uploadFiles.length > 0) {
      this.loadingIndicatorQue = this.loadingIndicatorQue + 1;
      this.isLoading = true;
      const taskList = []
      uploadFiles.forEach(element => {
        uploadedFiles[element].dataArray.forEach(uploadObject => {
          taskList.push(this.singleOrMultipleFileUpload(element, uploadObject['filesizeVal'],
            uploadObject['fileExtension'], uploadObject['uploadedFiles'], uploadObject['recordId']));
        });
      })

      Promise.all(taskList).then(res => {
        if (res !== undefined && res !== null && res.length > 0) {

          this.loadingIndicatorQue = this.loadingIndicatorQue - 1;
          if (this.loadingIndicatorQue === 0) {
            this.isLoading = false;
          }
          const resStatus = lodash.map(res, 'status')
          if (!resStatus.includes('FAILED')) {
            this.appUtilityConfig.presentToast("Upload has been completed")
          } else {
            this.showAlert("Upload has been failed")
          }
        } else {
          this.loadingIndicatorQue = this.loadingIndicatorQue - 1;
          if (this.loadingIndicatorQue === 0) {
            this.isLoading = false;
          }
          this.showAlert("Upload has been failed")
        }
        if (this.retryUpload) {
          const savedObject = res[0]["pouchDocument"]
          this.fetchAllData(savedObject)
        }

      }).catch(err => {
        console.log('uploadAction error => ', err);
        this.loadingIndicatorQue = this.loadingIndicatorQue - 1;
        if (this.loadingIndicatorQue === 0) {
          this.isLoading = false;
        }
        this.showAlert("Upload has been failed")
      });
    } else {
      this.appUtilityConfig.presentToast("Kindly select the files to upload")
    }


    
  }

  deleteTheFileNameRow(index) {
    if (this.displayFileName[index]['recordCount'] !== 0 && this.uploadedFiles[this.displayFileName[index]['date']] !== undefined) {
      this.displayFileName[index]['recordCount'] = this.displayFileName[index]['recordCount'] - this.uploadedFiles[this.displayFileName[index]['date']].dataArray.length;
      delete this.uploadedFiles[this.displayFileName[index]['date']];
      this.appUtilityConfig.presentToast('Files are cleared',2000)
    } else{
      this.appUtilityConfig.showAlert(this, "No files to clear in the draft")
    }
  }

  async fileUploadAction(event, index) {
    const uploadedFiles = event.target.files
    if (uploadedFiles) {
      if (this.documentInfo['fileCount'] === 0 || this.documentInfo['fileCount'] >= (this.
        displayFileName[index]['recordCount'] + uploadedFiles.length)) {
        if (this.canUploadMultipleFile) {
          const taskList = []
          let fileSize = 0;
          for (let i of uploadedFiles) {
            taskList.push(await this.fileValidation(i))
          }
          Promise.all(taskList).then(res => {
            if (res.length > 0) {
              const resStatus = lodash.map(res, 'status')
              if (!resStatus.includes('failed')) {
                this.displayFileName[index]['recordCount'] = this.displayFileName[index]['recordCount'] + uploadedFiles.length;
                for (let i of uploadedFiles) {
                  const fileName = this.displayFileName[index]['date']
                  const fileInfo = {}
                  fileInfo['fileName'] = i.name.split('.').slice(0, -1).join('.');
                  fileInfo['fileExtension'] = i.name.split('.').pop();
                  fileInfo['selectedFileSize'] = i.size;
                  fileInfo['filesizeVal'] = Math.floor(i.size / 1024);
                  fileInfo['uploadedFiles'] = i;
                  if (!this.uploadedFiles[fileName]) {
                    this.uploadedFiles[fileName] = {};
                    this.uploadedFiles[fileName].dataArray = []
                  } else {
                    if (fileSize === 0) {
                      for (let j = 0; j < this.uploadedFiles[fileName].dataArray.length; j++) {
                        fileSize = fileSize + this.uploadedFiles[fileName].dataArray[j].selectedFileSize;
                      }
                    }
                  }
                  fileSize = fileSize + parseInt(i.size, 0)
                  let convertedFileSize = this.bytesToSize(fileSize);
                  this.uploadedFiles[fileName].dataSize = convertedFileSize;
                  this.uploadedFiles[fileName].dataArray.push(fileInfo)
                }
                event.target.value = '';
              } else {
                const failedResponse = lodash.map(res, 'message')
                let errMsg = ""
                failedResponse.forEach(msg => {
                  if (msg !== "" && !errMsg.includes(msg)) {
                    if (errMsg === "") {
                      errMsg = errMsg + msg
                    } else {
                      errMsg = errMsg + ", " + msg
                    }
                  }
                })
                this.showAlert(errMsg)
                event.target.value = '';
              }
            } else {
              this.showAlert("File Upload Failed")
              event.target.value = '';
            }
          })
        } else {
          const fileUploaded = event.target.files[0];
          const response = await this.fileValidation(fileUploaded)
          if (response['status'] === "success") {
            if (this.displayFileName[index]['status'] !== "finished") {
              this.fileOverRideAction(fileUploaded, index)
              this.displayFileName[index]['recordCount'] = 1;
            } else {
              this.showAlert("File Upload limit exceeded")
            }
            event.target.value = '';
          } else {
            this.showAlert(response['message'])
            event.target.value = '';
          }
        }
      } else {
        this.showAlert("File Upload limit exceeded")
        event.target.value = '';
      }
    } else {
      this.showAlert("File not supported")
      event.target.value = '';
    }
  }
  singleOrMultipleFileUpload(fileName, fileSize, fileExtenstion, documentFile, recordId?) {
    if (this.retryUpload) {
      const options = {};
      options['recordId'] = recordId;
      const query = this.queryMakingBasedOnMethodCalled('singleOrMultipleFileUpload', options);
      return this.dataProviderObject.fileManageDbSelection(query).then(res => {
        if (res['status'] === "SUCCESS" && res['records'].length > 0) {          
            return this.fileUpload(fileName, fileSize, fileExtenstion, documentFile, res['records'][0]).then(fileUploadRes => {
              return Promise.resolve(fileUploadRes)
            });
        } else {
          return this.fileUpload(fileName, fileSize, fileExtenstion, documentFile).then(fileUploadRes => {
            return Promise.resolve(fileUploadRes)
          });
        }
      })
      } else {
        return this.fileUpload(fileName, fileSize, fileExtenstion, documentFile).then(fileUploadRes => {
          return Promise.resolve(fileUploadRes)
        });
   
  
      }
  }
  fileUpload(fileName, fileSize, fileExtenstion, documentFile, oldRecord?) {
    const pfmObj_str = 'pfm_' + this.documentInfo['objectId'] + '_id';
    const pfmObj_str1 = 'pfm' + this.documentInfo['objectId'];

    const tableStructure = this.attachmentDbConfig.configuration.tableStructure
    const selectedObj = this.selectedObj['documentType'];
    const saveObject = JSON.parse(JSON.stringify(tableStructure[selectedObj]));  
   saveObject[pfmObj_str] = this.selectedObj['recordId'];
    saveObject.obj_document_config_id = this.documentInfo['objDocumentConfigId'];
    saveObject.file_name = fileName;
    saveObject.display_name = fileName;
    saveObject.file_size = fileSize; 
    saveObject.file_extension = fileExtenstion;
    saveObject[pfmObj_str1] = this.selectedObj['parentId'];
    saveObject.type = this.selectedObj['documentType'];
    saveObject.status = 'initiated';
    const tempSaveRecord = {
      "file_path": this.file.dataDirectory,
      "file_size": fileSize,
      "file_name": fileName,
      "file_type": fileExtenstion,
      "status": 'initiated',
      "recordId": this.selectedObj['recordId'],
      "objectId": this.documentInfo['objectId'],
      "configId": this.documentInfo['objDocumentConfigId'],
      'pouchSaveObject': saveObject,
      'pouchServiceObj': this.selectedObj['serviceObjectAttachment'],
      'pouchParentType': this.selectedObj['parentType'] + 'doc',
      'fileSaveAs': this.documentInfo['fileSaveAs']
    }
    if (oldRecord) {
      oldRecord.file_name = fileName;
      oldRecord.display_name = fileName;
      oldRecord.file_size = fileSize; 
      oldRecord.file_extension = fileExtenstion;
      oldRecord.status = 'initiated';
      tempSaveRecord['pouchSaveObject'] = oldRecord;
    }

    if (this.appUtilityConfig.isMobile) {
      this.cspfmAttachementUploadDbObj.saveAttachmentInfo(tempSaveRecord);
    } else {
      return this.cspfmAttachementUploadDbObj.saveAttachmentInfoWithContentForWeb(tempSaveRecord,
         documentFile, appConstant.fileType.document).then(res => {
            return Promise.resolve(res)
         })
    }
  }
  fileValidation(uploadedFiles) {
    const selectedFileType = uploadedFiles.name.split('.').pop().toLowerCase();
    const selectedFileName = uploadedFiles['name'].split('.')[0];
    const selectedFileSize = this.bytesToSize(uploadedFiles.size);
    const fileSizeArray = selectedFileSize.split(' ');
    const filesizeVal = parseFloat(fileSizeArray[0].toString());
   
    const filesizeExtn = fileSizeArray[1].toString();
    let filesizeValConfigSize = 0
    let filesizeValConfigMesaurment = "kb"
    if (this.documentInfo['fileSize'] >= 1024 && this.documentInfo['fileSizeMeasurement'].toLowerCase() === 'kb') {
      filesizeValConfigSize = parseFloat((this.documentInfo['fileSize'] / 1024).toFixed(2));
      filesizeValConfigMesaurment = "mb";
    } else if (this.documentInfo['fileSizeMeasurement'].toLowerCase() === 'mb') {
      filesizeValConfigSize = this.documentInfo['fileSize'];
      filesizeValConfigMesaurment = "mb";
    }

    if (this.fileExtension.toString().toLowerCase().indexOf(selectedFileType.toLowerCase()) === -1) {

      return {
        "status": "failed",
        "message": "file format not support for this upload"
      };
    } else if (filesizeExtn === 'GB' || filesizeExtn === 'TB' ||
      (filesizeValConfigSize === 0 && filesizeValConfigMesaurment.toLocaleLowerCase() === filesizeExtn.toLocaleLowerCase() && filesizeVal > this.documentInfo['fileSize']) ||
      (filesizeValConfigSize === 0 && filesizeValConfigMesaurment.toLocaleLowerCase() === 'kb' && filesizeExtn.toLocaleLowerCase() === 'mb') ||
      (filesizeValConfigMesaurment.toLocaleLowerCase() === filesizeExtn.toLocaleLowerCase() && filesizeValConfigSize > 0 && filesizeVal > filesizeValConfigSize)) {
      if (this.documentInfo['fileSize'] >= 1024 && this.documentInfo['fileSizeMeasurement'].toLowerCase() === 'kb') {
        var docSize = (this.documentInfo['fileSize'] / 1024).toFixed(1)
        return {
          "status": "failed",
          "message": uploadedFiles['name'].split('.')[0] + " file size should be less than " + docSize + " MB"
        };
      } else {
        return {
          "status": "failed",
          "message": uploadedFiles['name'].split('.')[0] + " file size should be less than " + this.documentInfo['fileSize'] + " " + this.documentInfo['fileSizeMeasurement']
        };
      }
      
    } else {
      const ValidationExtenstionSet = [...FileType.extensions];
      if (ValidationExtenstionSet.includes(selectedFileType.toLowerCase())) {
        const reader = new FileReader();
        return new Promise(resolve => {
          reader.onload = (event: any) => {
            const selectImageUrl = event.target.result;
            FileType.fromBuffer(selectImageUrl).then(res => {
              if (res?.ext === selectedFileType.toLowerCase()) {
                resolve({
                  "status": "success",
                  "message": ""
                })
              } else {
                resolve({
                  "status": "failed",
                  "message": `The uploaded file-'${selectedFileName}' is not of type '${selectedFileType}'`
                })
              }

            }).catch(err => {
              console.log('Invalid fileType', err)
            })
          }
          reader.readAsArrayBuffer(uploadedFiles);
        })
      } else {
        return {
          "status": "success",
          "message": ""
      };
      }
    }
  }
  bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return '0 bytes';
    }
    const value = Math.floor(Math.log(bytes) / Math.log(1024));
    const i = parseInt(value.toString(), 0);
    if (i === 0) {
      return bytes + ' ' + sizes[i];
    }
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }
  backButtonOnclick() {
    this.router.navigate([this.redirectUrl], {
      skipLocationChange: true
    });
  }
  ngOnInit() {
    if (this.appUtilityConfig.isMobileResolution) {
      const params = this.queryParams.get('queryParams');
      this.documentInfo = JSON.parse(params['documentInfo']);
      this.redirectUrl = params['redirectUrl'];
      this.selectedObj = JSON.parse(params['selectedObj']);
      this.fileExtension = lodash.map(this.documentInfo['fileExtension'], "type")
      if (this.documentInfo['canUploadMultipleFile'] && this.documentInfo['canUploadMultipleFile'] === 'Y') {
        this.canUploadMultipleFile = true
        this.fileTypeTitle = "Multiple File " + String(this.documentInfo['fileCount'])
      } else {
        this.canUploadMultipleFile = false
        this.fileTypeTitle = "Single File"
      }
      this.fileFormat = this.documentInfo['fileFormat'];
      this.getDisplayfileName();
      if (this.documentInfo['fileExtension'] && this.documentInfo['fileExtension'].length > 0) {
        this.documentInfo['fileExtension'].forEach((element, index) => {
          if (index === this.documentInfo['fileExtension'].length - 1) {
            if (this.getMIMEtype(element['type']) !== "") {
              this.acceptedFileType = this.acceptedFileType + this.getMIMEtype(element['type'])
            }
          } else {
            if (this.getMIMEtype(element['type']) !== "") {
              this.acceptedFileType = this.acceptedFileType + this.getMIMEtype(element['type']) + ","
            }
          }
        });
      }
    }
    this.registerEventForInterruptCase()
  }


  async uploadFileOverride(fileUploaded, index) {
    if (this.appUtilityConfig.isMobileResolution) {
      const method = await this.alertCtrl.create({
        message: "Are you sure, need to override the previous file?",
        buttons: [{
          text: 'Cancel',
          cssClass: 'method-color',
          handler: () => {
            console.log("cancel button clicked");
          }
        }, {
          text: 'Ok',
          cssClass: 'method-color',
          handler: () => {
            this.fileOverRideAction(fileUploaded, index)
          }
        }]
      });
      await method.present();
    } else if (!this.appUtilityConfig.isMobileResolution) {
      const dialogConfig = new MatDialogConfig()

      dialogConfig.data = {
        title: 'Are you sure, need to override the previous file?',
        buttonInfo: [
          {
            "name": "Cancel",
            "handler": () => {
              console.log("cancel button clicked");
            }
          },
          {
            "name": "Ok",
            "handler": () => {
              this.fileOverRideAction(fileUploaded, index)
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
  fileOverRideAction(fileUploaded, index) {
    const fileName = this.displayFileName[index]['date']
    const selectedFileSize = this.bytesToSize(fileUploaded.size);
    const filesizeVal = Math.floor(fileUploaded.size / 1024);
    const fileInfo = {}
    fileInfo['fileName'] = fileUploaded.name.split('.')[0];
    fileInfo['fileExtension'] = fileUploaded.name.split('.')[1];
    fileInfo['selectedFileSize'] = fileUploaded.size;
    fileInfo['filesizeVal'] = filesizeVal;
    fileInfo['uploadedFiles'] = fileUploaded;
    if (this.displayFileName[index]['recordCount'] > 0) {
      fileInfo['uploadedFiles']['isFileOverride'] = true;
    } else {
      fileInfo['uploadedFiles']['isFileOverride'] = false;
    }
    this.uploadedFiles[fileName] = {};
    this.uploadedFiles[fileName].dataSize = selectedFileSize;
    this.uploadedFiles[fileName].dataArray = []
    this.uploadedFiles[fileName].dataArray.push(fileInfo)
  }
  daysCalcalculation(event, fileFormat) {
    if (fileFormat["option"] && fileFormat["value"]) {
      if (fileFormat["option"] === "MM" || fileFormat["option"] === "MON" || fileFormat["option"] === "MONTH") {
        let year = this.formatOptionArray.filter(element => element["option"] === "YY" || element["option"] === "YYYY");
        let days = this.getDaysInMonth(fileFormat, year[0]) + 1;
        this.totalsDays = Array(days).fill(0).map((x, i) => i);


        if (this.documentInfo['frequency'] === 'Weekly') {
          this.getNoWeekInMonth(fileFormat, year[0]);
        } else if (this.documentInfo['frequency'] === 'Quaterly') {
          for (let i of this.formatOptionArray) {
            if (i.option === "{0}") {
              i.displayOption = [1, 2, 3, 4];
              break;
            }

          }
        }
      } else if (fileFormat["option"] === "YY" || fileFormat["option"] === "YYYY") {
        this.monthsInString = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        this.totalMonths = Array(13).fill(0).map((x, i) => i);
        let month = this.formatOptionArray.filter(element => element["option"] === "MM" || element["option"] === "MONTH" || element["option"] === "MON");
        if (month[0]["value"]) {
          let days = this.getDaysInMonth(month[0], fileFormat) + 1;
          this.totalsDays = Array(days).fill(0).map((x, i) => i);
        }
        let week = this.formatOptionArray.filter(element => element["option"] === "{0}");
        if (week && month[0]["value"]) {
          this.getNoWeekInMonth(month[0], fileFormat);
        }
       
      }
    }
  }
  daysAlertMsgShown(fileFormat) {
    if (fileFormat["option"] === "DD" || fileFormat["option"] === "{0}") {
      let month = this.formatOptionArray.filter(element => element["option"] === "MM" || element["option"] === "MONTH" || element["option"] === "MON");
      if (!month[0]["value"]) {
        let year = this.formatOptionArray.filter(element => element["option"] === "YY" || element["option"] === "YYYY");
        if (!year[0]["value"]) {
          this.appUtilityConfig.presentToast("Please first Select the Year & Month");
        } else {
          this.appUtilityConfig.presentToast("Please first Select the  Month");
        }
      }
    } else
      if (fileFormat["option"] === "MM" || fileFormat["option"] === "MON" || fileFormat["option"] === "MONTH") {
        let year = this.formatOptionArray.filter(element => (element["option"] === "YY" || element["option"] === "YYYY") && element["value"] !== "");
        if (year.length === 0) {
          this.appUtilityConfig.presentToast("Please first Select the Year");
        }
      }
  }
  getNoWeekInMonth(month, year) {
    for (let i of this.formatOptionArray) {
      if (i.option === "{0}") {
        let selectedMonth;
        if (month["option"] === "MONTH" || month["option"] === "MON") {
          selectedMonth = this.monthsInString.indexOf(month["value"]) + 1;
        } else {
          selectedMonth = month["value"];
        }
        let dateString;
        if (year['value'] < 10) {
          dateString = "200" + year['value'].toString();
        } else if (year['value'] === 100) {
          dateString = "2" + year['value'].toString();
        } else {
          dateString = "20" + year['value'].toString();
        }
        let selectedYear = parseInt(dateString);
        let noOfWeekCount = this.weekCount(selectedMonth, selectedYear);
        i.displayOption = [];
        let countForIndex = 0;
        while (countForIndex < noOfWeekCount) {
          countForIndex += 1;
          i.displayOption.push(countForIndex);
        }
        break;
      }
    }
  }
  getDaysInMonth(month, year) {
    let yearString;
    let selectedMonth;
    let selectedYear;
    if (month["option"] === "MONTH" || month["option"] === "MON") {
      selectedMonth = this.monthsInString.indexOf(month["value"]) + 1;
    } else {
      selectedMonth = month["value"];
    }
      if (year['value'] < 10) {
        yearString = "200" + year['value'].toString();
      } else if (year['value'] === 100) {
        yearString = "2" + year['value'].toString();
      } else {
        yearString = "20" + year['value'].toString();
      }   
      selectedYear = parseInt(yearString);
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }

 async fileUploadRetryAction(event, index) {
    const fileUploaded = event.target.files[0];
    const response =await this.fileValidation(fileUploaded)
    if (response['status'] === "success") {
      const fileName = this.showUploadedFiles[index]['file_name']
      const selectedFileSize = this.bytesToSize(fileUploaded.size);
      const filesizeVal = Math.floor(fileUploaded.size / 1024);
      const fileInfo = {}
      fileInfo['fileName'] = fileUploaded.name.split('.').slice(0, -1).join('.');
      fileInfo['fileExtension'] = fileUploaded.name.split('.').pop();
      fileInfo['selectedFileSize'] = fileUploaded.size;
      fileInfo['filesizeVal'] = filesizeVal;
      fileInfo['uploadedFiles'] = fileUploaded;
      fileInfo["recordId"] = this.showUploadedFiles[index]["id"] ? this.showUploadedFiles[index]["id"] : ""      
      if (!this.uploadedFiles[fileName]) {
        this.uploadedFiles[fileName] = {};
        this.uploadedFiles[fileName].dataArray = []
      }
      
      this.uploadedFiles[fileName].dataSize = selectedFileSize;

    
      this.uploadedFiles[fileName].dataArray.push(fileInfo)
      this.showUploadedFiles[index]["uploadedInfo"] = fileInfo
    

    } else {
      this.showAlert(response['message'])
    }

  }

  async fetchAllData(recordInput) {
    const options = {};
    options['file_name'] = recordInput['file_name'];
    options['obj_document_config_id'] = recordInput['obj_document_config_id'];
    const query = this.queryMakingBasedOnMethodCalled('fetchAllData', options);
    this.dataProviderObject.fileManageDbSelection(query).then(res => {
      if (res['status'] === 'SUCCESS') {
        if (res['records'].length > 0) {
          const data = res['records'];
          this.getCoreUserName(data);
        }
      }
    })
  }

  queryMakingBasedOnMethodCalled(methodCalled, data?) {
    const options = {};
    if (this.selectedObj['serviceObjectDocument'] === 'PouchDB') {
      const selector = {
        '$or': [{ 'data.isRemoved': false }, { 'data.isRemoved': { '$exists': false } }],
      };
      options['dbProvider'] = appConstant.pouchDBStaticName;
      if (methodCalled === 'fetchCurrentDateRecordCount') {
        selector['data.type'] = data['type'];
        selector['data.file_name'] = data['file_name'];
        selector['data.obj_document_config_id'] = this.documentInfo['objDocumentConfigId'];
        const parentIdStr = 'data.' + this.selectedObj['parentType'];
        selector[parentIdStr] = this.selectedObj['parentId'];
        options['selector'] = selector;
        return options
      } else if (methodCalled === 'singleOrMultipleFileUpload') {
        selector['data.type'] = this.selectedObj['documentType'];
        const parentIdStr = 'data.' + this.selectedObj['parentType'];
        selector[parentIdStr] = this.selectedObj['parentId'];
        selector['_id'] = this.selectedObj['documentType'] + '_2_' + data['recordId'];
        options['selector'] = selector;
        return options
      } else {
        selector['data.type'] = this.selectedObj['parentType'] + 'doc';
        const parentType = 'pfm' + this.documentInfo['objectId'];
        selector['data.' + parentType] = this.selectedObj['parentId'];
        selector['data.file_name'] = data['file_name'];
        selector['data.obj_document_config_id'] = data['obj_document_config_id'];
        options['selector'] = selector;
        return options
      }
    } else {
      options['queryFlags'] = { 'include_docs': true, 'include_fields': false }
      options['design_doc'] = 'filemanage_search';
      options['dbProvider'] = appConstant.couchDBStaticName;
      if (methodCalled === 'fetchCurrentDateRecordCount') {
        const fileName = this.appUtilityConfig.makeRegexQuery(data['file_name']);
        options['query'] = 'type:' + data['type'] + ' AND ' + this.selectedObj['parentType'] + ':' + this.selectedObj['parentId'] + ' AND ' + 'isRemoved:' + false + ' AND ' + 'file_name:' + '_' + fileName + ' AND ' + 'document_config_id:' + this.documentInfo['objDocumentConfigId'];
        return options
      } else if (methodCalled === 'singleOrMultipleFileUpload') {
        options['query'] = '_id:' + this.selectedObj['documentType'] + '_2_' + data['recordId'] + ' AND ' + 'type:' + this.selectedObj['documentType'] + ' AND ' + this.selectedObj['parentType'] + ':' + this.selectedObj['parentId'];
        return options
      } else {
        const fileName = this.appUtilityConfig.makeRegexQuery(data['file_name']);
        options['query'] = 'type:' + this.selectedObj['parentType'] + 'doc' + ' AND ' + this.selectedObj['parentType'] + ':' + this.selectedObj['parentId'] + ' AND ' + 'document_config_id:' + data['obj_document_config_id'] + ' AND ' + "file_name:" + '_' + fileName;
        return options
      }
    }
  }

  getCoreUserName(data) {
    const taskList = [];
    data.forEach(dataObject => {
      taskList.push(this.getUserNameAgainstUserId(dataObject).then((res) => {
        if (res['status'] === 'SUCCESS' && res["records"].length > 0) {
          const coreUserObject = res["records"][0];
          dataObject["username"] = coreUserObject["username"];
        }
      }))
    });
    Promise.all(taskList).then(res => {
      const sortData = lodash.orderBy(data, ['createdon', 'display_name'], ['desc', 'asc']);

      setTimeout(() => {
        this.getRetryFileInfo(sortData)
      }, 5000);
 
      this.applicationRef.tick()
    })
  }

  getUserNameAgainstUserId(userObject) {
    if (navigator.onLine) {
      const query = "type: " + this.metaDbconfig.corUsersObject + " AND " + "user_id: " + userObject['lastmodifiedby'];
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
  countWeekdayOccurrencesInMonth(day) {
    return  getWeekOfMonth(day)
  }

  weekCount( month_number,year) {

    // month_number is in the range 1..12

    var firstOfMonth = new Date(year, month_number - 1, 1);
    var lastOfMonth = new Date(year, month_number, 0);

    var used = firstOfMonth.getDay() + lastOfMonth.getDate();

    return Math.ceil( used / 7);
  }

  getQuarterDetail(quarterType, input?) {
    const today = new Date();
    const quarter = Math.floor((today.getMonth() / 3));

    let startFullQuarter;
    if (quarterType === "Current") {
      startFullQuarter = new Date(today.getFullYear(), quarter * 3, 1);
    } else if (quarterType === "Previous") {
      startFullQuarter = new Date(today.getFullYear(), quarter * 3 - 3 * input, 1);
    } else {
      startFullQuarter = new Date(today.getFullYear(), quarter * 3 + 3 * input, 1);
    }
    const endFullQuarter = new Date(startFullQuarter.getFullYear(), startFullQuarter.getMonth() + 3, 0);
    return { 'quarterStart': startFullQuarter, 'quarterEnd': endFullQuarter }

  }

  registerEventForInterruptCase() {
    this.observableListenerUtils.subscribe("uploadfailure", (modified) => {
      let serviceObject;
      if (this.selectedObj['serviceObjectAttachment'] === "PouchDB") {
        serviceObject = this.attachmentDbObject;
      } else {
        serviceObject = this.attachmentCouchDbObject;
      }
      if (modified['type'].includes("att")) {
        return
      }

      serviceObject.save(modified["type"], modified).then(updateResult => {

        this.isLoading = false;

        this.appUtilityConfig.presentToast("Upload has been interrupted")



      })
    })
  }

  ngAfterViewInit() {
    this.attachmentinnerscroll();
  }
  attachmentinnerscroll(){
    var mainbody = document.getElementsByClassName("cs-document-upload")[0]['offsetHeight'];
    var mainHead = document.getElementsByClassName("cs-document-upload-head")[0]['offsetHeight'];
    var dashedhead = document.getElementsByClassName("cs-document-upload-dashed-head")[0]['offsetHeight'];
    var body = document.getElementsByClassName("cs-document-upload-recordlist")[0];
    body['style']['height'] = (mainbody - (mainHead + dashedhead + 8)) + 'px';
}
  
  ngOnDestroy() {
    this.observableListenerUtils.remove("uploadfailure","==")
} 

}
