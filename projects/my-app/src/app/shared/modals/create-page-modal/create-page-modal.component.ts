import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-org-create-page-modal',
  templateUrl: './create-page-modal.component.html',
  styleUrls: ['./create-page-modal.component.scss']
})
export class CreatePageModalComponent implements OnInit {
  @Input() editPage: any;
  @Input() imageSrc: any;
  @Input() pageName: any;
  @Output() updatePage = new EventEmitter<any>();
  @Output() createPage = new EventEmitter<any>();
  @Output() fileChange = new EventEmitter<any>();
  @Output() changePageName = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  create() {
    this.changePageName.emit(this.pageName);
    this.createPage.emit();
  }
  update() {
    this.changePageName.emit(this.pageName);
    this.updatePage.emit();
  }

}
