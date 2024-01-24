import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPatientComponent } from './modify-patient.component';

describe('ModifyPatientComponent', () => {
  let component: ModifyPatientComponent;
  let fixture: ComponentFixture<ModifyPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
