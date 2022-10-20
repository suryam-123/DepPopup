import { TextField, TextAreaField, NumberField, AutoNumberField, PasswordField, UrlField, EmailField, DecimalField, BooleanField, DropdownField, RadioField, CheckboxField, MultiselectField, CurrencyField, DateField, TimestampField, FormulaField, RollupSummaryField, StatusWorkflowField, CommonLookupField, ActionField } from './cspfmFieldType.enum';
import { FormulaType, RollupType } from './cspfmFormulaConfig.type';
import { StatusWorkflowOptions } from '../pipes/cspfm_data_display';

export type CurrencyDisplayInfo = {
  currency: {
    currencyCode?: string;
    display?: "code" | "symbol" | "symbol-narrow" | string | boolean;
    digitsInfo?: string;
    locale?: string;
  };
};

export type DataField = {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: TextField | TextAreaField | NumberField
  | AutoNumberField | PasswordField | UrlField
  | EmailField | DecimalField | BooleanField;
  traversalPath: string;
  displayInfo: '';
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: DropdownField | RadioField | CheckboxField | MultiselectField;
  traversalPath: string;
  displayInfo: {
    mapper: {
      [key: string]: string;
    }
  };
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: CurrencyField;
  traversalPath: string;
  displayInfo: CurrencyDisplayInfo;
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: DateField | TimestampField;
  traversalPath: string;
  displayInfo: '';
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: FormulaField;
  formulaType: Exclude<FormulaType, 'CURRENCY'>
  traversalPath: string;
  displayInfo: '';
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: FormulaField;
  formulaType: 'CURRENCY'
  traversalPath: string;
  displayInfo: CurrencyDisplayInfo;
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: RollupSummaryField;
  rollupType: Exclude<RollupType, 'CURRENCY'>
  traversalPath: string;
  displayInfo: '';
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: RollupSummaryField;
  rollupType: 'CURRENCY'
  traversalPath: string;
  displayInfo: CurrencyDisplayInfo;
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: StatusWorkflowField;
  traversalPath: string;
  displayInfo: {
    statusWorkflow: StatusWorkflowOptions;
    mapper: { [key: string]: string; }
  };
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: CommonLookupField;
  traversalPath: string;
  displayInfo: {
    commonLookup: {};
  };
} | {
  id: string;
  objectName: string;
  objectDisplayName: string;
  fieldName: string;
  label: string;
  fieldType: ActionField;
  traversalPath: string;
  displayInfo: {
    actions: Array<{ [key: string]: any; }>;
  };
};

export type ObjectRootPath = {
  prop: string;
  relationship: 'HEADER' | 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'LOOKUP' | 'COMMONLOOKUP' | 'PRIMARY';
  child: '' | ObjectRootPath;
}

export type DataFieldTraversal = {
  fields: {
    [fieldRootPath: string]: DataField
  },
  traversalPath: {
    [objectRootPath: string]: '' | ObjectRootPath
  }
}