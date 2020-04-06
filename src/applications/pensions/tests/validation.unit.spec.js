import sinon from 'sinon';

import {
  validateAfterMarriageDate,
  validateServiceBirthDates,
} from '../validation';

describe('Pension validation', () => {
  describe('validateAfterMarriageDate', () => {
    test('should add error if date of marriage is after date of separation', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateAfterMarriageDate(errors, '2014-01-01', {
        dateOfMarriage: '2016-01-01',
      });

      expect(errors.addError.called).toBe(true);
    });
  });
  describe('validateServiceBirthDates', () => {
    test('should add error if date entered is before birth date', () => {
      const errors = {
        activeServiceDateRange: {
          from: {
            addError: sinon.spy(),
          },
        },
      };

      validateServiceBirthDates(
        errors,
        {
          activeServiceDateRange: {
            from: '2015-01-02',
          },
        },
        { veteranDateOfBirth: '2016-01-01' },
      );

      expect(errors.activeServiceDateRange.from.addError.called).toBe(true);
    });
  });
});
