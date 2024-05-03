import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IconsDialogComponent } from '../../../../shared/utils/icons-dialog/icons-dialog.component';
import { Category, CreateCategory, UpdateCategory } from '@walletstate/angular-client';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss',
})
export class EditCategoryComponent implements OnInit {
  @Input() category?: Category = null;
  @Input() group?: string = null;
  @Input() idx?: number = null;

  @Output() save = new EventEmitter<CreateCategory | UpdateCategory>();
  @Output() discard = new EventEmitter<void>();

  defaultIcon = 'b0a03cea92532d56e7dec9848fb81c51b4c80a55721b17fd245bfc90f94df314';
  categoryForm;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.categoryForm = this.buildForm();
  }

  buildForm() {
    return this.fb.group({
      name: this.fb.control(this.category?.name, [Validators.required]),
      icon: this.fb.control(this.category?.icon),
      tags: this.fb.control([...(this.category?.tags ?? [])]),
      group: this.fb.control(this.category?.group ?? this.group),
      idx: this.fb.control(this.category?.idx ?? this.idx),
    });
  }

  onSubmit() {
    this.save.emit(this.categoryForm.value);
  }

  onClose(): void {
    this.discard.emit();
  }

  openIconsModal(): void {
    const dialogRef = this.dialog.open(IconsDialogComponent, {
      height: '400px',
      width: '600px',
      data: { tag: 'categories' },
    });

    dialogRef.afterClosed().subscribe(iconId => {
      if (iconId) this.categoryForm.patchValue({ icon: iconId });
    });
  }
}
