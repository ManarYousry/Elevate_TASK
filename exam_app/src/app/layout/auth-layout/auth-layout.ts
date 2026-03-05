import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
interface Feature {
  icon: string;
  title: string;
  description: string;
}
@Component({
  selector: 'app-auth-layout',
  standalone:true,
  imports: [RouterOutlet,CommonModule],
 template: `
  <div class="flex min-h-screen w-full overflow-hidden">
      <!-- Left Panel - always visible on desktop, hidden on mobile -->
      <div class="hidden lg:flex lg:w-1/2 xl:w-2/5">
    <div class="side-panel relative flex flex-col h-full w-full overflow-hidden p-10 xl:p-14">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 z-0"></div>


      <!-- Content -->
      <div class="relative z-10 flex flex-col h-full">

        <!-- Logo -->
        <div class="flex items-center gap-3 mb-auto">
          <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span class="text-blue-700 font-semibold text-lg tracking-tight">Exam App</span>
        </div>

        <!-- Headline -->
        <div class="my-16">
          <h1 class="text-2xl xl:text-2xl font-bold text-gray-900 leading-tight">
            Empower your learning journey with our smart exam platform.
          </h1>
        </div>

        <!-- Features -->
        <div class="flex flex-col gap-8 mb-auto">
          <div *ngFor="let feature of features" class="feature-item flex items-start gap-5">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl border-2 border-blue-300 bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <span [class]="feature.icon" class="text-blue-600"></span>
            </div>
            <div>
              <h3 class="font-semibold text-blue-700 text-sm font-mono tracking-wide mb-1">{{ feature.title }}</h3>
              <p class="text-gray-600 text-sm leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
     </div>

      <!-- Right Panel - router outlet -->
      <div class="flex w-full lg:w-1/2 xl:w-3/5 items-center justify-center bg-white p-6 md:p-12">
        <div class="w-full max-w-md">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .side-panel {
      border-right: 1px solid rgba(59, 130, 246, 0.15);
    }
    .feature-item {
      animation: fadeSlideIn 0.5s ease forwards;
      opacity: 0;
    }
    .feature-item:nth-child(1) { animation-delay: 0.1s; }
    .feature-item:nth-child(2) { animation-delay: 0.2s; }
    .feature-item:nth-child(3) { animation-delay: 0.3s; }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateX(-16px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `],
})
export class AuthLayout {


  features: Feature[] = [
    {
      icon: `pi pi-cloud`,
      title: 'Tailored Diplomas',
      description: 'Choose from specialized tracks like Frontend, Backend, and Mobile Development.',
    },
    {
      icon: `pi pi-book`,
      title: 'Focused Exams',
      description: 'Access topic-specific tests including HTML, CSS, JavaScript, and more.',
    },
    {
      icon: `pi pi-server`,
      title: 'Smart Multi-Step Forms',
      description: 'Choose from specialized tracks like Frontend, Backend, and Mobile Development.',
    },
  ];

}
