import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from 'src/core/menu/menu.component';
import { authGuard } from 'src/authentication/authGuard';
import { cspfmSettings } from 'src/core/pages/cspfmSettings/cspfmSettings';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'approotpage',
    pathMatch: 'full'
    },
  {
    path: 'menu',
    component: MenuComponent,
    children: [
      { path: 'depemployee_d_w_view', loadChildren: () => import('../pages/depemployee_d_w_view/depemployee_d_w_view.module').then(m => m.depemployee_d_w_viewmodule),canActivate: [ authGuard ] },{ path: 'depemployee_Entry_Web', loadChildren: () => import('../pages/depemployee_Entry_Web/depemployee_Entry_Web.module').then(m => m.depemployee_Entry_Webmodule),canActivate: [ authGuard ] },{ path: 'depemployee_d_w_list', loadChildren: () => import('../pages/depemployee_d_w_list/depemployee_d_w_list.module').then(m => m.depemployee_d_w_listmodule),canActivate: [ authGuard ] },{ path: 'deppersonalinfo_d_w_hl_listpreview', loadChildren: () => import('../pages/deppersonalinfo_d_w_hl_listpreview/deppersonalinfo_d_w_hl_listpreview.module').then(m => m.deppersonalinfo_d_w_hl_listpreviewmodule),canActivate: [ authGuard ] },{ path: 'deppersonalinfo_d_w_hl_list', loadChildren: () => import('../pages/deppersonalinfo_d_w_hl_list/deppersonalinfo_d_w_hl_list.module').then(m => m.deppersonalinfo_d_w_hl_listmodule),canActivate: [ authGuard ] },{ path: 'deppersonalinfo_Entry_Web', loadChildren: () => import('../pages/deppersonalinfo_Entry_Web/deppersonalinfo_Entry_Web.module').then(m => m.deppersonalinfo_Entry_Webmodule),canActivate: [ authGuard ] },{ path: 'deppersonalinfo_d_w_list', loadChildren: () => import('../pages/deppersonalinfo_d_w_list/deppersonalinfo_d_w_list.module').then(m => m.deppersonalinfo_d_w_listmodule),canActivate: [ authGuard ] },{ path: 'depchildinfo_d_w_hl_detail_view', loadChildren: () => import('../pages/depchildinfo_d_w_hl_detail_view/depchildinfo_d_w_hl_detail_view.module').then(m => m.depchildinfo_d_w_hl_detail_viewmodule),canActivate: [ authGuard ] },{ path: 'depchildinfo_Entry_Web', loadChildren: () => import('../pages/depchildinfo_Entry_Web/depchildinfo_Entry_Web.module').then(m => m.depchildinfo_Entry_Webmodule),canActivate: [ authGuard ] },{ path: 'depchildinfo_d_w_list', loadChildren: () => import('../pages/depchildinfo_d_w_list/depchildinfo_d_w_list.module').then(m => m.depchildinfo_d_w_listmodule),canActivate: [ authGuard ] },{ path: 'DepPerson_MultiLine_Entry_WEB_Grid_with_List', loadChildren: () => import('../pages/DepPerson_MultiLine_Entry_WEB_Grid_with_List/DepPerson_MultiLine_Entry_WEB_Grid_with_List.module').then(m => m.DepPerson_MultiLine_Entry_WEB_Grid_with_Listmodule),canActivate: [ authGuard ] },{ path: 'DepPersonInfoList_WEB_List', loadChildren: () => import('../pages/DepPersonInfoList_WEB_List/DepPersonInfoList_WEB_List.module').then(m => m.DepPersonInfoList_WEB_Listmodule),canActivate: [ authGuard ] },{ path: 'depmultiinfo_d_w_hl_detail_view', loadChildren: () => import('../pages/depmultiinfo_d_w_hl_detail_view/depmultiinfo_d_w_hl_detail_view.module').then(m => m.depmultiinfo_d_w_hl_detail_viewmodule),canActivate: [ authGuard ] },{ path: 'depmultiinfo_Entry_Web', loadChildren: () => import('../pages/depmultiinfo_Entry_Web/depmultiinfo_Entry_Web.module').then(m => m.depmultiinfo_Entry_Webmodule),canActivate: [ authGuard ] },{ path: 'depmultiinfo_d_w_list', loadChildren: () => import('../pages/depmultiinfo_d_w_list/depmultiinfo_d_w_list.module').then(m => m.depmultiinfo_d_w_listmodule),canActivate: [ authGuard ] },{ path: 'homepage', loadChildren: () => import('../core/pages/homepage/homepage.module').then(m => m.homepageModule),canActivate: [ authGuard ] },
      { path: 'embedded', loadChildren: () => import('../core/pages/embedded/embedded.module').then(m => m.EmbeddedModule),canActivate: [ authGuard ]},
      { path: 'attachmentlist', loadChildren: () => import('../core/pages/attachmentlist/attachmentlist.module').then(m => m.attachmentlistModule), canActivate: [ authGuard ]},
      { path: 'cspfmCalendarPage',loadChildren: () => import('../core/pages/cspfmCalendarPage/cspfmCalendarPage.module').then(m => m.cspfmCalendarPageModule), canActivate: [ authGuard ] },
      { path: 'cspfmSettings',
       component: cspfmSettings,
        canActivate: [ authGuard ],
        children: [
          { path: 'themepage', loadChildren: () => import('../core/pages/themepage/themepage.module').then(m => m.themepageModule), canActivate: [ authGuard ] },
          { path: 'languagepage', loadChildren: () => import('../core/pages/languagepage/languagepage.module').then(m => m.languagepageModule), canActivate: [ authGuard ] },
          { path: 'settingpage', loadChildren: () => import('../core/pages/settingpage/settingpage.module').then(m => m.settingpageModule), canActivate: [ authGuard ] },
          { path: '', loadChildren: () => import('../core/pages/settingpage/settingpage.module').then(m => m.settingpageModule), canActivate: [ authGuard ] }
        ]
       },
       { path: 'cspfmAttachmentUpload', loadChildren: () => import('../core/pages/cspfmAttachmentUpload/cspfmAttachmentUpload.module').then(m => m.cspfmAttachmentUploadModule), canActivate: [ authGuard ]},
       { path: 'cspfmdocumentuploadconfiguration', loadChildren: () => import('../core/pages/cspfmdocumentuploadconfiguration/cspfmdocumentuploadconfiguration.module').then(m => m.cspfmdocumentuploadconfigurationModule), canActivate: [ authGuard ]},
       { path: 'cspfmGlobalSearchMoreActionPage', loadChildren: () => import('../core/pages/cspfmGlobalSearchMoreActionPage/cspfmGlobalSearchMoreActionPage.module').then(m => m.cspfmGlobalSearchMoreActionPagemodule), canActivate: [authGuard]}
    ]
  },
  { path: 'lookuppage', loadChildren: () => import('../core/pages/lookuppage/lookuppage.module').then(m => m.lookuppageModule), canActivate: [ authGuard ] },
  { path: 'cspfmCalendarEventInfo', loadChildren: () => import('../core/pages/cspfmCalendarEventInfo/cspfmCalendarEventInfo.module').then(m => m.cspfmCalendarEventInfoModule), canActivate: [ authGuard ] },
  { path: 'metadatafailure', loadChildren: () => import('../core/pages/metadatafailure/metadatafailure.module').then(m => m.metadatafailureModule) },
  { path: 'syncpage', loadChildren: () => import('../core/pages/syncpage/syncpage.module').then(m => m.syncpageModule), canActivate: [ authGuard ] },
  { path: 'approotpage', loadChildren: () => import('../core/pages/approotpage/approotpage.module').then(m => m.approotpageModule) },
  { path: 'cspfmThirdPartyAppLandingPage', loadChildren: () => import('../core/pages/cspfmThirdPartyAppLandingPage/cspfmThirdPartyAppLandingPage.module').then(m => m.cspfmThirdPartyAppLandingPageModule) },
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class appRoutingModule {}
