const devHostName = '10.0.0.17'
const stHostName = '10.0.0.18'

chrome.runtime.onInstalled.addListener(function () {
	//Initialize DevCredentials
	chrome.storage.sync.set({
		devCredentials: {
			hostName: devHostName,
			hotKeys: [{
					key: "A",
					userName: "devuser",
					passWord: "Devuser@123",
					isDefault: true
				},
				{
					key: "S",
					userName: "katheeja",
					passWord: "Katheeja@123",
					isDefault: false
				},
				{
					key: "D",
					userName: "",
					passWord: "",
					isDefault: false
				}
			]
		}
	}, function () {
		console.log('DevhostName is init : ' + devHostName);
	});

	// Initialize St Credentials
	chrome.storage.sync.set({
		qaCredentials: {
			hostName: stHostName,
			hotKeys: [{
					key: "A",
					userName: "testthree",
					passWord: "Test@1234",
					isDefault: true
				},
				{
					key: "S",
					userName: "qauser",
					passWord: "Qauser@123",
					isDefault: false
				},
				{
					key: "D",
					userName: "testone",
					passWord: "Test@1234",
					isDefault: false
				}
			]
		}
	}, function () {
		console.log('SthostName is init : ' + stHostName);
	});

	chrome.storage.sync.set({
		toolControls: {
			isNotifSoundEnabled: true,
			greetingName: "Naruto"
		}
	}, function () {
		console.log('Controls init');
	});

	chrome.storage.sync.get(['devCredentials'], function (result) {
		console.log('DevHost currently is ' + result.devCredentials.hostName + '' + result.devCredentials.hotKeys[0].userName);
	});
	chrome.storage.sync.get(['qaCredentials'], function (result) {
		console.log('STHost currently is ' + result.qaCredentials.hostName + '' + result.qaCredentials.hotKeys[0].userName);
	});

	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
		chrome.declarativeContent.onPageChanged.addRules([{
				conditions: [new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {
						hostContains: devHostName
					},
				})],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			},
			{
				conditions: [new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {
						hostContains: stHostName
					},
				})],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});

