import { computeDifference } from '@/libraries/common/Differences';

describe('differences', () => {
  it('should give the right differences', () => {
    expect.assertions(3);

    const difference = computeDifference([0, 1, 2], [1, 2, 3]);

    expect(difference.added).toHaveLength(1);
    expect(difference.removed).toHaveLength(1);
    expect(difference.kept).toHaveLength(2);
  });
});
