import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  view$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  count = 0;
  constructor(){}
  show(view: boolean) {
    if (view === true) {
      this.count += 1;
    } else {
      this.count -= 1;
    }
    this.view$.next(this.count > 0);
  }
}
