import { CustomHttp } from './../../../core/services/custom-http.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DirectoryService } from '../../../core/services/directory.service';

@Component({
  selector: 'my-org-sensor-status-modal',
  templateUrl: './sensor-status-modal.component.html',
  styleUrls: ['./sensor-status-modal.component.scss']
})
export class SensorStatusModalComponent implements OnInit {
  @Input() sStatus: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getSensorStatus = new EventEmitter<any>();
  code: string;
  description: string;
  constructor(private directoryService: DirectoryService,
              private customHttp: CustomHttp) {}

  ngOnInit() {
    if (this.sStatus) {
      this.code = this.sStatus.code;
      this.description = this.sStatus.description;
    }
  }

  save(edit: boolean) {
    const data = {
      code: this.code,
      description: this.description
    };
    if (edit) {
    this.directoryService.updateSensorStatus(data, this.sStatus.id);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getSensorStatus.emit();
        this.changeModal.emit();
      }
    });
   } else {
    this.directoryService.createSensorStatus(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getSensorStatus.emit();
        this.changeModal.emit();
      }
    });
   }
  }
}
