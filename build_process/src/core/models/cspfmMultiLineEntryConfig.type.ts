import { FieldInfo } from "../pipes/cspfm_data_display";
 import { SectionObjectDetail } from "./cspfmSectionDetails.type";
 import { ConditionalValidation } from "./cspfmConditionalValidation.type";
 import { ObjectHierarchy } from "./cspfmObjectHierarchy.type";
 import { FormulaConfig } from "./cspfmFormulaConfig.type";
 import { DependentObjectListType } from "./cspfmLiveListenerConfig.type";

 
 export type MultiLineEntryConfig = {
   sectionObjects: Array<string>;
   paginationConfig: {
     [objectName: string]: {
       currentPageWithRecord: 'true' | 'false';
       itemPerPage: 'true' | 'false';
       numberOfPages: 'true' | 'false';
       paginationPosition: "TOP" | "BOTTOM";
     };
   };
   sectionObjectDetail: {
     [objectName: string]: SectionObjectDetail;
   };
   columnFieldInfo: {
     [objectName: string]: Array<FieldInfo>;
   };
   objectDisplayMapping: {
     [objectName: string]: string;
   };
   relationShip: {
     [objectName: string]:
     | "one_to_many"
     | "one_to_one"
     | "ONE_TO_MANY"
     | "ONE_TO_ONE";
   };
   sectionObjectHierarchy:{
     [objectName: string]: ObjectHierarchy
   },
   conditionalValidation: {
     [objectName: string]: ConditionalValidation
   };
   primaryRecordId: string;
   primaryObjectName: string;
   formulaConfig? : {
    [objectName: string]: {
      [elementKey: string]: FormulaConfig
    }
  };
  sectionDependentObjectList: { 
    [objectName: string]: DependentObjectListType
  };
 };