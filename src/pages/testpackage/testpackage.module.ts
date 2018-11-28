import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestpackagePage } from './testpackage';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    TestpackagePage,
  ],
  imports: [
    IonicPageModule.forChild(TestpackagePage),
    SuperTabsModule
  ],
  exports: [
    TestpackagePage,
  ]
})
export class TestpackagePageModule {}
