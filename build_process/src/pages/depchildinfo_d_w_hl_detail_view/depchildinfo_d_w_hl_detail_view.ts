

 /* 
  *   File: depchildinfo_d_w_hl_detail_view.ts
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
     metaDataDbProvider
 } from "src/core/db/metaDataDbProvider";
 import {
     metaDbConfiguration
 } from "src/core/db/metaDbConfiguration";
 import {
     DatePipe
 } from "@angular/common";
 import {
     cspfmMetaCouchDbProvider
 } from 'src/core/db/cspfmMetaCouchDbProvider';
 import {
     cspfmLayoutConfiguration
 } from "src/core/pfmmapping/cspfmLayoutConfiguration";
 import {
     cspfmSlickgridUtils
 } from 'src/core/dynapageutils/cspfmSlickgridUtils';
 import {
     cspfmBalloonComponent
 } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent';
 @Component({
     selector: 'depchildinfo_d_w_hl_detail_view',
     templateUrl: 'depchildinfo_d_w_hl_detail_view.html'
 }) export class depchildinfo_d_w_hl_detail_view implements OnInit {
     isCustomFetchLoading = false;
     dripDownAttribute = '';
     constructor(public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, public angularUtilService: AngularUtilService, public dialog: MatDialog, public popoverCtrl: PopoverController, public modalCtrl: ModalController, private changeRef: ChangeDetectorRef,
         public applicationRef: ApplicationRef, public appUtilityConfig: appUtility, public observableListenerUtils: cspfmObservableListenerUtils, private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils,
         public router: Router, public activatRoute: ActivatedRoute, public objectTableMapping: objectTableMapping, public lookupFieldMapping: lookupFieldMapping,
         public loadingCtrl: LoadingController, public toastCtrl: ToastController, public dataProvider: dataProvider, public metaDbConfigurationObj: metaDbConfiguration,
         public cspfmReportGenerationService: CspfmReportGenerationService, public metaDbProvider: metaDataDbProvider, public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider, public pfmObjectConfig: cspfmObjectConfiguration, private cspfmConditionalFormattingUtils: cspfmConditionalFormattingUtils, public slickgridUtils: cspfmSlickgridUtils,
         public cspfmLayoutConfig: cspfmLayoutConfiguration, public executionDbConfigObject: cspfmExecutionPouchDbConfiguration, private datePipe: DatePipe, private liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils, public alerCtrl: AlertController, public onlineDbIndexCreation: onlineDbIndexCreation, public offlineDbIndexCreation: offlineDbIndexCreation,
         @Inject(MAT_DIALOG_DATA) data, public dialogRef: MatDialogRef < depchildinfo_d_w_hl_detail_view > , private slickgridPopoverService: SlickgridPopoverService, private cspfmDataDisplay: cspfm_data_display, public customActionUtils: cspfmCustomActionUtils,
         public dbService: couchdbProvider, public translateService: TranslateService,
     ) {
         this.customActionConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['customActionConfiguration']);
         this.associationConfigurationAssignment()
         if (data.hasOwnProperty('params')) {
             this.isPopUpEnabled = true;
             dialogRef.disableClose = true;
             let params = data['params'];
             this.initializeStatusWorkFlowFields();
             if (params["redirectUrl"]) {
                 this.redirectUrl = params["redirectUrl"]
             }
             if (params["isFromMenu"]) {
                 this.isFromMenu = params["isFromMenu"]
             }
             this.parentTitle = params["parentTitle"];
             this.id = params["id"];

             this.fetchSelectedObject();
         } else {
             this.activatRoute.queryParams.subscribe(params => {
                 if (Object.keys(params).length === 0 && params.constructor === Object) {
                     console.log("list query params skipped");
                     return
                 }
                 if (params["redirectUrl"]) {
                     this.redirectUrl = params["redirectUrl"]
                 }
                 if (params["id"]) {
                     this.id = params["id"];
                 }
                 this.initializeStatusWorkFlowFields();
                 this.parentTitle = params["parentTitle"];

                 this.fetchSelectedObject();
             });
         }
         this.appUtilityConfig.setEventSubscriptionlayoutIds(
             this.tableName_pfm71658,
             this.layoutId
         );

         if (
             !this.appUtilityConfig.isMobile ||
             this.appUtilityConfig.osType === "android"
         ) {
             this.isBrowser = true;
         }

         this.observableListenerUtils.subscribe(this.layoutId, modified => {
             if (modified["dataProvider"] === "PouchDB") {
                 this.childObjectModifiedEventTrigger(modified);
             }
         });

         this.registerRecordChangeListener();
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



     public filteredEventTriggeredList = [];
     public parentValue;
     private tableName_pfm74408 = 'pfm74408';
     public errorMessageToDisplay = "No Records";
     public eventsTriggeredList: Array < any > = [];
     public objectHierarchyJSON: ObjectHierarchy = {
         "objectId": "74408",
         "referenceObjectId": "0",
         "objectName": "depchildinfo",
         "isStandardObject": "N",
         "rootPath": "depchildinfo_DUMMY",
         "fieldId": "0",
         "relationShipType": "null",
         "objectType": "PRIMARY",
         "childObject": [{
             "objectId": "71655",
             "fieldId": "965870",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 74408,
             "rootPath": "depchildinfo_DUMMY$$depemployee_depclookup1",
             "isStandardObject": "N",
             "relationShipType": "",
             "includeFields": true,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": []
         }, {
             "objectId": "71658",
             "fieldId": "965874",
             "objectName": "deppersonalinfo",
             "objectType": "HEADER",
             "referenceObjectId": 0,
             "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster",
             "isStandardObject": "N",
             "relationShipType": "one_to_many",
             "includeFields": true,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": [{
                 "objectId": "71655",
                 "fieldId": "967507",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4",
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
                 "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup",
                 "isStandardObject": "N",
                 "relationShipType": "",
                 "includeFields": true,
                 "formulaField": [{
                     "fieldName": "depformulan"
                 }],
                 "childObject": []
             }, {
                 "objectId": "71655",
                 "fieldId": "967505",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3",
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
                 "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser",
                 "isStandardObject": "Y",
                 "relationShipType": "",
                 "includeFields": true,
                 "childObject": []
             }, {
                 "objectId": "71655",
                 "fieldId": "964453",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2",
                 "isStandardObject": "N",
                 "relationShipType": "",
                 "includeFields": true,
                 "formulaField": [{
                     "fieldName": "depformulan"
                 }],
                 "childObject": []
             }]
         }, {
             "objectId": "71655",
             "fieldId": "965872",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 74408,
             "rootPath": "depchildinfo_DUMMY$$depemployee_depclookup2",
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
             "rootPath": "depchildinfo_DUMMY$$COR_USERS_depcoruser",
             "isStandardObject": "Y",
             "relationShipType": "",
             "includeFields": true,
             "childObject": []
         }, {
             "objectId": "71655",
             "fieldId": "967514",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 74408,
             "rootPath": "depchildinfo_DUMMY$$depemployee_depclookup3",
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
             "rootPath": "depchildinfo_DUMMY$$depemployee_depclookup4",
             "isStandardObject": "N",
             "relationShipType": "",
             "includeFields": true,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": []
         }],
         "formulaField": [{
             "fieldName": "depcformula1"
         }]
     };

     public layoutDataRestrictionSet = [];
     public layoutId = "213011";
     public layoutName = "depchildinfo_d_w_hl_detail_view";
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
             "pfm71658": ["pfm71658"],
             "pfm74408": []
         },
         "lookupObjects": {
             "pfm71655": {
                 "pfm71658": ["pfm71658", "pfm71655_967507"],
                 "pfm74408": ["pfm71655_967514"]
             },
             "pfm5": {
                 "pfm71658": ["pfm71658", "pfm5_967712"],
                 "pfm74408": ["pfm5_967510"]
             }
         },
         "dataRestrictionInvolvedObjects": {}
     };
     public isLoading = false;
     public workFlowActionConfig = {};
     public __depchildinfo$tableName = this.objectTableMapping.mappingDetail['depchildinfo'];

     skeletonIntervalId: number | null = null;
     animation = 'pulse';
     public associationConfiguration = {};
     public tableColumnInfo: {
         [key: string]: {
             [key: string]: {
                 [key: string]: FieldInfo
             }
         }
     } = {};
     public associationColumnDefinitions = {}
     isBrowser = false;
     headerenable = false;
     headerDocItem: any = {};
     public dataObject = {};
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
     public isAssociationLoading = true;
     private tableName_pfm71658 = "pfm71658";
     private parentTitle: any = "";
     public pageTitle = "";
     public id: any = "";
     private loading;
     public intervalId;
     public redirectUrl = "/";
     public isFromMenu = false;
     public showNavigationHistoryPopUp = false;
     private dataPaths: Array < {
         traversalPath: string;requiredTemp: boolean
     } > = [{
         traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup1',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup2',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$COR_USERS_depcoruser',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup3',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup4',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser',
         requiredTemp: false
     }, {
         traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2',
         requiredTemp: false
     }, ]
     public expandParentObjectData: 'C' | 'HO' | 'FO' = 'FO';
     public previousGridState;
     public restrictionRules = []
     private fieldApproverType = {};
     private workFlowMapping = {};
     public pfm74408depcformula1Formula = "depchildinfo.DepC Name1.length()";
     public pfm71658depformulanFormula = "square(deppersonalinfo.DepNumber)";
     objDisplayName = {
         'pfm71658': {
             'objectName': 'deppersonalinfo',
             'objectDisplayName': 'Dep_PersonalInfo'
         },
         'pfm74408': {
             'objectName': 'depchildinfo',
             'objectDisplayName': 'Dep_childInfo'
         },
     };





     public __deppersonalinfo$tableName = this.objectTableMapping.mappingDetail['deppersonalinfo'];
     public __depemployee$tableName = this.objectTableMapping.mappingDetail['depemployee'];
     public __COR_USERS$tableName = this.objectTableMapping.mappingDetail['COR_USERS'];
     public team_930594_8001063 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['team'];
     public location_930595_8001071 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['location'];
     public depmultiselect_967503_8001059 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['depmultiselect'];
     public depcheckbox_967504_8001054 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['depcheckbox'];
     public depdropdownn_972310_8001090 = this.pfmObjectConfig.objectConfiguration[this.__depchildinfo$tableName]['selectionFieldsMapping']['depdropdownn'];
     public gridFieldInfo: {
         [key: string]: FieldInfo
     } = {
         "pfm74408_depcname_8001081": {
             "id": "depcname",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depcname.depcname",
             "fieldName": "depcname",
             "prop": "depcname",
             "fieldType": "TEXT",
             "objectName": "depchildinfo",
             "elementid": 8001081,
             "traversalpath": "depchildinfo_DUMMY$$depcname",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depcname1_8001076": {
             "id": "depcname1",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depcname1.depcname1",
             "fieldName": "depcname1",
             "prop": "depcname1",
             "fieldType": "TEXT",
             "objectName": "depchildinfo",
             "elementid": 8001076,
             "traversalpath": "depchildinfo_DUMMY$$depcname1",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depcdate1_8001082": {
             "id": "depcdate1",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depcdate1.depcdate1",
             "fieldName": "depcdate1",
             "prop": "depcdate1",
             "fieldType": "DATE",
             "objectName": "depchildinfo",
             "elementid": 8001082,
             "traversalpath": "depchildinfo_DUMMY$$depcdate1",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depcnum1_8001084": {
             "id": "depcnum1",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depcnum1.depcnum1",
             "fieldName": "depcnum1",
             "prop": "depcnum1",
             "fieldType": "NUMBER",
             "objectName": "depchildinfo",
             "elementid": 8001084,
             "traversalpath": "depchildinfo_DUMMY$$depcnum1",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depccurrency1_8001092": {
             "id": "depccurrency1",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depccurrency1.depccurrency1",
             "fieldName": "depccurrency1",
             "prop": "depccurrency1",
             "fieldType": "CURRENCY",
             "objectName": "depchildinfo",
             "elementid": 8001092,
             "traversalpath": "depchildinfo_DUMMY$$depccurrency1",
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
         "pfm74408_depboolean_8001080": {
             "id": "depboolean",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depboolean.depboolean",
             "fieldName": "depboolean",
             "prop": "depboolean",
             "fieldType": "BOOLEAN",
             "objectName": "depchildinfo",
             "elementid": 8001080,
             "traversalpath": "depchildinfo_DUMMY$$depboolean",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depnumber_8001087": {
             "id": "depnumber",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depnumber.depnumber",
             "fieldName": "depnumber",
             "prop": "depnumber",
             "fieldType": "NUMBER",
             "objectName": "depchildinfo",
             "elementid": 8001087,
             "traversalpath": "depchildinfo_DUMMY$$depnumber",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depcformula1__f_8001093": {
             "id": "depcformula1__f",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depcformula1.depcformula1",
             "fieldName": "depcformula1__f",
             "prop": "depcformula1__f",
             "fieldType": "FORMULA",
             "formulaType": "NUMBER",
             "objectName": "depchildinfo",
             "elementid": 8001093,
             "traversalpath": "depchildinfo_DUMMY$$depcformula1",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depdate_8001077": {
             "id": "depdate",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depdate.depdate",
             "fieldName": "depdate",
             "prop": "depdate",
             "fieldType": "DATE",
             "objectName": "depchildinfo",
             "elementid": 8001077,
             "traversalpath": "depchildinfo_DUMMY$$depdate",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depclookup1_8001078": {
             "id": "pfm71655_965870_employeeid",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depclookup1.depclookup1",
             "prop": "pfm71655_965870.employeeid",
             "fieldName": "pfm71655_965870",
             "fieldType": "LOOKUP",
             "objectName": "depchildinfo",
             "elementid": 8001078,
             "traversalpath": "depchildinfo_DUMMY$$depclookup1",
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
                 "objectName": "depchildinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71655_employeename_8001091": {
             "child": {
                 "id": "employeename",
                 "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depemployee_depclookup1$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8001091,
                 "traversalpath": "depchildinfo_DUMMY$$depemployee_depclookup1$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "pfm71655_965870_employeename",
             "prop": "pfm71655_965870.employeename",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depemployee_depclookup1$$employeename.employeename",
             "elementid": 8001091,
             "mappingDetails": "",
             "traversalpath": "depchildinfo_DUMMY$$depemployee_depclookup1$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_965870",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm74408_depclookup2_8001075": {
             "id": "pfm71655_965872_employeeid",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depclookup2.depclookup2",
             "prop": "pfm71655_965872.employeeid",
             "fieldName": "pfm71655_965872",
             "fieldType": "LOOKUP",
             "objectName": "depchildinfo",
             "elementid": 8001075,
             "traversalpath": "depchildinfo_DUMMY$$depclookup2",
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
                 "objectName": "depchildinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depcoruser_8001089": {
             "id": "pfm5_967510_username",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depcoruser.depcoruser",
             "prop": "pfm5_967510.username",
             "fieldName": "pfm5_967510",
             "fieldType": "LOOKUP",
             "objectName": "depchildinfo",
             "elementid": 8001089,
             "traversalpath": "depchildinfo_DUMMY$$depcoruser",
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
                 "objectName": "depchildinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71655_employeename_8001086": {
             "child": {
                 "id": "employeename",
                 "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depemployee_depclookup2$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8001086,
                 "traversalpath": "depchildinfo_DUMMY$$depemployee_depclookup2$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "pfm71655_965872_employeename",
             "prop": "pfm71655_965872.employeename",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depemployee_depclookup2$$employeename.employeename",
             "elementid": 8001086,
             "mappingDetails": "",
             "traversalpath": "depchildinfo_DUMMY$$depemployee_depclookup2$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_965872",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm74408_deptimestamp_8001088": {
             "id": "deptimestamp",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deptimestamp.deptimestamp",
             "fieldName": "deptimestamp",
             "prop": "deptimestamp",
             "fieldType": "TIMESTAMP",
             "objectName": "depchildinfo",
             "elementid": 8001088,
             "traversalpath": "depchildinfo_DUMMY$$deptimestamp",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateTimeFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depdecimal_8001079": {
             "id": "depdecimal",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depdecimal.depdecimal",
             "fieldName": "depdecimal",
             "prop": "depdecimal",
             "fieldType": "DECIMAL",
             "objectName": "depchildinfo",
             "elementid": 8001079,
             "traversalpath": "depchildinfo_DUMMY$$depdecimal",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depclookup3_8001085": {
             "id": "pfm71655_967514_employeeid",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depclookup3.depclookup3",
             "prop": "pfm71655_967514.employeeid",
             "fieldName": "pfm71655_967514",
             "fieldType": "LOOKUP",
             "objectName": "depchildinfo",
             "elementid": 8001085,
             "traversalpath": "depchildinfo_DUMMY$$depclookup3",
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
                 "objectName": "depchildinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm74408_depdropdownn_8001090": {
             "id": "depdropdownn",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depdropdownn.depdropdownn",
             "fieldName": "depdropdownn",
             "prop": "depdropdownn",
             "fieldType": "DROPDOWN",
             "objectName": "depchildinfo",
             "elementid": 8001090,
             "traversalpath": "depchildinfo_DUMMY$$depdropdownn",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.depdropdownn_972310_8001090,
             "currencyDetails": ""
         },
         "pfm74408_depclookup4_8001083": {
             "id": "pfm71655_967516_employeeid",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$depclookup4.depclookup4",
             "prop": "pfm71655_967516.employeeid",
             "fieldName": "pfm71655_967516",
             "fieldType": "LOOKUP",
             "objectName": "depchildinfo",
             "elementid": 8001083,
             "traversalpath": "depchildinfo_DUMMY$$depclookup4",
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
                 "objectName": "depchildinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_name_8001061": {
             "id": "name",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$name.name",
             "fieldName": "name",
             "prop": "name",
             "fieldType": "TEXT",
             "objectName": "deppersonalinfo",
             "elementid": 8001061,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$name",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_employeename_8001056": {
             "id": "employeename",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$employeename.employeename",
             "fieldName": "employeename",
             "prop": "employeename",
             "fieldType": "TEXT",
             "objectName": "deppersonalinfo",
             "elementid": 8001056,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$employeename",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_team_8001063": {
             "id": "team",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$team.team",
             "fieldName": "team",
             "prop": "team",
             "fieldType": "DROPDOWN",
             "objectName": "deppersonalinfo",
             "elementid": 8001063,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$team",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.team_930594_8001063,
             "currencyDetails": ""
         },
         "pfm71658_location_8001071": {
             "id": "location",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$location.location",
             "fieldName": "location",
             "prop": "location",
             "fieldType": "DROPDOWN",
             "objectName": "deppersonalinfo",
             "elementid": 8001071,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$location",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.location_930595_8001071,
             "currencyDetails": ""
         },
         "pfm71658_depcurrency_8001065": {
             "id": "depcurrency",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcurrency.depcurrency",
             "fieldName": "depcurrency",
             "prop": "depcurrency",
             "fieldType": "CURRENCY",
             "objectName": "deppersonalinfo",
             "elementid": 8001065,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcurrency",
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
         "pfm71658_deptimestamp_8001062": {
             "id": "deptimestamp",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deptimestamp.deptimestamp",
             "fieldName": "deptimestamp",
             "prop": "deptimestamp",
             "fieldType": "TIMESTAMP",
             "objectName": "deppersonalinfo",
             "elementid": 8001062,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deptimestamp",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateTimeFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depdate_8001064": {
             "id": "depdate",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depdate.depdate",
             "fieldName": "depdate",
             "prop": "depdate",
             "fieldType": "DATE",
             "objectName": "deppersonalinfo",
             "elementid": 8001064,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depdate",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depboolean_8001073": {
             "id": "depboolean",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depboolean.depboolean",
             "fieldName": "depboolean",
             "prop": "depboolean",
             "fieldType": "BOOLEAN",
             "objectName": "deppersonalinfo",
             "elementid": 8001073,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depboolean",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depnumber_8001057": {
             "id": "depnumber",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depnumber.depnumber",
             "fieldName": "depnumber",
             "prop": "depnumber",
             "fieldType": "NUMBER",
             "objectName": "deppersonalinfo",
             "elementid": 8001057,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depnumber",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depdecimal_8001068": {
             "id": "depdecimal",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depdecimal.depdecimal",
             "fieldName": "depdecimal",
             "prop": "depdecimal",
             "fieldType": "DECIMAL",
             "objectName": "deppersonalinfo",
             "elementid": 8001068,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depdecimal",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_deplookup_8001058": {
             "id": "pfm71655_930602_employeeid",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup.deplookup",
             "prop": "pfm71655_930602.employeeid",
             "fieldName": "pfm71655_930602",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8001058,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup",
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
         "pfm71655_employeename_8001070": {
             "child": {
                 "id": "employeename",
                 "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8001070,
                 "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup$$employeename.employeename",
             "elementid": 8001070,
             "mappingDetails": "",
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_930602",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_depformulan__f_8001053": {
             "id": "depformulan__f",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depformulan.depformulan",
             "fieldName": "depformulan__f",
             "prop": "depformulan__f",
             "fieldType": "FORMULA",
             "formulaType": "NUMBER",
             "objectName": "deppersonalinfo",
             "elementid": 8001053,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depformulan",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_deplookup2_8001055": {
             "id": "pfm71655_964453_employeeid",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup2.deplookup2",
             "prop": "pfm71655_964453.employeeid",
             "fieldName": "pfm71655_964453",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8001055,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup2",
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
         "pfm71655_employeename_8001067": {
             "child": {
                 "id": "employeename",
                 "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8001067,
                 "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2$$employeename.employeename",
             "elementid": 8001067,
             "mappingDetails": "",
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_964453",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_depmultiselect_8001059": {
             "id": "depmultiselect",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depmultiselect.depmultiselect",
             "fieldName": "depmultiselect",
             "prop": "depmultiselect",
             "fieldType": "MULTISELECT",
             "objectName": "deppersonalinfo",
             "elementid": 8001059,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depmultiselect",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.depmultiselect_967503_8001059,
             "currencyDetails": ""
         },
         "pfm71658_depcheckbox_8001054": {
             "id": "depcheckbox",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcheckbox.depcheckbox",
             "fieldName": "depcheckbox",
             "prop": "depcheckbox",
             "fieldType": "CHECKBOX",
             "objectName": "deppersonalinfo",
             "elementid": 8001054,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcheckbox",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.depcheckbox_967504_8001054,
             "currencyDetails": ""
         },
         "pfm71658_depcoruser_8001060": {
             "id": "pfm5_967712_username",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcoruser.depcoruser",
             "prop": "pfm5_967712.username",
             "fieldName": "pfm5_967712",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8001060,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcoruser",
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
         "pfm71658_deplookup3_8001069": {
             "id": "pfm71655_967505_employeeid",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup3.deplookup3",
             "prop": "pfm71655_967505.employeeid",
             "fieldName": "pfm71655_967505",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8001069,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup3",
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
         "pfm71655_employeename_8001074": {
             "child": {
                 "id": "employeename",
                 "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8001074,
                 "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3$$employeename.employeename",
             "elementid": 8001074,
             "mappingDetails": "",
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_967505",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_deplookup4_8001072": {
             "id": "pfm71655_967507_employeeid",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup4.deplookup4",
             "prop": "pfm71655_967507.employeeid",
             "fieldName": "pfm71655_967507",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8001072,
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup4",
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
         "pfm71655_employeename_8001066": {
             "child": {
                 "id": "employeename",
                 "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8001066,
                 "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depchildinfo_d_w_hl_detail_view.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4$$employeename.employeename",
             "elementid": 8001066,
             "mappingDetails": "",
             "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_967507",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         }
     };
     async fetchSelectedObject() {
         const additionalObjectdata = {};
         additionalObjectdata["id"] = this.id;
         const fetchParams = {
             objectHierarchyJSON: this.objectHierarchyJSON,
             additionalInfo: additionalObjectdata,
             dataSource: appConstant.couchDBStaticName
         };
         this.dataProvider
             .querySingleDoc(fetchParams)
             .then(async result => {
                 clearInterval(this.skeletonIntervalId);
                 this.dataObject['depchildinfo_DUMMY'] = {};
                 if (result["status"] !== "SUCCESS") {
                     this.isSkeletonLoading = false;
                     const errorMessageToDisplay = result["message"];
                     if (errorMessageToDisplay === "No internet") {
                         this.appUtilityConfig.presentNoInternetToast(this);
                     }

                     return;
                 }


                 this.dataObject['depchildinfo_DUMMY'] = result["records"][0];
                 this.cspfmDataTraversalUtilsObject.updateLayoutData(this.dataPaths, this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId, true);
                 if (this.dataObject['depchildinfo_DUMMY'][this.__deppersonalinfo$tableName]) {
                     this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'] = this.dataObject['depchildinfo_DUMMY'][this.__deppersonalinfo$tableName]
                 }




                 this.isSkeletonLoading = false;
                 if (this.changeRef && !this.changeRef['destroyed']) {
                     this.changeRef.detectChanges();
                 }
                 if (!this.objectHierarchyJSON['isLazyLoadingEnabled']) {
                     this.isAssociationLoading = false
                 }
             })
             .catch(error => {
                 clearInterval(this.skeletonIntervalId);
                 this.isSkeletonLoading = false;

                 console.log(error);
             });
     }
     refreshData() {
         this.fetchSelectedObject();
     }
     registerRecordChangeListener() {
         if (this.dataSource !== 'JsonDB') {
             this.appUtilityConfig.addEventSubscriptionlayoutIds(this.dependentObjectList, this.layoutId, this.dataSource);
         }

         this.observableListenerUtils.subscribe(this.layoutId, (modified) => {
             try {
                 const isRecordDeleted = this.liveListenerHandlerUtils.handleLiveListenerForDelectedRecords('VIEW', modified, this);
                 if (isRecordDeleted) {
                     return;
                 }

                 if (this.intervalId) {
                     return;
                 }
                 var type = modified['doc']['data']['type'];
                 if (this.dataSource !== 'JsonDB') {
                     const layoutInfo = {
                         "dataObject": this.dataObject['depchildinfo_DUMMY']
                     }
                     if (this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.GRID_FETCH, this.dependentObjectList, modified, layoutInfo)) {
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
     ngAfterViewInit() {
         $(document).ready(function() {
             $(".cs-mat-main-content").on('scroll', function() {
                 window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])
             });
         })
     }
     ngOnDestroy() {

         this.liveListenerHandlerUtils.unregisterRecordChangeListener(this.dependentObjectList, this.layoutId, this);


     };
     public reportInput = {};
     public printInput = {};

     public moreActionInfo = {}







     associationConfigurationAssignment() {
         this.associationConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['associationConfiguration']);


     }
     childObjectModifiedEventTrigger(modified) {
         const modifiedData = this.dataProvider.convertRelDocToNormalDoc(modified);
         if (modifiedData["id"] === this.id) {
             this.fetchSelectedObject();
         }
     }
     ngOnInit() {

         this.skeletonIntervalId = window.setInterval(() => {
             this.animation = this.animation === 'pulse' ? 'progress-dark' : 'pulse';
         }, 5000);

     }
     ionViewWillEnter() {
         document.body.setAttribute("class", "linelistinnerdetail");
     }

     ngAfterViewChecked() {
         this.appUtilityConfig.appendHttpToURL();
     }
     ionViewDidEnter() {
         var dvHeader = document.querySelector(".detail-view-sub-header");
         dvHeader.setAttribute("color", "var(--ion-color-primary, #3880ff)");
         var dvHeaderItem = document.querySelector(
             ".detail-view-sub-header ion-item"
         );
         dvHeaderItem.setAttribute("color", "var(--ion-color-primary, #3880ff)");
         var dvHeaderListHd = document.querySelectorAll(
             ".hl-full-detail-content ion-list-header"
         );
         var dvHeaderListHdLen = dvHeaderListHd.length;
         for (var i = 0; i < dvHeaderListHdLen; i++) {
             dvHeaderListHd[i].setAttribute(
                 "color",
                 "var(--ion-color-primary, #3880ff)"
             );
         }
         var pvHdItembg = document.querySelectorAll(
             ".detail-view-sub-header ion-badge"
         );
         var pvHdItembgLen = pvHdItembg.length;
         for (var j = 0; j < pvHdItembgLen; j++) {
             pvHdItembg[j].setAttribute(
                 "background",
                 "var(--ion-color-primary-tint, #4c8dff)"
             );
         }
     }
     tabChangeMethod(event, tabGroupId) {
         console.log("tabChangeMethod");
     }
     listButton_8001052_Onclick() {

         var redirectUrlForNav = '/menu/depchildinfo_d_w_hl_detail_view';
         if (this.isPopUpEnabled) {
             this.dialogRef.close();
         }
         this.toastCtrl.dismiss();
         const queryParamsRouting = {};
         if (this.isPopUpEnabled) {
             if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                 queryParamsRouting['redirectUrl'] = this.redirectUrl;
             }
         } else {
             if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depchildinfo_d_w_list")) {
                 queryParamsRouting['redirectUrl'] = "/menu/depchildinfo_d_w_hl_detail_view";
             }
         }
         this.router.navigate(["/menu/depchildinfo_d_w_list"], {
             queryParams: queryParamsRouting,
             skipLocationChange: true
         });

     }
     addButton_8001051_Onclick() {

         if (this.isPopUpEnabled) {
             this.dialogRef.close();
         }
         const queryParamsRouting = {
             action: 'Add',
             parentObj: JSON.stringify(this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster']),
             parentName: this.tableName_pfm71658,
             parentId: this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster']['id']
         };

         if (this.isPopUpEnabled) {
             if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                 queryParamsRouting['redirectUrl'] = this.redirectUrl;
             }
         } else if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depchildinfo_Entry_Web")) {
             queryParamsRouting['redirectUrl'] = "/menu/depchildinfo_d_w_hl_detail_view";
         }
         this.router.navigate(['/menu/depchildinfo_Entry_Web'], {
             queryParams: queryParamsRouting,
             skipLocationChange: true
         });
     }
     editButton_8001050_Onclick() {

         if (this.isPopUpEnabled) {
             this.dialogRef.close();
         }
         if (this.isSkeletonLoading) {
             this.appUtilityConfig.presentToast("Another process is running, please wait");
             return
         }
         var redirectUrlForNav = ''
         if (this.isPopUpEnabled) {
             redirectUrlForNav = this.redirectUrl;
         } else {
             redirectUrlForNav = '/menu/depchildinfo_d_w_hl_detail_view';
         }

         const navigationParams = {
             action: 'Edit',
             id: this.dataObject['depchildinfo_DUMMY']['id'],
             parentObj: JSON.stringify(this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster']),
             parentId: this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster']['id'],
             // redirectUrl: "depchildinfo_d_w_hl_detail_view"
         }
         this.toastCtrl.dismiss();
         if (this.isPopUpEnabled) {
             if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                 navigationParams['redirectUrl'] = this.redirectUrl;
             }
         } else {
             if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depchildinfo_Entry_Web")) {
                 navigationParams['redirectUrl'] = "/menu/depchildinfo_d_w_hl_detail_view";
             }
         }
         let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams, this.pfmObjectConfig['objectConfiguration'], this.cspfmMetaCouchDbProvider);
         if (checkRecordNotInitiated) {
             this.router.navigate(["/menu/depchildinfo_Entry_Web"], {
                 queryParams: navigationParams,
                 skipLocationChange: true
             });
         }
     }
 }