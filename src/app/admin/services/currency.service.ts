import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { COO } from '../../general/interfaces/coo';
import { APIResponse } from '../../general/interfaces/response';
import { Currency } from '../../general/interfaces/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  url = environment.api + 'CurrencyManagment';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Currency[]>>(this.url);
  }
}
