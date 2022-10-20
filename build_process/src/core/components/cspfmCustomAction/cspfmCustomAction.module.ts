/* 
 *   File: cspfmCustomAction.module.ts 
 *   Copyright(c) 2022 Chain-Sys Corporation Inc.
 *   Duplication or distribution of this code in part or in whole by any media
 *   without the express written permission of Chain-Sys Corporation or its agents is
 *   strictly prohibited.
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { cspfmCustomAction } from './cspfmCustomAction';
import { FormsModule } from '@angular/forms';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { SharedModule } from 'src/core/utils/shared.module';

@NgModule({
  declarations: [cspfmCustomAction],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    cspfmamdModule,
    SharedModule
  ],
  exports: [cspfmCustomAction],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmCustomActionModule {}