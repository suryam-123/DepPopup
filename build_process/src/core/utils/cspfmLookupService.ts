import { Injectable } from '@angular/core';
import { appUtility } from '../utils/appUtility';
import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
import { cspfmLayoutConfiguration } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
import { lookupFieldMapping } from "src/core/pfmmapping/lookupFieldMapping";
import * as lodash from 'lodash';
import { cspfmObjectConfiguration } from 'src/core/pfmmapping/cspfmObjectConfiguration';
import { dataProvider } from './dataProvider';
@Injectable({
    providedIn: 'root'
})

export class cspfmLookupService {

    constructor(public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils, public appUtility: appUtility, public cspfmLayoutConfig: cspfmLayoutConfiguration, public lookupFieldMapping: lookupFieldMapping, public pfmObjectMapping: cspfmObjectConfiguration, public dataProvider: dataProvider) { }
    public subordinateUserIdArray = [];
    public lookupFieldInfo = {};
    public result = {};

    async makeLookupQuery(lookupInputConfig) {
        this.lookupFieldInfo = this.cspfmLayoutConfig['layoutConfiguration'][lookupInputConfig['layoutId']]['lookupFieldInfo'];
        const lookupColumns = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['lookupColumns']
        const lookupHierarchyJson = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['lookupHierarchyJson']
        const argumentColumns = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['argumentColumns']
        const primaryRootPath = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['primaryRootPath']
        const label = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['lookupFieldDisplayName']
        const objectId = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['objectId']
        const additionalDataHierarchyJson = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['additionalDataHierarchyJson']
        let additionalData = {
            objectRootPath: this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['objectRootPath'],
            isOnlySubordinates: this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['isOnlySubordinates'],
            isStandardObject: this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['isStandardObject']
        }
        const lookupInput = {}
        let getFieldName = lookupColumns[0]["fieldName"];
        let regexQuery = '';
        let argumentColumnStr = "";
        // works when dependent lookup call

        if (argumentColumns !== undefined) {
            argumentColumnStr = await this.makeQueryForDependentLookup(argumentColumns, lookupInputConfig['dataObject'], argumentColumnStr, objectId, lookupHierarchyJson)
        }
        // works when criteria lookup call
        if (lookupInputConfig['lookupCriteriaQueryConfig'][lookupInputConfig['lookupFieldId']]) {
            let result = this.makeQueryForCriteriaLookup(lookupInputConfig['criteriaDataObject'], this.cspfmLookupCriteriaUtils, lookupInputConfig['formGroup'], lookupInputConfig['dataObject'], lookupInputConfig['lookupCriteriaValidationFields'], lookupInputConfig['lookupFieldId'], lookupInputConfig['lookupCriteriaQueryConfig'], objectId);
            if (result['criteriaRestriction']) {
                return result;
            } else {
                lookupInput['criteriaConfig'] = result;
            }
        }
        if (lookupInputConfig['searchValue']) {
            regexQuery = getFieldName + ":" + "_*" + this.appUtility.makeRegexQuery(lookupInputConfig['searchValue']);
        }

        let queryString = '';
        queryString = "type:" + "pfm" + lookupHierarchyJson['objectId']
        if (argumentColumnStr !== '' && regexQuery !== '') {
            lookupHierarchyJson['query'] = queryString + argumentColumnStr + " AND " + regexQuery;
        } else if (regexQuery !== '') {
            lookupHierarchyJson['query'] = queryString + " AND " + regexQuery;
        } else if (argumentColumnStr !== '') {
            lookupHierarchyJson['query'] = queryString + argumentColumnStr;
        } else {
            lookupHierarchyJson['query'] = queryString
        }
        // works when coruser lookup call
        lookupHierarchyJson['query'] = additionalData['isOnlySubordinates'] ? this.makeQueryForCoruserSubordinates(lookupHierarchyJson, lookupInputConfig['loggedUserCorHeirarchyDetail']) : lookupHierarchyJson['query']
        lookupInput['lookupColumnDetails'] = lookupColumns;
        lookupInput['objectHierarchy'] = lookupHierarchyJson;
        lookupInput['title'] = label;
        lookupInput['additionalDataHierarchy'] = additionalDataHierarchyJson;
        lookupInput['additionalData'] = additionalData;
        lookupInput['lookupFieldId'] = lookupInputConfig['lookupFieldId'];
        lookupInput['filterConfig'] = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['filterConfig']
        lookupInput['onLoadFetchEnabled'] = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['onLoadFetchEnabled']
        lookupInput['isSearchFilterEnabled'] = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['isSearchFilterEnabled']
        lookupInput['multiSelectionEnabled'] = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['multiSelectionEnabled']
        lookupInput['itemsPerPageConfigured'] = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['itemsPerPageConfigured']
        lookupInput['paginationConfigInfo'] = this.lookupFieldInfo[lookupInputConfig['lookupFieldId']]['paginationConfigInfo']
        return lookupInput

    }
    // for this coruser look up only - if the Display subordinates only of the logged user flag enabled 
    makeQueryForCoruserSubordinates(lookupHierarchyJson, loggedUserCorHeirarchyDetail) {
        this.subordinateUserIdArray = []
        let noOfsubordinateUserLevel = 1;
        for (let i = 1; i < noOfsubordinateUserLevel + 1; i++) {
            this.subordinateUserIdArray = this.subordinateUserIdArray.concat(loggedUserCorHeirarchyDetail['subordinate_level_' + i]);
        }
        this.subordinateUserIdArray = this.subordinateUserIdArray.concat(this.appUtility.userId);
        return lookupHierarchyJson['query'] + " AND " + "user_id" + ":" + "(" + this.subordinateUserIdArray.join(' ') + ")";
    }

