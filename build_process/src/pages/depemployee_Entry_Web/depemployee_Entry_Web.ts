

 /* 
  *   File: depemployee_Entry_Web.ts
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
 @Component({
     selector: 'depemployee_Entry_Web',
     templateUrl: 'depemployee_Entry_Web.html'
 }) export class depemployee_Entry_Web implements OnInit {
     isCustomFetchLoading = false;
     dripDownAttribute = '';
     public dataObject = {};
     public flatpickerInstances = {};
     public associateDoc = {};
     public clonedFields = {};
     public associationConfiguration = {};
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
     @ViewChild(IonContent) contentArea: IonContent;
     public dataSource = 'CouchDB';
     public saveObjects = {};
     public __depemployee$tableName = this.objectTableMapping.mappingDetail['depemployee'];
     public dbServiceProvider = appConstant.couchDBStaticName;
     public layoutId = '203848';
     public isDataCloned = false;
     public layoutName = 'depemployee_Entry_Web';
     public entryPageType = '';
     public isStateFieldDisabled = false;
     public ionDateTimeDisplayValue = {};
     public obj_pfm71655_Temp: any = {};
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
     private parentName = '';
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
         "objectId": "71655",
         "referenceObjectId": "0",
         "objectName": "depemployee",
         "isStandardObject": "N",
         "rootPath": "depemployee_DUMMY",
         "fieldId": "0",
         "relationShipType": "null",
         "objectType": "PRIMARY",
         "childObject": [{
             "objectId": "5",
             "fieldId": "967501",
             "objectName": "COR_USERS",
             "objectType": "LOOKUP",
             "referenceObjectId": 71655,
             "rootPath": "depemployee_DUMMY$$COR_USERS_depcoruser",
             "isStandardObject": "Y",
             "relationShipType": "",
             "includeFields": true,
             "childObject": []
         }],
         "formulaField": [{
             "fieldName": "depformulan"
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
     private tableName_pfm71655 = 'pfm71655';
     public __COR_USERS$tableName = this.objectTableMapping.mappingDetail['COR_USERS'];
     private pfm5_967501_searchKey;
     public team_930536mapping = this.pfmObjectConfig.objectConfiguration[this.__depemployee$tableName]['selectionFieldsMappingForEntry']['team'];
     public location_930537mapping = this.pfmObjectConfig.objectConfiguration[this.__depemployee$tableName]['selectionFieldsMappingForEntry']['location'];
     public depmultiselect_967499mapping = this.pfmObjectConfig.objectConfiguration[this.__depemployee$tableName]['selectionFieldsMappingForEntry']['depmultiselect'];
     private depcheckbox_967500_checkbox = [];
     public depdropdownn_972175mapping = this.pfmObjectConfig.objectConfiguration[this.__depemployee$tableName]['selectionFieldsMappingForEntry']['depdropdownn'];
     public rollUpGridFieldInfo: {
         [elementKey: string]: FieldInfo
     } = {}
     public __depcoruser$lookupIndepemployee = this.lookupFieldMapping.mappingDetail[this.__depemployee$tableName]['depcoruser'];
     public formulaConfigJSON: {
         [elementKey: string]: FormulaConfig
     } = {
         "pfm71655_depformulan_7773827": {
             "isReturnBlankEnable": "Y",
             "fieldName": "depformulan",
             "formulaType": "NUMBER",
             "configuredTimezone": "Asia/Calcutta",
             "involvedFields": [{
                 "fieldName": "depnumber",
                 "fieldType": "NUMBER",
                 "objectId": 71655,
                 "fieldId": 930554,
                 "objectType": "PRIMARY",
                 "traversalPath": "depemployee_DUMMY"
             }, {
                 "fieldName": "depdecimal",
                 "fieldType": "DECIMAL",
                 "objectId": 71655,
                 "fieldId": 930555,
                 "objectType": "PRIMARY",
                 "traversalPath": "depemployee_DUMMY"
             }],
             "isRollupEnabled": "N",
             "configuredDateFormat": "MM/DD/YYYY",
             "formula": "multiply(depemployee_DUMMY.depnumber,depemployee_DUMMY.depdecimal)",
             "isOldRecordUpdateEnable": "N",
             "objectId": 71655,
             "displayFormula": "multiply(depemployee.DepNumber,depemployee.DepDecimal)"
         }
     };
     public formulafields = {
         "pfm71655": ["depnumber", "depdecimal"]
     };
     private dataPaths: Array < {
         traversalPath: string;requiredTemp: boolean
     } > = [{
         traversalPath: 'depemployee_DUMMY',
         requiredTemp: true
     }, {
         traversalPath: 'depemployee_DUMMY$$COR_USERS_depcoruser',
         requiredTemp: false
     }, ]
     private lookupPaths: {
         [lookupField: string]: Array < {
             traversalPath: string;requiredTemp: boolean
         } >
     } = {
         [this.__depcoruser$lookupIndepemployee]: [{
             traversalPath: 'depemployee_DUMMY$$COR_USERS_depcoruser',
             requiredTemp: false
         }, {
             traversalPath: 'depemployee_DUMMY',
             requiredTemp: false
         }]
     }
     public moreActionInfo = {}
     public pickListValues = {
         [this.__depemployee$tableName]: {}
     };
     constructor(public liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils, public cspfmLookupService: cspfmLookupService, public cspfmLayoutConfig: cspfmLayoutConfiguration, public datePipe: DatePipe, public dialog: MatDialog, public loadingCtrl: LoadingController, public router: Router, public pfmObjectConfig: cspfmObjectConfiguration, public activatRoute: ActivatedRoute, public applicationRef: ApplicationRef, public observableListenerUtils: cspfmObservableListenerUtils, public alerCtrl: AlertController, public modalCtrl: ModalController, public dataProvider: dataProvider, public formBuilder: FormBuilder, public appUtilityConfig: appUtility, public objectTableMapping: objectTableMapping, public lookupFieldMapping: lookupFieldMapping, private toastCtrl: ToastController, public executionCouchProvider: cspfmExecutionCouchDbProvider, public platform: Platform, private ngZone: NgZone, private changeRef: ChangeDetectorRef, public cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils, public cspfmDataDisplay: cspfm_data_display, public fieldTrackMapping: cspfmFieldTrackingMapping, public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils, public metaDbConfig: metaDbConfiguration, private cspfmConditionalFormattingUtils: cspfmConditionalFormattingUtils, private cspfmRecordAssociationUtils: cspfmRecordAssociationUtils, private cspfmConditionalValidationUtils: cspfmConditionalValidationUtils, private snackBar: MatSnackBar, public customField: cspfmCustomFieldProvider, public customActionUtils: cspfmCustomActionUtils, public slickgridUtils: cspfmSlickgridUtils,
         public cspfmFlatpickrConfig: cspfmFlatpickrConfig, @Inject(MAT_DIALOG_DATA) data,
         public dialogRef: MatDialogRef < depemployee_Entry_Web > , public dbService: couchdbProvider) {
         this.formgroupValidation = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['formgroupValidation']);
         this.customActionConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['customActionConfiguration']);
         this.associationConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['associationConfiguration']);
         if (data.hasOwnProperty('params')) {
             this.isPopUpEnabled = true;
             this.clearAllData();
             dialogRef.disableClose = true;
             if (Object.keys(data).length === 0 && data.constructor === Object) {
                 console.log("list query data skipped");
                 return
             }
             var params = data['params'];
             this.action = params['action'] ? params['action'] : "Add";
             this.parentId = params['parentId'];
             this.id = params['id'];

             this.loadDefaultValueFromCalendarFramework(params);

             if (params["isFromMenu"]) {
                 this.isFromMenu = params["isFromMenu"];
             }
             if (params["redirectUrl"]) {
                 this.redirectUrl = params["redirectUrl"];
             }
             if (this.parentId) {
                 this.isParentObjectShow = true;
             }
             this.initializeStatusWorkFlowFields();
             this.initializeObjects(dataProvider.tableStructure());


             if (this.action === 'Edit') {
                 this.id = params['id'];

                 this.fetchRecordAgainstSelectedObject();
                 if (this.isFromMenu) {
                     this.parentPopupAutoFillFlag = false;
                 } else {
                     this.parentPopupAutoFillFlag = true;
                 }
             } else {
                 this.isAssociationLoading = false;
                 this.initializeObjectsForAdd();
                 if (params["dataCloningInfo"]) {
                     this.dataCloningInfo = JSON.parse(params["dataCloningInfo"])
                 }
                 if (Array.isArray(this.dataCloningInfo) && this.dataCloningInfo.length !== 0) {
                     this.cloneOnDestinationLayout()
                 }



                 if (!this.action) {
                     this.action = 'Add';
                 }
                 this.appUtilityConfig.updateFormulaData(this);
             }


         } else {
             this.isPopUpEnabled = false;
             this.activatRoute.queryParams.subscribe(params => {
                 if (Object.keys(params).length === 0 && params.constructor === Object) {
                     console.log("list query params skipped");
                     return
                 }
                 this.clearAllData();
                 if (params["isFromMenu"]) {
                     this.isFromMenu = params["isFromMenu"];
                 }
                 if (params["redirectUrl"]) {
                     this.redirectUrl = params["redirectUrl"]
                 }
                 this.action = params['action'] ? params['action'] : "Add";
                 this.parentId = params['parentId'];
                 this.id = params['id'];
                 this.loadDefaultValueFromCalendarFramework(params);
                 if (this.parentId) {
                     this.isParentObjectShow = true;
                 }
                 this.initializeStatusWorkFlowFields();
                 this.initializeObjects(dataProvider.tableStructure());
                 if (this.action === 'Edit') {
                     this.id = params['id'];
                     this.fetchRecordAgainstSelectedObject();
                     if (this.isFromMenu) {
                         this.parentPopupAutoFillFlag = false;
                     } else {
                         this.parentPopupAutoFillFlag = true;
                     };
                 } else {
                     this.isAssociationLoading = false;
                     this.initializeObjectsForAdd();
                     if (params["dataCloningInfo"]) {
                         this.dataCloningInfo = JSON.parse(params["dataCloningInfo"])
                     }
                     if (Array.isArray(this.dataCloningInfo) && this.dataCloningInfo.length !== 0) {
                         this.cloneOnDestinationLayout()
                     }
                     if (!this.action) {
                         this.action = 'Add';
                     }
                     this.appUtilityConfig.updateFormulaData(this);
                 }
             });
         }
         this.registerRecordChangeListener();
         this.createFormGroup();
         if (this.isPopUpEnabled === true && this.dataCloningInfo.length > 0) {
             this.updateFormGroupForUrl()
         }
     }
     initializeObjectsForAdd() {

         this.checkboxinitialisationdepcheckbox_7773834();
         this.checkboxDefaultValuedepcheckbox_7773834();
         this.isSkeletonLoading = false;


     }
     registerRecordChangeListener() {
         this.appUtilityConfig.setEventSubscriptionlayoutIds(
             this.__depemployee$tableName,
             this.layoutId,
             appConstant.couchDBStaticName
         );

         this.observableListenerUtils.subscribe(this.layoutId, (modified) => {
             var type = modified['doc']['data']['type'];
             if (type + "_2_" + this.id === modified['id']) {

                 if (this.appUtilityConfig.userId !== modified['doc']['data']['lastmodifiedby']) {
                     const dialogConfig = new MatDialogConfig()
                     dialogConfig.data = {
                         title: 'This record is recently modified by other user. Kindly get recent changes before save',
                         subHeader: "",
                         buttonInfo: [{
                             "name": "OK",
                             "handler": () => {
                                 this.fetchRecordAgainstSelectedObject();
                             }
                         }],
                         parentContext: this,
                         type: "Alert"
                     };
                     dialogConfig.autoFocus = false

                     const isRecordDeleted = this.liveListenerHandlerUtils.handleLiveListenerForDelectedRecords('ENTRY', modified, this);
                     if (isRecordDeleted) {
                         return;
                     }


                 }


             }
         });
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
             this.isSkeletonLoading = false;
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
             this.selectedDataObject[this.__depemployee$tableName] = JSON.stringify(this.dataObject['depemployee_DUMMY_Temp']);





             if (this.dataObject['depemployee_DUMMY']['depdate']) {
                 this.dataObject['depemployee_DUMMY']['depdate'] = this.appUtilityConfig.getDateStringFromUtcTimeZoneMilliseconds(this.dataObject['depemployee_DUMMY']['depdate'], false)
             }
             if (this.dataObject['depemployee_DUMMY']['deptimestamp']) {
                 this.dataObject['depemployee_DUMMY']['deptimestamp'] = this.appUtilityConfig.getDateTimeStringFromUtcMilliseconds(this.dataObject['depemployee_DUMMY']['deptimestamp'], 'user')
             }

             this.checkboxinitialisationdepcheckbox_7773834();
             this.loadCheckboxEditValues('depcheckbox', this.pickListValues[this.__depemployee$tableName]['depcheckbox']);

             if (Object.keys(this.formulaConfigJSON).length > 0 && Object.keys(this.lookupCriteriaQueryConfig).length > 0) {
                 delete this.dataObject['depemployee_DUMMY']['pfm5_967501_searchKey'];
             }
             this.formGroup.patchValue({
                 [this.__depemployee$tableName]: this.dataObject['depemployee_DUMMY']
             });



             this.applicationRef.tick();


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
         this.saveObjects[this.__depemployee$tableName] = JSON.parse(JSON.stringify(this.dataObject['depemployee_DUMMY']));
         this.formGroup.patchValue({
             [this.__depemployee$tableName]: {
                 employeeid: this.saveObjects[this.__depemployee$tableName]['employeeid'],
                 employeename: this.saveObjects[this.__depemployee$tableName]['employeename'],
                 team: this.saveObjects[this.__depemployee$tableName]['team'],
                 location: this.saveObjects[this.__depemployee$tableName]['location'],
                 depboolean: this.saveObjects[this.__depemployee$tableName]['depboolean'],
                 depformulan: this.saveObjects[this.__depemployee$tableName]['depformulan'],
                 depdate: this.saveObjects[this.__depemployee$tableName]['depdate'],
                 deptimestamp: this.saveObjects[this.__depemployee$tableName]['deptimestamp'],
                 depnumber: this.saveObjects[this.__depemployee$tableName]['depnumber'],
                 depdecimal: this.saveObjects[this.__depemployee$tableName]['depdecimal'],
                 depcurrency: this.saveObjects[this.__depemployee$tableName]['depcurrency'],
                 depmultiselect: this.saveObjects[this.__depemployee$tableName]['depmultiselect'],
                 depcheckbox: this.saveObjects[this.__depemployee$tableName]['depcheckbox'],
                 pfm5_967501_searchKey: this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser']['username'],
                 depdropdownn: this.saveObjects[this.__depemployee$tableName]['depdropdownn']
             }
         });
         if (!this.saveObjects[this.__depemployee$tableName][this.__depcoruser$lookupIndepemployee]) {
             this.formGroup.patchValue({
                 [this.__depemployee$tableName]: {
                     pfm5_967501_searchKey: null
                 }
             });
             if (this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser'] && this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser']['username']) {
                 this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser']['username'] = null
             }

         }
         if (!this.appUtilityConfig.dateValidation(this.saveObjects[this.__depemployee$tableName]['depdate'])) {
             return;
         }
         if (!this.appUtilityConfig.datetimeValidation(this.saveObjects[this.__depemployee$tableName]['deptimestamp'])) {
             return;
         }
         if (this.formGroup.valid) {
             this.saveButtonClicked = true;
             if (this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser'] !== null && this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser']['id']) {
                 this.saveObjects[this.__depemployee$tableName][this.__depcoruser$lookupIndepemployee] = this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser']['id']
             }
             if (this.saveObjects[this.__depemployee$tableName]['depdate']) {
                 this.saveObjects[this.__depemployee$tableName]['depdate'] = this.appUtilityConfig.getUtcMillisecondsFromDateString(this.saveObjects[this.__depemployee$tableName]['depdate'], false)
             }
             if (this.saveObjects[this.__depemployee$tableName]['deptimestamp']) {
                 this.saveObjects[this.__depemployee$tableName]['deptimestamp'] = this.appUtilityConfig.getUtcTimeZoneMillsecondsFromDateTimeString(this.saveObjects[this.__depemployee$tableName]['deptimestamp'], "user")
             }
             if (this.saveObjects[this.__depemployee$tableName]['depnumber'] !== null) {
                 this.saveObjects[this.__depemployee$tableName]['depnumber'] = Number(this.saveObjects[this.__depemployee$tableName]['depnumber']);
             }
             if (this.saveObjects[this.__depemployee$tableName]['depdecimal'] !== null) {
                 this.saveObjects[this.__depemployee$tableName]['depdecimal'] = Number(this.saveObjects[this.__depemployee$tableName]['depdecimal']);
             }
             if (this.saveObjects[this.__depemployee$tableName]['depcurrency'] !== null) {
                 this.saveObjects[this.__depemployee$tableName]['depcurrency'] = Number(this.saveObjects[this.__depemployee$tableName]['depcurrency']);
             }
             this.isValidFrom = true;
             const fieldTrackObject = this.fieldTrackMapping.mappingDetail[this.__depemployee$tableName]
             if (fieldTrackObject) {
                 this.isFieldTrackingEnable = true;
             } else {
                 this.isFieldTrackingEnable = false;
             }
             let previousParentObject
             if (this.action === "Edit") {
                 previousParentObject = this.selectedDataObject[this.__depemployee$tableName];
             } else {
                 previousParentObject = undefined
             }
             this.cspfmRecordAssociationUtils.validateAssociationObjectSelection(this.associationConfiguration, this.saveObjects);
             if (this.parentId) {
                 this.saveObjects[this.__depemployee$tableName][this.parentName] = this.parentId;
             }
             this.showConsolidatePopup = false;
             this.dataProvider.saveWithValidation(this.action, appConstant.couchDBStaticName, this.__depemployee$tableName,
                     this.saveObjects[this.__depemployee$tableName], null).then(async (result) => {
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
         let formControls = this.formGroup.controls[this.__depemployee$tableName];
         let formGroupKeys = Object.keys(formControls["controls"]);
         let isValidationSucceed = true;
         formGroupKeys.every(element => {
             if (formControls["controls"][element].status === "INVALID") {
                 const documentElement = document.getElementById(this.__depemployee$tableName + "_" + element);
                 documentElement.scrollIntoView({
                     behavior: 'smooth'
                 });
                 isValidationSucceed = false;
                 return false;
             } else {
                 return true;
             }
         })
         if (!isValidationSucceed) {
             return;
         }

     };

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
     closeClick(objectRootPath, objectName, fieldName) {
         this.dataObject[objectRootPath][fieldName] = '';
         this.changeCallback(fieldName + "$$" + objectName)
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
             "redirectTo": "depemployee_d_w_view",
             "popUpEnabled": false
         };
         this.appUtilityConfig.presentToast(this.savedSuccessMessage);
         const primaryObj = this.objResultMap.get(this.__depemployee$tableName)
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
                 itemSaveNavigationParams['redirectUrl'] = "/menu/depemployee_Entry_Web"
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
         this.dataObject['depemployee_DUMMY'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject['depemployee_DUMMY_Temp'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser'] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
         //For lookupCriteria
         this.dataObject[this.__depemployee$tableName] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject[this.__depemployee$tableName + "Temp"] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
         this.dataObject[this.__depcoruser$lookupIndepemployee] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
         if (this.formGroup) {
             this.formGroup.patchValue({
                 [this.__depemployee$tableName]: this.dataObject['depemployee_DUMMY']
             });
         }
     }
     childObjectList = [];
     objResultMap = new Map < string, any > ();
     objDisplayName = {
         'pfm71655': 'depemployee',
     };
     checkboxinitialisationdepcheckbox_7773834() {
         this.pickListValues[this.__depemployee$tableName]['depcheckbox'] = [{
             val: "COption1",
             displayName: "depemployee.depcheckbox.Option.COption1",
             isChecked: false
         }, {
             val: "COption2",
             displayName: "depemployee.depcheckbox.Option.COption2",
             isChecked: false
         }, {
             val: "COption3",
             displayName: "depemployee.depcheckbox.Option.COption3",
             isChecked: false
         }];
     }
     checkboxDefaultValuedepcheckbox_7773834() {
         this.pickListValues[this.__depemployee$tableName]['depcheckbox'] = [{
             val: "COption1",
             displayName: "depemployee.depcheckbox.Option.COption1",
             isChecked: false
         }, {
             val: "COption2",
             displayName: "depemployee.depcheckbox.Option.COption2",
             isChecked: false
         }, {
             val: "COption3",
             displayName: "depemployee.depcheckbox.Option.COption3",
             isChecked: false
         }];
     }
     loadCheckboxEditValues(fieldName, values) {
         if (this.dataObject['depemployee_DUMMY'][fieldName] !== undefined && this.dataObject['depemployee_DUMMY'][fieldName] !== null && values.length > 0) {
             for (let item of values) {
                 for (let itemVal of this.dataObject['depemployee_DUMMY'][fieldName]) {
                     if (item.val === itemVal) {
                         item.isChecked = true
                     }
                 }
             }

         }
     }
     loadDefaultValues() {}
     createFormGroup() {
         this.formGroup = this.formBuilder.group({
             [this.__depemployee$tableName]: this.formBuilder.group({
                 employeeid: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['employeeid']['validator'])],
                 employeename: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['employeename']['validator'])],
                 team: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['team']['validator'])],
                 location: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['location']['validator'])],
                 depboolean: [true, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['depboolean']['validator'])],
                 depformulan: [null],
                 depdate: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['depdate']['validator'])],
                 deptimestamp: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['deptimestamp']['validator'])],
                 depnumber: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['depnumber']['validator'])],
                 depdecimal: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['depdecimal']['validator'])],
                 depcurrency: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['depcurrency']['validator'])],
                 depmultiselect: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['depmultiselect']['validator'])],
                 depcheckbox: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['depcheckbox']['validator'])],
                 pfm5_967501_searchKey: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['pfm5_967501_searchKey']['validator'])],
                 depdropdownn: [null, Validators.compose(this.formgroupValidation[this.__depemployee$tableName]['depdropdownn']['validator'])]
             })
         });
         this.formGroupUpdate();
     }
     clearAllData() {
         this.objResultMap = new Map < string, any > ();
         this.dependentFieldTriggerList = {}
         this.dataObject['depemployee_DUMMY'] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depemployee$tableName]));
         this.obj_pfm71655_Temp = {};
         if (this.formGroup) {
             this.formGroup.reset();
         }
         this.formulaObject = {}
         this.dataObject['depemployee_DUMMY_Temp'] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depemployee$tableName]));
         this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser'] = "";
         this.pfm5_967501_searchKey = '';
         this.dataObject[this.__depemployee$tableName] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depemployee$tableName]));
         this.dataObject[this.__depemployee$tableName + "Temp"] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depemployee$tableName]));
         this.dataObject[this.__depcoruser$lookupIndepemployee] = "";
         this.checkboxinitialisationdepcheckbox_7773834();
         this.checkboxDefaultValuedepcheckbox_7773834();
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
         if (objectRootPath === 'depemployee_DUMMY$$COR_USERS_depcoruser') {
             this.pfm5_967501_searchKey = '';
             this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depemployee_DUMMY', 'depemployee_DUMMY', this.__depcoruser$lookupIndepemployee, selectedValue, this.layoutId);
             this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__depcoruser$lookupIndepemployee], this.dataObject['depemployee_DUMMY'], this.dataObject, this.layoutId);
             this.dataObject['depemployee_DUMMY'][this.__depcoruser$lookupIndepemployee] = this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser'].id;
             fieldName = this.__depcoruser$lookupIndepemployee;
             this.makeFormGroupDirty(this.__depemployee$tableName, this.__depcoruser$lookupIndepemployee)



             this.conditionalFormatRelationshipDataObject['depemployee_DUMMY$$COR_USERS_depcoruser'] = this.dataObject['depemployee_DUMMY$$COR_USERS_depcoruser']



             this.changeCallback(fieldName + "$$depemployee");
             return;
         }
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
     onChangeCheckbox(checkBoxMappingList, userSelectedState, selectedFieldJSON, userSelectedField, dataObject, objectName, fieldName ? ) {
         let selectedValues: any = [];
         userSelectedState.isChecked = userSelectedState.isChecked ? false : true
         for (let state of checkBoxMappingList) {
             if (state.val === userSelectedState.val) {
                 state.isChecked = userSelectedState.isChecked
             }
             if (state.isChecked) {
                 selectedValues.push(state.val)
             }
         }
         this.makeFormGroupDirty(objectName, userSelectedField);
         dataObject[userSelectedField] = selectedValues;
         this.formGroup.patchValue({
             [objectName]: {
                 [userSelectedField]: selectedValues
             }
         });;
     }
     resetChildDependentInfo(objectName, dataObjectFieldName, looklUpObj, lookupObjectFieldName, formControlerName) {

     }
     ionViewDidEnter() {
         this.dataObject['depemployee_DUMMY'] = JSON.parse(JSON.stringify(this.dataObject['depemployee_DUMMY']))
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
             let data = JSON.parse(params['calendarParams']);
             let fieldInfo = data['fieldInfo'];
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
                 this.dataObject['depemployee_DUMMY'][fieldToLoad] = dateVal
             }, 1000)
         }
     }
     updateFormGroupForUrl() {
         this.dataCloningInfo.forEach(clonedInfo => {
             if (clonedInfo["fieldType"] === "URL" && clonedInfo["destinationFieldInfo"]["destinationFieldValue"]) {
                 this.formGroup.patchValue({
                     [this.__depemployee$tableName]: {
                         [clonedInfo["destinationFieldInfo"]["destinationFieldName"]]: clonedInfo["destinationFieldInfo"]["destinationFieldValue"]
                     }
                 })
             }
         })
     }
     cloneOnDestinationLayout() {
         this.isDataCloned = true
         this.dataCloningInfo = this.cspfmLookupCriteriaUtils.handleLookupCriteriaInvolvedClonedFields(this.dataCloningInfo, this.lookupCriteriaValidationFields)
         this.clonedDataFieldDetails = this.cspfmDataTraversalUtilsObject.updateAndGetClonedData(this.dataCloningInfo, this.dataPaths, this.lookupPaths, this.dataObject, this.pickListValues, 'depemployee_DUMMY', this.layoutId)


         if (this.isPopUpEnabled === false) {
             this.updateFormGroupForUrl()
         }
         this.clonedFields = this.appUtilityConfig.initializeClonedFieldsForEntry(this.clonedDataFieldDetails, this.objectTableMapping.mappingDetail)

     }
     initializeStatusWorkFlowFields() {}
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
                     redirectUrl: "/menu/depemployee_Entry_Web"
                 };
                 this.router.navigate(["/menu/depemployee_d_w_view"], {
                     queryParams: itemSaveNavigationParams,
                     skipLocationChange: true
                 });
             } else if (!this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                 const itemSaveNavigationParams = {
                     id: this.id,
                     redirectUrl: "/menu/depemployee_Entry_Web"
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
         this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depemployee_DUMMY', dataRootPath, dataObjectFieldName, null, this.layoutId);
         this.dataObject[objectRootPath] = isStandardObject ?
             JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[lookupObjectName])) :
             JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[lookupObjectName]));
         this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[dataObjectFieldName], this.dataObject['depemployee_DUMMY'], this.dataObject, this.layoutId);
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


         this.changeCallback(dataObjectFieldName + '$$depemployee')
     }
     recordDiscardConfirmAlert() {
         const dialogConfig = new MatDialogConfig()
         dialogConfig.data = {
             title: 'Are you sure want to leave this page?',
             buttonInfo: [{
                 'name': 'Cancel',
                 'handler': () => {
                     this.customAlert = null;
                     console.log('Individual clicked');
                 }
             }, {
                 'name': 'Yes',
                 'handler': () => {
                     this.navigatePopUpAction();
                 }
             }],
             parentContext: this,
             type: 'Alert'
         };
         dialogConfig.autoFocus = false
         this.dialog.open(cspfmAlertDialog, dialogConfig);
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
     ionViewWillLeave() {
         this.backButtonSubscribeRef.unsubscribe();
     }
     ngOnDestroy() {
         this.slickgridUtils.flatpickerAddRemove('weblookup', 'remove');
         this.observableListenerUtils.remove(this.layoutId, '==');
         this.appUtilityConfig.removeEventSubscriptionlayoutIds(this.__depemployee$tableName, this.layoutId, appConstant.couchDBStaticName)
     }
     ngOnInit() {}
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

     listButton_7773856_Onclick() {

         var redirectUrlForNav = '/menu/depemployee_Entry_Web';

         const stackArray = document.getElementsByTagName('ion-router-outlet')[1].children
         if (stackArray[stackArray.length - 1].tagName.toLowerCase() !== "depemployee_d_w_list") {
             this.toastCtrl.dismiss();
             const queryParamsRouting = {};
             if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depemployee_d_w_list")) {
                 queryParamsRouting['redirectUrl'] = redirectUrlForNav
             }

             if (this.isPopUpEnabled) {
                 this.appUtilityConfig.navigationDiscardConfirmAlert("/menu/depemployee_d_w_list", queryParamsRouting, false, this);
             } else {
                 this.router.navigate(["/menu/depemployee_d_w_list"], {
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