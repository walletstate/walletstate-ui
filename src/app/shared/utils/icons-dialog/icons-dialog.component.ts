import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateIcon, IconsHttpClient } from '@walletstate/angular-client';

@Component({
  selector: 'app-icons-dialog',
  templateUrl: './icons-dialog.component.html',
  styleUrl: './icons-dialog.component.scss',
})
export class IconsDialogComponent implements OnInit {
  icons: string[] = [];
  tag?: string = null;

  uploadNewImageIconId = '8bf6de2f265f2d5779647e2d2918010c311638bfc96ad0e0be13f883bf28c0bb';

  constructor(
    private iconsClient: IconsHttpClient,
    private dialogRef: MatDialogRef<IconsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tag?: string }
  ) {
    this.tag = data?.tag;
  }

  ngOnInit() {
    this.iconsClient.list(this.tag).subscribe(icons => (this.icons = icons));
  }

  onSelectIcon(iconId: string) {
    this.dialogRef.close(iconId);
  }

  handleUpload(event) {
    const file = event.target.files[0];
    if (file.size > 51200) {
      alert('Too large image. Max allowed size for icon is 50Kb');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Result = reader.result.toString().split(';');
      const contentType = base64Result[0].replace('data:', '');
      const content = base64Result[1].replace('base64,', '');
      const body: CreateIcon = { contentType, content, tags: [this.tag] };
      console.log(body);

      this.iconsClient.create(body).subscribe(newIconId => this.icons.push(newIconId));
    };
  }
}
