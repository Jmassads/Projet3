import {
	AjaxGet
} from './ajax';
import {
	Station
} from './station';
import {
	Timer
} from './timer';

let clearBtn = document.getElementById('clearBtn');

function Canvas(canvasEl, options) {
	// On récupere notre canvas
	this.canvasEl = document.querySelector(canvasEl);
	// Il faut accéder à ce qu'on appelle son contexte, avec getContext()
	this.ctx = this.canvasEl.getContext('2d');
	this.drawing = false;
	this.mousePos = {
		x: 0,
		y: 0
	};
	this.options = options || {};
	this.lastPos = this.mousePos;
	for (var optionName in this.defaultOptions) {
		if (typeof this.options[optionName] === 'undefined') this.options[optionName] = this.defaultOptions[optionName];
	}
	this.canvassetStyles();
	this.submitBtnClicked = 0; // Reservation button -> To check how many times it has been clicked.
}


Canvas.prototype.canvassetStyles = function () {
	this.canvasEl.width = this.options.width;
	this.canvasEl.height = this.options.height;
};
Canvas.prototype.defaultOptions = {
	width: 500,
	height: 200
};

// Get the position of the mouse relative to the canvas
// Recuperer la position de la souris relative au canvas
Canvas.prototype.getMousePos = function (canvasDom, mouseEvent) {
	// renvoie la taille du canvas et sa position relative par rapport à la zone d'affichage (viewport).
	let rect = canvasDom.getBoundingClientRect();
	// example DOMRect{
	// 	bottom: 309,
	// 	height: 204,
	// 	left: 278,
	// 	top: 105,
	// 	width: 304,
	// 	x: 278,
	// 	y: 105
	// }

	// Notre but principal est de récupérer les coordonnées de la souris ; pour cela, on a récupéré la variable event et celle-ci possède les propriétés qui nous intéressent : clientX et clientY.
	return {
		x: mouseEvent.clientX - rect.left, //x position within the element.
		y: mouseEvent.clientY - rect.top //y position within the element.
	};
};

// Draw to the canvas
Canvas.prototype.renderCanvas = function () {
	if (this.drawing) {

		// avec moveTo(), on déplace le « crayon » à l'endroit où on souhaite commencer le tracé :
		this.ctx.moveTo(this.lastPos.x, this.lastPos.y);
		// console.log('lastPos.x is ' + this.lastPos.x + ' lastPos.y is ' + this.lastPos.y);
		// on utilise lineTo() pour indiquer un deuxième point
		this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
		// console.log('mousePos.x is ' + this.mousePos.x + ' mousePos.y is ' + this.mousePos.y)
		// La méthode stroke() dessine le chemin 
		this.ctx.stroke();
		this.lastPos = this.mousePos;
		
	}
};

Canvas.prototype.draw = function () {
	let self = this;
	this.canvasEl.addEventListener('mousedown', function (e) {
		self.drawing = true;
		self.lastPos = self.getMousePos(self.canvasEl, e);
	});
	this.canvasEl.addEventListener('mouseup', function (e) {
		self.drawing = false;
	});
	this.canvasEl.addEventListener('mousemove', function (e) {
		self.mousePos = self.getMousePos(self.canvasEl, e);
		self.renderCanvas();
	});
	// Set up touch events for mobile, etc
	this.canvasEl.addEventListener(
		'touchstart',
		function (e) {
			self.drawing = true;
			self.lastPos = self.getTouchPos(self.canvasEl, e);
		}
	);
	this.canvasEl.addEventListener(
		'touchend',
		function (e) {
			self.drawing = false;
		}
	);
	this.canvasEl.addEventListener(
		'touchmove',
		function (e) {
			self.mousePos = self.getTouchPos(self.canvasEl, e);
			self.renderCanvas();
		}
	);
	
	// Prevent scrolling when touching the canvas
	this.canvasEl.addEventListener('touchstart', function (event) {
		event.preventDefault();
	});
	this.canvasEl.addEventListener('touchmove', function (event) {
		event.preventDefault();
	});
	this.canvasEl.addEventListener('touchend', function (event) {
		event.preventDefault();
	});
	this.canvasEl.addEventListener('touchcancel', function (event) {
		event.preventDefault();
	});

};

// Get the position of a touch relative to the canvas
Canvas.prototype.getTouchPos = function (canvasDom, touchEvent) {
	var rect = canvasDom.getBoundingClientRect();
	return {
		x: touchEvent.touches[0].clientX - rect.left,
		y: touchEvent.touches[0].clientY - rect.top
	};
	
};

