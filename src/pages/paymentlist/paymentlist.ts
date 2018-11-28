import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular'; 
import { LoadingController } from 'ionic-angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the PaymentlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-paymentlist',
  templateUrl: 'paymentlist.html',
})
export class PaymentlistPage {
  datalistitems:any;
  userid;
  loader;
  tabsKey = 'my-tabs-PaymentlistPage';
  tabsfilms: Observable<any>;
  loadershow=true;tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,private cache: CacheService,public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.userid = localStorage.getItem("clientid");
     this.onloadingpage();
     this.androidFullScreen.isImmersiveModeSupported()
    .then(() =>this.androidFullScreen.immersiveMode())
    .catch(err => console.log(err));
     this.loadFilms();
     this.backhand.unregister();
     this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
  }
  
  onloadingpage() {
    this.loadershow=true;
  }
  ionViewDidLoad() {
    
  }
  
    
  updatepay(){
    this.onloadingpage();
    this.http.get('https://app.ibpsguide.com/api/updatemobpurchase.php?userid='+this.userid).map(res => res.json()).subscribe(data => {
      this.loadershow=false;
      },
      err => {
        this.loadershow=false;
        alert('Error On Your Connections');
      });
  }
  
  delmainclass(d){
    return 'order-status-timeline-completion c'+d;
  }
  delmainname(d){
    if(d=='0'){
      return 'Accepted';
    }else if(d=='1'){
      return 'In progress';
    }else if(d=='2'){
      return 'Shipped';
    }else if(d=='3'){
      return 'Delivered';
    }else if(d=='4'){
      return 'Completed';
    }
  }
  // Load either from API or Cache
  loadFilms(refresher?) {
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
    this.loadershow=true;
    this.loadFilms(refresher);
  }
  
  
  tabslisting(refresher?){
    let url = 'https://app.ibpsguide.com/api/paymentlist.php?userid='+this.userid;
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
        refresher.complete();
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(data => {
        this.datalistitems = data;
      });
    }
    this.loadershow=false;
  }
  }
  