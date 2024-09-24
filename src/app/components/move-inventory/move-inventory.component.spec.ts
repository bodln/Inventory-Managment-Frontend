import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveInventoryComponent } from './move-inventory.component';

describe('MoveInventoryComponent', () => {
  let component: MoveInventoryComponent;
  let fixture: ComponentFixture<MoveInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
