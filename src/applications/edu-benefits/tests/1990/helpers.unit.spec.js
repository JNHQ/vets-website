import { prefillTransformer } from '../../1990/helpers.jsx';

describe('1990 helpers', () => {
  describe('prefillTransformer', () => {
    test('should do nothing if no contact info is updated', () => {
      const formData = {};
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };
      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData).toEqual(formData);
    });
    test('should set the email', () => {
      const formData = {
        email: 'test@foo.com',
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].email).toEqual(
        formData.email,
      );
    });
    test('should set the homePhone', () => {
      const formData = {
        homePhone: '999',
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].homePhone).toEqual(
        formData.homePhone,
      );
    });
    test('should set the mobilePhone', () => {
      const formData = {
        mobilePhone: '999',
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].mobilePhone).toEqual(
        formData.mobilePhone,
      );
    });
  });
});
