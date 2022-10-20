import {
    Injectable
} from "@angular/core";
import {
    cspfmObservableListenerUtils
} from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import {
    ObjectHierarchy
} from "../models/cspfmObjectHierarchy.type";
import {
    cspfmCustomFieldProvider
} from "../utils/cspfmCustomFieldProvider";
import {
    dataProvider
} from "../utils/dataProvider";
import * as lodash from 'lodash';
import {
    AngularGridInstance,
    Column,
    FieldType,
    OnEventArgs,
    SlickGrid
} from "angular-slickgrid";
import {
    FieldInfo
} from "../pipes/cspfm_data_display";
import {
    cspfmSlickgridUtils
} from "./cspfmSlickgridUtils";


@Injectable({
    providedIn: "root"
})
export class cspfmMultiLineEntryUtils {
    constructor(private observableListenerUtils: cspfmObservableListenerUtils,
        private customFieldProvider: cspfmCustomFieldProvider,
        private dataProviderObject: dataProvider,
        private slickGridUtils: cspfmSlickgridUtils) {

    }
    public consolidateErrorData = {
        "validationFailureJson": "",
        "showConsolidatePopup": false,
    };
    public showConsolidatePopup: Boolean = false
    addChildData(childObject, lineDataObjectHierarchy: ObjectHierarchy, columnDefinitions: {
        [objectName: string]: Array < Column >
    }) {
        try {
            if (!childObject['slickgridChildDocsArray']) {
                childObject['slickgridChildDocsArray'] = []
            }
            // let insertRow=childObject['slickgridChildDocsArray'].length; // adding new record in bottom of slickgrid
            let insertRow = 0;
            let objectType = this.getObjectType(lineDataObjectHierarchy)
            let lineDataObject = JSON.parse(JSON.stringify(this.dataProviderObject.tableStructure()[objectType]));
            lineDataObject['id'] = this.observableListenerUtils.getUUID().toUpperCase();
            lineDataObject['type'] = objectType;
            this.mergeWithTableStructure(lineDataObject)
            this.customFieldProvider.makeSlickGridCustomFields(lineDataObject, columnDefinitions[objectType])
            childObject['slickgridChildDocsArray'].splice(insertRow, 0, lineDataObject);
            this.updateLineModifiedRecordInSlickGrid(childObject['angularGridInstance'], lineDataObject)
        } catch (err) {
            console.error("err", err)
        }
    }

    getObjectType(objectDetails: ObjectHierarchy) {
        var objectType = "";
        if (objectDetails["objectId"].includes("pfm")) {
            objectType = objectDetails["objectId"];
        } else {
            objectType = "pfm" + objectDetails["objectId"];
        }
        return objectType;
    }

    mergeWithTableStructure(item) {
        if (item['type'] && !item['created_by']) {
            let tableStructure = this.dataProviderObject.tableStructure()
            let tempData = JSON.parse(JSON.stringify(tableStructure[item['type']]));
            item = lodash.extend({}, tempData, item)
        }
        return item;
    }

