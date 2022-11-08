

 /* 
  *   File: depmultiinfo_Entry_Web.ts
  *   Copyright(c) 2022 Chain-Sys Corporation Inc.
  *   Duplication or distribution of this code in part or in whole by any media
  *   without the express written permission of Chain-Sys Corporation or its agents is
  *   strictly prohibited.
  */
 import {
     Component,
     ViewChild,
     OnInit,
     ApplicationRef,
     ChangeDetectorRef,
     HostListener,
     Renderer2,
     NgZone,
     Inject
 } from '@angular/core';
 import {
     registerLocaleData
 } from "@angular/common";
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
     dataProvider
 } from 'src/core/utils/dataProvider';
 import {
     appConstant
 } from 'src/core/utils/appConstant';
 import {
     cspfmLookupCriteriaUtils
 } from 'src/core/utils/cspfmLookupCriteriaUtils';
 import {
     cspfmweblookuppage
 } from 'src/core/pages/cspfmweblookuppage/cspfmweblookuppage';
 import {
     cspfmMetaCouchDbProvider
 } from 'src/core/db/cspfmMetaCouchDbProvider';
 import {
     metaDbConfiguration
 } from 'src/core/db/metaDbConfiguration';
 import {
     cspfmLayoutConfiguration
 } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
 import {
     cspfmConditionalFormattingUtils
 } from "src/core/dynapageutils/cspfmConditionalFormattingUtils";
 import {
     ConditionalFormat,
     EntryType
 } from 'src/core/models/cspfmConditionalFormat.type';
 import {
     cs_conditionalvalidation_toast
 } from './../../core/components/cs_conditionalvalidation_toast/cs_conditionalvalidation_toast';
 import {
     cs_conditionalvalidation_consolidate
 } from 'src/core/components/cs_conditionalvalidation_consolidate/cs_conditionalvalidation_consolidate';
 import {
     ObjectHierarchy
 } from "src/core/models/cspfmObjectHierarchy.type";
 import {
     cspfmConditionalValidationUtils
 } from "src/core/dynapageutils/cspfmConditionalValidationUtils";
 import {
     ConditionalValidation
 } from "src/core/models/cspfmConditionalValidation.type";
 import {
     DataFieldTraversal
 } from 'src/core/models/cspfmDataFieldTraversal.type';
 import {
     cspfmLookupService
 } from 'src/core/utils/cspfmLookupService';
 import {
     cspfmSlickgridUtils
 } from 'src/core/dynapageutils/cspfmSlickgridUtils';

 import * as lodash from 'lodash';
 import {
     ToastController,
     ModalController,
     AlertController,
     Platform,
     IonContent,
     LoadingController,
     ToastOptions
 } from '@ionic/angular';
 import {
     cspfmObservableListenerUtils
 } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
 import {
     lookuppage
 } from 'src/core/pages/lookuppage/lookuppage';
 import {
     FormBuilder,
     Validators,
     FormGroup
 } from '@angular/forms';
 import {
     appUtility
 } from 'src/core/utils/appUtility';
 import * as moment from 'moment';
 import 'moment-timezone';
 import {
     DatePipe
 } from '@angular/common';
 import {
     Router,
     ActivatedRoute
 } from '@angular/router';
 import {
     lookupFieldMapping
 } from 'src/core/pfmmapping/lookupFieldMapping';
 import {
     objectTableMapping
 } from 'src/core/pfmmapping/objectTableMapping';
 import * as _ from 'underscore';
 import * as Quill from 'quill';
 import {
     TranslateService
 } from '@ngx-translate/core';
 import {
     cspfmFieldTrackingMapping
 } from 'src/core/pfmmapping/cspfmFieldTrackingMapping';
 import {
     dbConfiguration
 } from 'src/core/db/dbConfiguration';
 import {
     cspfmObjectConfiguration
 } from 'src/core/pfmmapping/cspfmObjectConfiguration';
 import {
     cspfmExecutionCouchDbProvider
 } from 'src/core/db/cspfmExecutionCouchDbProvider';
 import {
     cspfmAlertDialog
 } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
 import {
     cspfmLiveListenerHandlerUtils
 } from 'src/core/dynapageutils/cspfmLiveListenerHandlerUtils';
 import {
     cspfmFlatpickrConfig
 } from 'src/core/utils/cspfmFlatpickrConfig';
 import {
     MatDialog,
     MatDialogConfig,
     MAT_DIALOG_DATA,
     MatDialogRef
 } from '@angular/material/dialog';
 import {
     MatSnackBar
 } from "@angular/material/snack-bar";
 import {
     MatProgressSpinnerModule
 } from '@angular/material/progress-spinner';
 import {
     cspfmBooleanEvaluation
 } from 'src/core/utils/cspfmBooleanEvaluation';
 import {
     cspfmDataTraversalUtils
 } from 'src/core/dynapageutils/cspfmDataTraversalUtils';
 import {
     FormulaConfig
 } from 'src/core/models/cspfmFormulaConfig.type';
 declare var $: any;
 declare const window: any;
 import {
     cspfm_data_display,
     FieldInfo
 } from "src/core/pipes/cspfm_data_display";
 import {
     cspfmRecordAssociationUtils
 } from "src/core/dynapageutils/cspfmRecordAssociationUtils";
 import {
     cspfmCustomFieldProvider
 } from 'src/core/utils/cspfmCustomFieldProvider';
 import {
     cspfmCustomActionUtils
 } from 'src/core/dynapageutils/cspfmCustomActionUtils';

 import {
     PopoverController
 } from '@ionic/angular';
 import {
     ScreenOrientation
 } from '@awesome-cordova-plugins/screen-orientation/ngx';
 import {
     SocialSharing
 } from '@awesome-cordova-plugins/social-sharing/ngx';
 import {
     EmailComposer
 } from '@awesome-cordova-plugins/email-composer/ngx';
 import {
     CallNumber
 } from '@awesome-cordova-plugins/call-number/ngx';
 import {
     SMS
 } from '@awesome-cordova-plugins/sms/ngx';
 import {
     attachmentDbProvider
 } from 'src/core/db/attachmentDbProvider';
 import {
     metaDataDbProvider
 } from 'src/core/db/metaDataDbProvider';
 import {
     cspfmExecutionPouchDbProvider
 } from 'src/core/db/cspfmExecutionPouchDbProvider';
 import {
     cspfmExecutionPouchDbConfiguration
 } from 'src/core/db/cspfmExecutionPouchDbConfiguration';
 import {
     CspfmDataFormatter,
     cspfmAssociationDataFormatter,
     CspfmDataExportFormatter,
     cspfmUrlDataFormatter
 } from 'src/core/pipes/cspfm_data_display';
 import {
     Column,
     GridOption,
     FieldType,
     Filters
 } from 'angular-slickgrid';
 @Component({
     selector: 'depmultiinfo_Entry_Web',
     templateUrl: 'depmultiinfo_Entry_Web.html'
 }) export class depmultiinfo_Entry_Web implements OnInit {
     isCustomFetchLoading = false;
     dripDownAttribute = '';
     public dataObject = {};
     public flatpickerInstances = {};
     public associateDoc = {};
     public clonedFields = {};
     public associationConfiguration = {};
     public team_930594_8009840 = this.pfmObjectConfig.objectConfiguration['pfm71658']['selectionFieldsMapping']['team'];
     public location_930595_8009830 = this.pfmObjectConfig.objectConfiguration['pfm71658']['selectionFieldsMapping']['location'];
     public depmultiselect_967503_8009831 = this.pfmObjectConfig.objectConfiguration['pfm71658']['selectionFieldsMapping']['depmultiselect'];
     public depcheckbox_967504_8009845 = this.pfmObjectConfig.objectConfiguration['pfm71658']['selectionFieldsMapping']['depcheckbox'];
     public lookupReadonlyFieldInfo: {
         [elementKey: string]: FieldInfo
     } = {}
     public loggedUserCorHeirarchyDetail;
     public consolidateErrorData = {
         "validationFailureJson": " ",
         "showConsolidatePopup": false
     };
     public ConsolidateSuccessObject = [];
     public showConsolidatePopup = false;
     public isAssociationDataRefreshRequired: boolean;
     public isAssociationDisplayRefreshRequired: boolean;
     public subordinateUserIdArray = [];
     public formgroupValidation = {};
     public conditionalFormatRelationshipObjectHierarchy: Array < ObjectHierarchy > = [];
     public conditionalFormatRelationshipDataObject = {};
     public restrictionRules = [];
     public isPopUpEnabled = false;
     @ViewChild('parentContent') parentContent: IonContent;
     @ViewChild('childContent') childContent: IonContent;

     isBrowser = false;
     headerenable = true;
     public expandParentObjectData: 'C' | 'HO' | 'FO' = 'FO';
     public previousGridState;
     public dataSource = 'CouchDB';
     public saveObjects = {};
     public __depmultiinfo$tableName = this.objectTableMapping.mappingDetail['depmultiinfo'];
     public dbServiceProvider = appConstant.couchDBStaticName;
     public layoutId = '222888';
     public isDataCloned = false;
     public layoutName = 'depmultiinfo_Entry_Web';
     public entryPageType = 'drawerentry';
     public isStateFieldDisabled = false;
     public ionDateTimeDisplayValue = {};
     public obj_pfm77370_Temp: any = {};
     public formGroup: FormGroup;
     private customAlert;
     private flatpickrListeners: Array < {
         element: HTMLElement;eventType: string;handler: (event) => any | void;option: any;
     } > = [];
     public action: EntryType = 'Add';
     public id: any = {};
     public fetchActionInfoUpsert: any = {};
     private requiredColumnForUpsert = {};
     public isSaveActionTriggered = false;
     public isValidFrom = true;
     public selectedDataObject: any = {};
     public isFieldTrackingEnable = false;
     private viewFetchActionInfo: Array < any > = [];
     infoMessage = '';
     aniClassAddorRemove = false;
     private workFlowInitiateList = {};
     public savedSuccessMessage = 'Transaction Success';
     public formulaObject = {};
     public updatedSuccessMessage = 'data updated sucessfully';
     public savedErrorMessage = 'Error saving record';
     public fetchErrorMessage = 'Fetching Failed';
     public dependentNumberCount = {};
     public formulaDependentFlag = false;
     public partiallySavedSuccessMessage = 'data partially saved';
     private backButtonSubscribeRef;
     public isAssociationLoading = true;
     public isFromMenu = false;
     public parentPopupAutoFillFlag = false;
     private errorMessageToDisplay = 'No Records';
     public parentObject = {};
     private parentObj = '';
     public parentObjFromLookup = false;
     private parentName = this.objectTableMapping.mappingDetail['deppersonalinfo'];
     private parentId = '';
     public isParentObjectShow = false;
     public isSkeletonLoading = true;
     isViewRunning = false;
     loading;
     public calendarParams = {};
     public isFromCalendar = false;
     public associationCriteriaDependentField = {};
     saveButtonClicked = false;
     public selectedCurrentEvent: Event;
     public skipValidation = [];
     private objectHierarchyJSON: ObjectHierarchy = {
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
     public redirectUrl = '/';
     private dependentFieldTriggerList = {};
     public flatpickrInstance;
     public dataCloningInfo = [];
     private clonedDataFieldDetails = [];
     private geoLocationdependentField = {};
     private prominentDataMapping = {};;
     public isCustomActionProcessing = false;
     public customActionConfiguration = {};
     public lookupCriteriaDependentField = {};
     public lookupCriteriaQueryConfig = {};
     public criteriaInvolvedFieldsList = {};
     public criteriaDataObject = {};
     public lookupCriteriaValidationFields = {};
     public relationshipType = 'one_to_many';
     public __depemployee$tableName = this.objectTableMapping.mappingDetail['depemployee'];
     private pfm71655_964453_searchKey;
     private tableName_pfm71658 = 'pfm71658';
     public __COR_USERS$tableName = this.objectTableMapping.mappingDetail['COR_USERS'];
     private pfm5_1003748_searchKey;
     private pfm71655_967507_searchKey;
     private pfm71655_967505_searchKey;
     private pfm5_967712_searchKey;
     private tableName_pfm77370 = 'pfm77370';
     private pfm71655_930602_searchKey;
     public state_1003746mapping = this.pfmObjectConfig.objectConfiguration[this.__depmultiinfo$tableName]['selectionFieldsMappingForEntry']['state'];
     public state_1003746 = {
         "pickListJson": [{
             "targetName": "cities",
             "targetType": "MULTISELECT",
             "condition": [{
                 "choice": "TamilNadu",
                 "choiceValue": "TN",
                 "pickList": [{
                     "choice": "Chennai",
                     "choiceValue": "CHN"
                 }, {
                     "choice": "Madurai",
                     "choiceValue": "MDU"
                 }]
             }, {
                 "choice": "Kerala",
                 "choiceValue": "KL",
                 "pickList": [{
                     "choice": "Kochi",
                     "choiceValue": "KCI"
                 }, {
                     "choice": "Trivandrum",
                     "choiceValue": "TVN"
                 }]
             }, {
                 "choice": "Karnataka",
                 "choiceValue": "KAR",
                 "pickList": [{
                     "choice": "Bangalore",
                     "choiceValue": "BAN"
                 }, {
                     "choice": "Mysore",
                     "choiceValue": "MYS"
                 }]
             }, {
                 "choice": "Andhra",
                 "choiceValue": "AP",
                 "pickList": [{
                     "choice": "Tripathi",
                     "choiceValue": "TRI"
                 }, {
                     "choice": "Chithoor",
                     "choiceValue": "CHT"
                 }]
             }]
         }],
         "changesApplyFields": ["cities"],
         "parent": ["state", "cities"]
     };
     public cities_1003747mapping = this.pfmObjectConfig.objectConfiguration[this.__depmultiinfo$tableName]['selectionFieldsMappingForEntry']['cities'];
     public __deppersonalinfo$tableName = this.objectTableMapping.mappingDetail['deppersonalinfo'];
     public rollUpGridFieldInfo: {
         [elementKey: string]: FieldInfo
     } = {}
     public __deplookup2$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup2'];
     public __depmcoruser$lookupIndepmultiinfo = this.lookupFieldMapping.mappingDetail[this.__depmultiinfo$tableName]['depmcoruser'];
     public __deplookup4$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup4'];
     public __deplookup3$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup3'];
     public __depcoruser$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['depcoruser'];
     public __deplookup$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup'];
     public formulaConfigJSON: {
         [elementKey: string]: FormulaConfig
     } = {};
     public formulafields = {};
     private dataPaths: Array < {
         traversalPath: string;requiredTemp: boolean
     } > = [{
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$COR_USERS_depmcoruser',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$COR_USERS_depcoruser',
         requiredTemp: false
     }, {
         traversalPath: 'depmultiinfo_DUMMY',
         requiredTemp: true
     }, {
         traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup',
         requiredTemp: false
     }, ]
     private lookupPaths: {
         [lookupField: string]: Array < {
             traversalPath: string;requiredTemp: boolean
         } >
     } = {
         [this.__deplookup2$lookupIndeppersonalinfo]: [{
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY',
             requiredTemp: false
         }],
         [this.__depmcoruser$lookupIndepmultiinfo]: [{
             traversalPath: 'depmultiinfo_DUMMY$$COR_USERS_depmcoruser',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY',
             requiredTemp: false
         }],
         [this.__deplookup4$lookupIndeppersonalinfo]: [{
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY',
             requiredTemp: false
         }],
         [this.__deplookup3$lookupIndeppersonalinfo]: [{
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY',
             requiredTemp: false
         }],
         [this.__depcoruser$lookupIndeppersonalinfo]: [{
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$COR_USERS_depcoruser',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY',
             requiredTemp: false
         }],
         [this.__deplookup$lookupIndeppersonalinfo]: [{
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3',
             requiredTemp: false
         }],
         [this.__deppersonalinfo$tableName]: [{
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$COR_USERS_depcoruser',
             requiredTemp: false
         }, {
             traversalPath: 'depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup',
             requiredTemp: false
         }]
     }
     public moreActionInfo = {}
     public workFlowActionConfig = {};
     public pickListValues = {
         [this.__deppersonalinfo$tableName]: {},
         [this.__depmultiinfo$tableName]: {}
     };
     constructor(public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, public cspfmLookupService: cspfmLookupService, public cspfmLayoutConfig: cspfmLayoutConfiguration, public dialog: MatDialog, public popoverCtrl: PopoverController, public modalCtrl: ModalController, public formBuilder: FormBuilder,
         private socialSharing: SocialSharing, private emailComposer: EmailComposer, private callNumber: CallNumber, private sms: SMS, public translateService: TranslateService,
         public platform: Platform, public applicationRef: ApplicationRef, public fieldTrackMapping: cspfmFieldTrackingMapping, public liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils,
         public observableListenerUtils: cspfmObservableListenerUtils, public router: Router, public activatRoute: ActivatedRoute, public cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils,
         public objectTableMapping: objectTableMapping, public lookupFieldMapping: lookupFieldMapping,
         public loadingCtrl: LoadingController, public pfmObjectConfig: cspfmObjectConfiguration, public toastCtrl: ToastController, public dataProvider: dataProvider, public metaDbConfig: metaDbConfiguration, public metaDbProvider: metaDataDbProvider, public customActionUtils: cspfmCustomActionUtils, public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider,
         public executionDbConfigObject: cspfmExecutionPouchDbConfiguration, public datePipe: DatePipe, private cspfmConditionalFormattingUtils: cspfmConditionalFormattingUtils, private cspfmConditionalValidationUtils: cspfmConditionalValidationUtils, private snackBar: MatSnackBar,
         public alerCtrl: AlertController, private cspfmRecordAssociationUtils: cspfmRecordAssociationUtils, private changeRef: ChangeDetectorRef, public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils, public appUtilityConfig: appUtility, private cspfmDataDisplay: cspfm_data_display, public screenOrientation: ScreenOrientation, private ngZone: NgZone, public slickgridUtils: cspfmSlickgridUtils, public customField: cspfmCustomFieldProvider,
         public cspfmFlatpickrConfig: cspfmFlatpickrConfig, @Inject(MAT_DIALOG_DATA) data,
         public dialogRef: MatDialogRef < depmultiinfo_Entry_Web > , public dbService: couchdbProvider) {
         this.formgroupValidation = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['formgroupValidation']);
         this.customActionConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['customActionConfiguration']);
         this.associationConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['associationConfiguration']);
         this.associationConfigurationAssignment()



         if (data.hasOwnProperty('params')) {
             let params = data['params'];
             this.isPopUpEnabled = true;
             this.clearAllData();
             dialogRef.disableClose = true;
             this.isFromCalendar = params['isFromCalendarNavigation'];
             if (this.isFromCalendar) {
                 this.calendarParams = JSON.parse(params['calendarParams']);
                 this.calendarParams['isFromCalendarNavigation'] = params['isFromCalendarNavigation'];
             }
             if (Object.keys(data).length === 0 && data.constructor === Object) {
                 console.log("list query data skipped");
                 return
             }
             if (params["isFromMenu"]) {
                 this.isFromMenu = params["isFromMenu"];
             }
             if (params["redirectUrl"]) {
                 this.redirectUrl = params["redirectUrl"]
             }
             this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'] = {};
             this.action = params['action'] ? params['action'] : "Add";
             this.parentId = params['parentId'];
             this.parentObj = params['parentObj'];
             this.id = params['id'];
             this.loadDefaultValueFromCalendarFramework(params);

             this.initializeObjects(dataProvider.tableStructure());
             if (this.parentId) {
                 this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'] = JSON.parse(params['parentObj']);
                 this.isParentObjectShow = true;
                 if (this.action !== 'Edit') {
                     this.fetchHeaderObjectData()
                 }
             }
             if (Object.keys(this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster']).length === 0 && this.action !== 'Edit') {
                 this.isSkeletonLoading = true;
                 this.parentId = "";
                 this.showLookup(null, 'pfm71658_1003750')
             }
             this.initializeStatusWorkFlowFields();



             if (this.action === 'Edit') {
                 this.id = params['id'];
                 this.fetchRecordAgainstSelectedObject();
             } else {
                 this.isSkeletonLoading = false;
                 if (params["dataCloningInfo"]) {
                     this.dataCloningInfo = JSON.parse(params["dataCloningInfo"])
                 }
                 if (Array.isArray(this.dataCloningInfo) && this.dataCloningInfo.length !== 0) {
                     this.cloneOnDestinationLayout()
                 }
                 if (params['parentObj'] && JSON.parse(params['parentObj'])['type'] === this.__deppersonalinfo$tableName) {
                     this.isAssociationLoading = false;
                     this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'] = JSON.parse(params['parentObj']);

                 }




                 if (this.dataObject['depmultiinfo_DUMMY']['state'] !== undefined && this.dataObject['depmultiinfo_DUMMY']['state'] !== null) {
                     this.updateChildList(this.state_1003746, this.dataObject['depmultiinfo_DUMMY']['state'], true, this.__depmultiinfo$tableName, '');
                 }

             }


         } else {
             this.isPopUpEnabled = false;

             this.activatRoute.queryParams.subscribe(async params => {
                 if (Object.keys(params).length === 0 && params.constructor === Object) {
                     console.log("list query params skipped");
                     return
                 }
                 this.clearAllData();
                 if (params["isFromMenu"]) {
                     this.isFromMenu = params["isFromMenu"];
                     this.parentId = "";
                 }
                 if (params["redirectUrl"]) {
                     this.redirectUrl = params["redirectUrl"]
                 }
                 this.action = params['action'] ? params['action'] : "Add";
                 this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'] = {};
                 this.isFromCalendar = params['isFromCalendarNavigation'];
                 if (this.isFromCalendar) {
                     this.calendarParams = JSON.parse(params['calendarParams']);
                     this.calendarParams['isFromCalendarNavigation'] = params['isFromCalendarNavigation'];
                 }
                 this.loadDefaultValueFromCalendarFramework(params);
                 this.initializeObjects(dataProvider.tableStructure());
                 if (params['parentObj']) {
                     this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'] = JSON.parse(params['parentObj']);
                     this.parentId = params['parentId'];
                     this.id = params['id'];
                     if (this.action !== 'Edit') {
                         this.fetchHeaderObjectData()
                     }
                 } else if (!params['parentObj'] && this.action !== 'Edit' || typeof(this.action) === "undefined") {
                     this.isSkeletonLoading = true;
                     this.parentId = "";
                     this.showLookup(null, 'pfm71658_1003750')
                 }

                 if (this.parentId) {
                     this.isParentObjectShow = true;
                 }
                 this.initializeStatusWorkFlowFields();




                 if (this.action === 'Edit') {
                     this.id = params['id'];

                     this.fetchRecordAgainstSelectedObject();
                 } else {
                     this.isSkeletonLoading = false;


                     this.parentObj = params['parentObj'];
                     if (params['parentObj']) {
                         this.isAssociationLoading = false;

                     }

                     if (this.dataObject['depmultiinfo_DUMMY']['state'] !== undefined && this.dataObject['depmultiinfo_DUMMY']['state'] !== null) {
                         this.updateChildList(this.state_1003746, this.dataObject['depmultiinfo_DUMMY']['state'], true, this.__depmultiinfo$tableName, '');
                     }
                     if (params["dataCloningInfo"]) {
                         this.dataCloningInfo = JSON.parse(params["dataCloningInfo"])
                     }
                     if (Array.isArray(this.dataCloningInfo) && this.dataCloningInfo.length !== 0) {
                         this.cloneOnDestinationLayout()
                     }

                     this.appUtilityConfig.updateFormulaData(this);

                     this.isSkeletonLoading = false;
                 }

             });
         }
         if (!this.appUtilityConfig.isMobile || this.appUtilityConfig.osType === 'android') {
             this.isBrowser = true;
         };


         this.createFormGroup();
         this.dripDownAttribute = "#cs-dropdown-" + this.layoutId;
     }
     fetchHeaderObjectData() {
         var parentObjJson = this.objectHierarchyJSON
         let parentObjHierarchyJson: any = parentObjJson.childObject.filter(res => {
             if (res.objectType === 'HEADER') {
                 return res
             }
         })
         if (parentObjHierarchyJson && parentObjHierarchyJson[0]['objectType'] === 'HEADER') {
             parentObjHierarchyJson = parentObjHierarchyJson[0]
             const additionalObjectData = {}
             additionalObjectData['id'] = this.parentId;
             const fetchParams = {
                 'objectHierarchyJSON': parentObjHierarchyJson,
                 'additionalInfo': additionalObjectData,
                 'dataSource': appConstant.couchDBStaticName
             };
             return this.dataProvider.querySingleDoc(fetchParams).then(res => {
                 if (res['status'] !== 'SUCCESS') {
                     this.errorMessageToDisplay = res['message'];
                     if (this.errorMessageToDisplay === 'No internet') {
                         this.appUtilityConfig.presentNoInternetToast(this);
                     }
                     return;
                 }
                 if (res['records'].length < 0) {
                     console.log(' No Records found for header Object');
                     return;
                 }
                 let headerObject = this.objectHierarchyJSON['childObject'].filter(res => {
                     if (res.objectType === 'HEADER') {
                         return res
                     }
                 })
                 const parentObjId = headerObject[0]['objectId']
                 let dataObj = {}
                 dataObj['pfm' + parentObjId] = res['records'][0]
                 this.cspfmDataTraversalUtilsObject.updateLayoutData(this.dataPaths, dataObj, this.dataObject, this.layoutId, true);
                 this.isSkeletonLoading = false;
             }).catch(error => {
                 this.isSkeletonLoading = false;
                 this.appUtilityConfig.showInfoAlert(this.fetchErrorMessage)
             })
         }
     }
     fetchRecordAgainstSelectedObject() {
         const additionalObjectdata = {};
         additionalObjectdata['id'] = this.id;
         const fetchParams = {
             'objectHierarchyJSON': this.objectHierarchyJSON,
             'additionalInfo': additionalObjectdata,
             'dataSource': appConstant.couchDBStaticName
         };
         this.isAssociationDataRefreshRequired = false
         return this.dataProvider.querySingleDoc(fetchParams).then(async res => {
             // this.isSkeletonLoading = false;
             if (res['status'] !== 'SUCCESS') {
                 this.errorMessageToDisplay = res['message'];
                 if (this.errorMessageToDisplay === 'No internet') {
                     this.appUtilityConfig.presentNoInternetToast(this);
                 }
                 return;
             }
             if (res['records'].length < 0) {
                 console.log('FetchRecordAgainstSelectedObject No Records');
                 return;
             }
             let dataObj = res['records'][0];
             this.isAssociationDataRefreshRequired = true



             if (this.isPopUpEnabled) {
                 console.log("this.flatpickerInstances : ", this.flatpickerInstances)
                 Object.keys(this.flatpickerInstances).forEach(element => {
                     let key = element.split('#')
                     this.flatpickerInstances[element].setDate(this.dataObject[key[0]][key[1]])
                     this.flatpickerInstances[element].redraw()
                 })
             }
             this.cspfmDataTraversalUtilsObject.updateLayoutData(this.dataPaths, dataObj, this.dataObject, this.layoutId, true);
             this.selectedDataObject[this.__depmultiinfo$tableName] = JSON.stringify(this.dataObject['depmultiinfo_DUMMY_Temp']);

             if (this.dataObject['depmultiinfo_DUMMY'][this.__deppersonalinfo$tableName]) {
                 this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'] = this.dataObject['depmultiinfo_DUMMY'][this.__deppersonalinfo$tableName]
                 if (!this.parentId) {
                     this.parentObject = this.dataObject['depmultiinfo_DUMMY'][this.__deppersonalinfo$tableName]
                     this.parentId = this.dataObject['depmultiinfo_DUMMY'][this.__deppersonalinfo$tableName]['id']
                 }
             }




             if (this.dataObject['depmultiinfo_DUMMY']['state'] !== undefined && this.dataObject['depmultiinfo_DUMMY']['state'] !== null) {
                 this.updateChildList(this.state_1003746, this.dataObject['depmultiinfo_DUMMY']['state'], true, this.__depmultiinfo$tableName, '');
             }


             if (Object.keys(this.formulaConfigJSON).length > 0 && Object.keys(this.lookupCriteriaQueryConfig).length > 0) {
                 delete this.dataObject['depmultiinfo_DUMMY']['pfm5_1003748_searchKey'];
             }
             this.formGroup.patchValue({
                 [this.__depmultiinfo$tableName]: this.dataObject['depmultiinfo_DUMMY']
             });



             this.applicationRef.tick();

             this.isSkeletonLoading = false;
             this.appUtilityConfig.updateFormulaData(this)

             if (!this.objectHierarchyJSON['isLazyLoadingEnabled']) {
                 this.isAssociationLoading = false
             }
             await this.cspfmRecordAssociationUtils.initialMethod(this.objectHierarchyJSON, this.dataObject, this.dbService).then(response => {
                 this.associateDoc = response
                 this.isAssociationLoading = false
             })
             if (this.changeRef && !this.changeRef['destroyed']) {
                 this.changeRef.detectChanges();
             }
         }).catch(error => {
             this.isSkeletonLoading = false;
             this.appUtilityConfig.showInfoAlert(this.fetchErrorMessage)
         })
     }
     ngAfterViewInit() {
         this.slickgridUtils.flatpickerAddRemove('weblookup', 'set')
         $(document).ready(function() {
             $(".cs-mat-main-content").on('scroll', function() {
                 window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])
             });
         })
     }
     ngAfterViewChecked() {
         this.appUtilityConfig.appendHttpToURL();
     }



     setCalculatedFormulaValue(event: {
         config: FormulaConfig,
         result: any,
         traversalPath: string,
         fieldName: string,
         objectName: string,
     }) {
         const traversalPath = event['traversalPath'];
         const fieldName = event['fieldName'];
         const result = event['result'];
         const objectName = event['objectName'];
         let objectIdTemp: any = event["config"]["objectId"];
         const objectId = objectIdTemp.toString().includes("pfm") ? objectIdTemp : "pfm" + objectIdTemp;
         this.dataObject[traversalPath][fieldName + appConstant.customFieldSuffix.formula] = result;
         this.dataObject[objectId][fieldName + appConstant.customFieldSuffix.formula] = result;
         if (Object.keys(this.lookupCriteriaQueryConfig).length > 0) {
             let fieldName = event.config.fieldName;
             let result = event.result;
             let objectId = "pfm" + event.config.objectId;
             if (this.formGroup.get(objectId) && this.formGroup.get(objectId).get(fieldName)) {
                 const formulaFieldControl = this.formGroup.get(objectId).get(fieldName);
                 if (!formulaFieldControl.dirty) {
                     formulaFieldControl.markAsDirty();
                 }
                 formulaFieldControl.setValue(result);
             }

             this.changeCallback(fieldName + "$$" + objectName, true);

         }
     }

     formGroupUpdate() {
         this.formGroup.updateValueAndValidity({
             onlySelf: false,
             emitEvent: true
         });
         this.formGroup.valueChanges.subscribe(form => {



         });
     }

     refreshData() {
         this.fetchRecordAgainstSelectedObject();
     }

     listActionAfterConfirmation(navigationPage, navigatonParams, popUpAction) {
         this.dialogRef.close();
         if (popUpAction) {
             this.dialog.open(navigationPage, navigatonParams);
         } else {
             if (navigationPage !== '') {
                 this.router.navigate([navigationPage], {
                     queryParams: navigatonParams,
                     skipLocationChange: true
                 });
             }
         }
     }
     async saveButtonOnclick(actionId ? ) {
         if (this.isSkeletonLoading) {
             this.appUtilityConfig.presentToast('Another process is running, please wait');
             return
         }
         if (this.relationshipType.toLowerCase() === appConstant.oneToOne.toLowerCase()) {
             if (!this.parentId) {
                 this.appUtilityConfig.presentToast('Please Choose the Master data');
                 return
             }
         }
         this.saveObjects[this.__depmultiinfo$tableName] = JSON.parse(JSON.stringify(this.dataObject['depmultiinfo_DUMMY']));
         this.formGroup.patchValue({
             [this.__depmultiinfo$tableName]: {
                 mno: this.saveObjects[this.__depmultiinfo$tableName]['mno'],
                 depmname1: this.saveObjects[this.__depmultiinfo$tableName]['depmname1'],
                 depmaddress1: this.saveObjects[this.__depmultiinfo$tableName]['depmaddress1'],
                 state: this.saveObjects[this.__depmultiinfo$tableName]['state'],
                 cities: this.saveObjects[this.__depmultiinfo$tableName]['cities'],
                 pfm5_1003748_searchKey: this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser']['username']
             }
         });
         if (!this.saveObjects[this.__depmultiinfo$tableName][this.__depmcoruser$lookupIndepmultiinfo]) {
             this.formGroup.patchValue({
                 [this.__depmultiinfo$tableName]: {
                     pfm5_1003748_searchKey: null
                 }
             });
             if (this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser'] && this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser']['username']) {
                 this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser']['username'] = null
             }

         }
         if (this.formGroup.valid) {
             this.saveButtonClicked = true;
             if (this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser'] !== null && this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser']['id']) {
                 this.saveObjects[this.__depmultiinfo$tableName][this.__depmcoruser$lookupIndepmultiinfo] = this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser']['id']
             }
             this.isValidFrom = true;
             const fieldTrackObject = this.fieldTrackMapping.mappingDetail[this.__depmultiinfo$tableName]
             if (fieldTrackObject) {
                 this.isFieldTrackingEnable = true;
             } else {
                 this.isFieldTrackingEnable = false;
             }
             let previousParentObject
             if (this.action === "Edit") {
                 previousParentObject = this.selectedDataObject[this.__depmultiinfo$tableName];
             } else {
                 previousParentObject = undefined
             }
             this.cspfmRecordAssociationUtils.validateAssociationObjectSelection(this.associationConfiguration, this.saveObjects);
             if (this.parentId) {
                 this.saveObjects[this.__depmultiinfo$tableName][this.parentName] = this.parentId;
             }
             this.showConsolidatePopup = false;
             this.dataProvider.saveWithValidation(this.action, appConstant.couchDBStaticName, this.__depmultiinfo$tableName,
                     this.saveObjects[this.__depmultiinfo$tableName], null).then(async (result) => {
                     if (result['status'] !== 'SUCCESS') {
                         this.saveButtonClicked = false;
                         this.dataProvider.showConsolidatePopupForValidationFailure(result, this.consolidateErrorData, this.saveButtonClicked)
                         return;
                     }
                     this.consolidateErrorData["showConsolidatePopup"] = false;



                     if (this.childObjectList.length === 0) {
                         this.appUtilityConfig.presentToast(this.savedSuccessMessage);

                         if (this.isPopUpEnabled) {
                             this.dialogRef.close();
                         }
                         const stackArray = document.getElementsByTagName('ion-router-outlet')[1].children
                         const layoutToRedirect = this.redirectUrl.replace('/menu/', '');
                         if (stackArray[stackArray.length - 1].tagName.toLowerCase() !== layoutToRedirect) {
                             if (this.action === 'Add') {
                                 this.createFormGroup();
                                 this.clearAllData();
                                 if (this.relationshipType.toLowerCase() === appConstant.oneToOne.toLowerCase()) {
                                     if (this.parentObjFromLookup) {
                                         this.parentId = ""
                                         this.dataObject['depmultiinfo_DUMMY'] = {};
                                         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'] = {};
                                     }
                                 }
                             }
                             this.onSaveSuccessCallBack(result['id']);

                         }
                         this.saveButtonClicked = false;
                     }


                 })
                 .catch(error => {
                     this.saveButtonClicked = false;
                     this.appUtilityConfig.showInfoAlert(this.savedErrorMessage);
                     console.log(error)
                 });
         } else {
             this.markFormGroupTouchedState(this.formGroup);
             this.isValidFrom = false;
             this.scrollToValidationFailedField();
         }
         var errorValue = document.querySelector('.entry-page-content');
         if (errorValue) {
             errorValue.setAttribute('class', 'cs-mat-contentmain cs-mat-errorcontentactive entry-page-content entryErrorMessage hydrated');
         }
     }
     scrollToValidationFailedField() {
         const formControls = this.formGroup.controls[this.__depmultiinfo$tableName];
         const formGroupKeys = Object.keys(formControls["controls"]);
         let isValidationSucceed = true;
         formGroupKeys.every(element => {
             if (formControls["controls"][element].status === "INVALID") {
                 const documentElement = document.getElementById(this.__depmultiinfo$tableName + "_" + element);
                 documentElement.scrollIntoView({
                     behavior: 'smooth'
                 });
                 isValidationSucceed = false;
                 return false;
             } else {
                 return true;
             }
         });
     }
     markFormGroupTouchedState(formGroup: FormGroup) {
         ( < any > Object).values(formGroup.controls).forEach(control => {
             if (control.controls) {
                 this.markFormGroupTouchedState(control);
             } else {
                 control.markAsTouched();
             }
         });
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
     flatpickrOnReady(event, objectRootPath, objectName, fieldName) {
         var format;
         this.flatpickerInstances[objectName + '#' + fieldName] = event.instance
         event.instance['params'] = {
             'field': objectName + '_' + fieldName,
         }
         event.instance.config.formatDate = this.appUtilityConfig.formatDate
         event.instance.config.parseDate = this.appUtilityConfig.parseDate
         event.instance.config.altInput = true
         if (event.instance.config.enableTime) {
             format = this.appUtilityConfig.userDateTimePickerFormat
         } else {
             format = this.appUtilityConfig.userDatePickerFormat
         }
         event.instance.config.dateFormat = format
         event.instance.config.altFormat = format
         event.instance.config.allowInput = true

         if (this.action === 'Edit') {
             event.instance.setDate(this.dataObject[objectRootPath][fieldName]);
         }
     }
     flatpickrOnOpen(event, objectRootPath, objectName, fieldName) {
         this.flatpickrInstance = this.flatpickerInstances[objectName + "#" + fieldName];
         if (this.dataObject[objectRootPath][fieldName] !== null && this.dataObject[objectRootPath][fieldName] !== '') {
             var format = (event.instance.config.enableTime) ? this.appUtilityConfig.userDateTimePickerFormat : this.appUtilityConfig.userDatePickerFormat;
             var date = moment(this.dataObject[objectRootPath][fieldName], format).toDate();
             event.instance.setDate(date);
             event.instance.params['initialValue'] = moment(date).format(format);
         } else {
             event.instance.params['initialValue'] = "";
             event.instance.clear()
         }
     }
     closeClick(objectRootPath, objectName, fieldName) {
         this.dataObject[objectRootPath][fieldName] = '';
     }
     flatpickrInputElementEvents(event, objectName, fieldName) {
         var type = event.type;
         const flatpickerInstance = this.flatpickerInstances[objectName + "#" + fieldName]
         if (type === "click" || type === "focus") {
             setTimeout(() => {
                 flatpickerInstance.open()
             }, 0);
         } else if (type === "keyup" && event.key && event.key !== "Tab") {
             flatpickerInstance.close()
         }
     }


     flatpickrOnClose(event, objectName, fieldName, objectRootPath) {
         if (event.instance['params']['field'] === this.flatpickrInstance['params']['field']) {
             this.flatpickrInstance = undefined
         }

         if (event.instance['params']['initialValue'] !== event.dateString) {
             this.dataObject[objectRootPath][fieldName] = event.dateString
             this.changeCallback(fieldName + "$$" + objectName)
         }

     }

     flatpickrOnChange(event, objectRootPath, objectName, filedName) {
         this.dataObject[objectRootPath][filedName] = event.dateString
     }
     associationConfigurationAssignment() {
         this.associationConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['associationConfiguration']);


     }
     public workflowObjectList = {};
     public workflowFieldInfo = {};
     saveStatusInMapVariable(tableName, status, id, revId, message) {
         var resultObject = {
             "status": status,
             "id": id,
             "revId": revId,
             "message": message
         };
         this.objResultMap.set(tableName, resultObject)
     }
     makeSaveResultMessage() {
         let errorMsg = "";
         let successObjectMesg = '';
         this.ConsolidateSuccessObject = [];
         this.objResultMap.forEach((value: any, objectName: string) => {
             if (value.status === 'SUCCESS') {
                 var objectDisplayName = this.objDisplayName[objectName];
                 this.ConsolidateSuccessObject.push(objectDisplayName);
                 if (successObjectMesg === '') {
                     successObjectMesg = "'" + objectDisplayName + "'";
                 } else {
                     successObjectMesg = successObjectMesg + "  ,'" + objectDisplayName + "'";
                 }
             } else {
                 if (errorMsg === '') {
                     errorMsg = " " + value.message;
                 } else {
                     errorMsg = errorMsg + " ," + value.message;
                 }
             }
         });
         if (errorMsg === '') {
             this.appUtilityConfig.presentToast(this.savedSuccessMessage);
             let opts = {
                 animate: false
             };
             this.onSaveSuccessCallBack();
             if (this.action === 'Add') {
                 this.createFormGroup();
                 this.clearAllData();
             }
             return
         }
         errorMsg = successObjectMesg + " sucessfully saved." + errorMsg;
     }
     onSaveSuccessCallBack(resultId ? ) {
         let saveActionParams = {
             "redirectTo": "depmultiinfo_d_w_hl_detail_view",
             "popUpEnabled": false
         };
         this.appUtilityConfig.presentToast(this.savedSuccessMessage);
         const primaryObj = this.objResultMap.get(this.__depmultiinfo$tableName)
         let id = resultId ? resultId : primaryObj['id'];
         let itemSaveNavigationParams = {
             id: id
         };

         if (this.isPopUpEnabled) {
             this.dialogRef.close();
         }
         if (saveActionParams["redirectTo"] === "") {
             this.navigatePopUpAction();
             this.clearAllData();
         } else if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/" + saveActionParams["redirectTo"])) {
             if (this.isPopUpEnabled) {
                 itemSaveNavigationParams['redirectUrl'] = this.redirectUrl
             } else {
                 itemSaveNavigationParams['redirectUrl'] = "/menu/depmultiinfo_Entry_Web"
             }
             if (saveActionParams["redirectTo"] !== "" && !saveActionParams["popUpEnabled"]) {
                 this.router.navigate(["/menu/" + saveActionParams["redirectTo"]], {
                     queryParams: itemSaveNavigationParams,
                     skipLocationChange: true
                 });
             }
         } else {
             this.router.navigate(["/menu/" + saveActionParams["redirectTo"]], {
                 queryParams: itemSaveNavigationParams,
                 skipLocationChange: true
             });
         }

     }
     initializeObjects(tableStructure) {
         this.dataObject['depmultiinfo_DUMMY'] = JSON.parse(JSON.stringify(tableStructure[this.__depmultiinfo$tableName]));
         this.dataObject['depmultiinfo_DUMMY_Temp'] = JSON.parse(JSON.stringify(tableStructure[this.__depmultiinfo$tableName]));
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser'] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$COR_USERS_depcoruser'] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         //For lookupCriteria
         this.dataObject[this.__depmultiinfo$tableName] = JSON.parse(JSON.stringify(tableStructure[this.__depmultiinfo$tableName]));
         this.dataObject[this.__depmultiinfo$tableName + "Temp"] = JSON.parse(JSON.stringify(tableStructure[this.__depmultiinfo$tableName]));
         this.dataObject[this.__deplookup2$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject[this.__depmcoruser$lookupIndepmultiinfo] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
         this.dataObject[this.__deplookup4$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject[this.__deplookup3$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject[this.__depcoruser$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
         this.dataObject[this.__deplookup$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         if (this.formGroup) {
             this.formGroup.patchValue({
                 [this.__depmultiinfo$tableName]: this.dataObject['depmultiinfo_DUMMY']
             });
         }
     }
     childObjectList = [];
     objResultMap = new Map < string, any > ();
     objDisplayName = {
         'pfm77370': 'depmultiinfo',
     };
     loadCheckboxEditValues(fieldName, values) {}
     loadDefaultValues() {}
     createFormGroup() {
         this.formGroup = this.formBuilder.group({
             [this.__depmultiinfo$tableName]: this.formBuilder.group({
                 depmname1: [null, Validators.compose(this.formgroupValidation[this.__depmultiinfo$tableName]['depmname1']['validator'])],
                 depmaddress1: [null, Validators.compose(this.formgroupValidation[this.__depmultiinfo$tableName]['depmaddress1']['validator'])],
                 state: [null, Validators.compose(this.formgroupValidation[this.__depmultiinfo$tableName]['state']['validator'])],
                 cities: [null, Validators.compose(this.formgroupValidation[this.__depmultiinfo$tableName]['cities']['validator'])],
                 pfm5_1003748_searchKey: [null, Validators.compose(this.formgroupValidation[this.__depmultiinfo$tableName]['pfm5_1003748_searchKey']['validator'])]
             })
         });
         this.formGroupUpdate();
     }
     clearAllData() {
         this.objResultMap = new Map < string, any > ();
         this.dependentFieldTriggerList = {}
         this.dataObject['depmultiinfo_DUMMY'] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depmultiinfo$tableName]));
         this.obj_pfm77370_Temp = {};
         if (this.formGroup) {
             this.formGroup.reset();
         }
         this.formulaObject = {}
         this.dataObject['depmultiinfo_DUMMY_Temp'] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depmultiinfo$tableName]));
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2'] = "";
         this.pfm71655_964453_searchKey = '';
         this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser'] = "";
         this.pfm5_1003748_searchKey = '';
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4'] = "";
         this.pfm71655_967507_searchKey = '';
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3'] = "";
         this.pfm71655_967505_searchKey = '';
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$COR_USERS_depcoruser'] = "";
         this.pfm5_967712_searchKey = '';
         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup'] = "";
         this.pfm71655_930602_searchKey = '';
         this.dataObject[this.__depmultiinfo$tableName] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depmultiinfo$tableName]));
         this.dataObject[this.__depmultiinfo$tableName + "Temp"] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depmultiinfo$tableName]));
         this.dataObject[this.__deplookup2$lookupIndeppersonalinfo] = ""
         this.dataObject[this.__depmcoruser$lookupIndepmultiinfo] = "";
         this.dataObject[this.__deplookup4$lookupIndeppersonalinfo] = ""
         this.dataObject[this.__deplookup3$lookupIndeppersonalinfo] = ""
         this.dataObject[this.__depcoruser$lookupIndeppersonalinfo] = "";
         this.dataObject[this.__deplookup$lookupIndeppersonalinfo] = ""
         this.pickListValues[this.__depmultiinfo$tableName]['cities'] = [];
         if (this.dataObject['depmultiinfo_DUMMY']['state'] !== undefined && this.dataObject['depmultiinfo_DUMMY']['state'] !== null) {
             this.updateChildList(this.state_1003746, this.dataObject['depmultiinfo_DUMMY']['state'], true, this.__depmultiinfo$tableName, '');
         }
         this.associateDoc = {};
         this.action = "Add";
         this.appUtilityConfig.updateFormulaData(this);
         this.initializeObjects(this.dataProvider.tableStructure());
         this.dependentNumberCount = {};
         this.isDataCloned = false
     }
     async showLookup(event, lookupFieldId, searchValue ? ) {
         this.selectedCurrentEvent = event;
         let lookupInputConfig = {
             layoutId: this.layoutId,
             dataObject: this.dataObject,
             criteriaDataObject: this.criteriaDataObject,
             formGroup: this.formGroup,
             lookupCriteriaValidationFields: this.lookupCriteriaValidationFields,
             lookupFieldId: lookupFieldId,
             lookupCriteriaQueryConfig: this.lookupCriteriaQueryConfig,
             loggedUserCorHeirarchyDetail: this.loggedUserCorHeirarchyDetail,
             searchValue: searchValue,
         }
         let lookupInput = await this.cspfmLookupService.makeLookupQuery(lookupInputConfig)
         if (this.lookupCriteriaQueryConfig[lookupFieldId]) {
             this.lookupCriteriaDependentField = {};
             this.lookupCriteriaDependentField['showConsolidatePopup'] = false;
             if (lookupInput['criteriaRestriction']) {
                 this.lookupCriteriaDependentField['validationFailureSet'] = lookupInput['validationFailureSet']
                 this.lookupCriteriaDependentField['objectId'] = lookupInput['lookupCriteriaObjectId']
                 this.lookupCriteriaDependentField['messageType'] = "LookupCriteriaError"
                 this.lookupCriteriaDependentField['showConsolidatePopup'] = true;
                 return
             }
         }
         this.lookupCriteriaDependentField['showConsolidatePopup'] = false;

         const dialogConfig = new MatDialogConfig()
         dialogConfig.data = {
             serviceObject: lookupInput['additionalData']['isStandardObject'] ? this.dataProvider.getMetaDbServiceProvider(appConstant.couchDBStaticName) : this.dataProvider.getDbServiceProvider(appConstant.couchDBStaticName),
             parentPage: this,
             dataSource: appConstant.couchDBStaticName,
             lookupColumnName: lookupInput['additionalData']['objectRootPath'],
             lookupInput: lookupInput,
             autoPopup: event ? false : true,
             objectName: lookupInput['objectHierarchy']['objectName']
         };
         dialogConfig.panelClass = 'custom-dialog-container'
         this.dialog.open(cspfmweblookuppage, dialogConfig);
     }
     async lookupResponse(objectRootPath, selectedValue) {
         let fieldName = ''
         this.dependentNumberCount = {};
         if (objectRootPath === 'depmultiinfo_DUMMY$$COR_USERS_depmcoruser') {
             this.pfm5_1003748_searchKey = '';
             this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depmultiinfo_DUMMY', 'depmultiinfo_DUMMY', this.__depmcoruser$lookupIndepmultiinfo, selectedValue, this.layoutId);
             this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__depmcoruser$lookupIndepmultiinfo], this.dataObject['depmultiinfo_DUMMY'], this.dataObject, this.layoutId);
             this.dataObject['depmultiinfo_DUMMY'][this.__depmcoruser$lookupIndepmultiinfo] = this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser'].id;
             fieldName = this.__depmcoruser$lookupIndepmultiinfo;
             this.makeFormGroupDirty(this.__depmultiinfo$tableName, this.__depmcoruser$lookupIndepmultiinfo)



             this.conditionalFormatRelationshipDataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser'] = this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser']
             this.isSkeletonLoading = false;


             this.changeCallback(fieldName + "$$depmultiinfo");
             return;
         } else {
             this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depmultiinfo_DUMMY', 'depmultiinfo_DUMMY', this.__deppersonalinfo$tableName, selectedValue, this.layoutId);
             this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__deppersonalinfo$tableName], this.dataObject['depmultiinfo_DUMMY'], this.dataObject, this.layoutId);
             if (this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'][this.__depmultiinfo$tableName + 's'] && this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'][this.__depmultiinfo$tableName + 's'].length !== 0) {
                 // this.isSkeletonLoading = false;
                 this.parentObjFromLookup = false;
                 this.parentObject = selectedValue;
                 this.parentId = this.parentObject['id'];
                 this.action = 'Edit';
                 this.isAssociationLoading = false;
                 const primaryObject = lodash.extend({}, this.dataObject['depmultiinfo_DUMMY'], this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'][this.__depmultiinfo$tableName + 's'][0]);
                 this.dataObject['depmultiinfo_DUMMY'] = primaryObject
                 this.dataObject['depmultiinfo_DUMMY'][this.__deppersonalinfo$tableName] = this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster']['id']

                 this.isSkeletonLoading = false;
                 this.changeCallback(fieldName + "$$depmultiinfo");

                 if (this.dataObject['depmultiinfo_DUMMY'][this.__depmcoruser$lookupIndepmultiinfo]) {
                     this.pfm5_1003748_searchKey = '';
                     this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser'] = this.dataObject['depmultiinfo_DUMMY'][this.__depmcoruser$lookupIndepmultiinfo];
                     this.dataObject['depmultiinfo_DUMMY'][this.__depmcoruser$lookupIndepmultiinfo] = this.dataObject['depmultiinfo_DUMMY$$COR_USERS_depmcoruser'].id;



                 }
             } else {
                 // this.isSkeletonLoading = false;
                 this.parentObjFromLookup = true;
                 this.parentObject = selectedValue;
                 this.parentId = this.parentObject['id'];
                 this.clearAllData();
                 this.dataObject['depmultiinfo_DUMMY'][selectedValue['type']] = selectedValue;
                 this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__deppersonalinfo$tableName], this.dataObject['depmultiinfo_DUMMY'], this.dataObject, this.layoutId);
                 this.isAssociationLoading = false;


                 this.isSkeletonLoading = false;
                 this.changeCallback(fieldName + "$$depmultiinfo")

                 if (Object.keys(this.calendarParams).length !== 0) {
                     this.loadDefaultValueFromCalendarFramework(this.calendarParams);
                 }
             }
         }
     }
     statusWorkFlowFieldsDataAssign() {

         if (this.action === "Edit") {}
     }
     popup(event) {
         const posit = event.target.getBoundingClientRect()
         const offsetLeft = event.currentTarget.offsetWidth + posit.left;
         const offsetTop = posit.top - 30;
         setTimeout(() => {
             let leftset = offsetLeft - document.getElementsByClassName('popover-content')[0].clientWidth
             document.getElementsByClassName('popover-content')[0].setAttribute("style", `top: ${offsetTop}px; left: ${leftset}px`);
         }, 150)
     }
     updateChildList(selectedFieldJSON, userSelectedValues, flag, objectName: string, userInteractedField ? ) {
         if (!flag) {}
         this.dependentNumberCount = {};
         if (userInteractedField === undefined) {
             userInteractedField = '';
         }
         if (typeof userSelectedValues === 'string') {
             userSelectedValues = [userSelectedValues];
         }
         var myObjStr = JSON.stringify(selectedFieldJSON);
         var tempJson = JSON.parse(myObjStr);
         if (selectedFieldJSON !== '') {
             this.clearExisitingDataInPickList(selectedFieldJSON, flag, objectName);
         }
         if (userSelectedValues === '' || selectedFieldJSON === '' || userSelectedValues === null) {
             return;
         }
         var targetName = "";
         userSelectedValues.forEach(userSelectedValue => {
             var pickListJSONList: any = [];
             Array.prototype.push.apply(pickListJSONList, tempJson['pickListJson']);
             pickListJSONList.forEach(elementCondition => {
                 var conditionList: any = [];
                 Array.prototype.push.apply(conditionList, elementCondition['condition']);
                 conditionList.forEach(element => {
                     if (elementCondition['targetType'] === 'CHECKBOX') {
                         if (userSelectedValue === element.choiceValue) {
                             targetName = elementCondition['targetName'];
                             var checkBoxList = element['pickList'];
                             var checkBoxListWithDefaultValue: any = [];
                             checkBoxList.forEach(elementCheckbox => {
                                 var object = {};
                                 object['val'] = elementCheckbox.choiceValue;
                                 object['displayName'] = elementCheckbox.choice;
                                 object['isChecked'] = false;
                                 checkBoxListWithDefaultValue.push(object);
                             });
                             if (this.pickListValues[objectName][targetName]) {
                                 let targetNameList = this.pickListValues[objectName][targetName];
                                 Array.prototype.push.apply(targetNameList, checkBoxListWithDefaultValue);
                                 this.pickListValues[objectName][targetName] = lodash.uniqBy(targetNameList, 'val');
                             } else {
                                 this.pickListValues[objectName][targetName] = checkBoxListWithDefaultValue;
                             }
                             if (flag) {
                                 this.loadCheckboxEditValues(targetName, this.pickListValues[objectName][targetName]);
                             }
                         }
                     } else {
                         if (userSelectedValue === element.choiceValue) {
                             targetName = elementCondition['targetName'];
                             if (this.pickListValues[objectName][targetName]) {
                                 let targetNameList = this.pickListValues[objectName][targetName];
                                 Array.prototype.push.apply(targetNameList, element['pickList']);
                                 this.pickListValues[objectName][targetName] = lodash.uniqBy(targetNameList, 'choice');
                             } else {
                                 this.pickListValues[objectName][targetName] = lodash.uniqBy(element['pickList'], 'choice');
                             }
                         }
                     }
                 });
             });
         });

     }
     checkChildValuesExists(fieldName, objectName: string) {
         if (this.dataObject['depmultiinfo_DUMMY']['state'].length > 0 && (!this.pickListValues[objectName][fieldName] || this.pickListValues[objectName][fieldName].length === 0)) {
             return true
         } else {
             return false
         }
     }

     updateDependentChildUI(selectedValues) {
         if (selectedValues.length > 0) {
             document.getElementsByClassName('cs-statoption')[0].classList.add('enable')
             document.getElementsByClassName('cs-statoption')[0].classList.remove('disable')
         } else {
             document.getElementsByClassName('cs-statoption')[0].classList.add('disable')
             document.getElementsByClassName('cs-statoption')[0].classList.remove('enable')
         }
     }
     checkIsParentSelected(selectedField, childField, json, dataObject, objectName: string) {
         this.dependentNumberCount = {};
         let parentField = (selectedField.toLowerCase()).replace(" ", '')
         if (parentField === '' || parentField === undefined) {
             return;
         }

         if (dataObject[parentField] === null || dataObject[parentField] === '' || dataObject[parentField].length === 0) {
             var myObjStr = JSON.stringify(json);
             var tempJson = JSON.parse(myObjStr);

             var parentArray = tempJson['parent'];

             if (parentArray === undefined || parentArray === '') {
                 return;
             }

             var i = 1;
             parentArray.forEach(fieldName => {
                 this.dependentNumberCount[fieldName] = i;
                 i++;



             });
             return;
         } else if (!this.pickListValues[objectName][childField] || this.pickListValues[objectName][childField].length <= 0) {
             let convertedChildFieldValue = childField.charAt(0).toUpperCase() + childField.substring(1);
             this.appUtilityConfig.showInfoAlert(convertedChildFieldValue + ' value is not available for selected ' + selectedField)
             return;
         }
     }
     clearExisitingDataInPickList(userSelectedValue, isNeedToClear, objectName: string) {
         const removeFieldArray = userSelectedValue['changesApplyFields'];

         if (removeFieldArray === undefined || removeFieldArray === '') {
             return;
         }

         if (isNeedToClear) {
             return;
         }

         removeFieldArray.forEach(fieldName => {
             this.pickListValues[objectName][fieldName] = [];
             this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'][fieldName] = objectName === this.__deppersonalinfo$tableName ? '' : this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'][fieldName];
             this.dataObject['depmultiinfo_DUMMY'][fieldName] = objectName === this.__depmultiinfo$tableName ? '' : this.dataObject['depmultiinfo_DUMMY'][fieldName];
         });

     }
     resetChildDependentInfo(objectName, dataObjectFieldName, looklUpObj, lookupObjectFieldName, formControlerName) {

     }
     public isFormValueChanged = false;
     changeCallback(fieldName, callFromFormulaCalculate ? ) {
         if (!callFromFormulaCalculate) {
             this.appUtilityConfig.updateFormulaData(this);
             this.isFormValueChanged = true;
         }





     }
     loadDefaultValueFromCalendarFramework(params) {
         var isFromCalendar = params['isFromCalendarNavigation'];
         if (isFromCalendar) {
             let fieldInfo = this.calendarParams['fieldInfo'];
             let field = fieldInfo[0];
             let dateToLoad = field['dafaultValue'];
             let dateVal;
             if (field['fieldType'] === 'DATE') {
                 let dateSelected = moment(new Date(dateToLoad)).tz(this.appUtilityConfig.orgTimeZone).toISOString();
                 dateVal = this.datePipe.transform(dateSelected, this.appUtilityConfig.userDateFormat)
             } else {
                 let dateSelected = moment(new Date(dateToLoad)).tz(this.appUtilityConfig.userTimeZone).toISOString();
                 dateVal = this.datePipe.transform(dateSelected, this.appUtilityConfig.userDateTimeFormat)
             }
             let fieldToLoad = field['fieldName'];
             setTimeout(() => {
                 this.dataObject['depmultiinfo_DUMMY'][fieldToLoad] = dateVal
             }, 1000)
         }
     }
     updateFormGroupForUrl() {
         this.dataCloningInfo.forEach(clonedInfo => {
             if (clonedInfo["fieldType"] === "URL" && clonedInfo["destinationFieldInfo"]["destinationFieldValue"]) {
                 this.formGroup.patchValue({
                     [this.__depmultiinfo$tableName]: {
                         [clonedInfo["destinationFieldInfo"]["destinationFieldName"]]: clonedInfo["destinationFieldInfo"]["destinationFieldValue"]
                     }
                 })
             }
         })
     }
     cloneOnDestinationLayout() {
         this.isDataCloned = true
         this.dataCloningInfo = this.cspfmLookupCriteriaUtils.handleLookupCriteriaInvolvedClonedFields(this.dataCloningInfo, this.lookupCriteriaValidationFields)
         this.clonedDataFieldDetails = this.cspfmDataTraversalUtilsObject.updateAndGetClonedData(this.dataCloningInfo, this.dataPaths, this.lookupPaths, this.dataObject, this.pickListValues, 'depmultiinfo_DUMMY', this.layoutId)

         this.dataObject['depmultiinfo_DUMMY$$deppersonalinfo_depmmaster'] = JSON.parse(this.parentObj);
         if (this.isPopUpEnabled === false) {
             this.updateFormGroupForUrl()
         }
         this.clonedFields = this.appUtilityConfig.initializeClonedFieldsForEntry(this.clonedDataFieldDetails, this.objectTableMapping.mappingDetail)

     }
     private approverType = "";
     public WorkFlowUserApprovalStatusDataObject = {};
     private fieldApproverType = {

     };
     private workFlowMapping = {

     };
     initializeStatusWorkFlowFields() {}
     public gridFieldInfo: {
         [key: string]: FieldInfo
     } = {
         "pfm71658_name_8009836": {
             "id": "name",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$name.name",
             "fieldName": "name",
             "prop": "name",
             "fieldType": "TEXT",
             "objectName": "deppersonalinfo",
             "elementid": 8009836,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$name",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_employeename_8009838": {
             "id": "employeename",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$employeename.employeename",
             "fieldName": "employeename",
             "prop": "employeename",
             "fieldType": "TEXT",
             "objectName": "deppersonalinfo",
             "elementid": 8009838,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$employeename",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_team_8009840": {
             "id": "team",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$team.team",
             "fieldName": "team",
             "prop": "team",
             "fieldType": "DROPDOWN",
             "objectName": "deppersonalinfo",
             "elementid": 8009840,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$team",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.team_930594_8009840,
             "currencyDetails": ""
         },
         "pfm71658_location_8009830": {
             "id": "location",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$location.location",
             "fieldName": "location",
             "prop": "location",
             "fieldType": "DROPDOWN",
             "objectName": "deppersonalinfo",
             "elementid": 8009830,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$location",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.location_930595_8009830,
             "currencyDetails": ""
         },
         "pfm71658_depcurrency_8009849": {
             "id": "depcurrency",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcurrency.depcurrency",
             "fieldName": "depcurrency",
             "prop": "depcurrency",
             "fieldType": "CURRENCY",
             "objectName": "deppersonalinfo",
             "elementid": 8009849,
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
         "pfm71658_deptimestamp_8009832": {
             "id": "deptimestamp",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deptimestamp.deptimestamp",
             "fieldName": "deptimestamp",
             "prop": "deptimestamp",
             "fieldType": "TIMESTAMP",
             "objectName": "deppersonalinfo",
             "elementid": 8009832,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deptimestamp",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateTimeFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depdate_8009837": {
             "id": "depdate",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depdate.depdate",
             "fieldName": "depdate",
             "prop": "depdate",
             "fieldType": "DATE",
             "objectName": "deppersonalinfo",
             "elementid": 8009837,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depdate",
             "child": "",
             "dateFormat": this.appUtilityConfig.userDateFormat,
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depboolean_8009833": {
             "id": "depboolean",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depboolean.depboolean",
             "fieldName": "depboolean",
             "prop": "depboolean",
             "fieldType": "BOOLEAN",
             "objectName": "deppersonalinfo",
             "elementid": 8009833,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depboolean",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depnumber_8009844": {
             "id": "depnumber",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depnumber.depnumber",
             "fieldName": "depnumber",
             "prop": "depnumber",
             "fieldType": "NUMBER",
             "objectName": "deppersonalinfo",
             "elementid": 8009844,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depnumber",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_depdecimal_8009846": {
             "id": "depdecimal",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depdecimal.depdecimal",
             "fieldName": "depdecimal",
             "prop": "depdecimal",
             "fieldType": "DECIMAL",
             "objectName": "deppersonalinfo",
             "elementid": 8009846,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depdecimal",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_deplookup_8009829": {
             "id": "pfm71655_930602_employeeid",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup.deplookup",
             "prop": "pfm71655_930602.employeeid",
             "fieldName": "pfm71655_930602",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009829,
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
         "pfm71655_employeename_8009828": {
             "child": {
                 "id": "employeename",
                 "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8009828,
                 "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup$$employeename.employeename",
             "elementid": 8009828,
             "mappingDetails": "",
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_930602",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_depformulan__f_8009834": {
             "id": "depformulan__f",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depformulan.depformulan",
             "fieldName": "depformulan__f",
             "prop": "depformulan__f",
             "fieldType": "FORMULA",
             "formulaType": "NUMBER",
             "objectName": "deppersonalinfo",
             "elementid": 8009834,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depformulan",
             "child": "",
             "dateFormat": "",
             "mappingDetails": "",
             "currencyDetails": ""
         },
         "pfm71658_deplookup2_8009847": {
             "id": "pfm71655_964453_employeeid",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup2.deplookup2",
             "prop": "pfm71655_964453.employeeid",
             "fieldName": "pfm71655_964453",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009847,
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
         "pfm71655_employeename_8009848": {
             "child": {
                 "id": "employeename",
                 "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8009848,
                 "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2$$employeename.employeename",
             "elementid": 8009848,
             "mappingDetails": "",
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup2$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_964453",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_depmultiselect_8009831": {
             "id": "depmultiselect",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depmultiselect.depmultiselect",
             "fieldName": "depmultiselect",
             "prop": "depmultiselect",
             "fieldType": "MULTISELECT",
             "objectName": "deppersonalinfo",
             "elementid": 8009831,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depmultiselect",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.depmultiselect_967503_8009831,
             "currencyDetails": ""
         },
         "pfm71658_depcheckbox_8009845": {
             "id": "depcheckbox",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcheckbox.depcheckbox",
             "fieldName": "depcheckbox",
             "prop": "depcheckbox",
             "fieldType": "CHECKBOX",
             "objectName": "deppersonalinfo",
             "elementid": 8009845,
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcheckbox",
             "child": "",
             "dateFormat": "",
             "mappingDetails": this.depcheckbox_967504_8009845,
             "currencyDetails": ""
         },
         "pfm71658_depcoruser_8009839": {
             "id": "pfm5_967712_username",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depcoruser.depcoruser",
             "prop": "pfm5_967712.username",
             "fieldName": "pfm5_967712",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009839,
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
         "pfm71658_deplookup3_8009842": {
             "id": "pfm71655_967505_employeeid",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup3.deplookup3",
             "prop": "pfm71655_967505.employeeid",
             "fieldName": "pfm71655_967505",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009842,
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
         "pfm71655_employeename_8009835": {
             "child": {
                 "id": "employeename",
                 "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8009835,
                 "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3$$employeename.employeename",
             "elementid": 8009835,
             "mappingDetails": "",
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup3$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_967505",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         },
         "pfm71658_deplookup4_8009843": {
             "id": "pfm71655_967507_employeeid",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$deplookup4.deplookup4",
             "prop": "pfm71655_967507.employeeid",
             "fieldName": "pfm71655_967507",
             "fieldType": "LOOKUP",
             "objectName": "deppersonalinfo",
             "elementid": 8009843,
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
         "pfm71655_employeename_8009841": {
             "child": {
                 "id": "employeename",
                 "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4$$employeename.employeename",
                 "fieldName": "employeename",
                 "prop": "employeename",
                 "fieldType": "TEXT",
                 "objectName": "depemployee",
                 "elementid": 8009841,
                 "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4$$employeename",
                 "child": "",
                 "dateFormat": "",
                 "mappingDetails": "",
                 "currencyDetails": ""
             },
             "id": "employeename",
             "prop": "employeename",
             "label": "depmultiinfo_Entry_Web.Element.depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4$$employeename.employeename",
             "elementid": 8009841,
             "mappingDetails": "",
             "traversalpath": "depmultiinfo_DUMMY$$deppersonalinfo_depmmaster$$depemployee_deplookup4$$employeename",
             "dateFormat": "",
             "currencyDetails": "",
             "fieldName": "pfm71655_967507",
             "fieldType": "LOOKUP",
             "objectName": "depemployee"
         }
     };
     public tableColumnInfo: {
         [key: string]: {
             [key: string]: {
                 [key: string]: FieldInfo
             }
         }
     } = {};
     public associationColumnDefinitions = {};
     navigatePopUpAction() {


         const stackArray = document.getElementsByTagName('ion-router-outlet')[1].children
         const layoutToRedirect = this.redirectUrl.replace('/menu/', '');
         if (stackArray[stackArray.length - 1].tagName.toLowerCase() !== layoutToRedirect) {

             if (this.isPopUpEnabled) {
                 this.dialogRef.close();
             }
             if (this.redirectUrl === "/") {
                 const itemSaveNavigationParams = {
                     id: this.id,
                     redirectUrl: "/menu/depmultiinfo_Entry_Web"
                 };
                 this.router.navigate(["/menu/depmultiinfo_d_w_hl_detail_view"], {
                     queryParams: itemSaveNavigationParams,
                     skipLocationChange: true
                 });
             } else if (!this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                 const itemSaveNavigationParams = {
                     id: this.id,
                     redirectUrl: "/menu/depmultiinfo_Entry_Web"
                 };
                 this.router.navigate([this.redirectUrl], {
                     queryParams: itemSaveNavigationParams,
                     skipLocationChange: true
                 });
             } else {
                 this.router.navigateByUrl(this.redirectUrl, {
                     skipLocationChange: true
                 });
             }
         }

     }
     lookupClearAction(dataRootPath, dataObjectFieldName, looklUpObj, lookupObjectFieldName, formControlerName, lookupObjectName, objectRootPath, isStandardObject ? ) {
         this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depmultiinfo_DUMMY', dataRootPath, dataObjectFieldName, null, this.layoutId);
         this.dataObject[dataObjectFieldName] = isStandardObject ?
             JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[lookupObjectName])) :
             JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[lookupObjectName]));
         this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[dataObjectFieldName], this.dataObject['depmultiinfo_DUMMY'], this.dataObject, this.layoutId);
         delete looklUpObj["id"];
         delete looklUpObj[lookupObjectFieldName];
         this.formGroup.value.formControlerName = null;

         let objectName = ""
         let objectKeys = Object.keys(this.objectTableMapping.mappingDetail)
         let objectValues = Object.values(this.objectTableMapping.mappingDetail)
         for (let i = 0; i < objectValues.length; i++) {
             if (lookupObjectName === objectValues[i]) {
                 objectName = objectKeys[i]
             }
         }

         this.resetChildDependentInfo(objectName, dataObjectFieldName, looklUpObj, lookupObjectFieldName, formControlerName);


         this.changeCallback(dataObjectFieldName + '$$depmultiinfo')
     }
     recordDiscardConfirmAlert() {
         const dialogConfig = new MatDialogConfig()

         dialogConfig.data = {
             title: 'Are you sure want to leave this page?',
             buttonInfo: [{
                     "name": "Cancel",
                     "handler": () => {
                         this.customAlert = null;
                         console.log('Individual clicked');
                     }
                 },
                 {
                     "name": "Yes",
                     "handler": () => {
                         this.navigatePopUpAction();
                     }
                 }
             ],
             parentContext: this,
             type: "Alert"
         };
         dialogConfig.autoFocus = false
         this.dialog.open(cspfmAlertDialog, dialogConfig);
     }
     refreshButtonPressed() {
         this.fetchRecordAgainstSelectedObject();
     }
     onQuillSelectionChanged() {

         var Link = Quill.import('formats/link');
         Link.sanitize = function(url) {
             let protocol = url.slice(0, url.indexOf(':'));
             if (this.PROTOCOL_WHITELIST.indexOf(protocol) === -1) {
                 url = 'http://' + url;
             }
             let anchor = document.createElement('a');
             anchor.href = url;
             protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
             return (this.PROTOCOL_WHITELIST.indexOf(protocol) > -1) ? url : this.SANITIZED_URL;
         }
         Quill.register(Link, true);
     }
     ngOnInit() {}

     ionViewDidEnter() {
         if (this.action === 'Edit') {
             const tableStructure = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()["pfm126513"]));
             Object.keys(tableStructure).forEach(key => {
                 this.dependentFieldTriggerList[key] = 'triggered';
             });
         }
     }


     makeAllFormFieldsDirty() {
         const formGroupControls = this.formGroup.controls
         Object.keys(formGroupControls).forEach(objectId => {
             formGroupControls[objectId].markAsDirty()
             var formFieldsControl = formGroupControls[objectId]['controls']
             Object.keys(formFieldsControl).forEach(fieldName => {
                 formFieldsControl[fieldName].markAsDirty()
             })
         })
     }
     makeFormGroupDirty(objectId, fieldName) {
         const formGroupControls = this.formGroup.controls[objectId]
         if (!formGroupControls.dirty) {
             formGroupControls.markAsDirty()
         }
         var formControls;
         if (formGroupControls['controls'][fieldName]) {
             formControls = formGroupControls['controls'][fieldName]
         } else {
             formControls = formGroupControls['controls'][fieldName + '_searchKey']
         }
         if (formControls && !formControls.dirty) {
             formControls.markAsDirty()
         }
     }

     listButton_8009851_Onclick() {

         var redirectUrlForNav = '/menu/depmultiinfo_Entry_Web';

         const stackArray = document.getElementsByTagName('ion-router-outlet')[1].children
         if (stackArray[stackArray.length - 1].tagName.toLowerCase() !== "depmultiinfo_d_w_list") {
             this.toastCtrl.dismiss();
             const queryParamsRouting = {};
             if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depmultiinfo_d_w_list")) {
                 queryParamsRouting['redirectUrl'] = redirectUrlForNav
             }

             if (this.isPopUpEnabled) {
                 this.appUtilityConfig.navigationDiscardConfirmAlert("/menu/depmultiinfo_d_w_list", queryParamsRouting, false, this);
             } else {
                 this.router.navigate(["/menu/depmultiinfo_d_w_list"], {
                     queryParams: queryParamsRouting,
                     skipLocationChange: true
                 });
             }

         } else {
             if (this.isPopUpEnabled) {
                 this.appUtilityConfig.navigationDiscardConfirmAlert("", {}, false, this);
             }
         }
     }
 }