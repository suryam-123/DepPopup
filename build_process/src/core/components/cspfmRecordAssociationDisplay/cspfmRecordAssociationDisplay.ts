

/* 
 *   File: cspfmRecordAssociationDisplay.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { Component, OnInit, Input, Inject, SimpleChange, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GridOption, AngularGridInstance, ExcelExportOption, FileType, ExtensionName, DelimiterType, ExportOption } from 'angular-slickgrid';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
import { cspfmGridsectionListIdConfiguration } from 'src/core/utils/cspfmGridsectionListIdConfiguration';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SlickgridPopoverService } from 'src/core/services/slickgridPopover.service';
import { appUtility } from 'src/core/utils/appUtility';
import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
import { NgxMasonryComponent,NgxMasonryOptions } from 'ngx-masonry';
declare var $: any;
declare const window: any;

@Component({
    selector: 'cspfmRecordAssociationDisplay',
    templateUrl: './cspfmRecordAssociationDisplay.html',
    styleUrls: ['./cspfmRecordAssociationDisplay.scss'],
})

export class cspfmRecordAssociationDisplay implements OnInit {

    @Input() associationConfiguration: any = {}
    @Input() dataObject: any = {}
    @Input() dataObjectPath: any = {}
    @Input() layoutName: any = {}
    public isAssociationDataRefreshRequired = false;
    @Input() set setDataRefreshRequired(isAssociationDataRefreshRequired: any) {
        this.isAssociationDataRefreshRequired = isAssociationDataRefreshRequired;
        if (this.isAssociationDataRefreshRequired) {
            if ((this.associationObjectInfo && Object.keys(this.associationObjectInfo).length > 0) &&
                (this.associationConfiguration['style'] === 'SingleFromMultipleWithMultipleList' ||
                this.associationConfiguration['style'] ==='MultipleFromMultipleWithMultipleList' ||
                this.associationConfiguration['style'] === 'MultipleFromMultipleWithSingleList' ||
                this.associationConfiguration['style'] === 'MultipleFromMultipleWithMultipleTab' ||
                this.associationConfiguration['style'] === 'MultipleFromMultipleWithSingleTab')) {
                let selectedConfigurationArray = this.associationObjectInfo[this.associationConfiguration['fieldName']];                
                if (selectedConfigurationArray.length > 0) {
                    for (let i = 0; i < selectedConfigurationArray.length; i++) {
                        this.associationObjectInfo[this.associationConfiguration['fieldName']][i]['angularGridInstance'].resizerService.resizeGrid();
                    }
                }
            } else if (this.associationObjectInfo &&
                this.associationConfiguration['style'] === "MultipleFromMultipleWithMultipleWaterfall") {
                if (this.masonry !== undefined) {
                    this.masonry.reloadItems();
                    this.masonry.layout();
                }
            }
        }
    }
    public gridId = 'cspfm_grid_'
    public gridContainerId = 'cspfm_grid_container_'
    public angularGrid: AngularGridInstance;
    public associationObjectInfo = {}
    public isAdditionalChipToShow = {}
    public viewReady = true;
    public isFromList = false;
    public dropDownAttribute = '#cs-dropdown-';
    public actionId = '';
    public fieldName = '';
    public objectRootPath ='';
    @ViewChild(NgxMasonryComponent, {static: false}) 
    public masonry: NgxMasonryComponent;
    public masonryOptions: NgxMasonryOptions = {
        gutter:20,
        columnWidth:50
    }

    public wf_header_color = ["cs-wf-c-one", "cs-wf-c-two", "cs-wf-c-three", "cs-wf-c-four", "cs-wf-c-five", "cs-wf-c-six", "cs-wf-c-seven", "cs-wf-c-eight", "cs-wf-c-nine"]


    constructor(@Inject(MAT_DIALOG_DATA) data, private dialogRef: MatDialogRef<cspfmRecordAssociationDisplay>, public translateService: TranslateService, public dialog: MatDialog,private apputils:appUtility,
        public gridIdConfig: cspfmGridsectionListIdConfiguration, private slickgridpopoverservice: SlickgridPopoverService,private slickgridUtils: cspfmSlickgridUtils) {

        if (data && Object.keys(data).length > 0) {
            this.associationConfiguration = data['associationConfiguration'];
            this.dataObject = data['dataObject'];
            this.isFromList = data['isFromList'];
            this.dataObjectPath = data['traversalPath'];
            this.layoutName = data['layoutName'];
            
        }
    }

    ngOnInit() {
        this.objectRootPath = this.dataObjectPath.replaceAll('$','_');
        this.fieldName = this.associationConfiguration['fieldName'];
        this.actionId = 'ACT_' + this.layoutName + '$$' + this.dataObjectPath + '$$' + this.fieldName ;
        if (this.associationConfiguration['style'] === 'SingleWithMultiple') {
            this.dropDownAttribute = this.dropDownAttribute + this.associationConfiguration['layoutId']
        }
        this.makeAssociationObjects()
    }

    ngOnChanges() {}
    makeAssociationObjects() {

        let selectedAssociationObjFieldKeys = Object.keys(this.associationConfiguration['associationObjectInfo'])
        for (let associationObjField of selectedAssociationObjFieldKeys) {

            if (Array.isArray(this.dataObject[this.associationConfiguration['fieldName']])) {
                if (!this.dataObject[this.associationConfiguration['fieldName']].includes(this.associationConfiguration['associationObjectInfo'][associationObjField]['objectName'])) {
                    continue;
                }
            } else {
                if (this.dataObject[this.associationConfiguration['fieldName']] !== this.associationConfiguration['associationObjectInfo'][associationObjField]['objectName']) {
                    continue;
                }
            }

            if (!this.associationConfiguration['isMultiColumnDisplayType']) {
                this.associationConfiguration['gridFieldInfo']=this.slickgridpopoverservice.getFieldInfo(this.associationConfiguration['gridFieldInfo'] )
                this.associationConfiguration['gridFieldInfo']['fieldName'] = this.associationConfiguration['associationObjectInfo'][associationObjField]['fieldName']
                this.associationConfiguration['gridFieldInfo']['prop'] = this.associationConfiguration['associationObjectInfo'][associationObjField]['fieldName']
            } else {
                var gridOption: GridOption = this.getGridOptions();
                gridOption['autoResize']['containerId'] = this.gridContainerId + this.associationConfiguration['associationObjectInfo'][associationObjField]['objectName']

                const associationObject = {
                    displayName: this.associationConfiguration['associationObjectInfo'][associationObjField]['objectDisplayName'],
                    objectName: this.associationConfiguration['associationObjectInfo'][associationObjField]['objectName'],
                    objectId: this.associationConfiguration['objectId'],
                    fieldName: associationObjField,
                    resultColumn: this.associationConfiguration['associationObjectInfo'][associationObjField]['resultColumn'],
                    recordsArray: this.dataObject[associationObjField],
                    gridOptionInfo: gridOption,
                    angularGridInstance: this.angularGrid,
                    additionalInfo: {
                        tempDataArray: [],
                        gridSearchRowToggle: false
                    },
                    tempColumnDefinitions: [],
                    isLoading: false
                };
                if (!this.associationObjectInfo[this.associationConfiguration['fieldName']]) {
                    this.associationObjectInfo[this.associationConfiguration['fieldName']] = []
                }
                this.associationObjectInfo[this.associationConfiguration['fieldName']].push(associationObject)
            }
        }
    }

    refreshWaterfallModelData(){
        if (this.masonry !== undefined) {
            this.masonry.reloadItems();
            this.masonry.layout();
        }
    }
    
    getGridOptions(): GridOption {
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
            i18n: this.translateService,
            gridMenu: {
                hideExportExcelCommand: true,
                hideExportCsvCommand: true,
                customItems: [{
                    command: "cspfm-excel-export",
                    titleKey: "EXPORT_TO_EXCEL",
                    iconCssClass: "fa fa-file-excel-o",
                    action: (event, callbackArgs) => {
                        this.excelExport(event, callbackArgs)
                    }
                }, {
                    command: "cspfm-csv-export",
                    titleKey: "EXPORT_TO_CSV",
                    iconCssClass: "fa fa-download",
                    action: (event, callbackArgs) => {
                        this.excelExport(event, callbackArgs)
                    }
                }, {
                    command: "cspfm-groupby",
                    titleKey: "Group-by",
                    iconCssClass: "icon-mat-account_tree",
                    action: (event, callbackArgs) => {
                        // this.openDraggableGroupingRow(childObjectName)
                    }
                }, {
                    command: "cspfm-clear-groupby",
                    titleKey: "Clear Grouping",
                    iconCssClass: "fa fa-times",
                    action: (event, callbackArgs) => {
                        // this.clearGrouping(childObjectName)
                    }
                }],
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
                containerId: this.gridContainerId,
                calculateAvailableSizeBy: 'container'
            },
            exportOptions: {
                exportWithFormatter: true
            },
            excelExportOptions: {
                exportWithFormatter: true,
            },
            enableTranslate: true,
            // presets: {
            //   sorters: this.sectionObjectDetails[childObjectName]["sortByColumns"],
            // },
            enableDraggableGrouping: false,
            createPreHeaderPanel: false,
            showPreHeaderPanel: false,
            preHeaderPanelHeight: 40,
            rowHeight: 40,
            headerRowHeight: 40,
            enableEmptyDataWarningMessage: false
            // draggableGrouping: {
            //   dropPlaceHolderText: 'Drop a column header here to group by the column',
            //   deleteIconCssClass: 'fa fa-times',
            //   onGroupChanged: (e, args) => {
            //     this.onGroupChanged(args, childObjectName)
            //   },
            //   onExtensionRegistered: (extension) => {
            //     const childObject = this.getChildObject(childObjectName);
            //     childObject['draggableGroupingPlugin'] = extension
            //   },
            // }
        }
    }

    angularGridReady(angularGrid: AngularGridInstance, selectedObject) {
        selectedObject['angularGridInstance'] = angularGrid
        selectedObject['gridMenuExtension'] = angularGrid.extensionService.getExtensionByName(ExtensionName.gridMenu)

        var slickgridMenu = document.getElementsByClassName("slick-gridmenu-button");
        if (slickgridMenu && slickgridMenu.length > 0) {
            for (let i = 0; i < slickgridMenu.length; i++) {
                slickgridMenu[i]['title'] = "Grid menu";
            }
        }

        var slickgridHeaderMenu = document.getElementsByClassName("slick-header-menubutton");
        

        if (slickgridHeaderMenu && slickgridHeaderMenu.length > 0) {
            for (let i = 0; i < slickgridHeaderMenu.length; i++) {
                slickgridHeaderMenu[i]['title'] = "Header menu";
            }
        }

        angularGrid.filterService.onSearchChange.subscribe((input) => {
              });
        selectedObject['gridObj'] = angularGrid.slickGrid;
        selectedObject['gridObj'].setHeaderRowVisibility(false);
        selectedObject['gridObj']['cspfm_grid_custom_data'] = {
            "page_title_key": "institute_d_m_hl_list.Layout.institute_d_m_hl_list",
            "object_display_name": selectedObject['displayName'],
            "angular_grid_excel_export_service_instance": angularGrid.excelExportService,
            "angular_grid_export_service_instance": angularGrid.exportService
        }

        //Force fitting to screen size if the canvas length is lesser the window's innerWidth. For dynamic column width setting.
        if (selectedObject['gridObj'].getCanvasWidth() < window.innerWidth) {
            var gridOption = this.getGridOptions()
            gridOption['enableAutoSizeColumns'] = true
            gridOption['autoFitColumnsOnFirstLoad'] = true
            selectedObject['gridObj'].setOptions(gridOption)
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
            this.apputils.presentToast("Another process is running, please wait");
            return
        }
        var offsetLeft = e.srcElement.parentElement.offsetLeft;
        var offsetTop = e.srcElement.parentElement.offsetTop;
        setTimeout(() => {
            document.getElementsByClassName('popover-content')[0].setAttribute("style", `top: ${offsetTop + 40}px; left: ${offsetLeft}px`);
        }, 100)
        document.getElementsByClassName("cdk-overlay-pane")[0].getElementsByClassName("mat-select-panel-wrap")[0].getElementsByClassName("mat-select-panel")[0].classList.add("cs-custom-scroll");
    }

    tabChangeMethod(event) {
        let index = this.associationConfiguration['objectDisplayNameMapping'][event.tabTitle];
        this.associationObjectInfo[this.associationConfiguration['fieldName']][index]['angularGridInstance'].resizerService.resizeGrid();
    }

    toggleGridSearchRow(selectedObject) {
        selectedObject['additionalInfo']['gridSearchRowToggle'] = !selectedObject['additionalInfo']['gridSearchRowToggle']
        if (!selectedObject['gridObj'].getOptions().showHeaderRow) {
            selectedObject['gridObj'].setHeaderRowVisibility(true);
            const filterCls = document.getElementsByClassName('search-filter')
            this.gridIdConfig.toggleFilterSetId(filterCls, selectedObject['objectName'])
        } else {
            selectedObject['gridObj'].setHeaderRowVisibility(false);
        }
    }


    excelExport(event, callbackArgs) {
        let displayFileType;
        if (callbackArgs['command'] === 'cspfm-excel-export') {
            displayFileType = 'Excel ';
        } else if (callbackArgs['command'] === 'cspfm-csv-export') {
            displayFileType = 'CSV ';
        }
        const cspfmGridCustomData = callbackArgs['grid']['cspfm_grid_custom_data']
        if (cspfmGridCustomData) {
            const pageTitle = cspfmGridCustomData['page_title_key']
            const objectName = cspfmGridCustomData['object_display_name']

            this.apputils.presentToast("Export to " + displayFileType + "initiated");

            return this.translateService.get(pageTitle).subscribe(res => {
                let filename = res;
                if (objectName) {
                    filename = res + " - " + objectName;
                }
                
                if (callbackArgs['command'] === 'cspfm-excel-export') {
                    let excelExportOptions: ExcelExportOption = {
                        filename: filename,
                        format: FileType.xlsx
                    }
                    return cspfmGridCustomData['angular_grid_excel_export_service_instance'].exportToExcel(excelExportOptions).catch(error => {
                        this.apputils.showAlert(this,error.message);
                        return error;
                    });
                } else {
                    let exportOptions: ExportOption = {
                        filename: filename,
                        format: FileType.csv,
                        delimiter:DelimiterType.comma
                    }
                    return cspfmGridCustomData['angular_grid_export_service_instance'].exportToFile(exportOptions).catch(error => {
                        this.apputils.showAlert(this,error.message);
                        return error;
                    });
                }
            })
        }
    }

    toggleGridMenu(event, childobj) {
        if (childobj['angularGridInstance']) {
            let gridMenuInstance = childobj['angularGridInstance'].extensionService.getSlickgridAddonInstance(ExtensionName.gridMenu);
            gridMenuInstance.showGridMenu(event);
        }

        const posit = event.currentTarget.getBoundingClientRect()
        let window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var slick_grid_cls = document.getElementsByClassName('slick-gridmenu');
        Array.prototype.forEach.call(slick_grid_cls, function (el) {
           
            if (el.style.display !== 'none') {
               
                let top = posit.top + 27
                let left = posit.left
                let maxHeight = (window_height - (posit.top + 30)) - 50
                document.getElementsByClassName(el.classList)[0].setAttribute("style", ` top: ${top}px!important;left: ${left}px!important;max-height: ${maxHeight}px;`);
            }
        });
    }

    closeButtonClick() {
        this.dialogRef.close();
    }
   

    

    public isChipPopoverShown: boolean = false;

    public primaryChipArray = {}
    public secondaryChipArray = {}

    handleMultipleRecordsChipStyle(associationConfig, selectedRecordsArray, layoutId, objectId) {
        var extraPaddingWidth = 35
        let associationFieldNameId = associationConfig['fieldName'] + '_' + objectId + '_' + layoutId + '_div'
        if (document.getElementById(associationFieldNameId) === null || document.getElementById(associationFieldNameId).offsetWidth === 0) {
            console.log("Error in handling chips")
        } else {
            var fieldWidth = document.getElementById(associationFieldNameId).offsetWidth
           
            this.primaryChipArray[associationConfig['fieldName']] = []
            this.secondaryChipArray[associationConfig['fieldName']] = []

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
        const { fieldName, objectId, layoutId } = this.associationConfiguration;
        this.slickgridUtils.flatpickerAddRemove(`${objectId}_${fieldName}_${layoutId}_recrdDisp`,'remove')
    }
    ngAfterViewInit() {
        const { fieldName, objectId, layoutId } = this.associationConfiguration;
        this.slickgridUtils.flatpickerAddRemove(`${objectId}_${fieldName}_${layoutId}_recrdDisp`,'set')
    }

}

