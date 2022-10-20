export type ObjectHierarchy = {
  objectName: string;
  objectId: string;
  fieldName?: string;
  fieldId: string;
  objectType: "MASTERDETAIL";
  relationShipType: 'ONE_TO_ONE' | 'one_to_one' | 'ONE_TO_MANY' | 'one_to_many';
  childObject: Array<ObjectHierarchy>;
  formulaField?: Array<any>
  rollupField?: Array<any>
  isStandardObject?: 'Y' | 'N';
  workflowField?: Array<any>;
  options?: any;
  options_formula?: any;
  options_rollup?: any;
  standardOrCustom?: any;
  rootPath?: any;
  objectLayoutLinkId?: number; // For Webservice provider Purpose
  layoutId?: number; // For Webservice provider Purpose
  lookupId?: number; // For Webservice provider Purpose
  referenceObjectId?: number | string; // For Webservice provider Purpose
  associationObject? : Array<any>;
  isLazyLoadingEnabled? : boolean;
  includeFields?:boolean; // includeFields for fetch Ids only or fetch full document
  fileManage?:{
    isFormulaForAttachmentEnable?:boolean;
    isFormulaForDocumentEnable?:boolean;
    involvedDocumentIds?:Array<number>
  }
} | {
  objectName: string;
  objectId: string;
  fieldName?: string;
  fieldId: string;
  objectType: "LOOKUP" | "COMMONLOOKUP" | "PRIMARY" | "HEADER" | "REVERSE_LOOKUP";
  relationShipType: "" | string;
  lookupField?: string;
  childObject: Array<ObjectHierarchy>;
  formulaField?: Array<any>
  rollupField?: Array<any>
  isStandardObject?: 'Y' | 'N';
  workflowField?: Array<any>;
  options?: any;
  options_formula?: any;
  options_rollup?: any;
  standardOrCustom?: any;
  rootPath?: any;
  objectLayoutLinkId?: number; // For Webservice provider Purpose
  layoutId?: number; // For Webservice provider Purpose
  lookupId?: number; // For Webservice provider Purpose
  referenceObjectId?: number | string; // For Webservice provider Purpose
  associationObject? : Array<any>;
  isLazyLoadingEnabled? : boolean;
  includeFields?:boolean; // includeFields for fetch Ids only or fetch full document
  fileManage?:{
    isFormulaForAttachmentEnable?:boolean;
    isFormulaForDocumentEnable?:boolean;
    involvedDocumentIds?:Array<number>
  } 
};