import { TestBed, inject } from '@angular/core/testing';

import { LabSessionService } from './labsession.service';

describe('LabsessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LabSessionService]
    });
  });

  it('should be created', inject([LabSessionService], (service: LabSessionService) => {
    expect(service).toBeTruthy();
  }));
});
