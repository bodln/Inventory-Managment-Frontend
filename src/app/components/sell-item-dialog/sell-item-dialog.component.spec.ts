import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellItemDialogComponent } from './sell-item-dialog.component';

describe('SellItemDialogComponent', () => {
  let component: SellItemDialogComponent;
  let fixture: ComponentFixture<SellItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
