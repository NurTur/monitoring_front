import { CustomHttp } from './../../../core/services/custom-http.service';
import { EquipmentService } from 'projects/my-app/src/app/core/services/equipment.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'my-org-measuring-channel-modal',
  templateUrl: './measuring-channel-modal.component.html',
  styleUrls: ['./measuring-channel-modal.component.scss']
})
export class MeasuringChannelModalComponent implements OnInit {

  @Output() changeModal = new EventEmitter<any>();
  @Output() getChannelsList = new EventEmitter<any>();
  @Input() channel: any;
  @Input() sensors: any;
  @Input() channelsType: any;

  selectedSensor: any;
  status: boolean;
  control: boolean;
  code: string;
  format: string;
  up: string;
  upWarning: string;
  upCritical: string;
  down: string;
  downWarning: string;
  downCritical: string;
  songWarning: boolean;
  songCritical: boolean;
  delta: boolean;
  formula: string;
  sqlProc: string;
  type: any;
  isFormulaValue = true;
  isSqlValue = true;
  constructor(private equipmentService: EquipmentService, private customHttp: CustomHttp) { }

  ngOnInit() {
    if (this.channel) {
      this.selectedSensor = this.channel.sensor.id;
      this.status = this.channel.data.is_active;
      this.control = this.channel.data.is_control_on;
      this.code = this.channel.code;
      this.format = this.channel.data.format;
      this.up = this.channel.data.down;
      this.upWarning = this.channel.data.up_warning;
      this.upCritical = this.channel.data.up_critical;
      this.down = this.channel.data.down;
      this.downWarning = this.channel.data.down_warning;
      this.downCritical = this.channel.data.down_critical;
      this.songWarning = this.channel.data.warning_sound;
      this.songCritical = this.channel.data.critical_sound;
      this.delta = this.channel.data.is_delta;
      this.formula = this.channel.formula;
      this.sqlProc = this.channel.sql_proc;
      this.type = this.channel.type;
    }
  }
  changeValue(value?: string){
    if (value === 'formula'){
      this.isFormulaValue = false;
      this.isSqlValue = true;
    } else if (value === 'sql') {
      this.isFormulaValue = true;
      this.isSqlValue = false;
    } else {
      this.isFormulaValue = true;
      this.isSqlValue = true;
    }
  }
  changeSensor(value: any) {
    this.selectedSensor = value;
  }
  changeChannelType(value: any) {
    this.type = value;
  }
  success() {
    this.getChannelsList.emit();
    this.changeModal.emit();
  }
  save(edit: boolean) {
    const data = {
      sensor: this.selectedSensor,
      code: this.code,
      formula: this.formula,
      sql_proc: this.sqlProc,
      type: this.type,
      data: {
        up: this.up,
        down: this.down,
        is_active: this.status,
        is_control_on: this.control,
        format: this.format,
        up_warning: this.upWarning,
        up_critical: this.upCritical,
        down_warning: this.downWarning,
        down_critical: this.downCritical,
        warning_sound: this.songWarning,
        critical_sound: this.songCritical,
        is_delta: this.delta
      }
    };
    if (edit) {
      this.equipmentService.updateChannnel(data, this.channel.id);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getChannelsList.emit();
          this.changeModal.emit();
        }
      });
    } else {
      this.equipmentService.createChannel(data);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getChannelsList.emit();
          this.changeModal.emit();
        }
      });
    }
  }
}
