describe('Iroha', function () {

	var $sandbox = $('#sandbox');

	// Iroha.ViewClass
	describe('Iroha.ViewClass', function () {
		beforeEach(function () {
			$sandbox.empty().append('<div id="main"/>');
		});

		it('クラスが生成できる', function () {
			var Constructor = function () {
				this.x = 0;
				this.y = 100;
			};
			var ViewClass = Iroha.ViewClass(Constructor);
			expect(ViewClass).to.be.an('function');
		});

		it('Iroha.applyTo');

		it('Iroha.ViewClass で生成したクラスのインスタンスは必要なプロパティを備えている', function () {
			var Constructor = function () {
				this.x = 0;
				this.y = 100;
			};
			var ViewClass = Iroha.ViewClass(Constructor);
			var instance = ViewClass.create($('#main'));
			expect(ViewClass).to.have.property('instances');
			expect(ViewClass).to.have.property('key');
			expect(instance).to.have.property('init');
			expect(instance).to.have.property('dispose');
			expect(instance).to.have.property('appendTo');
			expect(instance).to.have.property('prependTo');
			expect(instance).to.have.property('insertBefore');
			expect(instance).to.have.property('insertAfter');
		});

		it('Iroha.ViewClass で生成したクラスを拡張できる');
	});


	// Iroha.Number
	describe('Iroha.Number', function () {
		it('Iroha.Number をインスタンス化できる', function () {
			var number1 = Iroha.Number(123);
			var number2 = new Iroha.Number(123);
			expect(number1).to.be.an(Iroha.Number);
			expect(number2).to.be.an(Iroha.Number);
			expect(number1.value).to.be(123);
			expect(number2.value).to.be(123);
		});

		it('Iroha.Number#toString で文字列表現を返す', function () {
			var number = Iroha.Number(123);
			expect(number.toString()).to.be('123');
		});

		it('Iroha.Number#get で現在の数値を返す', function () {
			var number = Iroha.Number(123);
			expect(number.get()).to.be(123);
		});

		it('Iroha.Number#format でフォーマット文字列化する', function () {
			expect(Iroha.Number('56').format('000').get()).to.be('056');
			expect(Iroha.Number('123456').format('###').get()).to.be('456');
			expect(Iroha.Number('123456.78').format('#,###,###').get()).to.be('123,457');
			expect(Iroha.Number('123456.78').format('#,###,###.#').get()).to.be('123,456.8');
			expect(Iroha.Number('-123456.78').format('0,###,###.000').get()).to.be('-0,123,456.780');
		});
	});


	// Iroha.String
	describe('Iroha.String', function () {
		it('Iroha.String をインスタンス化できる', function () {
			var string1 = Iroha.String('abc');
			var string2 = new Iroha.String('abcde');
			expect(string1).to.be.an(Iroha.String);
			expect(string2).to.be.an(Iroha.String);
			expect(string1.value).to.be('abc');
			expect(string2.value).to.be('abcde');
			expect(string1.length).to.be(3);
			expect(string2.length).to.be(5);
		});

		it('Iroha.String.random でランダムな文字列を得る', function () {
			expect(Iroha.String.random()).to.be.an(Iroha.String);
			expect(Iroha.String.random().length).to.be(24);
			expect(Iroha.String.random().get()).to.match(/[0-9a-zA-Z]{24}/);
			expect(Iroha.String.random(5).get()).to.match(/[0-9a-zA-Z]{5}/);
			expect(Iroha.String.random(10, 'a').get()).to.be('aaaaaaaaaa');
		});

		it('Iroha.String.guid でグローバル一意識別子を得る', function () {
			expect(Iroha.String.guid()).to.be.an(Iroha.String);
			expect(Iroha.String.guid().length).to.be(36);
			expect(Iroha.String.guid().get()).to.match(/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/);
		});

		it('Iroha.String#toString で現在の文字列を取得する', function () {
			expect(Iroha.String('test').toString()).to.be('test');
		});

		it('Iroha.String#get で現在の文字列を取得する', function () {
			expect(Iroha.String('test').get()).to.be('test');
		});

		it('Iroha.String#format で指定の形式に変換する', function () {
			expect(Iroha.String('${0}HOGE${1}FUGA${2}').format('xxx', 'yyy', 'zzz').get()).to.be('xxxHOGEyyyFUGAzzz');
			expect(Iroha.String('${0}HOGE${1}FUGA${2}').format('xxx', 'yyy', 'zzz').length).to.be(17);
			expect(Iroha.String('${0}HOGE${1}FUGA${2}').format([ 'xxx', 'yyy', 'zzz' ]).get()).to.be('xxxHOGEyyyFUGAzzz');
			expect(Iroha.String('${A}HOGE${B}FUGA${C}').format({ A: 'xxx', B: 'yyy', C: 'zzz' }).get()).to.be('xxxHOGEyyyFUGAzzz');
			expect(Iroha.String('${A}HOGE${B.C}FUGA${B.D.E}').format({ A: 'xxx', B: { C: 'yyy', D: { E: 'zzz' } } }).get()).to.be('xxxHOGEyyyFUGAzzz');
		});

		it('Iroha.String#getBefore で指定の文字列より前の部分の文字列を得る', function () {
			expect(Iroha.String('ABCDEFGDEFGDEFG').getBefore('ABC').get()).to.be('');
			expect(Iroha.String('ABCDEFGDEFGDEFG').getBefore('DEF').get()).to.be('ABC');
			expect(Iroha.String('ABCDEFGDEFGDEFG').getBefore('DEF').length).to.be(3);
			expect(Iroha.String('ABCDEFGDEFGDEFG').getBefore('DEF', true).get()).to.be('ABCDEF');
			expect(Iroha.String('ABCDEFGDEFGDEFG').getBefore('DEF', false, true).get()).to.be('ABCDEFGDEFG');
			expect(Iroha.String('ABCDEFGDEFGDEFG').getBefore('DEF', true, true).get()).to.be('ABCDEFGDEFGDEF');
		});

		it('Iroha.String#getAfter で指定の文字列より後ろの部分の文字列を得る', function () {
			expect(Iroha.String('ABCDABCDEFGHI').getAfter('GHI').get()).to.be('');
			expect(Iroha.String('ABCDABCDEFGHI').getAfter('BCD').get()).to.be('EFGHI');
			expect(Iroha.String('ABCDABCDEFGHI').getAfter('BCD').length).to.be(5);
			expect(Iroha.String('ABCDABCDEFGHI').getAfter('BCD', true).get()).to.be('BCDEFGHI');
			expect(Iroha.String('ABCDABCDEFGHI').getAfter('BCD', false, true).get()).to.be('ABCDEFGHI');
			expect(Iroha.String('ABCDABCDEFGHI').getAfter('BCD', true, true).get()).to.be('BCDABCDEFGHI');
		});

		it('Iroha.String#trim で裁ち落とし処理をする', function () {
			var string = 'Iroha : Necomesi JS Library.  その発祥は、今を遡ること15年前。太古の昔より綿々、細々と使いつづけてきている、コジカ家秘伝の JS ライブラリ。年季の積み重ねの変遷から無駄にどろっとしていて、さぞ使いづらいと思います。';
			expect(Iroha.String(string).trim(20).get()).to.be('Iroha : Necomesi JS…');
			expect(Iroha.String(string).trim(20).length).to.be(20);
			expect(Iroha.String(string).trim(50).get()).to.be('Iroha : Necomesi JS Library.  その発祥は、今を遡ること15年前。太古…');
			expect(Iroha.String(string).trim(50, "start").get()).to.be('Iroha : Necomesi JS Library.  その発祥は、今を遡ること15年前。太古…');
			expect(Iroha.String(string).trim(50, "end").get()).to.be('…伝の JS ライブラリ。年季の積み重ねの変遷から無駄にどろっとしていて、さぞ使いづらいと思います。');
			expect(Iroha.String(string).trim(50, "both").get()).to.be('Iroha : Necomesi JS Libra…駄にどろっとしていて、さぞ使いづらいと思います。');
			expect(Iroha.String(string).trim(50, "start", '猫').get()).to.be('Iroha : Necomesi JS Library.  その発祥は、今を遡ること15年前。太古猫');
			expect(Iroha.String(string).trim(50, "end", '猫').get()).to.be('猫伝の JS ライブラリ。年季の積み重ねの変遷から無駄にどろっとしていて、さぞ使いづらいと思います。');
			expect(Iroha.String(string).trim(50, "both", '猫').get()).to.be('Iroha : Necomesi JS Libra猫駄にどろっとしていて、さぞ使いづらいと思います。');
			expect(Iroha.String(string).trim(50, "start", '...').get()).to.be('Iroha : Necomesi JS Library.  その発祥は、今を遡ること15年前。...');
			expect(Iroha.String(string).trim(50, "end", '...').get()).to.be('... JS ライブラリ。年季の積み重ねの変遷から無駄にどろっとしていて、さぞ使いづらいと思います。');
			expect(Iroha.String(string).trim(50, "both", '...').get()).to.be('Iroha : Necomesi JS Libr...にどろっとしていて、さぞ使いづらいと思います。');
		});

		it('Iroha.String#startsWith で現在の文字列が指定文字列から始まっていれば true を返す', function () {
			expect(Iroha.String('ABCDE').startsWith('ABC')).to.be(true);
			expect(Iroha.String('ABCDE').startsWith('BCD')).to.be(false);
		});

		it('Iroha.String#endsWith で現在の文字列が指定文字列で終わっていれば true を返す', function () {
			expect(Iroha.String('ABCDE').endsWith('CDE')).to.be(true);
			expect(Iroha.String('ABCDE').endsWith('BCD')).to.be(false);
		});

		it('Iroha.String#contains で現在の文字列に指定文字列が含まれていれば true を返す', function () {
			expect(Iroha.String('ABCDE').contains('ABC')).to.be(true);
			expect(Iroha.String('ABCDE').contains('BCD')).to.be(true);
			expect(Iroha.String('ABCDE').contains('CDE')).to.be(true);
			expect(Iroha.String('ABCDE').contains('ACE')).to.be(false);
		});

		it('Iroha.String#isMatch で現在の文字列が指定文字列と完全に一致するなら true を返す', function () {
			expect(Iroha.String('ABCDE').isMatch('ABCD')).to.be(false);
			expect(Iroha.String('ABCDE').isMatch('ABCDE')).to.be(true);
			expect(Iroha.String('ABCDE').isMatch('ABCDEF')).to.be(false);
			expect(Iroha.String('12345').isMatch('12345')).to.be(true);
			expect(Iroha.String('12345').isMatch(12345)).to.be(false);
		});

		it('Iroha.String#rel2abs で相対パス(URL)を絶対パス(URL)へ変換する', function () {
			expect(Iroha.String('../target/').rel2abs('/path/to/base/').get()).to.be('/path/to/target/');
			expect(Iroha.String('../target/').rel2abs('http://path/to/base/').get()).to.be('http://path/to/target/');
		});

		it('Iroha.String#abs2rel で絶対パス(URL)を相対パス(URL)へ変換する', function () {
			expect(Iroha.String('/path/to/target/').abs2rel('/path/to/base/').get()).to.be('../target/');
			expect(Iroha.String('http://path/to/target/').abs2rel('http://path/to/base/').get()).to.be('../target/');
		});

		it('Iroha.String#replace で文字列を置換する', function () {
			expect(Iroha.String('ABCDEABCDEABCDE').replace('ABC', 'X').get()).to.be('XDEABCDEABCDE');
			expect(Iroha.String('ABCDEABCDEABCDE').replace('ABC', 'X').length).to.be(13);
			expect(Iroha.String('ABCDEABCDEABCDE').replace(/ABC/, 'X').get()).to.be('XDEABCDEABCDE');
			expect(Iroha.String('ABCDEABCDEABCDE').replace(/ABC/g, 'X').get()).to.be('XDEXDEXDE');
		});

		it('Iroha.String#sanitize で文字列をサニタイズする', function () {
			expect(Iroha.String('<a href="?a=b&c=d">Neco\'s Mesi</a>').sanitize().get()).to.be('&lt;a href=&quot;?a=b&amp;c=d&quot;&gt;Neco&apos;s Mesi&lt;/a&gt;');
		});

		it('Iroha.String#encodeURI で文字列を％エスケープに変換する');

		it('Iroha.String#decodeURI で％エスケープされた文字列を元に戻す');
	});

});
