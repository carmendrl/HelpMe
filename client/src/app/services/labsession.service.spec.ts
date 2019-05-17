import { TestBed, inject } from '@angular/core/testing';

import { LabsessionService } from './labsession.service';

describe('LabsessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LabsessionService]
    });
  });

  it('should be created', inject([LabsessionService], (service: LabsessionService) => {
    expect(service).toBeTruthy();
  }));
});
