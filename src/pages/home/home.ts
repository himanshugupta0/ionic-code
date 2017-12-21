import { Injectable } from "@angular/core";
import { Component, EventEmitter, NgZone, ViewChild, ElementRef } from "@angular/core";
import { ToastController,App,AlertController, Content, NavController, ModalController, Platform, LoadingController, Loading, ViewController, PopoverController, Events,NavParams } from 'ionic-angular';
import { ChatMessage, DatabaseService, Localstorage,UtilService, StartService, ToastService, SERVER_HOST, MessageType } from "../../providers";
import * as io from "socket.io-client";
import Socket = SocketIOClient.Socket;
import { PopoverContentPage } from "../../components/popover/";
import { ServiceDescription } from "../../pages/service-description/service-description";
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { LoginPage } from '../../pages/login/login';
import { PayNowPage } from "../paynow/paynow";
import { DisplayBarCodePage } from "../../pages/bar-code/bar-code";
import { CreateNotePage } from "../../pages/note-modal/note-modal";
import { TrackServicePage } from '../../pages/track-service/track-service';

import { SplashScreen } from "@ionic-native/splash-screen";
import { Network } from '@ionic-native/network';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from "../../providers/validation-service";
import { CaptureSubServicePicturePage } from "../capture-sub-service-picture/capture-sub-service-picture";
import { MediaCapture } from '@ionic-native/media-capture';
import { SignaturePage } from '../signature/signature';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { VideoCapturePlus, VideoCapturePlusOptions, MediaFile } from '@ionic-native/video-capture-plus';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject, FileUploadOptions } from '@ionic-native/transfer';
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

@Injectable()
export class HomePage {
  @ViewChild(Content) content_new: Content;
  @ViewChild('txtChat') txtChat: any;
  @ViewChild('createServiceReply') createServiceReply: any;
  @ViewChild('content') content: any;
  subTaskName: string;
  subTaskId: string;
  subSubTaskId: string = '';
  subSubTaskName: string = '';
  inputmsg: any = '';
  imgUrl: string = null;
  chatCredentials:any;
  action_type: any;
  allServices: any;
  public signatureImage: any;
  public shouldHide: boolean;
  public shouldHideServices: boolean;
  public shouldHideCreateService: boolean;
  public ionScroll;
  public showButton = false;
  public contentData = [];
  public offSetTop: any;
  public offSetTopTrack: any;
  public element: any = '';
  public elementTrack: any = '';
  public cardNode: any = false;
  public socket: Socket;
  loading: Loading;
  userName: any = '';
  userEmail: any = '';
  userPhone: any = '';
  userRole: any = '';
  serverData: any = {};
  actualData: any = [];
  messages: any[];
  jsonData: any = {};
  prevJsonData: any = {};
  level: any = 0;
  elements: any = [];
  msgToShow: any = [];
  assetType: any = "";
  childData: any = [];
  formData: any = [];
  questions: any = [];
  question: any = [];
  currentNum: any = 0;
  prevChildNum: any = 0;
  curChildNum: any = 0;
  formResponse: any = {};
  tempArr: any = [];
  chatFooterEnabled: boolean = true;
  inputFooterEnabled: boolean = false;
  isStartEnabled: boolean = false;
  isBackEnabled: boolean = false;
  chatBox: string;
  btnEmitter: EventEmitter<string>;
  serverhost: any = SERVER_HOST;
  pushNotificationOfThisService: any = [];
  pushNotificationForSubSubtask: any = [];
  pushNotificationForSubtask: any = [];
  tempPushNotificationForSubtask: any = [];
  tempPushNotificationForSubSubtask: any = [];
  tempTestInfo: any = '';
  nameOfService: any = '';
  pushNotificationData: any = [];
  nameRegex: any = /^[a-zA-Z]*$/g;
  emailRegex: any = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  // phoneRegex: any = /^\d{10}$/;
  // pinRegex: any = /^\d{6}$/;
  appInit: boolean = true;
  pendingStatus: boolean = false;
  chatForm: any;
  showAttachmentDiv: boolean = false;
  showAttachmentIcon: boolean = false;
  mainTaskId: any;
  updatedData: any =[];
  new_n: any;
  completeStatusSubTask: boolean = false;
  completeStatusSubSubTask: boolean = false;

