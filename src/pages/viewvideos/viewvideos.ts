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
 * Generated class for the ViewvideosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewvideos',
  templateUrl: 'viewvideos.html',
})
export class ViewvideosPage {
  items;
  datalistitems=[];
  tabsKey = 'my-tabs-ViewvideosPage';
  tabsfilms: Observable<any>;
  userid;
  buy='0';
  title;

  loader=1;
  day=0;

  topics='';
  langs='1';
  subject='';
  Sections='';
  setimage;
  tabBarElement;
  products;
  datalistviditems;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,private cache: CacheService,public sanitizer: DomSanitizer,public storage: Storage,public conn: ConnectionsProvider,public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
   this.items = navParams.data.item;
   this.buy = navParams.data.buy;
   this.products = navParams.data.items;
   this.datalistviditems = navParams.data.datalistitems;
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

  getSafeUrlvid() {
    let url = this.items.iframe;
    let setdefault='https://estore.ibpsguide.com/img/video_thumb_default-min-min.jpg';
    if(url!=''&&url!=null&&this.items.pay_type=='0'){
       return this.sanitizer.bypassSecurityTrustResourceUrl('https://estore.ibpsguide.com/view_mob_videos.php?seturl='+url);		
    }else if(url!=''&&url!=null&&this.items.pay_type=='1'&&this.buy=='1'){
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://estore.ibpsguide.com/view_mob_videos.php?seturl='+url);		
    }else{
      return this.sanitizer.bypassSecurityTrustResourceUrl(setdefault);	
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

  getSafeUrlvid2(url) {
    let setdefault='assets/imgs/video_thumb_default-min-min.jpg';
    if(url!=''&&url!=null){
       return this.sanitizer.bypassSecurityTrustResourceUrl('https://estore.ibpsguide.com/ebook-admin/uploads/image/'+url);		
    }else{
      return this.sanitizer.bypassSecurityTrustResourceUrl(setdefault);	
    }
  }

  checkitvid(){
    if(this.items.pay_type=='0'){
      return true;
    }else if(this.items.pay_type=='1'&&this.buy=='1'&&this.items.active=='1'){ 
      return true;
    }
  }


  // Load either from API or Cache
  loadFilms(refresher?) {
  this.datalistitems=[];
  this.tabslisting(refresher);
  this.loader=0;
  }

  // Pull to refresh and force reload
  forceReload(refresher) {
    this.loadFilms(refresher);
  }

  tabslisting(refresher?) {
    if(this.items.mock_test!=''&&this.items.mock_test!=null){
    let url = 'https://app.ibpsguide.com/api/testlist_videcourses.php?mockid='+this.items.mock_test+'&userid='+this.userid;
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
        this.datalistitems = data;
        this.loader=0;
        refresher.complete();
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(data => {
        this.datalistitems = data;
        this.loader=0;
      });
    }
    
   this.loader=0;
  }else{
    this.loader=0;
    if (refresher) {
    refresher.complete();
    }
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

  pauseitemKey = [];
 getAllFavorites() {
   this.storage.forEach((v,k,i) => {
    this.pauseitemKey[k]=1;
  });
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

   itemSelectedvideos(item) {
    this.navCtrl.push('ViewvideosPage', { item: item, buy: this.buy, items: this.products, datalistitems: this.datalistviditems });
  }

}
