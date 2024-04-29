import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-group-form',
  templateUrl: './edit-group-form.component.html',
  styleUrl: './edit-group-form.component.scss',
})
export class EditGroupFormComponent implements OnInit {
  @Input() name?: string = null;

  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  groupForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      name: [this.name, Validators.required],
    });
  }

  onSave(): void {
    this.save.emit(this.groupForm.value.name);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
