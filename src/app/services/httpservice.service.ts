import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {
  
  constructor(public http: HttpClient,
    public toastController: ToastController) { }
  post(api:any, message:any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise((resolve, reject) => {
      this.http.post(api, message, httpOptions).subscribe(response => {
        resolve(response);
      },(err) => {
        reject(err);
      })
    })
    
  }
  get(api:any) {
    return new Promise((resolve, reject) => {
      this.http.get(api).subscribe((response) => {
        resolve(response);
      },(err) => {
        reject(err);
      })
    })
  }

  async toast(message:any) {
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
