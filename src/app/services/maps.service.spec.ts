import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

fdescribe('MapsService', () => {
  let mapService: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapsService]
    });
    mapService = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(mapService).toBeTruthy();
  });

  describe('tests for getCurrentPosition', () => {
    it('should set the center with the current position', () => {
      //Arrange
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((successFn) => {
        const mockGeolocation = {
          coords: {
            accuracy: 0,
            latitude: 1080,
            longitude: 2080,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            speed: 0,
          },
          timestamp: 0,
        };
        successFn(mockGeolocation);
      });
      //act
      mapService.getCurrentPosition();
      //assert
      expect(mapService.center.lat).toEqual(1080);
      expect(mapService.center.lng).toEqual(2080);
    });
  });
});
