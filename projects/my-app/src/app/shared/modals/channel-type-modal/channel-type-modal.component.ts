import { CustomHttp } from './../../../core/services/custom-http.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DirectoryService } from '../../../core/services/directory.service';

@Component({
  selector: 'my-org-channel-type-modal',
  templateUrl: './channel-type-modal.component.html',
  styleUrls: ['./channel-type-modal.component.scss']
})
export class ChannelTypeModalComponent implements OnInit {

  @Output() changeModal = new EventEmitter<any>();
  @Output() getChannelType = new EventEmitter<any>();
  @Input() type: any;
  measure: any;
  name: string;
  measures: any;
  status: boolean;
  control: boolean;
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

  constructor(private directoryService: DirectoryService,
              private customHttp: CustomHttp) { }

  ngOnInit(): void {
    this.getMeasureList();
    if (this.type) {
      this.name = this.type.data.name;
      this.measure = this.type.data.measure;
      this.status = this.type.data.channel_data.is_active;
      this.control = this.type.data.channel_data.is_control_on;
      this.format = this.type.data.channel_data.format;
      this.up = this.type.data.channel_data.down;
      this.upWarning = this.type.data.channel_data.up_warning;
      this.upCritical = this.type.data.channel_data.up_critical;
      this.down = this.type.data.channel_data.down;
      this.downWarning = this.type.data.channel_data.down_warning;
      this.downCritical = this.type.data.channel_data.down_critical;
      this.songWarning = this.type.data.channel_data.warning_sound;
      this.songCritical = this.type.data.channel_data.critical_sound;
      this.delta = this.type.data.channel_data.is_delta;
    }
    console.log(this.type);
  }

  changeMeasure(value: any) {
    this.measure = value;
  }

  getMeasureList() {
    this.directoryService.getMeasureList().subscribe((measures: any) => {
      this.measures = measures;
    });
  }

  save(edit: boolean) {
    const data = {
      data: {
        name: this.name,
        measure: this.measure,
        channel_data: {
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
      }
    };
    if (edit) {
      this.directoryService.updateChannelType(data, this.type.id);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getChannelType.emit();
          this.changeModal.emit();
        }
      });
    } else {
      this.directoryService.createChannelType(data);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getChannelType.emit();
          this.changeModal.emit();
        }
      });
    }
  }

}
