import { Component, DestroyRef, inject, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';
import { QuestionsService } from './services/questions';
import { QuizStoreService } from './services/quiz-store';
import { SubmitionService } from './services/submition-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Question } from './model/exam-ques-dto';
import { ResultDto } from './model/resultDto';
import { Answer } from './model/answerDto';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, BreadcrumbComponent, RouterModule],
  template: `
    <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
    <app-page-header [title]="isFinished() ? 'Exam Result' : examTitle()" [url]="breadcrumbItems[1]?.url || ''" icon="pi pi-clock"></app-page-header>
    
    <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
      
      <!-- Quiz View -->
      <ng-container *ngIf="!isFinished()">
        <!-- Progress Section -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex-1">
            <p class="text-gray-400 text-sm font-bold mb-2">Question {{ currentIndex() + 1 }} of {{ totalQuestions() }}</p>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-[#2563EB] h-full transition-all duration-500" [style.width.%]="progress()"></div>
            </div>
          </div>
          <div class="ml-8 flex items-center gap-2">
            <div class="w-14 h-14 rounded-full border-4 border-[#2563EB]/10 flex items-center justify-center relative">
               <div class="absolute inset-0 rounded-full border-4 border-t-[#2563EB] animate-spin-slow"></div>
              <span class="text-[#2563EB] font-bold text-sm">{{ formattedTime() }}</span>
            </div>
          </div>
        </div>

        <!-- Question Content -->
        <div class="mb-12" *ngIf="currentQuestion()">
          <h3 class="text-gray-800 font-bold text-2xl mb-8 leading-tight">
            {{ currentQuestion().text }}
          </h3>

          <div class="space-y-4">
            <div *ngFor="let answer of currentQuestion().answers"
                 (click)="selectOption(answer.id)"
                 [class.border-[#2563EB]]="selectedAnswerId() === answer.id"
                 [class.bg-[#2563EB]/5]="selectedAnswerId() === answer.id"
                 class="p-5 border border-gray-100 rounded-2xl cursor-pointer transition-all duration-300 hover:border-[#2563EB]/50 hover:bg-gray-50 flex items-center gap-4 group">
              <div [class.bg-[#2563EB]]="selectedAnswerId() === answer.id"
                   [class.border-[#2563EB]]="selectedAnswerId() === answer.id"
                   [class.border-gray-200]="selectedAnswerId() !== answer.id"
                   class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300">
                <div *ngIf="selectedAnswerId() === answer.id" class="w-2.5 h-2.5 bg-white rounded-full scale-100 animate-in zoom-in"></div>
              </div>
              <span class="text-gray-700 font-semibold group-hover:text-gray-900">{{ answer.text }}</span>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center gap-4">
          <button (click)="previousQuestion()"
                  [disabled]="currentIndex() === 0"
                  class="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-100 text-gray-400 font-bold text-lg transition-all hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent">
            Back
          </button>
          <button (click)="nextQuestion()"
                  [disabled]="selectedAnswerId() === null"
                  [class.bg-[#2563EB]]="selectedAnswerId() !== null"
                  [class.text-white]="selectedAnswerId() !== null"
                  [class.bg-gray-100]="selectedAnswerId() === null"
                  [class.text-gray-300]="selectedAnswerId() === null"
                  class="flex-[2] py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:hover:scale-100">
            {{ currentIndex() === totalQuestions() - 1 ? 'Finish' : 'Next' }}
          </button>
        </div>
      </ng-container>

      <!-- Result View -->
      <ng-container *ngIf="isFinished() && resultData()">
       <!-- Progress Section -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex-1">
            <p class="text-gray-400 text-sm font-bold mb-2">Question {{ currentIndex() + 1 }} of {{ totalQuestions() }}</p>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-[#2563EB] h-full transition-all duration-500" [style.width.%]="progress()"></div>
            </div>
          </div>
          <div class="ml-8 flex items-center gap-2">
            <div class="w-14 h-14 rounded-full border-4 border-[#2563EB]/10 flex items-center justify-center relative">
               <div class="absolute inset-0 rounded-full border-4 border-t-[#2563EB] animate-spin-slow"></div>
              <span class="text-[#2563EB] font-bold text-sm">{{ formattedTime() }}</span>
            </div>
          </div>
        </div>

      
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <!-- Chart Section -->
         <div>
          <h3 class="text-blue-600 font-bold text-2xl tracking-tight">Results:</h3>
            
         
  
          <div class="bg-blue-50/50 rounded-3xl p-8 flex flex-col items-center border border-blue-100/50">
            <div class="relative w-48 h-48 flex items-center justify-center mb-8">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="#EF4444" stroke-width="16" fill="transparent" />
                <circle cx="96" cy="96" r="80" stroke="#10B981" stroke-width="16" fill="transparent" 
                        [attr.stroke-dasharray]="502.65" 
                        [attr.stroke-dashoffset]="502.65 * (1 - resultData()!.submission.score / 100)" 
                        stroke-linecap="round" class="transition-all duration-1000" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-black text-gray-800">{{ resultData()!.submission.score }}%</span>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-8 w-full">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-[#10B981] rounded-sm"></div>
                <div>
                  <p class="text-sm font-bold text-gray-700">Correct: {{ resultData()!.submission.correctAnswers }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-[#EF4444] rounded-sm"></div>
                <div>
                  <p class="text-sm font-bold text-gray-700">Incorrect: {{ resultData()!.submission.wrongAnswers }}</p>
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- Questions List Breakdown -->
          <div class="lg:col-span-2 space-y-6">
           <div class="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <div *ngFor="let item of resultData()!.analytics" 
                   class="p-6 rounded-2xl border border-gray-100 transition-all hover:shadow-md">
                <p class="text-gray-800 font-bold text-lg mb-4">{{ item.questionText }}</p>
                
                <div class="space-y-3">
                  <!-- Selected Answer -->
                  <div [class.bg-red-50]="!item.isCorrect" [class.bg-green-50]="item.isCorrect"
                       class="p-4 rounded-xl flex items-center gap-3 border"
                       [class.border-red-100]="!item.isCorrect" [class.border-green-100]="item.isCorrect">
                    <div [class.bg-red-500]="!item.isCorrect" [class.bg-green-500]="item.isCorrect"
                         class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs">
                      <i [class]="item.isCorrect ? 'pi pi-check' : 'pi pi-times'"></i>
                    </div>
                    <span class="text-sm font-semibold" [class.text-red-700]="!item.isCorrect" [class.text-green-700]="item.isCorrect">
                      {{ item.selectedAnswer.text }}
                    </span>
                  </div>

                  <!-- Correct Answer if user was wrong -->
                  <div *ngIf="!item.isCorrect" 
                       class="p-4 rounded-xl flex items-center gap-3 border border-green-100 bg-green-50/50">
                    <div class="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 text-xs">
                      <i class="pi pi-check"></i>
                    </div>
                    <span class="text-sm font-semibold text-green-700">
                      {{ item.correctAnswer.text }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Result Actions -->
        <div class="flex items-center gap-6 mt-12 pt-8 border-t border-gray-50">
          <button (click)="restartExam()" 
                  class="flex-1 py-4 px-6 rounded-2xl bg-gray-100 text-gray-600 font-bold text-lg transition-all hover:bg-gray-200 active:scale-95 flex items-center justify-center gap-2">
            <i class="pi pi-refresh"></i> Restart
          </button>
          <button routerLink="/dashboard" 
                  class="flex-[2] py-4 px-6 rounded-2xl bg-[#2563EB] text-white font-bold text-lg shadow-xl shadow-[#2563EB]/20 transition-all hover:bg-[#1d4ed8] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            <i class="pi pi-compass"></i> Explore
          </button>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .animate-spin-slow {
      animation: spin 3s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #e2e8f0;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #cbd5e1;
    }
  `]
})
export class ExamComponent implements OnInit, OnDestroy {
  private examId: string = "";
  private $destroyRef = inject(DestroyRef)
  private quesService = inject(QuestionsService);
  private quizStoreService = inject(QuizStoreService);
  private submissionService = inject(SubmitionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  questions = signal<Question[]>([]);
  currentIndex = signal(0);
  selectedAnswerId = signal<string | null>(null);
  examTitle = signal('');
  timeLeft = signal(0);

  // Submission & Results
  isFinished = signal(false);
  resultData = signal<ResultDto | null>(null);
  userAnswers = signal<Answer[]>([]);
  startedAt = new Date().toISOString();

  // Computed values
  totalQuestions = computed(() => this.questions().length);
  currentQuestion = computed(() => this.questions()[this.currentIndex()]);
  progress = computed(() => {
    if (this.totalQuestions() === 0) return 0;
    return ((this.currentIndex() + 1) / this.totalQuestions()) * 100;
  });

  formattedTime = computed(() => {
    const minutes = Math.floor(this.timeLeft() / 60);
    const seconds = this.timeLeft() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Diplomas', url: '/dashboard' },
    { label: '', url: '' },
    { label: '' }
  ];

  private timerInterval: any;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.examId = id;
      this.loadQuestions();
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  loadQuestions() {
    const metadata = this.quizStoreService.getQuizMetadata();
    if (metadata) {
      this.examTitle.set(metadata.examTitle);
      this.breadcrumbItems[1].label = metadata.diplomaTitle;
      this.breadcrumbItems[1].url = `/exams/${metadata.diplomaId}`;
      this.breadcrumbItems[2].label = metadata.examTitle;
      this.timeLeft.set(metadata.duration * 60);
      this.startTimer();
    }

    this.quesService.getQuestionsByExamId(this.examId).pipe(takeUntilDestroyed(this.$destroyRef)).subscribe({
      next: (response) => {
        if (response.status) {
          const payload = response.payload;
          this.questions.set(payload.questions);

          if (!metadata && payload.exam && payload.diploma) {
            this.examTitle.set(payload.exam.title);
            this.breadcrumbItems[1].label = payload.diploma.title;
            this.breadcrumbItems[1].url = `/exams/${payload.diploma.id}`;
            this.breadcrumbItems[2].label = payload.exam.title;
            this.timeLeft.set(payload.exam.duration * 60);
            this.startTimer();
          }
        }
      }
    });
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
      } else {
        this.stopTimer();
        this.submitExam();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  selectOption(answerId: string) {
    this.selectedAnswerId.set(answerId);
  }

  nextQuestion() {
    if (this.selectedAnswerId() === null) return;

    // Store answer
    const currentAns: Answer = { questionId: this.currentQuestion().id, answerId: this.selectedAnswerId()! };
    this.userAnswers.update(ans => {
      const existingIndex = ans.findIndex(a => a.questionId === currentAns.questionId);
      if (existingIndex > -1) {
        ans[existingIndex] = currentAns;
        return [...ans];
      }
      return [...ans, currentAns];
    });

    if (this.currentIndex() < this.totalQuestions() - 1) {
      this.currentIndex.update(i => i + 1);
      this.selectedAnswerId.set(null);
    } else {
      this.submitExam();
    }
  }

  previousQuestion() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      // Restore previous answer if any
      const prevAns = this.userAnswers().find(a => a.questionId === this.currentQuestion().id);
      this.selectedAnswerId.set(prevAns ? prevAns.answerId : null);
    }
  }

  submitExam() {
    this.stopTimer();

    // Ensure last question is counted if a value is selected
    if (this.selectedAnswerId()) {
      const currentAns: Answer = { questionId: this.currentQuestion().id, answerId: this.selectedAnswerId()! };
      this.userAnswers.update(ans => {
        const existingIndex = ans.findIndex(a => a.questionId === currentAns.questionId);
        if (existingIndex === -1) return [...ans, currentAns];
        return ans;
      });
    }

    const model = {
      examId: this.examId,
      answers: this.userAnswers(),
      startedAt: this.startedAt
    };

    this.submissionService.submitExam(model).pipe(takeUntilDestroyed(this.$destroyRef)).subscribe({
      next: (response) => {
        if (response && response.status) {
          this.resultData.set(response.payload);
          this.isFinished.set(true);

        }
      }
    });
  }

  restartExam() {
    this.isFinished.set(false);
    this.currentIndex.set(0);
    this.selectedAnswerId.set(null);
    this.userAnswers.set([]);
    this.startedAt = new Date().toISOString();
    this.loadQuestions();
  }
}
