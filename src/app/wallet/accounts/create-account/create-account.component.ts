import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '../../shared/accounts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { IconsDialogComponent } from '../../../shared/utils/icons-dialog/icons-dialog.component';
import { Account, Grouped } from '@walletstate/angular-client';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  groups: Grouped<Account>[] = [];

  createAccountForm: FormGroup;

  allTags: string[] = [];

  defaultIconId = 'b0a03cea92532d56e7dec9848fb81c51b4c80a55721b17fd245bfc90f94df314';

  constructor(
    private accountsService: AccountsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
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
      idx: new FormControl(1, [Validators.required]),
      icon: new FormControl(null, []),
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
      .create(this.createAccountForm.value)
      .subscribe(acc => this.router.navigate(['accounts', acc.id]));
  }

  openIconsModal(): void {
    const dialogRef = this.dialog.open(IconsDialogComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(iconId => {
      if (iconId) this.createAccountForm.patchValue({ icon: iconId });
    });
  }

  onTagsChange(tags: string[]) {
    console.log('tags changed ', tags);
  }
}
