import { CustomHttp } from './custom-http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DirectoryService {

  constructor(private httpClient: HttpClient,
              private http: CustomHttp) {}

  getChannelType() {
    return this.http.get(`${environment.baseUrl}/channel_type/list/`);
  }
  updateChannelType(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/channel_type/update/${id}/`, data);
  }
  createChannelType(data: any) {
    return this.http.post(`${environment.baseUrl}/channel_type/create/`, data);
  }
  removeChannelType(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/channel_type/delete/${id}/`);
  }

  getMeasureList() {
    return this.http.get(`${environment.baseUrl}/measure/list/`);
  }

  getSensorTypeList() {
    return this.http.get(`${environment.baseUrl}/sensor_type/list/`);
  }
  updateSensorType(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/sensor_type/update/${id}/`, data);
  }
  createSensorType(data: any) {
    return this.http.post(`${environment.baseUrl}/sensor_type/create/`, data);
  }
  removeSensorType(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/sensor_type/delete/${id}/`);
  }

  getSensorModelList() {
    return this.http.get(`${environment.baseUrl}/sensor_model/list/`);
  }
  updateSensorModel(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/sensor_model/update/${id}/`, data);
  }
  createSensorModel(data: any) {
    return this.http.post(`${environment.baseUrl}/sensor_model/create/`, data);
  }
  removeSensorModel(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/sensor_model/delete/${id}/`);
  }

  getControllerModel() {
    return this.http.get(`${environment.baseUrl}/controller_model/list/`);
  }
  updateControllerModel(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/controller_model/update/${id}/`, data);
  }
  createControllerModel(data: any) {
    return this.http.post(`${environment.baseUrl}/controller_model/create/`, data);
  }
  removeControllerModel(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/controller_model/delete/${id}/`);
  }

  getSensorStatus() {
    return this.http.get(`${environment.baseUrl}/sensor_status/list/`);
  }
  updateSensorStatus(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/sensor_status/update/${id}/`, data);
  }
  createSensorStatus(data: any) {
    return this.http.post(`${environment.baseUrl}/sensor_status/create/`, data);
  }
  removeSensorStatus(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/sensor_status/delete/${id}/`);
  }

  getControllerStatus() {
    return this.http.get(`${environment.baseUrl}/controller_status/list/`);
  }
  updateControllerStatus(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/controller_status/update/${id}/`, data);
  }
  createControllerStatus(data: any) {
    return this.http.post(`${environment.baseUrl}/controller_status/create/`, data);
  }
  removeControllerStatus(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/controller_status/delete/${id}/`);
  }

  getChannelValueStatus() {
    return this.http.get(`${environment.baseUrl}/channel_value_status/list/`);
  }
  updateChannelValueStatus(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/channel_value_status/update/${id}/`, data);
  }
  createChannelValueStatus(data: any) {
    return this.http.post(`${environment.baseUrl}/channel_value_status/create/`, data);
  }
  removeChannelValueStatus(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/channel_value_status/delete/${id}/`);
  }

  getManufacturer() {
    return this.http.get(`${environment.baseUrl}/manufacturer/list/`);
  }
  updateManufacturer(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/manufacturer/update/${id}/`, data);
  }
  createManufacturer(data: any) {
    return this.http.post(`${environment.baseUrl}/manufacturer/create/`, data);
  }
  removeManufacturer(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/manufacturer/delete/${id}/`);
  }

  getCountry() {
    return this.http.get(`${environment.baseUrl}/country/list/`);
  }
  updateCountry(data: any, id: number) {
    return this.http.put(`${environment.baseUrl}/country/update/${id}/`, data);
  }
  createCountry(data: any) {
    return this.http.post(`${environment.baseUrl}/country/create/`, data);
  }
  removeCountry(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/country/delete/${id}/`);
  }
}
