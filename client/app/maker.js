const handleDomo = (e) => {
	e.preventDefault();
	
	$("#domoMessage").animate({ width: 'hide' }, 350);
	
	if($("#domoName").val() == '' || $("#domoAge").val == ''){
		handleError("RAWR! All fields are required");
		return false;
	}
	
	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), () => {
		loadDomosFromServer();
	});
	
	return false;
};

const deleteDomo = (e) => {
	
	const id = $(e.currentTarget).attr("data-domoid");
	const csrf = $("#csrf").val();
	
	sendAjax('POST', "/deleteDomo", `_csrf=${csrf}&id=${id}`, () => {
		loadDomosFromServer();
	});
};

const DomoForm = (props) => {
	return (
		<form id="domoForm"
			onSubmit={handleDomo}
			name="domoForm"
			action="/maker"
			method="POST"
			className="domoForm"
		>
			<label htmlFor="name">Name: </label>
			<input id="domoName" type="text" name="name" placeholder="Domo Name" />
			<label htmlFor="age">Age: </label>
			<input id="domoAge" type="text" name="age" placeholder="Domo Age" />
			<label htmlFor="element">Element: </label>
			<select id="domoElement" name="element">
				<option value="0">Water</option>
				<option value="1">Fire</option>
				<option value="2">Earth</option>
				<option value="3">Wind</option>
				<option value="4">Time</option>
				<option value="5">Space</option>
				<option value="6">Mirage</option>
			</select>
			<input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
			<input className="makeDomoSubmit" type="submit" value="Make Domo" />
		</form>
	);
};

const domoElementImgStruct = {
	0: "water.png",
	1: "fire.png",
	2: "earth.png",
	3: "wind.png",
	4: "time.png",
	5: "space.png",
	6: "mirage.png",
};

const DomoList = (props) => {
	if(props.domos.length === 0){
		return (
			<div className="domoList">
				<h3 className="emptyDomo">No Domos yet</h3>
			</div>
		);
	}
	
	const domoNodes = props.domos.map((domo) => {
		
		const elementImgUrl = `/assets/img/icons/${domoElementImgStruct[domo.element]}`;
		
		return (
			<div key={domo._id} className="domo">
				<img src="/assets/img/domoface.jpeg" alt="Domo Face" className="domoFace" />
				<h3 className="domoName"> Name: {domo.name} </h3>
				<h3 className="domoAge"> Age: {domo.age} </h3>
				<h3 className="domoElement"> Element: </h3>
				<img src={elementImgUrl} alt="Domo Element" className="domoElement" />
				<button className="deleteButton" onClick={(e) => {deleteDomo(e)}} data-domoid={domo._id}>Delete Domo</button>
			</div>
		);
	});
	
	return (
		<div className="domoList">
			{domoNodes}
		</div>
	);
};

const loadDomosFromServer = () => {
	sendAjax('GET', '/getDomos', null, (data) => {
		ReactDOM.render(
			<DomoList domos={data.domos} />,
			document.querySelector("#domos")
		);
	});
};

const setup = (csrf) => {
	ReactDOM.render(
		<DomoForm csrf={csrf} />,
		document.querySelector("#makeDomo")
	);
	
	ReactDOM.render(
		<DomoList domos={[]} />,
		document.querySelector("#domos")
	);
	
	loadDomosFromServer();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(() => {
	getToken();
});