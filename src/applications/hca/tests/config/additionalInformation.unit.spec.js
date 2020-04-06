import React from 'react';
import { findDOMNode } from 'react-dom';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from '../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Hca additionalInformation', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.additionalInformation;
  const definitions = formConfig.defaultDefinitions;
  test('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input').length).toBe(9);
  });

  test('should submit without data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
  });
});
