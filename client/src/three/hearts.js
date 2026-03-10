import * as THREE from 'three'

// Heart Particle System
class HeartParticles {
  constructor(scene) {
    this.scene = scene
    this.hearts = []
    this.heartGeometry = null
    this.heartMaterial = null
    this.init()
  }

  init() {
    // Create heart shape
    const x = 0, y = 0
    const heartShape = new THREE.Shape()
    
    heartShape.moveTo(x + 0.5, y + 0.5)
    heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y)
    heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7)
    heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9)
    heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7)
    heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y)
    heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5)
    
    this.heartGeometry = new THREE.ShapeGeometry(heartShape)
    
    // Heart colors
    const colors = [
      0xff6b9d, // Pink
      0xff1493, // Deep pink
      0xff69b4, // Hot pink
      0xffb6c1, // Light pink
      0xff10f0, // Neon pink
      0xec4899  // Accent pink
    ]
    
    this.heartMaterial = new THREE.ShapeMaterial({
      vertexColors: false,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    })
  }

  createHeart(x, y, z, color, scale) {
    const material = this.heartMaterial.clone()
    material.color.setHex(color)
    
    const heart = new THREE.Mesh(this.heartGeometry, material)
    heart.position.set(x, y, z)
    heart.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )
    heart.scale.setScalar(scale)
    
    // Add animation properties
    heart.userData = {
      velocity: {
        x: (Math.random() - 0.5) * 0.02,
        y: Math.random() * 0.02 + 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      },
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01
    }
    
    this.scene.add(heart)
    this.hearts.push(heart)
    
    return heart
  }

  update(delta) {
    const time = Date.now() * 0.001
    
    // Remove hearts that have floated out of view
    for (let i = this.hearts.length - 1; i >= 0; i--) {
      const heart = this.hearts[i]
      
      // Update position
      heart.position.x += heart.userData.velocity.x
      heart.position.y += heart.userData.velocity.y
      heart.position.z += heart.userData.velocity.z
      
      // Wobble effect
      heart.userData.wobble += heart.userData.wobbleSpeed
      heart.position.x += Math.sin(heart.userData.wobble) * 0.003
      
      // Rotation
      heart.rotation.x += heart.userData.rotationSpeed.x
      heart.rotation.y += heart.userData.rotationSpeed.y
      heart.rotation.z += heart.userData.rotationSpeed.z
      
      // Fade out as it goes up
      if (heart.position.y > 15) {
        heart.material.opacity -= 0.01
        if (heart.material.opacity <= 0) {
          this.scene.remove(heart)
          heart.geometry.dispose()
          heart.material.dispose()
          this.hearts.splice(i, 1)
        }
      }
    }
    
    // Add new hearts periodically
    if (Math.random() < 0.03) {
      const colors = [0xff6b9d, 0xff1493, 0xff69b4, 0xffb6c1, 0xff10f0, 0xec4899]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const x = (Math.random() - 0.5) * 30
      const y = -10
      const z = (Math.random() - 0.5) * 20 - 10
      const scale = Math.random() * 0.3 + 0.1
      
      this.createHeart(x, y, z, color, scale)
    }
  }

  dispose() {
    this.hearts.forEach(heart => {
      this.scene.remove(heart)
      heart.geometry.dispose()
      heart.material.dispose()
    })
    this.hearts = []
    this.heartGeometry.dispose()
  }
}

// Leaf Particle System
class LeafParticles {
  constructor(scene) {
    this.scene = scene
    this.leaves = []
    this.init()
  }

  init() {
    // Leaf shapes
    this.leafGeometries = []
    
    // Simple leaf shape
    const leafShape = new THREE.Shape()
    leafShape.moveTo(0, 0)
    leafShape.quadraticCurveTo(0.5, 0.5, 0, 1)
    leafShape.quadraticCurveTo(-0.5, 0.5, 0, 0)
    
    this.leafGeometries.push(new THREE.ShapeGeometry(leafShape))
    
    // Another leaf variation
    const leafShape2 = new THREE.Shape()
    leafShape2.moveTo(0, 0)
    leafShape2.bezierCurveTo(0.3, 0.3, 0.5, 0.7, 0, 1)
    leafShape2.bezierCurveTo(-0.5, 0.7, -0.3, 0.3, 0, 0)
    
    this.leafGeometries.push(new THREE.ShapeGeometry(leafShape2))
  }

