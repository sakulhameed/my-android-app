import { Component } from '@angular/core';
import { ModalController,IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { ToastController,AlertController } from 'ionic-angular'; 
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  items:any;
  datalistitems:any;
  storages;
  setjson=[];
  alreadyexit=0;
  userid; 
  browser;
  totprice = 0;
  shipping_id='';
  showshpaddres='0';
  couponshow='0';
  getmobile='0';
  loader=1;
  datacountlist;
  tabBarElement;
  coupon;
  loadershow=true;
  public registorform:FormGroup;
  statelists;
  stateval='';
  constructor(public alertCtrl: AlertController,public _form:FormBuilder,public backhand: BackButtonEventHandlerProvider,public toastCtrl: ToastController,private androidFullScreen: AndroidFullScreen,public inAppBrowser: InAppBrowser,public modalCtrl: ModalController,public sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
     this.userid = localStorage.getItem("clientid");
     this.checkcoupon(0);
     this.tabslisting();
     this.registorform = this._form.group({
      'fullname': ['', Validators.required],
      'mobile': ['', Validators.required],
      'address2': ['', Validators.required],
      'address1': [''],
      'landmark': [''],
      'pincode': ['', Validators.required],
      'city': ['', Validators.required],
      'state': ['', Validators.required]
    });

      this.androidFullScreen.isImmersiveModeSupported()
      .then(() =>this.androidFullScreen.immersiveMode())
      .catch(err => console.log(err));
      this.backhand.unregister();
      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      this.tabBarElement.style.display = 'none';
  }

  onSubmit(formData) {
    this.onloadingpage();
    if(this.registorform.valid){
	  this.http.get('https://app.ibpsguide.com/api/shipping_db.php?action=1&userid='+this.userid+'&shipping_id='+this.shipping_id+'&fullname='+encodeURIComponent(formData.fullname)+'&address2='+encodeURIComponent(formData.address2)+'&mobile='+encodeURIComponent(formData.mobile)+'&address1='+encodeURIComponent(formData.address1)+'&landmark='+encodeURIComponent(formData.landmark)+'&pincode='+encodeURIComponent(formData.pincode)+'&city='+encodeURIComponent(formData.city)+'&state='+encodeURIComponent(formData.state))
    .map(res => res.json()).subscribe(data => {
      this.shipping_id = data['success'];
      this.loader=0;
      this.openWebpage();
    });
   }else{
    this.loader=0;
    const toast = this.toastCtrl.create({
      message: 'Please Check your details',
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
   }

  }
  propayment(){
    if(this.shipping_id!=''||this.showshpaddres=='0'){
      this.browser = this.inAppBrowser.create('https://estore.ibpsguide.com/mobile/checkout-mobile1.php?userid='+this.userid+'&coupon='+this.coupon, '_self', {zoom:"no"});
      }
  }
  openWebpage() {
    if(this.getmobile=='1'){  
      this.propayment();
    }else{
      this.showmobilePrompt();
    }
  }
  tabslisting() {
    let url = 'https://app.ibpsguide.com/api/shipping_db.php?action=2&userid='+this.userid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.loader=0;
      if(data['checkout']=='1'){
      let setdata = data['data']
      this.shipping_id = setdata['shipping_id'];
      this.registorform.controls['fullname'].setValue(setdata['fullname']);
      this.registorform.controls['address1'].setValue(setdata['address1']);
      this.registorform.controls['address2'].setValue(setdata['address2']);
      this.registorform.controls['mobile'].setValue(setdata['mobile']);
      this.registorform.controls['landmark'].setValue(setdata['landmark']);
      this.registorform.controls['pincode'].setValue(setdata['pincode']);
      this.registorform.controls['city'].setValue(setdata['city']);
      this.registorform.controls['state'].setValue(setdata['state']);
      this.stateval = setdata['state'];
      }
    });
  }


  getSafeUrl(url) {
    console.log(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);		
  }
  onloadingpage() {
    this.loader=1;
  }
  ionViewDidLoad() {   
  }
  
  checkcoupon(type) {
    this.onloadingpage();
      this.http.get('https://app.ibpsguide.com/api/new_cartlisting.php?userid='+this.userid+'&coupon='+this.coupon).map(res => res.json()).subscribe(data => {
      this.showshpaddres=data['showshpaddres'];
      this.datalistitems = data['data'];
      this.getmobile = data['mobile'];

       this.totprice = 0;
       this.datacountlist = Object.keys(this.datalistitems).length;
       for(let data of this.datalistitems) {
         this.totprice += parseInt(data.price);
       }
       if(type==1){
       if(data['apply']=='1'){ 
       const toast = this.toastCtrl.create({
        message: 'coupon code applied',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
      }else{
        const toast = this.toastCtrl.create({
          message: 'Coupon code invalid',
          duration: 3000,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
      }}
       this.loader=0;
       },
       err => {
         alert('Error On Your Connections');
         this.loader=0;
       });
      
  }
  

  removeItem(item){
    console.log(item);
    this.onloadingpage();
    this.http.get('https://app.ibpsguide.com/api/deletecart.php?cartid='+item.cart_id).map(res => res.json()).subscribe(data => {

      this.loader=0;
      let index = this.datalistitems.indexOf(item);
      if(index > -1){
       this.datalistitems.splice(index, 1);
      }
      this.totprice -= parseInt(item.price);
      this.loader=0;
      this.datacountlist = Object.keys(this.datalistitems).length;
      },
      err => {
        alert('Error On Your Connections');
        this.loader=0;
      });
  }
  openhome(){
    this.navCtrl.push('SubscribePage');
  }
  removeItemAll(){
    this.onloadingpage();
    this.http.get('https://app.ibpsguide.com/api/deletecart.php?userid='+this.userid).map(res => res.json()).subscribe(data => {
      this.loader=0;
      this.datalistitems=[];
      this.totprice=0;
      this.loader=0;
      this.datacountlist = Object.keys(this.datalistitems).length;
      },
      err => {
        alert('Error On Your Connections');
        this.loader=0;
      });
  }

  showcouponsfunc(){
    if(this.couponshow=='0'){
    this.couponshow='1';
    }else{
      this.couponshow='0';
    }
  }

  itemSelected(item: string) {
    this.navCtrl.push('ProductdetailsPage', { item: item });
  }

  showmobilePrompt() {
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
              this.propayment();
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
              this.showmobilePrompt();
            }
          }
        }
      ]
    });
    prompt.present();
  }


}
