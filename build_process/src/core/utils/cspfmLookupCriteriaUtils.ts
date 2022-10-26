import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as lodash from 'lodash';
import { dataProvider } from './dataProvider';
import { objectTableMapping } from '../pfmmapping/objectTableMapping';
import { couchdbProvider } from '../db/couchdbProvider';
import { appUtility } from './appUtility';
import * as moment from 'moment';
import { appConstant } from './appConstant';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { cspfmAlertDialog } from '../components/cspfmAlertDialog/cspfmAlertDialog';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { FieldInfo } from '../pipes/cspfm_data_display';
import { FilterFieldInfo } from '../models/cspfmFilterFieldInfo.type';
import {
    cspfmObjectConfiguration
} from 'src/core/pfmmapping/cspfmObjectConfiguration';
import { lookupFieldMapping} from '../pfmmapping/lookupFieldMapping';

@Injectable({
    providedIn: 'root'
})

export class cspfmLookupCriteriaUtils {

    public relationalObjectResults = [];
    public batchIdLimit = 2000;
    
    constructor(public translateService: TranslateService, public dataProvider: dataProvider, public objectTableMapping: objectTableMapping,
        public couchdbProvider: couchdbProvider, private currencyPipe: CurrencyPipe, public appUtility: appUtility, public datePipe: DatePipe, public dialog: MatDialog, private pfmObjectConfig: cspfmObjectConfiguration,public lookupFieldMapping :lookupFieldMapping) { }

    lookupCriteriaQueryEvaluateFunction(configObject) {
        var result, criteriaQueryConfig;
        if (configObject['lookupCriteriaQueryConfig']) {
            criteriaQueryConfig = configObject['lookupCriteriaQueryConfig']
        } else if (configObject['associationCriteriaQueryConfig']) {
            criteriaQueryConfig = configObject['associationCriteriaQueryConfig']
        } else {
            criteriaQueryConfig = configObject['layoutCriteriaQueryConfig']
        }
        if (configObject['relationalObjectsResult']) {
            this.relationalObjectResults = configObject['relationalObjectsResult']
        }
        if (configObject['criteriaDataObject']) {
            result = this.evaluateExpression(criteriaQueryConfig, configObject['criteriaDataObject'], 'entry')
        } else if (configObject['filterFieldWithValues']) {
            result = this.evaluateExpression(criteriaQueryConfig, configObject['filterFieldWithValues'], 'filter')
        } else if (configObject['listCriteriaDataObject']) {
            result = this.evaluateExpression(criteriaQueryConfig, configObject['listCriteriaDataObject'], 'list')
        }
        
        this.relationalObjectResults = [...[]]
        return result;
    }
    evaluateExpression(operand, dataObject, entryOrfilter, operator?) {
        if (operand['isOperandsAvailable']) {
            return this.evaluateIfOperandAvailable(operand, dataObject, entryOrfilter)
        } else {
            return this.evaluateIfOperandNotAvailable(operand, dataObject, entryOrfilter, operator)
        }
    }
    evaluateIfOperandAvailable(operand, dataObject, entryOrfilter) {
        return this.evaluateOpertorAction(operand, operand['operands'], dataObject, entryOrfilter)
    }

