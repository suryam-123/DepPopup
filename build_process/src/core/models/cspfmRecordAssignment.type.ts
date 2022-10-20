import { AngularGridInstance, Column, GridOption } from "angular-slickgrid";
import { FieldInfo } from "../pipes/cspfm_data_display";
import { ObjectHierarchy } from "./cspfmObjectHierarchy.type";

export type AssignmentObject = {
    objectId: string;
    objectName: string;
    associationField: string;
    fieldName: string;
    objectDisplayName: string;
    dataFetchMode: 'Full' | 'Batch';
    dataSource: 'CouchDB' | 'PouchDB' | 'JsonDB';
    layoutDataRestrictionSet: any;
    traversalPath: string;
    data: Array<any>;
    // selectedData: Array<any>;
    columnFieldInfo: Array<FieldInfo>;
    limitation: {
        minimumSelection: number;
        maximumSelection: number;
    };
    hierarchy: ObjectHierarchy;
    displayColumns?: Array<Column>
    filteredBy: 'Assigned' | 'Unassigned' | 'All';
    internalProcess?: {
        isLoading: boolean;
        angularGrid: AngularGridInstance;
        displayColumns: Array<Column>;
        gridOption: GridOption;
        gridId: string;
        gridContainerId: string;
        dataTemp?: Array<any>;
        pagination: {
            enabled: boolean,
            view: {
                itemPerPage: Array<string>;
                itemCount: string;
            },
            bookmark: { [pageIndex: number]: string },
            total_rows: number,
            currentPageIndex: number,
            nextBadgeDisabled: boolean,
            pagesCount: number
        },
        extras?: {
            [extraKey: string]: any;
        }
    };
};
// export type PrimaryAssignmentObject = Omit<AssignmentObject, "associationField">;

export type RecordAssignment = {
    primaryObject: AssignmentObject;
    secondaryObject: AssignmentObject;
    assignmentMode: 'ONE_TO_ONE';
    associationDisplayName: string;
    extras?: {
        [extraKey: string]: any;
    }
} | {
    primaryObject: AssignmentObject;
    secondaryObject: Array<AssignmentObject>;
    selectedSecondaryObject: string;
    assignmentMode: 'ONE_TO_ANY';
    associationDisplayName: string;
    extras?: {
        [extraKey: string]: any;
    }
} | {
    primaryObject: AssignmentObject;
    secondaryObject: Array<AssignmentObject>;
    assignmentMode: 'ONE_TO_MANY';
    associationDisplayName: string;
    extras?: {
        [extraKey: string]: any;
    }
};
