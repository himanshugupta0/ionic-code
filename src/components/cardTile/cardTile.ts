import {Component} from "@angular/core";
import {ChatMessage, MessageType} from "../../providers";

@Component({
  selector: 'card-tile',
  inputs: ['cardTiles'],
  templateUrl: 'cardTile.html'
})
export class CardTile {
  public cardTiles: ChatMessage;
  public messageType = MessageType;

  constructor() {

  }
}
