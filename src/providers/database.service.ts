import { Injectable } from "@angular/core";
import { Localstorage } from "./localstorage"
import { SERVER_HOST } from "./constants";
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DatabaseService {

  loginUrl: string = SERVER_HOST + '/api/login';
  signUpUrl: string = SERVER_HOST + '/api/register';
  forgotUrl: string = SERVER_HOST + '/api/forgot';
  changePassUrl: string = SERVER_HOST + '/api/changepass';
  createServiceUrl: string = SERVER_HOST + '/api/createService';
  profileUrl: string = SERVER_HOST + '/api/fetchUserProfile';
  changeAddressUrl: string = SERVER_HOST + '/api/changeadderess';
  changeNamePhoneUrl: string = SERVER_HOST + '/api/changenamephone';
  barCodeUrl: string = SERVER_HOST + '/api/upload-bar-code-sub-task';
  noteUrl: string = SERVER_HOST + '/api/upload-note-sub-task';
  done: string = SERVER_HOST + '/api/upload-done';
  location: string = SERVER_HOST + '/api/location';
  deviceToken: string = '';
  // trackServiceUrl: string = SERVER_HOST + '/api/getAllServices';
  constructor(
    public http: Http,
    private localstorage: Localstorage
  ) {
  }

  signUpData(data, token): Observable<any> {
    data["token"] = token;
    return this.http.post(this.signUpUrl, data,token).map(res => res.json())
  }

  loginData(data, token): Observable<any> {
    data["token"] = token;
    return this.http.post(this.loginUrl, data, token).map(res => res.json())
  }

  forgetPassword(data): Observable<any> {
    return this.http.post(this.forgotUrl, data).map(res => res.json())
  }

  changePassword(oldPass, newPass): Observable<any> {
    return this.http.post(this.changePassUrl, oldPass, newPass).map(res => res.json())
  }

  editAddress(_userEmail): Observable<any> {
    return this.http.put(`http://localhost:3000/changeadd/${_userEmail._id}`, _userEmail).map(res => res.json())
  }

  changeAddress(data,email): Observable<any> {
    data["email"] = email;
    return this.http.post(this.changeAddressUrl, data,email).map(res => res.json())
  }

  changeNamePhone(data,email): Observable<any> {
    data["email"] = email;
    return this.http.post(this.changeNamePhoneUrl, data,email).map(res => res.json())
  }

  createService(data): Observable<any> {
    return this.http.post(this.createServiceUrl, data).map(res => res.json())
  }

  getAllServices(data): Observable<any> {
    return this.http.get(SERVER_HOST+data.url+'/'+data.email).map(res => res.json());
  }

  getProfileDetails(data, token):Observable<any> {
    return this.http.post(this.profileUrl, data, token).map(res => res.json());
  }

  sendBarCode(data): Observable<any> {
    return this.http.post(this.barCodeUrl, data).map(res => res.json());
  }

  sendNote(data): Observable<any> {
    return this.http.post(this.noteUrl, data).map(res => res.json());
  }

  onClickDone(data): Observable<any> {
    console.log(data);
    return this.http.post(this.done, data).map(res => res.json());
  }

  currentPosition(data): Observable<any> {
    return this.http.post(this.location, data).map(res => res.json());
  }

}
