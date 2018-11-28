import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  selector: 'page-bookmarkdetails',
  templateUrl: 'bookmarkdetails.html',
})
export class BookmarkdetailsPage {
  items;
  currentindex;
  userid;
  testlangtype=1;
  tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams) {
    this.items = navParams.data.item;
    this.currentindex = navParams.data.active;
    this.androidFullScreen.isImmersiveModeSupported()
    .then(() =>this.androidFullScreen.immersiveMode())
    .catch(err => console.log(err));
    this.userid = localStorage.getItem("clientid");
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
  onQuesChanged(e, qv) {
    let counts = this.items.length-1;
    console.log(counts+'----'+this.currentindex);
    if (e.direction === 2) {
      if(counts!=qv){
      this.currentindex++;
      }
    }if(e.direction === 4) {
      if(qv!=0){
      this.currentindex--;
      }
    }
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

  commondataheight(item) {
    const index: number = this.items.indexOf(item);
 
    if (this.items[index]['qcmd'] != '1') {
      this.items[index]['qcmd'] = '1';
    } else {
      this.items[index]['qcmd'] = '0';
    }
  }
}
