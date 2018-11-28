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
  selector: 'page-videocourses',
  templateUrl: 'videocourses.html',
})
export class VideocoursesPage {
  items;
  datalistitems=[];
  datalistsub=[];
  datalisttopic=[];
  tabsKey = 'my-tabs-ViewpackagePage';
  tabsfilms: Observable<any>;
  userid;
  title;
  loader=1;
  day=0;
  buy='0';
  topics='';
  langs='1';
  subject='';
  Sections='';
  setimage;
  packagestylecus;
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
  getSafeUrlvid(url) {
    let setdefault='assets/imgs/video_thumb_default-min-min.jpg';
    if(url!=''&&url!=null){
       return this.sanitizer.bypassSecurityTrustResourceUrl('https://estore.ibpsguide.com/ebook-admin/uploads/image/'+url);		
    }else{
      return this.sanitizer.bypassSecurityTrustResourceUrl(setdefault);	
    }
  }
  onSecChange(){
    let item = this.datalistsub[this.subject];
    this.topics='';
    this.Sections= item['id'];
    this.datalisttopic=item['topics'];
  }

   // Load either from API or Cache
   loadFilms(refresher?) {
    this.datalistitems=[];
    this.tabslisting(refresher);
   }

  // Pull to refresh and force reload
  forceReload(refresher) {
    this.loadFilms(refresher);
  }
  onSecChangetp(){
   console.log(this.topics);
  }
  

  tabslisting(refresher?) {
    let url = 'https://app.ibpsguide.com/api/new_videolists.php?subject='+this.subject+'&topic='+this.topics+'&lang='+this.langs+'&day='+this.day+'&prdtid='+this.items.product_id+'&userid='+this.userid;
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
        this.datalistitems = data['data'];
        this.datalistsub = data['options'];
        this.buy = data['buy'];
        this.subject='0';
        this.onSecChange();
        this.loader=0;
        refresher.complete();
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(data => {
        this.datalistitems = data['data'];
        this.datalistsub = data['options'];
        this.buy = data['buy'];
        this.subject='0';
        this.onSecChange();
        this.loader=0;
      });
    }

  }

  geticonsimgs(item){
    if(item.pay_type=='0'){
      return "assets/imgs/playbtninimage.png"
    }else if(this.buy=='1'&&item.pay_type=='1'){
      return "assets/imgs/playbtninimage.png"
    }else{
      return "assets/imgs/lockplay_thumb_new.png";
    }
  }

  ionViewDidEnter() {
    this.loadFilms();
  }
  

  addtocart(item: any){
    console.log(item);
    this.http.get('https://app.ibpsguide.com/api/addtocart.php?userid='+this.userid+'&prdid='+item.product_id).map(res => res.json()).subscribe(data => {
      if(data['res']=='alreadyexit'){
        this.presentToast('Video Courses Already Add To Your Cart',3000);
      }else if(data['res']=='new-purchased'){
        this.presentToast('Video Courses Added To Your Account',3000);
        item.purchase=1;
      }else if(data['res']=='addtocard'){
        this.presentToast('Video Courses Add To Your Cart',3000);
      }
      },
      err => {
        alert('Error On Your Connections');
      });
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

  itemSelected(item) {
    this.navCtrl.push('ViewvideosPage', { item: item, buy: this.buy, items: this.items, datalistitems: this.datalistitems });
  }

}
