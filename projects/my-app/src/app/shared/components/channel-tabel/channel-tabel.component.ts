import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EquipmentService } from '../../../core/services/equipment.service';

@Component({
  selector: 'my-org-channel-tabel',
  templateUrl: './channel-tabel.component.html',
  styleUrls: ['./channel-tabel.component.scss']
})
export class ChannelTabelComponent implements OnInit {
  @Input() controller: any;
  @Input() controllers: any;
  @Input() sensor: any;
  @Input() sensors: any;
  @Input() projectName: any;
  @Input() listProject: any;
  @Input() models: any;
  @Input() sensorModels: any;
  @Input() channel: any;
  @Input() channelsType: any;
  @Input() channelValue: any;
  @Input() states: any;
  @Input() tag: any;
  @Input() channels: any;
  @Output() getControllerList = new EventEmitter<any>();
  @Output() getSensors = new EventEmitter<any>();
  @Output() getChannelsList = new EventEmitter<any>();
  @Output() getTags = new EventEmitter<any>();
  modelData: any;
  channelData: any;
  channelValueCode: any;
  controllerModal: boolean;
  sensorModel: any;
  constructor(private equipmentService: EquipmentService) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.controller) {
        this.modelData = this.models.find((x: any) => x.id === Number(this.controller.model));
      }
      if (this.channel) {
        this.channelData = this.channelsType.find((x: any) => x.id === Number(this.channel.type));
        console.log(this.channel);
      }
      if (this.channelValue) {
        this.channelValueCode = this.channels.find((x: any) => x.id === Number(this.channelValue.channel));

      }
      if (this.sensor) {
        this.sensorModel = this.sensorModels.find((x: any) => x.type.id === this.sensor.model.type.id);
      }
    }, 100);
  }
  removeController(id: number) {
    const question = confirm('Удалить контроллер?');
    if (question) {
      this.equipmentService.removeController(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getControllerList.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeSensor(id: number) {
    const question = confirm('Удалить датчик?');
    if (question) {
      this.equipmentService.removeSensor(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getSensors.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeChannel(id: number) {
    const question = confirm('Удалить канал?');
    if (question) {
      this.equipmentService.removeChannel(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getChannelsList.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeTag(id: number) {
    const question = confirm('Удалить тег?');
    if (question) {
      this.equipmentService.removeTag(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getTags.emit();
      });
    } else {
      console.log(question);
    }
  }
  changeModal() {
    this.controllerModal = !this.controllerModal;
  }

}
