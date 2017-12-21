import { Component } from '@angular/core';
import { NavController, App ,AlertController, IonicPage } from 'ionic-angular';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DatabaseService } from '../../providers';
import { LoginPage } from '../login/login';
import { ValidationService } from "../../providers/validation-service";
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  createSuccess = false;
  registerCredentials: any;
  registrationForm: any;

  constructor(
    private app: App,
    private navCtrl: NavController,
    private dbService: DatabaseService,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    public validateService: ValidationService,
    private network: Network
  ) {

    this.registrationForm = formBuilder.group({
      name: ['', [Validators.required, validateService.nameValidator]],
      email: ['', [Validators.required, validateService.emailValidator]],
      phone: ['', [Validators.required, validateService.phoneValidator]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      zip: ['', [Validators.required, validateService.zipValidator]],
      city: ['', [Validators.required, validateService.othersValidator]],
      country: ['', [Validators.required, validateService.othersValidator]],
      state: ['', [Validators.required, validateService.othersValidator]]
    }, {
      validator: this.MatchPassword // your validation method
    });

  }

  MatchPassword(abstractCtrl: AbstractControl) {
    let password = abstractCtrl.get('password').value; // to get value in input tag
    let confirmPassword = abstractCtrl.get('confirmPassword').value; // to get value in input tag
    if(password != confirmPassword) {
      abstractCtrl.get('confirmPassword').setErrors( {MatchPassword: true} )
    } else {
        return null
    }
 }

  onSubmit() {
    this.network.onDisconnect().subscribe(data => {},error=>console.log(error));

    if(this.network.type=="wifi"||this.network.type=="ethernet"||this.network.type=="cellular"||
    this.network.type=="2g"||this.network.type=="3g"||this.network.type=="4g"){
    
      this.registerCredentials = this.registrationForm.value;
      this.dbService.signUpData(this.registerCredentials, this.dbService.deviceToken).subscribe(
        res => {
          if (res.success) {
            this.createSuccess = true;
            this.showPopup("Success", res.msg);
            this.navCtrl.setRoot(LoginPage);
          } else {
            this.showPopup("Error", res.msg);
          }
        },
        error => {
          this.showPopup("Error", error);
        }
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
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.navCtrl.setRoot(LoginPage);
            }
          }
        }
      ]
    });
    alert.present();
  }

}
