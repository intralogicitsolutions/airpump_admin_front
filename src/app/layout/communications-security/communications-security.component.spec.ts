import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationsSecurityComponent } from './communications-security.component';

describe('CommunicationsSecurityComponent', () => {
  let component: CommunicationsSecurityComponent;
  let fixture: ComponentFixture<CommunicationsSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationsSecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationsSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
