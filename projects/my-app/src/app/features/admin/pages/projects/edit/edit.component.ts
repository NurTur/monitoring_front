import { EquipmentService } from 'projects/my-app/src/app/core/services/equipment.service';
import { PagesService } from './../../../../../core/services/pages.service';
import { Component, OnInit, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CdkDragEnd,
  CdkDragMove,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ChannelService } from './../../../../../core/services/channel.service';
import { ProjectsService } from './../../../../../core/services/projects.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { interval, Subscription } from 'rxjs';
import * as L from 'leaflet';
const source = interval(20000);

@Component({
  selector: 'my-org-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id: any;
  justId = 1;
  list: any = [];
  selectedBox: any = null;
  pages: any = [];
  selectedPage: any;
  createEditModal = false;
  imageSrc: any;
  pageName: string;
  editPage: any;
  channelModal = false;
  form: FormGroup;
  channelList: any = [];
  selectedChannel: any;
  showSaved = false;
  subscribe: Subscription;
  showedAnother = false;
  rotate = 0;
  parent: number;
  childArray: any;
  selectedItem: any;
  selectParentPage: any;
  linkPages: any;
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];
  private subscriptions: Subscription[] = [];
  private map: any;
  sensorsArr: any = [];
  sidebar: boolean;
  sensorNames: any = [];
  sensors: any = [];
  selectedSensor: any;
  sensorToMarkerMap: any = {};
  allSensors: any = [];
  sensorData: any;
  @ViewChild('fileInput*') fileInput: ElementRef;
  constructor(
    private activatedRoute: ActivatedRoute,
    public projects: ProjectsService,
    private fb: FormBuilder,
    public router: Router,
    private pagesService: PagesService,
    private equipmentService: EquipmentService,
  ) {
    activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
    this.createForm();
  }

  ngOnInit(): void {
    this.getAllReq();
  }
  getAllReq() {
    this.checkEdit();
    this.getSelectedPage();
    this.subscribe = source.subscribe((val) => this.checkEdit());
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
          return sensors.filter((item: any) => item.model.type.data.name === name).sort((a: any, b: any) => a.id - b.id);
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
        sensors.map((m: any) => {
          this.sensorNames.push(filterName(m.model.type.id));
          this.sensorNames = unique(this.sensorNames);
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
      }), draggable: true}).addTo(this.map).bindPopup(`
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
          <div class="popup__value" style="min-width: 36px;">${sensorData?.model?.data?.name}</div>
        </div>
        <div class="popup__name">Измерительные каналы</div>
        ${sensorData?.channels[0] ? `<div class="popup-channel bg-${sensorData?.channels[0]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensorData?.channels[0]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensorData?.channels[0]?.last_channel_value.state ? sensorData?.channels[0]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensorData?.channels[0]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[0]?.last_channel_value.value ? sensorData?.channels[0]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[0]?.last_channel_value.datetime ? new Date(sensorData?.channels[0]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensorData?.channels[0]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensorData?.channels[0]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensorData?.channels[0]?.last_channel_value.datetime).getHours() + ':' + new Date(sensorData?.channels[0]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
        ${sensorData?.channels[1] ? `<div class="popup-channel bg-${sensorData?.channels[1]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensorData?.channels[1]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensorData?.channels[1]?.last_channel_value.state ? sensorData?.channels[1]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensorData?.channels[1]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[1]?.last_channel_value.value ? sensorData?.channels[1]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[1]?.last_channel_value.datetime ? new Date(sensorData?.channels[1]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensorData?.channels[1]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensorData?.channels[1]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensorData?.channels[1]?.last_channel_value.datetime).getHours() + ':' + new Date(sensorData?.channels[1]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
        ${sensorData?.channels[2] ? `<div class="popup-channel bg-${sensorData?.channels[2]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensorData?.channels[2]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensorData?.channels[2]?.last_channel_value.state ? sensorData?.channels[2]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensorData?.channels[2]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[2]?.last_channel_value.value ? sensorData?.channels[2]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[2]?.last_channel_value.datetime ? new Date(sensorData?.channels[2]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensorData?.channels[2]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensorData?.channels[2]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensorData?.channels[2]?.last_channel_value.datetime).getHours() + ':' + new Date(sensorData?.channels[2]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
        ${sensorData?.channels[3] ? `<div class="popup-channel bg-${sensorData?.channels[3]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensorData?.channels[3]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensorData?.channels[3]?.last_channel_value.state ? sensorData?.channels[3]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensorData?.channels[3]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[3]?.last_channel_value.value ? sensorData?.channels[3]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[3]?.last_channel_value.datetime ? new Date(sensorData?.channels[3]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensorData?.channels[3]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensorData?.channels[3]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensorData?.channels[3]?.last_channel_value.datetime).getHours() + ':' + new Date(sensorData?.channels[3]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
        ${sensorData?.channels[4] ? `<div class="popup-channel bg-${sensorData?.channels[4]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensorData?.channels[4]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensorData?.channels[4]?.last_channel_value.state ? sensorData?.channels[4]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensorData?.channels[4]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[4]?.last_channel_value.value ? sensorData?.channels[4]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensorData?.channels[4]?.last_channel_value.datetime ? new Date(sensorData?.channels[4]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensorData?.channels[4]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensorData?.channels[4]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensorData?.channels[4]?.last_channel_value.datetime).getHours() + ':' + new Date(sensorData?.channels[4]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
        <div class="popup-line"></div>
        <div class="popup-wrap">
          <div class="popup__name">Серийный номер</div>
          <div class="popup__value" style="min-width: 88px;">${sensorData?.data?.serial_number}</div>
        </div>
        <div class="popup-wrap">
          <div class="popup__name">Проектный номер</div>
          <div class="popup__value" style="min-width: 88px;">${sensorData?.data?.project_number}</div>
        </div>
        <div class="popup-wrap">
          ${sensorData?.model?.type?.data?.img ? `<img class="popup__img" src="${sensorData?.model?.type?.data?.img}" alt="${sensorData?.model?.type?.data?.img}">` : '<div class="popup-not-img">Нет изображения</div>'}
        </div>
        <div class="popup__name">Датчик подключен к контроллеру</div>
        <div class="popup__value">${sensorData?.controller.data.name}</div>
      </div>
      `);
      // <button onclick="localStorage.setItem('open', ${sensorData?.id});"></button>
      marker.on('dragend', (event: any) => {
        this.dragSensor(event, sensorData);
      });
      this.sensorToMarkerMap[m.sensor] = marker;
    });
    this.mapClick();
    this.map.setView(xy(1200, 550), -1);
  }

  changeSensor(sensor: any) {
    this.selectedSensor = sensor;
  }

  mapClick() {
    const onMapClick = (e: any) => {
      const sensor = this.selectedSensor;
      console.log(this.selectedSensor);
      if (sensor !== undefined) {
        if (!this.isSensorOnPage(sensor.id)) {
          const marker: any =  L.marker(e.latlng, {icon: L.icon({
            iconUrl: `${
              sensor?.status === 'DEFAULT' ? sensor?.model?.type?.data?.normal_state_icon :
              sensor?.status === 'CRITICAL' ? sensor?.model?.type?.data?.critical_state_icon :
              sensor?.status === 'WARNING' ? sensor?.model?.type?.data?.warning_state_icon :
              sensor?.model?.type?.data?.no_data_icon
            }`,
            iconSize:     [32, 32],
            iconAnchor:   [16, 16],
            popupAnchor:  [100, 455]
          }), draggable: true}).addTo(this.map).bindPopup(`
            <div class="popup">
            <div class="popup__title header-${sensor?.status}">
              ${sensor?.status === 'CRITICAL' ? 'Аварийный статус' : sensor?.status === 'WARNING' ? 'Предупредительный статус' :  sensor?.status === 'DEFAULT' ? 'Показания датчика в норме' : 'Нет данных с датчика!'}
            </div>
            <div class="popup-wrap">
              <div class="popup__name">${sensor?.model?.type?.data.name}</div>
              <div class="popup__name">Модель</div>
            </div>
            <div class="popup-wrap" style="margin-bottom:8px">
              <div class="popup__value">${sensor?.name}</div>
              <div class="popup__value" style="min-width: 36px;">${sensor?.model?.data?.name}</div>
            </div>
            <div class="popup__name">Измерительные каналы</div>
            ${sensor?.channels[0] ? `<div class="popup-channel bg-${sensor?.channels[0]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensor?.channels[0]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensor?.channels[0]?.last_channel_value.state ? sensor?.channels[0]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensor?.channels[0]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[0]?.last_channel_value.value ? sensor?.channels[0]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[0]?.last_channel_value.datetime ? new Date(sensor?.channels[0]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensor?.channels[0]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensor?.channels[0]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensor?.channels[0]?.last_channel_value.datetime).getHours() + ':' + new Date(sensor?.channels[0]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
            ${sensor?.channels[1] ? `<div class="popup-channel bg-${sensor?.channels[1]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensor?.channels[1]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensor?.channels[1]?.last_channel_value.state ? sensor?.channels[1]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensor?.channels[1]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[1]?.last_channel_value.value ? sensor?.channels[1]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[1]?.last_channel_value.datetime ? new Date(sensor?.channels[1]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensor?.channels[1]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensor?.channels[1]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensor?.channels[1]?.last_channel_value.datetime).getHours() + ':' + new Date(sensor?.channels[1]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
            ${sensor?.channels[2] ? `<div class="popup-channel bg-${sensor?.channels[2]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensor?.channels[2]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensor?.channels[2]?.last_channel_value.state ? sensor?.channels[2]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensor?.channels[2]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[2]?.last_channel_value.value ? sensor?.channels[2]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[2]?.last_channel_value.datetime ? new Date(sensor?.channels[2]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensor?.channels[2]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensor?.channels[2]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensor?.channels[2]?.last_channel_value.datetime).getHours() + ':' + new Date(sensor?.channels[2]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
            ${sensor?.channels[3] ? `<div class="popup-channel bg-${sensor?.channels[3]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensor?.channels[3]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensor?.channels[3]?.last_channel_value.state ? sensor?.channels[3]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensor?.channels[3]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[3]?.last_channel_value.value ? sensor?.channels[3]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[3]?.last_channel_value.datetime ? new Date(sensor?.channels[3]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensor?.channels[3]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensor?.channels[3]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensor?.channels[3]?.last_channel_value.datetime).getHours() + ':' + new Date(sensor?.channels[3]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
            ${sensor?.channels[4] ? `<div class="popup-channel bg-${sensor?.channels[4]?.last_channel_value.state}"><div class="popup-wrap"><div class="popup-channel__name">${sensor?.channels[4]?.type?.data?.name}</div><div class="popup-channel__name" style="min-width: 82px;">${sensor?.channels[4]?.last_channel_value.state ? sensor?.channels[4]?.last_channel_value.state : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">${sensor?.channels[4]?.code}</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[4]?.last_channel_value.value ? sensor?.channels[4]?.last_channel_value.value : 'Нет данных'}</div></div><div class="popup-wrap"><div class="popup-channel__value">Дата</div><div class="popup-channel__value" style="min-width: 82px;">${sensor?.channels[4]?.last_channel_value.datetime ? new Date(sensor?.channels[4]?.last_channel_value.datetime).getDate() + '.' + (new Date(sensor?.channels[4]?.last_channel_value.datetime).getMonth() + 1) + '.' + new Date(sensor?.channels[4]?.last_channel_value.datetime).getFullYear() + ' ' + new Date(sensor?.channels[4]?.last_channel_value.datetime).getHours() + ':' + new Date(sensor?.channels[4]?.last_channel_value.datetime).getMinutes() : 'Нет данных'}</div></div></div>` : ''}
            <div class="popup-line"></div>
            <div class="popup-wrap">
              <div class="popup__name">Серийный номер</div>
              <div class="popup__value" style="min-width: 88px;">${sensor?.data?.serial_number}</div>
            </div>
            <div class="popup-wrap">
              <div class="popup__name">Проектный номер</div>
              <div class="popup__value" style="min-width: 88px;">${sensor?.data?.project_number}</div>
            </div>
            <div class="popup-wrap">
              ${sensor?.model?.type?.data?.img ? `<img class="popup__img" src="${sensor?.model?.type?.data?.img}" alt="${sensor?.model?.type?.data?.img}">` : '<div class="popup-not-img">Нет изображения</div>'}
            </div>
            <div class="popup__name">Датчик подключен к контроллеру</div>
            <div class="popup__value">${sensor?.controller.data.name}</div>
          </div>
        `);
          marker.on('dragend', (event: any) => {
            this.dragSensor(event, sensor);
          });
          this.map.addLayer(marker);
          this.sensorToMarkerMap[sensor.id] = marker;
          if (this.list.length) {
            this.justId = this.list.sort((a: any, b: any) => b.id - a.id)[0].id + 1;
          }
          const data = {
            id: this.justId,
            x: marker._latlng.lat,
            y:  marker._latlng.lng,
            sensor: sensor.id,
          };
          this.list.push(data);
          this.selectedBox = data;
          this.selectedPage.data.options = this.list;
          this.saveAuto();
          this.save();
        }
      }
    };
    this.map.on('click', onMapClick);
  }

  deleteSensor(sensor: any) {
    const marker = this.sensorToMarkerMap[sensor.id];
    this.list = this.list.filter((x: any) => x.sensor !== sensor.id);
    this.selectedPage.data.options = this.list;
    this.selectedBox = null;
    this.projects.updatePage(this.selectedPage).subscribe((res) => {
      this.map.removeLayer(marker);
    });
  }

  dragSensor(event: any, sensor: any) {
    const position = event.target.getLatLng();
    event.target.setLatLng(new L.LatLng(position.lat, position.lng), {draggable: true});
    this.map.panTo(new L.LatLng(position.lat, position.lng));
    const dataDrag = {
      id: this.justId,
      x: position.lat,
      y: position.lng,
      sensor: sensor.id,
    };
    this.selectedBox = dataDrag;
    this.list.forEach((el: any, i: number) => {
      if (el.sensor === sensor.id) {
        this.list.splice(i, 1);
      }
    });
    this.list.push(dataDrag);
    // this.list = [];
    this.selectedPage.data.options = this.list;
    this.saveAuto();
    this.save();
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

  showSensors(sensor: any) {
    sensor.show = !sensor.show;
  }

  showSensorData(sensor: any) {
    sensor.show = !sensor.show;
  }

  createForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.subscribe.unsubscribe();
    this.subscriptions.forEach(s => s.unsubscribe());
    this.saveAuto();
  }

  checkEdit() {
    const cs = localStorage.getItem('uid');
    const timer = Date.parse(new Date().toISOString()).toString();
    let uid;
    if (!cs) {
      localStorage.setItem('uid', timer);
      uid = timer;
    } else {
      uid = cs;
    }
    this.projects.setProject({ project: this.id, uuid: uid }).subscribe(
      (res) => {
        this.saveAuto();
      },
      (error) => {
        if (!this.showedAnother) {
          console.log(error);
          this.showedAnother = true;
        }
      }
    );
  }

  changeSidebar() {
    this.sidebar = !this.sidebar;
  }

  private prepareSave(): any {
    const input = new FormData();
    const data = this.form.get('file') || { value: null };
    input.append('file', data.value);
    return input;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const data = this.form.get('file') || { setValue: () => {} };
      data.setValue(file);
      this.onSubmitf();
    }
  }
  closeModal() {
    this.createEditModal = false;
  }

  changePageName(name: string) {
    this.pageName = name;
  }

  openModal(page?: any) {
    if (page) {
      this.editPage = page;
      this.pageName = page.data.name;
      this.imageSrc = {};
      this.imageSrc.file = page.data.image;
    } else {
      this.editPage = null;
      this.imageSrc = null;
      this.pageName = '';
    }
    this.createEditModal = true;
  }

  openModalChild(page?: any, isNew?: boolean) {
    if (isNew) {
      this.editPage = null;
      this.imageSrc = null;
      this.pageName = '';
    } else {
      this.editPage = page;
      this.pageName = page.data.name;
      this.imageSrc = {};
      this.imageSrc.file = page.data.image;
    }
    this.createEditModal = true;
  }

  createPage() {
    const data = {
      data: {
        name: this.pageName,
        image: this.imageSrc.file,
        position: this.pages.length
          ? this.pages[this.pages.length - 1].position + 1
          : 0,
      },
      project: this.id,
      parent: this.parent
    };
    this.projects.createPage(data).subscribe(
      (res) => {
        this.pagesService.setPage(res);
        this.createEditModal = false;
      },
      (error) => {
        alert(JSON.stringify(error.error).replace(/[{()}]/g, ''));
    });
  }

  updatePage() {
    this.editPage.data.name = this.pageName;
    this.editPage.data.image = this.imageSrc.file;
    this.projects.updatePage(this.editPage).subscribe((res) => {
      if (this.map !== undefined) { this.map.remove(); }
      this.initMap();
      // this.getSensors();
      this.createEditModal = false;
    });
  }

  getPageById() {
    this.projects.pageList(this.id).subscribe((pages: any) => {
      if (pages) {
        if (pages.length > 0) {
          this.linkPages = pages;
          if (this.selectedPage?.parent === null) {
            this.selectParentPage = pages.find((item: any) => this.selectedPage?.id === item?.id);
            this.parent = this.selectParentPage?.id;
          } else {
            this.selectParentPage = pages.find((item: any) => this.selectedPage?.parent === item?.id);
          }
          this.pages = pages.filter((item: any) => item.parent === null);
          setTimeout(() => {
            this.childArray = pages.filter((item: any) => {
              if (item.parent !== null) {
                return item.parent === this.selectedPage.id || item.parent === this.selectedPage.parent;
              } else {
                return false;
              }
            });
          }, 100);
          if (this.pages.length) {
            this.pages.sort((a: any, b: any) => a.data.position - b.data.position);
            if (!this.selectedPage) {
              this.selectedPage = this.pages[0];
              this.selectedItem = this.pages[0];
              this.list = this.selectedPage?.data?.options
                ? this.selectedPage?.data?.options
                : [];
            }
          } else {
            this.selectedPage = null;
          }
        }
      }
    });
  }

  deletePage(page: any) {
    const question = confirm(`Вы уверены что хотите удалить мнемосхему ${page.data.name}?`);
    if (question) {
      this.projects.deletePage(page.id).subscribe((res) => {
        if (page.id === this.selectedPage.id) {
          this.selectedPage = this.pages[0];
        }
        this.getPageById();
      });
    } else {
      console.log(question);
    }
  }

  target() {
    this.getSensors();
  }

  changeTab(item: any) {
    if (item.parent === null) {
      this.selectedItem = item;
    }
    this.getPageById();
    if (this.selectedPage !== item) {
      this.projects.updatePage(this.selectedPage).subscribe((res) => {
        this.selectedPage = item;
        this.list = this.selectedPage?.data?.options
          ? this.selectedPage?.data?.options
          : [];
      });
      this.selectedBox = null;
      this.getSensors();
    }
  }

  save() {
    this.showSaved = false;
    this.projects.updatePage(this.selectedPage).subscribe(
      (res) => {
        this.getPageById();
        this.showSaved = true;
        setTimeout(() => {
          this.showSaved = false;
        }, 1000);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveAuto() {
    if (!this.selectedPage) {
      return;
    }
    this.projects.updatePage(this.selectedPage).subscribe((res) => {
      this.getPageById();
    });
  }

  onSubmitf() {
    const formModel = this.prepareSave();
    this.projects.uploadImage(formModel).subscribe((res) => {
      this.imageSrc = res;
      // tslint:disable-next-line: no-unused-expression
      this.selectedBox.style ? this.selectedBox.style.background = `#fff url(${this.imageSrc?.file}) no-repeat center center` : '';
      this.selectedBox.style['background-size'] = `cover`;
    });
  }

}
