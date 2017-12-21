import { Component } from '@angular/core';
import {App,AlertController, NavController, NavParams,ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { ForgotPage } from '../forgot/forgot';
import { DatabaseService, ToastService, Localstorage } from '../../providers';
import { SERVER_HOST } from "../../providers/constants";
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  credentials: any;
  userEmail: any = '';

  changePassForm: FormGroup;
  oldPassword = new FormControl("", Validators.required);
  newPassword = new FormControl("", Validators.required);
  newPasswordAgain = new FormControl("", Validators.required);

  profileUrl: string = SERVER_HOST + '/api/changepass';


  constructor(
    private app: App,
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private dbService: DatabaseService,
    public toast: ToastService,
    private localstorage: Localstorage,
    private navParams: NavParams,
    public formBuilder: FormBuilder,
    public http: Http,
    private network: Network,
    public atrCtrl: AlertController
  ) {

    this.changePassForm = formBuilder.group({
        "oldPassword": this.oldPassword,
        "newPassword": this.newPassword,
        "newPasswordAgain": this.newPasswordAgain
        }, {validator: this.matchingPasswords('newPassword', 'newPasswordAgain')});
  }


  goToForgot() {
    this.navCtrl.push(ForgotPage);
  }

  onSubmit() {
    this.network.onDisconnect().subscribe(data => {},error=>console.log(error));

    if(this.network.type=="wifi"||this.network.type=="ethernet"||this.network.type=="cellular"||
    this.network.type=="2g"||this.network.type=="3g"||this.network.type=="4g"){
    
        this.localstorage.getValueFromLS("email").then(val => {
        this.userEmail = val;
        
        let headers = new Headers();  
        headers.append('Content-Type', 'application/json');

        let body = {
          email:this.userEmail,
          oldPassword:this.changePassForm.value.oldPassword,
          newPassword:this.changePassForm.value.newPassword
        };
        this.http.post(this.profileUrl,JSON.stringify(body),{headers:headers})
        .map(res => res.json())
        .subscribe(res => {
          if(res.userDetail=="success"){
            this.viewCtrl.dismiss().then(() => {
              alert("Password Changed Successfully.");
              //this.app.getRootNav().push(ProfilePage);
            });
          }else{
            alert("Old Password is not correct.");
          }
        }, (err) => {
          alert("failed");
        });
      });

    }else{
        let alert = this.atrCtrl.create({
            title: 'No Internet',
            subTitle: 'It seems you dont have network.Please check your wifi or data network.',
            buttons: ['OK']
        });
        alert.present();
    }
    this.network.onConnect().subscribe(data => {},error=>console.log(error));

    //   this.dbService.changePassword(this.changePassForm.value.oldPassword, this.changePassForm.value.newPassword).subscribe(
    //     res => {
    //         this.navCtrl.setRoot(LoginPage);
    //         this.toast.presentToast('Password changed');
    //         },
    //     error => console.log(error)
    // );
  }


  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

}