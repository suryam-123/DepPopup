import { FormGroup } from "@angular/forms";
import { ObjectHierarchy } from "./cspfmObjectHierarchy.type";

export type EntryType = 'Add' | 'Edit' | 'View';
export type ViewType = 'View' | 'Preview' | 'DetailView';
export type ListType = 'List';
export type ConditionalFormat = {
    layoutId: string;
    layoutType: EntryType;
    objectHierarchy: ObjectHierarchy;
    dataObject: { [traversalPath: string]: any };
    formGroup: FormGroup;
    pickListValues: any;
    formGroupValidation: any;
    parentId: string;
    parentName: string;
    primaryTraversalPath: string;
    clonedDataFieldDetails?: any;
    restrictionRules: Array<any>;
    elementIdSuffix?: string;
    fieldInfo?: any;
} | {
    layoutId: string;
    layoutType: ViewType;
    objectHierarchy: ObjectHierarchy;
    dataObject: { [traversalPath: string]: any };
    primaryTraversalPath: string;
    restrictionRules: Array<any>;
    formGroup?: FormGroup;
    pickListValues?: any;
    formGroupValidation?: any;
    parentId?: string;
    parentName?: string;
    elementIdSuffix?: string;
    parentPage?: any;
    fieldInfo?: any;
} | {
    layoutId: string;
    layoutType: ListType;
    objectHierarchy: ObjectHierarchy;
    dataObject: { [traversalPath: string]: any };
    primaryTraversalPath: string;
    restrictionRules: Array<any>;
    formGroup?: FormGroup;
    pickListValues?: any;
    formGroupValidation?: any;
    parentId?: string;
    parentName?: string;
    elementIdSuffix?: string;
    parentPage: any;
}