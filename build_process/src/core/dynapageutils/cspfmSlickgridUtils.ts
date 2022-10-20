
import {
  Injectable
} from '@angular/core';
import {
  Router
} from '@angular/router';
import { appUtility } from '../utils/appUtility';
import * as lodash from 'lodash';
import { SlickgridPopoverService } from '../services/slickgridPopover.service';
import { cspfmBalloonComponent } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent';
declare var $: any;
import { GridOption, AngularGridInstance, FileType, OnEventArgs, ExtensionName, DelimiterType, Column, FieldType, OperatorType, Filters, Editors, ExportOption, ExcelExportOption, SlickDataView, SlickGrid, HideColumnOption, parseFormatterWhenExist, sanitizeHtmlToText, CollectionOverrideArgs  } from 'angular-slickgrid';
import {
  MatDialog, MatDialogConfig
} from '@angular/material/dialog';
import {
  cspfmSlickgridPopover
} from 'src/core/components/cspfmSlickgridPopover/cspfmSlickgridPopover';
import { appConstant } from 'src/core/utils/appConstant';
import {
  DatePipe
} from '@angular/common';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  CspfmActionsFormatter,
  CspfmDataFormatter,
  cspfmUrlDataFormatter,
  cspfm_data_display,
  FieldInfo
} from 'src/core/pipes/cspfm_data_display';
import {
  cspfmSlickgridMatrixService
} from 'src/core/services/cspfmSlickgridMatrix.service';
import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
import { dataProvider } from 'src/core/utils/dataProvider';
import { cspfmGridsectionListIdConfiguration } from '../utils/cspfmGridsectionListIdConfiguration';
import { SectionObjectDetail } from '../models/cspfmSectionDetails.type';
import { FilterSectionDetail } from '../models/cspfmFilterDetails.type';
import { objectTableMapping } from "src/core/pfmmapping/objectTableMapping";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CspfmReportGenerationService } from 'src/core/services/cspfmReportGeneration.service';
import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
import { cspfmStatusWorkFlowService } from 'src/core/services/cspfmStatusWorkFlow.service';
import { cspfmExecutionPouchDbConfiguration } from "src/core/db/cspfmExecutionPouchDbConfiguration";
import { cspfmObjectConfiguration } from "src/core/pfmmapping/cspfmObjectConfiguration";
import { cspfmConditionalValidationUtils } from "src/core/dynapageutils/cspfmConditionalValidationUtils";
import { ConditionalValidation, EntryType } from "src/core/models/cspfmConditionalValidation.type";
import { ObjectHierarchy } from "src/core/models/cspfmObjectHierarchy.type";
import { cs_conditionalvalidation_toast } from './../../core/components/cs_conditionalvalidation_toast/cs_conditionalvalidation_toast';
import { cs_conditionalvalidation_consolidate } from './../../core/components/cs_conditionalvalidation_consolidate/cs_conditionalvalidation_consolidate';
import { cspfmMetaCouchDbProvider } from "src/core/db/cspfmMetaCouchDbProvider";

import { LayoutMode } from '../models/cspfmLayoutMode';
import { cspfmCustomFieldProvider } from '../utils/cspfmCustomFieldProvider';
import { cspfmRecordAssociationUtils } from '../dynapageutils/cspfmRecordAssociationUtils';
import {cspfmDataTraversalUtils} from './cspfmDataTraversalUtils'
import * as moment from "moment";
import { cspfmObservableListenerUtils } from './cspfmObservableListenerUtils';
import { cspfmSlickDraggableGrouping } from '../slickgridExtension/cspfmSlickDraggableGrouping';
declare const window: any;
import { cspfmLayoutConfiguration } from "src/core/pfmmapping/cspfmLayoutConfiguration";
import { cspfmDateEditor } from './cspfmDateEditor';
import { lookupFieldMapping } from '../pfmmapping/lookupFieldMapping';
import { cspfmOnDemandFeature } from 'src/core/utils/cspfmOnDemandFeature';
import { cspfmFlatpickrConfig } from 'src/core/utils/cspfmFlatpickrConfig';
import { cspfmLookupService } from '../utils/cspfmLookupService';



@Injectable({
  providedIn: 'root'
})
export class cspfmSlickgridUtils {

  constructor(public appUtilityConfig: appUtility,
    public router: Router,
    public dialog: MatDialog,
    public dataProvider: dataProvider,
    private observableListenerUtils: cspfmObservableListenerUtils,
    public datePipe: DatePipe,
    public translateService: TranslateService,
    public cspfmLookupCriteriaUtils: cspfmLookupCriteriaUtils,
    public cspfmDataDisplay: cspfm_data_display,
    private cspfmSlickgridMatrix: cspfmSlickgridMatrixService,
    public gridIdConfig: cspfmGridsectionListIdConfiguration,    
    public objectTableMappingObject: objectTableMapping,
    public cspfmStatusWorkFlowServiceObject: cspfmStatusWorkFlowService,
    public executionDbConfigObject: cspfmExecutionPouchDbConfiguration,
    public cspfmMetaCouchDbProvider: cspfmMetaCouchDbProvider,
    public cspfmObjectConfiguration: cspfmObjectConfiguration,
    public cspfmReportGenerationService: CspfmReportGenerationService,   
    private snackBar: MatSnackBar, 
    private customFieldProvider: cspfmCustomFieldProvider,
    private cspfmConditionalValidationUtils: cspfmConditionalValidationUtils,
    private cspfmRecordAssociationUtils: cspfmRecordAssociationUtils,
    private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils,
    private slickgridPopoverService: SlickgridPopoverService,
    private flatPickerConfig:cspfmFlatpickrConfig,
    private layoutCongifuration: cspfmLayoutConfiguration,
    private onDemendFeature : cspfmOnDemandFeature,
    private cspfmLookupServiceObject: cspfmLookupService
) { }
    public timeoutId:any
    public rowCellIdentifier;

  getGridData(angularGrid: AngularGridInstance) {
    if (angularGrid) {
      return angularGrid.dataView.getItems();
    } else {
      return []
    }
  }
  getGridDataFromDataView(dataView) {
    if (dataView) {
      return dataView.getItems();
    } else {
      return []
    }
  }

  changeMatrixLayout(isLoading: boolean, angularGrid: AngularGridInstance, sectionObjectDetails: { [objectName: string]: SectionObjectDetail }, tableName: string, dataSource: string) {
    if (isLoading) {
      this.appUtilityConfig.presentToast("Another process is running, please wait");
      return
    }
    let selectedData = angularGrid.gridService.getSelectedRowsDataItem();
    
    this.cspfmSlickgridMatrix.makeColumns(selectedData, sectionObjectDetails[tableName]['matrixConfig'], dataSource)
  }

  changeNormalLayout(isLoading: boolean, angularGrid: AngularGridInstance, sectionObjectDetails: { [objectName: string]: SectionObjectDetail }, tableName: string) {
    if (isLoading) {
      this.appUtilityConfig.presentToast("Another process is running, please wait");
      return
    }
    sectionObjectDetails[tableName]['matrixConfig']['displayInfo']['currentMode'] = 'list';
    angularGrid.resizerService.resizeGrid()
  }

  gridFieldClick(args: any, webServiceDataQuery?: any) {
    if (this.rowCellIdentifier !== args.row + 'row' + args.cell + 'cell') {
      args.columnDef.params.gridItemClickCount = 0;
    }
    this.rowCellIdentifier = args.row + 'row' + args.cell + 'cell';
    args.columnDef.params.gridItemClickCount++;
    clearTimeout(this.timeoutId);
    const clickType = args.columnDef.params.balloonTriggerEvent;
    if (clickType === "click") {
      this.timeoutId = setTimeout(() => {
        if (args.columnDef.params.gridItemClickCount === 1) {
          this.loadBalloonConfiguredLayout(args, webServiceDataQuery);
        }
        args.columnDef.params.gridItemClickCount = 0;
      }, 200);
    } else if (clickType === "dblClick") {
      this.timeoutId = setTimeout(() => {
        if (args.columnDef.params.gridItemClickCount === 2) {
          this.loadBalloonConfiguredLayout(args, webServiceDataQuery);
        }
        args.columnDef.params.gridItemClickCount = 0;
      }, 250);
    } else {
      this.loadBalloonConfiguredLayout(args, webServiceDataQuery);
    }
  }

  loadBalloonConfiguredLayout(args: any, webServiceDataQuery?: any) {

    this.slickgridPopoverService.render({
      component: cspfmBalloonComponent,
      args,
      parent: this,
      additionalInfo: {
        "balloonLayoutInfo": {
          layoutName: args['columnDef']['params']['balloonLayout'],
          redirectUrlForNav: args["columnDef"]['params']['redirectUrlForNav'],
          isPopUpEnabled: args["columnDef"]['params']['isPopUpFlag'],
          balloonCallFromList: true,
          id: this.getObjectIdForBalloon(args),
          viewFetchActionInfo: webServiceDataQuery ? webServiceDataQuery : ''
        }
      }
    });

  }

  getObjectIdForBalloon(args: any) {
    if (args['columnDef']['params']['cspfmEditorType'] === "BALLOONUI") {
      let typeOfField = args['columnDef']['params']['fieldInfo']['fieldType'];
      if (typeOfField && typeOfField !== "ACTION") {
        return args['columnDef']['params']['fieldInfo']['balloonInfo']['navigationInfo']['relationalObjectInfo']['relationalObjectId'] ?
          this.appUtilityConfig.getDependentObjectId(args.dataContext, args['columnDef']['params']['fieldInfo']['balloonInfo']
          ['navigationInfo']['relationalObjectInfo']) : args.dataContext[args['columnDef']['params']['fieldInfo']['balloonInfo']
          ['navigationInfo']['uniqueKey']];
      }
    }
  }
  
  setInitialGrouping(sectionObjId: string, gridObj, groupingColumns, tableColumnInfo, draggableGroupingPlugin) {
    let groupingOptions = [];
    gridObj.setPreHeaderPanelVisibility(true)
    groupingColumns.forEach(element => {
      let columnId = "";
      if (element['fieldType'] === 'FORMULA') {
        columnId = tableColumnInfo[sectionObjId]["pfm" + element['objectId'] + "_" + element['fieldName'] + '__f' + '_' + element['elementId']]['id'];
      } else if (element['fieldType'] === 'ROLLUPSUMMARY') {
        columnId = tableColumnInfo[sectionObjId]["pfm" + element['objectId'] + "_" + element['fieldName'] + '__r' + '_' + element['elementId']]['id'];
      } else {
        columnId = tableColumnInfo[sectionObjId]["pfm" + element['objectId'] + "_" + element['fieldName'] + '_' + element['elementId']]['id'];
      }
      groupingOptions.push(columnId)
    })
    draggableGroupingPlugin.setDroppedGroups(groupingOptions);
  }

  toggleGridSearchRow(isLoading: boolean, gridSearchRowToggle: boolean, gridObj, angularGrid: AngularGridInstance, layoutMode: LayoutMode, childObject?: any) {
    if (layoutMode === "List" || layoutMode === "SearchList" || layoutMode ==='HeaderLineListPreview') {
      if (isLoading) {
        this.appUtilityConfig.presentToast("Another process is running, please wait");
        return
      }
      gridSearchRowToggle = !gridSearchRowToggle
      if (!gridObj.getOptions().showHeaderRow) {
        gridObj.setHeaderRowVisibility(true);
        gridObj.setColumns(angularGrid.slickGrid.getColumns());
        const filterCls = document.getElementsByClassName('search-filter')
        this.gridIdConfig.toggleFilterSetId(filterCls, "vendors")
      } else {
        gridObj.setHeaderRowVisibility(false);
      }
    } else {
      childObject['additionalInfo']['gridSearchRowToggle'] = !childObject['additionalInfo']['gridSearchRowToggle']
      if (!childObject['gridObj'].getOptions().showHeaderRow) {
        childObject['gridObj'].setHeaderRowVisibility(true);
        childObject['gridObj'].setColumns(angularGrid.slickGrid.getColumns());
        const filterCls = document.getElementsByClassName('search-filter')
        const objectKey = this.objectTableMappingObject.mappingDetail
        this.gridIdConfig.toggleFilterSetId(filterCls, Object.keys(objectKey).find(key => objectKey[key] === childObject['objectName']))
      } else {
        childObject['gridObj'].setHeaderRowVisibility(false);
      }
    }
  }

  getLabelValue(inputJson: {
    [key: string]: string
  }): Array<{
    label: string,
    value: string
  }> {
    var resultArray = [];
    Object.keys(inputJson).forEach(key => {
      resultArray.push({
        value: inputJson[key],
        label: inputJson[key]
      });
    });
    return resultArray;
  }

  getKeyValue(inputJson: {
    [key: string]: string
  }): Array<{
    label: string,
    value: string
  }> {
    const resultArray = [];
    Object.keys(inputJson).forEach(key => {
      resultArray.push({
        value: key,
        label: inputJson[key]
      });
    })
    return resultArray;
  }

  onCellChanged(e, args, conditionalValidationJSON?) {
    const columnDefinition = args.grid.getColumns()
    const fieldInfoObj = columnDefinition[args.cell].params.fieldInfo
    if (fieldInfoObj) {
      if (fieldInfoObj["child"] === "") {
        const recordId = args.item.type + '_2_' + args.item.id
        this.fetchEditedRecord(appConstant.couchDBStaticName, args, recordId, fieldInfoObj,
          args.item[fieldInfoObj.fieldName], args.item, conditionalValidationJSON)
      }
    }
  }

  onCellValidation(e, args) {
    if (!args.validationResults.valid) {
      args.grid.updateCell(args.row, args.cell);
      this.appUtilityConfig.showAlert(this, args.validationResults.msg)
    }
  }

  openDraggableGroupingRow(onGroupByEnabledObj?: { onGroupByEnabled: boolean }, gridObj?, layoutMode?: LayoutMode, childObjectName?, childObjectsInfo?: Array<{
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
  }>) {
    if (layoutMode === "List" || layoutMode === "SearchList") {
      if (!onGroupByEnabledObj.onGroupByEnabled) {
        onGroupByEnabledObj.onGroupByEnabled = true;
        gridObj.setPreHeaderPanelVisibility(true);
        if ($('mat-list').hasClass('cs-top-menu-list')) {
          $('.cs-fullslick-rowheight').addClass('cs-tempslickhight_withtop_menu')
        } else {
          $('.cs-fullslick-rowheight').addClass('cs-tempslickhight')
        }
      }
    } else {
      this.closeUnsedGroupingHeaderPanels(childObjectsInfo)
      const childObject = this.getChildObject(childObjectName, childObjectsInfo);
      const gridObj = childObject['gridObj']
      gridObj.setPreHeaderPanelVisibility(true);
    }
  }
  closeUnsedGroupingHeaderPanels(childObjectsInfo: Array<{
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
  }>) {
    childObjectsInfo.forEach(element => {
      if ((!element['groupColumns'] || element['groupColumns'].length === 0 ) && element['gridObj']) {
       
        element['gridObj'].setPreHeaderPanelVisibility(false);
      
     }
  })
  }

  
  hideColumnsFromSlickgrid(columnIdArray:Array<string>,gridInstance:AngularGridInstance){
    const options:HideColumnOption={
      autoResizeColumns:false,
      hideFromColumnPicker:true,
      hideFromGridMenu:true,
      triggerEvent:false
    }
    gridInstance.gridService.hideColumnByIds(columnIdArray,options)
    const sortColumns = gridInstance.slickGrid.getSortColumns()
          const afterFilter = sortColumns.filter(column =>{
              if(!columnIdArray.includes(column.columnId)){
                  return column
      }
    })
          gridInstance.slickGrid.setSortColumns(afterFilter)
  }

