let canvas = document.querySelector('canvas'),
	ctx = canvas.getContext('2d'),
	scalar = 1,
	width = 610,
	height = 273,
	widthHalf = width * .5,
	heightHalf = height * .5,
	pSystemSize = 50,
	shadowPath = document.createElementNS('http://www.w3.org/2000/svg','path'),
	pathString = '',
	pathLength,
	repaint = 'rgba(0,0,8,.05)',
	drawRoute = 2,
	pAlt = false,
	scalarType = 3;

const tau = Math.PI * 2,
	  FILL = 2,
	  STROKE = 1;

drawRoute = FILL;

canvas.width = width;
canvas.height = height;
document.querySelector('.wrapper').style.width = width + 'px';

pathString = 'M264 97 l11 -82, 10 33, 41 0, 9 -33, 10 82 q72 32, 83 -70 c205 50, 205 155, 39 210 c-5 -60, -72 -60, -81 -12, -10 -42, -70 -32, -81 33 c-11 -72, -70 -72, -80 -33 c -9 -48, -76 -48, -81 12 c-168 -55, -168 -160, 40 -210 q9 102, 80 69';
pathStringExtra = ' m40 -95 c-405 0, -405 270, 0 270 c405 0, 405 -270, 0 -270';
defaultPathString = pathString;
shadowPath.setAttribute('d', pathString);
pathLength = shadowPath.getTotalLength();

const ParticleSystem = function(num){
	this.colour = '#fff';
	this.numParticles = num;
	this.allParticles = [];
	this.speed = 3;
	this.x = width * .5;
	this.y = height * .5;
	this.generate();
}
ParticleSystem.prototype.generate = function(){
	for(let i=0; i<this.numParticles; i++){
		let vo = {};
		vo.colour = i === 0 ? '#ffdc73' : '#a67c00';
		vo.position = pathLength / this.numParticles * i;
		vo.parent = this;
		vo.scalar = this.getScalar(i);
		vo.size = 1;
		vo.speed = this.speed;
		this.allParticles.push(new Particle(vo));
	}
}
ParticleSystem.prototype.getScalar = function(i){
	let scalar;
	switch(scalarType){
		case 1:
			scalar = .75 + (i % 15) * .02;
			break;
		case 2:
			scalar = .2 + (i % 9) * .1;
			break;
		case 3:
			scalar = .9 + (i % 3) * .05;
			break;
		case 4:
			scalar = 1;
			break;
		case 5:
			scalar = .3 + (.6 / this.numParticles) * i;
			break;
		case 6:
			scalar = (i % 2 ? .25 : .8);
			break;
		case 7:
			scalar = .8;
			break;
	}
	return scalar;
}
ParticleSystem.prototype.update = function(){
	for(let i=0; i<this.allParticles.length; i++){
		this.allParticles[i].update();
	}
}
ParticleSystem.prototype.getPointAtLength = function(id){
	return shadowPath.getPointAtLength(id);
}

const Particle = function(vo){
	this.colour = vo.colour;
	this.position = vo.position;
	this.parent = vo.parent;
	this.scalar = vo.scalar;
	this.size = vo.size;
	this.speed = vo.speed;
	this.pt = this.parent.getPointAtLength(this.position);
	this.x = this.pt.x * this.scalar;
	this.y = this.pt.y * this.scalar;
}
Particle.prototype.update = function(){
	this.position += this.speed;
	if(this.position >= pathLength){
		this.position = this.position - pathLength;
	}
	if(pAlt){
		this.scalar *= 1.011;
		if(this.scalar > 1.5){
			this.scalar = .1
		}
	}
	this.pt = this.parent.getPointAtLength(this.position);
	this.x = (this.pt.x - widthHalf) * this.scalar + this.parent.x;
	this.y = (this.pt.y - heightHalf) * this.scalar + this.parent.y;
}

function update(){
	system.update();
}

function draw(){
	ctx.fillStyle = repaint;
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = system.colour;
	for(let i=0; i<system.numParticles; i++){
		let p = system.allParticles[i];
		ctx.beginPath();
		if(drawRoute === STROKE){
			ctx.moveTo(widthHalf, heightHalf);
			ctx.lineTo(p.x, p.y);
			ctx.stroke();
		}
		else{
			if(!pAlt){
				ctx.fillStyle = p.colour;
			}
			ctx.arc(p.x, p.y, p.size, 0, tau, false);
			ctx.fill();
		}
	}
}
function animate(){
	update();
	draw();
	requestAnimationFrame(animate);
}
let system = new ParticleSystem(pSystemSize);
ctx.strokeStyle = system.colour;
ctx.strokeWidth = .5;
animate();




/* UI */
let options = [...document.querySelectorAll('.variant')];
for(let i=0; i<options.length; i++){
	options[i].addEventListener('click', (e) => handleClick(e));
}

function handleClick(e){
	for(let loop=options.length, i=0; i<loop; i++){
		options[i].className = e.target === options[i] ? 'active' : '';
	}
	drawRoute = FILL;
	pathString = defaultPathString;
	pAlt = false;
	repaint = 'rgba(0,0,8,.05)';
	system.colour = '#fff';
	switch(e.target){
		case options[0]:
			pSystemSize = system.numParticles = 50;
			system.speed = 3;
			scalarType = 3;
			break;
		case options[1]:
			ctx.strokeStyle = '#eee';
			pSystemSize = system.numParticles = 100;
			system.speed = 9;
			drawRoute = STROKE;
			scalarType = 1;
			break;
		case options[2]:
			pathString = defaultPathString + pathStringExtra;
			pSystemSize = system.numParticles = 20;
			system.speed = 99.9;
			scalarType = 4;
			break;
		case options[3]:
			ctx.strokeStyle = '#ffdc73';
			pSystemSize = system.numParticles = 100;
			system.speed = 4;
			drawRoute = STROKE;
			scalarType = 2;
			break;
		case options[4]:
			repaint = 'rgba(0,0,9,.1)'
			pSystemSize = system.numParticles = 30;
			system.speed = 15;
			scalarType = 5;
			break;
		case options[5]:
			repaint = 'rgba(0,0,9,.1)'
			system.colour = '#a67c00';
			pAlt = true;
			pSystemSize = system.numParticles = 30;
			system.speed = 13;
			scalarType = 6;
			break;
		case options[6]:
			pathString = defaultPathString + pathStringExtra;
			pSystemSize = system.numParticles = 20;
			system.speed = 3.2;
			scalarType = 7;
			break;
	}
	shadowPath.setAttribute('d', pathString);
	pathLength = shadowPath.getTotalLength();
	ctx.clearRect(0, 0, width, height);
	system.allParticles = [];
	system.generate();
}
