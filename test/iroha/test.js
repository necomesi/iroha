describe('Iroha', function () {

	var $sandbox = $('#test-sandbox');

	// Array.prototype
	describe('Array.prototype', function () {

	});

	// Iroha.ViewClass
	describe('Iroha.ViewClass', function () {
		it('Iroha.ViewClass(Constructor) でクラスが生成できる', function () {
			var Constructor = function () {
				this.x = 0;
				this.y = 100;
				this.key = 'abc';
			};
			var ViewClass = Iroha.ViewClass(Constructor);
			expect(ViewClass).to.be(Constructor);
			expect(ViewClass).to.be.an('function');
			expect(ViewClass).to.have.property('instances');
			expect(ViewClass).to.have.property('key');
			expect(ViewClass.key.indexOf('Iroha.ViewClass') === 0).to.be(true);
		});

		it('new Iroha.ViewClass(Constructor) でクラスが生成できる', function () {
			var Constructor = function () {
				this.x = 0;
				this.y = 100;
				this.key = 'abc';
			};
			var ViewClass = Iroha.ViewClass(Constructor);
			expect(ViewClass).to.be(Constructor);
			expect(ViewClass).to.be.an('function');
			expect(ViewClass).to.have.property('instances');
			expect(ViewClass).to.have.property('key');
			expect(ViewClass.key.indexOf('Iroha.ViewClass') === 0).to.be(true);
		});

		it('Iroha.applyTo');

		describe('Iroha.ViewClass で生成されたクラス', function () {
			var ViewClass;

			beforeEach(function () {
				function _Constructor() {
					this.x = 0;
					this.y = 100;
				}
				ViewClass = Iroha.ViewClass(_Constructor);
				$sandbox.empty().append('<div id="test-main"/><div id="test-main2"/>');
			});

			it('ViewClass.create でインスタンス化できる', function () {
				var instance = ViewClass.create('#test-main');
				expect(instance).to.be.a(ViewClass);
				expect(instance.$node[0]).to.be(document.getElementById('test-main'));
				expect(instance.$node.length).to.be(1);
			});

			it('new ViewClass でインスタンス化できる', function () {
				var instance = new ViewClass('#test-main');
				expect(instance).to.be.a(ViewClass);
				expect(instance.$node[0]).to.be(document.getElementById('test-main'));
				expect(instance.$node.length).to.be(1);
			});

			it('文字列を引数としてインスタンス化したとき、それを queryString として解釈し取得された最初の要素を基底ノードとしてインスタンス化する', function () {
				var instance = ViewClass.create('#test-sandbox div');
				expect(instance).to.be.a(ViewClass);
				expect(instance.$node[0]).to.be(document.getElementById('test-main'));
				expect(instance.$node.length).to.be(1);
			});

			it('要素ノードを引数としてインスタンス化したとき、それを基底ノードとしてインスタンス化する', function () {
				var instance = ViewClass.create(document.getElementById('test-main'));
				expect(instance).to.be.a(ViewClass);
				expect(instance.$node[0]).to.be(document.getElementById('test-main'));
				expect(instance.$node.length).to.be(1);
			});

			it('jQuery オブジェクトを引数としてインスタンス化したとき、その最初の要素を基底ノードとしてインスタンス化する', function () {
				var instance = ViewClass.create($sandbox.find('div'));
				expect(instance).to.be.a(ViewClass);
				expect(instance.$node[0]).to.be(document.getElementById('test-main'));
				expect(instance.$node.length).to.be(1);
			});

			it('インスタンスは必要なプロパティを備えている', function () {
				ViewClass.prototype.hoge = 1;
				ViewClass.prototype.fuga = function () {
					return 1;
				};
				var instance = ViewClass.create('#test-main');
				expect(instance).to.have.property('init');
				expect(instance).to.have.property('dispose');
				expect(instance).to.have.property('appendTo');
				expect(instance).to.have.property('prependTo');
				expect(instance).to.have.property('insertBefore');
				expect(instance).to.have.property('insertAfter');
				expect(instance).to.have.property('hoge');
				expect(instance).to.have.property('fuga');
			});
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


	// Iroha.StyleSheet
	describe('Iroha.StyleSheet', function () {
		it('Iroha.StyleSheet をインスタンス化できる', function () {
			var styleSheet = Iroha.StyleSheets.create();
			expect(styleSheet).to.be.an(Iroha.StyleSheets);
		});

		it('引数なしでインスタンス化したとき、ページのスタイルシートを自身に持つ', function () {
			var styles = document.styleSheets;
			var styleSheets = Iroha.StyleSheets.create();
			expect(styleSheets[0]).to.be(styles[0]);
		});
	});


	// Iroha.Observable
	describe('Iroha.Observable', function () {
		it('Iroha.Observable をインスタンス化できる', function () {
			var obs = new Iroha.Observable();
			expect(obs).to.be.an(Iroha.Observable);
		});

		it('addCallback でコールバック関数を登録でき、 doCallback で登録した関数が実行される', function (done) {
			var obs = new Iroha.Observable();
			obs.addCallback('hoge', function () {
				done();
			});
			obs.doCallback('hoge');
		});

		it('doCallback に引数を渡すと、それが登録したコールバック関数の引数となる', function (done) {
			var obs = new Iroha.Observable();
			obs.addCallback('hoge', function (a, b, c) {
				expect(a).to.be('a');
				expect(b).to.be('b');
				expect(c).to.be('c');
				done();
			});
			obs.doCallback('hoge', 'a', 'b', 'c');
		});

		it('addCallback で複数のコールバックスを登録でき、 doCallback で登録した関数が順に実行される', function (done) {
			var obs = new Iroha.Observable();
			var array = [];
			obs.addCallback('hoge', function (a, b, c) {
				array.push('a');
				expect(a).to.be('a');
				expect(b).to.be('b');
				expect(c).to.be('c');
				expect(array.length).to.be(1);
			});
			obs.addCallback('hoge', function (a, b, c) {
				array.push('b');
				expect(a).to.be('a');
				expect(b).to.be('b');
				expect(c).to.be('c');
				expect(array.length).to.be(2);
				expect(array[0]).to.be('a');
				done();
			});
			obs.doCallback('hoge', 'a', 'b', 'c');
		});

		it('addCallback の第３引数にオブジェクトを指定するとコールバック関数の実行コンテキストを指定できる', function (done) {
			var obs = new Iroha.Observable();
			var obj = { x : 100 };
			obs.addCallback('hoge', function () {
				expect(this.x).to.be(100);
				done();
			}, obj);
			obs.doCallback('hoge');
		});

		it('addCallback の第４引数に \'disposable\' を指定すると一度しかコールバックされない関数を登録できる', function () {
			var obs = new Iroha.Observable();
			var array = [];
			obs.addCallback('hoge', function () { array.push('a') }, null, 'disposable');
			obs.addCallback('hoge', function () { array.push('b') }                    );
			obs.doCallback('hoge');
			obs.doCallback('hoge');
			expect(array[0]).to.be('a');
			expect(array[1]).to.be('b');
			expect(array[2]).to.be('b');
		});

		it('removeCallback で登録したコールバック関数を除去する', function () {
			var obs = new Iroha.Observable();
			var func = function () {};
			obs.addCallback('hoge', func);
			obs.addCallback('fuga', func);
			expect(obs.callbackChains['hoge'].length).to.be(1);
			expect(obs.callbackChains['fuga'].length).to.be(1);
			obs.removeCallback('hoge', func);
			expect(obs.callbackChains['hoge']).not.to.be.ok();
			expect(obs.callbackChains['fuga'].length).to.be(1);
		});

		it('removeCallback を第２引数を空で呼び出すことで登録したコールバック関数をすべて除去する', function () {
			var obs = new Iroha.Observable();
			var func = function () {};
			obs.addCallback('hoge', func);
			obs.addCallback('hoge', func);
			obs.addCallback('fuga', func);
			obs.addCallback('fuga', func);
			expect(obs.callbackChains['hoge'].length).to.be(2);
			expect(obs.callbackChains['fuga'].length).to.be(2);
			obs.removeCallback('hoge');
			expect(obs.callbackChains['hoge']).not.to.be.ok();
			expect(obs.callbackChains['fuga'].length).to.be(2);
		});

		it('removeCallback するときは addCallback した時に指定した関数と aThisObject のペアが一致している必要がある', function () {
			var obs = new Iroha.Observable();
			var func = function () {};
			var obj1 = { x : 100 };
			var obj2 = { x : 100 };
			obs.addCallback('hoge', func, obj1);
			expect(obs.callbackChains['hoge'].length).to.be(1);
			obs.removeCallback('hoge', func);
			expect(obs.callbackChains['hoge'].length).to.be(1);
			obs.removeCallback('hoge', func, obj2);
			expect(obs.callbackChains['hoge'].length).to.be(1);
			obs.removeCallback('hoge', func, obj1);
			expect(obs.callbackChains['hoge']).not.to.be.ok();
		});

		it('ignoreCallback に \'preserved\' を渡すと disposable でないコールバック関数が無視される', function () {
			var obs = new Iroha.Observable();
			var count = 0;
			obs.addCallback('hoge', function () { count++ }, null);
			obs.addCallback('hoge', function () { count++ }, null, 'disposable');
			obs.addCallback('hoge', function () { count++ }, null, 'disposable');
			obs.ignoreCallback('hoge', 'preserved');
			obs.doCallback('hoge');
			expect(count).to.be(2);
		});

		it('ignoreCallback に \'disposable\' を渡すと disposable でなコールバック関数が無視される', function () {
			var obs = new Iroha.Observable();
			var count = 0;
			obs.addCallback('hoge', function () { count++ }, null);
			obs.addCallback('hoge', function () { count++ }, null, 'disposable');
			obs.addCallback('hoge', function () { count++ }, null, 'disposable');
			obs.ignoreCallback('hoge', 'disposable');
			obs.doCallback('hoge');
			expect(count).to.be(1);
		});

		it('ignoreCallback に \'all\' を渡すと全てのコールバック関数が無視される', function () {
			var obs = new Iroha.Observable();
			var count = 0;
			obs.addCallback('hoge', function () { count++ }, null);
			obs.addCallback('hoge', function () { count++ }, null, 'disposable');
			obs.addCallback('hoge', function () { count++ }, null, 'disposable');
			obs.ignoreCallback('hoge', 'all');
			obs.doCallback('hoge');
			expect(count).to.be(0);
		});

		it('ignoreCallback に \'none\' を渡すとコールバック関数が無視されることはない', function () {
			var obs = new Iroha.Observable();
			var count = 0;
			obs.addCallback('hoge', function () { count++ }, null);
			obs.addCallback('hoge', function () { count++ }, null, 'disposable');
			obs.addCallback('hoge', function () { count++ }, null, 'disposable');
			obs.ignoreCallback('hoge', 'none');
			obs.doCallback('hoge');
			expect(count).to.be(3);
		});
	});


	// Iroha.Iterator
	describe('Iroha.Iterator', function () {
		it('Iroha.Iterator をインスタンス化できる', function () {
			var obj = { a: 100 };
			var iter1 = new Iroha.Iterator(obj);
			var iter2 = Iroha.Iterator(obj);
			var iter3 = Iroha.Iterator.create(obj);
			expect(iter1).to.be.an(Iroha.Iterator);
			expect(iter2).to.be.an(Iroha.Iterator);
			expect(iter3).to.be.an(Iroha.Iterator);
		});

		it('次の項目があれば hasNext は true を返す', function () {
			var obj = { a: 100, b: 200 };
			var iter = new Iroha.Iterator(obj);
			expect(iter.hasNext()).to.be(true);
			iter.next();
			expect(iter.hasNext()).to.be(true);
			iter.next();
			expect(iter.hasNext()).to.be(false);
		});

		it('次の項目がないのに next すると ReferenceError を出す', function () {
			var obj = {};
			var iter = new Iroha.Iterator(obj);
			expect($.proxy(iter, 'next')).to.throwException(function (e) {
				expect(e).to.be.a(ReferenceError);
			});
		});

		it('モード未指定のとき、 value モードとなる', function () {
			var obj = { a: 100, b: 200 };
			var iter = new Iroha.Iterator(obj);
			var array = [];
			array.push(iter.next());
			array.push(iter.next());
			array.sort();
			expect(array.join(',')).to.be('100,200');
		});

		it('value モードを指定すると next したときに値を返す', function () {
			var obj = { a: 100, b: 200 };
			var iter = new Iroha.Iterator(obj, 'value');
			var array = [];
			array.push(iter.next());
			array.push(iter.next());
			array.sort();
			expect(array.join(',')).to.be('100,200');
		});

		it('key モードを指定すると next したときにキーを返す', function () {
			var obj = { a: 100, b: 200 };
			var iter = new Iroha.Iterator(obj, 'key');
			var array = [];
			array.push(iter.next());
			array.push(iter.next());
			array.sort();
			expect(array.join(',')).to.be('a,b');
		});

		it('both モードを指定すると next した時にキーを第一要素、値を第二要素とした配列を返す', function () {
			var obj = { a: 100, b: 200 };
			var iter = new Iroha.Iterator(obj, 'both');
			var array = [];
			array.push(iter.next().join(','));
			array.push(iter.next().join(','));
			array.sort();
			expect(array.join(',')).to.be('a,100,b,200');
		});

		it('iterate メソッドでコールバック関数を指定して一気にイテレートできる（valueモード）', function (done) {
			var obj = { a: 100, b: 200 };
			var iter = new Iroha.Iterator(obj, 'value');
			iter.iterate(function (value) {
				expect([100, 200].indexOf(value)).to.be.greaterThan(-1);
			})
				.done(function () {
					done();
				})
		});

		it('iterate メソッドでコールバック関数を指定して一気にイテレートできる（keyモード）', function (done) {
			var obj = { a: 100, b: 200 };
			var iter = new Iroha.Iterator(obj, 'key');
			iter.iterate(function (key) {
				expect(['a', 'b'].indexOf(key)).to.be.greaterThan(-1);
			})
				.done(function () {
					done();
				})
		});

		it('iterate メソッドでコールバック関数を指定して一気にイテレートできる（bothモード）', function (done) {
			var obj = { a: 100, b: 200 };
			var iter = new Iroha.Iterator(obj, 'both');
			iter.iterate(function (key, value) {
				expect(['a', 'b'].indexOf(key)).to.be.greaterThan(-1);
				expect([100, 200].indexOf(value)).to.be.greaterThan(-1);
			})
				.done(function () {
					done();
				})
		});

		it('iterate の最中に abort すると途中でイテレーションを中断できる', function (done) {
			var obj = { a: 100, b: 200, c: 300 };
			var iter = new Iroha.Iterator(obj);
			var count = 0;
			iter.iterate(function () { count++ }, 100)
				.done(function (type) {
					expect(type).to.be('aborted');
					expect(count).to.be(2);
					done();
				});
			// 150ms 後に割り込んで abort する!
			setTimeout(function () { iter.abort() }, 150);
		});
	});


	// Iroha.Timeout
	describe('Iroha.Timeout', function () {
		it('Iroha.Timeout をインスタンス化できる', function () {
			var timeout = new Iroha.Timeout(function () {});
			expect(timeout).to.be.an(Iroha.Timeout);
		});

		it('TODO');
	});


	// Iroha.Interval
	describe('Iroha.Interval', function () {
		it('Iroha.Interval をインスタンス化できる', function () {
			var interval = new Iroha.Interval(function () {});
			expect(interval).to.be.an(Iroha.Interval);
		});

		it('TODO');
	});


	// Iroha.Timer
	describe('Iroha.Timer', function () {
		it('TODO');
	});


	// Iroha.Tag
	describe('Iroha.Tag', function () {
		function sanitize(str) {
			return str
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&apos;')
		}

		it('Iroha.Tag をインスタンス化できる', function () {
			var tag1 = Iroha.Tag('div');
			var tag2 = new Iroha.Tag('div');
			var tag3 = Iroha.Tag.create('div');
			expect(tag1).to.be.an(Iroha.Tag);
			expect(tag2).to.be.an(Iroha.Tag);
			expect(tag3).to.be.an(Iroha.Tag);
		});

		it('toString でタグの文字列表現を得る', function () {
			var tag = new Iroha.Tag('div');
			expect(tag.toString()).to.be('<div />');
		});

		it('コンストラクターの第二引数で属性を指定できる', function () {
			var tag = new Iroha.Tag('div', { id: 'hoge', 'data-fuga': 'piyo' });
			var expectations = [
				'<div id="hoge" data-fuga="piyo" />',
				'<div data-fuga="piyo" id="hoge" />'
			];
			expect(expectations.indexOf(tag.toString())).to.be.greaterThan(-1);
		});

		it('append で Iroha.Tag のインスタンスを与えると子要素に追加される', function () {
			var tag1 = new Iroha.Tag('div', { id: 'hoge' });
			var tag2 = new Iroha.Tag('p',   { id: 'fuga' });
			tag1.append(tag2);
			expect(tag1.toString()).to.be('<div id="hoge"><p id="fuga" /></div>');
		});

		it('append で 文字列を与えると子要素に追加される', function () {
			var tag1 = new Iroha.Tag('div', { id: 'hoge' });
			var tag2 = new Iroha.Tag('p',   { id: 'fuga' });
			tag2.append('piyo');
			tag1.append(tag2);
			expect(tag1.toString()).to.be('<div id="hoge"><p id="fuga">piyo</p></div>');
		});

		it('"<", ">", """, "\'", "&" が属性やテキストに指定されていた場合、エスケープされる', function () {
			var text1 = 'ho<>"\'&ge';
			var text2 = 'fu<>"\'&ga';
			var text1Sanitized = sanitize(text1);
			var text2Sanitized = sanitize(text2);
			var tag1 = new Iroha.Tag('div', { 'class': text1 });
			var tag2 = new Iroha.Tag('p');
			tag2.append(text2);
			tag1.append(tag2);
			expect(tag1.toString()).to.be('<div class="' + text1Sanitized + '"><p>' + text2Sanitized + '</p></div>');
		});

		it('toString に true を渡すと HTML エンティティ文字がエンコードされる', function () {
			var text1 = 'ho<>"\'&ge';
			var text2 = 'fu<>"\'&ga';
			var text1Sanitized = sanitize(text1);
			var text2Sanitized = sanitize(text2);
			var tag1 = new Iroha.Tag('div', { 'class': text1 });
			var tag2 = new Iroha.Tag('p');
			var expected = '<div class="' + text1Sanitized + '"><p>' + text2Sanitized + '</p></div>';
			tag2.append(text2);
			tag1.append(tag2);
			expect(tag1.toString(true)).to.be(sanitize(expected));
		});
	});


	// Iroha.setValue
	describe('Iroha.setValue', function () {
		it('指定したオブジェクトの指定したパスに指定した値を代入する', function () {
			var obj = {};
			Iroha.setValue('hoge.fuga.piyo', 'aaa', obj);
			expect(obj.hoge.fuga.piyo).to.be('aaa');
		});

		it('オブジェクトを指定しなかった場合、グローバルオブジェクトに代入される', function () {
			Iroha.setValue('hoge.fuga.piyo', 'aaa');
			expect(window.hoge.fuga.piyo).to.be('aaa');
		});
	});


	// Iroha.getValue
	describe('Iroha.getValue', function () {
		it('指定したオブジェクトの指定したパスの値を取得する', function () {
			var obj = {
				hoge: {
					fuga: {
						piyo: 'aaa'
					}
				}
			};
			expect(Iroha.getValue('hoge.fuga.piyo', obj)).to.be('aaa');
		});

		it('存在しないパスを指定すると undefined となる', function () {
			var obj = {
				hoge: {
					fuga: 'aaa'
				}
			};
			expect(Iroha.getValue('hoge.fuga.piyo', obj)).to.be(undefined);
		});
	});


	// Iroha.singleton
	describe('Iroha.singleton', function () {
		it('シングルトンなインスタンスを返す', function () {
			var Constructor = function (x, y) {
				this.x = x === undefined ? 100 : x ;
				this.y = y === undefined ? 200 : y ;
			};
			var instance1 = Iroha.singleton(Constructor, 300, 400);
			var instance2 = Iroha.singleton(Constructor, 500, 600);
			expect(instance1).to.be(instance2);
		});

		it('引数には対応していない', function () {
			var Constructor = function (x, y) {
				this.x = x === undefined ? 100 : x ;
				this.y = y === undefined ? 200 : y ;
			};
			var instance1 = Iroha.singleton(Constructor, 300, 400);
			var instance2 = Iroha.singleton(Constructor, 500, 600);
			expect(instance1.x).not.to.be(300);
			expect(instance1.y).not.to.be(400);
		});
	});


	// Iroha.throttle
	describe('Iroha.throttle', function () {
		it('短時間に大量に関数を呼ばれたときに間引く', function (done) {
			var count = 0;
			var func = function () { count++ };
			// 100msに１度しか呼ばれない関数
			var throttled = Iroha.throttle(func, 100);
			var timer;
			// 1秒のあいだ大量に呼び出す
			timer = setInterval(throttled, 20);
			setTimeout(function () {
				clearTimeout(timer);
				// この時点で約50回呼ばれているはず
				// カウンターが15未満であればオウケイとする
				expect(count).to.be.lessThan(15);
				done();
			}, 1000);
		});
	});


	// Iroha.debounce
	describe('Iroha.debounce', function () {
		it('短時間に大量に関数を呼ばれているときは何もせず、おさまったあとに発動する', function (done) {
			var count = 0;
			var func = function () { count++ };
			// 100msの間を空けないと呼ばれない関数
			var debounced = Iroha.debounce(func, 100);
			var timer;
			// 1秒のあいだ大量に呼び出す
			timer = setInterval(debounced, 20);
			setTimeout(function () {
				clearTimeout(timer);
				// この時点で約50回呼ばれているはず
				expect(count).to.be(0);
				setTimeout(function () {
					expect(count).to.be(1);
					done();
				}, 200);
			}, 1000);
		});
	});


	// Iroha.barrageShield
	describe('Iroha.barrageShield', function () {
		it('短時間に大量に関数を呼ばれているときは何もせず、おさまったあとに発動する', function (done) {
			var count = 0;
			var func = function () { count++ };
			var barrage1 = Iroha.barrageShield(func, 150);
			var barrage2 = Iroha.barrageShield(func, 150);
			var timer1, timer2;
			// 片方は75msずらして発動する
			timer1 = setInterval(barrage1, 200);
			setTimeout(function () { setInterval(barrage2, 200) }, 75);

			setTimeout(function () {
				clearTimeout(timer1);
				clearTimeout(timer2);
				// この時点で約50回呼ばれているはず
				expect(count).to.be(0);
				setTimeout(function () {
					expect(count).to.be(1);
					done();
				}, 200);
			}, 1000);
		});
	});

});
