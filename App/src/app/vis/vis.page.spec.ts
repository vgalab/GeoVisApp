import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisPage } from './vis.page';

describe('VisPage', () => {
  let component: VisPage;
  let fixture: ComponentFixture<VisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
