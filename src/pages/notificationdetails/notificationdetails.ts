import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the BookmarkdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notificationdetails',
  templateUrl: 'notificationdetails.html',
})
export class NotificationdetailsPage {
  items;
  userid;tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public http: Http,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams) {

    this.items = navParams.data.item;
    this.userid = localStorage.getItem("clientid");
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
    this.http.get('https://app.ibpsguide.com/api/viewnotify.php?notifyid='+ this.items.notify_id +'&userid=' + this.userid).map(res => res.json()).subscribe(data => {

    });
    this.backhand.unregister();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
  }
  transform(v: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookmarkdetailsPage');
  }

  getBackground(optn, ques) {
    let styleset='';
    if (optn['value'] == ques['answer']) {
      styleset = 'background-color: rgb(0, 202, 128);color:#fff;';
    } 
    return this.sanitizer.bypassSecurityTrustStyle(styleset);
  }
  lang=1;
  onChangeLang() {
    if (this.lang == 1) {
      this.lang = 2;
    } else {
      this.lang = 1;
    }
  }

  commondataheight(q, s) {
    if (this.items['qcmd'] != '1') {
      this.items['qcmd'] = '1';
    } else {
      this.items['qcmd'] = '0';
    }
  }
}
