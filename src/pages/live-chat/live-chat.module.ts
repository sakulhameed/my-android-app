import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiveChatPage } from './live-chat';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
@NgModule({
  declarations: [
    LiveChatPage,
  ],
  imports: [
    IonicPageModule.forChild(LiveChatPage),RoundProgressModule
  ],
  exports: [
    LiveChatPage,
  ]
})
export class LiveChatPageModule {}
