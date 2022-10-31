

 /* 
  *   File: DepPersonInfoList_WEB_List.ts
  *   Copyright(c) 2022 Chain-Sys Corporation Inc.
  *   Duplication or distribution of this code in part or in whole by any media
  *   without the express written permission of Chain-Sys Corporation or its agents is
  *   strictly prohibited.
  */
 import {
     Inject,
     Component,
     ViewChild,
     OnInit,
     ApplicationRef,
     ChangeDetectorRef,
     ViewChildren,
     HostListener,
     ElementRef,
     QueryList,
     Input,
     Renderer2
 } from '@angular/core';
 import {
     Platform,
     LoadingController,
     ToastController,
     IonVirtualScroll,
     ModalController,
     AlertController,
     PopoverController,
     ToastOptions
 } from '@ionic/angular';
 import {
     EmailComposer
 } from '@awesome-cordova-plugins/email-composer/ngx';
 import {
     cspfmObservableListenerUtils
 } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
 import {
     SocialSharing
 } from '@awesome-cordova-plugins/social-sharing/ngx';
 import {
     SMS
 } from '@awesome-cordova-plugins/sms/ngx';
 import {
     CallNumber
 } from '@awesome-cordova-plugins/call-number/ngx';
 import * as lodash from 'lodash';
 import * as _ from "underscore";
 import {
     Router,
     ActivatedRoute
 } from '@angular/router';
 import {
     appUtility
 } from 'src/core/utils/appUtility';
 import {
     dataProvider
 } from 'src/core/utils/dataProvider';
 import {
     appConstant
 } from 'src/core/utils/appConstant';
 import {
     ColumnMode
 } from '@swimlane/ngx-datatable';
 import {
     FieldInfo,
     cspfm_data_display,
     CspfmDataFormatter,
     cspfmDataGrouping,
     cspfmCustomEditor,
     CspfmDataValidator,
     CspfmActionsFormatter,
     cspfmAssociationDataFormatter,
     CspfmDataExportFormatter,
     cspfmUrlDataFormatter
 } from 'src/core/pipes/cspfm_data_display';
 import {
     Column,
     GridOption,
     FieldType,
     Filters,
     OperatorType,
     AngularGridInstance,
     FilterService,
     FileType,
     ExcelExportOption,
     GridStateChange,
     ExtensionName,
     AngularUtilService,
     DelimiterType,
     Editors,
     GroupingFormatterItem,
     CurrentSorter,
     OnEventArgs,
     SlickGrid
 } from 'angular-slickgrid';
 import {
     TranslateService
 } from '@ngx-translate/core';
 import {
     lookupFieldMapping
 } from 'src/core/pfmmapping/lookupFieldMapping';
 import * as moment from 'moment';
 import {
     cspfmCustomFieldProvider
 } from 'src/core/utils/cspfmCustomFieldProvider';
 import {
     registerLocaleData
 } from "@angular/common";
 import {
     cspfmactionweb
 } from 'src/core/components/cspfmactionweb/cspfmactionweb';
 import {
     objectTableMapping
 } from "src/core/pfmmapping/objectTableMapping";
 import {
     cspfmObjectConfiguration
 } from 'src/core/pfmmapping/cspfmObjectConfiguration';
 import {
     MdePopoverTrigger
 } from '@material-extended/mde';
 import {
     cspfmAlertDialog
 } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
 import {
     cspfmweblookuppage
 } from 'src/core/pages/cspfmweblookuppage/cspfmweblookuppage';
 import {
     cspfmFlatpickrConfig
 } from 'src/core/utils/cspfmFlatpickrConfig';
 import * as filterConfig from '../../assets/filterConfig/filter_based_conditional_operator_setting.json'
 import {
     cspfmSlickgridPopover
 } from 'src/core/components/cspfmSlickgridPopover/cspfmSlickgridPopover';
 import {
     SlickgridPopoverService
 } from 'src/core/services/slickgridPopover.service';
 import {
     CspfmReportGenerationService
 } from 'src/core/services/cspfmReportGeneration.service';
 import {
     cspfmExecutionPouchDbProvider
 } from 'src/core/db/cspfmExecutionPouchDbProvider';
 import {
     cspfmExecutionPouchDbConfiguration
 } from 'src/core/db/cspfmExecutionPouchDbConfiguration';
 import {
     MAT_DIALOG_DATA,
     MatDialogRef,
     MatDialog,
     MatDialogConfig
 } from '@angular/material/dialog';
 import {
     cspfmBooleanEvaluation
 } from 'src/core/utils/cspfmBooleanEvaluation';
 import {
     cspfmLiveListenerHandlerUtils
 } from 'src/core/dynapageutils/cspfmLiveListenerHandlerUtils';
 import {
     DependentObjectListType,
     FetchMode
 } from 'src/core/models/cspfmLiveListenerConfig.type';
 import {
     couchdbProvider
 } from 'src/core/db/couchdbProvider';
 import {
     onlineDbIndexCreation
 } from 'src/core/utils/onlineDbIndexCreation';
 import {
     dbProvider
 } from 'src/core/db/dbProvider';
 import {
     offlineDbIndexCreation
 } from 'src/core/utils/offlineDbIndexCreation';

 import {
     cspfmSlickgridMatrixService,
     MatrixConfig
 } from 'src/core/services/cspfmSlickgridMatrix.service';
 import {
     SectionObjectDetail
 } from 'src/core/models/cspfmSectionDetails.type';
 import {
     PaginationAction
 } from 'src/core/models/cspfmSectionDetails.type';
 import {
     cspfmGridsectionListIdConfiguration
 } from 'src/core/utils/cspfmGridsectionListIdConfiguration';
 import {
     cspfmDataTraversalUtils
 } from 'src/core/dynapageutils/cspfmDataTraversalUtils';
 import {
     cspfmConditionalFormattingUtils
 } from 'src/core/dynapageutils/cspfmConditionalFormattingUtils';
 import {
     ConditionalFormat,
     EntryType
 } from 'src/core/models/cspfmConditionalFormat.type';
 import {
     ObjectHierarchy
 } from 'src/core/models/cspfmObjectHierarchy.type';
 import {
     DataFieldTraversal
 } from 'src/core/models/cspfmDataFieldTraversal.type';
 import {
     cspfmConditionalValidationUtils
 } from 'src/core/dynapageutils/cspfmConditionalValidationUtils';
 import {
     ConditionalValidation,
     HeaderLineListType
 } from 'src/core/models/cspfmConditionalValidation.type';
 import {
     cspfmOnDemandFeature
 } from 'src/core/utils/cspfmOnDemandFeature';
 import {
     cspfmCustomActionUtils
 } from 'src/core/dynapageutils/cspfmCustomActionUtils';
 declare var $: any;
 declare const window: any;
 import {
     cspfmLayoutConfiguration
 } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
 import {
     cspfmSlickgridUtils
 } from 'src/core/dynapageutils/cspfmSlickgridUtils';
 import {
     cspfmListSearchListUtils
 } from 'src/core/dynapageutils/cspfmListSearchListUtils';
 import {
     cspfmLookupCriteriaUtils
 } from 'src/core/utils/cspfmLookupCriteriaUtils';
 import {
     metaDbConfiguration
 } from 'src/core/db/metaDbConfiguration';
 import {
     metaDataDbProvider
 } from "src/core/db/metaDataDbProvider";
 import {
     cspfmMetaCouchDbProvider
 } from 'src/core/db/cspfmMetaCouchDbProvider';
 import {
     NgZone
 } from '@angular/core';
 import {
     cspfmDateEditor
 } from 'src/core/dynapageutils/cspfmDateEditor';
 import {
     cspfmBalloonComponent
 } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent';
 declare function userAssignment(layoutId, userAssignService, metaDbProvider, metaDbConfig): any;
 import {
     DatePipe
 } from "@angular/common";
 @Component({
     selector: 'DepPersonInfoList_WEB_List',
     templateUrl: 'DepPersonInfoList_WEB_List.html'
 }) export class DepPersonInfoList_WEB_List implements OnInit {
     isCustomFetchLoading = false;
     dripDownAttribute = '';
     constructor(public angularUtilService: AngularUtilService, public objMapping: objectTableMapping, public objectTableMappingObject: objectTableMapping, public gridIdConfig: cspfmGridsectionListIdConfiguration, public dialog: MatDialog, public observableListenerUtils: cspfmObservableListenerUtils, public dataProviderObject: dataProvider, public socialShare: SocialSharing, public loadingCtrl: LoadingController, public modalCtrl: ModalController,
         public callNumber: CallNumber, public emailComposer: EmailComposer, public toastCtrl: ToastController, public sms: SMS, public appUtilityConfig: appUtility, public platform: Platform, public router: Router, public activatRoute: ActivatedRoute, public dbService: couchdbProvider, public onlineIndxCreation: onlineDbIndexCreation, public offlineDbIndexCreation: offlineDbIndexCreation,
         public alertCtrl: AlertController, public lookupFieldMappingObject: lookupFieldMapping, public cspfmDataDisplay: cspfm_data_display, public alerCtrl: AlertController, public cspfmLookupCriteriaUtilsObject: cspfmLookupCriteriaUtils, public slickgridUtils: cspfmSlickgridUtils, public listServiceUtils: cspfmListSearchListUtils, public cspfmMetaCouchDbProviderObject: cspfmMetaCouchDbProvider, private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils, private cspfmConditionalFormattingUtilsObject: cspfmConditionalFormattingUtils, private cspfmConditionalValidationUtilsObject: cspfmConditionalValidationUtils,
         public popoverController: PopoverController, public translateService: TranslateService, public cspfmCustomFieldProviderObject: cspfmCustomFieldProvider, private changeRef: ChangeDetectorRef, private datePipe: DatePipe, public cspfmFlatpickrConfigObject: cspfmFlatpickrConfig, public slickgridPopoverService: SlickgridPopoverService, private pfmObjectConfig: cspfmObjectConfiguration, public executionDbConfigObject: cspfmExecutionPouchDbConfiguration, public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider,
         public cspfmLayoutConfig: cspfmLayoutConfiguration, private cspfmSlickgridMatrix: cspfmSlickgridMatrixService, private zone: NgZone, private liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils, private cspfmReportGenerationService: CspfmReportGenerationService, private metaDbConfig: metaDbConfiguration, private metaDbProvider: metaDataDbProvider, public customActionUtils: cspfmCustomActionUtils, private cspfmOnDemandFeature: cspfmOnDemandFeature) {
         this.appUtilityConfig.initialHiddenColumns(this.columnDefinitions, this.__deppersonalinfo$tableName);
         this.slickgridResultList = [];
         this.filteredResultList = [];
         this.customActionConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['customActionConfiguration']);
         this.resultList = [];

         let getAngularGrid = () => {
             return this.angularGrid;
         };
         this.listenerName = this.slickgridUtils.subscribeLazyLoading(
             this.dataFetchMode,
             this.layoutId,
             getAngularGrid,
             this.columnDefinitions[this.__deppersonalinfo$tableName]
         );
         this.associationConfigurationAssignment();
         this.activatRoute.queryParams.subscribe(async params => {
             if (Object.keys(params).length === 0 && params.constructor === Object) {
                 console.log("list query params skipped");
                 return
             }



         });

         if (this.dataFetchMode === 'Full' || this.dataFetchMode === 'Batch') {
             this.gridOptions['enablePagination'] = true;
             this.pagination['enabled'] = false;
             if (this.dataFetchMode === "Full") {
                 this.pagination["view"]["itemCount"] = "2000";
             }
             this.gridOptions['gridMenu']['customItems'].push({
                 divider: true,
                 command: '',
                 positionOrder: 90
             });
             this.gridOptions['gridMenu']['customItems'].push({
                 command: "cspfm-toggle-pagination",
                 titleKey: "Toggle pagination",
                 iconCssClass: "fa fa-bookmark",
                 action: (event, callbackArgs) => {
                     this.slickgridUtils.togglePagination(event, callbackArgs, this.gridObj, this.angularGrid)
                 },
                 positionOrder: 94
             });
         } else {
             this.gridOptions['enablePagination'] = false;
             this.pagination['enabled'] = true;
         }
         if (this.sectionObjectDetails[this.__deppersonalinfo$tableName]['isMatrixEnabled'] === true || this.upsertHeaderFlag === true || this.isMailActionAvailable === true || this.isWorkflowActionAvailable === true) {
             let rowSelectionOption = {
                 checkboxSelector: {
                     hideInFilterHeaderRow: false,
                     width: 60
                 },
                 rowSelectionOptions: {
                     selectActiveRow: false,
                 },
                 enableCheckboxSelector: true,
                 enableRowSelection: true
             }
             Object.assign(this.gridOptions, rowSelectionOption);
         }
         this.appUtilityConfig.setColumnWidth(this.columnDefinitions[this.__deppersonalinfo$tableName])
         if (this.onLoadFetch) {
             this.initiateFetch();
             this.registerRecordChangeListener();
             this.listServiceUtils.prepareFormulaAndRollupFieldInfo(this.objectHierarchyJSON, this.formulaAndRollupFieldInfo)
         }
         this.isSkeletonLoading = false;


     }
     public isPopUpEnabled = false;
     private flatpickrListeners: Array < {
         element: HTMLElement;
         eventType: string;
         handler: (event) => any | void;
         option: any;
     } > = [];
     resultList: Array < any > = [];
     public slickgridResultList = [];
     public filteredResultList = [];
     public filteredResultListTemp = [];
     formulaAndRollupFieldInfo = {}
     public searchFlag = false;
     public searchTerm: any = "";
     public isAssociationDisplayRefreshRequired: boolean;
     public slickGridItemClickCount = 0;
     public isValidationRequired = true;
     private approverType = "";
     public isCustomActionProcessing = false;
     public customActionConfiguration = {};
     public flatpickrInstance;
     public isSkeletonLoading = true;

     private currentStatusWorkFlowActionFieldId;
     public WorkFlowUserApprovalStatusDataObject = {};
     private workFlowMapping = {};
     private fieldApproverType = {};

     public filteredEventTriggeredList = [];
     public parentValue;
     private tableName_pfm71658 = 'pfm71658';
     public errorMessageToDisplay = "No Records";
     public eventsTriggeredList: Array < any > = [];
     public objectHierarchyJSON: ObjectHierarchy = {
         "objectId": "71658",
         "referenceObjectId": "0",
         "objectName": "deppersonalinfo",
         "isStandardObject": "N",
         "rootPath": "deppersonalinfo_DUMMY",
         "fieldId": "0",
         "relationShipType": "null",
         "objectType": "PRIMARY",
         "childObject": [],
         "formulaField": [{
             "fieldName": "depformulan"
         }]
     };

     public layoutDataRestrictionSet = [];
     public layoutId = "221659";
     public layoutName = "DepPersonInfoList_WEB_List";
     public dataSource = "CouchDB";
     public searchQueryForDesignDoc = "";
     customAlert: any;
     private dbprovider;
     public sectionDependentObjectList: {
         [key: string]: DependentObjectListType
     } = {};
     public tempColumnDefinitions = [];
     public dependentObjectList: DependentObjectListType = {
         "relationalObjects": {
             "pfm71658": []
         },
         "lookupObjects": {},
         "dataRestrictionInvolvedObjects": {}
     };
     public isLoading = false;
     public workFlowActionConfig = {};
     public inlineEditBoolObj = {
         isNavigated: false,
         isDoubleClicked: false
     }
     public paginationConfigInfo = {
         "currentPageWithRecord": "true",
         "itemPerPage": "true",
         "numberOfPages": "true",
         "paginationPosition": "TOP",
         "noOfItemsPerPage": "50"
     };
     public selectedRows = [];
     public isMailActionAvailable = false;
     public isWorkflowActionAvailable = false;
     public itemCount: number;
     public __deppersonalinfo$tableName = this.objectTableMappingObject.mappingDetail['deppersonalinfo'];
     public gridId = 'cspfm_grid_' + this.layoutId + '_' + this.__deppersonalinfo$tableName;
     public gridContainerId = 'cspfm_grid_container_' + this.layoutId + '_' + this.__deppersonalinfo$tableName;
     public matrixGridId = 'cspfm_matrix_grid_' + this.layoutId + '_' + this.__deppersonalinfo$tableName;
     public matrixGridContainerId = 'cspfm_matrix_grid_container_' + this.layoutId + '_' + this.__deppersonalinfo$tableName;

     public team_930594_7956962 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['team'];

     public associationConfiguration = {};
     public hiddenColumnsIds = {}
     public associationTableColumnInfo: {
         [key: string]: {
             [key: string]: {
                 [key: string]: FieldInfo
             }
         }
     } = {};
     public tableColumnInfo = {
         [this.__deppersonalinfo$tableName]: {
             "pfm71658_name_7956960": {
                 "id": "name",
                 "label": "DepPersonInfoList_WEB_List.Element.deppersonalinfo_DUMMY$$name.name",
                 "fieldName": "name",
                 "prop": "name",
                 "fieldType": "TEXT",
                 "objectName": "deppersonalinfo",
                 "elementid": 7956960,
                 "traversalpath": "deppersonalinfo_DUMMY$$name",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71658_employeename_7956961": {
                 "id": "employeename",
                 "label": "DepPersonInfoList_WEB_List.Element.deppersonalinfo_DUMMY$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "deppersonalinfo",
                 "elementid": 7956961,
                 "traversalpath": "deppersonalinfo_DUMMY$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71658_team_7956962": {
                 "id": "team",
                 "label": "DepPersonInfoList_WEB_List.Element.deppersonalinfo_DUMMY$$team.team",
                 "fieldName": "team",
                 "prop": "team",
                 "fieldType": "DROPDOWN",
                 "objectName": "deppersonalinfo",
                 "elementid": 7956962,
                 "traversalpath": "deppersonalinfo_DUMMY$$team",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": this.team_930594_7956962,
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71658_depdate_7956963": {
                 "id": "depdate",
                 "label": "DepPersonInfoList_WEB_List.Element.deppersonalinfo_DUMMY$$depdate.depdate",
                 "fieldName": "depdate",
                 "prop": "depdate",
                 "fieldType": "DATE",
                 "objectName": "deppersonalinfo",
                 "elementid": 7956963,
                 "traversalpath": "deppersonalinfo_DUMMY$$depdate",
                 "child": "",
                 "dateFormat": this.appUtilityConfig.userDateFormat,
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71658_deptimestamp_7956964": {
                 "id": "deptimestamp",
                 "label": "DepPersonInfoList_WEB_List.Element.deppersonalinfo_DUMMY$$deptimestamp.deptimestamp",
                 "fieldName": "deptimestamp",
                 "prop": "deptimestamp",
                 "fieldType": "TIMESTAMP",
                 "objectName": "deppersonalinfo",
                 "elementid": 7956964,
                 "traversalpath": "deppersonalinfo_DUMMY$$deptimestamp",
                 "child": "",
                 "dateFormat": this.appUtilityConfig.userDateTimeFormat,
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71658_depboolean_7956965": {
                 "id": "depboolean",
                 "label": "DepPersonInfoList_WEB_List.Element.deppersonalinfo_DUMMY$$depboolean.depboolean",
                 "fieldName": "depboolean",
                 "prop": "depboolean",
                 "fieldType": "BOOLEAN",
                 "objectName": "deppersonalinfo",
                 "elementid": 7956965,
                 "traversalpath": "deppersonalinfo_DUMMY$$depboolean",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71658_cspfmaction7956966": {
                 "id": "cspfmaction7956966",
                 "label": "DepPersonInfoList_WEB_List.Action.Edit_1",
                 "fieldName": "cspfmaction7956966",
                 "prop": "cspfmaction7956966",
                 "elementid": 7956966,
                 "elementType": "ACTION",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "actionInfo": [{
                     "isHiddenEnabled": "N",
                     "buttonCss": "cs-web-action-button",
                     "actionIcon": "icon-mat-create",
                     "actionName": "Edit_1",
                     "actionLabel": "Edit",
                     "actionType": "EDIT",
                     "sourceId": "7956966",
                     "traversalpath": "DepPersonInfoList_WEB_List_Edit_1",
                     "actionDisplayType": "Icon",
                     "objectName": "",
                     "boxStyle": "",
                     "labelStyle": "",
                     "valueStyle": "",
                     "navigationInfo": {
                         "navigationUrl": "DepPerson_MultiLine_Entry_WEB_Grid_with_List",
                         "redirectUrl": "DepPersonInfoList_WEB_List",
                         "uniqueKey": "id",
                         "enablePopUp": false,
                         "webserviceinfo": [],
                         "relationalObjectInfo": {
                             "relationalObjectName": "deppersonalinfo",
                             "relationalObjectId": "",
                             "fieldType": "MASTERDETAIL",
                             "child": ""
                         }
                     }
                 }]
             },
             "pfm71658_cspfmaction7992398": {
                 "id": "cspfmaction7992398",
                 "label": "DepPersonInfoList_WEB_List.Action.View_1",
                 "fieldName": "cspfmaction7992398",
                 "prop": "cspfmaction7992398",
                 "elementid": 7992398,
                 "elementType": "ACTION",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "actionInfo": [{
                     "isHiddenEnabled": "N",
                     "buttonCss": "cs-web-action-button",
                     "actionIcon": "icon-mat-remove_red_eye",
                     "actionName": "View_1",
                     "actionLabel": "View",
                     "actionType": "VIEW",
                     "sourceId": "7992398",
                     "traversalpath": "DepPersonInfoList_WEB_List_View_1",
                     "actionDisplayType": "Icon",
                     "objectName": "",
                     "boxStyle": "",
                     "labelStyle": "",
                     "valueStyle": "",
                     "navigationInfo": {
                         "navigationUrl": "DepPerson_MultiLine_Entry_WEB_Grid_with_List",
                         "redirectUrl": "DepPersonInfoList_WEB_List",
                         "uniqueKey": "id",
                         "enablePopUp": false,
                         "webserviceinfo": [],
                         "relationalObjectInfo": {
                             "relationalObjectName": "deppersonalinfo",
                             "relationalObjectId": "",
                             "fieldType": "MASTERDETAIL",
                             "child": ""
                         }
                     }
                 }]
             }
         }
     };
     public associationColumnDefinitions = {};
     public upsertHeaderFlag = false
     public sectionObjectDetails: {
         [objectName: string]: SectionObjectDetail
     } = {
         [this.__deppersonalinfo$tableName]: {
             'groupingColumns': [],
             'isRowClickDisabled': true,
             'dataFetchMode': 'Batch',
             'isExpanded': 'C',
             'isMatrixEnabled': false,
             'isAutoFitEnable': false,
             'matrixConfig': {
                 'matrixActionElementId': '',
                 'objectHierarchy': null,
                 'columnTitle': null,
                 'rowValues': [],
                 'selectionLimit': null,
                 'displayInfo': {
                     'currentMode': 'list',
                     'gridOptions': this.cspfmSlickgridMatrix.getMatrixGridOptions(this.matrixGridContainerId, ''),
                     'columns': [],
                     'dataset': []
                 }
             }
         }
     }
     public showFilter = false;
     public restrictionRules = [];
     public onLoadFetch = true;
     public layoutCriteriaQueryConfig = {};
     public modifiedSet = {
         "idArrayToFetch": [],
         "type": "",
         "id": ""
     }
     public lookupCriteriaQueryConfig = {};
     public layoutCriteriaQuery = '';
     public layoutCriteriaReationalObjectIds = [];
     public batchIdLimit = 1000;
     public layoutDataRestrictionUserIds = [];
     dataRestrictionIdSet: any;
     public batchWiseIdArray = [];
     public batchWiseIdArrayTemp = [];
     public resultCount = 0;
     public totalRecords = 0;
     public expandFlag = true;
     public isAnyDataFetchPending = false;
     public onGroupByEnabledObj = {
         onGroupByEnabled: false
     };

     public listenerName: string;
     private pendingListenerData: {
         [recordId: string]: any
     } = {};

     updateDataFetchStatus(status: boolean) {
         let slickgrid: SlickGrid = this.angularGrid['slickGrid'];
         slickgrid['isDataFetching'] = status;
         slickgrid.invalidate()
         slickgrid.render()
         this.angularGrid.resizerService.resizeGrid();
     }

     processPendingListeners() {
         console.log("pendingListenerData", this.pendingListenerData);
         let pendingIds = Object.keys(this.pendingListenerData);
         if (pendingIds.length > 0) {
             pendingIds.forEach(pendingId => {
                 let modified = JSON.parse(JSON.stringify(this.pendingListenerData[pendingId]))
                 this.processListenerData(modified)
                 delete this.pendingListenerData[pendingId];
             })
         }
     }
     public dataFetchMode: 'Full' | 'Batch' | 'OnClickBatch' = 'Batch';

     public groupingColumns = [];
     public isRowClick = false;
     public moreActionInfo = {}

     public draggableGroupingPlugin: any;
     public gridSearchRowToggle = false;
     public devWidth = this.platform.width();
     readonly headerHeight = 50;
     readonly rowHeight = 50;
     columnMode = ColumnMode;
     public columnMinWidth = 150;
     public gridMenuExtension: any;
     public matrixAngularGridInstance: AngularGridInstance;
     public isAnyClickDone = false;
     public currentPageIndex = 0;
     public nextBadgeDisabled = true;


     public itemsPerPageConfigured = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["itemsPerPageConfigured"]
     public pagination = {
         enabled: false,
         view: {
             itemPerPage: ["10", "15", "20", "25", "50", "75", "100", "200", "1000", "2000"],
             itemCount: this.itemsPerPageConfigured.toString()
         },
         bookmark: {
             0: ''
         },
         total_rows: 0,
         currentPageIndex: 0,
         nextBadgeDisabled: true,
         pagesCount: 0
     };
     public gridObj;
     public angularGrid: AngularGridInstance;
     public columnDefinitions: {
         [objectName: string]: Array < Column >
     } = {
         [this.__deppersonalinfo$tableName]: [{
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_7956960']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_7956960']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_7956960']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_7956960']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.string,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,

             filterable: true,
             filter: {



                 model: Filters.compoundInput
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_7956960'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_7956960']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_7956960']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 100,
                 required: true,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_7956960'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_7956961']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_7956961']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_7956961']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_7956961']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.string,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,

             filterable: true,
             filter: {



                 model: Filters.compoundInput
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_7956961'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_7956961']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_7956961']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 30,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_7956961'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.string,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,
             queryField: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962']['prop'] + appConstant['customFieldSuffix']['slickgrid'],
             filterable: true,
             filter: {
                 collection: this.slickgridUtils.getLabelValue(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962']['mappingDetails']),

                 enableTranslateLabel: true,
                 model: Filters.multipleSelect
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 100,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_7956962'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depdate_7956963']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depdate_7956963']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depdate_7956963']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depdate_7956963']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.date,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,
             queryField: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depdate_7956963']['prop'] + appConstant['customFieldSuffix']['slickgrid'],
             filterable: true,
             filter: {

                 operator: OperatorType.rangeInclusive,

                 model: Filters.compoundDate
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depdate_7956963'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depdate_7956963']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depdate_7956963']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align cs-slickgrid-inline-edit-pointer',

             editor: {
                 model: cspfmDateEditor,
                 validator: CspfmDataValidator,
                 editorOptions: this.cspfmFlatpickrConfigObject.getDateEditorOptions({
                     enableTime: false,
                     listeners: this.flatpickrListeners,
                     onOkButtonClick: () => {
                         this.slickgridUtils.commitCurrentEdit(this.gridObj)
                     }
                 })
             },
             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depdate_7956963'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_deptimestamp_7956964']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_deptimestamp_7956964']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_deptimestamp_7956964']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_deptimestamp_7956964']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.dateTime,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,
             queryField: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_deptimestamp_7956964']['prop'] + appConstant['customFieldSuffix']['slickgrid'],
             filterable: true,
             filter: {

                 operator: OperatorType.rangeInclusive,

                 model: Filters.compoundDate
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_deptimestamp_7956964'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_deptimestamp_7956964']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_deptimestamp_7956964']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align cs-slickgrid-inline-edit-pointer',

             editor: {
                 model: cspfmDateEditor,
                 validator: CspfmDataValidator,
                 editorOptions: this.cspfmFlatpickrConfigObject.getDateEditorOptions({
                     enableTime: true,
                     listeners: this.flatpickrListeners,
                     onOkButtonClick: () => {
                         this.slickgridUtils.commitCurrentEdit(this.gridObj)
                     }
                 })
             },
             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_deptimestamp_7956964'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depboolean_7956965']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depboolean_7956965']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depboolean_7956965']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depboolean_7956965']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.string,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,

             filterable: true,
             filter: {
                 collection: this.slickgridUtils.getLabelValue({
                     true: "true",
                     false: "false"
                 }),


                 model: Filters.multipleSelect
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depboolean_7956965'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depboolean_7956965']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depboolean_7956965']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 8,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_depboolean_7956965'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7956966']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7956966']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7956966']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7956966']['label']), 'fromEntity'),
             sortable: false,
             type: FieldType.unknown,

             exportCustomFormatter: CspfmDataExportFormatter,


             // minWidth: this.columnMinWidth,
             formatter: CspfmActionsFormatter,
             columnGroupKey: 'DepPersonInfoList_WEB_List.Action.Edit_1',

             filterable: false,
             filter: {



                 model: Filters.compoundInput
             },

             cssClass: 'cs-slickgrid-actionGroup',


             params: {
                 layoutId: this.layoutId,

                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 component: cspfmactionweb,
                 angularUtilService: this.angularUtilService,
                 actionInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7956966']['actionInfo'],


             },
             excludeFromExport: true,
             excludeFromHeaderMenu: true,
             headerCssClass: 'cs-headergroup',
             onCellClick: (mouseEvent, args) => {
                 this.onActionCellClick(mouseEvent, args, this.__deppersonalinfo$tableName);
             },

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7992398']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7992398']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7992398']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7992398']['label']), 'fromEntity'),
             sortable: false,
             type: FieldType.unknown,

             exportCustomFormatter: CspfmDataExportFormatter,


             // minWidth: this.columnMinWidth,
             formatter: CspfmActionsFormatter,
             columnGroupKey: 'DepPersonInfoList_WEB_List.Action.View_1',

             filterable: false,
             filter: {



                 model: Filters.compoundInput
             },

             cssClass: 'cs-slickgrid-actionGroup',


             params: {
                 layoutId: this.layoutId,

                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 component: cspfmactionweb,
                 angularUtilService: this.angularUtilService,
                 actionInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction7992398']['actionInfo'],


             },
             excludeFromExport: true,
             excludeFromHeaderMenu: true,
             headerCssClass: 'cs-headergroup',
             onCellClick: (mouseEvent, args) => {
                 this.onActionCellClick(mouseEvent, args, this.__deppersonalinfo$tableName);
             },

         }]
     };
     public gridOptions: GridOption = {
         enableAutoSizeColumns: false,
         enableEmptyDataWarningMessage: false,
         autoFitColumnsOnFirstLoad: false,

         autoCommitEdit: true,
         enableAutoResize: true,
         pagination: {
             pageSizes: [10, 15, 20, 25, 50, 75, 100, 200, 1000, 2000],
             pageSize: this.itemsPerPageConfigured
         },
         autoEdit: false,
         rowHeight: 40,
         enableCellNavigation: true,
         editable: true,
         enableSorting: true,
         enableFiltering: true,
         createPreHeaderPanel: true,
         showPreHeaderPanel: false,
         preHeaderPanelHeight: 40,
         i18n: this.translateService,
         enableExcelExport: true,
         enableExport: true,
         gridMenu: {
             hideExportExcelCommand: true,
             hideExportCsvCommand: true,
             customItems: [{
                     command: "cspfm-excel-export",
                     titleKey: "EXPORT_TO_EXCEL",
                     iconCssClass: "fa fa-file-excel-o",
                     action: (event, callbackArgs) => {
                         this.slickgridUtils.excelExport(event, callbackArgs, this.tempColumnDefinitions, this)
                     }
                 },

                 {
                     command: "cspfm-csv-export",
                     titleKey: "EXPORT_TO_CSV",
                     iconCssClass: "fa fa-download",
                     action: (event, callbackArgs) => {
                         this.slickgridUtils.excelExport(event, callbackArgs, this.tempColumnDefinitions, this)
                     }
                 }, {
                     command: "cspfm-groupby",
                     titleKey: "Group-by",
                     iconCssClass: "icon-mat-account_tree",
                     action: (event, callbackArgs) => {
                         this.slickgridUtils.openDraggableGroupingRow(this.onGroupByEnabledObj, this.gridObj, "List");
                     },
                     positionOrder: 95
                 }, {
                     command: "cspfm-clear-groupby",
                     titleKey: "Clear Grouping",
                     iconCssClass: "fa fa-times",
                     action: (event, callbackArgs) => {
                         this.slickgridUtils.clearGrouping(this.angularGrid, this.draggableGroupingPlugin, this.gridObj, this.gridOptions, this.filteredResultList, this.gridSearchRowToggle, this.onGroupByEnabledObj, undefined)
                     },
                     positionOrder: 96
                 }
             ],
         },
         enableAutoTooltip: true,
         autoTooltipOptions: {
             enableForCells: true,
             enableForHeaderCells: true,
             maxToolTipLength: 1000
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
         headerMenu: {
             hideColumnHideCommand: true,
             onAfterMenuShow: (e, args) => {
                 let getSlickGridContainerHeight = args.grid.getContainerNode().offsetHeight - 50;
                 let slickGridHeaderMenuButton = document.getElementsByClassName('slick-header-menu');
                 let setHeight = slickGridHeaderMenuButton[0].getAttribute("style") + " max-height: " + getSlickGridContainerHeight + "px";
                 slickGridHeaderMenuButton[0].setAttribute('style', setHeight);
                 slickGridHeaderMenuButton[0].classList.add('cs-custom-scroll');
             }
         },
         enableTranslate: true,
         enableDraggableGrouping: true,
         draggableGrouping: {
             dropPlaceHolderText: 'Drop a column header here to group by the column',
             deleteIconCssClass: 'fa fa-times',
             onGroupChanged: (e, args) => this.slickgridUtils.onGroupChanged(e, args, this.gridMenuExtension, this.angularGrid, this.tempColumnDefinitions, this.gridObj, this.draggableGroupingPlugin, this.gridOptions, this.layoutId),
             onExtensionRegistered: (extension) => {
                 this.draggableGroupingPlugin = extension
             }
         },
         presets: {
             sorters: [{
                 columnId: this.tableColumnInfo['pfm71658']['pfm71658_name_7956960']['prop'],
                 direction: 'ASC'
             }],
         },

     };

     async initiateFetch(methodCalledBy ? ) {
         if (!this.onlineIndxCreation.isAllSearchIndexCompleted) {
             return
         }
         this.fetchMethodCalled = true;

         if (this.isLoading === false && methodCalledBy !== "listener") {
             this.isLoading = true;
             this.dataProviderObject.startLazyLoading(this.listenerName)
         }

         if ((this.layoutDataRestrictionSet.length > 0 && this.layoutDataRestrictionSet[0]['restrictionType'] === "userAssignment") || (this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {

             const layoutDataRestrictionSet = {
                 "dataRestrictionSet": this.layoutDataRestrictionSet,
                 "criteriaQueryConfig": this.layoutCriteriaQueryConfig,
                 "junctionDataObjects": {},
                 "searchQuery": "",
                 "objectName": this.__deppersonalinfo$tableName
             }
             return this.cspfmLookupCriteriaUtilsObject.dataRestrictionFetch(layoutDataRestrictionSet, "list").then(result => {
                 if (methodCalledBy !== "listener") {
                     this.dataRestrictionIdSet = result;
                     this.batchWiseIdArray = lodash.chunk(this.dataRestrictionIdSet, this.batchIdLimit);
                     this.batchWiseIdArrayTemp = lodash.chunk(this.dataRestrictionIdSet, this.batchIdLimit);
                 }
                 if (this.dataRestrictionIdSet.length > 0) {
                     if (Object.keys(this.layoutCriteriaQueryConfig).length > 0 && !(this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {
                         return this.makeQueryAndStartFetch(methodCalledBy)
                     } else if (methodCalledBy == "listener") {
                         return result;
                     } else {
                         this.fetchAllDataWeb(this.objectHierarchyJSON).then(result => {
                             this.handleResult(result)
                         });
                     }
                 } else {
                     const result = {
                         'status': "FAILED",
                         'message': "",
                         'paginationAction': "",
                         'records': []
                     }
                     this.handleResult(result)
                 }
             })
         } else if (Object.keys(this.layoutCriteriaQueryConfig).length > 0) {
             return this.makeQueryAndStartFetch(methodCalledBy)
         } else {
             if (methodCalledBy === "listener") {
                 let taskList = []
                 let paginationInfo = this.pagination;
                 let fetchParams = {
                     'objectHierarchyJSON': this.objectHierarchyJSON,
                     'layoutDataRestrictionSet': this.layoutDataRestrictionSet,
                     'dataSource': this.dataSource,
                     pagination: {
                         limit: paginationInfo['view']['itemCount'],
                         offset: paginationInfo['currentPageIndex'] * Number(paginationInfo['view']['itemCount']),
                         bookmark: ""
                     }
                 }
                 fetchParams['searchListQuery'] = "type:" + this.__deppersonalinfo$tableName
                 if (this.modifiedSet['type'] === this.__deppersonalinfo$tableName) {
                     fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND _id:' + this.modifiedSet['id']
                 } else if (this.modifiedSet['idArrayToFetch'].length > 0) {
                     fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + this.modifiedSet['idArrayToFetch'].join(" OR ") + " ) "
                 }
                 taskList = taskList.concat(this.dataProviderObject.fetchDataFromDataSource(fetchParams, 'listener', fetchParams['searchListQuery']))
                 return Promise.all(taskList).then(result => {
                     let ids = [];
                     result.forEach(res => {
                         ids = ids.concat(res['rows'].map(e => e['id']))
                     })
                     return ids;
                 })
             } else {
                 this.slickgridResultList = [];
                 this.filteredResultList = [];
                 this.filteredResultListTemp = [];
                 return this.fetchAllDataWeb(this.objectHierarchyJSON).then(result => {
                     return this.handleResult(result)
                 });
             }
         }
     }

     async makeQueryAndStartFetch(methodCalledBy ? , paginationAction ? : 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh', paginationClickFlag ? ) {
         if (methodCalledBy !== 'listener') {
             this.dataProviderObject.startLazyLoading(this.listenerName)
         }

         const configObject = {
             'layoutCriteriaQueryConfig': this.layoutCriteriaQueryConfig,
             'listCriteriaDataObject': {}
         }

         if (this.layoutCriteriaQuery === '') {
             this.layoutCriteriaQueryConfig['relationalObjectResults'] = this.layoutCriteriaReationalObjectIds;
             this.layoutCriteriaQuery = this.cspfmLookupCriteriaUtilsObject.lookupCriteriaQueryEvaluateFunction(configObject)
         }
         if (methodCalledBy === 'listener') {
             const paginationInfo = this.pagination
             let fetchParams = {
                 'objectHierarchyJSON': this.objectHierarchyJSON,
                 'layoutDataRestrictionSet': this.layoutDataRestrictionSet,
                 'dataSource': this.dataSource,
                 pagination: {
                     limit: paginationInfo['view']['itemCount'],
                     offset: paginationInfo['currentPageIndex'] * Number(paginationInfo['view']['itemCount']),
                     bookmark: ""
                 }
             }
             fetchParams['searchListQuery'] = "type:" + this.__deppersonalinfo$tableName
             let batchIdQuery = fetchParams['searchListQuery'] + " AND " + this.layoutCriteriaQuery
             if (this.modifiedSet['type'] === this.__deppersonalinfo$tableName) {
                 fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND _id:' + this.modifiedSet['id']
             } else if (this.modifiedSet['idArrayToFetch'].length > 0) {
                 fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + this.modifiedSet['idArrayToFetch'].join(" OR ") + " ) "
             }
             return this.dataProviderObject.fetchDataFromDataSource(fetchParams, 'listener', batchIdQuery).then(result => {
                 return result["rows"].map(e => e['id']);
             })
         } else {
             if (this.batchWiseIdArray.length > 0 && this.dataFetchMode === 'OnClickBatch' && this.layoutCriteriaQuery !== '') {
                 const fetchParams = {
                     "objectName": this.__deppersonalinfo$tableName,
                     "searchListQuery": this.layoutCriteriaQuery
                 }
                 await this.dataProviderObject.primaryObjDataFetch(fetchParams, this.batchWiseIdArray).then((res => {
                     this.batchWiseIdArray = lodash.chunk(this.batchWiseIdArray, Number(this.pagination['view']['itemCount']));
                 }))
             }
             return this.fetchAllDataWeb(this.objectHierarchyJSON, '', paginationAction, paginationClickFlag).then(result => {
                 return this.handleResult(result)
             })
         }
     }
     async handleResult(result) {

         this.dataProviderObject.finishLazyLoading(this.listenerName, result['records'])
         this.angularGrid["slickGrid"]["isDataFetching"] = false;
         this.processPendingListeners();
         if (result && result['status'] && result['records'] && (result['status'] === 'SUCCESS' || result['records'].length > 0)) {
             this.angularGrid.resizerService.resizeGrid();
             if (this.dataFetchMode === "Batch") {
                 this.pagination['view']['itemCount'] = this.itemsPerPageConfigured.toString();
             }
             this.errorMessageToDisplay = 'No Records';
             let consolidatedItems = [...this.filteredResultList, ...result['records']]
             this.filteredResultList = lodash.uniqBy(consolidatedItems, "id");

             this.slickgridResultList = this.filteredResultList;
             this.gridObj.reRenderColumns(true)
             /* to refresh the data in slickgrid */
             this.gridObj.invalidate();
             this.isLoading = false;

             if (this.changeRef && !this.changeRef['destroyed']) {
                 this.changeRef.detectChanges();
             }
             this.angularGrid["slickGrid"]['isAutoFitEnable'] = this.sectionObjectDetails[this.__deppersonalinfo$tableName].isAutoFitEnable
             setTimeout(() => {
                 this.slickgridUtils.resizeColumnsByCellContent(this.angularGrid)
             }, 100);
             return Promise.resolve([true]);
         } else {
             if (!result['paginationAction']) {
                 this.filteredResultList = [];
                 this.slickgridResultList = [];
             }
             this.errorMessageToDisplay = result['message'];

             if (this.errorMessageToDisplay === "No internet") {
                 this.appUtilityConfig.presentNoInternetToast(this);
             }

             this.slickgridResultList = this.filteredResultList;
             this.gridObj.reRenderColumns(true)
             /* to refresh the data in slickgrid */
             this.gridObj.invalidate();
             this.isLoading = false;

             if (this.changeRef && !this.changeRef['destroyed']) {
                 this.changeRef.detectChanges();
             }
             return Promise.resolve([false]);
         }
     }
     upsertModifiedData(data: Array < any > ) {
         data = this.cspfmCustomFieldProviderObject.makeSlickGridCustomFields(data, this.columnDefinitions[this.__deppersonalinfo$tableName])
         if (this.angularGrid && data && data.length > 0) {
             this.angularGrid.dataView.beginUpdate();
             data.forEach(element => {
                 var value = this.angularGrid.dataView.getItemById(element['id'])
                 if (value) {
                     this.angularGrid.dataView.updateItem(element['id'], element);
                 } else {
                     this.angularGrid.dataView.addItem(element);
                 }
             });
             this.angularGrid.dataView.endUpdate();
             this.angularGrid.dataView.reSort();
             if (this.sectionObjectDetails[this.__deppersonalinfo$tableName]['matrixConfig']['displayInfo']['currentMode'] === 'matrix') {
                 this.slickgridUtils.changeMatrixLayout(this.isLoading, this.angularGrid, this.sectionObjectDetails, this.__deppersonalinfo$tableName, this.dataSource)
             }
         }
     }
     registerRecordChangeListener() {
         if (this.dataSource !== 'JsonDB') {
             this.appUtilityConfig.addEventSubscriptionlayoutIds(this.dependentObjectList, this.layoutId, this.dataSource);
         }
         this.observableListenerUtils.subscribe(this.layoutId, (modified) => {
             try {
                 const isRecordDeleted = this.liveListenerHandlerUtils.handleLiveListenerForDelectedRecords('LIST', modified, this);
                 if (isRecordDeleted) {
                     return;
                 }
                 if (!this.onlineIndxCreation.isAllSearchIndexCompleted) {
                     return
                 }
                 this.processListenerData(modified)

             } catch (error) {
                 console.log(error);
             }
         });
     }

     processListenerData(modified) {
         const filteredResultIdSet = this.angularGrid.dataView.getItems().map(mapIds => mapIds.id);

         if (modified["doc"]["data"]["type"].includes('userAssignment') && this.layoutDataRestrictionSet && this.layoutDataRestrictionSet[0]['restrictionType'] === 'userAssignment') {
             if (!this.appUtilityConfig.verifyUser(modified["doc"]["data"])) {
                 return false;
             }
             if (filteredResultIdSet.includes(modified["doc"]["data"]['reference_id']) && !modified["doc"]["data"]['isActive']) {
                 const removeOldIds = [modified["doc"]["data"]['reference_id']]
                 this.checkIfRecordsAvailableInSectionAndRemove(removeOldIds)
             } else {
                 this.initiateFetch('listener').then(criteriaMeetingIds => {
                     criteriaMeetingIds = criteriaMeetingIds.map(item => {
                         return this.liveListenerHandlerUtils.getIdWithoutPfm(item)
                     })
                     if (criteriaMeetingIds.includes(modified["doc"]["data"]['reference_id']) && modified["doc"]["data"]['isActive']) {
                         const addNewIds = [modified["doc"]["data"]['reference_id']]
                         if (addNewIds.length > 0) {
                             if (addNewIds.length === 1) {
                                 this.fetchModifiedRec(addNewIds[0]);
                             } else {
                                 this.fetchListenedRecords(addNewIds);
                             }
                         }
                     }
                 })
             }
         } else if (!modified["doc"]["data"]["type"].includes('userAssignment')) {
             if (this.layoutDataRestrictionUserIds.length > 0) {
                 const data = modified['doc']['data'];
                 var isCreatedByIdInUserRestriction = false;
                 if (data['createdby']) {
                     isCreatedByIdInUserRestriction = this.layoutDataRestrictionUserIds.indexOf(data['createdby']) > -1
                 } else if (data['created_by']) {
                     isCreatedByIdInUserRestriction = true
                 }
                 if (!isCreatedByIdInUserRestriction) {
                     return
                 }
             }
             let layoutInfo = {
                 "gridData": this.slickgridUtils.getGridData(this.angularGrid),
                 "formulaAndRollupFieldInfo": this.formulaAndRollupFieldInfo
             }
             let idArrayToFetch = this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.SECTION_FETCH, this.dependentObjectList, modified, layoutInfo);
             idArrayToFetch = lodash.map(idArrayToFetch, 'id')
             idArrayToFetch = lodash.uniq(idArrayToFetch)
             const prefix = this.__deppersonalinfo$tableName + "_2_";
             idArrayToFetch = idArrayToFetch.map(ids => ids.includes(prefix) ? ids : prefix + ids);
             if (modified['doc']['_id'].includes('rollup') || modified['doc']['_id'].includes('formula')) {
                 this.modifiedSet = {
                     "idArrayToFetch": [],
                     "type": "",
                     "id": ""
                 };
             } else {
                 if (this.layoutCriteriaQueryConfig['modifiedSet']) {
                     this.layoutCriteriaQueryConfig['modifiedSet']['type'] = modified['doc']['data']['type'];
                     this.layoutCriteriaQueryConfig['modifiedSet']['id'] = modified['doc']['_id'];
                 }
                 this.modifiedSet = {
                     "idArrayToFetch": idArrayToFetch,
                     "type": modified['doc']['data']['type'],
                     "id": modified['doc']['_id']
                 };
             }
             if (this.filteredResultList.length > 0) {
                 this.initiateFetch('listener').then(criteriaMeetingIds => {
                     let filteredResultListIds = this.filteredResultList.map(getIds => prefix + getIds.id);
                     const filteredIds = this.checkChangedListerData(criteriaMeetingIds, idArrayToFetch);
                     const addNewIds = lodash.difference(filteredIds, filteredResultListIds);
                     const removeOldIds = lodash.difference(filteredResultListIds, filteredIds);
                     const updateIds = lodash.intersection(idArrayToFetch, filteredIds);
                     this.addingChangeListerDataBasedOnFetchMode(addNewIds, removeOldIds, updateIds);
                 })
             } else {
                 if (this.filteredResultList.length === 0) {
                     this.initiateFetch();
                 }
             }
         }
     }

     checkChangedListerData(criteriaMeetingIds, idArrayToFetch) {
         const prefix = this.__deppersonalinfo$tableName + "_2_";
         let filteredResultListIds = this.angularGrid.dataView.getItems().map(getIds => prefix + getIds.id);
         if (criteriaMeetingIds === undefined || criteriaMeetingIds.length === 0) {
             filteredResultListIds = lodash.difference(filteredResultListIds, idArrayToFetch)
             return filteredResultListIds;
         } else {
             const addNewIds = lodash.difference(criteriaMeetingIds, filteredResultListIds);
             if (addNewIds && addNewIds.length > 0) {
                 filteredResultListIds = [...addNewIds, ...filteredResultListIds];
                 return filteredResultListIds;
             } else {
                 return filteredResultListIds;
             }
         }
     }

     addingChangeListerDataBasedOnFetchMode(addNewIds, removeOldIds, updateIds) {
         this.batchWiseIdArray = lodash.flatten(this.batchWiseIdArray);
         const prefix = this.__deppersonalinfo$tableName + "_2_";
         if (removeOldIds && removeOldIds.length > 0) {
             const removeidswithprefix = removeOldIds.map(el => el.includes(prefix) ? el : prefix + el)
             this.batchWiseIdArray = [...lodash.difference(this.batchWiseIdArray, removeidswithprefix)];
         }
         if (addNewIds && addNewIds.length > 0) {
             this.batchWiseIdArray = [...this.batchWiseIdArray, ...addNewIds];
         }
         this.batchWiseIdArrayTemp = [...this.batchWiseIdArray];
         if (this.dataFetchMode === 'OnClickBatch') {

             if (this.batchWiseIdArray.length > 0) {
                 this.totalRecords = this.batchWiseIdArray.length;
                 this.batchWiseIdArrayTemp = lodash.chunk(this.batchWiseIdArray, Number(this.pagination['view']['itemCount']));
                 this.batchWiseIdArray = this.batchWiseIdArrayTemp;
             }
             if (this.isLoading) {
                 this.isAnyDataFetchPending = true;
             } else {
                 return this.fetchAllDataWeb(this.objectHierarchyJSON, this.searchQueryForDesignDoc, 'current_page_refresh');
             }
         } else {
             if (removeOldIds && removeOldIds.length > 0) {
                 this.checkIfRecordsAvailableInSectionAndRemove(removeOldIds)
             }

             if (addNewIds && addNewIds.length > 0) {
                 this.fetchListenedRecords(addNewIds);
             } else if (updateIds && updateIds.length > 0) {
                 this.fetchListenedRecords(updateIds);
             }
         }
     }

     checkIfRecordsAvailableInSectionAndRemove(idsToremove) {
         idsToremove.forEach(modifiedDataId => {
             this.liveListenerHandlerUtils.modifiedDataSet(this.angularGrid, modifiedDataId, this.__deppersonalinfo$tableName, this.filteredResultList, this.gridSearchRowToggle)
         });
     }

     fetchListenedRecords(idArrayToFetch) {
         const additionalObjectdata = {};
         additionalObjectdata["id"] = idArrayToFetch;
         const objHierarchyJSON = JSON.parse(JSON.stringify(this.objectHierarchyJSON));

         const fetchParams = {
             objectHierarchyJSON: objHierarchyJSON,
             dataSource: this.dataSource,
             additionalInfo: additionalObjectdata
         }

         this.dataProviderObject.queryBulkDoc(fetchParams).then(result => {

             if (result["status"] !== "SUCCESS") {
                 this.errorMessageToDisplay = result["message"];
                 return;
             }
             this.upsertModifiedData(result['records']);
         })
     }


     async fetchAllDataWeb(objectHierarchyJSON, searchQuery ? ,
         paginationAction ? : 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh', paginationClickFlag ? ) {
         if (paginationClickFlag && this.isLoading) {
             this.listServiceUtils.presentToast("Another process is running, please wait");
             return
         }

         if (paginationAction && paginationAction !== 'limit_changed') {
             if (paginationAction === 'next_pressed') {
                 this.pagination['currentPageIndex'] = this.pagination['currentPageIndex'] + 1;
             } else if (paginationAction === 'prev_pressed' && this.pagination['currentPageIndex'] > 0) {
                 this.pagination['currentPageIndex'] = this.pagination['currentPageIndex'] - 1;
             } else if (paginationAction === 'current_page_refresh') {
                 this.pagination['currentPageIndex'] = this.pagination['currentPageIndex'];
             } else {
                 return Promise.resolve("");
             }
         } else {
             this.pagination['currentPageIndex'] = 0;
             this.pagination['bookmark'] = {
                 0: ''
             }
             if (this.dataFetchMode === 'OnClickBatch' && this.batchWiseIdArray.length > 0) {
                 this.batchWiseIdArray = lodash.flatten(this.batchWiseIdArray);
                 this.totalRecords = this.batchWiseIdArray.length;
                 this.batchWiseIdArrayTemp = lodash.chunk(this.batchWiseIdArray, Number(this.pagination['view']['itemCount']));
                 this.batchWiseIdArray = lodash.chunk(this.batchWiseIdArray, Number(this.pagination['view']['itemCount']));
             }
         }
         const fetchParams = {
             'objectHierarchyJSON': objectHierarchyJSON,
             'layoutDataRestrictionSet': this.layoutDataRestrictionSet,
             'dataSource': this.dataSource,

             listenerName: this.listenerName,
             isLazyLoadEnabled: true,
             pagination: {
                 limit: this.pagination['view']['itemCount'],
                 offset: this.pagination['currentPageIndex'] * Number(this.pagination['view']['itemCount']),
                 bookmark: ""
             }
         }

         if (this.dataFetchMode === 'Full') {
             fetchParams.isLazyLoadEnabled = false
         }

         if (this.pagination['bookmark'][this.pagination['currentPageIndex']]) {
             fetchParams['pagination']['bookmark'] = this.pagination['bookmark'][this.pagination['currentPageIndex']];
         }
         if (this.dataSource === appConstant.couchDBStaticName) {
             if (searchQuery) {
                 if (this.batchWiseIdArray.length > 0) {
                     if (this.dataFetchMode === 'OnClickBatch') {
                         fetchParams['batchIds'] = [...this.batchWiseIdArray[this.pagination['currentPageIndex']]];
                         fetchParams['pagination']['bookmark'] = "";
                     } else {
                         if (this.resultCount === this.pagination['total_rows']) {
                             fetchParams['searchListQuery'] = searchQuery + " AND _id : ( " + this.batchWiseIdArray[0].join(" OR ") + " )"
                             this.resultCount = 0;
                             this.batchWiseIdArray.shift();
                             fetchParams['pagination']['bookmark'] = "";
                         } else {
                             fetchParams['searchListQuery'] = searchQuery + " AND _id : ( " + this.batchWiseIdArrayTemp[this.batchWiseIdArrayTemp.length - this.batchWiseIdArray.length - 1].join(" OR ") + " )"
                         }
                     }
                 } else if (this.batchWiseIdArray.length === 0 && this.batchWiseIdArrayTemp.length > 0) {
                     fetchParams['searchListQuery'] = searchQuery + " AND _id : ( " + this.batchWiseIdArrayTemp[this.batchWiseIdArrayTemp.length - 1].join(" OR ") + " )"
                 } else {
                     fetchParams['searchListQuery'] = searchQuery
                 }
             } else {
                 if (this.batchWiseIdArray.length > 0) {
                     if (this.dataFetchMode === 'OnClickBatch') {
                         fetchParams['batchIds'] = [...this.batchWiseIdArray[this.pagination['currentPageIndex']]];
                         fetchParams['pagination']['bookmark'] = "";
                     } else {
                         if (this.resultCount === this.pagination['total_rows']) {
                             fetchParams['searchListQuery'] = "type:" + this.__deppersonalinfo$tableName + " AND _id : ( " + this.batchWiseIdArray[0].join(" OR ") + " )"
                             this.resultCount = 0;
                             this.batchWiseIdArray.shift();
                             fetchParams['pagination']['bookmark'] = "";
                         } else {
                             fetchParams['searchListQuery'] = "type:" + this.__deppersonalinfo$tableName + " AND _id : ( " + this.batchWiseIdArrayTemp[this.batchWiseIdArrayTemp.length - this.batchWiseIdArray.length - 1].join(" OR ") + " )"
                         }
                     }
                 } else if (this.batchWiseIdArray.length === 0 && this.batchWiseIdArrayTemp.length > 0) {
                     fetchParams['searchListQuery'] = "type:" + this.__deppersonalinfo$tableName + " AND _id : ( " + this.batchWiseIdArrayTemp[this.batchWiseIdArrayTemp.length - 1].join(" OR ") + " )"
                 } else {
                     fetchParams['searchListQuery'] = "type:" + this.__deppersonalinfo$tableName
                 }
             }
         }
         if (fetchParams['searchListQuery'] && this.layoutCriteriaQuery !== '' && !(this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {
             fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND ' + this.layoutCriteriaQuery
         }

         if (this.isLoading === false) {
             this.isLoading = true;
         }


         return this.dataProviderObject.fetchDataFromDataSource(fetchParams).then(res => {

             if (res['status'] === 'SUCCESS') {
                 this.pagination['bookmark'][this.pagination['currentPageIndex'] + 1] = res['bookmark'];
                 if (res['total_rows']) {
                     this.pagination['total_rows'] = res['total_rows']
                 } else if (this.totalRecords) {
                     this.pagination['total_rows'] = this.totalRecords;
                 } else {
                     this.pagination['total_rows'] = 0;
                 }

                 if (res['records'].length > 0) {
                     this.resultCount = this.resultCount + res['records'].length;
                     if (res["records"].length < this.pagination['view']['itemCount']) {
                         this.pagination['nextBadgeDisabled'] = true;
                     } else {
                         this.pagination['nextBadgeDisabled'] = false;
                     }
                     res['records'] = this.cspfmCustomFieldProviderObject.makeSlickGridCustomFields(res['records'], this.columnDefinitions[this.__deppersonalinfo$tableName])
                     if (this.dataFetchMode === 'OnClickBatch') {
                         this.updateDataFetchStatus(false)
                         this.filteredResultList = [...res['records']]
                         this.isLoading = false;
                         if (this.isAnyDataFetchPending) {
                             return this.fetchAllDataWeb(this.objectHierarchyJSON, searchQuery, 'current_page_refresh');
                             this.isAnyDataFetchPending = false;
                         }
                         this.itemCount = Number(this.pagination['view']['itemCount']);
                         if (this.batchWiseIdArray.length > 0 && !this.batchWiseIdArray[this.pagination['currentPageIndex'] + 1]) {
                             this.pagination['nextBadgeDisabled'] = true
                         }
                         if (this.pagination['currentPageIndex'] > 0 && this.pagination['nextBadgeDisabled']) {
                             let rowsCount = this.pagination['total_rows'] - (this.pagination['currentPageIndex'] * Number(this.pagination['view']['itemCount']))
                         } else {}
                         this.angularGrid.resizerService.resizeGrid();
                         return {
                             'status': res['status'],
                             'message': res['message'],
                             'paginationAction': paginationAction,
                             'records': this.filteredResultList
                         };
                     } else if (this.dataFetchMode === 'Batch') {
                         this.filteredResultList = [...this.filteredResultList, ...res['records']];
                     } else {
                         this.filteredResultListTemp = [...this.filteredResultListTemp, ...res['records']];
                     }
                     if (res['records'].length <= Number(this.pagination['view']['itemCount'])) {
                         if (this.dataFetchMode === "Batch" && this.pagination['view']['itemCount'] !== "2000") {
                             this.pagination['view']['itemCount'] = "2000";
                         }
                         return this.fetchAllDataWeb(objectHierarchyJSON, searchQuery, 'next_pressed')
                     }
                 } else if (this.batchWiseIdArray.length > 0) {
                     return this.fetchAllDataWeb(objectHierarchyJSON, searchQuery, 'next_pressed');
                 } else {
                     this.updateDataFetchStatus(false)
                     if (this.dataFetchMode === 'Full') {
                         this.filteredResultList = [...this.filteredResultListTemp]
                     }
                     if (this.dataFetchMode === 'OnClickBatch') {
                         this.pagination['nextBadgeDisabled'] = true;
                         if (paginationAction) {
                             if (this.pagination['currentPageIndex'] > 0) {
                                 this.pagination['currentPageIndex'] = this.pagination['currentPageIndex'] - 1;
                             }
                         } else {
                             this.filteredResultList = [];
                             this.slickgridResultList = [];
                         }
                     }
                     this.updateDataFetchStatus(false)
                     return {
                         'status': res['status'],
                         'message': res['message'],
                         'paginationAction': paginationAction,
                         'records': this.filteredResultList
                     }
                 }
             } else {
                 return {
                     'status': res['status'],
                     'message': res['message'],
                     'paginationAction': paginationAction,
                     'records': res['records']
                 }
             }
         }).catch(error => {
             this.updateDataFetchStatus(false)
             this.isLoading = false;
             return {
                 'status': "FAILED",
                 'message': "",
                 'paginationAction': "",
                 'records': []
             }
         });
     }
     refreshDataInretry() {
         if (this.onLoadFetch) {
             this.initiateFetch();
         }
     }
     async onActionCellClick(mouseEvent: KeyboardEvent | MouseEvent, args: OnEventArgs, objectName ? ) {

         if (args["grid"]["isDataFetching"]) {
             this.appUtilityConfig.showInfoAlert(
                 'Data fetching is in process. Please wait'
             );
             return;
         }

         let parentElement = mouseEvent && mouseEvent.target && mouseEvent.target['parentElement'] || undefined;
         let actionView = parentElement && parentElement.getAttribute('action-view') || undefined;
         let actionInfoValue = parentElement && parentElement.getAttribute('action-info') || undefined;
         let additionalChipValues = parentElement && parentElement.getAttribute('additionalChipValues') || '[]';
         let data = args.dataContext;
         if (actionView && actionInfoValue && actionView === 'button') {
             let actionInfo = JSON.parse(actionInfoValue);

             if (actionInfo['actionType'] === "EDIT" || actionInfo['actionType'] === "VIEW") {
                 this.decidePopupOrNavigation(actionInfo, data);
             }
         }


     }
     decidePopupOrNavigation(actionInfo, data) {
         let id;
         let dataObject = {}
         let checkRecordNotInitiated = true;
         id = actionInfo['navigationInfo']['relationalObjectInfo']['relationalObjectId'] === "" ?
             data[actionInfo['navigationInfo']['uniqueKey']] : this.appUtilityConfig.getDependentObjectId(data, actionInfo['navigationInfo']['relationalObjectInfo']);
         if (id && actionInfo['actionType'] === "EDIT") {
             if (actionInfo['navigationInfo']['relationalObjectInfo']['relationalObjectId'] === "") {
                 dataObject[data["type"]] = data
             } else {
                 dataObject = this.slickgridUtils.assignDataInDataObject(data, actionInfo['navigationInfo']['relationalObjectInfo'])
             }
             checkRecordNotInitiated = this.slickgridUtils.checkRecordInitiatedOrNotFromListSection(dataObject, 'Edit');
         }
         if (checkRecordNotInitiated) {
             typeof(id) === "undefined" ? this.appUtilityConfig.showInfoAlert(actionInfo['navigationInfo']['relationalObjectInfo']['relationalObjectName'] + " have no records"):
                 actionInfo['navigationInfo']['enablePopUp'] ? this.dialogOpenComponent(actionInfo, id, data) : this.appUtilityConfig.navigationToComponent(actionInfo, id);
         }
     }
     dialogOpenComponent(actionInfo, id, data) {
         const dialogConfig = new MatDialogConfig();
         dialogConfig.data = {
             params: {
                 action: 'Edit',
                 id: id,
                 redirectUrl: '/menu/' + actionInfo['navigationInfo']['redirectUrl'],
                 enablePopUp: actionInfo['navigationInfo']['enablePopUp']
             }
         };
         dialogConfig.panelClass = 'cs-dialoguecontainer-large';
     }






     onGridItemClick(event) {
         var cell = event['detail']['args']['cell'];
         var columns = event['detail']['args']['grid'].getColumns();
         var data = this.angularGrid.dataView.getItem(event['detail']['args']['row']);
         if (data['__group']) {
             return
         }
         if (columns[cell] && (columns[cell]['id'] === "_checkbox_selector" || columns[cell]['type'] === FieldType.unknown || (columns[cell]['params'] &&
                 columns[cell]['params']['cspfmEditorType'] && columns[cell]['params']['cspfmEditorType'] === 'LOOKUP' || columns[cell]['params']['cspfmEditorType'] === 'BALLOONUI'))) {
             return
         } else {
             let gridOptions = event['detail']['args']['grid'].getOptions();
             if (gridOptions && gridOptions['editable'] && gridOptions['editable'] === true) {
                 let fieldType = columns[cell]['params']['fieldInfo'] && columns[cell]['params']['fieldInfo']['fieldType']
                 if (fieldType === "MASTERDETAIL") {
                     let fieldInfo = columns[cell]['params']['fieldInfo'] && columns[cell]['params']['fieldInfo']['child'];
                     do {
                         fieldInfo = fieldInfo && fieldInfo['child'].hasOwnProperty('child') || fieldInfo;
                         fieldType = fieldInfo && fieldInfo['fieldType'];
                     } while (fieldType === "MASTERDETAIL");
                 }
                 if (fieldType === 'STATUSWORKFLOW') {
                     return;
                 }
             }


             if (event["detail"]["args"]["grid"]["isDataFetching"]) {
                 this.appUtilityConfig.showInfoAlert(
                     'Data fetching is in process. Please wait'
                 );
                 return;
             }
             this.slickGridItemClickCount++;
             if (this.slickGridItemClickCount === 1) {
                 setTimeout(() => {
                     if (this.slickGridItemClickCount === 1) {
                         console.log("onGridItemClick")

                     }
                     this.slickGridItemClickCount = 0;
                 }, 250);
             }
         }
     }
     public reportInput = {};
     public printInput = {};

     angularGridReady(angularGrid: AngularGridInstance) {
         this.angularGrid = angularGrid;
         this.slickgridUtils.draggableGroupingExtension(this.angularGrid, this.gridOptions);
         this.slickgridUtils.clearDataView(angularGrid);
         this.gridMenuExtension = this.angularGrid.extensionService.getExtensionByName(ExtensionName.gridMenu)
         this.gridObj = angularGrid.slickGrid;
         this.gridObj.setHeaderRowVisibility(false);

         this.gridObj['cspfm_grid_custom_data'] = {
             "page_title_key": "DepPersonInfoList_WEB_List.Layout.DepPersonInfoList_WEB_List",
             "angular_grid_excel_export_service_instance": angularGrid.excelExportService,
             "angular_grid_export_service_instance": angularGrid.exportService,
             "isPaginationEnabled": this.gridOptions['enablePagination']
         }
         this.gridObj.onDblClick.subscribe(event => {
             this.inlineEditBoolObj.isDoubleClicked = this.inlineEditBoolObj.isNavigated ? false : true
         })
         this.gridObj.onBeforeEditCell.subscribe((event, args) => {
             if (args.item['systemAttributes']) {
                 this.appUtilityConfig.fetchLockedUserDetail(args.item, this.workFlowMapping, this.cspfmMetaCouchDbProviderObject)
             }
             if (!this.isLoading && !this.inlineEditBoolObj.isNavigated && this.inlineEditBoolObj.isDoubleClicked && !args.item['systemAttributes']) {
                 this.gridIdConfig.setIdForInlineEdit(document, args['column']['params']['fieldInfo']['objectName'])
             }
             return !this.isLoading && !this.inlineEditBoolObj.isNavigated && this.inlineEditBoolObj.isDoubleClicked && !args.item['systemAttributes']
         })

         if (this.gridObj.getCanvasWidth() < window.innerWidth) {
             this.gridObj.setOptions({
                 enableAutoSizeColumns: true,
                 autoFitColumnsOnFirstLoad: true,
             })
         }
         if (this.groupingColumns.length > 0) {
             this.slickgridUtils.setInitialGrouping(this.tableName_pfm71658, this.gridObj, this.groupingColumns, this.tableColumnInfo, this.draggableGroupingPlugin)
         }


     }
     ngAfterViewInit() {
         this.slickgridUtils.groupScroll();
         this.slickgridUtils.flatpickerAddRemove(this.layoutId, 'set')
     }


     getSelectionEditorOptions() {
         return {
             onClose: () => {
                 if (this.gridObj) {
                     this.gridObj.getEditorLock().commitCurrentEdit();
                 }
             }
         }
     }





     onScroll(event) {
         if (this.flatpickrInstance) {
             if ((this.flatpickrInstance.element.getBoundingClientRect()['bottom'] <= document.getElementById(this.layoutId).getBoundingClientRect()['bottom']) ||
                 (this.flatpickrInstance.element.getBoundingClientRect()['top'] >= document.body.getBoundingClientRect()['bottom'])) {
                 console.log("top : ", this.flatpickrInstance.element.getBoundingClientRect()['top'], document.getElementById(this.layoutId).getBoundingClientRect()['bottom'])
                 console.log("bottom : ", this.flatpickrInstance.element.getBoundingClientRect()['bottom'], document.body.getBoundingClientRect()['bottom'])
                 this.flatpickrInstance.close()
             } else {
                 this.flatpickrInstance._positionCalendar(this.flatpickrInstance.element)
             }
         }
     }

     associationConfigurationAssignment() {
         this.associationConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['associationConfiguration']);


     }
     assignAssociationConfigToField(associationFieldObj, associationConfig) {
         if (associationFieldObj.hasOwnProperty('associationInfo')) {
             associationFieldObj['associationInfo'] = associationConfig
         } else {
             this.assignAssociationConfigToField(associationFieldObj['child'], associationConfig)
         }
     }



     ngOnDestroy() {
         console.log('unsubscribe in list')

         this.angularGrid.destroy();
         this.slickgridUtils.removeObservableListener(this.listenerName)
         if (this.fetchMethodCalled) {
             this.fetchMethodCalled = false;
             this.liveListenerHandlerUtils.unregisterRecordChangeListener(this.dependentObjectList, this.layoutId, this);
         }
         this.slickgridUtils.flatpickerAddRemove(this.layoutId, 'remove')
     }



     public fetchMethodCalled = false;
     fetchDataBycheckRunningIndexStatus() {
         if (this.onLoadFetch) {
             if (!this.fetchMethodCalled) {
                 this.initiateFetch();
                 console.log("fetchMethod called");
             }
         }
     }

     async fetchModifiedRec(modifiedDataId) {

         const additionalObjectdata = {};

         additionalObjectdata['id'] = modifiedDataId
         const objHierarchyJSON = JSON.parse(JSON.stringify(this.objectHierarchyJSON))
         if (objHierarchyJSON['options']) {
             delete objHierarchyJSON['options']
         }

         const fetchParams = {
             'objectHierarchyJSON': objHierarchyJSON,
             'dataSource': this.dataSource,
             'additionalInfo': additionalObjectdata
         }
         modifiedDataId = modifiedDataId.includes(this.tableName_pfm71658 + "_2_") ? modifiedDataId : this.tableName_pfm71658 + "_2_" + modifiedDataId
         this.dataProviderObject.querySingleDoc(fetchParams)
             .then(result => {

                 if (result["status"] !== "SUCCESS") {
                     this.errorMessageToDisplay = result["message"];
                     return;
                 }
                 this.upsertModifiedData(result['records']);
             })
             .catch(error => {
                 console.log(error);
             });
     }
     ngOnInit() {

     }
     ngAfterViewChecked() {
         this.appUtilityConfig.appendHttpToURL();
     }
     ionViewDidEnter() {
         if (this.appUtilityConfig.isMobileResolution === false) {
             this.resultList = [...this.resultList]
             this.filteredResultList = [...this.filteredResultList]
         }

         setTimeout(() => {
             const slickgridHeaderColumn = document.getElementsByClassName('slick-header-column')
             this.gridIdConfig.setSlickGridPaginationId(slickgridHeaderColumn, this.gridId, "deppersonalinfo",
                 this.columnDefinitions[this.__deppersonalinfo$tableName], document);
             this.listServiceUtils.windowHeight(document);
         }, 100)
     }
     ionViewWillUnload() {
         console.log('unsubscribe in list')
         this.observableListenerUtils.remove(this.tableName_pfm71658, '==');
     }
     addButton_7956959_Onclick() {
         const queryParamsRouting = {
             action: 'Add'
         };
         if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/DepPerson_MultiLine_Entry_WEB_Grid_with_List")) {
             queryParamsRouting['redirectUrl'] = "/menu/DepPersonInfoList_WEB_List";
         }
         this.router.navigate(['/menu/DepPerson_MultiLine_Entry_WEB_Grid_with_List'], {
             queryParams: queryParamsRouting,
             skipLocationChange: true
         });
     }
 }