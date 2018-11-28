import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EbooksPage } from './ebooks';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    EbooksPage,
  ],
  imports: [
    IonicPageModule.forChild(EbooksPage),
    SuperTabsModule
  ],
  exports: [
    EbooksPage,
  ]
})
export class EbooksPageModule {}
