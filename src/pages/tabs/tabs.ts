import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'FeedsPage';
  tab2Root = 'SubscribePage';
  tab3Root = 'EbooksPage';
  tab4Root = 'ProfilePage';
  tab5Root = 'HomePage';
  
  
  constructor(private androidFullScreen: AndroidFullScreen) {
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
  }
}
