import { Injectable } from "@angular/core";
 import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
 import { cspfmAlertDialog } from "../components/cspfmAlertDialog/cspfmAlertDialog";
 import { FilterFieldInfo, BetweenValue, FieldDataType, MultiChoose, LookupChoose } from "../models/cspfmFilterFieldInfo.type";
 import { RollupType } from '../models/cspfmRollupType.enum';
 import { FormulaType } from '../models/cspfmFormulaType.enum';
 import { ObjectHierarchy } from '../models/cspfmObjectHierarchy.type';
 import { DataFieldType } from '../models/cspfmFieldType.enum';
 import * as moment from 'moment';
 import * as lodash from 'lodash';
 import { DatePipe } from '@angular/common';
 import { appUtility } from '../utils/appUtility';
 import { appConstant } from '../utils/appConstant';
 import { FilterSectionDetail } from '../models/cspfmFilterDetails.type';
 import { objectTableMapping } from '../pfmmapping/objectTableMapping';
 import { lookupFieldMapping } from '../pfmmapping/lookupFieldMapping';
 import { TranslateService } from "@ngx-translate/core";
 
 @Injectable({
   providedIn: "root"
 })
 export class cspfmListFilterUtils {
   constructor(private matDialog: MatDialog, private datePipe: DatePipe, private appUtilityConfig: appUtility, private objectTableMapping: objectTableMapping, private lookupFieldMapping: lookupFieldMapping, private translate : TranslateService) {
 
   }
 
   makeQuery(filterSectionDetail: FilterSectionDetail, provider: "CouchDB" | "PouchDB" | "JsonDB") {
     filterSectionDetail['filterAppliedFields'] = [];
     filterSectionDetail['isAllRequiredFieldFilled'] = true;
     Object.keys(filterSectionDetail['reverseHierarchy']).forEach(rootPath => {
       if (filterSectionDetail['reverseHierarchy'][rootPath]) {
         filterSectionDetail['reverseHierarchy'][rootPath]['options'] = ''
         filterSectionDetail['reverseHierarchy'][rootPath]['options_formula'] = ''
         filterSectionDetail['reverseHierarchy'][rootPath]['options_rollup'] = ''
       }
     })
     Object.keys(filterSectionDetail['filterFields']).forEach(filterFieldKey => {
       let filterFieldInfo = filterSectionDetail['filterFields'][filterFieldKey]
       let rootPath = filterFieldInfo['rootPath'];
       filterFieldInfo['querySet'] = {
         'offline': null,
         'online': null,
         'json': null
       }
 
  if (filterFieldInfo["fieldType"] === DataFieldType.text ||
        filterFieldInfo["fieldType"] === DataFieldType.textarea ||
        filterFieldInfo["fieldType"] === DataFieldType.autonumber ||
        filterFieldInfo["fieldType"] === DataFieldType.url ||
        filterFieldInfo["fieldType"] === DataFieldType.email ||
        (filterFieldInfo["fieldType"] === DataFieldType.formula && filterFieldInfo["formulaType"] === FormulaType.text) ||
        (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && filterFieldInfo["rollupType"] === RollupType.text)) {
        this.makeQueryForStringFields(filterSectionDetail, filterFieldInfo, provider);
      } else if (
        filterFieldInfo["fieldType"] === DataFieldType.checkbox ||
        filterFieldInfo["fieldType"] === DataFieldType.multiselect ||
        filterFieldInfo["fieldType"] === DataFieldType.dropdown ||
        filterFieldInfo["fieldType"] === DataFieldType.radio) {
        this.makeQueryForMultiselectFields(filterSectionDetail, filterFieldInfo, provider);
      } else if (
        filterFieldInfo["fieldType"] === DataFieldType.boolean ||
        (filterFieldInfo["fieldType"] === DataFieldType.formula && filterFieldInfo["formulaType"] === FormulaType.boolean) ||
        (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && filterFieldInfo["rollupType"] === RollupType.boolean)
      ) {
        this.makeQueryForBooleanFields(filterSectionDetail, filterFieldInfo, provider);
      } else if (filterFieldInfo["fieldType"] === DataFieldType.commonlookup) {
        // need to implement
      } else if (filterFieldInfo["fieldType"] === DataFieldType.lookup) {
        this.makeQueryForLookupFields(filterSectionDetail, filterFieldInfo, provider);
      } else if (filterFieldInfo["fieldType"] === DataFieldType.masterdetail) {
        this.makeQueryForMasterLookupFields(filterSectionDetail, filterFieldInfo, provider);
      } else if (
        filterFieldInfo["fieldType"] === DataFieldType.currency ||
        filterFieldInfo["fieldType"] === DataFieldType.decimal ||
        filterFieldInfo["fieldType"] === DataFieldType.number ||
        (filterFieldInfo["fieldType"] === DataFieldType.formula && (filterFieldInfo["formulaType"] === FormulaType.number || filterFieldInfo["formulaType"] === FormulaType.currency)) ||
        (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && (filterFieldInfo["rollupType"] === RollupType.number || filterFieldInfo["rollupType"] === RollupType.currency))
      ) {
        this.makeQueryForNumberFields(filterSectionDetail, filterFieldInfo, provider)
      } else if (filterFieldInfo["fieldType"] === DataFieldType.date ||
        filterFieldInfo["fieldType"] === DataFieldType.timestamp ||
        (filterFieldInfo["fieldType"] === DataFieldType.formula && filterFieldInfo["formulaType"] === FormulaType.date || filterFieldInfo["formulaType"] === FormulaType.timestamp) ||
        (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && filterFieldInfo["rollupType"] === RollupType.date || filterFieldInfo["rollupType"] === RollupType.timestamp)) {
        this.makeQueryForDateTimeFields(filterSectionDetail, filterFieldInfo, provider)
      }

      this.assignQueryWithHierarchy(filterSectionDetail, filterFieldKey, rootPath, provider)
    });

    let uniqueReverseJson = {};
    let reverseHierarchyTemp = JSON.parse(JSON.stringify(filterSectionDetail['reverseHierarchy']))
    Object.keys(reverseHierarchyTemp).reverse().forEach(reverseJsonKey => {
      if (reverseHierarchyTemp[reverseJsonKey]['options'] || reverseHierarchyTemp[reverseJsonKey]['options_formula'] || reverseHierarchyTemp[reverseJsonKey]['options_rollup']) {
       if (!uniqueReverseJson[reverseJsonKey] && reverseJsonKey.includes('$$')) {
         let keyInExistingHierarchy = Object.keys(uniqueReverseJson).filter(key => {
            return key.startsWith(reverseJsonKey);
          })
          if (keyInExistingHierarchy.length > 0) {
            let remainingPath = keyInExistingHierarchy[0].replace(reverseJsonKey, '');
            if (remainingPath.startsWith('$$')) {
              remainingPath = remainingPath.substring(2);
            }
            let index = remainingPath.split("$$").length;
            this.makeInnerObjectOptions(index, uniqueReverseJson[keyInExistingHierarchy[0]], reverseHierarchyTemp[reverseJsonKey])
          } else {
            uniqueReverseJson[reverseJsonKey] = reverseHierarchyTemp[reverseJsonKey];
          }
        }
        if(!reverseJsonKey.includes('$$')){
         uniqueReverseJson[reverseJsonKey] = reverseHierarchyTemp[reverseJsonKey];
       }
      }
    })
    filterSectionDetail['queryReverseHierarchy'] = JSON.parse(JSON.stringify(uniqueReverseJson))
  }

  makeInnerObjectOptions(index: number, mainHierarchy, tempHierarchy) {
    if (index > 0) {
      this.makeInnerObjectOptions(index - 1, mainHierarchy['childObject'][0], tempHierarchy)
    } else {
      if (mainHierarchy) {
        mainHierarchy['options'] = tempHierarchy['options']
        mainHierarchy['options_formula'] = tempHierarchy['options_formula']
        mainHierarchy['options_rollup'] = tempHierarchy['options_rollup']
      }
    }
  }

  assignQueryWithHierarchy(filterSectionDetail: FilterSectionDetail, filterFieldKey: string, rootPath: string, provider: "CouchDB" | "PouchDB" | "JsonDB") {
    let filterFieldInfo: FilterFieldInfo = filterSectionDetail['filterFields'][filterFieldKey]
    if (provider === 'CouchDB') {
      if (filterFieldInfo['querySet']['online']) {
        if (rootPath && filterSectionDetail['reverseHierarchy'][rootPath]) {
          if (filterFieldInfo['fieldType'] === 'FORMULA') {
            if (!filterSectionDetail['reverseHierarchy'][rootPath]['options_formula']) {
              filterSectionDetail['reverseHierarchy'][rootPath]['options_formula'] = 'type:' + this.objectTableMapping.mappingDetail[filterFieldInfo['objectName']] + 'formula'
            }
            filterSectionDetail['reverseHierarchy'][rootPath]['options_formula'] += ' AND ' + filterFieldInfo['querySet']['online']
          } else if (filterFieldInfo['fieldType'] === 'ROLLUPSUMMARY') {
            if (!filterSectionDetail['reverseHierarchy'][rootPath]['options_rollup']) {
              filterSectionDetail['reverseHierarchy'][rootPath]['options_rollup'] = 'type:' + this.objectTableMapping.mappingDetail[filterFieldInfo['objectName']] + 'rollup'
            }
            filterSectionDetail['reverseHierarchy'][rootPath]['options_rollup'] += ' AND ' + filterFieldInfo['querySet']['online']
          } else {
            if (!filterSectionDetail['reverseHierarchy'][rootPath]['options']) {
              filterSectionDetail['reverseHierarchy'][rootPath]['options'] = 'type:' + this.objectTableMapping.mappingDetail[filterFieldInfo['objectName']]
            }
            filterSectionDetail['reverseHierarchy'][rootPath]['options'] += ' AND ' + filterFieldInfo['querySet']['online']
          }
          
        }

        let displayValue = '';
        const fieldType = filterFieldInfo['fieldType']
        if (fieldType === "MULTISELECT" || fieldType === "CHECKBOX" || fieldType === 'RADIO' || fieldType === 'DROPDOWN') {
          let displayInfo = filterFieldInfo['displayInfo'] as MultiChoose
          displayValue = displayInfo['selected'].map(item => { return this.translate.instant(item['label']) }).join(', ');
        } else if (fieldType === "LOOKUP" || fieldType === "MASTERDETAIL" || fieldType === "COMMONLOOKUP") {
          let displayInfo = filterFieldInfo['displayInfo'] as LookupChoose;
          displayValue = displayInfo['label'];
        } else if (filterFieldInfo['betweenflag'] === 'Y') {
          if (filterFieldInfo['fieldValue']['from'] !== '' && filterFieldInfo['fieldValue']['to'] !== '' && filterFieldInfo['fieldValue']['from'] !== null && filterFieldInfo['fieldValue']['to'] !== null) {
            displayValue = filterFieldInfo['fieldValue']['from'] + ' to ' + filterFieldInfo['fieldValue']['to']
          } else {
            let value = filterFieldInfo['fieldValue']['from'] || filterFieldInfo['fieldValue']['to']
            displayValue = value + ' to ' + value
          }
        } else if (filterFieldInfo["fieldType"] === DataFieldType.boolean ||
          (filterFieldInfo["fieldType"] === DataFieldType.formula && filterFieldInfo["formulaType"] === FormulaType.boolean) ||
          (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && filterFieldInfo["rollupType"] === RollupType.boolean)) {
          if (filterFieldInfo['fieldValue']) {
            let zerothIndexVal = filterFieldInfo['fieldValue'][0]
            let firstIndexVal = filterFieldInfo['fieldValue'][1]
            let displayStr = []
            if (zerothIndexVal) {
              displayStr.push("true");
            }
            if (firstIndexVal) {
              displayStr.push("false");
            }
            displayValue = displayStr.join(', ');
          }
        } else {
          displayValue = filterFieldInfo['fieldValue'].toString()
        }
        filterSectionDetail['filterAppliedFields'].push({
          key: filterFieldKey,
          displayInfo: {
            label: filterFieldInfo['fieldDisplayName'],
            value: displayValue
          }
        });
      }
    } else if (provider === 'PouchDB') {
      if (filterFieldInfo['querySet']['offline']) {

      }
    } else if (provider === "JsonDB") {
      if (filterFieldInfo['querySet']['json']) {
        if (rootPath && filterSectionDetail['reverseHierarchy'][rootPath]) {
          if (filterSectionDetail['reverseHierarchy'][rootPath]['options']) {
            if (filterFieldInfo['querySet']['json'].constructor === {}.constructor) {
              filterSectionDetail['reverseHierarchy'][rootPath]['options'].push(filterFieldInfo['querySet']['json'])
            } else {
              filterFieldInfo['querySet']['json'].forEach(element => {
                filterSectionDetail['reverseHierarchy'][rootPath]['options'].push(element)
              });
            }
          } else {
            filterSectionDetail['reverseHierarchy'][rootPath]['options'] = []
            if (filterFieldInfo['querySet']['json'].constructor === {}.constructor) {
              filterSectionDetail['reverseHierarchy'][rootPath]['options'].push(filterFieldInfo['querySet']['json'])
            } else {
              filterFieldInfo['querySet']['json'].forEach(element => {
                filterSectionDetail['reverseHierarchy'][rootPath]['options'].push(element)
              });
            }
          }
        }
        let displayValue = '';
        const fieldType = filterFieldInfo['fieldType']
        if (fieldType === "MULTISELECT" || fieldType === "CHECKBOX" || fieldType === 'RADIO' || fieldType === 'DROPDOWN') {
          let displayInfo = filterFieldInfo['displayInfo'] as MultiChoose
          displayValue = displayInfo['selected'].map(item => { return item['label'] }).join(', ');
        } else if (fieldType === "LOOKUP" || fieldType === "MASTERDETAIL" || fieldType === "COMMONLOOKUP") {
          let displayInfo = filterFieldInfo['displayInfo'] as LookupChoose;
          displayValue = displayInfo['label'];
        } else if (filterFieldInfo['betweenflag'] === 'Y') {
          if (filterFieldInfo['fieldValue']['from'] !== '' && filterFieldInfo['fieldValue']['to'] !== '') {
            displayValue = filterFieldInfo['fieldValue']['from'] + ' to ' + filterFieldInfo['fieldValue']['to']
          } else {
            let value = filterFieldInfo['fieldValue']['from'] || filterFieldInfo['fieldValue']['to']
            displayValue = value + ' to ' + value
          }
        } else {
          displayValue = filterFieldInfo['fieldValue'].toString()
        }
        filterSectionDetail['filterAppliedFields'].push({
          key: filterFieldKey,
          displayInfo: {
            label: filterFieldInfo['fieldDisplayName'],
            value: displayValue
          }
        });
      }
    }
  }

  makeQueryForStringFields(filterSectionDetail: FilterSectionDetail, filterFieldInfo: FilterFieldInfo, provider: "CouchDB" | "PouchDB" | "JsonDB") {
    if (filterFieldInfo["fieldValue"]) {
      if (provider === 'CouchDB') {
        const fieldValue = this.appUtilityConfig.makeRegexQuery(filterFieldInfo["fieldValue"].toString());
        if (filterFieldInfo['conditionalOperator'] === "") {
          filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + '_' + "*" + fieldValue;
        } else if (filterFieldInfo['conditionalOperator'] === "a*") {
          filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + '_' + fieldValue;
        } else if (filterFieldInfo['conditionalOperator'] === "*z") {
          filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + '_' + "*" + fieldValue.replace("*", "");
        } else {
          filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + '_' + this.makeFieldValueBasedOnDataType(fieldValue.replace("*", ""), filterFieldInfo['conditionalOperator'])
        }
      } else if (provider === 'PouchDB') {
        const regexp = new RegExp(filterFieldInfo["fieldValue"].toString(), 'i');
        filterFieldInfo["querySet"]['offline'] = {
          'key': 'data.' + filterFieldInfo['fieldName'],
          'value': {
            $regex: regexp
          }
        }
      } else {
        const fieldValue = filterFieldInfo["fieldValue"].toString().trim()
        filterFieldInfo["querySet"]['json'] = {
          fieldName: filterFieldInfo['fieldName'],
          value: fieldValue,
          fieldId: filterFieldInfo['fieldId']
        }
      }
    } else {
      if (filterFieldInfo['isRequired']) {
        filterSectionDetail['isAllRequiredFieldFilled'] = false;
      }
    }
  }

  makeQueryForMultiselectFields(filterSectionDetail: FilterSectionDetail, filterFieldInfo: FilterFieldInfo, provider: "CouchDB" | "PouchDB" | "JsonDB") {
    const fieldValue = filterFieldInfo['fieldValue'] as Array<FieldDataType>
    if (fieldValue.constructor === Array && fieldValue.length > 0) {
      if (provider === 'CouchDB') {
        let selectedValue = "";
        selectedValue = fieldValue.map(element => {
          var val: any = this.appUtilityConfig.makeRegexQueryMultiSelect(element.toString());
          return isNaN(val) ? "_" + val : Number(val);
        }).join(" OR ");
        filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + "(" + selectedValue + ")";
      } else if (provider === 'PouchDB') {
        filterFieldInfo["querySet"]['offline'] = {
          'key': 'data.' + filterFieldInfo['fieldName'],
          'value': {
            '$in': fieldValue
          }
        }
      } else {
        const fieldValue = filterFieldInfo["fieldValue"]
        filterFieldInfo["querySet"]['json'] = {
          fieldName: filterFieldInfo['fieldName'],
          value: fieldValue,
          fieldId: filterFieldInfo['fieldId']
        }
      }
    } else {
      if (filterFieldInfo['isRequired']) {
        filterSectionDetail['isAllRequiredFieldFilled'] = false;
      }
    }
  }

  makeQueryForBooleanFields(filterSectionDetail: FilterSectionDetail, filterFieldInfo: FilterFieldInfo, provider: "CouchDB" | "PouchDB" | "JsonDB") {
    const fieldValue = filterFieldInfo["fieldValue"]
    let booleanValue = null;
    if (!fieldValue[0] && fieldValue[1]) {
      booleanValue = false;
    }
    if (fieldValue[0] && !fieldValue[1]) {
      booleanValue = true;
    }
    if (booleanValue != null) {
      if (provider === 'CouchDB') {
        filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + booleanValue;
      } else if (provider === 'PouchDB') {
        filterFieldInfo["querySet"]['offline'] = {
          'key': 'data.' + filterFieldInfo['fieldName'],
          'value': booleanValue
        }
      } else {
        filterFieldInfo["querySet"]['json'] = {
          fieldName: filterFieldInfo['fieldName'],
          value: booleanValue,
          fieldId: filterFieldInfo['fieldId']
        }
      }
    } else if (fieldValue[0] && fieldValue[1]) { //Both values are checked in UI level.
      if (provider === 'CouchDB') {
        filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ": ( true OR false ) ";
      } else if (provider === 'PouchDB') {
        filterFieldInfo["querySet"]['offline'] = {
          'key': 'data.' + filterFieldInfo['fieldName'],
          'value': { "$or": [true, false] }
        }
      } else {
        filterFieldInfo["querySet"]['json'] = {
          fieldName: filterFieldInfo['fieldName'],
          value: "true,false", //Now this solution is not working.In future based on designer request this value may be change.
          fieldId: filterFieldInfo['fieldId']
        }
      }
    } else {
      if (filterFieldInfo['isRequired']) {
        filterSectionDetail['isAllRequiredFieldFilled'] = false;
      }
    }
  }

  makeQueryForLookupFields(filterSectionDetail: FilterSectionDetail, filterFieldInfo: FilterFieldInfo, provider: "CouchDB" | "PouchDB" | "JsonDB") {
    let fieldValue = filterFieldInfo["fieldValue"];
    if (fieldValue) {
      let fieldName = this.lookupFieldMapping.mappingDetail[this.objectTableMapping.mappingDetail[filterFieldInfo['objectName']]][filterFieldInfo['fieldName']]
      if (provider === 'CouchDB') {
        filterFieldInfo['querySet']['online'] = fieldName + ":" + fieldValue;
      } else if (provider === 'PouchDB') {
        filterFieldInfo["querySet"]['offline'] = {
          'key': 'data.' + fieldName,
          'value': fieldValue
        }
      } else {
        filterFieldInfo["querySet"]['json'] = {
          fieldName: filterFieldInfo['fieldName'],
          value: fieldValue,
          fieldId: filterFieldInfo['fieldId']
        }
      }
    } else {
      if (filterFieldInfo['isRequired']) {
        filterSectionDetail['isAllRequiredFieldFilled'] = false;
      }
    }
  }
  makeQueryForMasterLookupFields(filterSectionDetail: FilterSectionDetail, filterFieldInfo: FilterFieldInfo, provider: "CouchDB" | "PouchDB" | "JsonDB") {
    let fieldValue = filterFieldInfo["fieldValue"];
    if (fieldValue) {
      let fieldName = filterFieldInfo['fieldName'];
      if (provider === 'CouchDB') {
        filterFieldInfo['querySet']['online'] = fieldName + ":" + fieldValue;
      } else if (provider === 'PouchDB') {
        filterFieldInfo["querySet"]['offline'] = {
          'key': 'data.' + fieldName,
          'value': fieldValue
        }
      } else {
        filterFieldInfo["querySet"]['json'] = {
          fieldName: filterFieldInfo['fieldName'],
          value: fieldValue,
          fieldId: filterFieldInfo['fieldId']
        }
      }
    } else {
      if (filterFieldInfo['isRequired']) {
        filterSectionDetail['isAllRequiredFieldFilled'] = false;
      }
    }
  }

  makeQueryForNumberFields(filterSectionDetail: FilterSectionDetail, filterFieldInfo: FilterFieldInfo, provider: "CouchDB" | "PouchDB" | "JsonDB") {
    if (filterFieldInfo['betweenflag'] === 'Y') {
      let fieldValue = filterFieldInfo.fieldValue;
      let max = fieldValue.to;
      let min = fieldValue.from;
      if ((typeof (max) === "number") || (typeof (min) === "number")) {
        if ((typeof (max) === "number") && (typeof (min) !== "number")) {
          min = max;
        } else if ((typeof (min) === "number") && (typeof (max) !== "number")) {
          max = min;
        }
        if ((typeof (max) === "number") && (typeof (min) === "number")) {
          if (Number(min) > Number(max)) {
            this.showAlert(filterFieldInfo['fieldDisplayName'] + ' From should be lesser value');
          } else {
            if (provider === 'CouchDB') {
              filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + "[" + Number(min) + " TO " + Number(max) + "]"
            } else if (provider === 'PouchDB') {
              filterFieldInfo["querySet"]['offline'] = {
                'key': 'data.' + filterFieldInfo['fieldName'],
                'value': {
                  "$gte": Number(min),
                  "$lte": Number(max)
                }
              }
            } else {
              filterFieldInfo["querySet"]['json'] = [
                {
                  fieldName: filterFieldInfo['fieldName'],
                  value: Number(min),
                  fieldId: filterFieldInfo['fieldId']
                }, {
                  fieldName: filterFieldInfo['fieldName'],
                  value: Number(max),
                  fieldId: filterFieldInfo['fieldId']
                }]
            }

          }
        }
      } else {
        if (filterFieldInfo['isRequired']) {
          filterSectionDetail['isAllRequiredFieldFilled'] = false;
        }
      }
    } else {
      const fieldValue = filterFieldInfo["fieldValue"]
      if (typeof (fieldValue) === "number") {
        if (provider === 'CouchDB') {
          if (filterFieldInfo['conditionalOperator'] === "" || filterFieldInfo['conditionalOperator'] === "=") {
            filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + fieldValue;
          } else if (filterFieldInfo['conditionalOperator'] === "<>") {
            filterFieldInfo['querySet']['online'] = '-' + filterFieldInfo['fieldName'] + ":" + fieldValue;
          } else {
            filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + this.makeFieldValueBasedOnDataType(fieldValue, filterFieldInfo['conditionalOperator'])
          }
        } else if (provider === 'PouchDB') {
          filterFieldInfo["querySet"]['offline'] = {
            'key': 'data.' + filterFieldInfo['fieldName'],
            'value': {
              "$eq": Number(fieldValue)
            }
          }
        } else {
          filterFieldInfo["querySet"]['json'] = {
            fieldName: filterFieldInfo['fieldName'],
            value: Number(fieldValue),
            fieldId: filterFieldInfo['fieldId']
          }
        }
      } else {
        if (filterFieldInfo['isRequired']) {
          filterSectionDetail['isAllRequiredFieldFilled'] = false;
        }
      }
    }
  }

  makeQueryForDateTimeFields(filterSectionDetail: FilterSectionDetail, filterFieldInfo: FilterFieldInfo, provider: "CouchDB" | "PouchDB" | "JsonDB") {
    // For date fields
    const betweenflag = filterFieldInfo["betweenflag"]
    const fieldType = filterFieldInfo["fieldType"]
    let maxDateMillis = 0;
    let minDateMillis = 0;
    if (betweenflag === 'Y') {
      let fieldValue = filterFieldInfo['fieldValue'] as BetweenValue
      let fromDate = fieldValue['from']
      let toDate = fieldValue['to']

      if (fromDate === "" && toDate === "") {
        if (filterFieldInfo['isRequired']) {
          filterSectionDetail['isAllRequiredFieldFilled'] = false;
        }
        return
      }

      if (toDate && !fromDate) {
        fromDate = toDate;
      } else if (fromDate && !toDate) {
        toDate = fromDate;
      }

      if (filterFieldInfo["fieldType"] === DataFieldType.date ||
        (filterFieldInfo["fieldType"] === DataFieldType.formula && filterFieldInfo["formulaType"] === FormulaType.date) ||
        (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && filterFieldInfo["rollupType"] === RollupType.date)) {
        if (typeof fromDate === 'string') {
          let fromDateObj = moment(fromDate, this.appUtilityConfig.userDatePickerFormat).toDate()
          let minValue = new Date(this.datePipe.transform(fromDateObj, appConstant.orgTimeZoneDateFormat) + "T00:00:00.000" + this.appUtilityConfig.orgZoneOffsetValueWithFormat)
          minDateMillis = minValue.getTime()
        }
        if (typeof toDate === 'string') {
          let toDateObj = moment(toDate, this.appUtilityConfig.userDatePickerFormat).toDate()
          let maxValue = new Date(this.datePipe.transform(toDateObj, appConstant.orgTimeZoneDateFormat) + "T23:59:59.999" + this.appUtilityConfig.orgZoneOffsetValueWithFormat)
          maxDateMillis = maxValue.getTime()
        }
      } else {
        if (typeof fromDate === 'string') {
          fromDate = moment(fromDate, this.appUtilityConfig.userDateTimePickerFormat).toDate()
        }
        if (typeof toDate === 'string') {
          toDate = moment(toDate, this.appUtilityConfig.userDateTimePickerFormat).toDate()
        }

        minDateMillis = this.appUtilityConfig.getUtcMillisecondsFromGivenTimeZoneMilliSeconds(this.getTimeWithoutSeconds(fromDate, 'min').getTime(),'user');
        maxDateMillis = this.appUtilityConfig.getUtcMillisecondsFromGivenTimeZoneMilliSeconds(this.getTimeWithoutSeconds(toDate, 'max').getTime(), 'user');
      }

      if (maxDateMillis > 0 && minDateMillis > 0) {
        if (maxDateMillis < minDateMillis) {
          this.showAlert(filterFieldInfo['fieldDisplayName'] + " From date must be lesser value")
          return;
        }

        if (provider === 'CouchDB') {
          filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + "[" + minDateMillis + " TO " + maxDateMillis + "]"
        } else if (provider === 'PouchDB') {
          filterFieldInfo["querySet"]['offline'] = {
            'key': 'data.' + filterFieldInfo['fieldName'],
            'value': {
              "$gte": minDateMillis,
              "$lte": maxDateMillis
            }
          }
        } else {
          filterFieldInfo["querySet"]['json'] = [{
            fieldName: filterFieldInfo['fieldName'],
            value: minDateMillis,
            fieldId: filterFieldInfo['fieldId']
          },
          {
            fieldName: filterFieldInfo['fieldName'],
            value: maxDateMillis,
            fieldId: filterFieldInfo['fieldId']
          }
          ]
        }
      }
    } else {
      let fieldValue = filterFieldInfo["fieldValue"]
      const fieldType = filterFieldInfo["fieldType"]

      if (fieldValue === "") {
        if (filterFieldInfo['isRequired']) {
          filterSectionDetail['isAllRequiredFieldFilled'] = false;
        }
        return
      }

      if (filterFieldInfo["fieldType"] === DataFieldType.date ||
        (filterFieldInfo["fieldType"] === DataFieldType.formula && filterFieldInfo["formulaType"] === FormulaType.date) ||
        (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && filterFieldInfo["rollupType"] === RollupType.date)) {
        if (typeof fieldValue === 'string') {
          fieldValue = moment(fieldValue, this.appUtilityConfig.userDatePickerFormat).toDate()
          let minValue = new Date(this.datePipe.transform(fieldValue, appConstant.orgTimeZoneDateFormat) + "T00:00:00.000" + this.appUtilityConfig.orgZoneOffsetValueWithFormat)
          minDateMillis = minValue.getTime()

          let maxValue = new Date(this.datePipe.transform(fieldValue, appConstant.orgTimeZoneDateFormat) + "T23:59:59.999" + this.appUtilityConfig.orgZoneOffsetValueWithFormat)
          maxDateMillis = maxValue.getTime()
        }
      } else {
        if (typeof fieldValue === 'string') {
          fieldValue = moment(fieldValue, this.appUtilityConfig.userDateTimePickerFormat).toDate()
        }
        minDateMillis = this.appUtilityConfig.getUtcMillisecondsFromGivenTimeZoneMilliSeconds(this.getTimeWithoutSeconds(fieldValue, 'min').getTime(),'user');
        maxDateMillis = this.appUtilityConfig.getUtcMillisecondsFromGivenTimeZoneMilliSeconds(this.getTimeWithoutSeconds(fieldValue, 'max').getTime(), 'user');
      }

      if (fieldValue > 0) {
        if (provider === 'CouchDB') {
          if (filterFieldInfo['conditionalOperator'] === "" || filterFieldInfo['conditionalOperator'] === "=") {
            filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + "[" + minDateMillis + " TO " + maxDateMillis + "]"
          } else if (filterFieldInfo['conditionalOperator'] === "<>") {
            filterFieldInfo['querySet']['online'] = '-' + filterFieldInfo['fieldName'] + ":" + "[" + minDateMillis + " TO " + maxDateMillis + "]"
          } else {
            if (filterFieldInfo["fieldType"] === DataFieldType.date ||
              (filterFieldInfo["fieldType"] === DataFieldType.formula && filterFieldInfo["formulaType"] === FormulaType.date) ||
              (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && filterFieldInfo["rollupType"] === RollupType.date)) {
              if (filterFieldInfo['conditionalOperator'] === ">" || filterFieldInfo['conditionalOperator'] === "<=") {
                fieldValue = this.getDateWithoutTime(fieldValue, 'max').getTime();
              } else if (filterFieldInfo['conditionalOperator'] === "<" || filterFieldInfo['conditionalOperator'] === ">=") {
                fieldValue = this.getDateWithoutTime(fieldValue, 'min').getTime();
              }
            } else if (filterFieldInfo["fieldType"] === DataFieldType.timestamp ||
              (filterFieldInfo["fieldType"] === DataFieldType.formula && filterFieldInfo["formulaType"] === FormulaType.timestamp) ||
              (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && filterFieldInfo["rollupType"] === RollupType.timestamp)) {
              if (filterFieldInfo['conditionalOperator'] === ">" || filterFieldInfo['conditionalOperator'] === "<=") {
                fieldValue = this.getTimeWithoutSeconds(fieldValue, 'max').getTime();
              } else if (filterFieldInfo['conditionalOperator'] === "<" || filterFieldInfo['conditionalOperator'] === ">=") {
                fieldValue = this.getTimeWithoutSeconds(fieldValue, 'min').getTime();
              }
            }
            filterFieldInfo['querySet']['online'] = filterFieldInfo['fieldName'] + ":" + this.makeFieldValueBasedOnDataType(fieldValue, filterFieldInfo['conditionalOperator'])
          }
        } else if (provider === 'PouchDB') {
          filterFieldInfo["querySet"]['offline'] = {
            'key': 'data.' + filterFieldInfo['fieldName'],
            'value': {
              "$gte": minDateMillis,
              "$lte": maxDateMillis
            }
          }
        } else {
          filterFieldInfo["querySet"]['json'] = [{
            fieldName: filterFieldInfo['fieldName'],
            value: minDateMillis,
            fieldId: filterFieldInfo['fieldId']
          },
          {
            fieldName: filterFieldInfo['fieldName'],
            value: maxDateMillis,
            fieldId: filterFieldInfo['fieldId']
          }
          ]
        }
      }
    }
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

  getDateWithoutTime(dateTimestamp, hours: 'min' | 'max'): Date {
    let dateObject = new Date(dateTimestamp);
    if (hours === 'min') {
      dateObject.setHours(0, 0, 0, 0);
    } else if (hours === 'max') {
      dateObject.setHours(23, 59, 59, 999);
    }
    return dateObject;
  }

  makeFieldValueBasedOnDataType(fieldValue, operator) {
    if (typeof (fieldValue) === "string") {
      if (operator === "=") {
        return fieldValue;
      } else if (operator === "*z") {
        return "*" + fieldValue;
      }
    } else if (typeof (fieldValue) === "number") {
      if (operator === ">") {
        return "{" + fieldValue + " TO " + "Infinity}";
      } else if (operator === ">=") {
        return "[" + fieldValue + " TO " + "Infinity]";
      } else if (operator === "<") {
        return "{-Infinity" + " TO " + fieldValue + "}";
      } else if (operator === "<=") {
        return "[-Infinity" + " TO " + fieldValue + "]";
      }
    }
  }

  showAlert(message) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      title: message,
      buttonInfo: [
        {
          name: "OK"
        }
      ],
      parentContext: this,
      type: "Alert"
    };
    dialogConfig.autoFocus = false;

    this.matDialog.open(cspfmAlertDialog, dialogConfig);
  }

  makeReverseHierarchy(filterFieldInfo: FilterFieldInfo, reverseHierarchy: { [key: string]: ObjectHierarchy }) {
    let resultJson;
    let key = '';
    let value = this.formReverseJson(filterFieldInfo['hierarchyInfo'], key, resultJson);
    if (value) {
      reverseHierarchy[value['key']] = value['hierarchy']
      return value;
    }
    return '';
  }

  private formReverseJson(hierarchyInfo: ObjectHierarchy, key, resultJson) {
    let hierarchy = JSON.parse(JSON.stringify(hierarchyInfo));
    if (hierarchy) {
      hierarchy['childObject'] = [];
      if (resultJson) {
        hierarchy['childObject'].push(resultJson)
      }
      if (hierarchyInfo['objectType'] === 'LOOKUP' || hierarchyInfo['objectType'] === 'COMMONLOOKUP') {
        key = key + this.getObjectType(hierarchyInfo) + '_' + hierarchyInfo['fieldId']
      } else {
        key = key + this.getObjectType(hierarchyInfo)
      }
      if (hierarchyInfo['childObject'] && hierarchyInfo['childObject'].length > 0) {
        key = key + '$$';
        return this.formReverseJson(hierarchyInfo['childObject'][0], key, hierarchy)
      } else {
        return {
          'key': key,
          'hierarchy': hierarchy
        };
      }
    } else {
      return;
    }
  }

  reverseJson(filterSectionDetail: FilterSectionDetail) {
    let mainJson = {};
    Object.keys(filterSectionDetail['reverseHierarchy']).forEach(key => {
      let reverseJson;
      mainJson[key] = this.dummy(filterSectionDetail['reverseHierarchy'][key], reverseJson)
    });
    return mainJson;
  }

  dummy(hierarchyInfo: ObjectHierarchy, resultJson) {
    let hierarchy = JSON.parse(JSON.stringify(hierarchyInfo));
    if (hierarchy) {
      hierarchy['childObject'] = [];
      if (resultJson) {
        hierarchy['childObject'].push(resultJson)
      }
      if (hierarchyInfo['childObject'] && hierarchyInfo['childObject'].length > 0) {
        return this.dummy(hierarchyInfo['childObject'][0], hierarchy)
      } else {
        return hierarchy;
      }
    } else {
      return;
    }
  }

  clearAllFilter(filterSectionDetail: FilterSectionDetail) {
    filterSectionDetail['filterAppliedFields'].forEach(filtereField => {
      this.clearFilterAppliedField(filterSectionDetail['filterFields'][filtereField['key']], false)
    })
  }

  clearFilterValues(readOnlyJsonSet,filterSectionJsonSet){
    let filterFields = filterSectionJsonSet['filterPanelExpanded'] ? Object.keys(filterSectionJsonSet['filterFields']):filterSectionJsonSet['filterAppliedFields']
    if(readOnlyJsonSet.length > 0){
        filterFields.forEach(filteredField => {
          const filterFieldKey = filterSectionJsonSet['filterPanelExpanded'] ? filteredField : filteredField['key']
          this.clearSingleField(readOnlyJsonSet,filterSectionJsonSet,filterFieldKey)
          })
    }else{
        this.clearAllFilter(filterSectionJsonSet)
    }
  }
  clearSingleField(readOnlyJsonSet,filterSectionJsonSet,filterFieldKey,isClearSingleFields?){
    let clearFieldValue :boolean =true ;
     readOnlyJsonSet.forEach(elementValue => {
       if ((filterSectionJsonSet['filterFields'][filterFieldKey].fieldName === elementValue.fieldName && filterSectionJsonSet['filterFields'][filterFieldKey].rootPath === elementValue.rootPath)) {
        clearFieldValue = false;
       }
     })
     if (clearFieldValue) {
       return this.clearFilterAppliedField(filterSectionJsonSet['filterFields'][filterFieldKey], false)
     }
     if(isClearSingleFields){
       this.appUtilityConfig.showInfoAlert("Clear filter is restricted for readonly field in filter section")
       return false;
     }
   }

  clearFilterAppliedField(filterFieldInfo: FilterFieldInfo, checkRequiredField: boolean): boolean {

    if (filterFieldInfo['isRequired'] === true && checkRequiredField === true) {
      this.showAlert("Mandatory field can't be cleared ")
      return false;
    }

    const fieldType = filterFieldInfo['fieldType']

    if (fieldType === "MULTISELECT" || fieldType === "CHECKBOX" || fieldType === 'RADIO' || fieldType === 'DROPDOWN') {
      filterFieldInfo['fieldValue'] = [];
      let displayInfo = filterFieldInfo['displayInfo'] as MultiChoose
      displayInfo['input'].forEach(inputItem => {
        inputItem.isChecked = false;
      })
      displayInfo['visible'] = false;
      displayInfo['selected'] = [];
    } else if (fieldType === "LOOKUP" || fieldType === "MASTERDETAIL" || fieldType === "COMMONLOOKUP") {
      filterFieldInfo['fieldValue'] = '';
      let displayInfo = filterFieldInfo['displayInfo'] as LookupChoose;
      displayInfo['label'] = ''
      displayInfo['searchKey'] = ''
      displayInfo['data'] = {}
    } else if (filterFieldInfo['betweenflag'] === 'Y') {
      filterFieldInfo['fieldValue'] = {
        'from': '',
        'to': ''
      }
    } else if (filterFieldInfo["fieldType"] === DataFieldType.boolean ||
      (filterFieldInfo["fieldType"] === DataFieldType.formula && filterFieldInfo["formulaType"] === FormulaType.boolean) ||
      (filterFieldInfo["fieldType"] === DataFieldType.rollupsummary && filterFieldInfo["rollupType"] === RollupType.boolean)) {
      filterFieldInfo['fieldValue'] = [];
    } else {
      filterFieldInfo['fieldValue'] = '';
    }
    filterFieldInfo['conditionalOperator'] = '';
    filterFieldInfo['querySet'] = null;
    return true;
  }

  getObjectType(objectDetails: ObjectHierarchy) {
    let objectType = "";
    if (objectDetails["objectId"].includes("pfm")) {
      objectType = objectDetails["objectId"];
    } else {
      objectType = "pfm" + objectDetails["objectId"];
    }
    return objectType;
  }

  checkChangesAvailable(oldJson, updatedJson) {
    if (oldJson && updatedJson) {
      return !lodash.isEqual(oldJson, updatedJson);
    }
    return false;
  }

  operatorStyle() {
    document.getElementsByClassName("cdk-overlay-pane")[0].classList.add("cs-matselect-operator-main");
  }

  operatorStyleFromLastElement() {
    let overlays = document.getElementsByClassName("cdk-overlay-pane")
    if (overlays && overlays.length > 0) {
      overlays[overlays.length - 1].classList.add("cs-matselect-operator-main");
    }
  }
}
