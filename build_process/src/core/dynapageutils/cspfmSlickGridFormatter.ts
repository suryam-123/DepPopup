import { Column, Formatter } from "angular-slickgrid";
import { AssignmentObject } from "../models/cspfmRecordAssignment.type";

export class cspfmSlickGridFormatter {
    public static CheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => {
        let actionIcon = "icon-mat-check_box_outline_blank";
        let primaryAssignmentObject: AssignmentObject = columnDef['params']['primaryAssignmentObject'];
        let assignmentObject: AssignmentObject = columnDef['params']['assignmentObject'];

        if (grid['cspfm_selection_status'] && grid['cspfm_selection_status']['ids'] && grid['cspfm_selection_status']['ids'][dataContext['id']] === 'Checked') {
            actionIcon = "icon-mat-check_box";
        } else if (grid['cspfm_selection_status'] && grid['cspfm_selection_status']['ids'] && grid['cspfm_selection_status']['ids'][dataContext['id']] === 'Partial') {
            actionIcon = "icon-mat-indeterminate_check_box";
        } else {
            actionIcon = "icon-mat-check_box_outline_blank";
        }

        let style = '';
        if (primaryAssignmentObject && primaryAssignmentObject.internalProcess && primaryAssignmentObject.internalProcess.angularGrid) {
            /* Handle partial selection for secondary record */
            let selectedStatus = dataContext['selected__s'];
            if (selectedStatus) {
                let primaryCheckedIds = primaryAssignmentObject['internalProcess']['angularGrid'] && primaryAssignmentObject['internalProcess']['angularGrid']['slickGrid']['cspfm_selection_status'] && primaryAssignmentObject['internalProcess']['angularGrid']['slickGrid']['cspfm_selection_status']['checked'] || []
                let assignedRecords = ((dataContext['assignment__s'] && dataContext['assignment__s'][assignmentObject['objectId']] && dataContext['assignment__s'][assignmentObject['objectId']]['records'] && dataContext['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'] && dataContext['assignment__s'][assignmentObject['objectId']]['records']['alreadyAssigned'].length || 0) + (dataContext['assignment__s'] && dataContext['assignment__s'][assignmentObject['objectId']] && dataContext['assignment__s'][assignmentObject['objectId']]['records'] && dataContext['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'] && dataContext['assignment__s'][assignmentObject['objectId']]['records']['currentlyAssigned'].length || 0)) || 0;

                if (assignedRecords === primaryCheckedIds.length) {
                    actionIcon = "icon-mat-check_box";
                } else if (assignedRecords === 0) {
                    actionIcon = "icon-mat-check_box_outline_blank";
                } else {
                    actionIcon = "icon-mat-indeterminate_check_box";
                }
            }

            let checkBoxDisabled = false;
            checkBoxDisabled = (!primaryAssignmentObject.internalProcess.angularGrid.slickGrid['cspfm_selection_status'] || primaryAssignmentObject.internalProcess.angularGrid.slickGrid['cspfm_selection_status']['checked'].length === 0)
            if (checkBoxDisabled) {
                style = `style="cursor: not-allowed;"`
            }
        }
        let outputTag = `<div action-view='container'>`;
        outputTag += `<button action-view='selection-checkbox' id="r${row}_${assignmentObject['objectName']}_${columnDef['id']}" ${style} class="cs-mat-icononly cs-nomargin mat-icon-button mat-primary dropdown pointer" ng-reflect-color="primary" color="primary" mat-icon-button ng-reflect-disable-ripple="true">
             <em class="${actionIcon}"></em>
         </button>
       `;
        outputTag += `</div>`
        return outputTag
    }

    public static SkeletonFormatter: Formatter = (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => {
        return `<div class="animated-gradient"></div>`
    }
}
