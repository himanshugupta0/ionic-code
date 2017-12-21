import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController,App,AlertController} from 'ionic-angular';
import { DatabaseService, ToastService,Localstorage } from '../../providers';
import { ProfilePage } from '../../pages/profile/profile';
import { Network } from '@ionic-native/network';
import { SERVER_HOST } from "../../providers/constants";
import { Http ,Headers} from '@angular/http';

@Component({
  selector: 'page-change-name-phone',
  templateUrl: 'change-name-phone.html',
})
export class ChangeNamePhonePage {
    userEmail: any = '';
    userName: any = '';
    userPhone: any = '';
    profileUrl: string = SERVER_HOST + '/api/fetchUserProfile';
    profileData: any = [];
    changeNamePhoneForm = new FormGroup({
        name: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required)
    });

    constructor(
        private app: App,
        public navCtrl: NavController,
        private dbService: DatabaseService,
        private toast: ToastService,
        private localstorage: Localstorage,
        public http: Http,
        private network: Network,
        public atrCtrl: AlertController
        ) {
            this.network.onDisconnect().subscribe(data => {},error=>console.log(error));

            if(this.network.type=="wifi"||this.network.type=="ethernet"||this.network.type=="cellular"||
            this.network.type=="2g"||this.network.type=="3g"||this.network.type=="4g"){
            
                this.localstorage.getValueFromLS("email").then(val => {
                    
                    this.userEmail = val;
                    
                    let headers = new Headers();  
                    headers.append('Content-Type', 'application/json');

                    let body = {
                    email:this.userEmail
                    };
                    this.http.post(this.profileUrl,JSON.stringify(body),{headers:headers})
                    .map(res => res.json())
                    .subscribe(res => {
                    this.profileData = {
                        user_email : res.userDetail.e_mail,
                        user_first_name : res.userDetail.user_name,
                        user_phone : res.userDetail.phone,
                        user_address : res.userDetail.personalAddress+","+res.userDetail.personalArea+","+res.userDetail.personalCity+" - "+res.userDetail.personalPinzip+","+res.userDetail.personalState+","+res.userDetail.personalCountry
                    };
                    this.userName=res.userDetail.user_name;
                    this.userPhone=res.userDetail.phone;
                
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
         }

    onSubmit() {
        this.network.onDisconnect().subscribe(data => {},error=>console.log(error));

        if(this.network.type=="wifi"||this.network.type=="ethernet"||this.network.type=="cellular"||
        this.network.type=="2g"||this.network.type=="3g"||this.network.type=="4g"){
        
            this.dbService.changeNamePhone(this.changeNamePhoneForm.value,this.userEmail).subscribe(
                res => {
                    this.toast.presentToast('Name and Phone no. changed successfully.');
                    //this.navCtrl.pop();
                    this.app.getRootNav().setRoot(ProfilePage);
                },
                err => console.log(err)
            );

        }else{
            let alert = this.atrCtrl.create({
                title: 'No Internet',
                subTitle: 'It seems you dont have network.Please check your wifi or data network.',
                buttons: ['OK']
            });
            alert.present();
        }
        this.network.onConnect().subscribe(data => {},error=>console.log(error));
    }

}