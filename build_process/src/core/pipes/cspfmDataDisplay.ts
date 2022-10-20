import { Pipe, PipeTransform } from "@angular/core";
import { DataFieldTraversal } from '../models/cspfmDataFieldTraversal.type';
import { cspfmDataTraversalUtils } from 'src/core/dynapageutils/cspfmDataTraversalUtils';

@Pipe({
  name: "cspfmDataDisplay"
})
export class cspfmDataDisplay implements PipeTransform {
  constructor(private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils) { }

  transform(mainData: any, dataFieldTraversal: DataFieldTraversal, fieldKey: string, mode: 'display' | 'value' | 'object'): any {
    if (mainData && dataFieldTraversal && fieldKey && mode) {
      return this.cspfmDataTraversalUtilsObject.parse(mainData, dataFieldTraversal, fieldKey, mode);
    } else {
      return '';
    }
  }
}