import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedsPage } from './feeds';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    FeedsPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedsPage),
    SuperTabsModule
  ],
  exports: [
    FeedsPage,
  ]
})
export class FeedsPageModule {}
