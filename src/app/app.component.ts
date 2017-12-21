import { Component, ViewChild } from "@angular/core";
import { App,Nav, Platform, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { Network } from '@ionic-native/network';
import { SplashScreen } from "@ionic-native/splash-screen";
import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";
import { Keyboard } from "@ionic-native/keyboard";
import { Push, PushToken } from '@ionic/cloud-angular';
import { Localstorage, DatabaseService } from "../providers";

@Component({
  templateUrl: 'app.html'
})
export class Mji247App {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  userEmail: any = '';
  deviceToken: any = '';
  pages: Array<{ title: string, component: any }>;

  constructor(
    public app: App,
    public platform: Platform,
    public statusBar: StatusBar,
    public network: Network,
    public keyboard: Keyboard,
    public splashScreen: SplashScreen,
    private localstorage: Localstorage,
    private dbService: DatabaseService,
    public push: Push,
    public events: Events
    ) {
      this.initializeApp();
    
    this.localstorage.getValueFromLS("email").then(val => {
      this.userEmail = val;
      if (this.userEmail === '' || this.userEmail === null) {
        this.rootPage = LoginPage;
      } else {
        //this.rootPage = HomePage;
        this.app.getRootNav().setRoot(HomePage,{from:'components'});
      }
    });

    //Registering Device Tokens
    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      this.dbService.deviceToken = t.token;
    });

    //Handling Notifications
    this.push.rx.notification()
      .subscribe((msg) => {
         this.events.publish('push_notification', msg.raw.message);
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // do whatever you need to do here.
      setTimeout(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.keyboard.disableScroll(true);
      //   var push = Push.init({
      //   android: {
      //     senderID: "694054568313"
      //   },
      //   ios: {
      //     alert: "true",
      //     badge: true,
      //     sound: 'false'
      //   },
      //   windows: {}
      // });

      // push.on('registration', (data) => {
      //   console.log(data.registrationId);
      //   alert(data.registrationId.toString());
      // });
      // push.on('notification', (data) => {
      //   console.log(data);
      //   alert("Hi, Am a push notification");
      // });
      // push.on('error', (e) => {
      //   console.log(e.message);
      // });
   
      }, 0);
    });
  }
}
