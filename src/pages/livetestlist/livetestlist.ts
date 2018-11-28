import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
//import { NativeAudio } from '@ionic-native/native-audio';
import { AdMobFree, AdMobFreeBannerConfig,AdMobFreeRewardVideoConfig,AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-livetestlist',
  templateUrl: 'livetestlist.html',
})
export class LivetestlistPage {
  datalistitems:any;
  loader;
  userid;
  nofityKey = 'my-nofity-HomePage';
  nofityfilms: Observable<any>;
  loadershow=true;
  tabBarElement;
  datalistitemschat:any;
  langs='1';
  onSuccess
  message='Hello, Today I found a New Amazing "IBPSGuide Mobile App" which is useful for All Competitive Exam Preparation. Click to download: ';
  subject="Learn Wisely & Crack it.";
  file=null;
  link='https://ibpsgd.page.link/shareIGapp';
  //private nativeAudio: NativeAudio,
  constructor(private admobFree: AdMobFree,public socialSharing: SocialSharing,public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,private cache: CacheService,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
   this.userid = localStorage.getItem("clientid");
   this.tabslisting();
   //this.nativeAudio.preloadSimple('uniqueId1', 'assets/imgs/bgsound.mp3').then();
   //this.nativeAudio.loop('uniqueId1').then();
   this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   this.backhand.unregister();
   this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
   this.tabBarElement.style.display = 'none';
   this.admob();
  }
  ionViewDidEnter() {
    this.tabslistingchat();
  }
  itemSelected(item){

  }

  share() {
    this.socialSharing.share(this.message,this.subject,this.file,this.link).then(()=>{

    }).catch(()=>{

    });
  }


  changeTab(lang){
    this.langs=lang;
  }
  transform(v: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }
  onloadingpage() {
    this.loadershow=true;
  }
  liveTestSelected(item: string, type) {
    if (type == '1') {
      this.navCtrl.push('TestpanelPage', { item: item });
    }else if (type == '4') {
      this.navCtrl.push('LeaderboardPage', { item: item });
    } 
  }
  openLiveChatPage(){
    this.navCtrl.push('LiveChatPage',{ item: this.datalistitemschat });
  }
  tabslisting() {
    this.onloadingpage();
    let url = 'https://app.ibpsguide.com/api/livetestlist.php?userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.datalistitems = data;
      this.loadershow=false;
      });
  }
  getSafeUrl(url) {
    if (url != '') {
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://estore.ibpsguide.com/uploads/profile_image/' + url);
    } else {
      return 'assets/imgs/user.png';
    }
  }
  nextestcnts;
  rewardscnts;
  testusername;
  totpoints;
  lastpoints;
  testactive;
  show_result;btname;
  tabslistingchat() {
    let url = 'https://app.ibpsguide.com/api/livechattestlist.php?userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.datalistitemschat = data['mocktest'];
      this.nextestcnts = this.datalistitemschat['next_testcontents'];
      this.rewardscnts = this.datalistitemschat['rewardcontents'];
      this.testusername = this.datalistitemschat['username'];
      this.totpoints = this.datalistitemschat['tot_points'];
      this.lastpoints = this.datalistitemschat['last_points'];
      this.testactive = this.datalistitemschat['testactive'];
      this.show_result = this.datalistitemschat['show_result'];
      this.btname = this.datalistitemschat['btname'];
    });
  }
 // Load either from API or Cache
loadFilms(refresher?) {
  this.loadershow=true;
  this.notifylisting(refresher);
  this.tabslisting();
}

// Pull to refresh and force reload
forceReload(refresher) {
  this.tabslistingchat();
  this.loadFilms(refresher);
}
  nofitylist;
  notifylisting(refresher?) {
    let url = 'https://app.ibpsguide.com/api/page_notify.php?type=5';
    let req = this.http.get(url)
      .map(res => {
        return res.json();
      });
    let ttl = 60 * 60 * 1;
    if (refresher) {
      let delayType = 'all';
      this.nofityfilms = this.cache.loadFromDelayedObservable(url, req, this.nofityKey, ttl, delayType);
      this.nofityfilms.subscribe(data => {
        this.nofitylist = data;
        refresher.complete();
      });
    } else {
      this.nofityfilms = this.cache.loadFromObservable(url, req, this.nofityKey, ttl);
      this.nofityfilms.subscribe(data => {
        this.nofitylist = data;
      });
    }
    this.loadershow=false;
  }
  itemDeleted(item) {
    console.log(item);
    const index: number = this.nofitylist.indexOf(item);
    if (index !== -1) {
      this.nofitylist.splice(index, 1);
    }    
  }

  admob(){
    let url = 'https://app.ibpsguide.com/api/json/admob.php?page=livetestlist&userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
    console.log(JSON.stringify(data));
    if(data.lockads=='0'){
      if(data.adstype=='1'){
        const bannerConfig: AdMobFreeBannerConfig = {
          id:data.id,
          autoShow: data.autoShow,
          isTesting: data.isTesting,
          overlap: data.overlap,
          bannerAtTop: data.bannerAtTop,
          offsetTopBar: data.offsetTopBar
        };
       this.admobFree.banner.config(bannerConfig);
       this.admobFree.banner.prepare()
       .then((res) => { console.log(JSON.stringify(res)); }).catch(e => console.log(JSON.stringify(e)) );
      }else if(data.adstype=='2'){
        const bannerConfig: AdMobFreeInterstitialConfig = {
          id:data.id,
          autoShow: data.autoShow,
          isTesting: data.isTesting
        };
       this.admobFree.banner.config(bannerConfig);
       this.admobFree.banner.prepare()
       .then((res) => { console.log(JSON.stringify(res)); }).catch(e => console.log(JSON.stringify(e)) );
      }else if(data.adstype=='3'){
        const bannerConfig: AdMobFreeRewardVideoConfig = {
          id:data.id,
          autoShow: data.autoShow,
          isTesting: data.isTesting
        };
       this.admobFree.banner.config(bannerConfig);
       this.admobFree.banner.prepare()
       .then((res) => { console.log(JSON.stringify(res)); }).catch(e => console.log(JSON.stringify(e)) );
      }
    } 
    }); 
  }

}
