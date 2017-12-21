import {Component} from "@angular/core";
import {ChatMessage, MessageType, UtilService} from "../../providers";

@Component({
  selector: 'chat-bubble-msg',
  inputs: ['chatMessage'],
  templateUrl: 'chatBubbleMsg.html'
})
export class ChatBubbleMsg {
  public chatMessage: ChatMessage;
  public messageType = MessageType;

  constructor() {

  }

  formatEpoch(epoch): string {
    return UtilService.getCalendarDay(epoch);
  }
}
