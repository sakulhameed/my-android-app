import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  items:any;
  datalistitems;
  loader=1;
  userid;
  types="0";
  day=0;

  tabsKey = 'my-tabs-ProfilePage';
  tabsfilms: Observable<any>;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,private cache: CacheService,public navCtrl: NavController, public navParams: NavParams, public http: Http) {
   this.userid = localStorage.getItem("clientid");
   this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   this.loadFilms();
   this.backhand.unregister();
   this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
  }

  changeTab(type){
    this.loader=1;
    this.types = type;
  }
  slideToIndex(e){    
    if (e.direction === 2) {
      this.types = '1';
      this.changeTab(this.types);
    } else if (e.direction === 4) {
      this.types = '0';
      this.changeTab(this.types);
    }
  }
  
  // Load either from API or Cache
  loadFilms(refresher?) {
    this.tabslisting(refresher);
  }
  /*
  // Invalidate for a specific group key
  invalidateCache() {
    this.cache.clearGroup(this.tabsKey);
  }
  */
  // Pull to refresh and force reload
  forceReload(refresher) {
    this.loadFilms(refresher);
  }


  tabslisting(refresher?) {
    let url = 'https://app.ibpsguide.com/api/userdetails.php?userid=' + this.userid;
    let req = this.http.get(url)
      .map(res => {
        return res.json();
      });
    let ttl = 60 * 60 * 10;
    if (refresher) {
      // Reload data even if it is cached
      let delayType = 'all';
      this.tabsfilms = this.cache.loadFromDelayedObservable(url, req, this.tabsKey, ttl, delayType);
      // Hide the refresher once loading is done
      this.tabsfilms.subscribe(data => {
        this.datalistitems = data;
        this.loader=0;
        refresher.complete();
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(data => {
        this.datalistitems = data;
        this.loader=0;
      });
    }
  }
  tabBarElement;
  ionViewDidEnter() {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'flex';
  }

}
