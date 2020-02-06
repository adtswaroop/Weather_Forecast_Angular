import { TestBed } from '@angular/core/testing';

import { ToServerService } from './to-server.service';

describe('ToServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToServerService = TestBed.get(ToServerService);
    expect(service).toBeTruthy();
  });
});
