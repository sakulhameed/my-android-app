import { Injectable } from '@angular/core';
import { Events, Platform, } from "ionic-angular";
import { ToastController, } from 'ionic-angular'; 

/*
  Generated class for the BackButtonEventHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BackButtonEventHandlerProvider {
  public backButtonPressedTimer: any;
  public backButtonPressed = false;

  // Unregister when entering other pages. I register another one later somewhere else for different callback.
  public unregisterBackButtonAction: any = null;
  constructor(public platform: Platform,public events: Events,public toastCtrl: ToastController) {
    console.log('Hello BackButtonEventHandlerProvider Provider');
  }

  // call this method when you want to register the event
  // pick another name
  registerPressToFlipCard(cb) {

    if (!cb) {
      return;
    }

    // the 101 priority number does not seem to work at all, ignore it
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(cb, 101);
  }

  // register double press event
  registerDoublePressToExitApp(page,navCtrl) {
    if (this.unregisterBackButtonAction) {
      return;
    }
    console.log('register double press to exit app');
    let cb = (page) => {
      return () => {
      	// when users press back button on the root page of a `stacked`(tabbar root page) pages, show exit app
        if (page=='FeedsPage') {
          navCtrl.setRoot("TabsPage");
        } else {
          this.showExit();
        }
      }
    };
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(cb(page), 101);
  }

  // show the message toast
  showExit() {
    if (this.backButtonPressed) {
      this.platform.exitApp();
    } else {
      let toast = this.toastCtrl.create({
        message: "Press again to exit",
        duration: 2000,
        position: "bottom"
      });
      toast.present();
      this.backButtonPressed = true;
      if (this.backButtonPressedTimer) {
        clearTimeout(this.backButtonPressedTimer);
      }
      this.backButtonPressedTimer = setTimeout(() => {
        this.backButtonPressed = false
      }, 2000);
    }
  }

  // unregister the double press to exit app event 
  unregister() {
    if (typeof this.unregisterBackButtonAction == 'function') {
      this.unregisterBackButtonAction();
      this.unregisterBackButtonAction = null;
      console.log('unregister double press to exit app');
    }
  }


}
