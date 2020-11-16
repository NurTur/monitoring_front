import { CustomHttp } from './custom-http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import {Http, ResponseContentType} from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private REST_API_SERVER = environment.baseUrl + '/channel';
  private GRAPH_URL = environment.reportUrl + '/graphic';

  constructor(
    private httpClient: HttpClient,
    private http: CustomHttp) {}

  getChannelList(projectId: any, channels: any = '') {
    return this.http.get(`${this.REST_API_SERVER}/list/?project=${projectId}&channels=${channels}`);
  }

  getChannels() {
    return this.http.get(`${this.REST_API_SERVER}/list/`);
  }

  getGraphList(filter: any) {
    return this.httpClient.get(`${this.GRAPH_URL}/list/`, { params: filter });
  }

  getReportList(report: any) {
    return this.httpClient.get(`${environment.reportUrl}/excel/?project=${report.id}&channels=${report.channels}&start_datetime=${report.startDate}&end_datetime=${report.endDate}&step=${report.hours}:${report.minutes}:${report.seconds}`,
    {responseType: 'blob'}).pipe(map(
      (res: any) => {
        return new Blob([res], {type: 'application/vnd.ms.excel'});
      }));
  }
  getChannelsPage(id: number) {
    return this.http.get(`${environment.baseUrl}/page/channels/list/${id}/`);
  }
  updateSelectedChannels(data: any) {
    return this.httpClient.put(`${environment.baseUrl}/page/channels/update/${data.id}/`, data);
  }
}
