import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { appUtility } from 'src/core/utils/appUtility';
import { Router, ActivatedRoute } from '@angular/router';
import { objectTableMapping } from 'src/core/pfmmapping/objectTableMapping';
import { couchdbProvider } from 'src/core/db/couchdbProvider';
import { appConfiguration } from 'src/core/utils/appConfiguration';
import { FormControl } from '@angular/forms';
import * as lodash from "lodash";
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { cspfm_data_display } from 'src/core/pipes/cspfm_data_display';
import * as moment from 'moment';
import { cspfmFlatpickrConfig } from 'src/core/utils/cspfmFlatpickrConfig';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
import { DatePipe } from '@angular/common';
import { appConstant } from 'src/core/utils/appConstant';
import { SlickgridPopoverService } from 'src/core/services/slickgridPopover.service';

@Component({
  selector: 'cspfmGlobalSearchMoreActionPage',
  templateUrl: './cspfmGlobalSearchMoreActionPage.html',
  styleUrls: ['./cspfmGlobalSearchMoreActionPage.scss'],
})
export class cspfmGlobalSearchMoreActionPage {
  public isLoading = false;
  public redirectUrl = "/";
  public globalSearchValue;
  public globalSearchResultList: any;
  public objects = new FormControl()
  public results = new FormControl()
  private navigationLayoutConfig = {}
  private globalSearchConfigArray = []
  public objectsList = []
  public overAllResultLength;
  public isFetching = false;
  public totalRecords = [];

  public globalSearchControl = new FormControl()
  public addIconPopoverControl = new FormControl()
  public timeOutValue: any = null;
  public showFilter = false
  public filterQuery: any;

  public filterFields = {
    "objectName": [],
    "createdOn": {
      "isBetweenFlag": false,
      "betweenFields": ['createdOn_from', 'createdOn_to'],
      "date": null
    },
    "lastModifiedOn": {
      "isBetweenFlag": false,
      "betweenFields": ['lastModifiedOn_from', 'lastModifiedOn_to'],
      "date": null
    },
    "createdby": [],
    "lastmodifiedby": []
  }
  public filterFieldsWithoutValue = JSON.parse(JSON.stringify(this.filterFields))
  public currentFilterField = "";
  public result = {
    "objectName": [],
    "corUsers": []
  };


  public filteredResult = {
    "objectName": [],
    "corUsers": []
  };

  public flatpickrListeners: Array<{
    element: HTMLElement;
    eventType: string;
    handler: (event) => any | void;
    option: any;
  }> = [];
  public flatpickrInstance: any;
  public filterApplied = false;
  public showPopUp = false;

  public formatDate = (date, format, locale) => {
    if (format === this.appUtilityConfig.userDatePickerFormat || format === this.appUtilityConfig.userDateTimePickerFormat) {
      return moment(date).format(format);
    }
  }

  public parseDate = (datestr, format) => {
    return moment(datestr, format, true).toDate();
  }

