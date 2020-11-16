import { CustomHttp } from './custom-http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private REST_API_SERVER = environment.baseUrl + '/notification';
  private ReportUrl = environment.reportUrl;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private http: CustomHttp) {}

  getNotifyList(data: any) {
    return this.httpClient.get(`${this.REST_API_SERVER}/list/`, {params: data});
  }
  createNotification(data: any) {
    return this.http.post(`${this.REST_API_SERVER}/create/`, data);
  }

  getExcel() {
    return this.httpClient.get(`${this.ReportUrl}/excel/`, { responseType: 'blob' });
  }
}
