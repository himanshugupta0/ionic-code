import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController ,App,AlertController, LoadingController, Loading } from 'ionic-angular';
import { DatabaseService,Localstorage } from "../../providers";
import { Http, Headers } from '@angular/http';
import { SERVER_HOST } from "../../providers/constants";
import { ChangePasswordPage } from '../change-password/change-password';
import { ChangeAddressPage } from "../change-address/change-address";
import { ProfileModelPage } from "../profile-modal/profile-modal";
import { PopoverProfilePage } from "../../components/profile-page-popover/profile-popover";
import { Network } from '@ionic-native/network';

declare var cordova: any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userEmail: any = '';
  body: any = '';
  profileData: any = [];
  profileUrl: string = SERVER_HOST + '/api/fetchUserProfile';
  imgUrl: string = null;
  profileImageSrc: any = '';
  serverhost: any = SERVER_HOST;
  loading: Loading;

  constructor(
    private app: App,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private localstorage: Localstorage,
    public databaseService: DatabaseService,
    public http: Http,
    private network: Network,
    public atrCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
      // this.network.onDisconnect().subscribe(data => {},error=>console.log(error));

      // if(this.network.type=="wifi"||this.network.type=="ethernet"||this.network.type=="cellular"||
      // this.network.type=="2g"||this.network.type=="3g"||this.network.type=="4g"){
        this.showLoading();
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
              user_first_name : res.userDetail.first_name,
              user_phone : res.userDetail.phone,
              user_address : res.userDetail.personalAddress+","+res.userDetail.personalArea+","+res.userDetail.personalCity+" - "+res.userDetail.personalPinzip+","+res.userDetail.personalState+","+res.userDetail.personalCountry
            };
            if(res.userDetail.profileSrc[0] != null || '' || undefined ){
              this.profileImageSrc = res.userDetail.profileSrc[0].src;
            }else{
              this.profileImageSrc = "not defined";
            }
            this.hideLoading();
          }, (err) => {
            this.hideLoading();
            alert("failed");
          });
        });

      // }else{
      //     let alert = this.atrCtrl.create({
      //         title: 'No Internet',
      //         subTitle: 'It seems you dont have network.Please check your wifi or data network.',
      //         buttons: ['OK']
      //     });
      //     alert.present();
      // }
      // this.network.onConnect().subscribe(data => {},error=>console.log(error));
  }

  changeImage(){
    alert("Change Image");
  }

  changeAddress(){
    // this.network.onDisconnect().subscribe(data => {},error=>console.log(error));

    //   if(this.network.type=="wifi"||this.network.type=="ethernet"||this.network.type=="cellular"||
    //   this.network.type=="2g"||this.network.type=="3g"||this.network.type=="4g"){
      
        this.databaseService.editAddress(this.userEmail).subscribe(
          res => {
            this.navCtrl.push(ChangeAddressPage);
        },
          err => console.log(err)
        );

      // }else{
      //     let alert = this.atrCtrl.create({
      //         title: 'No Internet',
      //         subTitle: 'It seems you dont have network.Please check your wifi or data network.',
      //         buttons: ['OK']
      //     });
      //     alert.present();
      // }
      // this.network.onConnect().subscribe(data => {},error=>console.log(error));
  }

  changePassword(){
    this.navCtrl.push(ChangePasswordPage).then(
      response => {
      },
      error => {
        console.log('Error: ' + error);
      }
    ).catch(exception => {
      console.log('Exception ' + exception);
    });
  }

  changeProfilePhoto() {
    let profileModal = this.modalCtrl.create(ProfileModelPage);
    profileModal.onDidDismiss(data => {
      this.imgUrl = data;
   });
   profileModal.present();
  }

  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverProfilePage);
    popover.present({
      ev: myEvent
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  hideLoading(){
    this.loading.dismiss();
  }
  
}
