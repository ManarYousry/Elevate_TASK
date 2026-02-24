import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry, shareReplay, throwError } from 'rxjs';
export interface Issue {
 
  id?: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  email: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private api = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getIssues() {
    return this.http.get<Issue[]>(`${this.api}/posts`).pipe(
      retry(1),
      map(posts => posts.slice(0, 50)),
      shareReplay(1),
      catchError(err => throwError(() => err))
    );
  }

  getIssue(id: number) {
    return this.http.get<Issue>(`${this.api}/posts/${id}`).pipe(retry(1));
  }

  getComments(id: number) {
    return this.http.get<Comment[]>(`${this.api}/posts/${id}/comments`).pipe(retry(1));
  }

  createIssue(payload: Issue) {
    return this.http.post<Issue>(`${this.api}/posts`, payload);
  }
}