  createLeaf(x, y, z, scale, rotation, color) {
    const geometry = this.leafGeometries[Math.floor(Math.random() * this.leafGeometries.length)]
    const material = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    })
    
    const leaf = new THREE.Mesh(geometry, material)
    leaf.position.set(x, y, z)
    leaf.rotation.set(rotation.x, rotation.y, rotation.z)
    leaf.scale.setScalar(scale)
    
    leaf.userData = {
      velocity: {
        x: (Math.random() - 0.5) * 0.03,
        y: Math.random() * 0.015 + 0.005,
        z: (Math.random() - 0.5) * 0.02
      },
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.04
      },
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.03 + 0.01
    }
    
    this.scene.add(leaf)
    this.leaves.push(leaf)
    
    return leaf
  }

  update(delta) {
    const time = Date.now() * 0.001
    
    // Update leaves
    for (let i = this.leaves.length - 1; i >= 0; i--) {
      const leaf = this.leaves[i]
      
      // Falling motion
      leaf.position.x += leaf.userData.velocity.x
      leaf.position.y += leaf.userData.velocity.y
      leaf.position.z += leaf.userData.velocity.z
      
      // Swaying motion
      leaf.userData.swayPhase += leaf.userData.swaySpeed
      leaf.position.x += Math.sin(leaf.userData.swayPhase) * 0.01
      
      // Rotation
      leaf.rotation.x += leaf.userData.rotationSpeed.x
      leaf.rotation.y += leaf.userData.rotationSpeed.y
      leaf.rotation.z += leaf.userData.rotationSpeed.z
      
      // Remove leaves that have fallen out of view
      if (leaf.position.y > 15) {
        this.scene.remove(leaf)
        leaf.material.dispose()
        this.leaves.splice(i, 1)
      }
    }
    
    // Add new leaves periodically
    if (Math.random() < 0.02) {
      const colors = [
        0x22c55e, // Green
        0x16a34a, // Dark green
        0x4ade80, // Light green
        0x84cc16, // Lime
        0xf97316, // Orange (autumn)
        0xeab308  // Yellow (autumn)
      ]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const x = (Math.random() - 0.5) * 30
      const y = -10
      const z = (Math.random() - 0.5) * 20 - 10
      const scale = Math.random() * 0.4 + 0.15
      const rotation = {
        x: Math.random() * Math.PI,
        y: Math.random() * Math.PI,
        z: Math.random() * Math.PI
      }
      
      this.createLeaf(x, y, z, scale, rotation, color)
    }
  }

  dispose() {
    this.leaves.forEach(leaf => {
      this.scene.remove(leaf)
      leaf.geometry.dispose()
      leaf.material.dispose()
    })
    this.leaves = []
    this.leafGeometries.forEach(g => g.dispose())
  }
}

// Initialize background animation
let scene, camera, renderer
let heartParticles, leafParticles
let animationId = null

export function animateBackground(canvas) {
  // Scene setup
  scene = new THREE.Scene()
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 15
  
  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  
  // Create particle systems
  heartParticles = new HeartParticles(scene)
  leafParticles = new LeafParticles(scene)
  
  // Add ambient particles (subtle stars)
  const starsGeometry = new THREE.BufferGeometry()
  const starsCount = 500
  const positions = new Float32Array(starsCount * 3)
  
  for (let i = 0; i < starsCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100
    positions[i + 1] = (Math.random() - 0.5) * 100
    positions[i + 2] = (Math.random() - 0.5) * 50 - 20
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.5
  })
  
  const stars = new THREE.Points(starsGeometry, starsMaterial)
  scene.add(stars)
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
  
  // Animation loop
  let lastTime = 0
  
  function animate(currentTime) {
    animationId = requestAnimationFrame(animate)
    
    const delta = (currentTime - lastTime) * 0.001
    lastTime = currentTime
    
    // Update particle systems
    heartParticles.update(delta)
    leafParticles.update(delta)
    
    // Slowly rotate stars
    stars.rotation.y += 0.0001
    
    renderer.render(scene, camera)
  }
  
  animate(0)
}

export function initHearts(canvas) {
  // Legacy function for compatibility
}

export function initLeaves(canvas) {
  // Legacy function for compatibility
}

export function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (heartParticles) {
    heartParticles.dispose()
  }
  if (leafParticles) {
    leafParticles.dispose()
  }
}
