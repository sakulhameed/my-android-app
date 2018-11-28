import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolutionPage } from './solution';

@NgModule({
  declarations: [
    SolutionPage,
  ],
  imports: [
    IonicPageModule.forChild(SolutionPage),
  ],
  exports: [
    SolutionPage,
  ]
})
export class SolutionPageModule {}
