import { CustomHttp } from './custom-http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {

  constructor(private httpClient: HttpClient,
              private http: CustomHttp) {}

  getControllerList(project: number) {
    return this.http.get(`${environment.baseUrl}/controller/list/?project=${project}`);
  }
  updateController(data: any) {
    return this.http.put(`${environment.baseUrl}/controller/update/${data.id}/`, data);
  }
  createController(data: any) {
    return this.http.post(`${environment.baseUrl}/controller/create/`, data);
  }
  removeController(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/controller/delete/${id}/`);
  }
  getControllerModels() {
    return this.http.get(`${environment.baseUrl}/controller_model/list/`);
  }
  getSensorModels() {
    return this.http.get(`${environment.baseUrl}/sensor_model/list/`);
  }
  getSensorList(id: number) {
    return this.http.get(`${environment.baseUrl}/sensor/list/?controller_id=${id}`);
  }
  getSensors(project: number) {
    return this.http.get(`${environment.baseUrl}/sensor/list/?project_id=${project}`);
  }
  updateSensor(data: any) {
    return this.http.put(`${environment.baseUrl}/sensor/update/${data.id}/`, data);
  }
  createSensor(data: any) {
    return this.http.post(`${environment.baseUrl}/sensor/create/`, data);
  }
  removeSensor(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/sensor/delete/${id}/`);
  }

  getChannelsList(project: number) {
    return this.http.get(`${environment.baseUrl}/channel/list/?project=${project}`);
  }
  updateChannnel(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/channel/update/${id}/`, data);
  }
  createChannel(data: any) {
    return this.http.post(`${environment.baseUrl}/channel/create/`, data);
  }
  removeChannel(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/channel/delete/${id}/`);
  }

  getChannelType() {
    return this.http.get(`${environment.baseUrl}/channel_type/list/`);
  }

  getChannelsValue(project: number, start: string, end: string) {
    return this.http.get(`${environment.baseUrl}/channel_value/list/?project=${project}&start_datetime=${start}&end_datetime=${end}`);
  }

  getSensorStatus() {
    return this.http.get(`${environment.baseUrl}/sensor_status/list/`);
  }

  getTags() {
    return this.http.get(`${environment.baseUrl}/tag/list/`);
  }
  updateTag(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/tag/update/${id}/`, data);
  }
  createTag(data: any) {
    return this.http.post(`${environment.baseUrl}/tag/create/`, data);
  }
  removeTag(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/tag/delete/${id}/`);
  }
}
