import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DirectoryService } from '../../../core/services/directory.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'my-org-directory-tabel',
  templateUrl: './directory-tabel.component.html',
  styleUrls: ['./directory-tabel.component.scss']
})
export class DirectoryTabelComponent implements OnInit {
  @Input() channel: any;
  @Input() sensor: any;
  @Input() sModel: any;
  @Input() sModelsAll: any;
  @Input() cModel: any;
  @Input() cModelsAll: any;
  @Input() sStatus: any;
  @Input() cStatus: any;
  @Input() cvStatus: any;
  @Input() manufacturers: any;
  @Input() manufacturer: any;
  @Input() sensorType: any;
  @Input() countries: any;
  @Input() country: any;

  @Output() getChannelType = new EventEmitter<any>();
  @Output() getSensorType = new EventEmitter<any>();
  @Output() getSensorModel = new EventEmitter<any>();
  @Output() getControllerModel = new EventEmitter<any>();
  @Output() getControllerStatus = new EventEmitter<any>();
  @Output() getSensorStatus = new EventEmitter<any>();
  @Output() getChannelValueStatus = new EventEmitter<any>();
  @Output() getManufacturer = new EventEmitter<any>();
  @Output() getCountry = new EventEmitter<any>();
  modal: boolean;
  countriesData: any;
  constructor(private directoryService: DirectoryService) { }

  ngOnInit() {
    if (this.manufacturer) {
      this.countriesData = this.countries.find((x: any) => x.id === Number(this.manufacturer.country));
    }
  }
  downloadFile(file: string, type: string) {
    const ras = file.split('.')[3];
    fileSaver.saveAs(file, `${type}-model.${ras}`);
  }
  removeChannelType(id: number) {
    const question = confirm('Удалить тип?');
    if (question) {
      this.directoryService.removeChannelType(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getChannelType.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeSensorType(id: number) {
    const question = confirm('Удалить тип датчика?');
    if (question) {
      this.directoryService.removeSensorType(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getSensorType.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeSensorModel(id: number) {
    const question = confirm('Удалить модель датчика?');
    if (question) {
      this.directoryService.removeSensorModel(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getSensorModel.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeControllerModel(id: number) {
    const question = confirm('Удалить модель контроллера?');
    if (question) {
      this.directoryService.removeControllerModel(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getControllerModel.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeSensorStatus(id: number) {
    const question = confirm('Удалить статус датчика?');
    if (question) {
      this.directoryService.removeSensorStatus(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getSensorStatus.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeControllerStatus(id: number) {
    const question = confirm('Удалить статус контроллера?');
    if (question) {
      this.directoryService.removeControllerStatus(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getControllerStatus.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeChannelValueStatus(id: number) {
    const question = confirm('Удалить статус измерительного канала?');
    if (question) {
      this.directoryService.removeChannelValueStatus(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getChannelValueStatus.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeManufacturer(id: number) {
    const question = confirm('Удалить производителя?');
    if (question) {
      this.directoryService.removeManufacturer(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getManufacturer.emit();
      });
    } else {
      console.log(question);
    }
  }
  removeCountry(id: number) {
    const question = confirm('Удалить страну?');
    if (question) {
      this.directoryService.removeCountry(id)
      .subscribe((res: any) => {
        console.log(res);
        this.getCountry.emit();
      });
    } else {
      console.log(question);
    }
  }
  changeModal() {
    this.modal = !this.modal;
  }
}
