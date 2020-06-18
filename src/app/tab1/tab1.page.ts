import { Component } from '@angular/core';
import { HttpserviceService } from '../services/httpservice.service';
import { ModalController } from '@ionic/angular';
import { UserInfoComponent } from './components/user-info/user-info.component';


// import axios from 'axios';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public userInfoList: any[] = [];
  private client_id: string = 'rTD5KIe8AnN7rUy7O1nCpqto';
  private client_secret: string = 'ZfrkZKt5fTqLh9e17OknYQk7QxuuBEpR';
  private host: any = 'https://aip.baidubce.com' + '/oauth/2.0/token?grant_type=client_credentials&client_id=' + this.client_id + '&client_secret=' + this.client_secret;
  private access_token: any;
  // public x:number = 1;

  constructor(public http: HttpserviceService, public modalController: ModalController) { }

  ngOnInit(): void {
    this.getList().then();
    /* axios.get(this.host).then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    }) */
  }

  getList() {
    return new Promise((resolve, reject) => {
      this.http.get(this.host).then((response: any) => {
        if (response) {
          console.log(response.access_token);
          this.access_token = response.access_token;
        }
      }).then(() => this.getUsers())
        .then((data: number) => {
          if (this.userInfoList.length != 0) {
            this.loopInfo(data);
          }
          resolve(0);
        }).catch(err => {
          reject(err);
          console.log(err);
        })
    })
  }

  getUsers() {
    var url = 'https://aip.baidubce.com' + '/rest/2.0/face/v3/faceset/group/getusers' + "?access_token=" + this.access_token;
    var params = { "group_id": "group1" };
    return new Promise((resolve, reject) => {
      this.http.post(url, params).then((response: any) => {
        this.userInfoList.splice(0, this.userInfoList.length);
        for (let element of response.result.user_id_list) {
          this.userInfoList.push({ 'userId': element, 'userInfo': '' })
        };
        resolve(response.result.user_id_list.length);
      }, (err) => {
        console.log(err);
        reject(err);
        this.http.toast('获取信息失败');
      });
    })

  }
  getUserInfo(i: number) {
    var infourl = 'https://aip.baidubce.com' + '/rest/2.0/face/v3/faceset/user/get' + '?access_token=' + this.access_token;
    var params = { "user_id": this.userInfoList[i - 1].userId, "group_id": "group1" };
    return new Promise((resolve, reject) => {
      this.http.post(infourl, params).then((response: any) => {
        console.log(response.result.user_list[0].user_info);
        this.userInfoList[i - 1].userInfo = response.result.user_list[0].user_info;
        i++;
        resolve(i);
      }, (err) => {
        console.log(err);
        reject(err);
        console.log(err);
        this.http.toast('获取信息失败');
      })
    })
  }

  loopInfo(k: number, m = 1) {
    this.getUserInfo(m).then((data: number) => {
      if (data <= k) {
        this.loopInfo(k, data);
      }
    })
  }

  deleteUser(k: number) {
    return new Promise((resolve, reject) => {
      var deleteurl = 'https://aip.baidubce.com' + '/rest/2.0/face/v3/faceset/user/delete' + '?access_token=' + this.access_token;
      var params = { "user_id": this.userInfoList[k].userId, "group_id": "group1" };
      this.http.post(deleteurl, params).then((response: any) => {
        console.log(response);
        resolve(response.error_code);
      }, (err) => {
        console.log(err);
        reject(err.error_code);
        this.http.toast('删除失败');
      })
    })
  }
  delete(k: number) {
    this.deleteUser(k).then((data) => {
      if (!data) {
        this.userInfoList.splice(k, 1);
      }
    })
  }

  async addUser() {
    const modal = await this.modalController.create({
      component: UserInfoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'access_token': this.access_token
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    console.log(data);
    if (data.result) {
      var event = new Promise((resolve) => {
        this.userInfoList.forEach((element) => {
          if (element.userId == data.userId) {
            resolve(1);
          }
        })
        resolve(0);
      });
      event.then((flag) => {
        if (!flag) {
          this.userInfoList.push({ 'userId': data.userId, 'userInfo': data.userInfo });
          this.http.toast('创建成功');
        } else {
          this.http.toast('添加成功');
        }
      })
    } else {
      this.http.toast('创建失败');
    }
  }

  doRefresh(e) {
    // this.getList().then(()=> e.target.complete());
    this.getList().then((data) => {
      e.target.complete();
      if (data) {
        this.http.toast('获取信息失败');
      }
    });
  }
}
