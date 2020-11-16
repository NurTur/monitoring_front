import { LoaderService } from './../../../core/services/loader.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-org-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  view: boolean;
  constructor(private loader: LoaderService) { }

  ngOnInit(): void {
    this.loader.view$.subscribe((view: boolean) => {
      this.view = view;
    });
  }

}
