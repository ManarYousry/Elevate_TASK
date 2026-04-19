import { Injectable, signal } from '@angular/core';

export interface QuizMetadata {
  diplomaTitle: string;
  diplomaId: string;
  examTitle: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuizStoreService {
  private quizMetadata = signal<QuizMetadata | null>(null);

  setQuizMetadata(metadata: QuizMetadata) {
    this.quizMetadata.set(metadata);
  }

  getQuizMetadata() {
    return this.quizMetadata();
  }
}
