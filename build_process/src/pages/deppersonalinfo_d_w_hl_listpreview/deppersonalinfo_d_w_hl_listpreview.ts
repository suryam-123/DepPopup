

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
     selector: 'deppersonalinfo_d_w_hl_listpreview',
     templateUrl: 'deppersonalinfo_d_w_hl_listpreview.html'
 }) export class deppersonalinfo_d_w_hl_listpreview implements OnInit {
     isCustomFetchLoading = false;
     dripDownAttribute = '';
     constructor(public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, public lookupFieldMapping: lookupFieldMapping, public objectTableMappingObject: objectTableMapping, public gridIdConfig: cspfmGridsectionListIdConfiguration, public dialog: MatDialog, public cspfmDataDisplay: cspfm_data_display, public translateService: TranslateService, public router: Router,
         public activatRoute: ActivatedRoute, platform: Platform, public dataProvider: dataProvider, public appUtilityConfig: appUtility, public changeRef: ChangeDetectorRef, private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils, public cspfmConditionalValidationUtils: cspfmConditionalValidationUtils,
         public loadingCtrl: LoadingController, public angularUtilService: AngularUtilService, public objectTableMapping: objectTableMapping, public toastCtrl: ToastController, public applicationRef: ApplicationRef, private screenOrientation: ScreenOrientation,
         public observableListenerUtils: cspfmObservableListenerUtils, public onlineDbIndexCreation: onlineDbIndexCreation, public metaDbConfigurationObj: metaDbConfiguration, public metaDbProvider: metaDataDbProvider, public cspfmCustomFieldProvider: cspfmCustomFieldProvider, public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils, public listServiceUtils: cspfmListSearchListUtils, public slickgridUtils: cspfmSlickgridUtils, public headerLineUtils: cspfmHeaderLineUtils, private cspfmConditionalFormattingUtils: cspfmConditionalFormattingUtils,
         public cspfmLayoutConfig: cspfmLayoutConfiguration, public dbService: couchdbProvider, public slickgridPopoverService: SlickgridPopoverService, public dialogRef: MatDialogRef < deppersonalinfo_d_w_hl_listpreview > , public cspfmReportGenerationService: CspfmReportGenerationService, private cspfmSlickgridMatrix: cspfmSlickgridMatrixService, public popoverController: PopoverController, private cspfmCustomFieldProviderObject: cspfmCustomFieldProvider, public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider,
         public executionDbConfigObject: cspfmExecutionPouchDbConfiguration, private datePipe: DatePipe, public alerCtrl: AlertController, public pfmObjectConfig: cspfmObjectConfiguration, public cspfmFlatpickrConfig: cspfmFlatpickrConfig, private zone: NgZone, private liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils, private metaDbConfig: metaDbConfiguration, public customActionUtils: cspfmCustomActionUtils, private cspfmOnDemandFeature: cspfmOnDemandFeature, ) {
         this.customActionConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.hlLayoutId]['customActionConfiguration']);
         this.activatRoute.queryParams.subscribe(params => {
             this.appUtilityConfig.initialHiddenColumns(this.columnDefinitionsjson, params["objType"]);
             if (Object.keys(params).length === 0 && params.constructor === Object) {
                 console.log("list query params skipped");
                 return
             }
             this.associationConfigurationAssignment();
             this.initializeStatusWorkFlowFields();
             this.dataObject['deppersonalinfo_DUMMY'] = JSON.parse(params["parentObj"]);
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
             this.selectedObjectParentName = params["parentObjType"];
             this.parentTitle = params["parentLabel"];
             this.objectHierarchyJSON = JSON.parse(params["childObjectHierarchyJSON"]);
             this.pageTitle = params["objLabel"];
             this.selectedObjectName = params["objType"];
             this.redirectUrl = params["redirectUrl"];
             this.columnDefinitions = this.columnDefinitionsjson[this.selectedObjectName];
             this.appUtilityConfig.setColumnWidth(this.columnDefinitions);
             this.parentObjectHierarchyJSON = JSON.parse(params["objectHierarchyJSON"]);
             this.parentDependentObjectList = JSON.parse(params["parentDependentObjectList"])
             this.sectionDependentObjectList = JSON.parse(params["sectionDependentObjectList"])

             let sectionObjectDetails: SectionObjectDetail = this.sectionObjectDetails[this.selectedObjectName];
             if (sectionObjectDetails) {
                 this.dataFetchMode = sectionObjectDetails['dataFetchMode'];
                 if (this.dataFetchMode === "Full") {
                     this.pagination["view"]["itemCount"] = "2000";
                 }
                 this.groupingColumns = sectionObjectDetails['groupingColumns'];
                 this.gridOptions['presets']['sorters'] = sectionObjectDetails['sortByColumns']
             }
             if (this.dataFetchMode === 'Full' || this.dataFetchMode === 'Batch') {
                 this.gridOptions['enablePagination'] = true;
                 this.pagination['enabled'] = false;
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
             if (this.childSectionHeaderActionConfig[this.selectedObjectName] || sectionObjectDetails['isMatrixEnabled'] === true || this.isMailActionAvailable === true || this.isWorkflowActionAvailable === true) {
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
             if (sectionObjectDetails['criteriaQueryConfig']) {
                 this.layoutCriteriaQueryConfig = sectionObjectDetails['criteriaQueryConfig']['queryConfig'];
                 this.layoutCriteriaDataObjects = sectionObjectDetails['criteriaQueryConfig']['junctionDataObjects']
             }
             if (sectionObjectDetails['sectionUserDataRestrictionSet']) {
                 this.layoutDataRestrictionSet = sectionObjectDetails['sectionUserDataRestrictionSet'];
             }

             let getAngularGrid = () => {
                 return this.angularGrid
             }
             this.listenerName = this.slickgridUtils.subscribeLazyLoading(this.dataFetchMode, this.layoutId, getAngularGrid, this.columnDefinitions);
             this.getChildObjectTotalCount().then(res => {
                 this.initiateFetch()
             })
             this.registerRecordChangeListener()
             this.registerSectionRecordChangeListener()
             Object.keys(this.sectionObjectsHierarchy).forEach(objectId => {
                 this.listServiceUtils.prepareFormulaAndRollupFieldInfo(this.sectionObjectsHierarchy[objectId], this.formulaAndRollupFieldInfo)
             })

         });



         this.dripDownAttribute = "#cs-dropdown-" + this.layoutId;
         this.childObjectsInfo = [];

     }
     @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
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
     public layoutId = "203868_preview";
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


     public itemCount: number;
     public hlLayoutId = "203868";
     public itemsPerPageConfigured = this.cspfmLayoutConfig['layoutConfiguration'][this.hlLayoutId]["itemsPerPageConfigured"]
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
     public pageTitle = '';
     public parentGridFetch;
     public gridSearchRowToggle = false;
     public onGroupByEnabledObj = {
         onGroupByEnabled: false
     };
     private parentTitle = '';
     public selectedObjectName = '';
     private selectedObjectParentName: any = "";
     public headerDocItem: any = {};
     public childObjectsInfoTemp = [];
     private currentStatusWorkflowActionFiledId;
     public childObjectTotalCount = 0;
     public selctedObjectTotalCount = 0;
     readonly headerHeight = 50;
     readonly rowHeight = 50;
     columnMode = ColumnMode;
     public gridObj;
     public columnDefinitions;
     public currentPageIndex = 0;
     public nextBadgeDisabled = true;
     public gridMenuExtension: any;
     isAnyDataFetchPending = false;
     public parentDependentObjectList = {};
     public parentObjectHierarchyJSON = {};
     public dataRestrictionIdSet = [];
     public batchWiseIdArray = [];
     public batchWiseIdArrayTemp = [];
     public resultCount = 0;
     public totalRecords = 0;
     public gridOptions: GridOption = {
         enableAutoSizeColumns: false,
         enableEmptyDataWarningMessage: false,
         autoFitColumnsOnFirstLoad: false,


         enableAutoResize: true,
         pagination: {
             pageSizes: [10, 15, 20, 25, 50, 75, 100, 200, 1000, 2000],
             pageSize: this.itemsPerPageConfigured
         },
         enableSorting: true,
         enableFiltering: true,
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
                         this.openDraggableGroupingRow()
                     },
                     positionOrder: 95
                 }, {
                     command: "cspfm-clear-groupby",
                     titleKey: "Clear Grouping",
                     iconCssClass: "fa fa-times",
                     action: (event, callbackArgs) => {
                         this.slickgridUtils.clearGrouping(this.angularGrid, this.draggableGroupingPlugin, this.gridObj, this.gridOptions, this.filteredResultList, this.gridSearchRowToggle, this.onGroupByEnabledObj)
                     },
                     positionOrder: 96
                 },
                 {
                     command: "cspfm-trigger-to-close",
                     titleKey: "Trigger to close",
                     cssClass: 'cs-display-none pinpoint',
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
         createPreHeaderPanel: true,
         preHeaderPanelHeight: 40,
         rowHeight: 40,
         headerRowHeight: 40,
         draggableGrouping: {
             dropPlaceHolderText: 'Drop a column header here to group by the column',
             deleteIconCssClass: 'fa fa-times',
             onExtensionRegistered: (extension) => {
                 this.draggableGroupingPlugin = extension
             }
         },

         presets: {
             sorters: [{
                 columnId: "",
                 direction: 'ASC'
             }],
         },

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
     public dataFetchMode: 'Full' | 'Batch' | 'OnClickBatch' = 'Batch';
     public entryPageA = {
         "pfm74408": {
             "addActionRequired": true,
             "addActionElementId": "deppersonalinfo_d_w_hl_list_New_1_preview"
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
                         "redirectUrl": "deppersonalinfo_d_w_hl_listpreview",
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
     public navigationParamsForDetailViewPage = {
         "pfm74408": []
     };
     public actionComponentJson = {};
     public hiddenColumnsIds = {}
     public childSectionHeaderActionConfig = {};

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
             'sectionElementId': 'SEC_deppersonalinfo_d_w_hl_list_Dep_childInfo_WEB_LIST_SECTION_preview',
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


     public columnDefinitionsjson: {
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

     public listenerName;
     async fetchModifiedRec(modifiedData) {
         const additionalObjectdata = {};
         additionalObjectdata['id'] = modifiedData['id'];
         const fetchParams = {
             'objectHierarchyJSON': this.objectHierarchyJSON,
             'dataSource': appConstant.pouchDBStaticName,
             'additionalInfo': additionalObjectdata
         }

         this.dataProvider.querySingleDoc(fetchParams).then(result => {
                 if (result["status"] !== "SUCCESS") {
                     this.errorMessageToDisplay = result["message"];
                     return;
                 }
                 const modifiedRec = result["records"][0];
                 const eventsTriggeredindex = this.getChangedObjectIndex(
                     this.childObjectsInfo,
                     modifiedRec,
                     "id"
                 );
                 if (eventsTriggeredindex > -1) {
                     this.childObjectsInfo.splice(eventsTriggeredindex, 1);
                 }
                 this.childObjectsInfo.push(modifiedRec);
                 if (this.appUtilityConfig.isMobileResolution === false) {
                     this.childObjectsInfo = [...this.childObjectsInfo]
                 }
             })
             .catch(error => {
                 console.log(error);
             });
     }
     onItemTap(childItem) {
         const options = {
             animate: false
         }
         const itemTapNavigationParams = {
             parentObj: JSON.stringify(this.dataObject['deppersonalinfo_DUMMY']),
             parentName: this.selectedObjectParentName,
             id: childItem["id"],
             parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName'],
             parentFieldValue: this.dataObject['deppersonalinfo_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']],
             parentTitle: this.parentTitle,
             deppersonalinfo_d_w_hl_listpreview,
             redirectUrl: '/menu/deppersonalinfo_d_w_hl_listpreview'
         }
         this.navigateObjectBaseDetailPage(this.selectedObjectName, itemTapNavigationParams, options)
     }
     checkIfRecordsAvailableInSectionAndRemove(idsToremove) {
         idsToremove.forEach(modifiedDataId => {
             this.slickgridUtils.modifiedDataSet(this.angularGrid, this.childObjectsInfo, this.selectedObjectName, modifiedDataId)
         });
     }
     async fetchAllDataWeb(objectHierarchyJSON,
         paginationAction ? : 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh', paginationClickFlag ? ) {
         if (paginationClickFlag && this.isLoading) {
             this.appUtilityConfig.presentToast("Another process is running, please wait");
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

             'listenerName': this.listenerName,
             isLazyLoadEnabled: true,
             pagination: {
                 limit: this.pagination['view']['itemCount'],
                 offset: this.pagination['currentPageIndex'] * Number(this.pagination['view']['itemCount']),
                 bookmark: ""
             }
         }
         if (this.pagination['bookmark'][this.pagination['currentPageIndex']]) {
             fetchParams['pagination']['bookmark'] = this.pagination['bookmark'][this.pagination['currentPageIndex']];
         }
         if (this.dataSource === appConstant.couchDBStaticName) {
             fetchParams['searchListQuery'] = "type:" + this.selectedObjectName + " AND " + this.__deppersonalinfo$tableName + ":" + this.dataObject['deppersonalinfo_DUMMY']["id"]
             if (this.batchWiseIdArray.length > 0) {
                 if (this.dataFetchMode === 'OnClickBatch') {
                     fetchParams['batchIds'] = [...this.batchWiseIdArray[this.pagination['currentPageIndex']]];
                     fetchParams['pagination']['bookmark'] = "";
                 } else {
                     if (this.resultCount === this.pagination['total_rows']) {
                         fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + this.batchWiseIdArray[0].join(" OR ") + " )"
                         this.resultCount = 0;
                         this.batchWiseIdArray.shift();
                         fetchParams['pagination']['bookmark'] = "";
                     } else {
                         fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + this.batchWiseIdArrayTemp[this.batchWiseIdArrayTemp.length - this.batchWiseIdArray.length - 1].join(" OR ") + " )"
                     }
                 }
             } else if (this.batchWiseIdArray.length === 0 && this.batchWiseIdArrayTemp.length > 0) {
                 fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND _id : ( " + this.batchWiseIdArrayTemp[this.batchWiseIdArrayTemp.length - 1].join(" OR ") + " )"
             } else {
                 fetchParams['searchListQuery'] = fetchParams['searchListQuery']
             }
         }
         if (fetchParams['searchListQuery'] && this.layoutCriteriaQuery !== '' && !(this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {
             fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND ' + this.layoutCriteriaQuery
         }

         return this.dataProvider.fetchDataFromDataSource(fetchParams).then(res => {
             this.dataObject = JSON.parse(JSON.stringify(this.dataObject))
             this.isLoading = false;
             if (res['layoutDataRestrictionSet']) {
                 this.layoutDataRestrictionUserIds = lodash.flatten(res['layoutDataRestrictionSet'].map(restrictionSet => restrictionSet['restrictedDataUserIds']));
             }
             if (res['status'] === 'SUCCESS') {

                 this.pagination['bookmark'][this.pagination['currentPageIndex'] + 1] = res['bookmark'];

                 if (res['total_rows']) {
                     this.pagination['total_rows'] = res['total_rows']
                 } else if (this.totalRecords) {
                     this.pagination['total_rows'] = this.totalRecords;
                 } else {
                     this.pagination['total_rows'] = 0;
                 }

                 if (this.pagination['total_rows'] > 0) {
                     if (this.pagination['total_rows'] < Number(this.pagination['view']['itemCount'])) {
                         this.pagination['pagesCount'] = 1
                     } else {
                         let modulusValue = this.pagination['total_rows'] % Number(this.pagination['view']['itemCount'])
                         if (modulusValue === 0) {
                             this.pagination['pagesCount'] = this.pagination['total_rows'] / Number(this.pagination['view']['itemCount'])
                         } else {
                             this.pagination['pagesCount'] = (this.pagination['total_rows'] - modulusValue) / Number(this.pagination['view']['itemCount']) + 1
                         }
                     }
                 }

                 if (res['records'].length > 0) {
                     this.resultCount = this.resultCount + res['records'].length;
                     if (res["records"].length < this.pagination['view']['itemCount']) {
                         this.pagination['nextBadgeDisabled'] = true;
                     } else {
                         this.pagination['nextBadgeDisabled'] = false;
                     }

                     this.cspfmCustomFieldProviderObject.makeSlickGridCustomFields(res['records'], this.columnDefinitions)
                     if (this.dataFetchMode === 'OnClickBatch') {
                         this.isLoading = false;
                         this.updateDataFetchStatus(false);
                         this.childObjectsInfo = [...res['records']]
                         if (this.isAnyDataFetchPending) {
                             this.isAnyDataFetchPending = false;
                             return this.fetchAllDataWeb(this.objectHierarchyJSON, 'current_page_refresh');
                         }
                         this.itemCount = Number(this.pagination['view']['itemCount']);
                         if (!this.batchWiseIdArray[this.pagination['currentPageIndex'] + 1]) {
                             this.pagination['nextBadgeDisabled'] = true
                         }
                         if (this.pagination['currentPageIndex'] > 0 && this.pagination['nextBadgeDisabled']) {
                             let rowsCount = this.pagination['total_rows'] - (this.pagination['currentPageIndex'] * Number(this.pagination['view']['itemCount']))
                         }
                         return {
                             'status': res['status'],
                             'message': res['message'],
                             'paginationAction': paginationAction,
                             'records': this.childObjectsInfo
                         };
                     } else if (this.dataFetchMode === 'Batch') {
                         this.childObjectsInfo = [...this.childObjectsInfo, ...res['records']]
                     } else {
                         this.childObjectsInfoTemp = [...this.childObjectsInfoTemp, ...res['records']]
                     }

                     if (res['records'].length <= Number(this.pagination['view']['itemCount'])) {
                         if (this.dataFetchMode === "Batch" && this.pagination['view']['itemCount'] !== "2000") {
                             this.pagination['view']['itemCount'] = "2000";
                         }
                         return this.fetchAllDataWeb(objectHierarchyJSON, 'next_pressed')
                     }
                 } else {
                     this.updateDataFetchStatus(false);
                     if (this.dataFetchMode === 'Full') {
                         this.childObjectsInfo = [...this.childObjectsInfoTemp]
                     }
                     if (this.dataFetchMode === 'OnClickBatch') {
                         this.pagination['nextBadgeDisabled'] = true;
                         if (paginationAction) {
                             if (this.pagination['currentPageIndex'] > 0) {
                                 this.pagination['currentPageIndex'] = this.pagination['currentPageIndex'] - 1;
                             }
                         } else {
                             this.slickgridChildObjectsInfo = [];
                             this.childObjectsInfo = [];
                         }
                     }
                     return {
                         'status': res['status'],
                         'message': res['message'],
                         'paginationAction': paginationAction,
                         'records': this.childObjectsInfo
                     }
                 }
             } else {
                 this.updateDataFetchStatus(false);
                 return {
                     'status': res['status'],
                     'message': res['message'],
                     'paginationAction': paginationAction,
                     'records': res['records']

                 }

             }
         }).catch(error => {
             this.updateDataFetchStatus(false);
             this.isLoading = false;
             return {
                 'status': "FAILED",
                 'message': "",
                 'paginationAction': "",
                 'records': []
             }

         });
     }

     updateDataFetchStatus(status: boolean) {
         let slickgrid: SlickGrid = this.angularGrid['slickGrid'];
         slickgrid['isDataFetching'] = status;
         slickgrid.invalidate()
         slickgrid.render()
     }

     public reportInput = {};
     public printInput = {};

     public moreActionInfo = {}




     onActionCellClick(mouseEvent: KeyboardEvent | MouseEvent, args: OnEventArgs, objectName ? ) {

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
             this.onItemTap(data);
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



     onGridItemClick(event) {
         var cell = event['detail']['args']['cell'];
         var columns = event['detail']['args']['grid'].getColumns();
         var data = this.angularGrid.dataView.getItem(event['detail']['args']['row']);
         if (data['__group']) {
             return
         }
         if (columns[cell] && (columns[cell]['id'] === "_checkbox_selector" || columns[cell]['type'] === FieldType.unknown ||
                 (columns[cell]['params'] && columns[cell]['params']['cspfmEditorType'] && columns[cell]['params']['cspfmEditorType'] === 'LOOKUP'))) {

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

             this.slickGridItemClickCount++;
             if (this.slickGridItemClickCount === 1) {
                 setTimeout(() => {
                     if (this.slickGridItemClickCount === 1) {
                         console.log("onGridItemClick")
                         this.onItemTap(data)
                     }
                     this.slickGridItemClickCount = 0;
                 }, 250);
             }
         }
     }

     inLineEditlookupSelected(event, childObjectName) {
         if (event['actionName'] === "selection") {
             let dataContext = event['dataContext']
             let columnDef: Column = event['columnDef']
             this.angularGrid.dataView.beginUpdate();
             var value = this.angularGrid.dataView.getItemById(dataContext['id'])
             if (value) {
                 this.angularGrid.dataView.updateItem(dataContext['id'], dataContext);
             } else {
                 this.angularGrid.dataView.addItem(dataContext);
             }
             this.angularGrid.dataView.endUpdate();
             this.angularGrid.dataView.reSort();

             let saveData = this.slickgridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).data;
             let savefieldInfo = this.slickgridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).fieldInfo;
             if (saveData && Object.keys(saveData).length > 0) {
                 const recordId = saveData.type + '_2_' + saveData.id
                 this.slickgridUtils.fetchEditedRecord(this.dataSource, this.angularGrid, recordId, savefieldInfo, event['item'], dataContext)
             } else {
                 this.appUtilityConfig.showAlert(this, "Dependent relationship object not available. We are not able to allow this action")
             }
         }
     }
     getSelectionEditorOptions(childObjectName) {
         return {
             onClose: () => {
                 if (this.gridObj) {
                     this.gridObj.getEditorLock().commitCurrentEdit();
                 }
             }
         }
     }
     openDraggableGroupingRow() {
         this.gridObj.setPreHeaderPanelVisibility(true);
     }

     ngAfterViewChecked() {
         this.appUtilityConfig.appendHttpToURL();
         this.slickgridUtils.flatpickerAddRemove(this.layoutId, 'set')
     }

     registerRecordChangeListener() {
         if (this.dataSource !== 'JsonDB') {
             this.appUtilityConfig.addEventSubscriptionlayoutIds(this.parentDependentObjectList, this.layoutId, this.dataSource);
         }
         this.observableListenerUtils.subscribe(this.layoutId, (modified) => {
             try {
                 const isRecordDeleted = this.liveListenerHandlerUtils.handleLiveListenerForDelectedRecords('HL-GRID', modified, this);
                 if (isRecordDeleted) {
                     return;
                 }
                 var type = modified['doc']['data']['type'];
                 if (this.dataSource !== 'JsonDB') {
                     const layoutInfo = {
                         "dataObject": this.dataObject['deppersonalinfo_DUMMY']
                     }
                     if (this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.GRID_FETCH, this.parentDependentObjectList, modified, layoutInfo)) {
                         this.fetchSelectedObject();
                     }
                 }

             } catch (error) {
                 console.log(error);
             }
         });
     }

     initializeStatusWorkFlowFields() {

     }


     registerSectionRecordChangeListener() {
         this.appUtilityConfig.addEventSubscriptionlayoutIds(this.sectionDependentObjectList, this.layoutId + "_" + this.selectedObjectName, this.dataSource);
         this.observableListenerUtils.subscribe(this.layoutId + "_" + this.selectedObjectName, (modified) => {
             const changedSectionDependentObject = this.sectionDependentObjectList
             if (modified["doc"]["data"]["type"].includes('userAssignment') && this.layoutDataRestrictionSet && this.layoutDataRestrictionSet[0]['restrictionType'] === 'userAssignment') {
                 if (!this.appUtilityConfig.verifyUser(modified["doc"]["data"])) {
                     return false;
                 }
                 if (this.childObjectsInfo.includes(modified["doc"]["data"]['reference_id']) && !modified["doc"]["data"]['isActive']) {
                     const removeOldIds = [modified["doc"]["data"]['reference_id']]
                     this.addingChangeListerDataBasedOnFetchMode([], removeOldIds, []);
                 } else {
                     this.initiateFetch('listener').then(criteriaMeetingIds => {
                         criteriaMeetingIds = criteriaMeetingIds.map(item => {
                             return this.liveListenerHandlerUtils.getIdWithoutPfm(item)
                         })
                         if (criteriaMeetingIds.includes(modified["doc"]["data"]['reference_id']) && modified["doc"]["data"]['isActive']) {
                             const addNewIds = [modified["doc"]["data"]['reference_id']]
                             this.addingChangeListerDataBasedOnFetchMode(addNewIds, [], []);
                         }
                     })
                 }
             } else if (!modified["doc"]["data"]["type"].includes('userAssignment')) {
                 if (this.layoutDataRestrictionUserIds.length > 0) {
                     const data = modified['doc']['data'];
                     var isCreatedByIdInUserRestriction;
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
                     "formulaAndRollupFieldInfo": this.formulaAndRollupFieldInfo,
                     "dataObject": this.dataObject[this.__deppersonalinfo$tableName],
                     "objectId": this.__deppersonalinfo$tableName
                 }
                 let idArrayToFetch = this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.SECTION_FETCH, changedSectionDependentObject, modified, layoutInfo)
                 idArrayToFetch = idArrayToFetch.filter(item => {
                     if (item['pfm{layoutgrp.primaryObjectId}']) {
                         return item['pfm{layoutgrp.primaryObjectId}'] === this.dataObject['deppersonalinfo_DUMMY']['id'];
                     } else if (item["doc"]["data"]['pfm{layoutgrp.primaryObjectId}']) {
                         return item["doc"]["data"]['pfm{layoutgrp.primaryObjectId}'] === this.dataObject['deppersonalinfo_DUMMY']['id'];
                     }
                 })
                 if (idArrayToFetch.length > 0) {
                     idArrayToFetch = lodash.map(idArrayToFetch, 'id')
                     this.initiateFetch('listener').then(criteriaMeetingIds => {
                         criteriaMeetingIds = criteriaMeetingIds.map(item => {
                             return this.liveListenerHandlerUtils.getIdWithoutPfm(item)
                         })
                         const addNewIds = lodash.difference(criteriaMeetingIds, this.childObjectsInfo);
                         const removeOldIds = lodash.difference(this.childObjectsInfo, criteriaMeetingIds);
                         const updateIds = lodash.intersection(idArrayToFetch, criteriaMeetingIds);
                         this.addingChangeListerDataBasedOnFetchMode(addNewIds, removeOldIds, updateIds);
                     })
                 } else {
                     if (this.childObjectsInfo.length === 0) {
                         this.initiateFetch();
                     }
                 }
             }

         });
     }
     addingChangeListerDataBasedOnFetchMode(addNewIds, removeOldIds, updateIds) {
         if (removeOldIds && removeOldIds.length > 0) {
             this.batchWiseIdArray = [...lodash.difference(this.batchWiseIdArray, removeOldIds)];
         }
         if (addNewIds && addNewIds.length > 0) {
             this.batchWiseIdArray = [...this.batchWiseIdArray, ...addNewIds];
         }
         this.batchWiseIdArrayTemp = [...this.batchWiseIdArray];
         if (this.dataFetchMode === 'OnClickBatch') {
             if (this.batchWiseIdArray.length > 0) {
                 this.totalRecords = this.batchWiseIdArray.length;
                 this.batchWiseIdArray = lodash.chunk(lodash.flatten(this.batchWiseIdArray), Number(this.pagination['view']['itemCount']));
                 this.batchWiseIdArrayTemp = lodash.chunk(lodash.flatten(this.batchWiseIdArray), Number(this.pagination['view']['itemCount']));
             }
             if (this.isLoading) {
                 this.isAnyDataFetchPending = true;
             } else {
                 this.fetchAllDataWeb(this.objectHierarchyJSON, undefined, 'current_page_refresh')
             }
         } else {
             if (removeOldIds.length > 0) {
                 this.checkIfRecordsAvailableInSectionAndRemove(removeOldIds)
             }
             if (addNewIds.length > 0) {
                 this.headerLineUtils.fetchChildModifiedRecords(this.angularGrid, this.selectedObjectName, addNewIds, this.objectHierarchyJSON, this);
             } else if (updateIds.length > 0) {
                 this.headerLineUtils.fetchChildModifiedRecords(this.angularGrid, this.selectedObjectName, updateIds, this.objectHierarchyJSON, this);
             }
         }
     }

     async fetchSelectedObject() {
         const additionalObjectdata = {};
         additionalObjectdata["id"] = this.dataObject['deppersonalinfo_DUMMY']["id"];
         additionalObjectdata["isFirstLevelFetchNeed"] = true;
         const fetchParams = {
             objectHierarchyJSON: this.parentObjectHierarchyJSON,
             additionalInfo: additionalObjectdata,
             dataSource: appConstant.couchDBStaticName
         };
         const taskList = [];
         taskList.push(
             this.dataProvider
             .querySingleDoc(fetchParams)
             .then(async result => {
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


                 if (!this.objectHierarchyJSON['isLazyLoadingEnabled']) {
                     this.isAssociationLoading = false
                 }
                 if (this.changeRef && !this.changeRef['destroyed']) {
                     this.changeRef.detectChanges();
                 }
                 return result;

             }).catch(error => {
                 clearInterval(this.skeletonIntervalId);
                 this.isSkeletonLoading = false;
                 console.log(error);
             })
         );
     }
     async initiateFetch(methodCalledBy ? ) {
         const queryConfig = this.layoutCriteriaQueryConfig;
         if ((this.layoutDataRestrictionSet.length > 0 && this.layoutDataRestrictionSet[0]['restrictionType'] === "userAssignment") || (this.layoutCriteriaQueryConfig && this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {
             if (this.isLoading === false) {
                 this.isLoading = true;
             }
             if (queryConfig && queryConfig['junctionObjectsHierarchy'] && queryConfig['junctionObjectsHierarchy'].length > 0) {
                 await this.cspfmLookupCriteriaUtils.getJunctionObjects(queryConfig['junctionObjectsHierarchy']).then(junctionDataObjects => {
                     if (junctionDataObjects[this.__deppersonalinfo$tableName] && this.layoutCriteriaDataObjects[this.__deppersonalinfo$tableName]) {
                         junctionDataObjects[this.__deppersonalinfo$tableName].push(this.layoutCriteriaDataObjects[this.__deppersonalinfo$tableName])
                     }
                     this.layoutCriteriaDataObjects = {
                         ...this.layoutCriteriaDataObjects,
                         ...junctionDataObjects
                     }
                     return this.layoutCriteriaDataObjects;
                 })
             }
             const layoutDataRestrictionSet = {
                 "dataRestrictionSet": this.layoutDataRestrictionSet,
                 "criteriaQueryConfig": this.layoutCriteriaQueryConfig,
                 "junctionDataObjects": this.layoutCriteriaDataObjects,
                 "searchQuery": "type:" + this.selectedObjectName + ' AND ' + this.__deppersonalinfo$tableName + ":" + this.dataObject['deppersonalinfo_DUMMY']['id'],
                 "objectName": this.selectedObjectName
             }
             return this.cspfmLookupCriteriaUtils.dataRestrictionFetch(layoutDataRestrictionSet, "HL_list").then(res => {
                 this.dataRestrictionIdSet = res;
                 this.batchWiseIdArray = lodash.chunk(this.dataRestrictionIdSet, this.batchIdLimit);
                 this.batchWiseIdArrayTemp = lodash.chunk(this.dataRestrictionIdSet, this.batchIdLimit);
                 if (this.dataRestrictionIdSet.length > 0) {
                     if (this.layoutCriteriaQueryConfig && !(this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {
                         return this.makeQueryAndStartFetch(methodCalledBy)
                     } else {
                         if (methodCalledBy === 'listener') {
                             return lodash.flatten(this.batchWiseIdArray);
                         } else {
                             return this.fetchAllDataWeb(this.objectHierarchyJSON).then(result => {
                                 this.handleResult(result)
                             });
                         }
                     }
                 } else {
                     const response = {
                         'status': "SUCCESS",
                         'message': "",
                         'paginationAction': "",
                         'records': []
                     }
                     this.handleResult(response)
                 }
             })
         } else if (this.layoutCriteriaQueryConfig && Object.keys(this.layoutCriteriaQueryConfig).length > 0) {
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
                 fetchParams['searchListQuery'] = "type:" + this.selectedObjectName + " AND " + this.tableName_pfm71658 + ":" + this.dataObject['deppersonalinfo_DUMMY']["id"]
                 taskList = taskList.concat(this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', fetchParams['searchListQuery']))
                 return Promise.all(taskList).then(result => {
                     var ids = [];
                     result.forEach(res => {
                         ids = ids.concat(res['rows'].map(e => e['id']))
                     })
                     return ids;
                 })
             } else {
                 this.slickgridChildObjectsInfo = []
                 this.childObjectsInfo = []
                 this.childObjectsInfoTemp = []
                 return this.fetchAllDataWeb(this.objectHierarchyJSON).then(result => {
                     return this.handleResult(result)
                 });
             }
         }
     }


     makeQueryAndStartFetch(methodCalledBy, paginationAction ? : 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh', paginationClickFlag ? ) {
         const paginationInfo = this.pagination;
         const configObject = {
             'layoutCriteriaQueryConfig': this.layoutCriteriaQueryConfig,
             'listCriteriaDataObject': this.layoutCriteriaDataObjects
         }
         var fetchParams = {
             'objectHierarchyJSON': this.objectHierarchyJSON,
             'layoutDataRestrictionSet': this.layoutDataRestrictionSet,
             'dataSource': this.dataSource,
             pagination: {
                 limit: paginationInfo['view']['itemCount'],
                 offset: paginationInfo['currentPageIndex'] * Number(paginationInfo['view']['itemCount']),
                 bookmark: ""
             }
         }
         if (this.layoutCriteriaQuery === '') {
             this.layoutCriteriaQueryConfig['relationalObjectResults'] = this.layoutCriteriaReationalObjectIds;
             this.layoutCriteriaQuery = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject)
         }
         if (methodCalledBy === 'listener') {
             fetchParams['searchListQuery'] = "type:" + this.selectedObjectName + " AND " + this.__deppersonalinfo$tableName + ": " + this.dataObject['deppersonalinfo_DUMMY']['id']
             let batchIdQuery = fetchParams['searchListQuery'] + " AND " + this.layoutCriteriaQuery
             return this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', batchIdQuery).then(result => {
                 return result["rows"].map(e => e['id']);
             })
         } else {
             return this.fetchAllDataWeb(this.objectHierarchyJSON).then(result => {
                 return this.handleResult(result)
             });
         }
     }

     async handleResult(result) {


         this.angularGrid['slickGrid']['isDataFetching'] = false;
         if (result && result['status'] && result['records'] && (result['status'] === 'SUCCESS' || result['records'].length > 0)) {
             this.angularGrid.resizerService.resizeGrid();
             this.batchWiseIdArray = [...this.batchWiseIdArrayTemp];
             this.resultCount = 0;
             if (this.dataFetchMode === "Batch") {
                 this.pagination['view']['itemCount'] = this.itemsPerPageConfigured.toString();
             }
             this.errorMessageToDisplay = 'No Records';
             this.childObjectsInfo = lodash.uniq([...this.childObjectsInfo, ...result['records']])

             this.isSkeletonLoading = false;
             this.slickgridChildObjectsInfo = this.childObjectsInfo;
             this.isLoading = false;
             if (this.changeRef && !this.changeRef['destroyed']) {
                 this.changeRef.detectChanges();
             }
             this.angularGrid["slickGrid"]['isAutoFitEnable'] = this.sectionObjectDetails[this.selectedObjectName].isAutoFitEnable
             setTimeout(() => {
                 this.slickgridUtils.resizeColumnsByCellContent(this.angularGrid)
             }, 100);
             return Promise.resolve([true]);
         } else {
             this.batchWiseIdArray = [...this.batchWiseIdArrayTemp];
             this.resultCount = 0;
             if (!result['paginationAction']) {
                 this.slickgridChildObjectsInfo = [];
                 this.childObjectsInfo = [];
             }
             this.errorMessageToDisplay = result['message'];

             if (this.errorMessageToDisplay === "No internet") {
                 this.appUtilityConfig.presentNoInternetToast(this);
             }

             this.isSkeletonLoading = false;
             this.slickgridChildObjectsInfo = this.childObjectsInfo;
             this.isLoading = false;
             if (this.changeRef && !this.changeRef['destroyed']) {
                 this.changeRef.detectChanges();
             }
             return Promise.resolve([false]);
         }
     }






     associationConfigurationAssignment() {
         this.associationConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.hlLayoutId]['associationConfiguration']);



     }
     assignAssociationConfigToField(associationFieldObj, associationConfig) {
         if (associationFieldObj.hasOwnProperty('associationInfo')) {
             associationFieldObj['associationInfo'] = associationConfig
         } else {
             this.assignAssociationConfigToField(associationFieldObj['child'], associationConfig)
         }
     }
     angularGridReady(angularGrid: AngularGridInstance) {
         this.angularGrid = angularGrid;
         this.slickgridUtils.draggableGroupingExtension(this.angularGrid, this.gridOptions)
         this.gridMenuExtension = angularGrid.extensionService.getExtensionByName(ExtensionName.gridMenu)
         angularGrid.filterService.onSearchChange.subscribe((input) => {
             console.log("input")
         });
         this.gridObj = angularGrid.slickGrid;
         this.gridObj.setHeaderRowVisibility(false);

         this.gridObj['cspfm_grid_custom_data'] = {
             "page_title_key": this.pageTitle,
             "angular_grid_excel_export_service_instance": angularGrid.excelExportService,
             "angular_grid_export_service_instance": angularGrid.exportService,
             "isPaginationEnabled": this.gridOptions['enablePagination']
         }
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

         if (this.gridObj.getCanvasWidth() < window.innerWidth) {
             this.gridObj.autosizeColumns();
         }
         if (this.groupingColumns.length > 0) {
             this.slickgridUtils.setInitialGrouping(this.selectedObjectName, this.gridObj, this.sectionObjectDetails[this.selectedObjectName]['groupingColumns'], this.tableColumnInfo, this.draggableGroupingPlugin)
         }

     }
     refreshData() {
         this.getChildObjectTotalCount().then(res => {
             this.fetchAllDataWeb(this.objectHierarchyJSON)
         })
     }
     ngAfterViewInit() {
         $(document).ready(function() {
             $(".slick-viewport-top.slick-viewport-left").on('scroll', function() {
                 let topval = 0
                 try {
                     topval = parseInt($(".cs-dropdown-open:visible").closest('.slick-row')[0].style.top.split('px')[0])
                 } catch (err) {
                     topval = undefined
                 }
                 if (topval >= $(this).scrollTop()) {
                     console.log("True ScrollTop => ", $(this).scrollTop())
                     window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown'])
                 } else {
                     console.log("False ScrollTop => ", $(this).scrollTop())
                     window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])
                 }
             });

             $(".cs-mat-main-content").on('scroll', function() {
                 window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])
             });
         })
         this.slickgridUtils.flatpickerAddRemove(this.layoutId, 'set')
     }
     @HostListener('click') onClick() {
         this.showNavigationHistoryPopUp = false;
     }
     ngOnInit() {
         this.skeletonIntervalId = window.setInterval(() => {
             this.animation = this.animation === 'pulse' ? 'progress-dark' : 'pulse';
         }, 5000);


     }
     ngOnDestroy() {

         this.angularGrid.destroy();
         this.slickgridUtils.removeObservableListener(this.listenerName)
         this.liveListenerHandlerUtils.unregisterRecordChangeListener(this.parentDependentObjectList, this.layoutId, this);
         this.liveListenerHandlerUtils.unregisterRecordChangeListener(this.sectionDependentObjectList, this.layoutId + "_" + this.selectedObjectName, this);
         this.slickgridUtils.flatpickerAddRemove(this.layoutId, 'remove')
     }
     ionViewWillEnter() {
         document.body.setAttribute("class", "linedetail");
     }
     getChangedObjectIndex(array, modifiedData, key) {
         return lodash.findIndex(array, item => {
             return item[key] === modifiedData[key];
         }, 0);
     }
     getChildObjectTotalCount() {
         const additionalObjectdata = {};
         additionalObjectdata["id"] = this.dataObject['deppersonalinfo_DUMMY']["id"];
         const fetchParams = {
             objectHierarchyJSON: this.objectHierarchyJSON,
             additionalInfo: additionalObjectdata,
             dataSource: this.dataSource
         };
         return this.dataProvider
             .getChildCount(fetchParams)
             .then(childCountResponse => {
                 if (childCountResponse["status"] !== "SUCCESS") {
                     this.errorMessageToDisplay = childCountResponse["message"];
                     return Promise.resolve(true)
                 }
                 this.childObjectTotalCount = childCountResponse["records"].length;
                 return Promise.resolve(true)
             }).catch(error => {
                 clearInterval(this.skeletonIntervalId);
                 this.isSkeletonLoading = false;
             });
     }
     commitCurrentEdit(objectName) {
         if (this.gridObj) {
             this.gridObj.getEditorLock().commitCurrentEdit();
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
     addButton_elementId_Onclick() {

         const options = {
             animate: false
         }
         const addNavigationParams = {
             action: "Add",
             parentId: this.dataObject['deppersonalinfo_DUMMY']["id"],
             parentObj: JSON.stringify(this.dataObject['deppersonalinfo_DUMMY']),
             parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName'],
             parentFieldValue: this.dataObject['deppersonalinfo_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']],
             parentPage: this,
             parentName: this.selectedObjectParentName,
             redirectUrl: '/menu/deppersonalinfo_d_w_hl_listpreview'
         }
         this.navigateObjectBaseEntryPage(addNavigationParams, options)
     }
     navigateObjectBaseDetailPage(objectName, itemTapNavigationParams, options) {
         if (objectName === "pfm74408") {

             this.router.navigate(["/menu/depchildinfo_d_w_hl_detail_view"], {
                 queryParams: itemTapNavigationParams,
                 skipLocationChange: true
             });
         }
     }
     navigateObjectBaseEntryPage(addNavigationParams, options) {
         if (this.selectedObjectName === 'pfm74408') {
             this.router.navigate(["/menu/depchildinfo_Entry_Web"], {
                 queryParams: addNavigationParams,
                 skipLocationChange: true
             });
         }
     }
 }