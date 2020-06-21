import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageComponent } from './components/image/image.component';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public facelist: any[] = [];
  public url: string = 'ws://47.113.92.62:8081';
  public ws: any;
  constructor(public modalController: ModalController) {
    
  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    try {
      this.ws = new WebSocket(this.url);
    } catch(err) {
      console.log(err);
    }
    
    this.connectSocket();
  }
  async showImage(k) {
    console.log('yunxing')
    const modal = await this.modalController.create({
      component: ImageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'image64': this.facelist[k].image
      }
    });
    await modal.present();
  }
  connectSocket() {
    
    this.ws.onopen = () => {
      console.log(this.ws.readyState);
      // ws.send('s');
    }
    if (this.ws.readyState === 1) {
      this.ws.send('s');
    }

    this.ws.onmessage = (e: any) => {
      var msg = JSON.parse(e.data);
      console.log(JSON.parse(e.data));
      for (var i = 0; i < msg.length; i++) {
        this.facelist.unshift(msg[i])
      }
      console.log(this.facelist)
    }
    this.ws.onerror = () => {
      console.log("close")
    }
    this.ws.onclose = () => {
      console.log("close")
    }

  }

  doRefresh(e) {
    this.facelist.splice(0, this.facelist.length);
    this.connectSocket();
    e.target.complete();
  }
  /* send() {
    this.connectSocket();
  } */
}
