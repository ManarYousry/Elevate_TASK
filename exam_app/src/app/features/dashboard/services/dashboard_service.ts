import { inject, Injectable } from '@angular/core';
import { APIs } from '../../../shared/Enum/helper';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiplomaDto } from '../models/diplomaDto';
import { environment } from '../../../../environments/environment';
import { FilterMap } from '../models/filterMap';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  
  private readonly _config = environment;
  private readonly _Api=APIs.Dashboard
  private readonly _baseUrl=this._config.apiUrl
  private readonly _httpClient=inject(HttpClient)
 

  getAllDiplomas(filters?: FilterMap):Observable<DiplomaDto>{
    let params = new HttpParams();
    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    }
    return this._httpClient.get<DiplomaDto>(this._baseUrl+this._Api.getAllDiplomas, { params })
  }

  getDiplomaExamByID(id:string):Observable<DiplomaDto>{
   
    return this._httpClient.get<DiplomaDto>(`${this._baseUrl}${this._Api.getDiplomaById}${id}`)
  }
  
}
