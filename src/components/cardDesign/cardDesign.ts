import { Component } from "@angular/core";
import { Events } from "ionic-angular";
import { ChatMessage, MessageType, UtilService } from "../../providers";

@Component({
  selector: 'card-design',
  inputs: ['cardDetails'],
  templateUrl: 'cardDesign.html'
})
export class CardDesign {
  public cardDetails: ChatMessage;
  public messageType = MessageType;

  constructor(public events: Events) {

  }

  testInfo() {
    this.events.publish('show_info', 'testInfo');
  }

  formatEpoch(epoch): string {
    return UtilService.getCalendarDay(epoch);
  }
}
