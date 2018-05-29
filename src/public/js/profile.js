function addEventListeners() {

	// window.axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;
	// window.axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
	// window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

	let editProfileButton = document.querySelector(".container-fluid .row aside div a#edit_profile");
	if (editProfileButton !== null)
		editProfileButton.addEventListener('click', editProfileForm);

	let createProjectButton = document.querySelector(".container-fluid div#options a#new_project");
	if (createProjectButton !== null)
		createProjectButton.addEventListener('click', createProjectForm);

	// let paginationLinks = document.querySelectorAll("ul.pagination li a, ul.pagination li span");
	// console.log(paginationLinks);
	// for(var i = 0; i < paginationLinks.length; i++){
	// 	console.log(paginationLinks[i]);
	// 	paginationLinks[i].addEventListener('click', getUserProjectsPage);
	// }

	let searchUserProjectForm = document.querySelector("form.searchbar");
	if (searchUserProjectForm !== null)
		searchUserProjectForm.addEventListener('submit', searchUserProjects);

	let searchRoleUserProjectButtons = document.querySelectorAll("div#role_button a.dropdown-item");
	for (let i = 0; i < searchRoleUserProjectButtons.length; i++) {
		searchRoleUserProjectButtons[i].addEventListener('click', searchByRole);
	}


	let leaveProjectBtn = document.querySelectorAll("div#projects div.project div.project_info button");
	for (let i = 0; i < leaveProjectBtn.length; i++) {
		leaveProjectBtn[i].addEventListener('click', leaveProject);
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
	request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	request.addEventListener('load', handler);
	if (data != null)
		request.send(encodeForAjax(data));
	else
		request.send();
}

function editProfileForm(event) {
	event.preventDefault();
	sendAjaxRequest('get', event.target.href, null, showEditProfileForm);
}

function createProjectForm(event) {
	event.preventDefault();
	sendAjaxRequest('get', event.target.href, null, showCreateProjectForm);
}

function showEditProfileForm() {
	let data = JSON.parse(this.responseText);
	//insert verification of success

	let section = document.querySelector("div.container-fluid .row section");
	section.innerHTML = data.html;
	console.log('Here');
	/*let submitEdit = document.querySelector("div.edit_profile div#form_options a.btn-success");
	submitEdit.addEventListener('click', sendEditProfile);*/
}

function showCreateProjectForm() {
	let data = JSON.parse(this.responseText);
	//insetrt verification of success

	let section = document.querySelector("div.container-fluid .row section");
	section.innerHTML = data.html;
	let submitProject = document.querySelector("div.new_project div#form_options a.btn-success");
	submitProject.addEventListener('click', createProjectAction);
}

/*function sendEditProfile(event) {
	event.preventDefault();

	let new_name = document.querySelector("input[name='user_name']").value;
	let new_username = document.querySelector("input[name='user_username']").value;
	let new_email = document.querySelector("input[name='user_email']").value;
	let new_image = document.querySelector("input[name='user_image']").value; // change this later TODO

	console.log(new_image);

	sendAjaxRequest('post', event.target.href, {name: new_name, username: new_username, 
								email: new_email, image: new_image} , showProfileUpdated);
}*/

function createProjectAction(event) {
	event.preventDefault();

	let project_name = document.querySelector("input[name='project_name']").value;
	let project_description = document.querySelector("input[name='project_description']").value;
	let project_public = document.querySelector("input#public").value;

	let select = document.querySelector("select");
	let categories = getSelectValues(select);

	let index = event.target.href.indexOf('?');
	let user_id_text = event.target.href.substring(index + 1, event.target.href.length);
	let index2 = user_id_text.indexOf('=');
	let user_id = user_id_text.substring(index2 + 1, user_id_text.length);
	let href = event.target.href.substring(0, index);

	sendAjaxRequest('post', href,
		{
			name: project_name, description: project_description, public: project_public,
			user_id: user_id, categories: categories
		}, showProfileUpdated);
}

function showProfileUpdated() {
	// TODO: Change to AJAX
	document.body.innerHTML = this.responseText;
}

function getSelectValues(select) {
	var result = [];
	var options = select.options;
	var opt;

	for (var i = 0, iLen = options.length; i < iLen; i++) {
		opt = options[i];

		if (opt.selected) {
			result.push(opt.value || opt.text);
		}
	}
	return result;
}

// function getUserProjectsPage(event) {
// 	event.preventDefault();
// 	console.log('ah!');

// 	var page = event.target.href.split('page=')[1];

// 	sendAjaxRequest('get', event.target.href, null, changePage);
// }

// function changePage() {
// 	var response = JSON.parse(this.responseText);
// 	console.log(response);

// 	let content = document.querySelector("div.#projects");
// 	content.innerHTML = response.html;
// }

function searchUserProjects(event) {
	event.preventDefault();

	let inputValue = event.target.childNodes[1].value;

	sendAjaxRequest("POST", event.target.action, { search: inputValue }, showUserProjects);
}

function searchByRole(event) {
	event.preventDefault();

	let role = event.target.innerHTML;

	sendAjaxRequest("POST", event.target.href, { role: role }, showUserProjects);
}

function showUserProjects() {

	let data = JSON.parse(this.responseText);

	let div = document.querySelector("div#projects");
	div.innerHTML = data.html;
}


function leaveProject(event) {
	event.preventDefault();

	let href = event.currentTarget.getAttribute('href');

	let index = href.indexOf('projects');
	let index2 = href.indexOf('leave');
	let project_id = href.substring(index + 9, index2 - 1);

	swal({
		title: "Are you sure you want to leave this project?",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
		.then((willDelete) => {
			if (willDelete) {
				sendAjaxRequest('post', href, { project_id: project_id }, leaveProjectHandler);
			}
		});
}

function leaveProjectHandler() {

	let data = JSON.parse(this.responseText);

	if (data.success) {

		swal("You left " + data.project_name + " successfully!", {
			icon: "success",
		});

		let div = document.querySelector("div#projects");
		div.innerHTML = data.html;

	} else {
		swal("Failed to leave the project!", {
			icon: "error",
		});
	}

}



addEventListeners();