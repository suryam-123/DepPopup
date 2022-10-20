import { Injectable } from "@angular/core";
import { objectTableMapping } from "../pfmmapping/objectTableMapping";
import { cspfmCustomFieldProvider } from "../utils/cspfmCustomFieldProvider";
import { dataProvider } from "../utils/dataProvider";
import { onlineDbIndexCreation } from "../utils/onlineDbIndexCreation";
import * as lodash from 'lodash';
import { appUtility } from "../utils/appUtility";
import { cspfmSlickgridUtils } from "../dynapageutils/cspfmSlickgridUtils";
import { AssignmentObject, RecordAssignment } from "../models/cspfmRecordAssignment.type";
import { AngularGridInstance, Column, ExtensionName, Filters, GridOption, MenuCommandItemCallbackArgs, OnEventArgs, OperatorType } from "angular-slickgrid";
import { TranslateService } from "@ngx-translate/core";
import { cspfmSlickGridFormatter } from "./cspfmSlickGridFormatter";
import * as moment from "moment";
import { appConstant } from "../utils/appConstant";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { cspfmAlertDialog } from "../components/cspfmAlertDialog/cspfmAlertDialog";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { cspfmWebworker } from "../services/cspfmWebworker.service";
import { START } from "./cspfmAssignmentSelection.script";
import { HttpClient } from "@angular/common/http";
import { cspfmLookupCriteriaUtils } from "../utils/cspfmLookupCriteriaUtils";

@Injectable({
    providedIn: "root"
})
export class cspfmRecordAssignmentUtils {

    private isDebugEnabled = false;
    private arrayChunkLimit: number = 2;
    private selectionMode: 'All' | 'Filtered' | 'Paginated' = 'Paginated';
    private batchLimit: number = 1000;
    public inputUrl: string
    constructor(private dataProvider: dataProvider, private onlineIndxCreation: onlineDbIndexCreation,
        private appUtilityObject: appUtility, private translateService: TranslateService,
        private slickGridUtils: cspfmSlickgridUtils, public dialog: MatDialog,
        private router: Router, private objectTableMapping: objectTableMapping,
        private loadingCtrl: LoadingController,private httpClient:HttpClient,
        private cspfmCustomFieldProviderObject: cspfmCustomFieldProvider,
        private lookupCriteriaUtils: cspfmLookupCriteriaUtils,
        private webWorker: cspfmWebworker) {

    }

    private paginationInfo = {
        bookmark: {
            0: ''
        },
        currentPageIndex: 0,
        enabled: true,
        nextBadgeDisabled: false,
        pagesCount: 0,
        total_rows: 0,
        view: {
            itemCount: '200',
            itemPerPage: ['10', '20', '25', '50', '75', '100', '200', '500', '1000', '2000']
        }
    };

