import { FieldInfo } from '../pipes/cspfm_data_display';
import { Column, GridOption } from 'angular-slickgrid';

export type MatrixConfig = {
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
  };
};