  public toastCtrl: ToastController;
  constructor(
    public navParams:NavParams,
    private app: App,
    private network: Network,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public mediaCapture: MediaCapture,
    public _zone: NgZone,
    public databaseService: DatabaseService,
    public utilService: UtilService,
    public startService: StartService,
    public toast: ToastService,
    private localstorage: Localstorage,
    public http: Http,
    public viewCtrl: ViewController,
    public myElement: ElementRef,
    public events: Events,
    public platform:Platform,
    public splashScreen:SplashScreen,
    public loadingCtrl: LoadingController,
    public atrCtrl: AlertController,
    private formBuilder: FormBuilder,
    public validateService: ValidationService,
    public transfer: Transfer,
    private barcodeScanner: BarcodeScanner,
    private geolocation: Geolocation
  ) {
    this.chatForm = formBuilder.group({
      chatMessage: ['', [Validators.required]]
    })

    this.platform.ready().then(()=>{
        this.splashScreen.hide();
    });

    this.showLoading();

    events.subscribe('hello', (data) => {
      this.socketDisconnect(data);
    });
    this.events.subscribe('show_info', (testInfo) => {
      this.tempTestInfo = testInfo;
    });
    this.localstorage.getValueFromLS("email").then(val => {
      this.userEmail = val;
    });
    this.localstorage.getValueFromLS("phone").then(val => {
      this.userPhone = val;
    });
    this.localstorage.getValueFromLS("role").then(val => {
      this.userRole = val;
    });
    this.localstorage.getValueFromLS("name").then(val => {
      this.userName = val;
      let userData = { 'userName': this.userName, 'userPhone': this.userPhone, 'userEmail': this.userEmail, 'userType': this.userRole };
      this.socket = io(SERVER_HOST, { path: '/socketserver/socket.io', query: userData, autoConnect: false });
      this.socket.connect();
      this.socket.on("connect", () => {
        console.log('***Socket Connected***');
      });

      this.socket.on("reconnecting", attempt => {
        console.log('***Socket Reconnecting***', attempt);
      });

      this.socket.on("reconnect_failed", () => {
        console.log('***Socket Reconnect failed***');
      });

      this.socket.on('disconnect', () => {
        console.log('***Socket Disconnected***');
      });

      this.socket.on(MessageType.MSG_RES, response => {
        let chatMessage: ChatMessage = response;
        if (typeof response === 'string') {
          chatMessage = {
            type: MessageType.MSG_RES,
            fromName: 'Bot',
            fromEmail: 'Bot',
            message: response
          };
        }
        chatMessage.epoch = UtilService.getEpoch();
        this.elements.push({ "type": "chat_message", "values": [{ "msg": chatMessage.message, "type": chatMessage.type }] });
        this.scrollToBottom();
      });
      // this.elements.push({ "type": "message", "values": [ "Hi "+this.userName ] });
    });

    // this.init();
    this.setToDefault();
    if(this.navParams.get('from')=='capture-subtask-picture'||this.navParams.get('from')=='video'||this.navParams.get('from')=='signature'){
      this.showAttachmentDiv = false;
      this.updatedData=this.navParams.get('taskData');
      
      this.fetchAllServicesFromServer('/api/getAllServicesBo').then(function (val) {
          for(var i=0;i<this.updatedData.subtaskArray.length;i++){
            if(this.updatedData.subtaskArray[i].subtaskstate=="pending"&&this.pendingStatus==false){
              this.pendingStatus=true;
              console.log("Particular click of back office manager track service ........");
              var tempMsg = [];
              tempMsg.push({ "msg": this.updatedData.subtaskArray[i].subtaskName, "type": "message_response" });
              this.msgToShow = tempMsg;
              this.elements.push({ "type": "message", "values": this.msgToShow });
              this.action_type = this.updatedData.subtaskArray[i].subtaskAction;
              this.subTaskId = this.updatedData.subtaskArray[i]._id;
              this.subTaskName = this.updatedData.subtaskArray[i].subtaskName;
              console.log("Value of n isssssssssssss");
              console.log(this.navParams.get('new_n'));
              console.log(this.allServices);
              for(var i=0;i<this.allServices.length;i++){
                if(i==this.navParams.get('new_n')){
                  console.log("this.allServices[i]._id");
                  console.log(this.allServices[i]._id);
                  this.mainTaskId = this.allServices[i]._id;
                }
              } 
                     
            }else{
              for(var j=0;j<this.updatedData.subtaskArray[i].subsubtaskArray.length;j++){
                if(this.updatedData.subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"&&this.pendingStatus==false){
                  this.pendingStatus=true;
                  console.log("Particular click of back office manager track service ........");
                  var tempMsg = [];
                  tempMsg.push({ "msg": this.updatedData.subtaskArray[i].subsubtaskArray[j].subsubtaskName, "type": "message_response" });
                  this.msgToShow = tempMsg;
                  this.elements.push({ "type": "message", "values": this.msgToShow });
                  this.action_type = this.updatedData.subtaskArray[i].subsubtaskArray[j].subsubtaskAction;
                  this.subTaskId = this.updatedData.subtaskArray[i]._id;
                  this.subTaskName = this.updatedData.subtaskArray[i].subtaskName;
                  this.subSubTaskId = this.updatedData.subtaskArray[i].subsubtaskArray[j]._id;
                  this.subSubTaskName = this.updatedData.subtaskArray[i].subsubtaskArray[j].subsubtaskName;
                  console.log("Value of n isssssssssssss");
                  console.log(this.navParams.get('new_n'));
                  console.log(this.allServices);
                  for(var i=0;i<this.allServices.length;i++){
                    if(this.navParams.get('new_n')){
                      console.log("this.allServices[i]._id");
                      console.log(this.allServices[i]._id);
                      this.mainTaskId = this.allServices[i]._id;
                    }
                  }        
                }
              }
            }
          } 
        }).catch(function (err) {
          console.log(err);
        });
    }
  }
  socketDisconnect(data) {
    console.log("socketDisconnect");
    // this.socket.on('disconnect', () => {
    //     console.log('***Socket Disconnected***');
    //   });
    if (this.socket) {
      this.socket.close();
      this.localstorage.clearLocalStorage();

      this.app.getRootNav().setRoot(LoginPage);
      this.toast.presentToast('Logout successfully');
    }
  }

  setToDefault() {
    this.btnEmitter = new EventEmitter<string>();
    this.messages = [];
    this.elements = [];
    this.chatBox = "";
    this.localstorage.getValueFromLS("role").then(val => {
      this.startService.getData({"userRole":val}).subscribe((data) => {
        console.log("Data Root");
        console.log(data.root);
        this.showNode(data.root, 0,'null');
        
      });
      this.pushNotificationMsg();
    });
    this.pushNotificationMsg();
  }
  fetchAllServicesFromServer(dataUrl) {
    return new Promise((resolve, reject) => {
      this.databaseService.getAllServices({ "email": this.userEmail, "url": dataUrl }).subscribe(
        response => {
          console.log("Rsponse ")
          console.log(response);
          this.allServices=response.allServices;
          resolve(response)
        },
        error => reject(error)
      );
    });
  }
  sendUserRequest(formData) {
    this.databaseService.createService(formData).subscribe(
      response => {
        if (response.success) {
          this.toast.presentToast(response.msg);
        } else {
          this.toast.presentToast(response.msg);
        }
      },
      error => this.toast.presentToast('Something went wrong')
    );
  }
  showNode(doc, n, selectedNode) {
    this.showAttachmentIcon = false;
    // watch network for a disconnect
    // this.network.onDisconnect().subscribe(data => {
      // let alert = this.atrCtrl.create({
      //   title: 'No Internet',
      //   subTitle: 'It seems you dont have network.Please check your wifi or data network.',
      //   buttons: ['OK']
      // });
      // alert.present();
    // },error=>console.log(error));
    // if(this.network.type=="wifi"||this.network.type=="ethernet"||this.network.type=="cellular"||
    // this.network.type=="2g"||this.network.type=="3g"||this.network.type=="4g"){
      if (this.tempTestInfo == '') {
        var self = this;
        this.shouldHide = true;
        this.shouldHideServices = true;

        if (selectedNode == "selectedTile") {
          //console.log("Selected Tile");
          this.shouldHideCreateService = true;
          this.shouldHideServices = false;
          if (n == 0) {
            if (this.element != undefined || this.element != null || this.element != "") {
              if (this.cardNode == false) {
                this.cardNode = true;
                this.showChat(doc, n, function () {
                  self.content.scrollTo(0, 300, 500);
                });
              } else {
                if (this.offSetTop == undefined) {
                  this.content.scrollTo(0, document.getElementById('scrollCard').offsetTop, 500);
                } else {
                  this.content.scrollTo(0, this.offSetTop, 500);
                }
              }
            } else {
              this.showChat(doc, n, 'null')
              if (this.offSetTop == undefined) {
                this.content.scrollTo(0, document.getElementById('scrollCard').offsetTop, 500);
              } else {
                this.content.scrollTo(0, this.offSetTop, 500);
              }
            }
          } else {
            this.showLoading();
            this.showChat(doc, n, 'null');
            this.scrollToBottom();
          }
        } else if (selectedNode == "selectedCard") {
          //console.log("Selected Card");
          this.element = document.getElementById('scrollCard');
          this.offSetTop = this.element.offsetTop
          if (this.offSetTop == undefined) {
            this.content.scrollTo(0, document.getElementById('scrollCard').offsetTop, 500);
          } else {
            this.content.scrollTo(0, this.offSetTop, 500);
          }
          this.shouldHide = false;
          this.shouldHideServices = false;
          this.shouldHideCreateService = false;
          this.showChat(doc, n, 'null')
          this.scrollToBottom();
        } else if (selectedNode == "selectedService") {
          //console.log("Selected Service");
          this.shouldHideServices = true;
          this.showChat(doc, n, 'selectedService')
          this.content.scrollTo(0, 600, 500);
        } else if(selectedNode == "selectedList"){
          console.log("Selected List");
          this.showChat(doc, n, 'null');
          this.scrollToBottom();
        }else{
          console.log("Selected Else");
          this.showChat(doc, n, 'null');
          this.pendingStatus=false;
        }
        this.scrollToBottom();

      } else {
        this.tempTestInfo = '';
        let servicediscModal = this.modalCtrl.create(ServiceDescription, { description: doc });
        servicediscModal.onDidDismiss(data => {
        });
        servicediscModal.present();
      }  
    // }else{
    //   let alert = this.atrCtrl.create({
    //     title: 'No Internet',
    //     subTitle: 'It seems you dont have network.Please check your wifi or data network.',
    //     buttons: ['OK']
    //   });
    //   alert.present();

    // }
    // this.network.onConnect().subscribe(data => {
      
    // },error=>console.log(error));
  }

