import { TestBed } from '@angular/core/testing';

import { ModifyUserService } from './modify-user.service';

describe('ModifyUserService', () => {
  let service: ModifyUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifyUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
