import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemDialogComponent } from './order-item-dialog.component';

describe('OrderItemDialogComponent', () => {
  let component: OrderItemDialogComponent;
  let fixture: ComponentFixture<OrderItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
