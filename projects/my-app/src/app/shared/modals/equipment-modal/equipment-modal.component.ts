import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-org-equipment-modal',
  templateUrl: './equipment-modal.component.html',
  styleUrls: ['./equipment-modal.component.scss']
})
export class EquipmentModalComponent implements OnInit {

  @Output() changeModal = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  close() {
    this.changeModal.emit();
  }
}
