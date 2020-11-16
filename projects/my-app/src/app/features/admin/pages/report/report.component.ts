import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';

import { WSService } from 'projects/my-app/src/app/core/services/ws.service';
import { ChannelService } from './../../../../core/services/channel.service';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';

@Component({
  selector: 'my-org-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  list: any;

  selectedChannels = '';
  channelList: any = [];
  arrayChannels: any = [];
  id: any;
  allComplete = false;
  hours = '1';
  minutes = '0';
  seconds = '0';
  loader = false;
  startDate = moment(new Date()).format('YYYY-MM-DDT00:00:00');
  endDate = moment(new Date()).format('YYYY-MM-DDT00:00:00');
  project: any;
  constructor(
    private channelService: ChannelService,
    private activatedRoute: ActivatedRoute,
    private projects: ProjectsService,
    private ws: WSService) {
    activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
  }

  ngOnInit(): void {
    this.getChannels();
    this.getProjectById();
    this.ws.connect(this.id);
    this.ws.getData().subscribe((res: any) => {
      if (res) {
        this.channelList = this.channelList.filter((x: any) => x.id !== res.id);
        this.channelList.unshift(res);
      }
    });
  }

  getChannels() {
    if (this.id !== '0') {
      this.loader = true;
      this.channelService.getChannelList(this.id).subscribe((res) => {
        this.channelList = res;
        this.loader = false;
      });
    }
  }

  getProjectById() {
    this.projects.projectById(this.id).subscribe((project) => {
      this.project = project;
    });
  }

  updateAllComplete(item: any) {
    this.arrayChannels.push(JSON.stringify(item.id));
    this.selectedChannels = this.arrayChannels.join(',');
  }

  someComplete(): boolean {
    if (this.channelList == null) {
      return false;
    }
    return this.channelList.filter((t: any) => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.channelList == null) {
      return;
    }
    !completed ? this.channelList.filter((t: any) => t.completed = false) : this.channelList.filter((t: any) => t.completed = true);
    this.selectedChannels = '';
  }

  onSubmit(form: NgForm) {
    // tslint:disable-next-line: prefer-const
    let {startDate, endDate, hour, min, sec} = form.value;
    if (hour < 0) { hour *= -1; }
    if (min < 0) { min *= -1; }
    if (sec < 0) { sec *= -1; }
    const report = {
      id: this.id,
      channels: this.selectedChannels,
      startDate: moment(startDate).format('YYYY-MM-DDT00:00:00'),
      endDate: moment(endDate).format('YYYY-MM-DDT00:00:00'),
      hours: hour,
      minutes: min,
      seconds: sec
    };

    this.channelService.getReportList(report).subscribe((res: any) => {
      const blob = new Blob([res]);
      fileSaver.saveAs(blob, `report-${moment(new Date()).format('DD.mm.yyyy')} - ${moment(new Date()).format('HH:mm:ss')}.xls`);
    });
  }
}
