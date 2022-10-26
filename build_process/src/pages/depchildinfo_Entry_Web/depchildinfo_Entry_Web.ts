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
    selector: 'depchildinfo_Entry_Web',
    templateUrl: 'depchildinfo_Entry_Web.html'
}) export class depchildinfo_Entry_Web implements OnInit {
    isCustomFetchLoading = false;
    dripDownAttribute = '';
    public dataObject = {};
    public flatpickerInstances = {};
    public associateDoc = {};
    public clonedFields = {};
    public associationConfiguration = {};
    public team_930594_7775067 = this.pfmObjectConfig.objectConfiguration['pfm71658']['selectionFieldsMapping']['team'];
    public location_930595_7775054 = this.pfmObjectConfig.objectConfiguration['pfm71658']['selectionFieldsMapping']['location'];
    public depmultiselect_967503_7775069 = this.pfmObjectConfig.objectConfiguration['pfm71658']['selectionFieldsMapping']['depmultiselect'];
    public depcheckbox_967504_7775066 = this.pfmObjectConfig.objectConfiguration['pfm71658']['selectionFieldsMapping']['depcheckbox'];
    public lookupReadonlyFieldInfo: {
        [elementKey: string]: FieldInfo
    } = {
        "depchildinfo_DUMMY$$depemployee_depclookup1$$employeename": {
            "id": "employeename",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$depemployee_depclookup1$$employeename.employeename",
            "fieldName": "employeename",
            "prop": "employeename",
            "fieldType": "TEXT",
            "objectName": "depemployee",
            "elementid": 7775048,
            "traversalpath": "depchildinfo_DUMMY$$depemployee_depclookup1$$employeename",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "depchildinfo_DUMMY$$depemployee_depclookup2$$employeename": {
            "id": "employeename",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$depemployee_depclookup2$$employeename.employeename",
            "fieldName": "employeename",
            "prop": "employeename",
            "fieldType": "TEXT",
            "objectName": "depemployee",
            "elementid": 7775043,
            "traversalpath": "depchildinfo_DUMMY$$depemployee_depclookup2$$employeename",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        }
    }
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
    public __depchildinfo$tableName = this.objectTableMapping.mappingDetail['depchildinfo'];
    public dbServiceProvider = appConstant.couchDBStaticName;
    public layoutId = '213014';
    public isDataCloned = false;
    public layoutName = 'depchildinfo_Entry_Web';
    public entryPageType = 'drawerentry';
    public isStateFieldDisabled = false;
    public ionDateTimeDisplayValue = {};
    public obj_pfm74408_Temp: any = {};
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
        "objectId": "74408",
        "referenceObjectId": "0",
        "objectName": "depchildinfo",
        "isStandardObject": "N",
        "rootPath": "depchildinfo_DUMMY",
        "fieldId": "0",
        "relationShipType": "null",
        "objectType": "PRIMARY",
        "childObject": [{
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
            "childObject": [{
                "objectId": "5",
                "fieldId": "967501",
                "objectName": "COR_USERS",
                "objectType": "LOOKUP",
                "referenceObjectId": 71655,
                "rootPath": "depchildinfo_DUMMY$$depemployee_depclookup4$$COR_USERS_depcoruser",
                "isStandardObject": "Y",
                "relationShipType": "",
                "includeFields": false,
                "childObject": []
            }]
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
            }]
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
            "childObject": [{
                "objectId": "5",
                "fieldId": "967501",
                "objectName": "COR_USERS",
                "objectType": "LOOKUP",
                "referenceObjectId": 71655,
                "rootPath": "depchildinfo_DUMMY$$depemployee_depclookup3$$COR_USERS_depcoruser",
                "isStandardObject": "Y",
                "relationShipType": "",
                "includeFields": false,
                "childObject": []
            }]
        }, {
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
            "childObject": [{
                "objectId": "5",
                "fieldId": "967501",
                "objectName": "COR_USERS",
                "objectType": "LOOKUP",
                "referenceObjectId": 71655,
                "rootPath": "depchildinfo_DUMMY$$depemployee_depclookup1$$COR_USERS_depcoruser",
                "isStandardObject": "Y",
                "relationShipType": "",
                "includeFields": false,
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
            "childObject": [{
                "objectId": "5",
                "fieldId": "967501",
                "objectName": "COR_USERS",
                "objectType": "LOOKUP",
                "referenceObjectId": 71655,
                "rootPath": "depchildinfo_DUMMY$$depemployee_depclookup2$$COR_USERS_depcoruser",
                "isStandardObject": "Y",
                "relationShipType": "",
                "includeFields": false,
                "childObject": []
            }]
        }],
        "formulaField": [{
            "fieldName": "depcformula1"
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
    public __COR_USERS$tableName = this.objectTableMapping.mappingDetail['COR_USERS'];
    private pfm5_967510_searchKey;
    private pfm5_967501_searchKey;
    private pfm5_967712_searchKey;
    public __depemployee$tableName = this.objectTableMapping.mappingDetail['depemployee'];
    private pfm71655_967507_searchKey;
    private pfm71655_967516_searchKey;
    private tableName_pfm74408 = 'pfm74408';
    private tableName_pfm71658 = 'pfm71658';
    private pfm71655_967514_searchKey;
    private pfm71655_965870_searchKey;
    private pfm71655_964453_searchKey;
    private pfm71655_965872_searchKey;
    private pfm71655_967505_searchKey;
    private pfm71655_930602_searchKey;
    public depdropdownn_972310mapping = this.pfmObjectConfig.objectConfiguration[this.__depchildinfo$tableName]['selectionFieldsMappingForEntry']['depdropdownn'];
    public __deppersonalinfo$tableName = this.objectTableMapping.mappingDetail['deppersonalinfo'];
    public rollUpGridFieldInfo: {
        [elementKey: string]: FieldInfo
    } = {}
    public __depcoruser$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depcoruser'];
    public __depcoruser$lookupIndepemployee = this.lookupFieldMapping.mappingDetail[this.__depemployee$tableName]['depcoruser'];
    public __depcoruser$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['depcoruser'];
    public __deplookup4$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup4'];
    public __depclookup4$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depclookup4'];
    public __depclookup3$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depclookup3'];
    public __depclookup1$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depclookup1'];
    public __deplookup2$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup2'];
    public __depclookup2$lookupIndepchildinfo = this.lookupFieldMapping.mappingDetail[this.__depchildinfo$tableName]['depclookup2'];
    public __deplookup3$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup3'];
    public __deplookup$lookupIndeppersonalinfo = this.lookupFieldMapping.mappingDetail[this.__deppersonalinfo$tableName]['deplookup'];
    public formulaConfigJSON: {
        [elementKey: string]: FormulaConfig
    } = {
        "pfm74408_depcformula1_7775047": {
            "isReturnBlankEnable": "N",
            "fieldName": "depcformula1",
            "formulaType": "NUMBER",
            "configuredTimezone": "Asia/Calcutta",
            "involvedFields": [{
                "fieldName": "depcname1",
                "fieldType": "TEXT",
                "objectId": 74408,
                "fieldId": 965866,
                "objectType": "PRIMARY",
                "traversalPath": "depchildinfo_DUMMY"
            }],
            "isRollupEnabled": "N",
            "configuredDateFormat": "MM/DD/YYYY",
            "formula": "length(depchildinfo_DUMMY.depcname1)",
            "isOldRecordUpdateEnable": "N",
            "objectId": 74408,
            "displayFormula": "depchildinfo.DepC Name1.length()"
        }
    };
    public formulafields = {
        "pfm74408": ["depcname1"]
    };
    private dataPaths: Array < {
        traversalPath: string;requiredTemp: boolean
    } > = [{
        traversalPath: 'depchildinfo_DUMMY$$COR_USERS_depcoruser',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup4$$COR_USERS_depcoruser',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup1$$COR_USERS_depcoruser',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup4',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY',
        requiredTemp: true
    }, {
        traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup3$$COR_USERS_depcoruser',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup3',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup1',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup2',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup2$$COR_USERS_depcoruser',
        requiredTemp: false
    }, {
        traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup',
        requiredTemp: false
    }, ]
    private lookupPaths: {
        [lookupField: string]: Array < {
            traversalPath: string;requiredTemp: boolean
        } >
    } = {
        [this.__depcoruser$lookupIndepchildinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$COR_USERS_depcoruser',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }],
        [this.__depcoruser$lookupIndepemployee]: [{
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup4$$COR_USERS_depcoruser',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup4',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }],
        [this.__depcoruser$lookupIndeppersonalinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }],
        [this.__depcoruser$lookupIndepemployee]: [{
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup1$$COR_USERS_depcoruser',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup1',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }],
        [this.__deplookup4$lookupIndeppersonalinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }],
        [this.__depclookup4$lookupIndepchildinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup4',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup4$$COR_USERS_depcoruser',
            requiredTemp: false
        }],
        [this.__depcoruser$lookupIndepemployee]: [{
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup3$$COR_USERS_depcoruser',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup3',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }],
        [this.__depclookup3$lookupIndepchildinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup3',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup3$$COR_USERS_depcoruser',
            requiredTemp: false
        }],
        [this.__depclookup1$lookupIndepchildinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup1',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup1$$COR_USERS_depcoruser',
            requiredTemp: false
        }],
        [this.__deplookup2$lookupIndeppersonalinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }],
        [this.__depclookup2$lookupIndepchildinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup2',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup2$$COR_USERS_depcoruser',
            requiredTemp: false
        }],
        [this.__deplookup3$lookupIndeppersonalinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }],
        [this.__depcoruser$lookupIndepemployee]: [{
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup2$$COR_USERS_depcoruser',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$depemployee_depclookup2',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }],
        [this.__deplookup$lookupIndeppersonalinfo]: [{
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3',
            requiredTemp: false
        }],
        [this.__deppersonalinfo$tableName]: [{
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3',
            requiredTemp: false
        }, {
            traversalPath: 'depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup',
            requiredTemp: false
        }]
    }
    public moreActionInfo = {}
    public workFlowActionConfig = {};
    public pickListValues = {
        [this.__deppersonalinfo$tableName]: {},
        [this.__depchildinfo$tableName]: {}
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
        public dialogRef: MatDialogRef < depchildinfo_Entry_Web > , public dbService: couchdbProvider) {
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
            this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'] = {};
            this.action = params['action'] ? params['action'] : "Add";
            this.parentId = params['parentId'];
            this.parentObj = params['parentObj'];
            this.id = params['id'];
            this.loadDefaultValueFromCalendarFramework(params);

            this.initializeObjects(dataProvider.tableStructure());
            if (this.parentId) {
                this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'] = JSON.parse(params['parentObj']);
                this.isParentObjectShow = true;
                if (this.action !== 'Edit') {
                    this.fetchHeaderObjectData()
                }
            }
            if (Object.keys(this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster']).length === 0 && this.action !== 'Edit') {
                this.isSkeletonLoading = true;
                this.parentId = "";
                this.showLookup(null, 'pfm71658_965874')
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
                    this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'] = JSON.parse(params['parentObj']);

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
                this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'] = {};
                this.isFromCalendar = params['isFromCalendarNavigation'];
                if (this.isFromCalendar) {
                    this.calendarParams = JSON.parse(params['calendarParams']);
                    this.calendarParams['isFromCalendarNavigation'] = params['isFromCalendarNavigation'];
                }
                this.loadDefaultValueFromCalendarFramework(params);
                this.initializeObjects(dataProvider.tableStructure());
                if (params['parentObj']) {
                    this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'] = JSON.parse(params['parentObj']);
                    this.parentId = params['parentId'];
                    this.id = params['id'];
                    if (this.action !== 'Edit') {
                        this.fetchHeaderObjectData()
                    }
                } else if (!params['parentObj'] && this.action !== 'Edit' || typeof(this.action) === "undefined") {
                    this.isSkeletonLoading = true;
                    this.parentId = "";
                    this.showLookup(null, 'pfm71658_965874')
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
            this.selectedDataObject[this.__depchildinfo$tableName] = JSON.stringify(this.dataObject['depchildinfo_DUMMY_Temp']);

            if (this.dataObject['depchildinfo_DUMMY'][this.__deppersonalinfo$tableName]) {
                this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'] = this.dataObject['depchildinfo_DUMMY'][this.__deppersonalinfo$tableName]
                if (!this.parentId) {
                    this.parentObject = this.dataObject['depchildinfo_DUMMY'][this.__deppersonalinfo$tableName]
                    this.parentId = this.dataObject['depchildinfo_DUMMY'][this.__deppersonalinfo$tableName]['id']
                }
            }



            if (this.dataObject['depchildinfo_DUMMY']['depcdate1']) {
                this.dataObject['depchildinfo_DUMMY']['depcdate1'] = this.appUtilityConfig.getDateStringFromUtcTimeZoneMilliseconds(this.dataObject['depchildinfo_DUMMY']['depcdate1'], false)
            }
            if (this.dataObject['depchildinfo_DUMMY']['depdate']) {
                this.dataObject['depchildinfo_DUMMY']['depdate'] = this.appUtilityConfig.getDateStringFromUtcTimeZoneMilliseconds(this.dataObject['depchildinfo_DUMMY']['depdate'], false)
            }
            if (this.dataObject['depchildinfo_DUMMY']['deptimestamp']) {
                this.dataObject['depchildinfo_DUMMY']['deptimestamp'] = this.appUtilityConfig.getDateTimeStringFromUtcMilliseconds(this.dataObject['depchildinfo_DUMMY']['deptimestamp'], 'user')
            }



            if (Object.keys(this.formulaConfigJSON).length > 0 && Object.keys(this.lookupCriteriaQueryConfig).length > 0) {
                delete this.dataObject['depchildinfo_DUMMY']['pfm71655_965870_searchKey'];
                delete this.dataObject['depchildinfo_DUMMY']['pfm71655_965872_searchKey'];
                delete this.dataObject['depchildinfo_DUMMY']['pfm5_967510_searchKey'];
                delete this.dataObject['depchildinfo_DUMMY']['pfm71655_967514_searchKey'];
                delete this.dataObject['depchildinfo_DUMMY']['pfm71655_967516_searchKey'];
            }
            this.formGroup.patchValue({
                [this.__depchildinfo$tableName]: this.dataObject['depchildinfo_DUMMY']
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
        this.saveObjects[this.__depchildinfo$tableName] = JSON.parse(JSON.stringify(this.dataObject['depchildinfo_DUMMY']));
        this.formGroup.patchValue({
            [this.__depchildinfo$tableName]: {
                depcname: this.saveObjects[this.__depchildinfo$tableName]['depcname'],
                depcname1: this.saveObjects[this.__depchildinfo$tableName]['depcname1'],
                depcdate1: this.saveObjects[this.__depchildinfo$tableName]['depcdate1'],
                depcnum1: this.saveObjects[this.__depchildinfo$tableName]['depcnum1'],
                depccurrency1: this.saveObjects[this.__depchildinfo$tableName]['depccurrency1'],
                depboolean: this.saveObjects[this.__depchildinfo$tableName]['depboolean'],
                depnumber: this.saveObjects[this.__depchildinfo$tableName]['depnumber'],
                depcformula1: this.saveObjects[this.__depchildinfo$tableName]['depcformula1'],
                depdate: this.saveObjects[this.__depchildinfo$tableName]['depdate'],
                pfm71655_965870_searchKey: this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1']['employeeid'],
                pfm71655_965872_searchKey: this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2']['employeeid'],
                pfm5_967510_searchKey: this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser']['username'],
                deptimestamp: this.saveObjects[this.__depchildinfo$tableName]['deptimestamp'],
                depdecimal: this.saveObjects[this.__depchildinfo$tableName]['depdecimal'],
                pfm71655_967514_searchKey: this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3']['employeeid'],
                pfm71655_967516_searchKey: this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4']['employeeid'],
                depdropdownn: this.saveObjects[this.__depchildinfo$tableName]['depdropdownn']
            }
        });
        if (!this.saveObjects[this.__depchildinfo$tableName][this.__depclookup1$lookupIndepchildinfo]) {
            this.formGroup.patchValue({
                [this.__depchildinfo$tableName]: {
                    pfm71655_965870_searchKey: null
                }
            });
            if (this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'] && this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1']['employeeid']) {
                this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1']['employeeid'] = null
            }

        }
        if (!this.saveObjects[this.__depchildinfo$tableName][this.__depclookup2$lookupIndepchildinfo]) {
            this.formGroup.patchValue({
                [this.__depchildinfo$tableName]: {
                    pfm71655_965872_searchKey: null
                }
            });
            if (this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'] && this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2']['employeeid']) {
                this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2']['employeeid'] = null
            }

        }
        if (!this.saveObjects[this.__depchildinfo$tableName][this.__depcoruser$lookupIndepchildinfo]) {
            this.formGroup.patchValue({
                [this.__depchildinfo$tableName]: {
                    pfm5_967510_searchKey: null
                }
            });
            if (this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser'] && this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser']['username']) {
                this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser']['username'] = null
            }

        }
        if (!this.saveObjects[this.__depchildinfo$tableName][this.__depclookup3$lookupIndepchildinfo]) {
            this.formGroup.patchValue({
                [this.__depchildinfo$tableName]: {
                    pfm71655_967514_searchKey: null
                }
            });
            if (this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'] && this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3']['employeeid']) {
                this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3']['employeeid'] = null
            }

        }
        if (!this.saveObjects[this.__depchildinfo$tableName][this.__depclookup4$lookupIndepchildinfo]) {
            this.formGroup.patchValue({
                [this.__depchildinfo$tableName]: {
                    pfm71655_967516_searchKey: null
                }
            });
            if (this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'] && this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4']['employeeid']) {
                this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4']['employeeid'] = null
            }

        }
        if (!this.appUtilityConfig.dateValidation(this.saveObjects[this.__depchildinfo$tableName]['depcdate1'])) {
            return;
        }
        if (!this.appUtilityConfig.dateValidation(this.saveObjects[this.__depchildinfo$tableName]['depdate'])) {
            return;
        }
        if (!this.appUtilityConfig.datetimeValidation(this.saveObjects[this.__depchildinfo$tableName]['deptimestamp'])) {
            return;
        }
        if (this.formGroup.valid) {
            this.saveButtonClicked = true;
            if (this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'] !== null && this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1']['id']) {
                this.saveObjects[this.__depchildinfo$tableName][this.__depclookup1$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1']['id']
            }
            if (this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'] !== null && this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2']['id']) {
                this.saveObjects[this.__depchildinfo$tableName][this.__depclookup2$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2']['id']
            }
            if (this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser'] !== null && this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser']['id']) {
                this.saveObjects[this.__depchildinfo$tableName][this.__depcoruser$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser']['id']
            }
            if (this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'] !== null && this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3']['id']) {
                this.saveObjects[this.__depchildinfo$tableName][this.__depclookup3$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3']['id']
            }
            if (this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'] !== null && this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4']['id']) {
                this.saveObjects[this.__depchildinfo$tableName][this.__depclookup4$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4']['id']
            }
            if (this.saveObjects[this.__depchildinfo$tableName]['depcdate1']) {
                this.saveObjects[this.__depchildinfo$tableName]['depcdate1'] = this.appUtilityConfig.getUtcMillisecondsFromDateString(this.saveObjects[this.__depchildinfo$tableName]['depcdate1'], false)
            }
            if (this.saveObjects[this.__depchildinfo$tableName]['depdate']) {
                this.saveObjects[this.__depchildinfo$tableName]['depdate'] = this.appUtilityConfig.getUtcMillisecondsFromDateString(this.saveObjects[this.__depchildinfo$tableName]['depdate'], false)
            }
            if (this.saveObjects[this.__depchildinfo$tableName]['deptimestamp']) {
                this.saveObjects[this.__depchildinfo$tableName]['deptimestamp'] = this.appUtilityConfig.getUtcTimeZoneMillsecondsFromDateTimeString(this.saveObjects[this.__depchildinfo$tableName]['deptimestamp'], "user")
            }
            if (this.saveObjects[this.__depchildinfo$tableName]['depcnum1'] !== null) {
                this.saveObjects[this.__depchildinfo$tableName]['depcnum1'] = Number(this.saveObjects[this.__depchildinfo$tableName]['depcnum1']);
            }
            if (this.saveObjects[this.__depchildinfo$tableName]['depccurrency1'] !== null) {
                this.saveObjects[this.__depchildinfo$tableName]['depccurrency1'] = Number(this.saveObjects[this.__depchildinfo$tableName]['depccurrency1']);
            }
            if (this.saveObjects[this.__depchildinfo$tableName]['depnumber'] !== null) {
                this.saveObjects[this.__depchildinfo$tableName]['depnumber'] = Number(this.saveObjects[this.__depchildinfo$tableName]['depnumber']);
            }
            if (this.saveObjects[this.__depchildinfo$tableName]['depdecimal'] !== null) {
                this.saveObjects[this.__depchildinfo$tableName]['depdecimal'] = Number(this.saveObjects[this.__depchildinfo$tableName]['depdecimal']);
            }
            this.isValidFrom = true;
            const fieldTrackObject = this.fieldTrackMapping.mappingDetail[this.__depchildinfo$tableName]
            if (fieldTrackObject) {
                this.isFieldTrackingEnable = true;
            } else {
                this.isFieldTrackingEnable = false;
            }
            let previousParentObject
            if (this.action === "Edit") {
                previousParentObject = this.selectedDataObject[this.__depchildinfo$tableName];
            } else {
                previousParentObject = undefined
            }
            this.cspfmRecordAssociationUtils.validateAssociationObjectSelection(this.associationConfiguration, this.saveObjects);
            if (this.parentId) {
                this.saveObjects[this.__depchildinfo$tableName][this.parentName] = this.parentId;
            }
            this.showConsolidatePopup = false;
            this.dataProvider.saveWithValidation(this.action, appConstant.couchDBStaticName, this.__depchildinfo$tableName,
                    this.saveObjects[this.__depchildinfo$tableName], null).then(async (result) => {
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
                                        this.dataObject['depchildinfo_DUMMY'] = {};
                                        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'] = {};
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
        const formControls = this.formGroup.controls[this.__depchildinfo$tableName];
        const formGroupKeys = Object.keys(formControls["controls"]);
        let isValidationSucceed = true;
        formGroupKeys.every(element => {
            if (formControls["controls"][element].status === "INVALID") {
                const documentElement = document.getElementById(this.__depchildinfo$tableName + "_" + element);
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
            "redirectTo": "depchildinfo_d_w_hl_detail_view",
            "popUpEnabled": false
        };
        this.appUtilityConfig.presentToast(this.savedSuccessMessage);
        const primaryObj = this.objResultMap.get(this.__depchildinfo$tableName)
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
                itemSaveNavigationParams['redirectUrl'] = "/menu/depchildinfo_Entry_Web"
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
        this.dataObject['depchildinfo_DUMMY'] = JSON.parse(JSON.stringify(tableStructure[this.__depchildinfo$tableName]));
        this.dataObject['depchildinfo_DUMMY_Temp'] = JSON.parse(JSON.stringify(tableStructure[this.__depchildinfo$tableName]));
        this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser'] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4$$COR_USERS_depcoruser'] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser'] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1$$COR_USERS_depcoruser'] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3$$COR_USERS_depcoruser'] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2$$COR_USERS_depcoruser'] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup'] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        //For lookupCriteria
        this.dataObject[this.__depchildinfo$tableName] = JSON.parse(JSON.stringify(tableStructure[this.__depchildinfo$tableName]));
        this.dataObject[this.__depchildinfo$tableName + "Temp"] = JSON.parse(JSON.stringify(tableStructure[this.__depchildinfo$tableName]));
        this.dataObject[this.__depcoruser$lookupIndepchildinfo] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject[this.__depcoruser$lookupIndepemployee] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject[this.__depcoruser$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject[this.__depcoruser$lookupIndepemployee] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject[this.__deplookup4$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject[this.__depclookup4$lookupIndepchildinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject[this.__depcoruser$lookupIndepemployee] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject[this.__depclookup3$lookupIndepchildinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject[this.__depclookup1$lookupIndepchildinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject[this.__deplookup2$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject[this.__depclookup2$lookupIndepchildinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject[this.__deplookup3$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        this.dataObject[this.__depcoruser$lookupIndepemployee] = JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[this.__COR_USERS$tableName]));
        this.dataObject[this.__deplookup$lookupIndeppersonalinfo] = JSON.parse(JSON.stringify(tableStructure[this.__depemployee$tableName]));
        if (this.formGroup) {
            this.formGroup.patchValue({
                [this.__depchildinfo$tableName]: this.dataObject['depchildinfo_DUMMY']
            });
        }
    }
    childObjectList = [];
    objResultMap = new Map < string, any > ();
    objDisplayName = {
        'pfm74408': 'depchildinfo',
    };
    public depchildinfo_depboolean_lookupDependentFields = {
        "changesApplyFields": {
            "pfm74408": ["pfm71655_967514"]
        },
        "immediateParentId": {},
        "immediateParentLabel": {},
        "immediateParentType": {},
        "parentFields": {}
    };
    public depchildinfo_depdate_lookupDependentFields = {
        "changesApplyFields": {
            "pfm74408": ["pfm71655_965870", "pfm71655_967516", "pfm71655_965872"]
        },
        "immediateParentId": {},
        "immediateParentLabel": {},
        "immediateParentType": {},
        "parentFields": {}
    };
    public depchildinfo_pfm71655_965870_lookupDependentFields = {
        "changesApplyFields": {
            "pfm74408": ["pfm71655_965870"]
        },
        "immediateParentId": {
            "pfm74408": ["depdate"],
            "pfm71658": ["depcurrency", "team"]
        },
        "immediateParentLabel": {
            "pfm74408": ["DepDate"],
            "pfm71658": ["DepCurrency", "Team"]
        },
        "immediateParentType": {
            "pfm74408": ["DATE"],
            "pfm71658": ["CURRENCY", "DROPDOWN"]
        },
        "parentFields": {
            "pfm71658": {
                "depchildinfo_pfm71655_965870": 4,
                "deppersonalinfo_team": 2,
                "deppersonalinfo_depcurrency": 1
            },
            "pfm74408": {
                "depchildinfo_pfm71655_965870": 4,
                "depchildinfo_depdate": 3
            }
        }
    };
    public depchildinfo_pfm71655_965872_lookupDependentFields = {
        "changesApplyFields": {
            "pfm74408": ["pfm71655_965870", "pfm71655_967516", "pfm71655_965872"]
        },
        "immediateParentId": {
            "pfm74408": ["depdate"],
            "pfm71658": ["depboolean", "depnumber"]
        },
        "immediateParentLabel": {
            "pfm74408": ["DepDate"],
            "pfm71658": ["DepBoolean", "DepNumber"]
        },
        "immediateParentType": {
            "pfm74408": ["DATE"],
            "pfm71658": ["BOOLEAN", "NUMBER"]
        },
        "parentFields": {
            "pfm71658": {
                "deppersonalinfo_depnumber": 2,
                "deppersonalinfo_depboolean": 1,
                "depchildinfo_pfm71655_965872": 4
            },
            "pfm74408": {
                "depchildinfo_pfm71655_965872": 4,
                "depchildinfo_depdate": 3
            }
        }
    };
    public depchildinfo_pfm71655_967514_lookupDependentFields = {
        "changesApplyFields": {
            "pfm74408": ["pfm71655_967514"]
        },
        "immediateParentId": {
            "pfm74408": ["depboolean", "depdropdownn"],
            "pfm71658": ["depcheckbox", "depdecimal"]
        },
        "immediateParentLabel": {
            "pfm74408": ["DepBoolean", "DepDropdownN"],
            "pfm71658": ["DepCheckBox", "DepDecimal"]
        },
        "immediateParentType": {
            "pfm74408": ["BOOLEAN", "DROPDOWN"],
            "pfm71658": ["CHECKBOX", "DECIMAL"]
        },
        "parentFields": {
            "pfm71658": {
                "deppersonalinfo_depcheckbox": 1,
                "depchildinfo_pfm71655_967514": 5,
                "deppersonalinfo_depdecimal": 2
            },
            "pfm74408": {
                "depchildinfo_depdropdownn": 4,
                "depchildinfo_depboolean": 3,
                "depchildinfo_pfm71655_967514": 5
            }
        }
    };
    public depchildinfo_pfm71655_967516_lookupDependentFields = {
        "changesApplyFields": {
            "pfm74408": []
        },
        "immediateParentId": {
            "pfm74408": ["depdate"]
        },
        "immediateParentLabel": {
            "pfm74408": ["DepDate"]
        },
        "immediateParentType": {
            "pfm74408": ["DATE"]
        },
        "parentFields": {
            "pfm74408": {
                "depchildinfo_pfm71655_967516": 2,
                "depchildinfo_depdate": 1
            }
        }
    };
    public depchildinfo_depdropdownn_lookupDependentFields = {
        "changesApplyFields": {
            "pfm74408": ["pfm71655_967514"]
        },
        "immediateParentId": {},
        "immediateParentLabel": {},
        "immediateParentType": {},
        "parentFields": {}
    };
    loadCheckboxEditValues(fieldName, values) {}
    loadDefaultValues() {}
    createFormGroup() {
        this.formGroup = this.formBuilder.group({
            [this.__depchildinfo$tableName]: this.formBuilder.group({
                depcname: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depcname']['validator'])],
                depcname1: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depcname1']['validator'])],
                depcdate1: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depcdate1']['validator'])],
                depcnum1: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depcnum1']['validator'])],
                depccurrency1: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depccurrency1']['validator'])],
                depboolean: [false, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depboolean']['validator'])],
                depnumber: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depnumber']['validator'])],
                depcformula1: [null],
                depdate: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depdate']['validator'])],
                pfm71655_965870_searchKey: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['pfm71655_965870_searchKey']['validator'])],
                pfm71655_965872_searchKey: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['pfm71655_965872_searchKey']['validator'])],
                pfm5_967510_searchKey: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['pfm5_967510_searchKey']['validator'])],
                deptimestamp: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['deptimestamp']['validator'])],
                depdecimal: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depdecimal']['validator'])],
                pfm71655_967514_searchKey: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['pfm71655_967514_searchKey']['validator'])],
                pfm71655_967516_searchKey: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['pfm71655_967516_searchKey']['validator'])],
                depdropdownn: [null, Validators.compose(this.formgroupValidation[this.__depchildinfo$tableName]['depdropdownn']['validator'])]
            })
        });
        this.formGroupUpdate();
    }
    clearAllData() {
        this.objResultMap = new Map < string, any > ();
        this.dependentFieldTriggerList = {}
        this.dataObject['depchildinfo_DUMMY'] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depchildinfo$tableName]));
        this.obj_pfm74408_Temp = {};
        if (this.formGroup) {
            this.formGroup.reset();
        }
        this.formulaObject = {}
        this.dataObject['depchildinfo_DUMMY_Temp'] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depchildinfo$tableName]));
        this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser'] = "";
        this.pfm5_967510_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4$$COR_USERS_depcoruser'] = "";
        this.pfm5_967501_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$COR_USERS_depcoruser'] = "";
        this.pfm5_967712_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1$$COR_USERS_depcoruser'] = "";
        this.pfm5_967501_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4'] = "";
        this.pfm71655_967507_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'] = "";
        this.pfm71655_967516_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3$$COR_USERS_depcoruser'] = "";
        this.pfm5_967501_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'] = "";
        this.pfm71655_967514_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'] = "";
        this.pfm71655_965870_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2'] = "";
        this.pfm71655_964453_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'] = "";
        this.pfm71655_965872_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3'] = "";
        this.pfm71655_967505_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2$$COR_USERS_depcoruser'] = "";
        this.pfm5_967501_searchKey = '';
        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup'] = "";
        this.pfm71655_930602_searchKey = '';
        this.dataObject[this.__depchildinfo$tableName] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depchildinfo$tableName]));
        this.dataObject[this.__depchildinfo$tableName + "Temp"] = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[this.__depchildinfo$tableName]));
        this.dataObject[this.__depcoruser$lookupIndepchildinfo] = "";
        this.dataObject[this.__depcoruser$lookupIndepemployee] = "";
        this.dataObject[this.__depcoruser$lookupIndeppersonalinfo] = "";
        this.dataObject[this.__depcoruser$lookupIndepemployee] = "";
        this.dataObject[this.__deplookup4$lookupIndeppersonalinfo] = ""
        this.dataObject[this.__depclookup4$lookupIndepchildinfo] = ""
        this.dataObject[this.__depcoruser$lookupIndepemployee] = "";
        this.dataObject[this.__depclookup3$lookupIndepchildinfo] = ""
        this.dataObject[this.__depclookup1$lookupIndepchildinfo] = ""
        this.dataObject[this.__deplookup2$lookupIndeppersonalinfo] = ""
        this.dataObject[this.__depclookup2$lookupIndepchildinfo] = ""
        this.dataObject[this.__deplookup3$lookupIndeppersonalinfo] = ""
        this.dataObject[this.__depcoruser$lookupIndepemployee] = "";
        this.dataObject[this.__deplookup$lookupIndeppersonalinfo] = ""
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
        if (objectRootPath === 'depchildinfo_DUMMY$$depemployee_depclookup1') {
            this.pfm71655_965870_searchKey = '';
            this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', this.__depclookup1$lookupIndepchildinfo, selectedValue, this.layoutId);
            this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__depclookup1$lookupIndepchildinfo], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            this.dataObject['depchildinfo_DUMMY'][this.__depclookup1$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'].id;
            fieldName = this.__depclookup1$lookupIndepchildinfo;
            this.makeFormGroupDirty(this.__depchildinfo$tableName, this.__depclookup1$lookupIndepchildinfo)

            this.formGroup.patchValue({
                obj_pfm74408_depclookup1: selectedValue.id
            });
            if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup1$lookupIndepchildinfo] !== selectedValue.id) {
                this.updateDependentChild(this.depchildinfo_pfm71655_965870_lookupDependentFields, this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'], this.__depchildinfo$tableName, this.__depclookup1$lookupIndepchildinfo)
            }
            this.conditionalFormatRelationshipDataObject['depchildinfo_DUMMY$$depemployee_depclookup1'] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1']
            this.isSkeletonLoading = false;


            this.changeCallback(fieldName + "$$depchildinfo");
            return;
        }
        this.dependentNumberCount = {};
        if (objectRootPath === 'depchildinfo_DUMMY$$depemployee_depclookup2') {
            this.pfm71655_965872_searchKey = '';
            this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', this.__depclookup2$lookupIndepchildinfo, selectedValue, this.layoutId);
            this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__depclookup2$lookupIndepchildinfo], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            this.dataObject['depchildinfo_DUMMY'][this.__depclookup2$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'].id;
            fieldName = this.__depclookup2$lookupIndepchildinfo;
            this.makeFormGroupDirty(this.__depchildinfo$tableName, this.__depclookup2$lookupIndepchildinfo)

            this.formGroup.patchValue({
                obj_pfm74408_depclookup2: selectedValue.id
            });
            if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup2$lookupIndepchildinfo] !== selectedValue.id) {
                this.updateDependentChild(this.depchildinfo_pfm71655_965872_lookupDependentFields, this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'], this.__depchildinfo$tableName, this.__depclookup2$lookupIndepchildinfo)
            }
            this.conditionalFormatRelationshipDataObject['depchildinfo_DUMMY$$depemployee_depclookup2'] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2']
            this.isSkeletonLoading = false;


            this.changeCallback(fieldName + "$$depchildinfo");
            return;
        }
        this.dependentNumberCount = {};
        if (objectRootPath === 'depchildinfo_DUMMY$$COR_USERS_depcoruser') {
            this.pfm5_967510_searchKey = '';
            this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', this.__depcoruser$lookupIndepchildinfo, selectedValue, this.layoutId);
            this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__depcoruser$lookupIndepchildinfo], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            this.dataObject['depchildinfo_DUMMY'][this.__depcoruser$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser'].id;
            fieldName = this.__depcoruser$lookupIndepchildinfo;
            this.makeFormGroupDirty(this.__depchildinfo$tableName, this.__depcoruser$lookupIndepchildinfo)

            this.formGroup.patchValue({
                obj_pfm74408_depclookup2: selectedValue.id
            });
            if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup2$lookupIndepchildinfo] !== selectedValue.id) {
                this.updateDependentChild(this.depchildinfo_pfm71655_965872_lookupDependentFields, this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'], this.__depchildinfo$tableName, this.__depclookup2$lookupIndepchildinfo)
            }
            this.conditionalFormatRelationshipDataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser'] = this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser']
            this.isSkeletonLoading = false;


            this.changeCallback(fieldName + "$$depchildinfo");
            return;
        }
        this.dependentNumberCount = {};
        if (objectRootPath === 'depchildinfo_DUMMY$$depemployee_depclookup3') {
            this.pfm71655_967514_searchKey = '';
            this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', this.__depclookup3$lookupIndepchildinfo, selectedValue, this.layoutId);
            this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__depclookup3$lookupIndepchildinfo], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            this.dataObject['depchildinfo_DUMMY'][this.__depclookup3$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'].id;
            fieldName = this.__depclookup3$lookupIndepchildinfo;
            this.makeFormGroupDirty(this.__depchildinfo$tableName, this.__depclookup3$lookupIndepchildinfo)

            this.formGroup.patchValue({
                obj_pfm74408_depclookup3: selectedValue.id
            });
            if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup3$lookupIndepchildinfo] !== selectedValue.id) {
                this.updateDependentChild(this.depchildinfo_pfm71655_967514_lookupDependentFields, this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'], this.__depchildinfo$tableName, this.__depclookup3$lookupIndepchildinfo)
            }
            this.conditionalFormatRelationshipDataObject['depchildinfo_DUMMY$$depemployee_depclookup3'] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3']
            this.isSkeletonLoading = false;


            this.changeCallback(fieldName + "$$depchildinfo");
            return;
        }
        this.dependentNumberCount = {};
        if (objectRootPath === 'depchildinfo_DUMMY$$depemployee_depclookup4') {
            this.pfm71655_967516_searchKey = '';
            this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', this.__depclookup4$lookupIndepchildinfo, selectedValue, this.layoutId);
            this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__depclookup4$lookupIndepchildinfo], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            this.dataObject['depchildinfo_DUMMY'][this.__depclookup4$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'].id;
            fieldName = this.__depclookup4$lookupIndepchildinfo;
            this.makeFormGroupDirty(this.__depchildinfo$tableName, this.__depclookup4$lookupIndepchildinfo)

            this.formGroup.patchValue({
                obj_pfm74408_depclookup4: selectedValue.id
            });
            if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup4$lookupIndepchildinfo] !== selectedValue.id) {
                this.updateDependentChild(this.depchildinfo_pfm71655_967516_lookupDependentFields, this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'], this.__depchildinfo$tableName, this.__depclookup4$lookupIndepchildinfo)
            }
            this.conditionalFormatRelationshipDataObject['depchildinfo_DUMMY$$depemployee_depclookup4'] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4']
            this.isSkeletonLoading = false;


            this.changeCallback(fieldName + "$$depchildinfo");
            return;
        } else {
            this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', this.__deppersonalinfo$tableName, selectedValue, this.layoutId);
            this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__deppersonalinfo$tableName], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            if (this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'][this.__depchildinfo$tableName + 's'] && this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'][this.__depchildinfo$tableName + 's'].length !== 0) {
                // this.isSkeletonLoading = false;
                this.parentObjFromLookup = false;
                this.parentObject = selectedValue;
                this.parentId = this.parentObject['id'];
                this.action = 'Edit';
                this.isAssociationLoading = false;
                const primaryObject = lodash.extend({}, this.dataObject['depchildinfo_DUMMY'], this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'][this.__depchildinfo$tableName + 's'][0]);
                this.dataObject['depchildinfo_DUMMY'] = primaryObject
                this.dataObject['depchildinfo_DUMMY'][this.__deppersonalinfo$tableName] = this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster']['id']

                this.isSkeletonLoading = false;
                this.changeCallback(fieldName + "$$depchildinfo");

                if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup1$lookupIndepchildinfo]) {
                    this.pfm71655_965870_searchKey = '';
                    this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'] = this.dataObject['depchildinfo_DUMMY'][this.__depclookup1$lookupIndepchildinfo];
                    this.dataObject['depchildinfo_DUMMY'][this.__depclookup1$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'].id;

                    this.formGroup.patchValue({
                        obj_pfm74408_depclookup1: selectedValue.id
                    });
                    if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup1$lookupIndepchildinfo] !== selectedValue.id) {
                        this.updateDependentChild(this.depchildinfo_pfm71655_965870_lookupDependentFields, this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'], this.__depchildinfo$tableName, this.__depclookup1$lookupIndepchildinfo)
                    }
                }
                if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup2$lookupIndepchildinfo]) {
                    this.pfm71655_965872_searchKey = '';
                    this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'] = this.dataObject['depchildinfo_DUMMY'][this.__depclookup2$lookupIndepchildinfo];
                    this.dataObject['depchildinfo_DUMMY'][this.__depclookup2$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'].id;

                    this.formGroup.patchValue({
                        obj_pfm74408_depclookup2: selectedValue.id
                    });
                    if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup2$lookupIndepchildinfo] !== selectedValue.id) {
                        this.updateDependentChild(this.depchildinfo_pfm71655_965872_lookupDependentFields, this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'], this.__depchildinfo$tableName, this.__depclookup2$lookupIndepchildinfo)
                    }
                }
                if (this.dataObject['depchildinfo_DUMMY'][this.__depcoruser$lookupIndepchildinfo]) {
                    this.pfm5_967510_searchKey = '';
                    this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser'] = this.dataObject['depchildinfo_DUMMY'][this.__depcoruser$lookupIndepchildinfo];
                    this.dataObject['depchildinfo_DUMMY'][this.__depcoruser$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$COR_USERS_depcoruser'].id;

                    this.formGroup.patchValue({
                        obj_pfm74408_depclookup2: selectedValue.id
                    });

                }
                if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup3$lookupIndepchildinfo]) {
                    this.pfm71655_967514_searchKey = '';
                    this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'] = this.dataObject['depchildinfo_DUMMY'][this.__depclookup3$lookupIndepchildinfo];
                    this.dataObject['depchildinfo_DUMMY'][this.__depclookup3$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'].id;

                    this.formGroup.patchValue({
                        obj_pfm74408_depclookup3: selectedValue.id
                    });
                    if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup3$lookupIndepchildinfo] !== selectedValue.id) {
                        this.updateDependentChild(this.depchildinfo_pfm71655_967514_lookupDependentFields, this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'], this.__depchildinfo$tableName, this.__depclookup3$lookupIndepchildinfo)
                    }
                }
                if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup4$lookupIndepchildinfo]) {
                    this.pfm71655_967516_searchKey = '';
                    this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'] = this.dataObject['depchildinfo_DUMMY'][this.__depclookup4$lookupIndepchildinfo];
                    this.dataObject['depchildinfo_DUMMY'][this.__depclookup4$lookupIndepchildinfo] = this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'].id;

                    this.formGroup.patchValue({
                        obj_pfm74408_depclookup4: selectedValue.id
                    });
                    if (this.dataObject['depchildinfo_DUMMY'][this.__depclookup4$lookupIndepchildinfo] !== selectedValue.id) {
                        this.updateDependentChild(this.depchildinfo_pfm71655_967516_lookupDependentFields, this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'], this.__depchildinfo$tableName, this.__depclookup4$lookupIndepchildinfo)
                    }
                }
            } else {
                // this.isSkeletonLoading = false;
                this.parentObjFromLookup = true;
                this.parentObject = selectedValue;
                this.parentId = this.parentObject['id'];
                this.clearAllData();
                this.dataObject['depchildinfo_DUMMY'][selectedValue['type']] = selectedValue;
                this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[this.__deppersonalinfo$tableName], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
                this.isAssociationLoading = false;


                this.isSkeletonLoading = false;
                this.changeCallback(fieldName + "$$depchildinfo")

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
    onTextChangeMethod(selectedFieldJSON, userSelectedValues, selectedField, objectName) {
        this.updateDependentChild(selectedFieldJSON, userSelectedValues, objectName, selectedField);
    }
    dependentSingleSelectChangeMethod(selectedFieldJSON, userSelectedValues, selectedField, objectName) {


        this.updateDependentChild(selectedFieldJSON, userSelectedValues, objectName, selectedField);
    }
    checkIsParentLookupSelected(selectedField, dependentInfo, dataObject, isPrimaryObject) {
        this.dependentNumberCount = {};
        this.formulaDependentFlag = false;
        if (selectedField === '' || selectedField === undefined)
            return;
        if (dataObject[selectedField] === null && isPrimaryObject) {
            const parentFields = dependentInfo['parentFields'];
            const immediateParentField = dependentInfo['immediateParentId'];
            Object.keys(parentFields).forEach(key => {
                const objectFields = parentFields[key]
                Object.keys(objectFields).forEach(keyValue => {
                    this.dependentNumberCount[keyValue] = objectFields[keyValue];
                })
            });
            Object.keys(immediateParentField).forEach(key => {
                const objectFields = immediateParentField[key]
                objectFields.forEach(keyValue => {
                    if (keyValue.includes('__f')) {
                        this.formulaDependentFlag = true;

                    }
                })
            });
        }
        if (dataObject[selectedField] === null && !isPrimaryObject && this.entryPageType === "multiobjectentry") {
            const parentFields = dependentInfo['parentFields'];
            Object.keys(parentFields).forEach(key => {
                const objectFields = parentFields[key]
                Object.keys(objectFields).forEach(keyValue => {
                    this.dependentNumberCount[keyValue] = objectFields[keyValue];
                })
            });
            const immediateParentField = dependentInfo['immediateParentId'];
            Object.keys(immediateParentField).forEach(key => {
                const objectFields = immediateParentField[key]
                objectFields.forEach(keyValue => {
                    if (keyValue.includes('__f')) {
                        this.formulaDependentFlag = true;
                    }
                })
            });
        }
        if (dataObject[selectedField] === null && !isPrimaryObject && this.entryPageType === "drawerentry") {
            const objectType = dataObject["type"]
            const parentFields = dependentInfo['parentFields'];
            const immediateParentField = dependentInfo['immediateParentId'];
            Object.keys(parentFields).forEach(key => {
                const objectFields = parentFields[key]
                Object.keys(objectFields).forEach(keyValue => {
                    this.dependentNumberCount[keyValue] = objectFields[keyValue];
                })
            });
            Object.keys(immediateParentField).forEach(key => {
                const objectFields = immediateParentField[key]
                objectFields.forEach(keyValue => {
                    if (keyValue.includes('__f')) {
                        this.formulaDependentFlag = true;
                    }
                })
            });
            return
        }
        if (!isPrimaryObject && this.entryPageType === "masterpopupentry") {
            if (dataObject === null || dataObject === undefined || Object.keys(dataObject).length === 0) {
                this.appUtilityConfig.showInfoAlert("Kindly choose parent record from popup...")
                return
            }
            const objectType = dataObject["type"]
            const immediateParentField = dependentInfo['immediateParentId'];
            const parentField = dependentInfo["immediateParent"][objectType]
            const parentFields = dependentInfo['parentFields'];
            Object.keys(parentFields).forEach(key => {
                const objectFields = parentFields[key]
                Object.keys(objectFields).forEach(keyValue => {
                    this.dependentNumberCount[keyValue] = objectFields[keyValue];
                })
            });
            Object.keys(immediateParentField).forEach(key => {
                const objectFields = immediateParentField[key]
                objectFields.forEach(keyValue => {
                    if (keyValue.includes('__f')) {
                        this.formulaDependentFlag = true;
                    }
                })
            });
            if (dataObject[parentField] === null) {
                return
            }
        }
    }
    clearExisitingSelectedLookupDependentData(userSelectedValue) {
        const changesApplyFields = userSelectedValue['changesApplyFields']
        let removeFieldArray = []
        Object.keys(changesApplyFields).forEach(key => {
            removeFieldArray = changesApplyFields[key]
        });
        if (removeFieldArray === undefined || removeFieldArray.length === 0) {
            return;
        }
        removeFieldArray.forEach(fieldName => {
            this.dataObject['depchildinfo_DUMMY'][fieldName] = null;
            if (fieldName === this.__depclookup1$lookupIndepchildinfo) {
                this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup1'] = JSON.parse(
                    JSON.stringify(this.dbService.tableStructure[this.__depemployee$tableName]));
                this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', fieldName, null, this.layoutId);
                this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[fieldName], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            } else if (fieldName === this.__depclookup2$lookupIndepchildinfo) {
                this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup2'] = JSON.parse(
                    JSON.stringify(this.dbService.tableStructure[this.__depemployee$tableName]));
                this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', fieldName, null, this.layoutId);
                this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[fieldName], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            } else if (fieldName === this.__depclookup3$lookupIndepchildinfo) {
                this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup3'] = JSON.parse(
                    JSON.stringify(this.dbService.tableStructure[this.__depemployee$tableName]));
                this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', fieldName, null, this.layoutId);
                this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[fieldName], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            } else if (fieldName === this.__depclookup4$lookupIndepchildinfo) {
                this.dataObject['depchildinfo_DUMMY$$depemployee_depclookup4'] = JSON.parse(
                    JSON.stringify(this.dbService.tableStructure[this.__depemployee$tableName]));
                this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', 'depchildinfo_DUMMY', fieldName, null, this.layoutId);
                this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[fieldName], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
            }
        });
    }
    updateDependentChild(selectedFieldJSON, userSelectedValues, objectName, fieldName) {
        this.dependentNumberCount = {};

        if (selectedFieldJSON !== '') {
            this.clearExisitingSelectedLookupDependentData(selectedFieldJSON);
        }
        let fieldNameWithObjectName = fieldName + '$$' + objectName;
        this.changeCallback(fieldNameWithObjectName)
    }
    resetChildDependentInfo(objectName, dataObjectFieldName, looklUpObj, lookupObjectFieldName, formControlerName) {
        if (dataObjectFieldName === this.__depclookup1$lookupIndepchildinfo) {
            this.updateDependentChild(
                this.depchildinfo_pfm71655_965870_lookupDependentFields,
                looklUpObj, objectName, dataObjectFieldName
            );
        } else if (dataObjectFieldName === this.__depclookup2$lookupIndepchildinfo) {
            this.updateDependentChild(
                this.depchildinfo_pfm71655_965872_lookupDependentFields,
                looklUpObj, objectName, dataObjectFieldName
            );
        } else if (dataObjectFieldName === this.__depclookup3$lookupIndepchildinfo) {
            this.updateDependentChild(
                this.depchildinfo_pfm71655_967514_lookupDependentFields,
                looklUpObj, objectName, dataObjectFieldName
            );
        } else if (dataObjectFieldName === this.__depclookup4$lookupIndepchildinfo) {
            this.updateDependentChild(
                this.depchildinfo_pfm71655_967516_lookupDependentFields,
                looklUpObj, objectName, dataObjectFieldName
            );
        }
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
                this.dataObject['depchildinfo_DUMMY'][fieldToLoad] = dateVal
            }, 1000)
        }
    }
    updateFormGroupForUrl() {
        this.dataCloningInfo.forEach(clonedInfo => {
            if (clonedInfo["fieldType"] === "URL" && clonedInfo["destinationFieldInfo"]["destinationFieldValue"]) {
                this.formGroup.patchValue({
                    [this.__depchildinfo$tableName]: {
                        [clonedInfo["destinationFieldInfo"]["destinationFieldName"]]: clonedInfo["destinationFieldInfo"]["destinationFieldValue"]
                    }
                })
            }
        })
    }
    cloneOnDestinationLayout() {
        this.isDataCloned = true
        this.dataCloningInfo = this.cspfmLookupCriteriaUtils.handleLookupCriteriaInvolvedClonedFields(this.dataCloningInfo, this.lookupCriteriaValidationFields)
        this.clonedDataFieldDetails = this.cspfmDataTraversalUtilsObject.updateAndGetClonedData(this.dataCloningInfo, this.dataPaths, this.lookupPaths, this.dataObject, this.pickListValues, 'depchildinfo_DUMMY', this.layoutId)

        this.dataObject['depchildinfo_DUMMY$$deppersonalinfo_depcmaster'] = JSON.parse(this.parentObj);
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
        "pfm71658_name_7775052": {
            "id": "name",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$name.name",
            "fieldName": "name",
            "prop": "name",
            "fieldType": "TEXT",
            "objectName": "deppersonalinfo",
            "elementid": 7775052,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$name",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71658_employeename_7775061": {
            "id": "employeename",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$employeename.employeename",
            "fieldName": "employeename",
            "prop": "employeename",
            "fieldType": "TEXT",
            "objectName": "deppersonalinfo",
            "elementid": 7775061,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$employeename",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71658_team_7775067": {
            "id": "team",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$team.team",
            "fieldName": "team",
            "prop": "team",
            "fieldType": "DROPDOWN",
            "objectName": "deppersonalinfo",
            "elementid": 7775067,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$team",
            "child": "",
            "dateFormat": "",
            "mappingDetails": this.team_930594_7775067,
            "currencyDetails": ""
        },
        "pfm71658_location_7775054": {
            "id": "location",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$location.location",
            "fieldName": "location",
            "prop": "location",
            "fieldType": "DROPDOWN",
            "objectName": "deppersonalinfo",
            "elementid": 7775054,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$location",
            "child": "",
            "dateFormat": "",
            "mappingDetails": this.location_930595_7775054,
            "currencyDetails": ""
        },
        "pfm71658_depcurrency_7775059": {
            "id": "depcurrency",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcurrency.depcurrency",
            "fieldName": "depcurrency",
            "prop": "depcurrency",
            "fieldType": "CURRENCY",
            "objectName": "deppersonalinfo",
            "elementid": 7775059,
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
        "pfm71658_deptimestamp_7775063": {
            "id": "deptimestamp",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deptimestamp.deptimestamp",
            "fieldName": "deptimestamp",
            "prop": "deptimestamp",
            "fieldType": "TIMESTAMP",
            "objectName": "deppersonalinfo",
            "elementid": 7775063,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deptimestamp",
            "child": "",
            "dateFormat": this.appUtilityConfig.userDateTimeFormat,
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71658_depdate_7775070": {
            "id": "depdate",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depdate.depdate",
            "fieldName": "depdate",
            "prop": "depdate",
            "fieldType": "DATE",
            "objectName": "deppersonalinfo",
            "elementid": 7775070,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depdate",
            "child": "",
            "dateFormat": this.appUtilityConfig.userDateFormat,
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71658_depboolean_7775053": {
            "id": "depboolean",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depboolean.depboolean",
            "fieldName": "depboolean",
            "prop": "depboolean",
            "fieldType": "BOOLEAN",
            "objectName": "deppersonalinfo",
            "elementid": 7775053,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depboolean",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71658_depnumber_7775064": {
            "id": "depnumber",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depnumber.depnumber",
            "fieldName": "depnumber",
            "prop": "depnumber",
            "fieldType": "NUMBER",
            "objectName": "deppersonalinfo",
            "elementid": 7775064,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depnumber",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71658_depdecimal_7775056": {
            "id": "depdecimal",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depdecimal.depdecimal",
            "fieldName": "depdecimal",
            "prop": "depdecimal",
            "fieldType": "DECIMAL",
            "objectName": "deppersonalinfo",
            "elementid": 7775056,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depdecimal",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71658_deplookup_7775068": {
            "id": "pfm71655_930602_employeeid",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup.deplookup",
            "prop": "pfm71655_930602.employeeid",
            "fieldName": "pfm71655_930602",
            "fieldType": "LOOKUP",
            "objectName": "deppersonalinfo",
            "elementid": 7775068,
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
        "pfm71655_employeename_7775062": {
            "child": {
                "id": "employeename",
                "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup$$employeename.employeename",
                "fieldName": "employeename",
                "prop": "employeename",
                "fieldType": "TEXT",
                "objectName": "depemployee",
                "elementid": 7775062,
                "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup$$employeename",
                "child": "",
                "dateFormat": "",
                "mappingDetails": "",
                "currencyDetails": ""
            },
            "id": "employeename",
            "prop": "employeename",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup$$employeename.employeename",
            "elementid": 7775062,
            "mappingDetails": "",
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup$$employeename",
            "dateFormat": "",
            "currencyDetails": "",
            "fieldName": "pfm71655_930602",
            "fieldType": "LOOKUP",
            "objectName": "depemployee"
        },
        "pfm71658_depformulan__f_7775051": {
            "id": "depformulan__f",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depformulan.depformulan",
            "fieldName": "depformulan__f",
            "prop": "depformulan__f",
            "fieldType": "FORMULA",
            "formulaType": "NUMBER",
            "objectName": "deppersonalinfo",
            "elementid": 7775051,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depformulan",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71658_deplookup2_7775060": {
            "id": "pfm71655_964453_employeeid",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup2.deplookup2",
            "prop": "pfm71655_964453.employeeid",
            "fieldName": "pfm71655_964453",
            "fieldType": "LOOKUP",
            "objectName": "deppersonalinfo",
            "elementid": 7775060,
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
        "pfm71655_employeename_7775050": {
            "child": {
                "id": "employeename",
                "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2$$employeename.employeename",
                "fieldName": "employeename",
                "prop": "employeename",
                "fieldType": "TEXT",
                "objectName": "depemployee",
                "elementid": 7775050,
                "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2$$employeename",
                "child": "",
                "dateFormat": "",
                "mappingDetails": "",
                "currencyDetails": ""
            },
            "id": "employeename",
            "prop": "employeename",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2$$employeename.employeename",
            "elementid": 7775050,
            "mappingDetails": "",
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup2$$employeename",
            "dateFormat": "",
            "currencyDetails": "",
            "fieldName": "pfm71655_964453",
            "fieldType": "LOOKUP",
            "objectName": "depemployee"
        },
        "pfm71658_depmultiselect_7775069": {
            "id": "depmultiselect",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depmultiselect.depmultiselect",
            "fieldName": "depmultiselect",
            "prop": "depmultiselect",
            "fieldType": "MULTISELECT",
            "objectName": "deppersonalinfo",
            "elementid": 7775069,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depmultiselect",
            "child": "",
            "dateFormat": "",
            "mappingDetails": this.depmultiselect_967503_7775069,
            "currencyDetails": ""
        },
        "pfm71658_depcheckbox_7775066": {
            "id": "depcheckbox",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcheckbox.depcheckbox",
            "fieldName": "depcheckbox",
            "prop": "depcheckbox",
            "fieldType": "CHECKBOX",
            "objectName": "deppersonalinfo",
            "elementid": 7775066,
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcheckbox",
            "child": "",
            "dateFormat": "",
            "mappingDetails": this.depcheckbox_967504_7775066,
            "currencyDetails": ""
        },
        "pfm71658_depcoruser_7775055": {
            "id": "pfm5_967712_username",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depcoruser.depcoruser",
            "prop": "pfm5_967712.username",
            "fieldName": "pfm5_967712",
            "fieldType": "LOOKUP",
            "objectName": "deppersonalinfo",
            "elementid": 7775055,
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
        "pfm71658_deplookup3_7775058": {
            "id": "pfm71655_967505_employeeid",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup3.deplookup3",
            "prop": "pfm71655_967505.employeeid",
            "fieldName": "pfm71655_967505",
            "fieldType": "LOOKUP",
            "objectName": "deppersonalinfo",
            "elementid": 7775058,
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
        "pfm71655_employeename_7775065": {
            "child": {
                "id": "employeename",
                "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3$$employeename.employeename",
                "fieldName": "employeename",
                "prop": "employeename",
                "fieldType": "TEXT",
                "objectName": "depemployee",
                "elementid": 7775065,
                "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3$$employeename",
                "child": "",
                "dateFormat": "",
                "mappingDetails": "",
                "currencyDetails": ""
            },
            "id": "employeename",
            "prop": "employeename",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3$$employeename.employeename",
            "elementid": 7775065,
            "mappingDetails": "",
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup3$$employeename",
            "dateFormat": "",
            "currencyDetails": "",
            "fieldName": "pfm71655_967505",
            "fieldType": "LOOKUP",
            "objectName": "depemployee"
        },
        "pfm71658_deplookup4_7775049": {
            "id": "pfm71655_967507_employeeid",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$deplookup4.deplookup4",
            "prop": "pfm71655_967507.employeeid",
            "fieldName": "pfm71655_967507",
            "fieldType": "LOOKUP",
            "objectName": "deppersonalinfo",
            "elementid": 7775049,
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
        "pfm71655_employeename_7775057": {
            "child": {
                "id": "employeename",
                "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4$$employeename.employeename",
                "fieldName": "employeename",
                "prop": "employeename",
                "fieldType": "TEXT",
                "objectName": "depemployee",
                "elementid": 7775057,
                "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4$$employeename",
                "child": "",
                "dateFormat": "",
                "mappingDetails": "",
                "currencyDetails": ""
            },
            "id": "employeename",
            "prop": "employeename",
            "label": "depchildinfo_Entry_Web.Element.depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4$$employeename.employeename",
            "elementid": 7775057,
            "mappingDetails": "",
            "traversalpath": "depchildinfo_DUMMY$$deppersonalinfo_depcmaster$$depemployee_deplookup4$$employeename",
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
                    redirectUrl: "/menu/depchildinfo_Entry_Web"
                };
                this.router.navigate(["/menu/depchildinfo_d_w_hl_detail_view"], {
                    queryParams: itemSaveNavigationParams,
                    skipLocationChange: true
                });
            } else if (!this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                const itemSaveNavigationParams = {
                    id: this.id,
                    redirectUrl: "/menu/depchildinfo_Entry_Web"
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
        this.cspfmDataTraversalUtilsObject.setLayoutData(this.dataObject, 'depchildinfo_DUMMY', dataRootPath, dataObjectFieldName, null, this.layoutId);
        this.dataObject[dataObjectFieldName] = isStandardObject ?
            JSON.parse(JSON.stringify(this.metaDbConfig.configuration.tableStructure[lookupObjectName])) :
            JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[lookupObjectName]));
        this.cspfmDataTraversalUtilsObject.updateLayoutData(this.lookupPaths[dataObjectFieldName], this.dataObject['depchildinfo_DUMMY'], this.dataObject, this.layoutId);
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


        this.changeCallback(dataObjectFieldName + '$$depchildinfo')
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

    listButton_7775029_Onclick() {

        var redirectUrlForNav = '/menu/depchildinfo_Entry_Web';

        const stackArray = document.getElementsByTagName('ion-router-outlet')[1].children
        if (stackArray[stackArray.length - 1].tagName.toLowerCase() !== "depchildinfo_d_w_list") {
            this.toastCtrl.dismiss();
            const queryParamsRouting = {};
            if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depchildinfo_d_w_list")) {
                queryParamsRouting['redirectUrl'] = redirectUrlForNav
            }

            if (this.isPopUpEnabled) {
                this.appUtilityConfig.navigationDiscardConfirmAlert("/menu/depchildinfo_d_w_list", queryParamsRouting, false, this);
            } else {
                this.router.navigate(["/menu/depchildinfo_d_w_list"], {
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