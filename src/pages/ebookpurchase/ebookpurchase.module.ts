import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EbookpurchasePage } from './ebookpurchase';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    EbookpurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(EbookpurchasePage),
   SuperTabsModule
  ],
  exports: [
    EbookpurchasePage,
  ]
})
export class EbookpurchasePageModule {}
