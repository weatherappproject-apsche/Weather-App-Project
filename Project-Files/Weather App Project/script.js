const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoText = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = document.querySelector('.weather-part img');

inputField.addEventListener('keyup',e=>{
	if(e.key == "Enter" && inputField.value != ""){
		requestApi(inputField.value);
	}
});

locationBtn.addEventListener('click', ()=>{
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(onSuccess,onError);
	}else{
		alert("Your browser not supports geoloction api");
	}
});

function onSuccess(position){
	const {latitude, longitude} = position.coords;
	let apiKey = '42a9c0a64f7b84de6cfbb2111670aa2d';
	let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
	infoText.innerHTML = 'Getting weather details...';
	infoText.classList.add('pending');

	fetch(api).then((response)=>response.json()).then(response=>weatherDetails(response));

}

function onError(error){
	infoText.innerHTML = error.message;
	infoText.classList.add('error');
}

function requestApi(cityName){
	let apiKey = '42a9c0a64f7b84de6cfbb2111670aa2d';
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
	infoText.innerHTML = 'Getting weather details...';
	infoText.classList.add('pending');

	fetch(apiUrl).then((response)=>response.json()).then(response=>weatherDetails(response));
}

function weatherDetails(info){
	if(info.cod == "404"){
		infoText.innerHTML = `${inputField.value} is not a valid city name`;
		infoText.classList.add('error');
	}else{
		const city = info.name;
		const country = info.sys.country;
		const {description, id} = info.weather[0];
		const {feels_like, humidity, temp} = info.main;
		
		if(id == 800){
			wIcon.src = "icons/clear.png";
		}else if(id>=200 && id<=232){
			wIcon.src = "icons/storm.png";
		}else if(id>=600 && id<=622){
			wIcon.src = "icons/snow.png";
		}else if(id>=701 && id<=781){
			wIcon.src = "icons/snow.png";
		}else if(id>=801 && id<=804){
			wIcon.src = "icons/cloud.png";
		}else if((id>=300 && id<=321) || (id>=500 && id<=531)){
			wIcon.src = "icons/rain.png";
		}

		wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
		wrapper.querySelector(".weather").innerHTML = description;
		wrapper.querySelector(".location span").innerHTML = `${city}, ${country}`;
		wrapper.querySelector(".num-temp .numb").innerHTML = Math.floor(feels_like);
		wrapper.querySelector(".humidity span").innerHTML = `${humidity}%`;

 		infoText.classList.remove("pending","error");
		wrapper.classList.add("active")
	}
}