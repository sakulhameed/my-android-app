import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestpanelPage } from './testpanel';

@NgModule({
  declarations: [
    TestpanelPage,
  ],
  imports: [
    IonicPageModule.forChild(TestpanelPage),
  ],
  exports: [
    TestpanelPage,
  ]
})
export class TestpanelPageModule {}
