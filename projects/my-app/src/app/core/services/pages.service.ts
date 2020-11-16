import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProjectsService } from './projects.service';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  selectedPage$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  pages$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor(private router: Router, public projects: ProjectsService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const arr = val.url.split('/');
        projects.pageList(Number(arr[arr.length - 1])).subscribe((res: any) => {
          this.pages$.next(res);
          const pages = res.filter((item: any) => item.parent === null).sort((a: any, b: any) => a.data.position - b.data.position);
          const getPage = JSON.parse(localStorage.getItem(`project_${Number(arr[arr.length - 1])}`) as string);
          if (getPage) {
            this.selectedPage$.next(res.find((page: any) => page.id === getPage));
          } else {
            this.selectedPage$.next(pages[0]);
          }
        });
      }
    });
  }
  setPage(item: any) {
    this.selectedPage$.next(item);
  }
}
