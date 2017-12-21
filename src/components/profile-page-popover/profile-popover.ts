import { Component } from '@angular/core';
import { App, ViewController, NavController } from 'ionic-angular';

import{ChangeAddressPage} from '../../pages/change-address/change-address';
import {ChangePasswordPage} from '../../pages/change-password/change-password';
import {ChangeNamePhonePage} from "../../pages/change-name-phone/change-name-phone";
import {ToastService, Localstorage} from '../../providers';

@Component({
  templateUrl: 'profile-popover.html'
})

export class PopoverProfilePage {
  constructor(
    private app: App,
    public viewCtrl: ViewController,
    private navCtrl: NavController,
    public toast: ToastService,
    public localstorage: Localstorage
    ) {}

  editNamePhone() {
    this.viewCtrl.dismiss();
    this.app.getRootNav().setRoot(ChangeNamePhonePage);
    //this.navCtrl.push(ChangeNamePhonePage);
  }

  editAddress() {
    this.viewCtrl.dismiss();
    this.app.getRootNav().setRoot(ChangeAddressPage);
    //this.navCtrl.push(ChangeAddressPage);
  }

  editPassword() {
    this.viewCtrl.dismiss();
    this.app.getRootNav().setRoot(ChangePasswordPage);
    //this.navCtrl.push(ChangePasswordPage);
  }

}