import { Injectable } from '@angular/core';
import { Bank } from '../../general/interfaces/bank';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../general/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  url = environment.api + 'BankManagement';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<APIResponse<Bank[]>>(this.url);
  }
  getById(id: number) {
    return this.http.get<APIResponse<Bank>>(this.url + '/' + id);
  }
  delete(id: number) {
    return this.http.delete<APIResponse<any>>(this.url + '/' + id);
  }
  add(body: any, file: File) {
    const formData = new FormData();
    const params = new HttpParams().append('BanksName', body.info.banksName)
    formData.append('files', file, body.banksName + '-file',);
    return this.http.post<APIResponse<any>>(this.url, formData, { params: params });
  }
  edit(body: any, id: number, file: File | null) {
    const formData = new FormData();
    const params = new HttpParams().append('BanksName', body.info.banksName)
    if (file)
      formData.append('files', file, body.banksName + '-file',);
    return this.http.put<APIResponse<any>>(this.url + '/' + id, formData, { params: params });
  }
  async pathToFileObject(filePath: string, fileName: string) {
    try {
      // 1. Fetch the file from the path
      this.http.get(filePath).subscribe(x => {
        debugger
        console.log(x)
      })
      return null;
    } catch (error) {
      console.error('Error creating file object:', error);
      return null;
    }
  }
}
