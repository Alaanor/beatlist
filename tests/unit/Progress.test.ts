import Progress from '@/libraries/common/Progress';
import ProgressGroup from '@/libraries/common/ProgressGroup';

describe('progress and progress group', () => {
  it('should track the right progress', () => {
    expect.assertions(5);

    const progress = new Progress();
    progress.setTotal(4);
    progress.plusOne();

    const { done, total } = progress.get();
    expect(done).toBe(1);
    expect(total).toBe(4);
    expect(progress.getRatio()).toBe(0.25);

    progress.plusOne();
    progress.plusOne();
    progress.plusOne();

    expect(progress.get().done).toBe(4);
    expect(progress.getRatio()).toBe(1);
  });

  it('should track the overall progress when using group', () => {
    expect.assertions(5);

    const progressOne = new Progress();
    const progressTwo = new Progress();

    progressOne.setTotal(2);
    progressTwo.setTotal(8);

    const progressGroup = new ProgressGroup();
    progressGroup.AddProgresses(progressOne, progressTwo);

    expect(progressGroup.get().total).toBe(10);

    progressOne.setTotal(4);

    expect(progressGroup.get().total).toBe(12);

    progressOne.plusOne();
    progressTwo.plusOne();
    progressTwo.plusOne();
    progressTwo.plusOne();

    const { done, total } = progressGroup.get();
    expect(done).toBe(4);
    expect(total).toBe(12);
    expect(progressGroup.getRatio()).toBe(4 / 12);
  });

  it('should be able to get a new progress directly from the group object', () => {
    expect.assertions(2);

    const group = new ProgressGroup();
    const progress = group.getNewOne();

    progress.setTotal(10);
    progress.plusOne();

    expect(group.get().total).toBe(10);
    expect(group.get().done).toBe(1);
  });
});
