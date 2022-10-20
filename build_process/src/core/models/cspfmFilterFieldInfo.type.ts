import { DataFieldType, BooleanField, StringField, NumberField, CurrencyField, DecimalField, TimestampField, DateField, TextField, FormulaField, RollupSummaryField, CommonLookupField, LookupField, MasterDetailField, DropdownField, CheckboxField, MultiselectField, RadioField, StatusWorkflowField, TextAreaField, EmailField, UrlField, AutoNumberField, RECORDASSOCIATION } from './cspfmFieldType.enum';
import { RollupType } from './cspfmRollupType.enum';
import { FormulaType } from './cspfmFormulaType.enum';
import { CurrencyDisplayInfo } from './cspfmDataFieldTraversal.type';

export type BetweenLabel = {
  fromLabel: string;
  toLabel: string;
};

export type BetweenValue = {
  from: number | string | Date;
  to: number | string | Date;
};
export type FieldDataType = string | number | boolean | Date;

export type MultiChoose = {
  "input": Array<{
    "label": string;
    "isChecked": boolean;
    "value": string;
  }>;
  "selected": Array<any>;
  "visible": boolean;
};

export type LookupChoose = {
  "label": string;
  "searchKey": string;
  "data": any;
  layoutId?: string;
  field?: string;
  displayField?: string;
};

type StringFilterField = {
  isRequired: boolean;
  conditionalOperator: "=" | "a*" | "*z" | "";
  betweenflag: 'N';
  fieldType: DataFieldType.textarea | DataFieldType.url | DataFieldType.email | DataFieldType.autonumber | DataFieldType.text
  | TextAreaField | UrlField | EmailField | AutoNumberField | TextField | RECORDASSOCIATION;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  fieldValue: FieldDataType | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: "";
  fieldId?: Number;
};

type NumberFilterField = {
  isRequired: boolean;
  conditionalOperator: "=" | "<>" | ">" | "<" | ">=" | "<=" | "";
  betweenflag: 'N';
  fieldType: DataFieldType.number | DataFieldType.decimal | DataFieldType.timestamp | DataFieldType.date
  | NumberField | DecimalField | TimestampField | DateField;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  fieldValue: FieldDataType | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: "";
  fieldId?: Number;
};

type CurrencyFilterField = {
  isRequired: boolean;
  conditionalOperator: "=" | "<>" | ">" | "<" | ">=" | "<=" | "";
  betweenflag: 'N';
  fieldType: DataFieldType.currency | CurrencyField;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  fieldValue: FieldDataType | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: CurrencyDisplayInfo | "";
  fieldId?: Number;
};

type BooleanFilterField = {
  isRequired: boolean;
  conditionalOperator: "";
  betweenflag: 'N';
  fieldType: DataFieldType.boolean | BooleanField;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  fieldValue: Array<FieldDataType> | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: "";
  fieldId?: Number;
};


type BetweenNumberFilterField = {
  isRequired: boolean;
  conditionalOperator: "";
  betweenflag: 'Y';
  fieldType: DataFieldType.date | DataFieldType.decimal | DataFieldType.number | DataFieldType.timestamp
  | NumberField | DecimalField | TimestampField | DateField;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  betweenLabel: BetweenLabel;
  fieldValue: BetweenValue | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: "";
  fieldId?: Number;
};

type BetweenCurrencyFilterField = {
  isRequired: boolean;
  conditionalOperator: "";
  betweenflag: 'Y';
  fieldType: DataFieldType.currency | CurrencyField;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  betweenLabel: BetweenLabel;
  fieldValue: BetweenValue | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: CurrencyDisplayInfo | "";
  fieldId?: Number;
};

type FormulaFilterField = {
  isRequired: boolean;
  conditionalOperator: "=" | "a*" | "*z" | "<>" | ">" | "<" | ">=" | "<=" | "";
  betweenflag: 'N';
  fieldType: DataFieldType.formula | FormulaField;
  objectName: string;
  fieldName: string;
  formulaType: FormulaType | TextField | NumberField | DateField | TimestampField | BooleanField;
  fieldDisplayName: string;
  fieldValue: FieldDataType | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: "";
  fieldId?: Number;
  expression?: string;
};
type FormulaCurrencyFilterField = {
  isRequired: boolean;
  conditionalOperator: "=" | "a*" | "*z" | "<>" | ">" | "<" | ">=" | "<=" | "";
  betweenflag: 'N';
  fieldType: DataFieldType.formula | FormulaField;
  objectName: string;
  fieldName: string;
  formulaType: CurrencyField;
  fieldDisplayName: string;
  fieldValue: FieldDataType | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: CurrencyDisplayInfo | "";
  fieldId?: Number;
  expression?: string;
};

