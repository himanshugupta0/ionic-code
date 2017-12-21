import {Component} from "@angular/core";
import {ChatMessage, MessageType, UtilService} from "../../providers";

@Component({
  selector: 'list-view ',
  inputs: ['listDetails'],
  templateUrl: 'list.html'
})
export class List {
  public chatMessage: ChatMessage;
  public messageType = MessageType;

  constructor() {

  }

  formatEpoch(epoch): string {
    return UtilService.getCalendarDay(epoch);
  }
}
