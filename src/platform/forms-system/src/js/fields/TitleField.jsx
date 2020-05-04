import React from 'react';
import classNames from 'classnames';

export default function TitleField({ id, title }) {
  const isRoot = id === 'root__title';

  const classes = classNames('schemaform-block-title', {
    'schemaform-block-subtitle': !isRoot,
  });

  return typeof title === 'string' && title.trim() === '' ? null : (
    <legend className={classes} id={id}>
      {title}
    </legend>
  );
}