    public resetPagination(recordAssignment: RecordAssignment) {
        recordAssignment['primaryObject']['internalProcess']['pagination'] = lodash.cloneDeep(this.paginationInfo);
        if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
            recordAssignment['secondaryObject']['internalProcess']['pagination'] = lodash.cloneDeep(this.paginationInfo);
        } else {
            lodash.forEach(recordAssignment['secondaryObject'], object => {
                object['internalProcess']['pagination'] = lodash.cloneDeep(this.paginationInfo);
            });
        }
    }

    public async assignInternalProcessData(recordAssignment: RecordAssignment, layoutId: string) {
        try {
            recordAssignment['extras'] = {
                assignmentData: {},
                unAssignmentData: {},
                saveButtonClicked: false,
                temp: {
                    assignmentData: {},
                    unAssignmentData: {},
                }
            }
            recordAssignment['primaryObject']['internalProcess'] = {
                displayColumns: [],
                angularGrid: null,
                gridContainerId: 'cspfm_grid_container_' + layoutId + '_' + recordAssignment['primaryObject']['objectId'],
                gridId: 'cspfm_grid_' + layoutId + '_' + recordAssignment['primaryObject']['objectId'],
                isLoading: true,
                gridOption: {},
                pagination: lodash.cloneDeep(this.paginationInfo),
                extras: {}
            }
            recordAssignment['primaryObject']['internalProcess']['gridOption'] = this.getGridOptions(recordAssignment['primaryObject']);
            recordAssignment['primaryObject']['layoutId'] = layoutId;
            recordAssignment['primaryObject']['internalProcess']['displayColumns'] = this.makeAssignmentSlickGridColumns(recordAssignment['primaryObject']);
            recordAssignment['primaryObject']['internalProcess']['displayColumns'] = [...recordAssignment['primaryObject']['internalProcess']['displayColumns']];
            if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
                this.internalData(recordAssignment, layoutId, recordAssignment['secondaryObject'])
            } else {
                lodash.forEach(recordAssignment['secondaryObject'], object => {
                    this.internalData(recordAssignment, layoutId, object)
                })
            }

            this.setColumnWidth(recordAssignment);
            if (recordAssignment['assignmentMode'] === 'ONE_TO_ANY') {
                recordAssignment['selectedSecondaryObject'] = recordAssignment['secondaryObject'][0]['objectId']
                recordAssignment['extras']['selectedSecondaryObject'] = recordAssignment['secondaryObject'][0]['objectId']
            }

            await this.httpClient.get('assets/lib/lodash.min.js', {
                responseType: 'text'
            }).toPromise().then((response) => {
                    var encodedStringBtoA = new Blob([response.toString()], {
                        type: 'text/javascript'
                    });
                    this.inputUrl = URL.createObjectURL(encodedStringBtoA);
                })

        } catch (err) {
            this.writeConsole('Error', this.constructor.name, 'assignInternalProcessData', err);
        }
    }

    private internalData(recordAssignment: RecordAssignment, layoutId: string, assignmentObject: AssignmentObject) {
        assignmentObject['internalProcess'] = {
            displayColumns: [],
            angularGrid: null,
            gridContainerId: 'cspfm_grid_container_' + layoutId + '_' + assignmentObject['objectId'],
            gridId: 'cspfm_grid_' + layoutId + '_' + assignmentObject['objectId'],
            isLoading: true,
            gridOption: {},
            pagination: lodash.cloneDeep(this.paginationInfo),
            extras: {}
        }
        assignmentObject['internalProcess']['gridOption'] = this.getGridOptions(assignmentObject);
        assignmentObject['layoutId'] = layoutId;
        assignmentObject['internalProcess']['displayColumns'] = this.makeAssignmentSlickGridColumns(assignmentObject, recordAssignment['primaryObject']);
        assignmentObject['internalProcess']['displayColumns'] = [...assignmentObject['internalProcess']['displayColumns']];
        recordAssignment['extras']['temp']['assignmentData'][assignmentObject['associationField']] = {}
        recordAssignment['extras']['temp']['unAssignmentData'][assignmentObject['associationField']] = {}

        recordAssignment['extras']['assignmentData'][assignmentObject['associationField']] = []
        recordAssignment['extras']['unAssignmentData'][assignmentObject['associationField']] = []
    }

    public setColumnWidth(recordAssignment: RecordAssignment) {
        try {
            this.appUtilityObject.setColumnWidth(recordAssignment.primaryObject['internalProcess']['displayColumns'])
            if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
                this.appUtilityObject.setColumnWidth(recordAssignment.secondaryObject['internalProcess']['displayColumns'])
            } else {
                this.appUtilityObject.setColumnWidth(recordAssignment.primaryObject['internalProcess']['displayColumns'])
                lodash.forEach(recordAssignment['secondaryObject'], object => {
                    this.appUtilityObject.setColumnWidth(object['internalProcess']['displayColumns'])
                })
            }
        } catch (err) {
            this.writeConsole('Error', this.constructor.name, "setColumnWidth", err);
        }
    }

    public async processAssignmentData(recordAssignment: RecordAssignment) {
        try {
            let taskList = [];

            recordAssignment['extras']['isLoading'] = true;

            recordAssignment['primaryObject']['internalProcess']['isLoading'] = true;
            recordAssignment['primaryObject']['data'] = [];
            recordAssignment['primaryObject']['dataTemp'] = [];
            taskList.push(this.initiateFetch(recordAssignment.primaryObject).then(res => {
                recordAssignment['primaryObject']['internalProcess']['isLoading'] = false;
                this.updatePrimaryAssignmentStatus(recordAssignment)
            }))

            if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
                recordAssignment['secondaryObject']['internalProcess']['isLoading'] = true;
                recordAssignment['secondaryObject']['data'] = [];
                recordAssignment['secondaryObject']['dataTemp'] = [];
                taskList.push(this.initiateFetch(recordAssignment.secondaryObject).then(res => {
                    recordAssignment['secondaryObject']['internalProcess']['isLoading'] = false;
                    this.updateSecondaryAssignmentStatus(recordAssignment.secondaryObject);
                }))
            } else {
                lodash.forEach(recordAssignment['secondaryObject'], object => {
                    object['internalProcess']['isLoading'] = true;
                    object['data'] = [];
                    object['dataTemp'] = [];
                    taskList.push(this.initiateFetch(object).then(res => {
                        object['internalProcess']['isLoading'] = false;
                        this.updateSecondaryAssignmentStatus(object)
                    }));
                })
            }
            return Promise.all(taskList).then(res => {
                recordAssignment['extras']['isLoading'] = false;
                this.changeSelectionHeaderCursor(recordAssignment);
            });
        } catch (err) {
            this.writeConsole('Error', this.constructor.name, 'processAssignmentData', err);
        }
    }

    private updateSecondaryAssignmentStatus(secondaryObject: AssignmentObject) {
        lodash.map(secondaryObject['data'], (item) => {
            if (!item['assignment__s']) {
                item['assignment__s'] = {}
                item['assignment_status__s'] = 'Unassigned';
            }
            if (!item['assignment__s'][secondaryObject['objectId']]) {
                item['assignment__s'][secondaryObject['objectId']] = {}
            }
        })
        this.filterAssignmentData(secondaryObject, secondaryObject['filteredBy'])
    }
    private resetSecondaryAssignmentStatus(secondaryObject: AssignmentObject) {
        lodash.map(secondaryObject['data'], (item) => {
            item['assignment__s'] = {}
            item['assignment_status__s'] = 'Unassigned';
            item['assignment__s'][secondaryObject['objectId']] = {}
            item['assignment__s'][secondaryObject['objectId']]['records'] = {
                'alreadyAssigned': [],
                'currentlyAssigned': [],
                'currentlyUnassigned': []
            }
        })
        this.filterAssignmentData(secondaryObject, secondaryObject['filteredBy'])
    }

    private updatePrimaryAssignmentStatus(recordAssignment: RecordAssignment) {

        if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {

            lodash.map(recordAssignment.primaryObject.data, (item) => {
                if (!item['assignment__s']) {
                    item['assignment__s'] = {}
                    item['assignment_status__s'] = 'Unassigned';
                    item['assigned_records__s'] = {}
                }
                if (!item['assignment__s'][recordAssignment['secondaryObject']['objectId']]) {
                    item['assignment__s'][recordAssignment['secondaryObject']['objectId']] = {}
                }
                if (!item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']) {
                    item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records'] = {
                        'alreadyAssigned': [],
                        'currentlyAssigned': [],
                        'currentlyUnassigned': []
                    }
                }
                if (!item[recordAssignment.secondaryObject.associationField]) {
                    return item;
                }

                let records = item[recordAssignment.secondaryObject.associationField].map(item => item['id']);
                if (item[recordAssignment.secondaryObject.associationField] && item[recordAssignment.secondaryObject.associationField].length > 0) {
                    item['assignment_status__s'] = 'Assigned';
                }
                if (item['assignment__s'][recordAssignment['secondaryObject']['objectId']]) {
                    item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'] = lodash.uniq(lodash.concat(item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'], records));
                } else {
                    item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'] = records
                }
                return item;
            })
        } else {
            let secondaryObjects = recordAssignment.secondaryObject;
            lodash.forEach(secondaryObjects, secondaryObject => {
                lodash.map(recordAssignment.primaryObject.data, (item) => {
                    if (!item['assignment__s']) {
                        item['assignment__s'] = {}
                        item['assignment_status__s'] = 'Unassigned';
                        item['assigned_records__s'] = {}
                    }
                    if (!item['assignment__s'][secondaryObject['objectId']]) {
                        item['assignment__s'][secondaryObject['objectId']] = {}
                    }
                    if (!item['assignment__s'][secondaryObject['objectId']]['records']) {
                        item['assignment__s'][secondaryObject['objectId']]['records'] = {
                            'alreadyAssigned': [],
                            'currentlyAssigned': [],
                            'currentlyUnassigned': []
                        }
                    }


                    if (!item[secondaryObject['associationField']]) {
                        return item;
                    }
                    let records = item[secondaryObject['associationField']].map(item => item['id']);
                    if (item[secondaryObject['associationField']] && item[secondaryObject['associationField']].length > 0) {
                        item['assignment_status__s'] = 'Assigned';
                    }
                    if (item['assignment__s'][secondaryObject['objectId']]) {
                        item['assignment__s'][secondaryObject['objectId']]['records']['alreadyAssigned'] = lodash.uniq(lodash.concat(item['assignment__s'][secondaryObject['objectId']]['records']['alreadyAssigned'], records));
                    } else {
                        item['assignment__s'][secondaryObject['objectId']]['records']['alreadyAssigned'] = records
                    }
                    return item;
                })
            })
        }
        this.filterAssignmentData(recordAssignment.primaryObject, recordAssignment.primaryObject.filteredBy)
    }

    public filterAssignmentData(assignmentObject: AssignmentObject, filteredBy: 'Assigned' | 'Unassigned' | 'All') {
        let searchTerms = [];

        if (filteredBy === 'Assigned') {
            searchTerms.push('Assigned')
            searchTerms.push('Partial')
        } else if (filteredBy === 'Unassigned') {
            searchTerms.push('Unassigned')
        } else {
            searchTerms.push('Assigned')
            searchTerms.push('Partial')
            searchTerms.push('Unassigned')
        }
        let localFilters = assignmentObject.internalProcess.angularGrid.filterService.getCurrentLocalFilters();
        if (localFilters.length > 0) {
            let assignmentStatusFilter = localFilters.filter(localFilter => localFilter['columnId'] === 'cspfm_assignment_checkbox')
            if (assignmentStatusFilter && assignmentStatusFilter.length > 0) {
                assignmentStatusFilter[0]['searchTerms'] = searchTerms;
            }
        } else {
            localFilters.push({ 'columnId': 'cspfm_assignment_checkbox', 'searchTerms': searchTerms })
        }

        assignmentObject.internalProcess.angularGrid.filterService.updateFilters(localFilters)

        assignmentObject['filteredBy'] = filteredBy;
        assignmentObject['data'] = [...assignmentObject['data']]
        this.writeConsole('Info', this.constructor.name, "assignmentObject['data']", assignmentObject['data']);

    }

    public getGridOptions(assignmentObject: AssignmentObject): GridOption {
        return {
            enableEmptyDataWarningMessage: false,
            enableAutoSizeColumns: false,
            autoFitColumnsOnFirstLoad: false,
            autoCommitEdit: true,
            enablePagination: true,
            pagination: {  // Pagination UI - Item per page select options for default pagination
                pageSizes: [2, 5, 10, 15, 20, 25, 50, 75, 100, 200, 500, 1000, 2000],
                pageSize: 50
            },
            autoEdit: false,
            rowHeight: 40,
            headerRowHeight: 40,
            enableCellNavigation: true,
            editable: true,
            enableAutoResize: true,
            enableSorting: true,
            enableFiltering: true,
            enableExcelExport: true,
            enableExport: true,
            i18n: this.translateService,
            enableColumnPicker: false,
            enableHeaderButton: false,
            gridMenu: {
                hideExportExcelCommand: true,
                hideExportCsvCommand: true,
                onCommand: (e: Event, args: MenuCommandItemCallbackArgs) => {
                    if (args['command'] === 'clear-filter') {
                        this.filterAssignmentData(assignmentObject, assignmentObject['filteredBy'])
                    }
                }
                //  customItems: [{
                //      command: "cspfm-excel-export",
                //      titleKey: "EXPORT_TO_EXCEL",
                //      iconCssClass: "fa fa-file-excel-o",
                //      action: (event, callbackArgs) => {
                //          // this.excelExport(event, callbackArgs)
                //      }
                //  }, {
                //      command: "cspfm-csv-export",
                //      titleKey: "EXPORT_TO_CSV",
                //      iconCssClass: "fa fa-download",
                //      action: (event, callbackArgs) => {
                //          // this.excelExport(event, callbackArgs)
                //      }
                //  },
                //  { divider: true, command: '', positionOrder: 90 },
                //  {
                //      command: "cspfm-toggle-pagination",
                //      titleKey: "Toggle pagination",
                //      iconCssClass: "fa fa-bookmark",
                //      action: (event, callbackArgs) => {
                //          this.slickGridUtils.togglePagination(event, callbackArgs, assignmentObject['internalProcess']['angularGrid']['slickGrid'], assignmentObject['internalProcess']['angularGrid'])
                //      },
                //      positionOrder: 94
                //  },
                //  {
                //      command: "cspfm-groupby",
                //      titleKey: "Group-by",
                //      iconCssClass: "icon-mat-account_tree",
                //      action: (event, callbackArgs) => {
                //          this.slickGridUtils.openDraggableGroupingRow({ onGroupByEnabled: false }, assignmentObject['internalProcess']['angularGrid']['slickGrid'])
                //      },
                //      positionOrder: 95
                //  }, {
                //      command: "cspfm-clear-groupby",
                //      titleKey: "Clear Grouping",
                //      iconCssClass: "fa fa-times",
                //      // action: (event, callbackArgs) => {
                //      //     this.clearGrouping(this.__staff$tableName)
                //      // },
                //      positionOrder: 96
                //  }
                //  ]
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
                containerId: assignmentObject['internalProcess']['gridContainerId'],
                calculateAvailableSizeBy: 'container'
            },
            exportOptions: {
                exportWithFormatter: true
            },
            excelExportOptions: {
                exportWithFormatter: true,
            },
            enableTranslate: true,
            presets: {
                filters: [{
                    columnId: 'cspfm_assignment_checkbox',
                    operator: OperatorType.inContains,
                    searchTerms: assignmentObject.filteredBy === 'Assigned' ? ['Assigned', 'Partial'] : (assignmentObject.filteredBy === 'Unassigned' ? ['Unassigned'] : [])
                }],
            },
            enableDraggableGrouping: true,
            createPreHeaderPanel: true,
            showPreHeaderPanel: false,
            showHeaderRow: true,
            preHeaderPanelHeight: 40,
            draggableGrouping: {
                dropPlaceHolderText: 'Drop a column header here to group by the column',
                deleteIconCssClass: 'fa fa-times',
               
            },
        }
    }

    async initiateFetch(assignmentObject: AssignmentObject) {
        if (Object.keys(assignmentObject['layoutDataRestrictionSet']['criteriaQuery']).length > 0) {
            return this.checkRelationalObjectsAndContinueFetch(assignmentObject)
        } else {
            return this.fetchAssignmentData(assignmentObject);
        }
    }

    async checkRelationalObjectsAndContinueFetch(assignmentObject: AssignmentObject) {
        const configObject = {
            'layoutCriteriaQueryConfig': assignmentObject['layoutDataRestrictionSet']['criteriaQuery'],
            'listCriteriaDataObject': {}
        }
        if (assignmentObject['layoutDataRestrictionSet']['criteriaQuery']['relationalObjects'] && assignmentObject['layoutDataRestrictionSet']['criteriaQuery']['relationalObjects'].length > 0) {
            return this.lookupCriteriaUtils.getRelationalObjectValues(configObject).then(res => {
                assignmentObject['internalProcess']['extras']['layoutCriteriaRelationalObjectIds'] = configObject['relationalObjectsResult']
                return this.makeQueryAndStartFetch(assignmentObject)
            })
        } else {
            return this.makeQueryAndStartFetch(assignmentObject)
        }
    }

    makeQueryAndStartFetch(assignmentObject: AssignmentObject) {
        const configObject = {
            'layoutCriteriaQueryConfig': assignmentObject['layoutDataRestrictionSet']['criteriaQuery'],
            'listCriteriaDataObject': {}
        }
        if (assignmentObject['internalProcess']['extras']['layoutCriteriaRelationalObjectIds'] && Object.keys(assignmentObject['internalProcess']['extras']['layoutCriteriaRelationalObjectIds']).length > 0) {
            var taskList = [];
            let idArray = []
            let keys = Object.keys(assignmentObject['internalProcess']['extras']['layoutCriteriaRelationalObjectIds']);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = lodash.chunk(assignmentObject['internalProcess']['extras']['layoutCriteriaRelationalObjectIds'][key], this.batchLimit);
                idArray.push(value)
            }
            let result = this.lookupCriteriaUtils.getCombinationIds(idArray);

            for (let j = 0; j < result.length; j++) {
                let ids = result[j]
                let tempConfig = {}
                for (let m = 0; m < ids.length; m++) {
                    tempConfig[keys[m]] = ids[m]
                }
                configObject['relationalObjectsResult'] = tempConfig;
                assignmentObject['internalProcess']['extras']['layoutCriteriaQuery'] = this.lookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject);

                taskList.push(this.fetchAssignmentData(assignmentObject))
            }
            return Promise.all(taskList).then(result => {
                return result
            })
        } else {
            if (!assignmentObject['internalProcess']['extras']['layoutCriteriaQuery']) {
                assignmentObject['layoutDataRestrictionSet']['criteriaQuery']['relationalObjectResults'] = assignmentObject['internalProcess']['extras']['layoutCriteriaRelationalObjectIds'];
                assignmentObject['internalProcess']['extras']['layoutCriteriaQuery'] = this.lookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject)
            }
            return this.fetchAssignmentData(assignmentObject)
        }
    }

    private async fetchAssignmentData(assignmentObject: AssignmentObject) {
        if (!this.onlineIndxCreation.isAllSearchIndexCompleted) {
            return
        }
        const fetchParams = {
            'objectHierarchyJSON': assignmentObject.hierarchy,
            'layoutDataRestrictionSet': assignmentObject['layoutDataRestrictionSet']['user'],
            'dataSource': assignmentObject.dataSource,
            pagination: {
                limit: assignmentObject['internalProcess']['pagination']['view']['itemCount'],
                offset: assignmentObject['internalProcess']['pagination']['currentPageIndex'] * Number(assignmentObject['internalProcess']['pagination']['view']['itemCount']),
                bookmark: ""
            }
        }
        if (assignmentObject['internalProcess']['pagination']['bookmark'][assignmentObject['internalProcess']['pagination']['currentPageIndex']]) {
            fetchParams['pagination']['bookmark'] = assignmentObject['internalProcess']['pagination']['bookmark'][assignmentObject['internalProcess']['pagination']['currentPageIndex']];
        }


        fetchParams['searchListQuery'] = "type:" + this.objectTableMapping.mappingDetail[assignmentObject.hierarchy['objectName']]
        if (fetchParams['searchListQuery'] && assignmentObject['internalProcess']['extras']['layoutCriteriaQuery']) {
            fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND ' + assignmentObject['internalProcess']['extras']['layoutCriteriaQuery']
        }
        return this.dataProvider.fetchDataFromDataSource(fetchParams).then(res => {
            this.writeConsole('Info', this.constructor.name, "Search response :", res);
            if (res['status'] === 'SUCCESS') {

                assignmentObject['internalProcess']['pagination']['bookmark'][assignmentObject['internalProcess']['pagination']['currentPageIndex'] + 1] = res['bookmark'];

                if (res['total_rows']) {
                    assignmentObject['internalProcess']['pagination']['total_rows'] = res['total_rows']
                } else {
                    assignmentObject['internalProcess']['pagination']['total_rows'] = 0;
                }

                if (assignmentObject['internalProcess']['pagination']['total_rows'] > 0) { // Pagination UI - Pages info updated
                    if (assignmentObject['internalProcess']['pagination']['total_rows'] < Number(assignmentObject['internalProcess']['pagination']['view']['itemCount'])) {
                        assignmentObject['internalProcess']['pagination']['pagesCount'] = 1
                    } else {
                        let modulusValue = assignmentObject['internalProcess']['pagination']['total_rows'] % Number(assignmentObject['internalProcess']['pagination']['view']['itemCount'])
                        if (modulusValue === 0) {
                            assignmentObject['internalProcess']['pagination']['pagesCount'] = assignmentObject['internalProcess']['pagination']['total_rows'] / Number(assignmentObject['internalProcess']['pagination']['view']['itemCount'])
                        } else {
                            assignmentObject['internalProcess']['pagination']['pagesCount'] = (assignmentObject['internalProcess']['pagination']['total_rows'] - modulusValue) / Number(assignmentObject['internalProcess']['pagination']['view']['itemCount']) + 1
                        }
                    }
                }

                if (res['records'].length > 0) {
                    if (res["records"].length < assignmentObject['internalProcess']['pagination']['view']['itemCount']) {
                        assignmentObject['internalProcess']['pagination']['nextBadgeDisabled'] = true;
                    } else {
                        assignmentObject['internalProcess']['pagination']['nextBadgeDisabled'] = false;
                    }

                    res['records'] = this.cspfmCustomFieldProviderObject.makeSlickGridCustomFields(res['records'], assignmentObject['internalProcess']['displayColumns'])
                    if (assignmentObject.dataFetchMode === 'Batch') {
                        assignmentObject.data = [...assignmentObject.data, ...res['records']]
                    } else {
                        if (!assignmentObject['internalProcess']['dataTemp']) {
                            assignmentObject['internalProcess']['dataTemp'] = [];
                        }
                        assignmentObject['internalProcess']['dataTemp'] = [...assignmentObject['internalProcess']['dataTemp'], ...res['records']]
                    }

                    if (res['records'].length <= Number(assignmentObject['internalProcess']['pagination']['view']['itemCount'])) {
                        if (assignmentObject.dataFetchMode === "Batch" && assignmentObject['internalProcess']['pagination']['view']['itemCount'] !== "2000") {
                            assignmentObject['internalProcess']['pagination']['view']['itemCount'] = "2000";
                        }
                        assignmentObject['internalProcess']['pagination']['currentPageIndex'] = assignmentObject['internalProcess']['pagination']['currentPageIndex'] + 1;
                        return this.initiateFetch(assignmentObject)
                    }
                } else {
                    if (assignmentObject.dataFetchMode === 'Full') {
                        assignmentObject.data = [...assignmentObject['internalProcess']['dataTemp']]
                    }
                    assignmentObject['internalProcess']['angularGrid'].resizerService.resizeGrid()
                    return {
                        'status': res['status'],
                        'message': res['message'],
                        'records': assignmentObject.data
                    }
                }
            } else {
                return {
                    'status': res['status'],
                    'message': res['message'],
                    'records': res['records']
                }
            }
        }).catch(error => {
            return {
                'status': "FAILED",
                'message': "",
                'paginationAction': "",
                'records': []
            }
        });
    }

    private processSecondaryDataOnPrimarySelectionChange(recordAssignment: RecordAssignment) {
        let checkedIds = recordAssignment.primaryObject.internalProcess.angularGrid.slickGrid['cspfm_selection_status'] && recordAssignment.primaryObject.internalProcess.angularGrid.slickGrid['cspfm_selection_status']['checked'] || [];
        let uncheckedIds = recordAssignment.primaryObject.internalProcess.angularGrid.slickGrid['cspfm_selection_status'] && recordAssignment.primaryObject.internalProcess.angularGrid.slickGrid['cspfm_selection_status']['unchecked'] || [];


        this.selectSecondaryData(recordAssignment, checkedIds)
    }

    private selectSecondaryData(recordAssignment: RecordAssignment, checkedIds: Array<string>) {

        if (recordAssignment.assignmentMode === 'ONE_TO_ONE') {
            this.deselectAllRows(recordAssignment.secondaryObject.internalProcess.angularGrid, 'All', false);

            let selectedPrimaryData = this.slickGridUtils.getDataByIds(recordAssignment.primaryObject.internalProcess.angularGrid, checkedIds)
            lodash.map(recordAssignment.secondaryObject.data, (item) => {
                item['assignment__s'] = {}
                item['assignment_status__s'] = 'Unassigned';
                item['assignment__s'][recordAssignment['secondaryObject']['objectId']] = {}
                item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records'] = {
                    'alreadyAssigned': [],
                    'currentlyAssigned': [],
                    'currentlyUnassigned': []
                }
                selectedPrimaryData.map(selectedItem => {
                    if (selectedItem['assignment__s'][recordAssignment['secondaryObject']['objectId']] && selectedItem['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records'] && selectedItem['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'] && selectedItem['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'].includes(item.id)) {
                        if (item['assignment__s'][recordAssignment['secondaryObject']['objectId']]) {
                            item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'] = lodash.uniq(lodash.concat(item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'], selectedItem['id']));
                        } else {
                            item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records'] = {
                                "alreadyAssigned": [selectedItem['id']],
                                "currentlyUnassigned": [],
                                "currentlyAssigned": []
                            }
                        }

                        this.writeConsole('Info', this.constructor.name, "alreadyAssigned", item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned']);
                        this.writeConsole('Info', this.constructor.name, "selectedPrimaryData", selectedPrimaryData);

                        if (item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'].length === selectedPrimaryData.length) {
                            item['assignment_status__s'] = 'Assigned';
                        } else {
                            item['assignment_status__s'] = 'Partial';
                        }

                        return item;
                    } else {
                        return item;
                    }
                })
            })


            recordAssignment.secondaryObject.data = [...recordAssignment.secondaryObject.data]
            this.writeConsole('Info', this.constructor.name, "recordAssignment.secondaryObject.data", recordAssignment.secondaryObject.data);

            let assignmentAvailableData = lodash.filter(recordAssignment.secondaryObject.data, (item) => {
                return item['assignment_status__s'] === 'Assigned' || item['assignment_status__s'] === 'Partial'
            })

            this.selectRowByData(recordAssignment.secondaryObject.internalProcess.angularGrid, assignmentAvailableData)


            recordAssignment.secondaryObject.internalProcess.angularGrid.dataView.sort((dataRow1, dataRow2) => {
                return (dataRow1['assignment_status__s'] > dataRow2['assignment_status__s']) ? 1 : (dataRow1['assignment_status__s'] < dataRow2['assignment_status__s'] ? -1 : 0)
            })
        } else {
            let selectedPrimaryData = this.slickGridUtils.getDataByIds(recordAssignment.primaryObject.internalProcess.angularGrid, checkedIds)
            let secondaryObjects = recordAssignment['secondaryObject'];
            lodash.forEach(secondaryObjects, secondaryObject => {
                this.deselectAllRows(secondaryObject.internalProcess.angularGrid, 'All', false);
                lodash.map(secondaryObject.data, (item) => {
                    item['assignment__s'] = {}
                    item['assignment_status__s'] = 'Unassigned';
                })
            })
            lodash.forEach(secondaryObjects, secondaryObject => {
                lodash.map(secondaryObject.data, (item) => {
                    if (!item['assignment__s'][secondaryObject['objectId']]) {
                        item['assignment__s'][secondaryObject['objectId']] = {}
                        item['assignment__s'][secondaryObject['objectId']]['records'] = {
                            'alreadyAssigned': [],
                            'currentlyAssigned': [],
                            'currentlyUnassigned': []
                        }
                    }
                    selectedPrimaryData.map(selectedItem => {
                        if (selectedItem['assignment__s'][secondaryObject['objectId']] && selectedItem['assignment__s'][secondaryObject['objectId']]['records'] && selectedItem['assignment__s'][secondaryObject['objectId']]['records']['alreadyAssigned'] && selectedItem['assignment__s'][secondaryObject['objectId']]['records']['alreadyAssigned'].includes(item.id)) {
                            if (item['assignment__s'][secondaryObject['objectId']]) {
                                item['assignment__s'][secondaryObject['objectId']]['records']['alreadyAssigned'] = lodash.uniq(lodash.concat(item['assignment__s'][secondaryObject['objectId']]['records']['alreadyAssigned'], selectedItem['id']));
                            } else {
                                item['assignment__s'][secondaryObject['objectId']]['records'] = {
                                    "alreadyAssigned": [selectedItem['id']],
                                    "currentlyUnassigned": [],
                                    "currentlyAssigned": []
                                }
                            }

                            this.writeConsole('Info', this.constructor.name, "alreadyAssigned", item['assignment__s'][secondaryObject['objectId']]['records']['alreadyAssigned']);
                            this.writeConsole('Info', this.constructor.name, "selectedPrimaryData", selectedPrimaryData);

                            if (item['assignment__s'][secondaryObject['objectId']]['records']['alreadyAssigned'].length === selectedPrimaryData.length) {
                                item['assignment_status__s'] = 'Assigned';
                            } else {
                                item['assignment_status__s'] = 'Partial';
                            }

                            return item;
                        } else {
                            return item;
                        }
                    })
                })


                secondaryObject.data = [...secondaryObject.data]
                this.writeConsole('Info', this.constructor.name, "recordAssignment.secondaryObject.data", secondaryObject.data);

                let assignmentAvailableData = lodash.filter(secondaryObject.data, (item) => {
                    return item['assignment_status__s'] === 'Assigned' || item['assignment_status__s'] === 'Partial'
                })

                this.selectRowByData(secondaryObject.internalProcess.angularGrid, assignmentAvailableData)


                secondaryObject.internalProcess.angularGrid.dataView.sort((dataRow1, dataRow2) => {
                    return (dataRow1['assignment_status__s'] > dataRow2['assignment_status__s']) ? 1 : (dataRow1['assignment_status__s'] < dataRow2['assignment_status__s'] ? -1 : 0)
                })
            })
        }
    }
    private deselectSecondaryData(recordAssignment: RecordAssignment, uncheckedIds: Array<string>) {

        if (recordAssignment.assignmentMode === 'ONE_TO_ONE') {
            let deselectedPrimaryData = this.slickGridUtils.getDataByIds(recordAssignment.primaryObject.internalProcess.angularGrid, uncheckedIds)
            lodash.map(recordAssignment.secondaryObject.data, (item) => {

                deselectedPrimaryData.map(deselectedItem => {
                    if (deselectedItem['assignment__s'][recordAssignment['secondaryObject']['objectId']] && deselectedItem['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records'] && deselectedItem['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records'] && deselectedItem['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records'].includes(item.id)) {
                        if (item['assignment__s'][recordAssignment['secondaryObject']['objectId']]) {
                            item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'] = lodash.uniq(lodash.concat(item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'], deselectedItem['id']));
                        } else {
                            item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records'] = {
                                "alreadyAssigned": [deselectedItem['id']],
                                "currentlyUnassigned": [],
                                "currentlyAssigned": []
                            }
                        }

                        this.writeConsole('Info', this.constructor.name, "alreadyAssigned", item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned']);
                        this.writeConsole('Info', this.constructor.name, "selectedPrimaryData", deselectedPrimaryData);

                        if (item['assignment__s'][recordAssignment['secondaryObject']['objectId']]['records']['alreadyAssigned'].length === deselectedPrimaryData.length) {
                            item['assignment_status__s'] = 'Assigned';
                        } else {
                            item['assignment_status__s'] = 'Partial';
                        }

                        return item;
                    } else {
                        return item;
                    }
                })
            })


            recordAssignment.secondaryObject.data = [...recordAssignment.secondaryObject.data]
            this.writeConsole('Info', this.constructor.name, "recordAssignment.secondaryObject.data", recordAssignment.secondaryObject.data);

            let assignmentAvailableData = lodash.filter(recordAssignment.secondaryObject.data, (item) => {
                return item['assignment_status__s'] === 'Assigned' || item['assignment_status__s'] === 'Partial'
            })

            this.selectRowByData(recordAssignment.secondaryObject.internalProcess.angularGrid, assignmentAvailableData)


            recordAssignment.secondaryObject.internalProcess.angularGrid.dataView.sort((dataRow1, dataRow2) => {
                return (dataRow1['assignment_status__s'] > dataRow2['assignment_status__s']) ? 1 : (dataRow1['assignment_status__s'] < dataRow2['assignment_status__s'] ? -1 : 0)
            })
        }
    }


    private makeAssignmentSlickGridColumns(assignmentObject: AssignmentObject, primaryAssignmentObject?: AssignmentObject): Array<Column> {
        let columns: Array<Column> = [];

        let style = '';
        if (!primaryAssignmentObject) {
            style = `style="cursor: not-allowed;"`
        }
        let checkboxColumn: Column = {
            id: 'cspfm_assignment_checkbox',
            field: 'selected__s',
            queryFieldFilter: 'assignment_status__s',
            excludeFromHeaderMenu: true,
            excludeFromGridMenu: true,
            name: `<button action-view='selection-checkbox' ${style} class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true">
         <em class="icon-mat-check_box_outline_blank"></em></button>`,
            toolTip: 'Select/Deselect All',
            nameKey: '',
            filterable: true,
            sortable: false,
            maxWidth: 100,
            minWidth: 100,
            filter: {
                collection: [
                    { value: 'Assigned', label: 'Assigned' },
                    { value: 'Unassigned', label: 'Unassigned' },
                    { value: 'Partial', label: 'Partial' }
                ],
                model: Filters.multipleSelect,
                operator: OperatorType.inContains
            },
            params: {
                primaryAssignmentObject: primaryAssignmentObject,
                assignmentObject: assignmentObject,
                columnWidth: 5
            },
            formatter: cspfmSlickGridFormatter.CheckboxFormatter,
            onCellClick: (mouseEvent, args) => {
                this.onSelectionCheckBoxClick(mouseEvent, args, primaryAssignmentObject);
            }
        }

        columns.push(checkboxColumn);
        columns = [...columns, ...this.slickGridUtils.makeColumnDefinition(assignmentObject['columnFieldInfo'], assignmentObject['layoutId'])]
        return columns;
    }

    private onSelectionCheckBoxClick(event: KeyboardEvent | MouseEvent, args: OnEventArgs, primaryAssignmentObject: AssignmentObject) {
        let parentElement = event && event.target && event.target['parentElement'] || undefined;
        let actionView = parentElement && parentElement.getAttribute('action-view') || undefined;
        if (actionView === 'selection-checkbox') {
            if (primaryAssignmentObject && (!primaryAssignmentObject['internalProcess']['angularGrid']['slickGrid']['cspfm_selection_status'] || primaryAssignmentObject['internalProcess']['angularGrid']['slickGrid']['cspfm_selection_status']['checked'].length === 0)) {
                return;
            }
            this.toggleSelectionData(args.grid, args.dataView, args.dataContext, true)
        }

    }

    private toggleSelectionData(slickGrid, dataView, dataContext, isUserClicked: boolean) {
        if (!slickGrid) {
            throw new Error(`Getting ${slickGrid} value for slick grid`)
        }
        let selectionCallbackData = {};


        if (isUserClicked) {
            let selectedIds = slickGrid['cspfm_selection_status'] && slickGrid['cspfm_selection_status']['checked'] || [];
            let preValidationData = {
                'type': selectedIds.includes(dataContext['id']) ? 'deselect' : 'select',
                'dataContext': dataContext,
                'selectedIds': selectedIds,
                'currentSelection': [dataContext['id']],
                'isUserClicked': isUserClicked
            }
            let preValidation = slickGrid['cspfm_custom_selection_pre_validation'](preValidationData);
            if (preValidation['status'] !== 'Allow') {
                this.appUtilityObject.showInfoAlert(preValidation['message'])
                return;
            }
        }

        selectionCallbackData['previousState'] = lodash.cloneDeep(slickGrid['cspfm_selection_status'])
        if (!slickGrid['cspfm_selection_status']) {
            slickGrid['cspfm_selection_status'] = {};
            slickGrid['cspfm_selection_status']['ids'] = {};
            slickGrid['cspfm_selection_status']['checked'] = [];
        }
        let currentModification = {
            checked: [],
            unchecked: []
        };
        if (slickGrid['cspfm_selection_status']['ids'][dataContext['id']] && slickGrid['cspfm_selection_status']['ids'][dataContext['id']] !== 'Unchecked') {
            dataContext['selected__s'] = false;
            slickGrid['cspfm_selection_status']['ids'][dataContext['id']] = 'Unchecked';
            if (!lodash.includes(currentModification['unchecked'], dataContext['id'])) {
                currentModification['unchecked'].push(dataContext['id'])
            }
            lodash.remove(slickGrid['cspfm_selection_status']['checked'], (item) => {
                return item === dataContext['id'];
            })
        } else {
            dataContext['selected__s'] = true;
            slickGrid['cspfm_selection_status']['ids'][dataContext['id']] = 'Checked';
            if (!lodash.includes(currentModification['checked'], dataContext['id'])) {
                currentModification['checked'].push(dataContext['id']);
            }
            if (!lodash.includes(slickGrid['cspfm_selection_status']['checked'], dataContext['id'])) {
                slickGrid['cspfm_selection_status']['checked'].push(dataContext['id']);
            }
        }

        selectionCallbackData['currentState'] = lodash.cloneDeep(slickGrid['cspfm_selection_status'])
        selectionCallbackData['currentModification'] = lodash.cloneDeep(currentModification)
        selectionCallbackData['isUserClicked'] = isUserClicked;

        this.changeSelectionHeader(slickGrid, dataView);
        slickGrid['cspfm_custom_selection_changed'](selectionCallbackData);

        dataView.beginUpdate();
        var value = dataView.getItemById(dataContext['id'])
        if (value) {
            dataView.updateItem(dataContext['id'], dataContext);
        }
        dataView.endUpdate();
    }

    private deselectAllRows(angularGrid: AngularGridInstance, whichData: 'All' | 'Filtered' | 'Paginated', isUserClicked: boolean) {
        if (!angularGrid) {
            throw new Error(`Getting ${angularGrid} value for angular grid`)
        }
        let selectionCallbackData = {};
        let selectedIds = [];
        if (whichData === 'Filtered') {
            selectedIds = this.slickGridUtils.getFilteredDataCustomSelectedIds(angularGrid);
        } else if (whichData === 'Paginated') {
            selectedIds = this.slickGridUtils.getPaginatedDataCustomSelectedIds(angularGrid);
        } else {
            selectedIds = this.slickGridUtils.getCustomSelectedIds(angularGrid);
        }

        if (isUserClicked) {
            let preValidationData = {
                'type': 'deselect-all',
                'whichData': whichData,
                'selectedIds': angularGrid.slickGrid['cspfm_selection_status'] && angularGrid.slickGrid['cspfm_selection_status']['checked'] || [],
                'currentSelection': selectedIds,
                'isUserClicked': isUserClicked
            }
            let preValidation = angularGrid.slickGrid['cspfm_custom_selection_pre_validation'](preValidationData);
            if (preValidation['status'] !== 'Allow') {
                this.appUtilityObject.showInfoAlert(preValidation['message'])
                return;
            }
        }

        selectionCallbackData['previousState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])

        if (!angularGrid.slickGrid['cspfm_selection_status']) {
            angularGrid.slickGrid['cspfm_selection_status'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['ids'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['checked'] = [];
        }
        let currentModification = {
            checked: [],
            unchecked: []
        };



        if (selectedIds.length > 0) {
            angularGrid.dataView.beginUpdate();
            let data = this.slickGridUtils.getDataByIds(angularGrid, selectedIds);
            for (let dataContext of data) {
                dataContext['selected__s'] = false;
                angularGrid.slickGrid['cspfm_selection_status']['ids'][dataContext['id']] = 'Unchecked';
                if (!lodash.includes(currentModification['unchecked'], dataContext['id'])) {
                    currentModification['unchecked'].push(dataContext['id'])
                }
                lodash.remove(angularGrid.slickGrid['cspfm_selection_status']['checked'], (item) => {
                    return item === dataContext['id'];
                })

                var value = angularGrid.dataView.getItemById(dataContext['id'])
                if (value) {
                    angularGrid.dataView.updateItem(dataContext['id'], dataContext);
                }
            }
            angularGrid.dataView.endUpdate();
        }

        selectionCallbackData['currentState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        selectionCallbackData['currentModification'] = lodash.cloneDeep(currentModification)
        selectionCallbackData['isUserClicked'] = isUserClicked

        this.changeSelectionHeader(angularGrid.slickGrid, angularGrid.dataView);
        angularGrid.slickGrid['cspfm_custom_selection_changed'](selectionCallbackData);
    }

    private selectAllRows(angularGrid: AngularGridInstance, whichData: 'All' | 'Filtered' | 'Paginated', isUserClicked: boolean) {
        if (!angularGrid) {
            throw new Error(`Getting ${angularGrid} value for angular grid`)
        }
        let data = [];
        if (whichData === 'Filtered') {
            data = this.slickGridUtils.getGridFilteredData(angularGrid);
        } else if (whichData === 'Paginated') {
            data = this.slickGridUtils.getGridPaginatedData(angularGrid);
        } else {
            data = this.slickGridUtils.getGridData(angularGrid);
        }
        let selectionCallbackData = {};
        if (isUserClicked) {
            let preValidationData = {
                'type': 'select-all',
                'whichData': whichData,
                'selectedIds': angularGrid.slickGrid['cspfm_selection_status'] && angularGrid.slickGrid['cspfm_selection_status']['checked'] || [],
                'currentSelection': data.map(item => item['id']),
                'isUserClicked': isUserClicked
            }
            let preValidation = angularGrid.slickGrid['cspfm_custom_selection_pre_validation'](preValidationData);
            if (preValidation['status'] !== 'Allow') {
                this.appUtilityObject.showInfoAlert(preValidation['message'])
                return;
            }
        }
        selectionCallbackData['previousState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        let currentModification = {
            checked: [],
            unchecked: []
        };

        angularGrid.dataView.beginUpdate();
        if (!angularGrid.slickGrid['cspfm_selection_status']) {
            angularGrid.slickGrid['cspfm_selection_status'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['ids'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['checked'] = [];
        }

        for (let dataContext of data) {
            dataContext['selected__s'] = true;
            angularGrid.slickGrid['cspfm_selection_status']['ids'][dataContext['id']] = 'Checked';
            if (!lodash.includes(currentModification['checked'], dataContext['id'])) {
                currentModification['checked'].push(dataContext['id']);
            }
            if (!lodash.includes(angularGrid.slickGrid['cspfm_selection_status']['checked'], dataContext['id'])) {
                angularGrid.slickGrid['cspfm_selection_status']['checked'].push(dataContext['id']);
            }

            var value = angularGrid.dataView.getItemById(dataContext['id'])
            if (value) {
                angularGrid.dataView.updateItem(dataContext['id'], dataContext);
            }
        }
        angularGrid.dataView.endUpdate();
        selectionCallbackData['currentState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        selectionCallbackData['currentModification'] = lodash.cloneDeep(currentModification)
        selectionCallbackData['isUserClicked'] = isUserClicked

        this.changeSelectionHeader(angularGrid.slickGrid, angularGrid.dataView);
        angularGrid.slickGrid['cspfm_custom_selection_changed'](selectionCallbackData);
    }

    private deselectRowByIds(angularGrid: AngularGridInstance, ids: Array<string>, isUserClicked: boolean) {
        let selectionCallbackData = {};
        selectionCallbackData['previousState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        let currentModification = {
            checked: [],
            unchecked: []
        };

        if (!angularGrid.slickGrid['cspfm_selection_status']) {
            angularGrid.slickGrid['cspfm_selection_status'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['ids'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['checked'] = [];
        }

        if (ids.length > 0) {
            angularGrid.dataView.beginUpdate();
            let data = this.slickGridUtils.getDataByIds(angularGrid, ids);
            lodash.forEach(data, (dataContext) => {
                dataContext['selected__s'] = false;
                angularGrid.slickGrid['cspfm_selection_status']['ids'][dataContext['id']] = 'Unchecked';
                if (!lodash.includes(currentModification['unchecked'], dataContext['id'])) {
                    currentModification['unchecked'].push(dataContext['id'])
                }
                lodash.remove(angularGrid.slickGrid['cspfm_selection_status']['checked'], (item) => {
                    return item === dataContext['id'];
                })

                var value = angularGrid.dataView.getItemById(dataContext['id'])
                if (value) {
                    angularGrid.dataView.updateItem(dataContext['id'], dataContext);
                }
            });
            angularGrid.dataView.endUpdate();
        }

        selectionCallbackData['currentState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        selectionCallbackData['currentModification'] = lodash.cloneDeep(currentModification)
        selectionCallbackData['isUserClicked'] = isUserClicked;

        this.changeSelectionHeader(angularGrid.slickGrid, angularGrid.dataView);
        angularGrid.slickGrid['cspfm_custom_selection_changed'](selectionCallbackData);
    }

    private selectRowByIds(angularGrid: AngularGridInstance, ids: Array<string>) {
        let selectionCallbackData = {};
        selectionCallbackData['previousState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])

        let currentModification = {
            checked: [],
            unchecked: []
        };

        angularGrid.dataView.beginUpdate();
        if (!angularGrid.slickGrid['cspfm_selection_status']) {
            angularGrid.slickGrid['cspfm_selection_status'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['ids'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['checked'] = [];
        }
        let data = this.slickGridUtils.getDataByIds(angularGrid, ids);
        lodash.forEach(data, (dataContext) => {
            dataContext['selected__s'] = true;
            angularGrid.slickGrid['cspfm_selection_status']['ids'][dataContext['id']] = 'Checked';
            if (!lodash.includes(currentModification['checked'], dataContext['id'])) {
                currentModification['checked'].push(dataContext['id'])
            }
            if (!lodash.includes(angularGrid.slickGrid['cspfm_selection_status']['checked'], dataContext['id'])) {
                angularGrid.slickGrid['cspfm_selection_status']['checked'].push(dataContext['id']);
            }

            var value = angularGrid.dataView.getItemById(dataContext['id'])
            if (value) {
                angularGrid.dataView.updateItem(dataContext['id'], dataContext);
            }
        });
        angularGrid.dataView.endUpdate();
        selectionCallbackData['currentState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        selectionCallbackData['currentModification'] = lodash.cloneDeep(currentModification)
        selectionCallbackData['isUserClicked'] = false;

        this.changeSelectionHeader(angularGrid.slickGrid, angularGrid.dataView);
        angularGrid.slickGrid['cspfm_custom_selection_changed'](selectionCallbackData);
    }

    private deselectRowByData(angularGrid: AngularGridInstance, data: Array<any>) {
        let selectionCallbackData = {};
        selectionCallbackData['previousState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        let currentModification = {
            checked: [],
            unchecked: []
        };

        if (!angularGrid.slickGrid['cspfm_selection_status']) {
            angularGrid.slickGrid['cspfm_selection_status'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['ids'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['checked'] = [];
        }

        if (data.length > 0) {
            angularGrid.dataView.beginUpdate();
            lodash.forEach(data, (dataContext) => {
                dataContext['selected__s'] = false;
                angularGrid.slickGrid['cspfm_selection_status']['ids'][dataContext['id']] = 'Unchecked';
                if (!lodash.includes(currentModification['unchecked'], dataContext['id'])) {
                    currentModification['unchecked'].push(dataContext['id'])
                }
                lodash.remove(angularGrid.slickGrid['cspfm_selection_status']['checked'], (item) => {
                    return item === dataContext['id'];
                })

                var value = angularGrid.dataView.getItemById(dataContext['id'])
                if (value) {
                    angularGrid.dataView.updateItem(dataContext['id'], dataContext);
                }
            });
            angularGrid.dataView.endUpdate();
        }

        selectionCallbackData['currentState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        selectionCallbackData['currentModification'] = lodash.cloneDeep(currentModification)
        selectionCallbackData['isUserClicked'] = false;

        this.changeSelectionHeader(angularGrid.slickGrid, angularGrid.dataView);
        angularGrid.slickGrid['cspfm_custom_selection_changed'](selectionCallbackData);
    }

    private selectRowByData(angularGrid: AngularGridInstance, data: Array<any>) {
        let selectionCallbackData = {};
        selectionCallbackData['previousState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        let currentModification = {
            checked: [],
            unchecked: []
        };

        if (!angularGrid.slickGrid['cspfm_selection_status']) {
            angularGrid.slickGrid['cspfm_selection_status'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['ids'] = {};
            angularGrid.slickGrid['cspfm_selection_status']['checked'] = [];
        }


        if (data.length > 0) {
            angularGrid.dataView.beginUpdate();
            lodash.forEach(data, (dataContext) => {
                dataContext['selected__s'] = true;
                angularGrid.slickGrid['cspfm_selection_status']['ids'][dataContext['id']] = 'Checked';
                if (!lodash.includes(currentModification['checked'], dataContext['id'])) {
                    currentModification['checked'].push(dataContext['id'])
                }
                if (!lodash.includes(angularGrid.slickGrid['cspfm_selection_status']['checked'], dataContext['id'])) {
                    angularGrid.slickGrid['cspfm_selection_status']['checked'].push(dataContext['id']);
                }

                var value = angularGrid.dataView.getItemById(dataContext['id'])
                if (value) {
                    angularGrid.dataView.updateItem(dataContext['id'], dataContext);
                }
            });
            angularGrid.dataView.endUpdate();
        }
        selectionCallbackData['currentState'] = lodash.cloneDeep(angularGrid.slickGrid['cspfm_selection_status'])
        selectionCallbackData['currentModification'] = lodash.cloneDeep(currentModification)
        selectionCallbackData['isUserClicked'] = false;

        this.changeSelectionHeader(angularGrid.slickGrid, angularGrid.dataView);
        angularGrid.slickGrid['cspfm_custom_selection_changed'](selectionCallbackData);
    }


    public angularGridReady(angularGrid: AngularGridInstance, assignmentObject: AssignmentObject, type: 'Primary' | 'Secondary', recordAssignment: RecordAssignment, tabInfo?: { tabGroupId: string, tabTitle: string }) {
        assignmentObject.internalProcess.angularGrid = angularGrid;
        setTimeout(() => {
            assignmentObject.internalProcess.angularGrid.slickGrid.setHeaderRowVisibility(false);
        }, 0);

        if (tabInfo) {
            let tabUniqueKey = tabInfo['tabGroupId'] + '_' + tabInfo['tabTitle']
            if (!recordAssignment['extras']) {
                recordAssignment['extras'] = {};
            }
            if (!recordAssignment['extras']['tabs']) {
                recordAssignment['extras']['tabs'] = {}
            }
            if (!recordAssignment['extras']['tabs'][tabUniqueKey]) {
                recordAssignment['extras']['tabs'][tabUniqueKey] = []
            }
            recordAssignment['extras']['tabs'][tabUniqueKey].push(assignmentObject['objectId'])
        }


        assignmentObject.internalProcess.angularGrid.slickGrid['cspfm_grid_custom_data'] = {
            "page_title_key": "institute_d_m_search_list.Layout.institute_d_m_search_list_web",
            "angular_grid_excel_export_service_instance": angularGrid.excelExportService,
            "angular_grid_export_service_instance": angularGrid.exportService,
            "isPaginationEnabled": assignmentObject.internalProcess.gridOption['enablePagination']
        }


        assignmentObject.internalProcess.angularGrid.filterService.onFilterChanged.subscribe(e => {
            this.writeConsole('Info', this.constructor.name, 'onFilterChanged', type, '-', e);
            this.changeSelectionHeader(assignmentObject['internalProcess']['angularGrid'].slickGrid, assignmentObject['internalProcess']['angularGrid'].dataView);
        })
        assignmentObject.internalProcess.angularGrid.slickGrid.onHeaderRowCellRendered.subscribe((e, args) => {
            if (args['column']['id'] === "cspfm_assignment_checkbox") {
                args['node']['hidden'] = true;
            }
        })
        assignmentObject.internalProcess.angularGrid.paginationService.onPaginationChanged.subscribe(e => {
            this.writeConsole('Info', this.constructor.name, 'onPaginationChanged', type, '-', e);
            this.changeSelectionHeader(assignmentObject['internalProcess']['angularGrid'].slickGrid, assignmentObject['internalProcess']['angularGrid'].dataView);
        })


        assignmentObject.internalProcess.angularGrid.slickGrid['cspfm_custom_selection_pre_validation'] = (event) => {
            this.writeConsole('Info', this.constructor.name, 'cspfm_custom_selection_pre_validation', event)

            if (event['type'] === 'select' || event['type'] === 'select-all') {
                let totalSelection = event['selectedIds'].length + event['currentSelection'].length;
                if (assignmentObject['limitation']['maximumSelection'] != null && totalSelection > assignmentObject['limitation']['maximumSelection']) {
                    return {
                        status: 'Restrict',
                        message: `Maximum limit has been reached ${assignmentObject['limitation']['maximumSelection']}.`
                    }
                }
            }

            if (recordAssignment['extras']['isLoading']) {
                return {
                    status: 'Restrict',
                    message: `Data fetching is in process. Please wait`
                }
            }

            if (type === 'Primary') {
                let isAnyRecordSelectedInSecondaryByUser = false;
                if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
                    if (isAnyRecordSelectedInSecondaryByUser === false) {
                        isAnyRecordSelectedInSecondaryByUser = (recordAssignment['extras']['assignmentData'][recordAssignment['secondaryObject']['associationField']].length > 0 || recordAssignment['extras']['unAssignmentData'][recordAssignment['secondaryObject']['associationField']].length > 0)
                    }
                } else {
                    if (recordAssignment['assignmentMode'] === 'ONE_TO_ANY') {
                        let associationFieldName = recordAssignment['secondaryObject'][0]['fieldName']
                        if (event['type'] === 'select-all') {
                            let previousObject = '';
                            let data = this.slickGridUtils.getDataByIds(angularGrid, event['currentSelection']);
                            let isdifferentassociationobject = data.some(element => {
                                if (element[associationFieldName] !== null) {
                                    let associationObject = this.objectTableMapping.mappingDetail[element[associationFieldName]]
                                    if (previousObject === '' || previousObject === associationObject) {
                                        previousObject = associationObject;
                                        return false;
                                    } else {
                                        return true
                                    }
                                }
                                return false;
                            })
                            if (isdifferentassociationobject === true) {
                                return {
                                    status: 'Restrict',
                                    message: `Few records does not having the assigned records for selected Object`
                                }
                            }
                        }else if (event['type'] === 'select') {
                            let selectedData = this.slickGridUtils.getDataByIds(angularGrid, event['selectedIds']);
                            let selectedAssignedData = selectedData.filter(data => {
                                return data["assignment_status__s"] === "Assigned"
                            })
                            if (selectedAssignedData.length > 0) {
                                let associationObject = this.objectTableMapping.mappingDetail[event['dataContext'][associationFieldName]]
                                if (associationObject !== undefined && associationObject !== recordAssignment['selectedSecondaryObject']) {
                                    return {
                                        status: 'Restrict',
                                        message: `Record not assigned for selected object`
                                    }
                                }
                            }
                        }
                    }
                    lodash.forEach(recordAssignment['secondaryObject'], secondaryObject => {
                        if (isAnyRecordSelectedInSecondaryByUser === false) {
                            isAnyRecordSelectedInSecondaryByUser = (recordAssignment['extras']['assignmentData'][secondaryObject['associationField']].length > 0 || recordAssignment['extras']['unAssignmentData'][secondaryObject['associationField']].length > 0)
                        }
                    })
                }
                if (isAnyRecordSelectedInSecondaryByUser) {
                    return {
                        status: 'Restrict',
                        message: 'Kindly save the existing assignment before select/deselect a primary assignment'
                    }
                }
            }
            return {
                status: 'Allow',
                message: ''
            }
        }

        assignmentObject.internalProcess.angularGrid.slickGrid['cspfm_custom_selection_changed'] = (event) => {
            this.writeConsole('Info', this.constructor.name, 'cspfm_custom_selection_changed', type, '-', event);
            this.customSelectionChanged(assignmentObject, type, recordAssignment, event);
        }




        assignmentObject.internalProcess.angularGrid.slickGrid.onHeaderClick.subscribe((event, args) => {
            let parentElement = event && event.target && event.target['parentElement'] || undefined;
            let actionView = parentElement && parentElement.getAttribute('action-view') || undefined;
            if (actionView === 'selection-checkbox' && args['column']['id'] === "cspfm_assignment_checkbox") {
                let primarySelectedRecord = this.slickGridUtils.getCustomSelectedIds(recordAssignment['primaryObject']['internalProcess']['angularGrid']);
                if (type === 'Secondary' && primarySelectedRecord.length === 0) {
                    return;
                }
                let selectedDataLength = 0;
                if (this.selectionMode === 'Filtered') {
                    selectedDataLength = this.slickGridUtils.getFilteredDataCustomSelectedIdsFromSlickGrid(assignmentObject['internalProcess']['angularGrid']['slickGrid'], assignmentObject['internalProcess']['angularGrid']['dataView']).length;
                } else if (this.selectionMode === 'Paginated') {
                    selectedDataLength = this.slickGridUtils.getPaginatedDataCustomSelectedIdsFromSlickGrid(assignmentObject['internalProcess']['angularGrid']['slickGrid'], assignmentObject['internalProcess']['angularGrid']['dataView']).length;
                } else {
                    selectedDataLength = this.slickGridUtils.getCustomSelectedIdsFromSlickGrid(assignmentObject['internalProcess']['angularGrid']['slickGrid']).length;
                }

                if (selectedDataLength > 0) {
                    this.deselectAllRows(assignmentObject['internalProcess']['angularGrid'], this.selectionMode, true);
                } else {
                    this.selectAllRows(assignmentObject['internalProcess']['angularGrid'], this.selectionMode, true)
                }
            }

        })

        var slickgridMenu = document.getElementsByClassName("slick-gridmenu-button");
        if (slickgridMenu[0]) {
            slickgridMenu[0]['title'] = "Grid menu";
        }

        var slickgridHeaderMenu = document.getElementsByClassName("slick-header-menubutton");
        if (slickgridHeaderMenu && slickgridHeaderMenu.length > 0) {
            for (let i = 0; i < slickgridHeaderMenu.length; i++) {
                slickgridHeaderMenu[i]['title'] = "Header menu";
            }
        }


        //Force fitting to screen size if the canvas length is lesser the window's innerWidth. For dynamic column width setting.
        if (assignmentObject.internalProcess.angularGrid.slickGrid.getCanvasWidth() < window.innerWidth) {
            assignmentObject.internalProcess.angularGrid.slickGrid.setOptions({
                enableAutoSizeColumns: true,
                autoFitColumnsOnFirstLoad: true,
            })
        }
    }

    private changeSelectionHeader(slickGrid, dataView) {
        let allDataLength = 0;
        let selectedDataLength = 0;
        if (this.selectionMode === 'Filtered') {
            allDataLength = this.slickGridUtils.getGridFilteredDataFromDataView(dataView).length;
            selectedDataLength = this.slickGridUtils.getFilteredDataCustomSelectedIdsFromSlickGrid(slickGrid, dataView).length;
        } else if (this.selectionMode === 'Paginated') {
            allDataLength = this.slickGridUtils.getGridPaginatedDataFromDataView(dataView).length;
            selectedDataLength = this.slickGridUtils.getPaginatedDataCustomSelectedIdsFromSlickGrid(slickGrid, dataView).length;
        } else {
            allDataLength = this.slickGridUtils.getGridDataFromDataView(dataView).length;
            selectedDataLength = this.slickGridUtils.getCustomSelectedIdsFromSlickGrid(slickGrid).length;
        }


        let checkboxIcon = 'icon-mat-check_box_outline_blank';
        if (selectedDataLength === 0) {
            checkboxIcon = 'icon-mat-check_box_outline_blank';
        } else if (allDataLength === selectedDataLength) {
            checkboxIcon = 'icon-mat-check_box';
        } else {
            checkboxIcon = 'icon-mat-indeterminate_check_box';
        }

        slickGrid.updateColumnHeader('cspfm_assignment_checkbox', `<button title="Select/Deselect All" action-view='selection-checkbox' class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true">
       <em class="${checkboxIcon}"></em></button>`)
    }

    private changeSelectionHeaderCursor(recordAssignment: RecordAssignment) {
        let primarySelectedRecord = this.slickGridUtils.getCustomSelectedIds(recordAssignment['primaryObject']['internalProcess']['angularGrid']);
        if (primarySelectedRecord.length === 0) {
            let style = `style="cursor: not-allowed;"`;
            if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
                recordAssignment['secondaryObject']['internalProcess']['angularGrid']['slickGrid'].updateColumnHeader('cspfm_assignment_checkbox', `<button title="Select/Deselect All" action-view='selection-checkbox' ${style} class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true"><em class="icon-mat-check_box_outline_blank"></em></button>`)
                recordAssignment['secondaryObject']['internalProcess']['angularGrid']['slickGrid'].invalidate();
            } else {
                lodash.forEach(recordAssignment['secondaryObject'], object => {
                    object['internalProcess']['angularGrid']['slickGrid'].updateColumnHeader('cspfm_assignment_checkbox', `<button title="Select/Deselect All" action-view='selection-checkbox' ${style} class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true"><em class="icon-mat-check_box_outline_blank"></em></button>`)
                    object['internalProcess']['angularGrid']['slickGrid'].invalidate();
                });
            }
        }
    }

    private customSelectionChanged(assignmentObject: AssignmentObject, type, recordAssignment: RecordAssignment, event) {
        if (event['isUserClicked']) {
            if (type === 'Primary') {
                if (recordAssignment['assignmentMode'] === 'ONE_TO_ANY') {
                    let associationFieldName = recordAssignment['secondaryObject'][0]['fieldName']
                    let selectedIds = this.slickGridUtils.getCustomSelectedIds(assignmentObject["internalProcess"]["angularGrid"]);
                    if (selectedIds.length > 0) {
                        let data = this.slickGridUtils.getDataByIds(assignmentObject["internalProcess"]["angularGrid"], selectedIds);
                        if (data[0]["assignment_status__s"] === "Assigned") {
                            let associationObject = this.objectTableMapping.mappingDetail[data[0][associationFieldName]]
                            recordAssignment['selectedSecondaryObject'] = associationObject;
                            recordAssignment['extras']['selectedSecondaryObject'] = associationObject;
                        }
                    }

                }
                this.processSecondaryDataOnPrimarySelectionChange(recordAssignment)
                this.changeSelectionHeaderCursor(recordAssignment);
            } else {
                this.callWebWorker(recordAssignment, assignmentObject, event);
            }
        }
    }

    private getAssignmentObjectWithPrimitiveType(assignmentObject: AssignmentObject): AssignmentObject {
        console.log("getAssignmentObjectWithPrimitiveType clone, start");


        let localAssignmentObject: AssignmentObject = {
            associationField: assignmentObject['associationField'],
            columnFieldInfo: [],
            fieldName: assignmentObject['fieldName'],
            data: [],
            dataFetchMode: assignmentObject['dataFetchMode'],
            dataSource: assignmentObject['dataSource'],
            filteredBy: assignmentObject['filteredBy'],
            hierarchy: assignmentObject['hierarchy'],
            layoutDataRestrictionSet: assignmentObject['layoutDataRestrictionSet'],
            limitation: {
                maximumSelection: assignmentObject['limitation']['maximumSelection'],
                minimumSelection: assignmentObject['limitation']['minimumSelection']
            },
            objectDisplayName: assignmentObject['objectDisplayName'],
            objectId: assignmentObject['objectId'],
            objectName: assignmentObject['objectName'],
            traversalPath: '',
            displayColumns: [],
        };
        return localAssignmentObject;
    }
    private async callWebWorker(recordAssignment: RecordAssignment, assignmentObject: AssignmentObject, event) {
        console.log("presentLoading, start");
        let loadingIndicator = await this.presentLoading('Preparing UI. Click save for permanent action.');
        console.log("presentLoading, end");

        let checkedIds = event['currentModification']['checked'];
        let uncheckedIds = event['currentModification']['unchecked'];

        let primaryCheckedIds = lodash.cloneDeep(recordAssignment['primaryObject']['internalProcess']['angularGrid']['slickGrid']['cspfm_selection_status']['checked'] || [])
        let primaryCheckedData = this.slickGridUtils.getDataByIds(recordAssignment['primaryObject']['internalProcess']['angularGrid'], primaryCheckedIds);

        const input = {};
        let localAssignmentObject: AssignmentObject = this.getAssignmentObjectWithPrimitiveType(assignmentObject);

        let localRecordAssignment: RecordAssignment;
        let secondaryObjectIndexMapping = {}
        console.log("local variable, start");
        if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
            localRecordAssignment = {
                'assignmentMode': recordAssignment['assignmentMode'],
                'associationDisplayName': recordAssignment['associationDisplayName'],
                'primaryObject': this.getAssignmentObjectWithPrimitiveType(recordAssignment['primaryObject']),
                'secondaryObject': this.getAssignmentObjectWithPrimitiveType(recordAssignment['secondaryObject']),
                'extras': recordAssignment['extras']
            };
        } else {
            if (recordAssignment['assignmentMode'] === 'ONE_TO_ANY') {
                localRecordAssignment = {
                    'assignmentMode': recordAssignment['assignmentMode'],
                    'associationDisplayName': recordAssignment['associationDisplayName'],
                    'primaryObject': this.getAssignmentObjectWithPrimitiveType(recordAssignment['primaryObject']),
                    'secondaryObject': [],
                    'extras': recordAssignment['extras'],
                    'selectedSecondaryObject': recordAssignment['selectedSecondaryObject']
                };
            } else {
                localRecordAssignment = {
                    'assignmentMode': recordAssignment['assignmentMode'],
                    'associationDisplayName': recordAssignment['associationDisplayName'],
                    'primaryObject': this.getAssignmentObjectWithPrimitiveType(recordAssignment['primaryObject']),
                    'secondaryObject': [],
                    'extras': recordAssignment['extras']
                };
            }


            lodash.forEach(recordAssignment['secondaryObject'], (secondaryObject, index) => {
                if (localRecordAssignment['assignmentMode'] !== 'ONE_TO_ONE') {
                    secondaryObjectIndexMapping[secondaryObject['objectId']] = index;
                    localRecordAssignment['secondaryObject'].push(this.getAssignmentObjectWithPrimitiveType(secondaryObject))
                }
            })
        }
        console.log("local variable, end");

        console.log("secondaryObjectIndexMapping", secondaryObjectIndexMapping);

        input['recordAssignment'] = localRecordAssignment;
        input['assignmentObject'] = localAssignmentObject;
        input['primaryCheckedIds'] = primaryCheckedIds;
        input['primaryCheckedData'] = primaryCheckedData;
        input['data'] = [];

        console.log("slickgrid data, start");
        if (uncheckedIds.length > 0) {
            input['selection'] = 'unchecked';
            input['data'] = this.slickGridUtils.getDataByIds(assignmentObject['internalProcess']['angularGrid'], uncheckedIds);
        } else {
            input['selection'] = 'checked';
            input['data'] = this.slickGridUtils.getDataByIds(assignmentObject['internalProcess']['angularGrid'], checkedIds);
        }
        console.log("slickgrid data, end");


        console.log("webWorker, start");
        input['url'] = this.inputUrl;
        this.webWorker
            .run(START, input)
            .then((res) => {
                console.log("webWorker, success");

                this.dismissLoading(loadingIndicator)
                let secondaryData = res['results']['data'];
                let primaryData = res['results']['primaryCheckedData'];

                assignmentObject['internalProcess']['angularGrid'].dataView.beginUpdate();
                secondaryData.forEach(element => {
                    var value = assignmentObject['internalProcess']['angularGrid'].dataView.getItemById(element['id'])
                    if (value) {
                        assignmentObject['internalProcess']['angularGrid'].dataView.updateItem(element['id'], element);
                    } else {
                        assignmentObject['internalProcess']['angularGrid'].dataView.addItem(element);
                    }
                });
                assignmentObject['internalProcess']['angularGrid'].dataView.endUpdate();
                assignmentObject['internalProcess']['angularGrid'].dataView.reSort();


                recordAssignment['primaryObject']['internalProcess']['angularGrid'].dataView.beginUpdate();
                primaryData.forEach(element => {
                    var value = recordAssignment['primaryObject']['internalProcess']['angularGrid'].dataView.getItemById(element['id'])
                    if (value) {
                        recordAssignment['primaryObject']['internalProcess']['angularGrid'].dataView.updateItem(element['id'], element);
                    } else {
                        recordAssignment['primaryObject']['internalProcess']['angularGrid'].dataView.addItem(element);
                    }
                });
                recordAssignment['primaryObject']['internalProcess']['angularGrid'].dataView.endUpdate();
                recordAssignment['primaryObject']['internalProcess']['angularGrid'].dataView.reSort();

                let recordAssignmentTemp = res['results']['recordAssignment'] as RecordAssignment;
                recordAssignment['extras'] = recordAssignmentTemp['extras'];
                if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
                    recordAssignment['secondaryObject']['data'] === recordAssignmentTemp['secondaryObject']['data']


                }
            })
            .catch((err) => {
                console.log("webWorker, error");
                console.log('err', err);
                this.dismissLoading(loadingIndicator)
            });
        console.log("webWorker, end");
    }

    public selectionChange(event, assignmentObject) {
        assignmentObject.internalProcess.angularGrid.paginationService.changeItemPerPage(Number(event.value))
    }
    public navigationChange(event, assignmentObject: AssignmentObject) {
        if (event === 'next') {
            assignmentObject.internalProcess.angularGrid.paginationService.goToNextPage()
        } else {
            assignmentObject.internalProcess.angularGrid.paginationService.goToPreviousPage()
        }
    }

    public toggleGridMenu(event, assignmentObject: AssignmentObject) {
        if (assignmentObject.internalProcess.angularGrid && assignmentObject.internalProcess.angularGrid.extensionService) {
            let gridMenuInstance
            gridMenuInstance = assignmentObject.internalProcess.angularGrid.extensionService.getSlickgridAddonInstance(ExtensionName.gridMenu);
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

    public writeConsole(type: 'Info' | 'Error' | 'Warn' | 'Success' | 'Failure', tag: string, ...message) {
        if (!this.isDebugEnabled && type !== 'Error' && type !== 'Failure'){
            return;
        }         

        let callingMethodInfo = this.getCallingMethodInfo(3);
        if (type === 'Info') {
            console.info("%c%s", "background: #22577A; padding: 2px 5px; border-radius: 20px; color: white;", tag, ...message, '\n\n', callingMethodInfo)
        } else if (type === 'Error') {
            console.error("%c%s", "background: #BD1616; padding: 2px 5px; border-radius: 20px; color: white;", tag, ...message, '\n\n', callingMethodInfo)
        } else if (type === 'Warn') {
            console.warn("%c%s", "background: #FF7600; padding: 2px 5px; border-radius: 20px; color: white;", tag, ...message, '\n\n', callingMethodInfo)
        } else if (type === 'Success') {
            console.info("%c%s%c%s", "background: #22577A; padding: 2px 5px; border-radius: 20px; color: white;", tag, "padding: 2px 5px; border-radius: 20px; color: green;", "success", ...message, '\n\n', callingMethodInfo)
        } else if (type === 'Failure') {
            console.info("%c%s%c%s", "background: #BD1616; padding: 2px 5px; border-radius: 20px; color: white;", tag, "padding: 2px 5px; border-radius: 20px; color: red;", "failure", ...message, '\n\n', callingMethodInfo)
        } else {
            console.log("%c%s", "background: #22577A; padding: 2px 5px; border-radius: 20px; color: white;", tag, ...message, '\n\n', callingMethodInfo)
        }
    }

    private getCallingMethodInfo(callingLineStackIndex: number) {
        let error = new Error();
        let stack = error.stack.split("\n");
        let callingInfo = stack[callingLineStackIndex].trim().split(" ");
        let callingMethodInfo = callingInfo[1];
        let callingMethodLink = callingInfo[2];
        return `${callingMethodInfo} - ${callingMethodLink}`
    }

    public assignmentObjectChanged(recordAssignment: RecordAssignment, event) {
        if (recordAssignment['assignmentMode'] === 'ONE_TO_ANY') {
            let newObjectValue = event['value'];
            let oldObjectValue = recordAssignment['extras']['selectedSecondaryObject'];
            let oldAssignmentObject: Array<AssignmentObject> = lodash.filter(recordAssignment['secondaryObject'], item => {
                return item['objectId'] === recordAssignment['extras']['selectedSecondaryObject'];
            })

            let index = lodash.findIndex(recordAssignment['secondaryObject'], (item: AssignmentObject) => {
                return item['objectId'] === event['value']
            })
            recordAssignment['secondaryObject'][index].internalProcess.angularGrid.resizerService.resizeGrid()

            if (oldAssignmentObject.length > 0) {
                let alreadySelectedRecordIds = this.slickGridUtils.getCustomSelectedIds(oldAssignmentObject[0]['internalProcess']['angularGrid']);
                let primaryCheckedIds = this.slickGridUtils.getCustomSelectedIds(recordAssignment['primaryObject']['internalProcess']['angularGrid']);
                if (alreadySelectedRecordIds.length > 0) {
                    this.confirmationAlert('Changes you made may not be saved', [
                        {
                            "name": "Cancel",
                            "handler": () => {
                                recordAssignment['selectedSecondaryObject'] = oldObjectValue;
                                recordAssignment['extras']['selectedSecondaryObject'] = oldObjectValue;
                            }
                        },
                        {
                            "name": "Yes",
                            "handler": () => {
                                this.deselectRowByIds(oldAssignmentObject[0]['internalProcess']['angularGrid'], alreadySelectedRecordIds, true)
                            }
                        }
                    ])
                }
            }
            recordAssignment['extras']['selectedSecondaryObject'] = newObjectValue;
        }
    }

    public tabChanged(event, tabGroupId, recordAssignment: RecordAssignment, tabsComponent?) {

        if (recordAssignment['extras']['current_tab'] === tabGroupId + '_' + event.tabTitle) {
            return
        }

        let validationAlertShouldShow = false
        if (Array.isArray(recordAssignment['secondaryObject']) && recordAssignment['secondaryObject'].length > 1 && recordAssignment['extras']['current_tab']) {
            let currentTabObjectId = recordAssignment['extras']['tabs'][recordAssignment['extras']['current_tab']]
            let currentTabAssociationField = ''

            lodash.forEach(recordAssignment['secondaryObject'], assignmentObject => {
                if (assignmentObject['objectId'] === currentTabObjectId[0]) {
                    currentTabAssociationField = assignmentObject['associationField']
                }
            })

            if (Object.keys(recordAssignment['extras']['temp']['assignmentData'][currentTabAssociationField]).length > 0
                || Object.keys(recordAssignment['extras']['temp']['unAssignmentData'][currentTabAssociationField]).length > 0) {
                validationAlertShouldShow = true
            }
        }


        if (validationAlertShouldShow) {
            this.confirmationAlert('Current tab changes will be lost if you saves another tab. Are you sure want to change tab?', [{
                name: 'Yes', handler: () => {
                    this.updateSelectedTab(event, tabGroupId, recordAssignment)
                }
            }, {
                name: 'No', handler: () => {
                    if (tabsComponent) {
                        let previousTab = tabsComponent.tabs.filter(element => {
                            return tabGroupId + '_' + element.tabTitle === recordAssignment['extras']['current_tab']
                        })
                        tabsComponent.selectTab(previousTab[0])
                    }
                }
            }])
        } else {
            this.updateSelectedTab(event, tabGroupId, recordAssignment)
        }
    }

    updateSelectedTab(event, tabGroupId, recordAssignment: RecordAssignment) {
        this.writeConsole('Info', this.constructor.name, "tabChangeMethod", event)
        recordAssignment['extras']['current_tab'] = tabGroupId + '_' + event.tabTitle;
        this.resizeAngularSlickgrid(recordAssignment['extras']['tabs'][tabGroupId + '_' + event.tabTitle], recordAssignment)
    }

    private resizeAngularSlickgrid(assignmentObjectsName: Array<string>, recordAssignment: RecordAssignment) {
        this.writeConsole('Info', this.constructor.name, "resizeAngularSlickgrid - assignmentObjectName", assignmentObjectsName)

        if (assignmentObjectsName && assignmentObjectsName.length && recordAssignment['assignmentMode'] === 'ONE_TO_MANY') {
            lodash.forEach(recordAssignment['secondaryObject'], assignmentObject => {
                if (assignmentObjectsName.includes(assignmentObject['objectId'])) {
                    let angularGridInstance: AngularGridInstance = assignmentObject['internalProcess']['angularGrid'];
                    angularGridInstance.resizerService.resizeGrid();
                }
            })
        }
    }

    public saveData(recordAssignment: RecordAssignment) {
        recordAssignment['extras']['saveButtonClicked'] = true
        let isSaveApplicable = undefined;
        if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
            isSaveApplicable = recordAssignment['secondaryObject']['limitation']['minimumSelection'] === null || recordAssignment['secondaryObject']['limitation']['minimumSelection'] <= this.slickGridUtils.getCustomSelectedIds(recordAssignment['secondaryObject']['internalProcess']['angularGrid']).length
        } else if (recordAssignment['assignmentMode'] === 'ONE_TO_ANY') {
            let selectedObject: Array<AssignmentObject> = lodash.filter(recordAssignment['secondaryObject'], item => {
                return item['objectId'] === recordAssignment['extras']['selectedSecondaryObject'];
            })

            if (selectedObject.length > 0) {
                isSaveApplicable = selectedObject[0]['limitation']['minimumSelection'] === null || selectedObject[0]['limitation']['minimumSelection'] <= this.slickGridUtils.getCustomSelectedIds(selectedObject[0]['internalProcess']['angularGrid']).length
            }
        } else {
            if (recordAssignment['extras']['current_tab']) {
                let assignmentObjectsName = recordAssignment['extras']['tabs'][recordAssignment['extras']['current_tab']]
                if (assignmentObjectsName && assignmentObjectsName.length && recordAssignment['assignmentMode'] === 'ONE_TO_MANY') {
                    lodash.forEach(recordAssignment['secondaryObject'], secondaryObject => {
                        if (assignmentObjectsName.includes(secondaryObject['objectId'])) {
                            if (isSaveApplicable === undefined || isSaveApplicable === true) {
                                isSaveApplicable = secondaryObject['limitation']['minimumSelection'] === null || secondaryObject['limitation']['minimumSelection'] <= this.slickGridUtils.getCustomSelectedIds(secondaryObject['internalProcess']['angularGrid']).length
                            }
                        }
                    })
                }

            } else {
                lodash.forEach(recordAssignment['secondaryObject'], secondaryObject => {
                    if (isSaveApplicable === undefined || isSaveApplicable === true) {
                        isSaveApplicable = secondaryObject['limitation']['minimumSelection'] === null || secondaryObject['limitation']['minimumSelection'] <= this.slickGridUtils.getCustomSelectedIds(secondaryObject['internalProcess']['angularGrid']).length
                    }
                })
            }
        }
        if (isSaveApplicable === false || isSaveApplicable === undefined) {
            recordAssignment['extras']['saveButtonClicked'] = false
            this.confirmationAlert('Selection limit should meet acceptance criteria..', [{ name: 'Ok', handler: () => { } }])
            return;
        }

        let assignmentData = recordAssignment['extras'] && recordAssignment['extras']['assignmentData'];
        let unAssignmentData = recordAssignment['extras'] && recordAssignment['extras']['unAssignmentData'];

        let saveTaskList = [];

        if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
            this.saveAssignmentData(recordAssignment['secondaryObject'], assignmentData, unAssignmentData, saveTaskList)
        } else {
            if (recordAssignment['assignmentMode'] === 'ONE_TO_MANY' && recordAssignment['extras']['current_tab']) {
                this.saveCurrentTabAssignments(recordAssignment['extras']['tabs'][recordAssignment['extras']['current_tab']], recordAssignment, assignmentData, unAssignmentData, saveTaskList)
            } else {
                lodash.forEach(recordAssignment['secondaryObject'], secondaryObject => {
                    this.saveAssignmentData(secondaryObject, assignmentData, unAssignmentData, saveTaskList)
                })
            }

        }
        this.displayData(recordAssignment)

        Promise.all(saveTaskList).then(() => {
            let primaryModifiedData = this.slickGridUtils.getCustomSelectedRows(recordAssignment['primaryObject']['internalProcess']['angularGrid'])
            recordAssignment['primaryObject']['columnFieldInfo'].forEach(fieldInfo => {
                if (fieldInfo['fieldType'] === 'DATE' || fieldInfo['fieldType'] === 'TIMESTAMP') {
                    primaryModifiedData.forEach(modifiedData => {
                        if (modifiedData[fieldInfo['fieldName']]) {
                            if (typeof modifiedData[fieldInfo['fieldName']] === 'string') {
                                modifiedData[fieldInfo['fieldName']] = moment(modifiedData[fieldInfo['fieldName']], fieldInfo['dateFormat']).toDate()
                            }
                            if (fieldInfo['fieldType'] === 'DATE') {
                                modifiedData[fieldInfo['fieldName']] = this.getDateWithoutTime(modifiedData[fieldInfo['fieldName']]).getTime();
                            } else {
                                modifiedData[fieldInfo['fieldName']] = new Date(modifiedData[fieldInfo['fieldName']]).getTime();
                            }
                        }
                    })
                }
            })
            this.dataProvider.saveBulkDocument(recordAssignment['primaryObject']['objectId'], primaryModifiedData, appConstant.couchDBStaticName).then(res => {
                this.resetData(recordAssignment);
            })
        }).catch(err => {
            this.writeConsole('Error', this.constructor.name, err)
            this.resetData(recordAssignment);
        })
    }

    private saveCurrentTabAssignments(assignmentObjectsName: Array<string>, recordAssignment: RecordAssignment, assignmentData, unAssignmentData, saveTaskList) {
        this.writeConsole('Info', this.constructor.name, "resizeAngularSlickgrid - assignmentObjectName", assignmentObjectsName)

        if (assignmentObjectsName && assignmentObjectsName.length && recordAssignment['assignmentMode'] === 'ONE_TO_MANY') {
            lodash.forEach(recordAssignment['secondaryObject'], assignmentObject => {
                if (assignmentObjectsName.includes(assignmentObject['objectId'])) {
                    this.saveAssignmentData(assignmentObject, assignmentData, unAssignmentData, saveTaskList)
                }
            })
        }
    }

    public saveDataSpecificObject(recordAssignment: RecordAssignment, assignmentObject: AssignmentObject) {
        let isSaveApplicable = undefined;
        isSaveApplicable = assignmentObject['limitation']['minimumSelection'] === null || assignmentObject['limitation']['minimumSelection'] <= this.slickGridUtils.getCustomSelectedIds(assignmentObject['internalProcess']['angularGrid']).length
        if (isSaveApplicable === false || isSaveApplicable === undefined) {
            this.confirmationAlert('Minimum selection limit not met.', [{ name: 'Ok', handler: () => { } }])
            return;
        }
        recordAssignment['extras']['saveButtonClicked'] = true
        let assignmentData = recordAssignment['extras'] && recordAssignment['extras']['assignmentData'];
        let unAssignmentData = recordAssignment['extras'] && recordAssignment['extras']['unAssignmentData'];

        let saveTaskList = [];

        this.saveAssignmentData(assignmentObject, assignmentData, unAssignmentData, saveTaskList)

        this.displayData(recordAssignment)

        Promise.all(saveTaskList).then(() => {
            let primaryModifiedData = this.slickGridUtils.getCustomSelectedRows(recordAssignment['primaryObject']['internalProcess']['angularGrid'])
            recordAssignment['primaryObject']['columnFieldInfo'].forEach(fieldInfo => {
                if (fieldInfo['fieldType'] === 'DATE' || fieldInfo['fieldType'] === 'TIMESTAMP') {
                    primaryModifiedData.forEach(modifiedData => {
                        if (modifiedData[fieldInfo['fieldName']]) {
                            if (typeof modifiedData[fieldInfo['fieldName']] === 'string') {
                                modifiedData[fieldInfo['fieldName']] = moment(modifiedData[fieldInfo['fieldName']], fieldInfo['dateFormat']).toDate()
                            }
                            if (fieldInfo['fieldType'] === 'DATE') {
                                modifiedData[fieldInfo['fieldName']] = this.getDateWithoutTime(modifiedData[fieldInfo['fieldName']]).getTime();
                            } else {
                                modifiedData[fieldInfo['fieldName']] = new Date(modifiedData[fieldInfo['fieldName']]).getTime();
                            }
                        }
                    })
                }
            })
            this.dataProvider.saveBulkDocument(recordAssignment['primaryObject']['objectId'], primaryModifiedData, appConstant.couchDBStaticName).then(res => {
                this.resetData(recordAssignment);
            })
        }).catch(err => {
            this.writeConsole('Error', this.constructor.name, err)
            this.resetData(recordAssignment);
        })
    }



    private saveAssignmentData(secondaryAssignmentObject: AssignmentObject, assignmentData, unAssignmentData, saveTaskList) {
        let associationField = secondaryAssignmentObject['associationField'];
        if (assignmentData[associationField] && assignmentData[associationField].length > 0) {
            let assignmentSaveData = {
                [associationField]: assignmentData[associationField]
            };
            this.writeConsole('Info', this.constructor.name, 'assignmentSaveData', assignmentSaveData)
            saveTaskList.push(this.dataProvider.saveBulkAssociationDocument(assignmentSaveData, appConstant.couchDBStaticName).then(res => {
                this.writeConsole('Info', this.constructor.name, "Save response", res)
            }));
        }
        if (unAssignmentData[associationField] && unAssignmentData[associationField].length > 0) {
            let keys = [];

            lodash.forEach(unAssignmentData[associationField], (unAssignmentDataItem) => {
                let key = 'full' + unAssignmentDataItem['reference_object_id'] + unAssignmentDataItem['reference_id'] + unAssignmentDataItem['type'] + unAssignmentDataItem['association_object_id'] + unAssignmentDataItem['association_id'] + true;
                keys.push(key)
            })

            saveTaskList.push(this.dataProvider.getAssignmentData(keys, appConstant.couchDBStaticName).then(res => {
                if (res && res['status'] === "SUCCESS" && res['records'] && res['records'].length > 0) {
                    let records = [];

                    lodash.forEach(res['records'], (item) => {
                        let record = this.dataProvider.convertRelDocToNormalDoc(item);
                        record['isActive'] = false;
                        records.push(record);
                    })

                    this.writeConsole('Info', this.constructor.name, 'getAssignmentData', 'records', records)

                    let unAssignmentSaveData = {
                        [associationField]: records
                    };
                    this.writeConsole('Info', this.constructor.name, 'unAssignmentSaveData', unAssignmentSaveData)
                    return this.dataProvider.saveBulkAssociationDocument(unAssignmentSaveData, appConstant.couchDBStaticName).then(res => {
                        this.writeConsole('Info', this.constructor.name, "Save response", res)
                    });
                }
            }))
        }
    }

    private resetData(recordAssignment: RecordAssignment) {
        let primaryModifiedIds = this.slickGridUtils.getCustomSelectedIds(recordAssignment['primaryObject']['internalProcess']['angularGrid'])

        let chunkedPrimaryIds = lodash.chunk(primaryModifiedIds, this.arrayChunkLimit)

        let taskList = []
        lodash.forEach(chunkedPrimaryIds, chunkedPrimaryIdSet => {
            taskList.push(this.updateAssignmentData(recordAssignment['primaryObject'], chunkedPrimaryIdSet))
        })

        return Promise.all(taskList).then(() => {
            recordAssignment['extras']['saveButtonClicked'] = false

            this.updatePrimaryAssignmentStatus(recordAssignment);
            if (recordAssignment['assignmentMode'] === 'ONE_TO_ONE') {
                this.deselectAllRows(recordAssignment['secondaryObject']['internalProcess']['angularGrid'], 'All', false)

                let field = recordAssignment['secondaryObject']['associationField']
                recordAssignment['extras']['temp']['assignmentData'][field] = {}
                recordAssignment['extras']['temp']['unAssignmentData'][field] = {}

                recordAssignment['extras']['assignmentData'][field] = []
                recordAssignment['extras']['unAssignmentData'][field] = []
                this.resetSecondaryAssignmentStatus(recordAssignment.secondaryObject);
            } else {
                lodash.forEach(recordAssignment['secondaryObject'], secondaryObject => {
                    this.deselectAllRows(secondaryObject['internalProcess']['angularGrid'], 'All', false)

                    let field = secondaryObject['associationField']
                    recordAssignment['extras']['temp']['assignmentData'][field] = {}
                    recordAssignment['extras']['temp']['unAssignmentData'][field] = {}

                    recordAssignment['extras']['assignmentData'][field] = []
                    recordAssignment['extras']['unAssignmentData'][field] = []
                    this.resetSecondaryAssignmentStatus(secondaryObject);
                });
            }
            this.deselectAllRows(recordAssignment['primaryObject']['internalProcess']['angularGrid'], 'All', true)
        }).catch(error => {
            recordAssignment['extras']['saveButtonClicked'] = false
            this.writeConsole('Error', this.constructor.name, 'error', error)
        })
    }


    private displayData(recordAssignment: RecordAssignment) {
        let assignmentData = recordAssignment['extras'] && recordAssignment['extras']['assignmentData'];
        let unAssignmentData = recordAssignment['extras'] && recordAssignment['extras']['unAssignmentData'];
        this.writeConsole('Info', this.constructor.name, "assignmentData", assignmentData)
        this.writeConsole('Info', this.constructor.name, "unAssignmentData", unAssignmentData)
    }

    private confirmationAlert(title: string, buttons: Array<{ name: string, handler: () => void }>) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            title: title,
            buttonInfo: buttons,
            parentContext: this,
            type: "Alert"
        };
        dialogConfig.autoFocus = false
        dialogConfig.disableClose = true
        this.dialog.open(cspfmAlertDialog, dialogConfig);
    }

    backButtonOnclick(recordAssignment: RecordAssignment, isPopUpEnabled, redirectUrl, matDialogRef: MatDialogRef<any>) {

        if (this.isAnyModificationExist(recordAssignment)) {
            this.confirmationAlert('Changes you made may not be saved',
                [
                    {
                        "name": "No",
                        "handler": () => {

                        }
                    },
                    {
                        "name": "Yes",
                        "handler": () => {
                            this.doBackNavigation(isPopUpEnabled, redirectUrl, matDialogRef);
                        }
                    }
                ]
            );
        } else {
            this.doBackNavigation(isPopUpEnabled, redirectUrl, matDialogRef);
        }
    }

    private isAnyModificationExist(recordAssignment) {
        let assignmentData = recordAssignment['extras'] && recordAssignment['extras']['assignmentData'];
        let unAssignmentData = recordAssignment['extras'] && recordAssignment['extras']['unAssignmentData'];
        let assignments = lodash.flattenDeep(Object.values(assignmentData))
        let unAssignments = lodash.flattenDeep(Object.values(unAssignmentData))
        return (assignments && assignments.length > 0) || (unAssignments && unAssignments.length > 0);
    }

    private doBackNavigation(isPopUpEnabled, redirectUrl, matDialogRef) {
        if (isPopUpEnabled) {
            matDialogRef.close();
        }
        const stackArray = document.getElementsByTagName('ion-router-outlet')[1].children
        const layoutToRedirect = redirectUrl.replace('/menu/', '');
        if (stackArray[stackArray.length - 1].tagName.toLowerCase() !== layoutToRedirect) {
            if (!this.appUtilityObject.checkPageAlreadyInStack(redirectUrl)) {
                const itemSaveNavigationParams = {
                };
                this.router.navigate([redirectUrl], { queryParams: itemSaveNavigationParams, skipLocationChange: true });
            } else {
                this.router.navigateByUrl(redirectUrl, { skipLocationChange: true });
            }
        }
    }

    async presentLoading(message: string) {
        const loading = await this.loadingCtrl.create({ message: message });
        loading.present();
        return loading;
    }

    async dismissLoading(loading) {
        loading.dismiss();
    }

    private async updateAssignmentData(assignmentObject: AssignmentObject, ids: Array<string>) {
        if (!this.onlineIndxCreation.isAllSearchIndexCompleted) {
            return
        }
        const fetchParams = {
            'objectHierarchyJSON': assignmentObject.hierarchy,
            'layoutDataRestrictionSet': assignmentObject.layoutDataRestrictionSet,
            'dataSource': assignmentObject.dataSource,
            'additionalInfo': {
                'id': ids
            }
        }
        return this.dataProvider.queryBulkDoc(fetchParams).then(res => {
            this.writeConsole('Info', this.constructor.name, "updateAssignmentData response :", res);
            if (res['status'] === 'SUCCESS') {
                if (res['records'].length > 0) {
                    this.slickGridUtils.upsertModifiedData(assignmentObject['internalProcess']['angularGrid'], res['records'], assignmentObject['internalProcess']['displayColumns'])
                }
            }
        }).catch(error => {
            assignmentObject['internalProcess']['isLoading'] = false;
            this.writeConsole('Error', this.constructor.name, 'updateAssignmentData - error', error)
            return;
        });
    }
    getDateWithoutTime(dateTimestamp) {
        var dateObject = new Date(dateTimestamp);
        dateObject.setHours(0, 0, 0, 0);
        return dateObject;
    }

}
