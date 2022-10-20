import { StatusWorkflowOptions } from "../pipes/cspfm_data_display";
import { FormulaType } from "./cspfmFormulaConfig.type";

export type BaseFieldInfo = {
    id?: string;
    label: string;
    prop: string;
    fieldName: string;
    objectName?: string;
    elementid?: number;
    fieldType: "PERCENT" | "MASTERDETAIL" | "NUMBER" | "CHECKBOX"
    | "HIDDEN" | "TEXTAREA" | "URL" | "BOOLEAN" | "CURRENCY"
    | "DECIMAL" | "TIMESTAMP" | "FILEUPLOAD" | "EMAIL" | "RICHTEXT"
    | "RADIO" | "LOOKUP" | "DROPDOWN" | "AUTONUMBER" | "PASSWORD"
    | "TEXT" | "IMAGE" | "MULTISELECT" | "DATE" | "GEOLOCATION"
    | "STATUSWORKFLOW" | "FORMULA" | "HEADER" | "ROLLUPSUMMARY" | "COMMONLOOKUP" | "ACTION" | "RECORDASSOCIATION";
    mappingDetails: { [key: string]: string; } | "";
    child: BaseFieldInfo | "";
    dateFormat: string;
    dependentPickList?: any;
    parentFieldSlickgridColumn?: string;
    currencyDetails: {
        currencyCode?: string;
        display?: "code" | "symbol" | "symbol-narrow" | string | boolean;
        digitsInfo?: string;
        locale?: string;
    } | "";
    boxStyle?: string;
    valueStyle?: string;
    commonLookUpMappingDetail?: { [key: string]: { [key: string]: string; }; } | "";
    commonLookupDropDownKey?: string | "";
    actionInfo?: Array<{ [key: string]: any; }> | "";
    statusWorkflow?: StatusWorkflowOptions;
    rollupResultType?: "NUMBER" | "DATE" | "DATETIME" | "CURRENCY" | "DECIMAL" | "TEXT" | "AUTONUMBER" | "TIMESTAMP" | "BOOLEAN";
    formulaType?: FormulaType;
    rollupDefaultValue?: string | boolean;
    traversalpath?: string;
    associationInfo?: {};
    from?: string;
    isMultiUrlField?: boolean;
    isHiddenEnabled?: "Y" | "N";
    balloonInfo?: {};
    FieldNavigationInfo?: {};
    isEditable?: boolean;
    conditionalValidationEnable?:boolean;
    additionalParams?: {};
    fieldConfigType?: string | null;
    isUnderLineFlag?: boolean;
}