    evaluateIfOperandNotAvailable(operand, dataObject, entryOrfilter, operator?) {
        switch (operand['valueType']) {
            case 'dynamic':
                // This block does not need else block.
                if (operand['objectName'] === 'LOGGEDUSER') {
                    return this.handleDynamicValues(operand, this.appUtility.loggedUserCorObject, operator)
                }
                if (entryOrfilter === 'entry') {
                    return this.handleDynamicValues(operand, dataObject, operator)
                } else if (entryOrfilter === 'filter') {
                    return this.handleFilterDynamicValues(operand, dataObject, operator)
                } else if (entryOrfilter === 'list') {
                    if (operand['fieldType'] === 'RELATIONALOBJECT') {
                        return this.handleDynamicValues(operand, this.appUtility.loggedUserCorObject, operator)
                    } else {
                        return this.handleDynamicValuesFromJunctionObject(operand, dataObject[this.objectTableMapping.mappingDetail[operand['objectName']]], operator)
                    }
                }
                return "";
            case 'fieldName':
                return operand['fieldName'];
            case 'constant':
                return this.handleConstantValues(operand, operator);
            default:
                return "";
        }
    }
    handleConstantValues(operand, operator?) {
        var value = operand['value'];
        var fieldtype = operand['fieldType'];
        if (value === '#null#' && operand['isNullValue']) {
            return this.handleNullValue(fieldtype);
        }

        if (fieldtype === "PASSWORD" || fieldtype === 'TEXT' || fieldtype === 'AUTONUMBER' || fieldtype === 'TEXTAREA' ||
            fieldtype === 'EMAIL' || fieldtype === 'URL') {
            if (operator) {
                const fieldObject = {
                    "fieldValue": value,
                    "conditionalOperator": operator["operator"]
                }
                return this.makeStringFieldOption(fieldObject);
            } else {
                return '_' + this.appUtility.makeRegexQuery(value);
            }
        } else if (fieldtype === "NUMBER" || fieldtype === 'DECIMAL' || fieldtype === 'CURRENCY'
            || fieldtype === "BOOLEAN") {
            return value
        } else if (fieldtype === 'RADIO' || fieldtype === 'DROPDOWN') {
            return isNaN(value) ? '_' + this.appUtility.makeRegexQueryMultiSelect(value) : value;
        } else if (fieldtype === "MULTISELECT" || fieldtype === "CHECKBOX") {
            if (Array.isArray(value)) {
                let values = value.map(element => isNaN(element) ? '_' + this.appUtility.makeRegexQueryMultiSelect(element) : element)
                let qString = this.makeQueryForMultiselectAndCheckBoxFields(values, operand);
                return '( ' + qString + ' )'
            } else {
                return '( )';
            }
        } else if (fieldtype === 'DATE' || fieldtype === "TIMESTAMP") {
            if (typeof value === 'string') {
                if (fieldtype === 'DATE') {
                    return this.appUtility.getUtcMillisecondsFromDateString(value, false,operand['configuredDateFormat'])
                } else if (fieldtype === "TIMESTAMP") {
                    return this.appUtility.getUtcTimeZoneMillsecondsFromDateTimeString(value, 'user',operand['configuredDateFormat'])
                }
            }
            return value
        } else {
            return value
        }
    }
    getNotSelectedValues(operand): any[] {
        let notSelectedValues = [];
        let selectionFieldMapping = this.pfmObjectConfig['objectConfiguration'][this.objectTableMapping.mappingDetail[operand['objectName']]]["selectionFieldsMapping"]
        Object.keys(selectionFieldMapping).forEach(element => {
            let fieldType = operand['fieldType'];
            if (fieldType === "MULTISELECT" || fieldType === "CHECKBOX") {
                if (element === operand['fieldName']) {
                    let selectedValues = operand['value']
                    let allValues = [];
                    Object.keys(selectionFieldMapping[element]).forEach(e => {
                            allValues.push(e)
                    })
                    allValues = allValues.map(element => isNaN(element) ? '_' + this.appUtility.makeRegexQueryMultiSelect(element) : element)
                    notSelectedValues = lodash.difference(allValues, selectedValues)
                }
            }
        })
        return notSelectedValues
    }
    handleDynamicValues(operand, dataObject, operator?) {
        var fieldName = operand['fieldName'];
        var fieldtype = operand['fieldType'];
        if (fieldtype === 'RELATIONALOBJECT') {
            if (this.relationalObjectResults[operand['identifier']]) {
                return '( ' + this.relationalObjectResults[operand['identifier']].join(' OR ') + ' )'
            } else {
                return '( ' + ['null'].join(' OR ') + ' )'
            }
        } else if (fieldtype === 'MASTERDETAIL' || fieldtype === 'MASTERLOOKUP' || fieldtype === 'LOOKUP') {
            var object = {};
            var objectDetails = operand['objectdetails'];
            objectDetails["identifier"] = operand["identifier"];
            if (fieldtype === "MASTERDETAIL") {
                object = dataObject[fieldName + 's'][0]
            } else if (fieldtype === "MASTERLOOKUP" || fieldtype === 'LOOKUP') {
                if (typeof dataObject[fieldName] === 'string') {
                    return dataObject[fieldName]
                } else {
                    object = dataObject[fieldName]
                }
            }
            return this.handleDynamicValues(objectDetails, object)
        } else {
            if (dataObject[fieldName] === undefined || dataObject[fieldName] === null || dataObject[fieldName] === "" || Object.keys(dataObject).length === 0) {
                return "";
            }
            if (fieldtype === "PASSWORD" || fieldtype === 'TEXT' || fieldtype === 'AUTONUMBER' || fieldtype === 'TEXTAREA' ||
                fieldtype === 'EMAIL' || fieldtype === 'URL') {
                if (operator) {
                    const fieldObject = {
                        "fieldValue": dataObject[fieldName],
                        "conditionalOperator": operator["operator"]
                    }
                    return this.makeStringFieldOption(fieldObject);
                } else {
                    return '_' + this.appUtility.makeRegexQuery(dataObject[fieldName]);
                }
            } else if (fieldtype === "NUMBER" || fieldtype === 'DECIMAL' || fieldtype === 'CURRENCY' || fieldtype === "BOOLEAN") {
                return dataObject[fieldName]
            } else if (fieldtype === "TIMESTAMP" || fieldtype === 'DATE') {
                if (typeof dataObject[fieldName] === 'string') {
                    if(fieldtype === "TIMESTAMP"){
                        return this.appUtility.getUtcTimeZoneMillsecondsFromDateTimeString(dataObject[fieldName], 'user')
                    } else {
                        return this.appUtility.getUtcMillisecondsFromDateString(dataObject[fieldName],false)
                    }
                }
                return dataObject[fieldName];
            } else if (fieldtype === "MULTISELECT" || fieldtype === "CHECKBOX") {
                let values = dataObject[fieldName].map(element => isNaN(element) ? '_' + this.appUtility.makeRegexQueryMultiSelect(element) : element)
                let qString = this.makeQueryForMultiselectAndCheckBoxFields(values, operand);
                return '( ' + qString + ' )'
            } else if (fieldtype === 'RADIO' || fieldtype === 'DROPDOWN') {
                return isNaN(dataObject[fieldName]) ? '_' + this.appUtility.makeRegexQueryMultiSelect(dataObject[fieldName]) : dataObject[fieldName];
            } else {
                return dataObject[fieldName]
            }
        }
    }
    handleDynamicValuesFromJunctionObject(operand, dataObject, operator?) {
        var fieldName = operand['fieldName'];
        var fieldtype = operand['fieldType'];
        if (dataObject) {
            if (fieldtype === 'MASTERLOOKUP' || fieldtype === 'LOOKUP') {
                const returnValue = dataObject.map(record => record[fieldName]).filter(element => element !== undefined)
                return (typeof returnValue == 'string' ? returnValue : returnValue.map(ele => ele !== undefined && (ele || {}).id))
            } else if (fieldtype === "PASSWORD" || fieldtype === 'TEXT' || fieldtype === 'AUTONUMBER' || fieldtype === 'TEXTAREA' ||
                fieldtype === 'EMAIL' || fieldtype === 'URL') {
                return dataObject.map(record => {
                    if (record && record[fieldName]) {
                        if (operator) {
                            const fieldObject = {
                                "fieldValue": record[fieldName],
                                "conditionalOperator": operator["operator"]
                            }
                            return this.makeStringFieldOption(fieldObject);
                        } else {
                            return '_' + this.appUtility.makeRegexQuery(record[fieldName]);
                        }
                    } else {
                        return undefined
                    }
                }).filter(element => element !== undefined)
            } else if (fieldtype === "NUMBER" || fieldtype === 'DECIMAL' || fieldtype === 'CURRENCY' || fieldtype === "TIMESTAMP" || fieldtype === 'DATE'
                || fieldtype === "BOOLEAN") {
                return dataObject.map(record => record[fieldName]).filter(element => element !== undefined)
            } else if (fieldtype === 'RADIO' || fieldtype === 'DROPDOWN') {
                return dataObject.map(record => {
                    return (isNaN(record[fieldName]) ? '_' + this.appUtility.makeRegexQueryMultiSelect(record[fieldName]) : record[fieldName])
                }).filter(element => element !== undefined);
            } else if (fieldtype === "MULTISELECT" || fieldtype === "CHECKBOX") {
                let values = [];
                dataObject.forEach(record => {
                    values = values.concat(record[fieldName])
                })
                values = values.filter(e => e !== undefined).map(element => isNaN(element) ? '_' + this.appUtility.makeRegexQueryMultiSelect(element) : element)
                return values;
            } else {
                return dataObject.map(record => record[fieldName]).filter(element => element !== undefined)
            }
        } else {
            return undefined
        }
        
    }
    handleFilterDynamicValues(operand, filterFieldWithValue, operator?) {
        let key = this.objectTableMapping.mappingDetail[operand['objectName']] + '_' + operand['fieldName'] + '_' + operand['elementId']
        var dataObject = filterFieldWithValue[key];
        var fieldtype = operand['fieldType'];
        if (fieldtype === 'RELATIONALOBJECT') {
            return '( ' + this.relationalObjectResults.join(' OR ') + ' )'
        } else if (fieldtype === 'MASTERDETAIL' || fieldtype === 'MASTERLOOKUP' || fieldtype === 'LOOKUP') {
            return dataObject['fieldValue']
        } else {
            if (fieldtype === "PASSWORD" || fieldtype === 'TEXT' || fieldtype === 'AUTONUMBER' || fieldtype === 'TEXTAREA' ||
                fieldtype === 'EMAIL' || fieldtype === 'URL') {
                if (operator) {
                    const fieldObject = {
                        "fieldValue": dataObject["fieldValue"],
                        "conditionalOperator": operator["operator"]
                    }
                    return this.makeStringFieldOption(fieldObject);
                } else {
                    let value = dataObject["fieldValue"].trim()
                    return '_' + this.appUtility.makeRegexQuery(value);
                }
            } else if (fieldtype === "NUMBER" || fieldtype === 'DECIMAL' || fieldtype === 'CURRENCY') {
                return this.makeNumberFieldOption(dataObject)
            } else if (fieldtype === "TIMESTAMP" || fieldtype === 'DATE') {
                return this.makeDateTimeOption(dataObject)
            } else if (fieldtype === 'BOOLEAN') {
                let values: boolean[] = [];
                if (dataObject['fieldValue'][0]) values.push(true);
                if (dataObject['fieldValue'][1]) values.push(false);
                return '( ' + values.join(' OR ') + ' )';
            } else if (fieldtype === "MULTISELECT" || fieldtype === "CHECKBOX" || fieldtype === 'DROPDOWN' || fieldtype === 'RADIO') {
                let values = dataObject['fieldValue'].map(element => isNaN(element) ? '_' + this.appUtility.makeRegexQueryMultiSelect(element) : element)
                return '( ' + values.join(' OR ') + ' )';
            } else {
                return dataObject['fieldValue']
            }
        }
    }

