import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFrameworksComponent } from './manage-frameworks.component';

describe('ManageFrameworksComponent', () => {
  let component: ManageFrameworksComponent;
  let fixture: ComponentFixture<ManageFrameworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFrameworksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFrameworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
