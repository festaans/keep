describe('app version', function() {
  beforeEach(module('myApp.versioning'));
  it('should return current version', inject(function(version) {
    expect(version).toEqual('0.1');
  }));
});
