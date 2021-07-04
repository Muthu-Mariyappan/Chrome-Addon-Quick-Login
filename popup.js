var devCredentials;
var qaCredentials;
var toolControls;

var currentEnvCredentials;

var playClickSound = function () {
	document.getElementById("clickSound").play();
};


chrome.tabs.query({
	active: true,
	currentWindow: true
}, function (tabs) {

	chrome.storage.sync.get(['devCredentials'], function (result) {
		devCredentials = result.devCredentials;
		let url = new URL(tabs[0].url);
		if (url.hostname == devCredentials.hostName) {
			currentEnvCredentials = devCredentials;
			populateLoginOptions(currentEnvCredentials);
		}
	});

	chrome.storage.sync.get(['qaCredentials'], function (result) {
		qaCredentials = result.qaCredentials;
		let url = new URL(tabs[0].url);
		if (url.hostname == qaCredentials.hostName) {
			currentEnvCredentials = qaCredentials;
			populateLoginOptions(currentEnvCredentials);
		}
	});
	
	chrome.storage.sync.get(['toolControls'], function (result) {
		toolControls = result.toolControls;
		if (toolControls.isNotifSoundEnabled){
			playWelcomeSound();
		}
		console.log(toolControls);
	});
});

function playWelcomeSound() {
	let timeInHrs = new Date().getHours();
	let speech = new SpeechSynthesisUtterance();
	speech.voice = window.speechSynthesis.getVoices()[1];
	// Let me know if you are able to change the default voice
	speech.text = getGreetingText(timeInHrs, toolControls.greetingName);
	window.speechSynthesis.speak(speech);
}

function getGreetingText(hours, name){
	let greeting;
	if (hours >= 21) {
		greeting = 'Working late '+name+'? Please stay hydrated!';
	}
	else if(hours >= 17){
		greeting = 'Good Evening '+name+'! Got any cookies?';
	}
	else if(hours >= 13){
		greeting = 'Good Afternoon '+name+'! Hope you had a good meal!';
	}
	else if(hours >= 5){
		greeting = 'Hi '+name+'! A fresh and great day ahead!';
	}
	else if(hours >= 0){
		greeting = 'Should I say Good Night, or Good Morning?';
	}
	return greeting;
}

function populateLoginOptions(credentials) {
	let loginButtonBox = document.getElementById('loginButtons');
	credentials.hotKeys.forEach(function (item) {
		if (item.userName && item.userName != "" && item.userName != undefined && item.userName != null) {
			loginButtonBox.innerHTML += getLoginButtonRow(item.key, item.userName, item.passWord);
		}
		console.log(document.getElementById(item.userName));
	});
	credentials.hotKeys.forEach(function (item) {
		let loginButton = document.getElementById(item.userName);
		let cleartimer;
		if (item.userName && item.userName != "" && item.userName != undefined && item.userName != null) {
			loginButton.addEventListener("click", function () {
				loginUser(item.userName, item.passWord)
			}, false);
			loginButton.addEventListener("mouseover", function () {
				clearTimeout(cleartimer);
				cleartimer = setTimeout(function () {
					loginButton.innerHTML = item.passWord;
				}, 500);
			}, false);
			loginButton.addEventListener("mouseout", function () {
				clearTimeout(cleartimer);
				cleartimer = setTimeout(function () {
					loginButton.innerHTML = item.userName;
				}, 500);
			}, false);
		}
	});
}

function getLoginButtonRow(key, userName, passWord) {

	return '<div class="login-button-row" >' +
		'<label class="hotkey-label" id="' + key + '"> ' + key + ' </label>' +
		'<button class="login-button" id="' + userName + '"> ' + userName + ' </button>' +
		'</div>';
}

function loginUser(userName, passWord) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		playClickSound();
		setTimeout(function () {
			window.close();
			chrome.tabs.executeScript(
				tabs[0].id, {
					code: 'document.getElementById("username").value = "' + userName + '";document.getElementById("password").value = "' + passWord + '";document.querySelector("[type=\'button\']").click();'
				});
		}, 500);
	});
}

function hotKeyPressHandler(e) {
	let charCode = e.keyCode || e.which;
	let hotkey = String.fromCharCode(charCode);
	if ((hotkey == 'A' || hotkey == 'S' || hotkey == 'D')) {
		currentEnvCredentials.hotKeys.some(function (item) {
			if (hotkey == item.key) {
				loginUser(item.userName, item.passWord);
				return true;
			}
		});
	} else if (hotkey == 'K') { //Handle quick default key press
		currentEnvCredentials.hotKeys.some(function (item) {
			if (item.isDefault) {
				loginUser(item.userName, item.passWord);
				return true;
			}
		});
	}
}

document.addEventListener('keyup', hotKeyPressHandler, false);