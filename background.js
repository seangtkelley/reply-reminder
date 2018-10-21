
// chats to check for 
let chats_timers = {
	'Brian Chhouk': -1,
	'Shishir Jakati': -1,
	'Mukul Kudlugi': -1,
	'Tony Mastromarino': -1
};

setInterval(function () {

	chrome.tabs.query({"url": "*://*.messenger.com/*"}, function(tabs) {
		if(tabs != undefined){
				
			// get first tab
			tab = tabs[0];

			chrome.tabs.executeScript(tab.id, {
				code: "chrome.extension.sendRequest({content: document.body.innerHTML}, function(response) { });"
			}, function() { });
		}
	});
}, 1000); // run test every second

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {

		let html = $($.parseHTML( request.content ));

		let chats_list = html.find('ul[aria-label="Conversation List"]');

		let chats = $(chats_list[0]).find('li');

		for (let i = 0; i < chats.length; i++){
			let name = $(chats[i]).find('div[data-tooltip-content]').attr('data-tooltip-content');

			if (name in chats_timers){
				let unread = $(chats[i]).attr('aria-live') == "polite";
				if(unread){
					chats_timers[name] += 1;
				} else {
					chats_timers[name] = -1;
				}

				if(chats_timers[name] % 30 == 0){
					var message = "You got this fam.";
					var options = {"type": "basic", "iconUrl": "128.png", "title": "Reply to " + name, "message": message, "buttons": []};
					chrome.notifications.create("", options, function (notificationId){ });
				}
			}
		}
	}
);