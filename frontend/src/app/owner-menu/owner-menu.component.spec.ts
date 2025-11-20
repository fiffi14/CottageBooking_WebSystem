import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerMenuComponent } from './owner-menu.component';

describe('OwnerMenuComponent', () => {
  let component: OwnerMenuComponent;
  let fixture: ComponentFixture<OwnerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
