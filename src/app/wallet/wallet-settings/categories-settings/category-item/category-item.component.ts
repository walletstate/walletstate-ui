import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IconsDialogComponent } from '../../../../shared/utils/icons-dialog/icons-dialog.component';
import { Category, CreateCategory } from '@walletstate/angular-client';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
})
export class CategoryItemComponent implements OnInit {
  @Input() category?: Category = null;
  @Input() group?: string = null;
  @Input() idx?: number = null;

  @Output() save = new EventEmitter<CreateCategory>();
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
      tags: this.fb.control([]),
      group: this.fb.control(this.category?.group ?? this.group),
      idx: this.fb.control(this.category?.idx ?? this.idx),
    });
  }

  onSubmit() {
    console.log(this.categoryForm);
    this.save.emit(this.categoryForm.value);
  }

  onCancel(): void {
    this.discard.emit();
  }

  openIconsModal(): void {
    const dialogRef = this.dialog.open(IconsDialogComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(iconId => {
      if (iconId) this.categoryForm.patchValue({ icon: iconId });
    });
  }
}
