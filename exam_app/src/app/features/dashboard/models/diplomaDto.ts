export interface DiplomaDto {
  status: boolean
  code: number
  payload?: Diploma

}

export interface Diploma {
  data?: DiplomaObj[]
    diploma?:DiplomaObj
  metadata?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface DiplomaObj {
  id?: string
  title: string
  description: string
  image: string
  immutable: boolean
  createdAt: string
  updatedAt: string
   exams?: Exam[]
}







export interface Exam {
  id: string
  title: string
  description: string
  image: string
  duration: number
  createdAt: string
  questionsCount: number
}
