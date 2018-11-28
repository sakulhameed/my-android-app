import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Http } from '@angular/http'; 
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ConnectionsProvider } from '../../providers/connections/connections';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { CacheService } from 'ionic-cache';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';
import { GooglePlus } from '@ionic-native/google-plus';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  
  public loginform:FormGroup;
  posts: any;
  loader;
  canShowToast;
  displayedToast;
  tabBarElement;

  testitems = [
    { "id":"0","name": 'All',"type":"0"},
    { "id":"100","name": 'Combo Package',"type":"0"},
  ];

  constructor(public googlePlus: GooglePlus,public backhand: BackButtonEventHandlerProvider,private cache: CacheService,public storage: Storage,private androidFullScreen: AndroidFullScreen,public conn: ConnectionsProvider,public navCtrl: NavController, public navParams: NavParams, public _form:FormBuilder, public http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.canShowToast=true;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    if(this.tabBarElement){
      this.tabBarElement.style.display = 'none';
    }
    this.loginform = this._form.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });

    

    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));  
   this.backhand.unregister();
   }

  signup(){
   this.navCtrl.push('RegisterPage');
  }
  forgetpass(){
    this.navCtrl.push('ForgetpasswordPage');
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
if(this.conn.Onconnection()){
  this.onloadingpage();
  if(this.loginform.valid){
  this.posts = null;
	this.http.get('https://app.ibpsguide.com/api/action.php?action=login&email='+encodeURIComponent(formData.email)+'&pass='+encodeURIComponent(formData.password))
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
     this.presentToast('Please Check your login details',3000);
    }
    },
    err => {
      this.loader.dismiss();
      this.presentToast('Error In Your Connection',3000);
    });
   }else{
    this.loader.dismiss();
    this.presentToast('Please Fill your login details',3000);
   }
 
  }else{
    this.presentToast('Error In Your Internet Connection',3000);
  }
}

  onloadingpage() {
    this.loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div>
        <img text-center src="assets/imgs/loader.gif" alt="loader" width="40px" />
        <h4>Please Wait...</h4>
      </div>`
    });
    this.loader.present();
  }
  mailto(){
    window.open('mailto:support@ibpsguide.com','_system');
  }

  ionViewDidEnter(){
    this.http.get('https://app.ibpsguide.com/api/list_course.php?userid=3')
    .map(res => res.json()).subscribe(data => {
      for(var i in data) {
        this.testitems.push(data[i]);
      }
      localStorage.setItem("testseriescourses",JSON.stringify(this.testitems));
    });
  }

  doGoogleLogin(){
    this.onloadingpage();
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '239906844101-7av7o3qvg33u483pno5lupvuev1dc337.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': false
    })
    .then((user) => {
        let accessToken = user.accessToken;
        let email = user.email;
        let idToken = user.idToken;
        let userId = user.userId;
        let displayName = user.displayName;
        let familyName = user.familyName;
        let givenName = user.givenName;
        let imageUrl = user.imageUrl;

        this.http.get('https://app.ibpsguide.com/api/google-login.php?imageUrl='+encodeURIComponent(imageUrl)+'&familyName='+encodeURIComponent(familyName)+'&displayName='+encodeURIComponent(displayName)+'&userId='+encodeURIComponent(userId)+'&idToken='+encodeURIComponent(idToken)+'&accessToken='+encodeURIComponent(accessToken)+'&email='+encodeURIComponent(email)+'&givenName='+encodeURIComponent(givenName))
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
        this.presentToast('Please Check your login details',3000);
        }
        },
        err => {
          this.loader.dismiss();
          this.presentToast('Error In Your Connection',3000);
        });

    }, (error) => {
      this.loader.dismiss();
      this.doGoogleLogin();
    });
  }


}


