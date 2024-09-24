import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAnalysisComponent } from './item-analysis.component';

describe('ItemAnalysisComponent', () => {
  let component: ItemAnalysisComponent;
  let fixture: ComponentFixture<ItemAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
