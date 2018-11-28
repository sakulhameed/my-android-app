import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { CacheService } from "ionic-cache";
import { App } from 'ionic-angular';

import { Http } from '@angular/http';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  constructor(private androidFullScreen: AndroidFullScreen,public app: App, platform: Platform, cache: CacheService, statusBar: StatusBar, splashScreen: SplashScreen, public http: Http) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // Set TTL to 12h
      cache.setDefaultTTL(60 * 60 * 12);
      // Keep our cached results when device is offline!
      cache.setOfflineInvalidate(false);
      statusBar.styleDefault();
      splashScreen.hide();
      // let splash = modalCtrl.create(SplashPage);
      //splash.present();
      this.androidFullScreen.isImmersiveModeSupported()
      .then(() =>this.androidFullScreen.immersiveMode())
      .catch(err => console.log(err));
      this.onSetPage();     
    });

  }

  testitems = [
    { "id":"0","name": 'All',"type":"0"},
    { "id":"100","name": 'Combo Package',"type":"0"},
  ];

  onSetPage() {

    if (localStorage.getItem("clientid") != null) {
      let userid = localStorage.getItem("clientid");
      this.http.get('https://app.ibpsguide.com/api/list_course.php?userid='+userid)
      .map(res => res.json()).subscribe(data => {
        for(var i in data) {
          this.testitems.push(data[i]);
        }
        localStorage.setItem("testseriescourses",JSON.stringify(this.testitems));
      });
      this.rootPage = 'TabsPage';
    } else {
      this.rootPage = 'LoginPage';
    }
  }

}
