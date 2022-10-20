import {
    Component,
    OnInit,
    ApplicationRef,
    Inject,
    ViewChild,
    ViewChildren,
    QueryList,
    Input,
    HostListener,
    Renderer2
} from "@angular/core";
import {
    metaDataDbProvider
} from "src/core/db/metaDataDbProvider";
import {
    dataProvider
} from "src/core/utils/dataProvider";
import {
    appConstant
} from "src/core/utils/appConstant";
import {
    FieldInfo,
    cspfm_data_display,
    CspfmDataValidator
} from 'src/core/pipes/cspfm_data_display';
import {
    cspfmLayoutConfiguration
} from "src/core/pfmmapping/cspfmLayoutConfiguration";
import {
    FieldType,
    Filters
} from 'angular-slickgrid';
import {
    TranslateService
} from '@ngx-translate/core';
import {
    SlickgridPopoverService
} from 'src/core/services/slickgridPopover.service';
import {
    ModalController,
    Platform,
    LoadingController,
    ToastController,
    ToastOptions,
    AlertController
} from "@ionic/angular";
import {
    MdePopoverTrigger
} from '@material-extended/mde';
import {
    cspfmObservableListenerUtils
} from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import {
    cspfmAlertDialog
} from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
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
    objectTableMapping
} from "src/core/pfmmapping/objectTableMapping";
import {
    appUtility
} from "src/core/utils/appUtility";
import {
    Router,
    ActivatedRoute
} from "@angular/router";
import * as lodash from "lodash";
import * as _ from "underscore";
import {
    DatePipe
} from "@angular/common";
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialog,
    MatDialogConfig
} from '@angular/material/dialog';
import {
    cspfmExecutionPouchDbProvider
} from 'src/core/db/cspfmExecutionPouchDbProvider';
import {
    cspfmExecutionPouchDbConfiguration
} from 'src/core/db/cspfmExecutionPouchDbConfiguration';
import {
    registerLocaleData
} from "@angular/common";
import {
    cspfmObjectConfiguration
} from 'src/core/pfmmapping/cspfmObjectConfiguration';
import {
    CspfmReportGenerationService
} from 'src/core/services/cspfmReportGeneration.service';
import {
    lookupFieldMapping
} from 'src/core/pfmmapping/lookupFieldMapping';
import {
    metaDbConfiguration
} from "src/core/db/metaDbConfiguration";
import {
    cspfmMetaCouchDbProvider
} from 'src/core/db/cspfmMetaCouchDbProvider';
import {
    cspfmBooleanEvaluation
} from 'src/core/utils/cspfmBooleanEvaluation';
import {
    cspfmLiveListenerHandlerUtils
} from 'src/core/dynapageutils/cspfmLiveListenerHandlerUtils';
import {
    FetchMode,
    DependentObjectListType
} from 'src/core/models/cspfmLiveListenerConfig.type';
declare var $: any;
declare const window: any;
import {
    cspfmDataTraversalUtils
} from 'src/core/dynapageutils/cspfmDataTraversalUtils';
import {
    DataFieldTraversal
} from 'src/core/models/cspfmDataFieldTraversal.type';
import {
    cspfmConditionalFormattingUtils
} from 'src/core/dynapageutils/cspfmConditionalFormattingUtils';
import {
    ConditionalFormat
} from 'src/core/models/cspfmConditionalFormat.type';
import {
    ObjectHierarchy
} from 'src/core/models/cspfmObjectHierarchy.type';
import {
    CspfmDataFormatter,
    cspfmDataGrouping,
    cspfmCustomEditor,
    CspfmActionsFormatter,
    cspfmAssociationDataFormatter,
    CspfmDataExportFormatter,
    cspfmUrlDataFormatter
} from 'src/core/pipes/cspfm_data_display';
import {
    cspfmSlickgridUtils
} from 'src/core/dynapageutils/cspfmSlickgridUtils';
import {
    cspfmCustomActionUtils
} from 'src/core/dynapageutils/cspfmCustomActionUtils';
import {
    cspfmBalloonComponent
} from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent';
@Component({
    selector: 'depemployee_d_w_view',
    templateUrl: 'depemployee_d_w_view.html'
}) export class depemployee_d_w_view implements OnInit {
    isCustomFetchLoading = false;
    dripDownAttribute = '';
    constructor(public metaDbConfigurationObj: metaDbConfiguration, public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider, public lookupFieldMapping: lookupFieldMapping, public dialog: MatDialog, public cspfmDataDisplay: cspfm_data_display, public translateService: TranslateService, public router: Router,
        public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider, public executionDbConfigObject: cspfmExecutionPouchDbConfiguration, private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils,
        public activatRoute: ActivatedRoute, platform: Platform, public dataProvider: dataProvider, public appUtilityConfig: appUtility, public metaDbProvider: metaDataDbProvider, private cspfmConditionalFormattingUtils: cspfmConditionalFormattingUtils,
        public loadingCtrl: LoadingController, public toastCtrl: ToastController, public objectTableMapping: objectTableMapping, public applicationRef: ApplicationRef,
        public dbService: couchdbProvider, public cspfmLayoutConfig: cspfmLayoutConfiguration, public cspfmReportGenerationService: CspfmReportGenerationService, private slickgridPopoverService: SlickgridPopoverService, public observableListenerUtils: cspfmObservableListenerUtils, private datePipe: DatePipe, public alerCtrl: AlertController, public pfmObjectConfig: cspfmObjectConfiguration, public slickgridUtils: cspfmSlickgridUtils, public customActionUtils: cspfmCustomActionUtils,
        private liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils, @Inject(MAT_DIALOG_DATA) data, public dialogRef: MatDialogRef < depemployee_d_w_view > ) {
        this.associationConfigurationAssignment();
        this.customActionConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['customActionConfiguration']);
        if (data.hasOwnProperty('params')) {
            this.isPopUpEnabled = true;
            dialogRef.disableClose = true;
            let params = data['params'];
            this.initializeStatusWorkFlowFields();
            this.redirectUrl = params["redirectUrl"];
            this.id = params["id"];

            this.fetchSelectedObject();
        } else {
            this.isPopUpEnabled = false;
            this.activatRoute.queryParams.subscribe(params => {
                if (Object.keys(params).length === 0 && params.constructor === Object) {
                    console.log("list query params skipped");
                    return
                }
                this.initializeStatusWorkFlowFields();
                if (params["redirectUrl"]) {
                    this.redirectUrl = params["redirectUrl"]
                }
                this.id = params["id"];

                this.fetchSelectedObject();
            });
        }
        this.registerRecordChangeListener();
        this.dripDownAttribute = "#cs-dropdown-" + this.layoutId;

    }

    public __depemployee$tableName = this.objectTableMapping.mappingDetail['depemployee'];
    public __COR_USERS$tableName = this.objectTableMapping.mappingDetail['COR_USERS'];
    public team_930536_7773754 = this.pfmObjectConfig.objectConfiguration[this.__depemployee$tableName]['selectionFieldsMapping']['team'];
    public location_930537_7773749 = this.pfmObjectConfig.objectConfiguration[this.__depemployee$tableName]['selectionFieldsMapping']['location'];
    public depmultiselect_967499_7773750 = this.pfmObjectConfig.objectConfiguration[this.__depemployee$tableName]['selectionFieldsMapping']['depmultiselect'];
    public depcheckbox_967500_7773761 = this.pfmObjectConfig.objectConfiguration[this.__depemployee$tableName]['selectionFieldsMapping']['depcheckbox'];
    public depdropdownn_972175_7773757 = this.pfmObjectConfig.objectConfiguration[this.__depemployee$tableName]['selectionFieldsMapping']['depdropdownn'];
    public dataObject = {};
    public isPopUpEnabled = false;
    private tableName_pfm71655 = 'pfm71655';
    private prominentDataMapping = {};
    private fileAttachmentInfo = {
        undefined
    };



    private errorMessageToDisplay = "No Records";
    public restrictionRules = []
    private id = "";
    public isFromMenu = false;
    public dependentObjectList = {
        "relationalObjects": {
            "pfm71655": []
        },
        "lookupObjects": {
            "pfm5": {
                "pfm71655": ["pfm5_967501"]
            }
        },
        "dataRestrictionInvolvedObjects": {}
    };
    public redirectUrl = "/";
    public isSkeletonLoading = true;
    public intervalId;
    public dataSource = "CouchDB";
    public isLoading;
    public isAssociationDisplayRefreshRequired: boolean;
    public layoutId = "203846";
    public layoutName = "depemployee_d_w_view";
    skeletonIntervalId: number | null = null;
    animation = 'pulse';
    private approverType = "";
    public isCustomActionProcessing = false;
    public customActionConfiguration = {};
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
    private dataPaths: Array < {
        traversalPath: string;requiredTemp: boolean
    } > = [{
        traversalPath: 'depemployee_DUMMY$$COR_USERS_depcoruser',
        requiredTemp: false
    }, {
        traversalPath: 'depemployee_DUMMY',
        requiredTemp: false
    }, ]
    public layoutDataRestrictionSet = [];
    public isAssociationLoading = true;
    public associationConfiguration = {};
    public tableColumnInfo: {
        [key: string]: {
            [key: string]: {
                [key: string]: FieldInfo
            }
        }
    } = {};
    public associationColumnDefinitions = {}
    public gridFieldInfo: {
        [key: string]: FieldInfo
    } = {
        "pfm71655_employeeid_7773753": {
            "id": "employeeid",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$employeeid.employeeid",
            "fieldName": "employeeid",
            "prop": "employeeid",
            "fieldType": "TEXT",
            "objectName": "depemployee",
            "elementid": 7773753,
            "traversalpath": "depemployee_DUMMY$$employeeid",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71655_employeename_7773760": {
            "id": "employeename",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$employeename.employeename",
            "fieldName": "employeename",
            "prop": "employeename",
            "fieldType": "TEXT",
            "objectName": "depemployee",
            "elementid": 7773760,
            "traversalpath": "depemployee_DUMMY$$employeename",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71655_team_7773754": {
            "id": "team",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$team.team",
            "fieldName": "team",
            "prop": "team",
            "fieldType": "DROPDOWN",
            "objectName": "depemployee",
            "elementid": 7773754,
            "traversalpath": "depemployee_DUMMY$$team",
            "child": "",
            "dateFormat": "",
            "mappingDetails": this.team_930536_7773754,
            "currencyDetails": ""
        },
        "pfm71655_location_7773749": {
            "id": "location",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$location.location",
            "fieldName": "location",
            "prop": "location",
            "fieldType": "DROPDOWN",
            "objectName": "depemployee",
            "elementid": 7773749,
            "traversalpath": "depemployee_DUMMY$$location",
            "child": "",
            "dateFormat": "",
            "mappingDetails": this.location_930537_7773749,
            "currencyDetails": ""
        },
        "pfm71655_depboolean_7773755": {
            "id": "depboolean",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depboolean.depboolean",
            "fieldName": "depboolean",
            "prop": "depboolean",
            "fieldType": "BOOLEAN",
            "objectName": "depemployee",
            "elementid": 7773755,
            "traversalpath": "depemployee_DUMMY$$depboolean",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71655_depformulan__f_7773763": {
            "id": "depformulan__f",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depformulan.depformulan",
            "fieldName": "depformulan__f",
            "prop": "depformulan__f",
            "fieldType": "FORMULA",
            "formulaType": "NUMBER",
            "objectName": "depemployee",
            "elementid": 7773763,
            "traversalpath": "depemployee_DUMMY$$depformulan",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71655_depdate_7773759": {
            "id": "depdate",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depdate.depdate",
            "fieldName": "depdate",
            "prop": "depdate",
            "fieldType": "DATE",
            "objectName": "depemployee",
            "elementid": 7773759,
            "traversalpath": "depemployee_DUMMY$$depdate",
            "child": "",
            "dateFormat": this.appUtilityConfig.userDateFormat,
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71655_deptimestamp_7773752": {
            "id": "deptimestamp",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$deptimestamp.deptimestamp",
            "fieldName": "deptimestamp",
            "prop": "deptimestamp",
            "fieldType": "TIMESTAMP",
            "objectName": "depemployee",
            "elementid": 7773752,
            "traversalpath": "depemployee_DUMMY$$deptimestamp",
            "child": "",
            "dateFormat": this.appUtilityConfig.userDateTimeFormat,
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71655_depnumber_7773751": {
            "id": "depnumber",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depnumber.depnumber",
            "fieldName": "depnumber",
            "prop": "depnumber",
            "fieldType": "NUMBER",
            "objectName": "depemployee",
            "elementid": 7773751,
            "traversalpath": "depemployee_DUMMY$$depnumber",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71655_depdecimal_7773762": {
            "id": "depdecimal",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depdecimal.depdecimal",
            "fieldName": "depdecimal",
            "prop": "depdecimal",
            "fieldType": "DECIMAL",
            "objectName": "depemployee",
            "elementid": 7773762,
            "traversalpath": "depemployee_DUMMY$$depdecimal",
            "child": "",
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71655_depcurrency_7773758": {
            "id": "depcurrency",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depcurrency.depcurrency",
            "fieldName": "depcurrency",
            "prop": "depcurrency",
            "fieldType": "CURRENCY",
            "objectName": "depemployee",
            "elementid": 7773758,
            "traversalpath": "depemployee_DUMMY$$depcurrency",
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
        "pfm71655_depmultiselect_7773750": {
            "id": "depmultiselect",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depmultiselect.depmultiselect",
            "fieldName": "depmultiselect",
            "prop": "depmultiselect",
            "fieldType": "MULTISELECT",
            "objectName": "depemployee",
            "elementid": 7773750,
            "traversalpath": "depemployee_DUMMY$$depmultiselect",
            "child": "",
            "dateFormat": "",
            "mappingDetails": this.depmultiselect_967499_7773750,
            "currencyDetails": ""
        },
        "pfm71655_depcheckbox_7773761": {
            "id": "depcheckbox",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depcheckbox.depcheckbox",
            "fieldName": "depcheckbox",
            "prop": "depcheckbox",
            "fieldType": "CHECKBOX",
            "objectName": "depemployee",
            "elementid": 7773761,
            "traversalpath": "depemployee_DUMMY$$depcheckbox",
            "child": "",
            "dateFormat": "",
            "mappingDetails": this.depcheckbox_967500_7773761,
            "currencyDetails": ""
        },
        "pfm71655_depcoruser_7773756": {
            "id": "pfm5_967501_username",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depcoruser.depcoruser",
            "prop": "pfm5_967501.username",
            "fieldName": "pfm5_967501",
            "fieldType": "LOOKUP",
            "objectName": "depemployee",
            "elementid": 7773756,
            "traversalpath": "depemployee_DUMMY$$depcoruser",
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
                "objectName": "depemployee"
            },
            "dateFormat": "",
            "mappingDetails": "",
            "currencyDetails": ""
        },
        "pfm71655_depdropdownn_7773757": {
            "id": "depdropdownn",
            "label": "depemployee_d_w_view.Element.depemployee_DUMMY$$depdropdownn.depdropdownn",
            "fieldName": "depdropdownn",
            "prop": "depdropdownn",
            "fieldType": "DROPDOWN",
            "objectName": "depemployee",
            "elementid": 7773757,
            "traversalpath": "depemployee_DUMMY$$depdropdownn",
            "child": "",
            "dateFormat": "",
            "mappingDetails": this.depdropdownn_972175_7773757,
            "currencyDetails": ""
        }
    };

    public workFlowActionConfig = {};

    public pfm71655depformulanFormula = "multiply(depemployee.DepNumber,depemployee.DepDecimal)";

    private currentStatusWorkFlowActionFieldId;
    public WorkFlowUserApprovalStatusDataObject = {};

    private fieldApproverType = {};
    private workFlowMapping = {};
    objDisplayName = {};

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
                if (result["status"] !== "SUCCESS") {
                    this.errorMessageToDisplay = result["message"];
                    if (this.errorMessageToDisplay === "No internet") {
                        this.appUtilityConfig.presentNoInternetToast(this);
                    }

                    return;
                }
                this.dataObject['depemployee_DUMMY'] = result["records"][0];
                this.cspfmDataTraversalUtilsObject.updateLayoutData(this.dataPaths, this.dataObject['depemployee_DUMMY'], this.dataObject, this.layoutId, true);




                this.isSkeletonLoading = false;
                if (!this.objectHierarchyJSON['isLazyLoadingEnabled']) {
                    this.isAssociationLoading = false
                }
            }).catch(error => {
                clearInterval(this.skeletonIntervalId);
                this.isSkeletonLoading = false;

                console.log(error);
            });
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
                        "dataObject": this.dataObject['depemployee_DUMMY']
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
    ngAfterViewInit() {
        $(document).ready(function() {
            $(".cs-mat-main-content").on('scroll', function() {
                window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])
            });
        })
    }
    initializeStatusWorkFlowFields() {

    }

    childObjectModifiedEventTrigger(modified) {
        const modifiedData = this.dataProvider.convertRelDocToNormalDoc(modified);
        if (modifiedData["id"] === this.id) {
            this.fetchSelectedObject();
        }
    }
    ngOnDestroy() {
        this.liveListenerHandlerUtils.unregisterRecordChangeListener(this.dependentObjectList, this.layoutId, this);


    }
    public reportInput = {};
    public printInput = {};

    public moreActionInfo = {}





    associationConfigurationAssignment() {
        this.associationConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['associationConfiguration']);


    }

    tabChangeMethod(event, tabGroupId) {
        console.log("tabChangeMethod");
    }

    refreshData() {
        this.fetchSelectedObject();
    }
    ngOnInit() {

        this.skeletonIntervalId = window.setInterval(() => {
            this.animation = this.animation === 'pulse' ? 'progress-dark' : 'pulse';
        }, 5000);

    }
    ngAfterViewChecked() {
        this.appUtilityConfig.appendHttpToURL();
    }
    ionViewWillEnter() {
        document.body.setAttribute("class", "linedetail");
    }
    listButton_7773748_Onclick() {

        var redirectUrlForNav = '/menu/depemployee_d_w_view';
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
            if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depemployee_d_w_list")) {
                queryParamsRouting['redirectUrl'] = "/menu/depemployee_d_w_view";
            }
        }
        this.router.navigate(["/menu/depemployee_d_w_list"], {
            queryParams: queryParamsRouting,
            skipLocationChange: true
        });

    }
    addButton_7773747_Onclick() {
        if (this.isPopUpEnabled) {
            this.dialogRef.close();
        }
        const queryParamsRouting = {
            action: 'Add'
        };
        if (this.isPopUpEnabled) {
            if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                queryParamsRouting['redirectUrl'] = this.redirectUrl;
            }
        } else if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/depemployee_Entry_Web")) {
            queryParamsRouting['redirectUrl'] = "/menu/depemployee_d_w_view";
        }
        this.router.navigate(['/menu/depemployee_Entry_Web'], {
            queryParams: queryParamsRouting,
            skipLocationChange: true
        });
    }
    editButton_7773746_Onclick() {
        this.appUtilityConfig.closeDialog(this.isPopUpEnabled, this.dialogRef);

        if (this.isSkeletonLoading) {
            this.appUtilityConfig.presentToast("Another process is running, please wait");
            return
        }
        let redirectUrlForNav = ''
        if (this.isPopUpEnabled) {
            redirectUrlForNav += this.redirectUrl;
        } else {
            redirectUrlForNav += '/menu/depemployee_d_w_view';
        }
        const navigationParams = {
            action: 'Edit',
            id: this.dataObject['depemployee_DUMMY']['id'],
            parentObj: '',
            parentFieldLabel: '',
            parentFieldValue: '',
            // redirectUrl: "depemployee_d_w_view"  
        }
        var currentPageUrl = this.redirectUrl;
        var navPageUrl = "/menu/depemployee_Entry_Web"
        navigationParams['redirectUrl'] = this.appUtilityConfig.setRedirectUrl(this.isPopUpEnabled, {
            redirectUrl: this.redirectUrl,
            currentPageUrl: currentPageUrl,
            navPageUrl: navPageUrl
        });
        this.toastCtrl.dismiss();
        let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams, this.pfmObjectConfig['objectConfiguration'], this.cspfmMetaCouchDbProvider);
        if (checkRecordNotInitiated) {
            this.router.navigate([navPageUrl], {
                queryParams: navigationParams,
                skipLocationChange: true
            });
        }
    }
}