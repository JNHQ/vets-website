import { apiRequest } from '../../platform/utilities/api';
import recordEvent from '../../platform/monitoring/record-event';
import { watchForButtonClicks, GA_PREFIX } from './utils';

export const defaultLocale = 'en-US';
const localeRegExPattern = /^[a-z]{2}(-[A-Z]{2})?$/;
let chatBotScenario = 'unknown';
let root = null;

export const extractLocale = localeParam => {
  if (localeParam === 'autodetect') {
    return navigator.language;
  }

  // Before assigning, ensure it's a valid locale string (xx or xx-XX)
  if (localeParam.search(localeRegExPattern) === 0) {
    return localeParam;
  }
  return defaultLocale;
};

export const getUserLocation = callback => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const location = {
        lat: latitude,
        long: longitude,
      };
      callback(location);
    },
    () => {
      // user declined to share location
      callback();
    },
  );
};

const startChat = (user, webchatOptions) => {
  window.WebChat.renderWebChat(webchatOptions, root);
};

const initBotConversation = jsonWebToken => {
  // extract the data from the JWT
  const tokenPayload = JSON.parse(atob(jsonWebToken.split('.')[1]));
  const user = {
    id: tokenPayload.userId,
    name: tokenPayload.userName,
    locale: tokenPayload.locale,
  };
  let domain = undefined;
  if (tokenPayload.directLineURI) {
    domain = `https://${tokenPayload.directLineURI}/v3/directline`;
  }
  const botConnection = window.WebChat.createDirectLine({
    token: tokenPayload.connectorToken,
    domain,
  });
  const styleOptions = {
    hideSendBox: true,
    botAvatarInitials: 'VA',
    userAvatarInitials: 'You',
    backgroundColor: '#F8F8F8',
    primaryFont: 'Source Sans Pro, sans-serif',
  };

  const webchatStore = window.WebChat.createStore(
    {},
    store => next => action => {
      if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
        store.dispatch({
          type: 'DIRECT_LINE/POST_ACTIVITY',
          meta: { method: 'keyboard' },
          payload: {
            activity: {
              type: 'invoke',
              name: 'InitConversation',
              locale: user.locale,
              value: {
                // must use for authenticated conversation.
                jsonWebToken,

                // Use the following activity to proactively invoke a bot scenario

                triggeredScenario: {
                  trigger: chatBotScenario,
                },
              },
            },
          },
        });
      } else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
        if (
          action.payload?.activity?.type === 'event' &&
          action.payload?.activity?.name === 'ShareLocationEvent'
        ) {
          // share
          getUserLocation(location => {
            store.dispatch({
              type: 'WEB_CHAT/SEND_POST_BACK',
              payload: { value: JSON.stringify(location) },
            });
          });
        }
      }
      return next(action);
    },
  );
  const webchatOptions = {
    directLine: botConnection,
    styleOptions,
    store: webchatStore,
    userID: user.id,
    username: user.name,
    locale: user.locale,
  };
  try {
    startChat(user, webchatOptions);
    recordEvent({
      event: `${GA_PREFIX}-connection-successful`,
      'error-key': undefined,
    });
  } catch (error) {
    recordEvent({
      event: `${GA_PREFIX}-connection-failure`,
      'error-key': 'XX_failed_to_start_chat',
    });
  }
};

export const requestChatBot = loc => {
  const params = new URLSearchParams(location.search);
  const locale = params.has('locale')
    ? extractLocale(params.get('locale'))
    : defaultLocale;
  let path = `/coronavirus_chatbot/tokens?locale=${locale}`;

  if (loc) {
    path += `&lat=${loc.lat}&long=${loc.long}`;
  }
  if (params.has('userId')) {
    path += `&userId=${params.get('userId')}`;
  }
  if (params.has('userName')) {
    path += `&userName=${params.get('userName')}`;
  }
  return apiRequest(path, { method: 'POST' })
    .then(({ token }) => initBotConversation(token))
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
      recordEvent({
        event: `${GA_PREFIX}-connection-failure`,
        'error-key': 'XX_failed_to_init_bot_convo',
      });
    });
};
const chatRequested = scenario => {
  chatBotScenario = scenario;
  const params = new URLSearchParams(location.search);
  if (params.has('shareLocation')) {
    getUserLocation(requestChatBot);
  } else {
    requestChatBot();
  }
};

export default function initializeChatbot(_root) {
  root = _root;
  watchForButtonClicks();
  chatRequested('va_coronavirus_chatbot');
}