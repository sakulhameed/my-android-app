import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';

/**
 * Generated class for the LeaderboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {
  userid;
  loader;
  tabsKey = 'my-tabs-ResultPage';
  tabsfilms: Observable<any>;
  loadershow=true;
  items;
  tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public sanitizer: DomSanitizer,public alertCtrl: AlertController,private cache: CacheService,public http: Http,public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController) {
    this.userid = localStorage.getItem("clientid");
    this.items = navParams.data.item;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';

    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
    this.onloadingpage();
    this.loadFilms();
    this.backhand.unregister();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaderboardPage');
  }
  onloadingpage() {
    this.loadershow=true;
  }
  loadFilms(refresher?) {
    this.loadershow=true;
    this.tabslisting(refresher);
  }
  forceReload(refresher) {
    this.loadFilms(refresher);
  }
  resultsec;
  toporderlist;
  toprank;
  successres;
  yourrank;
  yourscore;
  yourname;
  testname;
  tabslisting(refresher?) {
    console.log(this.items.test_id);
    let url = 'https://app.ibpsguide.com/api/leaderboard.php?testid='+this.items.test_id+'&userid='+this.userid;
    let req = this.http.get(url)
      .map(res => {
        return res.json();
      });
    let ttl = 60 * 60 * 5;
    if (refresher) {
      // Reload data even if it is cached
      let delayType = 'all';
      this.tabsfilms = this.cache.loadFromDelayedObservable(url, req, this.tabsKey, ttl, delayType);
      // Hide the refresher once loading is done
      this.tabsfilms.subscribe(data => {
        this.toprank = data['toprank']; 
        this.resultsec = data['result'];
        this.yourrank = this.resultsec['rank'];
        this.yourscore = this.resultsec['score'];
        this.yourname = this.resultsec['name'];
        this.toporderlist = data['toprankall'];
        this.successres = this.resultsec['success'];
        this.testname = this.resultsec['testname'];
        this.loadershow=false;
        refresher.complete();      
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(data => {
        this.toprank = data['toprank']; 
        this.resultsec = data['result'];
        this.yourrank = this.resultsec['rank'];
        this.yourscore = this.resultsec['score'];
        this.yourname = this.resultsec['name'];
        this.testname = this.resultsec['testname'];
        this.toporderlist = data['toprankall'];
        this.successres = this.resultsec['success'];
        this.loadershow=false;
      });
    }
  }

  viewResult(item: string) {
    this.navCtrl.push('ResultPage', { item: item });
    }
  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://estore.ibpsguide.com/uploads/profile_image/'+url);
  }
}
