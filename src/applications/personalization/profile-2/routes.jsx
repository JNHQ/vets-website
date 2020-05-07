import ProfileWrapper from './components/ProfileWrapper';
import PersonalInformation from './components/PersonalInformation';
import MilitaryInformation from './components/MilitaryInformation';
import DirectDeposit from './components/DirectDeposit';
import AccountSecurity from './components/AccountSecurity';
import ConnectedApplications from './components/ConnectedApplications';

const personalInformation = {
  path: '/profile/personal-information',
  component: PersonalInformation,
  key: 'personal-information',
  name: 'Personal and contact information',
};

const militaryInformation = {
  path: '/profile/military-information',
  component: MilitaryInformation,
  key: 'military-information',
  name: 'Military information',
};

const directDeposit = {
  path: '/profile/direct-deposit',
  component: DirectDeposit,
  key: 'direct-deposit',
  name: 'Direct deposit information',
};

const accountSecurity = {
  path: '/profile/account-security',
  component: AccountSecurity,
  key: 'account-security',
  name: 'Account security',
};

const connectedApplications = {
  path: '/profile/connected-applications',
  component: ConnectedApplications,
  key: 'connected-applications',
  name: 'Connected apps',
};

export const childRoutes = {
  personalInformation,
  militaryInformation,
  directDeposit,
  accountSecurity,
  connectedApplications,
};

const routes = {
  path: '/profile',
  component: ProfileWrapper,
  indexRoute: {
    onEnter: replace => {
      replace(personalInformation.path);
    },
  },
  childRoutes: Object.values(childRoutes),
};

export default routes;
