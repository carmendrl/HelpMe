import { TestBed, inject } from '@angular/core/testing';

import { AddAuthorizationInterceptorService } from './add-authorization-interceptor.service';

describe('AddAuthorizationInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddAuthorizationInterceptorService]
    });
  });

  it('should be created', inject([AddAuthorizationInterceptorService], (service: AddAuthorizationInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
