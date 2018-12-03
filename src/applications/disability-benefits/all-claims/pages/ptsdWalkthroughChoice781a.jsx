import React from 'react';

import { ptsd781aNameTitle } from '../content/ptsdClassification';
import {
  Ptsd781aUploadChoiceDescription,
  UploadPtsd781aDescription,
} from '../content/ptsdWalkthroughChoice';

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': ({ formData }) => (
    <UploadPtsd781aDescription formData={formData} formType="781a" />
  ),
  'view:upload781aChoice': {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions:
          'I want to continue online with questions about my PTSD.',
        upload:
          'I’ve already filled out a paper form (21-0781a) and want to upload it.',
      },
    },
  },
  'view:upload781aChoiceHelp': {
    'ui:description': <Ptsd781aUploadChoiceDescription formType="781a" />,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:upload781aChoice': {
      type: 'string',
      enum: ['answerQuestions', 'upload'],
    },
    'view:upload781aChoiceHelp': {
      type: 'object',
      properties: {},
    },
  },
};
