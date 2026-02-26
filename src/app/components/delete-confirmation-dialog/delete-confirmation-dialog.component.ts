import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-delete-confirmation-dialog',
    template: `
    <div style="width:100%; font-family:'DM Sans',sans-serif; overflow:hidden; border-radius:16px;">

      <!-- Header -->
      <div style="background:#0f172a; padding:20px 24px 16px; position:relative;">
        <div style="height:3px; background:linear-gradient(90deg,#ef4444,#f87171); position:absolute; top:0; left:0; right:0;"></div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; background:#fee2e2; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <mat-icon style="font-size:17px; width:17px; height:17px; color:#dc2626;">delete</mat-icon>
          </div>
          <div>
            <div style="color:white; font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; line-height:1.2;">Confirm Deletion</div>
            <div style="color:#64748b; font-size:0.72rem; margin-top:1px;">This action cannot be undone</div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:24px; background:white;">
        <p style="margin:0; color:#475569; font-size:0.9rem; line-height:1.6; text-align:center;">
          Are you sure you want to delete<br/>
          <strong style="color:#0f172a; font-size:1rem;">"{{ data.name }}"</strong>?
        </p>
      </div>

      <!-- Actions -->
      <div style="padding:0 24px 24px; background:white; display:flex; gap:10px;">
        <button (click)="onCancel()"
          style="flex:1; padding:11px; background:white; color:#475569; border:1px solid #e2e8f0; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:600; cursor:pointer;">
          Cancel
        </button>
        <button (click)="onDelete()"
          style="flex:1; padding:11px; background:#dc2626; color:white; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:700; cursor:pointer;">
          Delete
        </button>
      </div>

    </div>
  `,
    imports: [MatIconModule],
    standalone: true
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