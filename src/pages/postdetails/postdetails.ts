import { Component } from '@angular/core';
import { NavParams, ViewController,IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular'; 
import { LoadingController } from 'ionic-angular';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
import { AdMobFree, AdMobFreeBannerConfig,AdMobFreeRewardVideoConfig,AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

/**
 * Generated class for the PostdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-postdetails',
  templateUrl: 'postdetails.html',
})
export class PostdetailsPage  {
  items:any;
  storages;
  setjson=[];
  alreadyexit=0;
  userid;
  canShowToast;
  displayedToast;
  loader;
  browser;
  image;
  loadershow=true;tabBarElement;
  constructor(private admobFree: AdMobFree,public backhand: BackButtonEventHandlerProvider,public socialSharing: SocialSharing,private androidFullScreen: AndroidFullScreen,public inAppBrowser: InAppBrowser,public viewCtrl: ViewController,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.onloadingpage();
    this.items = navParams.data.item;
    this.image = this.items.thumbnail_images.full.url;
    this.userid = localStorage.getItem("clientid");
    this.loadershow=false;
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
  dismiss() {
    this.viewCtrl.dismiss();
  }
  transform(v:string):SafeHtml {
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
  onloadingpage() {
    this.loadershow=true;
  }

  admob(){
    let url = 'https://app.ibpsguide.com/api/json/admob.php?page=postdetails&userid='+this.userid;
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
