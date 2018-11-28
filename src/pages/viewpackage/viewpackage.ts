import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular'; 
import { ConnectionsProvider } from '../../providers/connections/connections';
import { Storage } from '@ionic/storage';

import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { DomSanitizer } from '@angular/platform-browser';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';


@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-viewpackage',
  templateUrl: 'viewpackage.html',
})
export class ViewpackagePage {
  items;
  datalistitems=[];
  tabsKey = 'my-tabs-ViewpackagePageNew';
  tabsfilms: Observable<any>;
  sec=[];
  userid;
  sub_id=0;
  day=0;
  HavingData=1;
  title;
  loader=1;
  langs='1';
  setimage;
  buy='1';packagestylecus;
  packagestyele;tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,private cache: CacheService,public sanitizer: DomSanitizer,public storage: Storage,public conn: ConnectionsProvider,public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
   this.items = navParams.data.item;
   this.setimage = this.items.image;
   this.packagestylecus = this.items.packagestylecus;
   this.title = this.items.title;
   this.packagestyele = this.items.packagestyele;
   this.userid = localStorage.getItem("clientid");
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
  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(image);
  }
  onTabSelect(ev: any) {
    console.log(ev.id);
    this.sub_id=ev.id;
    this.day=0;
    this.loader=1;
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
  changeTab(lang){
    this.langs=lang;
    this.HavingData=1;
    this.datalistitems=[];
    this.loadFilms();
  }
  

  tabslisting(refresher?) {
    let url = 'https://app.ibpsguide.com/api/new_productdetails_buy.php?lang='+this.langs+'&day='+this.day+'&prdtid='+this.items.product_id+'&userid='+this.userid;
   
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
      this.tabsfilms.subscribe(datavr => {
        let data = datavr['data'];
        if(data.length>0){
          if(this.day!=0){
            for(var i in data) {
              this.datalistitems.push(data[i]);
            }
          }else{
            this.datalistitems = data;
            this.buy = datavr['setbuy'];
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
      this.tabsfilms.subscribe(datavr => {
        let data = datavr['data'];
        if(data.length>0){
          if(this.day!=0){
            for(var i in data) {
              this.datalistitems.push(data[i]);
            }
          }else{
            this.datalistitems = data;
            this.buy = datavr['setbuy'];
          }
            this.HavingData=1;
          }else{
            this.HavingData=0;
          }
          this.loader=0;
      });
    }

  }


  ionViewDidEnter() {
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
    }else if(type=='3'){
      this.addtocart(this.items);
    }
  }

  addtocart(item: any){
    if(item.purchase=='1'){
    this.navCtrl.push('PdfviewPage', { item: item });
    }else{
    this.http.get('https://app.ibpsguide.com/api/addtocart.php?userid='+this.userid+'&prdid='+item.product_id).map(res => res.json()).subscribe(data => {
      if(data['res']=='alreadyexit'){
        this.presentToast('Package Already Add To Your Cart',3000);
      }else if(data['res']=='new-purchased'){
        this.presentToast('Package Added To Your Account',3000);
        item.purchase=1;
      }else if(data['res']=='addtocard'){
        this.presentToast('Package Add To Your Cart',3000);
      }
      },
      err => {
        alert('Error On Your Connections');
      });
    }
  }
  canShowToast = true;
  displayedToast;
  presentToast(msg: string, time = 3000) {
    if (this.canShowToast) {
      this.canShowToast = false;
      this.displayedToast = this.toastCtrl.create({
        message: msg,
        position: 'top',
        showCloseButton: true,
        closeButtonText: 'Cart',
        duration: 2000
      });
  
      this.displayedToast.present();
      this.displayedToast.onDidDismiss(() => {
        this.canShowToast = true;
        this.navCtrl.push('CartPage');
      });
  
    } else {
      this.displayedToast.setMessage(msg);
    }
  }

 pauseitemKey = [];
 getAllFavorites() {
   this.storage.forEach((v,k,i) => {
    this.pauseitemKey[k]=1;
  });
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
     if(type!=3){
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
       return 'lock';
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

}
