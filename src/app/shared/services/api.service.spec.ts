import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as _ from 'lodash';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  const mockResponse = 'some data';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService
      ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.get(ApiService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  describe('can make GET requests to the backend', () => {

    it('with request parameters', () => {
      service.get('http://www.api-url.com/endpoint/path', { someParam: 'someParamValue' }).subscribe(data => {
        expect(data).toBe('some data');
      });

      const request = httpTestingController.expectOne(req => {
        return req.method === 'GET'
          && req.urlWithParams === 'http://www.api-url.com/endpoint/path?someParam=someParamValue';
      });

      request.flush(mockResponse);
    });

    it('without request parameters', () => {
      service.get('http://www.api-url.com/endpoint/path').subscribe(data => {
        expect(data).toBe('some data');
      });

      const request = httpTestingController.expectOne(req => {
        return req.method === 'GET'
          && req.urlWithParams === 'http://www.api-url.com/endpoint/path';
      });

      request.flush(mockResponse);
    });

  });

  describe('can make POST requests to the backend', () => {

    it('with a payload', () => {
      service.post('http://www.api-url.com/endpoint/path', { someData: 'someDataValue' }).subscribe(data => {
        expect(data).toBe('some data');
      });

      const request = httpTestingController.expectOne(req => {
        return req.method === 'POST'
          && _.isEqual(req.body, { someData: 'someDataValue' })
          && req.url === 'http://www.api-url.com/endpoint/path';
      });

      request.flush(mockResponse);
    });

    it('without a payload', () => {
      service.post('http://www.api-url.com/endpoint/path').subscribe(data => {
        expect(data).toBe('some data');
      });

      const request = httpTestingController.expectOne(req => {
        return req.method === 'POST'
          && _.isEqual(req.body, { })
          && req.url === 'http://www.api-url.com/endpoint/path';
      });

      request.flush(mockResponse);
    });

  });

  describe('can make PUT requests to the backend', () => {

    it('with a payload', () => {
      service.put('http://www.api-url.com/endpoint/path/123', { someData: 'someDataValue' }).subscribe(data => {
        expect(data).toBe('some data');
      });

      const request = httpTestingController.expectOne(req => {
        return req.method === 'PUT'
          && _.isEqual(req.body, { someData: 'someDataValue' })
          && req.url === 'http://www.api-url.com/endpoint/path/123';
      });

      request.flush(mockResponse);
    });

    it('without a payload', () => {
      service.put('http://www.api-url.com/endpoint/path/123').subscribe(data => {
        expect(data).toBe('some data');
      });

      const request = httpTestingController.expectOne(req => {
        return req.method === 'PUT'
          && _.isEqual(req.body, { })
          && req.url === 'http://www.api-url.com/endpoint/path/123';
      });

      request.flush(mockResponse);
    });

  });

  describe('can make DELETE requests to the backend', () => {

    it('with a payload', () => {
      service.delete('http://www.api-url.com/endpoint/path', { deleteIds: [1, 2, 3, 4, 5] }).subscribe(data => {
        expect(data).toBe('some data');
      });

      const request = httpTestingController.expectOne(req => {
        return req.method === 'DELETE'
          && _.isEqual(req.body, { deleteIds: [1, 2, 3, 4, 5] })
          && req.url === 'http://www.api-url.com/endpoint/path';
      });

      request.flush(mockResponse);
    });

    it('without a payload', () => {
      service.delete('http://www.api-url.com/endpoint/path').subscribe(data => {
        expect(data).toBe('some data');
      });

      const request = httpTestingController.expectOne(req => {
        return req.method === 'DELETE'
          && _.isEqual(req.body, { })
          && req.url === 'http://www.api-url.com/endpoint/path';
      });

      request.flush(mockResponse);
    });

  });

  it('should throw an error when there is one in the request', () => {
    service.get('http://www.api-url.com/endpoint/path').subscribe(
      () => { },
      error => expect(error.error).toEqual(new ErrorEvent('some error'))
    );

    const request = httpTestingController.expectOne(req => {
      return req.method === 'GET'
        && req.urlWithParams === 'http://www.api-url.com/endpoint/path';
    });

    request.error(new ErrorEvent('some error'));
  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
