/* 
 *   File: cspfmUserAssignment.module.ts 
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
import { SharedModule } from 'src/core/utils/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { TabModule } from 'angular-tabs-component';
import { cspfmUserAssignment } from 'src/core/components/cspfmUserAssignment/cspfmUserAssignment';
  
@NgModule({
  declarations: [cspfmUserAssignment],
  imports: [
    CommonModule,
    cspfmamdModule,
    SharedModule,
    FormsModule,
    TabModule,
    FlatpickrModule.forRoot(),
  ],
  exports: [
    cspfmUserAssignment
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmUserAssignmentmodule {

}