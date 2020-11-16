import { EquipmentService } from './../../../../../core/services/equipment.service';
import { PagesService } from './../../../../../core/services/pages.service';
import { Subscription, Subscribable } from 'rxjs';
import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import { ProjectsService } from './../../../../../core/services/projects.service';
import { ChannelService } from './../../../../../core/services/channel.service';
import { NotifyService } from './../../../../../core/services/notify.service';
import { ConfirmationService } from './../../../../../core/services/confirmation.service';
import { AuthService } from './../../../../../core/services/auth.service';
import { WSService } from './../../../../../core/services/ws.service';
import * as L from 'leaflet';

@Component({
  selector: 'my-org-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss', './show-more.component.scss'],
})
export class ShowComponent implements OnInit {
  private map: any;
  id: any;
  project: any;
  pages: any = [];
  selectedPage: any;
  list: any = [];
  selectedChannel: any;
  channelList: any = [];
  time: any;
  timer: any;
  reloadPage: any;
  loader = false;
  childArray: any;
  selectParentPage: any;
  sensors: any = [];
  sensorsLocal: any = [];
  sensorNames: any = [];
  sidebar: boolean;
  allSensors: any;
  sensorData: any;
  private subscriptions: Subscription[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    public projects: ProjectsService,
    public pagesService: PagesService,
    private fb: FormBuilder,
    private notify: NotifyService,
    public router: Router,
    public channelService: ChannelService,
    private conf: ConfirmationService,
    private auth: AuthService,
    private ws: WSService,
    private equipmentService: EquipmentService
  ) {
    activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
  }

