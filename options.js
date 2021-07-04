var devLogins = document.getElementById('devLoginBox');
var qaLogins = document.getElementById('stLoginBox');
var devCredentials;
var stCredentials;
var toolControls;

chrome.storage.sync.get(['devCredentials'], function (result) {
	devCredentials = result.devCredentials;
	populateLogins(devCredentials, document.getElementById('devLoginBox'), 'dev');
});

chrome.storage.sync.get(['qaCredentials'], function (result) {
	qaCredentials = result.qaCredentials;
	populateLogins(qaCredentials, document.getElementById('stLoginBox'), 'qa');
});

chrome.storage.sync.get(['toolControls'], function (result) {
	toolControls = result.toolControls;
	populateToolbar(toolControls);
});

function populateLogins(credentials, loginBox, env) {
	credentials.hotKeys.forEach(function (item) {
		loginBox.innerHTML += getConfiguredLoginRow(item.key, item.userName, item.passWord, env);
	});
	credentials.hotKeys.forEach(function (item) {
		document.getElementById(env + '_' + item.key).addEventListener('click', function () {
			let textTimer;
			updateLogin(env, item.key);
			updateButtonClickEffect(env + '_' + item.key);
			clearTimeout(textTimer);
			textTimer = setTimeout(function(){
				updateButtonStyleReset(env + '_' + item.key);
			},1000);
		}, false);
	});
}

function populateToolbar(toolSettings) {
	console.log(toolSettings);

	const checkbox = document.getElementById('isNotifSoundEnabled')
	checkbox.checked = toolSettings.isNotifSoundEnabled;

	checkbox.addEventListener('change', (event) => {
		let updatedToolSettings = toolSettings;
		if (event.currentTarget.checked) {
			updatedToolSettings.isNotifSoundEnabled = true;
		} else {
			updatedToolSettings.isNotifSoundEnabled = false;
		}
		setNotificationSound(updatedToolSettings);
	});
	
	const greetingText = document.getElementById('greetingName')
	greetingText.value = toolSettings.greetingName;
	
	greetingText.addEventListener('keyup', (event) => {
		let updatedToolSettings = toolSettings;
		console.log(event.currentTarget.value)
		updatedToolSettings.greetingName = event.currentTarget.value ;		
		setGreetingText(updatedToolSettings);
	});
}


function setNotificationSound(toolControls) {
	chrome.storage.sync.set({
		toolControls: toolControls
	}, function () {
		console.log('toolSettings Updated : ' + JSON.stringify(toolControls));
	});
}

function setGreetingText(toolControls) {
	chrome.storage.sync.set({
		toolControls: toolControls
	}, function () {
		console.log('toolSettings Updated : ' + JSON.stringify(toolControls));
	});
}

function updateLogin(env, key) {
	let userName = document.getElementById('userName_' + env + '_' + key);
	let passWord = document.getElementById('passWord_' + env + '_' + key);
	if (env == 'dev') {
		for (let i = 0; i < devCredentials.hotKeys.length; i++) {
			if (devCredentials.hotKeys[i].key == key) {
				devCredentials.hotKeys[i].userName = userName.value;
				devCredentials.hotKeys[i].passWord = passWord.value;
				break;
			}
		}
		chrome.storage.sync.set({
			devCredentials: devCredentials
		}, function () {
			console.log('DevCredentials Updated : ' + devCredentials);
		});
	} else if (env == 'qa') {
		for (let i = 0; i < qaCredentials.hotKeys.length; i++) {
			if (qaCredentials.hotKeys[i].key == key) {
				qaCredentials.hotKeys[i].userName = userName.value;
				qaCredentials.hotKeys[i].passWord = passWord.value;
				break;
			}
		}
		chrome.storage.sync.set({
			qaCredentials: qaCredentials
		}, function () {
			console.log('qaCredentials Updated : ' + qaCredentials);
		});
	}
}

function getConfiguredLoginRow(key, userName, passWord, env) {
	return '<div class="configuredLoginRow" >' +
		'<label class="hotkey-label" id="key_' + key + '" > ' + key + ' </label>' +
		'<input type="text" class="textInput" id="userName_' + env + '_' + key + '" value="' + userName + '"/>' +
		'<input type="text" class="textInput" id="passWord_' + env + '_' + key + '" value="' + passWord + '"/>' +
		'<button class="updateButton" id="' + env + '_' + key + '"> Update </button>' +
		'</div>';
}

function updateButtonClickEffect(updateButton){
	document.getElementById(updateButton).textContent ="Updated";
	document.getElementById(updateButton).style.backgroundColor ="darkviolet";
	document.getElementById(updateButton).parentElement.style.opacity ="1";
}

function updateButtonStyleReset(updateButton){
	document.getElementById(updateButton).textContent ="Update";
	document.getElementById(updateButton).style.backgroundColor ="deeppink";
	document.getElementById(updateButton).parentElement.style.opacity ="0.9";
}