/* 
 *   File: cspfmRecordAssociationDisplay.module.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { SharedModule } from 'src/core/utils/shared.module';
import { TabModule } from 'angular-tabs-component';
import { cspfmRecordAssociationDisplay } from './cspfmRecordAssociationDisplay';
import { NgxMasonryModule } from 'ngx-masonry';

@NgModule({
  declarations: [cspfmRecordAssociationDisplay],
  imports: [
    CommonModule,
    cspfmamdModule,
    SharedModule,
    FormsModule,
    TabModule,
    NgxMasonryModule
  ],
  exports: [
    cspfmRecordAssociationDisplay
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmRecordAssociationDisplaymodule {

}