type RollupFilterField = {
  isRequired: boolean;
  conditionalOperator: "=" | "a*" | "*z" | "<>" | ">" | "<" | ">=" | "<=" | "";
  betweenflag: 'N';
  fieldType: DataFieldType.rollupsummary | RollupSummaryField;
  objectName: string;
  fieldName: string;
  rollupType: RollupType | TextField | NumberField | CurrencyField | DateField | TimestampField | BooleanField;
  fieldDisplayName: string;
  fieldValue: FieldDataType | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: "";
  fieldId?: Number;
  expression?: string;
};


type RollupCurrencyFilterField = {
  isRequired: boolean;
  conditionalOperator: "=" | "a*" | "*z" | "<>" | ">" | "<" | ">=" | "<=" | "";
  betweenflag: 'N';
  fieldType: DataFieldType.rollupsummary | RollupSummaryField;
  objectName: string;
  fieldName: string;
  rollupType: CurrencyField;
  fieldDisplayName: string;
  fieldValue: FieldDataType | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: CurrencyDisplayInfo | "";
  fieldId?: Number;
  expression?: string;
};

type BetweenFormulaField = {
  isRequired: boolean;
  conditionalOperator: "";
  betweenflag: 'Y';
  fieldType: DataFieldType.formula | FormulaField;
  objectName: string;
  fieldName: string;
  formulaType: FormulaType.timestamp | FormulaType.date | FormulaType.number | FormulaType.currency
  | TimestampField | DateField | NumberField | CurrencyField;
  fieldDisplayName: string;
  betweenLabel: BetweenLabel;
  fieldValue: BetweenValue | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  fieldId?: Number;
  expression?: string;
};

type BetweenCurrencyFormulaField = {
  isRequired: boolean;
  conditionalOperator: "";
  betweenflag: 'Y';
  fieldType: DataFieldType.formula | FormulaField;
  objectName: string;
  fieldName: string;
  formulaType: FormulaType.currency | CurrencyField;
  fieldDisplayName: string;
  betweenLabel: BetweenLabel;
  fieldValue: BetweenValue | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  fieldId?: Number;
  displayInfo: CurrencyDisplayInfo | "";
  expression?: string;
};

type BetweenRollupFilterField = {
  isRequired: boolean;
  conditionalOperator: "";
  betweenflag: 'Y';
  fieldType: DataFieldType.rollupsummary | RollupSummaryField;
  rollupType?: RollupType.timestamp | RollupType.date | RollupType.number | RollupType.currency
  | TimestampField | DateField | NumberField | CurrencyField;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  betweenLabel: BetweenLabel;
  fieldValue: BetweenValue | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: "";
  fieldId?: Number;
  expression?: string;
};

type BetweenCurrencyRollupFilterField = {
  isRequired: boolean;
  conditionalOperator: "";
  betweenflag: 'Y';
  fieldType: DataFieldType.rollupsummary | RollupSummaryField;
  rollupType?: RollupType.currency | CurrencyField;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  betweenLabel: BetweenLabel;
  fieldValue: BetweenValue | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: CurrencyDisplayInfo | "";
  fieldId?: Number;
  expression?: string;
};

export type LookupFilterField = {
  isRequired: boolean;
  conditionalOperator: "=" | "a*" | "*z" | "" | "<>"; // <> for number type value
  betweenflag: 'N';
  fieldType: DataFieldType.masterdetail | DataFieldType.lookup | DataFieldType.commonlookup | MasterDetailField | LookupField | CommonLookupField;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  fieldValue: FieldDataType | Array<FieldDataType> | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: LookupChoose;
  fieldId?: Number;
  lookupWindowTitle?: string;
};

type MultiselectFilterField = {
  isRequired: boolean;
  conditionalOperator: "";
  betweenflag: 'N';
  fieldType: DataFieldType.checkbox | DataFieldType.dropdown | DataFieldType.multiselect | DataFieldType.radio | DataFieldType.statusworkflow
  | CheckboxField | DropdownField | MultiselectField | RadioField | StatusWorkflowField;
  objectName: string;
  fieldName: string;
  fieldDisplayName: string;
  fieldValue: Array<FieldDataType> | any;
  rootPath: string;
  querySet?: {
    'online': any;
    'offline': any;
    'json': any;
  };
  displayInfo: MultiChoose;
  fieldId?: Number;
};

export type FilterFieldInfo = StringFilterField | NumberFilterField
  | BooleanFilterField | FormulaFilterField 
  | FormulaCurrencyFilterField | RollupCurrencyFilterField
  | BetweenCurrencyFilterField | BetweenCurrencyRollupFilterField
  | RollupFilterField | BetweenNumberFilterField
  | BetweenFormulaField | BetweenRollupFilterField
  | CurrencyFilterField | LookupFilterField 
  | MultiselectFilterField | BetweenCurrencyFormulaField;
