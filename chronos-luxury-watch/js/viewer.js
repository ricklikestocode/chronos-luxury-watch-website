/* =========================================================
CHRONOS WATCH VIEWER ENGINE
PART 1 — CORE ENGINE
Author: Rutwik Vadali
========================================================= */

document.addEventListener("DOMContentLoaded", function(){



/* =========================================================
VIEWER STATE
========================================================= */

const ViewerEngine = {

mouseX:0,
mouseY:0,

rotateX:0,
rotateY:0,

targetRotateX:0,
targetRotateY:0,

zoom:1,
targetZoom:1,

velocityX:0,
velocityY:0,

isDragging:false,

lastX:0,
lastY:0,

viewerWidth:0,
viewerHeight:0,

activeProduct:0,

products:[],

frame:null,

isHovering:false

}



/* =========================================================
ELEMENTS
========================================================= */

const viewer =
document.querySelector(".watch-viewer")

const watch =
document.querySelector("#watch-3d")

const cards =
document.querySelectorAll(".watch-card img")



/* =========================================================
PRODUCT LIST
========================================================= */

ViewerEngine.products = [

"assets/images/watch-silver.jpg",
"assets/images/hero-watch.jpg",
"assets/images/watch-black.jpg"

]



/* =========================================================
PRELOAD IMAGES
========================================================= */

function preloadImages(){

ViewerEngine.products.forEach(function(src){

const img = new Image()

img.src = src

})

}

preloadImages()



/* =========================================================
UPDATE VIEWER SIZE
========================================================= */

function updateViewerSize(){

if(!viewer) return

const rect =
viewer.getBoundingClientRect()

ViewerEngine.viewerWidth =
rect.width

ViewerEngine.viewerHeight =
rect.height

}

updateViewerSize()



/* =========================================================
MOUSE TRACKING
========================================================= */

if(viewer){

viewer.addEventListener("mousemove",function(e){

const rect =
viewer.getBoundingClientRect()

ViewerEngine.mouseX =
e.clientX - rect.left

ViewerEngine.mouseY =
e.clientY - rect.top

})

viewer.addEventListener("mouseleave",function(){

ViewerEngine.rotateX = 0
ViewerEngine.rotateY = 0
ViewerEngine.targetRotateX = 0
ViewerEngine.targetRotateY = 0
ViewerEngine.velocityX = 0
ViewerEngine.velocityY = 0

})

}



/* =========================================================
DRAG ROTATION
========================================================= */

if(viewer){

viewer.addEventListener("mousedown",function(e){

ViewerEngine.isDragging = true

ViewerEngine.lastX = e.clientX
ViewerEngine.lastY = e.clientY

})

document.addEventListener("mouseup",function(){

ViewerEngine.isDragging = false

})

document.addEventListener("mousemove",function(e){

if(!ViewerEngine.isDragging) return

const dx =
e.clientX - ViewerEngine.lastX

const dy =
e.clientY - ViewerEngine.lastY

ViewerEngine.targetRotateY += dx * 0
ViewerEngine.targetRotateX += dy * 0

ViewerEngine.lastX = e.clientX
ViewerEngine.lastY = e.clientY

})

}



/* =========================================================
ZOOM SYSTEM
========================================================= */

if(viewer){

viewer.addEventListener("wheel", function(e){

e.preventDefault()

ViewerEngine.targetZoom +=
e.deltaY * -0.001

if(ViewerEngine.targetZoom < 1)
ViewerEngine.targetZoom = 1

if(ViewerEngine.targetZoom > 2)
ViewerEngine.targetZoom = 2

console.log("Zoom Target:", ViewerEngine.targetZoom)

}, { passive: false })

}




/* =========================================================
ENGINE READY
========================================================= */

console.log(
"Chronos Viewer Engine Core Ready"
)

})
/* =========================================================
CHRONOS WATCH VIEWER ENGINE
PART 2 — PHYSICS + LIGHTING
Author: Rutwik Vadali
========================================================= */

