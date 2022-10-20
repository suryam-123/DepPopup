export type FieldType = "PERCENT" | "MASTERDETAIL" | "NUMBER" | "CHECKBOX" | "HIDDEN" | "TEXTAREA" | "URL" | "BOOLEAN" | "CURRENCY" | "DECIMAL" | "TIMESTAMP" | "FILEUPLOAD" | "EMAIL" | "RICHTEXT" | "RADIO" | "LOOKUP" | "DROPDOWN" | "AUTONUMBER" | "PASSWORD" | "TEXT" | "IMAGE" | "MULTISELECT" | "DATE" | "GEOLOCATION" | "STATUSWORKFLOW" | "FORMULA" | "HEADER" | "ROLLUPSUMMARY" | "COMMONLOOKUP" | "ACTION" | "RECORDASSOCIATION";

export type Fields = {
  fieldName: string;
  objectId: number;
  fieldId: number;
  referenceFieldId?: number;
  objectType: 'PRIMARY' | 'MASTERDETAIL' | 'HEADER' | 'LOOKUP';
  objectName?: string;
  fieldType: FieldType;
  formulaType?: FormulaType;
  rollupType?: RollupType;
  traversalPath: string; // For handling 1:1:1 object relationship
  associationFieldName?: string;
};

export type YesNo = 'N' | 'Y';

export type FormulaType = 'NUMBER' | 'BOOLEAN' | 'TEXT' | 'DATE' | 'TIMESTAMP' | 'CURRENCY';
export type RollupType = 'NUMBER' | 'BOOLEAN' | 'TEXT' | 'DATE' | 'TIMESTAMP' | 'CURRENCY';

export type FormulaConfig = {
  objectId: number;
  fieldName: string;
  formulaType: FormulaType;
  formula: string;
  displayFormula: string;
  involvedFields: Array<Fields>;
  isOldRecordUpdateEnable: YesNo;
  isRollupEnabled: YesNo;
  isReturnBlankEnable: YesNo;
  configuredTimezone?: string;
  configuredDateFormat?: string;
  fileSizeMeasurment?: string;
  displayProp?: {
    currency?: {
      currencyCode?: string;
      display?: "code" | "symbol" | "symbol-narrow" | string | boolean;
      digitsInfo?: string;
      locale?: string;
    }
  } 
};

