import { Component } from '@angular/core';
import { NavParams, ViewController,IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular'; 
import { LoadingController } from 'ionic-angular';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the ProductdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-productdetails',
  templateUrl: 'productdetails.html',
})
export class ProductdetailsPage {
  items:any;
  storages;
  setjson=[];
  alreadyexit=0;
  userid;
  canShowToast;
  displayedToast;
  loader;
  browser;Section;
  loadershow=true;tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public inAppBrowser: InAppBrowser,public viewCtrl: ViewController,public sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.onloadingpage();
    this.items = navParams.data.item;
    this.Section = navParams.data.Section;
    console.log(this.Section);
    this.userid = localStorage.getItem("clientid");
    this.canShowToast = true;
    this.loadershow=false;
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   this.backhand.unregister();
   this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
  }
  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);		
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
  transform(v:string):SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }
  presentToast(msg: string, time = 3000) {
    if (this.canShowToast) {
      this.canShowToast = false;
      this.displayedToast = this.toastCtrl.create({
        message: msg,
        position: 'top',
        duration: 2000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
  
      this.displayedToast.present();
      this.displayedToast.onDidDismiss(() => {
        this.canShowToast = true;
      });
  
    } else {
      this.displayedToast.setMessage(msg);
    }
  }
  onloadingpage() {
    this.loadershow=true;
  }
  ionViewDidLoad() {
    
  }
  
  addtocart(item: any){
    if(item.purchase=='1'){
    this.navCtrl.push('PdfviewPage', { item: item });
    }else{
      this.onloadingpage();
      let bookname = 'Book'; 
      if(this.Section=='1'){
        let bookname = 'Ebook'; 
      }
    this.http.get('https://app.ibpsguide.com/api/addtocart.php?userid='+this.userid+'&prdid='+item.product_id).map(res => res.json()).subscribe(data => {
      if(data['res']=='alreadyexit'){
        this.presentToast(bookname+' Already Add To Your Cart',3000);
      }else if(data['res']=='new-purchased'){
        this.presentToast(bookname+' Added To Your Account',3000);
        item.purchase=1;
      }else if(data['res']=='addtocard'){
        this.presentToast(bookname+' Add To Your Cart',3000);
      }
      this.loadershow=false;
      },
      err => {
        alert('Error On Your Connections');
      });
    }
  }

  openWebpage() {
    this.browser = this.inAppBrowser.create('https://app.ibpsguide.com/api/checkout-mobile.php?userid='+this.userid, '_self', {zoom:"no"});
  }

  checkout(item: any){
    this.onloadingpage();
    this.http.get('https://app.ibpsguide.com/api/addtocart.php?userid='+this.userid+'&prdid='+item.product_id).map(res => res.json()).subscribe(data => {
     this.openWebpage();
     this.loadershow=false;
      },
      err => {
        alert('Error On Your Connections');
      });
  }
}
