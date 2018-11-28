import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppRate } from '@ionic-native/app-rate';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
import { GooglePlus } from '@ionic-native/google-plus';


@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  pages = [];
  userid;
  datalistitems;
  setusername;
  setemail;
  userpoints;
  profileimage;
  loader;

  SubscribePage='SubscribePage';
  tabsKey = 'my-tabs-ProfilePage';
  tabsfilms: Observable<any>;
  NotificationPage = 'NotificationPage';
  loadershow=true;
  btntype=0;
  btnname;useralldata;
  message='Hello, Today I found a New Amazing "IBPSGuide Mobile App" which is useful for All Competitive Exam Preparation. Click to download: ';
  subject="Learn Wisely & Crack it.";
  file=null;
  link='https://ibpsgd.page.link/shareIGapp';
  constructor(public googlePlus: GooglePlus,public backhand: BackButtonEventHandlerProvider,public toastCtrl: ToastController,public storage: Storage,private androidFullScreen: AndroidFullScreen,public appRate: AppRate,public socialSharing: SocialSharing, private cache: CacheService, public sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
    this.userid = localStorage.getItem("clientid");
    this.profileimage = 'assets/imgs/user.png';
    this.onloadingpage();
    this.pages = [
      { title: 'My Purchase Test', component: 'TestpurchasePage', icon: 'paper' },
      { title: 'My Purchase Ebooks', component: 'EbookpurchasePage', icon: 'book' },
      { title: 'My Purchase videos', component: 'VideopurchasePage', icon: 'book' },
      { title: 'Update Payment', component: 'PaymentlistPage', icon: 'briefcase' },
      { title: 'My Cart', component: 'CartPage', icon: 'cart' },
      { title: 'Share App', component: 1, icon: 'share' },
      { title: 'Rating App', component: 2, icon: 'star-half' },
      { title: 'Bookmarks', component: 'BookmarkPage', icon: 'bookmarks' },
      { title: 'Clear Cache', component: 3, icon: 'cog' },
      //{ title: 'Settings', component: 'SettingsPage', icon: 'cog' },
      { title: 'Logout', component: 0, icon: 'log-out' }
    ];
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
    this.loadFilms();
    this.backhand.unregister();
    this.backhand.registerDoublePressToExitApp('FeedsPage',this.navCtrl);
  }
  share() {
    this.socialSharing.share(this.message,this.subject,this.file,this.link).then(()=>{

    }).catch(()=>{

    });
  }
  rating(){
    this.appRate.preferences = {
      displayAppName: 'IBPS Guide App',
      usesUntilPrompt: 5,
      inAppReview: true,
      promptAgainForEachNewVersion: true,
      storeAppURL: {
        android: 'https://play.google.com/store/apps/details?id=apps.ibpsguide.com'
      },
      customLocale: {
        title: 'Do you enjoy %@?',
        message: 'If you enjoy using %@, would you mind taking a moment to rate it? Thanks so much!',
        cancelButtonLabel: 'No, Thanks',
        laterButtonLabel: 'Remind Me Later',
        rateButtonLabel: 'Rate It Now',
        yesButtonLabel: "Yes!",
        noButtonLabel: "Not really",
        appRatePromptTitle: 'Do you like using %@',
        feedbackPromptTitle: 'Mind giving us some feedback?',
      },
      callbacks: {
        onRateDialogShow: function(callback){
          console.log('rate dialog shown!');
        },
        handleNegativeFeedback: function(){
          window.open('mailto:support@ibpsguide.com','_system');
        },
        onButtonClicked: function(buttonIndex){
          console.log('Selected index: -> ' + buttonIndex);
        }
      }
    };
    // Opens the rating immediately no matter what preferences you set
    this.appRate.promptForRating(true);
  }
  getSafeUrl(url) {
    if (url != '') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      return 'assets/imgs/user.png';
    }
  }
  onloadingpage() {
    this.loadershow=true;
  }
  ionViewDidLoad() {
    //this.onloadingpage();
  }
  itemSelectedpack(p) {
    this.navCtrl.push(p);
  }
  openPage(page) {
    if (page.component == 0) {
      this.googlelogout();
      localStorage.removeItem("clientid");
      localStorage.clear();
      this.cache.clearAll();
      this.storage.clear();
      this.navCtrl.setRoot('LoginPage');
    }else if (page.component == 3) {
      this.cache.clearAll();
      this.storage.clear();
      this.toastCtrl.create({
        message: 'Cache Cleared',
        showCloseButton: true,
        closeButtonText: 'Ok'
      }).present();

    } else if (page.component == 1) {
      this.share();
    }else if (page.component == 2) {
      this.rating();
    } else {
      this.navCtrl.push(page.component);
    }
  }


  // Load either from API or Cache
  loadFilms(refresher?) {
    this.loadershow=true;
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
    let url = 'https://app.ibpsguide.com/api/userdetails.php?userid=' + this.userid;
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
        this.setusername = this.datalistitems.username;
        this.setemail = this.datalistitems.email;
        this.userpoints = this.datalistitems.user_points;
        this.profileimage = this.datalistitems.profile_image;
        this.btntype = this.datalistitems.btntype;
        this.btnname = this.datalistitems.btnname;
        refresher.complete();
        this.loadershow=false;
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(data => {
        this.datalistitems = data;
        this.setusername = this.datalistitems.username;
        this.setemail = this.datalistitems.email;
        this.userpoints = this.datalistitems.user_points;
        this.profileimage = this.datalistitems.profile_image;
        this.btntype = this.datalistitems.btntype;
        this.btntype = this.datalistitems.btntype;
        this.btnname = this.datalistitems.btnname;
        this.loadershow=false;
      });
    }
  }
  tabBarElement;
  ionViewDidEnter() {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'flex';
  }

  googlelogout(){
    /*
    {
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '239906844101-7av7o3qvg33u483pno5lupvuev1dc337.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': false
    }
    */
    this.googlePlus.logout()
    .then(res => {
        console.log(res);
      })
    .catch(err => console.error(err));
  }
}
