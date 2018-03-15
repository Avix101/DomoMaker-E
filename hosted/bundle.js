"use strict";

var handleDomo = function handleDomo(e) {
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	if ($("#domoName").val() == '' || $("#domoAge").val == '') {
		handleError("RAWR! All fields are required");
		return false;
	}

	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
		loadDomosFromServer();
	});

	return false;
};

var deleteDomo = function deleteDomo(e) {

	var id = $(e.currentTarget).attr("data-domoid");
	var csrf = $("#csrf").val();

	sendAjax('POST', "/deleteDomo", "_csrf=" + csrf + "&id=" + id, function () {
		loadDomosFromServer();
	});
};

var DomoForm = function DomoForm(props) {
	return React.createElement(
		"form",
		{ id: "domoForm",
			onSubmit: handleDomo,
			name: "domoForm",
			action: "/maker",
			method: "POST",
			className: "domoForm"
		},
		React.createElement(
			"label",
			{ htmlFor: "name" },
			"Name: "
		),
		React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
		React.createElement(
			"label",
			{ htmlFor: "age" },
			"Age: "
		),
		React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
		React.createElement(
			"label",
			{ htmlFor: "element" },
			"Element: "
		),
		React.createElement(
			"select",
			{ id: "domoElement", name: "element" },
			React.createElement(
				"option",
				{ value: "0" },
				"Water"
			),
			React.createElement(
				"option",
				{ value: "1" },
				"Fire"
			),
			React.createElement(
				"option",
				{ value: "2" },
				"Earth"
			),
			React.createElement(
				"option",
				{ value: "3" },
				"Wind"
			),
			React.createElement(
				"option",
				{ value: "4" },
				"Time"
			),
			React.createElement(
				"option",
				{ value: "5" },
				"Space"
			),
			React.createElement(
				"option",
				{ value: "6" },
				"Mirage"
			)
		),
		React.createElement("input", { id: "csrf", type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
	);
};

var domoElementImgStruct = {
	0: "water.png",
	1: "fire.png",
	2: "earth.png",
	3: "wind.png",
	4: "time.png",
	5: "space.png",
	6: "mirage.png"
};

var DomoList = function DomoList(props) {
	if (props.domos.length === 0) {
		return React.createElement(
			"div",
			{ className: "domoList" },
			React.createElement(
				"h3",
				{ className: "emptyDomo" },
				"No Domos yet"
			)
		);
	}

	var domoNodes = props.domos.map(function (domo) {

		var elementImgUrl = "/assets/img/icons/" + domoElementImgStruct[domo.element];

		return React.createElement(
			"div",
			{ key: domo._id, className: "domo" },
			React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "Domo Face", className: "domoFace" }),
			React.createElement(
				"h3",
				{ className: "domoName" },
				" Name: ",
				domo.name,
				" "
			),
			React.createElement(
				"h3",
				{ className: "domoAge" },
				" Age: ",
				domo.age,
				" "
			),
			React.createElement(
				"h3",
				{ className: "domoElement" },
				" Element: "
			),
			React.createElement("img", { src: elementImgUrl, alt: "Domo Element", className: "domoElement" }),
			React.createElement(
				"button",
				{ className: "deleteButton", onClick: function onClick(e) {
						deleteDomo(e);
					}, "data-domoid": domo._id },
				"Delete Domo"
			)
		);
	});

	return React.createElement(
		"div",
		{ className: "domoList" },
		domoNodes
	);
};

var loadDomosFromServer = function loadDomosFromServer() {
	sendAjax('GET', '/getDomos', null, function (data) {
		ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
	});
};

var setup = function setup(csrf) {
	ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

	ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

	loadDomosFromServer();
};

var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

$(document).ready(function () {
	getToken();
});
"use strict";

var handleError = function handleError(message) {
	$("#errorMessage").text(message);
	$("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
	$("#domoMessage").animate({ width: 'hide' }, 350);
	window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function error(xhr, status, _error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};
