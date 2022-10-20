/* 
 *   File: cs_status_workflow.module.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import { cs_status_workflow } from './cs_status_workflow';
import { cs_status_workflow_popovermodule } from '../cs_status_workflow_popover/cs_status_workflow_popover.module';
import { cs_status_workflow_popover } from '../cs_status_workflow_popover/cs_status_workflow_popover';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/core/utils/shared.module';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { cs_status_workflow_history } from '../cs_status_workflow_history/cs_status_workflow_history';
import { cs_status_workflow_historymodule } from '../cs_status_workflow_history/cs_status_workflow_history.module';
@NgModule({
  declarations: [cs_status_workflow],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    cs_status_workflow_popovermodule,
    cs_status_workflow_historymodule,
    cspfmamdModule
  ],
  exports: [
    cs_status_workflow
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cs_status_workflowmodule {

}
