const webFilter = require('../src/webFilter');

test('Web filtering', () => {
  expect(webFilter.filter('example.com')).toBe(false);
  expect(webFilter.filter('work-related-site.com')).toBe(true);
});
