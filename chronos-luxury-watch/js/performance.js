/* ======================================================
CHRONOS PERFORMANCE ENGINE
Optimizes rendering and resource usage
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

/* ======================================================
ENGINE STATE
====================================================== */

const PerformanceEngine = {

fps:60,
frameCount:0,
lastTime:performance.now(),

isTabActive:true,

scrollTimeout:null,

resizeTimeout:null

};



/* ======================================================
FPS MONITOR
====================================================== */

function monitorFPS(time){

PerformanceEngine.frameCount++;

if(time - PerformanceEngine.lastTime >= 1000){

PerformanceEngine.fps =
Math.round(
(PerformanceEngine.frameCount * 1000) /
(time - PerformanceEngine.lastTime)
);

PerformanceEngine.frameCount = 0;
PerformanceEngine.lastTime = time;

if(PerformanceEngine.fps < 40){

console.warn(
"⚠ Chronos performance drop:",
PerformanceEngine.fps
);

}

}

requestAnimationFrame(monitorFPS);

}

requestAnimationFrame(monitorFPS);



/* ======================================================
LAZY IMAGE LOADING
====================================================== */

const lazyImages =
document.querySelectorAll("img");

const imageObserver =
new IntersectionObserver(function(entries,observer){

entries.forEach(function(entry){

if(entry.isIntersecting){

const img = entry.target;

const src = img.getAttribute("data-src");

if(src){

img.src = src;

img.removeAttribute("data-src");

}

observer.unobserve(img);

}

});

});

lazyImages.forEach(function(img){

if(img.dataset.src){

imageObserver.observe(img);

}

});



/* ======================================================
SCROLL OPTIMIZATION
====================================================== */

let lastScrollY = window.scrollY;

window.addEventListener("scroll", function(){

if(PerformanceEngine.scrollTimeout) return;

PerformanceEngine.scrollTimeout = true;

requestAnimationFrame(function(){

const currentScroll = window.scrollY;

const velocity = Math.abs(currentScroll - lastScrollY);

if(velocity > 100){

document.body.classList.add("fast-scroll");

}else{

document.body.classList.remove("fast-scroll");

}

lastScrollY = currentScroll;

PerformanceEngine.scrollTimeout = false;

});

},{passive:true});



/* ======================================================
RESIZE DEBOUNCE
====================================================== */

window.addEventListener("resize", function(){

clearTimeout(PerformanceEngine.resizeTimeout);

PerformanceEngine.resizeTimeout = setTimeout(function(){

console.log("Resize recalculated");

},200);

});



/* ======================================================
TAB VISIBILITY
====================================================== */

document.addEventListener("visibilitychange",function(){

if(document.hidden){

PerformanceEngine.isTabActive = false;

console.log("Chronos paused");

}else{

PerformanceEngine.isTabActive = true;

console.log("Chronos resumed");

}

});



/* ======================================================
ASSET PRELOADER
====================================================== */

const preloadAssets = [

"assets/images/watch-silver.jpg",
"assets/images/hero-watch.jpg",
"assets/images/philosophy-pocket-watch.jpg",
"assets/images/watch-black.jpg",
"assets/images/gallery1.jpg",
"assets/images/gallery2.jpg",
"assets/images/gallery3.jpg",
"assets/images/gallery4.jpg"

];

preloadAssets.forEach(function(src){

const img = new Image();
img.src = src;

});



/* ======================================================
MEMORY CLEANUP
====================================================== */

setInterval(function(){

const unusedNodes =
document.querySelectorAll("[data-remove='true']");

unusedNodes.forEach(function(node){

node.remove();

});

},15000);



/* ======================================================
SMOOTH ANIMATION FRAME
====================================================== */

function animationLoop(){

if(!PerformanceEngine.isTabActive){

requestAnimationFrame(animationLoop);
return;

}

requestAnimationFrame(animationLoop);

}

animationLoop();



});