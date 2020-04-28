import moment from 'moment';

import { VA_FORM_IDS } from '../../../../platform/forms/constants';
import testData from './data/minimal-test.json';

/* eslint-disable camelcase */
const mockUser = {
  data: {
    attributes: {
      profile: {
        sign_in: {
          service_name: 'idme',
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        first_name: 'Jane',
        middle_name: '',
        last_name: 'Doe',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
        served_in_military: true,
      },
      in_progress_forms: [
        {
          form: VA_FORM_IDS.FORM_10_10EZ,
          metadata: {},
        },
      ],
      prefills_available: [VA_FORM_IDS.FORM_21_526EZ],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'form526',
        'user-profile',
        'health-records',
        'rx',
        'messaging',
      ],
      va_profile: {
        status: 'OK',
        birth_date: '19511118',
        family_name: 'Hunter',
        gender: 'M',
        given_names: ['Julio', 'E'],
        active_status: 'active',
      },
    },
  },
  meta: { errors: null },
};

const mockItf = {
  data: {
    id: '',
    type: 'evss_intent_to_file_intent_to_files_responses',
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: moment()
            .add(1, 'd')
            .format(),
          participantId: 1,
          source: 'EBN',
          status: 'active',
          type: 'compensation',
        },
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.788+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'claim_recieved',
          type: 'compensation',
        },
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.789+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'claim_recieved',
          type: 'compensation',
        },
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.789+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'expired',
          type: 'compensation',
        },
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.790+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'incomplete',
          type: 'compensation',
        },
      ],
    },
  },
};

const mockDocumentUpload = {
  data: {
    attributes: {
      guid: '123fake-submission-id-567',
    },
  },
};

const mockPaymentInformation = {
  data: {
    id: '',
    type: 'evss_ppiu_payment_information_responses',
    attributes: {
      responses: [
        {
          controlInformation: {
            canUpdateAddress: true,
            corpAvailIndicator: true,
            corpRecFoundIndicator: true,
            hasNoBdnPaymentsIndicator: true,
            identityIndicator: true,
            isCompetentIndicator: true,
            indexIndicator: true,
            noFiduciaryAssignedIndicator: true,
            notDeceasedIndicator: true,
          },
          paymentAccount: {
            accountType: 'Checking',
            financialInstitutionName: 'Comerica',
            accountNumber: '9876543211234',
            financialInstitutionRoutingNumber: '042102115',
          },
          paymentAddress: {
            type: null,
            addressEffectiveDate: null,
            addressOne: null,
            addressTwo: null,
            addressThree: null,
            city: null,
            stateCode: null,
            zipCode: null,
            zipSuffix: null,
            countryName: null,
            militaryPostOfficeTypeCode: null,
            militaryStateCode: null,
          },
          paymentType: 'CNP',
        },
      ],
    },
  },
};
/* eslint-enable camelcase */

const testConfig = {
  pageHooks: {
    '/disability/file-disability-claim-form-21-526ez/introduction': () => {
      // Hit the start button
      cy.findAllByText(/start/i, { selector: 'button' })
        .first()
        .click();

      // Click past the ITF message
      cy.findByText(/continue/i, { selector: 'button' }).click();
    },
    /*
    '/disability/file-disability-claim-form-21-526ez/disabilities/rated-disabilities': async (
      page,
      data,
      config,
      log,
    ) => {
      await Promise.all(
        data.ratedDisabilities.map(async (disability, index) => {
          if (disability['view:selected']) {
            log(`Selecting ${disability.name} (index ${index})`);
            await page.click(`input[name="root_ratedDisabilities_${index}"]`);
          }
        }),
      );
      await page.click('.form-progress-buttons .usa-button-primary');
    },
    '/disability/file-disability-claim-form-21-526ez/payment-information': async (
      page,
      data,
      config,
      log,
    ) => {
      if (data['view:bankAccount']) {
        if (await page.$('.usa-button-primary.edit-button')) {
          // Only click edit if new bank info is in the data file
          await page.click('.usa-button-primary.edit-button');
        }
        await formFiller.fillPage(page, data, config, log);
        await page.click('.usa-button-primary.update-button');
      }
      await page.click('button[type=submit].usa-button-primary');
    },
  */
  },
  testData,
  url:
    'localhost:3001/disability/file-disability-claim-form-21-526ez/introduction',
};

describe('523 all claims', () => {
  before(() => {
    // Set up signed in session.
    window.localStorage.setItem('hasSession', true);

    // Set up mock API.
    cy.server();
    cy.route('GET', '/v0/user', mockUser);
    cy.route('GET', '/v0/intent_to_file', mockItf);
    cy.route('GET', '/v0/upload_supporting_evidence', mockDocumentUpload);
    cy.route('GET', '/v0/ppiu/payment_information', mockPaymentInformation);
  });

  it('fills the form', () => {
    // cy.visit(testConfig.url);
    cy.testForm(testConfig);
  });
});
