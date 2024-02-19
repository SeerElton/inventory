import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgBackgroundComponent } from './svg-background.component';

describe('SvgBackgroundComponent', () => {
  let component: SvgBackgroundComponent;
  let fixture: ComponentFixture<SvgBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgBackgroundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
