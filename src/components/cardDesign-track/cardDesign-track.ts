import {Component} from "@angular/core";
import {ChatMessage, MessageType, UtilService} from "../../providers";

@Component({
  selector: 'card-design-track',
  inputs: ['cardDetailsTrack'],
  templateUrl: 'cardDesign-track.html'
})
export class CardDesignTrack {
  public cardDetailsTrack: ChatMessage;
  public messageType = MessageType;

  constructor() {
  }

  formatEpoch(epoch): string {
    return UtilService.getCalendarDay(epoch);
  }
}
