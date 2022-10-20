import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonBottomDrawerModule } from 'ion-bottom-drawer';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAssignSearchFilter } from 'src/core/pipes/cspfmUserAssignmentpipe';
import { cspfm_data_display } from '../pipes/cspfm_data_display';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { cspfmActionsmodule } from '../components/cspfmActions/cspfmActions.module';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { HighlightSearch } from '../pipes/highlight_search';
import { cspfmDataDisplay } from '../pipes/cspfmDataDisplay';
import { cspfmRecordAssignment } from '../pipes/cspfmRecordAssignment';

@NgModule({
  exports: [
    TranslateModule,
    IonBottomDrawerModule,
    ReactiveFormsModule,
    UserAssignSearchFilter,
    NgxDatatableModule, cspfm_data_display, cspfmActionsmodule, AngularSlickgridModule,
    HighlightSearch, cspfmDataDisplay, cspfmRecordAssignment
  ],
  declarations: [cspfm_data_display, HighlightSearch, cspfmDataDisplay, cspfmRecordAssignment,UserAssignSearchFilter],
  imports: [
    CommonModule,

  ]
})
export class SharedModule { }
