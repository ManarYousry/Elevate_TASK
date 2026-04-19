import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';
import { ExamListItemComponent } from './exam-list-item/exam-list-item';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '../dashboard/services/dashboard_service';
import { Exam } from '../dashboard/models/diplomaDto';
import { QuizStoreService } from '../quiz/services/quiz-store';
@Component({
  selector: 'app-exams-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BreadcrumbComponent, ExamListItemComponent, RouterModule],
  template: `
    <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>

    <app-page-header [title]="title" icon="pi pi-list" [url]="'/dashboard'"></app-page-header>
    
    <div class="space-y-4 pb-12">
      <app-exam-list-item *ngFor="let exam of exams"
                          [title]="exam.title"
                          [questionsCount]="exam.questionsCount"
                          [duration]="exam.duration"
                          [icon]="exam.image"
                          [id]="exam.id"
                          (click)="onStartExam(exam)"
                          class="cursor-pointer">
      </app-exam-list-item>
      
      <div class="text-center pt-8">
        <p class="text-gray-400 font-bold text-sm uppercase tracking-[0.2em]">End of List</p>
      </div>
    </div>
  `
})
export class ExamsListComponent implements OnInit {
  private diplomaId: string = "";
  private $destroyRef = inject(DestroyRef)
  private dashboardService = inject(DashboardService);
  private quizStoreService = inject(QuizStoreService);
  private router = inject(Router);

  title: string = '';
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Diplomas', url: '/dashboard' },
    { label: '' }
  ];

  exams:Exam[] = []

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.diplomaId = id as string;
      this.loadDiplomaExams();
    }
  }

  loadDiplomaExams() {
    this.dashboardService.getDiplomaExamByID(this.diplomaId).pipe(takeUntilDestroyed(this.$destroyRef)).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.exams = response.payload.diploma.exams;
          this.title = response.payload.diploma.title;
          this.breadcrumbItems[1].label = this.title;
        }
      }
    });
  }

  onStartExam(exam: Exam) {
    this.quizStoreService.setQuizMetadata({
      diplomaTitle: this.title,
      diplomaId: this.diplomaId,
      examTitle: exam.title,
      duration: exam.duration
    });
    this.router.navigate(['/quiz', exam.id]);
  }
}


