/* =========================================================
CHRONOS WATCH ZOOM ENGINE - PREMIUM
Advanced scroll & gesture-based zoom with physics
========================================================= */

(function() {

  'use strict'

  // ===================================================
  // PREMIUM ZOOM ENGINE STATE
  // ===================================================

  const ZoomEngine = {
    // Elements
    image: document.getElementById('watch-3d'),
    viewer: document.querySelector('.watch-viewer'),
    
    // Zoom state
    zoom: 1,
    targetZoom: 1,
    velocityZoom: 0,
    
    // Pan state
    panX: 0,
    panY: 0,
    targetPanX: 0,
    targetPanY: 0,
    
    // Configuration
    minZoom: 1,
    maxZoom: 3,
    zoomSensitivity: 0.12,
    panSensitivity: 1.2,
    frictionFactor: 0.92,
    interpolationFactor: 0.08,
    
    // Animation
    frameId: null,
    isAnimating: false,
    lastWheelTime: 0,
    wheelDebounce: 50,
    
    // Touch
    touchStartDistance: 0,
    touchStartZoom: 1,
    
    // UI
    showDebug: true
  }

  // Validate elements exist
  if (!ZoomEngine.image || !ZoomEngine.viewer) {
    console.error('Watch Zoom: Required DOM elements not found')
    return
  }

  // ===================================================
  // EASING FUNCTIONS
  // ===================================================

  const easing = {
    easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 + --t * 2 * (t *= t) * 2
  }

  // ===================================================
  // CORE ANIMATION LOOP
  // ===================================================

  function updateZoomPhysics() {
    // Apply momentum (friction)
    ZoomEngine.velocityZoom *= ZoomEngine.frictionFactor
    ZoomEngine.targetZoom += ZoomEngine.velocityZoom

    // Clamp within bounds
    ZoomEngine.targetZoom = Math.max(
      ZoomEngine.minZoom,
      Math.min(ZoomEngine.maxZoom, ZoomEngine.targetZoom)
    )

    // Smooth interpolation
    const zoomDiff = ZoomEngine.targetZoom - ZoomEngine.zoom
    if (Math.abs(zoomDiff) > 0.001) {
      ZoomEngine.zoom += zoomDiff * ZoomEngine.interpolationFactor
    } else {
      ZoomEngine.zoom = ZoomEngine.targetZoom
    }
  }

  function updatePanPhysics() {
    // Constrain pan based on zoom level
    const maxPan = (ZoomEngine.zoom - 1) * 50

    ZoomEngine.targetPanX = Math.max(-maxPan, Math.min(maxPan, ZoomEngine.targetPanX))
    ZoomEngine.targetPanY = Math.max(-maxPan, Math.min(maxPan, ZoomEngine.targetPanY))

    // Smooth pan interpolation
    const panDiffX = ZoomEngine.targetPanX - ZoomEngine.panX
    const panDiffY = ZoomEngine.targetPanY - ZoomEngine.panY

    if (Math.abs(panDiffX) > 0.1) {
      ZoomEngine.panX += panDiffX * ZoomEngine.interpolationFactor
    } else {
      ZoomEngine.panX = ZoomEngine.targetPanX
    }

    if (Math.abs(panDiffY) > 0.1) {
      ZoomEngine.panY += panDiffY * ZoomEngine.interpolationFactor
    } else {
      ZoomEngine.panY = ZoomEngine.targetPanY
    }
  }

  function applyTransform() {
    const zoomValue = Math.max(1, Math.min(ZoomEngine.maxZoom, ZoomEngine.zoom))
    const panX = ZoomEngine.panX.toFixed(2)
    const panY = ZoomEngine.panY.toFixed(2)

    // Apply transform to both viewer container AND image for unified zoom
    ZoomEngine.viewer.style.transform = 
      `scale(${zoomValue.toFixed(3)}) translate(${panX}px, ${panY}px)`
    
    ZoomEngine.image.style.transform = 
      `scale(${zoomValue.toFixed(3)}) translate(${panX}px, ${panY}px)`
  }

  function animationFrame() {
    updateZoomPhysics()
    updatePanPhysics()
    applyTransform()

    const hasZoomMovement = Math.abs(ZoomEngine.targetZoom - ZoomEngine.zoom) > 0.001
    const hasPanMovement = Math.abs(ZoomEngine.velocityZoom) > 0.0001

    if (hasZoomMovement || hasPanMovement) {
      ZoomEngine.frameId = requestAnimationFrame(animationFrame)
      ZoomEngine.isAnimating = true
    } else {
      ZoomEngine.isAnimating = false
    }
  }

  function startAnimation() {
    if (!ZoomEngine.isAnimating) {
      ZoomEngine.frameId = requestAnimationFrame(animationFrame)
      ZoomEngine.isAnimating = true
    }
  }

  // ===================================================
  // WHEEL SCROLL ZOOM
  // ===================================================

  ZoomEngine.viewer.addEventListener('wheel', function(e) {
    e.preventDefault()

    const now = Date.now()
    if (now - ZoomEngine.lastWheelTime < ZoomEngine.wheelDebounce) return
    ZoomEngine.lastWheelTime = now

    // Calculate zoom velocity from wheel delta
    const direction = e.deltaY > 0 ? -1 : 1
    ZoomEngine.velocityZoom = direction * ZoomEngine.zoomSensitivity
    ZoomEngine.targetZoom += ZoomEngine.velocityZoom * 2

    // Clamp
    ZoomEngine.targetZoom = Math.max(
      ZoomEngine.minZoom,
      Math.min(ZoomEngine.maxZoom, ZoomEngine.targetZoom)
    )

    logDebug(`🔍 Zoom: ${ZoomEngine.targetZoom.toFixed(2)}x`)
    startAnimation()
  }, { passive: false })

  // ===================================================
  // TOUCH PINCH ZOOM
  // ===================================================

  ZoomEngine.viewer.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const dx = touch1.clientX - touch2.clientX
      const dy = touch1.clientY - touch2.clientY
      ZoomEngine.touchStartDistance = Math.sqrt(dx * dx + dy * dy)
      ZoomEngine.touchStartZoom = ZoomEngine.zoom
    }
  }, { passive: true })

  ZoomEngine.viewer.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const dx = touch1.clientX - touch2.clientX
      const dy = touch1.clientY - touch2.clientY
      const currentDistance = Math.sqrt(dx * dx + dy * dy)
      const scale = currentDistance / ZoomEngine.touchStartDistance
      
      ZoomEngine.targetZoom = ZoomEngine.touchStartZoom * scale
      ZoomEngine.targetZoom = Math.max(
        ZoomEngine.minZoom,
        Math.min(ZoomEngine.maxZoom, ZoomEngine.targetZoom)
      )
      
      startAnimation()
    }
  }, { passive: false })

  // ===================================================
  // KEYBOARD SHORTCUTS
  // ===================================================

  document.addEventListener('keydown', function(e) {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      ZoomEngine.targetZoom = Math.min(
        ZoomEngine.maxZoom,
        ZoomEngine.targetZoom + 0.2
      )
      logDebug(`📈 Zoomed In: ${ZoomEngine.targetZoom.toFixed(2)}x`)
      startAnimation()
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault()
      ZoomEngine.targetZoom = Math.max(
        ZoomEngine.minZoom,
        ZoomEngine.targetZoom - 0.2
      )
      logDebug(`📉 Zoomed Out: ${ZoomEngine.targetZoom.toFixed(2)}x`)
      startAnimation()
    } else if (e.key === '0') {
      e.preventDefault()
      resetZoom()
    }
  })

  // ===================================================
  // RESET & PAN
  // ===================================================

  function resetZoom() {
    ZoomEngine.targetZoom = 1
    ZoomEngine.targetPanX = 0
    ZoomEngine.targetPanY = 0
    ZoomEngine.velocityZoom = 0
    logDebug('🔄 Zoom Reset to 1x')
    startAnimation()
  }

  // Double click to reset
  ZoomEngine.viewer.addEventListener('dblclick', resetZoom)

  // Pan on mouse move when zoomed in
  ZoomEngine.viewer.addEventListener('mousemove', function(e) {
    if (ZoomEngine.zoom > 1.1) {
      const rect = ZoomEngine.viewer.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const offsetX = (mouseX - centerX) / centerX
      const offsetY = (mouseY - centerY) / centerY

      ZoomEngine.targetPanX = offsetX * (ZoomEngine.zoom - 1) * 30
      ZoomEngine.targetPanY = offsetY * (ZoomEngine.zoom - 1) * 30

      startAnimation()
    }
  })

  // ===================================================
  // MOUSE WHEEL PAN (SHIFT + SCROLL)
  // ===================================================

  ZoomEngine.viewer.addEventListener('wheel', function(e) {
    if (e.shiftKey && ZoomEngine.zoom > 1.1) {
      e.preventDefault()
      ZoomEngine.targetPanX += e.deltaY * ZoomEngine.panSensitivity * -0.1
      logDebug(`↔️ Pan X: ${ZoomEngine.targetPanX.toFixed(1)}px`)
      startAnimation()
    }
  }, { passive: false })

  // ===================================================
  // INITIALIZATION
  // ===================================================

  function initialize() {
    ZoomEngine.image.style.willChange = 'transform'
    ZoomEngine.image.style.transformOrigin = 'center center'
    ZoomEngine.image.style.transition = 'none'
    
    ZoomEngine.viewer.style.willChange = 'transform'
    ZoomEngine.viewer.style.transformOrigin = 'center center'
    ZoomEngine.viewer.style.transition = 'none'
    ZoomEngine.viewer.style.overflow = 'hidden'
    
    applyTransform()
    
    logDebug('✨ Chronos Watch Zoom Engine Ready')
    logDebug('📋 Features: Scroll Zoom | Pinch Zoom | Keyboard (+/-/0) | Pan | Double-Click Reset')
  }

  // ===================================================
  // DEBUG LOGGING
  // ===================================================

  function logDebug(message) {
    if (ZoomEngine.showDebug) {
      console.log(`[WatchZoom] ${message}`)
    }
  }

  // Expose engine for external control
  window.WatchZoomEngine = ZoomEngine
  window.resetWatchZoom = resetZoom

  // Start
  initialize()
  startAnimation()

})()
