function move() {
	$('.target')
		.animate({
			left:'100px',
			top:'100px'
		}, 500, 'swing')
		.queue(function () {
			$(this).css('background-color', 'red').dequeue();
		})
		.animate({
			top:'0'
		}, 500, 'swing')
		.queue(function () {
			$(this).css('background-color', 'red').dequeue();
		})
		.animate({
			left:'0'
		}, 500, 'swing')
		.queue(function () {
			$(this).css('background-color', 'red').dequeue();
		});
}

$('button').on('click', move);