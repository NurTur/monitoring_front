import { CustomHttp } from './../../../core/services/custom-http.service';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DirectoryService } from '../../../core/services/directory.service';

@Component({
  selector: 'my-org-controller-model-modal',
  templateUrl: './controller-model-modal.component.html',
  styleUrls: ['./controller-model-modal.component.scss']
})
export class ControllerModelModalComponent implements OnInit {

  @Input() cModel: any;
  @Input() manufacturers: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getControllerModel = new EventEmitter<any>();
  model: string;
  manufacturer: string;
  imageSrc: any;
  type: any;
  docs: any;
  form: FormGroup;
  types: string[];
  normal: any;
  warning: any;
  critical: any;
  noData: any;
  constructor(
    private directoryService: DirectoryService,
    private projects: ProjectsService,
    private fb: FormBuilder,
    private customHttp: CustomHttp) {
    this.createForm();
  }

  ngOnInit() {
    if (this.cModel) {
      this.model = this.cModel.data.name;
      this.manufacturer = this.cModel.manufacturer.id;
      this.imageSrc = this.cModel.data.img;
      this.docs = this.cModel.data.doc;
      this.type = this.cModel.data.type;
      this.normal = this.cModel.data.normal_state_icon;
      this.warning = this.cModel.data.warning_state_icon;
      this.critical = this.cModel.data.critical_state_icon;
      this.noData = this.cModel.data.no_data_icon;
    } else {
      this.manufacturer = this.manufacturers[0].id;
    }
  }
  createForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
    });
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
      } else {
        this.docs = res.file;
      }
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
        doc: this.docs,
        img: this.imageSrc,
        type: this.type,
        normal_state_icon: this.normal,
        warning_state_icon: this.warning,
        critical_state_icon: this.critical,
        no_data_icon: this.noData
      },
      manufacturer: this.manufacturer
    };
    if (edit) {
    this.directoryService.updateControllerModel(data, this.cModel.id);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getControllerModel.emit();
        this.changeModal.emit();
      }
    });
   } else {
    this.directoryService.createControllerModel(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getControllerModel.emit();
        this.changeModal.emit();
      }
    });
   }
  }

}
