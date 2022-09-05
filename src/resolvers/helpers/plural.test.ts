import plural from './plural';

describe('plural()', () => {
  test('it should use -ies', () => {
    expect(
      plural('story'),
    ).toBe('stories');
  });
  test('it should add -s', () => {
    expect(
      plural('book'),
    ).toBe('books');
  });
});
