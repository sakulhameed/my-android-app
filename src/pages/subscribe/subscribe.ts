import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { ToastController,AlertController } from 'ionic-angular'; 
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the EbooksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-subscribe',
  templateUrl: 'subscribe.html',
})
export class SubscribePage {
  userid;
  coupon;
  clickbtn=0;
  getmobile='0';
  itemsubscriptn=[];
  CartPage='CartPage';
  EbookpurchasePage = 'EbookpurchasePage';
  TestpurchasePage = 'TestpurchasePage';
  tabBarElement;useralldata;profileimage;couponapply=0;
  constructor(public alertCtrl: AlertController,public backhand: BackButtonEventHandlerProvider,public toastCtrl: ToastController,private androidFullScreen: AndroidFullScreen,public inAppBrowser: InAppBrowser,public loadingCtrl: LoadingController,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.userid = localStorage.getItem("clientid");
    this.profileimage = 'assets/imgs/user.png';
    this.tabsubptnlisting(0);
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   this.backhand.unregister();
   this.backhand.registerDoublePressToExitApp('FeedsPage',this.navCtrl);
  }
  ionViewDidEnter() {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'flex';
  }
  getSafeUrl(url) {
    if (url != '') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      return 'assets/imgs/user.png';
    }
  }
itemSelectedpack(p) {
  this.navCtrl.push(p);
}
itemSelectedpackages(item) {
  this.navCtrl.push('SubscripdetailsPage', { item: item });
}
browser;
subdate;
openpackage;
tabsubptnlisting(type){
 let url = 'https://app.ibpsguide.com/api/subscriptedprd.php?userid='+this.userid+'&coupon='+this.coupon;
  this.http.get(url).map(res => res.json()).subscribe(data => {
      this.itemsubscriptn = data['data'];
      this.openpackage = this.itemsubscriptn[0];

      this.subdate = data['subdate'];
      this.profileimage = this.openpackage['image'];
      if(type==1){
        if(data['apply']=='1'){ 
        const toast = this.toastCtrl.create({
         message: 'coupon code applied',
         duration: 3000,
         showCloseButton: true,
         closeButtonText: 'Ok'
       });
       toast.present();
       this.couponapply=1;
       }else{
         const toast = this.toastCtrl.create({
           message: 'Coupon code invalid',
           duration: 3000,
           showCloseButton: true,
           closeButtonText: 'Ok'
         });
         toast.present();
       }}
    });
}
transform(v:string):SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(v);
}

showcoupon()
{
  this.clickbtn =1;
}

propayment(type,id){
  if(type==0){
    this.browser = this.inAppBrowser.create('https://estore.ibpsguide.com/order_mob_subscription.php?id='+id+'&userid='+this.userid, '_self', {zoom:"no"});
    }
}

openWebpage(type,id) {
  if(this.getmobile=='1'){  
    this.propayment(type,id);
  }else{
    this.showmobilePrompt(type,id);
  }
}

showmobilePrompt(type,id) {
  const prompt = this.alertCtrl.create({
    title: 'Before Payment',
    message: "Enter a Mobile Number to Process Payment.",
    inputs: [
      {
        name: 'MobileNumber',
        placeholder: 'Mobile Number'
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          let phoneno = /^\d{10}$/;
          if((data.MobileNumber.match(phoneno))){
            this.http.get('https://app.ibpsguide.com/api/mobilenum_update.php?userid='+this.userid+'&mobile='+data.MobileNumber).map(res => res.json()).subscribe(data => {
            this.propayment(type,id);
            },
            err => {
            alert('Error On Your Connections');
            });
          }else{
            const toast = this.toastCtrl.create({
              message: 'invalid Mobile number',
              duration: 2000,
              showCloseButton: true,
              closeButtonText: 'Ok'
            });
            toast.present();
            this.showmobilePrompt(type,id);
          }
        }
      }
    ]
  });
  prompt.present();
}

}
