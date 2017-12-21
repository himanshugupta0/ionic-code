import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Localstorage provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Localstorage {

    constructor(
        public http: Http,
        private storage: Storage
    ) {

    }

    //store the key value
    storeIntoLS(key, value) {
        this.storage.set(key, value);
    }

    //get the stored key's value
    getValueFromLS(key) {
        return new Promise((resolve, reject) => {
            this.storage.get(key).then((val) => {
                resolve(val);
            }).catch(error => {
                reject(error);
            })
        });
    }

    //delete the any key value
    removeKeyValueFromLS(key) {
        this.storage.remove(key);
    }

    //clear the whole local storage
    clearLocalStorage() {
        this.storage.clear();
    }

}