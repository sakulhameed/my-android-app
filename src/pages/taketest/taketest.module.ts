import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaketestPage } from './taketest';

@NgModule({
  declarations: [
    TaketestPage,
  ],
  imports: [
    IonicPageModule.forChild(TaketestPage),
  ],
  exports: [
    TaketestPage,
  ]
})
export class TaketestPageModule {}
