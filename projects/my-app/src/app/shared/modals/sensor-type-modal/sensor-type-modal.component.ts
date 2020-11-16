import { CustomHttp } from './../../../core/services/custom-http.service';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DirectoryService } from '../../../core/services/directory.service';

@Component({
  selector: 'my-org-sensor-type-modal',
  templateUrl: './sensor-type-modal.component.html',
  styleUrls: ['./sensor-type-modal.component.scss']
})
export class SensorTypeModalComponent implements OnInit {

  @Input() sensor: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getSensorType = new EventEmitter<any>();

  name: string;
  params: string;
  imageSrc: any;
  normal: any;
  warning: any;
  critical: any;
  noData: any;
  form: FormGroup;
  constructor(
    private directoryService: DirectoryService,
    private projects: ProjectsService,
    private fb: FormBuilder,
    private customHttp: CustomHttp) {
    this.createForm();
  }

  ngOnInit() {
    if (this.sensor) {
      this.name = this.sensor.data.name;
      this.params = this.sensor.data.params;
      this.imageSrc = this.sensor.data.img;
      this.normal = this.sensor.data.normal_state_icon;
      this.warning = this.sensor.data.warning_state_icon;
      this.critical = this.sensor.data.critical_state_icon;
      this.noData = this.sensor.data.no_data_icon;
    }
  }
  createForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
    });
  }
  changePhoto(event: any, type: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const data = this.form.get('file') || { setValue: () => {} };
      data.setValue(file);
      this.onSubmitf(type);
    }
  }

  deletePhoto(type: string) {
    if (type === 'img') {
      this.imageSrc = '';
    } else if (type === 'normal') {
      this.normal = '';
    } else if (type === 'warning') {
      this.warning = '';
    } else if (type === 'critical') {
      this.critical = '';
    } else if (type === 'no_data') {
      this.noData = '';
    }
  }

  onSubmitf(type: string) {
    const formModel = this.prepareSave();
    this.projects.uploadImage(formModel).subscribe((res: any) => {
      if (type === 'img') {
        this.imageSrc = res.file;
      } else if (type === 'normal') {
        this.normal = res.file;
      } else if (type === 'warning') {
        this.warning = res.file;
      } else if (type === 'critical') {
        this.critical = res.file;
      } else if (type === 'no_data') {
        this.noData = res.file;
      }
    });
  }

  private prepareSave(): any {
    const input = new FormData();
    const data = this.form.get('file') || { value: null };
    input.append('file', data.value);
    return input;
  }
  save(edit: boolean) {
    const data = {
      data: {
        name: this.name,
        params: this.params,
        img: this.imageSrc,
        normal_state_icon: this.normal,
        warning_state_icon: this.warning,
        critical_state_icon: this.critical,
        no_data_icon: this.noData
      }
    };
    if (edit) {
    this.directoryService.updateSensorType(data, this.sensor.id);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getSensorType.emit();
        this.changeModal.emit();
      }
    });
   } else {
    this.directoryService.createSensorType(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getSensorType.emit();
        this.changeModal.emit();
      }
    });
   }
  }

}
