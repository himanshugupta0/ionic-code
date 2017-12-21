import {Injectable} from "@angular/core";
import {Http, Response} from '@angular/http';
import 'rxjs/Rx';
import { SERVER_HOST } from "../providers/constants";

@Injectable()
export class StartService {
  data :any;
  constructor(public http:Http) {
  }
  getData(data) {
    if(data.userRole=="Customer"){
      return this.http.get(SERVER_HOST + "/files/appConfig/Customer.json").map((res:Response) => res.json().appData);
    }else if(data.userRole=="BackOfficeManager"){
      return this.http.get(SERVER_HOST + "/files/appConfig/Back Office.json").map((res:Response) => res.json().appData);
    }
  }
}
