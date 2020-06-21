import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {

  @Input() image64: any;
  constructor(public navParams: NavParams,) { }

  ngOnInit() {
    //console.log(this.image64);
    this.image64 = 'data:image/jpeg;base64,' + this.image64;
  }

  close() {
    this.navParams.data.modal.dismiss();
  }

}
