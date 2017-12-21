import { Component } from '@angular/core';
import { App,NavController, AlertController, LoadingController,ToastController, IonicPage } from 'ionic-angular';
import { FormBuilder, Validators} from '@angular/forms'
import { DatabaseService } from '../../providers';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';
import { ValidationService } from "../../providers/validation-service";
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  
  forgetPasswordForm: any;
 
  constructor(
    private app: App,
    private navCtrl: NavController,
    private dbService: DatabaseService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    public validateService: ValidationService,
    private network: Network,
    ) {
      this.forgetPasswordForm = formBuilder.group({
      email: ['', [Validators.required, validateService.emailValidator]]
    })
              }

    private presentToast(text) {
      let toast = this.toastCtrl.create({
        message: text,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

  recoverPassword() {
    this.network.onDisconnect().subscribe(data => {},error=>console.log(error));

        if(this.network.type=="wifi"||this.network.type=="ethernet"||this.network.type=="cellular"||
        this.network.type=="2g"||this.network.type=="3g"||this.network.type=="4g"){
        
          this.dbService.forgetPassword(this.forgetPasswordForm.value).subscribe(
            res => {
              if(res.success){
                this.presentToast('Your password has been sent to your email');
              } else{
                this.presentToast('It seems your are not registered with us');
              }
            }, error => console.log(error)
          );

        }else{
            let alert = this.alertCtrl.create({
                title: 'No Internet',
                subTitle: 'It seems you dont have network.Please check your wifi or data network.',
                buttons: ['OK']
            });
            alert.present();
        }
        this.network.onConnect().subscribe(data => {},error=>console.log(error));

    
  }

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }
}