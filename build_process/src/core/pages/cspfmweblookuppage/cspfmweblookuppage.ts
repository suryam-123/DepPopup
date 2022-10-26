import { Component, OnInit, Inject, Input, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { appUtility } from 'src/core/utils/appUtility';
import { DatePipe } from '@angular/common';
import { appConstant } from 'src/core/utils/appConstant';
import { Column, GridOption, FieldType, Filters, OperatorType, AngularGridInstance,
    AngularUtilService, OnEventArgs } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';
import { cspfm_data_display, CspfmDataFormatter, cspfmUrlDataFormatter } from 'src/core/pipes/cspfm_data_display';
import { cspfmCustomFieldProvider } from 'src/core/utils/cspfmCustomFieldProvider';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { cspfmGridsectionListIdConfiguration } from 'src/core/utils/cspfmGridsectionListIdConfiguration';
import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
import { SlickgridPopoverService } from 'src/core/services/slickgridPopover.service';
import * as lodash from 'lodash';
import { cspfmLookupService } from 'src/core/utils/cspfmLookupService';
import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
import { cspfmListFilterUtils } from 'src/core/dynapageutils/cspfmListFilterUtils';
import { FilterSectionDetail } from 'src/core/models/cspfmFilterDetails.type';
import { couchdbProvider } from 'src/core/db/couchdbProvider'
import { cspfmListSearchListUtils } from 'src/core/dynapageutils/cspfmListSearchListUtils';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
@Component({
    selector: 'app-cspfmweblookuppage',
    templateUrl: './cspfmweblookuppage.html',
    styleUrls: ['./cspfmweblookuppage.scss'],
})
export class cspfmweblookuppage implements OnInit,OnDestroy {
    public isLoading = false;
    public isSkeletonLoading=true;
    private parentPage: any;
    public lookupColumnDetails = [];
    public lookupTitle: any;
    public allItems = [];
    public items = [];
    private searchTerm = ''; // Search text
    private isPushVal = false;
    public additionalDataFetching = false; // to display indicator for additional data fetching
    private commonLookupColumnName = '';
    @Input() serviceObject;
    @Input() dataSource;
    @Input() lookupColumnName;
    @Input() lookupInput;
    @Input() objectName;
    @Input() slickgridRowIdentificationValues;
    @Input() callingFrom: 'form' | 'slickgrid';
    @Output() lookupSelected: EventEmitter<any> = new EventEmitter();

    public isDisableManualclose = false;
    public isAutoPopUp = false;
    public gridId = 'cspfm_grid_' + this.constructor.name + '_' + new Date().getTime();
    public gridContainerId = 'cspfm_grid_container_' + this.constructor.name + '_' + new Date().getTime();
    public gridObj;
    public angularGrid: AngularGridInstance;
    public columnMinWidth = 100;
    public itemsPerPageConfigured = 10;

    public gridOptions: GridOption = {
        autoEdit: false,
        // angular-upgrade
        enableEmptyDataWarningMessage: false,
        enablePagination: false,
        pagination: {  // Pagination UI - Item per page select options for default pagintation
            pageSizes: [10, 15, 20, 25, 50, 75, 100, 200, 1000, 2000],
            pageSize: this.itemsPerPageConfigured
        },
        enableCellNavigation: true,
        editable: true,
        enableAutoResize: true,
        enableSorting: true,
        enableFiltering: true,
        enableExcelExport: false,
        enableExport: false,
        i18n: this.translateService,
        enableAutoTooltip: true,
        enableGridMenu: true,
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
            exportWithFormatter: false
        },
        excelExportOptions: {
            exportWithFormatter: false,
        },
        enableTranslate: true,
        presets: {
            sorters: [{ columnId:'', direction: 'ASC' }],
        },
        enableAsyncPostRender: true, // for the Angular PostRenderer, don't forget to enable it
        asyncPostRenderDelay: 0,    // also make sure to remove any delay to render it
        params: {
            angularUtilService: this.angularUtilService // provide the service to all at once (Editor, Filter, AsyncPostRender)
        },
        checkboxSelector: {
            // you can toggle these 2 properties to show the "select all" checkbox in different location
            hideInFilterHeaderRow: false,
        },
        // rowSelectionOptions: {
        //     // True (Single Selection), False (Multiple Selections)
        //     selectActiveRow: false,
        // },
        // enableCheckboxSelector: true,
        // enableRowSelection: true
    };
    public columnDefinitions: Array<Column> = [];
    public expandFlag = true;
    public showFilter = false;
    public gridSearchRowToggle = false;
    public criteriaDisplayFields = [];
    public batchIdLimit = 1000;
    public viewReady = false;
    public paginationInfo: object = {
        limit: 50,
        offset: 0,
        bookmark: ""
    }
    public isComponentDestroyed = false;
    public layoutId;
    public layoutName;
    public paginationConfigInfo;
    public selectedSectionObjectName;
    constructor(private dialogRef: MatDialogRef<cspfmweblookuppage>,
        @Inject(MAT_DIALOG_DATA) data, public route: Router, public activeRoute: ActivatedRoute,
        public appUtilityConfig: appUtility, public datePipe: DatePipe,
        public translateService: TranslateService, public angularUtilService: AngularUtilService,
        public cspfmCustomfieldProvider: cspfmCustomFieldProvider, public cspfmDataDisplay: cspfm_data_display,
        public gridIdConfig: cspfmGridsectionListIdConfiguration, public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils,
        private changeDetectorRef: ChangeDetectorRef, private slickgridPopoverService: SlickgridPopoverService,
        private cspfmLookupService: cspfmLookupService, public slickgridUtils: cspfmSlickgridUtils, public listFilterUtils: cspfmListFilterUtils,
        public dbService: couchdbProvider, public listServiceUtils: cspfmListSearchListUtils, public dialog: MatDialog) {


        if (data && Object.keys(data).length > 0) {
            this.lookupInput = JSON.parse(JSON.stringify(data['lookupInput']));
            this.isAutoPopUp = data['autoPopup'];

            dialogRef.disableClose = true;
            if (this.isAutoPopUp) {
                this.isDisableManualclose = true;
            }

            this.serviceObject = data['serviceObject'];
            this.objectName = data['objectName'];
            this.lookupColumnName = data['lookupColumnName'];
            this.commonLookupColumnName = data['commonLookupColumnName'];
            this.dataSource = data['dataSource'];
            this.parentPage = data['parentPage'];
            this.selectedSectionObjectName = data['sectionObjectName']
            this.layoutId = this.parentPage.layoutId + '_weblookup';
            this.layoutName = this.parentPage.layoutName + '_weblookup';
            this.filterSectionDetail = this.lookupInput['filterConfig']
            this.paginationConfigInfo = this.lookupInput['paginationConfigInfo']
            if(this.paginationConfigInfo) {
                this.gridOptions['enablePagination'] = true
            }
            if(this.lookupInput["itemsPerPageConfigured"]) {
                this.itemsPerPageConfigured = this.lookupInput["itemsPerPageConfigured"]
                this.gridOptions['pagination']['pageSize'] = this.itemsPerPageConfigured
            }

            if (this.lookupInput['multiSelectionEnabled']) {
                this.gridOptions['rowSelectionOptions'] = {
                    selectActiveRow: false,
                }
                this.gridOptions['checkboxSelector'] = {
                    hideInFilterHeaderRow: false,
                    width: 60
                }
                this.gridOptions['enableCheckboxSelector'] = true,
                this.gridOptions['enableRowSelection'] = true
            }

            if(!this.lookupInput['onLoadFetchEnabled'] && this.lookupInput['isSearchFilterEnabled']) {
                this.filterSectionDetail['filterPanelExpanded'] = true;
            }
        }
    }

    init() {
        this.lookupColumnDetails = this.lookupInput.lookupColumnDetails;
        this.gridOptions.presets.sorters[0].columnId = this.lookupColumnDetails[0].label;
        if (this.lookupColumnDetails.length > 3 && this.appUtilityConfig.isMobile) {
            this.lookupColumnDetails.splice(3);
        }
        if (!this.appUtilityConfig.isMobile) {
            this.columnDefinitions = [];
            this.lookupColumnDetails.forEach(fieldInfo => {
                let fieldTypeStr;
                let filterObj = {
                };
                let queryParams;
                let objectVal;
                let element = this.slickgridUtils.getFieldInfo(fieldInfo);
                if (!element) {
                return;
                }
                if (element.fieldType === 'LOOKUP' || element.fieldType === "TEXT" ||
                    element.fieldType === "CHECKBOX" || element.fieldType === "MULTISELECT" ||
                    element.fieldType === "RADIO" || element.fieldType === "URL" ||
                    element.fieldType === "FORMULA" || element.fieldType === "DROPDOWN" ||
                    element.fieldType === "ROLLUPSUMMARY") {
                    fieldTypeStr = FieldType.string
                } else if (element.fieldType === 'TIMESTAMP') {
                    fieldTypeStr = FieldType.dateTime
                } else if (element.fieldType === 'BOOLEAN') {
                    fieldTypeStr = FieldType.boolean
                } else if (element.fieldType === 'NUMBER' || element.fieldType === "CURRENCY" ||
                    element.fieldType.toUpperCase() === "AUTONUMBER") {
                    fieldTypeStr = FieldType.number
                } else if (element.fieldType === 'ACTION') {
                    fieldTypeStr = FieldType.unknown
                } else if (element.fieldType === 'DATE') {
                    fieldTypeStr = FieldType.date
                }
                if (element.fieldType === "RADIO" || element.fieldType === "DROPDOWN") {
                    filterObj = {
                        collection: this.getLabelValue(element.mappingDetails || {}),
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
                        collection: this.getLabelValue(element.mappingDetails || {}),
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
                    queryParams = fieldInfo.prop + appConstant['customFieldSuffix']['slickgrid']
                }
                objectVal = {
                    id: fieldInfo.id,
                    nameKey: this.slickgridUtils.convertSplCharToEntities(element.label,'toEntity'),
                    field: fieldInfo.prop,
                    toolTip:this.translateService.instant(element.label),
                    minWidth: this.columnMinWidth,
                    type: fieldTypeStr,
                    formatter: CspfmDataFormatter,
                    params: {
                        pipe: this.cspfmDataDisplay,
                        fieldInfo: fieldInfo,
                    },
                    filterable: true,
                    sortable: true,
                    filter: filterObj,
                    onCellClick: (mouseEvent, args) => {
                        this.onActionCellClick(mouseEvent, args);
                    }
                }
                if (queryParams) {
                    objectVal['queryField'] = queryParams
                }
                let fieldType =this.slickgridPopoverService.getFieldType((objectVal['params']||{})["fieldInfo"]); 
                if (fieldType === "URL"){
                    objectVal['formatter'] = cspfmUrlDataFormatter;
                    element['actionInfo'] = [];
                    objectVal['params']['layoutName'] = this.layoutName;
                    objectVal['params']['layoutId'] = this.layoutId;
                }
                this.columnDefinitions.push(objectVal);
            });
            this.columnDefinitions = [...this.columnDefinitions]

        }

        this.lookupTitle = this.lookupInput.title;
        const criteriaConfig = this.lookupInput['criteriaConfig']
        let selector = this.lookupInput.selector;
        if (criteriaConfig) {
            let criteriaDisplayFields = criteriaConfig['criteriaFields']
            let criteriaType = criteriaConfig['type']
            if (criteriaType && criteriaType === 'filter' || criteriaType === 'slickgrid') {
                Object.keys(criteriaDisplayFields).forEach(elementKey => {
                    this.criteriaDisplayFields.push(criteriaDisplayFields[elementKey])
                })
            } else {
                Object.keys(criteriaDisplayFields).forEach(objectType => {
                    Object.keys(criteriaDisplayFields[objectType]).forEach(element => {
                        this.criteriaDisplayFields.push(criteriaDisplayFields[objectType][element])
                    })
                })
            }
            const lookupCriteriaQueryConfig = criteriaConfig['lookupCriteriaQueryConfig']
            const configObject = {
                'lookupCriteriaQueryConfig': lookupCriteriaQueryConfig
            }
            if (criteriaConfig['criteriaDataObject']) {
                configObject['criteriaDataObject'] = criteriaConfig['criteriaDataObject']
            } else if (criteriaConfig['filterFieldWithValues']) {
                configObject['filterFieldWithValues'] = criteriaConfig['filterFieldWithValues']
            }
            if (lookupCriteriaQueryConfig['relationalObjects'] && lookupCriteriaQueryConfig['relationalObjects'].length > 0) {
                this.cspfmLookupCriteriaUtils.getRelationalObjectValues(configObject).then(res => {
                    let idArray = []
                    let keys = Object.keys(configObject['relationalObjectsResult']);
                    for (let key of keys) {
                       
                        let value = lodash.chunk(configObject['relationalObjectsResult'][key], this.batchIdLimit);
                        idArray.push(value)
                    }
                    
                    let result = this.getCombinationIds(idArray);

                    for (let ids of result) {
                        let tempConfig = {}
                        for (let [i, m] of ids.entries()) {
                            tempConfig[keys[i]] = ids[i]
                        }
                        configObject['relationalObjectsResult'] = tempConfig;
                        let criteriaQuery = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject);
                        if(this.lookupInput['onLoadFetchEnabled'] || !this.lookupInput['isSearchFilterEnabled']) {
                            this.fetchAllData({ selector, criteriaQuery }).then(res => {
                                this.handleFetchResult(res);
                            })
                        }
                    }
                })
            } else {
                let criteriaQuery = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject);
                if(this.lookupInput['onLoadFetchEnabled'] || !this.lookupInput['isSearchFilterEnabled']) {
                    this.fetchAllData({ selector, criteriaQuery }).then(res => {
                        this.handleFetchResult(res)
                    })
                }
            }
        } else {
            if(this.lookupInput['onLoadFetchEnabled'] || !this.lookupInput['isSearchFilterEnabled']) {
                this.fetchAllData({ selector }).then(res => {
                    this.handleFetchResult(res)
                })
            }
        }

        // const popupsize = <HTMLElement>document.querySelector('.custom-dialog-container');
        const popupsizes = document.querySelectorAll('.custom-dialog-container');
        if (popupsizes && popupsizes.length > 0) {
            let popupsize = <HTMLElement>popupsizes[popupsizes.length - 1]
            if (this.lookupInput['isSearchFilterEnabled']) {
                popupsize.style.setProperty('--cust_height', 'calc(100vh - 25%)');
                popupsize.style.setProperty('--cust_width', 'calc(100vw - 25%)');
            } else {
                popupsize.style.setProperty('--cust_height', 'calc(100vh - 25%)');
                popupsize.style.setProperty('--cust_width', 'calc(100vw - 50%)');
            }
        }
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
    ngOnDestroy() {
        this.isComponentDestroyed = true;
        this.slickgridUtils.flatpickerAddRemove(this.layoutId,'remove')
        this.angularGrid.destroy()
        
    }

    onFilterChange(isApplyAction: Boolean) {
        if (isApplyAction) {
            this.onApplyAction(true)
        } else {
            this.clearMessageConfirmAlert()
        }
    }

    public batchWiseIdArray = []
    onApplyAction(checkRequiredFields: boolean) {
        this.listFilterUtils.makeQuery(this.filterSectionDetail, 'CouchDB');
        this.filterSectionDetail['filterApplyButtonPressed'] = true;

        if(!this.filterSectionDetail['isAllRequiredFieldFilled'] && checkRequiredFields) {
            this.appUtilityConfig.showAlert(this, "Please fill the all required fields");
            return
        }
        this.allItems = []
        this.isLoading = true
        this.filterSectionDetail['filterPanelExpanded'] = false;

        let primaryRootpath = this.filterSectionDetail['filterPrimaryRootpath']
        const reverseHierarchyKeys = Object.keys(this.filterSectionDetail['queryReverseHierarchy']);
        let primaryObjectId = "pfm" + this.filterSectionDetail['reverseHierarchy'][primaryRootpath]['objectId']

        if (primaryRootpath && reverseHierarchyKeys.length == 1 && reverseHierarchyKeys.indexOf(primaryRootpath) > -1
            && (!this.filterSectionDetail['queryReverseHierarchy'][primaryRootpath]['options_formula']
                && !this.filterSectionDetail['queryReverseHierarchy'][primaryRootpath]['options_rollup'])) {
            this.fetchAllData({ selector: this.lookupInput.selector, searchQuery: this.filterSectionDetail['queryReverseHierarchy'][primaryRootpath]['options'] }).then(res => {
                this.handleFetchResult(res)
            })
        } else if(reverseHierarchyKeys.length > 0){
            this.dbService.getObjectIdsBasedOnFilterQuery(this.filterSectionDetail['queryReverseHierarchy'], primaryObjectId).then(result => {
                let searchListQuery = ""
                if (reverseHierarchyKeys.indexOf(primaryRootpath) > -1 && this.filterSectionDetail['queryReverseHierarchy'][primaryRootpath] && this.filterSectionDetail['queryReverseHierarchy'][primaryRootpath]['options']) {
                    searchListQuery = this.filterSectionDetail['queryReverseHierarchy'][primaryRootpath]['options'];
                } else {
                    searchListQuery = this.lookupInput['objectHierarchy']['query']
                }

                this.batchWiseIdArray = lodash.chunk(result, 1000);

                if (Array.isArray(result) && result && result.length > 0) {
                    searchListQuery = searchListQuery + " AND _id : ( " + this.batchWiseIdArray[0].join(" OR ") + " ) "
                } else {
                    searchListQuery = "type : " + primaryObjectId + "AND _id : (null)";
                }
                this.batchWiseIdArray.shift()
                this.fetchAllData({ selector: this.lookupInput.selector, searchQuery: searchListQuery }).then(res => {
                    this.handleFetchResult(res)
                })
            }).catch(error => {
                this.isLoading = false;
            });
        } else {
            const searchListQuery = "type : " + primaryObjectId
            this.fetchAllData({ selector: this.lookupInput.selector, searchQuery: searchListQuery }).then(res => {
                this.handleFetchResult(res)
            })
        }

    }

    async fetchAllData(options) {
        this.isLoading = true
        if (this.lookupInput['objectHierarchy']) {
            var objectHierarchy = this.lookupInput['objectHierarchy']
            var additionalInfo = this.lookupInput['additionalInfo']
            if (appConstant.pouchDBStaticName === this.dataSource) {
                return this.serviceObject.fetchdatawithRelationship(objectHierarchy, additionalInfo).then(res => {
                    return res
                }).catch(error => {
                    this.isDisableManualclose = false;
                    this.isLoading = false;
                    this.isSkeletonLoading = false
                })

            } else if (appConstant.couchDBStaticName === this.dataSource) {
                let query = ''
                if (options && options['searchQuery']) {
                    query = options['searchQuery']
                } else {
                    query = objectHierarchy['query']
                }

                if (options && options['criteriaQuery']) {
                    query = query + ' AND ' + options['criteriaQuery']
                }
                return this.serviceObject.searchRecordsWithPagination(query, objectHierarchy, "ASC", this.paginationInfo).then(res => {
                    return {
                        "result": res,
                        "criteriaQuery": options['criteriaQuery'],
                        "searchQuery": options['searchQuery']
                    };
                }).catch(error => {
                    this.isDisableManualclose = false;
                    this.isLoading = false;
                    this.isSkeletonLoading = false
                })
            }
        } else {
            return this.serviceObject.fetchDocsWithoutRelationshipUsingFindOption(options).then(res => {
                return res
            }).catch(error => {
                this.isDisableManualclose = false;
                this.isLoading = false;
                this.isSkeletonLoading = false
            })
        }

    }

    public filterSectionDetail: FilterSectionDetail = null;

    filterAction() {
        if(this.isLoading) {
            this.listServiceUtils.presentToast("Another process is running, please wait");
            return
        }
        this.filterSectionDetail['filterApplyButtonPressed'] = false;
        this.filterSectionDetail['filterPanelExpanded'] = !this.filterSectionDetail['filterPanelExpanded']
    }

    clearFilterAppliedField(filterFieldInfoKey: string) {
        if (this.listFilterUtils.clearFilterAppliedField(this.filterSectionDetail['filterFields'][filterFieldInfoKey], true)) {
            this.onApplyAction(false);
        }
    }

    clearMessageConfirmAlert() {
        if (this.isLoading) {
            this.listServiceUtils.presentToast("Another process is running, please wait");
            return
        }

        if (this.filterSectionDetail['filterPanelExpanded'] && this.filterSectionDetail['filterAppliedFields'].length == 0) {
            let searchFieldHasValue = false;
            for (let object of Object.keys(this.filterSectionDetail['filterFields'])) {
                let fieldSet = this.filterSectionDetail['filterFields'][object];
                if (fieldSet['betweenflag'] === 'Y' && (fieldSet['fieldValue']['from'] || fieldSet['fieldValue']['to'])) {
                    searchFieldHasValue = true;
                    break;
                } else if (fieldSet['fieldValue'].length) {
                    searchFieldHasValue = true;
                    break;
                }
            }
            if (!searchFieldHasValue) {
                this.listServiceUtils.presentToast("There is no search criteria to clear");
                return
            } else {
                for (let object of Object.keys(this.filterSectionDetail['filterFields'])) {
                    this.listFilterUtils.clearFilterAppliedField(this.filterSectionDetail['filterFields'][object], false);
                }
                this.listServiceUtils.presentToast("Filter cleared");
                return
            }
        }

        const dialogConfig = new MatDialogConfig()

        dialogConfig.data = {
            title: 'Are you sure want to Clear this filter fields value?',
            buttonInfo: [
                {
                    "name": "No"
                },
                {
                    "name": "Yes",
                    "handler": () => {

                        // this.isValidationRequired = false;
                        this.listFilterUtils.clearAllFilter(this.filterSectionDetail)
                        // this.filterSectionDetailTemp = JSON.parse(JSON.stringify(this.filterSectionDetail))
                        // if (!this.onLoadFetch) {
                        //     this.ngOnDestroy();
                        //     this.filteredResultList = [...[]]
                        //     this.filterSectionDetail['filterApplied'] = false
                        //     this.filterSectionDetail['filterPanelExpanded'] = false;
                        //     if (startOverAllFetch) {
                        //         this.initiateFetch()
                        //     } else {
                        //         this.filterAction();
                        //     }
                        //     return
                        // }
                        this.onApplyAction(false)
                    }
                }
            ],
            parentContext: this,
            type: "Alert"
        };
        dialogConfig.autoFocus = false
        this.dialog.open(cspfmAlertDialog, dialogConfig);
    }

    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid;


        this.gridObj = angularGrid.slickGrid;
        this.gridObj.setHeaderRowVisibility(false);
        this.gridObj['cspfm_grid_custom_data'] = {
            "page_title_key": "sepcomponent_d_w_list.Layout.sepcomponent_d_w_list",
            "isPaginationEnabled": this.gridOptions['enablePagination']
        }
        this.gridObj.onColumnsResized.subscribe((event, args) => {

            this.gridObj.reRenderColumns(true)
            /* to refresh the data in slickgrid */
            this.gridObj.invalidate();
        })
    }
    onGridItemClick(event) {
        if (this.lookupInput['multiSelectionEnabled']) {
            return;
        }
        let args = event['detail']['args'];
        let columnDetails = args['grid'].getColumns();
        let fieldType =this.slickgridPopoverService.getFieldType(columnDetails[args['cell']]['params']['fieldInfo']);
        if (fieldType !== "URL") {
            this.itemClick(this.angularGrid.dataView.getItem(args['row']))
        }
    }
    onCellChanged(e, args) {
        this.angularGrid.gridService.updateItemById(args.item['id'], args.item);

    }
    setFilteredItems(event?) {
        if (event) {
            this.searchTerm = event.target.value;
        }
        if (this.searchTerm === '') {
            this.items = this.allItems
        } else {
            this.items = this.allItems.filter((item) => {
                return this.isSearchMatched(item, this.lookupColumnDetails, this.searchTerm);
            });
        }
    }

    async itemClick(item) {
        let columnName = '';
        if (this.commonLookupColumnName !== '' && this.commonLookupColumnName !== undefined && this.commonLookupColumnName !== null) {
            columnName = this.commonLookupColumnName;
        } else {
            columnName = this.lookupColumnName;
        }
        this.additionalDataFetching = true;
        let selectedData = await this.fetchAdditionalData(item);
        this.additionalDataFetching = false;
        if (this.callingFrom === 'slickgrid') {
            let event = {
                'actionName': 'selection',
                'columnName': columnName,
                'item': selectedData
            }
            this.lookupSelected.emit(event)
        } else {
            this.parentPage.lookupResponse(columnName, selectedData);
            this.dialogRef.close();
        }
        this.ngOnDestroy()
    }

    submitSelectedRecords() {
        let selectedRecords = this.angularGrid.gridService.getSelectedRowsDataItem()
        this.parentPage.multiSelectionLookupResponse(selectedRecords, this.selectedSectionObjectName);
        this.dialogRef.close();
    }
    async fetchAdditionalData(selectedData: any) {
        if (this.lookupInput && this.lookupInput['additionalDataHierarchy']) {
            let id = selectedData['id']
            let singleDocResponse = await this.serviceObject.querySingleDoc(this.lookupInput['additionalDataHierarchy'], id)
            if (singleDocResponse['status'] === 'SUCCESS' && singleDocResponse['records'] && singleDocResponse['records'].length > 0) {
                selectedData = singleDocResponse['records'][0];
            }
            return selectedData;
        } else {
            return selectedData;
        }
    }
    closeButtonClick() {
        if (this.callingFrom === 'slickgrid') {
            let event = {
                'actionName': 'close'
            }
            this.lookupSelected.emit(event)
        } else {
            this.dialogRef.close();
            if (!this.isDisableManualclose) {
                this.cspfmLookupService.lookupErrorResponseHandling(this.lookupInput['lookupFieldId'], this.parentPage);
            }
        }
        this.ngOnDestroy()
    }

    onCancel() {
        this.items = this.allItems;
    }

    ngOnInit() {
        this.init()

        setTimeout(() => {
            this.viewReady = true;
            this.changeDetectorRef.detectChanges();
        }, 100);
    }
    toggleGridSearchRow() {
        this.gridSearchRowToggle = !this.gridSearchRowToggle
        if (!this.gridObj.getOptions().showHeaderRow) {
            this.gridObj.setHeaderRowVisibility(true);
            const filterCls = document.getElementsByClassName('search-filter')
            this.gridIdConfig.toggleFilterSetId(filterCls, this.objectName + '_weblookup')
        } else {
            this.gridObj.setHeaderRowVisibility(false);
        }
    }
    getLabelValue(inputJson: { [key: string]: string }): Array<{ label: string, value: string }> {
        var resultArray = [];
        Object.keys(inputJson).forEach(key => { resultArray.push({ value: inputJson[key], label: inputJson[key] }); })
        return resultArray;
    }
    isSearchMatched(item, queryFields, searchText) {
        for (const queryField of queryFields) {
            if (queryField['fieldType'] === 'TEXT' || queryField['fieldType'] === 'MULTILINETEXTBOX' || queryField['fieldType'] === 'AUTONUMBER' || queryField['fieldType'] === 'PRIMARY' || queryField['fieldType'] === 'TEXTAREA' || queryField['fieldType'] === 'URL' || queryField['fieldType'] === 'EMAIL' || queryField['fieldType'] === 'NUMBER' || queryField['fieldType'] === 'DECIMAL' || queryField['fieldType'] === 'CURRENCY') {
                if (item[queryField['fieldName']] && item[queryField['fieldName']].toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                    return true;
                }
            } else if (queryField['fieldType'] === 'MULTISELECT' || queryField['fieldType'] === 'CHECKBOX') {
                if (item[queryField['fieldName']] !== undefined && item[queryField['fieldName']] !== "") {
                    const stateTypeList = item[queryField['fieldName']];
                    for (const element of stateTypeList) {
                        if (queryField['mappingDetails'][element]
                            && queryField['mappingDetails'][element].toString().toLowerCase().
                                indexOf(searchText.toLowerCase()) > -1) {
                            return true;
                        }
                    }
                }
            } else if (queryField['fieldType'] === 'RADIO' || queryField['fieldType'] === 'DROPDOWN' && item[queryField['fieldName']] && item[queryField['fieldName']] !== "") {
                    if (queryField['mappingDetails'][item[queryField['fieldName']]]
                        && queryField['mappingDetails'][item[queryField['fieldName']]].toString().toLowerCase().
                            indexOf(searchText.toLowerCase()) > -1) {
                        return true;
                    }
            } else if (queryField['fieldType'] === 'DATE') {
                if (item[queryField['fieldName']]) {
                    let dateString = this.datePipe.transform(new Date(item[queryField['fieldName']]), this.appUtilityConfig.userDateFormat);
                    if (dateString.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1) {
                        return true;
                    }
                }
            } else if (queryField['fieldType'] === 'TIMESTAMP' && item[queryField['fieldName']]) {
                    let dateTimeString = this.datePipe.transform(new Date(item[queryField['fieldName']]), this.appUtilityConfig.userDateTimeFormat, this.appUtilityConfig.userZoneOffsetValue);
                    if (dateTimeString.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1) {
                        return true;
                    }
            }
        }
    }

    ngAfterViewInit() {
        if (this.lookupInput['criteriaConfig']) {
            setTimeout(() => {
                var key = Array.from(document.getElementsByClassName("cs-org-filter-form-label") as HTMLCollection);
                var value = Array.from(document.getElementsByClassName("cs-org-filter-form-sublabel") as HTMLCollection);
                for (let i = 0; i < key.length; i++) {
                    var keywidth = key[i]['offsetWidth'];
                    var valuewidth = value[i]['offsetWidth'];
                    if (keywidth >= valuewidth) {
                        value[i]['style']['width'] = (keywidth + 40) + 'px';
                    }
                }
            }, 250)
        }
        this.slickgridUtils.flatpickerAddRemove(this.layoutId,'set')
    }
    handleFetchResult(resultObject) {
            let res = resultObject['result'];
            let criteriaQuery = resultObject['criteriaQuery'];
            let searchQuery = resultObject['searchQuery'];
            if (res && res['records'] && res['records'].length > 0) {
                this.paginationInfo['bookmark'] = res['bookmark'];
                let consolidatedItems = [...this.allItems, ...res['records']]
                this.allItems = lodash.uniqBy(consolidatedItems, "id");

                if (this.allItems.length === 1 && !this.lookupInput['multiSelectionEnabled']) {
                    this.itemClick(this.allItems[0])
                    this.paginationInfo['bookmark'] = ""
                    return;
                }
                if (res['records'].length <= res['total_rows'] && !this.isComponentDestroyed) {
                    if (this.paginationInfo['limit'] === 50) {
                        this.paginationInfo['limit'] = 2000;
                    }
                    this.fetchAllData({ selector: this.lookupInput.selector, criteriaQuery: criteriaQuery, searchQuery: searchQuery }).then(result => {
                        this.handleFetchResult(result);
                    })
                }
            } else if (this.batchWiseIdArray.length > 0) {
                if (this.filterSectionDetail['queryReverseHierarchy'][this.filterSectionDetail['filterPrimaryRootpath']] && this.filterSectionDetail['queryReverseHierarchy'][this.filterSectionDetail['filterPrimaryRootpath']]['options']) {
                    searchQuery = this.filterSectionDetail['queryReverseHierarchy'][this.filterSectionDetail['filterPrimaryRootpath']]['options'];
                } else {
                    searchQuery = this.lookupInput['objectHierarchy']['query']
                }
                
                searchQuery = searchQuery + " AND _id : ( " + this.batchWiseIdArray[0].join(" OR ") + " ) "
                this.batchWiseIdArray.shift();
                this.fetchAllData({ selector: this.lookupInput.selector, criteriaQuery: criteriaQuery, searchQuery: searchQuery }).then(result => {
                    this.handleFetchResult(result);
                })
            } else {
              
                if (this.appUtilityConfig.isMobile) {
                    this.setFilteredItems();
                } else {
                    this.cspfmCustomfieldProvider.makeSlickGridCustomFields(this.allItems, this.columnDefinitions);
                }
                this.paginationInfo['bookmark'] = ""
                this.isLoading = false;
                this.isSkeletonLoading=false
                this.isDisableManualclose = false;
                this.angularGrid.dataView.reSort();

            }
    }

    onActionCellClick(mouseEvent: KeyboardEvent | MouseEvent, args: OnEventArgs) {
        let parentElement = mouseEvent && mouseEvent.target && mouseEvent.target['parentElement'] || undefined;
        let additionalChipValues = parentElement && parentElement.getAttribute('additionalChipValues') || '[]';
        let columnDetails = args['grid'].getColumns();
        let fieldType = this.slickgridPopoverService.getFieldType(columnDetails[args['cell']]['params']['fieldInfo']);
        if (fieldType === "URL") {
            let isPageRedirectionDisabled = parentElement && parentElement.getAttribute('isPageRedirectionDisabled') || undefined;
            if (!isPageRedirectionDisabled) {

                additionalChipValues = JSON.parse(additionalChipValues);
                if (additionalChipValues.length === 0) {
                    this.itemClick(this.angularGrid.dataView.getItem(args['row']))
                    return;
                }
                let isMultiUrlField = parentElement && parentElement.getAttribute('isMultiUrlField') || undefined;
                let inputType = parentElement && parentElement.getAttribute('inputType') || undefined;
                let fieldName = parentElement && parentElement.getAttribute('fieldName') || undefined;
                let primaryChipCount = parentElement && parentElement.getAttribute('primaryChipCount') || 0;
                isMultiUrlField = (isMultiUrlField === 'true');
                //doubt
                primaryChipCount += Number(primaryChipCount)
                let fieldId, actionId;
                fieldId = 'FLD_' + this.lookupColumnName + '$$' + fieldName + '_input_';
                actionId = 'ACT_' + this.lookupColumnName + '$$' + fieldName + '_input_';
                let selectedRecordIndex = 0;

                let additionalInfo = {
                    "cspfmObjectName": this.objectName,
                    "inputType": inputType,
                    "isMultipleUrlField": isMultiUrlField,
                    "urlArray": additionalChipValues,
                    "fieldId": fieldId,
                    "actionId": actionId,
                    "args": args,
                    "actionType": "URL",
                    "selectedRecordIndex": selectedRecordIndex
                }
                const urlPopoverClassName = 'cspfmUrlPopover';
                import(`../../components/cspfmUrlPopover/${urlPopoverClassName}.ts`).then(urlPopoverInstance => {
                    if (urlPopoverInstance && urlPopoverInstance[urlPopoverClassName]) {
                        this.slickgridPopoverService.appendComponentToElement('cs-dropdown-' + this.layoutId, urlPopoverInstance[urlPopoverClassName], args, additionalInfo);
                    } else {
                        console.error('cspfmurlPopover component file is missing')
                    }
                }).catch(error => {
                    console.error('cspfmurlPopover component file is missing', error)
                })

            }
        }
        //  else {
        //     this.itemClick(this.angularGrid.dataView.getItem(args['row']))
        // }
    }
}
