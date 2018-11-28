import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { Http } from '@angular/http';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';
import { LoadingController } from 'ionic-angular';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
import { AdMobFree, AdMobFreeBannerConfig,AdMobFreeRewardVideoConfig,AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

/**
 * Generated class for the PostlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-postlist',
  templateUrl: 'postlist.html',
})
export class PostlistPage {
  
  loader=1;
  tabsKey = 'my-tabs-post';
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
  sec=[];
  userid;
  sub_id=0;
  day=1;
  HavingData=1;
  settitle;
  tabBarElement;
  @ViewChild(SuperTabs) superTabs: SuperTabs;

  subjects = [
    { name:"Latest Post",id:"0" },
    { name:"Current Affairs",id:"20" },
    { name:"Reasoning",id:"30" },
    { name:"Quantitative aptitude",id:"26" },
    { name:"Banking Awareness",id:"47" },
    { name:"General Awareness",id:"58" },
    { name:"Static GK",id:"48" },
    { name:"Hindi Materials",id:"2325" },
    { name:"Job Alert",id:"53" }
  ]
  itemparams;
  constructor(private admobFree: AdMobFree,public backhand: BackButtonEventHandlerProvider,public socialSharing: SocialSharing,private androidFullScreen: AndroidFullScreen,public storage: Storage,public loadingCtrl: LoadingController,private cache: CacheService,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.userid = localStorage.getItem("clientid");
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   if (typeof navParams.data.item !== 'undefined') {
    this.itemparams = navParams.data.item;
    this.selectTab =  this.itemparams.url;
    this.sub_id = this.itemparams.id;
  }
  
    this.loader=1;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
    this.loadFilms();
    this.backhand.unregister();
  }

  transform(v: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }

  share(item) {
    let link = item.url;
    let subject = item.title;
    let message = '(Download our App for Details)';
    this.socialSharing.share(message,subject,null,link).then(()=>{
      console.log('shared link allowed');
    }).catch(()=>{
      console.log('shared link Not allowed');
    });
  }

  //short charatrer length
  shortstring(item: string) {
    if (item.length <= 250) {
      return item;
    }
    return item.substr(0, 250) + '..';
  }

  seconds;
  curseconds;
  dateformats(d){
    this.seconds =  new Date(d).getTime() / 1000;
    this.curseconds = new Date().getTime() / 1000;
    let time = parseInt(this.curseconds)-parseInt(this.seconds);
    let days = Math.floor(time / (3600*24));
    let hrs   = Math.floor(time / 3600);
    let mnts = Math.floor(time / 60);

    if(days>0){
      return days+' Days Ago';
    }
    if(hrs>0){
      return hrs+' Hrs Ago';
    }
    if(mnts>0){
      return mnts+' Mins Ago';
    }
  }

  itemSelectedpack(p) {
    this.navCtrl.push(p);
  }
  itemSelected(item: string) {
    this.navCtrl.push('PostdetailsPage', { item: item });
  }
  selectTab=0;
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
    this.settitle = this.subjects[this.selectTab]['name'];
   
    let url = 'https://www.ibpsguide.com/wp-mobiles/get_recent_posts.php?count=5&page='+this.day+'&id='+this.sub_id;
    /*
    if(this.sub_id==0){
      url = 'https://www.ibpsguide.com/ibpsguidejsonapi/get_recent_posts?count=5&page='+this.day;
      //url ="https://www.ibpsguide.com/wp-mobiles/feeds53.php";
    }
    */
    console.log(url);
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
      this.tabsfilms.subscribe(setdata => {
        let data = setdata['posts'];
        console.log('jkkkkk----'+data);
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
      this.tabsfilms.subscribe(setdata => {
        let data = setdata['posts'];
        console.log('jkkkkk2----'+data);
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
      });
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
    let url = 'https://app.ibpsguide.com/api/json/admob.php?page=postlist&userid='+this.userid;
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

