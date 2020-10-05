import { TestBed } from '@angular/core/testing';

import { TrajetService } from './trajet.service';

describe('TrajetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrajetService = TestBed.get(TrajetService);
    expect(service).toBeTruthy();
  });
});