    makeStringFieldOption(fieldObject) {
        const fieldValue = fieldObject["fieldValue"].trim()
        if (fieldValue) {
            // For couchdb
            const conditionalFieldValue = this.appUtility.makeRegexQuery(fieldValue); // return value contains * at the end.
            switch (fieldObject['conditionalOperator']) {
                case "":
                    return '_' + "*" + conditionalFieldValue;
                case "a*":
                    return '_' + conditionalFieldValue;
                case "*z":
                    return '_' + "*" + conditionalFieldValue.replace("*", "");
                case "=":
                    return '_' + conditionalFieldValue;
                case "==":
                    return '_' + conditionalFieldValue.replace("*", "");
                case "!=":
                    return '_' + conditionalFieldValue.replace("*", "");
                default:
                    return "";
            }
        } else {
            return "";
        }
    }
    makeNumberFieldOption(fieldObject) {
        if (fieldObject['betweenflag'] === "Y") {
            let fieldValue = fieldObject['fieldValue'];
            return `[ ${fieldValue['from']} TO ${fieldValue['to']} ]`;
        } else {
            return fieldObject['fieldValue'];
        }
    }
    /* Make Date/Time Field Type Option */
    makeDateTimeOption(fieldObject) {
        // For date fields
        const betweenflag = fieldObject["betweenflag"]
        const fieldType = fieldObject["fieldType"]
        var maxDateMillis = 0;
        var minDateMillis = 0;
        if (betweenflag === "Y") {
            var fromDate = fieldObject['fieldValue']['from'];
            var toDate = fieldObject['fieldValue']['to'];
            if (fromDate === "" && toDate === "") {
                return "false"
            }
            if (toDate && !fromDate) {
                fromDate = toDate;
            }
            else if (fromDate && !toDate) {
                toDate = fromDate;
            }
            if (fieldType === 'DATE') {
                if (typeof fromDate === 'string') {
                    var fromDateObj = moment(fromDate, this.appUtility.userDatePickerFormat).toDate()
                    var minValue = new Date(this.datePipe.transform(fromDateObj, appConstant.orgTimeZoneDateFormat) + "T00:00:00.000" + this.appUtility.orgZoneOffsetValueWithFormat)
                    minDateMillis = minValue.getTime()
                }
                if (typeof toDate === 'string') {
                    var toDateObj = moment(toDate, this.appUtility.userDatePickerFormat).toDate()
                    var maxValue = new Date(this.datePipe.transform(toDateObj, appConstant.orgTimeZoneDateFormat) + "T23:59:59.999" + this.appUtility.orgZoneOffsetValueWithFormat)
                    maxDateMillis = maxValue.getTime()
                }
            } else {
                if (typeof fromDate === 'string') {
                    fromDate = moment(fromDate, this.appUtility.userDateTimePickerFormat).toDate()
                }
                if (typeof toDate === 'string') {
                    toDate = moment(toDate, this.appUtility.userDateTimePickerFormat).toDate()
                }

                minDateMillis = this.getTimeWithoutSeconds(fromDate, 'min').getTime();
                maxDateMillis = this.getTimeWithoutSeconds(toDate, 'max').getTime();
            }

            if (maxDateMillis > 0 && minDateMillis > 0) {
                if (maxDateMillis < minDateMillis) {
                    this.appUtility.showAlert(this,fieldObject['fieldDisplayName'] + " From date must be lesser value")
                    return "false";
                }
                return "[" + minDateMillis + " TO " + maxDateMillis + "]"
            }
        } else {
            var fieldValue = fieldObject["fieldValue"]
            const fieldType = fieldObject["fieldType"]
            var displayDate = fieldValue

            if (fieldValue === "") {
                return "false"
            }
            if (fieldType === 'DATE') {
                if (typeof fieldValue === 'string') {
                    fieldValue = moment(fieldValue, this.appUtility.userDatePickerFormat).toDate()
                    var minValue = new Date(this.datePipe.transform(fieldValue, appConstant.orgTimeZoneDateFormat) + "T00:00:00.000" + this.appUtility.orgZoneOffsetValueWithFormat)
                    minDateMillis = minValue.getTime()

                    var maxValue = new Date(this.datePipe.transform(fieldValue, appConstant.orgTimeZoneDateFormat) + "T23:59:59.999" + this.appUtility.orgZoneOffsetValueWithFormat)
                    maxDateMillis = maxValue.getTime()
                }
            } else {
                if (typeof fieldValue === 'string') {
                    fieldValue = moment(fieldValue, this.appUtility.userDatePickerFormat).toDate()
                }
                minDateMillis = this.getTimeWithoutSeconds(fieldValue, 'min').getTime();
                maxDateMillis = this.getTimeWithoutSeconds(fieldValue, 'max').getTime();
            }

            if (fieldValue > 0) {
                if (fieldObject['conditionalOperator'] === "" || fieldObject['conditionalOperator'] === "=" || fieldObject['conditionalOperator'] === "<>") {
                    return "[" + minDateMillis + " TO " + maxDateMillis + "]"
                } else {
                    if (fieldType === 'DATE') {
                        if (fieldObject['conditionalOperator'] === ">" || fieldObject['conditionalOperator'] === "<=") {
                            fieldValue = this.getDateWithoutTime(fieldValue, 'max').getTime();
                        } else if (fieldObject['conditionalOperator'] === "<" || fieldObject['conditionalOperator'] === ">=") {
                            fieldValue = this.getDateWithoutTime(fieldValue, 'min').getTime();
                        }
                    } else if (fieldType === 'TIMESTAMP') {
                        if (fieldObject['conditionalOperator'] === ">" || fieldObject['conditionalOperator'] === "<=") {
                            fieldValue = this.getTimeWithoutSeconds(fieldValue, 'max').getTime();
                        } else if (fieldObject['conditionalOperator'] === "<" || fieldObject['conditionalOperator'] === ">=") {
                            fieldValue = this.getTimeWithoutSeconds(fieldValue, 'min').getTime();
                        }
                    }
                    return this.makeFieldValueBasedOnDataType(fieldValue, fieldObject['conditionalOperator'])
                }

            }
        }
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
    getDateWithoutTime(dateTimestamp, hours: 'min' | 'max'): Date {
        var dateObject = new Date(dateTimestamp);
        if (hours === 'min') {
            dateObject.setHours(0, 0, 0, 0);
        } else if (hours === 'max') {
            dateObject.setHours(23, 59, 59, 999);
        }
        return dateObject;
    }
    getTimeWithoutSeconds(dateTimestamp, seconds: 'min' | 'max'): Date {
        var dateObject = new Date(dateTimestamp);
        if (seconds === 'min') {
            dateObject.setSeconds(0, 0);
        } else if (seconds === 'max') {
            dateObject.setSeconds(59, 999);
        }
        return dateObject;
    }   
    getCombinationIds(ids, n = 0, result = [], current = []) {
        if (n === ids.length) {
            result.push(current)
        } else {
            if (ids[n].length > 0) {
                ids[n].forEach(item =>
                    this.getCombinationIds(ids, n + 1, result, [...current, item])
                )
            } else {
                this.getCombinationIds(ids, n + 1, result, [...current])
            }
        }
        return result
    }

    getRelationalObjectValues(configObject) {
        let taskList = [];
        var value = "";
        var criteriaQueryConfig = {};
        let modifiedSet;
        configObject['relationalObjectsResult'] = {}
        if (configObject['lookupCriteriaQueryConfig']) {
            criteriaQueryConfig = configObject['lookupCriteriaQueryConfig']
        } else if (configObject['layoutCriteriaQueryConfig']) {
            criteriaQueryConfig = configObject['layoutCriteriaQueryConfig']
            modifiedSet = criteriaQueryConfig['modifiedSet'];
        }
        if (criteriaQueryConfig['relationalObjects']) {
            criteriaQueryConfig['relationalObjects'].forEach(element => {
                if (configObject['criteriaDataObject']) {
                    value = this.evaluateExpression(element['queryConfig'], configObject['criteriaDataObject'], 'entry')
                } else if (configObject['filterFieldWithValues']) {
                    value = this.evaluateExpression(element['queryConfig'], configObject['filterFieldWithValues'], 'filter')
                } else if (configObject['listCriteriaDataObject']) {
                    value = this.evaluateExpression(element['queryConfig'], configObject['listCriteriaDataObject'], 'list')
                }
                const lookupObjectName = this.getPrimaryObjectName(element['hierarchyjson'])
                let objectName = this.objectTableMapping.mappingDetail[element['hierarchyjson']['objectName']] + element['queryConfig']['suffix'].toLowerCase();
                var queryJSON = {
                    [objectName]: 'type: ' + objectName + ' AND ' + value
                }
                if(modifiedSet?.type === objectName){
                   queryJSON[objectName] = queryJSON[objectName] + ' AND _id:'+ modifiedSet.id;
               }
                let reverseHierarchyJson = (element['hierarchyjson']['objectType'].toUpperCase() !== "PRIMARY") ? [element['hierarchyjson']] : [];
                taskList = taskList.concat(this.couchdbProvider.fetchObjectIdsBasedOnFilterQuery(reverseHierarchyJson, queryJSON, lookupObjectName).then(res => {
                    configObject['relationalObjectsResult'][element['queryConfig']['identifier']] = (res && res.length > 0) ? res : []
                    return (res && res.length > 0) ? res : []
                }))
            })
            return Promise.all(taskList).then(res => {
                return res;
            })
        } else {
            return Promise.resolve([])
        }
    }
    getJunctionObjects(junctionObjectsConfig) {
        var taskList = [];
        var junctionDataObjects = {}
        junctionObjectsConfig.forEach(config => {
            const objectHierarchyJSON = config['hierarchyJson']
            const fetchParams = {
                'objectHierarchyJSON': objectHierarchyJSON,
                'layoutDataRestrictionSet': {},
                'dataSource': appConstant.couchDBStaticName,
                'searchListQuery': 'type: ' + this.objectTableMapping.mappingDetail[objectHierarchyJSON['objectName']] + ' AND ' + config['courUserFieldName'] + ': ' + this.appUtility.loggedUserCorObject.id
            }
            taskList = taskList.concat(this.dataProvider.fetchDataFromDataSource(fetchParams).then(res => {
                return (res['status'] === "SUCCESS" && res['records'] && res['records'].length > 0) ? res['records'] : undefined
            }))
        })
        return Promise.all(taskList).then(result => {
            result.forEach(record => {
                if (record) {
                    junctionDataObjects[record[0]['type']] = record
                }
            })
            return junctionDataObjects
        })
    }

    getPrimaryObjectName(hierarchyjson) {
        if (hierarchyjson['objectType'].toUpperCase() === 'PRIMARY' && hierarchyjson['childObject'].length === 0) {
            return hierarchyjson['objectId'].includes('pfm') ? hierarchyjson['objectId'] : 'pfm' + hierarchyjson['objectId']
        } else {
            if (hierarchyjson['childObject'].length > 0) {
                return this.getPrimaryObjectName(hierarchyjson['childObject'][0])
            } else {
                return ''
            }
        }
    }

    evaluateOpertorAction(operator, operands, dataObject, entryOrfilter) {
        
        let eachOperandResultArray = []
        operands.forEach(operand => {
            eachOperandResultArray.push(this.evaluateExpression(operand, dataObject, entryOrfilter, operator))
        });
        if (entryOrfilter === 'entry' || entryOrfilter === 'list' || operands[1]['objectName'] === "LOGGEDUSER") {
            if (eachOperandResultArray.length > 0) {
                operator['query'] = eachOperandResultArray
            }
            return this.evaluateByOperandsForQuery(operator);
        } else {
            let objectName = operands[1]['objectName']
            let fieldName = operands[1]['fieldName']
            let elementId = operands[1]['elementId']
            if (objectName && fieldName) {
                let key = this.objectTableMapping.mappingDetail[objectName] + '_' + fieldName + '_' + elementId;
                var fieldObject = dataObject[key]
                if (fieldObject['conditionalOperator'] && fieldObject['conditionalOperator'] === "<>") {
                    return '-' + eachOperandResultArray[0] + ': ' + eachOperandResultArray[1]
                } else {
                    if (eachOperandResultArray.length > 0) {
                        operator['query'] = eachOperandResultArray
                    }
                    return this.evaluateByOperandsForQuery(operator);
                }
            } else {
                if (eachOperandResultArray.length > 0) {
                    operator['query'] = eachOperandResultArray
                }
                return this.evaluateByOperandsForQuery(operator);
            }
        }
    }
    evaluateByOperandsForQuery(operatorObj) {
        let operands = operatorObj['query']
        if (Array.isArray(operands[1])) {
            return this.makeQueryWithArray(operatorObj)
        } else {
            return this.makeQueryWithStrings(operatorObj)
        }
    }
    makeQueryWithArray(operatorObj) {
        let operator = operatorObj['operator']
        let operands = operatorObj['query']
        if (operator === '==') {
            let operand = operatorObj && operatorObj['operands'] && operatorObj['operands'][0]
            let fieldType = operand['fieldType']
            if (operand && fieldType && Array.isArray(operands[1]) && (fieldType === "MULTISELECT" || fieldType === "CHECKBOX")) {
                let qString = this.makeQueryForMultiselectAndCheckBoxFields(operands[1], operand);
                return (operands[1].length === 1 && operands[1][0] === null) ? '(*:* -' + operands[0] + ': ( ' + qString + ' ))' : operands[0] + ': ( ' + qString + ' )'
            } else {
                return operands[0] + ': ( ' + operands[1].join(' OR ') + ' )'
            }
        } else if (operator === '!=') {
            let operand = operatorObj && operatorObj['operands'] && operatorObj['operands'][0]
            let fieldType = operand['fieldType']
            if (operand && fieldType && Array.isArray(operands[1]) && (fieldType === "MULTISELECT" || fieldType === "CHECKBOX")) {
                let qString = this.makeQueryForMultiselectAndCheckBoxFields(operands[1], operand);
                return (operands[1].length === 1 && operands[1][0] === null) ? '(*:* -' + '(*:* -' + operands[0] + ': ( ' + qString + ' ))' + ' )' : '(*:* -' + operands[0] + ': ( ' + qString + ' ))'
            } else {
                return '(*:* -' + operands[0] + ': ( ' + operands[1].join(' OR ') + ' ))'
            }
        } else if (operator === '>') {
            return operands[0] + ': { ' + Math.min(...operands[1]) + ' TO Infinity }'
        } else if (operator === '<') {
            return operands[0] + ': { -Infinity TO ' + Math.max(...operands[1]) + '}'
        } else if (operator === '>=') {
            return operands[0] + ': [ ' + Math.min(...operands[1]) + ' TO Infinity ]'
        } else if (operator === '<=') {
            return operands[0] + ': [ -Infinity TO ' + Math.max(...operands[1]) + ']'
        } else if (operator === 'LIKE') {
            return operands[0] + ': (' + operands[1].map(e => '_*' + e + '*').join(' OR ') + ' )'
        } else if (operator === 'NOT LIKE') {
            return '-' + operands[0] + ': (' + operands[1].map(e => '_*' + e + '*').join(' OR ') + ' )'
        } else if (operator === 'IS NUL') {
            return operands[0] + ': null'
        } else if (operator === 'IS NOT NUL') {
            return operands[0] + ': [" TO *]'
        } else if (operator === '&&') {
            if (operatorObj['query']) {
                return '( ' + operatorObj['query'].join(' AND ') + ' )'
            }
            return "";
        } else if (operator === '||') {
            if (operatorObj['query']) {
                return '( ' + operatorObj['query'].join(' OR ') + ' )'
            }
            return "";
        }
    }
    makeQueryForMultiselectAndCheckBoxFields(values, operand) {
        let otherValues = [];
        let orString
        let andString = values.join(' AND ')
        let value
        if (operand['valueType'] === 'constant') {
            value = operand['value'];
        }
        operand['value'] = operand['value'] ? operand['value'].map(element => isNaN(element) ? '_' + this.appUtility.makeRegexQueryMultiSelect(element) : element) : values
        otherValues = this.getNotSelectedValues(operand);
        if (operand['valueType'] === 'constant') {
            operand['value'] = value;
        } else {
            delete operand['value'];
        }
        if (otherValues.length > 0) {
            orString = otherValues.join(' OR ')
        }
        return (orString && andString) ? andString + ' NOT ' + '(' + orString + ')' : andString ? andString : '(' + orString + ')'
    }

    makeQueryWithStrings(operatorObj) {
        let operator = operatorObj['operator']
        let operands = operatorObj['query']
        if (operator === '==') {
            return `${operands[0]}: ${operands[1]}`;
        } else if (operator === '!=') {
            return `(*:* -${operands[0]}: ${operands[1]})`;
        } else if (operator === '>') {
            return `${operands[0]}: { ${operands[1]} TO Infinity }`;
        } else if (operator === '<') {
            return `${operands[0]}: { -Infinity TO ${operands[1]} }`;
        } else if (operator === '>=') {
            return `${operands[0]}: [ ${operands[1]} TO Infinity ]`;
        } else if (operator === '<=') {
            return `${operands[0]}: [ -Infinity TO ${operands[1]} ]`;
        } else if (operator === 'LIKE') {
            return `${operands[0]}: _*${operands[1]}*`;
        } else if (operator === 'NOT LIKE') {
            return `-${operands[0]}: _*${operands[1]}*`;
        } else if (operator === 'IS NUL') {
            return `${operands[0]}: null`;
        } else if (operator === 'IS NOT NUL') {
            return `${operands[0]}: [" TO *]`;
        } else if (operator === '&&') {
            return (operatorObj['query']) ? `( ${operatorObj['query'].join(' AND ')} )` : "";
        } else if (operator === '||') {
            return (operatorObj['query']) ? `( ${operatorObj['query'].join(' OR ')} )` : "";
        }
    }

    criteriaLookupFieldChange(form, formGroup, criteriaInvolvedFieldsList, lookupCriteriaValidationFields, dataObject, criteriaDataObject) {
        const formGroupControls = formGroup.controls;
        let val = Object.keys(form).some(objectId => {
            if (formGroupControls[objectId].dirty) {
                dataObject[objectId] = lodash.extend({}, dataObject[objectId], form[objectId])
                if (criteriaInvolvedFieldsList[objectId]) {
                    var formControls = formGroupControls[objectId]['controls']
                    var value = Object.keys(criteriaInvolvedFieldsList[objectId]).some(fieldName => {
                        var formControlName = "";
                        if (formControls[fieldName]) {
                            formControlName = fieldName
                        } else if (formControls[fieldName + '_searchKey']) {
                            formControlName = fieldName + '_searchKey'
                        }
                        if (formControls[formControlName].dirty) {
                            let isValuesDifferent = false;
                            if (dataObject[objectId][fieldName] && Array.isArray(dataObject[objectId][fieldName])) {
                                if (Array.isArray(criteriaDataObject[objectId][fieldName])) {
                                    if (!lodash.isEqual(dataObject[objectId][fieldName].sort(), criteriaDataObject[objectId][fieldName].sort())) {
                                        isValuesDifferent = true;
                                    }
                                } else {
                                    isValuesDifferent = true;
                                }
                            } else if (dataObject[objectId][fieldName] && (dataObject[objectId][fieldName].constructor === ({}).constructor)) {
                                if (!lodash.isEqual(dataObject[objectId][fieldName], criteriaDataObject[objectId][fieldName])) {
                                    isValuesDifferent = true;
                                }
                            } else if ((criteriaDataObject[objectId][fieldName] && criteriaDataObject[objectId][fieldName].constructor === ({}).constructor) && dataObject[objectId][fieldName] !== criteriaDataObject[objectId][fieldName]['id']) {  //for checking lookup is object
                                isValuesDifferent = true;
                            }
                            else if ((criteriaDataObject[objectId][fieldName] && criteriaDataObject[objectId][fieldName].constructor !== ({}).constructor) && dataObject[objectId][fieldName] !== criteriaDataObject[objectId][fieldName]) {  //for checking lookup is object or normal field
                                isValuesDifferent = true;
                            }
                            const lookupObjects = criteriaInvolvedFieldsList[objectId][fieldName]
                            lookupObjects.forEach(lookupObject => {
                                if (lookupCriteriaValidationFields[lookupObject][objectId][fieldName]['showAlert']) {
                                    lookupCriteriaValidationFields[lookupObject][objectId][fieldName]['showAlert'] = false
                                }
                            })
                            if (isValuesDifferent) {
                                lookupObjects.forEach(lookupObject => {
                                    dataObject[objectId][lookupObject] = null
                                    if (dataObject[objectId][lookupObject + '_searchKey']) {
                                        dataObject[objectId][lookupObject + '_searchKey'] = null
                                    }
                                    dataObject[lookupObject] = JSON.parse(JSON.stringify({}))
                                    if( formGroup.get(objectId) && formGroup.get(objectId)['controls'] && formGroup.get(objectId)['controls'][lookupObject + '_searchKey']){
                                        formGroup.get(objectId)['controls'][lookupObject + '_searchKey'].patchValue(null) 
                                      }    
                                })
                                return true
                            }
                        }
                    })
                }
                criteriaDataObject[objectId] = lodash.extend({}, criteriaDataObject[objectId], dataObject[objectId])
                return value
            } else {
                dataObject[objectId] = lodash.extend({}, dataObject[objectId], form[objectId])
                criteriaDataObject[objectId] = lodash.extend({}, criteriaDataObject[objectId], dataObject[objectId])
            }
        })
    }

    updateCriteriaDataObject(formGroup, criteriaDataObject, dataObject) {
        Object.keys(formGroup.controls).forEach(objectId => {
            criteriaDataObject[objectId] = lodash.extend({}, criteriaDataObject[objectId], dataObject[objectId])
        })
        return criteriaDataObject
    }

    checkCriteriaEntryFieldsAvailable(criteriaFields, criteriaDataObject, dataObject) {
        var errorMessage = [];
        var lookupFields = []
        var lookupCriteriaObjectId = {};
        var showAlert = false;
        Object.keys(criteriaFields).forEach(objectType => {
            Object.keys(criteriaFields[objectType]).forEach(criteriaField => {
                let result = "";
                if (objectType === "loggedUser") {
                    result = this.recursiveCheckCriteriaFields(criteriaFields[objectType][criteriaField], this.appUtility.loggedUserCorObject, errorMessage, dataObject)
                } else {
                    result = this.recursiveCheckCriteriaFields(criteriaFields[objectType][criteriaField], criteriaDataObject[objectType], errorMessage, dataObject);
                }
                if (result === 'showAlert#for$Criteria') {
                    criteriaFields[objectType][criteriaField]['showAlert'] = true
                    showAlert = true
                    lookupFields.push(criteriaFields[objectType][criteriaField]);
                    lookupCriteriaObjectId = objectType;
                } else if (Array.isArray(result)) {
                    errorMessage = result
                } else {
                    criteriaFields[objectType][criteriaField]['value'] = result
                }
            })
        })
        return {
            'errorMessage': errorMessage,
            'validationFailureSet': [{"fields":lookupFields}],
            'lookupCriteriaObjectId': lookupCriteriaObjectId,
            'criteriaFields': criteriaFields,
            'showAlert': showAlert
        }
    }

    recursiveCheckCriteriaFields(criteriaField, criteriaDataObject, errorMessage?, dataObject?) {
        let fieldName = criteriaField['fieldName']
        let fieldDisplayName = criteriaField['fieldDisplayName']
        let fieldType = criteriaField['fieldType']
        if (fieldType === 'MASTERDETAIL' || fieldType === 'MASTERLOOKUP' || fieldType === 'LOOKUP') {
            let objectDetails = criteriaField['objectdetails']
            if (fieldType === "MASTERDETAIL") {
                if (!criteriaDataObject[fieldName + 's'][0]) {
                    errorMessage.push(fieldDisplayName)
                    return errorMessage
                } else {
                    let result = this.recursiveCheckCriteriaFields(objectDetails, criteriaDataObject[fieldName + 's'][0])
                    if (result === 'showAlert#for$Criteria') {
                        errorMessage.push(fieldDisplayName)
                        return errorMessage
                    } else {
                        return result
                    }
                }
            } else if (fieldType === "MASTERLOOKUP" || fieldType === 'LOOKUP') {
                if (!criteriaDataObject[fieldName]) {
                    return 'showAlert#for$Criteria'
                } else {
                    return this.recursiveCheckCriteriaFields(objectDetails, dataObject[fieldName])
                }
            }
        } else {
            if (criteriaDataObject[fieldName] === null || criteriaDataObject[fieldName] === undefined || criteriaDataObject[fieldName] === '' ||
                (Array.isArray(criteriaDataObject[fieldName]) && criteriaDataObject[fieldName].length === 0)) {
                return 'showAlert#for$Criteria'
            }
            if (fieldType === "MULTISELECT" || fieldType === "CHECKBOX") {
                return criteriaDataObject[fieldName].map(element => this.translateService.instant(criteriaField['mappingDetail'][element])).join(', ')
            } else if (fieldType === "RADIO" || fieldType === 'DROPDOWN') {
                return this.translateService.instant(criteriaField['mappingDetail'][criteriaDataObject[fieldName]])
            } else if ((fieldType === "FORMULA" && criteriaField['formulaType'] === "DATE") || (fieldType === "FORMULA" && criteriaField['formulaType'] === "TIMESTAMP") || 
            (fieldType === "ROLLUPSUMMARY" && criteriaField['rollupResultType'] === "DATE") || (fieldType === "ROLLUPSUMMARY" && criteriaField['rollupResultType'] === "TIMESTAMP") || fieldType === "DATE" || fieldType === "TIMESTAMP") {
                let zoneOffsetValue = ""
                if (typeof criteriaDataObject[fieldName] === "string") {
                    return criteriaDataObject[fieldName]
                }
                let dateOrDateTimeFormat = ""
                if (fieldType === "FORMULA" && criteriaField['formulaType'] === "DATE" || fieldType === "DATE" || fieldType === "ROLLUPSUMMARY" && criteriaField['rollupResultType'] === "DATE") {
                    zoneOffsetValue = '-0000';
                    dateOrDateTimeFormat = this.appUtility.userDatePickerFormat
                } else {
                    zoneOffsetValue = this.appUtility.userZoneOffsetValue; 
                    dateOrDateTimeFormat = this.appUtility.userDateTimePickerFormat
                }
                if (criteriaDataObject[fieldName]) {
                    return this.datePipe.transform(
                        criteriaDataObject[fieldName],
                        criteriaField["dateFormat"],
                        zoneOffsetValue
                      )
                } else {
                    return criteriaDataObject[fieldName]
                }
            } else {
                return criteriaDataObject[fieldName]
            }
        }
    }

    checkCriteriaFilterFieldsAvailable(criteriaFields, filterFieldInfo: { [elementKey: string]: FilterFieldInfo }) {
        var errorMessage = [];
        var showAlert = false;
        Object.keys(criteriaFields).forEach(elementKey => {
            var fieldValue;
            if (elementKey.startsWith("loggedUser_")) {
                const loggedUserObject = this.appUtility.loggedUserCorObject;
                let fieldType = criteriaFields[elementKey]['fieldType']
                let fieldName = criteriaFields[elementKey]['fieldName']
                if (fieldType === "TIMESTAMP") {
                    fieldValue = moment(loggedUserObject[fieldName]).format(this.appUtility.userDateTimePickerFormat);
                } else if (fieldType === "DATE") {
                    fieldValue = moment(loggedUserObject[fieldName]).format(this.appUtility.userDatePickerFormat);
                } else {
                    fieldValue = loggedUserObject[fieldName];
                }
            } else {
                if (filterFieldInfo[elementKey] && filterFieldInfo[elementKey]['fieldValue']) {
                    if (filterFieldInfo[elementKey]['fieldType'] === "BOOLEAN") {
                        let values: boolean[] = [];
                        if (filterFieldInfo[elementKey]['fieldValue'][0]) values.push(true);
                        if (filterFieldInfo[elementKey]['fieldValue'][1]) values.push(false);
                        fieldValue = values.join(',');
                    } else {
                        let fieldObject: FilterFieldInfo = filterFieldInfo[elementKey]
                        if (fieldObject['betweenflag'] === "Y") {
                            let from = fieldObject['fieldValue']['from'];
                            let to = fieldObject['fieldValue']['to'];
                            fieldValue = (from === "" || to === "") ? "" : `${from} TO ${to}`;
                        } else if (fieldObject['fieldType'] === "RADIO" || fieldObject['fieldType'] === "DROPDOWN" || fieldObject['fieldType'] === "CHECKBOX"
                            || fieldObject['fieldType'] === "MULTISELECT") {
                            let values: string[] = [];
                            fieldObject['displayInfo']['selected'].forEach(selectedObj => values.push(selectedObj['label']));
                            fieldValue = values.join(", ");
                        } else {
                            fieldValue = fieldObject['fieldValue'];
                        }
                    }
                }
            }
            if (fieldValue === undefined || fieldValue === '' || fieldValue.length === 0) {
                criteriaFields[elementKey]['showAlert'] = true;
                showAlert = true;
            } else {
                criteriaFields[elementKey]['value'] = fieldValue;
                criteriaFields[elementKey]['showAlert'] = false;
            }
        })
        return {
            'errorMessage': errorMessage,
            'criteriaFields': criteriaFields,
            'showAlert': showAlert
        }
    }

    checkCriteriaAvailableInSlickgrid(cspfmDataDisplayPipe, criteriaInvolvedFields: Array<FieldInfo>, dataContext: any) {
        var errorMessage = [];
        var showAlert = false;
        let criteriaFields = {}
        criteriaInvolvedFields.forEach(criteriaInvolvedField => {
            let key = criteriaInvolvedField['prop'];
            criteriaFields[key] = {}
            let fieldValue;
            if (criteriaInvolvedField['objectName'] === 'COR_USERS') {
                fieldValue = cspfmDataDisplayPipe.transform(this.appUtility.loggedUserCorObject, criteriaInvolvedField)
            } else {
                fieldValue = cspfmDataDisplayPipe.transform(dataContext, criteriaInvolvedField)
            }
            criteriaFields[key]['fieldDisplayName'] = criteriaInvolvedField['label'];
            if (fieldValue === undefined || fieldValue === null || fieldValue === '' || fieldValue.length === 0) {
                errorMessage.push(criteriaInvolvedField.label);
                criteriaFields[key]['showAlert'] = true;
                showAlert = true;
            } else {
                criteriaFields[key]['value'] = fieldValue;
                criteriaFields[key]['showAlert'] = false;
            }
        })
        return {
            'errorMessage': errorMessage,
            'criteriaFields': criteriaFields,
            'showAlert': showAlert
        }
    }
    handleLookupCriteriaInvolvedClonedFields(dataCloningInfo, lookupCriteriaValidationFields) {
        let criteriaConfiguredLookupFields = []
        let lookupCriteriaFieldsClonedArray = []
        let tempDataCloningInfo = []
        let toastMessageArray = []
        criteriaConfiguredLookupFields = Object.keys(lookupCriteriaValidationFields)
        if (criteriaConfiguredLookupFields.length > 0) {
            tempDataCloningInfo = [...dataCloningInfo]
            dataCloningInfo = tempDataCloningInfo.filter(element => !criteriaConfiguredLookupFields.includes(element['destinationFieldInfo']['destinationFieldName']))
            lookupCriteriaFieldsClonedArray = tempDataCloningInfo.filter(element => criteriaConfiguredLookupFields.includes(element['destinationFieldInfo']['destinationFieldName']))
            if (lookupCriteriaFieldsClonedArray.length > 0) {
                let getKeyByValue = (object, fieldName) => {
                    return Object.keys(object).find(key => object[key] === fieldName);
                }
                lookupCriteriaFieldsClonedArray.forEach(element => {
                    let destinationObjectName = element['destinationFieldInfo']['destinationObjectName']
                    let destinationFieldName = element['destinationFieldInfo']['destinationFieldName']
                    let objectName = this.objectTableMapping['mappingDetail'][destinationObjectName]
                    let lookupFieldNames = this.lookupFieldMapping['mappingDetail'][objectName]
                    toastMessageArray.push(getKeyByValue(lookupFieldNames, destinationFieldName))
                })
                let notClonedToastMessage = "not cloned because it is configured with criteria"
                toastMessageArray.length === 1 ? this.appUtility.presentToast(toastMessageArray.join(", ") + " lookup field is " + notClonedToastMessage) : this.appUtility.presentToast(toastMessageArray.join(", ") + " lookup fields are " + notClonedToastMessage)
            }
        }
        return dataCloningInfo
    }

    handleNullValue(fieldtype) {
        if (['PASSWORD', 'TEXT', 'AUTONUMBER', 'TEXTAREA', 'EMAIL', 'URL', 'MULTISELECT', 'CHECKBOX'].includes(fieldtype)) {
            return '_cspfm_null';
        } else {
            return 'cspfm_null';
        }
    }


// This method for Data Restriction commonization HL list, List, Search list, List preview
dataRestrictionFetch(layoutDataRestrictionSet, methodCalledBy) {
    let taskList = [];
    const objectName = layoutDataRestrictionSet['objectName'];
    if (layoutDataRestrictionSet['dataRestrictionSet'].length > 0 && layoutDataRestrictionSet['dataRestrictionSet'][0]['restrictionType'] === "userAssignment") {
        taskList.push(this.dataProvider.fetchUserAssingment(objectName, layoutDataRestrictionSet['dataRestrictionSet'], methodCalledBy, layoutDataRestrictionSet['searchQuery']))
    }
    if (layoutDataRestrictionSet['criteriaQueryConfig'] && layoutDataRestrictionSet['criteriaQueryConfig']['relationalObjects'] && layoutDataRestrictionSet['criteriaQueryConfig']['relationalObjects'].length > 0) {
        if (methodCalledBy === 'list') {
            taskList.push(this.checkRelationalObjectsAndContinueFetch(layoutDataRestrictionSet['criteriaQueryConfig'], {}, objectName))
        }else {
            taskList.push(this.checkRelationalObjectsAndContinueFetch(layoutDataRestrictionSet['criteriaQueryConfig'], layoutDataRestrictionSet['junctionDataObjects'], objectName))
        }
    }
    return Promise.all(taskList).then(result => {
        const dataRestrictionIdSet = lodash.intersection(...result);
        return Promise.resolve(dataRestrictionIdSet);
    }).catch(error => {
        return error;
    });
}

checkRelationalObjectsAndContinueFetch(criteriaQueryConfig,junctionDataObjects, objectname) {
    let configObject = {
      'layoutCriteriaQueryConfig': criteriaQueryConfig,
      'listCriteriaDataObject': junctionDataObjects
    }
    const objectName = objectname;
    return this.getRelationalObjectValues(configObject).then(res => {
      let layoutCriteriaReationalObjectIds = configObject['relationalObjectsResult']
      let taskList = [];     
      let idArray = []
      let keys = Object.keys(layoutCriteriaReationalObjectIds);
      for (const key of keys) {
        let value = lodash.chunk(layoutCriteriaReationalObjectIds[key], this.batchIdLimit);
        idArray.push(value)
      }
      let resultsArray = this.getCombinationIds(idArray);
        for (const result of resultsArray) {
          let ids = result
          let tempConfig = {}
          for (let m = 0; m < ids.length; m++) {
            tempConfig[keys[m]] = ids[m]
          }
          configObject['relationalObjectsResult'] = tempConfig;
          let layoutCriteriaQuery = this.lookupCriteriaQueryEvaluateFunction(configObject);
          let searchQuery = "type:" + objectName + ' AND ' + layoutCriteriaQuery;
          if(configObject['layoutCriteriaQueryConfig']['modifiedSet'] &&  configObject['layoutCriteriaQueryConfig']['modifiedSet']['type'] === objectName){
            searchQuery = searchQuery+' AND _id:'+ configObject['layoutCriteriaQueryConfig']['modifiedSet']['id']
          }
          const fetchParams = { "searchListQuery": searchQuery, "objectName": objectName };    
          taskList.push(this.dataProvider.primaryObjDataFetch(fetchParams));
        }
        return Promise.all(taskList).then(result => {
          return Promise.resolve(lodash.uniq(lodash.flatten(result)))
        }).catch(error => {
          return error;
        });
  })
}
}
