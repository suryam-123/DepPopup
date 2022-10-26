import { NgModule } from '@angular/core';
        import { CommonModule } from '@angular/common';
        import { FormsModule } from '@angular/forms';
        import { Routes, RouterModule } from '@angular/router';
        import { IonicModule } from '@ionic/angular';
        import {DepPersonInfoList_WEB_List} from './DepPersonInfoList_WEB_List';           
        import { SharedModule } from 'src/core/utils/shared.module';
           
           import { cspfmactionwebmodule } from 'src/core/components/cspfmactionweb/cspfmactionweb.module';
           import { cspfmamdModule } from 'src/app/cspfmamd.module';
           import { FlatpickrModule } from 'angularx-flatpickr';
           import { TabModule } from 'angular-tabs-component';
        import { cs_conditionalvalidation_consolidatemodule } from '../../core/components/cs_conditionalvalidation_consolidate/cs_conditionalvalidation_consolidate.module';
        import { cspfmBalloonComponentmodule } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent.module';
        import { cspfmCustomActionModule } from 'src/core/components/cspfmCustomAction/cspfmCustomAction.module';
        
        const routes: Routes = [
            {
            path: '',
            component: DepPersonInfoList_WEB_List
            }
        ];
        
            @NgModule({ 
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                               
                SharedModule,
                cspfmactionwebmodule,
                cspfmamdModule,
                TabModule,
                FlatpickrModule.forRoot(),
                cs_conditionalvalidation_consolidatemodule,
                cspfmBalloonComponentmodule,
                cspfmCustomActionModule
            ],
                declarations:[DepPersonInfoList_WEB_List]
                })
                export class DepPersonInfoList_WEB_Listmodule{}