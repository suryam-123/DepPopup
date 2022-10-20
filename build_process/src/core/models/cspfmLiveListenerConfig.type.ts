export enum FetchMode {
    GRID_FETCH = "GRID_FETCH",
    SECTION_FETCH = "SECTION_FETCH"
}


export type DependentObjectListType = {
    relationalObjects?: {} | {
        [key: string]: [] | string[];
    };
    lookupObjects?: {
        [key: string]: {} | {
            [key: string]: [] | string[];
        }
    };
    dataRestrictionInvolvedObjects?: {
        [key: string]: []
    };

};