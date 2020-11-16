import { CustomHttp } from './custom-http.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private MEDIA = 'http://monitoring-test.trafficwave.kz';
  constructor(private httpClient: HttpClient, private http: CustomHttp) {}

  projectList() {
    return this.httpClient.get(`${environment.baseUrl}/project/list/`);
  }

  projectById(id: any) {
    return this.http.get(`${environment.baseUrl}/project/detail/${id}`);
  }

  projectEdit(data: any) {
    return this.httpClient.post(`${environment.baseUrl}/project/editor/`, data);
  }

  projectCreate(data: any) {
    return this.httpClient.post(`${environment.baseUrl}/project/create/`, data);
  }

  projectUpdate(data: any, id: number) {
    return this.httpClient.put(`${environment.baseUrl}/project/update/${id}/`, data);
  }
  projectDelete(id: number) {
    return this.httpClient.delete(`${environment.baseUrl}/project/delete/${id}/`);
  }

  pageList(id: any) {
    return this.httpClient.get(`${environment.baseUrl}/page/list/?project=${id}`);
  }

  getClientList() {
    return this.httpClient.get(`${environment.authUrl}/client/list/`);
  }

  getClientUsers(id: number) {
    return this.http.get(`${environment.authUrl}/user/list?client=${id}`);
  }

  getUsersList() {
    return this.http.get(`${environment.authUrl}/user/list/`);
  }

  createUser(data: any) {
    return this.http.post(`${environment.authUrl}/user/create/`, data);
  }

  updateUser(data: any, id: number) {
    return this.http.put(`${environment.authUrl}/user/update/${id}/`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.authUrl}/user/delete/${id}/`);
  }

  getPermissionsList() {
    return this.http.get(`${environment.authUrl}/permission/list/`);
  }

  createGroup(data: any) {
    return this.http.post(`${environment.authUrl}/group/create/`, data);
  }

  updateGroup(data: any, id: number) {
    return this.http.put(`${environment.authUrl}/group/update/${id}/`, data);
  }

  getUserDetail(id: number) {
    return this.http.get(`${environment.authUrl}/user/detail/${id}`);
  }

  getGroupDetail(id: number) {
    return this.http.get(`${environment.authUrl}/group/detail/${id}`);
  }

  getGroupList() {
    return this.http.get(`${environment.authUrl}/group/list/`);
  }

  createClient(data: any) {
    return this.http.post(`${environment.authUrl}/client/create/`, data);
  }

  updateClient(data: any, id: number) {
    return this.http.put(`${environment.authUrl}/client/update/${id}/`, data);
  }

  deleteClient(id: number) {
    return this.http.delete(`${environment.authUrl}/client/delete/${id}/`);
  }

  getMetrics(id: number) {
    return this.http.get(`${environment.baseUrl}/project/metrics/${id}/`);
  }

  updatePage(page: any) {
    let data = '';
    if (localStorage.getItem('uid')) {
      data = '?editor_uuid=' + localStorage.getItem('uid');
    }
    return this.httpClient.put(`${environment.baseUrl}/page/update/${page.id}/${data}`, page);
  }

  updateAllPages(pages: any) {
    return this.httpClient.put(`${environment.baseUrl}/page/list/update/`, pages);
  }

  createPage(page: any) {
    let data = '';
    if (localStorage.getItem('uid')) {
      data = '?editor_uuid=' + localStorage.getItem('uid');
    }
    return this.httpClient.post(`${environment.baseUrl}/page/create/${data}`, page);
  }

  deletePage(id: any) {
    let data = '';
    if (localStorage.getItem('uid')) {
      data = '?editor_uuid=' + localStorage.getItem('uid');
    }
    return this.httpClient.delete(`${environment.baseUrl}/page/delete/${id}${data}`);
  }

  uploadImage(data: any) {
    return this.httpClient.post(`${this.MEDIA}/shared/media_file/create/`, data);
  }

  setProject(data: any) {
    return this.httpClient.post(`${environment.baseUrl}/project/editor/`, data);
  }
}


