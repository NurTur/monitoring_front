import { Label, MultiDataSet } from 'ng2-charts';
import { EquipmentService } from 'projects/my-app/src/app/core/services/equipment.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';
import { Subscription } from 'rxjs';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'my-org-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  project: any;
  id: any;
  loader = false;
  subscription: Subscription;
  pages: any;
  editProjectModal: boolean;
  controllers: any;
  metrics: any = {};
  data: any;

  doughnutChartColors = [
    {
      borderColor: ['#17A750', '#FFBB0C', '#5977C7', '#FF0000'],
      backgroundColor: ['#17A750', '#FFBB0C', '#5977C7', '#FF0000'],
    },
  ];
  scheme = {
    domain: ['#17A750', '#FFBB0C', '#5977C7', '#FF0000']
  };
  constructor(
    private projects: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private equipmentService: EquipmentService) {
    activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      (window as any).projectService = this.projects;
    });
  }
  ngOnInit(): void {
    this.getProjectById();
    this.getPages();
    this.projects.getMetrics(this.id).subscribe((metrics: any) => {
      if (metrics) {
        this.metrics = metrics;
        this.data = [
          { name: 'Подтверждено', value: metrics.notifications.confirmed },
          { name: 'Предупреждение', value: metrics.notifications.warning },
          { name: 'Информационные', value: metrics.notifications.informative },
          { name: 'Не подтверждено', value: metrics.notifications.not_confirmed }
        ];
      }
    });
  }
  getPages() {
    setTimeout(() => {
      this.projects.pageList(this.id).subscribe((pages: any) => {
        this.pages = pages.filter((item: any) => item.parent === null).sort((a: any, b: any) => a.data.position - b.data.position);
      });
    }, 100);
  }
  getProjectById() {
    this.loader = true;
    this.subscription = this.projects.projectById(this.id).subscribe((res) => {
      this.project = res;
      this.loader = false;
    });
  }

  changePage(page: any) {
    localStorage.setItem(`project_${this.id}`, JSON.stringify(page.id));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteProject() {
    const question = confirm(`Вы уверены что хотите удалить проект ${this.project.data.name}?`);
    if (question) {
      this.projects.projectDelete(this.id).subscribe((res) => {
        this.projects.projectList()
          .subscribe((_: any[]) => {
            window.location.replace(`/projects/${_.map(_ => _.id).reverse()[0]}`);
          });
      });
    } else {
      console.log(question);
    }
  }
}
