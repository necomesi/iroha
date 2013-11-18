describe('Iroha.Url', function () {
	describe('Iroha.Url#param', function () {
		beforeEach(function () {

		});
		it('[] で終わるキーは配列になる', function () {
			var url = 'http://example.com/?hoge[]=hoge&fuga=test&hoge[]=fuga';
			var param = Iroha.Url.create(url).param();
			expect(param.hoge).to.be.an('array');
			expect(param.hoge[0]).to.be('hoge');
			expect(param.hoge[1]).to.be('fuga');
		});
	});
});
