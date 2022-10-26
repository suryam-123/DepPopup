

/* 
 *   File: cs_status_workflow_bulkapproval.module.ts 
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
import { cs_status_workflow_bulkapproval } from './cs_status_workflow_bulkapproval';
import { FormsModule } from '@angular/forms';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { SharedModule } from 'src/core/utils/shared.module';
@NgModule({
  declarations: [cs_status_workflow_bulkapproval],
  imports: [
    CommonModule,
    FormsModule,
    cspfmamdModule,
    SharedModule
  ],
  exports: [
    cs_status_workflow_bulkapproval
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cs_status_workflow_bulkapprovalmodule {

} 
