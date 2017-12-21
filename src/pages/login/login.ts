import { Component } from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { ForgotPage } from '../forgot/forgot';
import { DatabaseService, ToastService, Localstorage } from '../../providers';
import { ValidationService } from "../../providers/validation-service";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  loginCredentials: any;
  userEmail: any = '';
  loginForm: any;

  constructor(private navCtrl: NavController,
    private dbService: DatabaseService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public toast: ToastService,
    private localstorage: Localstorage,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    public validateService: ValidationService,
    private network: Network
  ) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, validateService.emailValidator]],
      password: ['', Validators.required]
    })
  }

  public createAccount() {
    this.navCtrl.push(RegisterPage).then(
      response => {
      },
      error => {
        console.log('Error: ' + error);
      }
    ).catch(exception => {
      console.log('Exception ' + exception);
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }

  showError(text) {
    this.hideLoading();
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  goToForgot() {
    this.navCtrl.push(ForgotPage);
  }

  onSubmit() {
    // this.network.onDisconnect().subscribe(data => {},error=>console.log(error));

    // if(this.network.type=="wifi"||this.network.type=="ethernet"||this.network.type=="cellular"||
    // this.network.type=="2g"||this.network.type=="3g"||this.network.type=="4g"){
    
      this.showLoading();
      this.loginCredentials = this.loginForm.value;
      this.dbService.loginData(this.loginCredentials, this.dbService.deviceToken).subscribe(
        res => {
          this.hideLoading();
          if (res.userDetail) {
            this.localstorage.storeIntoLS("name", res.userDetail.first_name);
            this.localstorage.storeIntoLS("email", res.userDetail.e_mail);
            this.localstorage.storeIntoLS("role", res.userDetail.role_name);
            this.localstorage.storeIntoLS("phone", res.userDetail.phone);
            this.navCtrl.setRoot(HomePage,{from:'login'});
          } else {
            this.toast.presentToast('Wrong credentials');
          }
        },
        error => {
          console.log(error);
          this.hideLoading();
        }
      );

    // }else{
    //     let alert = this.alertCtrl.create({
    //         title: 'No Internet',
    //         subTitle: 'It seems you dont have network.Please check your wifi or data network.',
    //         buttons: ['OK']
    //     });
    //     alert.present();
    // }
    // this.network.onConnect().subscribe(data => {},error=>console.log(error));
    
  }
}