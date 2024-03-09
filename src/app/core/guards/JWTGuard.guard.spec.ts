import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { JWTGuard } from './JWTGuard.guard';

describe('guardsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => JWTGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
