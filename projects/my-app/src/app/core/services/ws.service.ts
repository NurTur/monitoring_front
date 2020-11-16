import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WSService {
  ws: WebSocketSubject<any>;
  socket: any;
  private data = {
    project: new Subject<any>(),
  };
  constructor() {}

  connect(id: any) {
    this.ws = webSocket(environment.wsUrl + 'project' + id);
    this.socket = this.ws.subscribe({
      next: (data) => {
        this.data.project.next(data);
        console.log('socket data', data);
      },
      error: (err) => {
        console.log('socket error', err);
      },
      complete: () => {},
    });
  }

  reject(id: any) {
    this.socket.unsubscribe();
    this.ws.complete();
  }

  public getData(): Observable<any> {
    return this.data.project.asObservable();
  }
}
