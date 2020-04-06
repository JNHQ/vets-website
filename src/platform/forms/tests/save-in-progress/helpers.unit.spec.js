import { createRoutesWithSaveInProgress } from '../../save-in-progress/helpers';

describe('createRoutes', () => {
  test('should create routes with save enabled', () => {
    const formConfig = {
      chapters: {
        firstChapter: {
          pages: {
            testPage: {
              path: 'test-page',
            },
          },
        },
      },
    };

    const routes = createRoutesWithSaveInProgress(formConfig);

    expect(routes[0].path).toBe('test-page');
    expect(routes[1].path).toBe('review-and-submit');
    expect(routes[2].path).toBe('confirmation');
    expect(routes[3].path).toBe('form-saved');
    expect(routes[4].path).toBe('error');
    expect(routes[5].path).toBe('resume');
  });
});
