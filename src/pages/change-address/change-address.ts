import { Component } from '@angular/core';
import { NavController,App,AlertController} from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService,Localstorage, ToastService } from '../../providers';
import { Http ,Headers} from '@angular/http';
import { SERVER_HOST } from "../../providers/constants";
import { ProfilePage } from '../../pages/profile/profile';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-change-address',
  templateUrl: 'change-address.html',
})
export class ChangeAddressPage {
  userEmail: any = '';
  profileUrl: string = SERVER_HOST + '/api/fetchUserProfile';
  profileData: any = [];
  address: string = '';
  area: string = '';
  zip: string = '';
  city: string = '';
  country: string = '';
  state: string = '';

  changeAddressForm = new FormGroup({
      address: new FormControl('', Validators.required),
      landmark: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required)
  });

  constructor(
    private app: App,
    private network: Network,
    public navCtrl: NavController,
    private localstorage: Localstorage,
    public databaseService: DatabaseService,
    public http: Http,
    private toast: ToastService,
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
          this.address=res.userDetail.personalAddress;
          this.area=res.userDetail.personalArea;
          this.city=res.userDetail.personalCity;
          this.zip=res.userDetail.personalPinzip;
          this.state=res.userDetail.personalState;
          this.country=res.userDetail.personalCountry;
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
      this.databaseService.changeAddress(this.changeAddressForm.value,this.userEmail).subscribe(
          res => {
              this.toast.presentToast('Address changed successfully.');
              this.app.getRootNav().setRoot(ProfilePage);
              // this.navCtrl.pop();
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