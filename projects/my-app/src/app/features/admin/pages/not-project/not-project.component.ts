import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-org-not-project',
  templateUrl: './not-project.component.html',
  styleUrls: ['./not-project.component.scss']
})
export class NotProjectComponent implements OnInit {
  createProject: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
