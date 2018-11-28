import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AppRate } from '@ionic-native/app-rate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CacheModule } from 'ionic-cache';
import { Firebase } from '@ionic-native/firebase';
//import { AppVersion } from '@ionic-native/app-version';
import { GooglePlus } from '@ionic-native/google-plus';
import { Network } from '@ionic-native/network';
import { ConnectionsProvider } from '../providers/connections/connections';
import { IonicStorageModule } from '@ionic/storage';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../providers/back-button-event-handler/back-button-event-handler';
import { OneSignal } from '@ionic-native/onesignal';
//import { NativeAudio } from '@ionic-native/native-audio';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RoundProgressModule,
    IonicModule.forRoot(MyApp,{
      scrollAssist: true,
      autoFocusAssist: true
    }),
    CacheModule.forRoot(),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    InAppBrowser,
    AppRate,
    SocialSharing,
    Firebase,
    OneSignal,
    //AppVersion,
    Network,
    ConnectionsProvider,
    AndroidFullScreen,
    //NativeAudio,
    BackButtonEventHandlerProvider,
    GooglePlus,AdMobFree
  ]
})
export class AppModule {}
