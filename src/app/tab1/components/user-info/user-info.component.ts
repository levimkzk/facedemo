import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpserviceService } from '../../../services/httpservice.service'
import { NavParams } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {

  public userId: string = '';
  public userInfo: string = '';
  public base64Image: string = '';
  public result: boolean;
  constructor(public nav: NavController,
    public http: HttpserviceService,
    public navParams: NavParams,
    public actionSheet: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker
  ) { }

  @Input() access_token: string;

  ngOnInit() {
    console.log(this.access_token);
  }

  close() {
    this.navParams.data.modal.dismiss({
      'result': this.result,
      'userId': this.userId,
      'userInfo': this.userInfo,
      'image': this.base64Image
    });
  }
  async getactionSheet() {
    const actionSheet = await this.actionSheet.create({
      header: '图片上传方式',
      cssClass: 'my-custom-class',
      mode: 'ios',
      buttons: [{
        text: '从手机相册选择',
        icon: 'images',
        handler: () => {
          this.pickPhoto();
          console.log('phone');
        }
      },
      {
        text: '拍摄',
        icon: 'camera',
        handler: () => {
          this.takePhoto();
          console.log('camera');
        }
      }, {
        text: '取消',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.ALLMEDIA,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 400,
      targetHeight: 400,
      cameraDirection: 1
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/png;base64,' + imageData;
      console.log(this.base64Image, 'base64Image');
      // this.doUpload(base64Image);
    }, (err) => {
      console.log(err);
    });
  }

  pickPhoto() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      console.log('Image URI: ' + results[0]);
      this.base64Image = 'data:image/png;base64,' + results[0];
    }, (err) => {
      console.log(err);
    });
  }
  async postData() {
    var addurl = '/api' + '/rest/2.0/face/v3/faceset/user/add' + "?access_token=" + this.access_token;
    var params = "{\"image\":\"" + this.base64Image + ",\"image_type\":\"BASE64\",\"group_id\":\"group1\",\"user_id\":\"" + this.userId + "\",\"user_info\":\"" + this.userInfo + ",\"quality_control\":\"LOW\",\"liveness_control\":\"LOW\"}";
    await this.http.post(addurl, params).then((response: any) => {
      if (response.face_token) {
        this.result = true;
      }
    }, (err) => {
      this.result = false;
    })
    this.close();
  }

}
