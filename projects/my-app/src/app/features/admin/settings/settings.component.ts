import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/services/projects.service';

@Component({
  selector: 'my-org-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
