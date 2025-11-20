import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristSpecCottageComponent } from './tourist-spec-cottage.component';

describe('TouristSpecCottageComponent', () => {
  let component: TouristSpecCottageComponent;
  let fixture: ComponentFixture<TouristSpecCottageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristSpecCottageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristSpecCottageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
