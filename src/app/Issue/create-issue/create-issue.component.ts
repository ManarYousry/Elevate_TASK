import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IssueService } from '../../service/issue.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-issue',
  standalone: true,
  imports: [CommonModule,RouterModule, ReactiveFormsModule],
  templateUrl: './create-issue.component.html',
  styleUrl: './create-issue.component.css'
})
export class CreateIssueComponent {
 private fb = inject(FormBuilder);
  private service = inject(IssueService);
  private router = inject(Router);
 msg:string=""
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', Validators.required]
  });

  submit() {
    debugger
     this.msg="";
    if (this.form.invalid){
      this.msg="Please fill in all required fields with valid data.";
      return;
    }

    this.service.createIssue(this.form.value as any).subscribe(() => {
      alert('Issue created!');
      this.router.navigate(['issue-list']);
    });
  }
}