  constructor(public appUtilityConfig: appUtility, public router: Router, public activatRoute: ActivatedRoute, public objectTableMappingObj: objectTableMapping,
    public dbService: couchdbProvider, private appConfig: appConfiguration,public cspfmDataDisplay: cspfm_data_display,
    public observableListenerUtils: cspfmObservableListenerUtils, public cspfmFlatpickrConfig: cspfmFlatpickrConfig, public dialog: MatDialog, public metaDataConfigObj: metaDbConfiguration,
    public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, private datePipe: DatePipe, private slickgridPopoverService: SlickgridPopoverService) {
    this.activatRoute.queryParams.subscribe(params => {
      if (Object.keys(params).length === 0 && params.constructor === Object) {
        this.appConfig.configuration.isGlobalSearchEnabled = false
        console.log("list query params skipped");
        return
      }
      document.body.click() //for closing the autocomplete pop up
      if (params["redirectUrl"]) {
        this.redirectUrl = params["redirectUrl"]
      }

      this.globalSearchConfigArray = this.appConfig.configuration.globalSearchConfigInfo

      this.globalSearchConfigArray.forEach(globalSearchConfigObj => {
        this.navigationLayoutConfig[globalSearchConfigObj['objectName']] = globalSearchConfigObj['navigationInfo']['layoutName']
        globalSearchConfigObj['isChecked'] = false
      })

      this.filterApplied = JSON.parse(params['filterApplied'])
      this.result = JSON.parse(params['filterViewResultObj'])
      this.filteredResult = JSON.parse(params['filterViewResultObj'])

      if (this.filterApplied) {
        this.filterFields = JSON.parse(params['filterFields'])
      }

      if (!this.filterApplied) {
        this.result['objectName'] = this.globalSearchConfigArray
        this.filteredResult['objectName'] = this.globalSearchConfigArray

        this.result['corUsers'].forEach(element => {
          element['isCreatedByChecked'] = false
          element['isLastModifiedByChecked'] = false
        })

        this.filteredResult['corUsers'] = this.result['corUsers']
      }


      this.globalSearchResultList = {}
      this.appConfig.configuration.isGlobalSearchEnabled = false

      this.globalSearchValue = params['searchText']
      this.totalRecords = JSON.parse(params['totalRecords'])
      this.makeGlobalSearchDisplayList(this.totalRecords)

    });
  }

  ngOnInit() {
    this.observableListenerUtils.subscribe("clearGlobalSearch", (value) => {
      if (this.globalSearchControl.value !== "" || this.globalSearchControl.value !== null) {
        this.globalSearchControl.reset()
      }
    })

    this.globalSearchControl.valueChanges.subscribe(userInput => {
      if ((this.globalSearchControl.value !== "" || this.globalSearchControl.value !== null) && this.globalSearchValue !== this.globalSearchControl.value) {
        this.globalSearchOnChange(userInput);
      }
    })

    this.addIconPopoverControl.valueChanges.subscribe(userInput => {
      console.log("Global search onChange", userInput)

      if (this.currentFilterField === 'objectName') {
        this.filteredResult['objectName'] = this.result['objectName'].filter(option => option['objectDisplayName'].toLowerCase().includes(userInput.toLowerCase()));
      } else if (this.currentFilterField === 'createdby' || this.currentFilterField === 'lastmodifiedby') {
        this.filteredResult['corUsers'] = this.result['corUsers'].filter(option => option['username'].toLowerCase().includes(userInput.toLowerCase()));
      }
    })
  }


  keyPressAlphaNumeric() {
      return true;
  }

  keyPressEnterAction() {
    if (this.globalSearchControl.value !== "" || this.globalSearchControl.value !== null) {
      if (this.globalSearchControl.value.trim().length === 2) {
        this.fetchGlobalSearchResult(this.globalSearchControl.value, true)
      }
    }
  }

  clearSearchText() {
    this.globalSearchValue = ''
    this.globalSearchControl.setValue("")
    this.globalSearchResultList = {}
    this.objectsList = []
    this.totalRecords = []
  }

  globalSearchOnChange(inputValue) {

    if(inputValue===''){
      this.globalSearchValue = '' 
    }
    
    window.clearTimeout(this.timeOutValue);
    this.timeOutValue = window.setTimeout(() => {
      this.fetchGlobalSearchResult(inputValue)
    }, 1000);
  }

