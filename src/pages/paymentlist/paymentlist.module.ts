import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentlistPage } from './paymentlist';

@NgModule({
  declarations: [
    PaymentlistPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentlistPage),
  ],
  exports: [
    PaymentlistPage,
  ]
})
export class PaymentlistPageModule {}
