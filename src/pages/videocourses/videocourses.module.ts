import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideocoursesPage } from './videocourses';
@NgModule({
  declarations: [
    VideocoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(VideocoursesPage)
  ],
  exports: [
    VideocoursesPage,
  ]
})
export class VideocoursesPageModule {}
