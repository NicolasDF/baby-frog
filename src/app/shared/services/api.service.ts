import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomEncoder } from '../../../../../ADL-Frontend/src/app/core/models/custom-encoder';
import { Data } from '../../../../../ADL-Frontend/src/app/core/models/data';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private defaultRequestOptions: Data = {
    observe: 'body'
  };

  headers: Data = {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: 'Sat, 01 Jan 2000 00:00:00 GMT'
  };

  constructor(
    private http: HttpClient
  ) { }

  request<T>(method: string, url: string, httpOptions: Data): Observable<T> {
    return this.http.request<T>(method, url, this.createRequestOptions(httpOptions));
  }

  get<T>(url: string, params: Data = { }, httpOptions: Data = { }): Observable<T> {
    httpOptions.params = new HttpParams({ encoder: new CustomEncoder(), fromObject: params });
    httpOptions.headers = this.headers;
    return this.request<T>('GET', url, httpOptions);
  }

  post<T>(url: string, data: Data = { }, httpOptions: Data = { }): Observable<T> {
    httpOptions.body = data;
    httpOptions.headers = this.headers;
    return this.request<T>('POST', url, httpOptions);
  }

  put<T>(url: string, data: Data = { }, httpOptions: Data = { }): Observable<T> {
    httpOptions.body = data;
    httpOptions.headers = this.headers;
    return this.request<T>('PUT', url, httpOptions);
  }

  delete<T>(url: string, data: Data = { }, httpOptions: Data = { }): Observable<T> {
    httpOptions.body = data;
    httpOptions.headers = this.headers;
    return this.request<T>('DELETE', url, httpOptions);
  }

  private createRequestOptions(httpOptions: Data): Data {
    return Object.assign({ }, this.defaultRequestOptions, httpOptions);
  }

}
