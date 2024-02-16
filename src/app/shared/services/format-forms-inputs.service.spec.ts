import { TestBed } from '@angular/core/testing';

import { FormatFormsInputsService } from './format-forms-inputs.service';

describe('FormatFormsInputsService', () => {
  let service: FormatFormsInputsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatFormsInputsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
