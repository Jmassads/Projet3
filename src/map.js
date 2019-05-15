/* 
https://developers.google.com/maps/documentation/javascript/reference/map
 */

import {
	AjaxGet
} from './ajax';
import {
	Station
} from './station';


const resetMapButton = document.querySelector("#reset-map");
const backToMapButton = document.querySelector("#back-to-map");
const panoramaElement = document.querySelector("#panorama");

function Map(lat, lng, zoom, streetViewControl) {
	this.map = map;
	this.panorama = panorama;
	this.lat = lat;
	this.lng = lng;
	this.zoom = zoom;
	this.streetViewControl = streetViewControl;
	this.locations;
}

// On ajoute la carte
Map.prototype.addMap = function (map_id, panorama_id) {

	// On instantie la classe google.maps.Map (extends MVCObject) et qui prend en parametre l'element HTML de la carte
	this.map = new google.maps.Map(document.getElementById(map_id), {
		// et on ajoute des parametres:

		// centre:
		center: {
			lat: this.lat,
			lng: this.lng
		},
        // niveau de zoom
		zoom: this.zoom,
		streetViewControl: this.streetViewControl
	});


	if (panorama_id) {
		// On instantie la classe google.maps.StreetViewPanorama (extends MVCObject) et qui prend en parametre l'element HTML de la carte
		this.panorama = new google.maps.StreetViewPanorama(document.getElementById(panorama_id), {
			position: {
				lat: this.lat,
				lng: this.lng
			},
			pov: {
				heading: 34,
				pitch: 10
			}
		});
		panoramaElement.style.display = "none";
	}

};

// On ajoute tous les marqueurs en fonction des 'coordinates' de l'API JCDecaux ainsi que les marker clusters
// La reponse correspont au responseText (parametre du callback).  et contient les données chargées dans une chaîne de caractères
Map.prototype.addMarkers = function () {

	AjaxGet('https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=a01bfdb5fbe01d1416417f6509033ca85739897e', (reponse) => {
		// La reponse obtenue est sous forme de chaine de caractere, donc pour le transformer en objet javascript, on doit faire JSON.parse(integré à Javascript)

		let stations = JSON.parse(reponse);

		// On utilise la méthode Array.prototype.map() pour créer un tableau de marqueurs basé sur les positions des marqueurs
		
		let markers = stations.map(function (station) {
			let customIcon =
				'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=' +
				station.available_bikes +
				'|FF776B|000000';

			// J'ai instantié la classes google.maps.Marker
			// This class extends MVCObject  
			let marker = new google.maps.Marker({
				position: station.position, // (required)
				icon: customIcon,
				shadow: 'https://chart.googleapis.com/chart?chst=d_map_pin_shadow'
			});

			let stationInfo = new Station(
				station.number,
				station.name,
				station.address,
				station.available_bikes,
				station.available_bike_stands,
				station.banking
			);

			// Fenêtre d'information
			// J'ai instantié la classe google.maps.InfoWindow
			// propriété content : données de la station (le nom, addresse, velos disponibles, parkings disponibles et si la carte de crédit est acceptée)  
			let infowindow = new google.maps.InfoWindow({
				content: stationInfo.displayStationInfowindow()
			});

			// https://developers.google.com/maps/documentation/javascript/events
			// Display infowindow on mouseover (Faire entrer le curseur sur l'élément)
			marker.addListener('mouseover', function () {
				setTimeout(function () {
					infowindow.open(this.map, marker);
				}, 500);
			});

			// Remove infowindow on mouseout (Faire sortir le curseur de l'élément)
			marker.addListener('mouseout', function () {
				setTimeout(function () {
					infowindow.close(this.map, marker);
				}, 500);
			});

			// Un clic sur un marqueur affiche l’état de la station dans un panneau construit en HTML et CSS
			marker.addListener('click', () => {
				document.getElementById('info-container').style.width = '300px';
				stationInfo.displayStationPanelInfo();
				if (stationInfo.available_bikes == 0) {
					document.querySelector('.button-reserve').classList.add('d-none');
				} else {
					document.querySelector('.button-reserve').classList.remove('d-none');
				}
			});
			return marker;
		});

		// https://developers.google.com/maps/documentation/javascript/marker-clustering
		// Add a marker clusterer to manage the markers.
		let markerCluster = new MarkerClusterer(this.map, markers, {
			imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
		});
	});
};

// Ici on reçoit la position d'une station
Map.prototype.visitBikeLocationOnMap = function (position) {
	// https://developers.google.com/maps/documentation/javascript/streetview
	this.panorama.setPosition(position); // Ici 
	panoramaElement.style.display = "block";
	backToMapButton.style.display = "block";
	resetMapButton.style.display = "none";
}

Map.prototype.visitLocation = function (number) {
	AjaxGet(
		"https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=a01bfdb5fbe01d1416417f6509033ca85739897e",
		reponse => {
			let locations = JSON.parse(reponse);
			// La méthode filter() crée et retourne un nouveau tableau contenant tous les éléments du tableau d'origine qui remplissent une condition déterminée par la fonction callback.
			let position = locations.filter(element => element.number == number)[0].position;
			// console.log(position);
			this.visitBikeLocationOnMap(position);
			google.maps.event.trigger(panorama, 'resize');
		});
}

Map.prototype.addBoardListeners = function () {
	let self = this;
	document.querySelector('body').addEventListener('click', function (event) {

		// Pour cacher le panneau
		if (event.target.classList.contains('close')) {
			document.getElementById('info-container').style.width = '0';
		}

		if (event.target.classList.contains('button-visit')) {
			// on récupere le numéro de la station
			self.visitLocation(event.target.parentElement.parentElement.getAttribute("id"));
		}
	});

	let buttonReserve = document.querySelector('.button-reserve');
	// On affiche le canvas
	buttonReserve.addEventListener('click', function () {
		document.querySelector('#canvas').classList.remove('d-none');
		// console.log("Quand on clique sur le bouton 'réserver', on affiche le canvas");
		document.querySelector('.fname').value = localStorage.getItem("firstname");
		document.querySelector('.lname').value = localStorage.getItem("lastname");
	});
}

Map.prototype.addMapListeners = function () {
	let self = this;
	// Button Reinitialiser la carte
	document.querySelector("#reset-map").addEventListener("click", function () {
		self.map.setCenter({
			lat: self.lat,
			lng: self.lng
		});
		self.map.setMapTypeId("roadmap");
		self.map.setZoom(12);
	});

	// Button Revenir à la carte
	document.querySelector("#back-to-map").addEventListener("click", self.backToMap);
};

Map.prototype.backToMap = function () {
	// Panorama en display none
	document.querySelector("#panorama").style.display = "none";
	// Button Revenir à la carte en display none
	document.querySelector("#back-to-map").style.display = "none";
	// Button Reinitialiser la carte en display block
	document.querySelector("#reset-map").style.display = "block";
}

// On ajoute 1 marqueur sur la carte (en fonction de la longitude et latitude de Lyon ou JCDecaux)
Map.prototype.addMarker = function (title) {
	let marker = new google.maps.Marker({
		position: {
			lat: this.lat,
			lng: this.lng
		},
		map: this.map,
		title: title
	});
};

export {
	Map
};