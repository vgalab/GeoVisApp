import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisControlComponent } from './vis-control.component';

describe('VisControlComponent', () => {
  let component: VisControlComponent;
  let fixture: ComponentFixture<VisControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisControlComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
