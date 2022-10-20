
import { Injectable } from "@angular/core";
import { appUtility } from '../utils/appUtility';
import { dataProvider } from "../utils/dataProvider";
import { appConstant } from "../utils/appConstant";
import * as lodash from "lodash";
import * as moment from "moment";
import "moment-timezone";
import { objectTableMapping } from "../pfmmapping/objectTableMapping";
import { Validators } from "@angular/forms";
import { lookupFieldMapping } from "../pfmmapping/lookupFieldMapping";
import { DatePipe } from "@angular/common";
import { metaDbConfiguration } from "../db/metaDbConfiguration";
import { ConditionalValidation } from "../models/cspfmConditionalValidation.type";
import { cspfmFormulaService } from "../services/cspfmFormula.service";
import { currencyDetail } from "../utils/currencyDetail";


@Injectable({
    providedIn: "root"
})

export class cspfmConditionalValidationUtils {

    constructor(private appUtilityObject: appUtility, private dataProviderObject: dataProvider,
        private objectTableMapping: objectTableMapping,
        private lookupFieldMapping: lookupFieldMapping, private datePipe: DatePipe,
        private cspfmFormulaService: cspfmFormulaService,
        private metaDbConfig: metaDbConfiguration,private currencyConfig: currencyDetail) { }

    fetchConditionalValidationConfigJSON(conditionalValidationJson: ConditionalValidation) {
        let layoutId = conditionalValidationJson.layoutId
        let elementIdSuffix = '';
        if (conditionalValidationJson['layoutType'] === 'Preview') {
            layoutId = conditionalValidationJson['layoutId'].split('_')[0]
            elementIdSuffix = '_preview';
        }
        conditionalValidationJson['elementIdSuffix'] = elementIdSuffix;
        const queryParams = {
            id: ['conditionalvalidation_' + this.appUtilityObject.orgId + '_' + layoutId],
            dataSource: appConstant.couchDBStaticName
        }
        this.dataProviderObject.fetchDocsUsingRecordIds(queryParams).then(result => {
            if (result['status'] === 'SUCCESS') {
                const configDoc = result['response']
                if (conditionalValidationJson.layoutType === 'List' || conditionalValidationJson.layoutType === 'HeaderLineList') {
                    const configDoc = result['response']
                    this.getRestrictionsBasedOnUser(conditionalValidationJson, configDoc);
                } else if (conditionalValidationJson.layoutType === 'View' ||
                    conditionalValidationJson.layoutType === 'Preview' || conditionalValidationJson.layoutType === 'DetailView') {
                    if (conditionalValidationJson.conditionalValidationObjectHierarchy.length > 0) {
                        conditionalValidationJson.conditionalValidationObjectHierarchy.forEach(hierarchyJSONObject => {
                            this.getDataObjectForConditionalValidation
                                (conditionalValidationJson, conditionalValidationJson.dataObject
                                [conditionalValidationJson.primaryTraversalPath],
                                    conditionalValidationJson.objectHierarchy, hierarchyJSONObject, configDoc)
                        });
                    } else {
                        this.getRestrictionsBasedOnUser(conditionalValidationJson, configDoc);
                    }
                } else if (conditionalValidationJson.layoutType === 'Edit' || conditionalValidationJson.layoutType === 'Add') {  
                        this.getRestrictionsBasedOnUser(conditionalValidationJson, configDoc);
                } 
            }
        })
    }

    async getDataObjectForConditionalValidation(conditionalValidationJson:
        ConditionalValidation, resultObject, objectHierarchyJSON, objectReverseHierarchyJSON, configDoc) {
        const fetchParams = {
            'objectReverseHierarchyJSON': objectReverseHierarchyJSON,
            'objectHierarchyJSON': objectHierarchyJSON,
            'dataSource': appConstant.couchDBStaticName,
            'additionalInfo': resultObject
        }
        this.dataProviderObject.querySingleFormualDoc(fetchParams).then(result => {
            if (result['status'] !== 'SUCCESS') {
                const errorMessageToDisplay = result['message'];
                if (errorMessageToDisplay === "No internet") {
                    this.appUtilityObject.presentToastController(
                        'No internet connection.Please check your internet connection and try again.', true, 'Retry');
                }
                return errorMessageToDisplay
            }
            conditionalValidationJson.conditionalValidationRelationshipDataObject = lodash.extend
                ({}, conditionalValidationJson.conditionalValidationRelationshipDataObject, result["records"]);
            this.getRestrictionsBasedOnUser(conditionalValidationJson, configDoc);
        }).catch(error => {
            console.log("error====", error)
        });
    }

