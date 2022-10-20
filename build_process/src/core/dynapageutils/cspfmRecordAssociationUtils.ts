import { Injectable } from "@angular/core";
import * as lodash from "lodash";
import { OnEventArgs } from "angular-slickgrid";
import { SlickgridPopoverService } from "../services/slickgridPopover.service";
import { appUtility } from "../utils/appUtility";
import { DatePipe } from "@angular/common";
import { objectTableMapping } from 'src/core/pfmmapping/objectTableMapping';
import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';

@Injectable({
    providedIn: "root"
})

export class cspfmRecordAssociationUtils {

    constructor(private slickgridPopoverService: SlickgridPopoverService, public objectTableMapping: objectTableMapping,
        public appUtility: appUtility, public datePipe: DatePipe, public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils) {}
 
    
    initialMethod(hierarchyJSONObject, dataObject, dbService) {
        var associateDoc = {}
        return this.fetchAssociateDocForEachObject(hierarchyJSONObject, dataObject, dbService, associateDoc).then(res => {
            return associateDoc
        })
    }

    fetchAssociateDocForEachObject(hierarchyJSONObject, dataObject, dbService, associateDoc){
        var associationFetchTaskList = []
        
        if(hierarchyJSONObject['associationObject'] && hierarchyJSONObject['associationObject'].length > 0){

            var associationQuery = []
            hierarchyJSONObject['associationObject'].forEach(associationObjHierarchy => {
                associationObjHierarchy['associationField'].forEach(associationField => {
                    let objectId = hierarchyJSONObject['objectId'].includes('pfm') ? hierarchyJSONObject['objectId'] : "pfm" + hierarchyJSONObject['objectId']
                    associationQuery.push('start' + objectId + dataObject[hierarchyJSONObject['rootPath']]['id'] + associationField)
                });
            });

            associationFetchTaskList.push(dbService.fetchAssociation("associationView",associationQuery).then(res => {
                if(res['status'] === 'SUCCESS' && res['records'].length > 0){
                    let groupedResultObj = lodash.groupBy(res['records'], 'key')
                    let groupedObjKeys = Object.keys(groupedResultObj)
                    
                    groupedObjKeys.forEach(groupedKey => {
                        if(groupedResultObj[groupedKey].length > 0) {
                            let recordType = groupedResultObj[groupedKey][0]['doc']['data']['type']
                            let recordsArray = []
                            groupedResultObj[groupedKey].forEach(element => {
                                recordsArray.push(dbService.convertRelDocToNormalDoc(element['doc'])) 
                            });
                            
                            if(!associateDoc["pfm"+ hierarchyJSONObject['objectId']]) {
                                associateDoc["pfm"+ hierarchyJSONObject['objectId']] = {}
                            }
                            associateDoc["pfm"+ hierarchyJSONObject['objectId']][recordType] = recordsArray
                        }                        
                    });

                    if (hierarchyJSONObject['isLazyLoadingEnabled']) {
                        var associationTaskList = []
                        var parentDataMapping = {}
                        parentDataMapping[dataObject[hierarchyJSONObject['rootPath']]['id']] = 0
                        var dataArray = []
                        dataArray.push(dataObject[hierarchyJSONObject['rootPath']])
                        hierarchyJSONObject['associationObject'].forEach(associationObjHierarchy => {
                            associationTaskList.push(dbService.fetchAssociationRecords(res['records'], associationObjHierarchy, parentDataMapping, dataArray).then(result => {
                                return result
                            }));
                        });

                        return Promise.all(associationTaskList).then(res => {
                            return Promise.resolve(res);
                        });
                    }
                }
            }))  
        }

        if(hierarchyJSONObject['childObject'] && hierarchyJSONObject['childObject'].length > 0){
             
            hierarchyJSONObject['childObject'].forEach(element => {
               

                associationFetchTaskList.push(this.fetchAssociateDocForEachObject(element, dataObject, dbService, associateDoc).then(res => {
                    return res
                }))
            });
        }

        return Promise.all(associationFetchTaskList).then(res => {
            return associateDoc
        }).catch(error => {
            console.log("Error in association fetch tasklist");
            return {}
        });
    }

