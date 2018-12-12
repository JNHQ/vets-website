import React from 'react';
import { Link } from 'react-router';

import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

const CallToAction = ({ cta }) => {
  const { description, link, text } = cta;
  return (
    <div>
      {description && description}
      {link &&
        text && (
          <Link className="usa-button va-button-primary" to={link}>
            {text}
          </Link>
        )}
    </div>
  );
};

const FAQItem = ({ faq }) => {
  const { title, component: FAQComponent } = faq;
  return (
    <AdditionalInfo
      tagName={'h5'}
      additionalClass="benefit-faq"
      triggerText={title}
    >
      <FAQComponent />
    </AdditionalInfo>
  );
};

const FAQList = ({ faqs }) => (
  <div>
    {faqs.map((faq, idx) => (
      <FAQItem faq={faq} key={idx} />
    ))}
  </div>
);

export default function PreferenceItem({
  handleViewToggle,
  handleRemove,
  isRemoving,
  benefit,
}) {
  const { title, introduction, code, cta, faqs } = benefit;
  const hasCTA = cta.description || (cta.link && cta.text);

  if (isRemoving) {
    return (
      <div>
        <h3 className="benefit-title">{title}</h3>
        <AlertBox status="warning" headline="Please confirm this change">
          <p>
            We’ll remove this content. If you’d like to see the information
            again, you can always add it back. Just click on the “Find More
            Benefits” button at the top of your dashboard, then select “{title}
            .”
          </p>
          <button
            className="usa-button-primary"
            onClick={() => handleRemove(code)}
          >
            Remove
          </button>
          <button
            className="usa-button-secondary"
            onClick={() => handleViewToggle(code)}
          >
            Cancel
          </button>
        </AlertBox>
      </div>
    );
  }
  return (
    <div>
      <div className="title-container va-nav-linkslist-heading">
        <h3>{title}</h3>
        <button
          className="va-button-link"
          onClick={() => handleViewToggle(code)}
        >
          <i className="fa fa-close" /> <span>Remove</span>
        </button>
      </div>
      <p className="va-introtext">{introduction}</p>
      {faqs && <FAQList faqs={faqs} />}
      {hasCTA && <CallToAction cta={cta} />}
    </div>
  );
}