  showChat(doc, n, callbackFunction) {
    var self = this;
    if (doc.properties.dataUrl == "") {
      this.prevJsonData = this.jsonData;
      this.level++;
      this.jsonData = doc;
      this.assetType = doc.properties.assetType.type;
      var tempMsg = [];
      doc.properties.message.forEach(msg => {
        tempMsg.push({ "msg": msg, "type": "message_response" });
      });
      doc.properties.dynamicMessage.forEach(msg => {
        tempMsg.push({ "msg": msg, "type": "message_response" });
      });
      this.msgToShow = tempMsg;
      if (callbackFunction == "selectedService") {
        if (this.elements[4] == undefined) {
          this.elements.splice(4, 0, { "type": "message", "values": this.msgToShow, "node": "selectedService" });
          this.childData = doc.properties.child;
          this.elements.splice(5, 0, { "type": this.assetType, "values": this.childData, "node": "selectedService" });
          self.scrollToBottom();
        } else {
          if (this.elements[4].node == undefined) {
            //this.elements.splice(4, 1);
            this.elements.splice(4, 0, { "type": "message", "values": this.msgToShow, "node": "selectedService" });
            this.childData = doc.properties.child;
            this.elements.splice(5, 0, { "type": this.assetType, "values": this.childData, "node": "selectedService" });
            self.scrollToBottom();
          } else {
            this.elements[4] = { "type": "message", "values": this.msgToShow, "node": "selectedService" };
            this.childData = doc.properties.child;
            this.elements[5] = { "type": this.assetType, "values": this.childData, "node": "selectedService" };
            self.scrollToBottom();
          }
        }
      } else {
        if (callbackFunction && typeof (callbackFunction) == "function") {
          if (this.elements[2] == undefined) {
            this.elements.splice(2, 0, { "type": "message", "values": this.msgToShow, "node": "selectedTile" });
            this.childData = doc.properties.child;
            this.elements.splice(3, 0, { "type": this.assetType, "values": this.childData, "node": "selectedTile" });
            self.scrollToBottom();
          } else {
            if (this.elements[2].node == undefined) {
              this.elements.splice(2, 0, { "type": "message", "values": this.msgToShow, "node": "selectedTile" });
              this.childData = doc.properties.child;
              this.elements.splice(3, 0, { "type": this.assetType, "values": this.childData, "node": "selectedTile" });
              self.scrollToBottom();
            } else {
              this.elements[2] = { "type": "message", "values": this.msgToShow, "node": "selectedTile" };
              this.childData = doc.properties.child;
              this.elements[3] = { "type": this.assetType, "values": this.childData, "node": "selectedTile" };
              self.scrollToBottom();
            }
          }
        } else {
          console.log("Testing Hello1");
          this.elements.push({ "type": "message", "values": this.msgToShow });//>>>>>>>>>>>>>>>Welcome msg>>>>>>>>>>>>>>>>>
          this.childData = doc.properties.child;
          if (this.assetType == "timeline") {
            if(this.userRole=="BackOfficeManager"){
              var childDataForBackOffice = doc.properties.childBackOffice;
              this.elements.push({ "type": "message", "values": [{ "msg": "Here is update of your services...", "type": "message_response" }] });
              
              this.elements.push({ "type": this.assetType, "values": childDataForBackOffice });
              
              this.new_n=n;
              for(var i=0;i<this.childData.length;i++){
                if(this.childData[i].subtaskstate=="pending"&&this.pendingStatus==false){
                  this.pendingStatus=true;
                  console.log("Particular click of back office manager track service ........");
                  var tempMsg = [];
                  tempMsg.push({ "msg": this.childData[i].subtaskName, "type": "message_response" });
                  this.msgToShow = tempMsg;
                  this.elements.push({ "type": "message", "values": this.msgToShow });
                  this.action_type = this.childData[i].subtaskAction;
                  this.subTaskId = this.childData[i]._id;
                  this.subTaskName = this.childData[i].subtaskName;
                  console.log("Value of n isssssssssssss");
                  console.log(n);
                  console.log(this.allServices);
                  for(var i=0;i<this.allServices.length;i++){
                    if(i==n){
                      console.log("this.allServices[i]._id");
                      console.log(this.allServices[i]._id);
                      this.mainTaskId = this.allServices[i]._id;
                    }
                  }        
                }else{
                  for(var j=0;j<this.childData[i].subsubtaskArray.length;j++){
                    if(this.childData[i].subsubtaskArray[j].subsubtaskstate=="pending"&&this.pendingStatus==false){
                      this.pendingStatus=true;
                      this.showAttachmentIcon = true;
                      console.log("Particular click of back office manager track service ........");
                      var tempMsg = [];
                      tempMsg.push({ "msg": this.childData[i].subsubtaskArray[j].subsubtaskName, "type": "message_response" });
                      this.msgToShow = tempMsg;
                      this.elements.push({ "type": "message", "values": this.msgToShow });
                      this.action_type = this.childData[i].subsubtaskArray[j].subsubtaskAction;
                      this.subTaskId = this.childData[i]._id;
                      this.subTaskName = this.childData[i].subtaskName;
                      this.subSubTaskId = this.childData[i].subsubtaskArray[j]._id;
                      this.subSubTaskName = this.childData[i].subsubtaskArray[j].subsubtaskName;
                      console.log("Value of n isssssssssssss");
                      console.log(n);
                      console.log(this.allServices);
                      for(var i=0;i<this.allServices.length;i++){
                        if(i==n){
                          console.log("this.allServices[i]._id");
                          console.log(this.allServices[i]._id);
                          this.mainTaskId = this.allServices[i]._id;
                        }
                      }        
                    }
                  }
                }
              }
              for(var i=0;i<this.childData.length;i++){
                if(this.childData[i].subtaskstate.indexOf("pending")>-1){
                  this.completeStatusSubTask = false;
                  //alert("Task Completed");
                  //alert("If Sub Task");
                }else{
                  this.completeStatusSubTask = true;
                  //alert("Else Sub Task");
                  if(i==(this.childData.length-1)){
                    
                  }
                }
                for(var j=0;j<this.childData[i].subsubtaskArray.length;j++){
                  if(this.childData[i].subsubtaskArray[j].subsubtaskstate.indexOf("pending")>-1){
                    //alert("If Sub Sub Task");
                    this.completeStatusSubSubTask = false;
                  }else{
                    this.completeStatusSubSubTask = true;
                    // alert("Else Sub Sub Task");
                    // if(j==(this.childData[i].subsubtaskArray.length-1)){
                    //   alert("Sub task completed");
                    // }
                  }
                }

                
              }
              for(var i=0;i<this.childData.length;i++){
                if(this.childData[i].subsubtaskArray.length==0){
                  if(this.childData.length-1==i){
                    if(this.completeStatusSubTask){
                      alert("Task Completed");
                    }
                  }

                }else{
                  if(this.childData.length-1==i){
                    if(this.completeStatusSubTask && this.completeStatusSubSubTask){
                      alert("Task Completed");
                    }
                  }

                } 
              }
               
              
            }else{
              console.log("Particular click of customer track service ........");
              this.elements.push({ "type": "message", "values": [{ "msg": "Here is update of your services...", "type": "message_response" }] });
              //this.elements.push({ "type": this.assetType, "values": this.childData });
              //self.scrollToBottom();
            }
            
          }else{
            this.elements.push({ "type": this.assetType, "values": this.childData });
            
            self.scrollToBottom();
          }
          
          this.hideLoading();
        }
      }
      // if(this.level > 1){
      //   this.elements.push({"type": "button", "values" : "Back to Start"});
      // }
      // if(this.level > 2){
      //   this.elements.push({"type": "button", "values" : "Back to Prev"});
      // }
      if (this.assetType == "form") {
        this.chatFooterEnabled = false;
        this.inputFooterEnabled = true;
        this.formData = doc.properties.assetType.property.elements;
        this.questions = [];
        this.formResponse = {};
        this.formResponse['ServiceName'] = doc.name;
        this.formResponse['UserName'] = this.userName;
        this.formResponse['UserEmail'] = this.userEmail;
        this.formResponse['UserPhone'] = this.userPhone;
        this.formResponse['UserRole'] = this.userRole;
        doc.properties.assetType.property.elements.forEach(ele => {
          this.questions.push(ele.message);
        });
        this.currentNum = 0;
        this.question = [];
        this.showFormData(this.currentNum);

      }

    } else {
      this.shouldHide = false;
      if (document.getElementById('scrollCard') != undefined) {
        this.element = document.getElementById('scrollCard');
        this.offSetTop = this.element.offsetTop
      }
      var self = this;
      if(this.userRole=="BackOfficeManager"){
        console.log("Back Office Manager >>>>>>>>>>>>>>>>>>> ");
        this.fetchAllServicesFromServer(doc.properties.dataUrl).then(function (val) {
          self.serverData = val;
          self.actualData = self.serverData.allServices;
          self.tempArr = [];
          for (var index = 0; index < self.actualData.length; index++) {
            self.tempArr.push({
              "name": self.actualData[index].taskName,
              "displayType": "list",
              "properties": {
                "message": [],
                "dynamicMessage": [],
                "action": "click",
                "dataUrl": "",
                "child": self.actualData[index].subtaskArray,
                "childBackOffice": self.actualData[index].activityArray,
                "assetType": {
                  "type": "timeline",
                  "lookfor": ["none"],
                  "property": {
                    "name": "Updates of Service",
                    "elements": []
                  }
                }
              }
            });
          }
          doc.properties.child = self.tempArr;
          self.prevJsonData = self.jsonData;
          self.level++;
          self.jsonData = doc;
          self.assetType = doc.properties.assetType.type;
          self.msgToShow = ["Which service do you want to track?"];
          if(self.tempArr.length > 0){
            self.elements.push({ "type": "message", "values": [{ "msg": self.msgToShow, "type": "message_response" }] });
          }
          self.childData = doc.properties.child;
        
          for(var i=0;i<self.childData.length;i++){
          }
          console.log("self.childData >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
          console.log(self.childData);
          self.elements.push({ "type": self.assetType, "values": self.childData });
          self.hideLoading();
          self.scrollToBottom();  
        }).catch(function (err) {
          console.log(err);
        });
      }else{
        console.log("Customer >>>>>>>>>>>>>>>>>>> ");
        this.fetchAllServicesFromServer(doc.properties.dataUrl).then(function (val) {
          self.serverData = val;
          self.actualData = self.serverData.allServices;
          self.tempArr = [];
          for (var index = 0; index < self.actualData.length; index++) {
            self.tempArr.push({
              "name": self.actualData[index].taskName,
              "displayType": "list",
              "properties": {
                "message": [],
                "dynamicMessage": [],
                "action": "click",
                "dataUrl": "",
                "child": self.actualData[index].activityArray,
                "assetType": {
                  "type": "timeline",
                  "lookfor": ["none"],
                  "property": {
                    "name": "Updates of Service",
                    "elements": []
                  }
                }
              }
            });
          }
          doc.properties.child = self.tempArr;
          self.prevJsonData = self.jsonData;
          self.level++;
          self.jsonData = doc;
          self.assetType = doc.properties.assetType.type;
          self.msgToShow = ["Which service do you want to track?"];
          if (self.tempArr.length > 0) {
            self.elements.push({ "type": "message", "values": [{ "msg": self.msgToShow, "type": "message_response" }] });
          }
          self.childData = doc.properties.child;
          self.elements.push({ "type": self.assetType, "values": self.childData });//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
          self.hideLoading();
          self.scrollToBottom();    
        }).catch(function (err) {
          console.log(err);
        });
      }
    }

    if (callbackFunction && typeof (callbackFunction) == "function") {
      callbackFunction();
    }
    
  }

  showFormData(numReceived) {
    let inputValue = "";
    let validInputValue = true;
    if (numReceived > 0) {
      inputValue = this.createServiceReply.content;
      if (this.validateUserData(numReceived, inputValue)) {
        this.msgToShow = [{ "msg": this.createServiceReply.content, "type": "message_request" }];
        this.elements.push({ "type": "message", "values": this.msgToShow });//>>>>>>>>>>>>>>User msg<<<<<<<<<<<<<<<<
        this.formResponse[this.formData[numReceived - 1].key] = this.createServiceReply.content;
        this.createServiceReply.clearInput();
        this.createServiceReply.setFocus();
      } else {
        validInputValue = false;
        alert("You have given wrong input.");
        this.createServiceReply.clearInput();
        this.createServiceReply.setFocus();
      }
    }

    if (numReceived >= this.formData.length) {
      this.chatFooterEnabled = true;
      this.inputFooterEnabled = false;
      this.msgToShow = [{ "msg": "Thanks for creating service", "type": "message_response" }];
      this.elements.push({ "type": "message", "values": this.msgToShow });
      this.sendUserRequest(this.formResponse);
      this.gotoPrevious();
    } else {
      if (validInputValue == true) {
        this.msgToShow = [{ "msg": this.questions[numReceived], "type": "message_response" }];
        this.elements.push({ "type": "message", "values": this.msgToShow });//>>>>>>>>>>>>>>Msg res<<<<<<<<<<<<<<<<
        this.currentNum += 1;
      }
    }
    this.scrollToBottom();
  }
  // gotoStart() {
  //   this.level = 0;
  //   this.startService.getData().subscribe((data) => {
  //     this.showNode(data.root, 0);
  //   });
  //   this.chatFooterEnabled = true;
  //   this.inputFooterEnabled = false;
  //   this.question = [];
  // }
  gotoPrevious() {
    this.showNode(this.prevJsonData, this.level, 'null');
    this.chatFooterEnabled = true;
    this.inputFooterEnabled = false;
    this.level = this.level - 2;;
  }


  validateUserData(numReceived, inputValue) {
    if (numReceived != 0) {
      var valueType: string = this.formData[numReceived - 1].key;
      switch (valueType) {

        case "Name": {
          if (this.nameRegex.test(inputValue)) {
            return true;
          } else {
            return false;
          }
        }

        case "Email": {
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputValue)) {
            return true;
          } else {
            return false;
          }
        }

        // case "Phone": {
        //     if(this.phoneRegex.test(inputValue)) {
        //     console.log("Fair");
        //     return true;
        //   } else {
        //     console.log("fair");
        //     return false;
        //   }
        // }
        case "Address": {
          return true;
        }
        // case "RequirementPin": {
        //     if(this.pinRegex.test(inputValue)) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // }  
        default: {
          return true;
        }
      }
    } else {
      return true;
    }

  }


  getData() {
    return this.http.get("../../assets/data/server-data.json")
      .map((res: Response) =>
        res.json().appData);
  }

  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverContentPage);
    popover.present({
      ev: myEvent
    });

  }

  init() {


  }

  public sendMessage() {
    this.btnEmitter.emit("sent clicked");
    let message = this.chatForm.value.chatMessage;
    this.inputmsg = '';
    this.send(message);
  }

  onClickPlus(){
    if(this.showAttachmentDiv == false){
      this.showAttachmentDiv = true;    
    }else{
      this.showAttachmentDiv = false;
    }
    console.log("on Click plus ");
  }

  send(message) {
    let fromName = this.userName;
    let fromEmail = this.userEmail;
    this.socket.emit(MessageType.MSG_REQ, UtilService.formatMessageRequest(message, fromName, fromEmail));
    this.showChatMessages(UtilService.formatMessageRequest(message, fromName, fromEmail));
    this.chatBox = '';
    this.scrollToBottom();
  }

  showChatMessages(data) {
    this.elements.push({ "type": "chat_message", "values": [{ "msg": data.message, "type": data.type }] });
  }

  scrollToBottom() {
    this._zone.run(() => {
      setTimeout(() => {
        this.content.scrollToBottom();
      });
    });
  }

  // ngOnInit() {
  //     // Ionic scroll element
  //   this.ionScroll =document.getElementById("scrollTop");
  //   console.log(document.getElementById("scrollTop").innerText);
  //   // On scroll function
  //   this.ionScroll.addEventListener("scroll", () => {
  //     if (this.ionScroll.scrollTop > window.innerHeight) {
  //       this.showButton = true;
  //     } else {
  //       this.showButton = false;
  //     }
  //   });
  // }
  // scrollToBottom(){
  //   this.content.scrollToBottom();
  // }


  scrollToTop(scrollDuration) {
    this.app.getRootNav().setRoot(HomePage,{from:'home'});
  }

  pushNotificationMsg() {
    this.scrollToBottom();
    this.events.subscribe('push_notification', (notification) => {
      var date_and_time_push_notification = '';
      if (notification.split('`')[2].split(':')[1].split('/')[1] == "1") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Jan" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "2") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Feb" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "3") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Mar" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "4") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Apr" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "5") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-May" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "6") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Jun" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "7") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Jul" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "8") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Aug" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "9") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Sep" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "10") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Oct" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else if (notification.split('`')[2].split(':')[1].split('/')[1] == "11") {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Nov" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      } else {
        date_and_time_push_notification = notification.split('`')[2].split(':')[1].split('/')[0] + "-Dec" + "-" + notification.split('`')[2].split(':')[1].split('/')[2] + ' ' + notification.split('`')[3].split(':')[1] + ':' + notification.split('`')[3].split(':')[2]
      }

      this.nameOfService = [{
        msg: notification.split('`')[5].split(':')[1],
        type: "msg_res"
      }]

      this.elements.push({ "type": "message", "values": this.nameOfService });

      if (notification.split('`')[7] == undefined || null || '') {
        this.tempPushNotificationForSubtask = [];
        this.tempPushNotificationForSubtask.push({
          'createdOn': date_and_time_push_notification,
          'description': '',
          'files': [notification.split('`')[4].split(':')[1]],
          'update': 'New update for ' + notification.split('`')[0],
          'uploadType': [notification.split('`')[6].split(':')[1]],
          'updatedByUserName': ''
        });
        this.pushNotificationForSubtask = this.tempPushNotificationForSubtask;
        this.elements.push({ "type": "timeline", "values": this.pushNotificationForSubtask });
      } else {
        this.tempPushNotificationForSubSubtask = [];
        this.tempPushNotificationForSubSubtask.push({
          'createdOn': date_and_time_push_notification,
          'description': '',
          'files': [notification.split('`')[4].split(':')[1]],
          'update': 'New update for ' + notification.split('`')[0] + ' of ' + notification.split('`')[7].split(':')[1],
          'uploadType': [notification.split('`')[6].split(':')[1]],
          'updatedByUserName': ''
        });
        this.pushNotificationForSubSubtask = this.tempPushNotificationForSubSubtask;
        this.elements.push({ "type": "timeline", "values": this.pushNotificationForSubSubtask });
      }

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

  onClickDone(){
    this.pendingStatus = false;
    this.showAttachmentDiv = false;      
    console.log("on click done");
    let tastDetails = {
      'email':this.userEmail,
      'subTaskId':this.subTaskId,
      'subTaskName':this.subTaskName,
      'mainTaskId':this.mainTaskId,
      'subSubTaskId':this.subSubTaskId,
      'subSubTaskName':this.mainTaskId
    }
    this.showLoading();
    this.databaseService.onClickDone(tastDetails).subscribe((data) => {
      this.updatedData=data.taskData;
      console.log(this.updatedData);
      this.hideLoading();
      for(var i=0;i<this.updatedData[0].subtaskArray.length;i++){
        if(this.updatedData[0].subtaskArray[i].subtaskstate=="pending"&&this.pendingStatus==false){
          
          console.log("Particular click of back office manager track service ........");
          var tempMsg = [];
          tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subtaskName, "type": "message_response" });
          this.msgToShow = tempMsg;
          this.elements.push({ "type": "message", "values": this.msgToShow });
          this.action_type = this.updatedData[0].subtaskArray[i].subtaskAction;
          this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
          this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
          //if(this.updatedData[0].subtaskArray[i].subsubtaskArray.length == 0){
            console.log("Hello 1 if");
            this.subSubTaskId = '';
            this.subSubTaskName = '';
          // }else{
          //   console.log("Hello 2 else");
          //   for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
          //     if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"){
          //       this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
          //       this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
                
          //     }
          //   }
          // }
          this.pendingStatus=true;
          console.log("Value of n isssssssssssss");
          console.log(this.new_n);
          console.log(this.allServices);
          for(var i=0;i<this.allServices.length;i++){
            if(i==this.new_n){
              console.log("this.allServices[i]._id");
              console.log(this.allServices[i]._id);
              this.mainTaskId = this.allServices[i]._id;
            }
          }
        }else{
          for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
            if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"&&this.pendingStatus==false){
              this.pendingStatus=true;
              console.log("Particular click of back office manager track service ........");
              var tempMsg = [];
              tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName, "type": "message_response" });
              this.msgToShow = tempMsg;
              this.elements.push({ "type": "message", "values": this.msgToShow });
              this.action_type = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskAction;
              this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
              this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
              if(j==this.updatedData[0].subtaskArray[i].subsubtaskArray.length-1){
                
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
            
              }else{
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
              }
              console.log("Value of n isssssssssssss");
              console.log(this.new_n);
              console.log(this.allServices);
              for(var i=0;i<this.allServices.length;i++){
                if(this.new_n){
                  console.log("this.allServices[i]._id");
                  console.log(this.allServices[i]._id);
                  this.mainTaskId = this.allServices[i]._id;
                }
              }        
            }
          }
        }
      }
    });
  }

  onClickCheckIn(){
    console.log("on click onClickCheckIn");
    this.geolocation.getCurrentPosition().then((resp) => {
      resp.coords.latitude
      resp.coords.longitude
      console.log(resp);
      this.databaseService.currentPosition(resp).subscribe((data) => {
        console.log(data);
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    this.showAttachmentDiv = false;
  }

  onClickTakePic(){
    this.pendingStatus = false;
    console.log("onClickTakePic");    
    //this.app.getRootNav().push(CaptureSubServicePicturePage,{allServices:this.allServices,new_n:this.new_n,mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
    
    let profileModal = this.modalCtrl.create(CaptureSubServicePicturePage,{mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
    
    profileModal.onDidDismiss(data => {
      this.showAttachmentDiv = false;
      this.updatedData=data.taskData;
      for(var i=0;i<this.updatedData[0].subtaskArray.length;i++){
        if(this.updatedData[0].subtaskArray[i].subtaskstate=="pending"&&this.pendingStatus==false){
          
          console.log("Particular click of back office manager track service ........");
          var tempMsg = [];
          tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subtaskName, "type": "message_response" });
          this.msgToShow = tempMsg;
          this.elements.push({ "type": "message", "values": this.msgToShow });
          this.action_type = this.updatedData[0].subtaskArray[i].subtaskAction;
          this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
          this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
          //if(this.updatedData[0].subtaskArray[i].subsubtaskArray.length == 0){
            console.log("Hello 1 if");
            this.subSubTaskId = '';
            this.subSubTaskName = '';
          // }else{
          //   console.log("Hello 2 else");
          //   for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
          //     if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"){
          //       this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
          //       this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
                
          //     }
          //   }
          // }
          this.pendingStatus=true;
          console.log("Value of n isssssssssssss");
          console.log(this.new_n);
          console.log(this.allServices);
          for(var i=0;i<this.allServices.length;i++){
            if(i==this.new_n){
              console.log("this.allServices[i]._id");
              console.log(this.allServices[i]._id);
              this.mainTaskId = this.allServices[i]._id;
            }
          }        
        }else{
          for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
            if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"&&this.pendingStatus==false){
              this.pendingStatus=true;
              console.log("Particular click of back office manager track service ........");
              var tempMsg = [];
              tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName, "type": "message_response" });
              this.msgToShow = tempMsg;
              this.elements.push({ "type": "message", "values": this.msgToShow });
              this.action_type = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskAction;
              this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
              this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
              if(j==this.updatedData[0].subtaskArray[i].subsubtaskArray.length-1){
                
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
            
              }else{
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
              }
              console.log("Value of n isssssssssssss");
              console.log(this.new_n);
              console.log(this.allServices);
              for(var i=0;i<this.allServices.length;i++){
                if(this.new_n){
                  console.log("this.allServices[i]._id");
                  console.log(this.allServices[i]._id);
                  this.mainTaskId = this.allServices[i]._id;
                }
              }        
            }
          }
        }
      }  
      
    });
    profileModal.present();
  
  }

  
  onClickTakeVideo(){    
    this.pendingStatus=false;
    console.log("onClickUpdateVideo");
    //  var options = { limit: 1, duration: 15 };
    //  // Capture video>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
    //  this.mediaCapture.captureVideo((videodata) => {
    //   console.log(JSON.stringify(videodata));
    // });

    // this.mediaCapture.captureVideo(options).then(function(videoData) {
    //   // Success! Video data is here
    //   console.log("success video");
    // }, function(err) {
    //   // An error occurred. Show a message to the user
    //   console.log("success video");
    // });
     var url = SERVER_HOST + "/api/uploadSubTaskPicture";
     var options: VideoCapturePlusOptions = {
      limit: 1,
      highquality: true,
      portraitOverlay: 'assets/img/camera/overlay/portrait.png',
      landscapeOverlay: 'assets/img/camera/overlay/landscape.png'
    }
        var videodata = videodata;
        this.mediaCapture.captureVideo(options).then((videodata) => {
          console.log("Hello Video");
          console.log(JSON.stringify(videodata));
          alert(JSON.parse(JSON.stringify(videodata).toString())[0].fullPath.split('file://')[1]);
          
        var options1 = {
          fileKey: "file",
          fileName: "filename1.mp4",
          chunkedMode: false,
          mimeType: "multipart/form-data",
          params : {
            'email':this.userEmail,
            'subTaskId':this.subTaskId,
            'subTaskName':this.subTaskName,
            'mainTaskId':this.mainTaskId,
            'video_or_picture':'video',
            'subSubTaskId':this.subSubTaskId,
            'subSubTaskName':this.subSubTaskName
          }
        };
        this.uploadData(JSON.parse(JSON.stringify(videodata).toString())[0].fullPath.split('file://')[1], url, options1);          
        });
  }

  uploadData(docsPath, url, options) {
    
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });

    this.loading.onDidDismiss(data => {


    });

    this.loading.present();

    const fileTransfer: TransferObject = this.transfer.create();

    fileTransfer.upload(docsPath, url, options)
      .then((data) => {
        this.loading.dismissAll();
        if(JSON.parse(data.response).response=="Video Saved"){
          alert("Uploaded to server."); 
          
          //this.viewCtrl.dismiss().then(() => {
            this.showAttachmentDiv = false;
            this.updatedData=JSON.parse(data.response).taskData;
            console.log("data response >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
       
            console.log(this.updatedData);
              for(var i=0;i<this.updatedData[0].subtaskArray.length;i++){
                if(this.updatedData[0].subtaskArray[i].subtaskstate=="pending"&&this.pendingStatus==false){
                  this.pendingStatus=true;
                  console.log("Particular click of back office manager track service ........");
                  var tempMsg = [];
                  tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subtaskName, "type": "message_response" });
                  this.msgToShow = tempMsg;
                  this.elements.push({ "type": "message", "values": this.msgToShow });
                  this.action_type = this.updatedData[0].subtaskArray[i].subtaskAction;
                  this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
                  this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
                  //if(this.updatedData[0].subtaskArray[i].subsubtaskArray.length==0){
                    console.log("Video 3");
                    this.subSubTaskId = '';
                    this.subSubTaskName = '';
                  //}else{
                  //   console.log("Video 4");
                  //   for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
                  //     if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"){
                  //       this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                  //       this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName;                     
                  //     }
                  //   } 
                  // }                      
                  console.log("Value of n isssssssssssss");
                  console.log(this.new_n);
                  console.log(this.allServices);
                  for(var i=0;i<this.allServices.length;i++){
                    if(i==this.new_n){
                      console.log("this.allServices[i]._id");
                      console.log(this.allServices[i]._id);
                      this.mainTaskId = this.allServices[i]._id;
                    }
                  }        
                }else{
                  for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
                    if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"&&this.pendingStatus==false){
                      this.pendingStatus=true;
                      console.log("Particular click of back office manager track service ........");
                      var tempMsg = [];
                      tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName, "type": "message_response" });
                      this.msgToShow = tempMsg;
                      this.elements.push({ "type": "message", "values": this.msgToShow });
                      this.action_type = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskAction;
                      this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
                      this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
                      if(j==this.updatedData[0].subtaskArray[i].subsubtaskArray.length-1){
                        console.log("VIdeo 1");
                        this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                        this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
                      
                      }else{
                        console.log("VIdeo 2");
                        this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                        this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
                      }
                      
                      console.log("Value of n isssssssssssss");
                      console.log(this.new_n);
                      console.log(this.allServices);
                      for(var i=0;i<this.allServices.length;i++){
                        if(this.new_n){
                          console.log("this.allServices[i]._id");
                          console.log(this.allServices[i]._id);
                          this.mainTaskId = this.allServices[i]._id;
                        }
                      }        
                    }
                  }
                }
              }
            //this.app.getRootNav().setRoot(HomePage,{taskData:JSON.parse(data.response).taskData,from:'video'});
          //});
        }else{
          alert("Error while uploading to server.");
        }
      }, (err) => {
        this.loading.dismissAll();
        alert("Error while uploading to server.");
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

  onClickTakeSignature(){

    this.pendingStatus=false;
    //this.app.getRootNav().push(SignaturePage,{mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
    

    let signatureModal = this.modalCtrl.create(SignaturePage,{mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
    signatureModal.onDidDismiss(data => {
      this.signatureImage = data;
      this.showAttachmentDiv = false;
      this.updatedData=data.taskData;
      console.log("data response >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
       
      console.log(this.updatedData);
      for(var i=0;i<this.updatedData[0].subtaskArray.length;i++){
        if(this.updatedData[0].subtaskArray[i].subtaskstate=="pending"&&this.pendingStatus==false){
          this.pendingStatus=true;
          console.log("Particular click of back office manager track service ........");
          var tempMsg = [];
          tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subtaskName, "type": "message_response" });
          this.msgToShow = tempMsg;
          this.elements.push({ "type": "message", "values": this.msgToShow });
          this.action_type = this.updatedData[0].subtaskArray[i].subtaskAction;
          this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
          this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
          //if(this.updatedData[0].subtaskArray[i].subsubtaskArray.length==0){
            this.subSubTaskId = '';
            this.subSubTaskName = '';
          // }else{
          //   for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
          //     if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"){
          //       this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
          //       this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
          //     }
          //   }
          // }   
          console.log("Value of n isssssssssssss");
          console.log(this.new_n);
          console.log(this.allServices);
          for(var i=0;i<this.allServices.length;i++){
            if(i==this.new_n){
              console.log("this.allServices[i]._id");
              console.log(this.allServices[i]._id);
              this.mainTaskId = this.allServices[i]._id;
            }
          }        
        }else{
          for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
            if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"&&this.pendingStatus==false){
              this.pendingStatus=true;
              console.log("Particular click of back office manager track service ........");
              var tempMsg = [];
              tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName, "type": "message_response" });
              this.msgToShow = tempMsg;
              this.elements.push({ "type": "message", "values": this.msgToShow });
              this.action_type = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskAction;
              this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
              this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
              if(j==this.updatedData[0].subtaskArray[i].subsubtaskArray.length-1){
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
              }else{
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
              }
              console.log("Value of n isssssssssssss");
              console.log(this.new_n);
              console.log(this.allServices);
              for(var i=0;i<this.allServices.length;i++){
                if(this.new_n){
                  console.log("this.allServices[i]._id");
                  console.log(this.allServices[i]._id);
                  this.mainTaskId = this.allServices[i]._id;
                }
              }        
            }
          }
        }
      }
    });
    signatureModal.present();
  }

  onClickWriteNote(){
    this.pendingStatus = false;
    console.log("on click onClickTakePic");
    console.log("onClickUpdatePicture");
    
    console.log(this.subSubTaskName);
    
    //this.app.getRootNav().push(CaptureSubServicePicturePage,{allServices:this.allServices,new_n:this.new_n,mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
    
    let profileModal = this.modalCtrl.create(CreateNotePage,{mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
    
    profileModal.onDidDismiss(data => {
      this.showAttachmentDiv = false;
      this.updatedData=data.taskData;
      for(var i=0;i<this.updatedData[0].subtaskArray.length;i++){
        if(this.updatedData[0].subtaskArray[i].subtaskstate=="pending"&&this.pendingStatus==false){
          
          console.log("Particular click of back office manager track service ........");
          var tempMsg = [];
          tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subtaskName, "type": "message_response" });
          this.msgToShow = tempMsg;
          this.elements.push({ "type": "message", "values": this.msgToShow });
          this.action_type = this.updatedData[0].subtaskArray[i].subtaskAction;
          this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
          this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
          //if(this.updatedData[0].subtaskArray[i].subsubtaskArray.length == 0){
            console.log("Hello 1 if");
            this.subSubTaskId = '';
            this.subSubTaskName = '';
          // }else{
          //   console.log("Hello 2 else");
          //   for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
          //     if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"){
          //       this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
          //       this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
                
          //     }
          //   }
          // }
          this.pendingStatus=true;
          console.log("Value of n isssssssssssss");
          console.log(this.new_n);
          console.log(this.allServices);
          for(var i=0;i<this.allServices.length;i++){
            if(i==this.new_n){
              console.log("this.allServices[i]._id");
              console.log(this.allServices[i]._id);
              this.mainTaskId = this.allServices[i]._id;
            }
          }        
        }else{
          for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
            if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"&&this.pendingStatus==false){
              this.pendingStatus=true;
              console.log("Particular click of back office manager track service ........");
              var tempMsg = [];
              tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName, "type": "message_response" });
              this.msgToShow = tempMsg;
              this.elements.push({ "type": "message", "values": this.msgToShow });
              this.action_type = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskAction;
              this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
              this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
              if(j==this.updatedData[0].subtaskArray[i].subsubtaskArray.length-1){
                
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
            
              }else{
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
              }
              console.log("Value of n isssssssssssss");
              console.log(this.new_n);
              console.log(this.allServices);
              for(var i=0;i<this.allServices.length;i++){
                if(this.new_n){
                  console.log("this.allServices[i]._id");
                  console.log(this.allServices[i]._id);
                  this.mainTaskId = this.allServices[i]._id;
                }
              }        
            }
          }
        }
      }  
      
    });
    profileModal.present();

    //console.log("onClickUpdateNote");
     //this.app.getRootNav().push(CreateNotePage,{mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
  }

  onClickScanBarcode(){
    this.pendingStatus = false;
    console.log("onClick Barcode");
    this.barcodeScanner.scan()
    .then((result) => {
      if (!result.cancelled) {
        const barcodeData = new BarcodeData(result.text, result.format);
        console.log("Bar code data");
        console.log(barcodeData);
        //this.scanDetails(barcodeData);
        
    console.log("on click onClickTakePic");
    console.log("onClickUpdatePicture");
    
    console.log(this.subSubTaskName);
    
    //this.app.getRootNav().push(CaptureSubServicePicturePage,{allServices:this.allServices,new_n:this.new_n,mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
    //this.app.getRootNav().push(DisplayBarCodePage, { data: barcodeData ,mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
    let profileModal = this.modalCtrl.create(DisplayBarCodePage, { data: barcodeData ,mainTaskId:this.mainTaskId,subTaskId: this.subTaskId,subTaskName:this.subTaskName,subSubTaskId:this.subSubTaskId,subSubTaskName:this.subSubTaskName});
    
    profileModal.onDidDismiss(data => {
      this.showAttachmentDiv = false;
      this.updatedData=data.taskData;
      for(var i=0;i<this.updatedData[0].subtaskArray.length;i++){
        if(this.updatedData[0].subtaskArray[i].subtaskstate=="pending"&&this.pendingStatus==false){
          
          console.log("Particular click of back office manager track service ........");
          var tempMsg = [];
          tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subtaskName, "type": "message_response" });
          this.msgToShow = tempMsg;
          this.elements.push({ "type": "message", "values": this.msgToShow });
          this.action_type = this.updatedData[0].subtaskArray[i].subtaskAction;
          this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
          this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
          //if(this.updatedData[0].subtaskArray[i].subsubtaskArray.length == 0){
            console.log("Hello 1 if");
            this.subSubTaskId = '';
            this.subSubTaskName = '';
          // }else{
          //   console.log("Hello 2 else");
          //   for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
          //     if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"){
          //       this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
          //       this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
                
          //     }
          //   }
          // }
          this.pendingStatus=true;
          console.log("Value of n isssssssssssss");
          console.log(this.new_n);
          console.log(this.allServices);
          for(var i=0;i<this.allServices.length;i++){
            if(i==this.new_n){
              console.log("this.allServices[i]._id");
              console.log(this.allServices[i]._id);
              this.mainTaskId = this.allServices[i]._id;
            }
          }        
        }else{
          for(var j=0;j<this.updatedData[0].subtaskArray[i].subsubtaskArray.length;j++){
            if(this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskstate=="pending"&&this.pendingStatus==false){
              this.pendingStatus=true;
              console.log("Particular click of back office manager track service ........");
              var tempMsg = [];
              tempMsg.push({ "msg": this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName, "type": "message_response" });
              this.msgToShow = tempMsg;
              this.elements.push({ "type": "message", "values": this.msgToShow });
              this.action_type = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskAction;
              this.subTaskId = this.updatedData[0].subtaskArray[i]._id;
              this.subTaskName = this.updatedData[0].subtaskArray[i].subtaskName;
              if(j==this.updatedData[0].subtaskArray[i].subsubtaskArray.length-1){
                
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
            
              }else{
                this.subSubTaskId = this.updatedData[0].subtaskArray[i].subsubtaskArray[j]._id;
                this.subSubTaskName = this.updatedData[0].subtaskArray[i].subsubtaskArray[j].subsubtaskName; 
              }
              console.log("Value of n isssssssssssss");
              console.log(this.new_n);
              console.log(this.allServices);
              for(var i=0;i<this.allServices.length;i++){
                if(this.new_n){
                  console.log("this.allServices[i]._id");
                  console.log(this.allServices[i]._id);
                  this.mainTaskId = this.allServices[i]._id;
                }
              }        
            }
          }
        }
      }  
      
    });
    profileModal.present();
        
      }
    }) .catch((err) => {
      alert(err);
    })
  }

}

export class BarcodeData {
  constructor(
    public text: String,
    public format: String
  ) {}
}
