export interface AnswerSubmissionModel {
  examId: string
  answers: Answer[]
  startedAt: string
}

export interface Answer {
  questionId: string
  answerId: string
}