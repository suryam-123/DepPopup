import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FieldType, Column, GridOption } from 'angular-slickgrid';
import { cspfm_data_display, FieldInfo } from '../pipes/cspfm_data_display';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { cspfmAlertDialog } from '../components/cspfmAlertDialog/cspfmAlertDialog';
import { dataProvider } from '../utils/dataProvider';
import { SlickgridPopoverService } from '../services/slickgridPopover.service';
import { appUtility } from '../utils/appUtility';

export type MatrixConfig = {
  matrixActionElementId?: string
  matrixIcon?: string;
  listIcon?: string;
  columnTitle: FieldInfo;
  rowValues: Array<FieldInfo>;
  selectionLimit: number;
  displayInfo: {
    currentMode: 'list' | 'matrix';
    gridOptions: GridOption;
    columns: Array<Column>;
    dataset: Array<any>;
    isLoading?: boolean;
  };
  objectHierarchy: any;
};
@Injectable({
  providedIn: 'root'
})
export class cspfmSlickgridMatrixService {

  private columnMinWidth = 150;
  constructor(private translateService: TranslateService, private cspfmDataDisplay: cspfm_data_display, public matDialog: MatDialog,private appUtilityConfig:appUtility,
    private dataProviderObject: dataProvider, private slickgridPopoverService: SlickgridPopoverService) { }


  makeColumns(data: Array<any>, matrixConfig: MatrixConfig, dataSource: string) {
    matrixConfig.displayInfo.columns = [];
    matrixConfig.displayInfo.dataset = [];
    if (!data) {
      throw new Error('Not getting valid data');
    } else if (data.length < 2) {
      this.appUtilityConfig.showAlert(this,'You should select atleast two record for comparision');
      return;
    } else if (data.length > matrixConfig.selectionLimit) {
      this.appUtilityConfig.showAlert(this,'Record comparision limit exceeded. Selected record should not exceed ' + matrixConfig.selectionLimit);
      return;
    }
    if (matrixConfig.objectHierarchy) {
      if (matrixConfig['displayInfo']['isLoading']) {
        this.appUtilityConfig.showAlert(this,'Already data process initiated. Please wait.');
        return
      }
      const queryParams = {
        objectHierarchyJSON: matrixConfig.objectHierarchy,
        dataSource: dataSource,
        additionalInfo: {
          'id': data.map(dataItem => {
            return dataItem['id']
          })
        }
      }
      matrixConfig.displayInfo.isLoading = true;
      this.dataProviderObject.queryBulkDoc(queryParams).then(response => {
        matrixConfig.displayInfo.isLoading = false;
        if (response["status"] !== "SUCCESS") {
          throw new Error('Not getting valid data');
        } else {
          this.createMatrixColumns(response['records'], matrixConfig)
        }
      })
    } else {
      this.createMatrixColumns(data, matrixConfig)
    }
  }

  
  private createMatrixColumns(data: Array<any>, matrixConfig: MatrixConfig) {
    if (!data) {
      throw new Error('Not getting valid data');
    } else if (data.length < 2) {
      this.appUtilityConfig.showAlert(this,'You should select atleast two record for comparision');
      return;
    } else if (data.length > matrixConfig.selectionLimit) {
      this.appUtilityConfig.showAlert(this,'Record comparision limit exceeded. Selected record should not exceed ' + matrixConfig.selectionLimit);
      return;
    }
    matrixConfig['displayInfo']['currentMode'] = 'matrix';
    matrixConfig.displayInfo.columns.push({
      'id': 'matrix_field_name',
      'nameKey': '',
      'type': FieldType.string,
      'field': 'field_name',
      minWidth: this.columnMinWidth,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true
    });

    data.forEach((record, recordIndex) => {
      matrixConfig.displayInfo.columns.push({
        'id': 'matrix_field_value' + recordIndex,
        'nameKey': String(this.cspfmDataDisplay.transform(record, matrixConfig.columnTitle)),
        'type': FieldType.string,
        'field': recordIndex + '',
        minWidth: this.columnMinWidth,
        excludeFromHeaderMenu: true
      })

      matrixConfig.rowValues.forEach((key, keyIndex) => {
        if (recordIndex === 0) {
          let dataset = {
            'field_name': this.translateService.instant(key['label']),
            'id': keyIndex
          }
          matrixConfig.displayInfo.dataset.push(dataset);
        }
        let value = this.cspfmDataDisplay.transform(record, key);
        if (this.slickgridPopoverService.getFieldType(key) === "URL") {
          value = (value.url || '').replace(/,/g, ", ");
        }
        matrixConfig.displayInfo.dataset[keyIndex][recordIndex] = value;
      })
    });

    matrixConfig.displayInfo.columns = [...matrixConfig.displayInfo.columns]
    matrixConfig.displayInfo.dataset = [...matrixConfig.displayInfo.dataset]
  }

  getMatrixGridOptions(gridContainerId: string, objectName: string): GridOption {
    return {
      rowHeight: 40,
      enableGridMenu: true,
      enableColumnReorder: true,
      enableAutoResize: true,
      i18n: this.translateService,
      gridMenu: {
        hideExportExcelCommand: true,
        hideExportCsvCommand: true,
        hideForceFitButton: true,
        useClickToRepositionMenu: false
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
        containerId: gridContainerId + objectName,
        calculateAvailableSizeBy: 'container'
      },
      enableTranslate: true,
      alwaysShowVerticalScroll: false,
      frozenColumn: 0,
      checkboxSelector: {
        hideInFilterHeaderRow: false,
        width: 60
      },
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableCheckboxSelector: true,
      enableRowSelection: true,
      enableFiltering: false,
      enableSorting: false
    }
  }

  
}
