import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, NavParams, Platform, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { appUtility } from 'src/core/utils/appUtility';
import { DatePipe } from '@angular/common';
import { appConstant } from 'src/core/utils/appConstant';
import { Column, GridOption, FieldType, Filters, OperatorType, AngularGridInstance,
    AngularUtilService } from 'angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';
import { cspfm_data_display, CspfmDataFormatter  } from 'src/core/pipes/cspfm_data_display';
import { cspfmCustomFieldProvider } from 'src/core/utils/cspfmCustomFieldProvider';
import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
@Component({
    selector: 'app-lookuppage',
    templateUrl: './lookuppage.html',
    styleUrls: ['./lookuppage.scss'],
})
export class lookuppage implements OnInit {

    private objectName: any;
    public lookupColumnDetails = [];
    public lookupTitle: any;
    private serviceObject: any;
    public allItems = [];
    public items = [];
    private searchTerm = ''; // Search text
    private lookupInput: any;
    private isPushVal = false;
    private lookupColumnName = '';
    private commonLookupColumnName = '';
    loading;
    public dataSource: string;
    public gridId = 'cspfm_grid_' + this.constructor.name + '_'+ new Date().getTime();
    public gridContainerId = 'cspfm_grid_container_'  + this.constructor.name + '_'+ new Date().getTime();
    public gridObj;
    public angularGrid: AngularGridInstance;
    public columnMinWidth = 100;
    public gridOptions: GridOption = {
        autoEdit: false,
        enableCellNavigation: true,
        editable: true,
        enableAutoResize: true,
        enableSorting: true,
        enableFiltering: true,
        enableExcelExport: false,
        enableExport: false,
        i18n: this.translateService,
        enableAutoTooltip: true,
        enableGridMenu: true,
        autoTooltipOptions: {
            enableForCells: true,
            enableForHeaderCells: true,
            maxToolTipLength: 1000
        },
        headerMenu: {
            hideColumnHideCommand: true,
            onAfterMenuShow: (e, args) => {
                let getSlickGridContainerHeight = args.grid.getContainerNode().offsetHeight-50;
                let slickGridHeaderMenuButton = document.getElementsByClassName('slick-header-menu');
                let setHeight = slickGridHeaderMenuButton[0].getAttribute("style") + " max-height: " +   getSlickGridContainerHeight + "px";
                slickGridHeaderMenuButton[0].setAttribute('style',setHeight) ;
                slickGridHeaderMenuButton[0].classList.add('cs-custom-scroll');
            }
        },
        autoResize: {
            containerId: this.gridContainerId,
            calculateAvailableSizeBy: 'container'
        },
        exportOptions: {
            exportWithFormatter: false
        },
        excelExportOptions: {
            exportWithFormatter: false,
        },
        enableTranslate: true,
        presets: {
            // sorters: [{ columnId: this.tableColumnInfo['pfm138993_institutename']['prop'], direction: 'ASC' }],
        },
        enableAsyncPostRender: true, // for the Angular PostRenderer, don't forget to enable it
        asyncPostRenderDelay: 0,    // also make sure to remove any delay to render it
        params: {
            angularUtilService: this.angularUtilService // provide the service to all at once (Editor, Filter, AsyncPostRender)
        },
        checkboxSelector: {
            // you can toggle these 2 properties to show the "select all" checkbox in different location
            hideInFilterHeaderRow: false,
        },
        // rowSelectionOptions: {
        //     // True (Single Selection), False (Multiple Selections)
        //     selectActiveRow: false,
        // },
        // enableCheckboxSelector: true,
        // enableRowSelection: true
    };
    public columnDefinitions: Array<Column> = [];
    public expandFlag = true;
    public showFilter = false;
    constructor(private navCtrl: NavController, public loadingCtrl: LoadingController,
        private navParams: NavParams, public platform: Platform, public route: Router, public activeRoute: ActivatedRoute,
        public modalController: ModalController, public appUtilityConfig: appUtility, public datePipe: DatePipe,
        public translateService: TranslateService, public angularUtilService: AngularUtilService,
        public cspfmCustomfieldProvider: cspfmCustomFieldProvider, public cspfmDataDisplay: cspfm_data_display, private slickgridUtils: cspfmSlickgridUtils) {

        this.lookupInput = JSON.parse(JSON.stringify(this.navParams.get('lookupInput')));
        this.serviceObject = this.navParams.get('serviceObject');
        this.objectName = this.navParams.get('objectName');
        this.lookupColumnName = this.navParams.get('lookupColumnName');
        this.commonLookupColumnName = this.navParams.get('commonLookupColumnName');
        this.dataSource = this.navParams.get('dataSource');

        this.lookupColumnDetails = this.lookupInput.lookupColumnDetails;
        if (this.lookupColumnDetails.length > 3 && this.appUtilityConfig.isMobile) {
            this.lookupColumnDetails.splice(3);
        }
        if (!this.appUtilityConfig.isMobile) {
            this.lookupColumnDetails.forEach(element => {
                let fieldTypeStr;
                let filterObj = {
                };
                let queryParams;
                let objectVal;
                if (element.fieldType === 'LOOKUP' || element.fieldType === "TEXT" ||
                element.fieldType === "CHECKBOX" || element.fieldType === "MULTISELECT" ||
                element.fieldType === "RADIO" || element.fieldType === "URL" ||
                element.fieldType === "FORMULA" || element.fieldType === "DROPDOWN" ||
                element.fieldType === "Rollupsummary") {
                    fieldTypeStr = FieldType.string
                } else if (element.fieldType === 'TIMESTAMP') {
                    fieldTypeStr = FieldType.dateTime
                } else if (element.fieldType === 'BOOLEAN') {
                    fieldTypeStr = FieldType.boolean
                } else if (element.fieldType === 'NUMBER' || element.fieldType === "CURRENCY" ||
                element.fieldType.toUpperCase === "AUTONUMBER") {
                    fieldTypeStr = FieldType.number
                } else if (element.fieldType === 'ACTION') {
                    fieldTypeStr = FieldType.unknown
                } else if (element.fieldType === 'DATE') {
                    fieldTypeStr = FieldType.date
                }
                if (element.fieldType === "RADIO" || element.fieldType === "DROPDOWN") {
                    filterObj = {
                        collection: this.getLabelValue(element.mappingDetails),
                        model: Filters.multipleSelect
                    };
                } else if (element.fieldType === "BOOLEAN") {
                    filterObj = {
                        collection: this.getLabelValue({ true: "true", false: "false" }),
                        model: Filters.multipleSelect
                    }
                } else if (element.fieldType === "DATE") {
                    filterObj = {
                        model: Filters.compoundDate,
                        operator: OperatorType.rangeInclusive
                    }
                } else if (element.fieldType === "MULTISELECT" || element.fieldType === "CHECKBOX") {
                    filterObj = {
                            collection: this.getLabelValue(element.mappingDetails),
                            model: Filters.multipleSelect,
                            operator: OperatorType.inContains
                    }
                } else {
                    filterObj = {
                    model: Filters.compoundInput
                    }
                }
                if (element.fieldType === "MULTISELECT" || element.fieldType === "CHECKBOX" || 
                element.fieldType === "DROPDOWN" || element.fieldType === "DATE" ||
                element.fieldType ===  "RADIO") {
                    queryParams = element.prop + appConstant['customFieldSuffix']['slickgrid']
                }
                objectVal = {
                    id: element.prop,
                    nameKey: this.slickgridUtils.convertSplCharToEntities(element.label,'toEntity'),
                    field: element.prop,
                    toolTip:this.translateService.instant(element.label),
                    minWidth: this.columnMinWidth,
                    type: fieldTypeStr,
                    formatter: CspfmDataFormatter,
                    params: {
                        pipe: this.cspfmDataDisplay,
                        fieldInfo: element,
                    },
                    filterable: true,
                    sortable: true,
                    filter: filterObj
                }
                if (queryParams) {
                   objectVal['queryField'] = queryParams
                }
                this.columnDefinitions.push(objectVal);
            });
        }

        this.lookupTitle = this.lookupInput.title;
      
    }
    ionViewWillEnter() {
        this.fetchAllData({ selector: this.lookupInput.selector });
    }
  async fetchAllData(options) {
        this.loading = await this.loadingCtrl.create({ message: 'Fetching...' });
        this.loading.present();
        if (this.lookupInput['objectHierarchy']) {
            var objectHierarchy = this.lookupInput['objectHierarchy']
            var additionalInfo = this.lookupInput['additionalInfo']
            if (appConstant.pouchDBStaticName === this.dataSource) {
            this.serviceObject.fetchdatawithRelationship(objectHierarchy, additionalInfo).then(res => {
                
                this.loading.dismiss()
                if (res['records'].length > 0) {
                    this.allItems = res['records'];
                    if (res['records'].length === 1) {
                        this.itemClick(this.allItems[0])
                        this.loading.dismiss();
                        return;
                    }
                    if (this.appUtilityConfig.isMobile) {
                        this.setFilteredItems();
                    } else {
                        this.cspfmCustomfieldProvider.makeSlickGridCustomFields(this.allItems, this.columnDefinitions);
                    }
                } else {
                   console.log('fetchDataWithReference in lookup list.ts is failed', res['message']);  
                }
            }).catch(error => {
                this.loading.dismiss();
            })
           
            }  else if (appConstant.couchDBStaticName === this.dataSource) {
                let query = objectHierarchy['query']
                this.serviceObject.fetchRecordsBySearchFilterPhrases(query, objectHierarchy).then(res => {
                        if (res['status'] === 'SUCCESS') {
                            if (res['records'].length > 0) {
                                this.allItems = res['records'];
                                if (res['records'].length === 1) {
                                    this.itemClick(this.allItems[0])
                                    this.loading.dismiss();
                                    return;
                                }
                                if (this.appUtilityConfig.isMobile) {
                                this.setFilteredItems();
                                } else {
                                this.cspfmCustomfieldProvider.makeSlickGridCustomFields(this.allItems, this.columnDefinitions);
                                }
                            } else {
                                console.log('fetchDataWithReference...... no records found');
                            }
                        } else {
                            console.log('fetchDataWithReference in lookup list.ts is failed', res['message']);
                        }
                        this.loading.dismiss()
                    })
                    .catch(error => {
                    this.loading.dismiss()
                    })
            }
        } else {
            this.serviceObject.fetchDocsWithoutRelationshipUsingFindOption(options)
                .then(res => {
                    if (res['status'] === 'SUCCESS') {
                        if (res['records'].length > 0) {
                            this.allItems = res['records'];
                            if (res['records'].length === 1) {
                                this.itemClick(this.allItems[0])
                                this.loading.dismiss();
                                return;
                            }
                            if (this.appUtilityConfig.isMobile) {
                            this.setFilteredItems();
                            } else {
                                this.cspfmCustomfieldProvider.makeSlickGridCustomFields(this.allItems, this.columnDefinitions);
                            }
                        } else {
                            console.log('fetchDocsWithoutRelationshipUsingFindOption...... no records found');
                        }
                    } else {
                        console.log('fetchDocsWithoutRelationshipUsingFindOption in lookup list.ts is failed', res['message']);
                    }
                    this.loading.dismiss();
                })
                .catch(error => {
                    this.loading.dismiss();
                })
        }

    }
    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid;
        console.log("angularGrid :", angularGrid);
        console.log("angularGrid :", angularGrid.dataView.getItems());

