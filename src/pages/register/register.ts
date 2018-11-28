import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Http } from '@angular/http'; 
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { CacheService } from 'ionic-cache';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  public registorform:FormGroup;
  posts: any;
  loader;
  canShowToast;
  displayedToast;
  tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private cache: CacheService,public storage: Storage,private androidFullScreen: AndroidFullScreen,public navCtrl: NavController, public navParams: NavParams, public _form:FormBuilder, public http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
   this.canShowToast=true;
   this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    if(this.tabBarElement){
      this.tabBarElement.style.display = 'none';
    }
   this.registorform = this._form.group({
      'email': ['', Validators.compose([Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"), Validators.required])],
      'password': ['', Validators.required],
      'cfpassword': ['', Validators.required],
      'username': ['', Validators.required],
      'mobile': ['', Validators.compose([Validators.pattern("^[0-9]{10}$"), Validators.required])]
    });
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
   this.backhand.unregister();
  }
  onloadingpage() {
    this.loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div>
        <img text-center src="assets/imgs/loader.gif" alt="loader" width="40px" />
        <h4>Please Wait...</h4>
      </div>`,
      duration:5000
    });
    this.loader.present();
  }

  signup(){
   this.navCtrl.push('LoginPage');
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
  onSubmit(formData) {
    this.onloadingpage();
    if(this.registorform.valid){
    //this.navCtrl.push(LoginPage);
  if(formData.password==formData.cfpassword){
	this.http.get('https://app.ibpsguide.com/api/action.php?action=registor&email='+encodeURIComponent(formData.email)+'&pass='+encodeURIComponent(formData.password)+'&phone='+encodeURIComponent(formData.mobile)+'&username='+encodeURIComponent(formData.username))
  .map(res => res.json()).subscribe(data => {
      this.loader.dismiss();
      if(data.status=="1"){
        
        localStorage.clear();
        this.cache.clearAll();
        this.storage.clear();
  
      this.posts = data.userid;
      localStorage.setItem("alldataofuser",JSON.stringify(data));
      localStorage.setItem("clientid",this.posts);
      this.navCtrl.setRoot('TabsPage');
      }else{
        if(data.already=='1'){
           this.presentToast('Email Id Already Exit',3000);
        }else if(data.already=='3'){
          this.presentToast('Mobile No Already Exit',3000);
       }else{
           this.presentToast('Please Check your details',3000);
       }
      }
    },
    err => {
      this.loader.dismiss();
      alert('Error On Your Connections');
   });
   }else{
     this.loader.dismiss();
     this.presentToast('Password Not Matching',3000);
   }
   }else{
    this.loader.dismiss();
     this.presentToast('Please Fill your details',3000);
   }

  }

}
