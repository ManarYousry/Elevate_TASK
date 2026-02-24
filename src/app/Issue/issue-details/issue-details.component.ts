import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { IssueService } from '../../service/issue.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-issue-details',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './issue-details.component.html',
  styleUrl: './issue-details.component.css'
})
export class IssueDetailsComponent {
  private route = inject(ActivatedRoute);
  private service = inject(IssueService);

  data$ = this.route.paramMap.pipe(
    switchMap(p => forkJoin({
      issue: this.service.getIssue(+p.get('id')!),
      comments: this.service.getComments(+p.get('id')!)
    }))
  );
}
