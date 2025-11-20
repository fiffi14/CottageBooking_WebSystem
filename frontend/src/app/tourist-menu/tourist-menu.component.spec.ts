import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristMenuComponent } from './tourist-menu.component';

describe('TouristMenuComponent', () => {
  let component: TouristMenuComponent;
  let fixture: ComponentFixture<TouristMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
