import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideopurchasePage } from './videopurchase';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    VideopurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(VideopurchasePage),SuperTabsModule
  ],
  exports: [
    SuperTabsModule,
  ]
})
export class VideopurchasePageModule {}
