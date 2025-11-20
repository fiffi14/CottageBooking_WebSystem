import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdDelUserComponent } from './admin-upd-del-user.component';

describe('AdminUpdDelUserComponent', () => {
  let component: AdminUpdDelUserComponent;
  let fixture: ComponentFixture<AdminUpdDelUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdDelUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdDelUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
