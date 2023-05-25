import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLibraryComponent } from './control-library.component';

describe('ControlLibraryComponent', () => {
  let component: ControlLibraryComponent;
  let fixture: ComponentFixture<ControlLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
