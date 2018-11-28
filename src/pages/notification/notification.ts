import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the BookmarkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  items:any;
  datalistitems:any;
  title;
  time_limit;
  live_date;
  loader;
  userid;
  displayedToast;
  loadershow=true;tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
   this.userid = localStorage.getItem("clientid");
   this.tabslisting();
   this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   this.backhand.unregister();
   this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
  }
  ionViewDidEnter() {
  }
    

  onloadingpage() {
    this.loadershow=true;
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

  itemSelected(item: string) {
    item['bgcolor']='#fff';
    this.navCtrl.push('NotificationdetailsPage', { item: item });
  }
  sec;
  tabslisting() {
    this.onloadingpage();
    let url = 'https://app.ibpsguide.com/api/listnotify.php?userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.datalistitems = data;
      console.log(data);
      this.loadershow=false;
      });
  }

   // Pull to refresh and force reload
   forceReload(refresher) {
    this.tabslisting();
    refresher.complete();
  }

}
