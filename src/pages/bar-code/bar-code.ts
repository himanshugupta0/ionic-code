import { Component } from '@angular/core';
import { NavParams, ViewController } from "ionic-angular";
import { DatabaseService } from "../../providers/database.service";
import { Localstorage } from "../../providers";

@Component({
  selector: 'page-bar-code',
  templateUrl: 'bar-code.html',
})

export class DisplayBarCodePage {

    barCodeData: any = '';
    subTaskId: any = '';
    subTaskName: any = '';
    mainTaskId: any = '';
    userEmail: any = '';
    subSubTaskId: any = '';
    subSubTaskName: any = '';
    constructor(
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public dbService: DatabaseService,
        private localstorage: Localstorage
        ) {
            this.localstorage.getValueFromLS("email").then(val => {
                this.userEmail = val;
            });
            this.barCodeData = this.navParams.get('data');
            console.log(this.barCodeData);
            console.log(this.barCodeData.text);
            this.subTaskId=navParams.get('subTaskId');
            this.subTaskName=navParams.get('subTaskName');
            this.subSubTaskId=navParams.get('subSubTaskId');
            this.subSubTaskName=navParams.get('subSubTaskName');
            this.mainTaskId=navParams.get('mainTaskId');
    }

    uploadBarcode() {
        this.dbService.sendBarCode({barCodeData:this.barCodeData,subTaskId:this.subTaskId,subTaskName:this.subTaskName,mainTaskId:this.mainTaskId,email:this.userEmail,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName}).subscribe(
            data => {
                console.log(data);
                this.viewCtrl.dismiss({taskData:data.taskData,from:'barcode'});
            },
            err => console.log(err)
        );
    };

    cancelUpload() {
        this.viewCtrl.dismiss();
    }

}