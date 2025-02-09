import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url = environment.api + 'UNEmployeeManagment/';
  constructor(private http: HttpClient) { }
  getAll(): Observable<any> {
    return this.http.get(this.url + 'GetAll');
  }
}