    async makeQueryForDependentLookup(argumentColumns, dataObject, argumentColumnStr, objectId, lookupHierarchyJson) {
        var rollupField = ""
        var formulaField = ""
        for(let i = 0; i < argumentColumns.length; i++ ){
            let element = argumentColumns[i]
            const sourceColumnRootPath = element['rootPath']
            console.log("element", element)

            if(element['sourceColumnFieldType'] === 'ROLLUPSUMMARY'){
                
                rollupField = rollupField + " AND " + element['targetColumn'] + ":" + dataObject[sourceColumnRootPath][element['sourceColumn']+'__r']
                
            } else if(element['sourceColumnFieldType'] === 'FORMULA'){
                
                formulaField = formulaField + " AND " + element['targetColumn'] + ":" + dataObject[sourceColumnRootPath][element['sourceColumn']+'__f']
                
            } else if (typeof (dataObject[sourceColumnRootPath][element['sourceColumn']]) === 'string') {
                if (element['sourceColumnFieldType'] === 'LOOKUP' || element['sourceColumnFieldType'] === 'MASTERDETAIL') {
                    argumentColumnStr = argumentColumnStr + " AND " + element['targetColumn'] + ":" + dataObject[sourceColumnRootPath][element['sourceColumn']] + "*"
                } else if (element['sourceColumnFieldType'] === 'DROPDOWN' || element['sourceColumnFieldType'] === 'RADIO') {
                    argumentColumnStr= argumentColumnStr + " AND " + element['targetColumn'] + ":" + (isNaN(dataObject[sourceColumnRootPath][element['sourceColumn']]) ? "_*" + dataObject[sourceColumnRootPath][element['sourceColumn']].toLowerCase() + "*" : + dataObject[sourceColumnRootPath][element['sourceColumn']])
                } else if (element['sourceColumnFieldType'] === 'DATE') {
                    argumentColumnStr = argumentColumnStr + " AND " + element['targetColumn'] + ":" + this.appUtility.getUtcMillisecondsFromDateString(dataObject[sourceColumnRootPath][element['sourceColumn']]);
                } else {
                    argumentColumnStr = argumentColumnStr + " AND " + element['targetColumn'] + ":" + "_" + dataObject[sourceColumnRootPath][element['sourceColumn']].toLowerCase() 
                }
            } else if (Array.isArray(dataObject[sourceColumnRootPath][element['sourceColumn']])) {
                let selectedValues = dataObject[sourceColumnRootPath][element['sourceColumn']].map(element => isNaN(element) ? '_' + this.appUtility.makeRegexQueryMultiSelect(element) : element)
                let notSelectedValues = this.getNotSelectedValuesForDependentMultiselectAndCheckbox(element, objectId, dataObject, sourceColumnRootPath);
                if(notSelectedValues.length === 0){
                    argumentColumnStr = argumentColumnStr + " AND " + element['targetColumn'] + ":(" + selectedValues.map(item => item.toLowerCase()).join(" AND ") + ")"
                } else {
                    argumentColumnStr = argumentColumnStr + " AND " + element['targetColumn'] + ":(" + selectedValues.map(item => item.toLowerCase()).join(" AND ") + " NOT " +"(" + notSelectedValues.map(item => item.toLowerCase()).join(" OR ") + ")" +")"
                }
            } else if (typeof (dataObject[sourceColumnRootPath][element['sourceColumn']]) === 'boolean' || typeof (dataObject[sourceColumnRootPath][element['sourceColumn']]) === 'number') {
                argumentColumnStr = argumentColumnStr + " AND " + element['targetColumn'] + ":" + dataObject[sourceColumnRootPath][element['sourceColumn']]
            } else {
                argumentColumnStr = argumentColumnStr + " AND " + element['targetColumn'] + ":" + dataObject[sourceColumnRootPath][element['sourceColumn']]['id']
            }
        }
        if(rollupField.length > 0 && formulaField.length > 0){
            var rollupReferenceId = await this.getRollupField(lookupHierarchyJson, rollupField)    
            var formulaReferenceId = await this.getFormulaField(lookupHierarchyJson, formulaField)
            let FetchResult = lodash.intersection(rollupReferenceId['referenceId'], formulaReferenceId['referenceId']);    
            argumentColumnStr = argumentColumnStr + " AND " + "_id:" + "(" +  FetchResult.join(' ') + ")"
        } else if(rollupField.length > 0){
            this.result = await this.getRollupField(lookupHierarchyJson, rollupField)                
            argumentColumnStr = argumentColumnStr + " AND " + "_id:" + "(" +  this.result['referenceId'].join(' ') + ")"
        } else if (formulaField.length > 0){
            this.result = await this.getFormulaField(lookupHierarchyJson, formulaField)                
            argumentColumnStr = argumentColumnStr + " AND " + "_id:" + "(" +  this.result['referenceId'].join(' ') + ")"
        }
        return argumentColumnStr;
    }

