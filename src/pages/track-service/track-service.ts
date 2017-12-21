import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,ModalController } from 'ionic-angular';
import * as $ from "jquery";
import { CaptureSubServicePicturePage } from "../capture-sub-service-picture/capture-sub-service-picture";
import { MediaCapture } from '@ionic-native/media-capture';
import { SignaturePage } from '../signature/signature';


/**
 * Generated class for the TrackServicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-track-service',
  templateUrl: 'track-service.html',
})
export class TrackServicePage {
  trackServiceData : any = [];
  subSubServiceArrayData : any = []
  subSubServiceDisplay : any = [];
  trackData : any = [];
  imgUrl: string = null;
  public signatureImage: any;
 
  constructor(public mediaCapture: MediaCapture,public navParams: NavParams,public modalCtrl: ModalController) {
    console.log("Child Data for Track Service Page >>>>>>>>>>>>>>>>>>>>> ");
   // console.log(this.navParams.data);
    this.trackData=this.navParams.data;
    this.trackServiceData=[];
    this.subSubServiceArrayData=[];
    for(var i=0;i<this.trackData.length;i++){
      
      this.trackServiceData.push(this.trackData[i]) 
      console.log("this.trackServiceData : ");
      console.log(this.trackData[i]);
      console.log(this.trackServiceData); 
      
      for(var j=0;j<this.trackData[i].subsubtaskArray.length;j++){
        
        this.subSubServiceArrayData.push(this.trackData[i].subsubtaskArray[j]);
        console.log("this.subSubServiceArrayData : "+[j])
        console.log(this.subSubServiceArrayData);
      }
    }
    console.log("After For  >>>>>>>>>>>>>>>>>>>>> ");

  }

  showSubSubService(id){
    console.log("id >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
    console.log(id);
    if(this.subSubServiceDisplay.indexOf("subSub_"+id)<0){
      this.subSubServiceDisplay.push("subSub_"+id);
      $("#subSub_"+id).css({"display":"block"});
    }else{
      this.subSubServiceDisplay.pop("subSub_"+id);
      $("#subSub_"+id).css({"display":"none"});
    }
    // if(this.subSubServiceDisplay==false){
    //   console.log("False >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    //   $("#subSub_"+id).css({"display":"block"});
    //   this.subSubServiceDisplay=true;
    // }else{
    //   console.log("True >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    //   $("#subSub_"+id).css({"display":"none"});
    //   this.subSubServiceDisplay=false;
    // }
    
  }

  onClickUpdatePicture(id){
    console.log("onClickUpdatePicture");
    console.log(id);
    let profileModal = this.modalCtrl.create(CaptureSubServicePicturePage);
    profileModal.onDidDismiss(data => {
      this.imgUrl = data;
   });
   profileModal.present();
    
  }

  onClickUpdateVideo(id){
    console.log("onClickUpdateVideo");
    console.log(id);
     // Capture video>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
     this.mediaCapture.captureVideo((videodata) => {
      alert(JSON.stringify(videodata));
    });
  }

  onClickUpdateBarCode(id){
    console.log("onClickUpdateBarCode");
    console.log(id);
    
  }

  onClickUpdateSignature(id){
    console.log("onClickUpdateSignature");
    console.log(id);
    let signatureModal = this.modalCtrl.create(SignaturePage);
    signatureModal.onDidDismiss(data => {
      this.signatureImage = data;
    });
    signatureModal.present();
  }

  onClickUpdateNote(id){
    console.log("onClickUpdateNote");
    console.log(id);
  }

  onClickUpdateCall(id){
    console.log("onClickUpdateCall");
    console.log(id);
  }

  onClickUpdateSubSubPicture(id,subSubId){
    console.log("onClickUpdateSubSubPicture");
    console.log(id);
    console.log(subSubId);
  }

  onClickUpdateSubSubVideo(id,subSubId){
    console.log("onClickUpdateSubSubVideo");
    console.log(id);
    console.log(subSubId);
  }

  onClickUpdateSubSubBarCode(id,subSubId){
    console.log("onClickUpdateSubSubBarCode");
    console.log(id);
    console.log(subSubId);
  }

  onClickUpdateSubSubSignature(id,subSubId){
    console.log("onClickUpdateSubSubSignature");
    console.log(id);
    console.log(subSubId);
  }

  onClickUpdateSubSubNote(id,subSubId){
    console.log("onClickUpdateSubSubNote");
    console.log(id);
    console.log(subSubId);
  }

  onClickUpdateSubSubCall(id,subSubId){
    console.log("onClickUpdateSubSubCall");
    console.log(id);
    console.log(subSubId);
  }

  // changeProfilePhoto() {
  //   let profileModal = this.modalCtrl.create(ProfileModelPage);
  //   profileModal.onDidDismiss(data => {
  //     this.imgUrl = data;
  //  });
  //  profileModal.present();
  // }

}
