import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewpackagePage } from './viewpackage';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    ViewpackagePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewpackagePage),SuperTabsModule
  ],
  exports: [
    ViewpackagePage,
  ]
})
export class ViewpackagePageModule {}
