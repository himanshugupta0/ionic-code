import { Component } from "@angular/core";
import { ModalController } from 'ionic-angular';

import { FullscreenImage } from "../../pages/fullscreen-image/fullscreen-image";
import { ChatMessage, MessageType, UtilService, SERVER_HOST } from "../../providers";

@Component({
  selector: 'timeline-view ',
  inputs: ['timelineData'],
  templateUrl: 'timeline.html'
})
export class Timeline {
  public chatMessage: ChatMessage;
  public messageType = MessageType;
  serverhost: any = SERVER_HOST;
  timelineData: any;

  constructor(public modalCtrl: ModalController) { }

  viewImage() {
    let fullscreenImg = this.modalCtrl.create(FullscreenImage, { data: this.timelineData });
    fullscreenImg.present();
  }

  formatEpoch(epoch): string {
    return UtilService.getCalendarDay(epoch);
  }

}
