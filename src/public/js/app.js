function addEventListeners() {

	let userDropButton = document.querySelector("nav .user > img");
	userDropButton.addEventListener('click', dropUserOptions);

	let notificationDropIcon = document.querySelector("nav.navbar #notifications label");
	notificationDropIcon.addEventListener('click', dropNotificationsMenu);
}

function dropUserOptions() {
	let userDropdownMenu = document.querySelector("nav.navbar .user div#profile_options");
	if (userDropdownMenu.style.height == "0px" || userDropdownMenu.style.height == 0) {
		userDropdownMenu.style.height = "auto";
		userDropdownMenu.style.opacity = "1";
		userDropdownMenu.style.display = "block";
	}
	else {
		userDropdownMenu.style.height = "0";
		userDropdownMenu.style.opacity = "0";
		userDropdownMenu.style.display = "none";
	}
}

function dropNotificationsMenu() {
	let notificationDropdown = document.querySelector("nav.navbar #notifications #notifications_box");
	let notifications = document.querySelector("nav #notifications #notifications_box ul li");

	if (notifications != null) {
		if (notificationDropdown.style.height == "0px" || !notificationDropdown.style.height) {
			notificationDropdown.style.height = "300px";
			notificationDropdown.style.opacity = 1;
			addEventListenersNotifications();
		}
		else {
			notificationDropdown.style.height = 0;
			notificationDropdown.style.opacity = 0;
		}
	}
}

function encodeForAjax(data) {
	if (data == null) return null;
	return Object.keys(data).map(function (k) {
		return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
	}).join('&');
}


function sendAjaxRequest(method, url, data, handler) {
	let request = new XMLHttpRequest();

	request.open(method, url, true);
	request.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').content);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.addEventListener('load', handler);
	if (data != null)
		request.send(encodeForAjax(data));
	else
		request.send();
}

addEventListeners();