import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LivetestlistPage } from './livetestlist';

@NgModule({
  declarations: [
    LivetestlistPage,
  ],
  imports: [
    IonicPageModule.forChild(LivetestlistPage),
  ],
  exports: [
    LivetestlistPage,
  ]
})
export class LivetestlistPageModule {}
