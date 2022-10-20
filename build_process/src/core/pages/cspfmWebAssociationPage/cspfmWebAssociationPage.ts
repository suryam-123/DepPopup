import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AngularGridInstance, AngularUtilService, Column, FieldType, Filters, GridOption, OperatorType } from 'angular-slickgrid';
import { CspfmDataFormatter, cspfm_data_display, cspfmUrlDataFormatter } from 'src/core/pipes/cspfm_data_display';
import { appConstant } from 'src/core/utils/appConstant';
import { appUtility } from 'src/core/utils/appUtility';
import { cspfmCustomFieldProvider } from 'src/core/utils/cspfmCustomFieldProvider';
import { cspfmGridsectionListIdConfiguration } from 'src/core/utils/cspfmGridsectionListIdConfiguration';
import { cspfmRecordAssociationUtils } from 'src/core/dynapageutils/cspfmRecordAssociationUtils';
import { SlickgridPopoverService } from 'src/core/services/slickgridPopover.service';
import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
import * as lodash from 'lodash';

@Component({
    selector: 'cspfmWebAssociationPage',
    templateUrl: './cspfmWebAssociationPage.html',
    styleUrls: ['./cspfmWebAssociationPage.scss'],
})
export class cspfmWebAssociationPage implements OnInit {
    public isLoading = true;
    private parentPage: any;
    private objectName: any;
    public lookupColumnDetails = [];
    public lookupTitle: any;
    private serviceObject: any;
    public allItems = [];
    public items = [];
    private searchTerm = ''; // Search text
    private lookupInput = {};
    private isPushVal = false;
    private lookupColumnName = '';
    private commonLookupColumnName = '';
    public batchIdLimit = 1000;

