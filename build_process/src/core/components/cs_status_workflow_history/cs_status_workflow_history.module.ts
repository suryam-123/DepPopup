/* 
 *   File: cs_status_workflow_history.module.ts 
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
  import { FormsModule } from '@angular/forms';
  import { SharedModule } from 'src/core/utils/shared.module';
  import { cspfmamdModule } from 'src/app/cspfmamd.module';
  import { cs_status_workflow_history } from './cs_status_workflow_history';
  @NgModule({
    declarations: [cs_status_workflow_history],
    imports: [
      FormsModule,
      CommonModule,
      SharedModule,   
      cspfmamdModule
    ],
    exports: [
      cs_status_workflow_history
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class cs_status_workflow_historymodule {
  
  } 
  