    validateAssociationObjectSelection(associationConfiguration, saveObjects) {
        let associationObjectKeys = Object.keys(associationConfiguration)
        associationObjectKeys.forEach(associationObjKey => {
            if(saveObjects[associationObjKey]){
                let associationFieldKeys = Object.keys(associationConfiguration[associationObjKey])
                associationFieldKeys.forEach(associationFieldKey => {
                    let fieldName = associationConfiguration[associationObjKey][associationFieldKey]['fieldName']
                    if(saveObjects[associationObjKey][fieldName] != null) {
                        let associationConfigObj = associationConfiguration[associationObjKey][associationFieldKey]
                        if(associationConfigObj['style'] === 'SingleWithMultiple' || associationConfigObj['style'] === 'SingleFromMultipleWithSingleStyle1'
                            || associationConfigObj['style'] === 'SingleFromMultipleWithSingleStyle2' || associationConfigObj['style'] === 'SingleFromMultipleWithMultipleList' 
                            || associationConfigObj['style'] === 'SingleFromMultipleWithMultipleChip') {
                            if(!saveObjects[associationObjKey][associationConfigObj['associationFieldName']] || 
                                saveObjects[associationObjKey][associationConfigObj['associationFieldName']].length === 0) {
                                saveObjects[associationObjKey][fieldName] = null
                            }
                        } else {
                            let associationMetaMapping = associationConfigObj['associationMetaMapping']
                            for(let mappingObj of associationMetaMapping) {
                                if(saveObjects[associationObjKey][fieldName].includes(mappingObj['objectName']) && 
                                    (!saveObjects[associationObjKey][mappingObj['fieldName']] || saveObjects[associationObjKey][mappingObj['fieldName']].length === 0)) {
                                   
                                    var index = saveObjects[associationObjKey][fieldName].findIndex((element) => element === mappingObj['objectName']);
                                    if (index !== undefined && index >= 0) {
                                        saveObjects[associationObjKey][fieldName].splice(index, 1);
                                    }
                                }
                            }
                        }
                    }
                })
            }
            
        })
    }

    prepareAssociateDocForSaveAction(associateDoc, saveObject, recordId) {
        let associateDocFieldKeys = Object.keys(associateDoc[saveObject])

        associateDocFieldKeys.forEach(associateDocFieldKey => {
            if (associateDoc[saveObject][associateDocFieldKey].length > 0) {
                associateDoc[saveObject][associateDocFieldKey].forEach(associateRecord => {
                    associateRecord['reference_id'] = recordId
                    associateRecord['reference_object_id'] = saveObject
                    associateRecord['type'] = associateDocFieldKey
                });
            }
        })
    }

    fetchAssociationRecords(hierarchyJSONObject, dataObject, dbService) {
        let associationFetchTaskList = []
        if (hierarchyJSONObject['associationObject'] && hierarchyJSONObject['associationObject'].length > 0 && hierarchyJSONObject['isLazyLoadingEnabled']) {
            var associationQuery = []
            hierarchyJSONObject['associationObject'].forEach(associationObjHierarchy => {
                associationObjHierarchy['associationField'].forEach(associationField => {
                    let objectId = hierarchyJSONObject['objectId'].includes('pfm') ? hierarchyJSONObject['objectId'] : "pfm" + hierarchyJSONObject['objectId']
                    associationQuery.push('start' + objectId + dataObject[hierarchyJSONObject['rootPath']]['id'] + associationField)
                });
            });

            associationFetchTaskList.push(dbService.fetchAssociation("associationView", associationQuery).then(res => {
                if (res['status'] === 'SUCCESS' && res['records'].length > 0) {
                    var associationTaskList = []
                    var parentDataMapping = {}
                    parentDataMapping[dataObject[hierarchyJSONObject['rootPath']]['id']] = 0
                    var dataArray = []
                    dataArray.push(dataObject[hierarchyJSONObject['rootPath']])
                    hierarchyJSONObject['associationObject'].forEach(associationObjHierarchy => {
                        associationTaskList.push(dbService.fetchAssociationRecords(res['records'], associationObjHierarchy, parentDataMapping, dataArray).then(result => {
                            return result
                        }));
                    });

                    return Promise.all(associationTaskList).then(res => {
                        return Promise.resolve(res);
                    });
                }
            }))
        }

        if (hierarchyJSONObject['childObject'] && hierarchyJSONObject['childObject'].length > 0) {
            hierarchyJSONObject['childObject'].forEach(element => {
                // this.fetchAssociationRecords(element);
                associationFetchTaskList.push(this.fetchAssociationRecords(element, dataObject, dbService).then(res => {
                    return res
                }))
            });
        }

        return Promise.all(associationFetchTaskList).then(res => {
            return res
        }).catch(error => {
            console.log("Error in association fetch tasklist");

        });
    }

