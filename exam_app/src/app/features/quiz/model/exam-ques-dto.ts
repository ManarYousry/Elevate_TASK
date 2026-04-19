import { DiplomaObj, Exam } from "../../dashboard/models/diplomaDto"

export interface ExamQuesDTO {
  status: boolean
  code: number
  payload: Payload
}

export interface Payload {
  questions: Question[]
  diploma: DiplomaObj
  exam: Exam
}

export interface Question {
  id: string
  text: string
  examId: string
  immutable: boolean
  createdAt: string
  updatedAt: string
  answers: Answer[]
}

export interface Answer {
  id: string
  text: string
}
