import { CustomHttp } from './../../../core/services/custom-http.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { EquipmentService } from '../../../core/services/equipment.service';
import { ProjectsService } from '../../../core/services/projects.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'my-org-sensor-modal',
  templateUrl: './sensor-modal.component.html',
  styleUrls: ['./sensor-modal.component.scss']
})
export class SensorModalComponent implements OnInit {
  @Input() sensor: any;
  @Input() listProject: any;
  @Input() projectName: any;
  @Input() sensorModels: any;
  @Input() sensors: any;
  @Input() states: any;
  @Input() controllers: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getSensors = new EventEmitter<any>();

  form: FormGroup;
  name: string;
  selectedProject: any;
  status: any;
  serialNumber: any;
  projectNumber: any;
  selectedModel: any;
  selectController: any;
  modelData: any;
  imageSrc: any;
  koefficient: any;
  doc: any;
  imgModel: any;
  select = 0;
  constructor(
    private equipmentService: EquipmentService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private projects: ProjectsService,
    private customHttp: CustomHttp) {
      activatedRoute.paramMap.subscribe((params) => {
        this.selectedProject = params.get('id');
      });
      this.createForm();
     }

  ngOnInit() {
    if (this.sensor) {
      this.name = this.sensor.name;
      this.status = this.sensor.state.id;
      this.serialNumber = this.sensor.data.serial_number;
      this.projectNumber = this.sensor.data.project_number;
      this.selectedModel = this.sensor.model.id;
      this.selectController = this.sensor.controller.id;
      this.imageSrc = this.sensor.data.foto;
      this.koefficient = this.sensor.koefficient;
      this.doc = this.sensor.model.data.docs;
      this.imgModel = this.sensor.model.data.img;
    } else {
      this.selectController = this.sensors[0].controller.id;
      this.status = this.states[0].id;
      this.selectedModel = this.sensors[0].model.id;
      this.doc = this.sensors[0].model.data.docs;
      this.imgModel = this.sensors[0].model.data.img;
    }
  }
  createForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
    });
  }
  downloadFile(file: string, type: string) {
    const ras = file.split('.')[3];
    fileSaver.saveAs(file, `${type}-model.${ras}`);
  }

  deletePhoto() {
    this.imageSrc = '';
  }
  changePhoto(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const data = this.form.get('file') || { setValue: () => {} };
      data.setValue(file);
      this.onSubmitf();
    }
  }
  onSubmitf() {
    const formModel = this.prepareSave();
    this.projects.uploadImage(formModel).subscribe((res: any) => {
      this.imageSrc = res.file;
    });
  }

  private prepareSave(): any {
    const input = new FormData();
    const data = this.form.get('file') || { value: null };
    input.append('file', data.value);
    return input;
  }
  changeStatus(status: string) {
    this.status = status;
  }

  changeController(controller: any) {
    this.selectController = controller;
  }
  changeProject(value: any) {
    this.selectedProject = value;
  }
  changeModel(value: any) {
    this.selectedModel = value;
    this.modelData = this.sensorModels.find((x: any) => x.id === Number(value));
    this.doc = this.modelData.data.doc;
    this.imgModel = this.modelData.data.img;
  }
  save() {
    const data = {
      project: Number(this.selectedProject),
      name: this.name,
      data: {
        serial_number: this.serialNumber,
        project_number: this.projectNumber,
        foto: this.imageSrc
      },
      state: this.status,
      koefficient: this.koefficient,
      controller: this.selectController,
      model: this.selectedModel,
      id: this.sensor.id
    };
    this.equipmentService.updateSensor(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getSensors.emit();
        this.changeModal.emit();
      }
    });
  }
  onSubmit() {
    const data = {
      project: Number(this.selectedProject),
      name: this.name,
      data: {
        status: this.status,
        serial_number: this.serialNumber,
        project_number: this.projectNumber,
        foto: this.imageSrc
      },
      state: this.status,
      koefficient: this.koefficient,
      model: this.selectedModel,
      controller: this.selectController
    };
    this.equipmentService.createSensor(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getSensors.emit();
        this.changeModal.emit();
      }
    });
  }
}
