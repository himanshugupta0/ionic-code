import { Component } from '@angular/core';
import { NavParams, ViewController } from "ionic-angular";
import { FormBuilder, Validators } from '@angular/forms';
import { DatabaseService } from "../../providers/database.service";
import { Localstorage } from "../../providers";

@Component({
  selector: 'page-note-modal',
  templateUrl: 'note-modal.html',
})

export class CreateNotePage {

    note: any = '';
    noteForm: any;
    subTaskId: any = '';
    subTaskName: any = '';
    mainTaskId: any = '';
    userEmail: any = '';
    subSubTaskId: any = '';
    subSubTaskName: any = '';
  
    constructor(
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private formBuilder: FormBuilder,
        public dbService: DatabaseService,
        private localstorage: Localstorage
        ) {
            this.localstorage.getValueFromLS("email").then(val => {
                this.userEmail = val;
            });
            this.subTaskId=navParams.get('subTaskId');
            this.subTaskName=navParams.get('subTaskName');
            this.mainTaskId=navParams.get('mainTaskId');
            this.subSubTaskId=navParams.get('subSubTaskId');
            this.subSubTaskName=navParams.get('subSubTaskName');
            this.noteForm = formBuilder.group({
                chatMessage: ['', [Validators.required]]
              })
            
        }

    uploadNote() {
        this.note = this.noteForm.value;
        console.log(this.note);
        this.dbService.sendNote({noteData:this.note,subTaskId:this.subTaskId,subTaskName:this.subTaskName,mainTaskId:this.mainTaskId,email:this.userEmail,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName}).subscribe(
            data => {
                console.log(data.taskData);
                this.viewCtrl.dismiss({taskData:data.taskData,from:'write_note'});
            },
            err => console.log(err)
        );
    };

    cancelUpload() {
        this.viewCtrl.dismiss();
    }

}