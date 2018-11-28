import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http'; 
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the TestpanelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-testpanel',
  templateUrl: 'testpanel.html',
})
export class TestpanelPage {
  userid;
  items;
  title;
  time_limit;
  tabBarElement;
  tot_ques;
  btnname = 'Take Test';
  constructor(public backhand: BackButtonEventHandlerProvider,public storage: Storage,private androidFullScreen: AndroidFullScreen,public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
    this.userid = localStorage.getItem("clientid");
    this.items = navParams.data.item;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
    this.backhand.unregister();

    let testname = 'test-'+this.items.testpaneltype+'-'+this.items.test_id;

    this.storage.get(testname).then((val) => {
      if (val != null) {
        this.btnname = 'Resume Test'
      }
    });

    this.title = this.items.name;
    this.time_limit =  this.items.time_limit;
    this.tot_ques = this.items.tot_ques;
    
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
  }

  itemSelected(item: string) {
    this.navCtrl.push('TaketestPage', { item: item }).then(() => {
      let index = this.navCtrl.last().index-1;
      this.navCtrl.remove(index);
    });
  }

}
