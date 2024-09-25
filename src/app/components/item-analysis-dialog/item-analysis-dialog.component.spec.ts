import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAnalysisDialogComponent } from './item-analysis-dialog.component';

describe('ItemAnalysisDialogComponent', () => {
  let component: ItemAnalysisDialogComponent;
  let fixture: ComponentFixture<ItemAnalysisDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAnalysisDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAnalysisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
