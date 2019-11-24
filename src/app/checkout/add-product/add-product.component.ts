import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public products: any[],
  ) { }

  ngOnInit() {
    console.log(this.products);
  }
  submit() {
    console.log("submit");
    this.dialogRef.close({ data: this.products });
  }
  addProduct() {
    this.products.push('ne1');
  }
  removeProduct(index: number) {
    this.products.splice(index, 1);
  }

}
