import { TestBed } from '@angular/core/testing';

import { RoutingHelperService } from './routing-helper.service';

describe('RouterHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutingHelperService = TestBed.get(RoutingHelperService);
    expect(service).toBeTruthy();
  });
});
