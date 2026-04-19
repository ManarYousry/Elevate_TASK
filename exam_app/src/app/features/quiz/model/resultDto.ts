export interface ResultResponse {
  status: boolean;
  code: number;
  payload: ResultDto;
}

export interface ResultDto {
  submission: Submission
  analytics: Analytic[]
}

export interface Submission {
  id: string
  examId: string
  examTitle: string
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  startedAt: string
  submittedAt: string
}

export interface Analytic {
  questionId: string
  questionText: string
  selectedAnswer: SelectedAnswer
  isCorrect: boolean
  correctAnswer: CorrectAnswer
}

export interface SelectedAnswer {
  id: string;
  text: string;
}

export interface CorrectAnswer {
  id: string;
  text: string;
}