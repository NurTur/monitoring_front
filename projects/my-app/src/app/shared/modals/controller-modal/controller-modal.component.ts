import { CustomHttp } from './../../../core/services/custom-http.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EquipmentService } from '../../../core/services/equipment.service';
import { ProjectsService } from '../../../core/services/projects.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'my-org-controller-modal',
  templateUrl: './controller-modal.component.html',
  styleUrls: ['./controller-modal.component.scss']
})
export class ControllerModalComponent implements OnInit {
  @Input() controller: any;
  @Input() listProject: any;
  @Input() projectName: any;
  @Input() models: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getControllerList = new EventEmitter<any>();

  form: FormGroup;
  name: string;
  selectedProject: any;
  status = 'ACTIVE';
  serialNumber: any;
  sensors: any;
  selectedModel: any;
  modelData: any;
  imageSrc: any;
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
    if (this.controller) {
      this.getSensorList();
      this.name = this.controller.data.name;
      this.status = this.controller.data.status;
      this.serialNumber = this.controller.data.serial_number;
      this.selectedModel = this.controller.model;
      this.imageSrc = this.controller.data.foto;
      this.modelData = this.models.find((x: any) => x.id === Number(this.selectedModel));
    } else {
      this.modelData = this.models[0];
      this.selectedModel = this.models[0].id;
      this.status = 'ACTIVE';
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

  getSensorList() {
    this.equipmentService.getSensorList(this.controller.id).subscribe((sensors: any) => {
      this.sensors = sensors;
    });
  }
  deletePhoto() {
    this.imageSrc = '';
  }
  changePhoto(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const data = this.form.get('file') || { setValue: () => {} };
      data.setValue(file);
      console.log(file);
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
  changeProject(value: any) {
    this.selectedProject = value;
  }
  changeModel(value: any) {
    this.selectedModel = value;
    this.modelData = this.models.find((x: any) => x.id === Number(value));
  }
  save() {
    const data = {
      project: Number(this.selectedProject),
      data: {
        name: this.name,
        status: this.status,
        serial_number: this.serialNumber,
        foto: this.imageSrc
      },
      model: this.selectedModel,
      id: this.controller.id
    };
    this.equipmentService.updateController(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getControllerList.emit();
        this.changeModal.emit();
      }
    });
  }
  onSubmit() {
    const data = {
      project: Number(this.selectedProject),
      data: {
        name: this.name,
        status: this.status,
        serial_number: this.serialNumber,
        foto: this.imageSrc
      },
      model: this.selectedModel,
    };
    this.equipmentService.createController(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getControllerList.emit();
        this.changeModal.emit();
      }
    });
  }
}
