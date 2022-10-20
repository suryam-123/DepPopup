/* 
 *   File: cspfmRecordAssociation.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { OnInit, Component, Input, ApplicationRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { appConstant } from "src/core/utils/appConstant";
import { dataProvider } from 'src/core/utils/dataProvider';
import { AngularGridInstance, ExtensionName, FieldType, Filters, OperatorType } from 'angular-slickgrid';
import { CspfmDataFormatter, CspfmActionsFormatter, cspfmUrlDataFormatter, cspfm_data_display } from 'src/core/pipes/cspfm_data_display';
import { cspfmAlertDialog } from '../cspfmAlertDialog/cspfmAlertDialog';
import { cspfmWebAssociationPage } from 'src/core/pages/cspfmWebAssociationPage/cspfmWebAssociationPage';
import { objectTableMapping } from 'src/core/pfmmapping/objectTableMapping';
import { cspfmRecordAssociationUtils } from 'src/core/dynapageutils/cspfmRecordAssociationUtils';
import { SlickgridPopoverService } from 'src/core/services/slickgridPopover.service';
import { appUtility } from 'src/core/utils/appUtility';
import { TranslateService } from '@ngx-translate/core';
import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';

declare var $: any;
declare const window: any;


@Component({
    selector: 'cspfmRecordAssociation',
    templateUrl: './cspfmRecordAssociation.html',
    styleUrls: ['./cspfmRecordAssociation.scss']
})
export class cspfmRecordAssociation implements OnInit {

    constructor(public applicationRef: ApplicationRef, public translateService: TranslateService, public cspfmDataDisplay: cspfm_data_display, public dialog: MatDialog,private appUtility:appUtility,
        public dataProvider: dataProvider, public objectTableMappingObj: objectTableMapping,private cspfmRecordAssociationUtils: cspfmRecordAssociationUtils,public slickGridPopOverService: SlickgridPopoverService,
        private slickgridUtils: cspfmSlickgridUtils) {
    }
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
    public masonryOptions: NgxMasonryOptions = {
        gutter:20,
        columnWidth:50
    }

    public associationObjectsConfiguration = {}
    public gridSearchRowToggle = false;
    public angularGrid: AngularGridInstance;
    public gridObj;
    public gridContainerId = 'cspfm_grid_container_';
    public gridId = 'cspfm_grid_';
    public dropDownAttribute = '#cs-dropdown-';
    public actionId = '';
    public fieldName ='';

    public isChipPopoverShown = false;
    public wf_header_color = ["cs-wf-c-one", "cs-wf-c-two", "cs-wf-c-three", "cs-wf-c-four", "cs-wf-c-five", "cs-wf-c-six", "cs-wf-c-seven", "cs-wf-c-eight", "cs-wf-c-nine"]


    public config:any = {}
    @Input() set setConfig(config: any) {
        this.config = config;
    }
    public associateDoc = {}
    public associateDocTemp = {}
    @Input() set setAssociateDoc(associateDoc: any) {
        this.associateDoc = associateDoc;
        this.associateDocTemp = JSON.parse(JSON.stringify(associateDoc))
    }
    public dataObject = {}
    public objectRootPath ='';
    @Input() set setDataObject(dataObject: any) {
        this.dataObject = dataObject;

        if(!this.dataObject[this.config['fieldName']]) {
            if((this.config['style'] !== "SingleWithMultiple" && this.config['style'] !== "SingleFromMultipleWithSingleStyle1" 
            && this.config['style'] !== "SingleFromMultipleWithSingleStyle2" && this.associationObjectsConfiguration[this.config['fieldName']] 
            && this.associationObjectsConfiguration[this.config['fieldName']].length > 0) 
            || (this.config['style'] === "SingleFromMultipleWithSingleStyle1" || this.config['style'] === "SingleFromMultipleWithSingleStyle2"
            || this.config['style'] === "SingleWithMultiple")) {
                this.clearExistingData()
            }
        } else if (this.associationObjectsConfiguration && this.associationObjectsConfiguration[this.config['fieldName']]
            && this.associationObjectsConfiguration[this.config['fieldName']].length > 0) {
            this.associationObjectsConfiguration[this.config['fieldName']].forEach(element => {
                if (this.dataObject[element['fieldName']] && this.dataObject[element['fieldName']].length === 0 && element['recordsArray'].length > 0) {
                    element['recordsArray'] = []
                    this.config['associationObjectInfo'][element['fieldName']]['selectedRecordId'] = []
                }
            });
        }
    }
    public dataObjectPath;
    @Input() set setDataObjectPath(dataObjectPath: any) {
        this.dataObjectPath = dataObjectPath;
    }
    public layoutName;
    @Input() set setLayoutName(layoutName: any) {
        this.layoutName = layoutName;
    }

    public isAssociationDataRefreshRequired = false;

    @Input() set setDataRefreshRequired(isAssociationDataRefreshRequired: any) {
        this.isAssociationDataRefreshRequired = isAssociationDataRefreshRequired;
        if(this.isAssociationDataRefreshRequired) {
            this.fieldName = this.config['fieldName'];
            this.actionId = 'ACT_' + this.layoutName + '$$' + this.dataObjectPath + '$$' + this.fieldName + '_input';
            if (this.config['style'] === 'SingleWithMultiple') {
                this.dropDownAttribute = this.dropDownAttribute + this.config['layoutId']
            }
            this.formatAndLoadAssociationValues();
        }
    }

    @Output() onCSPFMAssociationChanged: EventEmitter<any> = new EventEmitter();
    public associationCriteriaDependentField = {}

    clearExistingData() {
        if(this.config['style'] === "SingleWithMultiple") {
            this.config['associationObjectInfo'][this.config['associationFieldName']]['selectedRecordId'] = []
            this.primaryChipArray[this.config['associationFieldName']] = []
            this.secondaryChipArray[this.config['associationFieldName']] = []
        } else {
            if(this.associationObjectsConfiguration[this.config['fieldName']] && this.associationObjectsConfiguration[this.config['fieldName']].length > 0) {
                this.associationObjectsConfiguration[this.config['fieldName']].forEach(element => {
                    element['recordsArray'] = []
                    element['isSelected'] = false
                });
            }
            if(this.config['associationMetaMapping'] && this.config['associationMetaMapping'].length > 0) {
                this.config['associationMetaMapping'].forEach(element => {
                    element['isSelected'] = false 
                    this.config['associationObjectInfo'][element['fieldName']]['selectedRecordId'] = []          
                });
            }
            
            this.config['associationFieldName'] = ""
        }
    }

    ngOnInit() {
        this.objectRootPath = this.dataObjectPath.replaceAll('$','_');
        if (!this.isAssociationDataRefreshRequired) {
            this.fieldName = this.config['fieldName'];
            this.actionId = 'ACT_' + this.layoutName + '$$' + this.dataObjectPath + '$$' + this.fieldName + '_input';
            if (this.config['style'] === 'SingleWithMultiple') {
                this.dropDownAttribute = this.dropDownAttribute + this.config['layoutId']
            }
            this.formatAndLoadAssociationValues();
        }
    }

    refreshWaterfallModelData(){
        if (this.masonry !== undefined) {
            this.masonry.reloadItems();
            this.masonry.layout();
        }
    }

    makeColumnDefinition(tableColumnInfo) {
        let columnDefinition = []
        if (!tableColumnInfo || tableColumnInfo.length === 0) {
            return columnDefinition
        }
        tableColumnInfo.forEach(element => {
            let fieldTypeStr;
            let filterObj = {
            };
            let queryParams;
            let objectVal;
            if (element.fieldType === 'LOOKUP' || element.fieldType === "TEXT" ||
                element.fieldType === "CHECKBOX" || element.fieldType === "MULTISELECT" ||
                element.fieldType === "RADIO" || element.fieldType === "URL" ||
                element.fieldType === "FORMULA" || element.fieldType === "DROPDOWN" ||
                element.fieldType === "Rollupsummary") {
                fieldTypeStr = FieldType.string
            } else if (element.fieldType === 'TIMESTAMP') {
                fieldTypeStr = FieldType.dateTime
            } else if (element.fieldType === 'BOOLEAN') {
                fieldTypeStr = FieldType.boolean
            } else if (element.fieldType === 'NUMBER' || element.fieldType === "CURRENCY" ||
                element.fieldType.toUpperCase === "AUTONUMBER") {
                fieldTypeStr = FieldType.number
            } else if (element.fieldType === 'ACTION') {
                fieldTypeStr = FieldType.unknown
            } else if (element.fieldType === 'DATE') {
                fieldTypeStr = FieldType.date
            }
            if (element.fieldType === "RADIO" || element.fieldType === "DROPDOWN") {
                filterObj = {
                    collection: this.getLabelValue(element.mappingDetails),
                    model: Filters.multipleSelect
                };
            } else if (element.fieldType === "BOOLEAN") {
                filterObj = {
                    collection: this.getLabelValue({ true: "true", false: "false" }),
                    model: Filters.multipleSelect
                }
            } else if (element.fieldType === "DATE" || element.fieldType === "TIMESTAMP") {
                filterObj = {
                    model: Filters.compoundDate,
                    operator: OperatorType.rangeInclusive
                }
            } else if (element.fieldType === "MULTISELECT" || element.fieldType === "CHECKBOX") {
                filterObj = {
                    collection: this.getLabelValue(element.mappingDetails),
                    model: Filters.multipleSelect,
                    operator: OperatorType.inContains
                }
            } else {
                filterObj = {
                    model: Filters.compoundInput
                }
            }
            if (element.fieldType === "MULTISELECT" || element.fieldType === "CHECKBOX" ||
                element.fieldType === "DROPDOWN" || element.fieldType === "DATE" ||
                element.fieldType === "TIMESTAMP" || element.fieldType === "RADIO") {
                queryParams = element.prop + appConstant['customFieldSuffix']['slickgrid']
            }
            let fieldType = this.slickGridPopOverService.getFieldType(element);
            objectVal = {
                id: element.prop,
                nameKey:this.slickgridUtils.convertSplCharToEntities(element.label,'toEntity'),
                field: element.prop,
                toolTip:this.translateService.instant(element.label),
                minWidth: 100,
                type: fieldTypeStr,
                formatter: element.fieldType === 'ACTION' ? CspfmActionsFormatter : fieldType === 'URL' ? cspfmUrlDataFormatter : CspfmDataFormatter,
                params: {
                    pipe: this.cspfmDataDisplay,
                    fieldInfo: element,
                    actionInfo: element.fieldType === 'ACTION' ? element['actionInfo'] : '',
                    layoutId: this.config['layoutId'] + '_rec',
                    layoutName: this.layoutName + '_rec'
                },
                filterable: true,
                sortable: true,
                filter: filterObj,
                onCellClick: (mouseEvent, args) => {
                    element.fieldType === 'ACTION' ? this.onActionCellClick(mouseEvent, args) : fieldType === 'URL' ? this.cspfmRecordAssociationUtils.onActionCellClickForAssociation(mouseEvent, args, this.config['layoutId'] + '_rec') : '';
                }
            }
            if (queryParams) {
                objectVal['queryField'] = queryParams
            }
            columnDefinition.push(objectVal);
        });
        return columnDefinition;
    }

    onActionCellClick(mouseEvent, args) {
        console.log("Delete icon clicked")

        let parentElement = mouseEvent && mouseEvent.target && mouseEvent.target['parentElement'] || undefined;
        let actionView = parentElement && parentElement.getAttribute('action-view') || undefined;
        let actionInfoValue = parentElement && parentElement.getAttribute('action-info') || undefined;
        if (actionView && actionInfoValue && actionView === 'button') {
            let selectedAssociationConfiguration = this.associationObjectsConfiguration[this.config['fieldName']]
            let selectedObjId = args['dataContext']['type']
            selectedAssociationConfiguration.forEach(configObj => {
                if (this.objectTableMappingObj.mappingDetail[configObj['objectName']] === selectedObjId) {
                    if (this.config['style'] !== "MultipleFromMultipleWithSingleList" && this.config['associationObjectInfo'][configObj['fieldName']]["limitation"]["minCount"] >= this.dataObject[configObj['fieldName']].length) {
                        this.recordDiscardConfirmAlert('Minimum ' + this.config['associationObjectInfo'][configObj['fieldName']]["limitation"]["minCount"] +' records should be there');
                        return
                    }

                    configObj['angularGridInstance'].dataView.beginUpdate();
                    configObj['angularGridInstance'].dataView.deleteItem(args.dataContext.id);
                    configObj['angularGridInstance'].dataView.endUpdate();
                    var indexOfRec = this.associateDoc[this.config['objectId']][configObj['fieldName']].findIndex(
                        (element) => element['association_id'] === args.dataContext.id);

                    if (this.checkAssociationRecordSaved(configObj['fieldName'], args.dataContext.id)) {
                        this.associateDoc[this.config['objectId']][configObj['fieldName']][indexOfRec]['isActive'] = false
                    } else {
                        this.associateDoc[this.config['objectId']][configObj['fieldName']].splice(indexOfRec, 1)
                    }
                    if (this.config['associationObjectInfo'][configObj['fieldName']]['selectedRecordId']) {
                        this.config['associationObjectInfo'][configObj['fieldName']]['selectedRecordId'].splice(args['row'], 1);
                    }
                    configObj['angularGridInstance'].resizerService.resizeGrid();
                    return;
                }
            });
            if(this.config['style'] === 'MultipleFromMultipleWithSingleList') {
                this.onCSPFMAssociationChanged.emit();
            }
        }
    }

    checkAssociationRecordSaved(associationFieldName, selectedRecordId) {
        if (this.associateDocTemp[this.config['objectId']] && this.associateDocTemp[this.config['objectId']][associationFieldName] &&this.associateDocTemp[this.config['objectId']][associationFieldName].length > 0) {
            var index = this.associateDocTemp[this.config['objectId']][associationFieldName].findIndex(
                (element) => element['association_id'] === selectedRecordId);

            if (index !== undefined && index >= 0) {
                return true
            }
            return false
        }
        return false
    }

    angularGridReady(angularGrid: AngularGridInstance, configObject) {
        configObject['angularGridInstance'] = angularGrid
        configObject['gridMenuExtension'] = angularGrid.extensionService.getExtensionByName(ExtensionName.gridMenu)
        configObject['angularGridInstance'].resizerService.resizeGrid();
        var slickgridMenu = document.getElementsByClassName("slick-gridmenu-button");
        if (slickgridMenu && slickgridMenu.length > 0) {
            for (let i = 0; i < slickgridMenu.length; i++) {
                slickgridMenu[i]['title'] = "Grid menu";
            }
        }

        var slickgridHeaderMenu = document.getElementsByClassName("slick-header-menubutton");
        console.log("slickgridHeaderMenu", slickgridHeaderMenu);

        if (slickgridHeaderMenu && slickgridHeaderMenu.length > 0) {
            for (let i = 0; i < slickgridHeaderMenu.length; i++) {
                slickgridHeaderMenu[i]['title'] = "Header menu";
            }
        }

        angularGrid.filterService.onSearchChange.subscribe((input) => { console.log("input :", input) });
        configObject['gridObj'] = angularGrid.slickGrid;
        configObject['gridObj'].setHeaderRowVisibility(false);
        configObject['gridObj']['cspfm_grid_custom_data'] = {
            "page_title_key": "institute_d_m_hl_list.Layout.institute_d_m_hl_list",
            "object_display_name": configObject['displayName'],
            "angular_grid_excel_export_service_instance": angularGrid.excelExportService,
            "angular_grid_export_service_instance": angularGrid.exportService
        }

        if (configObject['gridObj'].getCanvasWidth() < window.innerWidth) {
            var gridOption = configObject['gridOptionInfo']
            gridOption['enableAutoSizeColumns'] = true
            gridOption['autoFitColumnsOnFirstLoad'] = true
            configObject['gridObj'].setOptions(gridOption)
        }
    }

    toggleGridSearchRow(configObject) {
        this.gridSearchRowToggle = !this.gridSearchRowToggle
        if (!configObject['gridObj'].getOptions().showHeaderRow) {
            configObject['gridObj'].setHeaderRowVisibility(true);
            const filterCls = document.getElementsByClassName('search-filter')
        } else {
            configObject['gridObj'].setHeaderRowVisibility(false);
        }
    }

    toggleGridMenu(event, configObject) {
        let onScrollEvent;
        let onMenuCloseSubscribtion;
        onScrollEvent = () => {
            $(document).find(".slick-gridmenu:visible").find(".cs-display-none.pinpoint").trigger("click");
        }
        if (configObject['angularGridInstance']) {
            
            let gridMenuInstance = configObject['angularGridInstance'].extensionService.getSlickgridAddonInstance(ExtensionName.gridMenu);
            let onMenuCloseFunction = (e) =>{
                $(".cs-mat-main-content").off('scroll', onScrollEvent);
                gridMenuInstance.onMenuClose.unsubscribe(onMenuCloseFunction);
            }
            onMenuCloseSubscribtion = gridMenuInstance.onMenuClose.subscribe(onMenuCloseFunction)  
            $(".cs-mat-main-content").on('scroll', onScrollEvent);
            gridMenuInstance.showGridMenu(event);
        }

        const posit = event.currentTarget.getBoundingClientRect()
        let window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var slick_grid_cls = document.getElementsByClassName('slick-gridmenu');
        Array.prototype.forEach.call(slick_grid_cls, function (el) {
            console.log(el);
            if (el.style.display !== 'none') {
                console.log(el.classList);
                let top = posit.top + 27
                let left = posit.left
                let maxHeight = (window_height - (posit.top + 30)) - 50
                document.getElementsByClassName(el.classList)[0].setAttribute("style", ` top: ${top}px!important;left: ${left}px!important;max-height: ${maxHeight}px;`);
            }
        });
    }

    getLabelValue(inputJson: { [key: string]: string }): Array<{ label: string, value: string }> {
        var resultArray = [];
        Object.keys(inputJson).forEach(key => {
             resultArray.push({
                 value: inputJson[key], 
                 label: inputJson[key] });
                 })
        return resultArray;
    }

    formatAndLoadAssociationValues() {
        let selectedRecordId = []

        if (this.config['style'] === 'SingleWithMultiple' || this.config['style'] === 'SingleFromMultipleWithSingleStyle1'
            || this.config['style'] === 'SingleFromMultipleWithSingleStyle2' || this.config['style'] === 'SingleFromMultipleWithMultipleChip'
            || this.config['style'] === 'SingleFromMultipleWithMultipleList') {
            if (this.config['associationMetaMapping']) {
                this.config['associationMetaMapping'].forEach(element => {
                    if (this.dataObject[this.config['fieldName']] === element['objectName']) {
                        this.config['associationFieldName'] = element['fieldName']
                        element['isSelected'] = true;
                    }
                });
            }
            if (this.dataObject[this.config['associationFieldName']] && this.dataObject[this.config['associationFieldName']].length > 0) {
                this.dataObject[this.config['associationFieldName']].forEach(element => {
                    selectedRecordId.push(element['id'])
                });
                this.config['associationObjectInfo'][this.config['associationFieldName']]['selectedRecordId'] = selectedRecordId
            }

            if (this.config['style'] === 'SingleFromMultipleWithMultipleList' || this.config['style'] === 'SingleFromMultipleWithMultipleChip') {
                this.makeAssociationAdditionalConfigurationForSingleObjectSelection(this.config['associationFieldName']);
            }
        }

        if (this.config['style'] === 'MultipleFromMultipleWithMultipleWaterfall' || this.config['style'] === 'MultipleFromMultipleWithSingleChip'
            || this.config['style'] === 'MultipleFromMultipleWithMultipleChip' || this.config['style'] === 'MultipleFromMultipleWithMultipleList'
            || this.config['style'] === 'MultipleFromMultipleWithSingleList' || this.config['style'] === 'MultipleFromMultipleWithMultipleTab'
            || this.config['style'] === 'MultipleFromMultipleWithSingleTab') {
            if (this.config['associationMetaMapping']) {
                this.config['associationMetaMapping'].forEach(element => {
                    if (this.dataObject[this.config['fieldName']] && this.dataObject[this.config['fieldName']].includes(element['objectName'])) {
                        element['isSelected'] = true;

                        if (this.dataObject[element['fieldName']] && this.dataObject[element['fieldName']].length > 0) {
                            this.dataObject[element['fieldName']].forEach(elem => {
                                selectedRecordId.push(elem['id'])
                            });
                            this.config['associationObjectInfo'][element['fieldName']]['selectedRecordId'] = selectedRecordId
                        }
                    }
                });
            }
            this.makeAssociationAdditionalConfigurationForMultiObjectSelection();
        }
    }

    chooseAssociationRecords(associateFieldName, currentObjectId) {
        let result;
        if (this.config['associationObjectInfo'][associateFieldName]['criteriaConfig'] && Object.keys(this.config['associationObjectInfo'][associateFieldName]['criteriaConfig']).length > 0) {
            result = this.cspfmRecordAssociationUtils.makeQueryForCriteriaLookup(this.dataObject, this.config['associationObjectInfo'][associateFieldName]['criteriaConfig']['criteriaValidationFields'], this.config['associationObjectInfo'][associateFieldName]['criteriaConfig']['criteriaQueryConfig']);
            this.associationCriteriaDependentField = {};
            this.associationCriteriaDependentField['showConsolidatePopup'] = false;
            if (result['criteriaRestriction']) {
                this.associationCriteriaDependentField['validationFailureSet'] = result['validationFailureSet']
                this.associationCriteriaDependentField['objectId'] = result['lookupCriteriaObjectId']
                this.associationCriteriaDependentField['messageType'] = "AssociationCriteriaError"
                this.associationCriteriaDependentField['showConsolidatePopup'] = true;
                this.onCSPFMAssociationChanged.emit(this.associationCriteriaDependentField);
                
                return
            }
        }
        console.log("lookupInput", result)

        const dialogConfig = new MatDialogConfig()
        dialogConfig.data = {
            serviceObject: this.dataProvider.getDbServiceProvider(appConstant.couchDBStaticName),
            parentPage: this,
            dataSource: appConstant.couchDBStaticName,
            associationInfo: this.config['associationObjectInfo'][associateFieldName],
            criteriaConfig: result,
            currentObjectId: currentObjectId
        };
        dialogConfig.panelClass = 'custom-dialog-container'
        this.dialog.open(cspfmWebAssociationPage, dialogConfig);
    }

    associateMultiObjectSelectionChange(value) {
        let existingSelectedObjects = []
        this.config['associationMetaMapping'].forEach(element => {
            if (element['isSelected']) {
                existingSelectedObjects.push(element['objectName'])
            }
        });
        if (existingSelectedObjects.length > 0) {
            if (value.length > 0) {
                if (value.length < existingSelectedObjects.length) {
                    this.showResetConfirmationAlert(value, 'multiple');
                } else {
                    this.objectResetAndSelectForMultiSelect(value);
                }
            } else {
                this.showResetConfirmationAlert(value, 'multiple');
            }
        } else {
            this.objectResetAndSelectForMultiSelect(value);
        }
    }

    associateSingleObjectSelectionChange(value) {

        let isFirstChange = true
        this.config['associationMetaMapping'].forEach(element => {
            if (element['isSelected']) {
                isFirstChange = false;
            }
        });
        if (isFirstChange) {
            this.objectResetAndSelectForSingleSelect(value);
        } else {
            this.showResetConfirmationAlert(value, 'single');
        }
    }

    selectionChange(event, selectedObject) {
        selectedObject['angularGridInstance'].paginationService.changeItemPerPage(Number(event.value))
    }

    navigationChange(event, selectedObject) {
        if (event === 'next') {
            selectedObject['angularGridInstance'].paginationService.goToNextPage()
        } else {
            selectedObject['angularGridInstance'].paginationService.goToPreviousPage()
        }
    }

    take_position(e, selectedObject?) {
        if (selectedObject && selectedObject['isLoading']) {
            this.appUtility.presentToast("Another process is running, please wait");
            return
        }
        var offsetLeft = e.srcElement.parentElement.offsetLeft;
        var offsetTop = e.srcElement.parentElement.offsetTop;
        setTimeout(() => {
            document.getElementsByClassName('popover-content')[0].setAttribute("style", `top: ${offsetTop + 40}px; left: ${offsetLeft}px`);
        }, 100)
        document.getElementsByClassName("cdk-overlay-pane")[0].getElementsByClassName("mat-select-panel-wrap")[0].getElementsByClassName("mat-select-panel")[0].classList.add("cs-custom-scroll");
    }

    getGridOptions(objectName) {
        return {
            enableAutoSizeColumns: false,
            autoFitColumnsOnFirstLoad: false,
            autoCommitEdit: true,
            autoEdit: false,
            enableCellNavigation: true,
            editable: true,
            enableAutoResize: true,
            enableSorting: true,
            enableFiltering: true,
            enableExcelExport: true,
            enableExport: true,
            enablePagination: true,
            pagination: {  // Pagination UI - Item per page select options for default pagintation
                pageSizes: [10, 15, 20, 25, 50, 75, 100],
                pageSize: 25
            },
            gridMenu: {
                hideExportExcelCommand: true,
                hideExportCsvCommand: true,
                customItems: [{
                    command: "Trigger-to-close",
                    titleKey: "Trigger to close",
                    cssClass: 'cs-display-none pinpoint',
                }]
            },
            enableAutoTooltip: true,
            autoTooltipOptions: {
                enableForCells: true,
                enableForHeaderCells: true,
                maxToolTipLength: 1000
            },
            headerMenu: {
                hideColumnHideCommand: true,
                onAfterMenuShow: (e, args) => {
                    let getSlickGridContainerHeight = args.grid.getContainerNode().offsetHeight-50;
                    let slickGridHeaderMenuButton = document.getElementsByClassName('slick-header-menu');
                    let setHeight = slickGridHeaderMenuButton[0].getAttribute("style") + " max-height: " +   getSlickGridContainerHeight + "px";
                    slickGridHeaderMenuButton[0].setAttribute('style',setHeight) ;
                    slickGridHeaderMenuButton[0].classList.add('cs-custom-scroll');
                }
                  
            },
            autoResize: {
                containerId: this.gridContainerId + this.config['fieldName'] + '_' + objectName,
                calculateAvailableSizeBy: 'container'
            },
            exportOptions: {
                exportWithFormatter: true
            },
            excelExportOptions: {
                exportWithFormatter: true,
            },
            enableTranslate: true,
            enableDraggableGrouping: false,
            createPreHeaderPanel: false,
            showPreHeaderPanel: false,
            preHeaderPanelHeight: 40,
            rowHeight: 40,
            headerRowHeight: 40,
            enableEmptyDataWarningMessage: false
        }
    }

    makeAssociationAdditionalConfigurationForMultiObjectSelection() {

        let selectedAssociationObjFieldKeys = Object.keys(this.config['associationObjectInfo'])

        for (let i = 0; i < selectedAssociationObjFieldKeys.length; i++) {
            let associationObjField = selectedAssociationObjFieldKeys[i];
            const associationObject = {
                displayName: this.config['associationObjectInfo'][associationObjField]['objectDisplayName'],
                objectName: this.config['associationObjectInfo'][associationObjField]['objectName'],
                fieldName: associationObjField,
                resultColumn: this.config['associationObjectInfo'][associationObjField]['resultColumn'],
                recordsArray: this.dataObject[associationObjField] ? this.dataObject[associationObjField] : [],
                gridOptionInfo: this.getGridOptions(this.config['associationObjectInfo'][associationObjField]['objectName']),
                angularGridInstance: this.angularGrid,
                additionalInfo: {
                    tempDataArray: [],
                    gridSearchRowToggle: false
                },
                tableColumnInfo: this.config['associationObjectInfo'][associationObjField]['tableColumnInfo'],
                columnDefinitions: this.makeColumnDefinition(this.config['associationObjectInfo'][associationObjField]['tableColumnInfo']),
                isSelected: this.dataObject[this.config['fieldName']] && this.dataObject[this.config['fieldName']].includes(this.config['associationObjectInfo'][associationObjField]['objectName']) ? true : false
            };

            if(!this.associationObjectsConfiguration[this.config['fieldName']]) {
                this.associationObjectsConfiguration[this.config['fieldName']] = []
            }
            const associationIndex = this.associationObjectsConfiguration[this.config['fieldName']].findIndex(e => e.fieldName === associationObject.fieldName)
            if (associationIndex !== -1) {
                this.associationObjectsConfiguration[this.config['fieldName']][associationIndex] = associationObject
            }
            else {
                this.associationObjectsConfiguration[this.config['fieldName']].push(associationObject)
            }
        }
    }

    makeAssociationAdditionalConfigurationForSingleObjectSelection(associationObjField) {
        const associationObject = {
            displayName: associationObjField ? this.config['associationObjectInfo'][associationObjField]['objectDisplayName'] : "",
            objectName: associationObjField ? this.config['associationObjectInfo'][associationObjField]['objectName'] : "",
            fieldName: associationObjField,
            resultColumn: associationObjField ? this.config['associationObjectInfo'][associationObjField]['resultColumn'] : "",
            recordsArray: associationObjField ? this.dataObject[associationObjField] : [],
            gridOptionInfo: associationObjField ? this.getGridOptions(this.config['associationObjectInfo'][associationObjField]['objectName']) : {},
            angularGridInstance: this.angularGrid,
            additionalInfo: {
                tempDataArray: [],
                gridSearchRowToggle: false
            },
            columnDefinitions: associationObjField ? this.makeColumnDefinition(this.config['associationObjectInfo'][this.config['associationFieldName']]['tableColumnInfo']) : []
        };
        this.associationObjectsConfiguration[this.config['fieldName']] = []
        this.associationObjectsConfiguration[this.config['fieldName']].push(associationObject)
    }

    multiLookupResponse(associationReferenceKey, selectedValues: Array<any>, currentObjectId) {
        if (!this.associateDoc[currentObjectId]) {
            let obj = {}
            this.associateDoc[currentObjectId] = obj;
        }
        if (selectedValues && selectedValues.length > 0) {
            let selectedRecordIds = []
            var selectedRecordIdsObjArray = []

            if (!this.associateDocTemp[currentObjectId] || !this.associateDocTemp[currentObjectId][associationReferenceKey['fieldName']] || this.associateDoc[currentObjectId][associationReferenceKey['fieldName']].length === 0) {
                selectedValues.forEach(selectedValue => {
                    selectedRecordIdsObjArray.push({ 'association_id': selectedValue['id'], 'association_object_id': selectedValue['type'], 'isActive': true })
                    selectedRecordIds.push(selectedValue['id'])
                })
            } else {
                this.associateDoc[currentObjectId][associationReferenceKey['fieldName']].forEach(selectedRecObj => {
                    if (this.checkAssociationRecordSaved(associationReferenceKey['fieldName'], selectedRecObj['association_id'])) {
                        selectedRecObj['isActive'] = false
                        selectedRecordIdsObjArray.push(selectedRecObj)
                    }
                })

                selectedValues.forEach(selectedValue => {
                    var indexOfRec = selectedRecordIdsObjArray.findIndex(
                        (element) => element['association_id'] === selectedValue['id']);
                    if (indexOfRec < 0) {
                        selectedRecordIdsObjArray.push({ 'association_id': selectedValue['id'], 'association_object_id': selectedValue['type'], 'isActive': true })
                    } else {
                        selectedRecordIdsObjArray[indexOfRec]['isActive'] = true
                    }

                    selectedRecordIds.push(selectedValue['id'])
                })
            }

            this.associateDoc[currentObjectId][associationReferenceKey['fieldName']] = selectedRecordIdsObjArray;

            this.dataObject[associationReferenceKey['fieldName']] = selectedValues;

            this.config['associationObjectInfo'][associationReferenceKey['fieldName']]['selectedRecordId'] = JSON.parse(JSON.stringify(selectedRecordIds));

            if (this.associationObjectsConfiguration[this.config['fieldName']]) {
                if (this.config['style'] === 'SingleFromMultipleWithMultipleList') {
                    this.associationObjectsConfiguration[this.config['fieldName']][0]['recordsArray'] = selectedValues;
                }
                if (this.config['style'] === 'MultipleFromMultipleWithMultipleWaterfall' || this.config['style'] === 'MultipleFromMultipleWithSingleChip' || this.config['style'] === 'MultipleFromMultipleWithMultipleChip' || this.config['style'] === 'MultipleFromMultipleWithMultipleList' || this.config['style'] === 'MultipleFromMultipleWithSingleList' || this.config['style'] === 'MultipleFromMultipleWithMultipleTab' || this.config['style'] === 'MultipleFromMultipleWithSingleTab') {
                    this.associationObjectsConfiguration[this.config['fieldName']].forEach(element => {
                        if (associationReferenceKey['fieldName'] === element['fieldName']) {
                            element['recordsArray'] = selectedValues;
                        }
                    });
                }
            }

            if (this.config['style'] === 'SingleWithMultiple') {
                this.dataObject[this.config['fieldName']] = associationReferenceKey['objectName']
                this.handleMultipleRecordsChipStyle(associationReferenceKey, selectedValues, this.config['layoutId'], this.config['objectId']);
            }
            if(this.config['style'] === 'SingleFromMultipleWithSingleStyle1' || this.config['style'] === 'SingleFromMultipleWithSingleStyle2' || this.config['style'] === 'MultipleFromMultipleWithSingleChip' || this.config['style'] === 'MultipleFromMultipleWithSingleList' || this.config['style'] === 'MultipleFromMultipleWithSingleTab' ) {
                this.onCSPFMAssociationChanged.emit();
            }
        } else {
            this.primaryChipArray[associationReferenceKey['fieldName']] = []
            this.secondaryChipArray[associationReferenceKey['fieldName']] = []

            this.dataObject[associationReferenceKey['fieldName']] = null;

            if (!this.associateDocTemp[currentObjectId] || !this.associateDocTemp[currentObjectId][associationReferenceKey['fieldName']]
                || this.associateDocTemp[currentObjectId][associationReferenceKey['fieldName']].length === 0) {
                this.associateDoc[currentObjectId][associationReferenceKey['fieldName']] = null
            } else {
                var selectedRecordIdsObjArray = []
                this.associateDoc[currentObjectId][associationReferenceKey['fieldName']].forEach(selectedRecObj => {
                    if (this.checkAssociationRecordSaved(associationReferenceKey['fieldName'], selectedRecObj['association_id'])) {
                        selectedRecObj['isActive'] = false
                    } else {
                        var indexOfRec = this.associateDoc[currentObjectId][associationReferenceKey['fieldName']].findIndex(
                            (element) => element['association_id'] === selectedRecObj['id']);
                        if (indexOfRec > -1) {
                            this.associateDoc[currentObjectId][associationReferenceKey['fieldName']].splice(indexOfRec, 1)
                        }
                    }
                })
            }
            this.config['associationObjectInfo'][associationReferenceKey['fieldName']]['selectedRecordId'] = null;
            if (this.associationObjectsConfiguration[this.config['fieldName']]) {
                if (this.config['style'] === 'SingleFromMultipleWithMultipleList') {
                    this.associationObjectsConfiguration[this.config['fieldName']][0]['recordsArray'] = selectedValues;
                }
                if (this.config['style'] === 'MultipleFromMultipleWithMultipleWaterfall' || this.config['style'] === 'MultipleFromMultipleWithSingleChip' || this.config['style'] === 'MultipleFromMultipleWithMultipleChip' || this.config['style'] === 'MultipleFromMultipleWithMultipleList' || this.config['style'] === 'MultipleFromMultipleWithSingleList' || this.config['style'] === 'MultipleFromMultipleWithMultipleTab' || this.config['style'] === 'MultipleFromMultipleWithSingleTab') {
                    this.associationObjectsConfiguration[this.config['fieldName']].forEach(element => {
                        if (associationReferenceKey['fieldName'] === element['fieldName']) {
                            element['recordsArray'] = selectedValues;
                        }
                    });
                }
            }
        }
        if(this.config['style'] === 'MultipleFromMultipleWithMultipleWaterfall'){
            this.masonry.reloadItems();
            this.masonry.layout()
        }

    }

    tabChangeMethod(event) {
        for (let i = 0; i < this.associationObjectsConfiguration[this.config['fieldName']].length; i++) {
            if (this.associationObjectsConfiguration[this.config['fieldName']][i]['displayName'] === event['tabTitle']) {
                this.associationObjectsConfiguration[this.config['fieldName']][i]['angularGridInstance'].resizerService.resizeGrid();
                break;
            }
        }
    }

    deleteItem(index, object?) {
        if (this.config['style'] === 'SingleWithMultiple') {
            if (this.config['associationObjectInfo'][this.config['associationFieldName']]["limitation"]["minCount"] >= this.dataObject[this.config['associationFieldName']].length) {
                this.recordDiscardConfirmAlert('Minimum ' + this.config['associationObjectInfo'][this.config['associationFieldName']]["limitation"]["minCount"] + ' records should be there');
                return
            }
            if (this.dataObject[this.config['associationFieldName']].length > 0) {
                var indexOfRec = this.dataObject[this.config['associationFieldName']].findIndex(
                    (element) => element['id'] === object['id']);
                this.dataObject[this.config['associationFieldName']].splice(indexOfRec, 1);

                var indexOfAssociateRec = this.associateDoc[this.config['objectId']][this.config['associationFieldName']].findIndex(
                    (element) => element['association_id'] === object['id']);
                if (this.checkAssociationRecordSaved(this.config['associationFieldName'], object['id'])) {
                    this.associateDoc[this.config['objectId']][this.config['associationFieldName']][indexOfAssociateRec]['isActive'] = false
                } else {
                    this.associateDoc[this.config['objectId']][this.config['associationFieldName']].splice(indexOfAssociateRec, 1);
                }
                if (this.config['associationObjectInfo'][this.config['associationFieldName']]['selectedRecordId']) {
                    this.config['associationObjectInfo'][this.config['associationFieldName']]['selectedRecordId'].splice(indexOfRec, 1);
                }

                this.handleMultipleRecordsChipStyle(this.config['associationObjectInfo'][this.config['associationFieldName']], this.dataObject[this.config['associationFieldName']], this.config['layoutId'], this.config['objectId'])
            }
        } else if (this.config['style'] === 'SingleFromMultipleWithSingleStyle1'
            || this.config['style'] === 'SingleFromMultipleWithSingleStyle2' || this.config['style'] === 'SingleFromMultipleWithMultipleChip') {
            if (this.dataObject[this.config['associationFieldName']].length > 0) {
                if (this.config['style'] === 'SingleFromMultipleWithMultipleChip' && this.config['associationObjectInfo'][this.config['associationFieldName']]["limitation"]["minCount"] >= this.dataObject[this.config['associationFieldName']].length) {
                    this.recordDiscardConfirmAlert('Minimum ' + this.config['associationObjectInfo'][this.config['associationFieldName']]["limitation"]["minCount"] +' records should be there');              
                    return
                }
                this.dataObject[this.config['associationFieldName']].splice(index, 1);

                var indexOfAssociateRec = this.associateDoc[this.config['objectId']][this.config['associationFieldName']].findIndex(
                    (element) => element['association_id'] === object['id']);
                if (this.checkAssociationRecordSaved(this.config['associationFieldName'], object['id'])) {
                    this.associateDoc[this.config['objectId']][this.config['associationFieldName']][indexOfAssociateRec]['isActive'] = false
                } else {
                    this.associateDoc[this.config['objectId']][this.config['associationFieldName']].splice(indexOfAssociateRec, 1);
                }
                if (this.config['associationObjectInfo'][this.config['associationFieldName']]['selectedRecordId']) {
                    this.config['associationObjectInfo'][this.config['associationFieldName']]['selectedRecordId'].splice(index, 1);
                }
            }
        } else if (this.config['style'] === 'MultipleFromMultipleWithSingleChip' || this.config['style'] === 'MultipleFromMultipleWithMultipleChip'
            || this.config['style'] === 'MultipleFromMultipleWithMultipleWaterfall') {
            if (object['recordsArray'].length > 0) {
                if (this.config['style'] === 'MultipleFromMultipleWithMultipleChip' && this.config['associationObjectInfo'][object['fieldName']]["limitation"]["minCount"] >= this.dataObject[object['fieldName']].length) {
                    this.recordDiscardConfirmAlert('Minimum ' + this.config['associationObjectInfo'][object['fieldName']]["limitation"]["minCount"] +' records should be there');              
                    return
                }
                object['recordsArray'].splice(index, 1);
                var indexOfAssociateRec = this.associateDoc[this.config['objectId']][object['fieldName']].findIndex(
                    (element) => element['association_id'] === object['id']);
                if (this.checkAssociationRecordSaved(object['fieldName'], object['id'])) {
                    this.associateDoc[this.config['objectId']][object['fieldName']][indexOfAssociateRec]['isActive'] = false
                } else {
                    this.associateDoc[this.config['objectId']][object['fieldName']].splice(indexOfAssociateRec, 1)
                }

                if (this.config['associationObjectInfo'][object['fieldName']]['selectedRecordId']) {
                    this.config['associationObjectInfo'][object['fieldName']]['selectedRecordId'].splice(index, 1);
                }
                if(this.config['style'] === 'MultipleFromMultipleWithMultipleWaterfall'){
                    this.masonry.reloadItems();
                    this.masonry.layout()
                }
            }
        }
        if(this.config['style'] === 'SingleFromMultipleWithSingleStyle1' || this.config['style'] === 'SingleFromMultipleWithSingleStyle2' || this.config['style'] === 'MultipleFromMultipleWithSingleChip' || this.config['style'] === 'MultipleFromMultipleWithSingleList' || this.config['style'] === 'MultipleFromMultipleWithSingleTab' ) {
            this.onCSPFMAssociationChanged.emit();
        }
    }

    deleteAllItems(object?) {
        if (this.config['style'] === 'SingleWithMultiple' || this.config['style'] === 'SingleFromMultipleWithSingleStyle1'
            || this.config['style'] === 'SingleFromMultipleWithSingleStyle2' || this.config['style'] === 'SingleFromMultipleWithMultipleChip') {
            if (this.dataObject[this.config['associationFieldName']].length > 0) {
                this.dataObject[this.config['associationFieldName']] = []

                if (!this.associateDocTemp[this.config['objectId']] || !this.associateDocTemp[this.config['objectId']][this.config['associationFieldName']]
                    || this.associateDocTemp[this.config['objectId']][this.config['associationFieldName']].length === 0) {
                    this.associateDoc[this.config['objectId']][this.config['associationFieldName']] = []
                } else {
                    let recordObjArray = JSON.parse(JSON.stringify(this.associateDoc[this.config['objectId']][this.config['associationFieldName']]))
                    this.associateDoc[this.config['objectId']][this.config['associationFieldName']].forEach((element, index) => {
                        if (this.checkAssociationRecordSaved(this.config['associationFieldName'], element['association_id'])) {
                            recordObjArray[index]['isActive'] = false
                        } else {
                            recordObjArray.splice(index, 1)
                        }
                    });
                    this.associateDoc[this.config['objectId']][this.config['associationFieldName']] = recordObjArray
                }

                if (this.config['associationObjectInfo'][this.config['associationFieldName']]['selectedRecordId']) {
                    this.config['associationObjectInfo'][this.config['associationFieldName']]['selectedRecordId'] = []
                }
            }
        } else {
            if (object) {
                this.dataObject[object['fieldName']] = []

                if (!this.associateDocTemp[this.config['objectId']] || !this.associateDocTemp[this.config['objectId']][object['fieldName']]
                    || this.associateDocTemp[this.config['objectId']][object['fieldName']].length === 0) {
                    this.associateDoc[this.config['objectId']][object['fieldName']] = []
                } else {
                    let recordObjArray = JSON.parse(JSON.stringify(this.associateDoc[this.config['objectId']][object['fieldName']]))
                    this.associateDoc[this.config['objectId']][object['fieldName']].forEach((element, index) => {
                        if (this.checkAssociationRecordSaved(object['fieldName'], element['association_id'])) {
                            recordObjArray[index]['isActive'] = false
                        } else {
                            recordObjArray.splice(index, 1)
                        }
                    });
                    this.associateDoc[this.config['objectId']][object['fieldName']] = recordObjArray
                }

                object['recordsArray'] = []
                if (this.config['associationObjectInfo'][object['fieldName']]['selectedRecordId']) {
                    this.config['associationObjectInfo'][object['fieldName']]['selectedRecordId'] = []
                }
                if(this.config['style'] === 'MultipleFromMultipleWithMultipleWaterfall'){
                    this.masonry.reloadItems();
                    this.masonry.layout()
                }
            }
        }
    }

    showResetConfirmationAlert(selectedObject, selectionType) {
        const dialogConfig = new MatDialogConfig()

        dialogConfig.data = {
            title: selectionType === 'single' ? 'Are you sure want to switch the object ?' : 'Are you sure want to remove the object ?',
            buttonInfo: [
                {
                    "name": "No",
                    "handler": () => {
                        if (selectionType === 'single') {
                            this.config['associationMetaMapping'].forEach(element => {
                                if (element['isSelected']) {
                                    this.dataObject[this.config['fieldName']] = element['objectName']
                                }
                            })
                        } else {
                            let selectedValue = []
                            this.config['associationMetaMapping'].forEach(element => {
                                if (element['isSelected']) {
                                    selectedValue.push(element['objectName'])
                                }
                            })
                            this.dataObject[this.config['fieldName']] = selectedValue
                        }
                    }
                },
                {
                    "name": "Yes",
                    "handler": () => {
                        console.log("Handler called")
                        if (selectionType === 'single') {
                            this.objectResetAndSelectForSingleSelect(selectedObject);
                        } else {
                            this.objectResetAndSelectForMultiSelect(selectedObject);
                        }
                    }
                }
            ],
            parentContext: this,
            type: "Alert"
        };
        dialogConfig.autoFocus = false
        dialogConfig.disableClose = true
        this.dialog.open(cspfmAlertDialog, dialogConfig);
    }
    

    recordDiscardConfirmAlert(alertMessage) {
        const dialogConfig = new MatDialogConfig()
        dialogConfig.data = {
            title: alertMessage,
            buttonInfo: [
                {
                    "name": "Ok",
                    "handler": () => {}
                }            
            ],
            parentContext: this,
            type: "Alert"
        };
        dialogConfig.autoFocus = false
        this.dialog.open(cspfmAlertDialog, dialogConfig);        
    }

    checkObjectSelectedStatus(associationMapping) {
        var objectSelectedStatus = true
        if (associationMapping && associationMapping.length > 0) {
            for (let associationMappingObj of associationMapping) {
                if (associationMappingObj['isSelected']) {
                    objectSelectedStatus = false
                }
            }
            return objectSelectedStatus
        }
    }

    objectResetAndSelectForSingleSelect(selectedObject) {
        this.config['associationMetaMapping'].forEach(metaMappingObj => {
            if (metaMappingObj['objectName'] === selectedObject) {
                this.config['associationFieldName'] = metaMappingObj['fieldName']
                metaMappingObj['isSelected'] = true;
            } else {
                metaMappingObj['isSelected'] = false;
                this.config['associationObjectInfo'][metaMappingObj['fieldName']]['selectedRecordId'] = []
                if (this.associateDoc[this.config['objectId']]) {
                    this.resetAssociateDoc(metaMappingObj)
                }
                this.dataObject[metaMappingObj['fieldName']] = []
            }
        });
        this.dataObject[this.config['fieldName']] = selectedObject;

        if (this.config['style'] === 'SingleFromMultipleWithMultipleList') {
            this.associationObjectsConfiguration = {}
            this.makeAssociationAdditionalConfigurationForSingleObjectSelection(this.config['associationFieldName']);
        }

        if(this.config['style'] === 'SingleFromMultipleWithSingleStyle1' || this.config['style'] === 'SingleFromMultipleWithSingleStyle2') {
            this.onCSPFMAssociationChanged.emit();
        }
    }

    public borderEnabled = {}
    objectResetAndSelectForMultiSelect(selectedObjects) {
        this.config['associationMetaMapping'].forEach((metaMappingObj, index) => {
            if (selectedObjects.includes(metaMappingObj['objectName'])) {
                metaMappingObj['isSelected'] = true;
                this.associationObjectsConfiguration[this.config['fieldName']][index]['isSelected'] = true
            } else {
                metaMappingObj['isSelected'] = false;
                this.config['associationObjectInfo'][metaMappingObj['fieldName']]['selectedRecordId'] = []
                if (this.associateDoc[this.config['objectId']]) {
                    this.resetAssociateDoc(metaMappingObj)
                }
                this.dataObject[metaMappingObj['fieldName']] = []
                this.associationObjectsConfiguration[this.config['fieldName']][index]['recordsArray'] = []
                this.associationObjectsConfiguration[this.config['fieldName']][index]['isSelected'] = false
            }
        });
        this.dataObject[this.config['fieldName']] = selectedObjects;

        if (this.config['style'] !== 'MultipleFromMultipleWithMultipleTab' && this.config['style'] !== 'MultipleFromMultipleWithSingleTab' && this.config['style'] !== 'MultipleFromMultipleWithMultipleWaterfall') {
            if (!this.borderEnabled[this.config['fieldName']]) {
                this.borderEnabled[this.config['fieldName']] = false
            }

            if (selectedObjects.length > 1) {
                this.borderEnabled[this.config['fieldName']] = true
                setTimeout(() => {
                    let nodes = document.getElementsByClassName('cs-ra-sl-pinpoint cs-recordassociation-seperator-line');
                    var last = <HTMLElement>nodes[nodes.length - 1];
                    last.style.borderBottom = "transparent";
                }, 1000)
            } else {
                this.borderEnabled[this.config['fieldName']] = false
            }
        } else if (this.config['style'] === 'MultipleFromMultipleWithMultipleWaterfall'){
            this.masonry.reloadItems();
            this.masonry.layout()
        }
        
        if(this.config['style'] === 'MultipleFromMultipleWithSingleChip' || this.config['style'] === 'MultipleFromMultipleWithSingleList' || this.config['style'] === 'MultipleFromMultipleWithSingleTab') {
            this.onCSPFMAssociationChanged.emit();
        }
    }

    resetAssociateDoc(selectedMetaMappingObj) {
        if (!this.associateDocTemp[this.config['objectId']] || !this.associateDocTemp[this.config['objectId']][selectedMetaMappingObj['fieldName']]
            || this.associateDocTemp[this.config['objectId']][selectedMetaMappingObj['fieldName']].length === 0) {
            this.associateDoc[this.config['objectId']][selectedMetaMappingObj['fieldName']] = []
        } else {
            let recordObjArray = JSON.parse(JSON.stringify(this.associateDoc[this.config['objectId']][selectedMetaMappingObj['fieldName']]))
            this.associateDoc[this.config['objectId']][selectedMetaMappingObj['fieldName']].forEach((associateDocRec, index) => {
                if (this.checkAssociationRecordSaved(selectedMetaMappingObj['fieldName'], associateDocRec['association_id'])) {
                    recordObjArray[index]['isActive'] = false
                } else {
                    recordObjArray.splice(index, 1)
                }
            });
            this.associateDoc[this.config['objectId']][selectedMetaMappingObj['fieldName']] = recordObjArray
        }
    }

    public primaryChipArray = {}
    public secondaryChipArray = {}

    handleMultipleRecordsChipStyle(associationConfig, selectedRecordsArray, layoutId, objectId) {
        var extraPaddingWidth = 35
        let associationFieldNameId = associationConfig['fieldName'] + '_' + objectId + '_' + layoutId + '_div'
        if (document.getElementById(associationFieldNameId) === null || document.getElementById(associationFieldNameId).offsetWidth === 0) {
            console.log("Error in handling chips")
        } else {
            this.primaryChipArray[associationConfig['fieldName']] = []
            this.secondaryChipArray[associationConfig['fieldName']] = []

            if (!selectedRecordsArray || selectedRecordsArray.length === 0) {
                return
            }

            var fieldWidth = document.getElementById(associationFieldNameId).offsetWidth
            console.log("Field Width", fieldWidth);
            let moreButtonWidth = 35
            var valueWidth = 0 + moreButtonWidth
            selectedRecordsArray.forEach(selectedRec => {
                let selectedFieldValue = selectedRec[associationConfig['resultColumn'][0]]
                if (!selectedFieldValue) {
                    valueWidth = valueWidth + 8 + extraPaddingWidth
                } else {
                    valueWidth = valueWidth + (selectedFieldValue.length * 8) + extraPaddingWidth
                }

                if (valueWidth < fieldWidth || this.primaryChipArray[associationConfig['fieldName']].length === 0) {
                    this.primaryChipArray[associationConfig['fieldName']].push(selectedRec)
                } else {
                    this.secondaryChipArray[associationConfig['fieldName']].push(selectedRec)
                }
            });
        }
    }
    ngOnDestroy() {
        if(this.angularGrid){
        this.angularGrid.destroy();
        }
        const { fieldName, objectId, layoutId } = this.config;
        this.slickgridUtils.flatpickerAddRemove(`${objectId}_${fieldName}_${layoutId}_recordAssociation`,'remove')
    }
    ngAfterViewInit() {
        const { fieldName, objectId, layoutId } = this.config;
        this.slickgridUtils.flatpickerAddRemove(`${objectId}_${fieldName}_${layoutId}_recordAssociation`,'set')
    }

}