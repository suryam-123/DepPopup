import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { attachmentlist } from './attachmentlist';
import { cspfmamdModule } from 'src/app/cspfmamd.module';
import { TabModule } from 'angular-tabs-component';
import { CarouselModule } from 'ng-carousel-cdk';

const routes: Routes = [
  {
    path: '',
    component: attachmentlist
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    cspfmamdModule,
    TabModule,
    CarouselModule
  ],
  declarations: [attachmentlist]
})
export class attachmentlistModule { }
