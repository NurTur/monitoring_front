import { CustomHttp } from './../../../core/services/custom-http.service';
import { EquipmentService } from 'projects/my-app/src/app/core/services/equipment.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'my-org-tag-modal',
  templateUrl: './tag-modal.component.html',
  styleUrls: ['./tag-modal.component.scss']
})
export class TagModalComponent implements OnInit {
  @Output() changeModal = new EventEmitter<any>();
  @Output() getTags = new EventEmitter<any>();
  @Input() tag: any;
  @Input() channels: any;
  formula: string;
  sqlProc: string;
  isFormulaValue = true;
  isSqlValue = true;
  channel: any;
  code: any;
  constructor(private equipmentService: EquipmentService,
              private customHttp: CustomHttp) { }

  ngOnInit() {
    console.log(this.tag);
    if (this.tag) {
      this.code = this.tag.data.code;
      this.channel = this.tag.channel.id;
      this.formula = this.tag.data.formula;
      this.sqlProc = this.tag.data.sql_proc;
    }
  }
  changeValue(value?: string){
    if (value === 'formula'){
      this.isFormulaValue = false;
      this.isSqlValue = true;
    } else if (value === 'sql') {
      this.isFormulaValue = true;
      this.isSqlValue = false;
    } else {
      this.isFormulaValue = true;
      this.isSqlValue = true;
    }
  }
  changeChannel(value: any) {
    this.channel = value;
  }
  save(edit: boolean) {
    const data = {
      channel: this.channel,
      data: {
        status: 'ACTIVE',
        code: this.code,
        formula: this.formula,
        sql_proc: this.sqlProc,
      }
    };
    if (edit) {
      this.equipmentService.updateTag(data, this.tag.id);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getTags.emit();
          this.changeModal.emit();
        }
      });
    } else {
      this.equipmentService.createTag(data);
      this.customHttp.answer$.subscribe((answer: boolean) => {
        if (answer) {
          this.getTags.emit();
          this.changeModal.emit();
        }
      });
    }
  }
}
