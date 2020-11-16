import { CustomHttp } from './../../../core/services/custom-http.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DirectoryService } from '../../../core/services/directory.service';

@Component({
  selector: 'my-org-controller-status-modal',
  templateUrl: './controller-status-modal.component.html',
  styleUrls: ['./controller-status-modal.component.scss']
})
export class ControllerStatusModalComponent implements OnInit {

  @Input() cStatus: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getControllerStatus = new EventEmitter<any>();
  code: string;
  description: string;
  constructor(private directoryService: DirectoryService,
              private customHttp: CustomHttp) {}

  ngOnInit() {
    if (this.cStatus) {
      this.code = this.cStatus.code;
      this.description = this.cStatus.description;
    }
  }

  save(edit: boolean) {
    const data = {
      code: this.code,
      description: this.description
    };
    if (edit) {
    this.directoryService.updateControllerStatus(data, this.cStatus.id);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getControllerStatus.emit();
        this.changeModal.emit();
      }
    });
   } else {
    this.directoryService.createControllerStatus(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getControllerStatus.emit();
        this.changeModal.emit();
      }
    });
   }
  }
}
