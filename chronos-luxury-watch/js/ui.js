/* =========================================================
CHRONOS UI CONTROLLER
Handles interface interaction systems
========================================================= */

document.addEventListener("DOMContentLoaded", function(){



/* =========================================================
UI ENGINE STATE
========================================================= */

const UIEngine = {

activeSection:null,

scrollTopButton:null,

menuOpen:false,

focusableElements:[],

keyboardEnabled:true,

hoveredElement:null,

};



/* =========================================================
HELPERS
========================================================= */

function qs(selector){

return document.querySelector(selector)

}

function qsa(selector){

return document.querySelectorAll(selector)

}



/* =========================================================
NAVIGATION SYSTEM
========================================================= */

const navLinks = qsa(".navbar li")



function scrollToSection(name){

const section = document.querySelector("#"+name)

if(!section) return

section.scrollIntoView({
behavior:"smooth"
})

}



navLinks.forEach(function(link){

link.addEventListener("click",function(){

const name =
link.innerText.toLowerCase()

scrollToSection(name)

})

})



/* =========================================================
ACTIVE NAVBAR HIGHLIGHT
========================================================= */

const sections =
qsa("section")

function highlightActiveSection(){

let scrollY = window.scrollY

sections.forEach(function(section){

const offset =
section.offsetTop - 120

const height =
section.offsetHeight

if(scrollY >= offset &&
scrollY < offset + height){

UIEngine.activeSection =
section.id

navLinks.forEach(function(link){

link.classList.remove("active")

if(link.innerText.toLowerCase()
=== section.id){

link.classList.add("active")

}

})

}

})

}



window.addEventListener(
"scroll",
highlightActiveSection
)



/* =========================================================
BUTTON RIPPLE EFFECT
========================================================= */

const buttons =
qsa("button")

buttons.forEach(function(btn){

btn.addEventListener("click",function(e){

const ripple =
document.createElement("span")

const rect =
btn.getBoundingClientRect()

const size =
Math.max(rect.width,rect.height)

ripple.style.width = size+"px"
ripple.style.height = size+"px"

ripple.style.left =
e.clientX - rect.left - size/2 + "px"

ripple.style.top =
e.clientY - rect.top - size/2 + "px"

ripple.classList.add("ripple")

btn.appendChild(ripple)

setTimeout(function(){

ripple.remove()

},600)

})

})



/* =========================================================
SCROLL TO TOP BUTTON
========================================================= */

function createScrollTopButton(){

const btn =
document.createElement("button")

btn.innerText = "↑"

btn.classList.add("scroll-top")

document.body.appendChild(btn)

UIEngine.scrollTopButton = btn

btn.addEventListener("click",function(){

window.scrollTo({
top:0,
behavior:"smooth"
})

})

}



createScrollTopButton()



function toggleScrollTop(){

if(!UIEngine.scrollTopButton) return

if(window.scrollY > 600){

UIEngine.scrollTopButton.style.opacity = 1

}else{

UIEngine.scrollTopButton.style.opacity = 0

}

}



window.addEventListener(
"scroll",
toggleScrollTop
)



/* =========================================================
KEYBOARD NAVIGATION
========================================================= */

document.addEventListener("keydown",function(e){

if(!UIEngine.keyboardEnabled) return

if(e.key === "ArrowDown"){

window.scrollBy({

top:window.innerHeight * .8,

behavior:"smooth"

})

}

if(e.key === "ArrowUp"){

window.scrollBy({

top:-window.innerHeight * .8,

behavior:"smooth"

})

}

if(e.key === "Home"){

window.scrollTo({
top:0,
behavior:"smooth"
})

}

})



/* =========================================================
FOCUS MANAGEMENT
========================================================= */

function collectFocusable(){

UIEngine.focusableElements =
document.querySelectorAll(
"a,button,input,textarea,select"
)

}



collectFocusable()



document.addEventListener("keydown",function(e){

if(e.key !== "Tab") return

collectFocusable()

})



/* =========================================================
TOOLTIP SYSTEM
========================================================= */

const tooltipElements =
qsa("[data-tooltip]")



tooltipElements.forEach(function(el){

let tooltip

el.addEventListener("mouseenter",function(){

tooltip =
document.createElement("div")

tooltip.classList.add("tooltip")

tooltip.innerText =
el.dataset.tooltip

document.body.appendChild(tooltip)

const rect =
el.getBoundingClientRect()

tooltip.style.left =
rect.left + rect.width/2 + "px"

tooltip.style.top =
rect.top - 30 + "px"

})



el.addEventListener("mouseleave",function(){

if(tooltip){

tooltip.remove()

tooltip = null

}

})

})



/* =========================================================
MENU SYSTEM (FUTURE MOBILE SUPPORT)
========================================================= */

const menuButton =
qs(".menu-button")

const menuPanel =
qs(".mobile-menu")



function toggleMenu(){

if(!menuPanel) return

UIEngine.menuOpen =
!UIEngine.menuOpen

if(UIEngine.menuOpen){

menuPanel.classList.add("open")

}else{

menuPanel.classList.remove("open")

}

}



if(menuButton){

menuButton.addEventListener(
"click",
toggleMenu
)

}



/* =========================================================
ESCAPE KEY HANDLER
========================================================= */

document.addEventListener("keydown",function(e){

if(e.key === "Escape"){

if(UIEngine.menuOpen){

toggleMenu()

}

}

})



/* =========================================================
HOVER TRACKING
========================================================= */

document.addEventListener("mouseover",function(e){

UIEngine.hoveredElement =
e.target

})



/* =========================================================
FORM INPUT FOCUS
========================================================= */

const inputs =
qsa("input,textarea")

inputs.forEach(function(input){

input.addEventListener("focus",function(){

input.classList.add("focused")

})

input.addEventListener("blur",function(){

input.classList.remove("focused")

})

})



/* =========================================================
UI CLEANUP SYSTEM
========================================================= */

function cleanupUI(){

if(!UIEngine.hoveredElement) return

if(!UIEngine.hoveredElement.isConnected){

UIEngine.hoveredElement = null

}

}



setInterval(cleanupUI,10000)



/* =========================================================
INITIALIZATION
========================================================= */

highlightActiveSection()

toggleScrollTop()

console.log("Chronos UI System Ready")

})