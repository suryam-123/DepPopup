import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from 'src/core/utils/shared.module';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { cspfmweblookuppage } from 'src/core/pages/cspfmweblookuppage/cspfmweblookuppage';
import { IonicModule } from '@ionic/angular';
import { cspfmWebFiltermodule } from 'src/core/components/cspfmWebFilter/cspfmWebFilter.module';

const routes: Routes = [
  {
    path: '',
    component: cspfmweblookuppage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    cspfmamdModule,
    IonicModule,
    cspfmWebFiltermodule,
    RouterModule.forChild(routes)
  ],
  declarations: [cspfmweblookuppage],
  exports: [
    cspfmweblookuppage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class cspfmweblookuppageModule { }
