import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {

  constructor(public http: HttpClient,
    public toastController: ToastController,
    private nativeHttp: HTTP) { }
  post(api: any, param: any) {
    this.nativeHttp.setDataSerializer('json');
    return new Promise((resolve, reject) => {
      this.nativeHttp.post(api, param, {Authorization: 'OAuth2: token'}).then(response => {
        response.data = JSON.parse(response.data);
        resolve(response.data);
      }).catch(err => {
        reject(err);
      });
    })
  }
  get(api: any) {
    this.nativeHttp.setDataSerializer('json');
    return new Promise((resolve, reject) => {
      this.nativeHttp.get(api, {},  { Authorization: 'OAuth2: token' }).then(response => {
        response.data = JSON.parse(response.data);
        resolve(response.data);
      }).catch(err => {
        reject(err);
      });
    })
  }

  async toast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      position: 'middle',
      buttons: [
        {
          text: '确认',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

}
