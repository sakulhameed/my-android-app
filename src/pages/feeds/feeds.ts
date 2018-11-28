import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController } from 'ionic-angular';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { Storage } from '@ionic/storage';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
import { AdMobFree, AdMobFreeBannerConfig,AdMobFreeRewardVideoConfig,AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
/**
 * Generated class for the FeedsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-feeds',
  templateUrl: 'feeds.html',
})
export class FeedsPage {
  
  loader=1;
  tabsKey = 'my-tabs-feeds';
  tabsfilms: Observable<any>;
  TestpackagePage = 'TestpackagePage';
  DailyquizPage = 'DailyquizPage';
  CartPage = 'CartPage';
  NotificationPage = 'NotificationPage';
  SubscribePage = 'SubscribePage';
  nofityKey = 'my-nofity-HomePage';
  NewsPage = 'NewsPage';
  nofityfilms: Observable<any>;
  datalistitems=[];
  attemptedtype='0';
  sec=[];
  userid;
  sub_id=0;
  selectTab=0;
  day=0;
  HavingData=1;
  settitle;
  tabBarElement;
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  itemparams;
  
  subjects=[
    { sub_id: '0',kid: '0', sub_name: 'Daily Quiz', sub_page: 'NewsPage' },
    { sub_id: '12',kid: '12', sub_name: 'Sectional Test', sub_page: 'NewsPage' },
    { sub_id: '6',kid: '6', sub_name: 'Current Affairs Quiz', sub_page: 'NewsPage' },
    { sub_id: '1',kid: '1', sub_name: 'Quantitative Aptitude', sub_page: 'NewsPage' },
    { sub_id: '2',kid: '2', sub_name: 'Reasoning Ability', sub_page: 'NewsPage' },
    { sub_id: '3',kid: '3', sub_name: 'English Language', sub_page: 'NewsPage' },
    { sub_id: '4',kid: '4', sub_name: 'Banking Awareness', sub_page: 'NewsPage' },
    { sub_id: '8',kid: '7', sub_name: 'Static GK Quiz', sub_page: 'NewsPage' },
    { sub_id: '10',kid: '9',sub_name: 'General Awareness', sub_page: 'NewsPage' },
    { sub_id: '9',kid: '8', sub_name: 'Monthly Current Affairs Quiz', sub_page: 'NewsPage' },
    { sub_id: '5',kid: '5', sub_name: 'Computer Language', sub_page: 'NewsPage' },
    { sub_id: '11',kid: '10',sub_name: 'Railway Quiz', sub_page: 'NewsPage' }
    
  ]

  constructor(private admobFree: AdMobFree,public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public storage: Storage,public loadingCtrl: LoadingController,private cache: CacheService,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.userid = localStorage.getItem("clientid");
    this.androidFullScreen.isImmersiveModeSupported()
    .then(() =>this.androidFullScreen.immersiveMode())
    .catch(err => console.log(err));

    if (typeof navParams.data.item !== 'undefined') {
      this.itemparams = navParams.data.item;
      this.selectTab =  this.itemparams.url;
      this.sub_id = this.itemparams.id;
    }

    this.backhand.unregister();
    this.backhand.registerDoublePressToExitApp('FeedsPage',this.navCtrl);
    this.admob();
  }
  itemSelectedpack(p) {
    this.navCtrl.push(p);
  }
  
  slideToIndex(e){
    let limit = this.subjects.length-1;
    
    if (e.direction === 2) {
      
      if(limit>this.selectTab){
        this.selectTab++;
        this.Movetoslide(this.selectTab);
      }
    } else if (e.direction === 4) {
      if(this.selectTab>0){
        this.selectTab--;
        this.Movetoslide(this.selectTab);
      }
    }
  }

  Movetoslide(i){
    this.superTabs.slideTo(i);
  }
 
  onTabSelect(ev: any) {
    this.loader=1;
    this.sub_id=ev.id;
    this.selectTab = ev.index;
    this.day=0;
    this.HavingData=1;
    this.datalistitems=[];
    this.tabslisting();
  }

  // Load either from API or Cache
  loadFilms(refresher?) {
    this.datalistitems=[];
    this.day=0;
    this.loader=1;
    this.HavingData=1;
    this.tabslisting(refresher);
  }

  // Pull to refresh and force reload
  forceReload(refresher) {
    this.loadFilms(refresher);
  }
  

  tabslisting(refresher?) {
    this.settitle = this.subjects[this.selectTab]['sub_name'];
    let url = 'https://app.ibpsguide.com/api/new_praticalproductdetails_atmp.php?day='+this.day+'&subid='+this.sub_id+'&attemptedtype='+this.attemptedtype+'&userid='+this.userid;
   
    let req = this.http.get(url)
      .map(res => {
        return res.json();
      });
    let ttl = 60 * 60 * 2;
    if (refresher) {
      // Reload data even if it is cached
      let delayType = 'all';
      this.tabsfilms = this.cache.loadFromDelayedObservable(url, req, this.tabsKey, ttl, delayType);
      // Hide the refresher once loading is done
      this.tabsfilms.subscribe(data => {
        if(data.length>0){
          if(this.day!=0){
            for(var i in data) {
              this.datalistitems.push(data[i]);
            }
          }else{
            this.datalistitems = data;
          }
            this.HavingData=1;
          }else{
            this.HavingData=0;
          }
        this.loader=0;
        refresher.complete();
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(data => {
        if(data.length>0){
          if(this.day!=0){
            for(var i in data) {
              this.datalistitems.push(data[i]);
              console.log(i);
            }
          }else{
            this.datalistitems = data;
            console.log(data);
          }
            this.HavingData=1;
          }else{
            this.HavingData=0;
          }
          this.loader=0;
      });
    }

  }

/*
  tabslisting() {
    
    this.settitle = this.subjects[this.selectTab]['sub_name'];
    let url = 'https://app.ibpsguide.com/api/new_praticalproductdetails_atmp.php?day='+this.day+'&subid='+this.sub_id+'&userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      if(data.length>0){
      for(var i in data) {
        this.datalistitems.push(data[i]);
      }
        this.loader=0;
        this.HavingData=1;
      }else{
        this.HavingData=0;
      }
    });
  }
*/

  ionViewDidEnter() {
    this.loader=1;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'flex';
    this.getAllFavorites();
    this.loadFilms();
  }
  
  itemChecking(item,type) {
    let soluname = 'mytestsolution-'+item.testpaneltype+'-'+item.test_id;
    if(type=='1'){
      this.navCtrl.push('ResultPage', { item: item });
    }else if(type=='2'){
      console.log(this.pauseitemKey[soluname]);
      if (typeof this.pauseitemKey[soluname] !== 'undefined'){
        item.id=this.pauseitemKey[soluname];
        item.type='1';
        this.navCtrl.push('ResultPage', { item: item });
      }else{
        this.navCtrl.push('TestpanelPage', { item: item });
      }
    }
  }
 pauseitemKey = [];
 getAllFavorites() {
   this.storage.forEach((v,k,i) => {
    this.pauseitemKey[k]=v;
  });
  }

  onSecChange(){
    this.loadFilms();
  }

  onpausetest(t,type){
   // console.log(type);
    if(type!=1){
    let testname = 'test-'+t.testpaneltype+'-'+t.test_id;
    let soluname = 'mytestsolution-'+t.testpaneltype+'-'+t.test_id;
    
    if (typeof this.pauseitemKey[testname] !== 'undefined'){
        return 'cardpadsred';  
    }else if (typeof this.pauseitemKey[soluname] !== 'undefined'){
      return 'cardpadsgreen';
    }else{
      return 'cardpads';
    }
    }else{
    return 'cardpadsgreen';
    }
  }
  onpausetesticon(t,type){
    if(type!=1){
    let testname = 'test-'+t.testpaneltype+'-'+t.test_id;
    let soluname = 'mytestsolution-'+t.testpaneltype+'-'+t.test_id;
    if (typeof this.pauseitemKey[testname] !== 'undefined'){
        return 'pause';  
    }else if (typeof this.pauseitemKey[soluname] !== 'undefined'){
      return 'checkmark-circle';
    }else{
      return 'arrow-dropright-circle';
    }
    }else{
    return 'checkmark-circle';
    }
  }

  onpausetestcolor(t,type){
    if(type!=1){
    let testname = 'test-'+t.testpaneltype+'-'+t.test_id;
    let soluname = 'mytestsolution-'+t.testpaneltype+'-'+t.test_id;
    if (typeof this.pauseitemKey[testname] !== 'undefined'){
      return '#fa6767';
    }else if (typeof this.pauseitemKey[soluname] !== 'undefined'){
      return '#1c9373';
    }else{
      return '#519fe8';  
    }
    }else{
      return '#1c9373';
    }
  }

  doInfinite(infiniteScroll) {
    if(this.HavingData==1){
      this.day = this.day+1;
      this.tabslisting();
      }
      setTimeout(() => {
      infiniteScroll.complete();
      }, 1500);
  }

  admob(){
    let url = 'https://app.ibpsguide.com/api/json/admob.php?page=feeds&userid='+this.userid;
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
