import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-diolog-box',
  templateUrl: './diolog-box.component.html',
  styleUrls: ['./diolog-box.component.scss']
})
export class DiologBoxComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DiologBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() { }

  closeDialog(value: boolean) {
    this.dialogRef.close({ message: value });
  }
}


