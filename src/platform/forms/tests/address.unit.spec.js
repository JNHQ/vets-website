import * as addressUtils from '../address/helpers';

// Examples from:
// https://github.com/department-of-veterans-affairs/vets-api/blob/1efd2c206859b1a261e762a50cdb44dc8b66462d/spec/factories/pciu_address.rb#L34

const domestic = {
  type: 'DOMESTIC',
  countryName: 'USA',
  addressOne: '140 Rock Creek Church Rd NW',
  addressTwo: 'Apt 57',
  addressThree: 'Area Name',
  city: 'Springfield',
  stateCode: 'OR',
  zipCode: '97477',
  zipSuffix: '',
};

const international = {
  type: 'INTERNATIONAL',
  countryName: 'France',
  addressOne: '2 Avenue Gabriel',
  addressTwo: 'Line2',
  addressThree: 'Line3',
  city: 'Paris',
};

// 'countryName' is NOT part of the Military Address model.
const military = {
  type: 'MILITARY',
  addressOne: '57 Columbus Strassa',
  addressTwo: 'Line2',
  addressThree: 'Ben Franklin Village',
  militaryPostOfficeTypeCode: 'APO',
  militaryStateCode: 'AE',
  zipCode: '09028',
  zipSuffix: '1234',
};

describe('formatAddress', () => {
  test('formats domestic addresses with three street lines', () => {
    const expectedResult = {
      street: '140 Rock Creek Church Rd NW, Apt 57 Area Name',
      cityStateZip: 'Springfield, Oregon 97477',
      country: '',
    };

    expect(addressUtils.formatAddress(domestic)).toEqual(expectedResult);
  });

  test('formats domestic addresses with two street lines', () => {
    const expectedResult = {
      street: '140 Rock Creek Church Rd NW, Apt 57',
      cityStateZip: 'Springfield, Oregon 97477',
      country: '',
    };
    const address = { ...domestic };
    address.addressThree = '';
    expect(addressUtils.formatAddress(address)).toEqual(expectedResult);
  });

  test('formats domestic addresses with one street line', () => {
    const expectedResult = {
      street: '140 Rock Creek Church Rd NW',
      cityStateZip: 'Springfield, Oregon 97477',
      country: '',
    };
    const address = { ...domestic };
    address.addressTwo = '';
    address.addressThree = '';
    expect(addressUtils.formatAddress(address)).toEqual(expectedResult);
  });

  test('formats military addresses', () => {
    const expectedResult = {
      street: '57 Columbus Strassa, Line2 Ben Franklin Village',
      cityStateZip: 'APO, AE 09028',
      country: '',
    };

    expect(addressUtils.formatAddress(military)).toEqual(expectedResult);
  });

  test('formats international addresses', () => {
    const expectedResult = {
      street: '2 Avenue Gabriel, Line2 Line3',
      cityStateZip: 'Paris',
      country: 'France',
    };

    expect(addressUtils.formatAddress(international)).toEqual(expectedResult);
  });
});

describe('getStateName', () => {
  test('gets the full name of a state from its abbreviation', () => {
    expect(addressUtils.getStateName('KY')).toBe('Kentucky');
    expect(addressUtils.getStateName('ky')).toBe('Kentucky');
  });
});

describe('isEmptyAddress', () => {
  test('detects an empty address', () => {
    expect(addressUtils.isEmptyAddress({})).toBe(true);
    expect(
      addressUtils.isEmptyAddress({ type: 'domestic', countryName: 'USA' }),
    ).toBe(true);
  });

  test('detects a non-empty address', () => {
    expect(addressUtils.isEmptyAddress(domestic)).toBe(false);
  });
});

describe('consolidateAddress', () => {
  test('converts a military address into a standard address format by adding the countryName set to USA, militaryPostOfficeTypeCode converted to city, and militaryStateCode converted to stateCode.', () => {
    const expectedResult = {
      type: 'MILITARY',
      countryName: 'USA',
      addressOne: military.addressOne,
      addressTwo: military.addressTwo,
      addressThree: military.addressThree,
      city: military.militaryPostOfficeTypeCode,
      stateCode: military.militaryStateCode,
      zipCode: military.zipCode,
      zipSuffix: military.zipSuffix,
    };
    expect(addressUtils.consolidateAddress(military)).toEqual(expectedResult);
  });
  test('does not affect non-military addresses', () => {
    expect(addressUtils.consolidateAddress(domestic)).toEqual(domestic);
  });
});

describe('expandAddress', () => {
  test('converts a previously-consolidated address into the proper model by inferring the address type. If it is inferred as military, the inverse conversion of consolidateAddress is performed.', () => {
    const consolidated = addressUtils.consolidateAddress(military);
    consolidated.type = 'Will be inferred based on address fields';
    expect(addressUtils.expandAddress(consolidated)).toEqual(military);
  });
  test('does not affect non-military addresses', () => {
    expect(addressUtils.expandAddress(domestic)).toEqual(domestic);
  });
});