  onGroupChanged(e, args, gridMenuExtension, angularGrid: AngularGridInstance, tempColumnDefinitions, gridObj, draggableGroupingPlugin, gridOptions, layoutId?) {
    const grpColumns = args.groupColumns
    const allColumns = gridMenuExtension.addon.getAllColumns()
    const currentColumns = angularGrid.slickGrid.getColumns()

    var groupId = angularGrid.slickGrid.getUID();
    var getGrpId = document.getElementsByClassName(groupId)[0];
    var groupBy = <HTMLElement>getGrpId.querySelectorAll(".slick-preheader-panel .ui-droppable")[0]


    let finalColumns = [];
    switch (args.caller) {
      case "add-group": {
        var totalGroupingColumns = currentColumns.filter(item => {
          return item['grouping'];
        })
        if (totalGroupingColumns.length > 1) {
          grpColumns.forEach(grpColumn => {
            let val = currentColumns.some(columnDef => {
              if (columnDef['id'] === grpColumn.params['id']) {
                tempColumnDefinitions.push(columnDef)
                setTimeout(() => {
                  angularGrid.extensionService.hideColumn(columnDef)
                  if (gridObj.getCanvasWidth() < window.innerWidth) {
                    gridObj.autosizeColumns()
                  }
                }, 100);
                return true;
              }
              return false;
            })
          })
        } else {
          setTimeout(() => {
            draggableGroupingPlugin.clearDroppedGroups(); //Clear all grouping columns
            grpColumns.pop();
            let groupingColumns = grpColumns.map(item => {
              return item['params']['id'];
            })
            draggableGroupingPlugin.setDroppedGroups(groupingColumns);
            gridObj.invalidate();
            this.appUtilityConfig.showAlert(this, 'Atleast maintain one column in the slickgrid');
          }, 100)
        }
        if (layoutId !== null || layoutId !== undefined) {
          setTimeout(() => {
            this.groupBy(e, args, angularGrid, layoutId);
            angularGrid['slickGrid']['isGroupingEnabled'] = true
            this.resizeColumnsByCellContent(angularGrid)
          }, 100)
          this.groupScroll()
        }
        break;
      }
      case "remove-group": {
        let columnToAdd;
        let val = tempColumnDefinitions.some((column, index) => {
          let isColumnPresent = false;
          if (grpColumns.length > 0) {
            isColumnPresent = grpColumns.some(grpColumn => {
              return column['id'] === grpColumn.params['id']
            })
          }
          if (!isColumnPresent) {
            columnToAdd = tempColumnDefinitions.splice(index, 1)[0]
          }
          return !isColumnPresent
        })
        allColumns.forEach(column => {
          if (gridObj.getColumnIndex(column['id']) !== undefined || (columnToAdd && column['id'] === columnToAdd['id'])) {
            finalColumns.push(column)
          }
        })
        angularGrid.slickGrid.setColumns(finalColumns)
        if (grpColumns.length === 0) {
          gridOptions['autoFitColumnsOnFirstLoad'] = true
          gridObj.setOptions(gridOptions,undefined,true);
          gridObj.setPreHeaderPanelVisibility(true);
        }
        if (gridObj.getCanvasWidth() < window.innerWidth) {
          gridObj.autosizeColumns()
        }
        if (layoutId !== null || layoutId !== undefined) {
          setTimeout(() => {
            this.groupBy(e, args, angularGrid, layoutId);
            if(grpColumns.length === 0) { 
              angularGrid['slickGrid']['isGroupingEnabled'] = false
              this.resizeColumnsByCellContent(angularGrid) 
            } else{
              angularGrid['slickGrid']['isGroupingEnabled'] = true
              this.resizeColumnsByCellContent(angularGrid)
            } 

          }, 100)
        }
        break;
      }
      case "clear-all": {
        $(document).find('.dontCloseInGloablClick').removeClass("dontCloseInGloablClick")
        window.$(".cs-dropdown-open").jqDropdown("hide", [".cs-dropdown"]);
        $("." + groupId + " .cs-groupbymore").remove();
        groupBy['style']['paddingLeft'] = 10 + 'px'

        allColumns.forEach(column => {
          if (gridObj.getColumnIndex(column['id']) !== undefined) {
            finalColumns.push(column)
          } else {
            let val = tempColumnDefinitions.some(tempColumn => {
              if (column['id'] === tempColumn['id']) {
                finalColumns.push(column)
                return true
              }
            })
          }
        })
        tempColumnDefinitions.splice(0, tempColumnDefinitions.length)
        angularGrid.slickGrid.setColumns(finalColumns)
        angularGrid['slickGrid']['isGroupingEnabled'] = false
        this.resizeColumnsByCellContent(angularGrid)

        break;
      }
      default: {
        break;
      }
    }
    gridObj.invalidate()
    gridObj.render()
  }
  getGridOptions(childObjectName, childObjectsInfo, gridContainerId, sectionObjectDetails,layoutId?, noOfItemsPerPage? ,hiddenColumns?): GridOption {
    return {
      enableAutoSizeColumns: false,
      autoFitColumnsOnFirstLoad: false,
      autoCommitEdit: true,
      autoEdit: false,
      enableCellNavigation: true,
      editable: true,
      enableAutoResize: true,
      enableSorting: true,
      enableFiltering: true,
      enableExcelExport: true,
      enableExport: true,
      pagination: {  // Pagination UI - Item per page select options for default pagintation
        pageSizes: [10, 15, 20, 25, 50, 75, 100, 200, 1000, 2000],
        pageSize: noOfItemsPerPage
      },
      i18n: this.translateService,
      gridMenu: {
        hideExportExcelCommand: true,
        hideExportCsvCommand: true,
        customItems: [{
          command: "cspfm-excel-export",
          titleKey: "EXPORT_TO_EXCEL",
          iconCssClass: "fa fa-file-excel-o",
          action: (event, callbackArgs) => {
            const childObject = this.getChildObject(childObjectName, childObjectsInfo);
            this.excelExport(event, callbackArgs, childObject['tempColumnDefinitions'], this)
          }
        }, {
          command: "cspfm-csv-export",
          titleKey: "EXPORT_TO_CSV",
          iconCssClass: "fa fa-download",
          action: (event, callbackArgs) => {
            const childObject = this.getChildObject(childObjectName, childObjectsInfo);
            this.excelExport(event, callbackArgs, childObject['tempColumnDefinitions'], this)
          }
        }, {
          command: "cspfm-groupby",
          titleKey: "Group-by",
          iconCssClass: "icon-mat-account_tree",
          action: (event, callbackArgs) => {
            this.openDraggableGroupingRow(undefined, undefined, "HeaderLineList", childObjectName, childObjectsInfo)
          }
        }, {
          command: "cspfm-clear-groupby",
          titleKey: "Clear Grouping",
          iconCssClass: "fa fa-times",
          action: (event, callbackArgs) => {
            this.clearGroupingForHL(childObjectName, childObjectsInfo,hiddenColumns)
          }
        }],
      },
      enableAutoTooltip: true,
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
        containerId: gridContainerId,
        calculateAvailableSizeBy: 'container'
      },
      exportOptions: {
        exportWithFormatter: true
      },
      excelExportOptions: {
        exportWithFormatter: true,
      },
      enableTranslate: true,
      presets: {
        sorters: sectionObjectDetails[childObjectName]["sortByColumns"],
      },
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: false,
      preHeaderPanelHeight: 40,
      rowHeight: 40,
      headerRowHeight: 40,
      enableEmptyDataWarningMessage: false,
      draggableGrouping: {
        dropPlaceHolderText: 'Drop a column header here to group by the column',
        deleteIconCssClass: 'fa fa-times',
        onGroupChanged: (e, args) => {
          const childObject = this.getChildObject(childObjectName, childObjectsInfo);
          childObject['groupColumns'] = [...args['groupColumns']]
          var gridOption = this.getGridOptions(childObject['objectName'], childObjectsInfo, gridContainerId, sectionObjectDetails, layoutId)
          this.onGroupChanged(e, args, childObject['gridMenuExtension'], childObject['angularGridInstance'], childObject['tempColumnDefinitions'], childObject['gridObj'], childObject['draggableGroupingPlugin'], gridOption, layoutId)
        },
        onExtensionRegistered: (extension) => {
          const childObject = this.getChildObject(childObjectName, childObjectsInfo);
          childObject['draggableGroupingPlugin'] = extension
        },
      }
    }
  }

  groupBy(e, args, angularGrid, layoutId) {
    var groupid = angularGrid.slickGrid.getUID();
    var groupbyUniqueId = document.getElementsByClassName(groupid)[0];
    if (args.caller === 'remove-group') {
      $(document).find('.dontCloseInGloablClick').removeClass("dontCloseInGloablClick")
      window.$(".cs-dropdown-open").jqDropdown("hide", [".cs-dropdown"]);
    }
    var getgrpid = document.getElementsByClassName(groupid)[0];
    var groupby = <HTMLElement>getgrpid.querySelectorAll(".slick-preheader-panel .ui-droppable")[0];
    var groupbyWidth = groupby['offsetWidth'];
    var primaryArray = [];
    var secondaryArray = [];
    var eachevent = Array.from(groupbyUniqueId.querySelectorAll(".slick-preheader-panel .slick-dropped-grouping"));
    var eacheventwidth = 0;
    var btn;
    var output;
    $(document).on('click', ".cs-close", function () {
      var getThisId = $(this).parents(".cs-createele").attr("getid");
      $("#" + getThisId).find(".slick-groupby-remove").trigger("click");
      $(this).parents(".cs-createele").remove();
    })
    if (eachevent.length > 0) {
      eachevent.reverse().forEach((item) => {
        item['style']['display'] = 'inline-flex';
        eacheventwidth += item['offsetWidth'];
        if (eacheventwidth > (groupbyWidth - 65)) {  //50 is morebtn width
          item['style']['display'] = 'none';
          btn = document.createElement("em");
          btn.classList.add("icon-mat-keyboard_control", "cs-groupbymore");
          btn.setAttribute("SlickgridUid", groupid);
          groupby.appendChild(btn);
          btn.classList.add("cs-dropmore");
          btn.setAttribute("data-cs-dropdown", `#cs-dropdown-${layoutId}`);
          btn.setAttribute("stopdropdownclose", 'true');
          groupby['style']['paddingLeft'] = 40 + 'px'
          btn.addEventListener("click", (e) => {
            var groupeacheventwidth: any = 0;
            var getslickgridUid = e.target.getAttribute("SlickgridUid");
            var getopenddselector = document.getElementsByClassName(getslickgridUid)[0];
            var getselectorparent = <HTMLElement>getopenddselector.querySelectorAll(".slick-preheader-panel .ui-droppable")[0];
            var geteachfiterele = Array.from(getopenddselector.querySelectorAll(".slick-preheader-panel .ui-droppable .slick-dropped-grouping"));
            var getgroupbyWidth = getselectorparent['offsetWidth'];
            primaryArray = [];
            secondaryArray = [];
            geteachfiterele.reverse().forEach((item) => {
              if (!$(item).is(":visible")) {
                item['style']['display'] = 'block';
                item.classList.add("cs-hideele");
              }
              groupeacheventwidth += item['offsetWidth'];
              if (groupeacheventwidth < (getgroupbyWidth - 65)) { //50 is morebtn width
                primaryArray.push(item);
                if (primaryArray.length === 0) {
                  btn.remove();
                  groupby['style']['paddingLeft'] = 10 + 'px'
                }
              } else {
                var getgroupobj = {
                  'getid': item.getAttribute("id"),
                  'label': item.textContent
                }
                secondaryArray.push(getgroupobj);
              }
              if ($(item).hasClass("cs-hideele")) {
                item['style']['display'] = 'none';
                item.classList.remove("cs-hideele");
              }
            })
            var dropdownid = document.getElementById("cs-dropdown-" + layoutId);
            dropdownid.classList.add("cs-secondarydropdown")
            var showhide: Element = dropdownid;
            if (showhide !== undefined || showhide !== null) {
              if (showhide['style']['display'] === 'none') {
                showhide['style']['display'] = 'block';
              } else {
                showhide['style']['display'] = 'none';
              }
            }
            $("#cs-dropdown-" + layoutId).html("");
            secondaryArray.forEach((item) => {
              output = `<div class="cs-createele" getid="${item.getid}">
                        <span>${item.label}</span>
                        <button class="cs-close"><em class="icon-mat-clear"></em></button>
                    </div>`
              $("#cs-dropdown-" + layoutId).append(output);
              $(document).on('click', ".cs-close", function () {
                if (document.getElementsByClassName("cs-createele").length === 0) {
                  btn.remove();
                  groupby['style']['paddingLeft'] = 10 + 'px'
                }
              })
            })
          })
        }else {
          $("." + groupid + " .cs-groupbymore").remove();
          groupby['style']['paddingLeft'] = 10 + 'px'
        }
      })
    }
  }
  groupbyclose(getid) {
    var x = <HTMLElement>document.getElementById(getid).getElementsByClassName("slick-groupby-remove")[0];
    x.click();
  }
  groupScroll() {
    $(".cs-mat-main-content").on('scroll', function () {
      $('.cs-dropdown').empty()
      $('.cs-dropdown').removeClass('dontCloseInGloablClick cs-fabDropDown')
      window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])
    });
    $(".slick-viewport-top.slick-viewport-left").on('scroll', function () {
      let topval = 0;
      let leftval = 0;
      let rightval = 0;
      let bottomval = 0;
      try {
        topval = parseInt($(".cs-dropdown-open:visible").closest('.slick-row')[0].style.top.split('px')[0])
        leftval = $(".cs-dropdown:visible")[0].getBoundingClientRect().left;
        rightval = $(".cs-dropdown:visible")[0].getBoundingClientRect().right;
        bottomval = $(".cs-dropdown:visible")[0].getBoundingClientRect().bottom;
      }catch (err) {
        topval = leftval = rightval = bottomval = undefined
      }
      if (topval >= $(this).scrollTop()) {
        console.log("True ScrollTop => ", $(this).scrollTop())
        window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown'])
      } else {
        console.log("False ScrollTop => ", $(this).scrollTop())
        $('.cs-dropdown').empty()
        $('.cs-dropdown').removeClass('dontCloseInGloablClick cs-fabDropDown')
        window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])
        // ----------------------------------------
      }
      if((20 < leftval) && (rightval < (window.innerWidth - 50))){
        window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown'])
      }else{
        $('.cs-dropdown').empty()
        $('.cs-dropdown').removeClass('dontCloseInGloablClick cs-fabDropDown')       
        window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])     
      }
      if((bottomval < (window.innerHeight - 60))){
        window.$('.cs-dropdown-open').jqDropdown('show', ['.cs-dropdown'])
      } else{
        $('.cs-dropdown').empty()
        $('.cs-dropdown').removeClass('dontCloseInGloablClick cs-fabDropDown')       
        window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])
      }
    });
  }


  clearGroupingForHL(childObjectName, childObjectsInfo: Array<{
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
  }>,hiddenColumns?) {
    const childObject = this.getChildObject(childObjectName, childObjectsInfo);
    const gridObj = childObject['gridObj']
    const draggableGroupingPlugin = childObject['draggableGroupingPlugin']

    let angularGridInstance: AngularGridInstance = childObject['angularGridInstance'];
    angularGridInstance.resizerService.resizeGrid();
    this.resizeColumnsByCellContent(angularGridInstance)
    if (draggableGroupingPlugin && draggableGroupingPlugin.setDroppedGroups) {
      draggableGroupingPlugin.clearDroppedGroups();
      gridObj.setPreHeaderPanelVisibility(false);
      gridObj.setOptions({
        autoFitColumnsOnFirstLoad: true
      })
    }
    if(hiddenColumns && hiddenColumns.length>0){
      this.hideColumnsFromSlickgrid(hiddenColumns,angularGridInstance)
  }
  }
  clearGrouping(angularGrid: AngularGridInstance, draggableGroupingPlugin, gridObj, gridOptions, filteredResultList, gridSearchRowToggle: boolean, onGroupByEnabledObj: { onGroupByEnabled: boolean }, filterSectionDetail?: FilterSectionDetail,hiddenColumns?) {
    angularGrid.resizerService.resizeGrid();

    if (draggableGroupingPlugin && draggableGroupingPlugin.setDroppedGroups) {
      draggableGroupingPlugin.clearDroppedGroups();
      gridObj.setPreHeaderPanelVisibility(false);
      gridOptions['autoFitColumnsOnFirstLoad'] = true
      gridObj.setOptions(gridOptions);
    }
    onGroupByEnabledObj.onGroupByEnabled = false;
    this.slickgridHeightChange(angularGrid.dataView.getLength(), false, filteredResultList, gridSearchRowToggle, angularGrid, filterSectionDetail)
    this.resizeColumnsByCellContent(angularGrid)
    if (filterSectionDetail) {
      if (filterSectionDetail['filterAppliedFields'].length > 0) {
        if ($('mat-list').hasClass('cs-top-menu-list')) {
          $('.cs-fullslick-rowheight').removeClass('cs-tempslickhight_withtop_menu')
        } else {
          $('.cs-fullslick-rowheight').removeClass('cs-tempslickhight')
        }
      }
    }
    if(hiddenColumns?.length>0){
      this.hideColumnsFromSlickgrid(hiddenColumns,angularGrid)
    }
  }
  fetchEditedRecord(dataSource: string, angularGrid, id: string,
    fieldInfoObj, value, item, conditionalValidationJSON?, eventInfo?, systemAttributeObject?) {
    const queryParams = {
      id: [id],
      dataSource: dataSource
    }
    let fieldValue = value;

    if (fieldInfoObj["fieldType"] === "LOOKUP") {
      let tempItem = JSON.parse(JSON.stringify(item));
     
      tempItem[fieldInfoObj["fieldName"]] = fieldValue;
      angularGrid.gridService.upsertItems(tempItem, {
        highlightRow: false
      })
    }
    this.dataProvider.fetchDocsUsingRecordIds(queryParams).then(res => {
      if (res['status'] === "SUCCESS") {
        
        const responseForSaveFailReset = JSON.parse(JSON.stringify(res['response']))
        var response = res['response']
        const tempResponse = res['response']
        if (response) {
          if (response['type']) {
            let tableStructure = this.dataProvider.tableStructure()
            let tempData = JSON.parse(JSON.stringify(tableStructure[response['type']]));
            response = lodash.extend({}, tempData, response)
          }
          if (fieldInfoObj["fieldType"] === "RADIO" || fieldInfoObj["fieldType"] === "DROPDOWN") {
            Object.keys(fieldInfoObj['mappingDetails']).forEach(elem => {
              if (fieldValue === elem) {
                response[fieldInfoObj["fieldName"]] = elem;
              }
            })
          } else if (fieldInfoObj["fieldType"] === "MULTISELECT" || fieldInfoObj['fieldType'] === "CHECKBOX") {
            const selectedValue = []
            fieldValue.forEach(obj => {
              Object.keys(fieldInfoObj['mappingDetails']).forEach(elem => {
                if (obj === elem) {
                  selectedValue.push(elem)
                }
              })
            })
              response[fieldInfoObj["fieldName"]] = selectedValue
          } else if (fieldInfoObj["fieldType"] === "DATE") {
            if (fieldValue instanceof Date) {
              response[fieldInfoObj["fieldName"]] = fieldValue.getTime() + moment.tz(Intl.DateTimeFormat().resolvedOptions().timeZone).utcOffset() * 60 * 1000
            }
          } else if (fieldInfoObj["fieldType"] === "TIMESTAMP") {
            if (fieldValue instanceof Date){
              response[fieldInfoObj["fieldName"]] = fieldValue.getTime();
            }
          } else if (fieldInfoObj["fieldType"] === "LOOKUP") {
            response[fieldInfoObj["fieldName"]] = fieldValue.id;
          } else {
            response[fieldInfoObj["fieldName"]] = fieldValue;
          }
          if (fieldInfoObj['fieldType'] === 'STATUSWORKFLOW' && systemAttributeObject !== undefined) {
            response['systemAttributes'] = systemAttributeObject;
          }
          // Conditional Validation
          let traversalPath;
          if (conditionalValidationJSON !== null && conditionalValidationJSON !== undefined && conditionalValidationJSON.validationRules.length > 0) {
            let conditionalValidationDataObject = {}
            if (conditionalValidationJSON['layoutType'] === 'HeaderLineList') {
              let objectId = this.objectTableMappingObject.mappingDetail[fieldInfoObj["objectName"]]
              if (fieldInfoObj["isReverseLookup"] === 'Y') {
                objectId += '_' + fieldInfoObj["lookupFieldId"]
              }  
              const conditionalValidationObjectHierarchy = conditionalValidationJSON
              ['conditionalValidationSectionObjectHierarchy'][objectId]
              conditionalValidationJSON['conditionalValidationObjectHierarchy'] = conditionalValidationObjectHierarchy
              if(conditionalValidationObjectHierarchy) {
                const objectHierarchy = conditionalValidationJSON
              ['sectionObjectHierarchy'][objectId]
              conditionalValidationJSON['objectHierarchy'] = objectHierarchy
              traversalPath = conditionalValidationObjectHierarchy['rootPath']

              conditionalValidationDataObject[traversalPath] = item
                let sectionObjectId = item['type']
                if (fieldInfoObj["isReverseLookup"] === 'Y') {
                  sectionObjectId += '_' + fieldInfoObj["lookupFieldId"]
                }  
                this.cspfmDataTraversalUtilsObject.seperateRelatioshipObjectsFromPrimaryDataSet(item, conditionalValidationJSON, conditionalValidationJSON.layoutId, sectionObjectId);
              }
            } else {
              traversalPath = fieldInfoObj["objectName"] + "_DUMMY"
              conditionalValidationDataObject[traversalPath] = item
              this.cspfmDataTraversalUtilsObject.seperateRelatioshipObjectsFromPrimaryDataSet(item, conditionalValidationJSON, conditionalValidationJSON.layoutId);
            }
            if (fieldInfoObj["fieldType"] === "DATE") {
              let dateValue = new Date(this.datePipe.transform(new Date(fieldValue),
                appConstant.orgTimeZoneDateFormat) + "T00:00:00.000" + this.appUtilityConfig.orgZoneOffsetValueWithFormat)
              conditionalValidationJSON['dataObject'][traversalPath][fieldInfoObj["fieldName"]] = dateValue.getTime();
            } else if (fieldInfoObj["fieldType"] === "TIMESTAMP") {
              conditionalValidationJSON['dataObject'][traversalPath][fieldInfoObj["fieldName"]] = new Date(fieldValue).getTime();
            } else if (fieldInfoObj["fieldType"] === "LOOKUP") {
              const typeValue = fieldValue['type']
              const getKey = Object.keys(this.objectTableMappingObject.mappingDetail).
                find(key => this.objectTableMappingObject.mappingDetail[key] === typeValue);
              const pathSplit = fieldInfoObj['traversalpath'].split("$$")
              traversalPath = fieldInfoObj["objectName"] + "_DUMMY" + "$$" + getKey + "_" + pathSplit[1]
              conditionalValidationDataObject[traversalPath] = fieldValue
              conditionalValidationJSON['dataObject'] = conditionalValidationDataObject
            }
            conditionalValidationJSON['pickListValues'] = fieldInfoObj['mappingDetails']
            const fieldName = fieldInfoObj["fieldName"] + "$$" + fieldInfoObj["objectName"]
            const validationResultObject = this.cspfmConditionalValidationUtils.
              applyValidationForOnChange(conditionalValidationJSON, 'onChange', fieldName)
            
            const saveHasError = this.showValidationMessage(validationResultObject, 'onChange', fieldName)
            if (saveHasError === "Error") {
              item[fieldInfoObj["fieldName"]] = responseForSaveFailReset[fieldInfoObj["fieldName"]];
              const dataView = angularGrid.grid.getData()
              if (dataView) {
                dataView.beginUpdate();
                const value = dataView.getItemById(item['id'])
                if (value) {
                  dataView.updateItem(item['id'], item);
                } else {
                  dataView.addItem(item);
                }
                dataView.endUpdate();
                dataView.reSort();
              }
              // angularGrid.gridService.upsertItems(item, {
              //   highlightRow: false
              // })
              return
            }
          }
          this.dataProvider.saveWithValidation('Edit', dataSource, response['type'],
            response, null).then(result => {
              if (result['status'] !== 'SUCCESS') {
                if (result['message']['validationFailureSet']){
                  this.appUtilityConfig.showInfoAlert(result['message'].validationFailureSet[0].faildReasons[0].fmg);
                }else{
                this.appUtilityConfig.showInfoAlert(result['message']);
                }
                if (fieldInfoObj["fieldType"] === "LOOKUP") {
                  const dataView = angularGrid.dataView
                  if (dataView) {
                    dataView.beginUpdate();
                    const value = dataView.getItemById(item['id'])
                    if (value) {
                      dataView.updateItem(item['id'], item);
                    } else {
                      dataView.addItem(item);
                    }
                    dataView.endUpdate();
                    dataView.reSort();
                  }
                  // angularGrid.gridService.upsertItems(item, {
                  //   highlightRow: false
                  // })
                } else {
                  item[fieldInfoObj["fieldName"]] = responseForSaveFailReset[fieldInfoObj["fieldName"]];
                  // angularGrid.gridService.upsertItems(item, {
                  //   highlightRow: false
                  // })
                  const dataView = angularGrid.grid.getData()
                  if (dataView) {
                    dataView.beginUpdate();
                    const value = dataView.getItemById(item['id'])
                    if (value) {
                      dataView.updateItem(item['id'], item);
                    } else {
                      dataView.addItem(item);
                    }
                    dataView.endUpdate();
                    dataView.reSort();
                  }
                }
                return;
              }
              if (result && result['status'] === 'SUCCESS' && fieldInfoObj['fieldType'] === 'STATUSWORKFLOW') {
                this.workFlowHistoryCommentSaveAction(res['response'], fieldInfoObj, eventInfo, dataSource)
              }
            })
        }
      }
    })
  }
  popoverStatusChanged(event: any, dataSource: string, angularGrid: AngularGridInstance, conditionalValidationJSON?) {
    if (event['actionName'] === '' || event['actionName'] === 'close' || event['actionName'] === 'cancel') {
      return;
    }
    let selectedStatusField = {};

    selectedStatusField['statusLabel'] = event['selectedStatus']['statusLabel'];
    selectedStatusField['statusValue'] = event['selectedStatus']['statusValue'];
    selectedStatusField['statusType'] = event['selectedStatus']['statusType'];
    

    if (event['actionName'] === "Approve" || event['actionName'] === "Reject") {
      this.approveAction(selectedStatusField, event['workFlowUserApprovalStatusDataObject'], event['comments'], dataSource)
    } else if (event['selectedValue']) {
      let data = event['selectedObject'];
      let fieldId = event['fieldId'];
      let configId = event['statusWFConfigId'];

      let systemAttributeObject = undefined;
      if (event['selectedStatus']['isApproveInitiateEnabled'] === 'Y') {
        systemAttributeObject = this.getSystemAttributes(fieldId, configId);
      }
      let id = data['type'] + '_2_' + data['id']
      this.fetchEditedRecord(dataSource, angularGrid, id, event['columnDef']['params']['fieldInfo']
        , event['selectedValue'], data, conditionalValidationJSON, event, systemAttributeObject)

    }
  }

  approveAction(selectedStatusField, workFlowUserApprovalStatusDataObject, userComment, dataSource) {
    workFlowUserApprovalStatusDataObject = workFlowUserApprovalStatusDataObject;
    workFlowUserApprovalStatusDataObject['lastmodifiedby'] = this.appUtilityConfig.userId
    var userObjectList = workFlowUserApprovalStatusDataObject['approvalStatus'].filter(userDataObject => userDataObject.userId === this.appUtilityConfig.userId);
    var userObject = userObjectList[0]
    userObject['userName'] = this.appUtilityConfig.loggedUserName

    userObject['statusValue'] = selectedStatusField['statusValue']
    userObject['statusType'] = selectedStatusField['statusType']
    userObject['statusLabel'] = selectedStatusField['statusLabel']
    userObject['approvalExecutionStatus'] = "INPROGRESS"
    userObject['execStatusMessage'] = ""
    userObject['comment'] = ""
    userObject['userComment'] = userComment
    this.dataProvider.executionDataSave(this.executionDbConfigObject.workFlowUserApprovalStatusObject,
      workFlowUserApprovalStatusDataObject, dataSource).then(result => {

        if (result['status'] !== 'SUCCESS') {
          alert("failed")

          return;
        }
        this.appUtilityConfig.presentToast("data saved sucessfully")
      })
  }
  getSystemAttributes(fieldId, configId) {
    var systemAttributeObject = {};
    const date = new Date();
    systemAttributeObject['lockedBy'] = this.appUtilityConfig.userId;
    systemAttributeObject['lockedDate'] = date.getTime();
    systemAttributeObject['fieldId'] = fieldId;
    systemAttributeObject['lockedStatus'] = 'INPROGRESS';
    systemAttributeObject['statusWFConfigId'] = configId;
    systemAttributeObject['workFlowExecID'] = '';
    return systemAttributeObject;
  }
  getter(data, filedInfo) {
    return this.cspfmDataDisplay.transform(data, filedInfo)
  }

  formatter(groupingFormatterItem, fieldLabel) {
    let displayLabel = lodash.escape(this.translateService.instant(fieldLabel))
    let groupValue = groupingFormatterItem.value
    if (groupValue === '' || groupValue === null || groupValue === undefined) {
      groupValue = 'NULL'
    }
    return `<span style="color: #333333">${displayLabel}:</span> ${groupValue}  <span style="color:green">(${groupingFormatterItem.count} items)</span>`
  }

  excelExport(event, callbackArgs, tempColumnDefinitions, parent) {
    if (tempColumnDefinitions && tempColumnDefinitions.length > 0) {
      this.appUtilityConfig.presentToast("Couldn't Process the Export Data since GroupBy Option Enabled!.Kindly clear it", 4000)
      return
    }

    let displayFileType;
    if (callbackArgs['command'] === 'cspfm-excel-export') {
        displayFileType = 'Excel ';
    } else if (callbackArgs['command'] === 'cspfm-csv-export') {
        displayFileType = 'CSV ';
    }
    const cspfmGridCustomData = callbackArgs['grid']['cspfm_grid_custom_data']
    if (cspfmGridCustomData) {
        const pageTitle = cspfmGridCustomData['page_title_key']
        const objectName = cspfmGridCustomData['object_display_name']

        this.appUtilityConfig.presentToast("Export to " + displayFileType + "initiated");

        return this.translateService.get(pageTitle).subscribe(res => {
            let filename = res;
            if (objectName) {
                filename = res + " - " + objectName;
            }
            
            if (callbackArgs['command'] === 'cspfm-excel-export') {
                let excelExportOptions: ExcelExportOption = {
                    filename: filename,
                    format: FileType.xlsx
                }
                return cspfmGridCustomData['angular_grid_excel_export_service_instance'].exportToExcel(excelExportOptions).catch(error => {
                  this.appUtilityConfig.showAlert(parent, error.message);

                    return error;
                });
            } else {
                let exportOptions: ExportOption = {
                    filename: filename,
                    format: FileType.csv,
                    delimiter:DelimiterType.comma
                }
                return cspfmGridCustomData['angular_grid_export_service_instance'].exportToFile(exportOptions).catch(error => {
                    this.appUtilityConfig.showAlert(parent, error.message);

                    return error;
                });
            }
        })
    }
  }

  togglePagination(event, callbackArgs, gridObj, angularGrid: AngularGridInstance) {
    gridObj['cspfm_grid_custom_data']['isPaginationEnabled'] = !gridObj['cspfm_grid_custom_data']['isPaginationEnabled']
    const angularGridOptions: GridOption = callbackArgs.grid.getOptions();
    angularGrid.paginationService.togglePaginationVisibility(!angularGridOptions.enablePagination)
    angularGrid.resizerService.resizeGrid();
    this.resizeColumnsByCellContent(angularGrid) 
  }

  navigationChange(event, angularGrid: AngularGridInstance) {
    if (event === 'next') {
      angularGrid.paginationService.goToNextPage()
    } else {
      angularGrid.paginationService.goToPreviousPage()
    }
    this.resizeColumnsByCellContent(angularGrid)
  }

  selectionChange(event, angularGrid: AngularGridInstance) {
    angularGrid.paginationService.changeItemPerPage(Number(event.value))
    this.resizeColumnsByCellContent(angularGrid)
  }

  toggleGridMenu(event, angularGrid: AngularGridInstance, sectionObjectDetails: { [objectName: string]: SectionObjectDetail }, tableName: string, matrixAngularGridInstance: AngularGridInstance) {
    let uId = angularGrid.slickGrid.getUID();
    $(`.slick-gridmenu.${uId}`).find('.close').addClass('cs-temp-close-btn');
    let onScrollEvent;
    onScrollEvent = () => {
      $(document).find(".slick-gridmenu:visible").find(".cs-display-none.pinpoint").trigger("click");
    }
    if (angularGrid && angularGrid.extensionService) {
      let gridMenuInstance
      if (sectionObjectDetails[tableName]['matrixConfig']['displayInfo']['currentMode'] === 'list') {
        gridMenuInstance = angularGrid.extensionService.getSlickgridAddonInstance(ExtensionName.gridMenu);
      } else {
        gridMenuInstance = matrixAngularGridInstance.extensionService.getSlickgridAddonInstance(ExtensionName.gridMenu);
      }
      let onMenuCloseFunction = (e) =>{
        $(".cs-custom-scroll").off('scroll', onScrollEvent);
        gridMenuInstance.onMenuClose.unsubscribe(onMenuCloseFunction);
      }
      gridMenuInstance.onMenuClose.subscribe(onMenuCloseFunction)
      $(".cs-custom-scroll").on('scroll', onScrollEvent);
      gridMenuInstance.showGridMenu(event);
    }
    $(`.slick-gridmenu.${uId} .close`).on('click',()=>{
      $(`.slick-gridmenu.${uId}`).hide();
    })
    const posit = event.currentTarget.getBoundingClientRect()
    let window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var slick_grid_cls = document.getElementsByClassName('slick-gridmenu');
    Array.prototype.forEach.call(slick_grid_cls, function (el) {
     
      if (el.style.display !== 'none') {
        console.log(el.classList);
        let top = posit.top + 27
        let left = posit.left
        let maxHeight = (window_height - (posit.top + 30)) - 50
        document.getElementsByClassName(el.classList)[0].setAttribute("style", ` top: ${top}px!important;left: ${left}px!important;max-height: ${maxHeight}px;`);
      }
    });
  }

  async showInlineLookupEdit(inlineLookupConfig: {
    args: OnEventArgs,
    lookupTitle: string,
    lookupColumns: Array<FieldInfo>,
    lookupHierarchyJson: any,
    criteriaInvolvedFields: Array<FieldInfo>,
    lookupField: any,
    criteriaQueryConfig: any
    argumentColumns?: any
  }, slickgridPopoverService, parent, dataSource, layoutId?, childObjName?) {
    let dataContext = inlineLookupConfig.args['dataContext'];
    let lookupInput = {};
    let queryString = '';
    queryString = "type:" + "pfm" + inlineLookupConfig.lookupHierarchyJson['objectId'];
    inlineLookupConfig.lookupHierarchyJson['query'] = queryString
    lookupInput['lookupColumnDetails'] = inlineLookupConfig.lookupColumns;
    lookupInput['objectHierarchy'] = inlineLookupConfig.lookupHierarchyJson;
    lookupInput['title'] = inlineLookupConfig.lookupTitle;
     // works when dependent lookup call
     let argumentColumnStr = "";
     let regexQuery = '';
     let dataObject = {}
     if (inlineLookupConfig.argumentColumns != undefined) {
       let dataPaths = this.layoutCongifuration['layoutConfiguration'][layoutId]['sectionObjectTraversal'][childObjName]['objectTraversal'];
       console.log("datapaths", dataPaths)
       Object.keys(dataPaths).forEach(dataPath => {
         let objectRoot = this.layoutCongifuration['layoutConfiguration'][layoutId]['sectionObjectTraversal'][childObjName]['objectTraversal'][dataPath];
         let result = {};
         result = this.cspfmDataTraversalUtilsObject.getDataObject(JSON.parse(JSON.stringify(dataContext)), objectRoot);
         console.log(result)
         dataObject[dataPath] = JSON.parse(JSON.stringify(result))
       })
       console.log("dataObject => ", dataObject);
 
       console.log("inlineLookupConfig.argumentColumns ==>", inlineLookupConfig.argumentColumns);      
 
       for (const argumentColumns of inlineLookupConfig.argumentColumns) {
         const rootPath = argumentColumns["rootPath"]
         const sourceField = argumentColumns["sourceColumn"]
         const rootPathObject = dataObject[rootPath]
         
         let lookupfield = parent['lookupFieldMappingObject']['mappingDetail'][childObjName]
         const dependentField = Object.keys(lookupfield).find(key => lookupfield[key] === sourceField);
         if (rootPathObject[sourceField] === undefined || rootPathObject[sourceField] === null) {
           this.appUtilityConfig.showAlert(parent, dependentField + ' field does not have value')
         }
         break;
       }
       argumentColumnStr = await this.cspfmLookupServiceObject.makeQueryForDependentLookup(inlineLookupConfig.argumentColumns, dataObject, argumentColumnStr, inlineLookupConfig.lookupHierarchyJson['objectId'], inlineLookupConfig.lookupHierarchyJson)
     }
 
     if (argumentColumnStr !== '' && regexQuery !== '') {
       inlineLookupConfig.lookupHierarchyJson['query'] = queryString + argumentColumnStr + " AND " + regexQuery;
     } else if (regexQuery !== '') {
       inlineLookupConfig.lookupHierarchyJson['query'] = queryString + " AND " + regexQuery;
     } else if (argumentColumnStr !== '') {
       inlineLookupConfig.lookupHierarchyJson['query'] = queryString + argumentColumnStr;
     } else {
       inlineLookupConfig.lookupHierarchyJson['query'] = queryString
     }
    if (inlineLookupConfig.criteriaQueryConfig) {
      let criteriaFieldCheckResut = this.cspfmLookupCriteriaUtils.checkCriteriaAvailableInSlickgrid(this.cspfmDataDisplay, inlineLookupConfig.criteriaInvolvedFields, dataContext)
      if (criteriaFieldCheckResut['errorMessage'].length > 0 || criteriaFieldCheckResut['showAlert']) {
        if (criteriaFieldCheckResut['errorMessage'].length > 0) {
          this.appUtilityConfig.showAlert(parent, criteriaFieldCheckResut['errorMessage'].join(', ') + ' fields does not have value')
        }
        return;
      } else {
        const criteriaConfig = {
          'lookupCriteriaQueryConfig': inlineLookupConfig.criteriaQueryConfig,
          'criteriaDataObject': dataContext,
          'criteriaFields': criteriaFieldCheckResut['criteriaFields'],
          'type': 'slickgrid'
        }
        lookupInput['criteriaConfig'] = criteriaConfig
      }
    }
    let isStandardObject = lookupInput['objectHierarchy']['isStandardObject']
    let data = {
      parentPage: parent,
      dataSource: dataSource,
      lookupColumnName: inlineLookupConfig.lookupField,
      lookupInput: lookupInput,
      objectName: inlineLookupConfig.lookupHierarchyJson.objectName
    };
    if (isStandardObject === 'Y') {

      data["serviceObject"] = this.dataProvider.getMetaDbServiceProvider(dataSource)

    } else {
      data["serviceObject"] = this.dataProvider.getDbServiceProvider(dataSource)

    }
    slickgridPopoverService.render({
      component: cspfmSlickgridPopover,
      args: inlineLookupConfig.args,
      parent: parent,
      additionalInfo: {
        "data": data
      }
    });
  }

  // This method for handling horizontal scroll bar issue when filter applied
  slickgridHeightChange(rowCount: number, fromFetchMethod, filteredResultList, gridSearchRowToggle: boolean, angularGrid: AngularGridInstance, filterSectionDetail?: FilterSectionDetail) {
    if (filterSectionDetail) {
      var recordsCount = filteredResultList.length
      if (gridSearchRowToggle && (!fromFetchMethod || angularGrid.dataView.getLength() > 0)) {
        recordsCount = angularGrid.dataView.getLength()
      }
      if (recordsCount < rowCount) {
        rowCount = recordsCount
      }
      let rowCalc = rowCount * 40
      console.log('rowCount => ', rowCount);

      if (!filterSectionDetail['filterPanelExpanded'] && filterSectionDetail['filterApplied'] && filterSectionDetail['filterAppliedFields'].length > 0) {
        $('.cs_hightfix_by_script').css({
          'height': rowCalc + 50
        })
        $('.cs_hightfix_by_script').find('.slick-pane.slick-pane-top.slick-pane-left').find('.slick-viewport.slick-viewport-top.slick-viewport-left').css({
          'height': rowCalc + 10
        })
      }
    }
  }

  commitCurrentEdit(gridObj, objectName?) {
    if (gridObj) {
      gridObj.getEditorLock().commitCurrentEdit();
    }
  }
  

  // This method for handling horizontal scroll bar issue when filter applied
  onPaginationCountChanged(isCustomePageinationEnabled: boolean, angularGrid: AngularGridInstance, onGroupByEnabledObj: { onGroupByEnabled: boolean }, pagination, filterSectionDetail: FilterSectionDetail, filteredResultList, gridSearchRowToggle: boolean) {
    if (!onGroupByEnabledObj.onGroupByEnabled) {
      if (isCustomePageinationEnabled) {
        let rowscount = parseInt(pagination['view']['itemCount'])

        if (!filterSectionDetail['filteronActionCellClickPanelExpanded'] && filterSectionDetail['filterApplied'] && filterSectionDetail['filterAppliedFields'].length > 0) {
          this.slickgridHeightChange(rowscount, false, filteredResultList, gridSearchRowToggle, angularGrid, filterSectionDetail)
          angularGrid.resizerService.resizeGrid();
        }
      }else {
        angularGrid.paginationService.onPaginationChanged.subscribe((e) => {
          console.log('Hight result => ', e);
          let dataTo = e.dataTo
          let dataFrom = e.dataFrom
          let rowscount = (dataTo - dataFrom) + 1

          if (!filterSectionDetail['filterPanelExpanded'] && filterSectionDetail['filterApplied'] && filterSectionDetail['filterAppliedFields'].length > 0) {
            this.slickgridHeightChange(rowscount, false, filteredResultList, gridSearchRowToggle, angularGrid, filterSectionDetail)
            angularGrid.resizerService.resizeGrid();
          }
        })
      }
    }
  }
  workFlowHistoryCommentSaveAction(selectedObject, FieldInfoDetail, statusInfo, dataSource) {

    this.cspfmStatusWorkFlowServiceObject.callHistoryRecord(selectedObject, FieldInfoDetail['fieldName'], dataSource).then(res => {
      if (!res) {
        return
      }

      var worflowHistoryDataObject = res
      var statusAlradyInserted: boolean = false;
      var filterDataSet;

      filterDataSet = worflowHistoryDataObject['workFlowHistory'].filter(elem => {
        return elem['statusValue'] === statusInfo['selectedStatus']['statusValue']
      })[0]

      if (filterDataSet) {
        statusAlradyInserted = Object.keys(filterDataSet).length > 0
      }


      if (statusAlradyInserted) {
        return
      }

      worflowHistoryDataObject['fieldName'] = FieldInfoDetail['fieldName']
      // worflowHistoryDataObject['fieldName'] = 'workflow'

      worflowHistoryDataObject['objectName'] = FieldInfoDetail['statusWorkflow']['objectId']
      worflowHistoryDataObject['referenceid'] = selectedObject['id']

      var statusobject = {}
      statusobject['userName'] = this.appUtilityConfig.loggedUserName
      statusobject['updatedBy'] = this.appUtilityConfig.userId;
      statusobject['comments'] = statusInfo['comments']
      statusobject['updatetime'] = new Date().getTime()
      statusobject['workFlowExecID'] = null
      statusobject['statusValue'] = statusInfo['selectedStatus']['statusValue']
      statusobject['statusLabel'] = statusInfo['selectedStatus']['statusLabel']
      statusobject['statusType'] = statusInfo['selectedStatus']['statusType']
      statusobject['isApproveInitiateEnabled'] = statusInfo['selectedStatus']['isApproveInitiateEnabled']
      worflowHistoryDataObject['workFlowHistory'].push(statusobject)



      return this.dataProvider.executionDataSave(FieldInfoDetail['statusWorkflow']['objectId'] + "_WorkFlowHistory", worflowHistoryDataObject, dataSource).then(res => {
        if (res['status'] !== 'SUCCESS') {
          return { status: "FAILED", message: '', records: '' };
        }
        return res
      }).catch(err => {
        return { status: "FAILED", message: err.message, records: '' };
      })
    })
  }
  onItemTap(selectedObj, navigationUrl, redirectUrl, isPopOver: boolean, actionInfo_View: any, inlineEditBoolObj: { isNavigated: boolean, isDoubleClicked: boolean }, navigationComponent?: any, action?) {
    const queryParamsRouting = {
      id: selectedObj["id"],
      viewFetchActionInfo: JSON.stringify(actionInfo_View),
    };
    let checkRecordNotInitiated: boolean = true
    if (action === 'Edit') {
      queryParamsRouting['action'] = action
      let dataObject = {}
      dataObject[selectedObj['type']] = selectedObj
      checkRecordNotInitiated = this.checkRecordInitiatedOrNotFromListSection(dataObject, action);
    }
    if (!this.appUtilityConfig.checkPageAlreadyInStack(navigationUrl)) {
      queryParamsRouting['redirectUrl'] = redirectUrl
    }
    if (!inlineEditBoolObj.isDoubleClicked) {
      if (checkRecordNotInitiated) {
        if (isPopOver) {
          this.openDialog(queryParamsRouting, navigationComponent)
        } else {
          this.navigationByRouter(navigationUrl, queryParamsRouting)
        }
      }
    }
    setTimeout(() => {
      inlineEditBoolObj.isNavigated = false;
    }, 50)
  }
  openDialog(navParams: any, navigationComponent) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      params: navParams
    };
    dialogConfig.panelClass = 'cs-dialoguecontainer-large'
    this.dialog.open(navigationComponent, dialogConfig)
  }
  navigationByRouter(navigationUrl, queryParamsRouting) {
    this.router.navigate([navigationUrl], {
      queryParams: queryParamsRouting,
      skipLocationChange: true
    });
  }
  deleteFieldValue(args, fieldName, isMultipleUrlField, dbDataValue, isAdditionalChip, angularGrid,isFromMultiLineEntry?, conditionalValidationJSON?) {
    const columnDefinition = args.grid.getColumns()
    const fieldInfoObj = columnDefinition[args.cell].params.fieldInfo
    let item = args.grid.getData().getItem(args['row']);
    const recordId = item.type + '_2_' + item.id
    let data = item[fieldName] || '';
    data = this.appUtilityConfig.isValidJson(data);
    if (typeof data === 'string') {
      data = null;
    } else if (typeof data === 'object') {
      if (data.urlDBValue.length) {
        let resultArray = data.urlDBValue.filter(function (firstObj) {
          return dbDataValue.some(function (secondObj) {
            return ((firstObj['displayValue'] === secondObj['displayValue']) && (firstObj['urlValue'] === secondObj['urlValue']));
          });
        });
        let invalidArrayIndex = data.urlDBValue.indexOf(resultArray[0] || {});
        if (resultArray.length === 0) {
          invalidArrayIndex = isAdditionalChip ? (data.urlDBValue.length - 1) : 0;
        }
        data.urlDBValue.splice(invalidArrayIndex, 1);
        if (data.urlDBValue.length === 0) {
          data = null;
        }
      } else {
        data = null;
      }
    }
    let dbData = null;
    if (data) {
      dbData = {
        urlType: isMultipleUrlField ? 'multiple' : 'single',
        urlDBValue: data.urlDBValue
      }
      dbData = JSON.stringify(dbData);
    }
    if(typeof isFromMultiLineEntry === 'boolean' && isFromMultiLineEntry === true){
      let tempItem = JSON.parse(JSON.stringify(item));
      tempItem[fieldInfoObj["fieldName"]] = dbData;
       angularGrid.gridService.upsertItems(tempItem, {
        highlightRow: false
      })
    }else{
      this.fetchEditedRecord(appConstant.couchDBStaticName, angularGrid, recordId, fieldInfoObj, dbData, item, conditionalValidationJSON);
    }

  }
  // Hl List Method
  getChildObject(childObjectName, childObjectsInfo: Array<{
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
  }>) {
    var childObject;
    let value = childObjectsInfo.some(element => {
      if (element['objectName'] === childObjectName) {
        childObject = element
        return true
      }
      return false
    })
    return childObject
  }

  handleLiveListenerForReportObjects(modified, sectionObjectDetails, reportInput, printInput, childObjectsInfo, dataObject, tableName) {
    const reportResult = modified['doc']['data']
    var reportInput = reportInput[reportResult['elementId']] ? reportInput[reportResult['elementId']] : printInput[reportResult['elementId']]
    var actionKey = reportInput['action'] === "View" ? 'reportInput' : 'printInput'
    var childObject;
    Object.keys(sectionObjectDetails).some(objectName => {
      if (sectionObjectDetails[objectName][actionKey] && sectionObjectDetails[objectName][actionKey].indexOf(reportInput['elementId']) > -1) {
        childObject = childObjectsInfo.filter(childObject => childObject['objectName'] === objectName)
        return true
      }
    })
    if (reportInput && reportInput['isLoading']) {
      switch (reportResult['reportStatus']) {
        case 'COMPLETED':
          reportInput['isLoading'] = false
          if (reportInput['onDemandReportGneration'] === 'Y') {
            this.openReportViewer(reportInput['action'], reportResult)
          } else {
            this.openReportDialog(reportResult['reportStatus'], reportInput, reportResult, childObjectsInfo, dataObject, tableName, childObject)
          }
          break;
        case 'INITIATED':
          this.appUtilityConfig.presentToast("Report generation in initiated...")
          break;
        case 'PROCESSING':
          this.appUtilityConfig.presentToast("Report generation in progress...")
          break;
        case 'ERROR':
          reportInput['isLoading'] = false
          this.openReportDialog(reportResult['reportStatus'], reportInput, reportResult, childObjectsInfo, dataObject, tableName, childObject)
          break;
        default:
          break;
      }
    }
  }

  regenerateReport(reportResult, reportInput, childObject, childObjectsInfo, dataObject, tableName) {
    if (reportInput['isVisiblePageData'] === 'Y') {
      reportInput['dataJson'] = [JSON.parse(JSON.stringify(dataObject[tableName]))]
      if (childObject) {
        const childObjName = this.dataProvider.getPluralName(childObject['objectName'])
        reportInput['dataJson'][0][childObjName] = childObject['childDocsArray']
      } else {
        childObjectsInfo.forEach(childObject => {
          let childObjName = this.dataProvider.getPluralName(childObject['objectName'])
          reportInput['dataJson'][0][childObjName] = childObject['childDocsArray']
        })
      }
    }
    this.cspfmReportGenerationService.regenerateReport(reportInput, JSON.parse(JSON.stringify(reportResult)))
  }

  reportAction(reportInput, isSkeletonLoading, childObjectsInfo, layoutId, dataSource, dataObject, tableName, childObject?) {
    if (isSkeletonLoading) {
      this.appUtilityConfig.presentToast("Another process is running, please wait");
      return
    }
    if (reportInput['isLoading']) {
      reportInput['isLoading'] = false
      this.appUtilityConfig.presentToast("Report generation cancelled.")
      return
    } else {
      reportInput['isLoading'] = true
    }
    this.openPDF(reportInput, childObject, childObjectsInfo, layoutId, dataSource, dataObject, tableName).then(res => {
      if (res && res['records'].length > 0) {
        const reportResult = res['records'][0]
        switch (reportResult['reportStatus']) {
          case 'COMPLETED':
          case 'ERROR':
            reportInput['isLoading'] = false;
            this.openReportDialog(reportResult['reportStatus'], reportInput, reportResult, childObject, childObjectsInfo, dataObject, tableName);
            break;
          case 'INITIATED':
            this.appUtilityConfig.presentToast("Report generation in initiated...")
            break;
          case 'PROCESSING':
            this.appUtilityConfig.presentToast("Report generation in progress...")
            break;
          default:
            break;
        }
      } else {
        reportInput['isLoading'] = false
        if (res && res['data']) {
          this.appUtilityConfig.presentToast(res['data']['message'])
        } else {
          this.appUtilityConfig.presentToast("Report generation is initiated...")
        }
      }
    })
  }

  openPDF(reportInput, childObject, childObjectsInfo, layoutId, dataSource, dataObject, tableName) {
    if (reportInput['isVisiblePageData'] === 'Y') {
      reportInput['dataJson'] = [JSON.parse(JSON.stringify(dataObject[tableName]))]
      if (childObject) {
        const childObjName = this.dataProvider.getPluralName(childObject['objectName'])
        reportInput['dataJson'][0][childObjName] = childObject['childDocsArray']
      } else {
        childObjectsInfo.forEach(childObject => {
          let childObjName = this.dataProvider.getPluralName(childObject['objectName'])
          reportInput['dataJson'][0][childObjName] = childObject['childDocsArray']
        })
      }
    }
    reportInput['layoutId'] = +layoutId
    if (dataSource === 'JsonDB') {
      reportInput['recordId'] = +("" + this.appUtilityConfig.userId + layoutId + reportInput['elementId'])
    } else {
      reportInput['recordId'] = dataObject[tableName]['id'].includes(dataObject[tableName]['type']) ? dataObject[tableName]['id'] : dataObject[tableName]['type'] + "_" + this.appUtilityConfig.orgId + "_" + dataObject[tableName]['id']
    }
    return this.cspfmReportGenerationService.getReport(reportInput).then(res => {
      if (reportInput['onDemandReportGneration'] === 'Y') {
        if (res && res['records'].length > 0) {
          this.regenerateReport(res['records'][0], reportInput, childObject, childObjectsInfo, dataObject, tableName)
        }
      } else {
        return res;
      }
    }).catch(e => {
      reportInput['isLoading'] = false
      this.appUtilityConfig.presentToast("Report generation error...")
    })
  }

  openReportViewer(action, reportResult) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      type: reportResult['reportFormat'],
      url: reportResult['reportPath'],
      action: action
    };
    dialogConfig.panelClass = 'custom-dialog-container'
    this.dialog.open(cspfmAlertDialog, dialogConfig);
  }

  openReportDialog(status, reportInput, reportResult, childObjectsInfo, dataObject, tableName, childObject?) {
    var button = [{ "name": "Regenerate" }]
    var title = "";
    if (status === 'ERROR') {
      title = "Report generation error..."
    } else {
      button.unshift({ "name": reportInput['action'] })
      title = "Report available"
    }
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      title: title,
      buttonInfo: button,
      parentContext: this,
      type: "Alert"
    }
    dialogConfig.autoFocus = false
    let dialogRef = this.dialog.open(cspfmAlertDialog, dialogConfig)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result['name'] === 'View' || result['name'] === 'Print') {
          reportInput['isLoading'] = false
          this.openReportViewer(reportInput['action'], reportResult)
        } else if (result['name'] === 'Regenerate') {
          reportInput['isLoading'] = true
          this.regenerateReport(reportResult, reportInput, childObject, childObjectsInfo, dataObject, tableName)
        }
      }
    });
  }
  modifiedDataSet(angularGrid: AngularGridInstance, childObjectsInfo, selectedObjectName, modifiedDataId) {
    if (modifiedDataId) {
      const removedObjectId = modifiedDataId.replace(selectedObjectName + '_2_', "")
      const filterRecord = lodash.filter(childObjectsInfo, { 'id': removedObjectId });
      if (filterRecord.length > 0) {
        const index = lodash.findIndex(childObjectsInfo, { 'id': removedObjectId })
        const slickgridRecords = angularGrid.dataView.getItems();
        const isRecordExists = lodash.filter(slickgridRecords, { 'id': childObjectsInfo[index]["id"] });
        if (angularGrid && isRecordExists.length) {
          angularGrid.dataView.beginUpdate();
          angularGrid.dataView.deleteItem(childObjectsInfo[index]["id"]);
          angularGrid.dataView.endUpdate();
          angularGrid.dataView.reSort();
        }
      }
    }
  }
  // Conditional Validation
  validationAlert(message, messageType, displayType, messageObject) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      title: message,
      buttonInfo: [
        {
          "name": "Cancel",
          "handler": () => {
            console.log("Cancel")
          }
        }
      ],
      parentContext: this,
      messageType: messageType,
      displayType: displayType
    };
    dialogConfig.autoFocus = false
    this.dialog.open(cs_conditionalvalidation_consolidate, dialogConfig);
  }

  validationConfirmation(message, messageType, displayType, messageObject) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      title: message,
      buttonInfo: [
        {
          "name": "Cancel",
          "handler": () => {
            console.log("Cancel");
          }
        },
        {
          "name": "Kindly confirm this value",
          "handler": () => {
            // Update Message Object JSON
            console.log("Confirm Value");
          }
        }
      ],
      messageType: messageType,
      displayType: displayType,
      parentContext: this
    };
    dialogConfig.autoFocus = false
    this.dialog.open(cs_conditionalvalidation_consolidate, dialogConfig);
  }
  validationToast(message, messageType, displayType) {
    const snackBarRef = this.snackBar.openFromComponent(cs_conditionalvalidation_toast, {
      duration: 5000,
      panelClass: [messageType],
      data: {
        message: message,
        parentContext: this,
        messageType: messageType,
        displayType: displayType,
      }
    });
    snackBarRef.afterDismissed().subscribe(() => {
      console.log("The snackbar is dismissed");
    });
  }
  showValidationMessage(validationResultObject, eventType, fieldName, actionId?) {
    if (validationResultObject["status"] === "Success") {
      const messageObject = validationResultObject["message"]
      const messageType = messageObject["messageType"]
      const validationPass = messageObject["validationPass"]
      const displayType = messageObject["displayType"]
      const validationMessage = messageObject['validationMessage']
      if (displayType === 'Alert') {
        this.validationAlert(validationMessage, messageType, displayType, messageObject)
      } else if (displayType === 'Confirmation') {
        this.validationConfirmation(validationMessage, messageType,
          displayType, messageObject)
      } else { // Toast
        this.validationToast(validationMessage, messageType, displayType)
      }
      return "Error"
    } else {
      return "No Error"
    }
  }

  checkRecordInitiatedOrNotFromListSection(dataObject, action) {
    let checkRecordNotInitiated: boolean = true
    let workFlowFields
    let workFlowMapping = {}
    let fieldId
    Object.keys(dataObject).forEach(element => {
      let data = dataObject[element]
      if (action === "Edit" && data && data['systemAttributes'] && data["systemAttributes"]["lockedDate"] && this.cspfmObjectConfiguration && this.cspfmMetaCouchDbProvider) {
        fieldId = data['systemAttributes']['fieldId']
        workFlowFields = this.cspfmObjectConfiguration['objectConfiguration'][data["type"]]["workflow"]
        Object.keys(workFlowFields).forEach(workFlowField => {
          if (workFlowFields[workFlowField]["fieldId"] === fieldId) {
            workFlowMapping[fieldId] = workFlowFields[workFlowField]["fieldLabel"]
          }
        })
        this.appUtilityConfig.fetchLockedUserDetail(data, workFlowMapping, this.cspfmMetaCouchDbProvider)
        checkRecordNotInitiated = false
      }
    })
    return checkRecordNotInitiated
  }

  assignDataInDataObject(data, relationalObjectInfo) {
    let dataObject = {}
    if (relationalObjectInfo['fieldType'] === "MASTERDETAIL") {
      if (data[relationalObjectInfo['relationalObjectId']] && data[relationalObjectInfo['relationalObjectId']].length > 0) {
        if (relationalObjectInfo['child'] === "" && data[relationalObjectInfo["relationalObjectId"]][0]['type']) {
          dataObject[data[relationalObjectInfo["relationalObjectId"]][0]['type']] = data[relationalObjectInfo["relationalObjectId"]][0]
        }else {
          return this.assignDataInDataObject(data[relationalObjectInfo["relationalObjectId"]][0], relationalObjectInfo["child"]);
        }
      }
    }else if (relationalObjectInfo['fieldType'] === "HEADER") {
      if (data[relationalObjectInfo['relationalObjectId']]) {
        if (relationalObjectInfo['child'] === "" && data[relationalObjectInfo['relationalObjectId']]['type']) {
          dataObject[data[relationalObjectInfo['relationalObjectId']]['type']] = data[relationalObjectInfo['relationalObjectId']]
        }
      }
    }
    return dataObject
  }

  makeColumnDefinition(columnInfo: Array<FieldInfo>, layoutId): Array<Column> {
    let columnDefinition = []
    columnInfo.forEach(mainFieldInfo => {
      columnDefinition.push(this.makeSingleColumn(mainFieldInfo, layoutId));
    });
    return columnDefinition;
  }
  makeSingleColumn(mainFieldInfo: FieldInfo, layoutId: string, childObjName: string = '', childObjectsInfo: Array<any> = [], formulaConfig?): Column {
    let column: Column;
    let fieldInfo = this.getFieldInfo(mainFieldInfo);
    if (!fieldInfo) {
      return;
    }
    if (mainFieldInfo["isHiddenEnabled"] === "Y") {
      return;
    }

    let editableColumnLabel=`
      <div>`;
    if(mainFieldInfo['isEditable']) {
      const requiredValidationArray = this.cspfmObjectConfiguration.objectConfiguration[childObjName]['requiredFieldsValidation']
      const uniqueValidationArray = this.cspfmObjectConfiguration.objectConfiguration[childObjName]['uniqueValidation']
 
      let isRequiredField = false
      let isUniqueField = false
      if(requiredValidationArray.length > 0) {
        const requiredFieldArray = requiredValidationArray.filter(element => {
          return element['fieldName'] === mainFieldInfo['fieldName']
        })
        if(requiredFieldArray.length > 0) {
          isRequiredField = true
        }
      }
      if(uniqueValidationArray.length > 0) {
        const uniqueFieldArray = uniqueValidationArray.filter(element => {
          return element['fieldName'] === mainFieldInfo['fieldName']
        })
        if(uniqueFieldArray.length > 0) {
          isUniqueField = true
        }
      }

      
      if(isRequiredField) {
        editableColumnLabel += '<span class="cs-mat-required" style="color: #F30000 !important; padding-right: 5px !important;">*</span>'
      }
      editableColumnLabel+=`${this.translateService.instant(mainFieldInfo.label)}` 
      
      if (mainFieldInfo['fieldType'] === 'FORMULA') {
        let displayFormula = ''
        if(formulaConfig && Object.keys(formulaConfig).length > 0) {
          const formulaFieldConfigObjArray = Object.keys(formulaConfig).filter(element => {
            return formulaConfig[element]['fieldName'] + appConstant.customFieldSuffix.formula === fieldInfo['fieldName']
          })
          if(formulaFieldConfigObjArray.length > 0) {
            displayFormula = formulaConfig[formulaFieldConfigObjArray[0]]['displayFormula']
          }
        }
        editableColumnLabel += `<span title="${displayFormula}"><em style="color: #4BA3DE;cursor: pointer;" class="icon-mat-formula"></em></span>`
      }

      if (isUniqueField) {
        editableColumnLabel += '<span title="Unique Field"><em style="cursor: pointer;" class="icon-mat-pin_drop"></em></span>'
      }

      editableColumnLabel+=`</div>`;
    }
    

    column = {
      id: mainFieldInfo.id,
      nameKey: fieldInfo.isEditable || mainFieldInfo.isEditable ? editableColumnLabel : mainFieldInfo.label,
      field: mainFieldInfo.prop,
      minWidth: 100,
      formatter: fieldInfo.fieldType == 'ACTION' ? CspfmActionsFormatter : fieldInfo.fieldType == 'URL' ? cspfmUrlDataFormatter : CspfmDataFormatter,
      params: {
        columnWidth: 100,
        pipe: this.cspfmDataDisplay,
        fieldInfo: mainFieldInfo,
        actionInfo: fieldInfo.fieldType === 'ACTION' ? mainFieldInfo['actionInfo'] : '',
        layoutId: layoutId,
        ...mainFieldInfo['additionalParams']
      },
      filterable: true,
      sortable: true,
      cssClass: 'left-align cs-slickgrid-inline-edit-pointer',


      onCellClick: (mouseEvent, args) => {
        const childObject = this.getChildObject(childObjName, childObjectsInfo)

        fieldInfo['fieldType'] === 'URL' ? this.cspfmRecordAssociationUtils.onActionCellClickForAssociation(mouseEvent, args, layoutId) : '';
      }
    }
    this.updateColumnBasedOnFieldType(column, fieldInfo, mainFieldInfo, layoutId, childObjName, childObjectsInfo);
    return column;
  }
  updateColumnBasedOnFieldType(column: Column, fieldInfo: FieldInfo, mainFieldInfo: FieldInfo, layoutId: string, childObjName: string = '', childObjectsInfo: Array<any> = []) {
    let stringFieldType = () => {
      column['type'] = FieldType.string
    }
    let booleanFieldType = () => {
      column['type'] = FieldType.boolean
    }
    let dateFieldType = () => {
      column['type'] = FieldType.date
    }
    let dateTimeFieldType = () => {
      column['type'] = FieldType.dateTime
    }
    let numberFieldType = () => {
      column['type'] = FieldType.number
    }
    let unknownFieldType = () => {
      column['type'] = FieldType.unknown
    }

    let textEditor = () => {
      if (mainFieldInfo['isEditable']) {
        column['editor'] = {
          model: Editors.text
        };
      }
    }
    let textAreaEditor = () => {
      if (mainFieldInfo['isEditable']) {
        column['editor'] = {
          model: Editors.longText
        };
      }
    }
    let booleanEditor = () => {
      if (mainFieldInfo['isEditable']) {
        column['editor'] = {
          // model: cspfmSwitchEditor, // Slikcgrid boolean field UI like toggle. Facing some issue. Once issue fixed, will enable this.
          model: Editors.checkbox,
          collection: [
            { value: true, label: 'True' },
            { valued: false, label: 'False' }
          ]
        };
      }
    }
    let singleSelectEditor = () => {
      if (mainFieldInfo['isEditable']) {
        column['editor'] = {
          model: Editors.singleSelect,
          collection: this.getKeyValue(mainFieldInfo['mappingDetails'] || {}),
          enableTranslateLabel: true,
          editorOptions: {
            noMatchesFound: "",
            onClose: () => {
              const childObject = this.getChildObject(childObjName, childObjectsInfo)
              if (childObject) {
                this.commitCurrentEdit(childObject['gridObj'])
              }
            }
          }
        };

        if (fieldInfo['dependentPickList']) {
          column['params']['dependentPickList'] = fieldInfo['dependentPickList']
        }
      }
    }
    let dateEditor = () => {
      if (mainFieldInfo['isEditable']) {
        column['editor'] = {
          model: cspfmDateEditor,
          editorOptions: this.flatPickerConfig.getDateEditorOptions({
            enableTime: false,
            listeners: [],
            onOkButtonClick: (instance) => {
              const childObject = this.getChildObject(childObjName, childObjectsInfo)
              if (childObject) {
                this.commitCurrentEdit(childObject['gridObj'])
              }
            }
          })
        };
      }
    }
    let multiSelectEditor = () => {
      if (mainFieldInfo['isEditable']) {
        column['editor'] = {
          model: Editors.multipleSelect,
          collection: this.getKeyValue(mainFieldInfo['mappingDetails'] || {}),
          enableTranslateLabel: true,
          editorOptions: {
            noMatchesFound: "",
            onClose: () => {
              const childObject = this.getChildObject(childObjName, childObjectsInfo)
              if (childObject) {
                this.commitCurrentEdit(childObject['gridObj'])
              }
            }
          }
        };
        if (fieldInfo['dependentPickList']) {
          column['params']['dependentPickList'] = fieldInfo['dependentPickList'];
          column['editor']['collectionOverride'] = (collectionInput: any[], args: CollectionOverrideArgs) => {
            console.log("collectionOverride ==> ", args);
            // return updatedCollection
            const dependentPickList = fieldInfo['dependentPickList'];
            // const parentDependentFieldInfo = this.tableColumnInfo[this.__employeedetail$tableName]['pfm352013_employeegrade_7842381']['dependentPickList']
            const fieldName = fieldInfo['fieldName']
            let columnIndex = args.grid.getColumnIndex(mainFieldInfo['parentFieldSlickgridColumn']);
            let columns = args.grid.getColumns()
            let parentDependentFieldColumn = columns[columnIndex];
            let parentDependentFieldName = parentDependentFieldColumn['params']['fieldInfo']['fieldName'];
            const parentDependentFieldPickList = parentDependentFieldColumn['params']['dependentPickList']
            if (parentDependentFieldPickList["pickListJson"] && args.dataContext[parentDependentFieldName] !== null && args.dataContext[parentDependentFieldName] !== undefined && args.dataContext[parentDependentFieldName] !== '') {
              args.grid['pickListValues'] = { [childObjName]: {} }
              this.appUtilityConfig.updateChildListForMultiLineEntry(parentDependentFieldPickList, args.dataContext[parentDependentFieldName], false, childObjName, 'employeedetail_DUMMY', this, fieldName, args.dataContext, args.grid)
              const pickListValue = args.grid['pickListValues'][childObjName][fieldName];
              if (pickListValue) {
                // updatedCollection = pickListValue
                // console.log("updatedCollection ==> ", updatedCollection);
                return pickListValue
              } else {
                const parentField = dependentPickList['parent'][0].toUpperCase()
                args.column.internalColumnEditor.editorOptions.noMatchesFound ="No records for codingskills for this " + "<span class='cs-picklist-parent'>"+parentField+"</span>";
                return []
              }
            } else {
              const parentField = dependentPickList['parent'][0].toUpperCase()
              args.column.internalColumnEditor.editorOptions.noMatchesFound =  " Select " + "<span class='cs-picklist-parent'>"+parentField+"</span>" + " first";
              return []
            }
          }
        }
      }
    }
     //SWF ML
   let statusWorkflowEditor = () => {
    let savefieldInfo = this.slickgridPopoverService.getFieldData({}, mainFieldInfo).fieldInfo;
    if (mainFieldInfo['isEditable'] && savefieldInfo['fieldType'] === 'STATUSWORKFLOW') {
      column['editor'] = null;
      column['params']['workflowSelected'] = (event) => {
        this.inLineStatusWorkflowChanged(event, childObjName, childObjectsInfo, layoutId)
      }
      column['onCellClick'] = (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
        let htmlElement: HTMLElement = document.getElementById('cs-dropdown-140320');
        if (htmlElement && htmlElement.innerHTML) {
            htmlElement.innerHTML = "";
        }
        let gridOptions = args['grid'].getOptions();
        let actionType = e['target']['attributes']['action-view']['value']
        let columnDef = args['columnDef'];
        columnDef['params']['actionType'] = actionType
        let fieldInfo = this.slickgridPopoverService.getFieldInfo(columnDef["params"]["fieldInfo"])
        let objectConfig = fieldInfo['statusWorkflow']['objectConfig']
        let objectId = fieldInfo['statusWorkflow']['objectId']
        let fieldName = fieldInfo['statusWorkflow']['fieldName']
        let inlineEditAvaiable = true;
        let fieldId = objectConfig[objectId]['workflow'][fieldName]['fieldId'];
        if ((actionType === 'workflowStatus' && !inlineEditAvaiable) ||
            (actionType === 'workflowStatus' && gridOptions && gridOptions['editable'] && gridOptions['editable'] === false)) {
            return
        }
        if (args['dataContext']['systemAttributes'] && args['dataContext']['systemAttributes']['fieldId'] !== fieldId) {
            const currentElement: any = e && e.target || undefined;
            const currentActionView = currentElement && currentElement.getAttribute('action-view') || undefined;
            if (currentActionView !== 'workflowHistory') {
                return
            }
        }
        var WfStatusMappingList = objectConfig[objectId]['workflow'][fieldName]['configJson']
        var dataOb = args['dataContext']
        if (dataOb[fieldName] && WfStatusMappingList && WfStatusMappingList[dataOb[fieldName]] &&
            WfStatusMappingList[dataOb[fieldName]].length > 0 && actionType && actionType === 'workflowStatus') {
            // if (WfStatusMappingList[dataOb[fieldName]] && WfStatusMappingList[dataOb[fieldName]].length == 1) {
            //     this.listServiceUtils.presentToast("Workflow process completed")
            //     return
            // }
        }
        if (actionType === 'workflowStatus') {
          const swfPopoverClassName = 'cs_status_workflow_popover';
          import(`../components/cs_status_workflow_popover/${swfPopoverClassName}.ts`).then(swfPopoverInstance => {
              if (swfPopoverInstance && swfPopoverInstance[swfPopoverClassName]) {
                  this.slickgridPopoverService.appendComponentToElement('cs-dropdown-' + layoutId, swfPopoverInstance[swfPopoverClassName], args, true);
              } else {
                  console.error('cspfmurlPopover component file is missing')
              }
          }).catch(error => {
              console.error('cspfmurlPopover component file is missing', error)
          })
        }
        if (actionType === 'workflowHistory') {
          const swfHistoryClassName = 'cs_status_workflow_history';
          import(`../components/cs_status_workflow_popover/${swfHistoryClassName}.ts`).then(swfHistoryInstance => {
              if (swfHistoryInstance && swfHistoryInstance[swfHistoryClassName]) {
                  this.slickgridPopoverService.appendComponentToElement('cs-dropdown-' + layoutId, swfHistoryInstance[swfHistoryClassName], args, true);
              } else {
                  console.error('cspfmurlPopover component file is missing')
              }
          }).catch(error => {
              console.error('cspfmurlPopover component file is missing', error)
          })
        }

      }
    }
  }
    let lookupEditor = () => {
      let savefieldInfo = this.slickgridPopoverService.getFieldData({}, mainFieldInfo).fieldInfo;
      let lookupFieldKey = savefieldInfo['fieldName'];
      if (mainFieldInfo['isEditable'] && savefieldInfo['fieldType'] === 'LOOKUP') {
        column['editor'] = null;
        column['params']['cspfmEditorType'] = 'LOOKUP';
        column['params']['lookupSelected'] = (event) => {
          this.inLineEditlookupSelected(event, childObjName, childObjectsInfo, layoutId)
        }
        column['onCellClick'] = (mouseEvent: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          if (args['columnDef']['params']['isAnyClickDone']) {
            return;
          }
          args['columnDef']['params']['isAnyClickDone'] = !args['columnDef']['params']['isAnyClickDone'];
          setTimeout(() => {
            args['columnDef']['params']['isAnyClickDone'] = !args['columnDef']['params']['isAnyClickDone'];
          }, 200)
          
          let parentElement = mouseEvent && mouseEvent.target && mouseEvent.target['parentElement'] || undefined;
          let lookupClickAction = parentElement && parentElement.getAttribute('lookup-click-action') || undefined;
          if (lookupClickAction && lookupClickAction === 'clear') {
              let event = {
                  'actionName': 'selection',
                  'columnName': lookupFieldKey,
                  'item': null,
                  'dataContext': args['dataContext'],
                  'columnDef': args['columnDef']
              }
              this.inLineEditlookupSelected(event, childObjName, childObjectsInfo, layoutId)
              return;
          }
          let gridOptions = args['grid'].getOptions();
          let columnDef = args['columnDef'];
          let cspfmSlickGridMode = args['grid']['cspfmSlickGridMode']
          if (gridOptions && gridOptions['editable'] && gridOptions['editable'] === true && (columnDef['params']['cspfmEditorType'] && cspfmSlickGridMode === 'Edit' || (args['grid']['cspfmEditableRecordIds'] && args['grid']['cspfmEditableRecordIds'].includes(args.dataContext['id'])))) {
            let saveData = this.slickgridPopoverService.getFieldData(args['dataContext'], columnDef['params']['fieldInfo']).data;
            if (saveData && Object.keys(saveData).length > 0) {
                
              let lookupProperties = JSON.parse(JSON.stringify(this.layoutCongifuration.layoutConfiguration[layoutId]['lookupFieldInfo'][lookupFieldKey]));
              const lookupColumns: Array<FieldInfo> = lookupProperties['lookupColumns']
              const lookupHierarchyJson = lookupProperties['lookupHierarchyJson']
              const argumentColumns = lookupProperties['argumentColumns']
              let advanceSearchConfigInfo = {}
              if (lookupProperties['isSearchFilterEnabled']) {
              advanceSearchConfigInfo['filterConfig'] = lookupProperties['filterConfig']
              advanceSearchConfigInfo['isSearchFilterEnabled'] = lookupProperties['isSearchFilterEnabled']
              advanceSearchConfigInfo['onLoadFetchEnabled'] = lookupProperties['onLoadFetchEnabled']
              advanceSearchConfigInfo['itemsPerPageConfigured'] = lookupProperties['itemsPerPageConfigured']
              advanceSearchConfigInfo['paginationConfigInfo'] = lookupProperties['paginationConfigInfo']
              }
              let criteriaInvolvedFields: Array<FieldInfo> = [];
              let inlineLookupConfig = {
                args: args,
                lookupTitle: lookupProperties['lookupFieldDisplayName'],
                lookupColumns: lookupColumns,
                lookupHierarchyJson: lookupHierarchyJson,
                advanceSearchConfigInfo: advanceSearchConfigInfo,
                criteriaInvolvedFields: criteriaInvolvedFields,
                lookupField: lookupFieldKey,
                criteriaQueryConfig: undefined,
                argumentColumns: argumentColumns

              }
              this.showInlineLookupEdit(inlineLookupConfig, this.slickgridPopoverService, this, appConstant.couchDBStaticName, layoutId, childObjName)
            } else {
              this.appUtilityConfig.showAlert(this, "Dependent relationship object not available. We are not able to allow this action")
            }

          }
        }
      }
    }
    let floatEditor = () => {
      if (mainFieldInfo['isEditable']) {
        column['editor'] = {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        };
      }
    }

    let selectionFilter = () => {
      column['filter'] = {
        collection: this.getLabelValue(fieldInfo.mappingDetails || {}),
        model: Filters.multipleSelect
      };
    }
    let booleanFilter = () => {
      column['filter'] = {
        collection: this.getLabelValue({ true: "true", false: "false" }),
        model: Filters.multipleSelect
      }
    }
    let dateFilter = () => {
      column['filter'] = {
        model: Filters.compoundDate,
        operator: OperatorType.rangeInclusive
      }
    }

    let defaultFilter = () => {
      column['filter'] = {
        model: Filters.compoundInput
      }
    }

    let queryParams = () => {
      column['queryParams'] = mainFieldInfo.prop + appConstant['customFieldSuffix']['slickgrid']
    }
    switch (fieldInfo.fieldType) {
      case "TEXT":
        stringFieldType();
        defaultFilter();
        textEditor();
        break;
      case "EMAIL":
        stringFieldType();
        defaultFilter();
        textEditor();
        break;
      case "FORMULA":
        stringFieldType();
        break;
      case "ROLLUPSUMMARY":
        stringFieldType();
        break;
      case "LOOKUP":
        stringFieldType();
        break;
      case "BOOLEAN":
        booleanFieldType();
        booleanEditor();
        booleanFilter();
        break;
      case "TEXTAREA":
        stringFieldType();
        textAreaEditor();
        defaultFilter();
        break;
      case "DECIMAL":
        numberFieldType();
        defaultFilter();
        floatEditor()
        break;
      case "NUMBER":
        numberFieldType();
        defaultFilter();
        floatEditor()
        break;
      case "CURRENCY":
        numberFieldType();
        defaultFilter();
        floatEditor()
        break;
      case 'CHECKBOX':
        stringFieldType();
        selectionFilter();
        multiSelectEditor()
        break;
      case 'RADIO':
        stringFieldType();
        selectionFilter();
        singleSelectEditor()
        queryParams();
        break;
      case 'MULTISELECT':
        stringFieldType();
        selectionFilter();
        multiSelectEditor()
        queryParams();
        break;
      case 'DROPDOWN':
        stringFieldType();
        selectionFilter();
        singleSelectEditor()
        queryParams();
        break;
      case 'DATE':
        dateFieldType();
        dateFilter();
        queryParams();
        dateEditor();
        break;
      case 'TIMESTAMP':
        dateTimeFieldType();
        dateFilter();
        queryParams();
        dateEditor();
        break;
      case 'ACTION':
        unknownFieldType()
        break;
      default:
        stringFieldType();
        defaultFilter();
        break;
    }

    if (mainFieldInfo['isEditable']) {
      column['params']['editable'] = true;
    }
    column['onCellChange'] = (event: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
      let listenerName = 'angular_slickgrid_cell_change_' + layoutId + '_' + childObjName;
      this.observableListenerUtils.emit(listenerName, { layoutId, childObjName, event, args })
    }
    lookupEditor()
    //SWF ML
    statusWorkflowEditor()
  }

  
  getFieldInfo(fieldInfo: FieldInfo | ''): FieldInfo | '' {
    if (fieldInfo["fieldType"] === "LOOKUP" ||
      fieldInfo["fieldType"] === "MASTERDETAIL" ||
      fieldInfo["fieldType"] === "HEADER") {
      return this.getFieldInfo(fieldInfo["child"]);
    } else {
      return fieldInfo;
    }
  }

  getSelectedRows(angularGrid): Array<any> {
    if (!angularGrid) {
      return []
    }
    let allData = angularGrid.dataView.getItems();
    let selectedRowDataContextIds = angularGrid.gridStateService.selectedRowDataContextIds;
    return lodash.filter(allData, (item) => {
       selectedRowDataContextIds.includes(item['id'])
    })
  }

  getDataByIds(angularGrid: AngularGridInstance, ids: Array<string>): Array<any> {
    if (!angularGrid) {
      return []
    }
    let allData = angularGrid.dataView.getItems();
    return lodash.filter(allData, (item) => {
       ids.includes(item['id'])
    })
  }

  getCustomSelectedRows(angularGrid: AngularGridInstance) {
    if (!angularGrid) {
      return [];
    }
    if (angularGrid['slickGrid']['cspfm_selection_status'] && angularGrid['slickGrid']['cspfm_selection_status']['checked']) {
      return this.getDataByIds(angularGrid, angularGrid['slickGrid']['cspfm_selection_status']['checked']);
    } else {
      return [];
    }
  }

  getCustomSelectedIds(angularGrid: AngularGridInstance) {
    if (!angularGrid) {
      return [];
    }
    if (angularGrid['slickGrid']['cspfm_selection_status'] && angularGrid['slickGrid']['cspfm_selection_status']['checked']) {
      return angularGrid['slickGrid']['cspfm_selection_status']['checked'];
    } else {
      return [];
    }
  }
  getCustomSelectedIdsFromSlickGrid(slickGrid) {
    if (!slickGrid) {
      return [];
    }
    if (slickGrid['cspfm_selection_status'] && slickGrid['cspfm_selection_status']['checked']) {
      return slickGrid['cspfm_selection_status']['checked'];
    } else {
      return [];
    }
  }

  getGridFilteredData(angularGrid: AngularGridInstance) {
    if (angularGrid) {
      return angularGrid.dataView.getFilteredItems();
    } else {
      return []
    }
  }
  getGridPaginatedData(angularGrid: AngularGridInstance) {
    if (angularGrid) {
      let paginatedData = []
      const lineCount = angularGrid.dataView.getLength();
      for (let rowNumber = 0; rowNumber < lineCount; rowNumber++) {
        const data = angularGrid.dataView.getItem(rowNumber);
        paginatedData.push(data)
      }
      return paginatedData;
    } else {
      return []
    }
  }
  getGridPaginatedDataFromDataView(dataView) {
    if (dataView) {
      let paginatedData = []
      const lineCount = dataView.getLength();
      for (let rowNumber = 0; rowNumber < lineCount; rowNumber++) {
        const data = dataView.getItem(rowNumber);
        paginatedData.push(data)
      }
      return paginatedData;
    } else {
      return []
    }
  }
  getGridFilteredDataFromDataView(dataView) {
    if (dataView) {
      return dataView.getFilteredItems();
    } else {
      return []
    }
  }

  getFilteredDataCustomSelectedIds(angularGrid: AngularGridInstance) {
    if (angularGrid) {
      let filteredData = this.getGridFilteredData(angularGrid)
      let ids = lodash.map(filteredData, 'id')
      return lodash.intersection(this.getCustomSelectedIds(angularGrid), ids);
    } else {
      return []
    }
  }
  getPaginatedDataCustomSelectedIds(angularGrid: AngularGridInstance) {
    if (angularGrid) {
      let paginatedData = this.getGridPaginatedData(angularGrid)
      let ids = lodash.map(paginatedData, 'id')
      return lodash.intersection(this.getCustomSelectedIds(angularGrid), ids);
    } else {
      return []
    }
  }
  getFilteredDataCustomSelectedIdsFromSlickGrid(slickGrid, dataView) {
    if (slickGrid && dataView) {
      let filteredData = this.getGridFilteredDataFromDataView(dataView)
      let ids = lodash.map(filteredData, 'id')
      return lodash.intersection(this.getCustomSelectedIdsFromSlickGrid(slickGrid), ids);
    } else {
      return []
    }
  }
  getPaginatedDataCustomSelectedIdsFromSlickGrid(slickGrid, dataView) {
    if (slickGrid && dataView) {
      let paginatedData = this.getGridPaginatedDataFromDataView(dataView)
      let ids = lodash.map(paginatedData, 'id')
      return lodash.intersection(this.getCustomSelectedIdsFromSlickGrid(slickGrid), ids);
    } else {
      return []
    }
  }

  upsertModifiedData(angularGrid: AngularGridInstance, data: Array<any>, columns: Array<Column>) {
    data = data.filter(e => e !== undefined);
    data = this.customFieldProvider.makeSlickGridCustomFields(data, columns)
    if (angularGrid && data && data.length > 0) {
      angularGrid.dataView.beginUpdate();
      data.forEach(element => {
        var value = angularGrid.dataView.getItemById(element['id'])
        if (value) {
          angularGrid.dataView.updateItem(element['id'], element);
        } else {
          angularGrid.dataView.addItem(element);
        }
      });
      angularGrid.dataView.endUpdate();
      angularGrid.dataView.reSort();
      this.resizeColumnsByCellContent(angularGrid)
    }
  }
  onHoverCellAction(isHidden:boolean,data,gridObject,layoutName){
    var childElements = document.getElementById('url-data-formatter').getElementsByTagName('*');
    for (var index = 0; index < (childElements as any).length; index++) {
        var chipId = 'ACT_' + layoutName + '$$' + data.params.fieldInfo.traversalpath + '_edit_';
        var chip_EditID = document.getElementById("ACT_" + layoutName + "$$" + data.params.fieldInfo.traversalpath + "_edit_" + gridObject.row + "_" + gridObject.cell + "_" + gridObject.index);
        var chip_deleteId = document.getElementById("ACT_" + layoutName + "$$" + data.params.fieldInfo.traversalpath + "_delete_" + gridObject.row + "_" + gridObject.cell + "_" + gridObject.index);
        if ((childElements[index]).id.startsWith(chipId)) {
            if (chip_EditID) {
                chip_EditID.hidden = isHidden;
                chip_deleteId.hidden = isHidden;
            }
        }
    }
    if (!$(`.${'cs-url-popover-head'}`).is(":visible")) {
        document.getElementById('ACT_' +  layoutName + '$$' + data.params.fieldInfo.traversalpath + '_add_' + gridObject.row).hidden = isHidden;
    }
  }
  refreshSlickgridFormatter(angularGrid, columnDefinition) {
    /* to refresh the formatter */
    const allColumns = angularGrid.gridService.getAllColumnDefinitions();
    (Object.keys(columnDefinition)).forEach((objectId: any) => {
      let columnDefinitions = isNaN(objectId) ? columnDefinition[objectId] : columnDefinition;
      if (columnDefinitions[0]['id'] !== allColumns[0]['id'] && allColumns[0]['id'] === "_checkbox_selector") {
        columnDefinitions.unshift(allColumns[0])
      }
      if (isNaN(objectId)) {
        columnDefinition[objectId] = [...columnDefinition[objectId]];
      } else{
        columnDefinitions = [...columnDefinitions];
      }
    });
  }
  draggableGroupingExtension(angularGrid: AngularGridInstance, gridOptions: GridOption) {
    const draggableExtensionService = angularGrid.extensionService['draggableGroupingExtension']
    let customDraggableGroupingInstance = new cspfmSlickDraggableGrouping(draggableExtensionService.extensionUtility, draggableExtensionService.sharedService)
    let customDraggableGroupingPlugin = customDraggableGroupingInstance.create(gridOptions)
    customDraggableGroupingInstance['_addon'] = customDraggableGroupingPlugin;
    customDraggableGroupingInstance.register();
}
  clearDataView(angularGrid: AngularGridInstance) {
    let dataView: SlickDataView = angularGrid.dataView;
    dataView.beginUpdate();
    dataView.setItems([]);
    dataView.getItems().length = 0;
    dataView.endUpdate();
  }

  subscribeChildLazyLoading(layoutId: string, columns: {
    [objectName: string]: Array<Column>
  }, childObjects: Array<string>, sectionObjectDetails: {
    [objectName: string]: SectionObjectDetail
  }, childObjectsInfo: Array<{
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
  }>): { [childObject: string]: string } {
    let listenerName: { [childObject: string]: string } = {}
    childObjects.forEach(childObjectName => {
      let sectionalObject: SectionObjectDetail = sectionObjectDetails[childObjectName]
         let getAngularGrid = () => {
        let childObject = this.getChildObject(childObjectName, childObjectsInfo);
        return childObject['angularGridInstance'];
      }
      listenerName[childObjectName] = this.subscribeLazyLoading(sectionalObject['dataFetchMode'], layoutId + '_' + childObjectName, getAngularGrid, columns[childObjectName])
    })
    console.log("listenerName", listenerName)
    return listenerName;
  }

  subscribeLazyLoading(dataFetchMode: 'Full' | 'Batch' | 'OnClickBatch', layoutId: string, getAngularGrid: () => AngularGridInstance, columns: Array<Column>): string {
    this.observableListenerUtils.remove(layoutId + '_', '*a');
    let listenerName = layoutId + '_' + this.observableListenerUtils.getUUID()
    this.observableListenerUtils.subscribe(listenerName, (emittedData) => {
      let angularGrid: AngularGridInstance = getAngularGrid()
      let dataView: SlickDataView = angularGrid['dataView'];
      let slickgrid: SlickGrid = angularGrid['slickGrid'];
      if (emittedData['status'] === 'started') {
        slickgrid['isDataFetching'] = true;
        slickgrid['isFirstBatch'] = true;
        let resetDataRequired = true;
        if (dataView.getItems().length > 0 && dataFetchMode === 'OnClickBatch') {
          resetDataRequired = false
        }
        this.updateSlickGridDataView(dataView, emittedData['data'], resetDataRequired);
      } else {
        if (slickgrid['isFirstBatch'] || dataFetchMode === 'OnClickBatch') {
          dataView.beginUpdate();
          dataView.setItems([]);
          dataView.getItems().length = 0;
          dataView.endUpdate();
          slickgrid['isFirstBatch'] = false;
        }
        if (dataFetchMode !== 'Full' || (dataFetchMode === 'Full' && emittedData['status'] === 'finished' && emittedData['data'].length > 0)) {
          this.upsertModifiedData(angularGrid, emittedData['data'], columns)
        }
      }
    })
    return listenerName;
  }

  updateSlickGridDataView(dataView: SlickDataView, data: Array<any>, resetDataRequired: boolean = false) {
    dataView.beginUpdate();
    if (resetDataRequired) {
      dataView.setItems([]);
      dataView.getItems().length = 0;
    }
    data.forEach((element) => {
      var value = dataView.getItemById(element['id']);
      if (value) {
        dataView.updateItem(element['id'], element);
      } else {
        dataView.addItem(element);
      }
    });
    dataView.endUpdate();
  }

  removeObservableListener(listenerName: string) {
    this.observableListenerUtils.remove(listenerName, '==');
  }
  // function used to convert the (<>"&") in the string to its coresponding entities and vice-versa
  convertSplCharToEntities(inputString:string,convertToEntities:"toEntity"|"fromEntity"):string{
    const  format = /[&\[\]'"\\<>\/]+/;
    let modifiedString = inputString
    if(inputString && format.test(inputString.toString())){
      if(convertToEntities==='toEntity'){
        modifiedString = modifiedString.toString().
        replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/"/g, '&quot;');
       }else if (convertToEntities === 'fromEntity'){
        modifiedString = modifiedString.toString().
        replace(/&amp;/g, '&').
        replace(/&lt;/g, '<').
        replace(/&gt;/g, '>').
        replace(/&quot;/g, '"');
       }
      }
     return modifiedString;
    }
    flatpickerAddRemove(layoutId: string, AddRemoveFlatpickr: 'set' | 'remove') {
      if (AddRemoveFlatpickr && AddRemoveFlatpickr === 'set') {
        const flatpickrElements: any = $('.flatpickr-calendar:not([flatpickrLayoutId])');
        for (const el of flatpickrElements) {
            el.setAttribute('flatpickrLayoutId', layoutId);
        }
      } else {
        $(`[flatpickrLayoutId="${layoutId}"]`).remove()
      }
    }


    // content resize
  getSlickgridData(datasets, isGroupingEnabled){
    if(isGroupingEnabled){
        let tempGroupedData = [];
        datasets.forEach((data, _groupidx )=>{
          if(data['rows']){
            data['rows'].forEach((_eachgroupedrow, idx )=>{
              tempGroupedData.push(data['rows'][idx])
            })
          } else{
            tempGroupedData.push(data)
          }
        })
        return tempGroupedData
    } else{
      return datasets
    }
  
  }
  
  resizeColumnsByCellContent(angularGrid: AngularGridInstance) {
    if(angularGrid['slickGrid']['isAutoFitEnable']){
      let totalColumnWidth = 0
    let slickgridWidth = window.innerWidth - 42
    const columnDefinitions = angularGrid.slickGrid.getColumns()
  
    const datasets = this.getGridPaginatedData(angularGrid)
    const slickgridData = this.getSlickgridData(datasets, angularGrid['slickGrid']['isGroupingEnabled'] )
    
    if(slickgridData.length > 0){
    columnDefinitions.forEach(columnDefinition => {
      if( (columnDefinition['params'] ) && (columnDefinition['params']['fieldInfo'] ) && (columnDefinition['params']['fieldInfo']['fieldType'] !== 'PASSWORD' || columnDefinition['params']['fieldInfo']['fieldType'] !== 'RICHTEXT')||(columnDefinition['params']['actioninfo'])){
          columnDefinition['width'] = 0
        }
        let titleWidth = 32;//slickgrid column resize arrow is 32px
        if(columnDefinition && columnDefinition['nameKey']){
          
          let title = (columnDefinition['nameKey'].includes('.')) ? this.translateService.instant(columnDefinition['nameKey']) : columnDefinition['nameKey']
            titleWidth += this.getWidthInPixelTitle(title)
            columnDefinition['titlewidth'] = titleWidth
        }else{
          columnDefinition['width'] 
        }
    })
    
    for (const [rowIdx, item] of slickgridData.entries()) {
      columnDefinitions.forEach((columnDef, colIdx) => {
        if( (columnDef['params'] ) && (columnDef['params']['fieldInfo']) ){
          let fieldInfo = this.getFieldTypeInfo(columnDef['params']['fieldInfo'])    
          if( fieldInfo['fieldType'] === 'TEXT'|| fieldInfo['fieldType'] === 'TEXTAREA'||  fieldInfo['fieldType'] === 'AUTONUMBER'||
            fieldInfo['fieldType'] === 'MULTISELECT'|| fieldInfo['fieldType'] === 'CURRENCY'|| fieldInfo['fieldType'] === 'RADIO'|| fieldInfo['fieldType'] === 'BOOLEAN'||
            fieldInfo['fieldType'] === 'FORMULA'||fieldInfo['fieldType'] === 'TIMESTAMP'|| fieldInfo['fieldType'] === 'DATE'|| fieldInfo['fieldType'] ==='DROPDOWN'|| fieldInfo['fieldType'] ==='LOOKUP'||
            fieldInfo['fieldType'] === 'EMAIL'|| fieldInfo['fieldType'] === 'NUMBER'||fieldInfo['fieldType'] === 'DECIMAL'||fieldInfo['fieldType'] === 'ROLLUPSUMMARY'||
            fieldInfo['fieldType'] === 'RECORDASSOCIATION'|| fieldInfo['fieldType'] === 'MASTERDETAIL'|| fieldInfo['fieldType'] === 'HEADER'|| fieldInfo['fieldType'] ==='CHECKBOX'|| fieldInfo['fieldType'] === 'URL' || fieldInfo['fieldType'] === 'PASSWORD' || fieldInfo['fieldType'] === 'STATUSWORKFLOW'){ 
                const formattedData = parseFormatterWhenExist(columnDef?.formatter, rowIdx, colIdx, columnDef, item, angularGrid);
                const formattedDataSanitized = sanitizeHtmlToText(formattedData);
                let formattedTextWidthInPx = this.getWidthInPixel(formattedDataSanitized) 
                formattedTextWidthInPx = this.setColumnWidth(columnDef, fieldInfo,formattedTextWidthInPx)
                if( fieldInfo['actionInfo'] ){
                  fieldInfo['actionInfo'].forEach((actionInfo) => {
                    if( actionInfo['actionDisplayType']  === "Icon"){
                     formattedTextWidthInPx+= 35
                    }else{
                     formattedTextWidthInPx+= 0 
                    }
                   })
                  if(fieldInfo['fieldType'] === 'RECORDASSOCIATION'){
                    fieldInfo['actionInfo'].forEach((actionInfo) => {
                      if( actionInfo['actionDisplayType']  === "" || actionInfo['actionDisplayType'] === "Button"){
                        formattedTextWidthInPx+= 32
                       }else if(actionInfo['actionDisplayType']  === "IconandButton"){
                        formattedTextWidthInPx+= 50 
                       }else if( actionInfo['actionDisplayType'] === "Icon"){
                        formattedTextWidthInPx+= 19 
                       }else{
                        formattedTextWidthInPx+= 0
                       }
                    })
                  }
                }
                columnDef['width'] =  columnDef['width'] > formattedTextWidthInPx ? columnDef['width'] : formattedTextWidthInPx;
                columnDefinitions[colIdx]['width']= (columnDef['width'] > columnDef['titlewidth']) ? ((columnDef['width'] > 350)? 350 : columnDef['width']) : ((columnDef['titlewidth'] > 250) ? 250 : columnDef['titlewidth'])
              }
        }else if((columnDef['params'] ) && ((columnDef['params']['actionInfo']) )){
          const formattedData = parseFormatterWhenExist(columnDef?.formatter, rowIdx, colIdx, columnDef, item, angularGrid);
          let formattedDataSanitized: any = sanitizeHtmlToText(formattedData);
          if(formattedDataSanitized.includes("No Assignment0000")){          
            formattedDataSanitized =  formattedDataSanitized.replaceAll('No Assignment0000','');
          }
          let formattedTextWidthInPx = this.getWidthInPixel(formattedDataSanitized)
          let columnDefWidth = 0;
          Object.keys(columnDef['params']['actionInfo']).forEach((index) => {
            (columnDef['params']['actionInfo'][index]['actionDisplayType'] == "Icon")?columnDefWidth+= 23 :(columnDef['params']['actionInfo'][index]['actionDisplayType'] == "IconandButton" )? columnDefWidth+= 51 :(columnDef['params']['actionInfo'][index]['actionDisplayType'] == "Button") ? columnDefWidth+= 32 : columnDefWidth+= 0; 
          });
          columnDefWidth += formattedTextWidthInPx;
          columnDefinitions[colIdx]['width']= (columnDefWidth > columnDef['titlewidth']) ? ((columnDefWidth > 350)? 350 : columnDefWidth) : ((columnDef['titlewidth'] > 250) ? 250 : columnDef['titlewidth'])
        }else {
          console.log("type3",columnDef['params'],columnDef)
        }
      });
    }
    columnDefinitions.forEach(columns => {
      totalColumnWidth += columns['width']
    })
    if (totalColumnWidth < slickgridWidth) {
      let columnWidthAverage = (  slickgridWidth - totalColumnWidth)/ columnDefinitions.length
      columnDefinitions.forEach(columns => {
      columns['width'] = columns['width'] + columnWidthAverage
      })
    }
    angularGrid.slickGrid.setColumns(columnDefinitions);
    }
    }
    
  }
  
  setColumnWidth(columnDef, fieldInfo, formattedTextWidthPixel){
    if(fieldInfo['fieldType'] ==='STATUSWORKFLOW' ){
      return formattedTextWidthPixel += 58
    }else if(fieldInfo['fieldType'] === 'URL'){ 
      fieldInfo['isMultiUrlField'] === true ?((columnDef['params']['isInlineEditable'] === true ) ? formattedTextWidthPixel += 64  : formattedTextWidthPixel += 32) : ( formattedTextWidthPixel +=32) 
      return formattedTextWidthPixel  
    }else{
      return formattedTextWidthPixel
    }
  }
  
  getFieldTypeInfo(columnDefparam){
   if(columnDefparam['child']=== ""){
      return columnDefparam
   }else{
    return this.getFieldTypeInfo(columnDefparam['child'])
    }
  }


  getWidthInPixel(formattedData) {
    let characterWidthMapping = {
      'A': 8.73,
      'B': 7.69,
      'C': 7.64,
      'D': 8.69,
      'E': 7.97,
      'F': 7.97,
      'G': 8.11,
      'H': 8.53,
      'I': 3.45,
      'J': 6.73,
      'K': 7.73,
      'L': 6.5,
      'M': 11.52,
      'N': 9.53,
      'O': 9.08,
      'P': 7.77,
      'Q': 8.3,
      'R': 7.95,
      'S': 7.55,
      'T': 6.95,
      'U': 8.44,
      'V': 7.73,
      'W': 11.63,
      'X': 7.63,
      'Y': 7.45,
      'Z': 7.13,
      'a': 6.53,
      'b': 6.8,
      'c': 6.31,
      'd': 7.8,
      'e': 6.36,
      'f': 4.22,
      'g': 7.8,
      'h': 6.8,
      'i': 3.13,
      'j': 4.16,
      'k': 6.28,
      'l': 3.16,
      'm': 10.44,
      'n': 7.8,
      'o': 6.8,
      'p': 6.8,
      'q': 6.8,
      'r': 4.16,
      's': 5.25,
      't': 5.17,
      'u': 6.8,
      'v': 6.09,
      'w': 10.19,
      'x': 6.09,
      'y': 6.09,
      'z': 6.09,
      '0': 7.2,
      '1': 7.2,
      '2': 7.2,
      '3': 7.2,
      '4': 7.2,
      '5': 7.2,
      '6': 7.2,
      '7': 7.2,
      '8': 7.2,
      '9': 7.2,
      ' ': 4.00
    }
    let characterArray = formattedData.split("") 
    let width = 0
    characterArray.forEach(e => {
        width += characterWidthMapping[e] || 10
    })
    return width
  } // content resize

getWidthInPixelTitle(title){
  let characterWidthMappingForTitle = {
    'A':11,
    'B':9 ,
    'C':9,
    'D':9.19,
    'E':9,
    'F':9,
    'G':9.36,
    'H':9,
    'I':4.11,
    'J':8,
    'K':10,
    'L':8,
    'M':12.22,
    'N':10,
    'O':10,
    'P':9.13,
    'Q':10,
    'R':10,
    'S':9,
    'T':10,
    'U':10,
    'V':11,
    'W':14,
    'X':11,
    'Y':11,
    'Z':9,
    'a':8,
    'b':8,
    'c':8,
    'd':8,
    'e':8,
    'f':7,
    'g':8,
    'h':8,
    'i':4,
    'j':5,
    'k':8,
    'l':4,
    'm':12.13,
    'n':8,
    'o':8,
    'p':8,
    'q':8,
    'r':6,
    's':7.22,
    't':6,
    'u':8,
    'v':9,
    'w':12,
    'x':9,
    'y':9,
    'z':7.16,
    '0':8.09,
    '1':8.09,
    '2':8.09,
    '3':8.09,
    '4':8.09,
    '5':8.09,
    '6':8.09,
    '7':8.09,
    '8':8.09,
    '9':8.09,
    ' ':8.05

  }
  let characterArray = title.split("") 
  let width = 0
  characterArray.forEach(e => {
      width += characterWidthMappingForTitle[e] || 10
  })
  return width
}//content size for title
  getColumnProps(columns: Array<Column>) {
    let columnsById = {};
    if (columns && columns.length > 0) {
      columns.forEach((column, index) => {
        columnsById[column.id] = {
          'index': index,
          'editable': column['params']['editable']
        };// maintain index & editor config for getting lookup fields easily
      })
    }
    return columnsById;
  }
  public workflowCommentsInfo = {};
  inLineStatusWorkflowChanged(event, childObjName, childObjectsInfo, layoutId){
    console.log(event);
    if(event['actionName'] === "confirm"){
      let dataContext = event['selectedObject']
      let columnDef: Column = event['columnDef']
      this.workflowCommentsInfo[dataContext['id']+'$$'+columnDef['field']] = event['comments'];
      // this.slickGridChangeCallback(childObjectName, { dataContext, columnDef })
      let listenerName = 'angular_slickgrid_cell_change_' + layoutId + '_' + childObjName;
      this.observableListenerUtils.emit(listenerName, { layoutId, childObjName, event, args:{ dataContext, columnDef } })
      let childObject = this.getChildObject(childObjName, childObjectsInfo);
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
      let saveData = this.slickgridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).data;
      let savefieldInfo = this.slickgridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).fieldInfo;
      const recordId = saveData.type + '_2_' + saveData.id
      let tempItem = JSON.parse(JSON.stringify(dataContext));
      tempItem[savefieldInfo["fieldName"]] = event['selectedValue'];
      angularGridInstance.gridService.upsertItems(tempItem, {
        highlightRow: false
      })
    }
  
  }
 inLineEditlookupSelected(event, childObjName,childObjectsInfo, layoutId) {
   if (event['actionName'] === "selection") {
     let dataContext = event['dataContext']
     let columnDef: Column = event['columnDef']
     // this.slickGridChangeCallback(childObjectName, { dataContext, columnDef })
     let listenerName = 'angular_slickgrid_cell_change_' + layoutId + '_' + childObjName;
     this.observableListenerUtils.emit(listenerName, { layoutId, childObjName, event, args:{ dataContext, columnDef } })

     let childObject = this.getChildObject(childObjName, childObjectsInfo);
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
     let saveData = this.slickgridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).data;
     let savefieldInfo = this.slickgridPopoverService.getFieldData(dataContext, columnDef['params']['fieldInfo']).fieldInfo;
     const recordId = saveData.type + '_2_' + saveData.id
     let tempItem = JSON.parse(JSON.stringify(dataContext));
     tempItem[savefieldInfo["fieldName"]] = event['item'];
     angularGridInstance.gridService.upsertItems(tempItem, {
       highlightRow: false
     })
     // DB Save commented for development purpose. Need to handle the flow for multi line entry feature
     // this.slickgridUtils.fetchEditedRecord(this.dataSource, gridInstance, recordId, savefieldInfo, event['item'], dataContext)
   }
 }
}

