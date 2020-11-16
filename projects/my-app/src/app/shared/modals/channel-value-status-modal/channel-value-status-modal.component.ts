import { CustomHttp } from './../../../core/services/custom-http.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DirectoryService } from '../../../core/services/directory.service';

@Component({
  selector: 'my-org-channel-value-status-modal',
  templateUrl: './channel-value-status-modal.component.html',
  styleUrls: ['./channel-value-status-modal.component.scss']
})
export class ChannelValueStatusModalComponent implements OnInit {
  @Input() cvStatus: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getChannelValueStatus = new EventEmitter<any>();
  code: string;
  description: string;
  constructor(private directoryService: DirectoryService,
              private customHttp: CustomHttp) {}

  ngOnInit() {
    if (this.cvStatus) {
      this.code = this.cvStatus.code;
      this.description = this.cvStatus.description;
    }
  }

  save(edit: boolean) {
    const data = {
      code: this.code,
      description: this.description
    };
    if (edit) {
    this.directoryService.updateChannelValueStatus(data, this.cvStatus.id);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getChannelValueStatus.emit();
        this.changeModal.emit();
      }
    });
   } else {
    this.directoryService.createChannelValueStatus(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getChannelValueStatus.emit();
        this.changeModal.emit();
      }
    });
   }
  }
}