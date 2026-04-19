import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { APIs } from '../../../shared/Enum/helper';
import { ExamQuesDTO } from '../model/exam-ques-dto';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
   
  private readonly _config = environment;
  private readonly _Api=APIs.Questions
  private readonly _baseUrl=this._config.apiUrl
  private readonly _httpClient=inject(HttpClient)
 

 

  getQuestionsByExamId(id:string):Observable<ExamQuesDTO>{
   
    return this._httpClient.get<ExamQuesDTO>(`${this._baseUrl}${this._Api.getQuestionsByExamId}${id}`)
  }
  
}
