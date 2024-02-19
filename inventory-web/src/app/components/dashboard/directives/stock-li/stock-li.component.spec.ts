import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLiComponent } from './stock-li.component';

describe('StockLiComponent', () => {
  let component: StockLiComponent;
  let fixture: ComponentFixture<StockLiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockLiComponent]
    });
    fixture = TestBed.createComponent(StockLiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
