import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CalendarModule } from 'angular-calendar';
import { IonicModule } from '@ionic/angular';
import { cspfmCalendarPage } from './cspfmCalendarPage';
import { SharedModule } from 'src/core/utils/shared.module';
import { registerLocaleData } from '@angular/common';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { cspfmBalloonComponentmodule } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent.module';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

const routes: Routes = [
  {
    path: '',
    component: cspfmCalendarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    cspfmamdModule,
    IonicModule, CalendarModule,
    cspfmBalloonComponentmodule,
    RouterModule.forChild(routes)
  ],
  declarations: [cspfmCalendarPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class cspfmCalendarPageModule { }
