import React from 'react';
import { findDOMNode } from 'react-dom';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from '../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Hca vaBenefits', () => {
  const { schema, uiSchema } = formConfig.chapters.vaBenefits.pages.vaBenefits;
  const definitions = formConfig.defaultDefinitions;
  test('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input').length).toBe(4);
  });

  test('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = findDOMNode(form);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).toBe(1);
    expect(onSubmit.called).toBe(false);
  });

  test('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_vaCompensationType_3'),
      {
        target: {
          value: 'none',
        },
      },
    );

    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
  });
});
