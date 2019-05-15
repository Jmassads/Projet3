let stationNumber = document.querySelector('.station_number');
let stationName = document.querySelector('.station_name');
let stationAddress = document.querySelector('.station_address');
let availableBikes = document.querySelector('.available_bikes');
let availableBikeStands = document.querySelector('.available_bike_stands');
let banking = document.querySelector('.banking');
let reservedStationName = document.querySelector('.reservedStationName');
let reservedStationaddress = document.querySelector('.reservedStationaddress');


// Here I'm using a class (introduced in ECMAScript 2015), which is just SYNTACTICAL SUGAR over JavaScript’s existing prototype-based inheritance. 

class Station {
	constructor(number, name, address, available_bikes, available_bike_stands, banking) {
		this.number = number;
		this.name = name;
		this.address = address;
		this.available_bikes = available_bikes;
		this.available_bike_stands = available_bike_stands;
		this.banking = banking;
	}


	// fenetre d'information
	displayStationInfowindow() {
		let contentString = `<div id="content">
      <h6>${this.name}</h6>
      <p>${this.address}</p>
      <span class="px-2"><i class="fas fa-bicycle"></i> ${this.available_bikes}</span>
      <span class="px-2"><i class="fas fa-parking"></i> ${this.available_bike_stands}</span>
      ${this.banking == true
			? `<i class="px-2 far fa-credit-card"></i>`
			: '<i class="px-2 light-visibility far fa-credit-card"></i>'}
      </div>`;
		return contentString;
	}

	    // panneau station
	displayStationPanelInfo() {
		// On recupere tous les elements de la fenetre d'information et on modifie les elements 
		let str = `${this.name}`;
		let result = str.replace(/[0-9-]/g, ' ');
		stationNumber.id = `${this.number}`;
		stationName.innerHTML = `${result}`;
		stationAddress.innerHTML = `${this.address}`;
		availableBikes.innerHTML = `${this.available_bikes}`;
		availableBikeStands.innerHTML = `${this.available_bike_stands}`;

		if (this.banking == true) {
			banking.classList.remove('light-visibility');
		} else {
			banking.classList.add('light-visibility');
		}
	}

	// confirmation de la reservation (voir canvas.js)
	displayReservedBikeInfo() {
		let str = `${this.name}`;
		let result = str.replace(/[0-9-]/g, ' ');
		reservedStationName.innerHTML = `${result}`;
		reservedStationaddress.innerHTML = `${this.address}`;
	}
}

export {
	Station
};