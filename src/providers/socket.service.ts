import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import * as io from "socket.io-client";
import {ChatMessage, MessageType} from "./model";
import {SERVER_HOST} from "./constants";
import {UtilService} from "./util.service";
import {DatabaseService} from "./database.service";
import { Localstorage } from "./localstorage";
import Socket = SocketIOClient.Socket;

@Injectable()
export class SocketService {
  public messages: Observable<ChatMessage>;
  private socketObserver: any;
  private socket: Socket;
  userName: any = '';
  userEmail: any = '';
  userPhone: any = '';
  userRole: any = '';
  constructor(public databaseService: DatabaseService,
              private localstorage: Localstorage) {
    this.messages = Observable.create(observer => {
      this.socketObserver = observer;
    });
    this.localstorage.getValueFromLS("name").then(val => {
      this.userName = val;
    });
    this.localstorage.getValueFromLS("email").then(val => {
      this.userEmail = val;
    });
    this.localstorage.getValueFromLS("phone").then(val => {
      this.userPhone = val;
    });
    this.localstorage.getValueFromLS("role").then(val => {
      this.userRole = val;
      this.init();
    });
  }

  init() {
    let userData = {'userName': this.userName, 'userEmail': this.userEmail, 'userType': this.userRole};
    this.socket = io(SERVER_HOST, { path: '/socketserver/socket.io', query: userData, autoConnect: false}).connect();
    // this.socket.connect();
    this.socket.on("connect", () => {
      console.debug('***Socket Connected***');
    });

    this.socket.on("reconnecting", attempt => {
      console.debug('***Socket Reconnecting***', attempt);
    });

    this.socket.on("reconnect_failed", () => {
      console.debug('***Socket Reconnect failed***');
    });

    this.socket.on('disconnect', () => {
      console.debug('***Socket Disconnected***');
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
      console.log(chatMessage);
      // this.databaseService.getJson("messages")
      //   .then(messages => {
      //     if (messages === null) {
      //       messages = [];
      //     }
      //     messages.push(chatMessage);
      //     return this.databaseService.setJson("messages", messages);
      //   })
      //   .then(success => {
      //     if (success) {
      //       this.socketObserver.next(chatMessage);
      //     }
      //   });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  connect() {
    this.socket.connect();
  }

  startChat(chatMessage: ChatMessage) {
    chatMessage.epoch = UtilService.getEpoch();
    // this.socketObserver.next(chatMessage);
    this.socket.emit(MessageType.MSG_REQ, chatMessage);
  }
}
