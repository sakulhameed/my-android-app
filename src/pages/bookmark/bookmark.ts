import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
import { AdMobFree, AdMobFreeBannerConfig,AdMobFreeRewardVideoConfig,AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
/**
 * Generated class for the BookmarkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-bookmark',
  templateUrl: 'bookmark.html',
})
export class BookmarkPage {
  items:any;
  datalistitems=[];
  title;
  time_limit;
  live_date;
  loader=1;
  userid;
  canShowToast;
  displayedToast;
  types="1";
  day=0;
  tabBarElement;
  constructor(private admobFree: AdMobFree,public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
   this.userid = localStorage.getItem("clientid");
   this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   this.tabslisting();
   this.backhand.unregister();
   this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
   this.tabBarElement.style.display = 'none';
   this.admob();
  }
  transform(v: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }
  
  itemSelected(item) {
    const index: number = this.datalistitems.indexOf(item);
    this.navCtrl.push('BookmarkdetailsPage', { item: this.datalistitems,active: index });
  }
  itemDeleted(item) {
    console.log(item);
    const index: number = this.datalistitems.indexOf(item);
    if (index !== -1) {
      this.datalistitems.splice(index, 1);
    }  
    let ques_id = item.ques_id;
    let testpaneltype = this.types;
    
    let url = 'https://app.ibpsguide.com/api/delbookmark.php?testpaneltype='+testpaneltype+'&ques_id='+ques_id+'&userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
    });
    
  }
  HavingData=1;
  tabslisting() {
    let url = 'https://app.ibpsguide.com/api/new_listbookmark.php?day='+this.day+'&type='+this.types+'&userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      if(data.length>0){
      for(var i in data) {
        this.datalistitems.push(data[i]);
      }
        this.HavingData=1;
      }else{
        this.HavingData=0;
      }
      this.loader=0;
    });
  }
  changeTab(type){
    this.loader=1;
    this.types = type;
    this.datalistitems=[];
    this.day=0;
    this.tabslisting();
  }
  slideToIndex(e){    
    if (e.direction === 2) {
      this.types = '2';
      this.changeTab(this.types);
    } else if (e.direction === 4) {
      this.types = '1';
      this.changeTab(this.types);
    }
  }
  doInfinite(infiniteScroll) {
    if(this.HavingData==1){
    this.day = this.day+1;
    this.tabslisting();
    }
    setTimeout(() => {
    infiniteScroll.complete();
    }, 1000);
  }


  admob(){
    let url = 'https://app.ibpsguide.com/api/json/admob.php?page=bookmark&userid='+this.userid;
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
