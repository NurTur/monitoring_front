import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EquipmentService } from 'projects/my-app/src/app/core/services/equipment.service';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';
import * as moment from 'moment';

@Component({
  selector: 'my-org-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {

  id: any;
  type: string;
  controllers: any = [];
  sensors: any;
  listProject: any;
  projectName: any;
  models: any;
  sensorModels: any;
  channels: any;
  channelsType: any;
  states: any;
  tags: any;
  channelsValue: any;

  isContollers: boolean;
  isSensors: boolean;
  isMeasuringChannel: boolean;
  isValueChannel: boolean;
  isTag: boolean;

  tag: boolean;
  sensorModal: boolean;
  controllerModal: boolean;
  measuringChannelModal: boolean;

  startDate = moment(new Date()).format('YYYY-MM-DD');
  endDate = moment(new Date()).format('YYYY-MM-DD');
  constructor(
    private equipmentService: EquipmentService,
    private activatedRoute: ActivatedRoute,
    private projects: ProjectsService,
    private router: Router) {
    activatedRoute.paramMap.subscribe((params: any) => {
      this.id = params.get('id');
      this.type = params.get('type');
      this.changeName(this.type);
    });
  }

  ngOnInit() {
    this.getControllerList();
    this.getControllerModels();
    this.getSensors();
    this.getChannelsList();
    this.getChannelType();
    this.getSensorStatus();
    this.getTags();
    this.getChannelsValue();
    this.getSensorModels();
  }

  getControllerList() {
  this.equipmentService.getControllerList(this.id).subscribe((controllers: any) => {
      this.controllers = controllers;
      this.getProjects();
    });
  }
  getSensors() {
    this.equipmentService.getSensors(this.id).subscribe((sensors: any) => {
      this.sensors = sensors;
    });
  }
  getChannelType() {
    this.equipmentService.getChannelType().subscribe((channelsType: any) => {
      this.channelsType = channelsType;
    });
  }
  getProjects() {
    this.projects.projectList().subscribe((res: any) => {
      this.listProject = res;
      this.projectName = res.find((x: any) => x.id === Number(this.id));
    });
  }
  getControllerModels() {
    this.equipmentService.getControllerModels().subscribe((models: any) => {
      this.models = models;
    });
  }
  getSensorModels() {
    this.equipmentService.getSensorModels().subscribe((sensorModels: any) => {
      this.sensorModels = sensorModels;
    });
  }
  getSensorStatus() {
    this.equipmentService.getSensorStatus().subscribe((states: any) => {
      this.states = states;
    });
  }
  getTags() {
    this.equipmentService.getTags().subscribe((tags: any) => {
      this.tags = tags;
    });
  }
  getChannelsList() {
    this.equipmentService.getChannelsList(this.id).subscribe((channels: any) => {
      this.channels = channels;
    });
  }
  getChannelsValue() {
    this.equipmentService.getChannelsValue(this.id, this.startDate + ' 00:00:00', this.endDate + ' 23:59:59')
    .subscribe((channelsValue: any) => {
      if (channelsValue) {
        if (!channelsValue.error) {
          this.channelsValue = channelsValue;
        }
      }
    });
  }
  changeDate(start: any, end: any) {
    this.startDate = moment(start.model).format('YYYY-MM-DD');
    this.endDate = moment(end.model).format('YYYY-MM-DD');
    this.getChannelsValue();
  }
  changeEquipment(name: string) {
    this.changeName(name);
    this.router.navigate(['/equipment/' + name + '/' + this.id]);
  }
  changeName(name: string) {
    if (name === 'controllers') {
      this.isContollers = true;
      this.isSensors = false;
      this.isMeasuringChannel = false;
      this.isValueChannel = false;
      this.isTag = false;
    } else if (name === 'sensors') {
      this.isContollers = false;
      this.isSensors = true;
      this.isMeasuringChannel = false;
      this.isValueChannel = false;
      this.isTag = false;
    } else if (name === 'measuring-channels') {
      this.isContollers = false;
      this.isSensors = false;
      this.isMeasuringChannel = true;
      this.isValueChannel = false;
      this.isTag = false;
    } else if (name === 'valueChannels') {
      this.isContollers = false;
      this.isSensors = false;
      this.isMeasuringChannel = false;
      this.isValueChannel = true;
      this.isTag = false;
    } else if (name === 'tags') {
      this.isContollers = false;
      this.isSensors = false;
      this.isMeasuringChannel = false;
      this.isValueChannel = false;
      this.isTag = true;
    }
  }
  changeModal(name: string) {
    if (name === 'sensor') {
      this.sensorModal = !this.sensorModal;
    } else if (name === 'controller') {
      this.controllerModal = !this.controllerModal;
    } else if (name === 'measuring-channel') {
      this.measuringChannelModal = !this.measuringChannelModal;
    } else if (name === 'tag') {
      this.tag = !this.tag;
    }
  }

}