    getRestrictionsBasedOnUser(conditionalValidationJson: ConditionalValidation, configDoc) {

        const conditionalValidations = configDoc['conditionalValidationSet'];

        conditionalValidations.filter(element => {
            if (element['validationAssignment']['user'] || element['validationAssignment']
            ['userrole'] || element['validationAssignment']['usergroup'] || element['validationAssignment']['userres']) {
                if (element['validationAssignment']['user'] && element['validationAssignment']
                ['user'].includes(this.appUtilityObject.userId) && element['isActive']) {
                    conditionalValidationJson.validationRules.push(element)
                }

                if (element['validationAssignment']['userrole'] && element
                ['validationAssignment']['userrole'].includes(this.appUtilityObject.roleId) && element['isActive']) {
                    conditionalValidationJson.validationRules.push(element)
                }

                if (element['validationAssignment']['usergroup'] && element['isActive'] && this.
                    appUtilityObject.userGroups.some(item => element['validationAssignment']['usergroup'].includes(item))) {
                    conditionalValidationJson.validationRules.push(element)
                }

                if (element['validationAssignment']['userres'] && element['isActive'] && this.
                    appUtilityObject.userResponsibilities.some(item => element['validationAssignment']['userres'].includes(item))) {
                    conditionalValidationJson.validationRules.push(element)
                }
            } else {
                if (element['isActive']) {
                    conditionalValidationJson.validationRules.push(element)
                }
            }
        })
    }

    async fetchParentObjectForConditionalValidation(conditionalValidationJson: ConditionalValidation, parentId, parentName, configDoc) {
        const additionalObjectData = {};
        additionalObjectData['id'] = parentId;
        additionalObjectData['type'] = parentName;
        for (let i = 0; i < conditionalValidationJson.conditionalValidationObjectHierarchy.length; i++) {
            const objectReverseHierarchyJSON = conditionalValidationJson.conditionalValidationObjectHierarchy[i]
            const fetchParams = {
                'objectReverseHierarchyJSON': objectReverseHierarchyJSON,
                'objectHierarchyJSON': conditionalValidationJson.objectHierarchy,
                'dataSource': appConstant.couchDBStaticName,
                'additionalInfo': additionalObjectData,
                'fetchParent': true
            }
            this.dataProviderObject.querySingleFormualDoc(fetchParams).then(result => {
                if (result['status'] !== 'SUCCESS') {
                    const errorMessageToDisplay = result['message'];
                    if (errorMessageToDisplay === "No internet") {
                        this.appUtilityObject.presentToastController(
                            'No internet connection. Please check your internet connection and try again.', true, 'Retry');
                    }
                    return errorMessageToDisplay
                }
                conditionalValidationJson.conditionalValidationRelationshipDataObject = lodash.
                    extend({}, conditionalValidationJson.conditionalValidationRelationshipDataObject, result["records"]);
                this.getRestrictionsBasedOnUser(conditionalValidationJson, configDoc);
            }).catch(error => {
                console.log("error====", error)
            });
        }
    }

