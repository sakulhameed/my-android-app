import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewvideosPage } from './viewvideos';

@NgModule({
  declarations: [
    ViewvideosPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewvideosPage),
  ],
  exports: [
    ViewvideosPage,
  ]
})
export class ViewvideosPageModule {}