    onActionCellClickForAssociation(mouseEvent: KeyboardEvent | MouseEvent, args: OnEventArgs, layoutId?) {
        let parentElement = mouseEvent && mouseEvent.target && mouseEvent.target['parentElement'] || undefined;
        let additionalChipValues = parentElement && parentElement.getAttribute('additionalChipValues') || '[]';
        let columnDetails = args['grid'].getColumns();
        let fieldInfo = this.slickgridPopoverService.getFieldInfo(columnDetails[args['cell']]['params']['fieldInfo'])
        let cspfmObjectName = columnDetails[args['cell']]['params']['fieldInfo']['objectName'];
        if (fieldInfo['fieldType'] === "URL") {
            let isPageRedirectionDisabled = parentElement && parentElement.getAttribute('isPageRedirectionDisabled') || undefined;
            if (!isPageRedirectionDisabled) {
                let isMultiUrlField = parentElement && parentElement.getAttribute('isMultiUrlField') || undefined;
                let inputType = parentElement && parentElement.getAttribute('inputType') || undefined;
                let fieldName = parentElement && parentElement.getAttribute('fieldName') || undefined;
                let primaryChipCount = parentElement && parentElement.getAttribute('primaryChipCount') || 0;
                isMultiUrlField = (isMultiUrlField === 'true');
                primaryChipCount = Number(primaryChipCount)
                let fieldId, actionId;
                fieldId = 'FLD_' + cspfmObjectName + '$$' + fieldName + '_input_';
                actionId = 'ACT_' + cspfmObjectName + '$$' + fieldName + '_input_';
                let selectedRecordIndex = 0;
                additionalChipValues = JSON.parse(additionalChipValues);
                let additionalInfo = {
                    "cspfmObjectName": cspfmObjectName,
                    "inputType": inputType,
                    "isMultipleUrlField": isMultiUrlField,
                    "urlArray": additionalChipValues,
                    "fieldId": fieldId,
                    "actionId": actionId,
                    "args": args,
                    "actionType": "URL",
                    "selectedRecordIndex": selectedRecordIndex
                }
                const cspfmUrlPopoverClass = 'cspfmUrlPopover'
                import(`../components/cspfmUrlPopover/${cspfmUrlPopoverClass}.ts`).then(cspfmUrlPopoverInstance=>{
                    if(cspfmUrlPopoverInstance[cspfmUrlPopoverClass]){
                        this.slickgridPopoverService.appendComponentToElement('cs-dropdown-' + layoutId, cspfmUrlPopoverInstance[cspfmUrlPopoverClass], args, additionalInfo);
                    } else{
                        console.error('cspfmUrlPopover component is missing')
                    }
                }).catch(err=>{
                    console.error('cspfmUrlPopover component is missing',err)
                })

            }
        }
    }

