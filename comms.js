var Comms = (function() {
	var self = {};
	var sock;
	var redditRequester = new XMLHttpRequest();

	redditRequester.onreadystatechange = function () {
		if (redditRequester.readyState === 4 && redditRequester.status === 200) {
			var regex = /"(wss:\/\/wss\.redditmedia\.com\/thebutton\?h=[^"]*)"/g;
			var websocketURL = regex.exec(redditRequester.responseText)[1];

			console.log("Connecting to: " + websocketURL);
			
			sock = new WebSocket(websocketURL);
			sock.onmessage = tick;
		}
	};
	// Use CORS proxy by lezed1 to get the Reddit homepage!
	redditRequester.open("get", "//cors-unblocker.herokuapp.com/get?url=https%3A%2F%2Fwww.reddit.com%2Fr%2Fthebutton", true);
	redditRequester.send();

	function tick(evt) {
		// {"type": "ticking", "payload": {"participants_text": "585,177", "tick_mac": "362a88a8ae0a89c909395f587e329992c656b4d8", "seconds_left": 59.0, "now_str": "2015-04-04-23-44-42"}}
		var packet = JSON.parse(evt.data);
		if (packet.type != "ticking") {
			return;
		}

		packet.payload.now = moment(packet.payload.now_str + " 0000", "YYYY-MM-DD-HH-mm-ss Z");
		Stats.lag = d3.format("0,000")(packet.payload.now - moment());

		if (data.length > 0 && packet.payload.seconds_left >= _.last(data).seconds_left) {
			_.last(data).is_click = true;
		}
		data.push(packet.payload);
		$('#resets').text(fmt(clicks.length));
		Stats.ticks = fmt(data.length);
		Stats.participants = packet.payload.participants_text;

		Chart.render(data);
		Timer.sync(packet.payload.seconds_left);
		Stats.render();
	}

	return self;
}())
