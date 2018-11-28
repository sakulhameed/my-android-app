import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';

/**
 * Generated class for the LiveChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-live-chat',
  templateUrl: 'live-chat.html',
})
export class LiveChatPage {
  current: any;
  max: any;
  maincurrent=10;
  maincountdownstart;
  mainmax=10;
  userid;
  maincountdown;
  tabBarElement;
  totques;
  quesdata;
  currentques;
  mocktest;
  msg = '';
  loadingsolution=0;
  username; profile_image;
  prgressmaincolor = '#0388cd';
  prgresssubcolor = '#c0ecff';
  chatmsg;
  showques = true;
  openquesnow = 1;
  showAlertMessage = true;
  itemparams;
  test_idlive;
  constructor(public backhand: BackButtonEventHandlerProvider, private androidFullScreen: AndroidFullScreen, public sanitizer: DomSanitizer, public alertCtrl: AlertController, public http: Http, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.userid = localStorage.getItem("clientid");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';

    this.itemparams = navParams.data.item;
    this.test_idlive = this.itemparams.test_id;

    this.androidFullScreen.isImmersiveModeSupported()
      .then(() => this.androidFullScreen.immersiveMode())
      .catch(err => console.log(err));
    this.loadFilms();
    this.backhand.unregister();

  }

  ionViewDidEnter() {
    
  }

  ionViewCanLeave() {
    if(this.showAlertMessage) {
        let alertPopup = this.alertCtrl.create({
            title: 'Do you want to Exit this test?',
            message: '',
            buttons: [{
                    text: 'Pause',
                    handler: () => {
                      clearInterval(this.maincountdown); 
                      this.showAlertMessage = false;
                      this.navCtrl.pop();
                    }
                },
                {
                    text: 'Continue',
                    handler: () => {
                        // need to do something if the user stays?
                    }
                }]
        });

        // Show the alert
        alertPopup.present();
        // Return false to avoid the page to be popped up
        return false;
    }
  //  this.tabBarElement.style.display = 'flex';
}

  loadFilms() {
    let url = 'https://app.ibpsguide.com/api/getlivequizdata.php?testid='+this.test_idlive+'&userid=' + this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      if (data['success'] == '1') {
        this.quesdata = data['questions'];
        this.totques = data['totques'];
        this.username = data['username'];
        this.profile_image = data['profile_image'];
        this.currentques = data['activeques'];


        if(this.totques<this.currentques){
          clearInterval(this.maincountdown);
          this.showAlertMessage=false;
          this.navCtrl.pop();
        }else{
          this.maincountdownstart = setInterval(() => {
              this.maincurrent--
              if(this.maincurrent<=0){
                clearInterval(this.maincountdownstart);
                this.starttime();
              }
          }, 1000);
        }

      }else{
          clearInterval(this.maincountdown);
          this.showAlertMessage=false;
          this.navCtrl.pop();
      }
    });
    this.getuseractive();
    
  }
  useractive;
  getuseractive() {
    this.http.get('https://app.ibpsguide.com/api/getuseractive.php?type=1&userid=' + encodeURIComponent(this.userid))
      .map(res => res.json()).subscribe(data => {
        this.useractive = data['usercounts'];
      });
  }
  getuseranscount() {
    let id = this.quesdata[this.currentques]['ques_id'];
    this.http.get('https://app.ibpsguide.com/api/getuseractive.php?type=2&qid=' + id + '&userid=' + encodeURIComponent(this.userid))
      .map(res => res.json()).subscribe(data => {
        this.quesdata[this.currentques]['answerreview'] = data['usercounts'];
      });
  }
  getuseranstotcount() {
    let id = this.quesdata[this.currentques]['ques_id'];
    this.http.get('https://app.ibpsguide.com/api/getuseractive.php?type=3&qid=' + id + '&userid=' + encodeURIComponent(this.userid))
      .map(res => res.json()).subscribe(data => {
        this.quesdata[this.currentques]['totanswerqs'] = data['usercounts'];
      });
  }
  savedata() {
    this.loadingsolution=1;
    clearInterval(this.maincountdown);
    this.maincurrent=10;
    this.maincountdownstart = setInterval(() => {
      this.maincurrent--
      if(this.maincurrent<=0){
        clearInterval(this.maincountdownstart);
        this.starttime();
      }
    }, 1000);
    this.http.get('https://app.ibpsguide.com/api/savelivechattest.php?type=3&testid=' + this.test_idlive + '&userid=' + encodeURIComponent(this.userid))
      .map(res => res.json()).subscribe(data => {
        clearInterval(this.maincountdownstart);
        this.showAlertMessage=false;
        this.loadingsolution=0;
        this.navCtrl.pop();
      });
  }
  /*
  savemsg(){
    if(this.msg!=''){
    this.http.get('https://app.ibpsguide.com/api/getchatmsg.php?action=save&username='+encodeURIComponent(this.username)+'&msg='+encodeURIComponent(this.msg)+'&profile_image='+encodeURIComponent(this.profile_image)+'&userid='+encodeURIComponent(this.userid))
    .map(res => res.json()).subscribe(data => {
      this.msg='';
      this.getdatamsg();
    });
    }
  }
  getdatamsg(){
    this.http.get('https://app.ibpsguide.com/api/getchatmsg.php?action=getdata&userid='+encodeURIComponent(this.userid))
    .map(res => res.json()).subscribe(data => {
      this.chatmsg=data['msgs'];
    });
  }
  */
  getSafeUrl(url) {
    if (url != '') {
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://estore.ibpsguide.com/uploads/profile_image/' + url);
    } else {
      return 'assets/imgs/user.png';
    }
  }

  transform(v: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LiveChatPage');
  }
  doSomethingWithCurrentValue(e) {
    //console.log(e);
  }
  onQuesValanswer(item) {
    let ans = item.ques_ans;
    this.quesdata[this.currentques]['ques_ans'] = ans;
    let id = item.ques_id;
    let answerid = item.answerid;
    let time = parseInt(this.quesdata[this.currentques]['questime'])-this.current;
    let url = 'https://app.ibpsguide.com/api/saveanschat.php?time='+time+'&answerid=' + answerid + '&ans=' + ans + '&qid=' + id + '&userid=' + this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.quesdata[this.currentques]['answerid'] = data['answerid'];
    });
  }

  itemoptnclass(optn, item) {
    let optnvalue = optn.value;
    let answer = item.answer;
    let ques_ans = item.ques_ans;
    if (optnvalue == answer) {
      return 'item item-block item-md item-radio item-cus-green';
    } if (optnvalue == ques_ans && ques_ans!='') {
      return 'item item-block item-md item-radio item-cus-red';
    } else {
      return 'item item-block item-md item-radio';
    }
  }

  getopbg(optn, item) {
    //"usercounts":"25","answer":"0"
    let getval = item.answerreview;
    let tot=0;
    let currentval = 0;
    getval.forEach(function(val, index){
       if(val.answer==optn.value){
        currentval=parseInt(val.usercounts);
       }
       tot+=parseInt(val.usercounts);
    });
    let currentpertge = (currentval/tot)*100;
    let remainpertge = 100-Math.round(currentpertge);
    return 'linear-gradient(90deg, #60bc604d '+Math.round(currentpertge)+'%, #fff '+remainpertge+'%)';
  }
  getopbgcount(optn, item) {
    let getval = item.answerreview;
    let currentval = 0;
    getval.forEach(function(val, index){
       if(val.answer==optn.value){
        currentval=parseInt(val.usercounts);
       }
    });
    return currentval;
  }

  gettime;
  answerimgval=0;
  starttime() {
 
    this.openquesnow=0;
    this.current = parseInt(this.quesdata[this.currentques]['questime']);
    this.max = this.current;

    this.maincountdown = setInterval(() => {

      //let gettotq = parseInt(this.totques)-1;
      let gettotq = 15;
      console.log(this.currentques);
      if(gettotq<this.currentques){
        this.savedata();
      }else{

      this.current--;

      if (this.current % 3 == 0) {
        this.getuseractive();
        this.getuseranstotcount();
      } 

      if (this.current <= 10) {
        this.prgressmaincolor = '#e13838';
        this.prgresssubcolor = '#ec9494';
      } else {
        this.prgressmaincolor = '#0388cd';
        this.prgresssubcolor = '#c0ecff';
      }
      let exptime =parseInt(this.quesdata[this.currentques]['exptime'])-5;
     
      if(this.current<=exptime && this.showques== false) {
        this.answerimgval=0;
      }
      if (this.current == 0 && this.showques == true) {
        this.showques = false;
        this.getuseranscount();
        this.current = parseInt(this.quesdata[this.currentques]['exptime']);
        this.max = this.current;

        let answer = this.quesdata[this.currentques]['answer'];
        let ques_ans = this.quesdata[this.currentques]['ques_ans'];
        
        if (ques_ans != '') {
          if (ques_ans == answer) {
            this.answerimgval=1;
          } else {
            this.answerimgval=2;
          }
        } else {
            this.answerimgval=3;
        }
      } else if (this.current == 0 && this.showques == false) {
        this.currentques++;      
        this.current = parseInt(this.quesdata[this.currentques]['questime']);
        this.max = this.current;
        this.showques = true;
        this.answerimgval=0;
      }

    }

    }, 1000);

  }

}
