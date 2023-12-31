import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '../../shared/accounts.service';
import { Account } from '../../shared/account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { GroupControl } from '../../shared/group.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  groups: GroupControl<Account>[] = [];

  createAccountForm: FormGroup;

  allTags: string[] = [];

  private defaultIcon =
    'data:image/jpeg;base64,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';

  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.groups = this.accountsService.groups.value;
    //TODO unsubscribe
    this.accountsService.groups.subscribe(groups => {
      this.groups = groups;
      console.log('groups updated', this.groups);
      this.allTags = groups
        .flatMap(g => g.items.flatMap(a => a.tags))
        .filter((v, i, self) => i === self.indexOf(v))
        .sort();
      console.log('all tags', this.allTags);
    });

    this.createAccountForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      group: new FormControl(null, [Validators.required]),
      orderingIndex: new FormControl(1, [Validators.required]),
      icon: new FormControl(this.defaultIcon, [Validators.required]),
      tags: new FormControl([], []),
    });

    this.route.paramMap
      .pipe(
        tap(params => {
          const maybeGroupId = params.get('groupId');
          console.log('group', maybeGroupId);
          this.createAccountForm.patchValue({ group: maybeGroupId });
        })
      )
      .subscribe();
  }

  onSubmit() {
    this.accountsService
      .createAccount(this.createAccountForm.value)
      .subscribe(acc => this.router.navigate(['accounts', acc.id]));
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.createAccountForm.patchValue({ icon: reader.result });
    };
  }

  onTagsChange(tags: string[]) {
    console.log('tags changed ', tags);
  }
}
