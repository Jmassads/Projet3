

let ImagesLoaded = require('imagesloaded');

/*
DIAPORAMAS
*/
import {
	Slider
} from './slideshow';

/* 
  <div id="galerie">
	<div class="item"></div>
	<div class="item"></div>
	<div class="item"></div>
  </div> 
*/


let slider = new Slider("#main-slider", ".item", 5000);
let footerslider = new Slider("#footer-slider", ".item", 5000);

/*
CARTES
*/
import {
	Map
} from './map';

function init() {
	// Carte de Lyon
	let stations_map = new Map(45.74846, 4.84671, 12, false);
	stations_map.addMap('map', 'panorama');
	stations_map.addMarker('Lyon');
	stations_map.addMarkers();
	stations_map.addMapListeners();
	stations_map.addBoardListeners();

	// Carte JC Decaux dans le Footer
	let JCD_map = new Map(48.797859, 1.964189, 16, true);
	JCD_map.addMap('map2');
	JCD_map.addMarker('JC Decaux');
}

// Comme j'ai utilisé les modules de webpack, les scopes sont separées. J'ai attaché la fonction init à la scope globale.
window.init = init;

/*
CANVAS
*/
import {
	Canvas
} from './canvas';
let blankCanvas = new Canvas('#blank', {
	width: 300,
	height: 200
});

let signatureCanvas = new Canvas('#signatureCanvas', {
	width: 300,
	height: 200
});

signatureCanvas.draw();
signatureCanvas.actions();

document.getElementById('menu').addEventListener('click', function () {
	document.getElementById('mySidenav').style.width = '250px';
});

document.querySelector('.closebtn').addEventListener('click', function () {
	document.getElementById('mySidenav').style.width = '0';
});

/* all links animation (Jquery) */
$(document).on('click', 'a[href^="#"]', function (event) {
	event.preventDefault();
	$('html, body').animate({
			scrollTop: $($.attr(this, 'href')).offset().top - 65
		},
		500
	);
});


// Axe d'amelioration (remplace sessionStorage par localStorage pour garder la réservation en cours affichée même si la personne ferme le navigateur)

import {
	Timer
} from './timer';

if (sessionStorage.getItem("date_expiration") !== null) {
	let updatetimer = new Timer('#clockdiv', 20);
	// console.log('Réservation en cours');
	let station = JSON.parse(sessionStorage.getItem('station'));
	document.querySelector('.reservedStationName').innerHTML = station.name;
	document.querySelector('.reservedStationaddress').innerHTML = station.address;
	document.querySelector('.name').innerHTML = localStorage.getItem('firstname') + ' ' + localStorage.getItem('lastname');
	document.getElementById('reservedStation').classList.remove("d-none");
	updatetimer.run_timer();
}

/*
Découvrez la ville de Lyon en vélo
Jquery utilisé pour que le texte s'affice sur mobile
*/
$("#popular_rides .image_holder").mouseenter(function () {
	$(this).find("img").css('opacity', '0.1');
	$(this).find(".middle_container").css('opacity', '1');
});
$("#popular_rides .image_holder").mouseleave(function () {
	$(this).find("img").css('opacity', '1');
	$(this).find(".middle_container").css('opacity', '0');
});

console.log('doc ready');






