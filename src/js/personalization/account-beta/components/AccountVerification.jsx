import React from 'react';
import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';

export default function AccountVerification({ loa }) {
  let content = null;

  if (loa.current !== 3) {
    content = (
      <AlertBox
        content={<div>
          <h4 className="usa-alert-heading">Want to use Vets.gov to do things like track your disability claim status or send secure messages to your health care team?</h4>
          <p>We need to make sure you’re you-and not someone pretending to be you-before we can give you access to your personal and health-related information. This helps to keep your information safe, and to prevent fraud and identity theft.<br/>
            <a className="usa-button-primary" href="/verify?next=/profile">Verify Your identity</a>
          </p>
          <p><a href="/faq#verifying-your-identity">Learn more about how to verify your identity.</a></p>
        </div>}
        isVisible
        status="info"/>
    );
  } else {
    content = <p><i className="fa fa-check-circle"/> Your account has been verified.</p>;
  }

  return (
    <div>
      <h4>Account verification</h4>
      {content}
    </div>
  );
}
