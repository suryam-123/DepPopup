/**
 * @author Nels1727
 * @tag 23Feb2021#Nels1727 
 * @message CR - Enable the inline edit feature for lookup.
 */
import { DecimalPipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import * as lodash from 'lodash';

@Pipe({
    name: "cspfmRecordAssignment"
})
export class cspfmRecordAssignment implements PipeTransform {
    constructor(private decimalPipe: DecimalPipe) { }

    transform(data: Array<any>, recordsOf: 'Assigned' | 'Unassigned' | 'All'): any {
        let records = this.getFilteredData(data, recordsOf).length || 0;
        return this.decimalPipe.transform(records, '2.0-0') + ' '
    }

    private getFilteredData(data: Array<any>, filteredBy: 'Assigned' | 'Unassigned' | 'All') {
        return lodash.filter(data, (item) => {
            if (filteredBy === 'Assigned') {
                return item['assignment_status__s'] === 'Assigned' || item['assignment_status__s'] === 'Partial';
            } else if (filteredBy === 'Unassigned') {
                return item['assignment_status__s'] === 'Unassigned';
            } else {
                return true;
            }
        })
    }
}
