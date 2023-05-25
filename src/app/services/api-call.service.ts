import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  httpOptions: any = {};
  constructor(private _httpClient: HttpClient, private authenticationService: AuthenticationService) {
    const currentUser: any = this.authenticationService.currentUserValue;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${JSON.parse(currentUser)}`
    })
    this.httpOptions = {
      headers: headers,
    };
  }
  getToken() {
    const currentUser: any = this.authenticationService.currentUserValue;
    const tokenLocal: any = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${JSON.parse(tokenLocal)}`
    })
    this.httpOptions = {
      headers: headers,
    };
    return this.httpOptions;
  }
  getFrameworkDetails() {
	this.getToken();
    return this._httpClient.get<any>(`${environment.apiRoot}/framework`, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }  
  getFrameworkConfigurationDetails() {
	this.getToken();
    return this._httpClient.get<any>(`${environment.apiRoot}/framework/configuration`, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  getControlLibraryDomainDetails(id: any) {
    this.getToken()
    return this._httpClient.get<any>(`${environment.apiRoot}/controlLibraryDomain?id=` + id, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  getControlLibraryChapterDetails(framework_id: any, domain_id: any) {
    this.getToken()
    return this._httpClient.get<any>(`${environment.apiRoot}/controlLibraryChapter?framework_id=` + framework_id + '&domain_id=' + domain_id, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  getControlLibraryDetails(chapter_id: any, domain_id: any) {
    this.getToken()
    return this._httpClient.get<any>(`${environment.apiRoot}/controlLibraryControl?chapter_id=` + chapter_id + '&domain_id=' + domain_id, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  getControlLibraryActionDetails(chapter_id: any, domain_id: any, control_id: any) {
    this.getToken()
    return this._httpClient.get<any>(`${environment.apiRoot}/controlLibraryAction?domainId=` + domain_id + '&chapterId=' + chapter_id + '&controlId=' + control_id, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  getDashboardDetails() {
    this.getToken()
    return this._httpClient.get<any>(`${environment.apiRoot}/dashboard`, this.getToken()).pipe(
      map(response => {
        return response;
      })
    );
  }
  getDashboardDetailsAggregated() {
    this.getToken()
    return this._httpClient.get<any>(`${environment.apiRoot}/dashboard/aggregated`, this.getToken()).pipe(
      map(response => {
        return response;
      })
    );
  }
  searchUser(body: any) {
    this.getToken()
    return this._httpClient.post<any>(`${environment.apiRoot}/user/search`, body, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  assignControlLibraryAction(body: any) {
    this.getToken()
    return this._httpClient.post<any>(`${environment.apiRoot}/operationalActivity/create`, body, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  updateControlLibraryAction(body: any) {
    this.getToken()
    return this._httpClient.put<any>(`${environment.apiRoot}/controlLibraryAction/update`, body, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  getOperationalActivity(id: any, is_control_library: boolean = false) {
    this.getToken()
    return this._httpClient.get<any>(`${environment.apiRoot}/operationalActivity?id=` + id + '&is_control_library=' +is_control_library, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  updateComments(body: any) {
    this.getToken()
    return this._httpClient.post<any>(`${environment.apiRoot}/operationalActivity/comment/update`, body, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  uploadEvidence(data: any) {
    this.getToken()
    return this._httpClient.post<any>(`${environment.apiRoot}/operationalActivity/evidence/add`, data, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    )
  }
  updateControlLibraryControl(body: any) {
    this.getToken()
    return this._httpClient.put<any>(`${environment.apiRoot}/controlLibraryControl/update`, body, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
  updateActivityDetailsState(body: any) {
    this.getToken()
    return this._httpClient.put<any>(`${environment.apiRoot}/operationalActivity/update`, body, this.httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }
}