    applyValidationForOnChange(conditionalValidationJson: ConditionalValidation, eventType, fieldName, onClickWithOutConsolidate?) {
        const conditionalValidationSet = conditionalValidationJson.validationRules
        const conditionalValidationRelationshipDataObject = conditionalValidationJson.conditionalValidationRelationshipDataObject

        const eventTypeFilter = lodash.filter(conditionalValidationSet, function (validationSet) {
            return (validationSet['eventType'] === eventType && validationSet['isActive'] === true);
        })
        let validationsSet = []
        if (eventType === 'onChange') {
            validationsSet = lodash.filter(eventTypeFilter, function (validation) {
                return (validation['fieldName'] === fieldName);
            })
        } else if (eventType === 'onClick') {
            validationsSet = lodash.filter(eventTypeFilter, function (validation) {
                return (validation['actionId'] === fieldName);
            })
        }
        if (validationsSet.length > 0) {
            const resultObject = []
            validationsSet.forEach(validation => {
                const validations = lodash.filter(validation['validations'], function (activeObject) {
                    return (activeObject['isActive'] === true);
                })
                const sortValidations = lodash.sortBy(validations, ['messageType']);

                sortValidations.forEach(validationObject => {
                    const consolidateFlag = validation["consolidatedExecutionRequired"]
                    if (consolidateFlag) {
                        const responseValue = this.cspfmFormulaService.evaluate(validationObject,
                            conditionalValidationJson.dataObject)
                        validationObject['consolidateFlag'] = consolidateFlag
                        validationObject['validateFieldName'] = fieldName
                        if (responseValue) {
                            validationObject['validationPass'] = false
                            if (validationObject['tempValidationMessage'] === null || validationObject['tempValidationMessage'] === undefined) {
                                let tempValidationMessage = validationObject['validationMessage']
                                validationObject['tempValidationMessage'] = tempValidationMessage
                            }
                            this.splitFieldNameAndObjectName(validationObject, conditionalValidationJson.dataObject)
                            resultObject.push(validationObject)
                        } else {
                            // if (conditionalValidationJson['layoutType'] === 'HeaderLineList' || conditionalValidationJson['layoutType'] === 'List') {
                                validationObject['validationPass'] = true
                                if (validationObject['tempValidationMessage'] === null || validationObject['tempValidationMessage'] === undefined) {
                                    let tempValidationMessage = validationObject['validationMessage']
                                    validationObject['tempValidationMessage'] = tempValidationMessage
                                }
                                this.splitFieldNameAndObjectName(validationObject, conditionalValidationJson.dataObject)
                                resultObject.push(validationObject)
                            // }
                        }
                    } else {
                        const responseValue = this.cspfmFormulaService.evaluate(validationObject,
                            conditionalValidationJson.dataObject)
                        validationObject['consolidateFlag'] = consolidateFlag
                        validationObject['validateFieldName'] = fieldName
                        if (responseValue) {
                            if (eventType === 'onClick') {
                                if (onClickWithOutConsolidate.length > 0) {
                                    const consolidateFilter = lodash.filter(onClickWithOutConsolidate, function (result) {
                                        return (result['formula'] === validationObject['formula']);
                                    })
                                    if (consolidateFilter.length > 0) { // validation is available
                                        if (validationObject['messageType'] === 'Error') {
                                            validationObject['validationPass'] = false
                                            if (validationObject['tempValidationMessage'] === null || validationObject['tempValidationMessage'] === undefined) {
                                                let tempValidationMessage = validationObject['validationMessage']
                                                validationObject['tempValidationMessage'] = tempValidationMessage
                                            }
                                            this.splitFieldNameAndObjectName(validationObject, conditionalValidationJson.dataObject)
                                            resultObject.push(validationObject)
                                            return
                                        }
                                    } else {
                                        validationObject['validationPass'] = false
                                        if (validationObject['tempValidationMessage'] === null || validationObject['tempValidationMessage'] === undefined) {
                                            let tempValidationMessage = validationObject['validationMessage']
                                            validationObject['tempValidationMessage'] = tempValidationMessage
                                        }
                                        this.splitFieldNameAndObjectName(validationObject, conditionalValidationJson.dataObject)
                                        resultObject.push(validationObject)
                                        return
                                    }
                                } else {
                                    validationObject['validationPass'] = false
                                    if (validationObject['tempValidationMessage'] === null || validationObject['tempValidationMessage'] === undefined) {
                                        let tempValidationMessage = validationObject['validationMessage']
                                        validationObject['tempValidationMessage'] = tempValidationMessage
                                    }
                                    this.splitFieldNameAndObjectName(validationObject, conditionalValidationJson.dataObject)
                                    resultObject.push(validationObject)
                                    return
                                }
                            } else {
                                validationObject['validationPass'] = false
                                if (validationObject['tempValidationMessage'] === null || validationObject['tempValidationMessage'] === undefined) {
                                    let tempValidationMessage = validationObject['validationMessage']
                                    validationObject['tempValidationMessage'] = tempValidationMessage
                                }
                                this.splitFieldNameAndObjectName(validationObject, conditionalValidationJson.dataObject)
                                resultObject.push(validationObject)
                                return
                            }
                        }
                    }
                });
            });
            const displayMessageObject = this.makeConsolidateMessage(resultObject)
            return displayMessageObject
        } else {
            const displayMessageObject = {
                "status": "Failed"
            }
            return displayMessageObject
        }
    }