document.addEventListener("DOMContentLoaded", function(){



/* =========================================================
SMOOTH INTERPOLATION
========================================================= */

function interpolate(){

/* Rotation disabled for stability */

const zoomDifference = ViewerEngine.targetZoom - ViewerEngine.zoom

if(Math.abs(zoomDifference) > 0.001){

ViewerEngine.zoom +=
zoomDifference * .15

}

}



/* =========================================================
ROTATION INERTIA
========================================================= */

function applyInertia(){

ViewerEngine.velocityX *= .95
ViewerEngine.velocityY *= .95

ViewerEngine.rotateX += ViewerEngine.velocityY
ViewerEngine.rotateY += ViewerEngine.velocityX

}



/* =========================================================
LIGHT REFLECTION SYSTEM
========================================================= */

function updateLighting(){

if(!viewer) return

const percentX =
ViewerEngine.mouseX /
ViewerEngine.viewerWidth

const percentY =
ViewerEngine.mouseY /
ViewerEngine.viewerHeight

const lightX =
percentX * 100

const lightY =
percentY * 100

viewer.style.background =

`radial-gradient(
circle at ${lightX}% ${lightY}%,
rgba(255,255,255,.15),
transparent 40%
)`

}



/* =========================================================
WATCH SHIMMER EFFECT
========================================================= */

let shimmerAngle = 0

function updateWatchShimmer(){

if(!watch) return

shimmerAngle += .02

const glow =
Math.sin(shimmerAngle) * 10 + 15

watch.style.filter =

`drop-shadow(0 ${glow}px 25px rgba(255,255,255,.15))`

}



/* =========================================================
SPOTLIGHT HIGHLIGHT
========================================================= */

function updateSpotlight(){

if(!viewer) return

const percentX =
ViewerEngine.mouseX /
ViewerEngine.viewerWidth

const intensity =
percentX * .2 + .2

viewer.style.boxShadow =

`0 0 60px rgba(255,255,255,${intensity}) inset`

}



/* =========================================================
SMOOTH ZOOM TRANSITIONS
========================================================= */

function updateZoom(){

if(!watch) return

const zoomValue = ViewerEngine.zoom

watch.style.transform = `scale(${zoomValue})`

}



/* =========================================================
CURSOR HIGHLIGHT
========================================================= */

const viewerCursor =
document.createElement("div")

viewerCursor.classList.add("cursor-light")

document.body.appendChild(viewerCursor)

document.addEventListener("mousemove",function(e){

viewerCursor.style.left =
e.clientX + "px"

viewerCursor.style.top =
e.clientY + "px"

})



/* =========================================================
MOTION SMOOTHING
========================================================= */

function smoothMotion(){

interpolate()

updateLighting()

updateWatchShimmer()

updateSpotlight()

updateZoom()

}



/* =========================================================
PERFORMANCE MONITOR
========================================================= */

const ViewerPerformance = {

fps:60,

frameCount:0,

lastTime:performance.now()

}



function monitorFPS(time){

ViewerPerformance.frameCount++

if(time - ViewerPerformance.lastTime >= 1000){

ViewerPerformance.fps =

Math.round(

(ViewerPerformance.frameCount * 1000) /
(time - ViewerPerformance.lastTime)

)

ViewerPerformance.frameCount = 0

ViewerPerformance.lastTime = time

}

}



/* =========================================================
ANIMATION LOOP
========================================================= */

function viewerLoop(time){

monitorFPS(time)

smoothMotion()

ViewerEngine.frame =
requestAnimationFrame(viewerLoop)

}

viewerLoop()



/* =========================================================
ENGINE READY
========================================================= */

console.log(
"Chronos Viewer Lighting Engine Ready"
)

})
/* =========================================================
CHRONOS WATCH VIEWER ENGINE
PART 3 — PRODUCT CONTROL + MASTER LOOP
Author: Rutwik Vadali
========================================================= */

