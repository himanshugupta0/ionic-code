import { Component, ViewChild } from '@angular/core';
import { App,Platform, NavParams, ActionSheetController, NavController, ViewController, ToastController, LoadingController, Loading} from 'ionic-angular';
import { SignaturePad} from 'angular2-signaturepad/signature-pad';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { HomePage } from '../home/home';
import { SERVER_HOST } from "../../providers/constants";
import { Localstorage } from "../../providers";
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})

export class SignaturePage {

  @ViewChild(SignaturePad) public signaturePad : SignaturePad;
  url: string = SERVER_HOST + "/api/uploadSubTaskPicture";
  pathForSign: string = null;
  loading: Loading;
  subSubTaskId: any = '';
  subSubTaskName: any = '';

  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  public signatureImage : string;
  userEmail:any = '';
  subTaskId: any;
  subTaskName: any;
  mainTaskId: any;

  constructor(
    public app: App,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    private localstorage: Localstorage,
    
  ) { 
        this.localstorage.getValueFromLS("email").then(val => {
          this.userEmail = val;
        });

        console.log("Sub Task Id And Name");
        console.log(navParams.get('subTaskId'));
        console.log(navParams.get('subTaskName'));
        this.subTaskId=navParams.get('subTaskId');
        this.subTaskName=navParams.get('subTaskName');
        this.subSubTaskId=navParams.get('subSubTaskId');
        this.subSubTaskName=navParams.get('subSubTaskName');
        this.mainTaskId=navParams.get('mainTaskId');
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  drawCancel() {
    this.navCtrl.setRoot(HomePage,{from:'signature'});
  }

  drawComplete() {
     
    this.signatureImage = this.signaturePad.toDataURL();
    const fileTransfer: FileTransferObject = this.transfer.create();
    const newName = this.createFileName();

    var filename = newName;
  
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
        'fileName': filename,
        'email':this.userEmail,
        'subTaskId':this.subTaskId,
        'subTaskName':this.subTaskName,
        'mainTaskId':this.mainTaskId,
        'video_or_picture':'signature',
        'subSubTaskId':this.subSubTaskId,
        'subSubTaskName':this.subSubTaskName
      }
    };
  
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
  
    // Use the FileTransfer to upload the image
    fileTransfer.upload(this.signatureImage, this.url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');

      if(JSON.parse(data.response).response=="Video Saved"){
        alert("Uploaded to server."); 
        this.viewCtrl.dismiss({taskData:JSON.parse(data.response).taskData,from:'signature'}).then(() => {
      
        });
      }else{
        alert("Error while uploading to server.");
      }
    }, err => {
      this.loading.dismissAll()
      alert("Error while uploading to server.");
    });
    this.viewCtrl.dismiss(this.signatureImage);
  }


  public createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".png";
    return newFileName;
  }

  drawClear() {
    this.signaturePad.clear();
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
    this.canvasResize();
  }

}