    splitFieldNameAndObjectName(validationObject, dataObject) {
        if (validationObject['validationMessageInputType'] === 'USER') {
            return validationObject
        } else {
            let temp = validationObject['tempValidationMessage'];
            for (let i = 0; i < Object.values(validationObject['validationInputfields']['fields']).length; i++) {
                let value = Object.values(validationObject['validationInputfields']['fields'])[i]
                const traversalPath = value['traversalPath']
                const fieldName = value['fieldName']
                const path = value['traversalPath'] + '$$' + value['fieldName']
                let fieldValue = dataObject[traversalPath][fieldName]
                const finalValue = this.convertErroMessageValue(fieldValue, value, 'display')
                if (finalValue === '' || finalValue === 0 || finalValue === null) {
                    validationObject.validationMessage = temp.replaceAll('%%' + path + '%%', value['label'])
                    temp = validationObject.validationMessage;
                }
                validationObject.validationMessage = temp.replaceAll('%%' + path + '%%', finalValue)
                temp = validationObject.validationMessage;
            }
            return validationObject
        }
    }

    convertErroMessageValue(fieldValue, fieldInfo, mode: 'display' | 'value' | 'object') {
        if (mode === 'value') {
            return fieldValue;
        } else {
            if (fieldInfo['fieldType'] === 'CURRENCY' || (fieldInfo['fieldType'] === 'ROLLUPSUMMARY' && fieldInfo['rollupType'] === 'CURRENCY') || (fieldInfo['fieldType'] === 'FORMULA' && fieldInfo['formulaConfigJson']['formulaType'] === 'CURRENCY')) {
                if (fieldValue && fieldInfo['displayInfo']['country']) {
                    const currecnyDetails = this.currencyConfig.currencyDetails[fieldInfo["displayInfo"]['country']]
                    fieldValue = currecnyDetails + ' ' + fieldValue.toString()
                    return fieldValue;
                } else {
                    return '';
                }
            } else if (fieldInfo['fieldType'] === 'DATE' || (fieldInfo['fieldType'] === 'ROLLUPSUMMARY' && fieldInfo['rollupType'] === 'DATE') || (fieldInfo['fieldType'] === 'FORMULA' && fieldInfo['formulaConfigJson']['formulaType'] === 'DATE')) {
                if (fieldValue) {
                    if (typeof fieldValue === "string") {
                        fieldValue = this.appUtilityObject.getUtcMillisecondsFromDateString(fieldValue)
                      }
                      if (typeof fieldValue === "number") {
                        return this.appUtilityObject.getDateStringFromUtcTimeZoneMilliseconds(fieldValue)
                      }
                } else {
                    return'';
                }
            } else if (fieldInfo['fieldType'] === 'TIMESTAMP' || (fieldInfo['fieldType'] === 'ROLLUPSUMMARY' && fieldInfo['rollupType'] === 'TIMESTAMP') || (fieldInfo['fieldType'] === 'FORMULA' && fieldInfo['formulaConfigJson']['formulaType'] === 'TIMESTAMP')) {
                if (fieldValue) {
                    if (typeof fieldValue === "string") {
                        fieldValue = this.appUtilityObject.getUtcTimeZoneMillsecondsFromDateTimeString(fieldValue,'user')
                      }
                      if (typeof fieldValue === "number") {
                        return this.appUtilityObject.getDateTimeStringFromUtcMilliseconds(fieldValue, 'user')
                      }
                } else {
                    return '';
                }
            } else if (fieldInfo['fieldType'] === 'NUMBER' || fieldInfo['fieldType'] === 'DECIMAL') {
                if (fieldValue) {
                    return fieldValue;
                } else {
                    return 0;
                }
            } else if ((fieldInfo['fieldType'] === 'ROLLUPSUMMARY' && fieldInfo['rollupType'] === 'NUMBER') || (fieldInfo['fieldType'] === 'FORMULA' && fieldInfo['formulaConfigJson']['formulaType'] === 'NUMBER')) {
                if (fieldValue) {
                    return Math.round(fieldValue * 1000) / 1000
                } else {
                    return 0;
                }
            } else if (fieldInfo['fieldType'] === 'BOOLEAN' || (fieldInfo['fieldType'] === 'ROLLUPSUMMARY' && fieldInfo['rollupType'] === 'BOOLEAN') || (fieldInfo['fieldType'] === 'FORMULA' && fieldInfo['formulaConfigJson']['formulaType'] === 'BOOLEAN')) {
                if (fieldValue) {
                    return fieldValue;
                } else {
                    return false;
                }
            } else if (fieldInfo['fieldType'] === 'MULTISELECT' || fieldInfo['fieldType'] === 'CHECKBOX') {
                var displayValue = [];
                if (fieldValue) {
                    if (typeof (fieldValue) === 'string') {
                        let modifiedValue;
                        modifiedValue = fieldValue.split(',');
                        for (const element of modifiedValue) {
                            displayValue.push(fieldInfo['displayInfo']['mapper'][element.trim()]);
                        }
                    } else {
                        for (const element of fieldValue) {
                            displayValue.push(fieldInfo['displayInfo']['mapper'][element]);
                        }
                    }
                }
                if (displayValue.length > 0) {
                    return displayValue.join(', ');
                } else {
                    return '';
                }
            } else if (fieldInfo['fieldType'] === 'RADIO' || fieldInfo['fieldType'] === 'DROPDOWN' || fieldInfo['fieldType'] === 'STATUSWORKFLOW') {
                if (fieldValue) {
                    return fieldInfo['displayInfo']['mapper'][fieldValue];
                } else {
                    return '';
                }
            } else {
                if (fieldValue) {
                    return fieldValue;
                } else {
                    return '';
                }
            }
        }
    }

