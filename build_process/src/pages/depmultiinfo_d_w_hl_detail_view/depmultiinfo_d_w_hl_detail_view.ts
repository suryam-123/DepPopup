

 /* 
  *   File: depmultiinfo_d_w_hl_detail_view.ts
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
     selector: 'depmultiinfo_d_w_hl_detail_view',
     templateUrl: 'depmultiinfo_d_w_hl_detail_view.html'
 }) export class depmultiinfo_d_w_hl_detail_view implements OnInit {
     isCustomFetchLoading = false;
     dripDownAttribute = '';
     constructor(public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, public angularUtilService: AngularUtilService, public dialog: MatDialog, public popoverCtrl: PopoverController, public modalCtrl: ModalController, private changeRef: ChangeDetectorRef,
         public applicationRef: ApplicationRef, public appUtilityConfig: appUtility, public observableListenerUtils: cspfmObservableListenerUtils, private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils,
         public router: Router, public activatRoute: ActivatedRoute, public objectTableMapping: objectTableMapping, public lookupFieldMapping: lookupFieldMapping,
         public loadingCtrl: LoadingController, public toastCtrl: ToastController, public dataProvider: dataProvider, public metaDbConfigurationObj: metaDbConfiguration,
         public cspfmReportGenerationService: CspfmReportGenerationService, public metaDbProvider: metaDataDbProvider, public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider, public pfmObjectConfig: cspfmObjectConfiguration, private cspfmConditionalFormattingUtils: cspfmConditionalFormattingUtils, public slickgridUtils: cspfmSlickgridUtils,
         public cspfmLayoutConfig: cspfmLayoutConfiguration, public executionDbConfigObject: cspfmExecutionPouchDbConfiguration, private datePipe: DatePipe, private liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils, public alerCtrl: AlertController, public onlineDbIndexCreation: onlineDbIndexCreation, public offlineDbIndexCreation: offlineDbIndexCreation,
         @Inject(MAT_DIALOG_DATA) data, public dialogRef: MatDialogRef < depmultiinfo_d_w_hl_detail_view > , private slickgridPopoverService: SlickgridPopoverService, private cspfmDataDisplay: cspfm_data_display, public customActionUtils: cspfmCustomActionUtils,
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
     private tableName_pfm77370 = 'pfm77370';
     public errorMessageToDisplay = "No Records";
     public eventsTriggeredList: Array < any > = [];
     public objectHierarchyJSON: ObjectHierarchy = {
         "objectId": "77370",
         "referenceObjectId": "0",
         "objectName": "depmultiinfo",
         "isStandardObject": "N",
         "rootPath": "depmultiinfo_DUMMY",
         "fieldId": "0",
         "relationShipType": "null",
         "objectType": "PRIMARY",
         "childObject": [{
             "objectId": "71658",
             "fieldId": "1003750",
             "objectName": "deppersonalinfo",
             "objectType": "HEADER",
             "referenceObjectId": 0,
             "rootPath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster",
             "isStandardObject": "N",
             "relationShipType": "one_to_many",
             "includeFields": true,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": [{
                 "objectId": "71655",
                 "fieldId": "930602",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup",
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
                 "rootPath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4",
                 "isStandardObject": "N",
                 "relationShipType": "",
                 "includeFields": true,
                 "formulaField": [{
                     "fieldName": "depformulan"
                 }],
                 "childObject": []
             }, {
                 "objectId": "71655",
                 "fieldId": "964453",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2",
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
                 "rootPath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$COR_USERS_depcoruser",
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
                 "rootPath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3",
                 "isStandardObject": "N",
                 "relationShipType": "",
                 "includeFields": true,
                 "formulaField": [{
                     "fieldName": "depformulan"
                 }],
                 "childObject": []
             }]
         }, {
             "objectId": "5",
             "fieldId": "1003748",
             "objectName": "COR_USERS",
             "objectType": "LOOKUP",
             "referenceObjectId": 77370,
             "rootPath": "depmultiinfo_DUMMY$$COR_USERS_depmcoruser",
             "isStandardObject": "Y",
             "relationShipType": "",
             "includeFields": true,
             "childObject": []
         }]
     };

     public layoutDataRestrictionSet = [];
     public layoutId = "222887";
     public layoutName = "depmultiinfo_d_w_hl_detail_view";
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
             "pfm77370": []
         },
         "lookupObjects": {
             "pfm71655": {
                 "pfm71658": ["pfm71658", "pfm71655_967507"]
             },
             "pfm5": {
                 "pfm71658": ["pfm71658", "pfm5_967712"],
                 "pfm77370": ["pfm5_1003748"]
             }
         },
         "dataRestrictionInvolvedObjects": {}
     };
     public isLoading = false;
     public workFlowActionConfig = {};
     public __depmultiinfo$tableName = this.objectTableMapping.mappingDetail['depmultiinfo'];

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
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$COR_USERS_depmcoruser',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$COR_USERS_depcoruser',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3',
         requiredTemp: false
     }, ]
     public expandParentObjectData: 'C' | 'HO' | 'FO' = 'FO';
     public previousGridState;
     public restrictionRules = []
     private fieldApproverType = {};
     private workFlowMapping = {};
     public pfm71658depformulanFormula = "square(deppersonalinfo.DepNumber)";
     objDisplayName = {
         'pfm71658': {
             'objectName': 'deppersonalinfo',
             'objectDisplayName': 'Dep_PersonalInfo'
         },
         'pfm77370': {
             'objectName': 'depmultiinfo',
             'objectDisplayName': 'Dep_MultiInfo'
         },
     };





     public __deppersonalinfo$tableName = this.objectTableMapping.mappingDetail['deppersonalinfo'];
     public __depemployee$tableName = this.objectTableMapping.mappingDetail['depemployee'];
     public __COR_USERS$tableName = this.objectTableMapping.mappingDetail['COR_USERS'];
     public team_930594_8009731 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['team'];
     public location_930595_8009739 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['location'];
     public depmultiselect_967503_8009749 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['depmultiselect'];
     public depcheckbox_967504_8009738 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['depcheckbox'];
     public state_1003746_8009755 = this.pfmObjectConfig.objectConfiguration[this.__depmultiinfo$tableName]['selectionFieldsMapping']['state'];
     public cities_1003747_8009754 = this.pfmObjectConfig.objectConfiguration[this.__depmultiinfo$tableName]['selectionFieldsMapping']['cities'];
     public gridFieldInfo: {
         [key: string]: FieldInfo
     } = {
         "pfm77370_mno_8009756": {
             "id": "mno",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$mno.mno",
             "fieldName": "mno",
             "prop": "mno",
             "fieldType": "AUTONUMBER",
             "objectName": "depmultiinfo",
             "elementid": 8009756,
             "traversalpath": "depmultiinfo_DUMMY$$mno",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm77370_depmname1_8009751": {
             "id": "depmname1",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$depmname1.depmname1",
             "fieldName": "depmname1",
             "prop": "depmname1",
             "fieldType": "TEXT",
             "objectName": "depmultiinfo",
             "elementid": 8009751,
             "traversalpath": "depmultiinfo_DUMMY$$depmname1",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm77370_depmaddress1_8009753": {
             "id": "depmaddress1",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$depmaddress1.depmaddress1",
             "fieldName": "depmaddress1",
             "prop": "depmaddress1",
             "fieldType": "TEXTAREA",
             "objectName": "depmultiinfo",
             "elementid": 8009753,
             "traversalpath": "depmultiinfo_DUMMY$$depmaddress1",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm77370_state_8009755": {
             "id": "state",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$state.state",
             "fieldName": "state",
             "prop": "state",
             "fieldType": "DROPDOWN",
             "objectName": "depmultiinfo",
             "elementid": 8009755,
             "traversalpath": "depmultiinfo_DUMMY$$state",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.state_1003746_8009755,
             "currencyDetails": ""
         },
         "pfm77370_cities_8009754": {
             "id": "cities",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$cities.cities",
             "fieldName": "cities",
             "prop": "cities",
             "fieldType": "MULTISELECT",
             "objectName": "depmultiinfo",
             "elementid": 8009754,
             "traversalpath": "depmultiinfo_DUMMY$$cities",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.cities_1003747_8009754,
             "currencyDetails": ""
         },
         "pfm77370_depmcoruser_8009752": {
             "id": "pfm5_1003748_username",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$depmcoruser.depmcoruser",
             "prop": "pfm5_1003748.username",
             "fieldName": "pfm5_1003748",
             "fieldType": "LOOKUP",
             "objectName": "depmultiinfo",
             "elementid": 8009752,
             "traversalpath": "depmultiinfo_DUMMY$$depmcoruser",
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
                 "objectName": "depmultiinfo"
             },
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_name_8009747": {
             "id": "name",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$name.name",
             "fieldName": "name",
             "prop": "name",
             "fieldType": "TEXT",
             "objectName": "deppersonalinfo",
             "elementid": 8009747,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$name",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_employeename_8009740": {
             "id": "employeename",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$employeename.employeename",
             "fieldName": "employeename",
             "prop": "employeename",
             "fieldType": "TEXT",
             "objectName": "deppersonalinfo",
             "elementid": 8009740,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$employeename",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_team_8009731": {
             "id": "team",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$team.team",
             "fieldName": "team",
             "prop": "team",
             "fieldType": "DROPDOWN",
             "objectName": "deppersonalinfo",
             "elementid": 8009731,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$team",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.team_930594_8009731,
             "currencyDetails": ""
         },
         "pfm71658_location_8009739": {
             "id": "location",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$location.location",
             "fieldName": "location",
             "prop": "location",
             "fieldType": "DROPDOWN",
             "objectName": "deppersonalinfo",
             "elementid": 8009739,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$location",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.location_930595_8009739,
             "currencyDetails": ""
         },
         "pfm71658_depcurrency_8009733": {
             "id": "depcurrency",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcurrency.depcurrency",
             "fieldName": "depcurrency",
             "prop": "depcurrency",
             "fieldType": "CURRENCY",
             "objectName": "deppersonalinfo",
             "elementid": 8009733,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcurrency",
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
         "pfm71658_deptimestamp_8009748": {
             "id": "deptimestamp",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deptimestamp.deptimestamp",
             "fieldName": "deptimestamp",
             "prop": "deptimestamp",
             "fieldType": "TIMESTAMP",
             "objectName": "deppersonalinfo",
             "elementid": 8009748,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deptimestamp",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateTimeFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depdate_8009736": {
             "id": "depdate",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depdate.depdate",
             "fieldName": "depdate",
             "prop": "depdate",
             "fieldType": "DATE",
             "objectName": "deppersonalinfo",
             "elementid": 8009736,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depdate",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depboolean_8009729": {
             "id": "depboolean",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depboolean.depboolean",
             "fieldName": "depboolean",
             "prop": "depboolean",
             "fieldType": "BOOLEAN",
             "objectName": "deppersonalinfo",
             "elementid": 8009729,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depboolean",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depnumber_8009741": {
             "id": "depnumber",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depnumber.depnumber",
             "fieldName": "depnumber",
             "prop": "depnumber",
             "fieldType": "NUMBER",
             "objectName": "deppersonalinfo",
             "elementid": 8009741,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depnumber",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depdecimal_8009732": {
             "id": "depdecimal",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depdecimal.depdecimal",
             "fieldName": "depdecimal",
             "prop": "depdecimal",
             "fieldType": "DECIMAL",
             "objectName": "deppersonalinfo",
             "elementid": 8009732,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depdecimal",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_deplookup_8009734": {
             "id": "pfm71655_930602_employeeid",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup.deplookup",
             "prop": "pfm71655_930602.employeeid",
             "fieldName": "pfm71655_930602",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009734,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup",
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
         "pfm71655_employeename_8009737": {
             "child": {
                 "id": "employeename",
                 "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8009737,
                 "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup$$employeename.employeename",
             "elementid": 8009737,
             "mappingDetails": "",
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_930602",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_depformulan__f_8009744": {
             "id": "depformulan__f",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depformulan.depformulan",
             "fieldName": "depformulan__f",
             "prop": "depformulan__f",
             "fieldType": "FORMULA",
             "formulaType": "NUMBER",
             "objectName": "deppersonalinfo",
             "elementid": 8009744,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depformulan",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_deplookup2_8009742": {
             "id": "pfm71655_964453_employeeid",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup2.deplookup2",
             "prop": "pfm71655_964453.employeeid",
             "fieldName": "pfm71655_964453",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009742,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup2",
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
         "pfm71655_employeename_8009745": {
             "child": {
                 "id": "employeename",
                 "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8009745,
                 "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2$$employeename.employeename",
             "elementid": 8009745,
             "mappingDetails": "",
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_964453",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_depmultiselect_8009749": {
             "id": "depmultiselect",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depmultiselect.depmultiselect",
             "fieldName": "depmultiselect",
             "prop": "depmultiselect",
             "fieldType": "MULTISELECT",
             "objectName": "deppersonalinfo",
             "elementid": 8009749,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depmultiselect",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.depmultiselect_967503_8009749,
             "currencyDetails": ""
         },
         "pfm71658_depcheckbox_8009738": {
             "id": "depcheckbox",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcheckbox.depcheckbox",
             "fieldName": "depcheckbox",
             "prop": "depcheckbox",
             "fieldType": "CHECKBOX",
             "objectName": "deppersonalinfo",
             "elementid": 8009738,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcheckbox",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.depcheckbox_967504_8009738,
             "currencyDetails": ""
         },
         "pfm71658_depcoruser_8009730": {
             "id": "pfm5_967712_username",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcoruser.depcoruser",
             "prop": "pfm5_967712.username",
             "fieldName": "pfm5_967712",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009730,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcoruser",
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
         "pfm71658_deplookup3_8009735": {
             "id": "pfm71655_967505_employeeid",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup3.deplookup3",
             "prop": "pfm71655_967505.employeeid",
             "fieldName": "pfm71655_967505",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009735,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup3",
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
         "pfm71655_employeename_8009746": {
             "child": {
                 "id": "employeename",
                 "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8009746,
                 "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3$$employeename.employeename",
             "elementid": 8009746,
             "mappingDetails": "",
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_967505",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_deplookup4_8009750": {
             "id": "pfm71655_967507_employeeid",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup4.deplookup4",
             "prop": "pfm71655_967507.employeeid",
             "fieldName": "pfm71655_967507",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009750,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup4",
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
         "pfm71655_employeename_8009743": {
             "child": {
                 "id": "employeename",
                 "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8009743,
                 "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depmultiinfo_d_w_hl_detail_view.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4$$employeename.employeename",
             "elementid": 8009743,
             "mappingDetails": "",
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4$$employeename",
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
                 this.dataObject['depmultiinfo_DUMMY'] = {};
                 if (result["status"] !== "SUCCESS") {
                     this.isSkeletonLoading = false;
                     const errorMessageToDisplay = result["message"];
                     if (errorMessageToDisplay === "No internet") {
                         this.appUtilityConfig.presentNoInternetToast(this);
                     }

                     return;
                 }


                 this.dataObject['depmultiinfo_DUMMY'] = result["records"][0];
                 this.cspfmDataTraversalUtilsObject.updateLayoutData(this.dataPaths, this.dataObject['depmultiinfo_DUMMY'], this.dataObject, this.layoutId, true);
                 if (this.dataObject['depmultiinfo_DUMMY'][this.__deppersonalinfo$tableName]) {
                     this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'] = this.dataObject['depmultiinfo_DUMMY'][this.__deppersonalinfo$tableName]
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
                         "dataObject": this.dataObject['depmultiinfo_DUMMY']
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
     listButton_8009759_Onclick() {

         var redirectUrlForNav = '/menu/depmultiinfo_d_w_hl_detail_view';
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
             if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depmultiinfo_d_w_list")) {
                 queryParamsRouting['redirectUrl'] = "/menu/depmultiinfo_d_w_hl_detail_view";
             }
         }
         this.router.navigate(["/menu/depmultiinfo_d_w_list"], {
             queryParams: queryParamsRouting,
             skipLocationChange: true
         });

     }
     addButton_8009758_Onclick() {

         if (this.isPopUpEnabled) {
             this.dialogRef.close();
         }
         const queryParamsRouting = {
             action: 'Add',
             parentObj: JSON.stringify(this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster']),
             parentName: this.tableName_pfm71658,
             parentId: this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster']['id']
         };

         if (this.isPopUpEnabled) {
             if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                 queryParamsRouting['redirectUrl'] = this.redirectUrl;
             }
         } else if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depmultiinfo_Entry_Web")) {
             queryParamsRouting['redirectUrl'] = "/menu/depmultiinfo_d_w_hl_detail_view";
         }
         this.router.navigate(['/menu/depmultiinfo_Entry_Web'], {
             queryParams: queryParamsRouting,
             skipLocationChange: true
         });
     }
     editButton_8009757_Onclick() {

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
             redirectUrlForNav = '/menu/depmultiinfo_d_w_hl_detail_view';
         }

         const navigationParams = {
             action: 'Edit',
             id: this.dataObject['depmultiinfo_DUMMY']['id'],
             parentObj: JSON.stringify(this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster']),
             parentId: this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster']['id'],
             // redirectUrl: "depmultiinfo_d_w_hl_detail_view"
         }
         this.toastCtrl.dismiss();
         if (this.isPopUpEnabled) {
             if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                 navigationParams['redirectUrl'] = this.redirectUrl;
             }
         } else {
             if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depmultiinfo_Entry_Web")) {
                 navigationParams['redirectUrl'] = "/menu/depmultiinfo_d_w_hl_detail_view";
             }
         }
         let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams, this.pfmObjectConfig['objectConfiguration'], this.cspfmMetaCouchDbProvider);
         if (checkRecordNotInitiated) {
             this.router.navigate(["/menu/depmultiinfo_Entry_Web"], {
                 queryParams: navigationParams,
                 skipLocationChange: true
             });
         }
     }
 }