        this.gridObj = angularGrid.slickGrid;
        this.gridObj.setHeaderRowVisibility(false);
        this.gridObj['cspfm_grid_custom_data'] = {
            "page_title_key": "sepcomponent_d_w_list.Layout.sepcomponent_d_w_list",
        }
    }
    onGridItemClick(event) {
        this.itemClick(this.angularGrid.dataView.getItem(event['detail']['args']['row']))
    }
    onCellChanged(e, args) {
        this.angularGrid.gridService.updateItemById(args.item['id'], args.item);

    }
    setFilteredItems(event?) {
        if (event) {
            this.searchTerm = event.target.value;
        }
        if (this.searchTerm === '') {
            this.items = this.allItems
        } else {
            this.items = this.allItems.filter((item) => {
                return this.isSearchMatched(item, this.lookupColumnDetails, this.searchTerm);
            });
        }
    }
    itemClick(item) {
        const parent = this.navParams.get('parentPage');
        if (this.commonLookupColumnName !== '' && this.commonLookupColumnName !== undefined && this.commonLookupColumnName !== null) {
            parent.lookupResponse(this.commonLookupColumnName, item);
        } else {
            parent.lookupResponse(this.lookupColumnName, item);
        }
        this.closeButtonClick();
    }
    closeButtonClick() {
        this.modalController.dismiss(true);
    }
    dismiss() {
        this.navCtrl.pop();

    }
    onCancel() {
        this.items = this.allItems;
    }

    ngOnInit() {
    }
    toggleGridSearchRow() {
        if (!this.gridObj.getOptions().showHeaderRow) {
            this.gridObj.setHeaderRowVisibility(true);
        } else {
            this.gridObj.setHeaderRowVisibility(false);
        }
    }
    getLabelValue(inputJson: { [key: string]: string }): Array<{ label: string, value: string }> {
        var resultArray = [];
        Object.keys(inputJson).forEach(key => { resultArray.push({ value: inputJson[key], label: inputJson[key] }); })
        return resultArray;
    }
    isSearchMatched(item, queryFields, searchText) {
        for (const queryField of queryFields) {
                if (queryField['fieldType'] === 'TEXT' || queryField['fieldType'] === 'MULTILINETEXTBOX' || queryField['fieldType'] === 'AUTONUMBER' || queryField['fieldType'] === 'PRIMARY' || queryField['fieldType'] === 'TEXTAREA' || queryField['fieldType'] === 'URL' || queryField['fieldType'] === 'EMAIL' || queryField['fieldType'] === 'NUMBER' || queryField['fieldType'] === 'DECIMAL' || queryField['fieldType'] === 'CURRENCY') {
                    if (item[queryField['fieldName']] && item[queryField['fieldName']].toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        return true;
                    }
                } else if (queryField['fieldType'] === 'MULTISELECT' || queryField['fieldType'] === 'CHECKBOX') {
                    if (item[queryField['fieldName']] !== undefined && item[queryField['fieldName']] !== "") {
                        const stateTypeList = item[queryField['fieldName']];
                        for (const element of stateTypeList) {
                            if (queryField['mappingDetails'][element]
                                && queryField['mappingDetails'][element].toString().toLowerCase().
                                    indexOf(searchText.toLowerCase()) > -1) {
                                return true;
                            }
                        }
                    }
                } else if (queryField['fieldType'] === 'RADIO' || queryField['fieldType'] === 'DROPDOWN' && item[queryField['fieldName']] && item[queryField['fieldName']] !== "") {
                        if (queryField['mappingDetails'][item[queryField['fieldName']]]
                            && queryField['mappingDetails'][item[queryField['fieldName']]].toString().toLowerCase().
                                indexOf(searchText.toLowerCase()) > -1) {
                            return true;
                        }
                } else if (queryField['fieldType'] === 'DATE') {
                    if (item[queryField['fieldName']]) {
                      let dateString = this.datePipe.transform(new Date(item[queryField['fieldName']]), this.appUtilityConfig.userDateFormat);
                      if (dateString.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1) {
                        return true;
                      }
                    }
                } else if (queryField['fieldType'] === 'TIMESTAMP' && item[queryField['fieldName']]) {
                      let dateTimeString = this.datePipe.transform(new Date(item[queryField['fieldName']]), this.appUtilityConfig.userDateTimeFormat, this.appUtilityConfig.userZoneOffsetValue);
                      if (dateTimeString.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1) {
                        return true;
                      }
                }
        }
    }
}
