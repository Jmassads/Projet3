// Slider
// constructeur
// Des qu'on crée un construteur, un prototype est crée
// Prototype sert de fallback

var Slider = function (id, slideClass, slideDuration) {
  var self = this;
  this.id = document.querySelector(id);
  this.sliderImages = document.querySelectorAll(id + ' ' + slideClass);
  this.current = 0;
  this.arrowRight = document.querySelector(id + ' .slider__next');
  this.arrowLeft = document.querySelector(id + ' .slider__prev');
  this.pauseButton = document.querySelector(id + ' .slider__action');
  this.playing = true;
  this.init();
  this.actions();
  this.slideDuration = slideDuration;
  // this.slideinterval = setInterval(this.nextSlide.bind(this), this.slideDuration);
  this.slideinterval;
  this.playSlideshow();
}




Slider.prototype.reset = function () {
  var self = this;
  for (let i = 0; i < self.sliderImages.length; i++) {
    self.sliderImages[i].style.display = 'none';
  }
};

// Init slider (Initializer)
Slider.prototype.init = function () {
  var self = this;
  self.reset();
  self.sliderImages[0].style.display = 'flex';
  // console.log(self.current);
};

// Go to next slide
Slider.prototype.nextSlide = function () {
  var self = this;
  if (self.current === self.sliderImages.length - 1) {
    self.current = -1;
  }
  self.reset();
  self.sliderImages[self.current + 1].style.display = 'flex'; // We want the next index slide to show
  self.current++; // Increase index by 1
  // console.log(self.current);
};

// Go to previous slide
Slider.prototype.previousSlide = function () {
  var self = this;
  if (self.current === 0) {
    self.current = self.sliderImages.length;
  }
  self.reset();
  self.sliderImages[self.current - 1].style.display = 'flex'; // We want the previous index slide to show
  self.current--; // Decrease index by 1
};


Slider.prototype.playSlideshow = function () {
  let self = this;
  if(self.pauseButton.parentElement.id == "main-slider"){
    self.pauseButton.style.backgroundImage = "url('img/pause_red.svg')";
  } else {
    self.pauseButton.style.backgroundImage = "url('img/pause_white.svg')";
  }
  
  self.playing = true;
  self.slideinterval = setInterval(this.nextSlide.bind(this), this.slideDuration);
}


Slider.prototype.pauseSlideshow = function () {
  let self = this;
  if(self.pauseButton.parentElement.id == "main-slider"){
    self.pauseButton.style.backgroundImage = "url('img/play-button_red.svg')";
  } else {
    self.pauseButton.style.backgroundImage = "url('img/play-button_white.svg')";
  }
  self.playing = false;
  clearInterval(self.slideinterval);
}

// actions (evenements -> click on buttons or keys)
Slider.prototype.actions = function () {
  let self = this;

  this.arrowRight.addEventListener('click', function () {
    self.nextSlide();
  });

  this.arrowLeft.addEventListener('click', function () {
    self.previousSlide();
  });

  document.addEventListener('keydown', function (e) {
    if (e.which === 37 || e.keyCode === 37 ) {
      if (self.current === 0) {
        self.current = self.sliderImages.length;
      }
      self.previousSlide();
    } else if (e.which === 39 || e.keyCode === 39) {
      if (self.current === self.sliderImages.length - 1) {
        self.current = -1;
      }
      self.nextSlide();
    }
  });

  this.pauseButton.addEventListener('click', function () {
    if (self.playing) {
      // console.log('pause slideshow')
      self.pauseSlideshow();
    } else {
      // console.log('play slideshow')
      self.playSlideshow();
    }
  });



};



export {
  Slider
}