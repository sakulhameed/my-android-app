import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestpurchasePage } from './testpurchase';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    TestpurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(TestpurchasePage),
    SuperTabsModule
  ],
  exports: [
    TestpurchasePage,
  ]
})
export class TestpurchasePageModule {}