document.addEventListener("DOMContentLoaded", function(){



/* =========================================================
PRODUCT SWITCHING
========================================================= */

cards.forEach(function(card,index){

card.addEventListener("click",function(){

switchProduct(index)

})

})



function switchProduct(index){

ViewerEngine.activeProduct = index

const newSrc =
ViewerEngine.products[index]

watch.style.opacity = 0

setTimeout(function(){

watch.src = newSrc

watch.style.opacity = 1

},200)

}



/* =========================================================
KEYBOARD CONTROL
========================================================= */

document.addEventListener("keydown",function(e){

if(e.key === "ArrowLeft"){

switchProduct(
(ViewerEngine.activeProduct - 1 + ViewerEngine.products.length)
% ViewerEngine.products.length
)

}

if(e.key === "ArrowRight"){

switchProduct(
(ViewerEngine.activeProduct + 1)
% ViewerEngine.products.length
)

}

})



/* =========================================================
TOUCH SUPPORT
========================================================= */

if(viewer){

viewer.addEventListener("touchmove",function(e){

const touch =
e.touches[0]

const rect =
viewer.getBoundingClientRect()

ViewerEngine.mouseX =
touch.clientX - rect.left

ViewerEngine.mouseY =
touch.clientY - rect.top

})

}



/* =========================================================
RESET VIEWER
========================================================= */

function resetViewer(){

ViewerEngine.targetRotateX = 0
ViewerEngine.targetRotateY = 0
ViewerEngine.targetZoom = 1

}

document.addEventListener("dblclick",resetViewer)



/* =========================================================
RESIZE HANDLING
========================================================= */

window.addEventListener("resize",function(){

updateViewerSize()

})



/* =========================================================
ENGINE READY
========================================================= */

console.log(

"Chronos Watch Viewer Fully Initialized"

)

})
/* =========================================================
CHRONOS WATCH VIEWER ENGINE
PART 4 — 360° ROTATION SYSTEM
Author: Rutwik Vadali
========================================================= */

document.addEventListener("DOMContentLoaded",function(){



/* =========================================================
360 VIEWER STATE
========================================================= */

const Rotation360 = {

frame:0,

totalFrames:36,

dragging:false,

lastX:0,

images:[]

};



/* =========================================================
IMAGE PRELOAD
========================================================= */

function preload360(){

for(let i=1;i<=Rotation360.totalFrames;i++){

const img = new Image()

img.src =
`assets/360/watch-${i}.jpg`

Rotation360.images.push(img)

}

}

preload360()



/* =========================================================
UPDATE FRAME
========================================================= */

function updateFrame(){

if(!watch) return

const index =
Rotation360.frame % Rotation360.totalFrames

watch.src =
Rotation360.images[index].src

}



/* =========================================================
DRAG ROTATION
========================================================= */

if(viewer){

viewer.addEventListener("mousedown",function(e){

Rotation360.dragging = true

Rotation360.lastX = e.clientX

})



document.addEventListener("mouseup",function(){

Rotation360.dragging = false

})



document.addEventListener("mousemove",function(e){

if(!Rotation360.dragging) return

const dx =
e.clientX - Rotation360.lastX

if(Math.abs(dx) > 5){

Rotation360.frame +=
dx > 0 ? 1 : -1

updateFrame()

Rotation360.lastX = e.clientX

}

})

}



/* =========================================================
AUTO SPIN
========================================================= */

let autoSpin = true

viewer.addEventListener("mouseenter",function(){

autoSpin = false

})

viewer.addEventListener("mouseleave",function(){

autoSpin = true

})



function spinLoop(){

if(autoSpin){

Rotation360.frame++

updateFrame()

}

setTimeout(spinLoop,120)

}

spinLoop()



/* =========================================================
TOUCH SUPPORT
========================================================= */

viewer.addEventListener("touchmove",function(e){

const touch =
e.touches[0]

const dx =
touch.clientX - Rotation360.lastX

Rotation360.frame +=
dx > 0 ? 1 : -1

updateFrame()

Rotation360.lastX = touch.clientX

})



/* =========================================================
ENGINE READY
========================================================= */

console.log(
"Chronos 360° Viewer Ready"
)

})