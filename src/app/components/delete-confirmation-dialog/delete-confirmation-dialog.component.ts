import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  template: `
    <div style="width: 300px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); padding: 20px; background: #fff;">
      <h1 style="font-size: 1.5em; font-weight: 500; color: #f44336; margin: 0; text-align: center;">
        Confirm Deletion
      </h1>
      <div style="font-size: 1.1em; margin: 20px 0; text-align: center;">
        <p>Are you sure you want to delete "<strong>{{ data.name }}</strong>"?</p>
      </div>
      <div style="display: flex; justify-content: space-between; gap: 10px; margin-top: 20px;">
        <button
          mat-button
          style="flex: 1; font-size: 1em; padding: 10px; border: none; border-radius: 6px; background-color: #e0e0e0; color: #000; transition: background-color 0.2s;"
          (click)="onCancel()"
          onmouseover="this.style.backgroundColor='#d6d6d6';"
          onmouseout="this.style.backgroundColor='#e0e0e0';">
          Cancel
        </button>
        <button
          mat-button
          style="flex: 1; font-size: 1em; padding: 10px; border: none; border-radius: 6px; background-color: #f44336; color: white; transition: background-color 0.2s;"
          (click)="onDelete()"
          onmouseover="this.style.backgroundColor='#e53935';"
          onmouseout="this.style.backgroundColor='#f44336';">
          Delete
        </button>
      </div>
    </div>
  `,
})
export class DeleteConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}
