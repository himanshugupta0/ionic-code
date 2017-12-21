import { Component } from '@angular/core';
import { App,NavController, NavParams, ActionSheetController, ToastController, ViewController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Localstorage, SERVER_HOST } from "../../providers";
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { HomePage } from '../home/home';
declare var cordova: any;


/**
 * Generated class for the CaptureSubServicePicturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-capture-sub-service-picture',
  templateUrl: 'capture-sub-service-picture.html',
})
export class CaptureSubServicePicturePage {

   temp: any = null;
    loading: Loading;
    lastFile: string = null;
    targetPath: string = null;
    accuratePath: string = null;
    userEmail:any = '';
    subTaskId: any;
    subTaskName: any;
    subSubTaskId: any = '';
    subSubTaskName: any = '';
    mainTaskId: any;
 
  constructor(
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
    public app: App
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
        
        this.presentActionSheet();

        
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Upload from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            this.viewCtrl.dismiss();
          }
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
  
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  public createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
  
  // Copy the image to a local folder
  public copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastFile = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
  
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      this.accuratePath = cordova.file.dataDirectory + img;
      return cordova.file.dataDirectory + img;
    }
  }


  public uploadImage() {
    // Destination URL
    console.log("Upload Image ");
    var url = SERVER_HOST + "/api/uploadSubTaskPicture";
  
    // File for Upload
    this.targetPath = this.pathForImage(this.lastFile);
  
    // File name only
    var filename = this.lastFile;
  
    var options = {
      fileKey: "file",
      fileName: this.subTaskName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
        'fileName': filename,
        'email':this.userEmail,
        'subTaskId':this.subTaskId,
        'subTaskName':this.subTaskName,
        'mainTaskId':this.mainTaskId,
        'video_or_picture':'picture',
        'subSubTaskId':this.subSubTaskId,
        'subSubTaskName':this.subSubTaskName
      }
    };
  
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
  
    // Use the FileTransfer to upload the image
    fileTransfer.upload(this.targetPath, url, options).then(data => {
      this.loading.dismissAll()
      alert("Image has been uploaded.");
      console.log("Data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
      console.log(JSON.parse(data.response).taskData);

      this.viewCtrl.dismiss({allServices:this.navParams.get('allServices'),new_n:this.navParams.get('new_n'),taskData:JSON.parse(data.response).taskData,from:'capture-subtask-picture'}).then(() => {
      
      });
    }, err => {
      this.loading.dismissAll()
      alert("Error while uploading to server.");
    });
  }

  cancelUpload(){
    this.viewCtrl.dismiss();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CaptureSubServicePicturePage');
  }

}
