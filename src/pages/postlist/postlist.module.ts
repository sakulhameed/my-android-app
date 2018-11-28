import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostlistPage } from './postlist';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    PostlistPage,
  ],
  imports: [
    IonicPageModule.forChild(PostlistPage),SuperTabsModule
  ],
  exports: [
    PostlistPage,
  ]
})
export class PostlistPageModule {}