    makeConsolidateMessage(validationResultObject) {
        let resultObject = []
        resultObject = lodash.uniqBy(validationResultObject, 'formula');
        if (resultObject.length > 0) {
            const consolidateFilter = lodash.filter(resultObject, function (result) {
                return (result['consolidateFlag'] === true);
            })
            const displayMessageObject = {}
            if (consolidateFilter.length > 0) {
                displayMessageObject['consolidateFlag'] = true
                const grouped = lodash.mapValues(lodash.groupBy(consolidateFilter, 'messageType'),
                    clist => clist.map(consolidateObject => lodash.omit(consolidateObject, 'messageType')));
                
                displayMessageObject['message'] = grouped
                displayMessageObject['status'] = "Success"
            } else {
                displayMessageObject['consolidateFlag'] = false
                displayMessageObject['message'] = resultObject[0]
                displayMessageObject['status'] = "Success"
            }
            return displayMessageObject
        } else {
            const displayMessageObject = {
                "status": "Failed"
            }
            return displayMessageObject
        }
    }



    checkFormulaFieldOnChange(formulaConfig, onChangeFieldName, conditionalValidationJson: ConditionalValidation) {
        const formulaConfigKeys = Object.keys(formulaConfig)
        formulaConfigKeys.forEach(formulaConfigKey => {
            const forumulaConfigObject = formulaConfig[formulaConfigKey]
            const involvedFields = forumulaConfigObject["involvedFields"]
            const fieldArray = involvedFields.map(a => a.fieldName);
            const involvedField = lodash.includes(fieldArray, onChangeFieldName);
            //    if (involvedField) {
            //        const fieldName = forumulaConfigObject["fieldName"]
            //        const objectId = "pfm" + forumulaConfigObject["objectId"]
            //        Object.keys(object).find(key => object[key] === value);
            //        const validationFieldName = conditionalValidationJson.validationRules.map(a => a.fieldName);
            //    } else {

            //    }
        })
    }

}