    async getRollupField(lookupHierarchyJson, rollupField){
        let type = "pfm" + lookupHierarchyJson['objectId'];        
            let queryString = '';
            queryString = "type:" + "pfm" + lookupHierarchyJson['objectId'] + "rollup"
            let query = queryString  + rollupField  
            let designDocName = "pfm" + lookupHierarchyJson['objectId'] + "rollup_search"
            return  this.dataProvider.fetchFormulaRollupForDependentLookup(query, designDocName, type).then(response => {
                console.log("result", response)
                const res = {
                    'referenceId': response
                }
            return res;
            })
           
    }
    getFormulaField(lookupHierarchyJson, formulaField){
            let type = "pfm" + lookupHierarchyJson['objectId'];
            let queryString = '';
            queryString = "type:" + "pfm" + lookupHierarchyJson['objectId'] + "formula"
            let query = queryString + formulaField  
            let designDocName = "pfm" + lookupHierarchyJson['objectId'] + "formula_search"
            return  this.dataProvider.fetchFormulaRollupForDependentLookup(query, designDocName, type).then(response => {
                console.log("result", response)
                const res = {
                    'referenceId': response
                }
            return res;
            })
        
    }
    
    getNotSelectedValuesForDependentMultiselectAndCheckbox(argumentColumns, objectId, dataObject, sourceColumnRootPath){
        let selectionFieldMapping = this.pfmObjectMapping['objectConfiguration'][objectId]['selectionFieldsMapping'][argumentColumns['sourceColumn']];
        let allValues = [];
        Object.keys(selectionFieldMapping).forEach(element => {
            allValues.push(element);
        });
        let selectedValues = dataObject[sourceColumnRootPath][argumentColumns['sourceColumn']];
        selectedValues = selectedValues.map(element => isNaN(element) ? '_' + this.appUtility.makeRegexQueryMultiSelect(element) : element)
        allValues = allValues.map(element => isNaN(element) ? '_' + this.appUtility.makeRegexQueryMultiSelect(element) : element)
        return(lodash.difference(allValues, selectedValues)) 
    }
    makeQueryForCriteriaLookup(criteriaDataObject, cspfmLookupCriteriaUtils, formGroup, dataObject, lookupCriteriaValidationFields, lookupFieldId, lookupCriteriaQueryConfig, objectId) {

        if (Object.keys(criteriaDataObject).length === 0) {
            criteriaDataObject = cspfmLookupCriteriaUtils.updateCriteriaDataObject(formGroup, criteriaDataObject, dataObject);
        }

        if (Object.keys(criteriaDataObject).length > 0) {
            let lookupFieldValues = []
            lookupFieldValues = Object.values(this.lookupFieldMapping.mappingDetail[objectId]) 
            lookupFieldValues.forEach(lookupId => {
                if (typeof dataObject[lookupId] !== 'string' && dataObject[lookupId] !== null && dataObject[lookupId] !== undefined) {
                    Object.keys(criteriaDataObject).forEach(objectvalues => {
                        criteriaDataObject[objectvalues][lookupId] = dataObject[lookupId];
                    })
                }
            })
        }
        let criteriaFieldCheckResut = cspfmLookupCriteriaUtils.checkCriteriaEntryFieldsAvailable(lookupCriteriaValidationFields[lookupFieldId], criteriaDataObject, dataObject)
        lookupCriteriaValidationFields[lookupFieldId] = JSON.parse(JSON.stringify(criteriaFieldCheckResut['criteriaFields']))
        const criteriaConfig = {
            'lookupCriteriaQueryConfig': lookupCriteriaQueryConfig[lookupFieldId],
            'criteriaDataObject': criteriaDataObject[objectId],
            'criteriaFields': criteriaFieldCheckResut['criteriaFields'],
            'validationFailureSet': criteriaFieldCheckResut['validationFailureSet'],
            'lookupCriteriaObjectId': criteriaFieldCheckResut['lookupCriteriaObjectId']
        }
        if (criteriaFieldCheckResut['errorMessage'].length > 0 || criteriaFieldCheckResut['showAlert']) {
            if (criteriaFieldCheckResut['errorMessage'].length > 0) {
                this.appUtility.showInfoAlert(criteriaFieldCheckResut['errorMessage'].join(',') + '(Parent) does not have value')
            }
            criteriaConfig['criteriaRestriction'] = true
            return criteriaConfig;
        }
        criteriaConfig['criteriaRestriction'] = false
        return criteriaConfig;
    }
    lookupErrorResponseHandling(lookupFieldId: string, classContext: object) {
        if (classContext["parentId"] === undefined){
            return 
        } 
        if (classContext["redirectUrl"] !== "/") {
            if (!classContext["parentId"]) {
                if (classContext["isPopUpEnabled"]) {
                    classContext["dialogRef"].close();
                } else {
                    classContext["router"].navigate([classContext["redirectUrl"]], { skipLocationChange: true });
                }
            }
        } else {
            if (!classContext["parentId"]) {
                this.appUtility.showInfoAlert('you can only proceed when the parent exist... Do you want to choose?', [
                    {
                        "name": "Cancel",
                        "handler": () => { classContext["router"].navigate(["/menu/homepage"], { skipLocationChange: true });}
                    },
                    {
                        "name": "Yes",
                        "handler": () => { classContext["showLookup"](null, lookupFieldId) }
                    }
                ]);
            }
        }
    }
}
