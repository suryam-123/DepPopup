

/* 
 *   File: cs_global_search.module.ts 
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
import { cs_global_search } from 'src/core/components/cs_global_search/cs_global_search';
import { SharedModule } from 'src/core/utils/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [cs_global_search],
  imports: [
    CommonModule,
    cspfmamdModule,
    SharedModule,
    FormsModule,
    FlatpickrModule.forRoot()
  ],
  exports: [
    cs_global_search
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cs_global_searchmodule {

}