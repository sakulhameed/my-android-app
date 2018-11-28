import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookmarkdetailsPage } from './bookmarkdetails';

@NgModule({
  declarations: [
    BookmarkdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BookmarkdetailsPage),
  ],
  exports: [
    BookmarkdetailsPage,
  ],
})
export class BookmarkdetailsPageModule {}
