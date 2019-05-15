
// La méthode Date.parse() analyse la représentation textuelle d'une date, et renvoie le nombre de millisecondes depuis le 1er janvier 1970
function Timer(id, time_in_minutes) {
  this.id = document.querySelector(id);
  this.time_in_minutes = time_in_minutes;
  this.current_time = Date.parse(new Date());
  this.date_expiration = Date.parse(new Date(this.current_time + this.time_in_minutes * 60 * 1000)); // + 20 mins = + 1200000 ms.
  this.timeinterval;
  this.actions();
}

Timer.prototype.time_remaining = function () {

  let milliseconds;

  if (sessionStorage.getItem('date_expiration') !== null) {
    milliseconds = sessionStorage.getItem("date_expiration") - Date.parse(new Date());;
  } else {
    milliseconds = this.date_expiration - Date.parse(new Date());
  }
  // Store ->  Math.floor arrondi à l'entier inférieur ou égal
  // L'astuce avec l'opérateur modulo (%) est une manière simple de tester si un nombre est divisible par un autre nombre. S'il l'est, le reste de leur division, qui est ce que modulo produit, est zéro.
  let seconds = (milliseconds / 1000) % 60
    // (1200000 / 1000) mod 60 = 0 ; 1200 mod 60 = 0;
    // (1199000 / 1000 ) mod 60 = 59; 1199 mod 60 = 59 et ainsi de suite
    // (1140000 / 1000) mod 60 = 0 ; 1140 mod 60 = 0;
  let minutes = Math.floor((milliseconds / 1000 / 60) % 60); 
    // (1200000 / 1000 / 60) mod 60 = 20 ;  20 mod 60 = 20;
    // (1199000 / 1000 / 60) mod 60 = 20 ;  19.983333 mod 60 = 19.98333 et 19 avec Math.floor; 
    // (1140000 / 1000 / 60) mod 60 = 10 ;  19 mod 60 = 19;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return {
    'milliseconds' : milliseconds,
    'minutes': minutes,
    'seconds': seconds
  };

}

Timer.prototype.update_timer = function () {

  let total = this.time_remaining();
  sessionStorage.setItem("temps restant", JSON.stringify(total.minutes + ' minutes et ' + total.seconds + ' secondes'));
  this.id.innerHTML = total.minutes + ' min ' + total.seconds + 's'
  if (total.milliseconds <= 0) {
    clearInterval(this.timeinterval);
    sessionStorage.clear();
    document.querySelector('#reservedStation').classList.add('d-none');
    document.querySelector('#canvas').classList.add('d-none');
    document.querySelector('#expiredReservation').classList.remove('d-none');

    setTimeout(function () {
      document.querySelector('#expiredReservation').classList.add('d-none');
    }, 5000);
  }

}

Timer.prototype.run_timer = function () {

  this.update_timer(); // run function once at first to avoid delay
  this.timeinterval = setInterval(this.update_timer.bind(this), 1000);

  if (sessionStorage.getItem("date_expiration") === null) {
    sessionStorage.setItem("date_expiration", this.date_expiration);
  }

}
Timer.prototype.actions = function () {
  let self = this;
  // Clique sur le bouton 'annuler la réservation
  document.querySelector('.cancelReservation').addEventListener('click', function () {
    sessionStorage.clear()
    clearInterval(self.timeinterval);
   

    document.querySelector('#reservedStation').classList.add('d-none');
    // console.log('on met la section reservation en display none')
    document.querySelector('#canvas').classList.add('d-none');
    // console.log('on met le canvas en display none')


    document.querySelector('#cancelReservationSuccess').classList.remove('d-none');
    // console.log("on affiche le message d'annulation pour 5 secondes");
    setTimeout(function () {
      document.querySelector('#cancelReservationSuccess').classList.add('d-none');
    }, 5000);
  })


}

export {
  Timer
};