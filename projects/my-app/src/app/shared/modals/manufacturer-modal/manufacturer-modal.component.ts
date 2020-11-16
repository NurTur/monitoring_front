import { CustomHttp } from './../../../core/services/custom-http.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DirectoryService } from '../../../core/services/directory.service';

@Component({
  selector: 'my-org-manufacturer-modal',
  templateUrl: './manufacturer-modal.component.html',
  styleUrls: ['./manufacturer-modal.component.scss']
})
export class ManufacturerModalComponent implements OnInit {
  @Input() manufacturer: any;
  @Input() countries: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getManufacturer = new EventEmitter<any>();
  name: string;
  country: any;
  email: string;
  logo: string;
  note: string;
  website: any;
  form: FormGroup;
  constructor(
    private directoryService: DirectoryService,
    private projects: ProjectsService,
    private fb: FormBuilder,
    private customHttp: CustomHttp) {
      this.createForm();
    }

  ngOnInit() {
    if (this.manufacturer) {
      this.name = this.manufacturer.name;
      this.country = this.manufacturer.country;
      this.email = this.manufacturer.email;
      this.logo = this.manufacturer.logo;
      this.note = this.manufacturer.note;
      this.website = this.manufacturer.website;
    }
    console.log(this.countries);
  }
  createForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
    });
  }
  deletePhoto() {
    this.logo = '';
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
      this.logo = res.file;
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
      name: this.name,
      country: this.country,
      email: this.email,
      logo: this.logo,
      note: this.note,
      website: this.website,
    };
    if (edit) {
    this.directoryService.updateManufacturer(data, this.manufacturer.id);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getManufacturer.emit();
        this.changeModal.emit();
      }
    });
   } else {
    this.directoryService.createManufacturer(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getManufacturer.emit();
        this.changeModal.emit();
      }
    });
   }
  }
}
