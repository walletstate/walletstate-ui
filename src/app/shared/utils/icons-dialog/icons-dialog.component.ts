import { Component, OnInit } from '@angular/core';
import { IconsService } from './icons.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-icons-dialog',
  templateUrl: './icons-dialog.component.html',
  styleUrl: './icons-dialog.component.scss',
})
export class IconsDialogComponent implements OnInit {
  icons: string[] = [];

  uploadNewImageIconId = '8bf6de2f265f2d5779647e2d2918010c311638bfc96ad0e0be13f883bf28c0bb';

  constructor(
    private iconsService: IconsService,
    private dialogRef: MatDialogRef<IconsDialogComponent>
  ) {}

  ngOnInit() {
    this.iconsService.iconsList().subscribe(icons => (this.icons = icons));
  }

  onSelectIcon(iconId: string) {
    this.dialogRef.close(iconId);
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.iconsService.uploadIcon(reader.result.toString()).subscribe(newIconId => this.icons.push(newIconId));
    };
  }
}
