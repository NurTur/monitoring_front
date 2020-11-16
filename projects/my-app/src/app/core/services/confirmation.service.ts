import { CustomHttp } from './custom-http.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {

  constructor(private http: CustomHttp) {}

  createConfirmation(data: any) {
    return this.http.post(`${environment.baseUrl}/confirmation/create/`, data);
  }
}
