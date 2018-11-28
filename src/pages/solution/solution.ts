import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertController } from 'ionic-angular';
import { ConnectionsProvider } from '../../providers/connections/connections';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AdMobFree, AdMobFreeBannerConfig,AdMobFreeRewardVideoConfig,AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

/**
 * Generated class for the SolutionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-solution',
  templateUrl: 'solution.html',
})
export class SolutionPage {
  testlangtype = 1;
  lang = 1;
  userid;
  items;
  tabBarElement;
  datajson;
  questions;
  name;
  sectioncount;
  section;
  Section = 0;
  currentques = 1;
  tot_ques;
  menuopen=0;
  quescomments='';
  quesanswered=0;
  quesskipped=0;
  quesunseen=0;

  solutioname;
  loadershow=true;
  DataGetLocal;
  tabsKey = 'my-tabs-ResultPage';
  tabsfilms: Observable<any>;

  constructor(private admobFree: AdMobFree,public inAppBrowser: InAppBrowser,public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,private cache: CacheService,public storage: Storage,public toastCtrl: ToastController,public conn: ConnectionsProvider, public alertCtrl: AlertController, public sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
    this.items = navParams.data.item;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
    this.userid = localStorage.getItem("clientid");
    this.solutioname = 'solutions-'+this.items.testpaneltype+'-'+this.userid+'-'+this.items.test_id;
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
    this.loadFilms();
    this.backhand.unregister();
    this.admob();

    console.log(this.items);
  }

  OngetData(data){
      this.datajson = data;
      this.questions = this.datajson['questions'];
      this.name = this.datajson['name'];
      this.section = this.datajson['section'];
      this.sectioncount = this.datajson['sectioncount'];
      this.testlangtype = this.datajson['lang_type'];
      this.tot_ques = this.datajson['tot_ques'];
      // Store
      this.storage.remove(this.solutioname);
      this.storage.set(this.solutioname, JSON.stringify(data));

      this.countques();
  }

  SectionTab(v){
    this.Section=v;
    console.log(this.Section);
    this.onSecChange();
  }
  // Load either from API or Cache
  loadFilms(refresher?) {
    this.loadershow=true;
    this.tabslisting(refresher);
  }
  // Pull to refresh and force reload
  forceReload(refresher) {
    this.loadFilms(refresher);
  }

  tabslisting(refresher?) {
    let url = 'https://app.ibpsguide.com/api/solution_page.php?testpaneltype='+this.items.testpaneltype+'&resultid=' + this.items.id + '&testid=' + this.items.test_id + '&userid=' + this.userid;
    let req = this.http.get(url)
      .map(res => {
        return res.json();
      });
    let ttl = 60 * 60 * 20;
    if (refresher) {
      // Reload data even if it is cached
      let delayType = 'all';
      this.tabsfilms = this.cache.loadFromDelayedObservable(url, req, this.tabsKey, ttl, delayType);
      // Hide the refresher once loading is done
      this.tabsfilms.subscribe(data => {
        this.OngetData(data);
        refresher.complete();      
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(data => {
        this.OngetData(data);
        this.toastCtrl.create({
          message: 'Solution Refreshed',
          position: 'top',
          duration: 500,
          showCloseButton: false,
          closeButtonText: 'Ok'
          }).present();
      });
    }
  }

  onSubmit() {
    if(this.conn.Onconnection()){
    let s=this.Section;
    let q=this.currentques-1;
    let quesid=this.questions[s][q]['ques_id'];
  if(this.quescomments!=''){
	this.http.get('https://app.ibpsguide.com/api/ques_comments.php?testpaneltype='+this.items.testpaneltype+'&comment='+encodeURIComponent(this.quescomments)+'&userid='+encodeURIComponent(this.userid)+'&quesid='+encodeURIComponent(quesid))
    .map(res => res.json()).subscribe(data => {
      this.toastCtrl.create({
        message: 'your report has been submitted',
        position: 'top',
        duration: 2000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      }).present();
    },
    err => {
      alert('Error On Your Connections');
   });
   }
  }else{
    this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Error in Your Internet Connections',
      duration:3000
    }).present();
  }
  }
  BookmarkDeleted(q,s) {
    let ques_id=this.questions[s][q]['ques_id'];
    console.log(this.questions[s][q]);
    let testpaneltype =this.items.testpaneltype;
    let url = 'https://app.ibpsguide.com/api/delbookmark.php?testpaneltype='+testpaneltype+'&ques_id='+ques_id+'&userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.questions[s][q]['bookmark']=0;
      this.toastCtrl.create({
        message: 'Bookmark Removed',
        position: 'top',
        duration: 2000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      }).present();
    });
    
  }
  browser;
  openvvideos(link){
    if(link!=''||link=='0'){
      this.browser = this.inAppBrowser.create(link, '_self', {zoom:"no"});
    }
  }
  onSubmitBookmark(q,s) {
    if(this.conn.Onconnection()){
    let quesid=this.questions[s][q]['ques_id'];
    console.log(this.questions[s][q]);
  	this.http.get('https://app.ibpsguide.com/api/bookmark.php?testpaneltype='+this.items.testpaneltype+'&userid='+encodeURIComponent(this.userid)+'&quesid='+encodeURIComponent(quesid))
    .map(res => res.json()).subscribe(data => {
      this.questions[s][q]['bookmark']=1;
      this.toastCtrl.create({
        message: 'Added to Bookmark',
        position: 'top',
        duration: 2000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      }).present();
    },
    err => {
      alert('Error On Your Connections');
    });
  }else{
    this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Error in Your Internet Connections',
      duration:3000
    }).present();
  }
  }
  openReport(){
    let alert = this.alertCtrl.create({
      title: 'Report this Question',
      inputs: [
        {
          name: 'Explain',
          type: 'text',
          placeholder: 'explain'
        },
      ],
      
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Report',
          handler: data => {
            console.log(data);
            this.quescomments = data.Explain;
            this.onSubmit();
          }
        }
      ]
    });
    alert.present();
  }
  ionViewDidLoad() {
    this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 1000,
      dismissOnPageChange: true
    }).present();
  }

  onSecChange() {
    this.currentques = this.questions[this.Section][0]['quesorder'];
  }
  onSelectQues(q, s) {
    this.Section = s;
    this.currentques = q;
    this.menuopen=0;
  }
  closedmenu(){
    this.menuopen=0;
  }
  transform(v: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }
  countques(){
    this.quesanswered=0;
    this.quesskipped=0;
    
    for(let data of this.questions) {
      for(let q of data) {
        if (q['ans_status'] == "answered") {
          if (q['answeroptn'] == q['answer']) {
            this.quesanswered++;
          } else {
            this.quesskipped++;
          }
        } 
      }
    }
    this.quesunseen=parseInt(this.tot_ques)-(this.quesanswered+this.quesskipped);
  }
  onQuesChanged(e, qv, s) {
    let last = this.section[s]['lques'];
    let start = this.section[s]['sques']+1;
    if (e.direction === 2) {
      if (this.currentques != last) {
        this.currentques++;
      } else {
        if (this.currentques == this.tot_ques) {

        } else {
          let confirm = this.alertCtrl.create({
            title: 'Switch To Next Section',
            message: 'Current Section Question is End',
            buttons: [
              {
                text: 'Disagree',
                handler: () => {
                  console.log('Disagree clicked');
                }
              },
              {
                text: 'Agree',
                handler: () => {
                  this.Section++;
                  this.currentques = this.questions[this.Section][0]['quesorder'];
                }
              }
            ]
          });
          confirm.present();
        }
      }

    } else if (e.direction === 4) {
      if (this.currentques != start) {
        this.currentques--;
      } else {
        if (this.currentques != 0 && this.Section!=0) {
          let confirm = this.alertCtrl.create({
            title: 'Switch To Next Section',
            message: 'Current Section Question is Start',
            buttons: [
              {
                text: 'Disagree',
                handler: () => {
                  console.log('Disagree clicked');
                }
              },
              {
                text: 'Agree',
                handler: () => {
                  this.Section--;
                  this.currentques = this.questions[this.Section][0]['quesorder'];
                }
              }
            ]
          });
          confirm.present();
        } else {

        }

      }
    }
  }


  onQuesaddChanged() {
    let s=this.Section;
    let last = this.section[s]['lques'];

      if (this.currentques != last) {
        this.currentques++;
      }else {
        if (this.currentques == this.tot_ques) {

        } else {
          let confirm = this.alertCtrl.create({
            title: 'Switch To Next Section',
            message: 'Current Section Question is End',
            buttons: [
              {
                text: 'Disagree',
                handler: () => {
                  console.log('Disagree clicked');
                }
              },
              {
                text: 'Agree',
                handler: () => {
                  this.Section++;
                  this.currentques = this.questions[this.Section][0]['quesorder'];
                }
              }
            ]
          });
          confirm.present();
        }
      }

  }


  onQuesminsChanged() {
    let s=this.Section;
    let start = this.section[s]['sques']+1;
    if (this.currentques != start) {
        this.currentques--;
      }else {
        if (this.currentques != 0 && this.Section!=0) {
          let confirm = this.alertCtrl.create({
            title: 'Switch To Next Section',
            message: 'Current Section Question is Start',
            buttons: [
              {
                text: 'Disagree',
                handler: () => {
                  console.log('Disagree clicked');
                }
              },
              {
                text: 'Agree',
                handler: () => {
                  this.Section--;
                  this.currentques = this.questions[this.Section][0]['quesorder'];
                }
              }
            ]
          });
          confirm.present();
        } else {

        }

      }
    
  }

  openmenu(){
    this.menuopen=1;
    console.log(this.menuopen);
  }
  commondataheight(q, s) {
    if (this.questions[s][q]['qcmd'] != '1') {
      this.questions[s][q]['qcmd'] = '1';
    } else {
      this.questions[s][q]['qcmd'] = '0';
    }
  }
  onChangeLang() {
    if (this.lang == 1) {
      this.lang = 2;
    } else {
      this.lang = 1;
    }
  }

  getBackground(optn, ques) {
    let styleset='background-color: #fff;color: #000;';
    if (optn['value'] == ques['answer']) {
      styleset = 'background-color: rgba(4, 168, 21, .3);color: #00a700;';
    } else if (ques['ans_status'] == 'answered') {
      if (ques['answeroptn'] == optn['value']) {
        styleset = 'background-color: rgba(245, 0, 0, 0.3);color: rgb(247, 0, 0);';
      }
    }
    return this.sanitizer.bypassSecurityTrustStyle(styleset);
  }

  setmsgans(ques) {
    if (ques['ans_status'] == "answered") {
      if (ques['answeroptn'] == ques['answer']) {
        return "You answered this question right";
      } else {
        return "you got this question wrong";
      }
    } else {
      return "you did not attempt this question";
    }
  }

  setmsgcolor(item)
  {
    if (item['ans_status'] == "answered") {
      if (item['answeroptn'] == item['answer']) {
        return "rgb(0, 202, 128)";
      } else {
        return "rgb(255, 82, 82)";
      }
    } else {
      return "#519fe8";
    }
  }
  //postcard qbtn
  setQuesStatus(q){
    if (q['ans_status'] == "answered") {
      if (q['answeroptn'] == q['answer']) {
        return "qbtn ans";
      } else {
        return "qbtn skip";
      }
    } else {
      return "qbtn";
    }
  }

  anscheckview(item,optn){
    if(optn.value==item.answer){
      return 'greenbroder';
    }else if(optn.value!=item.answer&&item.ans_status=='answered'&&item.answeroptn==optn.value){
      return 'redbroder';
    }else{

    }
  }

  admob(){
    if(this.items.testpaneltype=='2'){
    let url = 'https://app.ibpsguide.com/api/json/admob.php?page=solution&userid='+this.userid;
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


}