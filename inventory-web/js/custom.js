
$(document).ready(function () {
  let Speed = 10;
  setTimeout(() => {
    Speed = 20;
  }, 2500)
  setTimeout(() => {
    Speed = 60;
  }, 5000)
  setTimeout(() => {
    Speed = 100;
  }, 10000)
  var _container = document.querySelector('html'),
    _boubles = document.querySelectorAll('svg circle'),
    _maxY = _container.clientHeight,
    _maxX = _container.clientWidth;

  function _NextBounce(bouble) {
    var r = bouble.getAttribute('r'),
      minY = r,
      minX = r,
      maxY = _maxY - r,
      maxX = _maxX - r,
      randY = random(minY, maxY),
      randX = random(minX, maxX);

    TweenMax.to(bouble, random(5, Speed), {
      attr: {
        cx: randX,
        cy: randY,
      },
      ease: Power1.easeInOut,
      onComplete: function () {
        _NextBounce(bouble);
      }
    });
  }

  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return Math.random() * (max - min) + Number(min);
  }

  // initialize
  for (var i = 0; i < _boubles.length; i++) {
    _NextBounce(_boubles[i]);
  }
});
