import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APIs } from '../../../shared/Enum/helper';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { AnswerSubmissionModel } from '../model/answerDto';
import { ResultResponse } from '../model/resultDto';

@Injectable({
  providedIn: 'root',
})
export class SubmitionService {
  
  private readonly _config = environment;
  private readonly _Api=APIs.Submittion
  private readonly _baseUrl=this._config.apiUrl
  private readonly _httpClient=inject(HttpClient)
 

 

  submitExam(model:AnswerSubmissionModel):Observable<ResultResponse>{
   
    return this._httpClient.post<ResultResponse>(`${this._baseUrl}${this._Api.submitExam}`,model)
  }
  
}
