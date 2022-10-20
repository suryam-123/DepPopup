/* 
 *   File: cspfmUserAssignmentPopover.module.ts 
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

import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { cspfmUserAssignmentPopover } from 'src/core/components/cspfmUserAssignmentPopover/cspfmUserAssignmentPopover';
import { SharedModule } from 'src/core/utils/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { TabModule } from 'angular-tabs-component';
 
@NgModule({
  declarations: [cspfmUserAssignmentPopover],
  imports: [
    CommonModule,
    cspfmamdModule,
    SharedModule,
    FormsModule,
    TabModule,
    FlatpickrModule.forRoot(),
  ],
  exports: [
    cspfmUserAssignmentPopover
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmUserAssignmentPopovermodule {

}