  ngOnInit() {
    this.getProjectById();
    this.connectWs();
    this.getTimer();
    this.getChannels();
    this.updatePage();
    this.getSelectedPage();
  }
  getSelectedPage() {
    const pagesSub = this.pagesService.selectedPage$.subscribe((page: any) => {
      this.selectedPage = page;
      this.list = page?.data?.options ? page?.data?.options : [];
      this.getPageById();
      this.getSensors();
    });
    this.subscriptions.push(pagesSub);
  }
  getSensors() {
    this.equipmentService.getSensors(this.id).subscribe((sensors: any) => {
      if (sensors) {
        this.allSensors = sensors;
        const filterName = (id: number) => {
          return sensors.find((item: any): boolean => {
            if (item.model) {
              return item.model.type.id === id;
            }
            return false;
          }).model.type.data.name;
        };
        const filter = (name: string) => {
          return this.sensorsLocal.filter((item: any) => item.model.type.data.name === name).sort((a: any, b: any) => a.id - b.id);
        };
        const unique = (arr: any) => {
          const result: any = [];
          for (const str of arr) {
            if (!result.includes(str)) {
              result.push(str);
            }
          }
          return result;
        };
        this.sensors = [];
        this.sensorsLocal = [];
        this.list.map((m: any) => {
          sensors.find((sensor: any) => {
            if (sensor.id === m.sensor) {
              this.sensorsLocal.push(sensor);
              this.sensorNames.push(filterName(sensor.model.type.id));
              this.sensorNames = unique(this.sensorNames);
            }
          });
        });
        this.sensorNames.map((n: string) => {
          this.sensors.push({name: n, sensors: filter(n)});
        });
        if (this.selectedPage) {
          if (this.map !== undefined) { this.map.remove(); }
          this.initMap();
        }
      }
    });
  }
  initMap() {
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 2,
      zoomSnap: 0.25,
      zoomDelta: 0.25,
    });
    const yx = L.latLng;
    const xy = (x: any, y: any) => {
      if (L.Util.isArray(x)) {
        return yx(x[1], x[0]);
      }
      return yx(y, x);
    };
    if (this.selectedPage.data.image_width ||  this.selectedPage.data.image_height) {
      const bounds: any = [xy(0, 0), xy(this.selectedPage.data.image_width, this.selectedPage.data.image_height)];
      L.imageOverlay(this.selectedPage.data.image, bounds).addTo(this.map);
    } else {
      const bounds: any = [xy(0, 0), xy(1800, 1200)];
      L.imageOverlay(this.selectedPage.data.image, bounds).addTo(this.map);
    }
    this.list.map((m: any) => {
      const LatLng = {
        lat: m.x,
        lng: m.y
      };

      let sensorData = this.sensorData;
      this.allSensors.find((sensor: any) => {
        if (sensor.id === m.sensor) {
          sensorData = sensor;
        }
      });
      const marker = L.marker(LatLng, {icon: L.icon({
        iconUrl: `${
          sensorData?.status === 'DEFAULT' ? sensorData?.model?.type?.data?.normal_state_icon :
          sensorData?.status === 'CRITICAL' ? sensorData?.model?.type?.data?.critical_state_icon :
          sensorData?.status === 'WARNING' ? sensorData?.model?.type?.data?.warning_state_icon :
          sensorData?.model?.type?.data?.no_data_icon
        }`,
        iconSize:     [32, 32],
        iconAnchor:   [16, 16],
        popupAnchor:  [155, 455],
      }), draggable: false}).addTo(this.map).bindPopup(`
      <div class="popup">
        <div class="popup__title header-${sensorData?.status}">
          ${sensorData?.status === 'CRITICAL' ? 'Аварийный статус' : sensorData?.status === 'WARNING' ? 'Предупредительный статус' :  sensorData?.status === 'DEFAULT' ? 'Показания датчика в норме' : 'Нет данных с датчика!'}
        </div>
        <div class="popup-wrap">
          <div class="popup__name">${sensorData?.model?.type?.data.name}</div>
          <div class="popup__name">Модель</div>
        </div>
        <div class="popup-wrap" style="margin-bottom:8px">
          <div class="popup__value">${sensorData?.name}</div>
          <div class="popup__value" style="min-width: 36px;">${sensorData?.model.data.name}</div>
        </div>
        <div class="popup__name">Измерительные каналы</div>
        ${sensorData?.channels[0] ? `<div class="popup-channel title-${sensorData?.channels[0]?.last_channel_value.state} bg-${sensorData?.channels[0]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensorData?.channels[0]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensorData?.channels[0]?.last_channel_value.state}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensorData?.channels[0]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[0]?.last_channel_value.value}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${new Date(sensorData?.channels[0]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensorData?.channels[0]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensorData?.channels[0]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensorData?.channels[0]?.last_channel_value.datetime).getHours() + ':' + new Date(sensorData?.channels[0]?.last_channel_value.datetime).getMinutes()}</div></div></div>` : ''}
        ${sensorData?.channels[1] ? `<div class="popup-channel title-${sensorData?.channels[1]?.last_channel_value.state} bg-${sensorData?.channels[1]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensorData?.channels[1]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensorData?.channels[1]?.last_channel_value.state}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensorData?.channels[1]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[1]?.last_channel_value.value}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${new Date(sensorData?.channels[1]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensorData?.channels[1]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensorData?.channels[1]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensorData?.channels[1]?.last_channel_value.datetime).getHours() + ':' + new Date(sensorData?.channels[1]?.last_channel_value.datetime).getMinutes()}</div></div></div>` : ''}
        ${sensorData?.channels[2] ? `<div class="popup-channel title-${sensorData?.channels[2]?.last_channel_value.state} bg-${sensorData?.channels[2]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensorData?.channels[2]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensorData?.channels[2]?.last_channel_value.state}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensorData?.channels[2]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[2]?.last_channel_value.value}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${new Date(sensorData?.channels[2]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensorData?.channels[2]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensorData?.channels[2]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensorData?.channels[2]?.last_channel_value.datetime).getHours() + ':' + new Date(sensorData?.channels[2]?.last_channel_value.datetime).getMinutes()}</div></div></div>` : ''}
        <div class="popup-line"></div>
        <div class="popup-wrap">
          <div class="popup__name">Серийный номер</div>
          <div class="popup__value" style="min-width: 88px;">${sensorData?.data.serial_number}</div>
        </div>
        <div class="popup-wrap">
          <div class="popup__name">Проектный номер</div>
          <div class="popup__value" style="min-width: 88px;">${sensorData?.data.project_number}</div>
        </div>
        <div class="popup-wrap">
          ${sensorData?.model?.type?.data?.img ? `<img class="popup__img" src="${sensorData?.model?.type?.data?.img}" alt="${sensorData?.model?.type?.data?.img}">` : '<div class="popup-not-img">Нет изображения</div>'}
        </div>
        <div class="popup__name">Датчик подключен к контроллеру</div>
        <div class="popup__value">${sensorData?.controller.data.name}</div>
      </div>
      `);
    });
    this.map.setView(xy(1200, 550), -1);
  }
  changeSidebar() {
    this.sidebar = !this.sidebar;
  }
  showSensors(sensor: any) {
    sensor.show = !sensor.show;
  }
  getPageById() {
    setTimeout(() => {
      this.projects.pageList(this.id).subscribe((res: any) => {
        if (this.selectedPage) {
          if (this.selectedPage.parent === null) {
            this.selectParentPage = res.find((item: any) => this.selectedPage?.id === item?.id);
          } else {
            this.selectParentPage = res.find((item: any) => this.selectedPage?.parent === item?.id);
          }
          this.childArray = res.filter((item: any) => {
            if (item.parent !== null) {
              return item.parent === this.selectedPage.id || item.parent === this.selectedPage.parent;
            } else {
              return false;
            }
          });
        }
      });
    }, 100);
  }
  isSensorOnPage(id: number): boolean {
    if (this.selectedPage.data.options === undefined) {
      this.selectedPage.data.options = [];
    }
    const x = this.selectedPage.data.options.find((item: any) => {
      return item.sensor === id;
    });
    if (x === undefined) {
      return false;
    } else {
      return true;
    }
  }
  updatePage() {
    this.reloadPage = setInterval(() => {
      this.getSensors();
    }, 60000);
  }

  connectWs() {
    this.ws.connect(this.id);
    this.ws.getData().subscribe((res: any) => {
      if (res) {
        for (const item of this.channelList) {
          if (item?.last_notification) {
            if (item.last_notification.id === res.id) {
              item.last_notification = res;
            }
          }
        }
      }
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.ws.reject(this.id);
    this.subscriptions.forEach(s => s.unsubscribe());
    clearInterval(this.timer);
    clearInterval(this.reloadPage);
  }

  getChannels() {
    const channels = this.getChannelsString();
    this.channelService.getChannelList(this.id, channels).subscribe((res) => {
      this.channelList = res;
    });
  }

  getProjectById() {
    this.projects.projectById(this.id).subscribe((res) => {
      this.project = res;
    });
  }

  getState(id: any) {
    const data = this.channelList.find((x: any) => x.id === id);
    if (data && data.last_notification) {
      return data.last_notification.data.state;
    } else {
      return 'DEFAULT';
    }
  }


  openPage(item: any) {
    if (item.pagelink) {
      const pagesSub = this.pagesService.pages$.subscribe((res: any) => {
        const pages = res.find((x: any) => x.id === item.pagelink * 1);
        this.selectedPage = pages;
        this.list = this.selectedPage?.data?.options
        ? this.selectedPage?.data?.options
        : [];
      });
      this.subscriptions.push(pagesSub);
    }
  }
  changeTab(item: any) {
    localStorage.removeItem('selectedPage');
    this.pagesService.setPage(item);
    this.getPageById();
    this.selectedPage = item;
    this.getSensors();
  }
  target() {
    this.getSensors();
  }
  getChannelsString() {
    let channels: any = '';
    if (this.selectedPage?.data?.options) {
      for (const item of this.selectedPage?.data?.options) {
        if (item.channel && item.channel.id) {
          channels = channels + item.channel.id + ',';
        }
      }
    }
    channels = channels.substring(0, channels.length - 1);
    return channels;
  }

  getTimer() {
    this.timer = setInterval(() => {
      this.time = moment(new Date()).format('HH:mm:ss');
    }, 1000);
  }
}
