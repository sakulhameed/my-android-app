import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
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
  selector: 'page-testpurchase',
  templateUrl: 'testpurchase.html',
})
export class TestpurchasePage {
  userid;
  tabsKey = 'my-tabs-ProductlistPage';
  tabsfilms: Observable<any>;
  menuKey = 'my-menu-ProductlistPage';
  menufilms: Observable<any>;
  NewsPage='NewsPage';
  datalistitems=[];
  sub_id=0;
  day=0;
  HavingData=1;
  loader=1;
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  items = JSON.parse(localStorage.getItem("testseriescourses"));
  tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public cache: CacheService,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.userid = localStorage.getItem("clientid");
    //this.items = [];
    //this.menulisting();
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
    console.log(this.items);
    this.loadFilms();
    this.backhand.unregister();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
  }
  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);		
  }

  itemSelected(item: string) {
    if(this.sub_id!=100){
    this.navCtrl.push('ViewpackagePage', { item: item });
    }else{
      this.navCtrl.push('TestpackagePage', { item: item });
    }
  }
  /*
  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(image);
  }
  */

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
  datacountlist;
  tabslisting(refresher?) {
    let url = 'https://app.ibpsguide.com/api/purchase_userproducts.php?day='+this.day+'&type=2&catg='+this.sub_id+'&userid='+this.userid;
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
            for(var i in data) {
              this.datalistitems.push(data[i]);
            }
              this.HavingData=1;
            }else{
              this.HavingData=0;
            }
            this.loader=0;
            this.datacountlist = Object.keys(this.datalistitems).length;
          refresher.complete();
        });
      } else {
        this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
        this.tabsfilms.subscribe(data => {
          if(data.length>0){
            for(var i in data) {
              this.datalistitems.push(data[i]);
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

  menulisting() {
    let url = 'https://app.ibpsguide.com/api/new_productlisting.php?day='+this.day+'&type=2&catg='+this.sub_id+'&userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.items = data;
    });
  }

  onTabSelect(ev: any) {
    console.log(ev.id);
    this.sub_id=ev.id;
    this.selectTab = ev.index;
    this.day=0;
    this.loader=0;
    this.HavingData=1;
    this.datalistitems=[];
    this.tabslisting();
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

  doInfinite(infiniteScroll) {
    if(this.HavingData==1){
      this.day = this.day+1;
      this.tabslisting();
      }
      setTimeout(() => {
      infiniteScroll.complete();
      }, 1500);
  }

}
