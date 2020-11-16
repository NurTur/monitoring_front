import { CustomHttp } from './../../../core/services/custom-http.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { DirectoryService } from '../../../core/services/directory.service';

@Component({
  selector: 'my-org-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.scss']
})
export class CountryModalComponent implements OnInit {

  @Input() country: any;
  @Output() changeModal = new EventEmitter<any>();
  @Output() getCountry = new EventEmitter<any>();
  name: string;
  code: string;

  constructor(
    private directoryService: DirectoryService,
    private customHttp: CustomHttp) {}

  ngOnInit() {
    if (this.country) {
      this.name = this.country.name;
      this.code = this.country.code;
    }
  }

  save(edit: boolean) {
    const data = {
      name: this.name,
      code: this.code
    };
    if (edit) {
    this.directoryService.updateCountry(data, this.country.id);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getCountry.emit();
        this.changeModal.emit();
      }
    });
   } else {
    this.directoryService.createCountry(data);
    this.customHttp.answer$.subscribe((answer: boolean) => {
      if (answer) {
        this.getCountry.emit();
        this.changeModal.emit();
      }
    });
   }
  }
}
