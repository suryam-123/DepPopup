import { OnInit, Component, ApplicationRef, EventEmitter,Output,  Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { appConstant } from "src/core/utils/appConstant";
import { dataProvider } from 'src/core/utils/dataProvider';
import * as lodash from 'lodash';
import {
    cspfmSlickgridPopover
} from 'src/core/components/cspfmSlickgridPopover/cspfmSlickgridPopover';
import {
    cspfmAlertDialog
} from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
import {
    Column,
    GridOption,
    FieldType,
    Filters,
    OperatorType,
    AngularGridInstance,
    FilterService,
    ExtensionName,
    Editors,
    GroupingFormatterItem,
    OnEventArgs,
    SlickGrid,
    SlickDataView
} from 'angular-slickgrid';
import { objectTableMapping } from 'src/core/pfmmapping/objectTableMapping';
import { lookupFieldMapping } from 'src/core/pfmmapping/lookupFieldMapping';
import { SlickgridPopoverService } from 'src/core/services/slickgridPopover.service';
import { appUtility } from 'src/core/utils/appUtility';
import { TranslateService } from '@ngx-translate/core';
import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { cspfmSlickgridMatrixService } from 'src/core/services/cspfmSlickgridMatrix.service';
import {
    SectionObjectDetail
} from 'src/core/models/cspfmSectionDetails.type';
import { cspfmObjectConfiguration } from 'src/core/pfmmapping/cspfmObjectConfiguration';
import { cspfmLayoutConfiguration } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
import { cspfmDataTraversalUtils } from 'src/core/dynapageutils/cspfmDataTraversalUtils';
import {
    FieldInfo,
    cspfm_data_display,
    CspfmDataFormatter,
    cspfmDataGrouping,
    CspfmDataValidator,
    CspfmDataExportFormatter,
    cspfmUrlDataFormatter
} from 'src/core/pipes/cspfm_data_display';
import {
    MatDialogRef
} from "@angular/material/dialog";
import {
    cspfmHeaderLineUtils
} from "src/core/dynapageutils/cspfmHeaderLineUtils";
import { cspfmFlatpickrConfig } from 'src/core/utils/cspfmFlatpickrConfig';
import { cspfmDateEditor } from 'src/core/dynapageutils/cspfmDateEditor';
import { cspfmCustomFieldProvider } from 'src/core/utils/cspfmCustomFieldProvider';
// 08Jun2022#sudalaiyandi.a 
import { cspfmConditionalValidationUtils } from "src/core/dynapageutils/cspfmConditionalValidationUtils";
import { ConditionalValidation } from "src/core/models/cspfmConditionalValidation.type";
import { cs_conditionalvalidation_toast } from '../cs_conditionalvalidation_toast/cs_conditionalvalidation_toast';
import { cs_conditionalvalidation_consolidate } from '../cs_conditionalvalidation_consolidate/cs_conditionalvalidation_consolidate';
import { ObjectHierarchy } from "src/core/models/cspfmObjectHierarchy.type";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { cspfmLookupService } from 'src/core/utils/cspfmLookupService';
import { cspfmweblookuppage } from 'src/core/pages/cspfmweblookuppage/cspfmweblookuppage';
import { cspfmObservableListenerUtils } from 'src/core/dynapageutils/cspfmObservableListenerUtils';
import { cspfmMultiLineEntryUtils } from 'src/core/dynapageutils/cspfmMultiLineEntryUtils';
import { MultiLineEntryConfig } from 'src/core/models/cspfmMultiLineEntryConfig.type';
import * as moment from 'moment';
import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
import { cspfmFormulaService } from 'src/core/services/cspfmFormula.service';
import { FetchMode } from 'src/core/models/cspfmLiveListenerConfig.type';
import { cspfmLiveListenerHandlerUtils } from 'src/core/dynapageutils/cspfmLiveListenerHandlerUtils';
import { cspfmGridsectionListIdConfiguration } from 'src/core/utils/cspfmGridsectionListIdConfiguration';
declare var $: any;
declare const window: any;


@Component({
    selector: 'cspfmMultiLineEntry',
    templateUrl: './cspfmMultiLineEntry.html'
})
export class cspfmMultiLineEntry implements OnInit {

    @Input() layoutId: string = '';
    @Input() entryConfig: MultiLineEntryConfig;
    @Input() inlineEditDependentResetFields: {
        [key in 'grid' | 'list']: {
            [listeningObject: string]: {
                [listeningField: string]: {
                    [sectionObject: string]: {
                        [rootPath: string]: Array<string>;
                    }
                }
            }
        }
    };
    @Output() childSection: EventEmitter<{ sectionName: string, viewMode: string, row: number, dataContext: any, sectionType: string
    }> = new EventEmitter();


    editedRecords = {};
    public layoutMode: 'Edit' | 'View' = 'Edit';

    constructor(public applicationRef: ApplicationRef,
        public translateService: TranslateService,
        public cspfmDataDisplay: cspfm_data_display,
        public dialog: MatDialog,
        public appUtilityConfig: appUtility,
        public dataProvider: dataProvider,
        public objectTableMappingObj: objectTableMapping,
        public lookupFieldMapping: lookupFieldMapping,
        public slickGridPopoverService: SlickgridPopoverService,
        public slickgridUtils: cspfmSlickgridUtils,
        private cspfmSlickgridMatrix: cspfmSlickgridMatrixService,
        public cspfmLayoutConfig: cspfmLayoutConfiguration,
        private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils,
        public pfmObjectConfig: cspfmObjectConfiguration,
        private flatPickerConfig: cspfmFlatpickrConfig,
        private cspfmCustomFieldProviderObject: cspfmCustomFieldProvider,
        public headerLineUtils: cspfmHeaderLineUtils,
        private cspfmConditionalValidationUtils: cspfmConditionalValidationUtils,
        private multiLineEntryUtils: cspfmMultiLineEntryUtils,
        private observableListenerUtils: cspfmObservableListenerUtils,
        private snackBar: MatSnackBar, public cspfmLookupServiceObj: cspfmLookupService,
        private cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils,
        private formulaService: cspfmFormulaService,
        private liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils,
        public gridIdConfig: cspfmGridsectionListIdConfiguration) {
        this.urlsubscribe();
    }
    private objectNameMapping;
    public formulaConfig;
    public childObjects;
    public dialogRef: MatDialogRef<cspfmMultiLineEntry>
    public isPopUpEnabled = false;
    public savedSuccessMessage = 'Transaction Success';
    public slickGridItemClickCount = 0;
    public childObjectsInfo: Array<{
        displayName: string;
        objectName: string;
        childDocsArray: Array<any>;
        relationshipType: string;
        paginationInfo: any;
        gridOptionInfo: GridOption;
        angularGridInstance: AngularGridInstance;
        additionalInfo?: {
            [key: string]: any
        }
    }> = [];
    public itemsPerPageConfigured = '';
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
            pagesCount: 0 // Pagination UI - New key added to get pages count
        },
        "nextBadgeDisabled": true,
        "currentPageIndex": 0
    }

    public objectRelationshipMapping;
    public paginationConfigInfo;

    public gridId = 'cspfm_grid_' + this.layoutId + "_";
    public gridContainerId = 'cspfm_grid_container_' + this.layoutId + "_";
    public matrixGridContainerId = 'cspfm_matrix_grid_container_' + this.layoutId + "_";
    public matrixGridId = 'cspfm_matrix_grid_' + this.layoutId + "_";
    public dataSource = "CouchDB";
    public isAnyClickDone: boolean = false;
    public layoutName: string = "cspfmMultiLineEntry";
    public dataObject = {};
    public skipValidation = [];
    public errorCount: any;
    public consolidateErrorData = {
        "validationFailureJson": {},
        "showConsolidatePopup": false,
        "viewMode": ''
    };
    public errorSet = {};
    public validationRules = []
    public onClickConsolidateTempMsg = {};
    public onClickConsolidateMsg = {};
    public onChangeConsolidateMsg = {};
    public onChangeWithOutConsolidateMsg = [];
    public onClickWithOutConsolidateMsg = [];
    public showConsolidatePopup: Boolean = false
    public conditionalValidationDatacontext = {};
    public failureReason = {};
    private objectHierarchyJSON: ObjectHierarchy = {
        "objectName": "organizationmaster",
        "objectType": "PRIMARY",
        "relationShipType": "",
        "fieldId": "0",
        "objectId": "352033",
        "childObject": [
            {
                "objectName": "employeedetail",
                "objectType": "MASTERDETAIL",
                "relationShipType": "ONE_TO_MANY",
                "fieldId": "281393",
                "objectId": "352013",
                "childObject": []
            },
        ],
    };
    public sectionObjectsHierarchy: { [objectName: string]: ObjectHierarchy } = {};
    private conditionalValidationJson: { [objectName: string]: ConditionalValidation } = {};

    public sectionObjectDetails: { [objectName: string]: SectionObjectDetail } = {};

    public columnDefinitions: { [objectName: string]: Array<Column> } = {};
    public listenerName: { [childObject: string]: string };
    private batchWiseIdArray: any = { }
    private batchWiseIdArrayTemp: any = {}
    private resultCount: any = {}
    public batchIdLimit = 1000;
    private errorMessageToDisplay = 'No Records';
    public primaryRecordId = '';
    public primaryObjectName = ''
    private formulaAndRollupFieldInfo = {}
    public sectionDependentObjectList = {}

    ngOnInit() {
        if (!this.entryConfig) {
            return
        }
        this.itemsPerPageConfigured = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["itemsPerPageConfigured"];
        this.paginationInfo['pagination']['view']['itemCount'] = this.itemsPerPageConfigured;
        this.objectNameMapping = this.entryConfig['objectDisplayMapping'];
        this.childObjects = this.entryConfig['sectionObjects'];
        this.sectionObjectDetails = this.entryConfig['sectionObjectDetail'];
        this.objectRelationshipMapping = this.entryConfig['relationShip'];
        this.paginationConfigInfo = this.entryConfig['paginationConfig'];
        let columnFieldInfo = this.entryConfig['columnFieldInfo'];
        this.sectionObjectsHierarchy = this.entryConfig['sectionObjectHierarchy'];
        this.primaryRecordId = this.entryConfig['primaryRecordId']
        this.primaryObjectName = this.entryConfig['primaryObjectName']
        this.formulaConfig = this.entryConfig['formulaConfig']
        this.sectionDependentObjectList = this.entryConfig['sectionDependentObjectList']
        this.childObjects.forEach(childObjectName => {
            this.conditionalValidationJson[childObjectName] = this.entryConfig['conditionalValidation'][childObjectName];
            if (this.conditionalValidationJson[childObjectName]) {
                this.conditionalValidationJson[childObjectName]['sectionObjectHierarchy'] = this.entryConfig['sectionObjectHierarchy'][childObjectName];
                this.conditionalValidationJson[childObjectName]['layoutId'] = this.layoutId;
                this.conditionalValidationJson[childObjectName]['dataObject'] = this.dataObject;
            }

            this.columnDefinitions[childObjectName] = this.multiLineEntryUtils.makeEditableColumns(columnFieldInfo[childObjectName], this.layoutId, childObjectName, this.childObjectsInfo, this.sectionObjectsHierarchy[childObjectName], this.formulaConfig[childObjectName])
            this.appUtilityConfig.setColumnWidth(this.columnDefinitions[childObjectName])

            this.batchWiseIdArray[childObjectName] = []
            this.batchWiseIdArrayTemp[childObjectName] = []
            this.resultCount[childObjectName] = []

            const pluralName = this.dataProvider.getPluralName(childObjectName);
            var gridOption: GridOption = this.slickgridUtils.getGridOptions(childObjectName, this.childObjectsInfo, this.gridContainerId, this.sectionObjectDetails, this.layoutId,this.itemsPerPageConfigured);
            var paginationInfo = JSON.parse(JSON.stringify(this.paginationInfo));
            gridOption['autoEdit'] = true
            gridOption['gridMenu']['customItems'].push({
                command: "cspfm-single-click-edit",
                titleKey: "Enable Single Click Edit",
                iconCssClass: "fa fa-file-excel-o",
                action: (event, callbackArgs) => {
                    const childObject = this.slickgridUtils.getChildObject(childObjectName, this.childObjectsInfo);
                    gridOption['autoEdit'] = true
                    childObject['gridObj'].setOptions({ autoEdit: true })
                }
            })
            gridOption['gridMenu']['customItems'].push({
                command: "cspfm-double-click-edit",
                titleKey: "Enable Double Click Edit",
                iconCssClass: "fa fa-file-excel-o",
                action: (event, callbackArgs) => {
                    const childObject = this.slickgridUtils.getChildObject(childObjectName, this.childObjectsInfo);
                    gridOption['autoEdit'] = false
                    childObject['gridObj'].setOptions({ autoEdit: false })
                }
            })
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
            // if (this.isWorkflowActionAvailable === true || sectionalObject['isMatrixEnabled'] === true || sectionalObject['slickgridSelectOptionEnabled'] === true || (this.childObjectList.includes(childObjectName) || this.childSectionHeaderActionConfig[childObjectName])) {
            //     let rowSelectionOption = {
            //         checkboxSelector: {
            //             // you can toggle these 2 properties to show the "select all" checkbox in different location
            //             hideInFilterHeaderRow: false,
            //             width: 60
            //         },
            //         rowSelectionOptions: {
            //             // True (Single Selection), False (Multiple Selections)
            //             selectActiveRow: false,
            //         },
            //         enableCheckboxSelector: true,
            //         enableRowSelection: true
            //     }
            //     Object.assign(gridOption, rowSelectionOption);
            // }
            const processChildObject = {
                displayName: this.objectNameMapping[pluralName],
                objectName: childObjectName,
                childDocsArray: [],
                relationshipType: this.objectRelationshipMapping[childObjectName],
                paginationInfo: paginationInfo,
                gridOptionInfo: gridOption,
                angularGridInstance: null,
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

            console.log("****==>", this.childObjectsInfo);


            // Conditional Validation
            this.initiateConditionalValidation(childObjectName)
        });

        this.listenerName = this.slickgridUtils.subscribeChildLazyLoading(this.layoutId, this.columnDefinitions, this.childObjects, this.sectionObjectDetails, this.childObjectsInfo)

       let taskList = [];
       this.childObjects.forEach(childObjectName => {
           let sectionChildObjectHierarchy = this.sectionObjectsHierarchy[childObjectName];
           let index = this.childObjectsInfo.findIndex(childObject => childObject['objectName'] === childObjectName)
           if (this.childObjectsInfo[index]['additionalInfo']['dataFetchMode'] != 'OnClickBatch') {
               this.childObjectsInfo[index]['childDocsArray'] = []
               this.childObjectsInfo[index]['additionalInfo']['tempDataArray'] = []
           }
           taskList.push(this.initiateFetch(sectionChildObjectHierarchy, this.childObjectsInfo[index]).then(childResponse => {
               this.childObjectsInfo[index]['slickgridChildDocsArray'] = this.childObjectsInfo[index]['childDocsArray']
               return childResponse;
           }));
       })

       this.registerSectionRecordChangeListener()
    }

    ngOnChanges() {
        if (this.primaryRecordId !== this.entryConfig['primaryRecordId']) {
            this.primaryRecordId = this.entryConfig['primaryRecordId']
        }
    }

    childSectionFetch(){
       let taskList = [];
       this.childObjects.forEach(childObjectName => {
           let sectionChildObjectHierarchy = this.sectionObjectsHierarchy[childObjectName];
           let index = this.childObjectsInfo.findIndex(childObject => childObject['objectName'] === childObjectName)
           if (this.childObjectsInfo[index]['additionalInfo']['dataFetchMode'] != 'OnClickBatch') {
               this.childObjectsInfo[index]['childDocsArray'] = []
               this.childObjectsInfo[index]['additionalInfo']['tempDataArray'] = []
           }
           taskList.push(this.initiateFetch(sectionChildObjectHierarchy, this.childObjectsInfo[index]).then(childResponse => {
               this.childObjectsInfo[index]['slickgridChildDocsArray'] = this.childObjectsInfo[index]['childDocsArray']
               return childResponse;
           }));
       })
    }

    registerSectionRecordChangeListener() {
        const sectionObjectKeys = Object.keys(this.sectionDependentObjectList)
        sectionObjectKeys.forEach(sectionObjectName => {
            const sectionDependentObject = this.sectionDependentObjectList[sectionObjectName];
            this.appUtilityConfig.addEventSubscriptionlayoutIds(sectionDependentObject, sectionObjectName, this.dataSource);

            this.observableListenerUtils.subscribe(sectionObjectName, modified => {
                const splitObjectName = sectionObjectName.split('_')
                const objectName = splitObjectName[1];
                const processChildObject = this.childObjectsInfo.filter(childItem => childItem['objectName'] === objectName)[0]
                let slickGrid: SlickGrid = processChildObject['angularGridInstance']['slickGrid'];
               //  if (slickGrid['isDataFetching']) {
               //      if (!this.pendingListenerData[sectionObjectName]) {
               //          this.pendingListenerData[sectionObjectName] = {}
               //      }
               //      this.pendingListenerData[sectionObjectName][modified['id']] = modified;
               //      return;
               //  }

               this.processListenerData(modified, sectionObjectName);
            });
        })
    }

    async processListenerData(modified, sectionObjectName) {
        const splitObjectName = sectionObjectName.split('_')
        const objectName = splitObjectName[1];
        const processChildObject = this.childObjectsInfo.filter(childItem => childItem['objectName'] === objectName)[0]

        const currentChildIds = processChildObject['slickgridChildDocsArray'].map(el => el.id);
        let sectionChildObjectHierarchy = this.sectionObjectsHierarchy[objectName];

        if (this.layoutMode == 'View') {
            // This method is for change listener for User assignment from formula Db
            if (modified['doc']['data']['type'].includes('userAssignment') && this.sectionObjectDetails['pfm533953']['sectionUserDataRestrictionSet'] && this.sectionObjectDetails['pfm533953']['sectionUserDataRestrictionSet'][0]['restrictionType'] === 'userAssignment') {
                if (!this.appUtilityConfig.verifyUser(modified['doc']['data'])) {
                    return false;
                }

                if (currentChildIds.includes(modified['doc']['data']['reference_id']) && !modified['doc']['data']['isActive']) {
                    const remove = [modified['doc']['data']['reference_id']]
                    if (remove && remove.length > 0) {
                        this.checkIfRecordsAvailableInSectionAndRemove(processChildObject, remove)
                    }
                } else {
                    this.initiateFetch(sectionChildObjectHierarchy, processChildObject, 'listener').then(criteriaMeetingIds => {
                        criteriaMeetingIds = criteriaMeetingIds.map(item => {
                            return this.liveListenerHandlerUtils.getIdWithoutPfm(item)
                        })
                        if (criteriaMeetingIds.includes(modified['doc']['data']['reference_id']) && modified['doc']['data']['isActive']) {
                            const addNewIds = [modified['doc']['data']['reference_id']]
                            if (addNewIds && addNewIds.length > 0) {
                                this.headerLineUtils.fetchChildModifiedRecords(processChildObject['angularGridInstance'], processChildObject['objectName'],  addNewIds, sectionChildObjectHierarchy, this);
                            }
                        }
                    })
                }
            } else if (!modified['doc']['data']['type'].includes('userAssignment')) {
                let dataRestrictionInvolvedObjectsArray = Object.keys(this.sectionDependentObjectList[sectionObjectName]['dataRestrictionInvolvedObjects'] || {});
                let headerPrimaryId = dataRestrictionInvolvedObjectsArray.filter(item => {
                    if (modified['doc']['data']['type'] === item) {
                        return modified['doc']['data']['id'] === this.dataObject[modified['doc']['data']['type']]['id'];
                    }
                })
                if (headerPrimaryId.length) {
                    // refetch the header fields
                    //  return this.fetchSelectedObject(false).then(() => {
                    //      this.initiateFetch(this.sectionObjectsHierarchy[objectName], processChildObject)
                    //  })
                }
                console.log('========listener========== : ', processChildObject['isLoading'], processChildObject['isAnyDataFetchPending']);
                const changedSectionDependentObject = this.sectionDependentObjectList[sectionObjectName]
                let providerType = modified['providerType'];
                let layoutInfo = {
                   'gridData': this.slickgridUtils.getGridData(processChildObject['angularGridInstance']),
                   'formulaAndRollupFieldInfo': this.formulaAndRollupFieldInfo,
                   'dataObject': this.dataObject[this.primaryObjectName],
                   'objectId': this.primaryObjectName
               }
                let idArrayToFetch = this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.SECTION_FETCH, changedSectionDependentObject, modified, layoutInfo)
                idArrayToFetch = idArrayToFetch.filter(item => {
                    if (item[this.primaryObjectName]) {
                        return item[this.primaryObjectName] === this.primaryRecordId;
                    } else if (item['doc']['data'][this.primaryObjectName]) {
                        return item['doc']['data'][this.primaryObjectName] === this.primaryRecordId;
                    } else if (providerType) {
                        return true;
                    }
                })
                if (processChildObject['slickgridChildDocsArray'].length > 0) {
                    idArrayToFetch = idArrayToFetch.map(ids => this.liveListenerHandlerUtils.getIdWithoutPfm(ids.id));
                    this.initiateFetch(sectionChildObjectHierarchy, processChildObject, 'listener').then(criteriaMeetingIds => {
                        criteriaMeetingIds = criteriaMeetingIds.map(item => {
                            return this.liveListenerHandlerUtils.getIdWithoutPfm(item)
                        })
                        const addNewIds = lodash.difference(criteriaMeetingIds, currentChildIds);
                        const removeOldIds = lodash.difference(currentChildIds, criteriaMeetingIds);
                        const updateIds = lodash.intersection(idArrayToFetch, criteriaMeetingIds);
                        if (removeOldIds && removeOldIds.length > 0) {
                            this.checkIfRecordsAvailableInSectionAndRemove(processChildObject, removeOldIds)
                        }
                        if (addNewIds && addNewIds.length > 0) {
                            this.headerLineUtils.fetchChildModifiedRecords(processChildObject['angularGridInstance'], processChildObject['objectName'], addNewIds, this.sectionObjectsHierarchy[objectName], this)
                        } else if (updateIds && updateIds.length > 0) {
                            this.headerLineUtils.fetchChildModifiedRecords(processChildObject['angularGridInstance'], processChildObject['objectName'], updateIds, this.sectionObjectsHierarchy[objectName], this);
                        }
                    })
                } else {
                    if (processChildObject['slickgridChildDocsArray'].length == 0) {
                        this.initiateFetch(sectionChildObjectHierarchy, processChildObject)
                    }
                }
            }
        } else if (this.layoutMode == 'Edit') {
            if (modified['doc']['data'][this.primaryObjectName] === this.primaryRecordId && this.appUtilityConfig.userId !== modified['doc']['data']['lastmodifiedby']) {
                const dialogConfig = new MatDialogConfig()
                dialogConfig.data = {
                    title: 'One of the record in this section is recently modified by other user. Kindly get recent changes before save',
                    subHeader: '',
                    buttonInfo: [{
                        'name': 'OK',
                        'handler': () => {
                            // Commented for development purpose. Will remove the commented once functional discussion done.
                            // this.initiateFetch(sectionChildObjectHierarchy, processChildObject).then(childResponse => {
                            //     processChildObject['slickgridChildDocsArray'] = processChildObject['childDocsArray']
                            // })
                        }
                    }],
                    parentContext: this,
                    type: 'Alert'
                };
                dialogConfig.autoFocus = false
                this.dialog.open(cspfmAlertDialog, dialogConfig);
            }
        }         
    }

    checkIfRecordsAvailableInSectionAndRemove(processChildObject, idsToremove) {
       idsToremove.forEach(modifiedDataId => {
         this.slickgridUtils.modifiedDataSet(processChildObject, this.childObjectsInfo, processChildObject['objectName'], modifiedDataId)
       });
     }

    async initiateFetch(sectionChildObjectHierarchy, childObject, methodCalledBy?) {
        const objectName = childObject['objectName'];
        childObject['isLoading'] = true
        this.dataProvider.startLazyLoading(this.listenerName[objectName]) // These lines should generate only if lazy Loading involved layout

        let sectionObjectDetails = this.sectionObjectDetails[objectName]
        if ((sectionObjectDetails['criteriaQueryConfig'] && sectionObjectDetails['criteriaQueryConfig']['queryConfig'] && sectionObjectDetails['criteriaQueryConfig']['queryConfig']['relationalObjects'] && Object.keys(sectionObjectDetails['criteriaQueryConfig']['queryConfig']['relationalObjects']).length > 0) || (sectionObjectDetails['sectionUserDataRestrictionSet'] && sectionObjectDetails['sectionUserDataRestrictionSet'].length > 0 && sectionObjectDetails['sectionUserDataRestrictionSet'][0]['restrictionType'] === "userAssignment")) {
            const queryConfig = sectionObjectDetails['criteriaQueryConfig']['queryConfig']
            if (queryConfig['junctionObjectsHierarchy'] && queryConfig['junctionObjectsHierarchy'].length > 0) {
                await this.cspfmLookupCriteriaUtils.getJunctionObjects(queryConfig['junctionObjectsHierarchy']).then(junctionDataObjects => {
                    if (junctionDataObjects[this.primaryObjectName] && sectionObjectDetails['junctionDataObjects'][this.primaryObjectName]) {
                        junctionDataObjects[this.primaryObjectName].push(sectionObjectDetails['junctionDataObjects'][this.primaryObjectName])
                    }
                    return sectionObjectDetails['junctionDataObjects'] = { ...sectionObjectDetails['junctionDataObjects'], ...junctionDataObjects }
                })
            }
            const layoutDataRestrictionSet = {
                'dataRestrictionSet': sectionObjectDetails['sectionUserDataRestrictionSet'],
                'criteriaQueryConfig': sectionObjectDetails['criteriaQueryConfig']['queryConfig'],
                'junctionDataObjects': sectionObjectDetails['criteriaQueryConfig']['junctionDataObjects'],
                'searchQuery': 'type:' + objectName + ' AND ' + this.primaryObjectName + ':' + this.primaryRecordId,
                'objectName': objectName
            }
            return this.cspfmLookupCriteriaUtils.dataRestrictionFetch(layoutDataRestrictionSet, "HL_list").then(res => {
                this.batchWiseIdArray[objectName] = lodash.chunk(res, this.batchIdLimit);
                this.batchWiseIdArrayTemp[objectName] = lodash.chunk(res, this.batchIdLimit);
                if (this.batchWiseIdArray[objectName].length > 0) {
                    if (sectionObjectDetails['criteriaQueryConfig']['queryConfig'] && !(sectionObjectDetails['criteriaQueryConfig']['queryConfig'] && sectionObjectDetails['criteriaQueryConfig']['queryConfig']['relationalObjects'] && sectionObjectDetails['criteriaQueryConfig']['queryConfig']['relationalObjects'].length > 0)) {
                        return this.makeQueryAndStartFetch(sectionChildObjectHierarchy, childObject, undefined, undefined, methodCalledBy)
                    } else {
                        if (methodCalledBy === 'listener') {
                            return lodash.flatten(this.batchWiseIdArray[objectName]);
                        }
                        else {
                            return this.fetchAllDataWeb(sectionChildObjectHierarchy, childObject).then(result => {
                               return this.headerLineUtils.handleResult(childObject, result, this.errorMessageToDisplay,this.listenerName)
                            });
                        }
                    }
                } else {
                    const result = {
                        'status': "SUCCESS",
                        'records': []
                    }
                    return this.headerLineUtils.handleResult(childObject, result, this.errorMessageToDisplay,this.listenerName)
                }
            })
        } else if (sectionObjectDetails['criteriaQueryConfig'] && Object.keys(sectionObjectDetails['criteriaQueryConfig']['queryConfig']).length > 0) {
            return this.makeQueryAndStartFetch(sectionChildObjectHierarchy, childObject, methodCalledBy)
        } else {
            if (methodCalledBy === 'listener') {
                let taskList = []
                let paginationInfo = childObject['paginationInfo'];
                let fetchParams = {
                    'objectHierarchyJSON': sectionChildObjectHierarchy,
                    'layoutDataRestrictionSet': this.sectionObjectDetails[objectName]['sectionUserDataRestrictionSet'],
                    'dataSource': this.dataSource,
                    pagination: {
                        limit: paginationInfo['pagination']['view']['itemCount'],
                        offset: paginationInfo['currentPageIndex'] * Number(paginationInfo['pagination']['view']['itemCount']),
                        bookmark: ""
                    }
                }
                fetchParams['searchListQuery'] = "type:" + childObject['objectName'] + " AND " + this.primaryObjectName + ":" + this.primaryRecordId
                taskList = taskList.concat(this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', fetchParams['searchListQuery']))
                return Promise.all(taskList).then(result => {
                    var ids = [];
                    result.forEach(res => {
                        ids = ids.concat(res['rows'].map(e => e['id']))
                    })
                    return ids;
                })
            }
            else {
                childObject['childDocsArray'] = [];
                childObject['additionalInfo']['tempDataArray'] = [];
                return this.fetchAllDataWeb(sectionChildObjectHierarchy, childObject).then(result => {
                   return this.headerLineUtils.handleResult(childObject, result, this.errorMessageToDisplay,this.listenerName)
                });
            }
        }
    }

    async makeQueryAndStartFetch(sectionChildObjectHierarchy, childObject, paginationAction?: 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh', paginationClickFlag?, methodCalledBy?) {
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

        if (sectionCriteriaQueryConfig['criteriaQuery'] !== undefined) {
            sectionCriteriaQueryConfig['relationalObjectResults'] = sectionCriteriaQueryConfig['relationalObjectIds'];
            sectionCriteriaQueryConfig['criteriaQuery'] = this.cspfmLookupCriteriaUtils.lookupCriteriaQueryEvaluateFunction(configObject)
        }
        fetchParams['searchListQuery'] = "type:" + childObject['objectName'] + " AND " + this.primaryObjectName + ":" + this.primaryRecordId
        fetchParams['searchListQuery'] = fetchParams['searchListQuery'] + " AND " + sectionCriteriaQueryConfig['criteriaQuery']
        if (methodCalledBy === 'listener') {
            if (this.batchWiseIdArray[objectName].length > 0) {
                return this.dataProvider.primaryObjDataFetch(fetchParams, this.batchWiseIdArray[objectName]);
            } else {
                return this.dataProvider.fetchDataFromDataSource(fetchParams, 'listener', fetchParams['searchListQuery']).then(result => {
                    return result["rows"].map(e => e['id']);
                })
            }
        } else {
            if (childObject['additionalInfo']['dataFetchMode'] != 'OnClickBatch' && methodCalledBy != 'listener') {
                childObject['childDocsArray'] = [];
                childObject['additionalInfo']['tempDataArray'] = [];
            }
            if (this.batchWiseIdArray[objectName].length > 0 && childObject['additionalInfo']['dataFetchMode'] === 'OnClickBatch') {
                await this.dataProvider.primaryObjDataFetch(fetchParams, this.batchWiseIdArray[objectName]).then((res => {
                    return this.batchWiseIdArray[objectName] = lodash.chunk(res, this.batchIdLimit);
                }))
            }
            if (this.batchWiseIdArray[objectName].length > 0 || childObject['additionalInfo']['dataFetchMode'] !== 'OnClickBatch') {
                return this.fetchAllDataWeb(sectionChildObjectHierarchy, childObject, paginationAction, paginationClickFlag).then(result => {
                   return this.headerLineUtils.handleResult(childObject, result, this.errorMessageToDisplay,this.listenerName)
                })
            } else {
                return false
            }
        }
    }

    async fetchAllDataWeb(objectHierarchyJSON, childObject,
        paginationAction?: 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh', paginationClickFlag?) {
        const objectName = childObject['objectName'];
        if (paginationClickFlag && childObject['isLoading']) {
            this.appUtilityConfig.presentToast("Another process is running, please wait");
            return
        }
        if (paginationAction && paginationAction !== 'limit_changed') {
            if (paginationAction == 'next_pressed') {
                childObject['paginationInfo']['currentPageIndex'] = childObject['paginationInfo']['currentPageIndex'] + 1;
            } else if (paginationAction == 'prev_pressed' && childObject['paginationInfo']['currentPageIndex'] > 0) {
                childObject['paginationInfo']['currentPageIndex'] = childObject['paginationInfo']['currentPageIndex'] - 1;
            } else if (paginationAction == 'current_page_refresh') {
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
                this.resultCount[objectName] = this.batchWiseIdArray[objectName].length;
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
        if (this.dataSource == appConstant.couchDBStaticName) {
            fetchParams['searchListQuery'] = "type:" + childObject['objectName'] + " AND " + this.primaryObjectName + ":" + this.primaryRecordId
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
            if (sectionCriteriaQueryConfig && sectionCriteriaQueryConfig['criteriaQuery'] !== undefined && sectionCriteriaQueryConfig['criteriaQuery'] !== "" && childObject['additionalInfo']['dataFetchMode'] !== 'OnClickBatch') {
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
            }
            if (childObject['paginationInfo']['pagination']['total_rows'] > 0) { // Pagination UI - Pages info updated
                if (childObject['paginationInfo']['pagination'] < Number(childObject['paginationInfo']['pagination'])) {
                    childObject['paginationInfo']['pagination']['pagesCount'] = 1
                } else {
                    let modulusValue = childObject['paginationInfo']['pagination']['total_rows'] % Number(childObject['paginationInfo']['pagination']['view']['itemCount'])
                    if (modulusValue == 0) {
                        childObject['paginationInfo']['pagination']['pagesCount'] = childObject['paginationInfo']['pagination']['total_rows'] / Number(childObject['paginationInfo']['pagination']['view']['itemCount'])
                    } else {
                        childObject['paginationInfo']['pagination']['pagesCount'] = (childObject['paginationInfo']['pagination']['total_rows'] - modulusValue) / Number(childObject['paginationInfo']['pagination']['view']['itemCount']) + 1
                    }
                }
            }
            this.resultCount[objectName] = Number(childObject['paginationInfo']['pagination']['view']['itemCount']);
            if (res['status'] === 'SUCCESS') {
                if (res['records'].length > 0) {
                    this.resultCount[objectName] = res['records'].length;
                    if (res["records"].length < childObject['paginationInfo']['pagination']['view']['itemCount']) {
                        childObject['paginationInfo']['nextBadgeDisabled'] = true;
                    } else {
                        childObject['paginationInfo']['nextBadgeDisabled'] = false;
                    }

                    res['records'] = this.cspfmCustomFieldProviderObject.makeSlickGridCustomFields(res['records'], this.columnDefinitions[childObject['objectName']]);

                    if (childObject['additionalInfo']['dataFetchMode'] === 'OnClickBatch') {
                        this.updateDataFetchStatus(childObject, false);
                        childObject['childDocsArray'] = [...res['records']]
                        // this.onClickLoader = true
                        // childObject['isLoading'] = false;
                        if (childObject['isAnyDataFetchPending']) {
                            childObject['isAnyDataFetchPending'] = false;
                            var sectionChildObjectHierarchy = this.sectionObjectsHierarchy[childObject['objectName']];
                            this.fetchAllDataWeb(sectionChildObjectHierarchy, childObject, 'current_page_refresh');
                        }
                        childObject['isLoading'] = false;
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
                        if (paginationAction) {
                            if (childObject['paginationInfo']['currentPageIndex'] > 0) {
                                childObject['paginationInfo']['currentPageIndex'] = childObject['paginationInfo']['currentPageIndex'] - 1;
                            }
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

    tabChilds: {
        [tabTitle: string]: Array<string>
    } = {};
    angularGridReady(angularGrid: AngularGridInstance, childObject, tabInfo?: {
        tabGroupId: string,
        tabTitle: string
    }) {
       this.observableListenerUtils.subscribe('conditional_validation', (data) => {            
               this.consolidateErrorData["showConsolidatePopup"] = false;
               this.showConsolidatePopup = true;
               this.conditionalValidationDatacontext = data;       
               this.failureReason = data['failureReason'];            

               let tempValidationFailureJson = {}
               tempValidationFailureJson["objectId"] = data["type"];
               tempValidationFailureJson["sectionType"] = 'LIST';
               tempValidationFailureJson["dataContext"] = data;
               tempValidationFailureJson["validationFailureSet"] = data["failureReason"]["validationFailureSet"]
               tempValidationFailureJson["messageType"] = data["failureType"]
               this.consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
       })
       this.observableListenerUtils.subscribe('Required_Fields_Error', (data) => {
           this.consolidateErrorData["showConsolidatePopup"] = false;
           this.showConsolidatePopup = false;
           this.requiredFieldsErrorPopup(data)            
       })
       this.observableListenerUtils.subscribe('Fields_Error', (data) => {
        this.consolidateErrorData["showConsolidatePopup"] = false;
        this.showConsolidatePopup = false;
        let objectName = data['dataContext']["type"];
        let  tempValidationFailureJson = {};
        this.showConsolidatePopup = false ;
        this.consolidateErrorData["saveButtonClicked"] = false; 
        this.consolidateErrorData["showConsolidatePopup"] = true;
        tempValidationFailureJson["objectId"] = data['dataContext']["type"];
        tempValidationFailureJson["dataContext"] = data['dataContext'];
        tempValidationFailureJson["sectionType"] = 'LIST';
        tempValidationFailureJson["validationFailureSet"] = data['dataContext']["failureReason"]["failureField"]
        tempValidationFailureJson["messageType"] = 'multilineError'
        this.consolidateErrorData["viewMode"] = 'RecordViewMode'
        this.consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
        let displayName = '';
        this.childObjectsInfo.forEach(childObject => {
            if (childObject['objectName'] == objectName){                    
                this.errorSet["errorRecords"] = childObject['errorRecords'];
                displayName = childObject['displayName'];               
            }
        })        
        this.childSection.emit({
            sectionName: displayName,
            viewMode: 'sectionViewMode',
            row: data['row'],
            dataContext: data['dataContext'],
            sectionType: 'LIST'
            // message: messageObject
          });
     
        
    })
        let listenerName = 'angular_slickgrid_cell_change_' + this.layoutId + '_' + childObject['objectName'];
        let subscriptionId = this.observableListenerUtils.subscribe(listenerName, (data) => {
            this.onCellChange(data['event'], data['args'])
            this.slickGridChangeCallback(data['childObjName'], data['args'])
        })

        if (tabInfo) {
            let tabUniqueKey = tabInfo['tabGroupId'] + '_' + tabInfo['tabTitle']
            if (!this.tabChilds[tabUniqueKey]) {
                this.tabChilds[tabUniqueKey] = []
            }
            this.tabChilds[tabUniqueKey].push(childObject['objectName'])
        }
        childObject['gridMenuExtension'] = angularGrid.extensionService.getExtensionByName(ExtensionName.gridMenu)
        childObject['angularGridInstance'] = angularGrid
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

        angularGrid.slickGrid.onBeforeEditCell.subscribe((event, args) => {
           //  if (args.item['systemAttributes']) {
           //      this.appUtilityConfig.fetchLockedUserDetail(args.item, this.workFlowMapping, this.cspfmMetaCouchDbProvider)
           //  }
            if (!childObject['isLoading'] && !args.item['systemAttributes']) {
                this.gridIdConfig.setIdForInlineEdit(document, args['column']['params']['fieldInfo']['objectName'])
            }
           //  return !childObject['isLoading'] && !this.isnavigated && this.isdblclicked && !args.item['systemAttributes']
            let slickGrid: SlickGrid = childObject['gridObj']
            return slickGrid['cspfmSlickGridMode'] === 'Edit' || (slickGrid['cspfmEditableRecordIds'] &&slickGrid['cspfmEditableRecordIds'].includes(args.item['id']));
        })
        childObject['gridObj'] = angularGrid.slickGrid;
        childObject['gridObj'].setHeaderRowVisibility(false);
        childObject['angularGridInstance']['slickGrid']['cspfmSlickGridMode'] = 'Edit' // On load the layout mode is edit
        childObject['angularGridInstance']['slickGrid']['cspfmEditableRecordIds'] = [];
        childObject['angularGridInstance']['slickGrid']['cspfmEditedRecords'] = {};
        childObject['angularGridInstance']['slickGrid']['cspfmColumnIndexMapping'] = { ...this.slickgridUtils.getColumnProps(angularGrid.slickGrid.getColumns()) };
        childObject['gridObj'].onBeforeSetColumns.subscribe((event, args) => {
            childObject['gridObj']['cspfmColumnIndexMapping'] = { ...this.slickgridUtils.getColumnProps(args['newColumns']) };
        })

        childObject['gridObj']['cspfm_grid_custom_data'] = {
            "page_title_key": "organizationmaster_d_w_hl_list.Layout.organizationmaster_d_w_hl_list",
            "object_display_name": childObject['displayName'],
            "angular_grid_excel_export_service_instance": angularGrid.excelExportService,
            "angular_grid_export_service_instance": angularGrid.exportService,
            "isPaginationEnabled": childObject['gridObj'].getOptions()['enablePagination'],
            'listener_name': listenerName,
            'cell_change_event_subscription_id': subscriptionId
        }
        if (childObject['gridObj'].getCanvasWidth() < window.innerWidth) {
            childObject['gridObj'].setOptions({
                enableAutoSizeColumns: true,
                autoFitColumnsOnFirstLoad: true,
            })
        }
        if ((!childObject['isInitialGroupingSet'] && this.sectionObjectDetails[childObject['objectName']]['groupingColumns'].length > 0) ||
            (childObject['groupColumns'] && childObject['groupColumns'].length > 0)) {
            // this.slickgridUtils.setInitialGrouping(childObject['objectName'], childObject['gridObj'], this.sectionObjectDetails[childObject['objectName']]['groupingColumns'], this.tableColumnInfo, childObject['draggableGroupingPlugin'])
        }


    }

    urlsubscribe(){
       
       this.slickGridPopoverService._getChangedValue.subscribe(value => {
           if (value['from'] == 'slickgrid') {
               const columnDefinition = value['args'].grid.getColumns()
               const fieldInfoObj = columnDefinition[value['args'].cell].params.fieldInfo
               let item = value['args'].grid.getData().getItem(value['args']['row']);
               const recordId = item.type + '_2_' + item.id
               let urlDBValue = value['dbData'];
               let data = item[value['fieldName']] || '';
               data = this.appUtilityConfig.isValidJson(data);
               let text, url, urlArray = [];
               text = data;
               url = data;
               let childObjectData = this.slickgridUtils.getChildObject(this.objectTableMappingObj.mappingDetail[value['objectName']], this.childObjectsInfo);
               this.slickGridChangeCallback(childObjectData['objectName'], { dataContext: item, columnDef: columnDefinition[value['args'].cell] })
               if (value['inputType'] == 'delete') {
                   // Conditional Validation
                   this.slickgridUtils.deleteFieldValue(value['args'], value['fieldName'], value['isMultipleUrlField'], value['dbData'], true,  childObjectData.angularGridInstance, this.conditionalValidationJson);
                   return;
               } else {
                   if (typeof data == 'string' && data != '') {
                       urlArray.push({
                           urlType: value['isMultipleUrlField'] ? 'multiple' : 'single',
                           urlDBValue: {
                               displayValue: text,
                               urlValue: url
                           }
                       })
                   } else {
                       urlArray = data['urlDBValue'] || [];
                   }
                   if (value['inputType'] == 'edit' && value['isMultipleUrlField'] ) {
                     urlDBValue = urlArray;
                     urlDBValue[value['selectedRecordIndex']] = value['dbData'][0];
                   } else if (value['inputType'] == 'add-entry' && value['isMultipleUrlField']) {
                     urlDBValue = urlArray;
                     urlDBValue.push(...value["dbData"]);
                   }
                   let dbData: any = {
                       urlType: value['isMultipleUrlField'] ? 'multiple' : 'single',
                       urlDBValue: urlDBValue
                   }
                   dbData = JSON.stringify(dbData);
                   console.log('....value.....',value)
                   const childObject = this.slickgridUtils.getChildObject(this.objectTableMappingObj.mappingDetail[value['objectName']], this.childObjectsInfo)
                   //const childObject = this.slickgridUtils.getChildObject(this.__employeedetail$tableName, this.childObjectsInfo)

                   let tempItem = JSON.parse(JSON.stringify(item));
                   tempItem[fieldInfoObj["fieldName"]] = dbData;
                   childObject.angularGridInstance.gridService.upsertItems(tempItem, {
                     highlightRow: false
                   })
                   // Conditional Validation
                   //this.slickgridUtils.fetchEditedRecord(appConstant.couchDBStaticName, this.angularGrid, recordId, fieldInfoObj, dbData, item, this.conditionalValidationJson);
               }
           }
       });
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
            //   if (columns[cell]['type'] === FieldType.unknown) {
            //     var actionInfo = columns[cell]['params']['actionInfo'] && columns[cell]['params']['actionInfo'][0]
            //     if (actionInfo['actionType'] !== 'Who column') {
            //         console.log("actionInfo", actionInfo);
            //
            //     }
            //   }
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

    onItemChildTap(childItem, objectName) {
        if (this.isPopUpEnabled) {
            this.dialogRef.close();
        }
        var redirectUrlForNav = '';
        if (this.isPopUpEnabled) {
            // redirectUrlForNav = this.redirectUrl
        } else {
            redirectUrlForNav = '/menu/organizationmaster_d_w_hl_list';
        }
        // let prominientObject = this.prominetDataMapping[childItem['type']];
        // const itemTapNavigationParams = {
        //     parentObj: JSON.stringify(this.dataObject['organizationmaster_DUMMY']),
        //     parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]["fieldName"],
        //     parentTitle: childItem["displayName"],
        //     parentFieldValue: this.dataObject['organizationmaster_DUMMY'],
        //     id: childItem["id"],
        //     prominientObjectInfo: prominientObject,
        //     redirectUrl: redirectUrlForNav
        // }
        // this.navigateObjectDetailPage(objectName, itemTapNavigationParams)
    }

    async showLookupForMultiLineEntry(sectionPrimaryObjectId) {
       if(!this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['multiLineResultLookupConfiguration'][sectionPrimaryObjectId]){
           return;
       }
        let lookupFieldId = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['multiLineResultLookupConfiguration'][sectionPrimaryObjectId]['resultLookupFieldId']
        // this.selectedCurrentEvent = event;
        let lookupInputConfig = {
            layoutId: this.layoutId,
            dataObject: this.dataObject,
            // criteriaDataObject:this.criteriaDataObject,
            // formGroup:this.formGroup,
            // lookupCriteriaValidationFields:this.lookupCriteriaValidationFields,
            lookupFieldId: lookupFieldId,
            lookupCriteriaQueryConfig: {},
            // loggedUserCorHeirarchyDetail:this.loggedUserCorHeirarchyDetail,
            // searchValue:searchValue,
        }
        let lookupInput = await this.cspfmLookupServiceObj.makeLookupQuery(lookupInputConfig)
        // if(this.lookupCriteriaQueryConfig[lookupFieldId]){
        //     this.lookupCriteriaDependentField = {};
        //     this.lookupCriteriaDependentField['showConsolidatePopup'] = false;
        //     if(lookupInput['criteriaRestriction']){
        //         this.lookupCriteriaDependentField['validationFailureSet'] = lookupInput['validationFailureSet']
        //         this.lookupCriteriaDependentField['objectId'] = lookupInput['lookupCriteriaObjectId']
        //         this.lookupCriteriaDependentField['messageType'] = "LookupCriteriaError"
        //         this.lookupCriteriaDependentField['showConsolidatePopup'] = true;                
        //         return
        //     }
        // }
        // this.lookupCriteriaDependentField['showConsolidatePopup'] = false;
        const dialogConfig = new MatDialogConfig()


        dialogConfig.data = {
            serviceObject: lookupInput['additionalData']['isStandardObject'] ? this.dataProvider.getMetaDbServiceProvider(appConstant.couchDBStaticName) : this.dataProvider.getDbServiceProvider(appConstant.couchDBStaticName),
            parentPage: this,
            dataSource: appConstant.couchDBStaticName,
            lookupColumnName: lookupInput['additionalData']['objectRootPath'],
            lookupInput: lookupInput,
            autoPopup: event ? false : true,
            objectName: lookupInput['objectHierarchy']['objectName'],
            sectionObjectName: sectionPrimaryObjectId
        };
        dialogConfig.panelClass = 'custom-dialog-container'
        this.dialog.open(cspfmweblookuppage, dialogConfig);
    }

    multiSelectionLookupResponse(selectedRecords, sectionObjectName) {
        const childObject = this.slickgridUtils.getChildObject(sectionObjectName, this.childObjectsInfo)

        let objectName = childObject['objectName'];
        if (!childObject['slickgridChildDocsArray']) {
            childObject['slickgridChildDocsArray'] = []
        }
        var sectionChildObjectHierarchy = this.sectionObjectsHierarchy[childObject['objectName']];
        if (selectedRecords.length > 0) {
            // let lookupFieldId = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['multiLineResultLookupConfiguration'][sectionObjectName]['resultLookupFieldId']
            selectedRecords.forEach(selectedRec => {
                this.multiLineEntryUtils.addChildData(childObject, sectionChildObjectHierarchy, this.columnDefinitions)
                // let data = JSON.parse(JSON.stringify(this.dataProvider.tableStructure()[objectName]))
                // data['id'] = childObject['slickgridChildDocsArray'].length + 1 + '_' + new Date().getTime();
                // data[lookupFieldId] = selectedRec
                // childObject['slickgridChildDocsArray'].push(data)
            });
            childObject['slickgridChildDocsArray'] = [...childObject['slickgridChildDocsArray']]
        }
    }

    navigateToEntryPage(childObject) {
        let objectName = childObject['objectName'];
        if (!childObject['slickgridChildDocsArray']) {
            childObject['slickgridChildDocsArray'] = []
        }
        this.multiLineEntryUtils.addChildData(childObject, this.sectionObjectsHierarchy[childObject['objectName']], this.columnDefinitions)
        childObject['slickgridChildDocsArray'] = [...childObject['slickgridChildDocsArray']]

        var redirectUrlForNav = ''
        this.onChangeConsolidateMsg = {}
        // if (this.isPopUpEnabled) {
        //     this.dialogRef.close();
        //     redirectUrlForNav = this.redirectUrl;
        // } else {
        //     redirectUrlForNav = '/menu/organizationmaster_d_w_hl_list';
        // }

        // if (this.objectRelationshipMapping[childObject['objectName']] === 'one_to_one' && this.dataObject['organizationmaster_DUMMY'][childObject['objectName'] + 's'].length > 0) {
        //     this.appUtilityConfig.presentToast("Only one " + childObject['displayName'] + " for each " + this.objectNameMapping['pfm0s']);
        //     return
        // }
        // if (childObject['objectName'] === 'pfm352313') {
        //     if (this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']]) {
        //         let getFieldType = this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldType'];
        //         if (getFieldType === 'MULTISELECT' || getFieldType === 'RADIO' || getFieldType === 'CHECKBOX' || getFieldType === 'DROPDOWN') {
        //             this.parentValue = this.multiSelectAndCheckBoxValueMaking(this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']], this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['mappingDetails'])
        //         } else if (getFieldType === 'DATE') {
        //             this.parentValue = moment(new Date(this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']])).tz(this.appUtilityConfig.userTimeZone).format(this.appUtilityConfig.userDatePickerFormat);
        //         } else if (getFieldType === 'TIMESTAMP') {
        //             this.parentValue = moment(new Date(this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']])).tz(this.appUtilityConfig.userTimeZone).format(this.appUtilityConfig.userDateTimePickerFormat);
        //         } else {
        //             this.parentValue = this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']]
        //         }
        //     }

        //     const navigationParameters = {
        //         action: "Add",
        //         parentId: this.id,
        //         parentObj: JSON.stringify(this.dataObject['organizationmaster_DUMMY']),
        //         parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['label'],
        //         parentFieldValue: this.parentValue,
        //         parentName: this.tableName_pfm352033,
        //         redirectUrl: redirectUrlForNav
        //     };
        //     this.router.navigate(['/menu/departmentmaster_Entry_Web'], {
        //         queryParams: navigationParameters,
        //         skipLocationChange: true
        //     });

        // }
        // if (this.objectRelationshipMapping[childObject['objectName']] === 'one_to_one' && this.dataObject['organizationmaster_DUMMY'][childObject['objectName'] + 's'].length > 0) {
        //     this.appUtilityConfig.presentToast("Only one " + childObject['displayName'] + " for each " + this.objectNameMapping['pfm0s']);
        //     return
        // }
        // if (childObject['objectName'] === 'pfm352013') {
        //     if (this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']]) {
        //         let getFieldType = this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldType'];
        //         if (getFieldType === 'MULTISELECT' || getFieldType === 'RADIO' || getFieldType === 'CHECKBOX' || getFieldType === 'DROPDOWN') {
        //             this.parentValue = this.multiSelectAndCheckBoxValueMaking(this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']], this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['mappingDetails'])
        //         } else if (getFieldType === 'DATE') {
        //             this.parentValue = moment(new Date(this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']])).tz(this.appUtilityConfig.userTimeZone).format(this.appUtilityConfig.userDatePickerFormat);
        //         } else if (getFieldType === 'TIMESTAMP') {
        //             this.parentValue = moment(new Date(this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']])).tz(this.appUtilityConfig.userTimeZone).format(this.appUtilityConfig.userDateTimePickerFormat);
        //         } else {
        //             this.parentValue = this.dataObject['organizationmaster_DUMMY'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']]
        //         }
        //     }

        //     const navigationParameters = {
        //         action: "Add",
        //         parentId: this.id,
        //         parentObj: JSON.stringify(this.dataObject['organizationmaster_DUMMY']),
        //         parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['label'],
        //         parentFieldValue: this.parentValue,
        //         parentName: this.tableName_pfm352033,
        //         redirectUrl: redirectUrlForNav
        //     };
        //     this.router.navigate(['/menu/employeedetail_Entry_Web'], {
        //         queryParams: navigationParameters,
        //         skipLocationChange: true
        //     });

        // }
    }

    goToFullViewList(selectedRecord) {
        if (this.isPopUpEnabled) {
            this.dialogRef.close();
        }
        // var redirectUrlForNav = '';
        // if (this.isPopUpEnabled) {
        //     redirectUrlForNav = this.redirectUrl;
        // } else {
        //     redirectUrlForNav = "/menu/organizationmaster_d_w_hl_list";
        // }
        // var ob = this.sectionObjectsHierarchy[selectedRecord.objectName];
        // delete ob["queryBatch"]
        // selectedRecord["parentTitle"] = this.objectNameMapping["pfm0s"];
        // let itemtapnavigationObj = {
        //     parentObj: JSON.stringify(this.dataObject['organizationmaster_DUMMY']),
        //     parentObjType: this.tableName_pfm352033,
        //     parentLabel: selectedRecord["parentTitle"],
        //     // sectionObjectDetails: JSON.stringify(this.sectionObjectDetails[selectedRecord["objectName"]]),
        //     childObjectHierarchyJSON: JSON.stringify(
        //         this.sectionObjectsHierarchy[selectedRecord["objectName"]]
        //     ),
        //     objLabel: selectedRecord["displayName"],
        //     objType: selectedRecord["objectName"],
        //     parentDependentObjectList: JSON.stringify(this.dependentObjectList),
        //     sectionDependentObjectList: JSON.stringify(this.sectionDependentObjectList[this.layoutId + "_" + selectedRecord["objectName"]]),
        //     objectHierarchyJSON: JSON.stringify(this.objectHierarchyJSON),
        //     redirectUrl: redirectUrlForNav,
        // };
        // this.toastCtrl.dismiss();
        /*
            if (selectedRecord.objectName == 'pfm352013') {
                this.router.navigate(["/menu/organizationmaster_d_w_hl_listpreview"], {
                    queryParams: itemtapnavigationObj,
                    skipLocationChange: true
                });
            }if (selectedRecord.objectName == 'pfm352313') {
                this.router.navigate(["/menu/organizationmaster_d_w_hl_listpreview"], {
                    queryParams: itemtapnavigationObj,
                    skipLocationChange: true
                });
            }
        */
        // this.router.navigate(["/menu/organizationmaster_d_w_hl_listpreview"], {
        //     queryParams: itemtapnavigationObj,
        //     skipLocationChange: true
        // });
    }

    getSelectionEditorOptions(childObjectName) {
        return {
            noMatchesFound: "",
            onClose: () => {
                const childObject = this.slickgridUtils.getChildObject(childObjectName, this.childObjectsInfo)
                if (childObject) {
                    childObject['gridObj'].getEditorLock().commitCurrentEdit();
                }
            }
        }
    }

    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    mergeWithTableStructure(item) {
        if (item['type'] && !item['created_by']) {
            let tableStructure = this.dataProvider.tableStructure()
            let tempData = JSON.parse(JSON.stringify(tableStructure[item['type']]));
            item = lodash.extend({}, tempData, item)
        }
        return item;
    }

    inLineEditlookupSelected(event, childObjectName) {
        if (event['actionName'] === "selection") {
            let dataContext = event['dataContext']
            let columnDef: Column = event['columnDef']
            this.slickGridChangeCallback(childObjectName, { dataContext, columnDef })

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
            let saveData = this.slickGridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).data;
            let savefieldInfo = this.slickGridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).fieldInfo;
            const recordId = saveData.type + '_2_' + saveData.id
            let childObjectData = this.slickgridUtils.getChildObject(childObjectName, this.childObjectsInfo);
            var gridInstance = childObjectData['angularGridInstance']
            let tempItem = JSON.parse(JSON.stringify(dataContext));
            tempItem[savefieldInfo["fieldName"]] = event['item'];
            gridInstance.gridService.upsertItems(tempItem, {
                highlightRow: false
            })
            // DB Save commented for development purpose. Need to handle the flow for multi line entry feature
            // this.slickgridUtils.fetchEditedRecord(this.dataSource, gridInstance, recordId, savefieldInfo, event['item'], dataContext)
        }
    }

    onActionCellClick(mouseEvent: KeyboardEvent | MouseEvent, args: OnEventArgs, objectName?) {
        let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
        if (htmlElement && htmlElement.innerHTML) {
            htmlElement.innerHTML = "";
        }
        let childObject = this.slickgridUtils.getChildObject(objectName, this.childObjectsInfo);
        let parentElement = mouseEvent && mouseEvent.target && mouseEvent.target['parentElement'] || undefined;
        let actionView = parentElement && parentElement.getAttribute('action-view') || undefined;
        let actionInfoValue = parentElement && parentElement.getAttribute('action-info') || undefined;
        let additionalChipValues = parentElement && parentElement.getAttribute('additionalChipValues') || '[]';
        let data = args.dataContext;
        if (actionView && actionInfoValue && actionView === 'button') {
            let actionInfo = JSON.parse(actionInfoValue);
            if (actionInfo['actionType'] === "WHO_COLUMN") {
                const traversalPath = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["objectTraversal"][actionInfo["traversalPath"]]
                args['dataContext'] = this.cspfmDataTraversalUtilsObject.getDataObject(data, traversalPath)
                if (actionInfo['auditType'] && actionInfo['auditType'] === 'Detail') {
                    this.appUtilityConfig.webServiceCallForFieldTracking(args['dataContext']).then(res => {
                        const dialogConfig = new MatDialogConfig()
                        dialogConfig.data = res
                        dialogConfig.autoFocus = false
                        const dialogRef = this.dialog.open(cspfmAlertDialog, dialogConfig);
                        data['__isPopoverOpened'] = true;
                        dialogRef.afterClosed().subscribe(() => {
                            data['__isPopoverOpened'] = false;
                        });
                    })
                } else {
                    this.slickGridPopoverService.appendComponentToElement('cs-dropdown-' + this.layoutId, cspfmSlickgridPopover, args, actionInfo);
                }

            } else if (actionInfo['actionType'] === "URL") {
                let isPageRedirectionDisabled = parentElement && parentElement.getAttribute('isPageRedirectionDisabled') || undefined;
                if (!isPageRedirectionDisabled) {
                    let isMultiUrlField = parentElement && parentElement.getAttribute('isMultiUrlField') || undefined;
                    let inputType = parentElement && parentElement.getAttribute('inputType') || undefined;
                    let fieldName = parentElement && parentElement.getAttribute('fieldName') || undefined;
                    let primaryChipCount = parentElement && parentElement.getAttribute('primaryChipCount') || 0;
                    let editRecordIndex = parentElement && parentElement.getAttribute('editRecordIndex') || 0;
                    isMultiUrlField = (isMultiUrlField === 'true');
                    primaryChipCount = Number(primaryChipCount)
                    editRecordIndex = Number(editRecordIndex)
                    if (inputType == 'delete' && args.columnDef.params.isInlineEditable) {
                        // Conditional Validation
                        this.slickgridUtils.deleteFieldValue(args, fieldName, isMultiUrlField, JSON.parse(additionalChipValues), false, childObject['angularGridInstance']);
                        return
                    }
                    let fieldId, actionId;
                    fieldId = 'FLD_organizationmaster_DUMMY$$' + fieldName + '_input_';
                    actionId = 'ACT_organizationmaster_DUMMY$$' + fieldName + '_input_';
                    let selectedRecordIndex = 0;
                    if (inputType == 'slickgrid-view') {
                        additionalChipValues = JSON.parse(additionalChipValues);
                    } else if (inputType == 'view') {
                        additionalChipValues = JSON.parse(additionalChipValues);
                        selectedRecordIndex = primaryChipCount + 1;
                    } else if (inputType == 'edit') {
                        additionalChipValues = JSON.parse(additionalChipValues);
                        selectedRecordIndex = editRecordIndex;
                    } else if (inputType == 'add-entry') {
                        additionalChipValues = [{
                            displayValue: '',
                            urlValue: ''
                        }];
                    }
                    let additionalInfo = {
                        "cspfmObjectName": "organizationmaster",
                        "inputType": inputType,
                        "isMultipleUrlField": isMultiUrlField,
                        "urlArray": additionalChipValues,
                        "fieldId": fieldId,
                        "actionId": actionId,
                        "args": args,
                        "actionType": "URL",
                        "selectedRecordIndex": selectedRecordIndex
                    }
                    const cspfmUrlPopoverClassName = 'cspfmUrlPopover'
                    import(`../cspfmUrlPopover/${cspfmUrlPopoverClassName}.ts`)
                      .then(urlInstance => {
                        if(urlInstance && urlInstance[cspfmUrlPopoverClassName]){
                            this.slickGridPopoverService.appendComponentToElement('cs-dropdown-' + this.layoutId, urlInstance[cspfmUrlPopoverClassName], args, additionalInfo);
                        }
                        else{
                          console.error('cannot find cspfmUrlPopover component')
                        }
                      }).catch(err => {
                        console.error('cannot find cspfmUrlPopover component',err)
                      })
                }
            }
        }


    }

    // 27May2022#sudalaiyandi.a 
    onCellChange(mouseEvent: KeyboardEvent | MouseEvent, args: {
        grid: any;
        cell: any; dataContext: any; columnDef: Column; dataView: any;
    }) {
        let data = args.dataContext;
        console.log("onCellChange args ==> ", args);
        const objectName = args.columnDef.params.fieldInfo.objectName
       const sectionObjectId = this.objectTableMappingObj.mappingDetail[objectName];       
        const traversalDataObject = this.cspfmDataTraversalUtilsObject.getRelationshipObjectsFromPrimaryDataSet(data, this.layoutId, sectionObjectId)
        console.log("traversalDataObject ==> ", traversalDataObject);

        const sectionFormulaConfig = this.formulaConfig[sectionObjectId] || {}

        Object.keys(sectionFormulaConfig).forEach(formulaConfigField => {
            const formulaConfig = sectionFormulaConfig[formulaConfigField]
            console.log("formulaConfig ==> ", formulaConfig);

            const formulaResult = this.formulaService.evaluate(formulaConfig, traversalDataObject,true);
            console.log("formulaResult ==> ", formulaResult);
            if (formulaResult !== null && formulaResult !== undefined && formulaResult !== "null") {
                const formulaField = formulaConfig["fieldName"] + "__f"
                const objectTraversal = objectName + "_DUMMY"
                data[formulaField] = formulaResult
            }
        })
        const objectID = this.objectTableMappingObj.mappingDetail[objectName];

        let childObject = this.slickgridUtils.getChildObject(objectID, this.childObjectsInfo);
            const angularGridInstance: AngularGridInstance = childObject['angularGridInstance']
            angularGridInstance.dataView.beginUpdate();
            var value = angularGridInstance.dataView.getItemById(args.dataContext['id'])
            if (value) {
                angularGridInstance.dataView.updateItem(args.dataContext['id'], data);
            } else {
                angularGridInstance.dataView.addItem(args.dataContext);
            }
            angularGridInstance.dataView.endUpdate();
            angularGridInstance.dataView.reSort();

        console.log("after formula calculation traversalDataObject ==> ", data);

        
        const dependentFieldInfo = args.columnDef.params.fieldInfo.dependentPickList
        const fieldName = args.columnDef.params.fieldInfo.fieldName
        if (dependentFieldInfo !== undefined && Object.keys(dependentFieldInfo).length > 0) {
           //  const objectName = args.columnDef.params.fieldInfo.objectName
           //  const objectID = this.objectTableMappingObj.mappingDetail[objectName];
            const changesApplyField = dependentFieldInfo["changesApplyFields"]
            if (changesApplyField !== undefined) {
                changesApplyField.forEach(changeFieldName => {
                    args.dataContext[changeFieldName] = ''
                })
            }
            let childObject = this.slickgridUtils.getChildObject(objectID, this.childObjectsInfo);
            const angularGridInstance: AngularGridInstance = childObject['angularGridInstance']
            angularGridInstance.dataView.beginUpdate();
            var value = angularGridInstance.dataView.getItemById(args.dataContext['id'])
            if (value) {
                angularGridInstance.dataView.updateItem(args.dataContext['id'], args.dataContext);
            } else {
                angularGridInstance.dataView.addItem(args.dataContext);
            }
            angularGridInstance.dataView.endUpdate();
            angularGridInstance.dataView.reSort();
        }
        const fieldInfoObj = args['columnDef']['params']['fieldInfo'];
        if (fieldInfoObj['fieldType'] === 'DATE') {
            if (args.dataContext[fieldInfoObj.fieldName] instanceof Date) {
                args.dataContext[fieldInfoObj.fieldName] = args.dataContext[fieldInfoObj.fieldName].getTime() + moment.tz(Intl.DateTimeFormat().resolvedOptions().timeZone).utcOffset() * 60 * 1000;
            }
        } else if (fieldInfoObj['fieldType'] === 'TIMESTAMP') {
            if (args.dataContext[fieldInfoObj.fieldName] instanceof Date) {
                args.dataContext[fieldInfoObj.fieldName] = args.dataContext[fieldInfoObj.fieldName].getTime();
            }
        }
        // 08Jun2022#sudalaiyandi.a 
        // Conditional Validation
        const conditionalValidationEnable = args.columnDef.params.fieldInfo.conditionalValidationEnable
        if (conditionalValidationEnable) {
            const fieldName = args.columnDef.params.fieldInfo.fieldName
            const objectName = args.columnDef.params.fieldInfo.objectName
            const fieldDisplayName = fieldName + "$$" + objectName
            const sectionObjectId = this.objectTableMappingObj.mappingDetail[objectName];
            const fieldInfoObj = args['columnDef']['params']['fieldInfo'];
            if (args['columnDef']['params']['fieldInfo']['fieldType'] === 'LOOKUP') {
                let fieldName = args['columnDef']['params']['fieldInfo']['fieldName'];
                args.dataContext[fieldName] = mouseEvent['item'];
            }
            this.cspfmDataTraversalUtilsObject.seperateRelatioshipObjectsFromPrimaryDataSet(data, this.conditionalValidationJson[objectID], this.conditionalValidationJson[objectID].layoutId, sectionObjectId);
            this.handleConditionalValidatioOnChange(fieldDisplayName, data, objectID)
            console.log("data once condition validation applied ==> ", data);

        }
    }

    // clearExistingDataInPickList(userSelectedValue, isNeedToClear, objectName: string, dataObject?) {
    //     var removeFieldArray = userSelectedValue['changesApplyFields'];
    //     if (removeFieldArray == undefined || removeFieldArray == '') {
    //         return;
    //     }
    //     if (isNeedToClear) {
    //         return;
    //     }
    //     removeFieldArray.forEach(fieldName => {
    //         delete this.pickListValues[objectName][fieldName];
    //     });
    // }
    initiateConditionalValidation(childObjectName) {
        if (this.conditionalValidationJson[childObjectName]) {
            this.conditionalValidationJson[childObjectName]['dataObject'] = this.dataObject;
            this.conditionalValidationJson[childObjectName]['layoutType'] = "MultiLineEntry";
            this.cspfmConditionalValidationUtils.fetchConditionalValidationConfigJSON(this.conditionalValidationJson[childObjectName]);
            console.log("this.conditionalValidationJson ==> ", this.conditionalValidationJson[childObjectName]);
        }
    }

    handleConditionalValidatioOnChange(fieldName, data, childObjectName) {
        if (this.conditionalValidationJson[childObjectName] && this.conditionalValidationJson[childObjectName]['validationRules'].length > 0) {
            const validationResultObject = this.cspfmConditionalValidationUtils.
                applyValidationForOnChange(this.conditionalValidationJson[childObjectName], 'onChange', fieldName)
            this.showValidationMessage(validationResultObject, 'onChange', fieldName, data)
        }
    }
    updateValidation(event: object, classContext: object) {
       if (classContext.hasOwnProperty('skipValidation')) {// For Action Validation
           classContext["skipValidation"].push(event);
       }
       const actionId = event.hasOwnProperty('actionId') ? event["actionId"] : []; // For Action Validation
       const messageType = event["messageType"]
       const messageObject = event["message"]
       if (actionId.length > 0) { // For update Action Validation
           const validationObject = classContext["onClickConsolidateMsg"][actionId]
           const validationArray = validationObject[messageType]
           validationArray.forEach(validateObject => {
               if (validateObject["formula"] === messageObject["formula"]) {
                   const index = validationArray.findIndex((x: any) => x['formula'] === validateObject["formula"])
                   validationArray.splice(index, 1)
               }
           });
       } else { // For Update Field Validation
           const validationArray = classContext["onChangeConsolidateMsg"][messageType]
           validationArray.forEach(validateObject => {
               if (validateObject["formula"] === messageObject["formula"]) {
                   const index = validationArray.indexOf(validateObject["formula"])
                   validationArray.splice(index, 1)
               }
           });
           // if ((classContext["onChangeConsolidateMsg"].hasOwnProperty('Information') && classContext["onChangeConsolidateMsg"]['Information'].length == 0) || (classContext["onChangeConsolidateMsg"].hasOwnProperty('Warning') && classContext["onChangeConsolidateMsg"]['Warning'].length == 0)){
           //     this.conditionalValidationDatacontext['isFailure'] = false;
           // }
           let conditionalValidationCheck = true;
           if (classContext["onChangeConsolidateMsg"].hasOwnProperty('Information')){
               if (classContext["onChangeConsolidateMsg"]['Information'].length == 0){
                   conditionalValidationCheck = true;
               }else{
                   conditionalValidationCheck = false;
               }
           }
           if (classContext["onChangeConsolidateMsg"].hasOwnProperty('Warning')){
               if(classContext["onChangeConsolidateMsg"]['Warning'].length == 0){
                   conditionalValidationCheck = true;
               }else{
                   conditionalValidationCheck = false;
               }
           }
           if (classContext["onChangeConsolidateMsg"].hasOwnProperty('Error')){
               if(classContext["onChangeConsolidateMsg"]['Error'].length == 0){
                   conditionalValidationCheck = true;
               }else{
                   conditionalValidationCheck = false;
               }
           }
           if (conditionalValidationCheck == true){
               this.conditionalValidationDatacontext['isFailure'] = false;
               this.updateDataFetchStatus(this.childObjectsInfo[0], false);
           }
       }
   }

    updateDataFetchStatus(childObject, status: boolean) {
       let angularGrid: AngularGridInstance = childObject['angularGridInstance'];
       let slickgrid: SlickGrid = angularGrid['slickGrid'];
       slickgrid['isDataFetching'] = status;
       slickgrid.invalidate()
       slickgrid.render()
       angularGrid.resizerService.resizeGrid();
   }
   requiredFieldsErrorPopup(data){
       let  tempValidationFailureJson = {};  
       this.showConsolidatePopup = false ;
       this.consolidateErrorData["saveButtonClicked"] = false; 
       this.consolidateErrorData["showConsolidatePopup"] = true;
       tempValidationFailureJson["sectionType"] = 'LIST';
       tempValidationFailureJson["dataContext"] = data;
       tempValidationFailureJson["objectId"] = data["type"];
       tempValidationFailureJson["validationFailureSet"] = data["failureReason"]["validationFailureSet"]
       tempValidationFailureJson["messageType"] = data["failureType"]
       this.consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
   }

   consolidateErrorPopup(data, errorRecords?, displayName?){
       if (data["failureType"] == 'uniqueValidationFailure'){
           let  tempValidationFailureJson = {};  
           this.showConsolidatePopup = false ;
           this.consolidateErrorData["saveButtonClicked"] = false; 
           this.consolidateErrorData["showConsolidatePopup"] = true;
           tempValidationFailureJson["objectId"] = data["type"];
           tempValidationFailureJson["dataContext"] = data;
           tempValidationFailureJson["sectionType"] = 'LIST';
           tempValidationFailureJson["validationFailureSet"] = data["failureReason"]["validationFailureSet"]
           tempValidationFailureJson["messageType"] = 'UniqueError'
           this.consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
       }
       else if(data["failureType"] == 'compositeValidationFailure'){
           let  tempValidationFailureJson = {};  
           this.showConsolidatePopup = false ;
           this.consolidateErrorData["saveButtonClicked"] = false; 
           this.consolidateErrorData["showConsolidatePopup"] = true;
           tempValidationFailureJson["objectId"] = data["type"];
           tempValidationFailureJson["dataContext"] = data;
           tempValidationFailureJson["sectionType"] = 'LIST';
           tempValidationFailureJson["validationFailureSet"] = data["failureReason"]["validationFailureSet"]
           tempValidationFailureJson["messageType"] = 'CompositeError'
           this.consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
       }
       else if(data["failureType"] == 'couchdbValidationFailure'){
           let  tempValidationFailureJson = {};  
           this.showConsolidatePopup = false ;
           this.consolidateErrorData["saveButtonClicked"] = false; 
           this.consolidateErrorData["showConsolidatePopup"] = true;
           tempValidationFailureJson["objectId"] = data["type"];
           tempValidationFailureJson["dataContext"] = data;
           tempValidationFailureJson["sectionType"] = 'LIST';
           tempValidationFailureJson["validationFailureSet"] = data["failureReason"]["validationFailureSet"]
           tempValidationFailureJson["messageType"] = 'CouchdbError'
           this.consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
       }
       else if(data["failureType"] == 'multilineError'){
           let  tempValidationFailureJson = {};  
           this.showConsolidatePopup = false ;
           this.consolidateErrorData["saveButtonClicked"] = false; 
           this.consolidateErrorData["showConsolidatePopup"] = true;
           tempValidationFailureJson["objectId"] = data["type"];
           tempValidationFailureJson["dataContext"] = data;
           tempValidationFailureJson["sectionType"] = 'LIST';
           tempValidationFailureJson["validationFailureSet"] = data["failureReason"]["failureField"]
           tempValidationFailureJson["messageType"] = 'multilineError'
           if (errorRecords){
               this.errorSet["errorRecords"] = errorRecords;
               this.errorSet["displayName"] = displayName;
           }
           this.consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
       }
   }

    async childSectionValidation(action, objectName, saveButtonClicked) {
        this.consolidateErrorData["showConsolidatePopup"] = false;
        this.showConsolidatePopup = false;
        let childObjSet = this.getEditedLineData()[objectName]
        console.log("Child Data", childObjSet);
        let getData = this.getData()
        let childRecordValidation = true;
        if (getData != undefined){
            await this.dataProvider.checkCompositeFields(objectName, getData)
            await this.dataProvider.checkUniqueFields(objectName, getData)            
        }
        for (let i = 0; i < childObjSet.length; i++) {
            let singleSet = childObjSet[i];
            if (singleSet['rev']) {
                action = 'Edit'
            } else {
                action = 'Add'
            }
            await this.dataProvider.checkValidation(action, appConstant.couchDBStaticName, objectName,
               singleSet, null, this.consolidateErrorData, saveButtonClicked, null, getData).then(async (result) => {
                    if (result['status'] != 'SUCCESS') {
                        if (result['message'] == 'internalUniqueFailure') {
                            childRecordValidation = false;
                        } else {
                            childRecordValidation = false;
                            singleSet['isFailure'] = true;
                           //  singleSet['failureType'] = result['validationFailure'];
                           singleSet['failureType'] = 'multilineError';
                            singleSet['failureReason'] = result;
                            singleSet['consolidateflag'] = {
                                "errorFlag": this.consolidateErrorData,
                                "saveButton": saveButtonClicked
                            }
                        }
                    } else {
                        singleSet['isFailure'] = false;
                        singleSet['failureType'] = "";
                        singleSet['failureReason'] = {};
                        //  singleSet[parentObjectName] = parentID
                        console.log('child validation successfully');
                    }
                    console.log("childObjSet", childObjSet);
                    // this.updateDataFetchStatus(false);
                   //  this.updateDataFetchStatus(this.childObjectsInfo[0], false);
                })
        }        
        let childObjRecords = this.getData()[objectName]
           console.log("Child Data", childObjRecords);
           let errorRecords = [];
           childObjRecords.forEach(record => {
           if (record['isFailure'] == true){   
               let failureField = {};
               failureField['failureField'] =  record['failureReason']['failureField'];
                failureField['dataContext'] =  record;
                failureField['sectionType'] =  'LIST';
               errorRecords.push(failureField)
           }     
       
        })
        this.errorCount = errorRecords.length;
        let sectionName ="";
        this.childObjectsInfo.forEach(childObject => {
           if (childObject['objectName'] == objectName){
               childObject['errorRecords'] = errorRecords;
               sectionName = childObject['displayName'] 

           }
       }) 
       let childSectionObj = {}
       childSectionObj['childRecordValidation'] = childRecordValidation;
       childSectionObj['errorRecords'] = errorRecords;
       childSectionObj['sectionName'] = sectionName;
        return { "childSectionObj": childSectionObj }


    }

    errorCountClick(errorRecords, displayName){
        console.log('errorRecords', errorRecords)
        this.showConsolidatePopup = false;       
        let  tempValidationFailureJson = {};       
        // let dataContext = errorRecords[0]      
        // tempValidationFailureJson["objectId"] = data["type"];        
        tempValidationFailureJson["validationFailureSet"] = errorRecords
        // tempValidationFailureJson["messageType"] = 'multilineError'
        tempValidationFailureJson["sectionName"] = displayName;
        this.consolidateErrorData["validationFailureJson"] = JSON.parse(JSON.stringify(tempValidationFailureJson))
        this.consolidateErrorData["viewMode"] = 'sectionViewMode'
        this.consolidateErrorData["showConsolidatePopup"] = true;
        this.showConsolidatePopup = false;
        this.observableListenerUtils.emit('Parent_validation',{'showConsolidatePopup': false}) 
        this.childSection.emit({
            sectionName: displayName,
            viewMode: 'sectionViewMode',
            row: 0,
            sectionType: 'LIST',
            dataContext: '',
            // message: messageObject
          });  

        // this.consolidateErrorPopup(dataContext, errorRecords, displayName)   
        // this.observableListenerUtils.emit('Fields_Error',dataContext)   

     }

    updateChild(objectName){
       let data = {};
        this.childObjectsInfo.forEach(childObject => {
            if (childObject['objectName'] == objectName){
               data = childObject;
            }
        })
        
       this.updateDataFetchStatus(data, false);
    }
    
    childSectionParentIDAdd(sectionObjects, parentID, parentObjectName){
       sectionObjects.forEach(objectName => {
           let childObjSet = this.getData()[objectName] 
        console.log("Child Data", childObjSet); 
        childObjSet.forEach(singleSet =>{
           singleSet[parentObjectName] = parentID
        })   
        console.log('Parent Id updated successfully');
       })
    }
    
    //SWF ML
    addSystemAttribute(objectId) {
        let childObjSet = this.getData()[objectId]
        console.log("Child Data ==> ", childObjSet);
        // let objectName = Object.keys(this.objectTableMappingObj['mappingDetail']).filter(key => this.objectTableMappingObj['mappingDetail'][key] === objectId)[0];
        let workflowFields = Object.keys(this.pfmObjectConfig['objectConfiguration'][objectId]['workflow']) || undefined;
        let workflowFieldsInfo = this.pfmObjectConfig['objectConfiguration'][objectId]['workflow'] || undefined;
        if (workflowFields && workflowFieldsInfo) {
            childObjSet.forEach(singleSet => {
                workflowFields.forEach(workflowField => {
                    let statusInfo = workflowFieldsInfo[workflowField]['configJson'][singleSet[workflowField]][0];
                    if (statusInfo['isApproveInitiateEnabled'] === 'Y') {
                        // this.slickGridPopoverService.appendComponentToElement('cs-dropdown-' + this.layoutId, bulkWorkflowValidationService, args, actionInfo);
                        const bulkApprovalClassName = 'cspfmBulkWorkFlowValidation.service';
                        import(`../../../core/services/${bulkApprovalClassName}.ts`).then(bulkApprovalInstance =>{
                            if(bulkApprovalInstance && bulkApprovalInstance[bulkApprovalClassName]){
                                // let cspfmBulkWorkFlow: any = bulkApprovalInstance[bulkApprovalClassName];
                                let cspfmBulkWorkFlow = bulkApprovalInstance[bulkApprovalClassName];
                                singleSet['systemAttributes'] = cspfmBulkWorkFlow.addSystemAttributes(statusInfo, workflowFieldsInfo[workflowField]['fieldId'])
                            } else{
                                console.error('cspfmurlPopover component file is missing')
                            }
                        }).catch(error=>{
                            console.error('cspfmurlPopover component file is missing',error)
                
                        })
                    }
                })
            })
        }
    }

    showValidationMessage(validationResultObject, eventType, fieldName, data, actionId?) {
        if (validationResultObject["status"] === "Success") {
            const consolidateFlag = validationResultObject["consolidateFlag"]
            let Keys = Object.keys(validationResultObject["message"]);
            if (this.skipValidation.length > 0) {
                Keys.forEach((key) => {
                    this.skipValidation.forEach((skip) => {
                        validationResultObject["message"][key].forEach((res) => {
                            if (skip['message']['formula'] == res['formula']) {
                                let index = validationResultObject["message"][key].findIndex((x: any) => x['formula'] == skip['message']['formula']);
                                validationResultObject["message"][key].splice(index, 1);
                            }
                        })
                    })
                })
            }
            if (consolidateFlag) {
                if (eventType === 'onClick') {
                    const consolidateMsg = this.onClickConsolidateMsg[actionId]
                    if (consolidateMsg !== null && consolidateMsg !== undefined && Object.keys(consolidateMsg).length > 0) {
                        this.onClickConsolidateMsg = {};
                        let resultkey: any;
                        let consolidatMsg: any;
                        resultkey = Object.keys(validationResultObject["message"]);
                        resultkey.forEach(resultObjectkey => {
                            if (consolidateMsg[resultObjectkey] === undefined) {
                                consolidateMsg[resultObjectkey] = validationResultObject["message"][resultObjectkey]
                            }
                            const consolidateFormula = consolidateMsg[resultObjectkey].map(res => res.formula)
                            const validationArray = validationResultObject["message"][resultObjectkey]
                            validationArray.forEach(res => {
                                if (!consolidateFormula.includes(res.formula)) {
                                    this.onClickConsolidateTempMsg[resultObjectkey].push(res)
                                    this.onClickConsolidateMsg[actionId] = this.onClickConsolidateTempMsg
                                }
                            })
                            let changeConsolidateArray = consolidateMsg[resultObjectkey]
                            changeConsolidateArray.forEach(obj => {
                                validationArray.forEach(res => {
                                    if (obj.formula === res.formula) {
                                        obj.validationPass = res.validationPass
                                        obj.validationMessage = res.validationMessage
                                    }
                                })
                            })
                            consolidatMsg = changeConsolidateArray.filter(res => !res.validationPass)
                            this.onClickConsolidateTempMsg[resultObjectkey] = consolidatMsg
                        })
                        this.onClickConsolidateMsg[actionId] = Object.assign(this.onClickConsolidateTempMsg);
                    } else {
                        let resultkey: any;
                        resultkey = Object.keys(validationResultObject["message"]);
                        resultkey.forEach(resultObjKey => {
                            const validationArray = validationResultObject["message"][resultObjKey].filter(res => !res.validationPass)
                            if (validationArray) {
                                this.onClickConsolidateTempMsg[resultObjKey] = validationArray;
                                validationResultObject["message"][resultObjKey] = this.onClickConsolidateTempMsg[resultObjKey];
                            }
                        });
                        this.onClickConsolidateMsg[actionId] = validationResultObject["message"]
                    }
                } else {
                    if (this.onChangeConsolidateMsg !== null && this.onChangeConsolidateMsg !==
                        undefined && Object.keys(this.onChangeConsolidateMsg).length > 0) {
                        let resultkey: any;
                        resultkey = Object.keys(validationResultObject["message"]);
                        resultkey.forEach(resultObjectkey => {
                            if (this.onChangeConsolidateMsg[resultObjectkey] === undefined) {
                                this.onChangeConsolidateMsg[resultObjectkey] = validationResultObject["message"][resultObjectkey]
                            }
                            const consolidateFormula = this.onChangeConsolidateMsg[resultObjectkey].map(res => res.formula)
                            const validationArray = validationResultObject["message"][resultObjectkey]
                            validationArray.forEach(res => {
                                if (!consolidateFormula.includes(res.formula)) {
                                    this.onChangeConsolidateMsg[resultObjectkey].push(res)
                                }
                            })
                            let changeConsolidateArray = this.onChangeConsolidateMsg[resultObjectkey]
                            changeConsolidateArray.forEach(obj => {
                                validationArray.forEach(res => {
                                    if (obj.formula === res.formula) {
                                        obj.validationPass = res.validationPass
                                        obj.validationMessage = res.validationMessage
                                    }
                                })
                            })
                            this.onChangeConsolidateMsg[resultObjectkey] = changeConsolidateArray.filter(res => !res.validationPass)
                        })
                        this.onChangeConsolidateMsg = Object.assign(validationResultObject["message"], this.onChangeConsolidateMsg);
                    } else {
                        let resultkey: any;
                        resultkey = Object.keys(validationResultObject["message"]);
                        resultkey.forEach(resultObjKey => {
                            const validationArray = validationResultObject["message"][resultObjKey].filter(res => !res.validationPass)
                            if (validationArray) {
                                this.onChangeConsolidateMsg[resultObjKey] = validationArray;
                            }
                        })
                    }
                    if ((this.onChangeConsolidateMsg.hasOwnProperty('Error') && this.onChangeConsolidateMsg['Error'].length != 0) || (this.onChangeConsolidateMsg.hasOwnProperty('Information') && this.onChangeConsolidateMsg['Information'].length != 0) || (this.onChangeConsolidateMsg.hasOwnProperty('Warning') && this.onChangeConsolidateMsg['Warning'].length != 0)) {
                       // this.consolidateErrorData["showConsolidatePopup"] = false;
                       // this.showConsolidatePopup = true
                       data["isFailure"] = true
                       data["failureType"] = "conditional_validation"
                       data["conditional_validation"] = this.onChangeConsolidateMsg
                      //  this.updateDataFetchStatus(this.childObjectsInfo[0], false);
                   } else {
                      if (data["failureType"] == "conditional_validation"){
                       console.log("no errorsss");
                       data["isFailure"] = false
                       data["failureType"] = ""
                       data["conditional_validation"] = {}
                      //  this.updateDataFetchStatus(this.childObjectsInfo[0], false);
                      }
                   }

                }
                return "Error"
            } else {
                const messageObject = validationResultObject["message"]
                const messageType = messageObject["messageType"]
                const displayType = messageObject["displayType"]
                const validationMessage = messageObject['validationMessage']
                if (eventType === 'onChange') { // ON CHANGE
                    if (this.onChangeWithOutConsolidateMsg.length > 0) {
                        const consolidateFilter = lodash.filter(this.onChangeWithOutConsolidateMsg, function (result) {
                            return (result['formula'] === messageObject['formula']);
                        })
                        if (consolidateFilter.length === 0) {
                            this.onChangeWithOutConsolidateMsg.push(messageObject)
                        }
                    } else {
                        this.onChangeWithOutConsolidateMsg.push(messageObject)
                    }
                    if (displayType === 'Alert') {
                        this.validationAlert(validationMessage, messageType, displayType, messageObject)
                    } else if (displayType === 'Confirmation') {
                        this.validationConfirmation(validationMessage, messageType,
                            displayType, messageObject)
                    } else { // Toast
                        this.validationToast(validationMessage, messageType, displayType, messageObject)
                    }
                } else { // ON CLICK
                    if (this.onClickWithOutConsolidateMsg.length > 0) {
                        const consolidateFilter = lodash.filter(this.onClickWithOutConsolidateMsg, function (result) {
                            return (result['formula'] === messageObject['formula']);
                        })
                        if (consolidateFilter.length === 0) {
                            this.onClickWithOutConsolidateMsg.push(messageObject)
                        }
                    } else {
                        this.onClickWithOutConsolidateMsg.push(messageObject)
                    }
                    if (messageType !== 'Error') {
                        if (displayType === 'Alert') {
                            this.validationAlert(validationMessage, messageType, displayType, messageObject)
                        } else if (displayType === 'Confirmation') {
                            this.validationConfirmation(validationMessage, messageType,
                                displayType, messageObject)
                        } else { // Toast
                            this.validationToast(validationMessage, messageType, displayType, messageObject)
                        }
                        return "Error"
                    } else if (messageType === 'Error') {
                        if (displayType === 'Alert') {
                            this.validationAlert(validationMessage, messageType, displayType, messageObject)
                        } else { // Toast
                            this.validationToast(validationMessage, messageType, displayType, messageObject)
                        }
                        return "Error"
                    }
                }
                if (eventType === 'onChange') { // ON CHANGE
                    const uniqueError = lodash.uniqBy(this.onChangeWithOutConsolidateMsg, 'formula');
                    this.onChangeWithOutConsolidateMsg = [];
                    this.onChangeWithOutConsolidateMsg = uniqueError
                    const errorMessaage = lodash.filter(this.onChangeWithOutConsolidateMsg, function (messageObj) {
                        return (messageObj['validationPass'] === false && messageObj['messageType'] === "Error");
                    })
                    if (errorMessaage.length > 0) {
                        data["failure"] = true
                        data["failuretype"] = "conditional_validation"
                        data["failurereason"] = this.onChangeWithOutConsolidateMsg
                        return "Error"
                    } else {
                        data["failure"] = false
                        data["failuretype"] = ""
                        data["failurereason"] = {}
                        return "No Error"
                    }
                } else { // ON CLICK
                    const uniqueError = lodash.uniqBy(this.onClickWithOutConsolidateMsg, 'formula');
                    this.onClickWithOutConsolidateMsg = [];
                    this.onClickWithOutConsolidateMsg = uniqueError
                    const errorMessaage = lodash.filter(this.onClickWithOutConsolidateMsg, function (messageObj) {
                        return (messageObj['validationPass'] === false && messageObj['messageType'] === "Error");
                    })
                    if (errorMessaage.length > 0) {
                        return "Error"
                    } else {
                        return "No Error"
                    }
                }
            }
        } else {
            console.log("SKIP Conditional Validation");
            if (eventType === 'onClick') {
                this.onClickConsolidateMsg[actionId] = {}
            } else {
                const keys = Object.keys(this.onChangeConsolidateMsg)
                keys.forEach(keyObject => {
                    const valueArray = this.onChangeConsolidateMsg[keyObject]
                    valueArray.forEach(valueObject => {
                        if (valueObject['validateFieldName'] === fieldName) {
                            const index = valueArray.findIndex((x: any) => x['validateFieldName'] === fieldName)
                            valueArray.splice(index, 1)
                        }
                    });
                })
            }
            data["failure"] = false
            data["failuretype"] = ""
            data["failurereason"] = {}
            return "No Error"
        }
    }
    validationAlert(message, messageType, displayType, messageObject) {
        const dialogConfig = new MatDialogConfig()
        dialogConfig.data = {
            title: message,
            buttonInfo: [
                {
                    "name": "Cancel",
                    "handler": () => { }
                }
            ],
            parentContext: this,
            messageType: messageType,
            displayType: displayType,
            validationObject: messageObject

        };
        dialogConfig.autoFocus = false
        const dialogRef = this.dialog.open(cs_conditionalvalidation_consolidate, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => { console.log(data) })
    }
    validationConfirmation(message, messageType, displayType, messageObject) {
        const dialogConfig = new MatDialogConfig()
        dialogConfig.data = {
            title: message,
            buttonInfo: [
                {
                    "name": "Cancel",
                    "handler": () => { }
                },
                {
                    "name": "Kindly confirm this value",
                    "handler": () => { }
                }
            ],
            messageType: messageType,
            displayType: displayType,
            parentContext: this,
            validationObject: messageObject
        };
        dialogConfig.autoFocus = false
        const dialogRef = this.dialog.open(cs_conditionalvalidation_consolidate, dialogConfig);
        dialogRef.afterClosed().subscribe((data) => { console.log(data) })
    }
    validationToast(message, messageType, displayType, messageObject) {
        let snackBarRef = this.snackBar.openFromComponent(cs_conditionalvalidation_toast, {
            duration: 5000,
            panelClass: [messageType],
            data: {
                message: message,
                parentContext: this,
                messageType: messageType,
                displayType: displayType,
                validationObject: messageObject
            }
        });
        snackBarRef.afterDismissed().subscribe(() => { console.log(messageObject) });
    }

    public getData() {
        let data = {};
        this.childObjectsInfo.forEach(childObject => {
            data[childObject['objectName']] = childObject['slickgridChildDocsArray'] || []
        })
        return data;
    }

    public resetFieldsForGridChanges(fieldReset: {
        [sectionObject: string]: {
            [rootPath: string]: Array<string>;
        }
    }) {
        Object.keys(fieldReset).forEach(sectionObject => {
            let sectionObjectSet = fieldReset[sectionObject];
            let childObject = this.slickgridUtils.getChildObject(sectionObject, this.childObjectsInfo)
            if (childObject['slickgridChildDocsArray']) {
                childObject['slickgridChildDocsArray'].forEach(childDoc => {
                    this.resetFieldsForListChanges(childDoc, sectionObjectSet)
                })
                childObject['slickgridChildDocsArray'] = [...childObject['slickgridChildDocsArray']]
            }
        })
    }

    resetFieldsForListChanges(childDoc: any, sectionObjectSet: {
        [rootPath: string]: Array<string>;
    }) {
        let traversalPaths = Object.keys(sectionObjectSet);
        traversalPaths.forEach(traversalPath => {
            sectionObjectSet[traversalPath].forEach(removeField => {
                this.cspfmDataTraversalUtilsObject.setSlickGridData(childDoc, traversalPath, removeField, null, this.layoutId);
            })
        })
    }

    slickGridChangeCallback(childObjectName, args: { dataContext: any; columnDef: Column; }) {
        let childObject = this.slickgridUtils.getChildObject(childObjectName, this.childObjectsInfo)
        let fieldKey = args['columnDef']['id'];
        this.multiLineEntryUtils.updateLineModifiedRecordInSlickGrid(childObject['angularGridInstance'], args['dataContext'])
        if (fieldKey && this.inlineEditDependentResetFields['list'][childObjectName] && this.inlineEditDependentResetFields['list'][childObjectName][fieldKey]) {
            let fieldReset = this.inlineEditDependentResetFields['list'][childObjectName][fieldKey];
            Object.keys(fieldReset).forEach(sectionObject => {
                let sectionObjectSet = fieldReset[sectionObject];
                this.resetFieldsForListChanges(args['dataContext'], sectionObjectSet)
            })
            childObject['angularGridInstance'].slickGrid.invalidate()
            childObject['angularGridInstance'].slickGrid.render()
            childObject['angularGridInstance'].resizerService.resizeGrid();
        }
    }

    ngOnDestroy() {
        this.childObjectsInfo.forEach(childobject => {
            childobject['angularGridInstance'].destroy();
            this.observableListenerUtils.unsubscribe(childobject['gridObj']['cspfm_grid_custom_data']['listener_name'], childobject['gridObj']['cspfm_grid_custom_data']['cell_change_event_subscription_id']);
        })
        this.liveListenerHandlerUtils.unregisterSectionRecordChangeListener(this.sectionDependentObjectList, this);
       this.slickgridUtils.flatpickerAddRemove(this.layoutId,'remove')
       }

    changeLinesMode(lineMode: 'View' | 'Edit') {
        this.layoutMode = lineMode
        this.childObjectsInfo.forEach(childObject => {
            this.changeLineMode(childObject, lineMode)
        })
    }

    changeLineMode(childObject, lineMode: 'View' | 'Edit') {
        this.layoutMode = lineMode
        let angularGrid: AngularGridInstance = childObject['angularGridInstance'];
        let slickGrid: SlickGrid = angularGrid['slickGrid'];
        slickGrid['cspfmSlickGridMode'] = lineMode
        slickGrid.invalidate()
        slickGrid.render()
        angularGrid.resizerService.resizeGrid();
    }
    
    public getEditedLineData() {
       let editedLineData = {};
       this.childObjectsInfo.forEach(childObject => {
           if (childObject['angularGridInstance']['slickGrid']['cspfmEditedRecords']) {
               editedLineData[childObject['objectName']] = Object.values(childObject['angularGridInstance']['slickGrid']['cspfmEditedRecords'])
           } else {
               editedLineData[childObject['objectName']] = []
           }
       })
       return editedLineData;
   }

   public clearLinesEditedRecords() {
       this.childObjectsInfo.forEach(childObject => {
           this.clearLineEditedRecords(childObject);
       })
   }
   public clearLineEditedRecords(childObject) {
       if (childObject && childObject['angularGridInstance']) {
           this.multiLineEntryUtils.removeEditedRecords(childObject['angularGridInstance'])
       }
   }

   showValidationField(event) {
       let dataContext = event['message']['dataContext']
       let objectId = dataContext['type']
       let fieldName = event['fieldname']['fieldName'];
    //    let fieldName = event['message']['fieldName'].split("$$")[0]
       let childObject = this.slickgridUtils.getChildObject(objectId, this.childObjectsInfo)
       let angularGrid: AngularGridInstance = childObject['angularGridInstance'];
       let slickGrid: SlickGrid = angularGrid['slickGrid'];
       setTimeout(() => {
           slickGrid.getViewportNode().scrollIntoView({
               block: "center",
               inline: "nearest",
               behavior: 'smooth'
           })
       }, 0);
       if (fieldName) {
           let columnIndexMapping = childObject['angularGridInstance']['slickGrid']['cspfmColumnIndexMapping'];
           if (columnIndexMapping[fieldName]) {
               let columnIndex = columnIndexMapping[fieldName]['index']
               this.scrollToColumnIndex(columnIndex, dataContext, angularGrid)
           } else {
               let columnIndexes = Object.keys(columnIndexMapping).filter(columnId => {
                   if (columnId.startsWith(fieldName) && columnIndexMapping[columnId]['editable']) {
                       return true
                   } else {
                       return false
                   }
               })
               if (columnIndexes.length > 0) {
                   let columnIndex = columnIndexMapping[columnIndexes[0]]['index']
                   this.scrollToColumnIndex(columnIndex, dataContext, angularGrid)
               }
           }
       }
   }
   scrollToColumnIndex(columnIndex: number, dataContext: any, angularGrid: AngularGridInstance) {
       let slickGrid: SlickGrid = angularGrid['slickGrid'];
       let dataView: SlickDataView = angularGrid['dataView'];
       if (columnIndex > -1) {

           let columnDef = slickGrid.getColumns()[columnIndex];
           let positionKey = `r${dataContext['id']}_c${columnDef['id']}`;
           let row = dataView.getIdxById(dataContext['id'])
           let pageNumber = Math.round(row / angularGrid.paginationService.itemsPerPage) + 1;
           let currentPageRowIndex = row % angularGrid.paginationService.itemsPerPage
           angularGrid.paginationService.goToPageNumber(pageNumber)
           slickGrid.scrollCellIntoView(currentPageRowIndex, columnIndex, true);
           if (!slickGrid['cspfmCellCss']) {
               slickGrid['cspfmCellCss'] = {}
           }
           slickGrid['cspfmCellCss'] = {} // For single cell highlighting, reset the css property json
           slickGrid['cspfmCellCss'][positionKey] = 'slickgrid-cell-error'
           slickGrid.invalidate()
           slickGrid.render()
           angularGrid.resizerService.resizeGrid();
       }
   }
   ngAfterViewChecked() {
       this.slickgridUtils.flatpickerAddRemove(this.layoutId,'set')
   }

   public fullView = false;
   public viewIcon=false;
   viewAll(event,angularGrid)
   {
       let emtag=event.currentTarget.getElementsByTagName("em");
       let viewAll=event.currentTarget.closest(".cs-list-view-all");
      let togglebtn= viewAll.getElementsByClassName("cs-togle-btn-hide");
      let bodyScroll=document.getElementsByClassName("cs-scroll-body")as HTMLCollectionOf<HTMLElement>;
       if($(emtag).hasClass("icon-mat-fullscreen"))
       {
           viewAll.classList.add("cs-list-view-all-pos");
           bodyScroll[0].classList.add("cs-scroll-body-hide");
           togglebtn[0].style.display="none";
           this.fullView=!this.fullView;
       }
      else if($(emtag).hasClass("icon-mat-fullscreen_exit"))
       {
           viewAll.classList.remove("cs-list-view-all-pos");
           bodyScroll[0].classList.remove("cs-scroll-body-hide");  
           this.fullView=!this.fullView;
           togglebtn[0].style.display="inline-block";
       }
       angularGrid.resizerService.resizeGrid();
   }
}