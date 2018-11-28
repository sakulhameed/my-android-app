import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertController } from 'ionic-angular';
import { ConnectionsProvider } from '../../providers/connections/connections';
import { Storage } from '@ionic/storage';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { ToastController } from 'ionic-angular'; 
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the TaketestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-taketest',
  templateUrl: 'taketest.html',
})
export class TaketestPage {
  questions;
  tabBarElement: any;
  userid;
  Section = 0;
  currentques = 1;
  name;
  time_limit;
  tot_ques;
  time_type;
  section;
  datajson;
  items;
  sectioncount;
  lang=1;
  sec_num;
  hours;
  minutes;
  seconds;
  menuopen=0;
  currentquestime=0;

  maincountdown;
  secmaincountdown;
  storedatesetcount=0;
  testtime;
  testlangtype;
  showAlertMessage;

  quesanswered=0;
  quesskipped=0;
  quesmarked=0;
  quesunseen=0;
  DataGetLocal;
  constructor(public backhand: BackButtonEventHandlerProvider,public toastCtrl: ToastController, private androidFullScreen: AndroidFullScreen,public storage: Storage,public conn: ConnectionsProvider,public alertCtrl: AlertController, public sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
    this.items = navParams.data.item;
    this.backhand.unregister();
    this.userid = localStorage.getItem("clientid");
    this.androidFullScreen.isImmersiveModeSupported()
    .then(() =>this.androidFullScreen.immersiveMode())
    .catch(err => console.log(err));
    let testname = 'test-'+this.items.testpaneltype+'-'+this.items.test_id;

    this.storage.get(testname).then((val) => {
    this.DataGetLocal=val;
    if (this.DataGetLocal != null) {
      this.datajson = JSON.parse(this.DataGetLocal);
        this.questions = this.datajson['questions'];
        this.name = this.datajson['name'];
        this.tot_ques = this.datajson['tot_ques'];
        this.time_type = this.datajson['time_type'];
        this.section = this.datajson['section'];
        this.sectioncount = this.datajson['sectioncount'];
        this.testlangtype = this.datajson['lang_type'];
        this.datajson['teststart']=1;
        // Store
        this.storage.remove(testname);
        this.storage.set(testname, JSON.stringify(this.datajson));
        this.starttime();
        this.onQuesVal(0,0);
        //this.countques();
    } else {
      if(this.conn.Onconnection()){
      this.http.get('https://app.ibpsguide.com/api/testdata.php?testpaneltype='+this.items.testpaneltype+'&test=' + this.items.test_id + '&userid=' + this.userid).map(res => res.json()).subscribe(data => {
        this.datajson = data;
        this.questions = this.datajson['questions'];
        this.name = this.datajson['name'];
        this.tot_ques = this.datajson['tot_ques'];
        this.time_type = this.datajson['time_type'];
        this.section = this.datajson['section'];
        this.sectioncount = this.datajson['sectioncount'];
        this.testlangtype = this.datajson['lang_type'];
        this.datajson['teststart']=1;
        // Store
        this.storage.remove(testname);
        this.storage.set(testname, JSON.stringify(this.datajson));
        this.starttime();
        this.onQuesVal(0,0);
        //this.countques();
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
  });
  }
  SectionTab(v){
    this.Section=v;
    console.log(this.Section);
    this.onSecChange();
  }
  openmenu(){
    this.menuopen=1;
    this.countques();
  }
  ionViewDidLoad() {
    this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 1000,
      dismissOnPageChange: true
    }).present();
  }
  ionViewWillEnter() {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
    this.showAlertMessage = true;
  }
  switchalert(){
    const toast = this.toastCtrl.create({
      message: 'you cannot switch sections in this test!!',
      duration: 1000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }
  ionViewWillLeave(){
    clearInterval(this.maincountdown); 
    clearInterval(this.countdown);
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
                      clearInterval(this.countdown);
                      this.showAlertMessage = false;
                      let testname = 'test-'+this.items.testpaneltype+'-'+this.items.test_id;
                      // Store
                      this.storage.remove(testname);
                      this.storage.set(testname, JSON.stringify(this.datajson));
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


  toHHMMSS(secs) {
    this.sec_num = parseInt(secs, 10);
    this.hours = Math.floor(this.sec_num / 3600) % 24;
    this.hours = this.hours < 10 ? "0" + this.hours : this.hours;
    this.minutes = Math.floor(this.sec_num / 60) % 60;
    this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;
    this.seconds = this.sec_num % 60;
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    return this.hours + ":" + this.minutes + ":" + this.seconds;
  }
  toMMSS(secs) {
    this.sec_num = parseInt(secs, 10);
    this.minutes = Math.floor(this.sec_num / 60) % 60;
    this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;
    this.seconds = this.sec_num % 60;
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    return this.minutes + ":" + this.seconds;
  }
  countdown;
  onQuesChanged(e,qv,s) {
    let last = this.section[s]['lques'];
    let start = this.section[s]['sques']+1;
    if (e.direction === 2) {
      if (this.currentques != last) {
        this.currentques++;
        qv++;
        this.onQuesVal(qv,s)
      }else{
        if (this.time_type != '2') {
        if(this.currentques==this.tot_ques){
        let confirm = this.alertCtrl.create({
          title: 'Are You Sure To Submit',
          message: '',
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('No clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.postRequest();
              }
            }
          ]
        });
        confirm.present();
      }else{
        let confirm = this.alertCtrl.create({
          title: 'Switch To Next Section',
          message: 'You Have Reached Finial Questions',
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('No clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
               this.Section++;
               this.currentques = this.questions[this.Section][0]['quesorder'];
               this.onQuesVal(0,this.Section);
              }
            }
          ]
        });
        confirm.present();
      }
      }
    }
    } else if (e.direction === 4) {
      if (this.currentques != start) {
        this.currentques--;
        qv--;
        this.onQuesVal(qv,s);
      }else{
        if (this.time_type != '2') {
        if(this.currentques != 1){
          let confirm = this.alertCtrl.create({
            title: 'Switch To Next Section',
            message: 'Current Section Question is Start',
            buttons: [
              {
                text: 'No',
                handler: () => {
                  console.log('No clicked');
                }
              },
              {
                text: 'Yes',
                handler: () => {
                this.Section--;
                this.currentques = this.questions[this.Section][0]['quesorder'];
                this.onQuesVal(0,this.Section);
                }
              }
            ]
          });
          confirm.present();
        }else{

        }
      }
    }
    }
    
  }
  
  onQuesaddChanged() {
    let s=this.Section;
    let qv=this.currentques-1;
    
    let last = this.section[s]['lques'];
    let start = this.section[s]['sques']+1;
    if(s!=0){
      qv=this.currentques-parseInt(start);
    }
      if (this.currentques != last) {
        this.currentques++;
        qv++;
        this.onQuesVal(qv,s)
      }else{
        if (this.time_type != '2') {
        if(this.currentques==this.tot_ques){
        let confirm = this.alertCtrl.create({
          title: 'Are You Sure To Submit',
          message: '',
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('No clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.postRequest();
              }
            }
          ]
        });
        confirm.present();
      }else{
        let confirm = this.alertCtrl.create({
          title: 'Switch To Next Section',
          message: 'You Have Reached Finial Questions',
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('No clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
               this.Section++;
               this.currentques = this.questions[this.Section][0]['quesorder'];
               this.onQuesVal(0,this.Section);
              }
            }
          ]
        });
        confirm.present();
      }
      }else{
        const toast = this.toastCtrl.create({
          message: 'You have reached last question of this section, you cannot switch the section in this test, untill time elapsed!!',
          duration: 1000,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
      }
    }
    
  }


  onQuesminsChanged() {
    let s=this.Section;
    let qv=this.currentques-1;
    let start = this.section[s]['sques']+1;

    if(s!=0){
      qv=this.currentques-parseInt(start);
    }

    if (this.currentques != start) {
        this.currentques--;
        qv--;
        this.onQuesVal(qv,s);
      }else{
        if (this.time_type != '2') {
        if(this.currentques != 1){
          let confirm = this.alertCtrl.create({
            title: 'Switch To Next Section',
            message: 'Current Section Question is Start',
            buttons: [
              {
                text: 'No',
                handler: () => {
                  console.log('No clicked');
                }
              },
              {
                text: 'Yes',
                handler: () => {
                this.Section--;
                this.currentques = this.questions[this.Section][0]['quesorder'];
                this.onQuesVal(0,this.Section);
                }
              }
            ]
          });
          confirm.present();
        }else{

        }
      }
    }
    
  }
  currentques_plusmrk=0;
  currentques_minusmrk=0;
  currentques_quesmark=0;

  onQuesVal(q,s){
    clearInterval(this.countdown);
    if(this.questions[s][q]['option_ids']!=''){
      this.questions[s][q]['status']='answered';
    }else{
      this.questions[s][q]['status']='skipped';
    }
    this.currentquestime = this.questions[s][q]['time_spent'];;
    this.currentques_plusmrk = this.questions[s][q]['plusmrk'];
    this.currentques_minusmrk = this.questions[s][q]['minusmrk'];
    this.currentques_quesmark = this.questions[s][q]['quesmark'];
    console.log(this.questions[s][q]);
    this.countdown = setInterval(() => {
      this.questions[s][q]['time_spent'] = parseInt(this.questions[s][q]['time_spent'])+1;
      this.currentquestime = this.questions[s][q]['time_spent'];
    }, 1000);
    //this.countques();
  }
  onQuesClearresponser(){  
    let s=this.Section;
    let q=this.currentques-1;
    this.questions[s][q]['option_ids'][0]='';
  }
  onQuesValanswer(q,s){  
      if(this.questions[s][q]['option_ids']!=''){
        this.questions[s][q]['status']='answered';
      }else{
        this.questions[s][q]['status']='skipped';
      }
     // this.countques();
  }

  countques(){
    this.quesanswered=0;
    this.quesskipped=0;
    this.quesmarked=0;
    
    for(let data of this.questions) {
      for(let q of data) {
        if(q['status']=='answered'){
          this.quesanswered++;
        }else if(q['status']=='skipped'){
          this.quesskipped++;
        }
        if(q['quesmark']=='1'){
          this.quesmarked++;
        }
      }
    }
    this.quesunseen=parseInt(this.tot_ques)-(this.quesanswered+this.quesskipped);
  }

  onSecChange(){
    this.currentques = this.questions[this.Section][0]['quesorder'];
    this.onQuesVal(0,this.Section);
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


  starttime() {
    this.maincountdown = setInterval(() => {
      this.datajson['time_limit'] = parseInt(this.datajson['time_limit']) - 1;
      if (this.datajson['time_limit'] <= 0) {
        clearInterval(this.maincountdown);
        clearInterval(this.countdown);
        this.postRequest();
      }
      if (this.time_type == '2') {
          if (this.section[this.Section]['curthrs']<=0) {
            this.Section += 1;
          }
          this.section[this.Section]['curthrs'] = parseInt(this.section[this.Section]['curthrs']) - 1;
          this.secmaincountdown = this.toMMSS(this.section[this.Section]['curthrs']);
      }
      this.storedatesetcount++;
      let testname = 'test-'+this.items.testpaneltype+'-'+this.items.test_id;
      if (this.storedatesetcount == 10) {
        this.storedatesetcount = 0;
        // Store
        this.storage.remove(testname);
        this.storage.set(testname, JSON.stringify(this.datajson));
      }
      this.testtime = this.toHHMMSS(this.datajson['time_limit']);
      
    }, 1000);
  }

  onPausetest(type) {
    console.log(type);
    if(type!='3'){
      let alertPopup = this.alertCtrl.create({
        title: 'Do you want to Exit this test?',
        message: '',
        buttons: [{
                text: 'Pause',
                handler: () => {
                  clearInterval(this.maincountdown);
                  clearInterval(this.countdown);
                  let testname = 'test-'+this.items.testpaneltype+'-'+this.items.test_id;
                  // Store
                  this.storage.remove(testname);
                  this.storage.set(testname, JSON.stringify(this.datajson));
                  this.showAlertMessage=false;
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
    
    }
  }
  optnheaders;
  postRequest() {
    clearInterval(this.maincountdown);
    clearInterval(this.countdown);
    let testname = 'test-'+this.items.testpaneltype+'-'+this.items.test_id;
    this.showAlertMessage = false;
    this.loadingCtrl.create({
      content: 'Submit Your Test.',
      dismissOnPageChange: true
    }).present();
    this.optnheaders = new Headers();
    this.optnheaders.append('Content-Type', 'application/json');
    let data = JSON.stringify(this.datajson);
    this.http.post('https://app.ibpsguide.com/api/saveresult.php', data, this.optnheaders)
      .map(res => res.json())
      .subscribe(res => {
        this.storage.remove(testname);
        if(this.items.testpaneltype=='3'){
          this.navCtrl.setRoot('HomePage');
        }else{
        this.navCtrl.push('ResultPage', { item: res }).then(() => {
          let index = this.navCtrl.last().index-1;
          this.navCtrl.remove(index);
        });
      }
      }, (err) => {
        alert('Error On Your Connections');
    });
  }

  onMarkQues() {
    let q = this.currentques-1;
    let s = this.Section;
    if (this.questions[s][q]['quesmark'] != '1') {
      this.questions[s][q]['quesmark'] = '1';
    } else {
      this.questions[s][q]['quesmark'] = '0';
    }
    this.currentques_quesmark = this.questions[s][q]['quesmark'];
  }
  /*
  commondataheight(q,s){
    if (this.questions[s][q]['qcmd'] != '1') {
      this.questions[s][q]['qcmd'] = '1';
    } else {
      this.questions[s][q]['qcmd'] = '0';
    }
  }
  */
  onChangeLang(){
    if(this.lang==1){
      this.lang=2;
    }else{
      this.lang=1;
    }
  }


  /* new code */

  addclassfilter(s){
    let classset = 'qbtn';
    if(s=='skipped'){
      classset = 'qbtn skip';
    }else if(s=='answered'){
      classset = 'qbtn ans';
    }else if(s!='answered'&&s!='skipped'){
      classset = 'qbtn';
    }
    return classset;
  }

  /* end new code */
  

}