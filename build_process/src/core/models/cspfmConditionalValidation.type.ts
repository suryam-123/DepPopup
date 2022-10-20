
import { FormGroup } from "@angular/forms";
import { ObjectHierarchy } from "./cspfmObjectHierarchy.type";

export type EntryType = 'Add' | 'Edit' | 'MultiLineEntry';
export type ViewType = 'View' | 'Preview' | 'DetailView';
export type ListType = 'List';
export type HeaderLineListType = 'HeaderLineList';
export type ConditionalValidation = {
    layoutId: string;
    layoutType: EntryType;
    conditionalValidationObjectHierarchy: Array<ObjectHierarchy>;
    objectHierarchy: ObjectHierarchy;
    dataObject: { [traversalPath: string]: any };
    formGroup: FormGroup;
    pickListValues: any;
    formGroupValidation: any;
    parentId: string;
    parentName: string;
    primaryTraversalPath: string;
    validationRules: Array<any>;
    conditionalValidationRelationshipDataObject: any;
    elementIdSuffix?: string;
} | {
    layoutId: string;
    layoutType: ViewType;
    conditionalValidationObjectHierarchy: Array<ObjectHierarchy>;
    objectHierarchy: ObjectHierarchy;
    dataObject: { [traversalPath: string]: any };
    primaryTraversalPath: string;
    validationRules: Array<any>;
    conditionalValidationRelationshipDataObject: any;
    formGroup?: FormGroup;
    pickListValues?: any;
    formGroupValidation?: any;
    parentId?: string;
    parentName?: string;
    elementIdSuffix?: string;
} | {
    layoutId: string;
    layoutType: ListType;
    conditionalValidationObjectHierarchy: Array<ObjectHierarchy>;
    objectHierarchy: ObjectHierarchy;
    dataObject: { [traversalPath: string]: any };
    primaryTraversalPath: string;
    validationRules: Array<any>;
    conditionalValidationRelationshipDataObject: any;
    formGroup?: FormGroup;
    pickListValues?: any;
    formGroupValidation?: any;
    parentId?: string;
    parentName?: string;
    elementIdSuffix?: string;
} | {
    layoutId: string;
    layoutType: HeaderLineListType;
    conditionalValidationSectionObjectHierarchy: any,
    conditionalValidationObjectHierarchy?: any;
    sectionObjectHierarchy: any;
    objectHierarchy?: any;
    dataObject: { [traversalPath: string]: any };
    primaryTraversalPath: string;
    validationRules: Array<any>;
    conditionalValidationRelationshipDataObject: any;
    formGroup?: FormGroup;
    pickListValues?: any;
    formGroupValidation?: any;
    parentId?: string;
    parentName?: string;
    elementIdSuffix?: string;
}