

 /* 
  *   File: deppersonalinfo_d_w_hl_list.ts
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
     cspfmListSearchListUtils
 } from 'src/core/dynapageutils/cspfmListSearchListUtils';
 import {
     cspfmHeaderLineUtils
 } from "src/core/dynapageutils/cspfmHeaderLineUtils";
 import {
     cspfmSlickgridUtils
 } from 'src/core/dynapageutils/cspfmSlickgridUtils';
 import {
     cspfmLayoutConfiguration
 } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
 import {
     DrawerState
 } from "ion-bottom-drawer";
 import {
     ScreenOrientation
 } from "@awesome-cordova-plugins/screen-orientation/ngx";
 import {
     DatePipe
 } from "@angular/common";
 import {
     metaDataDbProvider
 } from 'src/core/db/metaDataDbProvider';
 import {
     metaDbConfiguration
 } from "src/core/db/metaDbConfiguration";
 import {
     cspfmLookupCriteriaUtils
 } from 'src/core/utils/cspfmLookupCriteriaUtils';
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
 @Component({
     selector: 'deppersonalinfo_d_w_hl_list',
     templateUrl: 'deppersonalinfo_d_w_hl_list.html'
 }) export class deppersonalinfo_d_w_hl_list implements OnInit {
     isCustomFetchLoading = false;
     dripDownAttribute = '';
     constructor(public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, public lookupFieldMapping: lookupFieldMapping, public objectTableMappingObject: objectTableMapping, public gridIdConfig: cspfmGridsectionListIdConfiguration, public dialog: MatDialog, public cspfmDataDisplay: cspfm_data_display, public translateService: TranslateService, public router: Router,
         public cspfmReportGenerationService: CspfmReportGenerationService, public activatRoute: ActivatedRoute, public objectTableMapping: objectTableMapping, public angularUtilService: AngularUtilService, platform: Platform, public dataProvider: dataProvider, public appUtilityConfig: appUtility, private changeRef: ChangeDetectorRef,
         public loadingCtrl: LoadingController, public toastCtrl: ToastController, public applicationRef: ApplicationRef, private screenOrientation: ScreenOrientation, private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils, public cspfmConditionalValidationUtils: cspfmConditionalValidationUtils,
         public observableListenerUtils: cspfmObservableListenerUtils, public onlineDbIndexCreation: onlineDbIndexCreation, public metaDbConfigurationObj: metaDbConfiguration, public metaDbProvider: metaDataDbProvider, public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils, public listServiceUtils: cspfmListSearchListUtils, public slickgridUtils: cspfmSlickgridUtils, public headerLineUtils: cspfmHeaderLineUtils, private cspfmConditionalFormattingUtils: cspfmConditionalFormattingUtils, public dbService: couchdbProvider, public slickgridPopoverService: SlickgridPopoverService, private cspfmSlickgridMatrix: cspfmSlickgridMatrixService, public popoverController: PopoverController, private cspfmCustomFieldProviderObject: cspfmCustomFieldProvider, public cspfmCustomFieldProvider: cspfmCustomFieldProvider, public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider, public executionDbConfigObject: cspfmExecutionPouchDbConfiguration, private datePipe: DatePipe, public alerCtrl: AlertController, public pfmObjectConfig: cspfmObjectConfiguration, public cspfmFlatpickrConfig: cspfmFlatpickrConfig,
         @Inject(MAT_DIALOG_DATA) data, private cspfmOnDemandFeature: cspfmOnDemandFeature, public dialogRef: MatDialogRef < deppersonalinfo_d_w_hl_list > , private zone: NgZone, private liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils, public cspfmLayoutConfig: cspfmLayoutConfiguration, private metaDbConfig: metaDbConfiguration, public customActionUtils: cspfmCustomActionUtils) {
         Object.keys(this.columnDefinitions).forEach(objectId => {
             this.appUtilityConfig.initialHiddenColumns(this.columnDefinitions, objectId);
         })
         this.customActionConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['customActionConfiguration']);

         this.listenerName = this.slickgridUtils.subscribeChildLazyLoading(this.layoutId, this.columnDefinitions, this.childObjects, this.sectionObjectDetails, this.childObjectsInfo)

         this.associationConfigurationAssignment();
         if (data.hasOwnProperty('params')) {
             this.isPopUpEnabled = true;
             dialogRef.disableClose = true;
             var params = data['params'];
             if (params["redirectUrl"]) {
                 this.redirectUrl = params["redirectUrl"]
             }
             if (params["isFromMenu"]) {
                 this.isFromMenu = params["isFromMenu"]
             }
             this.initializeStatusWorkFlowFields();
             this.id = params["id"];

             this.fetchSelectedObject(true);
         } else {
             this.activatRoute.queryParams.subscribe(params => {
                 if (Object.keys(params).length === 0 && params.constructor === Object) {
                     console.log("list query params skipped");
                     return
                 }
                 if (params["redirectUrl"]) {
                     this.redirectUrl = params["redirectUrl"]
                 }
                 this.initializeStatusWorkFlowFields();
                 this.id = params["id"];

                 this.fetchSelectedObject(true);
             });
         }
         Object.keys(this.columnDefinitions).forEach(objectId => {
             this.appUtilityConfig.setColumnWidth(this.columnDefinitions[objectId])
         })

         this.appUtilityConfig.setEventSubscriptionlayoutIds(
             this.tableName_pfm71658,
             this.layoutId
         );
         this.registerRecordChangeListener()
         this.registerSectionRecordChangeListener()
         Object.keys(this.sectionObjectsHierarchy).forEach(objectId => {
             this.listServiceUtils.prepareFormulaAndRollupFieldInfo(this.sectionObjectsHierarchy[objectId], this.formulaAndRollupFieldInfo)
         })
         this.dripDownAttribute = "#cs-dropdown-" + this.layoutId;

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
         "childObject": [{
             "objectId": "71655",
             "fieldId": "964453",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup2",
             "isStandardObject": "N",
             "relationShipType": "",
             "includeFields": true,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": []
         }, {
             "objectId": "5",
             "fieldId": "967712",
             "objectName": "COR_USERS",
             "objectType": "LOOKUP",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$COR_USERS_depcoruser",
             "isStandardObject": "Y",
             "relationShipType": "",
             "includeFields": true,
             "childObject": []
         }, {
             "objectId": "71655",
             "fieldId": "967505",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup3",
             "isStandardObject": "N",
             "relationShipType": "",
             "includeFields": true,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": []
         }, {
             "objectId": "71655",
             "fieldId": "967507",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup4",
             "isStandardObject": "N",
             "relationShipType": "",
             "includeFields": true,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": []
         }, {
             "objectId": "71655",
             "fieldId": "930602",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup",
             "isStandardObject": "N",
             "relationShipType": "",
             "includeFields": true,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": []
         }],
         "formulaField": [{
             "fieldName": "depformulan"
         }]
     };

     public layoutDataRestrictionSet = [];
     public layoutId = "203868";
     public layoutName = "deppersonalinfo_d_w_hl_list";
     public dataSource = "CouchDB";
     public searchQueryForDesignDoc = "";
     customAlert: any;
     private dbprovider;
     public sectionDependentObjectList: {
         [key: string]: DependentObjectListType
     } = {
         "203868_pfm74408": {
             "relationalObjects": {
                 "pfm74408": []
             },
             "lookupObjects": {
                 "pfm71655": {
                     "pfm74408": ["pfm71655_967516"]
                 },
                 "pfm5": {
                     "pfm74408": ["pfm5_967510"]
                 }
             }
         }
     };
     public tempColumnDefinitions = [];
     public dependentObjectList: DependentObjectListType = {
         "relationalObjects": {
             "pfm71658": []
         },
         "lookupObjects": {
             "pfm71655": {
                 "pfm74408": ["pfm74408", "pfm71655_967516"],
                 "pfm71658": ["pfm71655_967507"]
             },
             "pfm5": {
                 "pfm74408": ["pfm74408", "pfm5_967510"],
                 "pfm71658": ["pfm5_967712"]
             }
         },
         "dataRestrictionInvolvedObjects": {}
     };
     public isLoading = false;
     public workFlowActionConfig = {};
     public selectedRows = [];
     public isMailActionAvailable = false;
     public isWorkflowActionAvailable = false;
     public isnavigated = false;
     public isdblclicked = false;
     public groupingColumns = [];

     public itemsPerPageConfigured = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["itemsPerPageConfigured"]
     public paginationInfo = {
         "pagination": {
             enabled: true,
             view: {
                 itemPerPage: ["10", "15", "20", "25", "50", "75", "100", "200", "1000", "2000"],
                 itemCount: this.itemsPerPageConfigured.toString()
             },
             bookmark: {
                 0: ''
             },
             total_rows: 0,
             pagesCount: 0
         },
         "nextBadgeDisabled": true,
         "currentPageIndex": 0
     }

     public columnMinWidth = 150;
     public conditionalFormatRelationshipObjectHierarchy: Array < ObjectHierarchy > = []
     public conditionalFormatRelationshipDataObject = {}
     public restrictionRules = []
     public layoutCriteriaQueryConfig = {};
     public layoutCriteriaQuery = '';
     public layoutCriteriaReationalObjectIds = [];
     public layoutCriteriaDataObjects = {};
     public layoutDataRestrictionUserIds = [];
     public batchIdLimit = 1000;
     public dataObject = {}
     private id = "";
     public intervalId;
     private childObjectList = []
     private viewFetchActionInfo: Array < any > = [];
     public fetchActionInfo: any = {
         "processId": "",
         "processType": "",
         "actionType": "",
         "paramValue": ""
     };
     public redirectUrl = "/";
     objDisplayName = {
         "pfm71658": {
             "objectName": "deppersonalinfo",
             "objectDisplayName": "Dep_PersonalInfo"
         },
         "pfm74408": {
             "objectName": "depchildinfo",
             "objectDisplayName": "Dep_childInfo"
         }
     };
     public showNavigationHistoryPopUp = false;
     public navigationHistoryProperties = {
         navigatedPagesNameArray: [],
         navigatedPagesPathArray: [],
         routerVisLinkTagName: "",
         secondPreviousPage: "",
         navigatedPagesLength: 0,
         previousPage: "",
         previousPageName: "",
         secondPreviousPageName: ""
     };
     skeletonIntervalId: number | null = null;
     animation = 'pulse';
     public isAssociationLoading = true;
     public isFromMenu = false;
     private dataPaths: Array < {
         traversalPath: string;requiredTemp: boolean
     } > = [{
         traversalPath: 'deppersonalinfo_DUMMY$$depemployee_deplookup2',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$COR_USERS_depcoruser',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$depemployee_deplookup3',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$depemployee_deplookup4',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$depemployee_deplookup',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2',
         requiredTemp: false
     }, {
         traversalPath: 'deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4',
         requiredTemp: false
     }, ]
     public expandParentObjectData: 'C' | 'HO' | 'FO' = 'FO';
     public previousGridState;
     public pfm71658depformulanFormula = "square(deppersonalinfo.DepNumber)";
     public childObjects = ["pfm74408"];
     private objectNameMapping = {
         "pfm0s": "Dep_PersonalInfo",
         "pfm74408s": "Dep_childInfo"
     };
     public objectRelationshipMapping = {
         "pfm74408": "one_to_many"
     };
     public sectionObjectsHierarchy = {
         "pfm74408": {
             "objectId": "74408",
             "fieldId": "965874",
             "objectName": "depchildinfo",
             "objectType": "MASTERDETAIL",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster",
             "isStandardObject": "N",
             "relationShipType": "one_to_many",
             "includeFields": true,
             "formulaField": [{
                 "fieldName": "depcformula1"
             }],
             "childObject": [{
                 "objectId": "71655",
                 "fieldId": "965870",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 74408,
                 "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1",
                 "isStandardObject": "N",
                 "relationShipType": "",
                 "includeFields": true,
                 "formulaField": [{
                     "fieldName": "depformulan"
                 }],
                 "childObject": []
             }, {
                 "objectId": "71655",
                 "fieldId": "967514",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 74408,
                 "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup3",
                 "isStandardObject": "N",
                 "relationShipType": "",
                 "includeFields": true,
                 "formulaField": [{
                     "fieldName": "depformulan"
                 }],
                 "childObject": []
             }, {
                 "objectId": "5",
                 "fieldId": "967510",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 74408,
                 "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$COR_USERS_depcoruser",
                 "isStandardObject": "Y",
                 "relationShipType": "",
                 "includeFields": true,
                 "childObject": []
             }, {
                 "objectId": "71655",
                 "fieldId": "965872",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 74408,
                 "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2",
                 "isStandardObject": "N",
                 "relationShipType": "",
                 "includeFields": true,
                 "formulaField": [{
                     "fieldName": "depformulan"
                 }],
                 "childObject": []
             }, {
                 "objectId": "71655",
                 "fieldId": "967516",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 74408,
                 "rootPath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup4",
                 "isStandardObject": "N",
                 "relationShipType": "",
                 "includeFields": true,
                 "formulaField": [{
                     "fieldName": "depformulan"
                 }],
                 "childObject": []
             }]
         }
     };

     public angularGrid: AngularGridInstance;
     private filterService: FilterService;
     public selectedChildObj;
     public selectedTabVal = 0;
     public objectRecordCount = {}
     public slickgridChildObjectsInfo = [];
     public childObjectsInfo: Array < {
         displayName: string;
         objectName: string;
         childDocsArray: Array < any > ;
         relationshipType: string;
         paginationInfo: any;
         gridOptionInfo: GridOption;
         angularGridInstance: AngularGridInstance;
         additionalInfo ? : {
             [key: string]: any
         }
     } > = [];
     public draggableGroupingPlugin: any;
     public isRowClick = false;
     public expandFlag = true;
     public gridId = 'cspfm_grid_' + this.layoutId + "_";
     public gridContainerId = 'cspfm_grid_container_' + this.layoutId + "_";
     public matrixGridId = 'cspfm_matrix_grid_' + this.layoutId + "_";
     public matrixGridContainerId = 'cspfm_matrix_grid_container_' + this.layoutId + "_";
     public matrixAngularGridInstance: AngularGridInstance;
     public isAnyClickDone = false;
     public __deppersonalinfo$tableName = this.objectTableMapping.mappingDetail['deppersonalinfo'];
     public __depchildinfo$tableName = this.objectTableMapping.mappingDetail['depchildinfo'];
     public __depemployee$tableName = this.objectTableMapping.mappingDetail['depemployee'];
     public __COR_USERS$tableName = this.objectTableMapping.mappingDetail['COR_USERS'];
     public lookupCriteriaQueryConfig = {}
     public team_930594_7774718 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['team'];
     public location_930595_7774719 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['location'];
     public depmultiselect_967503_7774729 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['depmultiselect'];
     public depcheckbox_967504_7774730 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['depcheckbox'];
     public depdropdownn_972310_7774707 = this.pfmObjectConfig.objectConfiguration[this.__depchildinfo$tableName]['selectionFieldsMapping']['depdropdownn'];
     public gridFieldInfo: {
         [key: string]: FieldInfo
     } = {
         "pfm71658_name_7774716": {
             "id": "name",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$name.name",
             "fieldName": "name",
             "prop": "name",
             "fieldType": "TEXT",
             "objectName": "deppersonalinfo",
             "elementid": 7774716,
             "traversalpath": "deppersonalinfo_DUMMY$$name",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_employeename_7774717": {
             "id": "employeename",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$employeename.employeename",
             "fieldName": "employeename",
             "prop": "employeename",
             "fieldType": "TEXT",
             "objectName": "deppersonalinfo",
             "elementid": 7774717,
             "traversalpath": "deppersonalinfo_DUMMY$$employeename",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_team_7774718": {
             "id": "team",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$team.team",
             "fieldName": "team",
             "prop": "team",
             "fieldType": "DROPDOWN",
             "objectName": "deppersonalinfo",
             "elementid": 7774718,
             "traversalpath": "deppersonalinfo_DUMMY$$team",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.team_930594_7774718,
             "currencyDetails": ""
         },
         "pfm71658_location_7774719": {
             "id": "location",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$location.location",
             "fieldName": "location",
             "prop": "location",
             "fieldType": "DROPDOWN",
             "objectName": "deppersonalinfo",
             "elementid": 7774719,
             "traversalpath": "deppersonalinfo_DUMMY$$location",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.location_930595_7774719,
             "currencyDetails": ""
         },
         "pfm71658_depcurrency_7774720": {
             "id": "depcurrency",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depcurrency.depcurrency",
             "fieldName": "depcurrency",
             "prop": "depcurrency",
             "fieldType": "CURRENCY",
             "objectName": "deppersonalinfo",
             "elementid": 7774720,
             "traversalpath": "deppersonalinfo_DUMMY$$depcurrency",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": {
                 "currencyCode": "₹",
                 "display": true,
                 "digitsInfo": "1.2-2",
                 "locale": "en-IN"
             }
         },
         "pfm71658_deptimestamp_7774721": {
             "id": "deptimestamp",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$deptimestamp.deptimestamp",
             "fieldName": "deptimestamp",
             "prop": "deptimestamp",
             "fieldType": "TIMESTAMP",
             "objectName": "deppersonalinfo",
             "elementid": 7774721,
             "traversalpath": "deppersonalinfo_DUMMY$$deptimestamp",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateTimeFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depdate_7774722": {
             "id": "depdate",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depdate.depdate",
             "fieldName": "depdate",
             "prop": "depdate",
             "fieldType": "DATE",
             "objectName": "deppersonalinfo",
             "elementid": 7774722,
             "traversalpath": "deppersonalinfo_DUMMY$$depdate",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depboolean_7774723": {
             "id": "depboolean",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depboolean.depboolean",
             "fieldName": "depboolean",
             "prop": "depboolean",
             "fieldType": "BOOLEAN",
             "objectName": "deppersonalinfo",
             "elementid": 7774723,
             "traversalpath": "deppersonalinfo_DUMMY$$depboolean",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depnumber_7774724": {
             "id": "depnumber",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depnumber.depnumber",
             "fieldName": "depnumber",
             "prop": "depnumber",
             "fieldType": "NUMBER",
             "objectName": "deppersonalinfo",
             "elementid": 7774724,
             "traversalpath": "deppersonalinfo_DUMMY$$depnumber",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depdecimal_7774725": {
             "id": "depdecimal",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depdecimal.depdecimal",
             "fieldName": "depdecimal",
             "prop": "depdecimal",
             "fieldType": "DECIMAL",
             "objectName": "deppersonalinfo",
             "elementid": 7774725,
             "traversalpath": "deppersonalinfo_DUMMY$$depdecimal",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_deplookup_7774726": {
             "id": "pfm71655_930602_employeeid",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$deplookup.deplookup",
             "prop": "pfm71655_930602.employeeid",
             "fieldName": "pfm71655_930602",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 7774726,
             "traversalpath": "deppersonalinfo_DUMMY$$deplookup",
             "child": {
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "id": "employeeid",
                 "label": "employeeid",
                 "prop": "employeeid",
                 "fieldName": "employeeid",
                 "fieldType": "TEXT",
                 "objectName": "deppersonalinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71655_employeename_7774734": {
             "child": {
                 "id": "employeename",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depemployee_deplookup$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 7774734,
                 "traversalpath": "deppersonalinfo_DUMMY$$depemployee_deplookup$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "pfm71655_930602_employeename",
             "prop": "pfm71655_930602.employeename",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depemployee_deplookup$$employeename.employeename",
             "elementid": 7774734,
             "mappingDetails": "",
             "traversalpath": "deppersonalinfo_DUMMY$$depemployee_deplookup$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_930602",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_depformulan__f_7774727": {
             "id": "depformulan__f",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depformulan.depformulan",
             "fieldName": "depformulan__f",
             "prop": "depformulan__f",
             "fieldType": "FORMULA",
             "formulaType": "NUMBER",
             "objectName": "deppersonalinfo",
             "elementid": 7774727,
             "traversalpath": "deppersonalinfo_DUMMY$$depformulan",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_deplookup2_7774728": {
             "id": "pfm71655_964453_employeeid",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$deplookup2.deplookup2",
             "prop": "pfm71655_964453.employeeid",
             "fieldName": "pfm71655_964453",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 7774728,
             "traversalpath": "deppersonalinfo_DUMMY$$deplookup2",
             "child": {
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "id": "employeeid",
                 "label": "employeeid",
                 "prop": "employeeid",
                 "fieldName": "employeeid",
                 "fieldType": "TEXT",
                 "objectName": "deppersonalinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71655_employeename_7774735": {
             "child": {
                 "id": "employeename",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depemployee_deplookup2$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 7774735,
                 "traversalpath": "deppersonalinfo_DUMMY$$depemployee_deplookup2$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "pfm71655_964453_employeename",
             "prop": "pfm71655_964453.employeename",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depemployee_deplookup2$$employeename.employeename",
             "elementid": 7774735,
             "mappingDetails": "",
             "traversalpath": "deppersonalinfo_DUMMY$$depemployee_deplookup2$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_964453",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_depmultiselect_7774729": {
             "id": "depmultiselect",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depmultiselect.depmultiselect",
             "fieldName": "depmultiselect",
             "prop": "depmultiselect",
             "fieldType": "MULTISELECT",
             "objectName": "deppersonalinfo",
             "elementid": 7774729,
             "traversalpath": "deppersonalinfo_DUMMY$$depmultiselect",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.depmultiselect_967503_7774729,
             "currencyDetails": ""
         },
         "pfm71658_depcheckbox_7774730": {
             "id": "depcheckbox",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depcheckbox.depcheckbox",
             "fieldName": "depcheckbox",
             "prop": "depcheckbox",
             "fieldType": "CHECKBOX",
             "objectName": "deppersonalinfo",
             "elementid": 7774730,
             "traversalpath": "deppersonalinfo_DUMMY$$depcheckbox",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.depcheckbox_967504_7774730,
             "currencyDetails": ""
         },
         "pfm71658_deplookup3_7774731": {
             "id": "pfm71655_967505_employeeid",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$deplookup3.deplookup3",
             "prop": "pfm71655_967505.employeeid",
             "fieldName": "pfm71655_967505",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 7774731,
             "traversalpath": "deppersonalinfo_DUMMY$$deplookup3",
             "child": {
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "id": "employeeid",
                 "label": "employeeid",
                 "prop": "employeeid",
                 "fieldName": "employeeid",
                 "fieldType": "TEXT",
                 "objectName": "deppersonalinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depcoruser_7774733": {
             "id": "pfm5_967712_username",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depcoruser.depcoruser",
             "prop": "pfm5_967712.username",
             "fieldName": "pfm5_967712",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 7774733,
             "traversalpath": "deppersonalinfo_DUMMY$$depcoruser",
             "child": {
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "id": "username",
                 "label": "username",
                 "prop": "username",
                 "fieldName": "username",
                 "fieldType": "TEXT",
                 "objectName": "deppersonalinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71655_employeename_7774736": {
             "child": {
                 "id": "employeename",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depemployee_deplookup3$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 7774736,
                 "traversalpath": "deppersonalinfo_DUMMY$$depemployee_deplookup3$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "pfm71655_967505_employeename",
             "prop": "pfm71655_967505.employeename",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depemployee_deplookup3$$employeename.employeename",
             "elementid": 7774736,
             "mappingDetails": "",
             "traversalpath": "deppersonalinfo_DUMMY$$depemployee_deplookup3$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_967505",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_deplookup4_7774732": {
             "id": "pfm71655_967507_employeeid",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$deplookup4.deplookup4",
             "prop": "pfm71655_967507.employeeid",
             "fieldName": "pfm71655_967507",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 7774732,
             "traversalpath": "deppersonalinfo_DUMMY$$deplookup4",
             "child": {
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "id": "employeeid",
                 "label": "employeeid",
                 "prop": "employeeid",
                 "fieldName": "employeeid",
                 "fieldType": "TEXT",
                 "objectName": "deppersonalinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71655_employeename_7774737": {
             "child": {
                 "id": "employeename",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depemployee_deplookup4$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 7774737,
                 "traversalpath": "deppersonalinfo_DUMMY$$depemployee_deplookup4$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "pfm71655_967507_employeename",
             "prop": "pfm71655_967507.employeename",
             "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depemployee_deplookup4$$employeename.employeename",
             "elementid": 7774737,
             "mappingDetails": "",
             "traversalpath": "deppersonalinfo_DUMMY$$depemployee_deplookup4$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_967507",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         }
     };

     public __deplookup2$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup2'];
     public __depcoruser$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['depcoruser'];
     public __depclookup1$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depclookup1'];
     public __depclookup3$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depclookup3'];
     public __deplookup3$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup3'];
     public __depcoruser$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depcoruser'];
     public __deplookup4$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup4'];
     public __deplookup$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup'];
     public __depclookup2$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depclookup2'];
     public __depclookup4$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depclookup4'];
     public paginationConfigInfo = {
         "pfm74408": {
             "currentPageWithRecord": "true",
             "itemPerPage": "true",
             "numberOfPages": "true",
             "paginationPosition": "TOP",
             "noOfItemsPerPage": "50"
         }
     };
     public associationConfiguration = {};
     public associationTableColumnInfo: {
         [key: string]: {
             [key: string]: {
                 [key: string]: FieldInfo
             }
         }
     } = {};
     public tableColumnInfo = {
         [this.__depchildinfo$tableName]: {
             "pfm74408_depcname_7774692": {
                 "id": "depcname",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcname.depcname",
                 "fieldName": "depcname",
                 "prop": "depcname",
                 "fieldType": "TEXT",
                 "objectName": "depchildinfo",
                 "elementid": 7774692,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcname",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depcname1_7774693": {
                 "id": "depcname1",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcname1.depcname1",
                 "fieldName": "depcname1",
                 "prop": "depcname1",
                 "fieldType": "TEXT",
                 "objectName": "depchildinfo",
                 "elementid": 7774693,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcname1",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depcdate1_7774694": {
                 "id": "depcdate1",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcdate1.depcdate1",
                 "fieldName": "depcdate1",
                 "prop": "depcdate1",
                 "fieldType": "DATE",
                 "objectName": "depchildinfo",
                 "elementid": 7774694,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcdate1",
                 "child": "",
                 "dateFormat": this.appUtilityConfig.userDateFormat,
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depcnum1_7774695": {
                 "id": "depcnum1",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcnum1.depcnum1",
                 "fieldName": "depcnum1",
                 "prop": "depcnum1",
                 "fieldType": "NUMBER",
                 "objectName": "depchildinfo",
                 "elementid": 7774695,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcnum1",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depccurrency1_7774696": {
                 "id": "depccurrency1",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depccurrency1.depccurrency1",
                 "fieldName": "depccurrency1",
                 "prop": "depccurrency1",
                 "fieldType": "CURRENCY",
                 "objectName": "depchildinfo",
                 "elementid": 7774696,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depccurrency1",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": {
                     "currencyCode": "₹",
                     "display": true,
                     "digitsInfo": "1.2-2",
                     "locale": "en-IN"
                 },
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depboolean_7774697": {
                 "id": "depboolean",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depboolean.depboolean",
                 "fieldName": "depboolean",
                 "prop": "depboolean",
                 "fieldType": "BOOLEAN",
                 "objectName": "depchildinfo",
                 "elementid": 7774697,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depboolean",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depnumber_7774698": {
                 "id": "depnumber",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depnumber.depnumber",
                 "fieldName": "depnumber",
                 "prop": "depnumber",
                 "fieldType": "NUMBER",
                 "objectName": "depchildinfo",
                 "elementid": 7774698,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depnumber",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depcformula1__f_7774699": {
                 "id": "depcformula1__f",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcformula1.depcformula1",
                 "fieldName": "depcformula1__f",
                 "prop": "depcformula1__f",
                 "fieldType": "FORMULA",
                 "formulaType": "NUMBER",
                 "objectName": "depchildinfo",
                 "elementid": 7774699,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcformula1",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depdate_7774700": {
                 "id": "depdate",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdate.depdate",
                 "fieldName": "depdate",
                 "prop": "depdate",
                 "fieldType": "DATE",
                 "objectName": "depchildinfo",
                 "elementid": 7774700,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdate",
                 "child": "",
                 "dateFormat": this.appUtilityConfig.userDateFormat,
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depclookup1_7774701": {
                 "id": "pfm71655_965870_employeeid",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup1.depclookup1",
                 "prop": "pfm71655_965870.employeeid",
                 "fieldName": "pfm71655_965870",
                 "fieldType": "LOOKUP",
                 "objectName": "depchildinfo",
                 "elementid": 7774701,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup1",
                 "child": {
                     "child": "",
                     "dateFormat": "",
                     "mappingDetails": "",
                     "currencyDetails": "",
                     "boxStyle": "",
                     "valueStyle": "",
                     "id": "employeeid",
                     "label": "employeeid",
                     "prop": "employeeid",
                     "fieldName": "employeeid",
                     "fieldType": "TEXT",
                     "objectName": "depchildinfo"
                 },
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "pfm71655_employeename_7774709": {
                 "child": {
                     "id": "employeename",
                     "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$employeename.employeename",
                     "fieldName": "employeename",
                     "prop": "employeename",
                     "fieldType": "TEXT",
                     "objectName": "depemployee",
                     "elementid": 7774709,
                     "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$employeename",
                     "child": "",
                     "dateFormat": "",
                     "mappingDetails": "",
                     "currencyDetails": "",
                     "boxStyle": "",
                     "valueStyle": ""
                 },
                 "id": "pfm71655_965870_employeename",
                 "prop": "pfm71655_965870.employeename",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$employeename.employeename",
                 "elementid": 7774709,
                 "mappingDetails": "",
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup1$$employeename",
                 "dateFormat": "",
                 "currencyDetails": "",
                 "fieldName": "pfm71655_965870",
                 "fieldType": "LOOKUP",
                 "objectName": "depemployee"
             },
             "pfm74408_depclookup2_7774702": {
                 "id": "pfm71655_965872_employeeid",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup2.depclookup2",
                 "prop": "pfm71655_965872.employeeid",
                 "fieldName": "pfm71655_965872",
                 "fieldType": "LOOKUP",
                 "objectName": "depchildinfo",
                 "elementid": 7774702,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup2",
                 "child": {
                     "child": "",
                     "dateFormat": "",
                     "mappingDetails": "",
                     "currencyDetails": "",
                     "boxStyle": "",
                     "valueStyle": "",
                     "id": "employeeid",
                     "label": "employeeid",
                     "prop": "employeeid",
                     "fieldName": "employeeid",
                     "fieldType": "TEXT",
                     "objectName": "depchildinfo"
                 },
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "pfm74408_depcoruser_7774703": {
                 "id": "pfm5_967510_username",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcoruser.depcoruser",
                 "prop": "pfm5_967510.username",
                 "fieldName": "pfm5_967510",
                 "fieldType": "LOOKUP",
                 "objectName": "depchildinfo",
                 "elementid": 7774703,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depcoruser",
                 "child": {
                     "child": "",
                     "dateFormat": "",
                     "mappingDetails": "",
                     "currencyDetails": "",
                     "boxStyle": "",
                     "valueStyle": "",
                     "id": "username",
                     "label": "username",
                     "prop": "username",
                     "fieldName": "username",
                     "fieldType": "TEXT",
                     "objectName": "depchildinfo"
                 },
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "pfm74408_deptimestamp_7774704": {
                 "id": "deptimestamp",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$deptimestamp.deptimestamp",
                 "fieldName": "deptimestamp",
                 "prop": "deptimestamp",
                 "fieldType": "TIMESTAMP",
                 "objectName": "depchildinfo",
                 "elementid": 7774704,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$deptimestamp",
                 "child": "",
                 "dateFormat": this.appUtilityConfig.userDateTimeFormat,
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71655_employeename_7774710": {
                 "child": {
                     "id": "employeename",
                     "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2$$employeename.employeename",
                     "fieldName": "employeename",
                     "prop": "employeename",
                     "fieldType": "TEXT",
                     "objectName": "depemployee",
                     "elementid": 7774710,
                     "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2$$employeename",
                     "child": "",
                     "dateFormat": "",
                     "mappingDetails": "",
                     "currencyDetails": "",
                     "boxStyle": "",
                     "valueStyle": ""
                 },
                 "id": "pfm71655_965872_employeename",
                 "prop": "pfm71655_965872.employeename",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2$$employeename.employeename",
                 "elementid": 7774710,
                 "mappingDetails": "",
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depemployee_depclookup2$$employeename",
                 "dateFormat": "",
                 "currencyDetails": "",
                 "fieldName": "pfm71655_965872",
                 "fieldType": "LOOKUP",
                 "objectName": "depemployee"
             },
             "pfm74408_depdecimal_7774705": {
                 "id": "depdecimal",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdecimal.depdecimal",
                 "fieldName": "depdecimal",
                 "prop": "depdecimal",
                 "fieldType": "DECIMAL",
                 "objectName": "depchildinfo",
                 "elementid": 7774705,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdecimal",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depclookup3_7774706": {
                 "id": "pfm71655_967514_employeeid",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup3.depclookup3",
                 "prop": "pfm71655_967514.employeeid",
                 "fieldName": "pfm71655_967514",
                 "fieldType": "LOOKUP",
                 "objectName": "depchildinfo",
                 "elementid": 7774706,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup3",
                 "child": {
                     "child": "",
                     "dateFormat": "",
                     "mappingDetails": "",
                     "currencyDetails": "",
                     "boxStyle": "",
                     "valueStyle": "",
                     "id": "employeeid",
                     "label": "employeeid",
                     "prop": "employeeid",
                     "fieldName": "employeeid",
                     "fieldType": "TEXT",
                     "objectName": "depchildinfo"
                 },
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "pfm74408_depdropdownn_7774707": {
                 "id": "depdropdownn",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdropdownn.depdropdownn",
                 "fieldName": "depdropdownn",
                 "prop": "depdropdownn",
                 "fieldType": "DROPDOWN",
                 "objectName": "depchildinfo",
                 "elementid": 7774707,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depdropdownn",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": this.depdropdownn_972310_7774707,
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm74408_depclookup4_7774708": {
                 "id": "pfm71655_967516_employeeid",
                 "label": "deppersonalinfo_d_w_hl_list.Element.deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup4.depclookup4",
                 "prop": "pfm71655_967516.employeeid",
                 "fieldName": "pfm71655_967516",
                 "fieldType": "LOOKUP",
                 "objectName": "depchildinfo",
                 "elementid": 7774708,
                 "traversalpath": "deppersonalinfo_DUMMY$$depchildinfo_depcmaster$$depclookup4",
                 "child": {
                     "child": "",
                     "dateFormat": "",
                     "mappingDetails": "",
                     "currencyDetails": "",
                     "boxStyle": "",
                     "valueStyle": "",
                     "id": "employeeid",
                     "label": "employeeid",
                     "prop": "employeeid",
                     "fieldName": "employeeid",
                     "fieldType": "TEXT",
                     "objectName": "depchildinfo"
                 },
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "pfm74408_cspfmaction7774711": {
                 "id": "cspfmaction7774711",
                 "label": "deppersonalinfo_d_w_hl_list.Action.Edit_2",
                 "fieldName": "cspfmaction7774711",
                 "prop": "cspfmaction7774711",
                 "fieldType": "ACTION",
                 "elementid": 7774711,
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "actionInfo": [{
                     "isHiddenEnabled": "N",
                     "buttonCss": "cs-web-action-button",
                     "actionIcon": "icon-mat-create",
                     "actionName": "Edit_2",
                     "actionLabel": "Edit",
                     "actionType": "EDIT",
                     "sourceId": "7774711",
                     "traversalpath": "deppersonalinfo_d_w_hl_list_Edit_2",
                     "actionDisplayType": "Icon",
                     "objectName": "",
                     "boxStyle": "",
                     "labelStyle": "",
                     "valueStyle": "",
                     "navigationInfo": {
                         "navigationUrl": "depchildinfo_Entry_Web",
                         "redirectUrl": "deppersonalinfo_d_w_hl_list",
                         "uniqueKey": "id",
                         "enablePopUp": false,
                         "webserviceinfo": [],
                         "relationalObjectInfo": {
                             "relationalObjectName": "depchildinfo",
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

     public sectionObjectDetails: {
         [objectName: string]: SectionObjectDetail
     } = {
         [this.__depchildinfo$tableName]: {
             'groupingColumns': [],
             'isRowClickDisabled': false,
             'dataFetchMode': 'Batch',
             'isExpanded': 'E',
             'isMatrixEnabled': false,
             'isAutoFitEnable': true,
             'sectionElementId': 'SEC_deppersonalinfo_d_w_hl_list_Dep_childInfo_WEB_LIST_SECTION_',
             'sortByColumns': [{
                 columnId: this.tableColumnInfo['pfm74408']['pfm74408_depcname_7774692']['prop'],
                 direction: 'ASC'
             }],


             'matrixConfig': {
                 'matrixActionElementId': '',
                 'objectHierarchy': null,
                 'columnTitle': null,
                 'rowValues': [],
                 'selectionLimit': null,
                 'displayInfo': {
                     'currentMode': 'list',
                     'gridOptions': this.cspfmSlickgridMatrix.getMatrixGridOptions(this.matrixGridContainerId, this.__depchildinfo$tableName),
                     'columns': [],
                     'dataset': []
                 }
             },
             'criteriaQueryConfig': {
                 'queryConfig': {},
                 "junctionDataObjects": {},
                 "relationalObjectIds": [],
                 "criteriaQuery": "",
                 "modifiedSet": {
                     "id": "",
                     "type": ""
                 }
             },
             "sectionUserDataRestrictionSet": []
         },
     };
     public actionComponentJson = {}
     public childSectionHeaderActionConfig = {}
     public hiddenColumnsIds = {}
     private prominetDataMapping = {
         "pfm74408": [null, "depcname", "depcname1", "depcdate1", "depcnum1", "depccurrency1", "depboolean", "depnumber", "depcformula1", "depdate", "depclookup1", null, "depcoruser", "deptimestamp", "depdecimal", "depclookup3", "depdropdownn", "depclookup4"],
         "pfm71655": [null, null, null, null, null, null, null, null, null, null, null, "employeename", "employeename", "employeename", null, "employeename", null, null, null, "employeename", null, "employeename"],
         "pfm71658": [null, "name", "employeename", "team", "location", "depcurrency", "deptimestamp", "depdate", "depboolean", "depnumber", "depdecimal", "deplookup", null, "depformulan", "deplookup2", null, "depmultiselect", "depcheckbox", "depcoruser", null, "deplookup4"]
     };
     private sectionalFetchMapping = {
         "pfm74408": {}
     };
     public navigationParamsForDetailViewPage = {
         "pfm74408": []
     };
     private batchWiseIdArray: any = {
         "pfm74408": []
     }
     private batchWiseIdArrayTemp: any = {
         "pfm74408": []
     }
     private resultCount: any = {
         "pfm74408": 0
     }
     private totalRecords: any = {
         "pfm74408": 0
     }
     public itemCount: any = {
         "pfm74408": 0
     }


     public columnDefinitions: {
         [objectName: string]: Array < Column >
     } = {
         [this.__depchildinfo$tableName]: [{
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname_7774692']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname_7774692']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname_7774692']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname_7774692']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname_7774692'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname_7774692']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname_7774692']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 100,
                 required: true,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname_7774692'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname1_7774693']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname1_7774693']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname1_7774693']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname1_7774693']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname1_7774693'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname1_7774693']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname1_7774693']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 30,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcname1_7774693'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcdate1_7774694']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcdate1_7774694']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcdate1_7774694']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcdate1_7774694']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.date,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,
             queryField: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcdate1_7774694']['prop'] + appConstant['customFieldSuffix']['slickgrid'],
             filterable: true,
             filter: {

                 operator: OperatorType.rangeInclusive,

                 model: Filters.compoundDate
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcdate1_7774694'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcdate1_7774694']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcdate1_7774694']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcdate1_7774694'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcnum1_7774695']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcnum1_7774695']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcnum1_7774695']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcnum1_7774695']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.number,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,

             filterable: true,
             filter: {



                 model: Filters.compoundInputNumber
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcnum1_7774695'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcnum1_7774695']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcnum1_7774695']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcnum1_7774695'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depccurrency1_7774696']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depccurrency1_7774696']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depccurrency1_7774696']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depccurrency1_7774696']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.number,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,

             filterable: true,
             filter: {



                 model: Filters.compoundInputNumber
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depccurrency1_7774696'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depccurrency1_7774696']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depccurrency1_7774696']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depccurrency1_7774696'],
                 layoutId: this.layoutId,
                 precision: 2

             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depboolean_7774697']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depboolean_7774697']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depboolean_7774697']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depboolean_7774697']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depboolean_7774697'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depboolean_7774697']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depboolean_7774697']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 8,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depboolean_7774697'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depnumber_7774698']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depnumber_7774698']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depnumber_7774698']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depnumber_7774698']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.number,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,

             filterable: true,
             filter: {



                 model: Filters.compoundInputNumber
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depnumber_7774698'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depnumber_7774698']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depnumber_7774698']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depnumber_7774698'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcformula1__f_7774699']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcformula1__f_7774699']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcformula1__f_7774699']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcformula1__f_7774699']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcformula1__f_7774699'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcformula1__f_7774699']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcformula1__f_7774699']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcformula1__f_7774699'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdate_7774700']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdate_7774700']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdate_7774700']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdate_7774700']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.date,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,
             queryField: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdate_7774700']['prop'] + appConstant['customFieldSuffix']['slickgrid'],
             filterable: true,
             filter: {

                 operator: OperatorType.rangeInclusive,

                 model: Filters.compoundDate
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdate_7774700'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdate_7774700']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdate_7774700']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdate_7774700'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup1_7774701']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup1_7774701']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup1_7774701']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup1_7774701']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup1_7774701'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup1_7774701']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup1_7774701']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup1_7774701'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774709']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774709']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774709']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774709']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774709'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774709']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774709']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 30,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774709'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup2_7774702']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup2_7774702']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup2_7774702']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup2_7774702']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup2_7774702'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup2_7774702']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup2_7774702']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup2_7774702'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcoruser_7774703']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcoruser_7774703']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcoruser_7774703']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcoruser_7774703']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcoruser_7774703'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcoruser_7774703']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcoruser_7774703']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depcoruser_7774703'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_deptimestamp_7774704']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_deptimestamp_7774704']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_deptimestamp_7774704']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_deptimestamp_7774704']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.dateTime,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,
             queryField: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_deptimestamp_7774704']['prop'] + appConstant['customFieldSuffix']['slickgrid'],
             filterable: true,
             filter: {

                 operator: OperatorType.rangeInclusive,

                 model: Filters.compoundDate
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_deptimestamp_7774704'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_deptimestamp_7774704']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_deptimestamp_7774704']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_deptimestamp_7774704'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774710']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774710']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774710']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774710']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774710'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774710']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774710']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 30,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm71655_employeename_7774710'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdecimal_7774705']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdecimal_7774705']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdecimal_7774705']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdecimal_7774705']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.number,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,

             filterable: true,
             filter: {



                 model: Filters.compoundInputNumber
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdecimal_7774705'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdecimal_7774705']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdecimal_7774705']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdecimal_7774705'],
                 layoutId: this.layoutId,
                 precision: 2

             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup3_7774706']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup3_7774706']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup3_7774706']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup3_7774706']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup3_7774706'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup3_7774706']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup3_7774706']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup3_7774706'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.string,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,
             queryField: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707']['prop'] + appConstant['customFieldSuffix']['slickgrid'],
             filterable: true,
             filter: {
                 collection: this.slickgridUtils.getLabelValue(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707']['mappingDetails']),

                 enableTranslateLabel: true,
                 model: Filters.multipleSelect
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 100,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depdropdownn_7774707'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup4_7774708']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup4_7774708']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup4_7774708']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup4_7774708']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup4_7774708'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup4_7774708']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup4_7774708']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 0,
                 required: false,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_depclookup4_7774708'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_cspfmaction7774711']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_cspfmaction7774711']['label'])),
             field: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_cspfmaction7774711']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_cspfmaction7774711']['label']), 'fromEntity'),
             sortable: false,
             type: FieldType.unknown,

             exportCustomFormatter: CspfmDataExportFormatter,


             // minWidth: this.columnMinWidth,
             formatter: CspfmActionsFormatter,
             columnGroupKey: 'deppersonalinfo_d_w_hl_list.Action.Edit_2',

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
                 actionInfo: this.tableColumnInfo[this.__depchildinfo$tableName]['pfm74408_cspfmaction7774711']['actionInfo'],

                 actionConfig: this.actionComponentJson[this.__depchildinfo$tableName],
                 excludeFromExport: true,
                 excludeFromHeaderMenu: true,
                 objectId: this.__depchildinfo$tableName,
             },
             excludeFromExport: true,
             excludeFromHeaderMenu: true,
             headerCssClass: 'cs-headergroup',
             onCellClick: (mouseEvent, args) => {
                 this.onActionCellClick(mouseEvent, args, this.__depchildinfo$tableName);
             },

         }]
     };

     public listenerName: {
         [childObject: string]: string
     };
     private pendingListenerData: {
         [childObject: string]: {
             [recordId: string]: any
         }
     } = {}

     updateDataFetchStatus(childObject, status: boolean) {
         let angularGrid: AngularGridInstance = childObject['angularGridInstance'];
         let slickgrid: SlickGrid = angularGrid['slickGrid'];
         slickgrid['isDataFetching'] = status;
         slickgrid.invalidate()
         slickgrid.render()
     }

     processPendingListeners() {
         let sectionObjects = Object.keys(this.pendingListenerData);
         if (sectionObjects.length > 0) {
             sectionObjects.forEach(sectionObjectName => {
                 let pendingIds = Object.keys(this.pendingListenerData[sectionObjectName]);
                 if (pendingIds.length > 0) {
                     pendingIds.forEach(pendingId => {
                         let modified = JSON.parse(JSON.stringify(this.pendingListenerData[sectionObjectName][pendingId]))
                         this.processListenerData(modified, sectionObjectName)
                         delete this.pendingListenerData[pendingId];
                     })
                 }
             })
         }
     }
     public moreActionInfo = {}




     getSelectionEditorOptions(childObjectName) {
         return {
             onClose: () => {
                 const childObject = this.slickgridUtils.getChildObject(childObjectName, this.childObjectsInfo)
                 if (childObject) {
                     childObject['gridObj'].getEditorLock().commitCurrentEdit();
                 }
             }
         }
     }
     tabChilds: {
         [tabTitle: string]: Array < string >
     } = {};
     angularGridReady(angularGrid: AngularGridInstance, childObject, tabInfo ? : {
         tabGroupId: string,
         tabTitle: string
     }) {

         if (tabInfo) {
             let tabUniqueKey = tabInfo['tabGroupId'] + '_' + tabInfo['tabTitle']
             if (!this.tabChilds[tabUniqueKey]) {
                 this.tabChilds[tabUniqueKey] = []
             }
             this.tabChilds[tabUniqueKey].push(childObject['objectName'])
         }
         this.filterService = angularGrid.filterService;
         childObject['gridMenuExtension'] = angularGrid.extensionService.getExtensionByName(ExtensionName.gridMenu)
         childObject['angularGridInstance'] = angularGrid
         childObject['gridObj'] = angularGrid.slickGrid;
         this.slickgridUtils.draggableGroupingExtension(childObject['angularGridInstance'], childObject['gridObj'].getOptions())
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
             console.log("input")
         });
         childObject['gridObj'].setHeaderRowVisibility(false);

         childObject['gridObj']['cspfm_grid_custom_data'] = {
             "page_title_key": "deppersonalinfo_d_w_hl_list.Layout.deppersonalinfo_d_w_hl_list",
             "object_display_name": childObject['displayName'],
             "angular_grid_excel_export_service_instance": angularGrid.excelExportService,
             "angular_grid_export_service_instance": angularGrid.exportService,
             "isPaginationEnabled": childObject['gridObj'].getOptions()['enablePagination']
         }
         if (childObject['gridObj'].getCanvasWidth() < window.innerWidth) {
             childObject['gridObj'].setOptions({
                 enableAutoSizeColumns: true,
                 autoFitColumnsOnFirstLoad: true,
             })
         }
         if ((!childObject['isInitialGroupingSet'] && this.sectionObjectDetails[childObject['objectName']]['groupingColumns'].length > 0) ||
             (childObject['groupColumns'] && childObject['groupColumns'].length > 0)) {
             this.slickgridUtils.setInitialGrouping(childObject['objectName'], childObject['gridObj'], this.sectionObjectDetails[childObject['objectName']]['groupingColumns'], this.tableColumnInfo, childObject['draggableGroupingPlugin'])
         }



     }
     ngAfterViewInit() {
         this.slickgridUtils.groupScroll();
         this.slickgridUtils.flatpickerAddRemove(this.layoutId, 'set')
     }

     ionSelectValueChange(childObjectData) {
         if (childObjectData['isLoading']) {
             this.appUtilityConfig.presentToast("Another process is running, please wait");
             return
         }
         var sectionChildObjectHierarchy = this.sectionObjectsHierarchy[
             childObjectData['objectName']
         ];

         this.makeQueryAndStartFetch(sectionChildObjectHierarchy, childObjectData, 'limit_changed')

     }

     async fetchSelectedObject(isChildFetchNeed) {
         if (isChildFetchNeed) {

             this.childObjects.forEach(childObjectName => {
                 const objectName = childObjectName.split('_')[0];
                 const pluralName = this.dataProvider.getPluralName(objectName);
                 let displayName;
                 if (this.sectionObjectDetails[childObjectName]['isRelatedList']) {
                     displayName = this.objectNameMapping[childObjectName];
                 } else {
                     displayName = this.objectNameMapping[pluralName];
                 }
                 var gridOption: GridOption = this.slickgridUtils.getGridOptions(childObjectName, this.childObjectsInfo, this.gridContainerId, this.sectionObjectDetails, this.layoutId, this.itemsPerPageConfigured, this.hiddenColumnsIds[childObjectName]);
                 var paginationInfo = JSON.parse(JSON.stringify(this.paginationInfo));

                 gridOption['autoResize']['containerId'] = this.gridContainerId + childObjectName
                 if (this.sectionObjectDetails[childObjectName]['dataFetchMode'] === 'Full' ||
                     this.sectionObjectDetails[childObjectName]['dataFetchMode'] === 'Batch') {
                     gridOption['enablePagination'] = true;
                     paginationInfo["pagination"]['enabled'] = false;
                     if (this.sectionObjectDetails[childObjectName]['dataFetchMode'] === 'Full') {
                         paginationInfo["pagination"]["view"]["itemCount"] = "2000";
                     }
                     gridOption['gridMenu']['customItems'].push({
                         divider: true,
                         command: '',
                         positionOrder: 90
                     });
                     gridOption['gridMenu']['customItems'].push({
                         command: "cspfm-toggle-pagination",
                         titleKey: "Toggle pagination",
                         iconCssClass: "fa fa-bookmark",
                         action: (event, callbackArgs) => {
                             this.slickgridUtils.togglePagination(event, callbackArgs, processChildObject['gridObj'], processChildObject['angularGridInstance'])
                         },
                         positionOrder: 94
                     });
                     gridOption['gridMenu']['customItems'].push({
                         command: "Trigger-to-close",
                         titleKey: "Trigger to close",
                         cssClass: 'cs-display-none pinpoint',
                     });
                 } else {
                     gridOption['enablePagination'] = false;
                     paginationInfo["pagination"]['enabled'] = true;
                 }
                 let sectionalObject: SectionObjectDetail = this.sectionObjectDetails[childObjectName];
                 if (this.isWorkflowActionAvailable === true || sectionalObject['isMatrixEnabled'] === true || sectionalObject['slickgridSelectOptionEnabled'] === true || (this.childObjectList.includes(childObjectName) || this.childSectionHeaderActionConfig[childObjectName])) {
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
                     Object.assign(gridOption, rowSelectionOption);
                 }
                 const processChildObject = {
                     displayName: displayName,
                     objectName: childObjectName,
                     childDocsArray: [],
                     relationshipType: this.objectRelationshipMapping[childObjectName],
                     paginationInfo: paginationInfo,
                     gridOptionInfo: gridOption,
                     angularGridInstance: this.angularGrid,
                     additionalInfo: {
                         tempDataArray: [],
                         dataFetchMode: this.sectionObjectDetails[childObjectName]['dataFetchMode'],
                         gridSearchRowToggle: false
                     },
                     isInitialGroupingSet: false,
                     tempColumnDefinitions: [],
                     isAnyDataFetchPending: false,
                     isLoading: false
                 };

                 if (this.childObjectsInfo.length !== this.childObjects.length) {
                     this.childObjectsInfo.push(processChildObject)
                 }

             });
         }
         const additionalObjectdata = {};
         additionalObjectdata["id"] = this.id;
         additionalObjectdata["isFirstLevelFetchNeed"] = true;
         const fetchParams = {
             objectHierarchyJSON: this.objectHierarchyJSON,
             additionalInfo: additionalObjectdata,
             dataSource: appConstant.couchDBStaticName
         };
         var taskList = [];
         return this.dataProvider
             .querySingleDoc(fetchParams)
             .then(async result => {
                 clearInterval(this.skeletonIntervalId);
                 if (result["status"] !== "SUCCESS") {
                     this.isSkeletonLoading = false
                     this.errorMessageToDisplay = result["message"];
                     if (this.errorMessageToDisplay === "No internet") {
                         this.appUtilityConfig.presentNoInternetToast(this);
                     }

                     return;
                 }
                 this.dataObject['deppersonalinfo_DUMMY'] = result["records"][0];
                 this.cspfmDataTraversalUtilsObject.updateLayoutData(this.dataPaths, this.dataObject['deppersonalinfo_DUMMY'], this.dataObject, this.layoutId, true);
                 Object.keys(this.sectionObjectDetails).forEach(objectName => {
                     if (this.sectionObjectDetails[objectName]['criteriaQueryConfig']) {
                         if (this.sectionObjectDetails[objectName]['criteriaQueryConfig']['junctionDataObjects']) {
                             this.sectionObjectDetails[objectName]['criteriaQueryConfig']['junctionDataObjects'][this.__deppersonalinfo$tableName] = [this.dataObject['deppersonalinfo_DUMMY']]
                         } else {
                             this.sectionObjectDetails[objectName]['criteriaQueryConfig']['junctionDataObjects'] = {}
                             this.sectionObjectDetails[objectName]['criteriaQueryConfig']['junctionDataObjects'][this.__deppersonalinfo$tableName] = [this.dataObject['deppersonalinfo_DUMMY']]
                         }
                     }
                 })


                 taskList.push(result)
                 if (isChildFetchNeed) {
                     this.childObjects.forEach(childObjectName => {
                         var sectionChildObjectHierarchy = this.sectionObjectsHierarchy[childObjectName];
                         var index = this.childObjectsInfo.findIndex(childObject => childObject['objectName'] === childObjectName)
                         taskList.push(
                             this.initiateFetch(sectionChildObjectHierarchy, this.childObjectsInfo[index])
                             .then(childResponse => {
                                 return childResponse;
                             })
                         );
                     });
                 }

                 this.isSkeletonLoading = false;
                 Promise.all(taskList).then(async res => {
                     this.resizeAngularSlickgrid(this.childObjects);
                     console.log("All res");
                 });
                 if (!this.objectHierarchyJSON['isLazyLoadingEnabled']) {
                     this.isAssociationLoading = false
                 }
             }).catch(error => {
                 this.isSkeletonLoading = false;

                 console.log(error);
             })
     }

     async initiateFetch(sectionChildObjectHierarchy, childObject, methodCalledBy ? ) {
         const objectName = childObject['objectName'];
         if (methodCalledBy !== 'listener') {
             childObject['isLoading'] = true
             this.dataProvider.startLazyLoading(this.listenerName[objectName])
         }
         let sectionObjectDetails = this.sectionObjectDetails[objectName]
         if ((sectionObjectDetails['criteriaQueryConfig'] && sectionObjectDetails['criteriaQueryConfig']['queryConfig'] && sectionObjectDetails['criteriaQueryConfig']['queryConfig']['relationalObjects'] && Object.keys(sectionObjectDetails['criteriaQueryConfig']['queryConfig']['relationalObjects']).length > 0) ||
             (sectionObjectDetails['sectionUserDataRestrictionSet'] && sectionObjectDetails['sectionUserDataRestrictionSet'].length > 0 && sectionObjectDetails['sectionUserDataRestrictionSet'][0]['restrictionType'] === "userAssignment" && methodCalledBy !== 'listener')) {
             const queryConfig = sectionObjectDetails['criteriaQueryConfig']['queryConfig']
             if (queryConfig && queryConfig['junctionObjectsHierarchy'] && queryConfig['junctionObjectsHierarchy'].length > 0) {
                 await this.cspfmLookupCriteriaUtils.getJunctionObjects(queryConfig['junctionObjectsHierarchy']).then(junctionDataObjects => {
                     if (junctionDataObjects[this.__deppersonalinfo$tableName] && sectionObjectDetails['junctionDataObjects'][this.__deppersonalinfo$tableName]) {
                         junctionDataObjects[this.__deppersonalinfo$tableName].push(sectionObjectDetails['junctionDataObjects'][this.__deppersonalinfo$tableName])
                     }
                     sectionObjectDetails['junctionDataObjects'] = {
                         ...sectionObjectDetails['junctionDataObjects'],
                         ...junctionDataObjects
                     }
                     return sectionObjectDetails['junctionDataObjects'];
                 })
             }
             const layoutDataRestrictionSet = {
                 "dataRestrictionSet": sectionObjectDetails['sectionUserDataRestrictionSet'],
                 "criteriaQueryConfig": sectionObjectDetails['criteriaQueryConfig']['queryConfig'],
                 "junctionDataObjects": sectionObjectDetails['criteriaQueryConfig']['junctionDataObjects'],
                 "searchQuery": "type:" + objectName + ' AND ' + this.__deppersonalinfo$tableName + ":" + this.id,
                 "objectName": objectName
             }
             if (sectionChildObjectHierarchy['objectType'] === "REVERSE_LOOKUP") {
                 layoutDataRestrictionSet['searchQuery'] = "type:" + objectName.split('_')[0] + " AND " + sectionChildObjectHierarchy["lookupField"] + ":" + this.id
                 layoutDataRestrictionSet['objectName'] = objectName.split('_')[0]
             }
             return this.cspfmLookupCriteriaUtils.dataRestrictionFetch(layoutDataRestrictionSet, "HL_list").then(res => {
                 if (methodCalledBy !== 'listener') {
                     this.batchWiseIdArray[objectName] = lodash.chunk(res, this.batchIdLimit);
                     this.batchWiseIdArrayTemp[objectName] = lodash.chunk(res, this.batchIdLimit);
                 } else {
                     if (res && res.length > 0) {
                         childObject['modifiedSet']['dataRestrictionIdSet'] = lodash.chunk(res, this.batchIdLimit);
                         this.batchWiseIdArray[objectName] = lodash.flatten(this.batchWiseIdArray[objectName])
                         const batchIds = this.checkChangedListerData(res, childObject['modifiedSet']['idArrayToFetch'], this.batchWiseIdArray[objectName])
                         this.batchWiseIdArray[objectName] = lodash.chunk(batchIds, this.batchIdLimit);
                         this.batchWiseIdArrayTemp[objectName] = lodash.chunk(batchIds, this.batchIdLimit);
                     }
                 }
                 if (this.batchWiseIdArray[objectName].length > 0 && res && res.length > 0) {
                     if (sectionObjectDetails['criteriaQueryConfig']['queryConfig'] && Object.keys(sectionObjectDetails['criteriaQueryConfig']['queryConfig']).length > 0 && !(sectionObjectDetails['criteriaQueryConfig']['queryConfig'] && sectionObjectDetails['criteriaQueryConfig']['queryConfig']['relationalObjects'] && sectionObjectDetails['criteriaQueryConfig']['queryConfig']['relationalObjects'].length > 0)) {
                         return this.makeQueryAndStartFetch(sectionChildObjectHierarchy, childObject, undefined, undefined, methodCalledBy)
                     } else {
                         if (methodCalledBy === 'listener') {
                             return res;
                         } else {
                             return this.fetchAllDataWeb(sectionChildObjectHierarchy, childObject).then(result => {
                                 return this.handleResult(childObject, result, this.listenerName)
                             });
                         }
                     }
                 } else {
                     const result = {
                         'status': "SUCCESS",
                         'records': []
                     }
                     return this.handleResult(childObject, result, this.listenerName)
                 }
             })
         } else if (sectionObjectDetails['criteriaQueryConfig'] && Object.keys(sectionObjectDetails['criteriaQueryConfig']['queryConfig']).length > 0) {
             return this.makeQueryAndStartFetch(sectionChildObjectHierarchy, childObject, undefined, undefined, methodCalledBy)
         } else {
             if (methodCalledBy === 'listener') {
                 var taskList = []
                 var paginationInfo = childObject['paginationInfo'];
                 var fetchParams = {
                     'objectHierarchyJSON': sectionChildObjectHierarchy,
                     'layoutDataRestrictionSet': this.sectionObjectDetails[objectName]['sectionUserDataRestrictionSet'],
                     'dataSource': this.dataSource,
                     pagination: {
                         limit: paginationInfo['pagination']['view']['itemCount'],
                         offset: paginationInfo['currentPageIndex'] * Number(paginationInfo['pagination']['view']['itemCount']),
                         bookmark: ""
                     }
                 }
                 fetchParams['searchListQuery'] = "type:" + childObject['objectName'] + " AND " + this.__deppersonalinfo$tableName + ":" + this.id
                 if (childObject['modifiedSet']['type'] === objectName) {
                     fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND _id:' + childObject['modifiedSet']['id']
                 } else if (childObject['modifiedSet']['idArrayToFetch'].length > 0) {
                     fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + childObject['modifiedSet']['idArrayToFetch'].join(" OR ") + " ) "
                 }
                 taskList = taskList.concat(this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', fetchParams['searchListQuery']))
                 return Promise.all(taskList).then(result => {
                     var ids = [];
                     result.forEach(res => {
                         ids = ids.concat(res['rows'].map(e => e['id']))
                     })
                     return ids;
                 })
             } else {
                 childObject['childDocsArray'] = [];
                 childObject['additionalInfo']['tempDataArray'] = [];
                 return this.fetchAllDataWeb(sectionChildObjectHierarchy, childObject).then(result => {
                     return this.handleResult(childObject, result, this.listenerName)
                 });
             }
         }
     }

     async makeQueryAndStartFetch(sectionChildObjectHierarchy, childObject, paginationAction ? : 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh', paginationClickFlag ? , methodCalledBy ? ) {
         const objectName = childObject['objectName'];
         this.dataProvider.startLazyLoading(this.listenerName[objectName])
         const paginationInfo = childObject['paginationInfo']
         var fetchParams = {
             'objectHierarchyJSON': sectionChildObjectHierarchy,
             'layoutDataRestrictionSet': this.sectionObjectDetails[objectName]['sectionUserDataRestrictionSet'],
             'dataSource': this.dataSource,
             'objectName': objectName,
             pagination: {
                 limit: paginationInfo['pagination']['view']['itemCount'],
                 offset: paginationInfo['currentPageIndex'] * Number(paginationInfo['pagination']['view']['itemCount']),
                 bookmark: ""
             }
         }
         if (this.sectionObjectDetails[objectName] && this.sectionObjectDetails[objectName]['criteriaQueryConfig']) {
             var sectionCriteriaQueryConfig = this.sectionObjectDetails[objectName]['criteriaQueryConfig']
         }
         const configObject = {
             'layoutCriteriaQueryConfig': sectionCriteriaQueryConfig['queryConfig'],
             'listCriteriaDataObject': sectionCriteriaQueryConfig['junctionDataObjects']
         }
         if (sectionChildObjectHierarchy['objectType'] === "REVERSE_LOOKUP") {
             fetchParams['searchListQuery'] = "type:" + childObject['objectName'].split('_')[0] + " AND " + sectionChildObjectHierarchy["lookupField"] + ":" + this.id
         } else {
             fetchParams['searchListQuery'] = "type:" + childObject['objectName'] + " AND " + this.__deppersonalinfo$tableName + ":" + this.id
         }
         if (sectionCriteriaQueryConfig['criteriaQuery'] !== undefined) {
             sectionCriteriaQueryConfig['relationalObjectResults'] = sectionCriteriaQueryConfig['relationalObjectIds'];
             sectionCriteriaQueryConfig['criteriaQuery'] = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject)
             fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND " + sectionCriteriaQueryConfig['criteriaQuery']
         }
         if (methodCalledBy === 'listener') {
             if (childObject['modifiedSet']['type'] === objectName) {
                 fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND _id:' + childObject['modifiedSet']['id']
             } else if (childObject['modifiedSet']['idArrayToFetch'].length > 0) {
                 fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + childObject['modifiedSet']['idArrayToFetch'].join(" OR ") + " ) "
             }
             if (childObject['modifiedSet']['dataRestrictionIdSet'] && childObject['modifiedSet']['dataRestrictionIdSet'].length > 0) {
                 return this.dataProvider.primaryObjDataFetch(fetchParams, childObject['modifiedSet']['dataRestrictionIdSet']).then((res => {
                     return res;
                 }))
             } else {
                 return this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', fetchParams['searchListQuery']).then(result => {
                     return result["rows"].map(e => e['id']);
                 })
             }
         } else {
             if (childObject['additionalInfo']['dataFetchMode'] !== 'OnClickBatch' && methodCalledBy !== 'listener') {
                 childObject['childDocsArray'] = [];
                 childObject['additionalInfo']['tempDataArray'] = [];
             }
             if (this.batchWiseIdArray[objectName].length > 0 && childObject['additionalInfo']['dataFetchMode'] === 'OnClickBatch') {
                 await this.dataProvider.primaryObjDataFetch(fetchParams, this.batchWiseIdArray[objectName]).then((res => {
                     this.batchWiseIdArrayTemp[objectName] = this.batchWiseIdArray[objectName] = lodash.chunk(res, Number(childObject['paginationInfo']['pagination']['view']['itemCount']));

                 }))
             }
             return this.fetchAllDataWeb(sectionChildObjectHierarchy, childObject, paginationAction, paginationClickFlag).then(result => {
                 return this.handleResult(childObject, result, this.listenerName)
             })
         }
     }


     updateChildObjectRecord(processChildObject) {
         const taskList = [];

         var sectionChildObjectHierarchy = this.sectionObjectsHierarchy[processChildObject['objectName']];
         processChildObject['childDocsArray'] = [];
         processChildObject['additionalInfo']['tempDataArray'] = [];
         taskList.push(
             this.fetchAllDataWeb(sectionChildObjectHierarchy, processChildObject, 'current_page_refresh')
             .then(childResponse => {
                 return childResponse;
             })
         );
         Promise.all(taskList).then(res => {
             processChildObject['isLoading'] = false;
         });
     }
     async fetchAllDataWeb(objectHierarchyJSON, childObject,
         paginationAction ? : 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh', paginationClickFlag ? ) {
         const objectName = childObject['objectName'];
         if (paginationClickFlag && childObject['isLoading']) {
             this.appUtilityConfig.presentToast("Another process is running, please wait");
             return
         }

         if (paginationAction && paginationAction !== 'limit_changed') {
             if (paginationAction === 'next_pressed') {
                 childObject['paginationInfo']['currentPageIndex'] = childObject['paginationInfo']['currentPageIndex'] + 1;
             } else if (paginationAction === 'prev_pressed' && childObject['paginationInfo']['currentPageIndex'] > 0) {
                 childObject['paginationInfo']['currentPageIndex'] = childObject['paginationInfo']['currentPageIndex'] - 1;
             } else if (paginationAction === 'current_page_refresh') {
                 childObject['paginationInfo']['currentPageIndex'] = childObject['paginationInfo']['currentPageIndex'];
             } else {
                 return Promise.resolve("");
             }
         } else {
             childObject['paginationInfo']['currentPageIndex'] = 0;
             childObject['paginationInfo']['pagination']['bookmark'] = {
                 0: ''
             }
             if (childObject['additionalInfo']['dataFetchMode'] === 'OnClickBatch' && this.batchWiseIdArray[objectName].length > 0) {
                 this.batchWiseIdArray[objectName] = lodash.flatten(this.batchWiseIdArray[objectName]);
                 this.totalRecords[objectName] = this.batchWiseIdArray[objectName].length;
                 this.batchWiseIdArrayTemp[objectName] = lodash.chunk(this.batchWiseIdArray[objectName], Number(childObject['paginationInfo']['pagination']['view']['itemCount']));
                 this.batchWiseIdArray[objectName] = lodash.chunk(this.batchWiseIdArray[objectName], Number(childObject['paginationInfo']['pagination']['view']['itemCount']));
             }
         }
         const fetchParams = {
             'objectHierarchyJSON': objectHierarchyJSON,
             'layoutDataRestrictionSet': this.sectionObjectDetails[objectName]['sectionUserDataRestrictionSet'],
             'dataSource': this.dataSource,

             'listenerName': this.listenerName[childObject['objectName']],
             isLazyLoadEnabled: true,
             pagination: {
                 limit: childObject['paginationInfo']['pagination']['view']['itemCount'],
                 offset: childObject['paginationInfo']['currentPageIndex'] * Number(childObject['paginationInfo']['pagination']['view']['itemCount']),
                 bookmark: ""
             }
         }

         if (childObject['additionalInfo']['dataFetchMode'] === 'Full') {
             fetchParams.isLazyLoadEnabled = false
         }

         if (childObject['paginationInfo']['pagination']['bookmark'][childObject['paginationInfo']['currentPageIndex']]) {
             fetchParams['pagination']['bookmark'] = childObject['paginationInfo']['pagination']['bookmark'][childObject['paginationInfo']['currentPageIndex']];
         }
         if (this.dataSource === appConstant.couchDBStaticName) {
             if (objectHierarchyJSON['objectType'] === "REVERSE_LOOKUP") {
                 fetchParams['searchListQuery'] = "type:" + childObject['objectName'].split('_')[0] + " AND " + objectHierarchyJSON["lookupField"] + ":" + this.id
             } else {
                 fetchParams['searchListQuery'] = "type:" + childObject['objectName'] + " AND " + this.__deppersonalinfo$tableName + ":" + this.id
             }
             if (this.batchWiseIdArray[objectName].length > 0) {
                 if (childObject['additionalInfo']['dataFetchMode'] === 'OnClickBatch') {
                     fetchParams['batchIds'] = [...this.batchWiseIdArray[objectName][childObject['paginationInfo']['currentPageIndex']]];
                     fetchParams['pagination']['bookmark'] = "";
                 } else {
                     if (this.resultCount[objectName] === childObject['paginationInfo']['pagination']['total_rows']) {
                         fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + this.batchWiseIdArray[objectName][0].join(" OR ") + " )"
                         this.resultCount[objectName] = 0;
                         this.batchWiseIdArray[objectName].shift();
                         fetchParams['pagination']['bookmark'] = "";
                     } else {
                         fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + this.batchWiseIdArrayTemp[objectName][this.batchWiseIdArrayTemp[objectName].length - this.batchWiseIdArray[objectName].length - 1].join(" OR ") + " )"
                     }
                 }
             } else if (this.batchWiseIdArray[objectName].length === 0 && this.batchWiseIdArrayTemp[objectName].length > 0) {
                 fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + this.batchWiseIdArrayTemp[objectName][this.batchWiseIdArrayTemp[objectName].length - 1].join(" OR ") + " )"
             } else {
                 fetchParams['searchListQuery'] = fetchParams['searchListQuery']
             }
         }
         if (fetchParams['searchListQuery']) {
             if (this.sectionObjectDetails[objectName] && this.sectionObjectDetails[objectName]['criteriaQueryConfig'] && Object.keys(this.sectionObjectDetails[objectName]['criteriaQueryConfig']).length > 0) {
                 var sectionCriteriaQueryConfig = this.sectionObjectDetails[objectName]['criteriaQueryConfig']
             }
             if (sectionCriteriaQueryConfig && sectionCriteriaQueryConfig['criteriaQuery'] !== undefined && sectionCriteriaQueryConfig['criteriaQuery'] !== "") {
                 fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND ' + sectionCriteriaQueryConfig['criteriaQuery']
             }
         }

         if (!childObject['isLoading']) {
             childObject['isLoading'] = true;
         }
         return this.dataProvider.fetchDataFromDataSource(fetchParams).then(res => {
             childObject['paginationInfo']['pagination']['bookmark'][childObject['paginationInfo']['currentPageIndex'] + 1] = res['bookmark'];
             if (res['total_rows']) {
                 childObject['paginationInfo']['pagination']['total_rows'] = res['total_rows']
             } else if (this.totalRecords[objectName]) {
                 childObject['paginationInfo']['pagination']['total_rows'] = this.totalRecords[objectName];
             } else {
                 childObject['paginationInfo']['pagination']['total_rows'] = 0;
             }

             if (childObject['paginationInfo']['pagination']['total_rows'] > 0) {
                 if (childObject['paginationInfo']['pagination'] < Number(childObject['paginationInfo']['pagination'])) {
                     childObject['paginationInfo']['pagination']['pagesCount'] = 1
                 } else {
                     let modulusValue = childObject['paginationInfo']['pagination']['total_rows'] % Number(childObject['paginationInfo']['pagination']['view']['itemCount'])
                     if (modulusValue === 0) {
                         childObject['paginationInfo']['pagination']['pagesCount'] = childObject['paginationInfo']['pagination']['total_rows'] / Number(childObject['paginationInfo']['pagination']['view']['itemCount'])
                     } else {
                         childObject['paginationInfo']['pagination']['pagesCount'] = (childObject['paginationInfo']['pagination']['total_rows'] - modulusValue) / Number(childObject['paginationInfo']['pagination']['view']['itemCount']) + 1
                     }
                 }
             }
             if (res['status'] === 'SUCCESS') {
                 if (res['records'].length > 0) {
                     this.resultCount[objectName] = this.resultCount[objectName] + res['records'].length;
                     if (res["records"].length < childObject['paginationInfo']['pagination']['view']['itemCount']) {
                         childObject['paginationInfo']['nextBadgeDisabled'] = true;
                     } else {
                         childObject['paginationInfo']['nextBadgeDisabled'] = false;
                     }

                     res['records'] = this.cspfmCustomFieldProviderObject.makeSlickGridCustomFields(res['records'], this.columnDefinitions[childObject['objectName']]);

                     if (childObject['additionalInfo']['dataFetchMode'] === 'OnClickBatch') {
                         this.updateDataFetchStatus(childObject, false);
                         childObject['childDocsArray'] = [...res['records']]
                         this.itemCount[objectName] = Number(childObject['paginationInfo']['pagination']['view']['itemCount']);
                         if (childObject['isAnyDataFetchPending']) {
                             childObject['isAnyDataFetchPending'] = false;
                             var sectionChildObjectHierarchy = this.sectionObjectsHierarchy[childObject['objectName']];
                             this.fetchAllDataWeb(sectionChildObjectHierarchy, childObject, 'current_page_refresh');
                         }
                         childObject['isLoading'] = false
                         return {
                             'status': res['status'],
                             'message': res['message'],
                             'paginationAction': paginationAction,
                             'records': childObject['childDocsArray']
                         };
                     } else if (childObject['additionalInfo']['dataFetchMode'] === 'Batch') {
                         childObject['childDocsArray'] = [...childObject['childDocsArray'], ...res['records']]
                     } else {
                         if (childObject['additionalInfo']['tempDataArray'] === undefined) {
                             childObject['additionalInfo']['tempDataArray'] = []
                         }
                         childObject['additionalInfo']['tempDataArray'] = [...childObject['additionalInfo']['tempDataArray'], ...res['records']]
                     }

                     if (res['records'].length <= Number(childObject['paginationInfo']['pagination']['view']['itemCount'])) {
                         if (childObject["additionalInfo"]["dataFetchMode"] === "Batch" && childObject['paginationInfo']['pagination']['view']['itemCount'] !== "2000") {
                             childObject['paginationInfo']['pagination']['view']['itemCount'] = "2000";
                         }
                         return this.fetchAllDataWeb(objectHierarchyJSON, childObject, 'next_pressed')
                     }
                 } else if (this.batchWiseIdArray[objectName].length > 0) {
                     return this.fetchAllDataWeb(objectHierarchyJSON, childObject, 'next_pressed')
                 } else {
                     this.updateDataFetchStatus(childObject, false);
                     if (childObject['additionalInfo']['dataFetchMode'] === 'Full') {
                         childObject['childDocsArray'] = [...childObject['additionalInfo']['tempDataArray']]
                     }
                     if (childObject['additionalInfo']['dataFetchMode'] === 'OnClickBatch') {
                         childObject['paginationInfo']['nextBadgeDisabled'] = true;
                         if (paginationAction && childObject['paginationInfo']['currentPageIndex'] > 0) {
                             childObject['paginationInfo']['currentPageIndex'] = childObject['paginationInfo']['currentPageIndex'] - 1;
                         }
                     }
                     childObject['isLoading'] = false;
                     return {
                         'status': res['status'],
                         'message': res['message'],
                         'paginationAction': paginationAction,
                         'records': childObject['childDocsArray']
                     }
                 }
             } else {
                 this.updateDataFetchStatus(childObject, false);
                 childObject['isLoading'] = false;
                 return {
                     'status': res['status'],
                     'message': res['message'],
                     'paginationAction': paginationAction,
                     'records': []
                 }
             }
         }).catch(error => {
             this.updateDataFetchStatus(childObject, false);
             childObject['isLoading'] = false;
             return Promise.resolve(false);
         });
     }
     async handleResult(childObject, result, listenerName) {
         this.dataProvider.finishLazyLoading(this.listenerName[childObject['objectName']], result['records'])
         if (result && result['records'] && (result['status'] === 'SUCCESS' || result['records'].length > 0)) {
             this.errorMessageToDisplay = 'No Records';
             let consolidatedItems = [...childObject['childDocsArray'], ...result['records']];
             childObject['childDocsArray'] = lodash.uniqBy(consolidatedItems, 'id')
             if (childObject["additionalInfo"]["dataFetchMode"] === "Batch") {
                 childObject['paginationInfo']['pagination']['view']['itemCount'] = this.itemsPerPageConfigured.toString();
             }
             this.batchWiseIdArray[childObject['objectName']] = [...this.batchWiseIdArrayTemp[childObject['objectName']]];
             this.resultCount[childObject['objectName']] = 0;

             childObject['slickgridChildDocsArray'] = childObject['childDocsArray'];
             childObject['isLoading'] = false;
             let angularGridInstance: AngularGridInstance = childObject['angularGridInstance'];
             angularGridInstance.paginationService.goToFirstPage();
             angularGridInstance["slickGrid"]['isAutoFitEnable'] = this.sectionObjectDetails[childObject['objectName']].isAutoFitEnable
             setTimeout(() => {
                 this.slickgridUtils.resizeColumnsByCellContent(angularGridInstance)
             }, 100);
             return Promise.resolve([true]);
         } else {
             this.errorMessageToDisplay = result['message'];
             if (this.errorMessageToDisplay === "No internet") {
                 this.appUtilityConfig.presentNoInternetToast(this);
             }

             childObject['slickgridChildDocsArray'] = childObject['childDocsArray'];
             childObject['isLoading'] = false;
             return Promise.resolve([false]);
         }
     }
     goToFullViewList(selectedRecord) {
         if (this.isPopUpEnabled) {
             this.dialogRef.close();
         }
         var redirectUrlForNav = '';
         if (this.isPopUpEnabled) {
             redirectUrlForNav = this.redirectUrl;
         } else {
             redirectUrlForNav = "/menu/deppersonalinfo_d_w_hl_list";
         }
         var ob = this.sectionObjectsHierarchy[selectedRecord.objectName];
         delete ob["queryBatch"]
         selectedRecord["parentTitle"] = this.objectNameMapping["pfm0s"];
         let itemtapnavigationObj = {
             parentObj: JSON.stringify(this.dataObject['deppersonalinfo_DUMMY']),
             parentObjType: this.tableName_pfm71658,
             parentLabel: selectedRecord["parentTitle"],
             childObjectHierarchyJSON: JSON.stringify(
                 this.sectionObjectsHierarchy[selectedRecord["objectName"]]
             ),
             objLabel: selectedRecord["displayName"],
             objType: selectedRecord["objectName"],
             parentDependentObjectList: JSON.stringify(this.dependentObjectList),
             sectionDependentObjectList: JSON.stringify(this.sectionDependentObjectList[this.layoutId + "_" + selectedRecord["objectName"]]),
             objectHierarchyJSON: JSON.stringify(this.objectHierarchyJSON),
             redirectUrl: redirectUrlForNav,
         };
         this.toastCtrl.dismiss();
         this.router.navigate(["/menu/deppersonalinfo_d_w_hl_listpreview"], {
             queryParams: itemtapnavigationObj,
             skipLocationChange: true
         });
     }
     onItemChildTap(childItem, objectName) {
         if (this.isPopUpEnabled) {
             this.dialogRef.close();
         }
         var redirectUrlForNav = '';
         if (this.isPopUpEnabled) {
             redirectUrlForNav = this.redirectUrl
         } else {
             redirectUrlForNav = '/menu/deppersonalinfo_d_w_hl_list';
         }
         let prominientObject = this.prominetDataMapping[childItem['type']];
         const itemTapNavigationParams = {
             parentObj: JSON.stringify(this.dataObject['deppersonalinfo_DUMMY']),
             parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]["fieldName"],
             parentTitle: childItem["displayName"],
             parentFieldValue: this.dataObject['deppersonalinfo_DUMMY'],
             id: childItem["id"],
             prominientObjectInfo: prominientObject,
             redirectUrl: redirectUrlForNav
         }
         this.navigateObjectDetailPage(objectName, itemTapNavigationParams)
     }

     async fetchModifiedRec(modifiedData) {
         let additionalObjectdata = {};
         additionalObjectdata["id"] = modifiedData;
         const fetchParams = {
             objectHierarchyJSON: this.objectHierarchyJSON,
             dataSource: appConstant.pouchDBStaticName,
             additionalInfo: additionalObjectdata
         };
         this.dataProvider
             .fetchDataFromDataSource(fetchParams)
             .then(result => {
                 if (result["status"] !== "SUCCESS") {
                     this.errorMessageToDisplay = result["message"];
                     return;
                 }
                 this.dataObject['deppersonalinfo_DUMMY'] = result["records"][0];

             })
             .catch(error => {
                 console.log(error);
             });
     }

     tabChangeMethod(event, tabGroupId) {
         this.resizeAngularSlickgrid(this.tabChilds[tabGroupId + '_' + event.tabTitle])
     }

     resizeAngularSlickgrid(childobjectsName: Array < string > ) {

         if (childobjectsName && childobjectsName.length) {
             this.childObjects.forEach((childObjectName, index) => {
                 if (childobjectsName.includes(childObjectName)) {
                     let angularGridInstance: AngularGridInstance = this.childObjectsInfo[index]['angularGridInstance'];
                     angularGridInstance.resizerService.resizeGrid();
                 }
             })
         }
     }
     onGridItemClick(event, objectName, angularGrid) {
         var cell = event['detail']['args']['cell'];
         var columns = event['detail']['args']['grid'].getColumns();
         var data = angularGrid.dataView.getItem(event['detail']['args']['row']);
         if (data['__group']) {
             return
         }
         if (columns[cell] && (columns[cell]['id'] === "_checkbox_selector" || columns[cell]['type'] === FieldType.unknown ||
                 (columns[cell]['params'] && columns[cell]['params']['cspfmEditorType'] && columns[cell]['params']['cspfmEditorType'] === 'LOOKUP'))) {

             return
         } else {
             let gridOptions = angularGrid.slickGrid.getOptions();
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

             this.slickGridItemClickCount++;
             if (this.slickGridItemClickCount === 1) {
                 setTimeout(() => {
                     if (this.slickGridItemClickCount === 1) {
                         this.onItemChildTap(data, objectName)
                     }
                     this.slickGridItemClickCount = 0;
                 }, 250);
             }
         }
     }

     registerRecordChangeListener() {
         if (this.dataSource !== 'JsonDB') {
             this.appUtilityConfig.addEventSubscriptionlayoutIds(this.dependentObjectList, this.layoutId, this.dataSource);
         }
         this.observableListenerUtils.subscribe(this.layoutId, (modified) => {
             try {
                 const isRecordDeleted = this.liveListenerHandlerUtils.handleLiveListenerForDelectedRecords('HL-GRID', modified, this);
                 if (isRecordDeleted) {
                     return;
                 }

                 if (this.intervalId) {
                     return;
                 }
                 var type = modified['doc']['data']['type'];
                 if (this.dataSource !== 'JsonDB') {
                     const layoutInfo = {
                         "dataObject": this.dataObject['deppersonalinfo_DUMMY']
                     }
                     if (this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.GRID_FETCH, this.dependentObjectList, modified, layoutInfo)) {
                         this.fetchSelectedObject(false);
                     }
                 }

             } catch (error) {
                 console.log(error);
             }
         });
     }
     ngOnDestroy() {

         this.childObjectsInfo.forEach(childobject => {
             if (childobject['angularGridInstance']) {
                 childobject['angularGridInstance'].destroy();
             }

             this.slickgridUtils.removeObservableListener(this.listenerName[childobject['objectName']])
         })
         this.liveListenerHandlerUtils.unregisterRecordChangeListener(this.dependentObjectList, this.layoutId, this);
         this.liveListenerHandlerUtils.unregisterSectionRecordChangeListener(this.sectionDependentObjectList, this);
         this.slickgridUtils.flatpickerAddRemove(this.layoutId, 'remove')

     }
     initializeStatusWorkFlowFields() {

     }

     registerSectionRecordChangeListener() {
         const sectionObjectKeys = Object.keys(this.sectionDependentObjectList)
         sectionObjectKeys.forEach(sectionObjectName => {
             const sectionDependentObject = this.sectionDependentObjectList[sectionObjectName];
             this.appUtilityConfig.addEventSubscriptionlayoutIds(sectionDependentObject, sectionObjectName, this.dataSource);
             this.observableListenerUtils.subscribe(sectionObjectName, modified => {
                 const splitObjectName = sectionObjectName.split('_')
                 let objectName = splitObjectName[1];
                 if (splitObjectName[2]) {
                     objectName += '_' + splitObjectName[2]
                 }
                 const processChildObject = this.childObjectsInfo.filter(childItem => childItem['objectName'] === objectName)[0]
                 const isRecordDeleted = this.liveListenerHandlerUtils.handleLiveListenerForDelectedRecords('HL-SECTION', modified, this, processChildObject['angularGridInstance']);
                 if (isRecordDeleted) {
                     return;
                 }
                 let slickGrid: SlickGrid = processChildObject['angularGridInstance']['slickGrid'];
                 if (slickGrid['isDataFetching']) {
                     if (!this.pendingListenerData[sectionObjectName]) {
                         this.pendingListenerData[sectionObjectName] = {}
                     }
                     this.pendingListenerData[sectionObjectName][modified['id']] = modified;
                     return;
                 }
                 this.processListenerData(modified, sectionObjectName);
             });
         })
     }

     processListenerData(modified, sectionObjectName) {
         const splitObjectName = sectionObjectName.split('_')
         let objectName = splitObjectName[1];
         if (splitObjectName[2]) {
             objectName += '_' + splitObjectName[2]
         }
         const processChildObject = this.childObjectsInfo.filter(childItem => childItem['objectName'] === objectName)[0]
         let currentChildIds = processChildObject.angularGridInstance.dataView.getItems().map(el => el.id);
         let sectionChildObjectHierarchy = this.sectionObjectsHierarchy[objectName];
         if (modified["doc"]["data"]["type"].includes('userAssignment') && this.sectionObjectDetails[objectName]['sectionUserDataRestrictionSet'] && this.sectionObjectDetails[objectName]['sectionUserDataRestrictionSet'][0]['restrictionType'] === 'userAssignment') {
             if (!this.appUtilityConfig.verifyUser(modified["doc"]["data"])) {
                 return false;
             }

             if (currentChildIds.includes(modified["doc"]["data"]['reference_id']) && !modified["doc"]["data"]['isActive']) {
                 const removeOldIds = [modified["doc"]["data"]['reference_id']]
                 this.addingChangeListerDataBasedOnFetchMode([], removeOldIds, [], processChildObject);
             } else {
                 if (modified["doc"]["data"]['isActive']) {
                     this.initiateFetch(sectionChildObjectHierarchy, processChildObject, 'listener').then(criteriaMeetingIds => {
                         criteriaMeetingIds = criteriaMeetingIds.map(item => {
                             return this.liveListenerHandlerUtils.getIdWithoutPfm(item)
                         })
                         if (criteriaMeetingIds.includes(modified["doc"]["data"]['reference_id']) && modified["doc"]["data"]['isActive']) {
                             const addNewIds = [modified["doc"]["data"]['reference_id']]
                             this.addingChangeListerDataBasedOnFetchMode(addNewIds, [], [], processChildObject);

                         }
                     })
                 }
             }
         } else if (!modified["doc"]["data"]["type"].includes('userAssignment')) {
             let dataRestrictionInvolvedObjectsArray = Object.keys(this.sectionDependentObjectList[sectionObjectName]['dataRestrictionInvolvedObjects'] || {});
             let headerPrimaryId = dataRestrictionInvolvedObjectsArray.filter(item => {
                 if (modified["doc"]["data"]["type"] === item) {
                     return modified["doc"]["data"]["id"] === this.dataObject['deppersonalinfo_DUMMY']['id'];
                 }
             })
             if (headerPrimaryId.length) {
                 return this.fetchSelectedObject(false).then(() => {
                     this.initiateFetch(this.sectionObjectsHierarchy[objectName], processChildObject)
                 })
             }
             console.log('========listener========== : ', processChildObject['isLoading'], processChildObject['isAnyDataFetchPending']);
             const changedSectionDependentObject = this.sectionDependentObjectList[sectionObjectName]
             let providerType = modified['providerType'];
             let layoutInfo = {
                 "gridData": this.slickgridUtils.getGridData(processChildObject['angularGridInstance']),
                 "formulaAndRollupFieldInfo": this.formulaAndRollupFieldInfo,
                 "dataObject": this.dataObject[this.__deppersonalinfo$tableName],
                 "objectId": this.__deppersonalinfo$tableName
             }
             let idArrayToFetch = this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.SECTION_FETCH, changedSectionDependentObject, modified, layoutInfo)
             idArrayToFetch = idArrayToFetch.filter(item => {
                 if (item['pfm71658']) {
                     return item['pfm71658'] === this.dataObject['deppersonalinfo_DUMMY']['id'];
                 } else if (item["doc"]["data"]['pfm71658']) {
                     return item["doc"]["data"]['pfm71658'] === this.dataObject['deppersonalinfo_DUMMY']['id'];
                 } else if (providerType) {
                     return true;
                 }
             })
             let sectionObjectDetails = this.sectionObjectDetails[objectName]
             if (processChildObject['childDocsArray'].length > 0) {
                 idArrayToFetch = idArrayToFetch.map(ids => this.liveListenerHandlerUtils.getIdWithoutPfm(ids.id));
                 idArrayToFetch = lodash.uniq(idArrayToFetch);
                 const prefix = objectName + "_2_";
                 idArrayToFetch = idArrayToFetch.map(ids => ids.includes(prefix) ? ids : prefix + ids);
                 currentChildIds = currentChildIds.map(ids => ids.includes(prefix) ? ids : prefix + ids);
                 if (modified['doc']['_id'].includes('rollup') || modified['doc']['_id'].includes('formula')) {
                     processChildObject['modifiedSet'] = {
                         "idArrayToFetch": [],
                         "type": "",
                         "id": ""
                     };
                 } else {
                     if (sectionObjectDetails['criteriaQueryConfig'] && sectionObjectDetails['criteriaQueryConfig']['queryConfig'] && Object.keys(sectionObjectDetails['criteriaQueryConfig']['queryConfig']).length > 0) {
                         sectionObjectDetails['criteriaQueryConfig']['modifiedSet']['type'] = modified['doc']['data']['type'];
                         sectionObjectDetails['criteriaQueryConfig']['modifiedSet']['id'] = modified['doc']['_id'];
                     }
                     processChildObject['modifiedSet'] = {
                         "idArrayToFetch": idArrayToFetch,
                         "type": modified['doc']['data']['type'],
                         "id": modified['doc']['_id']
                     };
                 }
                 this.initiateFetch(sectionChildObjectHierarchy, processChildObject, 'listener').then(criteriaMeetingIds => {
                     const filteredIds = this.checkChangedListerData(criteriaMeetingIds, idArrayToFetch, currentChildIds);
                     const addNewIds = lodash.difference(filteredIds, currentChildIds);
                     const removeOldIds = lodash.difference(currentChildIds, filteredIds);
                     const updateIds = lodash.intersection(idArrayToFetch, filteredIds);
                     this.addingChangeListerDataBasedOnFetchMode(addNewIds, removeOldIds, updateIds, processChildObject);
                 })
             } else {
                 if (processChildObject['childDocsArray'].length === 0) {
                     this.initiateFetch(sectionChildObjectHierarchy, processChildObject)
                 }
             }
         }
     }
     addingChangeListerDataBasedOnFetchMode(addNewIds, removeOldIds, updateIds, processChildObject) {
         const objectName = processChildObject["objectName"];
         this.batchWiseIdArray[objectName] = lodash.flatten(this.batchWiseIdArray[objectName]);
         const prefix = objectName + "_2_";
         if (removeOldIds && removeOldIds.length > 0) {
             const removeidswithprefix = removeOldIds.map(el => el.includes(prefix) ? el : prefix + el)
             this.batchWiseIdArray[objectName] = [...lodash.difference(this.batchWiseIdArray[objectName], removeidswithprefix)];
         }
         if (processChildObject['additionalInfo']['dataFetchMode'] === 'OnClickBatch') {

             if (this.batchWiseIdArray[objectName].length > 0) {
                 this.totalRecords[objectName] = this.batchWiseIdArray[objectName].length;
                 this.batchWiseIdArrayTemp[objectName] = this.batchWiseIdArray[objectName] = lodash.chunk(this.batchWiseIdArray[objectName], Number(processChildObject['paginationInfo']['pagination']['view']['itemCount']));
             }
             if (processChildObject['isLoading']) {
                 processChildObject['isAnyDataFetchPending'] = true;
             } else {
                 console.log('=======normal Fetch=========== : ', processChildObject['isLoading'], processChildObject['isAnyDataFetchPending']);
                 this.updateChildObjectRecord(processChildObject)
             }
         } else {
             if (removeOldIds && removeOldIds.length > 0) {
                 this.checkIfRecordsAvailableInSectionAndRemove(processChildObject, removeOldIds)
             }
             if (addNewIds && addNewIds.length > 0) {
                 this.headerLineUtils.fetchChildModifiedRecords(processChildObject['angularGridInstance'], processChildObject["objectName"], addNewIds, this.sectionObjectsHierarchy[objectName], this);
             } else if (updateIds && updateIds.length > 0) {
                 this.headerLineUtils.fetchChildModifiedRecords(processChildObject['angularGridInstance'], processChildObject["objectName"], updateIds, this.sectionObjectsHierarchy[objectName], this);
             }
         }
     }


     checkChangedListerData(changedListenerIds, idArrayToFetch, filteredResultListIds) {
         if (changedListenerIds === undefined || changedListenerIds.length === 0) {
             filteredResultListIds = lodash.difference(filteredResultListIds, idArrayToFetch)
             return filteredResultListIds;
         } else {
             const addNewIds = lodash.difference(changedListenerIds, filteredResultListIds);
             if (addNewIds && addNewIds.length > 0) {
                 filteredResultListIds = [...addNewIds, ...filteredResultListIds];
                 return filteredResultListIds;
             } else {
                 return filteredResultListIds;
             }
         }
     }

     checkIfRecordsAvailableInSectionAndRemove(processChildObject, idsToremove) {
         idsToremove.forEach(modifiedDataId => {
             this.slickgridUtils.modifiedDataSet(processChildObject['angularGridInstance'], processChildObject.angularGridInstance.dataView.getItems(), processChildObject['objectName'], modifiedDataId)
         });
     }



     inLineEditlookupSelected(event, childObjectName) {
         if (event['actionName'] === "selection") {
             let dataContext = event['dataContext']
             let columnDef: Column = event['columnDef']

             let childObject = this.slickgridUtils.getChildObject(childObjectName, this.childObjectsInfo);
             const angularGridInstance: AngularGridInstance = childObject['angularGridInstance']
             angularGridInstance.dataView.beginUpdate();
             var value = angularGridInstance.dataView.getItemById(dataContext['id'])
             if (value) {
                 angularGridInstance.dataView.updateItem(dataContext['id'], dataContext);
             } else {
                 angularGridInstance.dataView.addItem(dataContext);
             }
             angularGridInstance.dataView.endUpdate();
             angularGridInstance.dataView.reSort();
             let saveData = this.slickgridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).data;
             let savefieldInfo = this.slickgridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).fieldInfo;
             const recordId = saveData.type + '_2_' + saveData.id
             let childObjectData = this.slickgridUtils.getChildObject(childObjectName, this.childObjectsInfo);
             var gridInstance = childObjectData['angularGridInstance']
             this.slickgridUtils.fetchEditedRecord(this.dataSource, gridInstance, recordId, savefieldInfo, event['item'], dataContext)
         }
     }

     async onActionCellClick(mouseEvent: KeyboardEvent | MouseEvent, args: OnEventArgs, objectName ? ) {

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
         } else {
             this.isnavigated = true;
             this.onItemChildTap(data, data["type"]);
         }
     }
     decidePopupOrNavigation(actionInfo, data) {
         if (this.isPopUpEnabled) {
             this.dialogRef.close();
         }
         var redirectUrlForNav = '';
         if (this.isPopUpEnabled) {
             redirectUrlForNav = this.redirectUrl;
         } else {
             redirectUrlForNav = '/menu/' + actionInfo['navigationInfo']['redirectUrl']
         }
         let id;
         let dataObject = {}
         let checkRecordNotInitiated = true
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
                 actionInfo['navigationInfo']['enablePopUp'] ? this.dialogOpenComponent(actionInfo, id, redirectUrlForNav, data) : this.appUtilityConfig.navigationToComponent(actionInfo, id, redirectUrlForNav);
         }
     }
     dialogOpenComponent(actionInfo, id, redirectUrlForNav, data) {
         const dialogConfig = new MatDialogConfig();
         dialogConfig.data = {
             params: {
                 action: 'Edit',
                 id: id,
                 redirectUrl: redirectUrlForNav,
                 enablePopUp: actionInfo['navigationInfo']['enablePopUp']
             }
         };
         dialogConfig.panelClass = 'cs-dialoguecontainer-large';
     }



     public reportInput = {};
     public printInput = {};

     ngAfterViewChecked() {
         this.appUtilityConfig.appendHttpToURL();
         this.slickgridUtils.flatpickerAddRemove(this.layoutId, 'set')
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
     getChangedObjectIndex(array, modifiedData, key) {
         return lodash.findIndex(array, item => {
             return item[key] === modifiedData[key];
         }, 0)
     }
     multiSelectAndCheckBoxValueMaking(values, mappingDetails) {

         var displayValue = [];

         for (const element of values) {
             displayValue.push(mappingDetails[element]);
         }

         if (displayValue.length > 0) {
             return displayValue.join(", ");
         } else {
             return "";
         }
     }
     @ViewChildren(MdePopoverTrigger, {}) sectionPopover: MdePopoverTrigger;
     navigateObjectDetailPage(objectName, itemTapNavigationParams) {
         if (objectName === "pfm74408") {

             this.router.navigate(["/menu/depchildinfo_d_w_hl_detail_view"], {
                 queryParams: itemTapNavigationParams,
                 skipLocationChange: true
             });
         }
     }

     navigateToEntryPage(childObject) {
         var redirectUrlForNav = ''
         if (this.isPopUpEnabled) {
             this.dialogRef.close();
             redirectUrlForNav = this.redirectUrl;
         } else {
             redirectUrlForNav = '/menu/deppersonalinfo_d_w_hl_list';
         }

         if (this.objectRelationshipMapping[childObject['objectName']] === 'one_to_one' && this.dataObject['deppersonalinfo_DUMMY'][childObject['objectName'] + 's'].length > 0) {
             this.appUtilityConfig.presentToast("Multiple Entry is prohibited as only one child should be against " + this.objectNameMapping['pfm0s'], 10000);
             return
         }
         if (childObject['objectName'] === 'pfm74408') {
             if (this.dataObject['deppersonalinfo_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']]) {
                 let getFieldType = this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldType'];
                 if (getFieldType === 'MULTISELECT' || getFieldType === 'RADIO' || getFieldType === 'CHECKBOX' || getFieldType === 'DROPDOWN') {
                     this.parentValue = this.multiSelectAndCheckBoxValueMaking(this.dataObject['deppersonalinfo_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']], this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['mappingDetails'])
                 } else if (getFieldType === 'DATE') {
                     this.parentValue = moment(new Date(this.dataObject['deppersonalinfo_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']])).tz(this.appUtilityConfig.userTimeZone).format(this.appUtilityConfig.userDatePickerFormat);
                 } else if (getFieldType === 'TIMESTAMP') {
                     this.parentValue = moment(new Date(this.dataObject['deppersonalinfo_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']])).tz(this.appUtilityConfig.userTimeZone).format(this.appUtilityConfig.userDateTimePickerFormat);
                 } else {
                     this.parentValue = this.dataObject['deppersonalinfo_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']]
                 }
             }

             const navigationParameters = {
                 action: "Add",
                 parentId: this.id,
                 parentObj: JSON.stringify(this.dataObject['deppersonalinfo_DUMMY']),
                 parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['label'],
                 parentFieldValue: this.parentValue,
                 parentName: this.tableName_pfm71658,
                 redirectUrl: redirectUrlForNav
             };
             this.router.navigate(['/menu/depchildinfo_Entry_Web'], {
                 queryParams: navigationParameters,
                 skipLocationChange: true
             });

         }

     }


     refreshData() {
         this.fetchSelectedObject(true);
     }
     ngOnInit() {

         this.skeletonIntervalId = window.setInterval(() => {
             this.animation = this.animation === 'pulse' ? 'progress-dark' : 'pulse';
         }, 5000);


     }
     ionViewWillEnter() {
         document.body.setAttribute("class", "linedetail");
     }
     ionViewDidEnter() {
         setTimeout(() => {
             const slickgridHeaderColumn = document.getElementsByClassName('slick-header-column')
             this.childObjectsInfo.forEach(element => {
                 const objectKey = this.objectTableMappingObject.mappingDetail
                 this.setPaginationID(slickgridHeaderColumn, this.gridId + element.objectName, Object.keys(objectKey).find(key => objectKey[key] === element.objectName))
             })
         }, 100)
     }
     setPaginationID(slickgridHeaderColumn, gridId, objectName) {
         this.gridIdConfig.setSlickGridPaginationId(slickgridHeaderColumn, gridId, objectName,
             this.columnDefinitions[this.__deppersonalinfo$tableName], document);
     }
     commitCurrentEdit(objectName) {
         if (objectName) {
             let childObject = this.slickgridUtils.getChildObject(objectName, this.childObjectsInfo);
             this.slickgridUtils.commitCurrentEdit(childObject['gridObj'])
         }
     }
     editButton_7774715_Onclick() {

         if (this.isSkeletonLoading) {
             this.appUtilityConfig.presentToast("Another process is running, please wait");
             return
         }
         if (this.isPopUpEnabled) {
             this.dialogRef.close();
         }
         var redirectUrlForNav = ''
         if (this.isPopUpEnabled) {
             redirectUrlForNav = this.redirectUrl;
         } else {
             redirectUrlForNav = "/menu/deppersonalinfo_d_w_hl_list";
         }

         let navigationParams = {
             action: 'Edit',
             id: this.dataObject['deppersonalinfo_DUMMY']['id'],
             parentPage: this
         }
         if (this.isPopUpEnabled) {
             if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                 navigationParams['redirectUrl'] = this.redirectUrl;
             }
         } else {
             if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/deppersonalinfo_Entry_Web")) {
                 navigationParams['redirectUrl'] = "/menu/deppersonalinfo_d_w_hl_list";
             }
         }
         let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams, this.pfmObjectConfig['objectConfiguration'], this.cspfmMetaCouchDbProvider);
         if (checkRecordNotInitiated) {
             this.router.navigate(["/menu/deppersonalinfo_Entry_Web"], {
                 queryParams: navigationParams,
                 skipLocationChange: true
             })
         }
     }
 }