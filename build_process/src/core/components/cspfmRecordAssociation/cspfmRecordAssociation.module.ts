/* 
 *   File: cspfmRecordAssociation.module.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabModule } from 'angular-tabs-component';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { SharedModule } from 'src/core/utils/shared.module';
import { cspfmRecordAssociation } from './cspfmRecordAssociation';
import { NgxMasonryModule } from 'ngx-masonry';

@NgModule({
  declarations: [cspfmRecordAssociation],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    cspfmamdModule,
    TabModule,
    NgxMasonryModule
  ],
  exports: [
    cspfmRecordAssociation
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmRecordAssociationmodule {

}