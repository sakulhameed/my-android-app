import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController } from 'ionic-angular';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SuperTabs } from 'ionic2-super-tabs';
import { ToastController,AlertController } from 'ionic-angular'; 
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
  selector: 'page-ebooks',
  templateUrl: 'ebooks.html',
})
export class EbooksPage {
  items = [
    { id: '0',name: 'All',sub_page: 'NewsPage'},
    { id: '1',name: 'Current Affairs',sub_page: 'NewsPage'},
    { id: '2',name: 'Quantitative Aptitude ',sub_page: 'NewsPage'},
    { id: '3',name: 'Reasoning Ability',sub_page: 'NewsPage' },
    { id: '4',name: 'English Language',sub_page: 'NewsPage'},
    { id: '5',name: 'Banking Awareness',sub_page: 'NewsPage'},
    { id: '6',name: 'Insurance Awareness',sub_page: 'NewsPage'},
    { id: '7',name: 'Professional Knowledge',sub_page: 'NewsPage'}
  ];
  userid;
  CartPage = 'CartPage';
  NotificationPage = 'NotificationPage';
  tabsKey = 'my-tabs-ProductlistPage';
  tabsfilms: Observable<any>;
  datalistitems=[];
  sub_id=0;
  HavingData=1;
  day=0;
  loader=1;
  Section = 2;
  selectTab=0;
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  datacounts=0;
  testitems = JSON.parse(localStorage.getItem("testseriescourses"));
  checkfilterlist=[];
  NewsPage='NewsPage';
  itemparams;
  constructor(public alertCtrl: AlertController,public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public toastCtrl: ToastController,public inAppBrowser: InAppBrowser,public loadingCtrl: LoadingController,private cache: CacheService,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.userid = localStorage.getItem("clientid");
    if (typeof navParams.data.Secitem !== 'undefined') {
      this.Section = navParams.data.Secitem;
    }
    if (typeof navParams.data.item !== 'undefined') {
      this.itemparams = navParams.data.item;
      this.selectTab =  this.itemparams.url;
      this.sub_id = this.itemparams.id;
    }
    if (typeof navParams.data.itemforhome !== 'undefined') {
      this.itemparams = navParams.data.itemforhome;
      this.checkfilterlist=[];
      for(var i in this.testitems) {
      if(this.itemparams.id==this.testitems[i].type){
        this.checkfilterlist.push(this.testitems[i]);
      }
      }
      this.testitems = this.checkfilterlist;
      this.sub_id = parseInt(this.testitems[0]['id']);
    }

    console.log(this.testitems);
    
    this.loadFilms();
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   this.backhand.unregister();
   this.backhand.registerDoublePressToExitApp('FeedsPage',this.navCtrl);
  }
  itemSelectedpack(p) {
    this.navCtrl.push(p);
  }
  onSecChange(){
    this.loader=1;
    this.sub_id=0;
    this.selectTab = 0;
    this.datalistitems=[];
    this.day=0;
    this.HavingData=1;
    this.loadFilms();
  }
  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);		
  }
  itemSelected(item: string) {
    this.navCtrl.push('ProductdetailsPage', { item: item,Section: this.Section });
  }

  itemSelecteddetails(item) {
    if(this.Section!=4){
    if(item.combo!='1'){
    this.navCtrl.push('ViewpackagePage', { item: item });
    }else{
      this.navCtrl.push('TestpackagePage', { item: item });
    }
    }else{
      this.navCtrl.push('VideocoursesPage', { item: item });
    }
  }
/*
  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(image);
  }
  */
  addtocart(item: any){
    if(item.purchase=='1'){
    this.navCtrl.push('PdfviewPage', { item: item });
    }else{
    let nameofprd='Ebook';
    if(this.Section==2){
      nameofprd = 'Package';
    }else if(this.Section==3){
      nameofprd = 'Book';
    }else if(this.Section==4){
      nameofprd = 'Video Courses';
    }
    this.http.get('https://app.ibpsguide.com/api/addtocart.php?userid='+this.userid+'&prdid='+item.product_id).map(res => res.json()).subscribe(data => {
      if(data['res']=='alreadyexit'){
        this.presentToast(nameofprd+' Already Add To Your Cart',3000);
      }else if(data['res']=='new-purchased'){
        this.presentToast(nameofprd+' Added To Your Account',3000);
        item.purchase=1;
      }else if(data['res']=='addtocard'){
        this.presentToast(nameofprd+' Add To Your Cart',3000);
      }
      },
      err => {
        alert('Error On Your Connections');
      });
    }
  }



  // Load either from API or Cache
  loadFilms(refresher?) {
    this.datalistitems=[];
    this.day=0;
    this.loader=1;
    this.HavingData=1;
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
    let url = 'https://app.ibpsguide.com/api/new_productlisting.php?day='+this.day+'&type='+this.Section+'&catg='+this.sub_id+'&userid='+this.userid;
    console.log(url);
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
        this.datacounts = this.datalistitems.length;
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
          this.datacounts = this.datalistitems.length;
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
    this.tabslisting();
  }
  
  slideToIndex(e){
    let limit =0;
    if(this.Section==1){
    limit = this.items.length-1;
    }else{
    limit = this.testitems.length-1;
    }
    
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


  browser;
  itemView(item: any){
    //this.navCtrl.push('PdfviewPage', { item: item });
    let stringscode = 'pid='+item.product_id+'&userid='+this.userid;
    let Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){let t="";let n,r,i,s,o,u,a;let f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){let t="";let n,r,i;let s,o,u,a;let f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");let t="";for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){let t="";let n=0;let c1;let c2;let c3;let r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    let code = encodeURI(Base64.encode(stringscode));
    this.browser = this.inAppBrowser.create('https://estore.ibpsguide.com/pdfview/web/new_viewer_mobile.php?opencode='+code, '_self', {zoom:"no"});
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
  tabBarElement;
  getmobile='0';
  ionViewDidEnter() {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'flex';
  }

  buynow(item){
    if(this.getmobile=='1'){  
      this.propayment(item);
    }else{
      this.showmobilePrompt(item);
    }
  }

  propayment(item){
    let url ='https://estore.ibpsguide.com/new_mobile_order_combo.php?userid='+this.userid+'&prdid='+item.product_id;
    this.browser = this.inAppBrowser.create(url, '_self', {zoom:"no"});
  }
  
  showmobilePrompt(item) {
    const prompt = this.alertCtrl.create({
      title: 'Before Payment',
      message: "Enter a Mobile Number to Process Payment.",
      inputs: [
        {
          name: 'MobileNumber',
          placeholder: 'Mobile Number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            let phoneno = /^\d{10}$/;
            if((data.MobileNumber.match(phoneno))){
              this.http.get('https://app.ibpsguide.com/api/mobilenum_update.php?userid='+this.userid+'&mobile='+data.MobileNumber).map(res => res.json()).subscribe(data => {
              this.propayment(item);
              },
              err => {
              alert('Error On Your Connections');
              });
            }else{
              const toast = this.toastCtrl.create({
                message: 'invalid Mobile number',
                duration: 2000,
                showCloseButton: true,
                closeButtonText: 'Ok'
              });
              toast.present();
              this.showmobilePrompt(item);
            }
          }
        }
      ]
    });
    prompt.present();
  }

}
