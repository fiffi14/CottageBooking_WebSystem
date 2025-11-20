import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccDenyUserComponent } from './admin-acc-deny-user.component';

describe('AdminAccDenyUserComponent', () => {
  let component: AdminAccDenyUserComponent;
  let fixture: ComponentFixture<AdminAccDenyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccDenyUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccDenyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
