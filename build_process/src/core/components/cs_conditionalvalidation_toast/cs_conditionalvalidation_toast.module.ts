

/* 
 *   File: cs_conditionalvalidation_toast.module.ts 
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
import { cs_conditionalvalidation_toast } from './cs_conditionalvalidation_toast';
import { FormsModule } from '@angular/forms';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { SharedModule } from 'src/core/utils/shared.module';
@NgModule({
  declarations: [cs_conditionalvalidation_toast],
  imports: [
    CommonModule,
    FormsModule,
    cspfmamdModule,
    SharedModule
  ],
  exports: [
    cs_conditionalvalidation_toast
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cs_conditionalvalidation_toastmodule {

}
