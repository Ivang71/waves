import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

/**
 * Base
 */
// Debug
// const debug = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/11.png')


/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry()
const count = 40000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

const getPointFromSphere = () => {
  let d, x, y, z
  do {
    x = Math.random() * 2.0 - 1.0
    y = Math.random() * 2.0 - 1.0
    z = Math.random() * 2.0 - 1.0
    d = x*x + y*y + z*z
  } while(d > 1.0)
  return {x, y, z}
}
const getSquarePoint = () => {
  return {
    x: Math.random() - 0.5,
    y: Math.random() - 0.5,
    z: Math.random() - 0.5,
  }
}
const scale = 40

for (let i = 0; i < count * 3; i += 3) {
  const point = getSquarePoint()
  positions[i] = point.x * scale
  positions[i+1] = point.y * scale
  positions[i+2] = point.z * scale
  // colors[i] = Math.random()
  // colors[i+1] = Math.random()
  // colors[i+2] = Math.random()
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(colors, 3)
)

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  color: '#43c8dd',
  transparent: true,
  // alphaTest: 0.001,
  // vertexColors: true,
  depthWrite: false,
  // alphaMap: particleTexture,
})

// points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1)
camera.position.z = 3
camera.position.y = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const waveScale = 0.5

const tick = () => {
  const t = clock.getElapsedTime()

  // particles.rotation.y = t * 0.02

  for (let i = 0; i < count * 3; i += 3) {
    const x = particlesGeometry.attributes.position.array[i]
    const z = particlesGeometry.attributes.position.array[i+2]
    particlesGeometry.attributes.position.array[i+1] = (Math.sin(t + x) + Math.sin(z)) * waveScale
  }
  particlesGeometry.attributes.position.needsUpdate = true

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
