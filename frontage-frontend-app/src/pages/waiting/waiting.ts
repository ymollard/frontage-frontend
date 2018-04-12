import { TranslateService } from '@ngx-translate/core';
import { DataFAppsProvider } from './../../providers/data-f-apps/data-f-apps';
import { Subscription, Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-waiting',
  templateUrl: 'waiting.html',
})
export class WaitingPage {
  WAITING_SERVER: string = "";
  ALREADY_QUEUED: string = "";
  QUEUED: string = "";
  STARTING: string = "";


  position: number;
  message: string;
  isLaunched: boolean = false;
  isWaitingServer: boolean = false;

  joystickPage: any;
  joystickParams: any;

  positionSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataFAppsProvider: DataFAppsProvider,
    public tranlation: TranslateService) {

    tranlation.get("WAITING_SERVER").subscribe(t => {
      this.WAITING_SERVER = t;
    });
    tranlation.get("ALREADY_QUEUED").subscribe(t => {
      this.ALREADY_QUEUED = t;
    });
    tranlation.get("QUEUED").subscribe(t => {
      this.QUEUED = t;
    });
    tranlation.get("STARTING").subscribe(t => {
      this.STARTING = t;
    });

    this.message = this.WAITING_SERVER;

    this.joystickPage = navParams.get('joystick');
    this.joystickParams = navParams.get('joystickParams')

    //Check if the user is the owner of the current app
    let currentApp: any = this.dataFAppsProvider.getCurrentApp().subscribe();

    let serverResponse: any = navParams.get('info');

    //If queued then periodically check the position in the queue 
    if (serverResponse.status === 400) {
      this.startApp();
    }

    if (serverResponse.queued) {
      this.positionSubscription = Observable.interval(1000)
        .subscribe(x => this.positionSubscriptionStart(x));
    } else if (serverResponse.status === 403) {
      this.message = this.ALREADY_QUEUED;
    } else if (serverResponse.status === 200) {
      this.startApp();
    } else {
      throw "WaitingPage : erreur la reponse HTTP du serveur est [" + serverResponse.status + "]";
    }

  }

  positionSubscriptionStart(x) {
    if (!this.isWaitingServer) {
      this.isWaitingServer = true;
      this.dataFAppsProvider.checkPosition()
        .subscribe(response => this.checkPosition(response));
    }
  }

  checkPosition(response: any) {
    this.position = response.position;

    this.message = this.QUEUED + this.position;

    this.isWaitingServer = false;
    if (this.position === -1) {
      if (!this.isLaunched) {
        this.isLaunched = true;

        this.startApp();
      }
    }
  }

  backButtonClick() {
    this.backButtonAction();
  }

  backButtonAction() {
    this.dataFAppsProvider.quitQueue();
    this.navCtrl.pop();
  }

  ionViewWillLeave() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
      this.positionSubscription = undefined;
    }
  }

  ionViewWillAppear() {
    this.isLaunched = false;
    this.isWaitingServer = false;
  }

  startApp() {
    this.message = this.STARTING;
    this.navCtrl.push(this.joystickPage, { joystickParams: this.joystickParams }).then(() => {
      this.navCtrl.remove(this.navCtrl.getPrevious().index);
    });
  }
}
