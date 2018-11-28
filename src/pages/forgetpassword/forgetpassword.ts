import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http'; 
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
/**
 * Generated class for the ForgetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgetpassword',
  templateUrl: 'forgetpassword.html',
})
export class ForgetpasswordPage {
  
  public loginform:FormGroup;
  posts: any;
  loader;
  canShowToast;
  displayedToast;
  tabBarElement;
  loadershow=true;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public navCtrl: NavController, public navParams: NavParams, public _form:FormBuilder, public http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.canShowToast=true;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    if(this.tabBarElement){
      this.tabBarElement.style.display = 'none';
    }
    this.loginform = this._form.group({
      'email': ['', Validators.required]
    });
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));   
   this.backhand.unregister();
   }
   
  signup(){
   this.navCtrl.setRoot('LoginPage');
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
  mailto(){
    window.open('mailto:support@ibpsguide.com','_system');
  }
  onSubmit(formData) {
    this.onloadingpage();
  if(this.loginform.valid){
  this.posts = null;
  let url= 'https://app.ibpsguide.com/api/test_email.php?email='+formData.email;
   this.http.get(url).subscribe(res =>{ 
     let data = res['_body']; 
     if (data == 'Empty') {
      this.presentToast('Fill Your Email Id.',3000);
  }else if (data == 'mailerror') {
      this.presentToast('Send Mail Getting Error',3000);
  }else if (data == 'No') {
      this.presentToast('Email Id Not Matched.',3000);
  }else{
      this.presentToast('Your password reset link has been sent to your Email !!, Please Check your email.',3000);
  }
  this.loadershow=false;
    },
    err => {
      this.loadershow=false;
      alert('Error On Your Connections');
   });
   
   }else{
    this.loadershow=false;
    this.presentToast('check Email Id.',3000);
   }
  }

  onloadingpage() {
    this.loadershow=true;
  }

}


