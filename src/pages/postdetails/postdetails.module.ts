import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostdetailsPage } from './postdetails';

@NgModule({
  declarations: [
    PostdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PostdetailsPage),
  ],
  exports: [
    PostdetailsPage,
  ]
})
export class PostdetailsPageModule {}
