import { expect } from 'chai';
import newAppointmentReducer from '../../reducers/newAppointment';
import {
  FORM_PAGE_OPENED,
  FORM_DATA_UPDATED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_FACILITY_OPEN,
  FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
  FORM_FETCH_CHILD_FACILITIES,
  FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
  FORM_VA_SYSTEM_CHANGED,
} from '../../actions/newAppointment';

import systems from '../../actions/facilities.json';
import facilities983 from '../../actions/facilities_983.json';

const defaultState = {
  data: {},
  pages: {},
  loadingSystems: false,
  loadingFacilities: false,
  systems: null,
  facilities: {},
};

describe('VAOS reducer: newAppointment', () => {
  it('should set the new schema', () => {
    const currentState = {
      data: {},
      pages: {},
    };
    const action = {
      type: FORM_PAGE_OPENED,
      page: 'test',
      schema: {
        type: 'object',
        properties: {},
      },
      uiSchema: {},
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.pages.test).not.to.be.undefined;
  });
  it('should update the form data', () => {
    const currentState = {
      data: {},
      pages: {
        test: {
          type: 'object',
          properties: {},
        },
      },
    };
    const action = {
      type: FORM_DATA_UPDATED,
      page: 'test',
      data: {
        prop: 'testing',
      },
      uiSchema: {},
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.data.prop).to.equal('testing');
  });

  it('should mark page change as in progress', () => {
    const currentState = {
      data: {},
      pageChangeInProgress: false,
    };
    const action = {
      type: FORM_PAGE_CHANGE_STARTED,
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.pageChangeInProgress).to.be.true;
  });

  it('should mark page change as in not progress', () => {
    const currentState = {
      data: {},
      pageChangeInProgress: true,
    };
    const action = {
      type: FORM_PAGE_CHANGE_COMPLETED,
    };

    const newState = newAppointmentReducer(currentState, action);

    expect(newState.pageChangeInProgress).to.be.false;
  });
  describe('open facility page reducer', () => {
    const defaultOpenPageAction = {
      type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
      page: 'vaFacility',
      uiSchema: {},
      schema: {
        type: 'object',
        properties: {
          vaSystem: {
            type: 'string',
            enum: [],
          },
          vaFacility: {
            type: 'string',
            enum: [],
          },
        },
      },
      typeOfCareId: '323',
    };

    it('should set loading state when facility page opens', () => {
      const action = {
        type: FORM_PAGE_FACILITY_OPEN,
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(newState.loadingSystems).to.be.true;
    });

    it('should set systems when facility page is done loading', () => {
      const currentState = {
        ...defaultState,
        loadingSystems: true,
      };
      const action = {
        ...defaultOpenPageAction,
        systems,
      };

      const newState = newAppointmentReducer(currentState, action);

      expect(newState.loadingSystems).to.be.false;
      expect(newState.pages.vaFacility).to.deep.equal({
        type: 'object',
        properties: {
          vaSystem: {
            type: 'string',
            enum: ['983', '984'],
            enumNames: [
              'CHYSHR-Cheyenne VA Medical Center',
              'DAYTSHR -Dayton VA Medical Center',
            ],
          },
          vaFacility: {
            type: 'string',
            enum: [],
          },
        },
      });
    });

    it('should set facilities when only one system', () => {
      const action = {
        ...defaultOpenPageAction,
        systems: systems.slice(0, 1),
        facilities: facilities983,
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(newState.data.vaSystem).to.equal(
        action.systems[0].institutionCode,
      );
      expect(newState.pages.vaFacility).to.deep.equal({
        type: 'object',
        properties: {
          vaFacility: {
            type: 'string',
            enum: ['983', '983GB', '983GC', '983GD', '983HK'],
            enumNames: [
              'CHYSHR-Cheyenne VA Medical Center (Cheyenne, WY)',
              'CHYSHR-Sidney VA Clinic (Sidney, NE)',
              'CHYSHR-Fort Collins VA Clinic (Fort Collins, CO)',
              'CHYSHR-Loveland VA Clinic (Loveland, CO)',
              'CHYSHR-Wheatland VA Mobile Clinic (Cheyenne, WY)',
            ],
          },
        },
      });
    });

    it('should set system and facility when there is only one', () => {
      const action = {
        ...defaultOpenPageAction,
        systems: systems.slice(0, 1),
        facilities: facilities983.slice(0, 1),
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(newState.data.vaSystem).to.equal(
        action.systems[0].institutionCode,
      );
      expect(newState.data.vaFacility).to.equal(
        action.facilities[0].institution.institutionCode,
      );
      expect(newState.pages.vaFacility).to.deep.equal({
        type: 'object',
        properties: {},
      });
    });
  });

  describe('update facility data reducer', () => {
    const defaultFetchFacilitiesAction = {
      type: FORM_FETCH_CHILD_FACILITIES_SUCCEEDED,
      uiSchema: {},
      typeOfCareId: '323',
    };
    const defaultFacilityState = {
      ...defaultState,
      data: {
        vaSystem: '983',
        typeOfCareId: '323',
      },
      pages: {
        vaFacility: {
          type: 'object',
          properties: {
            vaSystem: {
              type: 'string',
            },
            vaFacility: {
              type: 'string',
              enum: [],
            },
          },
        },
      },
      systems,
      facilities: {},
      loadingFacilities: true,
    };

    it('should set loading state when system changes and facilities are fetched', () => {
      const action = {
        type: FORM_FETCH_CHILD_FACILITIES,
      };

      const newState = newAppointmentReducer(defaultState, action);

      expect(
        newState.pages.vaFacility.properties.vaFacilityLoading,
      ).to.deep.equal({ type: 'string' });
    });

    it('should set up facilities after they are fetched', () => {
      const action = {
        ...defaultFetchFacilitiesAction,
        facilities: facilities983,
      };

      const newState = newAppointmentReducer(defaultFacilityState, action);

      expect(newState.pages.vaFacility.properties.vaFacilityLoading).to.be
        .undefined;
      expect(newState.pages.vaFacility.properties.vaFacility).to.deep.equal({
        type: 'string',
        enum: ['983', '983GB', '983GC', '983GD', '983HK'],
        enumNames: [
          'CHYSHR-Cheyenne VA Medical Center (Cheyenne, WY)',
          'CHYSHR-Sidney VA Clinic (Sidney, NE)',
          'CHYSHR-Fort Collins VA Clinic (Fort Collins, CO)',
          'CHYSHR-Loveland VA Clinic (Loveland, CO)',
          'CHYSHR-Wheatland VA Mobile Clinic (Cheyenne, WY)',
        ],
      });
      expect(newState.facilities['323_983']).to.equal(facilities983);
    });

    it('should update facility choices if system changed and we have the list in state', () => {
      const action = {
        type: FORM_VA_SYSTEM_CHANGED,
        typeOfCareId: '323',
      };
      const state = {
        ...defaultFacilityState,
        data: {
          vaSystem: '983',
        },
        facilities: {
          '323_983': facilities983,
        },
      };

      const newState = newAppointmentReducer(state, action);

      expect(newState.pages.vaFacility.properties.vaFacility).to.deep.equal({
        type: 'string',
        enum: ['983', '983GB', '983GC', '983GD', '983HK'],
        enumNames: [
          'CHYSHR-Cheyenne VA Medical Center (Cheyenne, WY)',
          'CHYSHR-Sidney VA Clinic (Sidney, NE)',
          'CHYSHR-Fort Collins VA Clinic (Fort Collins, CO)',
          'CHYSHR-Loveland VA Clinic (Loveland, CO)',
          'CHYSHR-Wheatland VA Mobile Clinic (Cheyenne, WY)',
        ],
      });
    });

    it('should remove facility question and set data if only one facility in state', () => {
      const action = {
        type: FORM_VA_SYSTEM_CHANGED,
        typeOfCareId: '323',
      };
      const state = {
        ...defaultFacilityState,
        systems: [
          {
            institutionCode: '983',
          },
        ],
        facilities: {
          '323_983': facilities983.slice(0, 1),
        },
      };

      const newState = newAppointmentReducer(state, action);

      expect(newState.pages.vaFacility.properties.vaFacility).to.be.undefined;
      expect(newState.data.vaFacility).to.equal('983');
    });
  });
});
