let userRepBtn = document.querySelector("aside#navbar div a:first-of-type");
let commentRepBtn = document.querySelector("aside#navbar div a:last-of-type");

function addEventListenersAdmin() {


	let commentsRepDetail = document.querySelectorAll("section div#reports div.report_comment div.report_principal_info a.info");
	let userRepDetail = document.querySelectorAll("section div#reports div.report_user div.report_principal_info a.info");
	let pagination = document.querySelectorAll("div#reports div#pagination_section ul.pagination li a");

	if (userRepBtn !== null)
		userRepBtn.addEventListener('click', showUserReports);
	if (commentRepBtn !== null)
		commentRepBtn.addEventListener('click', showCommentReports);

	for (let i = 0; i < pagination.length; i++) {
		pagination[i].addEventListener('click', getPageReport);
	}

	for (let i = 0; i < commentsRepDetail.length; i++) {
		commentsRepDetail[i].addEventListener('click', ReportCommentsDetail);
	}

	for (let i = 0; i < userRepDetail.length; i++) {
		userRepDetail[i].addEventListener('click', ReportUserDetail);
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

function showUserReports(event) {
	event.preventDefault();

	userRepBtn.id = 'active';
    commentRepBtn.id = '';

	sendAjaxRequest('get', event.target.href, null, viewReports);
}

function showCommentReports(event) {
	event.preventDefault();

	userRepBtn.id = '';
    commentRepBtn.id = 'active';

	sendAjaxRequest('get', event.target.href, null, viewReports);
}

function viewReports() {
	let data = JSON.parse(this.responseText);

	if(data.success){
		let content = document.querySelector("section div#reports");
		content.innerHTML = data.html;
	}

	addEventListenersAdmin();
}

function dismissReport(button) {
	let href = button.getAttribute('href');
	let report_id = button.parentElement.parentElement.parentElement.getAttribute("data-id");

	swal({
		title: "Are you sure you want to dismiss this report?",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				sendAjaxRequest('post', href, { report_id: report_id }, reportHandler);
			}
		});

}

function disableUser(button) {
	let href = button.getAttribute('href');
	let report_id = button.parentElement.parentElement.parentElement.getAttribute("data-id");

	swal({
		title: "Are you sure you want to disable this user?",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				sendAjaxRequest('post', href, { report_id: report_id }, reportHandler);
				swal("This user has been disable !", {
					icon: "success",
				});
			}
		});
}

function deleteCommentReport(button) {
	let href = button.getAttribute('href');
	let report_id = button.parentElement.parentElement.parentElement.getAttribute("data-id");

	swal("Delete Comment", {
		icon: "warning",
		buttons: {
			cancel: "Cancel!",
			catch: {
				text: "Delete comment and disable user!",
				value: "catch",
			},
			defeat: {
				text: "Only delete the comment!",
				value: "defeat",
			},
		},
	})
		.then((value) => {
			let disable;
			switch (value) {

				case "defeat":
					disable = false;
					sendAjaxRequest('post', href, { report_id: report_id, disable: disable }, reportHandler);
					break;

				case "catch":
					disable = true;
					sendAjaxRequest('post', href, { report_id: report_id, disable: disable }, reportHandler);
					break;

				default:
					swal("Operation Canceled!", {
						dangerMode: true,
						icon: "error",
					});
			}
		});
}

function getPageReport(event) {
	event.preventDefault();

	sendAjaxRequest('get', event.target.href, null, viewReports);
}

function ReportCommentsDetail(event) {
	event.preventDefault();

	let index = event.target.href.indexOf('comments');
	let report_id = event.target.href.substring(index + 9, event.target.href.length);

	let selector = document.querySelector("div#reports div.report_comment[data-id = '" + report_id + "'] div.report_details");

	if (selector !== null) {
		selector.remove();
	} else {
		sendAjaxRequest('get', event.target.href, { report_id: report_id }, showReportCommentsDetail);
	}
}

function showReportCommentsDetail() {
	let data = JSON.parse(this.responseText);

	if (data.success) {
		let report = document.querySelector("div#reports div.report_comment[data-id = '" + data.report.id + "'] div.report_principal_info");
		report.insertAdjacentHTML('afterend', data.reportView);
	}
}

function ReportUserDetail(event) {
	event.preventDefault();

	let index = event.target.href.indexOf('users');
	let report_id = event.target.href.substring(index + 6, event.target.href.length);

	let selector = document.querySelector("div#reports div.report_user[data-id = '" + report_id + "'] div.report_details");

	if (selector !== null) {
		selector.remove();
	} else {
		sendAjaxRequest('get', event.target.href, { report_id: report_id }, showReportUserDetail);
	}
}

function showReportUserDetail() {
	let data = JSON.parse(this.responseText);

	if (data.success) {
		let report = document.querySelector("div#reports div.report_user[data-id = '" + data.report.id + "'] div.report_principal_info");
		report.insertAdjacentHTML('afterend', data.reportView);
	}
}

function reportHandler() {
	let data = JSON.parse(this.responseText);

	if (data.success) {
		let report = document.querySelector("div#reports div.report[data-id = '" + data.report_id + "'] ");
		report.remove();

		swal("Success !", {
			icon: "success",
		});

	}
}

addEventListenersAdmin();