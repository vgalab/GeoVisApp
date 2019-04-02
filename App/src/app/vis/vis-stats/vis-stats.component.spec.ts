import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisStatsComponent } from './vis-stats.component'

describe('VisStatsComponent', () => {
  let component: VisStatsComponent;
  let fixture: ComponentFixture<VisStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisStatsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