  fetchGlobalSearchResult(inputValue,isEnterPressed?) {

    this.globalSearchResultList = {}
    this.objectsList = []
    this.totalRecords = []

    if (typeof inputValue !== "string") {
      return
    }
    if(!isEnterPressed && inputValue.trim().length < 3){
      return
    } 
    this.globalSearchValue = inputValue.trim()

    if (this.globalSearchValue === '') {
      this.isFetching = false
      return
    }

    let searchText = this.globalSearchValue.toLowerCase();
    const format = /[` !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/~?]/;
    var searchTextFinal = ""
    if (format.test(searchText)) {
      for (var i = 0; i < searchText.length; i++) {
        if (format.test(searchText.charAt(i))) {
          searchTextFinal = searchTextFinal + "\\" + searchText.charAt(i)
        } else {
          searchTextFinal = searchTextFinal + searchText.charAt(i)
        }
      }
    } else {
      searchTextFinal = searchText
    }
    searchText = searchTextFinal + "*"

    let globalSearchQuery = ''

    this.isFetching = true

    if (this.globalSearchConfigArray.length > 0) {
      this.globalSearchConfigArray.forEach(searchObj => {
        let objectId = this.objectTableMappingObj.mappingDetail[searchObj['objectName']]

        searchObj['searchFields'].forEach(searchField => {
          var query = ''
          if (searchField['fieldType'] === 'MULTISELECT' || searchField['fieldType'] === 'CHECKBOX' || searchField['fieldType'] === 'RADIO'
            || searchField['fieldType'] === 'DROPDOWN' || searchField['fieldType'] === 'STATUSWORKFLOW') {
            let mappingDetailsJSON = searchField['mappingDetails']
            let reversedJSON = lodash.invert(mappingDetailsJSON)
           

            let displayValuesArray = Object.keys(reversedJSON)
            var selectionFieldQuery = ''
            displayValuesArray.forEach(displayValue => {
              if ((displayValue.toLowerCase()).includes(this.globalSearchValue.toLowerCase())) {
                let mappingKey = reversedJSON[displayValue].toLowerCase()
                if (selectionFieldQuery === '') {
                  selectionFieldQuery = objectId + "_" + searchField['fieldName'] + ":" + "_*" + mappingKey + "*"
                } else {
                  selectionFieldQuery = selectionFieldQuery + ' OR ' + objectId + "_" + searchField['fieldName'] + ":" + "_*" + mappingKey + "*"
                }
              }
            })

            query = selectionFieldQuery
          } else {
            query = objectId + "_" + searchField['fieldName'] + ":" + "_*" + searchText
          }

          if (globalSearchQuery === '') {
            globalSearchQuery = query
          } else if (query) {
            globalSearchQuery = globalSearchQuery + ' OR ' + query
          }
        })
      })
      if (this.filterApplied && this.filterQuery && this.filterQuery.length > 0) {
        globalSearchQuery = "( " + globalSearchQuery + " )" + " AND " + this.filterQuery
      }

      let searchDocName = "globalsearch_" + String(this.appConfig.configuration.appId)

      this.dbService.fetchGlobalSearchRecords(globalSearchQuery, searchDocName, this.globalSearchValue).then(res => {
        if (this.globalSearchValue === '' && this.isFetching) {
          this.isFetching = false
        }

        if (res['status'] === 'SUCCESS' && res['searchKey'] === this.globalSearchValue) {
         
          this.isFetching = false
          this.totalRecords = res['records']

          if (res['records'].length > 0) {
            this.makeGlobalSearchDisplayList(res['records'])
          } else {
            this.appUtilityConfig.presentToast('No records matching for your search criteria')
          }
        } else {
          console.log("Global search error ==> " + res['message']);
        }
      })
    }
  }

  makeGlobalSearchDisplayList(recordsArray) {
    let searchText = this.globalSearchValue
    for (let element of recordsArray) {
      if (!element['type']) {
        continue;
      }

      let objectName = Object.keys(this.objectTableMappingObj.mappingDetail).find(key =>
        this.objectTableMappingObj.mappingDetail[key] === element['type'])

      let searchFieldObj = this.globalSearchConfigArray.filter(fieldInfo => fieldInfo.objectName === objectName)
      let searchObj = searchFieldObj[0]

      var fieldObjArray = []

      var recordJSON = {
        'record': element,
        'objectName': objectName,
        'fieldObjArray': fieldObjArray,
        'primaryFieldKey': '',
        'createdUsername': 'Unknown user',
        'lastmodifiedUsername': 'Unknown user',
        'createdByUserImg': this.appUtilityConfig.getUserImageURL(element['createdby']),
        'lastModifiedByUserImg': this.appUtilityConfig.getUserImageURL(element['lastmodifiedby'])
      }

      let createdByObj = this.result['corUsers'].filter(coruserObj => coruserObj.user_id === element['createdby'])
      if (createdByObj && createdByObj.length > 0) {
        recordJSON['createdUsername'] = createdByObj[0]['username']
      }

      let lastmodifiedByObj = this.result['corUsers'].filter(coruserObj => coruserObj.user_id === element['lastmodifiedby'])
      if (lastmodifiedByObj && lastmodifiedByObj.length > 0) {
        recordJSON['lastmodifiedUsername'] = lastmodifiedByObj[0]['username']
      }

      searchObj['searchFields'].forEach(fieldObj => {
        var resultValue;

        if (fieldObj['fieldType'] === 'DATE') {
          fieldObj['dateFormat'] = this.appUtilityConfig.userDateFormat
        } else if (fieldObj['fieldType'] === 'TIMESTAMP') {
          fieldObj['dateFormat'] = this.appUtilityConfig.userDateTimeFormat
        }

        resultValue = this.cspfmDataDisplay.transform(element, fieldObj)

        if (this.slickgridPopoverService.getFieldType(fieldObj) === 'URL') {
          let displayNameArray = (resultValue.display || '').split(',');
          let urlArray = (resultValue.url || '').split(',');
          let value = '';
          for (let index = 0; index < urlArray.length; index++) {
            value += displayNameArray[index] + ', URL-' + urlArray[index];
            if (index < urlArray.length - 1) {
              value += ' | ';
            }
          }
          resultValue = value;
        }

        var fieldObjJSON = {
          'fieldDisplayName': '',
          'fieldDisplayValue': '',
        }

        if (fieldObj['fieldType'] === 'PRIMARY') {
          recordJSON['primaryFieldKey'] = fieldObj['fieldName'] 
        } else if (fieldObj['fieldType'] === 'BOOLEAN' || (resultValue && (fieldObj['fieldType'] === 'NUMBER' || fieldObj['fieldType'] === 'DECIMAL'))) {
          if ((String(resultValue).toLowerCase()).includes(searchText.toLowerCase())) {
            fieldObjJSON['fieldDisplayName'] = fieldObj['fieldDisplayName']
            fieldObjJSON['fieldDisplayValue'] = String(resultValue)
            fieldObjArray.push(fieldObjJSON)
          }
        } else {
          if (resultValue && fieldObj['fieldType'] === 'CURRENCY') {
            resultValue = resultValue.replaceAll(",", "")
          }
          if (resultValue && ((resultValue.toLowerCase()).includes(searchText.toLowerCase()))) {
            fieldObjJSON['fieldDisplayName'] = fieldObj['fieldDisplayName']
            fieldObjJSON['fieldDisplayValue'] = resultValue
            fieldObjArray.push(fieldObjJSON)
          }
        }
      });

      if (fieldObjArray.length === 0) {
        if (element[recordJSON['primaryFieldKey']] && (element[recordJSON['primaryFieldKey']].toLowerCase().includes(searchText.toLowerCase()))) {
          fieldObjArray.push({ 'fieldDisplayName': '', 'fieldDisplayValue': '' })
        } else {
          continue;
        }
      }

      recordJSON['fieldObjArray'] = fieldObjArray


      if (!this.globalSearchResultList[objectName]) {
        this.globalSearchResultList[objectName] = {}
        this.globalSearchResultList[objectName]['objectDisplayName'] = searchObj['objectDisplayName']
        this.globalSearchResultList[objectName]['records'] = []
        this.objectsList.push(objectName)
      }

      this.globalSearchResultList[objectName]['records'].push(recordJSON)
    }

    if (Object.keys(this.globalSearchResultList).length !== 0) {
      var showToast = true
      Object.keys(this.globalSearchResultList).forEach(objectKey => {
        if (this.globalSearchResultList[objectKey]['records'].length > 0) {
          showToast = false
        }
      })

      if (showToast) {
        this.appUtilityConfig.presentToast('No records matching for your search criteria')
      }
    } else {
      this.appUtilityConfig.presentToast('No records matching for your search criteria')
    }
  }


  onItemClick(data) {
    this.appConfig.configuration.isGlobalSearchEnabled = true

    const queryParamsRouting = {
      id: data["record"]['id']
    };
    let navigationURL = "/menu/" + this.navigationLayoutConfig[data["objectName"]]

    if (!this.appUtilityConfig.checkPageAlreadyInStack(navigationURL)) {
      queryParamsRouting['redirectUrl'] = "/menu/cspfmGlobalSearchMoreActionPage"
    }
    this.router.navigate([navigationURL], {
      queryParams: queryParamsRouting,
      skipLocationChange: true
    });
  }

  toggleFilter() {
    this.showFilter = !this.showFilter
  }
  
  remove(object, fieldName) {
    let indexkey = "";
    var filterPopupFieldName = ""
    if (fieldName === 'objectName') {
      object['isChecked'] = false;
      indexkey = "objectName";
      filterPopupFieldName = "objectName"
    } else if (fieldName === 'createdby') {
      object['isCreatedByChecked'] = false;
      indexkey = "id";
      filterPopupFieldName = "corUsers"
    } else if (fieldName === 'lastmodifiedby') {
      object['isLastModifiedByChecked'] = false;
      indexkey = "id";
      filterPopupFieldName = "corUsers"
    }

    var index = this.filterFields[fieldName].findIndex((element) => element[indexkey] === object[indexkey]);
    if (index !== undefined && index >= 0) {
      this.filterFields[fieldName].splice(index, 1);
    }

    var filterPopupFieldIndex = this.result[filterPopupFieldName].findIndex((element) => element[indexkey] === object[indexkey])

    if (filterPopupFieldIndex >= 0) {
      if(fieldName === "objectName") {
        this.result[filterPopupFieldName][filterPopupFieldIndex]['isChecked'] = false
      } else if (fieldName === "createdby") {
        this.result[filterPopupFieldName][filterPopupFieldIndex]['isCreatedByChecked'] = false
      } else if (fieldName === "lastmodifiedby") {
        this.result[filterPopupFieldName][filterPopupFieldIndex]['isLastModifiedByChecked'] = false
      }

      this.filteredResult = this.result
    }
  }

  toggleBetweenFields(fieldName) {
    this.filterFields[fieldName]['isBetweenFlag'] = !this.filterFields[fieldName]['isBetweenFlag']
    if (!this.filterFields[fieldName][fieldName + '_from'] && !this.filterFields[fieldName][fieldName + '_to']) {
      this.filterFields[fieldName][fieldName + '_from'] = ""
      this.filterFields[fieldName][fieldName + '_to'] = ""
    }
    if (this.filterFields[fieldName]['isBetweenFlag']) {
      this.filterFields[fieldName]['date'] = ""
    } else {
      this.filterFields[fieldName][fieldName + '_from'] = ""
      this.filterFields[fieldName][fieldName + '_to'] = ""
    }
  }
  public flatpickerInstances = {};
  flatpickrOnReady(event, objectName, fieldName) {
    var format;
    this.flatpickerInstances[objectName + '#' + fieldName] = event.instance
    event.instance['params'] = {
      'field': objectName + '_' + fieldName
    }
    event.instance.config.formatDate = this.formatDate;
    event.instance.config.parseDate = this.parseDate;
    event.instance.config.altInput = true;
    if (event.instance.config.enableTime) {
      format = this.appUtilityConfig.userDateTimePickerFormat;
    } else {
      format = this.appUtilityConfig.userDatePickerFormat;
    }
    event.instance.config.dateFormat = format;
    event.instance.config.altFormat = format;
  }
  flatpickrOnOpen(event, objectName, fieldName) {
    this.flatpickrInstance = this.flatpickerInstances[objectName + '#' + fieldName];
    if (this.filterFields[objectName][fieldName] !== null && this.filterFields[objectName][fieldName] !== '') {
      var format = (event.instance.config.enableTime) ? this.appUtilityConfig.userDateTimePickerFormat : this.appUtilityConfig.userDatePickerFormat;
      var date = moment(this.filterFields[objectName][fieldName], format).toDate();
      event.instance.setDate(date);
      event.instance.params['initialValue'] = moment(date).format(format);
    } else {
      event.instance.params['initialValue'] = "";
      event.instance.clear();
    }
  }
  flatpickrOnClose(event, objectName, fieldName) {
    if (event.instance['params']['field'] === this.flatpickrInstance['params']['field']) {
      this.flatpickrInstance = undefined
    }
  }
  flatpickrOnChange(event, objectName, filedName) {
    if (event.dateString) {
      this.filterFields[objectName][filedName] = event.dateString;
    } else {
      this.filterFields[objectName][filedName] = moment(new Date()).tz(this.appUtilityConfig.userTimeZone).format();
    }
  }
  closeClick(objectName, fieldName) {
    this.filterFields[objectName][fieldName] = '';
  }
  flatpickrInputElementEvents(event, objectName, fieldName) {
    var type = event.type;
    const flatpickerInstance = this.flatpickerInstances[objectName + "#" + fieldName]
    if (type === "click") {
      setTimeout(() => {
        flatpickerInstance.open()
      }, 0);
    } else if (type === "keyup") {
      flatpickerInstance.close()
    }
  }
  addIconClick(event, fieldName) {
    this.currentFilterField = fieldName
    if (fieldName === 'objectName') {
      this.filteredResult['objectName'] = this.result['objectName']
    } else {
      this.filteredResult['corUsers'] = this.result['corUsers']
    }
    this.addIconPopoverControl.setValue("")
    this.showPopUp = true
  }

  @HostListener("click") onClick() {
    this.showPopUp = false
  }

  clearMessageConfirmAlert() {
   // if (this.filterApplied) { as per QA team input this changes was made
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      title: 'Are you sure want to Clear this filter fields value?',
      buttonInfo: [
        { "name": "No" },
        {
          "name": "Yes",
          "handler": () => {
            console.log("Handler called")
            this.clearAction();
          }
        }
      ],
      parentContext: this,
      type: "Alert"
    };
    dialogConfig.autoFocus = false
    this.dialog.open(cspfmAlertDialog, dialogConfig);
  }
  
  clearAction() {
    this.filterFields['objectName'].forEach(element => {
      element['isChecked'] = false
    })
    this.filterFields['createdby'].forEach(element => {
      element['isCreatedByChecked'] = false
      element['isLastModifiedByChecked'] = false
    })
    this.filterFields['lastmodifiedby'].forEach(element => {
      element['isCreatedByChecked'] = false
      element['isLastModifiedByChecked'] = false
    })
    this.filterFields = JSON.parse(JSON.stringify(this.filterFieldsWithoutValue))
    if (this.filterApplied) {
      this.filterApplied = false
      this.globalSearchResultList = {}
      this.objectsList = []
      this.totalRecords = []
      this.filterQuery = ''
      if (this.globalSearchValue !== '') {
        this.fetchGlobalSearchResult(this.globalSearchValue)
      }

      this.result['objectName'] = this.globalSearchConfigArray

      this.result['corUsers'].forEach(element => {
        element['isCreatedByChecked'] = false
        element['isLastModifiedByChecked'] = false
      })

      this.filteredResult = this.result
    }
  }

  applyAction() {
    this.filterQuery = ''
    this.filterFields['objectName'].forEach(element => {
      if (!this.filterQuery) {
        this.filterQuery = "( " + this.objectTableMappingObj.mappingDetail[element['objectName']]
      } else {
        this.filterQuery += " " + this.objectTableMappingObj.mappingDetail[element['objectName']]
      }
    })
    this.filterQuery = (this.filterQuery && this.filterQuery.length) > 0 ? this.makeQuery("", "type", this.filterQuery) + " )" : ""
    this.filterQuery = this.makeCreatedByAndLastModifiedByQuery("createdby", "user_id", this.filterQuery)
    this.filterQuery = this.makeCreatedByAndLastModifiedByQuery("lastmodifiedby", "user_id", this.filterQuery)
    this.filterQuery = this.makeDateFieldQuery(this.filterFields['createdOn'], 'createdon', this.filterQuery, 'DATETIME')
    this.filterQuery = this.makeDateFieldQuery(this.filterFields['lastModifiedOn'], 'lastmodifiedon', this.filterQuery, 'DATETIME')

    if (this.filterQuery && this.filterQuery !== "") {
      this.filterApplied = true;
    } else {
      this.filterApplied = false;
      this.appUtilityConfig.presentToast("No filter applied.")
    }
    this.fetchGlobalSearchResult(this.globalSearchValue)
  }

  closeFilterView() {
    this.showFilter = false
  }

  makeCreatedByAndLastModifiedByQuery(fieldName, key, filterQuery) {
    var query: any;
    this.filterFields[fieldName].forEach(element => {
      if (!query) {
        query = "( " + element[key]
      } else {
        query += " " + element[key]
      }
    })
    return (query && query.length > 0) ? this.makeQuery(filterQuery, fieldName, query) + " )" : filterQuery
  }

  makeDateFieldQuery(object, fieldName, filterQuery, fieldType) {
    var query: any;
    let maxDateMillis = 0;
    let minDateMillis = 0;

    if (object['isBetweenFlag']) {
      var fromDate: any;
      var toDate: any;

      if ((!object[object['betweenFields'][0]] && object[object['betweenFields'][0]] === "") &&
        (!object[object['betweenFields'][1]] && object[object['betweenFields'][1]] === "")) {
        return filterQuery
      }
      if ((!object[object['betweenFields'][0]] || object[object['betweenFields'][0]] === "") ||
        (!object[object['betweenFields'][1]] || object[object['betweenFields'][1]] === "")) {
          this.appUtilityConfig.presentToast("Invalid from and to date selected")
        return
      }

      if (fieldType === 'DATE') {
        let fromDateObj = moment(object[object['betweenFields'][0]], this.appUtilityConfig.userDatePickerFormat).toDate()
        let minValue = new Date(this.datePipe.transform(fromDateObj, appConstant.orgTimeZoneDateFormat) + "T00:00:00.000" + this.appUtilityConfig.orgZoneOffsetValueWithFormat)
        minDateMillis = minValue.getTime()

        let toDateObj = moment(object[object['betweenFields'][1]], this.appUtilityConfig.userDatePickerFormat).toDate()
        let maxValue = new Date(this.datePipe.transform(toDateObj, appConstant.orgTimeZoneDateFormat) + "T23:59:59.999" + this.appUtilityConfig.orgZoneOffsetValueWithFormat)
        maxDateMillis = maxValue.getTime()
      } else {
        fromDate = moment(object[object['betweenFields'][0]], this.appUtilityConfig.userDateTimePickerFormat).toDate()
        toDate = moment(object[object['betweenFields'][1]], this.appUtilityConfig.userDateTimePickerFormat).toDate()

        minDateMillis = this.getTimeWithoutSeconds(fromDate, 'min').getTime();
        maxDateMillis = this.getTimeWithoutSeconds(toDate, 'max').getTime();
      }

      query = "[ " + minDateMillis + " TO " + maxDateMillis + " ]"
    } else if (object['date'] && object['date'] !== "") {
      var fieldValue: any;
      if (fieldType === 'DATE') {
        fieldValue = moment(object['date'], this.appUtilityConfig.userDatePickerFormat).toDate()
        let minValue = new Date(this.datePipe.transform(fieldValue, appConstant.orgTimeZoneDateFormat) + "T00:00:00.000" + this.appUtilityConfig.orgZoneOffsetValueWithFormat)
        minDateMillis = minValue.getTime()

        let maxValue = new Date(this.datePipe.transform(fieldValue, appConstant.orgTimeZoneDateFormat) + "T23:59:59.999" + this.appUtilityConfig.orgZoneOffsetValueWithFormat)
        maxDateMillis = maxValue.getTime()
      } else {
        fieldValue = moment(object['date'], this.appUtilityConfig.userDateTimePickerFormat).toDate()
        minDateMillis = this.getTimeWithoutSeconds(fieldValue, 'min').getTime();
        maxDateMillis = this.getTimeWithoutSeconds(fieldValue, 'max').getTime();
      }

      query = "[ " + minDateMillis + " TO " + maxDateMillis + " ]"
    }
    return (query && query.length > 0) ? this.makeQuery(filterQuery, fieldName, query) : filterQuery
  }

  getTimeWithoutSeconds(dateTimestamp, seconds: 'min' | 'max'): Date {
    let dateObject = new Date(dateTimestamp);
    if (seconds === 'min') {
      dateObject.setSeconds(0, 0);
    } else if (seconds === 'max') {
      dateObject.setSeconds(59, 999);
    }
    return dateObject;
  }

  makeQuery(query, objectKey, fieldValue) {
    if (query.length === 0) {
      query = query + objectKey + ":" + fieldValue
    } else {
      query = query + " AND " + objectKey + ":" + fieldValue
    }
    return query
  }
  popOverItemSelection(option) {
    switch (this.currentFilterField) {
      case "objectName":
        option['isChecked'] = !option['isChecked']
        this.addOrRemoveItem(option['isChecked'], option)
        break;
      case "createdby":
        option['isCreatedByChecked'] = !option['isCreatedByChecked']
        this.addOrRemoveItem(option['isCreatedByChecked'], option)
        break;
      case "lastmodifiedby":
        option['isLastModifiedByChecked'] = !option['isLastModifiedByChecked']
        this.addOrRemoveItem(option['isLastModifiedByChecked'], option)
        break;
      default:
        break;
    }
  }

  addOrRemoveItem(flag, option) {
    if (flag) {
      this.filterFields[this.currentFilterField].splice(0, 0, option);
    } else {
      let indexkey = "";
      if (this.currentFilterField === "objectName") {
        indexkey = "objectName";
      } else {
        indexkey = "id";
      }
      var index = this.filterFields[this.currentFilterField].findIndex(
        (element) => element[indexkey] === option[indexkey]);

      if (index!==undefined && index >= 0) {
        this.filterFields[this.currentFilterField].splice(index, 1);
      }
    }
  }

  
  backButtonOnclick() {
    this.router.navigate([this.redirectUrl], {
      skipLocationChange: true
    });
  }
  


  ngOnDestroy() {
    this.appConfig.configuration.isGlobalSearchEnabled = true
    console.log("destroy")
  }


  @ViewChild('scrollContentFilterObject') scrollFilterObject: ElementRef;
  @ViewChild('scrollContentFilterObjectCreatedBy') scrollFilterObjectCreatedBy: ElementRef;
  @ViewChild('scrollContentFilterObjectModifiedBy') scrollFilterObjectModifiedBy: ElementRef;

  public onClickScrollFilterObjectRight(): void {
    this.scrollFilterObject.nativeElement.scrollTo(
      {
        left: this.scrollFilterObject.nativeElement.scrollLeft + 150,
        behavior: 'smooth'
      });
  }
  public onClickScrollFilterObjectLeft(): void {
    this.scrollFilterObject.nativeElement.scrollTo(
      {
        left: this.scrollFilterObject.nativeElement.scrollLeft - 150,
        behavior: 'smooth'
      });
  }
  public onClickScrollFilterCreatedByLeft(): void {
    this.scrollFilterObjectCreatedBy.nativeElement.scrollTo(
      {
        left: this.scrollFilterObjectCreatedBy.nativeElement.scrollLeft - 150,
        behavior: 'smooth'
      });
  }

  public onClickScrollFilterCreatedByRight(): void {
    this.scrollFilterObjectCreatedBy.nativeElement.scrollTo(
      {
        left: this.scrollFilterObjectCreatedBy.nativeElement.scrollLeft + 150,
        behavior: 'smooth'
      });
  }

  public onClickScrollFilterModifiedByLeft(): void {
    this.scrollFilterObjectModifiedBy.nativeElement.scrollTo(
      {
        left: this.scrollFilterObjectModifiedBy.nativeElement.scrollLeft - 150,
        behavior: 'smooth'
      });
  }

  public onClickScrollFilterModifiedByRight(): void {
    this.scrollFilterObjectModifiedBy.nativeElement.scrollTo(
      {
        left: this.scrollFilterObjectModifiedBy.nativeElement.scrollLeft + 150,
        behavior: 'smooth'
      });
  }
}

