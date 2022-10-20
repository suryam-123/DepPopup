import { MatrixConfig } from '../services/cspfmSlickgridMatrix.service';
import { CurrentSorter } from 'angular-slickgrid';

export type PaginationAction = 'next_pressed' | 'limit_changed' | 'prev_pressed' | 'current_page_refresh';


export type SectionObjectDetail = {
    isAutoFitEnable?: boolean;
    dataFetchMode: 'Full' | 'Batch' | 'OnClickBatch';
    groupingColumns: Array<{
        [key: string]: any;
    }>;
    isExpanded: 'E' | 'C'; //E - Expand , C - Collapse
    reportInput?: any;
    printInput?: any;
    isMatrixEnabled: boolean;
    isRowClickDisabled?: boolean;
    matrixConfig?: MatrixConfig;
    sectionElementId?: string;
    sortByColumns?: CurrentSorter[] | null;
    criteriaQueryConfig?: any;
    isEmailActionEnabled?:any,
    emailActionConfig?:any,
    slickgridSelectOptionEnabled?:any,
    sectionUserDataRestrictionSet?: Array<{restrictionType:string, restrictionLevel:number}>,
    isRelatedList?: boolean;
};
