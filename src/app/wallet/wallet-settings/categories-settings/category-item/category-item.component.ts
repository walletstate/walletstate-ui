import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  @Input() editMode: boolean = false;

  @Output() save = new EventEmitter<CreateCategory>();

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
      name: this.fb.control(this.category?.name),
      icon: this.fb.control(this.category?.icon),
      tags: this.fb.control([]),
      group: this.fb.control(this.category?.group ?? this.group),
      idx: this.fb.control(this.category?.idx ?? this.idx),
    });
  }

  onEdit() {
    this.editMode = true;
  }

  onSubmit() {
    console.log(this.categoryForm);
    this.save.emit(this.categoryForm.value);
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

  onTags(e) {
    console.log(e);
  }
}
