import { CustomHttp } from './../../../core/services/custom-http.service';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DirectoryService } from '../../../core/services/directory.service';

@Component({
  selector: 'my-org-sensor-model-modal',
  templateUrl: './sensor-model-modal.component.html',
  styleUrls: ['./sensor-model-modal.component.scss']
})
export class SensorModelModalComponent implements OnInit {

  @Input() sModel: any;
  @Input() manufacturers: any;
  @Input() sensorType: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getSensorModel = new EventEmitter<any>();
  model: string;
  manufacturer: string;
  imageSrc: any;
  type: any;
  docs: any;
  form: FormGroup;
  constructor(
    private directoryService: DirectoryService,
    private projects: ProjectsService,
    private fb: FormBuilder,
    private customHttp: CustomHttp) {
    this.createForm();
  }

  ngOnInit() {
    if (this.sModel) {
      this.model = this.sModel.data.name;
      this.manufacturer = this.sModel.manufacturer.id;
      this.imageSrc = this.sModel.data.img;
      this.docs = this.sModel.data.docs;
      this.type = this.sModel.type.id;
      console.log(this.sensorType);
    } else {
      this.manufacturer = this.manufacturers[0].id;
      this.type = this.sensorType[0].id;
    }
  }
  createForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
    });
  }
  deletePhoto() {
    this.imageSrc = '';
  }

  changePhoto(event: any, type: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const data = this.form.get('file') || { setValue: () => {} };
      data.setValue(file);
      this.onSubmitf(type);
    }
  }
  onSubmitf(type: string) {
    const formModel = this.prepareSave();
    this.projects.uploadImage(formModel).subscribe((res: any) => {
      if (type === 'img') {
        this.imageSrc = res.file;
      } else {
        this.docs = res.file;
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
        name: this.model,
        docs: this.docs,
        img: this.imageSrc
      },
      type: this.type,
      manufacturer: this.manufacturer
    };
    if (edit) {
    this.directoryService.updateSensorModel(data, this.sModel.id);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getSensorModel.emit();
        this.changeModal.emit();
      }
    });
   } else {
    this.directoryService.createSensorModel(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getSensorModel.emit();
        this.changeModal.emit();
      }
    });
   }
  }


}
