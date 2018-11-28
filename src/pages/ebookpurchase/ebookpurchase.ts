import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SuperTabs } from 'ionic2-super-tabs';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the EbooksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-ebookpurchase',
  templateUrl: 'ebookpurchase.html',
})
export class EbookpurchasePage {
  items = [];
  userid;
  tabsKey = 'my-tabs-ProductlistPage';
  tabsfilms: Observable<any>;
  datalistitems=[];
  sub_id=0;
  HavingData=1;
  loader=1;
  day=0;
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public inAppBrowser: InAppBrowser,private cache: CacheService,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.userid = localStorage.getItem("clientid");
    this.items =[
      { id: '0',kid: '0',name: 'Your Books',sub_page: 'NewsPage'},
      { id: '1',kid: '1',name: 'Current Affairs',sub_page: 'NewsPage'},
      { id: '2',kid: '2',name: 'Quantitative Aptitude ',sub_page: 'NewsPage'},
      { id: '3',kid: '3',name: 'Reasoning Ability',sub_page: 'NewsPage' },
      { id: '4',kid: '4',name: 'English Language',sub_page: 'NewsPage'},
      { id: '5',kid: '5',name: 'Banking Awareness',sub_page: 'NewsPage'},
      { id: '6',kid: '6',name: 'Insurance Awareness',sub_page: 'NewsPage'},
      { id: '7',kid: '7',name: 'Professional Knowledge',sub_page: 'NewsPage'}
    ];
    this.loadFilms();
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   this.backhand.unregister();
   this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
  }
  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);		
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
  openhome(){
    this.navCtrl.push('SubscribePage');
  }
  selectTab=0;
  slideToIndex(e){
    let limit = this.items.length-1;
    
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


  datacountlist;
  tabslisting(refresher?) {
    let url = 'https://app.ibpsguide.com/api/purchase_userproducts.php?day='+this.day+'&type=1&catg='+this.sub_id+'&userid='+this.userid;
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
            this.datacountlist = Object.keys(this.datalistitems).length;
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
              }
            }else{
              this.datalistitems = data;
            }
              this.HavingData=1;
            }else{
              this.HavingData=0;
            }
            this.datacountlist = Object.keys(this.datalistitems).length;
            this.loader=0;
        });
      }
  }

  onTabSelect(ev: any) {
    this.loader=1;
    this.sub_id=ev.id;
    this.selectTab = ev.index;
    this.datalistitems=[];
    this.day=0;
    this.HavingData=1;
    console.log(this.day);
    this.tabslisting();
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
  browser;
  itemView(item: any){
    //this.navCtrl.push('PdfviewPage', { item: item });
    let stringscode = 'pid='+item.product_id+'&userid='+this.userid;
    let Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){let t="";let n,r,i,s,o,u,a;let f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){let t="";let n,r,i;let s,o,u,a;let f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");let t="";for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){let t="";let n=0;let c1;let c2;let c3;let r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    let code = encodeURI(Base64.encode(stringscode));
    this.browser = this.inAppBrowser.create('https://estore.ibpsguide.com/pdfview/web/new_viewer_mobile.php?opencode='+code, '_self', {zoom:"no"});
  }
}
