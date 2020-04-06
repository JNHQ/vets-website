import sinon from 'sinon';
import { shallow } from 'enzyme';

import {
  groupTimelineActivity,
  isPopulatedClaim,
  hasBeenReviewed,
  getDocTypeDescription,
  displayFileSize,
  getUserPhase,
  getUserPhaseDescription,
  getPhaseDescription,
  truncateDescription,
  getItemDate,
  isClaimComplete,
  itemsNeedingAttentionFromVet,
  makeAuthRequest,
  getClaimType,
  mockData,
} from '../../utils/helpers';

import {
  getAlertContent,
  getStatusContents,
  getNextEvents,
  makeDurationText,
  makeDecisionReviewContent,
  addStatusToIssues,
  isolateAppeal,
  STATUS_TYPES,
  AOJS,
} from '../../utils/appeals-v2-helpers';

describe('Disability benefits helpers: ', () => {
  describe('groupTimelineActivity', () => {
    test('should group events before a phase into phase 1', () => {
      const events = [
        {
          type: 'filed',
          date: '2010-05-03',
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[1][0].type).toBe('filed');
    });
    test('should filter out events without a date', () => {
      const events = [
        {
          type: 'filed',
          date: null,
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(Object.keys(phaseActivity)).toHaveLength(0);
    });
    test('should group events after phase 1 into phase 2', () => {
      const events = [
        {
          type: 'some_event',
          date: '2010-05-05',
        },
        {
          type: 'some_event',
          date: '2010-05-04',
        },
        {
          type: 'phase1',
          date: '2010-05-03',
        },
        {
          type: 'filed',
          date: '2010-05-01',
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[1][0].type).toBe('filed');
      expect(phaseActivity[2].length).toBe(3);
    });
    test('should discard micro phases', () => {
      const events = [
        {
          type: 'phase5',
          date: '2010-05-07',
        },
        {
          type: 'phase4',
          date: '2010-05-06',
        },
        {
          type: 'phase3',
          date: '2010-05-05',
        },
        {
          type: 'phase2',
          date: '2010-05-04',
        },
        {
          type: 'phase1',
          date: '2010-05-03',
        },
        {
          type: 'filed',
          date: '2010-05-01',
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[3].length).toBe(1);
      expect(phaseActivity[3][0].type).toBe('phase_entered');
    });
    test('should group events into correct bucket', () => {
      const events = [
        {
          type: 'received_from_you_list',
          date: '2016-11-02',
        },
        {
          type: 'received_from_you_list',
          date: '2016-11-02',
        },
        {
          type: 'received_from_you_list',
          date: '2016-11-02',
        },
        {
          type: 'received_from_you_list',
          date: '2016-11-02',
        },
        {
          type: 'phase5',
          date: '2016-11-02',
        },
        {
          type: 'phase4',
          date: '2016-11-02',
        },
        {
          type: 'phase3',
          date: '2016-11-02',
        },
        {
          type: 'phase2',
          date: '2016-11-02',
        },
        {
          type: 'other_documents_list',
          uploadDate: '2016-03-24',
        },
        {
          type: 'other_documents_list',
          uploadDate: '2015-08-28',
        },
        {
          type: 'other_documents_list',
          uploadDate: '2015-08-28',
        },
        {
          type: 'phase1',
          date: '2015-04-20',
        },
        {
          type: 'filed',
          date: '2015-04-20',
        },
        {
          type: 'other_documents_list',
          uploadDate: null,
        },
      ];

      const phaseActivity = groupTimelineActivity(events);

      expect(phaseActivity[3].length).toBe(5);
      expect(phaseActivity[3][4].type).toBe('phase_entered');
      expect(phaseActivity[2].length).toBe(4);
      expect(phaseActivity[1].length).toBe(1);
    });
  });
  describe('isPopulatedClaim', () => {
    test('should return false if any field is empty', () => {
      const claim = {
        attributes: {
          claimType: 'something',
          contentionList: ['thing'],
          dateFiled: '',
        },
      };

      expect(isPopulatedClaim(claim)).toBe(false);
    });

    test('should return true if no field is empty', () => {
      const claim = {
        attributes: {
          claimType: 'something',
          contentionList: ['thing'],
          dateFiled: 'asdf',
          vaRepresentative: null,
        },
      };

      expect(isPopulatedClaim(claim)).toBe(true);
    });

    test('should return false if contention list is empty', () => {
      const claim = {
        attributes: {
          claimType: 'something',
          contentionList: [],
          dateFiled: 'asdf',
          vaRepresentative: 'test',
        },
      };

      expect(isPopulatedClaim(claim)).toBe(false);
    });
  });
  describe('truncateDescription', () => {
    test('should truncate text longer than 120 characters', () => {
      const userText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris';
      const userTextEllipsed =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq…';

      const text = truncateDescription(userText);
      expect(text).toBe(userTextEllipsed);
    });
  });
  describe('hasBeenReviewed', () => {
    test('should check that item is reviewed', () => {
      const result = hasBeenReviewed({
        type: 'received_from_you_list',
        status: 'ACCEPTED',
      });

      expect(result).toBe(true);
    });
    test('should check that item has not been reviewed', () => {
      const result = hasBeenReviewed({
        type: 'received_from_you_list',
        status: 'SUBMITTED_AWAITING_REVIEW',
      });

      expect(result).toBe(false);
    });
  });
  describe('getDocTypeDescription', () => {
    test('should get description by type', () => {
      const result = getDocTypeDescription('L070');

      expect(result).toBe('Photographs');
    });
  });
  describe('displayFileSize', () => {
    test('should show size in bytes', () => {
      const size = displayFileSize(2);

      expect(size).toBe('2B');
    });
    test('should show size in kilobytes', () => {
      const size = displayFileSize(1026);

      expect(size).toBe('1KB');
    });
    test('should show size in megabytes', () => {
      const size = displayFileSize(2097152);

      expect(size).toBe('2MB');
    });
  });
  describe('getUserPhase', () => {
    test('should get phase 3 desc for 4-6', () => {
      const phase = getUserPhase(5);

      expect(phase).toBe(3);
    });
  });
  describe('getUserPhaseDescription', () => {
    test('should get description for 3', () => {
      const desc = getUserPhaseDescription(3);

      expect(desc).toBe('Evidence gathering, review, and decision');
    });
  });
  describe('getPhaseDescription', () => {
    test('should display description from map', () => {
      const desc = getPhaseDescription(2);

      expect(desc).toBe('Initial review');
    });
  });
  describe('getItemDate', () => {
    test('should use the received date', () => {
      const date = getItemDate({
        receivedDate: '2010-01-01',
        documents: [{ uploadDate: '2011-01-01' }],
        date: '2012-01-01',
      });

      expect(date).toBe('2010-01-01');
    });
    test('should use the last document upload date', () => {
      const date = getItemDate({
        receivedDate: null,
        documents: [{ uploadDate: '2011-01-01' }, { uploadDate: '2012-01-01' }],
        date: '2013-01-01',
      });

      expect(date).toBe('2012-01-01');
    });
    test('should use the date', () => {
      const date = getItemDate({
        receivedDate: null,
        documents: [],
        date: '2013-01-01',
      });

      expect(date).toBe('2013-01-01');
    });
    test('should use the upload date', () => {
      const date = getItemDate({
        uploadDate: '2014-01-01',
        type: 'other_documents_list',
        date: '2013-01-01',
      });

      expect(date).toBe('2014-01-01');
    });
  });
  describe('isClaimComplete', () => {
    test('should check if claim is in complete phase', () => {
      const isComplete = isClaimComplete({
        attributes: {
          phase: 8,
        },
      });

      expect(isComplete).toBe(true);
    });
    test('should check if claim has decision letter', () => {
      const isComplete = isClaimComplete({
        attributes: {
          decisionLetterSent: true,
        },
      });

      expect(isComplete).toBe(true);
    });
  });
  describe('itemsNeedingAttentionFromVet', () => {
    test('should return number of needed items from vet', () => {
      const itemsNeeded = itemsNeedingAttentionFromVet([
        {
          type: 'still_need_from_you_list',
          status: 'NEEDED',
        },
        {
          type: 'still_need_from_you_list',
          status: 'SUBMITTED_AWAITING_REVIEW',
        },
        {
          type: 'still_need_from_others_list',
          status: 'NEEDED',
        },
      ]);

      expect(itemsNeeded).toBe(1);
    });
  });

  describe('getClaimType', () => {
    test('should return the claim type', () => {
      const claim = {
        attributes: {
          claimType: 'Awesome',
        },
      };
      expect(getClaimType(claim)).toBe('awesome');
    });
    test('should return the default claim type', () => {
      const claim = {
        attributes: {
          claimType: undefined,
        },
      };
      expect(getClaimType(claim)).toBe('disability compensation');
    });
  });

  describe('makeAuthRequest', () => {
    let fetchMock = sinon.stub();
    let oldFetch = global.fetch;
    beforeEach(() => {
      oldFetch = global.fetch;
      fetchMock = sinon.stub();
      global.fetch = fetchMock;
    });
    afterEach(() => {
      global.fetch = oldFetch;
    });
    test('should make a fetch request', done => {
      fetchMock.returns({
        catch: () => ({
          then: fn => fn({ ok: true, json: () => Promise.resolve() }),
        }),
      });

      const onSuccess = () => done();
      makeAuthRequest('/testing', null, sinon.spy(), onSuccess);

      expect(fetchMock.called).toBe(true);
      expect(fetchMock.firstCall.args[0]).toEqual(
        expect.arrayContaining(['/testing']),
      );
      expect(fetchMock.firstCall.args[1].method).toBe('GET');
    });
    test('should reject promise when there is an error', done => {
      fetchMock.returns({
        catch: () => ({
          then: fn =>
            fn({ ok: false, status: 500, json: () => Promise.resolve() }),
        }),
      });

      const onError = resp => {
        expect(resp.ok).toBe(false);
        done();
      };
      makeAuthRequest('/testing', null, sinon.spy(), sinon.spy(), onError);

      expect(fetchMock.called).toBe(true);
      expect(fetchMock.firstCall.args[0]).toEqual(
        expect.arrayContaining(['/testing']),
      );
      expect(fetchMock.firstCall.args[1].method).toBe('GET');
    });
    test('should dispatch auth error', done => {
      fetchMock.returns({
        catch: () => ({
          then: fn =>
            fn({ ok: false, status: 401, json: () => Promise.resolve() }),
        }),
      });

      const onError = sinon.spy();
      const onSuccess = sinon.spy();
      const dispatch = action => {
        expect(action.type).toBe('SET_UNAUTHORIZED');
        expect(onError.called).toBe(false);
        expect(onSuccess.called).toBe(false);
        done();
      };

      makeAuthRequest('/testing', null, dispatch, onSuccess, onError);
    });
  });

  describe('getStatusContents', () => {
    test('returns an object with correct title & description', () => {
      const expectedTitle = 'The Board made a decision on your appeal';
      const expectedDescSnippet =
        'The judge granted the following issue:Reasonableness of attorney fees';
      const contents = getStatusContents(mockData.data[6]);
      expect(contents.title).toBe(expectedTitle);
      const descText = shallow(contents.description);
      expect(descText.render().text()).toEqual(
        expect.arrayContaining([expectedDescSnippet]),
      );
      descText.unmount();
    });

    test('returns sane object when given unknown type', () => {
      const contents = getStatusContents({
        attributes: { status: { type: 'fake_type' } },
      });
      expect(contents.title).toBe('We don’t know your status');
      expect(contents.description.props.children).toBe(
        'We’re sorry, VA.gov will soon be updated to show your status.',
      );
    });
  });

  describe('makeDurationText', () => {
    const inputs = {
      exactSingular: [1, 1],
      exactPlural: [2, 2],
      range: [1, 8],
      empty: [],
      nonsense: 'danger, danger',
    };

    test('should return an object with header and description properties', () => {
      const testText = makeDurationText(inputs.exactSingular);
      expect(!!testText.header && !!testText.description).toBe(true);
    });

    test('should return an object with header and description properties with nonsense input', () => {
      const testText = makeDurationText(inputs.nonsense);
      expect(testText.header).toBe('');
      expect(testText.description).toBe('');
    });

    test('should return an object with header and description properties with empty array input', () => {
      const testText = makeDurationText(inputs.empty);
      expect(testText.header).toBe('');
      expect(testText.description).toBe('');
    });

    test('should return an object with header and description properties with no input', () => {
      const testText = makeDurationText();
      expect(testText.header).toBe('');
      expect(testText.description).toBe('');
    });

    test('should format exact singular time estimates', () => {
      const testText = makeDurationText(inputs.exactSingular);
      expect(testText.header).toBe('1 month');
      expect(testText.description).toBe('about 1 month');
    });

    test('should format exact plural time estimates', () => {
      const testText = makeDurationText(inputs.exactPlural);
      expect(testText.header).toBe('2 months');
      expect(testText.description).toBe('about 2 months');
    });

    test('should format range time estimates', () => {
      const testText = makeDurationText(inputs.range);
      expect(testText.header).toBe('1–8 months');
      expect(testText.description).toBe('between 1 and 8 months');
    });
  });

  describe('getNextEvents', () => {
    test('returns an object with a header property', () => {
      const type = STATUS_TYPES.pendingCertificationSsoc;
      const details = {
        certificationTimeliness: [1, 2],
        ssocTimeliness: [1, 1],
      };
      const nextEvents = getNextEvents({
        attributes: { status: { type, details } },
      });
      expect(nextEvents.header).toBe(
        'What happens next depends on whether you submit new evidence.',
      );
    });

    test('returns an object with an events array property', () => {
      const type = STATUS_TYPES.remandSsoc;
      // 'remandSsoc' status has 2 nextEvents in the array
      const details = {
        returnTimeliness: [1, 2],
        remandSsocTimeliness: [1, 1],
      };
      const nextEvents = getNextEvents({
        attributes: { status: { type, details } },
      });
      const { events } = nextEvents;
      expect(events.length).toBe(2);
      const firstEvent = events[0];
      const secondEvent = events[1];
      // each of the 2 'remandSsoc' nextEvents has 4 properties
      expect(Object.keys(firstEvent).length).toBe(4);
      expect(Object.keys(secondEvent).length).toBe(4);
    });
  });

  describe('getAlertContent', () => {
    test('returns an object with title, desc, displayType, and type', () => {
      const alert = {
        type: 'ramp_eligible',
        details: {
          representative: 'Mr. Spock',
        },
      };

      const alertContent = getAlertContent(alert);
      expect(alertContent.title).toBeDefined();
      expect(alertContent.description).toBeDefined();
      expect(alertContent.displayType).toBeDefined();
      expect(alertContent.type).toBeDefined();
    });
  });

  describe('addStatusToIssues', () => {
    test('returns an array of same length as input array', () => {
      const { issues } = mockData.data[2].attributes;
      const formattedIssues = addStatusToIssues(issues);
      expect(formattedIssues.length).toBe(issues.length);
    });

    test('returns an array of objects, each with status and description', () => {
      const { issues } = mockData.data[2].attributes;
      const formattedIssues = addStatusToIssues(issues);
      expect(formattedIssues.every(i => i.status && i.description)).toBe(true);
    });
  });

  describe('makeDecisionReviewContent', () => {
    test('returns the default content if no additional content is provided', () => {
      const decisionReviewContent = makeDecisionReviewContent();
      const descText = shallow(decisionReviewContent);
      expect(descText.render().text()).toBe(
        'A Veterans Law Judge will review all of the available evidence and write a decision. For each issue you’re appealing, they can decide to:Grant: The judge disagrees with the original decision and decides in your favor.Deny: The judge agrees with the original decision.Remand: The judge sends the issue back to the Veterans Benefits Administration to gather more evidence or to fix a mistake before deciding whether to grant or deny.Note: About 60% of all cases have at least 1 issue remanded.',
      );
      descText.unmount();
    });

    test('returns additional content when provided', () => {
      const decisionReviewContent = makeDecisionReviewContent({
        prop:
          'Once your representative has completed their review, your case will be ready to go to a Veterans Law Judge.',
      });
      const descText = shallow(decisionReviewContent);
      expect(descText.render().text()).toBe(
        'Once your representative has completed their review, your case will be ready to go to a Veterans Law Judge. The judge will review all of the available evidence and write a decision. For each issue you’re appealing, they can decide to:Grant: The judge disagrees with the original decision and decides in your favor.Deny: The judge agrees with the original decision.Remand: The judge sends the issue back to the Veterans Benefits Administration to gather more evidence or to fix a mistake before deciding whether to grant or deny.Note: About 60% of all cases have at least 1 issue remanded.',
      );
      descText.unmount();
    });

    test('uses the name of the aoj', () => {
      const decisionReviewContent = makeDecisionReviewContent({
        aoj: AOJS.nca,
      });
      const descText = shallow(decisionReviewContent);
      expect(descText.render().text()).toEqual(
        expect.arrayContaining(['National Cemetery Administration']),
      );
      descText.unmount();
    });

    test('adjusts language for ama appeals', () => {
      const decisionReviewContent = makeDecisionReviewContent({ isAma: true });
      const descText = shallow(decisionReviewContent);
      expect(descText.render().text()).toEqual(
        expect.not.arrayContaining([
          '60% of all cases have at least 1 issue remanded.',
        ]),
      );
      descText.unmount();
    });
  });

  describe('isolateAppeal', () => {
    const state = {
      disability: {
        status: {
          claimsV2: {
            appeals: mockData.data,
          },
        },
      },
    };

    test('should find the right appeal if the given id matches', () => {
      const expectedAppeal = mockData.data[1];
      const appeal = isolateAppeal(state, expectedAppeal.id);
      expect(appeal).toBe(expectedAppeal);
    });

    test('should find the right appeal if the given v1 id matches a v2 appeal', () => {
      const expectedAppeal = mockData.data[1];
      // appealIds[1] is the fake v1 id
      const appeal = isolateAppeal(
        state,
        expectedAppeal.attributes.appealIds[1],
      );
      expect(appeal).toBe(expectedAppeal);
    });

    test('should return undefined if no appeal matches the id given', () => {
      const appeal = isolateAppeal(state, 'non-existent id');
      expect(appeal).toBeUndefined();
    });
  });
});