    public isDisableManualclose = false;
    public isAutoPopUp = false;
    public dataSource: string;
    public gridId = 'cspfm_grid_' + this.constructor.name + '_' + new Date().getTime();
    public gridContainerId = 'cspfm_grid_container_' + this.constructor.name + '_' + new Date().getTime();
    public gridObj;
    public angularGrid: AngularGridInstance;
    public columnMinWidth = 100;
    public gridOptions: GridOption = {
        autoEdit: false,
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
        enableEmptyDataWarningMessage:false,
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
            // sorters: [{ columnId: this.tableColumnInfo['pfm138993_institutename']['prop'], direction: 'ASC' }],
        },
        enableAsyncPostRender: true, // for the Angular PostRenderer, don't forget to enable it
        asyncPostRenderDelay: 0,    // also make sure to remove any delay to render it
        params: {
            angularUtilService: this.angularUtilService // provide the service to all at once (Editor, Filter, AsyncPostRender)
        }
    };
    public columnDefinitions: Array<Column> = [];
    public expandFlag = true;
    public showFilter = false;
    public gridSearchRowToggle = false;
    public recordAssociationObject = {}
    public currentObjectId = ""
    public layoutName;
    public layoutId;
    public criteriaDisplayFields = [];

    constructor(private dialogRef: MatDialogRef<cspfmWebAssociationPage>,
        @Inject(MAT_DIALOG_DATA) data, public route: Router, public activeRoute: ActivatedRoute,
        public appUtilityConfig: appUtility, public datePipe: DatePipe,
        public translateService: TranslateService, public angularUtilService: AngularUtilService,
        public cspfmCustomfieldProvider: cspfmCustomFieldProvider, public cspfmDataDisplay: cspfm_data_display,
        public gridIdConfig: cspfmGridsectionListIdConfiguration, public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils,
         public dialog: MatDialog, private cspfmRecordAssociationUtils: cspfmRecordAssociationUtils,public slickGridPopoverService: SlickgridPopoverService,private slickgridUtils: cspfmSlickgridUtils) {

        let associationInfo = JSON.parse(JSON.stringify(data['associationInfo']))
        if (associationInfo instanceof Array) {
            this.recordAssociationObject = associationInfo[0]
        } else {
            this.recordAssociationObject = associationInfo
        }

        if (this.recordAssociationObject['selectionType'] === 'multiple') {
            this.gridOptions['rowSelectionOptions'] = {
                selectActiveRow: false,
            }
            this.gridOptions['checkboxSelector'] = {
                hideInFilterHeaderRow: false,
                width: 60
            }
            this.gridOptions['enableCheckboxSelector'] = true;
            this.gridOptions['enableRowSelection'] = true;
        }


        const lookupHierarchyJson = this.recordAssociationObject['objectHierarchy']
        let queryString = '';
        queryString = "type:" + "pfm" + lookupHierarchyJson['objectId']
        lookupHierarchyJson['query'] = queryString
        this.currentObjectId = data['currentObjectId']
        this.lookupInput['lookupColumnDetails'] = this.recordAssociationObject['displayColumns']
        this.lookupInput['objectHierarchy'] = lookupHierarchyJson;
        this.lookupInput['additionalDataHierarchy'] = this.recordAssociationObject['additionalDataHierarchyJson'];
        this.lookupInput['title'] = "Association Objects";
        this.lookupInput['selector'] = queryString;
        if(data['criteriaConfig']) {
            this.lookupInput['criteriaConfig'] = JSON.parse(JSON.stringify(data['criteriaConfig']))
        }

        this.isAutoPopUp = data['autoPopup'];
        dialogRef.disableClose = true;
        if (this.isAutoPopUp) {
            this.isDisableManualclose = true;
        }

        this.serviceObject = data['serviceObject'];
        this.objectName = this.recordAssociationObject['objectName'];
        this.dataSource = data['dataSource'];
        this.parentPage = data['parentPage'];
        this.layoutId = this.parentPage.config.layoutId + '_webrecass';
        this.layoutName = this.parentPage.layoutName + '_webrecass';
        this.lookupColumnDetails = this.lookupInput['lookupColumnDetails'];
        if (this.lookupColumnDetails.length > 3 && this.appUtilityConfig.isMobile) {
            this.lookupColumnDetails.splice(3);
        }
        if (!this.appUtilityConfig.isMobile) {
            this.lookupColumnDetails.forEach(element => {
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
                let fieldType = this.slickGridPopoverService.getFieldType(element);
                objectVal = {
                    id: element.prop,
                    nameKey: this.slickgridUtils.convertSplCharToEntities(element.label,'toEntity'),
                    field: element.prop,
                    toolTip:this.translateService.instant(element.label),
                    minWidth: this.columnMinWidth,
                    type: fieldTypeStr,
                    formatter: CspfmDataFormatter,
                    params: {
                        pipe: this.cspfmDataDisplay,
                        fieldInfo: element,
                    },
                    filterable: true,
                    sortable: true,
                    filter: filterObj,
                    onCellClick: (mouseEvent, args) => {
                        fieldType === 'URL' ? this.itemClick(this.angularGrid.dataView.getItem(args['row']),mouseEvent,args) :this.itemClick(this.angularGrid.dataView.getItem(args['row']));
                    }
                }
                if (queryParams) {
                    objectVal['queryField'] = queryParams
                }
                if (fieldType === "URL") {
                    objectVal['formatter'] = cspfmUrlDataFormatter;
                    element['actionInfo'] = [];
                    objectVal['params']['layoutName'] = this.layoutName;
                    objectVal['params']['layoutId'] = this.layoutId;
                }
                this.columnDefinitions.push(objectVal);
            });
            console.log('columnDefinitions', this.columnDefinitions, this.lookupColumnDetails)
        }

        const criteriaConfig = this.lookupInput['criteriaConfig']
        let selector = this.lookupInput['selector']
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
            const criteriaQueryConfig = criteriaConfig['criteriaQueryConfig']
            const configObject = {
                'associationCriteriaQueryConfig': criteriaQueryConfig
            }
            if (criteriaConfig['criteriaDataObject']) {
                configObject['criteriaDataObject'] = criteriaConfig['criteriaDataObject']
            } else if (criteriaConfig['filterFieldWithValues']) {
                configObject['filterFieldWithValues'] = criteriaConfig['filterFieldWithValues']
            }
            if (criteriaQueryConfig['relationalObjects'] && criteriaQueryConfig['relationalObjects'].length > 0) {
                this.cspfmLookupCriteriaUtils.getRelationalObjectValues(configObject).then(res => {
                    let idArray = []
                    let keys = Object.keys(configObject['relationalObjectsResult']);
                    for (let key of keys) {
                        
                        let value = lodash.chunk(configObject['relationalObjectsResult'][key], this.batchIdLimit);
                        idArray.push(value)
                    }
                    console.log("idArray", idArray)
                    let result = this.getCombinationIds(idArray);
                    console.log("result", result)

                    for (let ids of result) {
                        
                        let tempConfig = {}
                        for (let m of ids) {
                            tempConfig[keys[m]] = m
                        }
                        configObject['relationalObjectsResult'] = tempConfig;
                        let criteriaQuery = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject);
                        this.fetchAllData({ selector, criteriaQuery })
                    }
                })
            } else {
                let criteriaQuery = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject);
                this.fetchAllData({ selector, criteriaQuery })
            }
        } else {
            this.fetchAllData({ selector})
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

    async fetchAllData(options) {
        if (this.lookupInput['objectHierarchy']) {
            var objectHierarchy = this.lookupInput['objectHierarchy']
            var additionalInfo = this.lookupInput['additionalInfo']
            if (appConstant.pouchDBStaticName === this.dataSource) {
                this.serviceObject.fetchdatawithRelationship(objectHierarchy, additionalInfo).then(res => {
                    this.isLoading = false;
                    if (res['records'].length > 0) {
                        this.allItems = res['records'];
                        if (res['records'].length === 1) {
                            this.itemClick(this.allItems[0])
                            this.isLoading = false;
                            return;
                        }
                        if (this.appUtilityConfig.isMobile) {
                            this.setFilteredItems();
                        } else {
                            this.cspfmCustomfieldProvider.makeSlickGridCustomFields(this.allItems, this.columnDefinitions);
                        }
                    } else {
                        this.isDisableManualclose = false;
                        console.log('fetchDataWithReference in lookup list.ts is failed', res['message']);
                    }
                }).catch(error => {
                    this.isDisableManualclose = false;
                    this.isLoading = false;
                })

            } else if (appConstant.couchDBStaticName === this.dataSource) {
                let query = objectHierarchy['query']
                if (options && options['criteriaQuery']) {
                    query = query + ' AND ' + options['criteriaQuery']
                }
                this.serviceObject.fetchRecordsBySearchFilterPhrases(query, objectHierarchy).then(res => {
                    if (res['status'] === 'SUCCESS') {
                        if (res['records'].length > 0) {
                            this.allItems = res['records'];
                            if (res['records'].length === 1 && this.recordAssociationObject['selectionType'] === 'single') {
                                this.itemClick(this.allItems[0])
                                this.isLoading = false;
                                return;
                            }
                            if (this.appUtilityConfig.isMobile) {
                                this.setFilteredItems();
                            } else {
                                this.cspfmCustomfieldProvider.makeSlickGridCustomFields(this.allItems, this.columnDefinitions);
                                setTimeout(() => {
                                    if (this.recordAssociationObject['selectedRecordId'] && this.recordAssociationObject['selectedRecordId'].length > 0) {
                                        let rowIndexes = []
                                        this.recordAssociationObject['selectedRecordId'].forEach(element => {
                                            if (this.angularGrid.dataView.getIdxById(element) !== undefined) {
                                                rowIndexes.push(this.angularGrid.dataView.getIdxById(element))
                                            }
                                        });
                                        if (rowIndexes.length > 0) {
                                            this.angularGrid.gridService.setSelectedRows(rowIndexes);
                                        }
                                    }
                                }, 100);
                            }
                        } else {
                            this.isDisableManualclose = false;
                            console.log('fetchDataWithReference...... no records found');
                        }
                    } else {
                        this.isDisableManualclose = false;
                        console.log('fetchDataWithReference in lookup list.ts is failed', res['message']);
                    }
                    this.isLoading = false;
                })
                    .catch(error => {
                        this.isDisableManualclose = false;
                        this.isLoading = false;
                    })
            }
        } else {
            this.serviceObject.fetchDocsWithoutRelationshipUsingFindOption(options)
                .then(res => {
                    if (res['status'] === 'SUCCESS') {
                        if (res['records'].length > 0) {
                            this.allItems = res['records'];
                            if (res['records'].length === 1) {
                                this.itemClick(this.allItems[0])
                                this.isLoading = false;
                                return;
                            }
                            if (this.appUtilityConfig.isMobile) {
                                this.setFilteredItems();
                            } else {
                                this.cspfmCustomfieldProvider.makeSlickGridCustomFields(this.allItems, this.columnDefinitions);
                            }
                        } else {
                            this.isDisableManualclose = false;
                            console.log('fetchDocsWithoutRelationshipUsingFindOption...... no records found');
                        }
                    } else {
                        this.isDisableManualclose = false;
                        console.log('fetchDocsWithoutRelationshipUsingFindOption in lookup list.ts is failed', res['message']);
                    }
                    this.isLoading = false;
                })
                .catch(error => {
                    this.isDisableManualclose = false;
                    this.isLoading = false;
                })
        }

    }
    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid;
        this.gridObj = angularGrid.slickGrid;
        this.gridObj.setHeaderRowVisibility(false);
        this.gridObj['cspfm_grid_custom_data'] = {
            "page_title_key": "sepcomponent_d_w_list.Layout.sepcomponent_d_w_list",
        }
    }
    onGridItemClick(event) {
        let fieldType
        if (this.angularGrid.slickGrid.getColumns()[event['detail']['args']['cell']]['params']) {
            fieldType = this.slickGridPopoverService.getFieldType(this.angularGrid.slickGrid.getColumns()[event['detail']['args']['cell']]['params']['fieldInfo'])
        }
        if (fieldType !== 'URL') {
            this.itemClick(this.angularGrid.dataView.getItem(event['detail']['args']['row']), fieldType)
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
    async itemClick(item,mouseEvent?,args?) {
        if (mouseEvent) {
            let parentElement = mouseEvent.target && mouseEvent.target['parentElement'] || undefined;
            let actionView = parentElement && parentElement.getAttribute('action-view') || undefined;
            if (actionView === 'button') {
                this.cspfmRecordAssociationUtils.onActionCellClickForAssociation(mouseEvent, args, this.layoutId)
                return
            }
        }
        if (this.recordAssociationObject['selectionType'] === 'multiple') {
            return;
        }
        let selectedData = await this.fetchAdditionalData(item, 'single');
        this.parentPage.multiLookupResponse(this.recordAssociationObject, [selectedData], this.currentObjectId);
        this.dialogRef.close();
    }
    async fetchAdditionalData(selectedData: any,selectionType) {
        if (this.lookupInput && this.lookupInput['additionalDataHierarchy']) {
            if(selectionType === 'single') {
                let id = selectedData['id']
                let singleDocResponse = await this.serviceObject.querySingleDoc(this.lookupInput['additionalDataHierarchy'], id)
                if (singleDocResponse['status'] == 'SUCCESS' && singleDocResponse['records'] && singleDocResponse['records'].length > 0) {
                    selectedData = singleDocResponse['records'][0];
                }
                return selectedData;
            } else if(selectionType === 'multiple' && Array.isArray(selectedData)) {
                let selectedRecordIds = selectedData.map(element => {
                    return element['id']
                })
                const bulkRecordsResponse = await this.serviceObject.queryBulkDocs(this.lookupInput['additionalDataHierarchy'], selectedRecordIds)
                let fetchedBulkRecords = []
                if (bulkRecordsResponse['status'] == 'SUCCESS' && bulkRecordsResponse['records'] ) {
                    fetchedBulkRecords = bulkRecordsResponse['records'][0];
                }
                return fetchedBulkRecords
            } else {
                return selectedData
            }
        } else {
            return selectedData;
        }
    }
    closeButtonClick() {
        this.dialogRef.close();
        if (!this.isDisableManualclose) {
            this.parentPage.lookupErrorResponseHandling();
        }
    }

    onCancel() {
        this.items = this.allItems;
    }

    ngOnInit() {
        const popupsize = <HTMLElement>document.querySelector('.custom-dialog-container');
        popupsize.style.setProperty('--cust_height', 'calc(100vh - 25%)');
        popupsize.style.setProperty('--cust_width', 'calc(100vw - 62%)');
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
            } else if (queryField['fieldType'] === 'MULTISELECT' || queryField['fieldType'] === 'CHECKBOX' && item[queryField['fieldName']] !== undefined && item[queryField['fieldName']] !== "") {
                    const stateTypeList = item[queryField['fieldName']];
                    for (const element of stateTypeList) {
                        if (queryField['mappingDetails'][element]
                            && queryField['mappingDetails'][element].toString().toLowerCase().
                                indexOf(searchText.toLowerCase()) > -1) {
                            return true;
                        }
                    }
            } else if (queryField['fieldType'] === 'RADIO' || queryField['fieldType'] === 'DROPDOWN') {
                if (item[queryField['fieldName']] && item[queryField['fieldName']] !== "") {
                    if (queryField['mappingDetails'][item[queryField['fieldName']]]
                        && queryField['mappingDetails'][item[queryField['fieldName']]].toString().toLowerCase().
                            indexOf(searchText.toLowerCase()) > -1) {
                        return true;
                    }
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

    async done() {
        let data = this.angularGrid.gridService.getSelectedRowsDataItem()
        
        if (this.recordAssociationObject['limitation'] && data.length < this.recordAssociationObject['limitation']['minCount']) {
            this.appUtilityConfig.showInfoAlert("You should select minimum " + this.recordAssociationObject['limitation']['minCount'] + " records");
            return;
        }
        if (this.recordAssociationObject['limitation'] && data.length > this.recordAssociationObject['limitation']['maxCount']) {
            this.appUtilityConfig.showInfoAlert("You can select maximum  " + this.recordAssociationObject['limitation']['maxCount']  + " records");
            return;
        }
       
        let selectedData = await this.fetchAdditionalData(data, 'multiple');
        this.parentPage.multiLookupResponse(this.recordAssociationObject, selectedData, this.currentObjectId);
        this.dialogRef.close();
    }    
}
