

 /* 
  *   File: deppersonalinfo_d_w_list.ts
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
     DatePipe
 } from '@angular/common';
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
     FilterFieldInfo,
     FieldDataType
 } from 'src/core/models/cspfmFilterFieldInfo.type';
 import {
     FormulaType
 } from 'src/core/models/cspfmFormulaType.enum';
 import {
     FilterSectionDetail
 } from 'src/core/models/cspfmFilterDetails.type';
 import {
     cspfmListFilterUtils
 } from 'src/core/dynapageutils/cspfmListFilterUtils';
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
     selector: 'deppersonalinfo_d_w_list',
     templateUrl: 'deppersonalinfo_d_w_list.html'
 }) export class deppersonalinfo_d_w_list implements OnInit {
     isCustomFetchLoading = false;
     dripDownAttribute = '';
     constructor(public angularUtilService: AngularUtilService, public objMapping: objectTableMapping, public objectTableMappingObject: objectTableMapping, public gridIdConfig: cspfmGridsectionListIdConfiguration, public dialog: MatDialog, public observableListenerUtils: cspfmObservableListenerUtils,
         public dataProvider: dataProvider, public socialShare: SocialSharing, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils,
         public callNumber: CallNumber, public emailComposer: EmailComposer, public toastCtrl: ToastController, public sms: SMS, public appUtilityConfig: appUtility, public platform: Platform, public router: Router, public activatRoute: ActivatedRoute, public dbService: couchdbProvider, public onlineIndxCreation: onlineDbIndexCreation, public offlineDbIndexCreation: offlineDbIndexCreation,
         public alertCtrl: AlertController, public lookupFieldMapping: lookupFieldMapping, public cspfmDataDisplay: cspfm_data_display, public alerCtrl: AlertController, public datePipe: DatePipe, public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils, public slickgridUtils: cspfmSlickgridUtils, public listServiceUtils: cspfmListSearchListUtils, public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, private cspfmConditionalFormattingUtils: cspfmConditionalFormattingUtils,
         public popoverController: PopoverController, public translateService: TranslateService, public cspfmCustomFieldProvider: cspfmCustomFieldProvider, private changeRef: ChangeDetectorRef, public cspfmFlatpickrConfig: cspfmFlatpickrConfig, private cspfmSlickgridMatrix: cspfmSlickgridMatrixService, public slickgridPopoverService: SlickgridPopoverService, private pfmObjectConfig: cspfmObjectConfiguration, public executionDbConfigObject: cspfmExecutionPouchDbConfiguration, private cspfmConditionalValidationUtils: cspfmConditionalValidationUtils,
         public cspfmLayoutConfig: cspfmLayoutConfiguration, public cspfmListFilter: cspfmListFilterUtils, public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider, private zone: NgZone, private liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils, private metaDbConfig: metaDbConfiguration, private cspfmReportGenerationService: CspfmReportGenerationService, private metaDbProvider: metaDataDbProvider, public customActionUtils: cspfmCustomActionUtils, private cspfmOnDemandFeature: cspfmOnDemandFeature) {
         this.appUtilityConfig.initialHiddenColumns(this.columnDefinitions, this.__deppersonalinfo$tableName);
         this.slickgridResultList = [];
         this.filteredResultList = [];
         this.filterFieldTypeAndOperator = filterConfig['default']['filterFieldTypeAndOperator'];
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
         this.filterSectionDetailTemp = JSON.parse(JSON.stringify(this.filterSectionDetail))
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
         this.appUtilityConfig.setColumnWidth(this.columnDefinitions[this.__deppersonalinfo$tableName]);

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
         this.gridOptions['gridMenu']['customItems'].push({
             command: "Trigger-to-close",
             titleKey: "Trigger to close",
             cssClass: 'cs-display-none pinpoint',
         });

         if (this.onLoadFetch) {
             this.initiateFetch();
             this.registerRecordChangeListener();
             this.listServiceUtils.prepareFormulaAndRollupFieldInfo(this.objectHierarchyJSON, this.formulaAndRollupFieldInfo)
         } else {

             this.filterAction();
             this.isLoading = false;
         }
         this.isSkeletonLoading = false;


     }
     public obj_pfm5_967712: any = {};
     public pfm5_967712 = {
         "id": "",
         "label": "",
         "object": "",
         "searchKey": ""
     };
     public obj_pfm71655_964453: any = {};
     public pfm71655_964453 = {
         "id": "",
         "label": "",
         "object": "",
         "searchKey": ""
     };
     public obj_pfm71655_967507: any = {};
     public pfm71655_967507 = {
         "id": "",
         "label": "",
         "object": "",
         "searchKey": ""
     };
     public obj_pfm71655_930602: any = {};
     public pfm71655_930602 = {
         "id": "",
         "label": "",
         "object": "",
         "searchKey": ""
     };
     public obj_pfm71655_967505: any = {};
     public pfm71655_967505 = {
         "id": "",
         "label": "",
         "object": "",
         "searchKey": ""
     };
     public lookupReadonlyFieldInfo: {
         [elementKey: string]: FieldInfo
     } = {}
     public resultCount = 0;
     public totalRecords = 0;
     public flatpickerInstances = {};
     public batchIdLimit = 1000;
     public batchWiseIdArray = [];
     public batchWiseIdArrayTemp = [];
     private queryJson = {};
     public selectable = true;
     public removable = true;
     public selectedCurrentEvent: Event;

     public lookupCriteriaQueryConfig = {};
     public criteriaInvolvedFieldsList = {};
     public criteriaDataObject = {};
     public lookupCriteriaValidationFields = {};

     public onGroupByEnabledObj = {
         onGroupByEnabled: false
     };
     private filterCustomFieldWithoutValues = {};
     public layoutDataRestrictionUserIds = [];
     private filterCustomFieldWithValuesTemp = {};
     private filterFieldWithValuesTemp = {};
     public expandFlag = true;

     public onLoadFetch = true;
     public filterApplied = false;
     public gridSearchRowToggle = false;
     reverseHierarchySet: any;
     public filterApplyButtonPressed = false;
     public filterFieldWithoutValues = {};
     public filterAppliedFieldsArray = [];
     public tempFilterAppliedFieldsArray = [];
     private filterSectionDetailTemp = {};
     public readonlyApplicableField = [];
     public filterSectionDetail: FilterSectionDetail = {
         filterFields: {
             "pfm71658_team_8010238": {
                 "isRequired": false,
                 "conditionalOperator": "",
                 "fieldName": "team",
                 "betweenflag": "N",
                 "objectName": "deppersonalinfo",
                 "displayInfo": {
                     "input": [{
                         "label": "deppersonalinfo.team.Option.Innovation Squad",
                         "isChecked": false,
                         "value": "IS"
                     }, {
                         "label": "deppersonalinfo.team.Option.appConnect",
                         "isChecked": false,
                         "value": "AC"
                     }, {
                         "label": "deppersonalinfo.team.Option.Testing",
                         "isChecked": false,
                         "value": "TE"
                     }],
                     "selected": [],
                     "visible": false
                 },
                 "rootPath": "deppersonalinfo_DUMMY",
                 "fieldType": "DROPDOWN",
                 "fieldDisplayName": "Team",
                 "fieldValue": [],
                 "fieldId": 930594
             },
             "pfm71658_employeename_8010237": {
                 "isRequired": false,
                 "conditionalOperator": "",
                 "fieldName": "employeename",
                 "betweenflag": "N",
                 "objectName": "deppersonalinfo",
                 "displayInfo": "",
                 "rootPath": "deppersonalinfo_DUMMY",
                 "fieldType": "TEXT",
                 "fieldDisplayName": "Employee Name",
                 "fieldValue": "",
                 "fieldId": 930593
             },
             "pfm71658_name_8010239": {
                 "isRequired": false,
                 "conditionalOperator": "",
                 "fieldName": "name",
                 "betweenflag": "N",
                 "objectName": "deppersonalinfo",
                 "displayInfo": "",
                 "rootPath": "deppersonalinfo_DUMMY",
                 "fieldType": "TEXT",
                 "fieldDisplayName": "name",
                 "fieldValue": "",
                 "fieldId": 930611
             }
         },
         filterApplied: false,
         filterPanelExpanded: false,
         filterAppliedFields: [],
         reverseHierarchy: {
             "deppersonalinfo_DUMMY$$depemployee_deplookup2": {
                 "objectId": "71655",
                 "fieldId": "964453",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup2",
                 "relationShipType": "",
                 "childObject": [{
                     "objectId": "71658",
                     "fieldId": "0",
                     "objectName": "deppersonalinfo",
                     "objectType": "PRIMARY",
                     "referenceObjectId": 0,
                     "rootPath": "deppersonalinfo_DUMMY",
                     "relationShipType": "",
                     "childObject": []
                 }]
             },
             "deppersonalinfo_DUMMY$$depemployee_deplookup4$$COR_USERS_depcoruser": {
                 "objectId": "5",
                 "fieldId": "967501",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71655,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup4$$COR_USERS_depcoruser",
                 "relationShipType": "",
                 "childObject": [{
                     "objectId": "71655",
                     "fieldId": "967507",
                     "objectName": "depemployee",
                     "objectType": "LOOKUP",
                     "referenceObjectId": 71658,
                     "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup4",
                     "relationShipType": "",
                     "childObject": [{
                         "objectId": "71658",
                         "fieldId": "0",
                         "objectName": "deppersonalinfo",
                         "objectType": "PRIMARY",
                         "referenceObjectId": 0,
                         "rootPath": "deppersonalinfo_DUMMY",
                         "relationShipType": "",
                         "childObject": []
                     }]
                 }]
             },
             "deppersonalinfo_DUMMY$$depemployee_deplookup4": {
                 "objectId": "71655",
                 "fieldId": "967507",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup4",
                 "relationShipType": "",
                 "childObject": [{
                     "objectId": "71658",
                     "fieldId": "0",
                     "objectName": "deppersonalinfo",
                     "objectType": "PRIMARY",
                     "referenceObjectId": 0,
                     "rootPath": "deppersonalinfo_DUMMY",
                     "relationShipType": "",
                     "childObject": []
                 }]
             },
             "deppersonalinfo_DUMMY$$depemployee_deplookup": {
                 "objectId": "71655",
                 "fieldId": "930602",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup",
                 "relationShipType": "",
                 "childObject": [{
                     "objectId": "71658",
                     "fieldId": "0",
                     "objectName": "deppersonalinfo",
                     "objectType": "PRIMARY",
                     "referenceObjectId": 0,
                     "rootPath": "deppersonalinfo_DUMMY",
                     "relationShipType": "",
                     "childObject": []
                 }]
             },
             "deppersonalinfo_DUMMY$$depemployee_deplookup3": {
                 "objectId": "71655",
                 "fieldId": "967505",
                 "objectName": "depemployee",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup3",
                 "relationShipType": "",
                 "childObject": [{
                     "objectId": "71658",
                     "fieldId": "0",
                     "objectName": "deppersonalinfo",
                     "objectType": "PRIMARY",
                     "referenceObjectId": 0,
                     "rootPath": "deppersonalinfo_DUMMY",
                     "relationShipType": "",
                     "childObject": []
                 }]
             },
             "deppersonalinfo_DUMMY$$depemployee_deplookup3$$COR_USERS_depcoruser": {
                 "objectId": "5",
                 "fieldId": "967501",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71655,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup3$$COR_USERS_depcoruser",
                 "relationShipType": "",
                 "childObject": [{
                     "objectId": "71655",
                     "fieldId": "967505",
                     "objectName": "depemployee",
                     "objectType": "LOOKUP",
                     "referenceObjectId": 71658,
                     "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup3",
                     "relationShipType": "",
                     "childObject": [{
                         "objectId": "71658",
                         "fieldId": "0",
                         "objectName": "deppersonalinfo",
                         "objectType": "PRIMARY",
                         "referenceObjectId": 0,
                         "rootPath": "deppersonalinfo_DUMMY",
                         "relationShipType": "",
                         "childObject": []
                     }]
                 }]
             },
             "deppersonalinfo_DUMMY$$COR_USERS_depcoruser": {
                 "objectId": "5",
                 "fieldId": "967712",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71658,
                 "rootPath": "deppersonalinfo_DUMMY$$COR_USERS_depcoruser",
                 "relationShipType": "",
                 "childObject": [{
                     "objectId": "71658",
                     "fieldId": "0",
                     "objectName": "deppersonalinfo",
                     "objectType": "PRIMARY",
                     "referenceObjectId": 0,
                     "rootPath": "deppersonalinfo_DUMMY",
                     "relationShipType": "",
                     "childObject": []
                 }]
             },
             "deppersonalinfo_DUMMY$$depemployee_deplookup$$COR_USERS_depcoruser": {
                 "objectId": "5",
                 "fieldId": "967501",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71655,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup$$COR_USERS_depcoruser",
                 "relationShipType": "",
                 "childObject": [{
                     "objectId": "71655",
                     "fieldId": "930602",
                     "objectName": "depemployee",
                     "objectType": "LOOKUP",
                     "referenceObjectId": 71658,
                     "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup",
                     "relationShipType": "",
                     "childObject": [{
                         "objectId": "71658",
                         "fieldId": "0",
                         "objectName": "deppersonalinfo",
                         "objectType": "PRIMARY",
                         "referenceObjectId": 0,
                         "rootPath": "deppersonalinfo_DUMMY",
                         "relationShipType": "",
                         "childObject": []
                     }]
                 }]
             },
             "deppersonalinfo_DUMMY$$depemployee_deplookup2$$COR_USERS_depcoruser": {
                 "objectId": "5",
                 "fieldId": "967501",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71655,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup2$$COR_USERS_depcoruser",
                 "relationShipType": "",
                 "childObject": [{
                     "objectId": "71655",
                     "fieldId": "964453",
                     "objectName": "depemployee",
                     "objectType": "LOOKUP",
                     "referenceObjectId": 71658,
                     "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup2",
                     "relationShipType": "",
                     "childObject": [{
                         "objectId": "71658",
                         "fieldId": "0",
                         "objectName": "deppersonalinfo",
                         "objectType": "PRIMARY",
                         "referenceObjectId": 0,
                         "rootPath": "deppersonalinfo_DUMMY",
                         "relationShipType": "",
                         "childObject": []
                     }]
                 }]
             },
             "deppersonalinfo_DUMMY": {
                 "objectId": "71658",
                 "fieldId": "0",
                 "objectName": "deppersonalinfo",
                 "objectType": "PRIMARY",
                 "referenceObjectId": 0,
                 "rootPath": "deppersonalinfo_DUMMY",
                 "relationShipType": "",
                 "childObject": []
             }
         },
         isAllRequiredFieldFilled: true,
         filterApplyButtonPressed: false
     }

     private filterCustomFieldWithValues = {
         "pfm71658": {
             "pfm5_967712": {
                 "id": "",
                 "label": "",
                 "object": "pfm5_967712",
                 "searchKey": ""
             },
             "pfm71655_964453": {
                 "id": "",
                 "label": "",
                 "object": "pfm71655_964453",
                 "searchKey": ""
             },
             "pfm71655_967507": {
                 "id": "",
                 "label": "",
                 "object": "pfm71655_967507",
                 "searchKey": ""
             },
             "pfm71655_930602": {
                 "id": "",
                 "label": "",
                 "object": "pfm71655_930602",
                 "searchKey": ""
             },
             "pfm71655_967505": {
                 "id": "",
                 "label": "",
                 "object": "pfm71655_967505",
                 "searchKey": ""
             },
             "team": {
                 "fieldName": "team",
                 "input": [{
                     "label": "Innovation Squad",
                     "isChecked": false,
                     "value": "IS"
                 }, {
                     "label": "appConnect",
                     "isChecked": false,
                     "value": "AC"
                 }, {
                     "label": "Testing",
                     "isChecked": false,
                     "value": "TE"
                 }],
                 "selected": [],
                 "visible": false,
                 "value": []
             }
         }
     };
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
             "includeFields": false,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": [{
                 "objectId": "5",
                 "fieldId": "967501",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71655,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup2$$COR_USERS_depcoruser",
                 "isStandardObject": "Y",
                 "relationShipType": "",
                 "includeFields": false,
                 "childObject": []
             }]
         }, {
             "objectId": "71655",
             "fieldId": "967507",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup4",
             "isStandardObject": "N",
             "relationShipType": "",
             "includeFields": false,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": [{
                 "objectId": "5",
                 "fieldId": "967501",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71655,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup4$$COR_USERS_depcoruser",
                 "isStandardObject": "Y",
                 "relationShipType": "",
                 "includeFields": false,
                 "childObject": []
             }]
         }, {
             "objectId": "71655",
             "fieldId": "930602",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup",
             "isStandardObject": "N",
             "relationShipType": "",
             "includeFields": false,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": [{
                 "objectId": "5",
                 "fieldId": "967501",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71655,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup$$COR_USERS_depcoruser",
                 "isStandardObject": "Y",
                 "relationShipType": "",
                 "includeFields": false,
                 "childObject": []
             }]
         }, {
             "objectId": "71655",
             "fieldId": "967505",
             "objectName": "depemployee",
             "objectType": "LOOKUP",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup3",
             "isStandardObject": "N",
             "relationShipType": "",
             "includeFields": false,
             "formulaField": [{
                 "fieldName": "depformulan"
             }],
             "childObject": [{
                 "objectId": "5",
                 "fieldId": "967501",
                 "objectName": "COR_USERS",
                 "objectType": "LOOKUP",
                 "referenceObjectId": 71655,
                 "rootPath": "deppersonalinfo_DUMMY$$depemployee_deplookup3$$COR_USERS_depcoruser",
                 "isStandardObject": "Y",
                 "relationShipType": "",
                 "includeFields": false,
                 "childObject": []
             }]
         }, {
             "objectId": "5",
             "fieldId": "967712",
             "objectName": "COR_USERS",
             "objectType": "LOOKUP",
             "referenceObjectId": 71658,
             "rootPath": "deppersonalinfo_DUMMY$$COR_USERS_depcoruser",
             "isStandardObject": "Y",
             "relationShipType": "",
             "includeFields": false,
             "childObject": []
         }],
         "formulaField": [{
             "fieldName": "depformulan"
         }]
     };

     public layoutDataRestrictionSet = [];
     public layoutId = "203871";
     public layoutName = "deppersonalinfo_d_w_list";
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
     public upsertHeaderFlag = false
     public __deppersonalinfo$tableName = this.objectTableMappingObject.mappingDetail['deppersonalinfo'];
     public gridId = 'cspfm_grid_' + this.layoutId + '_' + this.__deppersonalinfo$tableName;
     public gridContainerId = 'cspfm_grid_container_' + this.layoutId + '_' + this.__deppersonalinfo$tableName;
     public matrixGridId = 'cspfm_matrix_grid_' + this.layoutId + '_' + this.__deppersonalinfo$tableName;
     public matrixGridContainerId = 'cspfm_matrix_grid_container_' + this.layoutId + '_' + this.__deppersonalinfo$tableName;
     public __depemployee$tableName = this.objectTableMappingObject.mappingDetail['depemployee'];
     public __COR_USERS$tableName = this.objectTableMappingObject.mappingDetail['COR_USERS'];
     public team_930594_8010238 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['team'];
     public team_930594_8010231 = this.pfmObjectConfig.objectConfiguration[this.__deppersonalinfo$tableName]['selectionFieldsMapping']['team'];
     public __deplookup2$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup2'];
     public __depcoruser$lookupIndepemployee = this.lookupFieldMapping.mappingDetail[this.__depemployee$tableName]['depcoruser'];
     public __deplookup4$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup4'];
     public __deplookup$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup'];
     public __deplookup3$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup3'];
     public __depcoruser$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['depcoruser'];
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
             "pfm71658_name_8010232": {
                 "id": "name",
                 "label": "deppersonalinfo_d_w_list.Element.deppersonalinfo_DUMMY$$name.name",
                 "fieldName": "name",
                 "prop": "name",
                 "fieldType": "TEXT",
                 "objectName": "deppersonalinfo",
                 "elementid": 8010232,
                 "traversalpath": "deppersonalinfo_DUMMY$$name",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71658_team_8010231": {
                 "id": "team",
                 "label": "deppersonalinfo_d_w_list.Element.deppersonalinfo_DUMMY$$team.team",
                 "fieldName": "team",
                 "prop": "team",
                 "fieldType": "DROPDOWN",
                 "objectName": "deppersonalinfo",
                 "elementid": 8010231,
                 "traversalpath": "deppersonalinfo_DUMMY$$team",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": this.team_930594_8010231,
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71658_employeename_8010236": {
                 "id": "employeename",
                 "label": "deppersonalinfo_d_w_list.Element.deppersonalinfo_DUMMY$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "deppersonalinfo",
                 "elementid": 8010236,
                 "traversalpath": "deppersonalinfo_DUMMY$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": "",
                 "boxStyle": "",
                 "valueStyle": ""
             },
             "pfm71658_cspfmaction8010233": {
                 "id": "cspfmaction8010233",
                 "label": "deppersonalinfo_d_w_list.Action.Edit_1",
                 "fieldName": "cspfmaction8010233",
                 "prop": "cspfmaction8010233",
                 "elementid": 8010233,
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
                     "sourceId": "8010233",
                     "traversalpath": "deppersonalinfo_d_w_list_Edit_1",
                     "actionDisplayType": "Icon",
                     "objectName": "",
                     "boxStyle": "",
                     "labelStyle": "",
                     "valueStyle": "",
                     "navigationInfo": {
                         "navigationUrl": "deppersonalinfo_Entry_Web",
                         "redirectUrl": "deppersonalinfo_d_w_list",
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
     public associationColumnDefinitions = {}
     public sectionObjectDetails: {
         [objectName: string]: SectionObjectDetail
     } = {
         [this.__deppersonalinfo$tableName]: {
             'groupingColumns': [],
             'isRowClickDisabled': false,
             'dataFetchMode': 'Batch',
             'isExpanded': 'E',
             'isMatrixEnabled': false,
             'isAutoFitEnable': true,
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
     public devWidth = this.platform.width();
     public restrictionRules = [];
     readonly headerHeight = 50;
     readonly rowHeight = 50;
     columnMode = ColumnMode;
     public columnMinWidth = 150;
     public layoutCriteriaQueryConfig = {}
     public layoutCriteriaQuery = '';
     public layoutCriteriaReationalObjectIds = [];
     public isAnyDataFetchPending = false;
     public listenerName;
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
     public isRowClick = true;
     public moreActionInfo = {}

     public draggableGroupingPlugin: any;
     public gridMenuExtension: any;
     public matrixAngularGridInstance: AngularGridInstance;
     public isAnyClickDone = false;
     dataRestrictionIdSet: any;
     modifiedSet: any;
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
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_8010232']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_8010232']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_8010232']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_8010232']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_8010232'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_8010232']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_8010232']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 100,
                 required: true,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_name_8010232'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231']['label']), 'fromEntity'),
             sortable: true,
             type: FieldType.string,

             exportCustomFormatter: CspfmDataExportFormatter,
             exportWithFormatter: true,

             // minWidth: this.columnMinWidth,
             formatter: CspfmDataFormatter,
             queryField: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231']['prop'] + appConstant['customFieldSuffix']['slickgrid'],
             filterable: true,
             filter: {
                 collection: this.slickgridUtils.getLabelValue(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231']['mappingDetails']),

                 enableTranslateLabel: true,
                 model: Filters.multipleSelect
             },
             grouping: < cspfmDataGrouping > {
                 getter: (data) => {
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 100,
                 required: true,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_team_8010231'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_8010236']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_8010236']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_8010236']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_8010236']['label']), 'fromEntity'),
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
                     return this.slickgridUtils.getter(data, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_8010236'])
                 },
                 formatter: (groupingFormatterItem: GroupingFormatterItem) => {
                     return this.slickgridUtils.formatter(groupingFormatterItem, this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_8010236']['label'])
                 },
                 params: {
                     id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_8010236']['id']
                 },
                 collapsed: false
             },
             cssClass: 'left-align',


             params: {
                 isHiddenEnabled: 'N',
                 columnWidth: 30,
                 required: true,
                 pipe: this.cspfmDataDisplay,
                 fieldInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_employeename_8010236'],
                 layoutId: this.layoutId


             }

         }, {
             id: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction8010233']['id'],
             nameKey: lodash.escape(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction8010233']['label'])),
             field: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction8010233']['prop'],
             toolTip: this.slickgridUtils.convertSplCharToEntities(this.translateService.instant(this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction8010233']['label']), 'fromEntity'),
             sortable: false,
             type: FieldType.unknown,

             exportCustomFormatter: CspfmDataExportFormatter,


             // minWidth: this.columnMinWidth,
             formatter: CspfmActionsFormatter,
             columnGroupKey: 'deppersonalinfo_d_w_list.Action.Edit_1',

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
                 actionInfo: this.tableColumnInfo[this.__deppersonalinfo$tableName]['pfm71658_cspfmaction8010233']['actionInfo'],


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
                     divider: true,
                     command: '',
                     positionOrder: 90
                 },
                 {
                     command: "cspfm-groupby",
                     titleKey: "Group-by",
                     iconCssClass: "icon-mat-account_tree",
                     action: (event, callbackArgs) => {
                         this.slickgridUtils.openDraggableGroupingRow(this.onGroupByEnabledObj, this.gridObj, "SearchList");
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
                 columnId: this.tableColumnInfo['pfm71658']['pfm71658_name_8010232']['prop'],
                 direction: 'ASC'
             }],
         },


     };

     clearFilterAppliedField(filterFieldInfoKey: string) {
         if (this.cspfmListFilter.clearFilterAppliedField(this.filterSectionDetail['filterFields'][filterFieldInfoKey], true)) {
             this.applyAction(false);
         }
     }
     applyAction(checkRequiredFields: boolean) {
         if (!this.fetchMethodCalled && !this.onLoadFetch) {
             this.registerRecordChangeListener();
             this.fetchMethodCalled = true;
         }
         this.filterSectionDetail['filterApplyButtonPressed'] = true;
         this.cspfmListFilter.makeQuery(this.filterSectionDetail, 'CouchDB');
         this.filterSectionDetailTemp = JSON.parse(JSON.stringify(this.filterSectionDetail))
         if (!this.filterSectionDetail['isAllRequiredFieldFilled'] && checkRequiredFields) {
             this.appUtilityConfig.showAlert(this, "Please fill the all required fields");
             return
         }
         this.filterSectionDetail['filterPanelExpanded'] = false;
         this.isValidationRequired = true;
         this.filteredResultList = [...[]]
         this.filteredResultListTemp = []

         this.slickgridUtils.clearDataView(this.angularGrid);
         if (checkRequiredFields) {
             this.dataProvider.startLazyLoading(this.listenerName)
         }
         this.pagination['total_rows'] = 0;
         this.resultCount = 0;
         this.batchWiseIdArray = [];
         this.batchWiseIdArrayTemp = [];
         if ((this.layoutDataRestrictionSet.length > 0 && this.layoutDataRestrictionSet[0]['restrictionType'] === "userAssignment") || (this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {
             this.batchWiseIdArray = lodash.chunk(this.dataRestrictionIdSet, this.batchIdLimit);
             this.batchWiseIdArrayTemp = lodash.chunk(this.dataRestrictionIdSet, this.batchIdLimit);
         }
         const reverseHierarchyKeys = Object.keys(this.filterSectionDetail['queryReverseHierarchy']);
         if (!this.onLoadFetch && this.filterSectionDetail['filterAppliedFields'].length === 0) {
             this.listServiceUtils.presentToast("There is no search criteria to apply filter");
             return
         }
         if (reverseHierarchyKeys.length > 0) {
             this.filterFetch('filter');
         } else {
             this.filterResponse();
             this.cspfmListFilter.clearAllFilter(this.filterSectionDetail)
         }
         setTimeout(() => {
             this.listServiceUtils.setWidth();
         }, 250)
         if (this.filterSectionDetail['filterAppliedFields'].length > 0 && !this.onGroupByEnabledObj.onGroupByEnabled) {
             if ($('mat-list').hasClass('cs-top-menu-list')) {
                 $('.cs-fullslick-rowheight').removeClass('cs-tempslickhight_withtop_menu')
             } else {
                 $('.cs-fullslick-rowheight').removeClass('cs-tempslickhight')
             }
         } else {
             if ($('mat-list').hasClass('cs-top-menu-list')) {
                 $('.cs-fullslick-rowheight').addClass('cs-tempslickhight_withtop_menu')
             } else {
                 $('.cs-fullslick-rowheight').addClass('cs-tempslickhight')
             }
         }
     }
     closeClick(filterFieldInfo: FilterFieldInfo, index ? ) {
         if (index) {
             filterFieldInfo['fieldValue'][index] = '';
         } else {
             filterFieldInfo['fieldValue'] = '';
         }
     }



     clearMessageConfirmAlert(startOverAllFetch ? ) {
         if (this.isLoading) {
             this.listServiceUtils.presentToast("Another process is running, please wait");
             return
         }
         if (this.filterSectionDetail['filterPanelExpanded'] && this.filterSectionDetail['filterAppliedFields'].length === 0) {
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
                 this.cspfmListFilter.clearFilterValues(this.readonlyApplicableField, this.filterSectionDetail)
                 this.listServiceUtils.presentToast("Filter cleared");
                 return
             }
         }
         const dialogConfig = new MatDialogConfig()
         dialogConfig.data = {
             title: 'Are you sure want to Clear this filter fields value?',
             buttonInfo: [{
                     "name": "No"
                 },
                 {
                     "name": "Yes",
                     "handler": () => {
                         console.log("Handler called")
                         this.isValidationRequired = false;
                         this.cspfmListFilter.clearAllFilter(this.filterSectionDetail)
                         this.filterSectionDetailTemp = JSON.parse(JSON.stringify(this.filterSectionDetail))
                         if (!this.onLoadFetch) {
                             this.unregisterRecordChangeListenerCall()
                             this.filteredResultList = [...[]]
                             this.filterSectionDetail['filterApplied'] = false
                             this.filterSectionDetail['filterPanelExpanded'] = false;
                             if (startOverAllFetch) {
                                 this.initiateFetch()
                             } else {
                                 this.filterAction();
                             }
                             return
                         }
                         this.applyAction(false);
                     }
                 }
             ],
             parentContext: this,
             type: "Alert"
         };
         dialogConfig.autoFocus = false
         this.dialog.open(cspfmAlertDialog, dialogConfig);
     }
     async filterAction() {
         if (this.isLoading) {
             this.listServiceUtils.presentToast("Another process is running, please wait");
             return
         }
         if (this.sectionObjectDetails[this.__deppersonalinfo$tableName]['matrixConfig']['displayInfo']['currentMode'] === 'matrix') {
             this.appUtilityConfig.showAlert(this, 'This action is disabled in matrix view mode')
             return
         }
         this.filterSectionDetailTemp['filterApplyButtonPressed'] = false;
         this.filterSectionDetail['filterApplyButtonPressed'] = false;
         if (!this.onlineIndxCreation.isAllSearchIndexCompleted) {
             return
         }
         this.filterSectionDetail['filterPanelExpanded'] = !this.filterSectionDetail['filterPanelExpanded'];
         if (this.filterSectionDetail['filterPanelExpanded']) {
             this.filterSectionDetailTemp['filterPanelExpanded'] = true;
             this.filterSectionDetail = JSON.parse(JSON.stringify(this.filterSectionDetailTemp))
         } else {
             this.filterSectionDetailTemp['filterPanelExpanded'] = false;
             let changes = this.cspfmListFilter.checkChangesAvailable(this.filterSectionDetail, this.filterSectionDetailTemp)
         }
     }
     filterActionForMoreAction() {
         this.filterAction();
     }
     filterResponse(querySelector ? ) {
         let msg = this.listServiceUtils.dataFetchNewMethod('Data_Fetch');

         if (msg === 'success') {
             return;
         } else {
             if (querySelector) {
                 this.filterSectionDetail['filterApplied'] = true;
                 if (this.dataSource === appConstant.pouchDBStaticName) {
                     this.objectHierarchyJSON['options'] = querySelector;
                 } else {
                     this.searchQueryForDesignDoc = querySelector
                 }
                 this.makeQueryAndStartFetch(querySelector);
             } else {
                 this.filterSectionDetail['filterApplied'] = false;
                 if (this.objectHierarchyJSON['options']) {
                     delete this.objectHierarchyJSON['options'];
                 }
                 if (this.dataSource === appConstant.pouchDBStaticName) {
                     this.makeQueryAndStartFetch();
                 } else {
                     let query = "type:" + this.tableName_pfm71658
                     this.searchQueryForDesignDoc = query;
                     this.makeQueryAndStartFetch(query);
                 }
             }
         }
     }
     handleListener(fetchParams, isRelationalObjectsInvolved, relationalObjectsFilterIds ? ) {
         var taskList = [];
         if (Object.keys(this.layoutCriteriaQueryConfig).length > 0 && this.layoutCriteriaQueryConfig['operands']) {
             let filterIds;
             if (isRelationalObjectsInvolved) {
                 filterIds = lodash.flatten(relationalObjectsFilterIds);
             }
             const configObject = {
                 'layoutCriteriaQueryConfig': this.layoutCriteriaQueryConfig,
                 'listCriteriaDataObject': {}
             }
             if ((this.layoutDataRestrictionSet.length > 0 && this.layoutDataRestrictionSet[0]['restrictionType'] === "userAssignment") || (this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {
                 const layoutDataRestrictionSet = {
                     "dataRestrictionSet": this.layoutDataRestrictionSet,
                     "criteriaQueryConfig": this.layoutCriteriaQueryConfig,
                     "junctionDataObjects": {},
                     "searchQuery": "",
                     "objectName": this.__deppersonalinfo$tableName
                 }
                 this.cspfmLookupCriteriaUtils.dataRestrictionFetch(layoutDataRestrictionSet, "list").then(res => {
                     if (isRelationalObjectsInvolved) {
                         let idArrayToFetch = lodash.intersection(res, filterIds)
                         this.checkChangedListenerData(idArrayToFetch);
                     } else {
                         this.checkChangedListenerData(res);
                     }
                 })
             } else {
                 if (this.layoutCriteriaQuery === '') {
                     this.layoutCriteriaQueryConfig['relationalObjectResults'] = this.layoutCriteriaReationalObjectIds;
                     this.layoutCriteriaQuery = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject)
                 }
                 if (this.layoutCriteriaQuery) {
                     fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND ' + this.layoutCriteriaQuery
                 }
                 if (isRelationalObjectsInvolved) {
                     relationalObjectsFilterIds.forEach(idArray => {
                         let batchIdQuery = fetchParams['searchListQuery'] + " AND _id : ( " + idArray.join(" OR ") + " ) "
                         taskList = taskList.concat(this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', batchIdQuery))
                     });
                     Promise.all(taskList).then(results => {
                         let idArrayToFetch = this.liveListenerHandlerUtils.getIdsFromResult(results);
                         this.checkChangedListenerData(idArrayToFetch);
                     }).catch(error => {
                         this.isLoading = false;
                     });
                 } else {
                     this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', fetchParams['searchListQuery']).then(primaryResult => {
                         let idArrayToFetch = this.liveListenerHandlerUtils.getIdsFromResult(primaryResult);
                         this.checkChangedListenerData(idArrayToFetch);
                     });
                 }
             }
         } else {
             if (isRelationalObjectsInvolved) {
                 relationalObjectsFilterIds.forEach(idArray => {
                     let batchIdQuery = fetchParams['searchListQuery'] + " AND _id : ( " + idArray.join(" OR ") + " ) "
                     taskList = taskList.concat(this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', batchIdQuery))
                 });
                 Promise.all(taskList).then(results => {
                     let idArrayToFetch = this.liveListenerHandlerUtils.getIdsFromResult(results);
                     this.checkChangedListenerData(idArrayToFetch);
                 }).catch(error => {
                     this.isLoading = false;
                 });
             } else {
                 this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', fetchParams['searchListQuery']).then(primaryResult => {
                     let idArrayToFetch = this.liveListenerHandlerUtils.getIdsFromResult(primaryResult);
                     this.checkChangedListenerData(idArrayToFetch);
                 });
             }
         }
     }

     checkChangedListenerData(idArrayToFetch) {
         const prefix = this.__deppersonalinfo$tableName + "_2_";
         let filteredResultListIds = this.angularGrid.dataView.getItems().map(getIds => prefix + getIds.id);
         if (idArrayToFetch === undefined || idArrayToFetch.length === 0) {
             const modifiedSetid = this.modifiedSet.map(getIds => getIds.id.includes(prefix) ? getIds.id : prefix + getIds.id)
             filteredResultListIds = lodash.difference(filteredResultListIds, modifiedSetid)
             this.callAddingChangeListerDataBasedOnFetchMode(filteredResultListIds)
         } else {
             const addNewIds = lodash.difference(idArrayToFetch, filteredResultListIds);
             if (addNewIds && addNewIds.length > 0) {
                 filteredResultListIds = [...addNewIds, ...filteredResultListIds];
                 this.callAddingChangeListerDataBasedOnFetchMode(filteredResultListIds);
             } else {
                 this.callAddingChangeListerDataBasedOnFetchMode(filteredResultListIds);
             }
         }
     }
     callAddingChangeListerDataBasedOnFetchMode(idArrayToFetch) {
         if (this.batchWiseIdArray.length === 0 && this.batchWiseIdArrayTemp.length > 0) {
             this.batchWiseIdArray = lodash.flatten(idArrayToFetch);
             this.batchWiseIdArrayTemp = lodash.flatten(idArrayToFetch);
         }
         let addNewIds = [];
         let removeOldIds = [];
         const prefix = this.__deppersonalinfo$tableName + "_2_";
         this.filteredResultList.forEach(record => {
             let id = record.id.includes(prefix) ? record.id : prefix + record.id;
             idArrayToFetch.includes(id) ? addNewIds.push(id) : removeOldIds.push(id);
         });
         if (removeOldIds.length > 0) this.liveListenerHandlerUtils.modifiedBulkDocs(removeOldIds, this.angularGrid, this.__deppersonalinfo$tableName, this.filteredResultList, this.gridSearchRowToggle, this.filterSectionDetail)
         if (idArrayToFetch.length > 0) this.addingChangeListerDataBasedOnFetchMode(idArrayToFetch);
     }


     filterFetch(methodCalledBy: 'filter' | 'listener') {
         let queryReverseHierarchy;
         if (methodCalledBy === 'filter') {
             queryReverseHierarchy = this.filterSectionDetail['queryReverseHierarchy']
         } else {
             queryReverseHierarchy = this.reverseHierarchySet;
         }
         const reverseHierarchyKeys = Object.keys(queryReverseHierarchy);
         let filterReverseHierarchyJSONArray = [];
         const fetchParams = {
             'objectHierarchyJSON': this.objectHierarchyJSON,
             'layoutDataRestrictionSet': this.layoutDataRestrictionSet,
             'dataSource': this.dataSource,
             pagination: {
                 limit: this.pagination['view']['itemCount'],
                 offset: this.pagination['currentPageIndex'] * Number(this.pagination['view']['itemCount']),
                 bookmark: ""
             }
         }
         if (this.isLoading === false && methodCalledBy === 'filter') {
             this.isLoading = true;
         }
         if (reverseHierarchyKeys.length === 1 && reverseHierarchyKeys.indexOf('deppersonalinfo_DUMMY') > -1 && (!queryReverseHierarchy['deppersonalinfo_DUMMY']['options_rollup'])) {
             if (methodCalledBy === 'filter') {
                 if (this.batchWiseIdArray.length > 0 && ((this.layoutDataRestrictionSet.length > 0 && this.layoutDataRestrictionSet[0]['restrictionType'] === "userAssignment") || (this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) && this.dataFetchMode === 'OnClickBatch') {
                     let taskList = [];
                     let searchListQuery = queryReverseHierarchy['deppersonalinfo_DUMMY']['options'];
                     fetchParams['searchListQuery'] = searchListQuery;
                     this.batchWiseIdArray.forEach(idArray => {
                         if (Array.isArray(idArray)) {
                             let batchIdQuery = searchListQuery + " AND _id : ( " + idArray.join(" OR ") + " ) "
                             taskList.push(this.dataProvider.fetchDataFromDataSource(fetchParams, 'filter', batchIdQuery))
                         }
                     });
                     Promise.all(taskList).then(res => {
                         this.batchWiseIdArray = [];
                         res.forEach(item => {
                             if (item && item['records'] && item['records'].length > 0) {
                                 item['records'].forEach(idItem => {
                                     this.batchWiseIdArray.push(idItem['id']);
                                 });
                             }
                         });
                         this.totalRecords = this.batchWiseIdArray.length;
                         this.filterResponse(searchListQuery);
                     }).catch(error => {
                         this.isLoading = false;
                     });
                 } else if (this.batchWiseIdArray.length === 0 && ((this.layoutDataRestrictionSet.length > 0 && this.layoutDataRestrictionSet[0]['restrictionType'] === "userAssignment") || (this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0))) {
                     this.filterResponse(queryReverseHierarchy['deppersonalinfo_DUMMY']['options'] + ' AND _id : ( null )');
                 } else {
                     this.filterResponse(queryReverseHierarchy['deppersonalinfo_DUMMY']['options']);
                 }
             } else if (methodCalledBy === 'listener') {
                 fetchParams['searchListQuery'] = queryReverseHierarchy['deppersonalinfo_DUMMY']['options']
                 if (queryReverseHierarchy['deppersonalinfo_DUMMY']['modifiedId']) {
                     fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + ' AND id:' + queryReverseHierarchy['deppersonalinfo_DUMMY']['modifiedId'];
                 }
                 this.handleListener(fetchParams, false)
             }
         } else {
             this.dbService.getObjectIdsBasedOnFilterQuery(queryReverseHierarchy, this.__deppersonalinfo$tableName).then(result => {
                 let searchListQuery = ""
                 if (Array.isArray(result) && result && result.length > 0) {
                     if (reverseHierarchyKeys.indexOf('deppersonalinfo_DUMMY') > -1 && queryReverseHierarchy['deppersonalinfo_DUMMY'] && queryReverseHierarchy['deppersonalinfo_DUMMY']['options']) {
                         searchListQuery = queryReverseHierarchy['deppersonalinfo_DUMMY']['options'];
                     } else {
                         searchListQuery = "type : " + this.__deppersonalinfo$tableName;
                     }
                     let tempResult = [];
                     if (methodCalledBy === 'filter' && ((this.layoutDataRestrictionSet.length > 0 && this.layoutDataRestrictionSet[0]['restrictionType'] === "userAssignment") || (this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0))) {
                         tempResult = lodash.intersection(this.dataRestrictionIdSet, result)
                     } else {
                         tempResult = result
                     }
                     if (methodCalledBy === 'filter' && tempResult.length > 0) {
                         this.batchWiseIdArray = lodash.chunk(tempResult, this.batchIdLimit);
                         this.batchWiseIdArrayTemp = lodash.chunk(tempResult, this.batchIdLimit);
                     } else if (methodCalledBy === 'listener') {
                         result = lodash.chunk(tempResult, this.batchIdLimit);
                     } else {
                         searchListQuery = "type : " + this.__deppersonalinfo$tableName + " AND _id : ( null )";
                     }
                     if (this.dataFetchMode === 'OnClickBatch' || methodCalledBy === 'listener') {
                         var taskList = [];
                         fetchParams['searchListQuery'] = searchListQuery;
                         if (methodCalledBy === 'filter') {
                             this.batchWiseIdArray.forEach(idArray => {
                                 if (Array.isArray(idArray)) {
                                     let batchIdQuery = searchListQuery + " AND _id : ( " + idArray.join(" OR ") + " ) "
                                     taskList.push(this.dataProvider.fetchDataFromDataSource(fetchParams, 'filter', batchIdQuery))
                                 }
                             });
                             Promise.all(taskList).then(res => {
                                 this.batchWiseIdArray = [];
                                 res.forEach(item => {
                                     if (item && item['rows'] && item['rows'].length > 0) {
                                         item['rows'].forEach(idItem => {
                                             this.batchWiseIdArray.push(idItem['id']);
                                         });
                                     }
                                 });
                                 this.totalRecords = this.batchWiseIdArray.length;
                                 this.filterResponse(searchListQuery);
                             }).catch(error => {
                                 this.isLoading = false;
                             });
                         } else if (methodCalledBy === 'listener') {
                             this.handleListener(fetchParams, true, result)
                         }
                     } else {
                         this.filterResponse(searchListQuery);
                     }
                 } else {
                     if (methodCalledBy === 'filter') {
                         this.batchWiseIdArray = [];
                         this.batchWiseIdArrayTemp = [];
                         if (reverseHierarchyKeys.indexOf('deppersonalinfo_DUMMY') > -1 && queryReverseHierarchy['deppersonalinfo_DUMMY'] && queryReverseHierarchy['deppersonalinfo_DUMMY']['options']) {
                             searchListQuery = queryReverseHierarchy['deppersonalinfo_DUMMY']['options'] + "AND _id : ( null )";
                         } else {
                             searchListQuery = "type : " + this.__deppersonalinfo$tableName + "AND _id : (null)";
                         }
                         this.filterResponse(searchListQuery);
                     } else if (methodCalledBy === 'listener') {
                         this.checkChangedListenerData(result);
                     }
                 }
                 this.isLoading = false;
             }).catch(error => {
                 this.isLoading = false;
             });
         }
     }
     async fetchAllDataWeb(objectHierarchyJSON, searchQuery ? ,
         paginationAction ? : PaginationAction, paginationClickFlag ? ) {
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


         return this.dataProvider.fetchDataFromDataSource(fetchParams).then(res => {
             this.isLoading = false;
             this.isSkeletonLoading = false;

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
                     res['records'] = this.cspfmCustomFieldProvider.makeSlickGridCustomFields(res['records'], this.columnDefinitions[this.__deppersonalinfo$tableName])
                     if (this.dataFetchMode === 'OnClickBatch') {
                         this.updateDataFetchStatus(false)
                         this.filteredResultList = [...res['records']]
                         this.isLoading = false;
                         if (this.isAnyDataFetchPending) {
                             this.isAnyDataFetchPending = false;
                             return this.fetchAllDataWeb(this.objectHierarchyJSON, searchQuery, 'current_page_refresh');
                         }
                         this.itemCount = Number(this.pagination['view']['itemCount']);
                         if (this.batchWiseIdArray.length > 0 && !this.batchWiseIdArray[this.pagination['currentPageIndex'] + 1]) {
                             this.pagination['nextBadgeDisabled'] = true
                         }
                         if (this.pagination['currentPageIndex'] > 0 && this.pagination['nextBadgeDisabled']) {
                             let rowsCount = this.pagination['total_rows'] - (this.pagination['currentPageIndex'] * Number(this.pagination['view']['itemCount']))
                             this.slickgridUtils.slickgridHeightChange(rowsCount, true, this.filteredResultList, this.gridSearchRowToggle, this.angularGrid, this.filterSectionDetail)
                         } else {
                             this.slickgridUtils.slickgridHeightChange(this.itemCount, true, this.filteredResultList, this.gridSearchRowToggle, this.angularGrid, this.filterSectionDetail)
                         }
                         this.angularGrid.resizerService.resizeGrid();
                         return {
                             'status': res['status'],
                             'message': res['message'],
                             'paginationAction': paginationAction,
                             'records': this.filteredResultList
                         }
                     } else if (this.dataFetchMode === 'Batch') {
                         this.filteredResultList = [...this.filteredResultList, ...res['records']];
                         this.slickgridUtils.slickgridHeightChange(this.angularGrid.paginationService.itemsPerPage, true, this.filteredResultList, this.gridSearchRowToggle, this.angularGrid, this.filterSectionDetail)
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
                             this.filteredEventTriggeredList = []
                             this.eventsTriggeredList = []
                             this.slickgridResultList = [];
                             this.filteredResultList = [];
                             this.resultList = [];
                         }
                     }
                     return {
                         'status': res['status'],
                         'message': res['message'],
                         'paginationAction': paginationAction,
                         'records': this.filteredResultList
                     }
                 }
             } else {
                 this.updateDataFetchStatus(false)
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
         } else {

             this.slickgridUtils.onItemTap(data, "/menu/deppersonalinfo_d_w_hl_list", "/menu/deppersonalinfo_d_w_list", false, [], this.inlineEditBoolObj);
         }
     }
     decidePopupOrNavigation(actionInfo, data) {
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
                 columns[cell]['params']['cspfmEditorType'] && columns[cell]['params']['cspfmEditorType'] === 'LOOKUP'))) {
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
                         this.slickgridUtils.onItemTap(data, "/menu/deppersonalinfo_d_w_hl_list", "/menu/deppersonalinfo_d_w_list", false, [], this.inlineEditBoolObj)
                     }
                     this.slickGridItemClickCount = 0;
                 }, 250);
             }
         }
     }

     angularGridReady(angularGrid: AngularGridInstance) {
         this.angularGrid = angularGrid;
         this.slickgridUtils.draggableGroupingExtension(this.angularGrid, this.gridOptions);
         this.slickgridUtils.clearDataView(angularGrid);
         this.gridMenuExtension = this.angularGrid.extensionService.getExtensionByName(ExtensionName.gridMenu)
         this.gridObj = angularGrid.slickGrid;
         this.gridObj.setHeaderRowVisibility(false);

         this.angularGrid.filterService.onSearchChange.subscribe((e) => {
             if (!this.filterSectionDetail['filterPanelExpanded'] && this.filterSectionDetail['filterApplied'] && this.filterSectionDetail['filterAppliedFields'].length > 0) {
                 if (this.pagination['enabled']) {
                     this.slickgridUtils.slickgridHeightChange(Number(this.pagination['view']['itemCount']), false, this.filteredResultList, this.gridSearchRowToggle, this.angularGrid, this.filterSectionDetail)
                 } else {
                     this.slickgridUtils.slickgridHeightChange(this.angularGrid.dataView.getLength(), false, this.filteredResultList, this.gridSearchRowToggle, this.angularGrid, this.filterSectionDetail)
                 }
                 this.angularGrid.resizerService.resizeGrid();
             }
         })
         this.gridObj['cspfm_grid_custom_data'] = {
             "page_title_key": "deppersonalinfo_d_w_list.Layout.deppersonalinfo_d_w_list",
             "angular_grid_excel_export_service_instance": angularGrid.excelExportService,
             "angular_grid_export_service_instance": angularGrid.exportService,
             "isPaginationEnabled": this.gridOptions['enablePagination']
         }
         this.slickgridUtils.onPaginationCountChanged(false, this.angularGrid, this.onGroupByEnabledObj, this.pagination, this.filterSectionDetail, this.filteredResultList, this.gridSearchRowToggle)
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
         this.gridObj.onBeforeEditCell.subscribe((e, args) => {
             return !this.isLoading;
         });
         if (this.gridObj.getCanvasWidth() < window.innerWidth) {
             this.gridObj.setOptions({
                 enableAutoSizeColumns: true,
                 autoFitColumnsOnFirstLoad: true,
             })
         }
         if (this.groupingColumns.length > 0) {
             this.slickgridUtils.setInitialGrouping(this.tableName_pfm71658, this.gridObj, this.groupingColumns, this.tableColumnInfo, this.draggableGroupingPlugin)
             this.onGroupByEnabledObj.onGroupByEnabled = true
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
     public filterFieldTypeAndOperator;
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
     flatpickrOnReady(filterFieldInfo: FilterFieldInfo, event, index ? ) {
         var format;
         this.flatpickerInstances[this.listServiceUtils.getFlatpickrInstanceKeyName(filterFieldInfo, index)] = event.instance;
         event.instance['params'] = {
             'field': index ? filterFieldInfo['objectName'] + '_' + filterFieldInfo['fieldName'] + '_' + index : filterFieldInfo['objectName'] + '_' + filterFieldInfo['fieldName']
         }
         event.instance.config.formatDate = this.appUtilityConfig.formatDate
         event.instance.config.parseDate = this.appUtilityConfig.parseDate
         event.instance.config.altInput = true
         if (event.instance.config.enableTime) {
             format = this.appUtilityConfig.userDateTimePickerFormat;
             event.instance.now = new Date(new Date().toLocaleString('en-US', {
                 timeZone: this.appUtilityConfig.userTimeZone
             }));
         } else {
             format = this.appUtilityConfig.userDatePickerFormat;
             event.instance.now = new Date(new Date().toLocaleString('en-US', {
                 timeZone: this.appUtilityConfig.orgTimeZone
             }));
         }
         event.instance.config.dateFormat = format
         event.instance.config.altFormat = format
         event.instance.config.allowInput = true
         var ngModelValue = filterFieldInfo['fieldValue']
         var params = event.instance.params
         if (ngModelValue !== '') {
             if (index) {
                 event.instance.setDate(moment(ngModelValue[index], format).toDate());
             } else {
                 event.instance.setDate(moment(ngModelValue['fieldValue'], format).toDate());
             }
         } else {
             params['initialValue'] = ""
             event.instance.clear()
         }
         event.instance.redraw();
     }
     flatpickrOnOpen(filterFieldInfo: FilterFieldInfo, event, index ? ) {
         var ngModelValue;
         this.flatpickrInstance = this.flatpickerInstances[this.listServiceUtils.getFlatpickrInstanceKeyName(filterFieldInfo, index)];
         if (index) {
             ngModelValue = filterFieldInfo['fieldValue'][index];
         } else {
             ngModelValue = filterFieldInfo['fieldValue'];
         }
         if (ngModelValue !== '') {
             var format = (event.instance.config.enableTime) ? this.appUtilityConfig.userDateTimePickerFormat : this.appUtilityConfig.userDatePickerFormat;
             var date = moment(ngModelValue, format).toDate();
             event.instance.setDate(date);
             event.instance.params['initialValue'] = moment(date).format(format);
         } else {
             event.instance.params['initialValue'] = "";
             event.instance.clear();
         }
     }
     flatpickrInputElementEvents(event, filterFieldInfo: FilterFieldInfo, index ? ) {
         var type = event.type;
         const flatpickerInstance = this.flatpickerInstances[this.listServiceUtils.getFlatpickrInstanceKeyName(filterFieldInfo, index)];
         if (type === "click" || type === "focus") {
             setTimeout(() => {
                 flatpickerInstance.open()
             }, 0);
         } else if (type === "keyup" && event.key && event.key !== "Tab") {
             flatpickerInstance.close()
         }
     }

     flatpickrOnClose(filterFieldInfo: FilterFieldInfo, event, index ? ) {
         if (event.instance['params']['field'] === this.flatpickrInstance['params']['field']) {
             this.flatpickrInstance = undefined
         }
     }
     flatpickrOnChange(filterFieldInfo: FilterFieldInfo, event, index ? ) {
         if (index) {
             filterFieldInfo['fieldValue'][index] = event.dateString
         } else {
             filterFieldInfo['fieldValue'] = event.dateString
         }
     }



     async initiateFetch() {
         if (!this.onlineIndxCreation.isAllSearchIndexCompleted) {
             return
         }
         this.fetchMethodCalled = true
         this.isLoading = true

         this.dataProvider.startLazyLoading(this.listenerName)
         if ((this.layoutDataRestrictionSet.length > 0 && this.layoutDataRestrictionSet[0]['restrictionType'] === "userAssignment") || (this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {
             const layoutDataRestrictionSet = {
                 "dataRestrictionSet": this.layoutDataRestrictionSet,
                 "criteriaQueryConfig": this.layoutCriteriaQueryConfig,
                 "junctionDataObjects": {},
                 "searchQuery": "",
                 "objectName": this.__deppersonalinfo$tableName
             }
             this.cspfmLookupCriteriaUtils.dataRestrictionFetch(layoutDataRestrictionSet, "list").then(result => {
                 this.dataRestrictionIdSet = result;
                 this.batchWiseIdArray = lodash.chunk(this.dataRestrictionIdSet, this.batchIdLimit);
                 this.batchWiseIdArrayTemp = lodash.chunk(this.dataRestrictionIdSet, this.batchIdLimit);
                 if (this.dataRestrictionIdSet.length > 0) {
                     if (Object.keys(this.layoutCriteriaQueryConfig).length > 0 && !(this.layoutCriteriaQueryConfig['relationalObjects'] && this.layoutCriteriaQueryConfig['relationalObjects'].length > 0)) {
                         this.makeQueryAndStartFetch()
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
             this.makeQueryAndStartFetch()
         } else {
             this.slickgridResultList = [];
             this.filteredResultList = [];
             this.filteredResultListTemp = [];
             this.fetchAllDataWeb(this.objectHierarchyJSON).then(result => {
                 this.handleResult(result)
             });
         }
     }


     async makeQueryAndStartFetch(searchQuery ? , paginationAction ? : PaginationAction, paginationClickFlag ? ) {
         this.dataProvider.startLazyLoading(this.listenerName)
         const configObject = {
             'layoutCriteriaQueryConfig': this.layoutCriteriaQueryConfig,
             'listCriteriaDataObject': {}
         }
         if (this.layoutCriteriaQuery === '') {
             this.layoutCriteriaQueryConfig['relationalObjectResults'] = this.layoutCriteriaReationalObjectIds;
             this.layoutCriteriaQuery = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject)
         }
         if (this.batchWiseIdArray.length > 0 && this.dataFetchMode === 'OnClickBatch' && this.layoutCriteriaQuery !== '') {
             const fetchParams = {
                 "objectName": this.__deppersonalinfo$tableName,
                 "searchListQuery": this.layoutCriteriaQuery
             }
             await this.dataProvider.primaryObjDataFetch(fetchParams, this.batchWiseIdArray).then((res => {
                 this.batchWiseIdArray = lodash.chunk(res, this.batchIdLimit);
                 return this.batchWiseIdArray
             }))
         }
         this.fetchAllDataWeb(this.objectHierarchyJSON, searchQuery, paginationAction, paginationClickFlag).then(result => {
             this.handleResult(result)
         })
     }
     async handleResult(result) {

         this.dataProvider.finishLazyLoading(this.listenerName, result['records'])
         this.angularGrid["slickGrid"]["isDataFetching"] = false;
         this.processPendingListeners();
         if (result && result['status'] && result['records'] && (result['status'] === 'SUCCESS' || result['records'].length > 0)) {
             this.slickgridUtils.slickgridHeightChange(this.angularGrid.paginationService.itemsPerPage, true, this.filteredResultList, this.gridSearchRowToggle, this.angularGrid, this.filterSectionDetail)
             this.angularGrid.resizerService.resizeGrid();
             this.batchWiseIdArray = [...this.batchWiseIdArrayTemp];
             this.resultCount = 0;
             if (this.dataFetchMode === "Batch") {
                 this.pagination['view']['itemCount'] = this.itemsPerPageConfigured.toString();
             }
             this.errorMessageToDisplay = 'No Records';
             let consolidatedItems = [...this.filteredResultList, ...result['records']]
             this.filteredResultList = lodash.uniqBy(consolidatedItems, "id");

             this.slickgridResultList = this.filteredResultList;
             this.gridObj.reRenderColumns(true)
             this.angularGrid["slickGrid"]['isAutoFitEnable'] = this.sectionObjectDetails[this.__deppersonalinfo$tableName].isAutoFitEnable
             setTimeout(() => {
                 this.slickgridUtils.resizeColumnsByCellContent(this.angularGrid)
             }, 100);
             this.gridObj.invalidate();
             this.isLoading = false;

         } else {
             this.batchWiseIdArray = [...this.batchWiseIdArrayTemp];
             this.resultCount = 0;
             if (!result['paginationAction']) {
                 this.filteredEventTriggeredList = []
                 this.eventsTriggeredList = []
                 this.slickgridResultList = [];
                 this.filteredResultList = [];
                 this.resultList = [];
             }
             this.errorMessageToDisplay = result['message'];

             if (this.errorMessageToDisplay === "No internet") {
                 this.appUtilityConfig.presentNoInternetToast(this);
             }

             this.slickgridResultList = this.filteredResultList;
             this.gridObj.reRenderColumns(true)
             this.gridObj.invalidate();
             this.isLoading = false;

         }
         if (this.changeRef && !this.changeRef['destroyed']) {
             this.changeRef.detectChanges();
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
                 if (this.dataSource !== 'JsonDB') {
                     let slickGrid: SlickGrid = this.angularGrid.slickGrid;
                     if (slickGrid['isDataFetching']) {
                         this.pendingListenerData[modified['id']] = modified;
                         return;
                     }
                     this.processListenerData(modified)
                 }

             } catch (error) {
                 console.log(error);
             }
         });
     }

     processListenerData(modified) {
         let modifiedObjectType;


         let layoutInfo = {
             "gridData": this.slickgridUtils.getGridData(this.angularGrid),
             "formulaAndRollupFieldInfo": this.formulaAndRollupFieldInfo
         }
         if (!(modified['doc']['_id'].includes('rollup') || modified['doc']['_id'].includes('formula'))) {
             if (this.layoutCriteriaQueryConfig['modifiedSet']) {
                 this.layoutCriteriaQueryConfig['modifiedSet']['type'] = modified['doc']['data']['type'];
                 this.layoutCriteriaQueryConfig['modifiedSet']['id'] = modified['doc']['_id'];
             }
         }
         let idArrayToFetch = this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.SECTION_FETCH, this.dependentObjectList, modified, layoutInfo)
         this.modifiedSet = idArrayToFetch;
         const fetchParams = {
             'objectHierarchyJSON': this.objectHierarchyJSON,
             'layoutDataRestrictionSet': this.layoutDataRestrictionSet,
             'dataSource': this.dataSource,
             pagination: {
                 limit: this.pagination['view']['itemCount'],
                 offset: this.pagination['currentPageIndex'] * Number(this.pagination['view']['itemCount']),
                 bookmark: ""
             },
             "searchListQuery": "type: " + this.__deppersonalinfo$tableName
         }
         if (modified["doc"]["data"]["type"].includes('userAssignment') && this.layoutDataRestrictionSet.length > 0 && this.layoutDataRestrictionSet[0]['restrictionType'] === 'userAssignment') {
             if (!this.appUtilityConfig.verifyUser(modified["doc"]["data"])) {
                 return false;
             }
             if (this.batchWiseIdArray.includes(modified["doc"]["data"]['reference_id']) && !modified["doc"]["data"]['isActive']) {
                 const removeOldIds = [modified["doc"]["data"]['reference_id']]
                 if (removeOldIds && removeOldIds.length > 0) {
                     if (removeOldIds.length > 0) this.liveListenerHandlerUtils.modifiedBulkDocs(removeOldIds, this.angularGrid, this.__deppersonalinfo$tableName, this.filteredResultList, this.gridSearchRowToggle, this.filterSectionDetail)
                 }
             }
             if (!this.batchWiseIdArray.includes(modified["doc"]["data"]['reference_id']) && modified["doc"]["data"]['isActive']) {
                 if (this.batchWiseIdArray && this.batchWiseIdArray.length > 0 && this.filterSectionDetail['filterApplied']) {
                     this.batchWiseIdArray = lodash.flatten(this.batchWiseIdArray);
                     this.filterFetch('listener');
                 } else {
                     if (this.layoutCriteriaQueryConfig) {
                         this.batchWiseIdArray = [];
                         this.handleListener(fetchParams, false)
                     } else {
                         this.fetchModifiedRec(modified["doc"]["data"]['reference_id']);
                     }
                 }
             }
         } else if (!modified["doc"]["data"]["type"].includes('userAssignment')) {
             modifiedObjectType = this.listServiceUtils.reverseHierarchySetForInerLevel(this.objectHierarchyJSON, modified['doc']['data']['type'])
             let layoutInfo = {
                 "gridData": this.slickgridUtils.getGridData(this.angularGrid),
                 "formulaAndRollupFieldInfo": this.formulaAndRollupFieldInfo
             }
             let idArrayToFetch = this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.SECTION_FETCH, this.dependentObjectList, modified, layoutInfo)
             this.modifiedSet = idArrayToFetch;
             idArrayToFetch = lodash.map(idArrayToFetch, 'id');
             if (this.batchWiseIdArray && this.batchWiseIdArray.length > 0 && this.filterSectionDetail['filterApplied']) {
                 this.batchWiseIdArray = lodash.flatten(this.batchWiseIdArray);
                 if (this.filterSectionDetail.reverseHierarchy[modifiedObjectType.hierarchyJson.rootPath]) {
                     let filterHierarchyJson = this.filterSectionDetail.reverseHierarchy[modifiedObjectType.hierarchyJson.rootPath]
                     if (filterHierarchyJson.options !== '') {
                         let reverseHierarchySet = {}
                         reverseHierarchySet[modifiedObjectType.hierarchyJson.rootPath] = JSON.parse(JSON.stringify(filterHierarchyJson))
                         reverseHierarchySet[modifiedObjectType.hierarchyJson.rootPath]['modifiedId'] = modified['doc']['_id'];
                         this.reverseHierarchySet = reverseHierarchySet
                         this.filterFetch('listener');
                     } else {
                         if (this.modifiedSet && this.modifiedSet.length > 0) {
                             const prefix = this.__deppersonalinfo$tableName + "_2_";
                             const queryModifiedIds = this.modifiedSet.map(getIds => getIds.id.includes(prefix) ? getIds.id : prefix + getIds.id)
                             fetchParams['searchListQuery'] = "type: " + this.__deppersonalinfo$tableName + " AND _id : ( " + queryModifiedIds.join(" OR ") + " ) "
                         } else if (modifiedObjectType['objectType'] === 'PRIMARY') {
                             if (!(modified['doc']['_id'].includes('rollup') || modified['doc']['_id'].includes('formula'))) {
                                 fetchParams['searchListQuery'] = "type: " + this.__deppersonalinfo$tableName + " AND _id: " + modified['doc']['_id'];
                             }
                         }
                         this.handleListener(fetchParams, false)
                     }
                 }
             } else if (idArrayToFetch.length > 0) {
                 if (this.modifiedSet && this.modifiedSet.length > 0) {
                     const prefix = this.__deppersonalinfo$tableName + "_2_";
                     const queryModifiedIds = this.modifiedSet.map(getIds => getIds.id.includes(prefix) ? getIds.id : prefix + getIds.id)
                     fetchParams['searchListQuery'] = "type: " + this.__deppersonalinfo$tableName + " AND _id : ( " + queryModifiedIds.join(" OR ") + " ) "
                 } else if (modifiedObjectType['objectType'] === 'PRIMARY') {
                     if (!(modified['doc']['_id'].includes('rollup') || modified['doc']['_id'].includes('formula'))) {
                         fetchParams['searchListQuery'] = "type: " + this.__deppersonalinfo$tableName + " AND _id: " + modified['doc']['_id'];
                     }
                 }
                 if (Object.keys(this.layoutCriteriaQueryConfig).length > 0 && this.layoutCriteriaQueryConfig['operands']) {
                     this.batchWiseIdArray = lodash.flatten(this.batchWiseIdArray);
                 }
                 this.handleListener(fetchParams, false)
             } else if (this.searchQueryForDesignDoc.includes(" AND _id: ( )")) {
                 this.searchQueryForDesignDoc = this.searchQueryForDesignDoc.replace(" AND _id: ( )", "");
                 this.filterFetch('listener');
             } else {
                 this.batchWiseIdArray = lodash.flatten(this.batchWiseIdArray);
                 this.handleListener(fetchParams, false)
             }
         }
     }

     public reportInput = {};
     public printInput = {};


     addingChangeListerDataBasedOnFetchMode(formattedId) {
         let addNewIds;
         let removeOldIds;
         let updateIds;
         const prefix = this.__deppersonalinfo$tableName + "_2_";
         if (this.batchWiseIdArray && this.batchWiseIdArray.length > 0) {
             if (formattedId.length > 0) {
                 addNewIds = lodash.difference(formattedId, this.batchWiseIdArray);
                 removeOldIds = lodash.difference(this.batchWiseIdArray, formattedId);
                 updateIds = this.modifiedSet.map(getIds => getIds.id.includes(prefix) ? getIds.id : prefix + getIds.id);
                 updateIds = lodash.intersection(updateIds, formattedId);
                 if (removeOldIds && removeOldIds.length > 0) {
                     this.batchWiseIdArray = [...lodash.difference(this.batchWiseIdArray, removeOldIds)];
                 }
                 if (addNewIds && addNewIds.length > 0) {
                     this.batchWiseIdArray = [...this.batchWiseIdArray, ...addNewIds];
                 }
             }
             this.batchWiseIdArrayTemp = [...this.batchWiseIdArray];
             if (this.batchWiseIdArray.length === 0) {
                 this.filteredResultList = [...[]]
                 this.filteredResultListTemp = [];
                 this.pagination['total_rows'] = 0;
                 this.resultCount = 0;
                 if (!this.searchQueryForDesignDoc.includes(" AND _id: ( )")) {
                     this.searchQueryForDesignDoc = this.searchQueryForDesignDoc + " AND _id: ( )"
                 } else {
                     this.searchQueryForDesignDoc = this.searchQueryForDesignDoc.replace(" AND _id: ( )", "");
                 }
             }
         } else {
             if (formattedId.length > 0) {
                 let filteredResultListIds = this.filteredResultList.map(getIds => prefix + getIds.id);
                 addNewIds = lodash.difference(formattedId, filteredResultListIds);
                 removeOldIds = lodash.difference(filteredResultListIds, formattedId);
                 updateIds = this.modifiedSet.map(x => x.id.includes(prefix) ? x.id : prefix + x.id)
                 updateIds = lodash.intersection(updateIds, formattedId);
             }
         }
         if (this.dataFetchMode === 'OnClickBatch') {
             if (this.batchWiseIdArray.length > 0) {
                 this.totalRecords = this.batchWiseIdArray.length;
                 this.batchWiseIdArray = lodash.chunk(lodash.flatten(this.batchWiseIdArray), Number(this.pagination['view']['itemCount']));
                 this.batchWiseIdArrayTemp = lodash.chunk(lodash.flatten(this.batchWiseIdArray), Number(this.pagination['view']['itemCount']));
             }
             if (this.isLoading) {
                 this.isAnyDataFetchPending = true;
             } else {
                 this.fetchAllDataWeb(this.objectHierarchyJSON, this.searchQueryForDesignDoc, 'current_page_refresh');
             }
         } else {
             if (this.batchWiseIdArray.length > 0 || addNewIds && addNewIds.length > 0 || removeOldIds && removeOldIds.length > 0) {
                 this.batchWiseIdArray = lodash.chunk(lodash.flatten(this.batchWiseIdArray), this.batchIdLimit);
                 this.batchWiseIdArrayTemp = lodash.chunk(lodash.flatten(this.batchWiseIdArray), this.batchIdLimit);
             }
             if (removeOldIds && removeOldIds.length > 0) {
                 this.liveListenerHandlerUtils.modifiedBulkDocs(removeOldIds, this.angularGrid, this.__deppersonalinfo$tableName, this.filteredResultList, this.gridSearchRowToggle, this.filterSectionDetail);
             } else if (addNewIds && addNewIds.length > 0) {
                 if (addNewIds.length === 1) {
                     this.fetchModifiedRec(addNewIds[0]);
                 } else {
                     this.fetchListenedRecords(addNewIds);
                 }
             } else if (updateIds && updateIds.length > 0) {
                 if (updateIds.length === 1) {
                     this.fetchModifiedRec(updateIds[0]);
                 } else {
                     this.fetchListenedRecords(updateIds);
                 }
             }
         }
     }


     fetchListenedRecords(idArrayToFetch) {
         const objHierarchyJSON = JSON.parse(JSON.stringify(this.objectHierarchyJSON));

         const fetchParams = {
             'objectHierarchyJSON': objHierarchyJSON,
             'layoutDataRestrictionSet': this.layoutDataRestrictionSet,
             'dataSource': this.dataSource
         }
         let taskList = []
         taskList = this.recursiveMethodForModifiedRecord(idArrayToFetch, fetchParams, taskList);

         Promise.all(taskList).then(result => {
             let finalResult = []
             result.forEach(element => {
                 finalResult = [...finalResult, ...element]
             });
             this.liveListenerHandlerUtils.upsertModifiedData(finalResult, this.angularGrid, this.columnDefinitions, this.__deppersonalinfo$tableName, this.sectionObjectDetails, this.isLoading, this.dataSource, this.filteredResultList, this.gridSearchRowToggle, this.filterSectionDetail);
         })
     }
     recursiveMethodForModifiedRecord(idArrayToFetch, fetchParams, taskList) {
         if (idArrayToFetch.length > 1000) {
             let idArrayForProcessing = idArrayToFetch.splice(0, 1000);
             taskList.push(this.fetchByBulkIds(fetchParams, idArrayForProcessing));
             this.recursiveMethodForModifiedRecord(idArrayToFetch, fetchParams, taskList);
         } else {
             taskList.push(this.fetchByBulkIds(fetchParams, idArrayToFetch));
         }
         return taskList;
     }
     fetchByBulkIds(queryParam, idArrayToFetch) {
         let formattedId = idArrayToFetch.map(id => {
             if (id.includes("pfm")) {
                 return id;
             } else {
                 return this.tableName_pfm71658 + "_2_" + id;
             }
         }).join(" ");
         if (this.searchQueryForDesignDoc) {
             queryParam['searchListQuery'] = this.searchQueryForDesignDoc + " AND id:" + "(" + formattedId + ")";
         } else {
             queryParam['searchListQuery'] = "type:" + this.tableName_pfm71658 + " AND id:" + "(" + formattedId + ")";
         }
         return this.dataProvider.fetchDataFromDataSource(queryParam).then(result => {
             if (result["status"] !== "SUCCESS") {
                 this.errorMessageToDisplay = result["message"];
                 return;
             }
             if (result['records'].length === 0) {
                 this.liveListenerHandlerUtils.modifiedBulkDocs(idArrayToFetch, this.angularGrid, this.__deppersonalinfo$tableName, this.filteredResultList, this.gridSearchRowToggle, this.filterSectionDetail)
                 return
             }
             this.liveListenerHandlerUtils.upsertModifiedData(result['records'], this.angularGrid, this.columnDefinitions, this.__deppersonalinfo$tableName, this.sectionObjectDetails, this.isLoading, this.dataSource, this.filteredResultList, this.gridSearchRowToggle, this.filterSectionDetail);
             return result['records'];
         }).catch(error => {
             console.log(error)
         })
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
         this.unregisterRecordChangeListenerCall()
         this.slickgridUtils.flatpickerAddRemove(this.layoutId, 'remove')
     }

     unregisterRecordChangeListenerCall() {
         if (this.fetchMethodCalled) {
             this.fetchMethodCalled = false;
             this.liveListenerHandlerUtils.unregisterRecordChangeListener(this.dependentObjectList, this.layoutId, this);
         }
     }



     public fetchMethodCalled = false;
     fetchDataBycheckRunningIndexStatus() {
         if (this.onLoadFetch && !this.fetchMethodCalled) {
             this.initiateFetch();
             console.log("fetchMethod called");
         }
     }

     async fetchModifiedRec(modifiedDataId) {
         const objHierarchyJSON = JSON.parse(JSON.stringify(this.objectHierarchyJSON))
         if (objHierarchyJSON['options']) {
             delete objHierarchyJSON['options']
         }
         const fetchParams = {
             'objectHierarchyJSON': objHierarchyJSON,
             'layoutDataRestrictionSet': this.layoutDataRestrictionSet,
             'dataSource': this.dataSource
         }
         modifiedDataId = modifiedDataId.includes(this.tableName_pfm71658 + "_2_") ? modifiedDataId : this.tableName_pfm71658 + "_2_" + modifiedDataId
         if (this.searchQueryForDesignDoc) {
             fetchParams['searchListQuery'] = this.searchQueryForDesignDoc + " AND id:" + modifiedDataId;
         } else {
             fetchParams['searchListQuery'] = "type:" + this.tableName_pfm71658 + " AND id:" + modifiedDataId;
         }
         this.dataProvider.fetchDataFromDataSource(fetchParams).then(result => {
             if (result["status"] !== "SUCCESS") {
                 this.errorMessageToDisplay = result["message"];
                 return;
             }
             if (result['records'].length === 0) {
                 this.liveListenerHandlerUtils.modifiedDataSet(this.angularGrid, modifiedDataId, this.__deppersonalinfo$tableName, this.filteredResultList, this.gridSearchRowToggle)
                 return
             }
             this.liveListenerHandlerUtils.upsertModifiedData(result['records'], this.angularGrid, this.columnDefinitions, this.__deppersonalinfo$tableName, this.sectionObjectDetails, this.isLoading, this.dataSource, this.filteredResultList, this.gridSearchRowToggle, this.filterSectionDetail);
         }).catch(error => {
             console.log(error)
         })
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
     addButton_8010229_Onclick() {
         const queryParamsRouting = {
             action: 'Add'
         };
         if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/deppersonalinfo_Entry_Web")) {
             queryParamsRouting['redirectUrl'] = "/menu/deppersonalinfo_d_w_list";
         }
         this.router.navigate(['/menu/deppersonalinfo_Entry_Web'], {
             queryParams: queryParamsRouting,
             skipLocationChange: true
         });
     }
     dataFetchNewMethod(info) {
         if (info === "") {
             return 'success';
         } else {
             return 'failed';
         }
     }
 }