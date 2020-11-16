import { LoaderService } from './loader.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomHttp {
  answer$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  constructor(private http: HttpClient, private loader: LoaderService){}

  post(url: string, data: any) {
    return this.http.post(url, data).subscribe(
      (response: any) => {
        this.answer$.next(true);
        this.answer$.next(false);
        return response;
      }, (error: any) => {
        this.answer$.next(false);
        this.handleError(error);
        return error;
    });
  }
  put(url: string, data: any) {
    return this.http.put(url, data).subscribe(
      (response: any) => {
        this.answer$.next(true);
        this.answer$.next(false);
        return response;
      }, (error: any) => {
        this.answer$.next(false);
        this.handleError(error);
        return error;
    });
  }

  get(url: string) {
    this.loader.show(true);
    const answer$ = new BehaviorSubject<any>(null);
    this.http.get(url).subscribe(
      (response: any) => {
        answer$.next(response);
        this.loader.show(false);
        return response;
      }, (error: any) => {
        answer$.next(error);
        this.handleError(error);
        this.loader.show(false);
        return error;
    });
    return answer$;
  }
  delete(url: string) {
    this.loader.show(true);
    const answer$ = new BehaviorSubject<any>(null);
    this.http.delete(url).subscribe(
      (response: any) => {
        answer$.next(response);
        this.loader.show(false);
        return response;
      }, (error: any) => {
        answer$.next(error);
        this.handleError(error);
        this.loader.show(false);
        return error;
    });
    return answer$;
  }

  handleError(error: any) {
    const errorMesages: any = [];
    Object.keys(error.error).forEach((e: any) => {
      const message  = error.error[e][0];
      const finalMessage = `${e} : ${message}`;
      errorMesages.push(finalMessage);
    });
    if (error.error.type === 'error') {
      alert('Ошибка сервера, проверьте соединение!');
    } else {
      if (Object.prototype.toString.call(error.error) === '[object Array]') {
        alert(error.error[0]);
      } else if (error.status === 403) {
        alert(JSON.stringify(error.error).replace(/[{()}]/g, ''));
      } else {
        alert(errorMesages.join('\r\n'));
      }
    }
  }
}
