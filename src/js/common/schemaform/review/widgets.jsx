import React from 'react';
import { formatReviewDate } from '../helpers';

export function TextWidget({ value }) {
  return <span>{value}</span>;
}

export function DateWidget({ value }) {
  return <span>{formatReviewDate(value)}</span>;
}

export const EmailWidget = TextWidget;

export function SelectWidget({ options, value }) {
  const option = options.enumOptions.filter(opt => opt.val === value);
  if (option) {
    return <span>{option.label}</span>;
  }

  return null;
}

export const RadioWidget = SelectWidget;
