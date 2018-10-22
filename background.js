
if (!localStorage.names) {
	localStorage.names = JSON.stringify(["Bob Smith"]);
}

if (!localStorage.frequency) {
	localStorage.frequency = 15;
}

// initialize chat timers
let chats_timers = {};
let name_cache = localStorage.names;

function updateChatTimers(){
	chats_timers = {}
	let names = JSON.parse(localStorage.names);
	for (let i = 0; i < names.length; i++){
		chats_timers[names[i]] = -1
	}
}
updateChatTimers();

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
		try {
			if(name_cache != localStorage.names){
				updateChatTimers();
				name_cache = localStorage.names;
			}

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

					if(chats_timers[name] % localStorage.frequency == 0){
						var message = "You got this fam.";
						var options = {"type": "basic", "iconUrl": "128.png", "title": "Reply to " + name, "message": message, "buttons": []};
						chrome.notifications.create("", options, function (notificationId){ });
					}
				}
			}
		} catch(error) {
			console.error(error);
		}
	}
);