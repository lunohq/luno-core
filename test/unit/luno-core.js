import luno from '../../src/luno-core';

describe('luno', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(luno, 'greet');
      luno.greet();
    });

    it('should have been run once', () => {
      expect(luno.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(luno.greet).to.have.always.returned('hello');
    });
  });
});
