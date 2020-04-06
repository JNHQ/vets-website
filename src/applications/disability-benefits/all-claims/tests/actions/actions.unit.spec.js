import sinon from 'sinon';

import { mockApiRequest } from '../../../../../platform/testing/unit/helpers.js';

import {
  fetchITF,
  createITF,
  ITF_FETCH_INITIATED,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_INITIATED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from '../../actions';

const originalFetch = global.fetch;

describe('ITF actions', () => {
  describe('fetchITF', () => {
    afterEach(() => {
      global.fetch = originalFetch;
    });

    test('should dispatch a fetch succeeded action with data', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData);
      const dispatch = sinon.spy();
      return fetchITF()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).toBe(ITF_FETCH_INITIATED);
        expect(dispatch.secondCall.args[0]).toEqual({
          type: ITF_FETCH_SUCCEEDED,
          data: mockData.data,
        });
      });
    });

    test('should dispatch a fetch failed action', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData, false);
      const dispatch = sinon.spy();
      return fetchITF()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).toBe(ITF_FETCH_INITIATED);
        expect(dispatch.secondCall.args[0].type).toBe(ITF_FETCH_FAILED);
      });
    });
  });

  describe('createITF', () => {
    afterEach(() => {
      global.fetch = originalFetch;
    });

    test('should dispatch a fetch succeeded action with data', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData);
      const dispatch = sinon.spy();
      return createITF()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).toBe(ITF_CREATION_INITIATED);
        expect(dispatch.secondCall.args[0]).toEqual({
          type: ITF_CREATION_SUCCEEDED,
          data: mockData.data,
        });
      });
    });

    test('should dispatch a fetch failed action', () => {
      const mockData = { data: 'asdf' };
      mockApiRequest(mockData, false);
      const dispatch = sinon.spy();
      return createITF()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).toBe(ITF_CREATION_INITIATED);
        expect(dispatch.secondCall.args[0].type).toEqual(ITF_CREATION_FAILED);
      });
    });
  });
});