Canvas.prototype.actions = function () {
	let self = this;
	clearBtn.addEventListener(
		'click',
		function (e) {
			self.clearCanvas();
		},
		false
	);
	// Clique sur 'je réserve mon vélo' (canvas section)
	document.querySelector('#submitBtn').addEventListener('click', function (event) {

		// On met le prénom dans le localStorage
		var firstName = document.querySelector('.fname').value;
		// replace() : effectue un rechercher/remplacer
		// On enlève les espaces
		firstName = firstName.replace(/^\s+/, '').replace(/\s+$/, '');
		localStorage.setItem("firstname", firstName);

		// On met le nom dans le localStorage
		var lastName = document.querySelector('.lname').value;
		lastName = lastName.replace(/^\s+/, '').replace(/\s+$/, '');
		localStorage.setItem("lastname", lastName);

		if (self.canvasEl.toDataURL() == document.getElementById('blank').toDataURL()) {
			// console.log(self.canvasEl.toDataURL());
			// console.log(document.getElementById('blank').toDataURL())
			event.preventDefault();
			event.stopImmediatePropagation();
			alert('Veuillez signez pour réserver votre vélo');
		} else if (firstName === "") {
			event.preventDefault();
			event.stopImmediatePropagation();
			alert('Veuillez renseigner votre prénom');
		} else if (lastName === "") {
			event.preventDefault();
			event.stopImmediatePropagation();
			alert('Veuillez renseigner votre nom');
		} else {

			document.querySelector('.name').innerHTML = localStorage.getItem("firstname") + ' ' + localStorage.getItem("lastname") + ' ';

			// Get Station Information and Display it
			// review this: maybe it would be better to get it from storage instead of doing an ajax request
			AjaxGet(
				'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=a01bfdb5fbe01d1416417f6509033ca85739897e',
				(reponse) => {
					let stations = JSON.parse(reponse);
					let stationInfo = document.querySelector('.station_number');
					let station = stations.filter((element) => element.number == stationInfo.id);
					let stationReserved = new Station(
						station[0].number,
						station[0].name,
						station[0].address,
						station[0].available_bikes,
						station[0].available_bike_stands
					);
					stationReserved.displayReservedBikeInfo();
					sessionStorage.setItem('station', JSON.stringify(stationReserved));
				}
			);

			self.submitBtnClicked++;
			if (self.submitBtnClicked > 1) {
				// console.log("C'est la deuxième fois que l'on clique sur le bouton 'Je réserve mon vélo et on verifie si il y a des données dans le sessionStorage");
				if (sessionStorage.getItem("date_expiration") !== null) {
					// console.log('date_expiration in session storage');
					if (confirm('Attention: cette nouvelle réservation remplacera la précédente')) {
						sessionStorage.clear();
						let newtimer = new Timer('#clockdiv', 20);
						newtimer.run_timer();
						// console.log("Après vérification, il y a des données dans le sessionStorage, donc on enlève les données du session storage car l'utilisateur a confirmé qu'il souhaite remplacer sa réservation actuelle et on redémarre le timer");
					} else {
						// console.log("Après vérification, il y a des données dans le session Storage, mais l'utilisateur ne souhaite pas annuler sa réservation actuelle donc on ne fait rien");
						return;
					}
				} else {
					// console.log("Après vérification, il n'y a pas de date_expiration dans le session Storage, donc on redémarre le timer");
					document.querySelector('#reservedStation').classList.remove('d-none');
					let newtimer = new Timer('#clockdiv', 20);
					newtimer.run_timer();
				}
			} else {
				// console.log('Première réservation');
				document.querySelector('#reservedStation').classList.remove('d-none');
				// On démarre le timer
				let timer = new Timer('#clockdiv', 20);

				if (sessionStorage.getItem("date_expiration") !== null) {
					// console.log('reservation made already');

					if (confirm('Attention: cette nouvelle réservation remplacera la précédente')) {
						sessionStorage.clear();
						let newtimer = new Timer('#clockdiv', 20);
						newtimer.run_timer();
					} else {
						return;
					}

				} else {
					// console.log('first time reservation');
					timer.run_timer();
					// localStorage.setItem("date_expiration", date_expiration);
				}
			}
		}
	});
};
Canvas.prototype.clearCanvas = function () {
	this.canvasEl.width = this.canvasEl.width;
	// clearRect(x, y, largeur, hauteur)
	this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
};

export {
	Canvas
};