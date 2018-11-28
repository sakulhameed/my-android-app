import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationdetailsPage } from './notificationdetails';

@NgModule({
  declarations: [
    NotificationdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationdetailsPage),
  ],
  exports: [
    NotificationdetailsPage,
  ]
})
export class NotificationdetailsPageModule {}
