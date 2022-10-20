import { FilterFieldInfo } from './cspfmFilterFieldInfo.type';
import { ObjectHierarchy } from './cspfmObjectHierarchy.type';

type FilteredFieldInfo = {
  key: string;
  displayInfo: {
    label: string;
    value: string;
  };
};

export type FilterSectionDetail = {
  filterApplied: boolean;
  filterFields: { [elementKey: string]: FilterFieldInfo };
  filterPanelExpanded: boolean;
  filterApplyButtonPressed: boolean;
  filterAppliedFields: Array<FilteredFieldInfo>;
  isAllRequiredFieldFilled: boolean;
  reverseHierarchy: { [rootPath: string]: ObjectHierarchy };
  queryReverseHierarchy?: { [rootPath: string]: ObjectHierarchy };
};