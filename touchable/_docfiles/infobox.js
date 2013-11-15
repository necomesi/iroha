$(function () {

	var $x = $('#x');
	var $y = $('#y');
	var $vx = $('#vx');
	var $vy = $('#vy');
	var $dx = $('#dx');
	var $dy = $('#dy');
	var $mot = $('#motion');
	var $box = $('#box1');

	$box.touchable()
		.on('touch.move', function (e, point, session) {
			$x.text(point.x);
			$y.text(point.y);
			$vx.text(session.vx);
			$vy.text(session.vy);
			$dx.text(session.dx);
			$dy.text(session.dy);
		})
		.on('touch.flick', function (e, direction, session) {
			console.log(arguments);
			$mot.stop().css('opacity', '1');
			switch (direction) {
				case TouchSession.DIR_UP:
					$mot.text('Flicked up!');
					break;
				case TouchSession.DIR_RIGHT:
					$mot.text('Flicked right!');
					break;
				case TouchSession.DIR_DOWN:
					$mot.text('Flicked down!');
					break;
				case TouchSession.DIR_LEFT:
					$mot.text('Flicked left!');
					break;
			}
			$mot.animate({opacity: '0'}, 1000);
		});

});

//$('#box1').touchable()
//	.on('touch.start', function () {
//		console.log('touch start!', arguments);
//	})
//	.on('touch.move', function () {
//		console.log('touch move!', arguments);
//	})
//	.on('touch.end', function () {
//		console.log('touch end!', arguments);
//	})
//	.on('touch.flickup', function () {
//		console.log('flicked up!');
//	})
//	.on('touch.flickright', function () {
//		console.log('flicked right!');
//	})
//	.on('touch.flickdown', function () {
//		console.log('flicked down!');
//	})
//	.on('touch.flickleft', function () {
//		console.log('flicked left!');
//	});
