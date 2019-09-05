import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StorageServiceModule } from 'angular-webstorage-service';

import { LoggedinGuard } from './loggedin.guard';
import { UserService } from '../services/user.service';

describe('LoggedinGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedinGuard, UserService],
      imports: [ RouterTestingModule, HttpClientTestingModule, StorageServiceModule ]
    });
  });

  it('should ...', inject([LoggedinGuard], (guard: LoggedinGuard) => {
    expect(guard).toBeTruthy();
  }));
});
