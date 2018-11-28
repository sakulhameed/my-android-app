import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides,IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Firebase } from '@ionic-native/firebase';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  loader;
  items;
  parctice_items;
  slideData = [];
  showslide = 0;
  showlive = 0; 
  userid;
  browser;
  LivetestlistPage = 'LivetestlistPage';
  TestpackagePage = 'TestpackagePage';
  DailyquizPage = 'DailyquizPage';
  CartPage = 'CartPage';
  NotificationPage = 'NotificationPage';
  tabsKey = 'my-tabs-post';
  tabsfilms: Observable<any>;
  offerKey = 'my-offers-home';
  offerfilms: Observable<any>;  

  liveKey = 'my-livetest-home';

  userdetails;liveData;
  username;
  msg;tredData;tabBarElement;datalistitems;

  constructor(public firebase: Firebase,public oneSignal: OneSignal,public backhand: BackButtonEventHandlerProvider,public socialSharing: SocialSharing,public alertCtrl: AlertController, public inAppBrowser: InAppBrowser, private cache: CacheService, public sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public http: Http, private androidFullScreen: AndroidFullScreen) {
    this.userid = localStorage.getItem("clientid");
    this.userdetails = JSON.parse(localStorage.getItem("alldataofuser"));
    this.username = this.userdetails['alldata']['username']
    this.appupdatealert();
    let now = new Date();
    let hrs = now.getHours();
    
    if (hrs >= 0) this.msg = "Hey, you are still with us!! Great!!"; 
    if (hrs > 4) this.msg = "Good morning!! You are shining ahead of the Sun!!:)";  
    if (hrs > 6) this.msg = "Good morning!! Kick start your preparations with a sense of Clarity!!";  
    if (hrs > 12) this.msg = "Good afternoon!! Let’s continue your preparations with us!!"; 
    if (hrs > 17) this.msg = "Good evening!! Hope, you had a Good Day!! Keep practising with IG!!";  

    this.loadFilms();
    this.androidFullScreen.isImmersiveModeSupported()
    .then(() =>this.androidFullScreen.immersiveMode())
    .catch(err => console.log(err));

    this.parctice_items = [
      { title: 'Live Test', component: 'LivetestlistPage', icon: 'assets/imgs/livetest.png',id: '0' },
      { title: 'Video Courses', component: 'EbooksPage', icon: 'assets/imgs/video_courses.png',id: '0',Secitem: '4' },
      { title: 'Blog', component: 'PostlistPage', icon: 'assets/imgs/Articles.png', id: '10' },
      { title: 'Subscribe', component: 'SubscribePage', icon: 'assets/imgs/pack.png', id: '100' },
      { title: 'Banking', component: 'EbooksPage', icon: 'assets/imgs/BankApp.png', id: '1',Secitem: '2' },
      { title: 'Railway', component: 'EbooksPage', icon: 'assets/imgs/Railway-App.png', id: '3',Secitem: '2' },
      { title: 'SCC', component: 'EbooksPage', icon: 'assets/imgs/sscApp.png', id: '2',Secitem: '2' }  
    ];
    this.backhand.unregister();
    this.backhand.registerDoublePressToExitApp('HomePage',this.navCtrl);
  }
  openPage(page) {
    if(page.component=='EbooksPage'){
      this.navCtrl.push(page.component,{ itemforhome: page,Secitem: page.Secitem });
    }else{
      this.navCtrl.push(page.component);
    }
  }
  openofferpage(url) {
    if(url!=null&&url!=''){
    let seturl = url+'&userid=' + this.userid;
    this.browser = this.inAppBrowser.create(seturl, '_self', {zoom:"no"});
    }
  }

  firebaseopen(){
    
    this.firebase.getToken()
    .then(token =>{
      this.getTokens(token);
    }) // save the token server-side and use it to push notifications to this device
    .catch(error => console.log('Error getting token'));
    this.firebase.onTokenRefresh()
    .subscribe((token: string) => { this.getTokens(token); } );
    
    this.firebase.onNotificationOpen().subscribe( data => {
      if(data['page']!='home'){
        if(data['page']=='browser'){
          this.browser = this.inAppBrowser.create(data['url'], '_system', {zoom:"no"});
        }else{
        let pagesdata = data['page'];
        this.navCtrl.push(pagesdata,{ item: data });
        }
      }
    });
    
	  let d = new Date(); 
    this.firebase.logEvent("page_view", {page: 'Home '+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()});
    
  }

  openPostlist(){
    this.navCtrl.push('PostlistPage');
  }

  getTokens(t){
    this.http.get('https://app.ibpsguide.com/api/usertoken.php?tokens='+encodeURIComponent(t)+'&userid='+this.userid).map(res => res.json()).subscribe(data => {
    });
  }
  appupdatealert(){
    this.http.get('https://app.ibpsguide.com/api/updateapp.php?appv=1.1.25').map(res => res.json()).subscribe(data => {
    if(data['update']==1){
      this.browser = this.inAppBrowser.create('https://play.google.com/store/apps/details?id=apps.ibpsguide.com', '_system', {zoom:"no"});
    }
    });
  }

  itemSelected(item) {
    this.navCtrl.push('PostdetailsPage', { item: item });
  }
  itemSelectedtrd(item){
    console.log(item);
    this.navCtrl.push('EbooksPage', { item: item });
  }
  
  itemSelectedPackage(item: string) {
    this.navCtrl.push('PackagelistPage', { item: item });
  }
  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //short charatrer length
  shortstring(item: string) {
    if (item.length <= 250) {
      return item;
    }
    return item.substr(0, 250) + '..';
  }

  paritemSelected(item: string, type) {
    if (type == '1') {
      this.navCtrl.push('ResultPage', { item: item });
    } else if (type == '2') {
      this.navCtrl.push('TestpanelPage', { item: item });
    }
    
  }
  testpackageview(p){
    this.navCtrl.push(p);
  }

  // Load either from API or Cache
  loadFilms(refresher?) {
    this.offerslisting(refresher);
    this.livetestlisting();
    this.tredlisting(refresher);
    this.tabslisting(refresher);
    this.Testcoursepackage();
  }

  testitems = [
    { "id":"0","name": 'All',"type":"0"},
    { "id":"100","name": 'Combo Package',"type":"0"},
  ];

  Testcoursepackage(){
      this.http.get('https://app.ibpsguide.com/api/list_course.php?userid='+this.userid)
      .map(res => res.json()).subscribe(data => {
        for(var i in data) {
          this.testitems.push(data[i]);
        }
        localStorage.setItem("testseriescourses",JSON.stringify(this.testitems));
      });
  }
  // Pull to refresh and force reload
  forceReload(refresher) {
    this.loadFilms(refresher);
  }

  transform(v: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }
  

  offerslisting(refresher?) {
    let url = 'https://app.ibpsguide.com/api/offerslider.php';
    let req = this.http.get(url)
      .map(res => {
        return res.json();
      });
    let ttl = 60 * 60 * 1;
    if (refresher) {
      let delayType = 'all';
      this.offerfilms = this.cache.loadFromDelayedObservable(url, req, this.offerKey, ttl, delayType);
      this.offerfilms.subscribe(data => {
        if (parseInt(data.length) > 0) {
          this.slideData = data;
          this.showslide = 1;
        }
        refresher.complete();
      });
    } else {
      this.offerfilms = this.cache.loadFromObservable(url, req, this.offerKey, ttl);
      this.offerfilms.subscribe(data => {
        if (parseInt(data.length) > 0) {
          this.slideData = data;
          this.showslide = 1;
        }
      });
    }
  }

  livetestlisting() {
    let url = 'https://app.ibpsguide.com/api/livetestlist1.php?userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      if (parseInt(data.length) > 0) {
        this.liveData = data;
        this.showlive = 1;
      }
      console.log(data);
      });
  }

  tredlisting(refresher?) {
    let url = 'https://app.ibpsguide.com/api/json/trend.php';
    let req = this.http.get(url)
      .map(res => {
        return res.json();
      });
    let ttl = 60 * 60 * 10;
    if (refresher) {
      let delayType = 'all';
      this.offerfilms = this.cache.loadFromDelayedObservable(url, req, this.liveKey, ttl, delayType);
      this.offerfilms.subscribe(data => {
        this.tredData = data;
        refresher.complete();
      });
    } else {
      this.offerfilms = this.cache.loadFromObservable(url, req, this.liveKey, ttl);
      this.offerfilms.subscribe(data => {
          this.tredData = data;
      });
    }
  }
  liveTestSelected(item, type) {
    if (type == '1') {
      this.navCtrl.push('TestpanelPage', { item: item });
    }else if (type == '4') {
      this.navCtrl.push('LeaderboardPage', { item: item });
    }else{
    const alert = this.alertCtrl.create({
      title: 'Hi Friend!',
      subTitle: item.btnname,
      buttons: ['OK']
    });
    alert.present();
    }
  }

  Onesignal(){
    
    this.oneSignal.startInit('1344def8-a8d4-49f0-9b2d-a3a6f5df279f', '239906844101');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
    this.oneSignal.handleNotificationReceived().subscribe(data => {
    });
    
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      let getdata = data.notification.payload;
      let additionalData = getdata.additionalData;

      if(additionalData.page!='home'){
        if(additionalData.page=='browser'){
          this.browser = this.inAppBrowser.create(additionalData.url, '_system', {zoom:"no"});
        }else{
        let pagesdata = additionalData;
        this.navCtrl.push(pagesdata,{ item: additionalData });
        }
      }

     });
     this.oneSignal.endInit();
     
  }
  
  ionViewDidEnter() {
    this.firebaseopen();
    this.Onesignal(); 
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'flex';
  }
  
  
  tabslisting(refresher?) {   
    let url = 'https://www.ibpsguide.com/wp-mobiles/get_recent_posts.php';

    let req = this.http.get(url)
      .map(res => {
        return res.json();
      });
    let ttl = 60 * 60 * 2;
    if (refresher) {
      // Reload data even if it is cached
      let delayType = 'all';
      this.tabsfilms = this.cache.loadFromDelayedObservable(url, req, this.tabsKey, ttl, delayType);
      // Hide the refresher once loading is done
      this.tabsfilms.subscribe(setdata => {
        let data = setdata['posts'];
        this.datalistitems = data;
        refresher.complete();
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(setdata => {
        let data = setdata['posts'];
        this.datalistitems = data;
      });
    }

  }
  seconds;
  curseconds;
  dateformats(d){
    this.seconds =  new Date(d).getTime() / 1000;
    this.curseconds = new Date().getTime() / 1000;
    let time = parseInt(this.curseconds)-parseInt(this.seconds);
    let days = Math.floor(time / (3600*24));
    let hrs   = Math.floor(time / 3600);
    let mnts = Math.floor(time / 60);

    if(days>0){
      return days+' Days Ago';
    }
    if(hrs>0){
      return hrs+' Hrs Ago';
    }
    if(mnts>0){
      return mnts+' Mins Ago';
    }
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
}
