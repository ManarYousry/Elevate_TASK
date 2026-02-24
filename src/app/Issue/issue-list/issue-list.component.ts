// issues-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../service/issue.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, catchError, combineLatest, debounceTime, map, of, startWith } from 'rxjs';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
 templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.css'
})
export class IssueListComponent {
 private service = inject(IssueService);

  search = new FormControl('');
  private page$ = new BehaviorSubject<number>(1);

  readonly pageSize = 10;

  vm$ = combineLatest([
    this.service.getIssues().pipe(
      map(issues => ({ issues, error: false })),
      catchError(() => of({ issues: [], error: true }))
    ),
    this.search.valueChanges.pipe(startWith(''), debounceTime(300)),
    this.page$
  ]).pipe(
    map(([data, term, page]) => {
      const filtered = data.issues.filter(i =>
        i.title.toLowerCase().includes((term || '').toLowerCase())
      );

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
      const currentPage = Math.min(page, totalPages);

      const start = (currentPage - 1) * this.pageSize;
      const pageItems = filtered.slice(start, start + this.pageSize);

      return {
        loading: false,
        error: data.error,
        items: pageItems,
        total,
        page: currentPage,
        totalPages,
        pages: Array.from({ length: totalPages }, (_, i) => i + 1)
      };
    })
  );

  goTo(page: number) {
    this.page$.next(page);
  }

  next() {
    this.page$.next(this.page$.value + 1);
  }

  prev() {
    this.page$.next(this.page$.value - 1);
  }
}