    makeEditableColumns(fields: Array < FieldInfo > , layoutId, childObjName: string = '', childObjectsInfo: Array < any > = [], objectHierarchy: ObjectHierarchy, formulaConfig ? ): Array < Column > {
        let columns: Array < Column > = [];
        let lineEntryActionColumn: Column = {
            id: 'cspfm_multi_line_action',
            nameKey: 'Action', // Need to plan for i18n key
            field: 'cspfm_multi_line_action',
            sortable: false,
            type: FieldType.unknown,
            excludeFromExport: true,
            formatter: (row: number, cell: number, value: any, columnDef: any, dataContext: any, grid: any) => {
                let buttonTag = `<div action-view='container'>`;
                // dataContext
                let traversalpath = 'comp_consumed'
                let addActionLabel = 'Insert'
                let addActionTooltip = 'Insert New Row'
                let addActionIcon = 'icon-mat-add'
                let addActionDisabled = ''
                let addActionStyle = ''

                let removeActionLabel = 'Remove'
                let removeActionTooltip = 'Remove Current Row'
                let removeActionIcon = 'icon-mat-remove_circle_outline'
                let removeActionDisabled = ''
                let removeActionStyle = ''
                let error = "icon-mat-warning"
                let errorActionTooltip = 'Error Current Row'
                let errorActionStyle = ''
                let errorActionDisabled = ''

                // if ((this.ingredientWiseQuantity[dataContext[this.item$lookupInbiomarincompconsumed]['id']]['original_quantity'] - this.ingredientWiseQuantity[dataContext[this.item$lookupInbiomarincompconsumed]['id']]['consumed_quantity']) === 0) {
                //     addActionDisabled = 'disabled';
                //     addActionTooltip = `Item quantity fully consumed. You can't add new`
                //     addActionStyle = 'style="cursor: not-allowed;"'
                // }
                if (dataContext['rev']) {
                    removeActionDisabled = 'disabled';
                    removeActionTooltip = `Already Saved. You can't remove`
                    removeActionStyle = 'style="cursor: not-allowed;"'

                    //  buttonTag += `<button action-button='Inline-Edit' action-view='button' id="r${row}_${traversalpath}_${removeActionLabel}" title="Edit current row" class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true">
                    //  <em  class="icon-mat-create"></em>
                    //  </button>`
                }
                // buttonTag += `<button ${addActionDisabled} ${addActionStyle} action-button='Add' action-view='button' id="r${row}_${traversalpath}_${addActionLabel}" title="${addActionTooltip}" class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true">
                //         <em  class="${addActionIcon}"></em>
                //     </button>`

                buttonTag += `<button ${removeActionDisabled} ${removeActionStyle} action-button='Remove' action-view='button' id="r${row}_${traversalpath}_${removeActionLabel}" title="${removeActionTooltip}" class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true">
                  <em  class="${removeActionIcon}"></em>
              </button>`
                if (dataContext['isFailure'] == true) {
                    buttonTag += `<button ${errorActionDisabled} ${errorActionStyle} action-button='Error' action-view='button' id="r${row}_${traversalpath}_${removeActionLabel}" title="${errorActionTooltip}" class="cs-mat-icononly cs-nomargin mat-icon-button mat-warn dropdown pointer" ng-reflect-color="warn" color="warn" mat-icon-button ng-reflect-disable-ripple="true" style = "color: red";>
            <em  class="${error}"></em>
            </button>`
                }
                buttonTag += '</div>'
                return buttonTag;
            },
            cssClass: 'left-align',
            params: {
                layoutId: layoutId,

                isHiddenEnabled: 'N',
                columnWidth: 0
            },
            onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
                let parentElement = e && e.target && e.target['parentElement'] || undefined;
                let actionView = parentElement && parentElement.getAttribute('action-view') || undefined;
                let actionButton = parentElement && parentElement.getAttribute('action-button') || undefined;
                let dataContext = args['dataContext']
                if (actionView && actionButton && actionView === 'button') {
                    const childObject = this.slickGridUtils.getChildObject(childObjName, childObjectsInfo)
                    if (actionButton === 'Remove') {
                        if (dataContext['rev']) {
                            return;
                        }
                        childObject.angularGridInstance.gridService.deleteItem(dataContext)
                        let index = (childObject.angularGridInstance.slickGrid['cspfmEditableRecordIds'] || []).indexOf(dataContext['id']);
                        if (index > -1) {
                            childObject.angularGridInstance.slickGrid['cspfmEditableRecordIds'].splice(index, 1)
                        }
                        delete(childObject.angularGridInstance.slickGrid['cspfmEditedRecords'] || {})[dataContext['id']]
                    } else if (actionButton === 'Add') {
                        this.addChildData(childObject, objectHierarchy, {
                            childObjName: columns
                        })
                        childObject['slickgridChildDocsArray'] = [...childObject['slickgridChildDocsArray']]
                    } else if (actionButton === 'Inline-Edit') {
                        let angularGrid: AngularGridInstance = childObject['angularGridInstance'];
                        let slickGrid: SlickGrid = childObject['angularGridInstance']['slickGrid'];
                        if (!slickGrid['cspfmEditableRecordIds'].includes(dataContext['id'])) {
                            slickGrid['cspfmEditableRecordIds'].push(dataContext['id'])
                            slickGrid.invalidate()
                            slickGrid.render()
                            angularGrid.resizerService.resizeGrid();
                        }
                    }
                }
                if (actionView && actionButton && actionView === 'button') {
                    if (actionButton !== 'Remove') {
                        this.observableListenerUtils.emit('Parent_validation', {
                            'showConsolidatePopup': false
                        })
                    }
                    if (actionButton === 'Error' && dataContext['isFailure'] == true && dataContext['failureType'] == "conditional_validation") {
                        this.observableListenerUtils.emit('conditional_validation', dataContext)
                    } else if (actionButton === 'Error' && dataContext['isFailure'] == true && dataContext['failureType'] == "Required_Fields_Error") {
                        this.showConsolidatePopup = false;
                        this.observableListenerUtils.emit('Required_Fields_Error', dataContext)

                    } else if (actionButton === 'Error' && dataContext['isFailure'] == true) {
                        this.showConsolidatePopup = false;
                        //  const childObject = this.slickGridUtils.getChildObject(childObjName, childObjectsInfo)
                        let childobjectSet = {};
                        //   childobjectSet['errorRecords'] = childObjectDatas['errorRecords']  
                        //  childobjectSet['displayName'] = childObjectDatas['displayName'] 
                        childobjectSet['dataContext'] = dataContext
                        childobjectSet['row'] = args['row'];
                        this.observableListenerUtils.emit('Fields_Error', childobjectSet)
                    }
                }

            }
        }
        columns.push(lineEntryActionColumn);
        fields.forEach(fieldInfo => {
            let column: Column = this.slickGridUtils.makeSingleColumn(fieldInfo, layoutId, childObjName, childObjectsInfo, formulaConfig);
            // let innerFieldInfo = this.slickGridUtils.getFieldInfo(fieldInfo);
            columns.push(column);
        })
        return columns;
    }

    updateLineModifiedRecordInSlickGrid(angularGridInstance: AngularGridInstance, dataContext) {
        if (!angularGridInstance.slickGrid['cspfmEditedRecords']) {
            angularGridInstance.slickGrid['cspfmEditedRecords'] = {}
        }
        angularGridInstance.slickGrid['cspfmEditedRecords'][dataContext['id']] = dataContext
        if (!angularGridInstance.slickGrid['cspfmEditableRecordIds'].includes(dataContext['id'])) {
            angularGridInstance.slickGrid['cspfmEditableRecordIds'].push(dataContext['id'])
        }
    }

    removeEditedRecords(angularGridInstance: AngularGridInstance) {
        angularGridInstance.slickGrid['cspfmEditedRecords'] = {}
        angularGridInstance.slickGrid['cspfmEditableRecordIds'] = []
        angularGridInstance.slickGrid.invalidate()
        angularGridInstance.slickGrid.render()
        angularGridInstance.resizerService.resizeGrid();
    }
}