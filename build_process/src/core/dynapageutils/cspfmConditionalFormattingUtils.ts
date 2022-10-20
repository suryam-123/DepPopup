import { Injectable } from '@angular/core';
import { appUtility } from '../utils/appUtility';
import { dataProvider } from '../utils/dataProvider';
import { appConstant } from '../utils/appConstant';
import * as lodash from 'lodash';
import * as moment from 'moment';
import 'moment-timezone';
import { objectTableMapping } from '../pfmmapping/objectTableMapping';
import { Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { metaDbConfiguration } from '../db/metaDbConfiguration';
import { ConditionalFormat } from '../models/cspfmConditionalFormat.type';
import { cspfmFormulaService } from '../services/cspfmFormula.service';
import { cspfm_data_display, CspfmDataMaskingFormatter, CspfmExportDataMaskingFormatter, FieldInfo } from '../pipes/cspfm_data_display';
import { SlickgridPopoverService } from '../services/slickgridPopover.service';
import { lookupFieldMapping } from '../pfmmapping/lookupFieldMapping';

@Injectable({
    providedIn: "root"
})
export class cspfmConditionalFormattingUtils {

    constructor(private appUtilityObject: appUtility, private dataProviderObject: dataProvider,
        private objectTableMappingObject: objectTableMapping,
        private datePipe: DatePipe,
        private formulaService: cspfmFormulaService,
        private metaDbConfig: metaDbConfiguration,
        private cspfmDataDisplay: cspfm_data_display,
        private lookupFieldMappingObject: lookupFieldMapping,
        private slickgridPopoverService: SlickgridPopoverService) { }

    fetchConditionalFormatConfigJSON(conditionalFormatJson: ConditionalFormat) {
        let layoutId = conditionalFormatJson.layoutId
        let elementIdSuffix = '';
        if (conditionalFormatJson['layoutType'] === 'Preview') {
            layoutId = conditionalFormatJson['layoutId'].split('_')[0]
            elementIdSuffix = '_preview';
        }
        conditionalFormatJson['elementIdSuffix'] = elementIdSuffix;
        const queryParams = {
            id: ['conditionalformatting_' + this.appUtilityObject.orgId + '_' + layoutId],
            dataSource: appConstant.couchDBStaticName
        }
        return this.dataProviderObject.fetchDocsUsingRecordIds(queryParams).then(result => {
            if (result['status'] === 'SUCCESS') {
                let configDoc = result['response'];
                this.getRestrictionsBasedOnUser(conditionalFormatJson, configDoc);
            }
        })
    }

    getRestrictionsBasedOnUser(conditionalFormatJson: ConditionalFormat, configDoc) {

        let conditionalFormats = configDoc['conditionalFormatSet'];
        conditionalFormatJson['restrictionRules'] = []
        conditionalFormats.filter(element => {
            if (element['restrictionAssignment']['user'] || element['restrictionAssignment']['userrole'] || element['restrictionAssignment']['usergroup'] || element['restrictionAssignment']['userres']) {
                if (element['restrictionAssignment']['user'] && element['restrictionAssignment']['user'].includes(this.appUtilityObject.userId) && element['isActive']) {
                    conditionalFormatJson.restrictionRules.push(element)
                }

                if (element['restrictionAssignment']['userrole'] && element['restrictionAssignment']['userrole'].includes(this.appUtilityObject.roleId) && element['isActive']) {
                    conditionalFormatJson.restrictionRules.push(element)
                }

                if (element['restrictionAssignment']['usergroup'] && element['isActive'] && this.appUtilityObject.userGroups.some(item => element['restrictionAssignment']['usergroup'].includes(item))) {
                    conditionalFormatJson.restrictionRules.push(element)
                }

                if (element['restrictionAssignment']['userres'] && element['isActive'] && this.appUtilityObject.userResponsibilities.some(item => element['restrictionAssignment']['userres'].includes(item))) {
                    conditionalFormatJson.restrictionRules.push(element)
                }
            } else {
                if (element['isActive']) {
                    conditionalFormatJson.restrictionRules.push(element)
                }
            }
        })

        if (conditionalFormatJson.restrictionRules.length > 0) {
            conditionalFormatJson.restrictionRules.forEach(elem => {
                this.applyRestrictionForOnLoad(conditionalFormatJson, elem);
            })
        }
    }

    async applyRestrictionForOnLoad(conditionalFormatJson: ConditionalFormat, restrictions) {

        var afterDataFetch = restrictions['restrictionSet']['afterDataFetch'];
        var displayChange = afterDataFetch['displayChange'];
        var onLoad = displayChange['onLoad'];

        if (onLoad) {
            if (onLoad['withoutCriteria'] && onLoad['withoutCriteria'].length > 0) {
                for (const element of onLoad['withoutCriteria']) {
                    await this.formatDataBasedOnRestriction(conditionalFormatJson, element, "onLoad", true);
                }
            }
            if (onLoad['withCriteria'] && onLoad['withCriteria'].length > 0) {
                for (const element of onLoad['withCriteria']) {
                    let criteriaResult = this.formulaService.evaluate(afterDataFetch['criteriaJSON'], conditionalFormatJson.dataObject)
                    await this.formatDataBasedOnRestriction(conditionalFormatJson, element, "onLoad", criteriaResult);
                }
            }
        }
    }

    async formatDataBasedOnRestriction(conditionalFormatJson: ConditionalFormat, configJSON, mode, criteriaResult) {

        if (conditionalFormatJson['layoutType'] === 'Add' || conditionalFormatJson['layoutType'] === 'Edit') {
           await this.formatDataBasedOnRestrictionEntryLayout(conditionalFormatJson, configJSON, mode, criteriaResult)
        } else {
            await this.formatDataBasedOnRestrictionViewLayout(conditionalFormatJson, configJSON, mode, criteriaResult)
        }

    }
    async formatDataBasedOnRestrictionEntryLayout(conditionalFormatJson: ConditionalFormat, configJSON, mode, criteriaResult) {

        const fieldLevel = configJSON['fieldLevel'];
        const actionLevel = configJSON['actionLevel'];
        const sectionLevel = configJSON['sectionLevel'];

        let fl_defaultValue;
        let fl_readonly;
        let fl_hidden;
        let fl_mandatory;
        let fl_defaultField;
        let fl_visible;
        let fl_editable;
        let fl_maskingField;
        if (fieldLevel) {
            fl_defaultValue = fieldLevel.filter(element => {
                if (conditionalFormatJson['clonedDataFieldDetails'] && conditionalFormatJson['clonedDataFieldDetails'].length !== 0 && mode === 'onLoad' && conditionalFormatJson.layoutType === "Add") {
                    conditionalFormatJson['clonedDataFieldDetails'].forEach(field => {
                        if (field['destinationObjectName'] === element['objectName'] && field['destinationFieldName'] === element['fieldName']) {
                            element['isActive'] = false
                        }
                    })
                }
                return element['attributeTypeIs'] === 'defaultvalue' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })

            fl_defaultValue = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'defaultvalue' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })

            fl_readonly = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'readonly' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })

            fl_hidden = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'hidden' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })

            fl_mandatory = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'mandatory' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })

            fl_defaultField = fieldLevel.filter(element => {
                if (conditionalFormatJson['clonedDataFieldDetails'] && conditionalFormatJson['clonedDataFieldDetails'].length !== 0 && mode === 'onLoad' && conditionalFormatJson.layoutType === "Add") {
                    conditionalFormatJson['clonedDataFieldDetails'].forEach(field => {
                        if (field['destinationObjectName'] === element['objectName'] && field['destinationFieldName'] === element['fieldName']) {
                            element['isActive'] = false
                        }
                    })
                }
                return element['attributeTypeIs'] === 'defaultfield' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })

            fl_visible = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'visible' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })

            fl_editable = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'editable' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })

            fl_maskingField = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'masking' && element['isActive'];
            })
        }

        let al_hidden;
        let al_readonly
        let al_visible
        if (actionLevel) {
            al_hidden = actionLevel.filter(element => {
                return element['attributeTypeIs'] === 'hidden' &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)

            })
            al_readonly = actionLevel.filter(element => {
                return element['attributeTypeIs'] === 'readonly' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })

            al_visible = actionLevel.filter(element => {
                return element['attributeTypeIs'] === 'visible' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })
        }

        let sl_hidden;
        let sl_readonly;
        let sl_visible
        if (sectionLevel) {
            sl_hidden = sectionLevel.filter(element => {
                return element['attributeTypeIs'] === 'hidden' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })
            sl_readonly = sectionLevel.filter(element => {
                return element['attributeTypeIs'] === 'readonly' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })
            sl_visible = sectionLevel.filter(element => {
                return element['attributeTypeIs'] === 'visible' && element['isActive'] &&
                    (element['action'] === 'Both' || element['action'] === conditionalFormatJson.layoutType)
            })
        }


        // Field level
        if (fl_defaultValue && fl_defaultValue.length > 0) {
            for (const element of fl_defaultValue) {
                const objectId = this.objectTableMappingObject.mappingDetail[element['objectName']]
                const traversalPath = element['traversalPath']
                if (mode === 'onChange') {
                    if (criteriaResult) {
                        const valueForDefaultValue = await this.getValuesBasedOnFieldType(conditionalFormatJson, element)

                        conditionalFormatJson.dataObject[traversalPath][element['fieldName']] = valueForDefaultValue;


                    } else {
                        const fieldName = element['fieldType'] === 'LOOKUP' ? `${element['fieldName']}_searchKey` : element['fieldName'];
                        if (element['isRevoke']) {
                            conditionalFormatJson.dataObject[traversalPath][fieldName] = conditionalFormatJson.dataObject[traversalPath + "Temp"][fieldName]
                            conditionalFormatJson.formGroup.get(objectId).get(fieldName).setValue(conditionalFormatJson.dataObject[traversalPath + "Temp"][fieldName])
                        } else if (element['isReset']) {
                            if (element['fieldType'] === 'LOOKUP') {
                                if (element['isStandardObject']) {
                                    conditionalFormatJson.dataObject[element['lookupTraversalPath']] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[element['fieldName'].split('_')[0]]))
                                } else {
                                    conditionalFormatJson.dataObject[element['lookupTraversalPath']] = JSON.parse(JSON.stringify(this.dataProviderObject.tableStructure()[element['fieldName'].split('_')[0]]));
                                }
                            } else if (element['fieldType'] === 'CHECKBOX') {
                                if (conditionalFormatJson.pickListValues && conditionalFormatJson.pickListValues[objectId] && conditionalFormatJson.pickListValues[objectId][fieldName] && conditionalFormatJson.pickListValues[objectId][fieldName].length > 0) {
                                    for (let i = 0; i < conditionalFormatJson.pickListValues[objectId][fieldName].length; i++) {
                                        conditionalFormatJson.pickListValues[objectId][fieldName][i]['isChecked'] = false;
                                    }
                                }
                            }
                            if (element['fieldType'] === 'BOOLEAN') {
                                conditionalFormatJson.dataObject[traversalPath][element['fieldName']] = false
                                conditionalFormatJson.formGroup.get(objectId).get(fieldName).setValue(false)
                            } else {
                                conditionalFormatJson.dataObject[traversalPath][element['fieldName']] = null
                                conditionalFormatJson.formGroup.get(objectId).get(fieldName).setValue(null)
                            }
                        }
                    }
                    if (element['isReadonly']) {
                        this.makeFieldReadOnly(conditionalFormatJson, element, criteriaResult);
                    }
                } else {

                    let valueForDefaultValue: any = conditionalFormatJson.dataObject[traversalPath][element['fieldName']];
                    if (criteriaResult) {
                        valueForDefaultValue = await this.getValuesBasedOnFieldType(conditionalFormatJson, element)
                    } else {
                        if (element['fieldType'] === "BOOLEAN") {
                            valueForDefaultValue = !element['value'];
                        }
                    }
                    if (element['isReadonly']) {
                        this.makeFieldReadOnly(conditionalFormatJson, element, criteriaResult);
                    }

                    conditionalFormatJson.dataObject[traversalPath][element['fieldName']] = valueForDefaultValue

                }
                if (conditionalFormatJson.formGroup.get(objectId).get(element['fieldName'])) {
                    conditionalFormatJson.formGroup.get(objectId).get(element['fieldName']).markAsDirty();
                }
            }
        }

        if (fl_defaultField && fl_defaultField.length > 0) {
            fl_defaultField.forEach(element => {
                const objectId = this.objectTableMappingObject.mappingDetail[element['objectName']]
                const traversalPath = element['traversalPath']
                if (criteriaResult) {
                    const valueForDefaultField = this.getValuesForDefaultField(conditionalFormatJson, element)

                    conditionalFormatJson.dataObject[traversalPath][element['fieldName']] = valueForDefaultField


                } else {
                    conditionalFormatJson.dataObject[traversalPath][element['fieldName']] = null
                    if (conditionalFormatJson.formGroup.get(objectId).get(element['fieldName'])) {
                        conditionalFormatJson.formGroup.get(objectId).get(element['fieldName']).setValue(null)
                    }
                }

                if (element['isReadonly']) {
                    this.makeFieldReadOnly(conditionalFormatJson, element, criteriaResult);
                }
                if (conditionalFormatJson.formGroup.get(objectId).get(element['fieldName'])) {
                    conditionalFormatJson.formGroup.get(objectId).get(element['fieldName']).markAsDirty();
                }
            });
        }

        if (fl_readonly && fl_readonly.length > 0) {
            fl_readonly.forEach(element => {
                this.makeFieldReadOnly(conditionalFormatJson, element, criteriaResult)
            });
        }

        if (fl_editable && fl_editable.length > 0) {
            fl_editable.forEach(element => {
                this.makeFieldReadOnly(conditionalFormatJson, element, !criteriaResult)
            });
        }

        if (fl_hidden && fl_hidden.length > 0) {
            fl_hidden.forEach(element => {
                const divId = element['fieldDivElementId'];
                if (document.getElementById(divId)) {
                    document.getElementById(divId)['hidden'] = criteriaResult;
                }
            });
        }
        if (fl_visible && fl_visible.length > 0) {
            fl_visible.forEach(element => {
                const divId = element['fieldDivElementId'];
                if (document.getElementById(divId)) {
                    document.getElementById(divId)['hidden'] = !criteriaResult;
                }
            });
        }
        if (fl_mandatory && fl_mandatory.length > 0) {
            fl_mandatory.forEach(element => {
                const objectId = this.objectTableMappingObject.mappingDetail[element['objectName']]
                const obj = conditionalFormatJson.formGroup.get(objectId);
                let formCtrl;
                let fieldName;
                if (element['fieldType'] === "LOOKUP") {
                    fieldName = element['fieldName'] + "_searchKey";
                } else {
                    fieldName = element['fieldName'];
                }
                formCtrl = obj.get(fieldName);
                const validation = conditionalFormatJson.formGroupValidation[objectId][fieldName]['validator']
                if (criteriaResult) {
                    const validationObj = validation.slice()
                    validationObj.push(Validators.required)
                    conditionalFormatJson.formGroupValidation[objectId][fieldName]['isRequired'] = true
                    formCtrl.setValidators(validationObj)
                } else {
                    conditionalFormatJson.formGroupValidation[objectId][fieldName]['isRequired'] = false
                    formCtrl.setValidators(validation)
                }
                formCtrl.updateValueAndValidity();
            });
        }

        if (fl_maskingField && fl_maskingField.length > 0) {
            fl_maskingField.forEach(element => {
                this.makeFieldMasking(conditionalFormatJson, element, criteriaResult);
            });
        }

        // Action level
        if (al_hidden && al_hidden.length > 0) {
            al_hidden.forEach(element => {
                const actionElementId = element['actionElementId']
                if (document.getElementById(actionElementId)) {
                    document.getElementById(actionElementId)['hidden'] = criteriaResult;
                }
            });
        }
        if (al_visible && al_visible.length > 0) {
            al_visible.forEach(element => {
                const actionElementId = element['actionElementId']
                if (document.getElementById(actionElementId)) {
                    document.getElementById(actionElementId)['hidden'] = !criteriaResult;
                }
            });
        }

        if (al_readonly && al_readonly.length > 0) {
            al_readonly.forEach(element => {
                const actionElementId = element['actionElementId']
                if (document.getElementById(actionElementId)) {
                    document.getElementById(actionElementId)['disabled'] = criteriaResult;
                    if (criteriaResult) {
                        document.getElementById(actionElementId).style.cursor = "not-allowed";
                    } else {
                        document.getElementById(actionElementId).style.cursor = "";
                    }
                }
            });
        }

        // Section level
        if (sl_hidden && sl_hidden.length > 0) {
            sl_hidden.forEach(element => {
                const sectionElementId = element['sectionElementId']
                if (document.getElementById(sectionElementId)) {
                    document.getElementById(sectionElementId)['hidden'] = criteriaResult;
                }
            });
        }
        if (sl_visible && sl_visible.length > 0) {
            sl_visible.forEach(element => {
                const sectionElementId = element['sectionElementId']
                if (document.getElementById(sectionElementId)) {
                    document.getElementById(sectionElementId)['hidden'] = !criteriaResult;
                }
            });
        }
        if (sl_readonly && sl_readonly.length > 0) {
            sl_readonly.forEach(element => {
                const sectionElementId = element['sectionElementId']
                if (document.getElementById(sectionElementId)) {
                    if (criteriaResult) {
                        if (element["involvedObjects"] && element["involvedObjects"].length > 0) {
                            element["involvedObjects"].forEach(objectName => {
                                const objectId = this.objectTableMappingObject.mappingDetail[objectName]
                                if (conditionalFormatJson.formGroup.get(objectId)) {
                                    conditionalFormatJson.formGroup.get(objectId).disable();
                                }
                            });
                        }
                        const childElements = document.getElementById(sectionElementId).getElementsByTagName('*');
                        document.getElementById(sectionElementId).style.cursor = "not-allowed";
                        for (const node of childElements as any) {
                            node.disabled = true;
                            node.style.pointerEvents = "none";
                        }
                    } else {
                        if (element["involvedObjects"] && element["involvedObjects"].length > 0) {
                            element["involvedObjects"].forEach(objectName => {
                                const objectId = this.objectTableMappingObject.mappingDetail[objectName]
                                if (conditionalFormatJson.formGroup.get(objectId)) {
                                    conditionalFormatJson.formGroup.get(objectId).enable();
                                }
                            });
                        }
                        const childElements = document.getElementById(sectionElementId).getElementsByTagName('*');
                        document.getElementById(sectionElementId).style.cursor = "";
                        for (const node of childElements as any) {
                            node.disabled = false;
                            node.style.pointerEvents = "";
                        }
                    }
                }
            });
        }
    }

    async formatDataBasedOnRestrictionViewLayout(conditionalFormatJson: ConditionalFormat, configJSON, mode, criteriaResult) {

        const fieldLevel = configJSON['fieldLevel'];
        const actionLevel = configJSON['actionLevel'];
        const sectionLevel = configJSON['sectionLevel'];

        let fl_defaultValue;
        let fl_hidden;
        let fl_defaultField;
        let fl_maskingField;
        let fl_visible;
        if (fieldLevel) {
            fl_defaultValue = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'defaultvalue'
            })

            fl_hidden = fieldLevel.filter((element) => {
                return element["attributeTypeIs"] === "hidden" && element["isActive"];
            });

            fl_defaultField = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'defaultfield'
            })

            fl_maskingField = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'masking' && element['isActive'];
             })

             fl_visible = fieldLevel.filter(element => {
                return element['attributeTypeIs'] === 'visible' && element['isActive'];
            })
        }

        let al_hidden;
        let al_readonly
        let al_visible;
        let al_editable;
        if (actionLevel) {
            al_hidden = actionLevel.filter(element => {
                return element['attributeTypeIs'] === 'hidden' && element['isActive']
            })
            al_readonly = actionLevel.filter(element => {
                return element['attributeTypeIs'] === 'readonly' && element['isActive']
            })
            al_visible = actionLevel.filter(element => {
                return element['attributeTypeIs'] === 'visible' && element['isActive']
            })
            al_editable = actionLevel.filter(element => {
                return element['attributeTypeIs'] === 'editable' && element['isActive']
            })
        }

        let sl_hidden;
        let sl_readonly;
        if (sectionLevel) {
            sl_hidden = sectionLevel.filter(element => {
                return element['attributeTypeIs'] === 'hidden' && element['isActive']
            })
            sl_readonly = sectionLevel.filter(element => {
                return element['attributeTypeIs'] === 'readonly' && element['isActive']
            })
        }

        if (fl_defaultValue && fl_defaultValue.length > 0) {
            for (const elementValue of fl_defaultValue) {
                const objectId = this.objectTableMappingObject.mappingDetail[elementValue['objectName']]
                if (criteriaResult) {
                    conditionalFormatJson.dataObject[elementValue['traversalPath']][elementValue['fieldName']] = await this.getValuesBasedOnFieldType(conditionalFormatJson, elementValue)
                    conditionalFormatJson.dataObject[elementValue['traversalPath']] = JSON.parse(JSON.stringify(conditionalFormatJson.dataObject[elementValue['traversalPath']]))
                }
            }
        }

        if (fl_defaultField && fl_defaultField.length > 0) {
            fl_defaultField.forEach(element => {
                const sourceObjectId = this.objectTableMappingObject.mappingDetail[element['sourceObjectName']]
                const objectId = this.objectTableMappingObject.mappingDetail[element['objectName']]
                if (criteriaResult) {
                    conditionalFormatJson.dataObject[element['traversalPath']][element['fieldName']] = conditionalFormatJson.dataObject[element['sourceTraversalPath']][element['sourceFieldName']]
                }
            });
        }
        if (fl_hidden && fl_hidden.length > 0) {
            fl_hidden.forEach(element => {
                this.makeFieldHiddenForListSection(conditionalFormatJson, element, criteriaResult)
            })
        }
        if (fl_maskingField && fl_maskingField.length > 0) {
            fl_maskingField.forEach(element => {
                this.makeFieldMasking(conditionalFormatJson, element, criteriaResult);
            });
        }
        if (fl_visible && fl_visible.length > 0) {
            fl_visible.forEach(element => {
                const divId = element['fieldDivElementId'];
                if (document.getElementById(divId)) {
                    document.getElementById(divId)['hidden'] = !criteriaResult;
                }
            });
        }

        if (al_hidden && al_hidden.length > 0) {
            al_hidden.forEach(element => {
                const actionElementId = element['actionElementId'] + conditionalFormatJson['elementIdSuffix']
                if (document.getElementById(actionElementId)) {
                    document.getElementById(actionElementId)['hidden'] = criteriaResult;
                }
            });
        }

        if (al_readonly && al_readonly.length > 0) {
            al_readonly.forEach(element => {
                const actionElementId = element['actionElementId'] + conditionalFormatJson['elementIdSuffix']
                const pointerEventsValue = criteriaResult ? "not-allowed" : "";
                if (document.getElementById(actionElementId)) {
                    document.getElementById(actionElementId)['disabled'] = criteriaResult;
                    document.getElementById(actionElementId).style.cursor = pointerEventsValue;
                }
            });
        }

        if (al_visible && al_visible.length > 0) {
           al_visible.forEach(element => {
               const actionElementId = element['actionElementId'] + conditionalFormatJson['elementIdSuffix']
               if (document.getElementById(actionElementId)) {
                   document.getElementById(actionElementId)['hidden'] = !criteriaResult;
               }
           });
        }

        if (al_editable && al_editable.length > 0) {
           al_editable.forEach(element => {
               const actionElementId = element['actionElementId'] + conditionalFormatJson['elementIdSuffix']
               const pointerEventsValue = criteriaResult ? "" : "not-allowed";
               if (document.getElementById(actionElementId)) {
                   document.getElementById(actionElementId)['disabled'] = !criteriaResult;
                   document.getElementById(actionElementId).style.cursor = pointerEventsValue;
               }
           });
        }

        if (sl_hidden && sl_hidden.length > 0) {
            sl_hidden.forEach(element => {
                const sectionElementId = element['sectionElementId'] + conditionalFormatJson['elementIdSuffix']
                if (document.getElementById(sectionElementId)) {
                    document.getElementById(sectionElementId)['hidden'] = criteriaResult;
                }
            });
        }

        if (sl_readonly && sl_readonly.length > 0) {
            sl_readonly.forEach(element => {
                const sectionElementId = element['sectionElementId'] + conditionalFormatJson['elementIdSuffix']
                const pointerEventsValue = criteriaResult ? "none" : "";
                if (document.getElementById(sectionElementId)) {
                    document.getElementById(sectionElementId).style.pointerEvents = pointerEventsValue;
                }
            });
        }
    }

    getFieldNameForLookupAndMasterdetail(element) {
        let lookupFieldMapping = this.lookupFieldMappingObject.mappingDetail
        if (element['fieldType'] === 'LOOKUP') {
            let lookupObjectName = Object.keys(lookupFieldMapping)
            for (let obj of lookupObjectName) {
                let lookupColumns = Object.keys(lookupFieldMapping[obj])
                for (let value of lookupColumns) {                    
                    if (lookupFieldMapping[obj][value] === element['fieldName']) {
                        return value;
                    }
                }
            }
        } else if (element['fieldType'] === 'HEADER' || element['fieldType'] === 'MASTERDETAIL') {
            const objectId = this.objectTableMappingObject.mappingDetail[element['objectName']]
            let lookupFields = lookupFieldMapping[objectId]
            const lookupDependent: any = Object.values(lookupFields);
            for (let index = 0; index < lookupDependent.length; index++) {
                if (lookupDependent[index].startsWith(element['fieldName'] + '_')) {
                    return Object.keys(lookupFields)[index]
                }
            }
        }
    }

    getPreviousLevelChildFieldInfo(fieldInfo: FieldInfo | '', previousFieldInfo) {
        if (fieldInfo['fieldType'] === 'LOOKUP' || fieldInfo['fieldType'] === 'MASTERDETAIL' || fieldInfo['fieldType'] === 'HEADER') {
        return this.getPreviousLevelChildFieldInfo(fieldInfo['child'], fieldInfo);
      } else {
        return previousFieldInfo;
      }
    }

    makeFieldHiddenForListSection(conditionalFormatJson: ConditionalFormat, element, criteriaResult) {
        let fieldType = element['fieldType'];
        let objectFieldName = '';
        let lookupFieldName: any = '';
        if (fieldType === 'FORMULA') {
            objectFieldName = element['fieldName'] + '__f';
        } else if (fieldType === 'ROLLUPSUMMARY') {
            objectFieldName = element['fieldName'] + '__r';
        } else if (fieldType === 'LOOKUP' || fieldType === 'HEADER' || fieldType === 'MASTERDETAIL') {
            lookupFieldName = this.getFieldNameForLookupAndMasterdetail(element)
            console.log(lookupFieldName)
            objectFieldName = element['fieldName'];
        } else {
            objectFieldName = element['fieldName'];
        }
        if (conditionalFormatJson['layoutType'] === 'List' || element['isFieldDroppedInListSection']) {
            let columnDefinitions = conditionalFormatJson['parentPage'].columnDefinitions;
            let objectId;
            if (conditionalFormatJson['layoutType'] === 'List') {
                const primaryObjectName = conditionalFormatJson['primaryTraversalPath'].split('_DUMMY')[0];
                objectId = this.objectTableMappingObject.mappingDetail[primaryObjectName];
            } else if (conditionalFormatJson['layoutType'] === 'View') {
                objectId = this.objectTableMappingObject.mappingDetail[element['sectionObjectName']];
                if (element['isReverseLookup'] === 'Y') {
                    objectId += '_' + element['lookupFieldId'];
                }
            }
            columnDefinitions = columnDefinitions[objectId];
            let traversalPath;
            if (fieldType === 'LOOKUP' || fieldType === 'HEADER' || fieldType === 'MASTERDETAIL') {
                traversalPath = (element['traversalPath'] + '$$' + lookupFieldName);
            } else {
                traversalPath = (element['traversalPath'] + '$$' + element['fieldName']);
            }
            let fieldArray = (columnDefinitions || []).filter(objectValue => {
                let fieldInfo = objectValue['params']['fieldInfo'] || {};
                let previousLevelChildFieldInfo = this.getPreviousLevelChildFieldInfo(fieldInfo, fieldInfo);
                let fieldName = previousLevelChildFieldInfo['fieldName'];
                fieldInfo = this.slickgridPopoverService.getFieldInfo(fieldInfo);
                if (fieldInfo['traversalpath']) {
                    fieldName = fieldInfo['fieldName']
                }
                return (fieldName === objectFieldName &&
                    objectValue['params']['fieldInfo']['traversalpath'] === traversalPath)
            });
            if (fieldArray.length) {
                var index = columnDefinitions.findIndex(value => value['id'] === fieldArray[0]['id']);
                columnDefinitions.splice(index, 1);
            }
        } else {
            const divId = element['fieldDivElementId'] + conditionalFormatJson['elementIdSuffix'];
            if (document.getElementById(divId)) {
                document.getElementById(divId)['hidden'] = criteriaResult;
            }
        }
    }

    makeFieldReadOnly(conditionalFormatJson: ConditionalFormat, element, criteriaResult) {
        let pointerEventsValue = "";
        if (criteriaResult) {
            pointerEventsValue = "none"
            var childElements = document.getElementById(element['fieldDivElementId']).getElementsByTagName('*');
            for (var node of childElements as any) {
                node.disabled = criteriaResult;
                node.style.pointerEvents = pointerEventsValue;
                node.style.color = '#333333';
            }
            document.getElementById(element['fieldDivElementId']).classList.add('cs-readonly');
        } else {
            var childElements = document.getElementById(element['fieldDivElementId']).getElementsByTagName('*');
            for (var node of childElements as any) {
                node.disabled = criteriaResult;
                node.style.pointerEvents = pointerEventsValue;
            }
            if (document.getElementById(element['fieldDivElementId']).classList.contains('cs-readonly')) {
                document.getElementById(element['fieldDivElementId']).classList.remove('cs-readonly');
            }
        }
        if (element.fieldType === 'DROPDOWN' && element.isStatusWorkflowEnabled) {
            document.getElementById("action_" + element.objectName + "_" + element['fieldName'] + "_showworkflowalert")['disabled'] = criteriaResult;
        }
        if (element.fieldType === 'URL') {
            let fieldValue = conditionalFormatJson.dataObject[element['traversalPath']][element['fieldName']] || {};
            fieldValue = this.appUtilityObject.isValidJson(fieldValue)
            if (Object.keys(fieldValue).length || typeof fieldValue == 'string') {
                var childElements = document.getElementById(element['fieldDivElementId']).getElementsByTagName('*');
                var layoutName = element['fieldDivElementId'].slice(4,element['fieldDivElementId'].length+1);
                layoutName = layoutName.split(element['traversalPath'])[0];
                layoutName = layoutName.slice(0, layoutName.length - 1);
                let actionId = 'ACT_' + layoutName + '$$' + element['traversalPath'] + '$$' + element['fieldName'] + '_input_';
                let arrayToSkipCondition = [];
                arrayToSkipCondition.push(actionId+'add')
                let extraPaddingWidth = 35
                let fieldWidth = document.getElementById(element['fieldDivElementId']).offsetWidth;
                let moreButtonWidth = 35
                var valueWidth = 0 + moreButtonWidth;
                let dbData, display = fieldValue;
                if (typeof fieldValue == 'object') {
                    dbData = fieldValue['urlDBValue'];
                    if (fieldValue['urlType'] === 'single') {
                        display = ((dbData.displayValue || '') === '') ? dbData.urlValue : dbData.displayValue;
                    } else if (fieldValue['urlType'] === 'multiple') {
                        display = dbData.map(a => a.displayValue);
                        display = display.toString();
                    }
                }
                let displayValueArray = display.split(',');
                displayValueArray.forEach((element, index) => {
                    let selectedFieldLength = displayValueArray[index].length;
                    valueWidth = valueWidth + (selectedFieldLength * 8) + extraPaddingWidth;
                    if (valueWidth < fieldWidth || index === 0) {
                        arrayToSkipCondition.push(actionId + 'edit_' + index)
                        arrayToSkipCondition.push(actionId + 'delete_' + index)
                    }
                });
                for (var node of childElements as any) {
                    if (arrayToSkipCondition.includes(node.id)) {
                        continue;
                    }
                    node.disabled = false;
                    node.style.pointerEvents = '';
                }
            }
        }
    }

    makeFieldMasking(conditionalFormatJson: ConditionalFormat, element, criteriaResult) {
        element['isMaskingRequired'] = criteriaResult;
        const fieldType = this.slickgridPopoverService.getFieldType(element);
        let objectFieldName = '';
        if (fieldType === 'FORMULA') {
            objectFieldName = element['fieldName'] + '__f';
        } else if (fieldType === 'ROLLUPSUMMARY') {
            objectFieldName = element['fieldName'] + '__r';
        } else {
            objectFieldName = element['fieldName'];
        }
        if (conditionalFormatJson['layoutType'] === 'List' || element['isFieldDroppedInListSection']) {
            const primaryObjectName = conditionalFormatJson['primaryTraversalPath'].split('_DUMMY')[0];
            let objectId = this.objectTableMappingObject.mappingDetail[primaryObjectName];
            let columnDefinitions = conditionalFormatJson['parentPage'].columnDefinitions;
            if (conditionalFormatJson['layoutType'] === 'List') {
                columnDefinitions = conditionalFormatJson.parentPage.columnDefinitions[objectId];
            }
            if (conditionalFormatJson['layoutType'] === 'View') {
                objectId = this.objectTableMappingObject.mappingDetail[element['sectionObjectName']];
                if (element['isReverseLookup'] === 'Y') {
                    objectId += '_' + element['lookupFieldId'];
                }  
                columnDefinitions = columnDefinitions[objectId]
            }
            const traversalPath = element['traversalPath'] + '$$' + element['fieldName'];
            const fieldArray = (columnDefinitions || []).filter(objectValue => {
                const maskingFieldInfo = this.slickgridPopoverService.getFieldInfo(objectValue['params']['fieldInfo'] || {});
                return (maskingFieldInfo['fieldName'] === objectFieldName && maskingFieldInfo['traversalpath'] === traversalPath);
            });
            if (fieldArray.length) {
                fieldArray[0]['formatter'] = CspfmDataMaskingFormatter;
                fieldArray[0]['exportCustomFormatter'] = CspfmExportDataMaskingFormatter;
                fieldArray[0]['params']['context'] = this;
                fieldArray[0]['params']['maskingAttributes'] = {
                    isMaskingRequired: criteriaResult,
                    maskStyle: element['maskStyle'],
                    maskType: element['maskType'],
                    maskInfo: element['maskInfo']
                };
                if (Object.keys(fieldArray[0]['editor'] || {}).length) {
                    delete fieldArray[0]['editor'];
                }
                if (fieldArray[0]['filterable']) {
                    fieldArray[0]['filterable'] = false;
                }
                if (fieldArray[0]['grouping']) {
                    delete fieldArray[0]['grouping'];
                }
            }
        } else {
            const traversalPath = element['traversalPath'] + '$$' + element['fieldName'];
            let fieldInfo: any = Object.values(conditionalFormatJson['fieldInfo']).filter((fieldInfoValue: FieldInfo) => {
                const maskingFieldInfo = this.slickgridPopoverService.getFieldInfo(fieldInfoValue);
                return (maskingFieldInfo['fieldName'] === objectFieldName && maskingFieldInfo['traversalpath'] === traversalPath);
            })[0]
            fieldInfo = this.slickgridPopoverService.getFieldInfo(fieldInfo || {});
            element = { ...element, ...fieldInfo };
            let value = this.cspfmDataDisplay.transform(conditionalFormatJson['dataObject'][element['traversalPath']], element);
            value = this.formatMaskingField(value, element, fieldType);
            const inputId = element['fieldInputElementId'] + conditionalFormatJson['elementIdSuffix'];
            if (document.getElementById(inputId)) {
                document.getElementById(inputId)['innerHTML'] = value;
            }
        }
    }
 
    formatMaskingField(value, fieldInfo, fieldType, exportFlag?) {
        if (fieldInfo['isMaskingRequired']) {
            const maskStyle = fieldInfo['maskStyle'];
            if (fieldType === 'CURRENCY' || fieldType === 'DECIMAL') {
                return this.removeCharactersExceptActualValue(value, fieldInfo, fieldType, exportFlag);
            }
            if (!isNaN(value)) {
                value = String(value);
            }
            if (value.length === 0) {
                return '';
            }
            if (fieldInfo['maskType'] === 'all') {
                if (maskStyle === 'blur') {
                    let tag = `<span style="color: transparent; text-shadow: 0 0 5px rgba(0,0,0,0.5);">${new Array(value.length + 1).join('#')}</span>`; // Provided in single line for column resize
                    if (exportFlag) {
                        tag = `${new Array(value.length + 1).join('#')}`;
                    }
                    value = tag;
                } else {
                    value = new Array(value.length + 1).join(maskStyle);
                }
            } else {
                const characterFormat = fieldInfo['maskInfo'] && fieldInfo['maskInfo']['characterFormat'];
                const characterCountSet = fieldInfo['maskInfo'] && fieldInfo['maskInfo']['characterCount'];
                const count = characterFormat === 'custom' ? characterCountSet : [characterCountSet];
                if (characterFormat === 'prefix') {
                    // Starts with
                    count[0] = value.length < count[0] ? value.length : count[0];
                    if (maskStyle === 'blur') {
                        let tag = `<span style="color: transparent; text-shadow: 0 0 5px rgba(0,0,0,0.5);">${new Array(Number(count[0]) + 1).join('#')}</span>${value.substr(count[0], value.length)}`; // Provided in single line for column resize
                        if (exportFlag) {
                            tag = `${new Array(Number(count[0]) + 1).join('#')} ${value.substr(count[0], value.length)}`;
                        }
                        value = tag;
                    } else {
                        value = new Array(Number(count[0]) + 1).join(maskStyle) + value.substr(count[0], value.length);
                    }
                } else if (characterFormat === 'suffix') {
                    // Ends with
                    count[0] = value.length < count[0] ? value.length : count[0];
                    if (maskStyle === 'blur') {
                        let tag = `${value.substr(0, value.length - count[0])}<span style="color: transparent; text-shadow: 0 0 5px rgba(0,0,0,0.5);">${new Array(Number(count[0]) + 1).join('#')}</span>`; // Provided in single line for column resize
                        if (exportFlag) {
                            tag = `${value.substr(0, value.length - count[0])}${new Array(Number(count[0]) + 1).join('#')}`;
                        }
                        value = tag;
                    } else {
                        value = value.substr(0, value.length - count[0]) + new Array(Number(count[0]) + 1).join(maskStyle);
                    }
                } else if (characterFormat === 'custom') {
                    // Position based
                    return this.makeFieldMaskingForCustomPositions(characterCountSet, value, maskStyle, exportFlag);
                }
            }
            return value;
        } else {
            return value;
        }
    }

    makeFieldMaskingForCustomPositions(characterCountSet, value, maskStyle, exportFlag) {
        let characterCount = [];
        const myArray = value.split('');
        for (const characterCountValues of characterCountSet) {
            characterCount = characterCountValues.split('-');
            characterCount[1] = (value.length < characterCount[1]) ? value.length : characterCount[1];
            characterCount = (characterCount[0] === characterCount[1]) ? [characterCount[0]] : lodash.range(characterCount[0], Number(characterCount[1]) + 1);
            for (const position of characterCount) {
                const Cposition = Number(position);
                if (myArray.length >= Cposition) {
                    if (maskStyle === 'blur') {
                        myArray[Cposition - 1] = `<span style="color: transparent; text-shadow: 0 0 5px rgba(0,0,0,0.5);">#</span>`;
                        if (exportFlag) {
                            myArray[Cposition - 1] = `#`;
                        }
                    } else {
                        myArray[Cposition - 1] = maskStyle;
                    }
                }
            }
        }
        return myArray.join('', '');
    }

    //This function is handled for currency and decimal field Data masking
    removeCharactersExceptActualValue(value, fieldInfo, fieldType, exportFlag) {
        const maskStyle = fieldInfo['maskStyle'];
        let removeNan = [];
        let onlyNumber = [];
        if (fieldType === 'CURRENCY' || fieldType === 'DECIMAL') {
            let characterCount: any = String(value).split('')
            for (let i = 0; i < characterCount.length; i++) {
                if (isNaN(characterCount[i]) || characterCount[i] === " ") {
                    removeNan.push({ [i]: characterCount[i] })
                } else {
                    onlyNumber.push(characterCount[i])
                }
            }
            value = onlyNumber.join('');
        }
        const characterFormat = fieldInfo['maskInfo'] && fieldInfo['maskInfo']['characterFormat'];
        const characterCountSet = fieldInfo['maskInfo'] && fieldInfo['maskInfo']['characterCount'];
        let count = characterFormat === 'custom' ? characterCountSet : [characterCountSet];
        if (characterFormat) {
            if (characterFormat === 'custom') {
                let characterPositionArray = [];
                for (const characterCountValues of count) {
                    const characterCount = characterCountValues.split('-');
                    characterCount[1] = value.length < characterCount[1] ? value.length : characterCount[1];
                    const tempArray = (characterCount[0] === characterCount[1]) ? [characterCount[0]] : lodash.range(characterCount[0], Number(characterCount[1]) + 1);
                    characterPositionArray = [...tempArray, ...characterPositionArray];
                }
                count = characterPositionArray;
            } else if (characterFormat === 'prefix') {
                count = lodash.range(1, Number(count[0]) + 1)
            } else if (characterFormat === 'suffix') {
                count = lodash.range(Number(value.length) - count[0] + 1, value.length + 1)
            }
        } else if (fieldInfo['maskType'] === 'all') {
            count = lodash.range(1, value.length + 1)
        }
        let myArray = value.split('');
        for (let obj of count) {
            const position = Number(obj);
            if (myArray.length >= position) {
                if (maskStyle === 'blur') {
                    myArray[position - 1] = `<span style="color: transparent; text-shadow: 0 0 5px rgba(0,0,0,0.5);">#</span>`;
                    if (exportFlag) {
                        myArray[position - 1] = `#`;
                    }
                } else {
                    myArray[position - 1] = maskStyle;
                }
            }
            value = myArray.join('', '');
            onlyNumber = myArray;
        }
        if (fieldType === 'CURRENCY' || fieldType === 'DECIMAL') {
            for (let obj of removeNan) {
                const key = Number(Object.keys(obj));
                onlyNumber.splice(key, 0, obj[key]);
            }
            value = onlyNumber.join('');
        }
        return value;
    }

    async getValuesBasedOnFieldType(conditionalFormatJson: ConditionalFormat, element) {
        let objectId = this.objectTableMappingObject.mappingDetail[element['objectName']]
        let traversalPath = element['traversalPath']
        if (element['fieldType'] === 'TEXT' || element['fieldType'] === 'MULTILINETEXTBOX' || element['fieldType'] === 'AUTONUMBER' || element['fieldType'] === 'PRIMARY' || element['fieldType'] === 'TEXTAREA' || element['fieldType'] === 'URL' || element['fieldType'] === 'EMAIL' || element['fieldType'] === 'NUMBER' || element['fieldType'] === 'DECIMAL' || element['fieldType'] === 'CURRENCY' || element['fieldType'] === 'BOOLEAN' || element['fieldType'] === 'MULTISELECT' || element['fieldType'] === 'RADIO' || element['fieldType'] === 'DROPDOWN') {
            conditionalFormatJson.formGroup.get(objectId).get(element['fieldName']).setValue(element['value'])
            return element['value']
        } else if (element['fieldType'] === 'CHECKBOX') {
            let checkBoxConfig = conditionalFormatJson.pickListValues[objectId][element['fieldName']]
            if (checkBoxConfig && checkBoxConfig.length > 0) {
                checkBoxConfig.forEach(config => {
                    if (element['value'].includes(config['val'])) {
                        config['isChecked'] = true;
                    } else {
                        config['isChecked'] = false;
                    }
                });
            }
            return element['value']
        } else if (element['fieldType'] === 'DATE' || element['fieldType'] === 'TIMESTAMP') {
            let date;
            if (element['valueType'] === 'Function') {
                let millis = new Date().getTime()
                if (element['value'] === 'Today') {
                    conditionalFormatJson.formGroup.get(objectId).get(element['fieldName']).setValue(this.datePipe.transform(millis, this.appUtilityObject.userDateFormat, this.appUtilityObject.utcOffsetValue))
                    return this.datePipe.transform(millis, this.appUtilityObject.userDateFormat, this.appUtilityObject.utcOffsetValue)
                } else {
                    conditionalFormatJson.formGroup.get(objectId).get(element['fieldName']).setValue(this.datePipe.transform(millis, this.appUtilityObject.userDateTimeFormat))
                    return this.datePipe.transform(millis, this.appUtilityObject.userDateTimeFormat, this.appUtilityObject.userZoneOffsetValue)
                }
            } else {
                if (element['fieldType'] === 'DATE') {
                    date = this.appUtilityObject.getUtcMillisecondsFromDateString(element['value'], false, element['configuredDateFormat'])
                    conditionalFormatJson.formGroup.get(objectId).get(element['fieldName']).setValue(this.datePipe.transform(date, this.appUtilityObject.userDateFormat, this.appUtilityObject.utcOffsetValue))
                    return this.datePipe.transform(date, this.appUtilityObject.userDateFormat, this.appUtilityObject.utcOffsetValue)
                } else {
                    date = this.appUtilityObject.getUtcTimeZoneMillsecondsFromDateTimeString(element['value'], 'user', element['configuredDateFormat'])
                    conditionalFormatJson.formGroup.get(objectId).get(element['fieldName']).setValue(this.datePipe.transform(date, this.appUtilityObject.userDateTimeFormat, this.appUtilityObject.userZoneOffsetValue))
                    return this.datePipe.transform(date, this.appUtilityObject.userDateTimeFormat, this.appUtilityObject.userZoneOffsetValue)
                }
            }
        } else if (element['fieldType'] === 'LOOKUP') {
            let lookupObjName = element['fieldName'].split("_")[0];

            if (element['isStandardObject'] && element['isLoggedUser']) {
                conditionalFormatJson.dataObject[element['lookupTraversalPath']] = JSON.parse(JSON.stringify(this.appUtilityObject.loggedUserCorObject));
                conditionalFormatJson.dataObject[traversalPath][element['fieldName']] = conditionalFormatJson.dataObject[element['lookupTraversalPath']]['id'];

                return conditionalFormatJson.dataObject[element['lookupTraversalPath']]['id']
            }

            const queryParams = {
                id: [element['value']],
                dataSource: appConstant.couchDBStaticName,
                isStandardObject: element['isStandardObject']
            }
            return  await this.dataProviderObject.fetchDocsUsingRecordIds(queryParams).then(result => {
                if (result['status'] === 'SUCCESS') {
                    let response = result['response']
                    conditionalFormatJson.dataObject[element['lookupTraversalPath']] = JSON.parse(JSON.stringify(response));
                    conditionalFormatJson.dataObject[traversalPath][element['fieldName']] = element['value'];
                    if (element['isReadonly']) {
                        setTimeout(() => {
                            this.makeFieldReadOnly(conditionalFormatJson, element, true);
                        }, 500);
                    }
                    return element['value']
                }
            })
        }
    }

    getValuesForDefaultField(conditionalFormatJson: ConditionalFormat, element) {
        let sourceObjectId = this.objectTableMappingObject.mappingDetail[element['sourceObjectName']]
        let targetObjectId = this.objectTableMappingObject.mappingDetail[element['objectName']]
        let traversalPath = element['traversalPath']
        let sourceTraversalPath = element['sourceTraversalPath']
        if (element['fieldType'] === 'DATE') {
            let dateValue;
            if (element['isLoggedUser']) {

                if (isNaN(this.appUtilityObject.loggedUserCorObject[element['sourceFieldName']])) {
                    dateValue = this.appUtilityObject.loggedUserCorObject[element['sourceFieldName']]
                } else {
                    let date = moment(new Date(this.appUtilityObject.loggedUserCorObject[element['sourceFieldName']])).tz(this.appUtilityObject.orgTimeZone).toISOString();
                    dateValue = this.datePipe.transform(date, this.appUtilityObject.userDateFormat)
                }
            } else {
                if (isNaN(conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']])) {
                    dateValue = conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']]
                } else {
                    let date = moment(new Date(conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']])).tz(this.appUtilityObject.orgTimeZone).toISOString();
                    dateValue = this.datePipe.transform(date, this.appUtilityObject.userDateFormat)
                }
            }

            conditionalFormatJson.formGroup.get(targetObjectId).get(element['fieldName']).setValue(dateValue);
            return dateValue;
        } else if (element['fieldType'] === 'TIMESTAMP') {
            let timeStampValue;
            if (isNaN(conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']])) {
                timeStampValue = conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']]
            } else {
                let date = moment(new Date(conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']])).tz(this.appUtilityObject.userTimeZone).toISOString();
                timeStampValue = this.datePipe.transform(date, this.appUtilityObject.userDateTimeFormat)
            }

            conditionalFormatJson.formGroup.get(targetObjectId).get(element['fieldName']).setValue(timeStampValue);
            return timeStampValue;
        } else if (element['fieldType'] === 'CHECKBOX') {
            let checkBoxConfig = conditionalFormatJson.pickListValues[sourceObjectId][element['fieldName']]
            if (checkBoxConfig && checkBoxConfig.length > 0) {
                if (conditionalFormatJson.dataObject[sourceTraversalPath] && conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']] != null) {
                    checkBoxConfig.forEach(config => {
                        if (conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']].includes(config['val'])) {
                            config['isChecked'] = true;
                        } else {
                            config['isChecked'] = false;
                        }
                    });
                }
            }
            return conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']]
        } else if (element['fieldType'] === 'LOOKUP') {
            if (element['isLoggedUser'] && element['isStandardObject']) {
                conditionalFormatJson.dataObject[element['lookupTraversalPath']] = JSON.parse(JSON.stringify(this.appUtilityObject.loggedUserCorObject))

                return conditionalFormatJson.dataObject[element['lookupTraversalPath']]['id']
            } else if (conditionalFormatJson.dataObject[sourceTraversalPath] && conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']]) {
                if (conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']]) {
                    conditionalFormatJson.dataObject[element['lookupTraversalPath']] = JSON.parse(JSON.stringify(conditionalFormatJson.dataObject[element['sourceLookupTraversalPath']]));
                    conditionalFormatJson.dataObject[traversalPath][element['fieldName']] = conditionalFormatJson.dataObject[element['lookupTraversalPath']]['id'];
                    setTimeout(() => {
                        if (element['isReadonly']) {
                            this.makeFieldReadOnly(conditionalFormatJson, element, true);
                        }
                    }, 500);
                    return conditionalFormatJson.dataObject[element['lookupTraversalPath']]['id']
                  
                } else {
                    conditionalFormatJson.dataObject[element['lookupTraversalPath']] = JSON.parse(JSON.stringify(conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']]))
                    if (conditionalFormatJson.dataObject[element['lookupTraversalPath']]['id']) {
                        return conditionalFormatJson.dataObject[element['lookupTraversalPath']]['id']
                    } else {
                        return null
                    }
                }
            } else if (conditionalFormatJson.dataObject[sourceTraversalPath] && conditionalFormatJson.dataObject[sourceTraversalPath]['id']) {
                conditionalFormatJson.dataObject[element['lookupTraversalPath']] = conditionalFormatJson.dataObject[element['fieldName']]
               if(conditionalFormatJson.dataObject[element['lookupTraversalPath']]['id']){
                return conditionalFormatJson.dataObject[element['lookupTraversalPath']]['id']
               }else{
                return null
               }
            } else {
                return null
            }
        } else {
            if (element['isPrimaryField']) {
                return conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceForPrimaryField']];
            }
            if (element['isLoggedUser']) {
                conditionalFormatJson.formGroup.get(targetObjectId).get(element['fieldName']).setValue(this.appUtilityObject.loggedUserCorObject[element['sourceFieldName']])
                return this.appUtilityObject.loggedUserCorObject[element['sourceFieldName']]
            }
            conditionalFormatJson.formGroup.get(targetObjectId).get(element['fieldName']).setValue(conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']])
            return conditionalFormatJson.dataObject[sourceTraversalPath][element['sourceFieldName']]
        }
    }


    applyRestritionForOnChange(conditionalFormatJson: ConditionalFormat, restrictions, fieldName) {
        var afterDataFetch = restrictions['restrictionSet']['afterDataFetch'];
        var displayChange = afterDataFetch['displayChange'];
        var onChange = displayChange['onChange'];
        if (onChange && onChange['withoutCriteria'] && onChange['withoutCriteria'][fieldName]) {
            this.formatDataBasedOnRestriction(conditionalFormatJson, onChange['withoutCriteria'][fieldName], "onChange", true);

        }
        if (onChange && onChange['withCriteria'] && onChange['withCriteria'][fieldName]) {
            let criteriaResult = this.formulaService.evaluate(afterDataFetch['criteriaJSON'], conditionalFormatJson.dataObject)
            this.formatDataBasedOnRestriction(conditionalFormatJson, onChange['withCriteria'][fieldName], "onChange", criteriaResult)
        }
    }
    public resetConditionalFormat(conditionalFormatJson) {
    
        try {
            if (conditionalFormatJson.restrictionRules && conditionalFormatJson.restrictionRules.length > 0) {
                conditionalFormatJson.restrictionRules.forEach(element => {
        
                    var afterDataFetch = element['restrictionSet']['afterDataFetch'];
                    var displayChange = afterDataFetch['displayChange'];
                    var onLoad = displayChange['onLoad'];
                    var onChange = displayChange['onChange'];
                    if (onLoad && onLoad['withoutCriteria'] && onLoad['withoutCriteria'].length > 0) {
                        onLoad['withoutCriteria'].forEach(eleme => {
                          this. formatDataBasedOnRestrictionEntryLayout(conditionalFormatJson, eleme, 'onLoad',false)
                        });
                    }
                    if (onLoad && onLoad['withCriteria'] && onLoad['withCriteria'].length > 0) {
                        onLoad['withCriteria'].forEach(ele => {
                    this.formatDataBasedOnRestrictionEntryLayout(conditionalFormatJson, ele, 'onLoad',false)
                        });
                    }
                    if (onChange && onChange['withoutCriteria'] && Object.keys(onChange['withoutCriteria'] ).length > 0) {
                        Object.keys(onChange['withoutCriteria'] ).forEach(element4 => {
                            this.formatDataBasedOnRestrictionEntryLayout(conditionalFormatJson, onChange['withoutCriteria'][element4], 'onChange',false)
                        });
                    }
                    if (onChange && onChange['withCriteria'] &&  Object.keys(onChange['withCriteria'] ).length > 0) {
                        Object.keys(onChange['withCriteria'] ).forEach(element5 => {
                            this.formatDataBasedOnRestrictionEntryLayout(conditionalFormatJson, onChange['withCriteria'][element5], 'onChange',false)
                        });
                    }
                    
                    
                })
            }
        } catch(err) {
                console.log(err);
                
            }
       
    }
}