    makeQueryForCriteriaLookup(dataObject, criteriaValidationFields, criteriaQueryConfig) {
        let criteriaFieldCheckResut = this.checkCriteriaEntryFieldsAvailable(criteriaValidationFields, dataObject)
        console.log(criteriaFieldCheckResut)
        const criteriaConfig = {
            'criteriaQueryConfig': criteriaQueryConfig,
            'criteriaDataObject': dataObject,
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

    checkCriteriaEntryFieldsAvailable(criteriaFields, criteriaDataObject) {
        var errorMessage = [];
        var lookupFields = []
        var lookupCriteriaObjectId = {};
        var showAlert = false;
        Object.keys(criteriaFields).forEach(objectType => {
            Object.keys(criteriaFields[objectType]).forEach(criteriaField => {
                let result: string = "";
                if (objectType === "loggedUser") {
                    result = this.cspfmLookupCriteriaUtils.recursiveCheckCriteriaFields(criteriaFields[objectType][criteriaField], this.appUtility.loggedUserCorObject, errorMessage, this.appUtility.loggedUserCorObject)
                } else {
                    result = this.cspfmLookupCriteriaUtils.recursiveCheckCriteriaFields(criteriaFields[objectType][criteriaField], criteriaDataObject, errorMessage, criteriaDataObject);
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
            'validationFailureSet': [{ "fields": lookupFields }],
            'lookupCriteriaObjectId': lookupCriteriaObjectId,
            'criteriaFields': criteriaFields,
            'showAlert': showAlert
        }
    }

    resetCriteriaData(fieldName, dataObject, associationConfiguration, associateDoc) {
        let involvedField = fieldName.split('$$')[0]
        let primaryObjId = this.objectTableMapping.mappingDetail[fieldName.split('$$')[1]]
        let associationFieldsObjArray = associationConfiguration['criteriaInvolvedFieldsList'][primaryObjId][involvedField]
        if(associationFieldsObjArray && associationFieldsObjArray.length > 0) {
        associationFieldsObjArray.forEach(associationFieldObj => {
            let associationInvolvedObjectId = this.objectTableMapping.mappingDetail[associationFieldObj['objectName']]
            associationFieldObj['associationFieldName'].forEach(associationFieldName => {
                this.checkAssociationRecordSaved(dataObject[associationFieldObj['objectRootPath']][associationFieldName], associationFieldName, associationInvolvedObjectId, associateDoc)
                dataObject[associationFieldObj['objectRootPath']][associationFieldName] = []
                if (associationConfiguration[associationInvolvedObjectId][associationFieldObj['fieldRootPath']]
                    && associationConfiguration[associationInvolvedObjectId][associationFieldObj['fieldRootPath']]['associationObjectInfo'][associationFieldName]['criteriaConfig']
                    && associationConfiguration[associationInvolvedObjectId][associationFieldObj['fieldRootPath']]['associationObjectInfo'][associationFieldName]['criteriaConfig']['criteriaValidationFields'][primaryObjId][involvedField]) {
                    associationConfiguration[associationInvolvedObjectId][associationFieldObj['fieldRootPath']]['associationObjectInfo'][associationFieldName]['criteriaConfig']['criteriaValidationFields'][primaryObjId][involvedField]['showAlert'] = false
                }
            });
        });
    }
}

    checkAssociationRecordSaved(recordsArray, associationField, associationInvolvedObjectId, associateDoc) {
        if(recordsArray && recordsArray.length > 0) {
            if(associateDoc[associationInvolvedObjectId][associationField] && associateDoc[associationInvolvedObjectId][associationField].length > 0) {
                recordsArray.forEach(rec => {
                    let index = associateDoc[associationInvolvedObjectId][associationField].findIndex(
                        (involvedAssociationDoc) => involvedAssociationDoc['association_id'] === rec['id']);
                    if(index >= 0) {
                        if(associateDoc[associationInvolvedObjectId][associationField][index]['sys_attributes']) {
                            associateDoc[associationInvolvedObjectId][associationField][index]['isActive'] = false
                        } else {
                            associateDoc[associationInvolvedObjectId][associationField].splice(index, 1)
                        }
                    }
                });
            }
        }
    }
}