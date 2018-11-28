import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { AlertController } from 'ionic-angular';
import { ConnectionsProvider } from '../../providers/connections/connections';
import { CacheService } from 'ionic-cache';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { BackButtonEventHandlerProvider } from '../../providers/back-button-event-handler/back-button-event-handler';

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;
  userid;
  datalistitems;
  resultsec;
  rank;
  totrank;
  score;
  totquesmrk;
  qs_attempted;
  totques;
  time;
  accuracy;
  items;
  title;
  loader;
  getdatatot;
  tabsKey = 'my-tabs-ResultPage';
  tabsfilms: Observable<any>;
  showAlertMessage;
  loadershow=true;
  
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  @ViewChild('barCanvasacry') barCanvasacry;
  barChartacry: any;
  
  //barCanvasacry
  tabBarElement;
  constructor(public backhand: BackButtonEventHandlerProvider,private androidFullScreen: AndroidFullScreen,public storage: Storage,public sanitizer: DomSanitizer,public conn: ConnectionsProvider,public alertCtrl: AlertController,private cache: CacheService,public http: Http,public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController) {
    this.userid = localStorage.getItem("clientid");
    this.showAlertMessage = false;
    this.items = navParams.data.item;
    
    this.androidFullScreen.isImmersiveModeSupported()
   .then(() =>this.androidFullScreen.immersiveMode())
   .catch(err => console.log(err));
    if(this.items['aftersaveresult']=='1'){
      this.showAlertMessage = true; 
    }
   
    this.loadFilms();
    this.onloadingpage();
    this.backhand.unregister();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabBarElement.style.display = 'none';
  }
  taketest(item){
    let testname = 'test-'+this.items.testpaneltype+'-'+this.items.test_id;
    this.storage.remove(testname);
    this.navCtrl.push('TaketestPage', { item: item }).then(() => {
      let index = this.navCtrl.last().index-1;
      this.navCtrl.remove(index);
    });
  }
  viewSolution(item: string) {
    this.navCtrl.push('SolutionPage', { item: item });
  }
    onloadingpage() {
      this.loadershow=true;
    }


  // Load either from API or Cache
  loadFilms(refresher?) {
    this.loadershow=true;
    this.tabslisting(refresher);
  }
  // Pull to refresh and force reload
  forceReload(refresher) {
    this.loadFilms(refresher);
  }
  sec_num;
  minutes;seconds;
  toMMSS(secs) {
    this.sec_num = parseInt(secs, 10);
    this.minutes = Math.floor(this.sec_num / 60) % 60;
    this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;
    this.seconds = this.sec_num % 60;
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    return this.minutes + ":" + this.seconds;
  }

  tabslisting(refresher?) {
    let soluname = 'mytestsolution-'+this.items.testpaneltype+'-'+this.items.test_id;
    let soluid = this.items.id;
    this.storage.set(soluname,soluid);
    console.log(soluname);
    let url = 'https://app.ibpsguide.com/api/showresult.php?testpaneltype='+this.items.testpaneltype+'&resultid='+soluid+'&test_id='+this.items.test_id+'&userid='+this.userid;
    if(this.showAlertMessage){
      this.cache.removeItem(url);
    }
    let req = this.http.get(url)
      .map(res => {
        return res.json();
      });
    let ttl = 60 * 60 * 10;
    if (refresher) {
      // Reload data even if it is cached
      let delayType = 'all';
      this.tabsfilms = this.cache.loadFromDelayedObservable(url, req, this.tabsKey, ttl, delayType);
      // Hide the refresher once loading is done
      this.tabsfilms.subscribe(data => {
        this.datalistitems = data;
        this.onLoadData(data);  
        refresher.complete();      
      });
    } else {
      this.tabsfilms = this.cache.loadFromObservable(url, req, this.tabsKey, ttl);
      this.tabsfilms.subscribe(data => {
        this.datalistitems = data;
        this.onLoadData(data);
      });
    }
    
  }

  correct_qs;
  incorrect_qs;
  unattempted;
  topscore;
  avgscore;
  totmark;topscorerlist;
  toptime_spent;topaccuracy;attemptedex;accuracyavg;
  onLoadData(data){
    this.datalistitems = data;
    this.title=this.datalistitems['testname'];
    this.rank = this.datalistitems['rank'];
    this.totrank = this.datalistitems['allrank'];
    this.score = this.datalistitems['score'];
    this.topscore = this.datalistitems['topscore'];
    this.totquesmrk = this.datalistitems['totquesmrk'];
    this.qs_attempted = this.datalistitems['qs_attempted'];
    this.correct_qs = this.datalistitems['correct_qs'];
    this.incorrect_qs = this.datalistitems['incorrect_qs'];
    this.totques = this.datalistitems['totques'];
    this.time = this.datalistitems['time'];
    this.accuracy = this.datalistitems['accuracy'];
    this.resultsec = this.datalistitems['sec'];
    this.attemptedex = this.datalistitems['attempted'];

    this.topscorerlist = this.datalistitems['topscorerlist'];
    this.loadershow=false;

    this.topaccuracy  = this.datalistitems['topaccuracy'];
    this.toptime_spent  = this.datalistitems['toptime_spent'];
    let lng = this.datalistitems['sec'].length-1;
    this.getdatatot = this.datalistitems['sec'][lng];
    this.avgscore = this.datalistitems['avgscoreg'];
    this.totmark = this.datalistitems['totmarkg'];
    this.accuracyavg = this.datalistitems['accuracyavg'];

    this.unattempted = parseInt(this.totques)-parseInt(this.datalistitems['qs_attempted']);


    let dataarray=[];
    dataarray.push(parseInt(this.datalistitems['correct_qs']));
    dataarray.push(parseInt(this.datalistitems['incorrect_qs']));
    dataarray.push(parseInt(this.datalistitems['qs_attempted']));
    dataarray.push(parseInt(this.unattempted));
    let dataarraylab=[];
    dataarraylab.push("Correct");
    dataarraylab.push("InCorrect");
    dataarraylab.push("Attempted");
    dataarraylab.push("UnAttempted");

  

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
          labels: dataarraylab,
          datasets: [{
              label: '# of Questions',
              data: dataarray,
              backgroundColor: [
                'rgba(104, 204, 104, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              hoverBackgroundColor: [
                'rgba(104, 204, 104, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderColor: [
                'rgba(104, 204, 104, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 2
          }]
      }

    });

    let dataarray1=[];
    dataarray1.push(parseInt(this.score));
    dataarray1.push(parseInt(this.topscore));
    dataarray1.push(parseInt(this.avgscore));
    


    this.barChart = new Chart(this.barCanvas.nativeElement, {
 
      type: 'bar',
      data: {
          labels: ["Your Score", "Top Score", "Avg Score"],
          datasets: [{
              label: 'Score',
              data: dataarray1,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)'
              ],
              hoverBackgroundColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54,162,235,1)',
                  'rgba(255,206,86,1)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54,162,235,1)',
                  'rgba(255,206,86,1)'
              ],
              borderWidth: 2
          }]
      },
      options: {
          scales: {
              yAxes: [{
                display: true,
                ticks: {
                  beginAtZero: true,
                  steps: 10,
                  stepValue: 5,
                  max: this.totmark
                }
              }]
          },
          legend: {
            display: false,
        },
      }

  });

  let dataarray2=[];
  dataarray2.push(parseInt(this.accuracy));
  dataarray2.push(parseInt(this.topaccuracy));
  dataarray2.push(parseInt(this.accuracyavg));


  this.barCanvasacry = new Chart(this.barCanvasacry.nativeElement, {
    type: 'bar',
    data: {
        labels: ["Yours", "Topper", "Avg"],
        datasets: [{
            label: 'Accuracy %',
            data: dataarray2,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54,162,235,1)',
                'rgba(255,206,86,1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                max: 100
              }
            }]
        },
        legend: {
          display: false,
      },
    }

});

  }
 /*
  checkpert(item,t){
    let width=0;
    if(t==1){
      width = Math.round((parseInt(item.correct_qs)/parseInt(item.totques))*100);
    }else if(t==2){
      width = Math.round((parseInt(item.incorrect_qs)/parseInt(item.totques))*100);
    }else if(t==3){
      width = Math.round(((parseInt(item.totques)-parseInt(item.qs_attempted))/parseInt(item.totques))*100);
    }
    return "width: "+width+"%;";
    //return this.sanitizer.bypassSecurityTrustStyle(style);
  }
  */

}
