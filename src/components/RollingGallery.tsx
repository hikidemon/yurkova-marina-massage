import { useRef, useEffect } from "react"
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from "ogl"

type GL = Renderer["gl"]

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t
}

function autoBind(instance: any) {
  const proto = Object.getPrototypeOf(instance)
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance)
    }
  })
}

class Media {
  extra = 0
  geometry: Plane
  gl: GL
  image: string
  index: number
  length: number
  scene: Transform
  screen: { width: number; height: number }
  viewport: { width: number; height: number }
  bend: number
  program!: Program
  plane!: Mesh
  labelProgram!: Program
  labelMesh!: Mesh
  scale!: number
  padding!: number
  width!: number
  widthTotal!: number
  x!: number
  speed = 0
  isBefore = false
  isAfter = false

  constructor(opts: {
    geometry: Plane; gl: GL; image: string; index: number
    length: number; scene: Transform; screen: { width: number; height: number }
    viewport: { width: number; height: number }; bend: number
  }) {
    Object.assign(this, opts)
    autoBind(this)
    this.createShader()
    this.createLabel()
    this.createMesh()
    this.onResize()
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false })
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    })
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = this.image
    img.onload = () => { texture.image = img }
  }

  createLabel() {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 80
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, 512, 80)

    const grad = ctx.createLinearGradient(0, 0, 512, 0)
    grad.addColorStop(0, "rgba(248,244,239,0)")
    grad.addColorStop(0.1, "rgba(248,244,239,0.85)")
    grad.addColorStop(0.5, "rgba(248,244,239,0.9)")
    grad.addColorStop(0.9, "rgba(248,244,239,0.85)")
    grad.addColorStop(1, "rgba(248,244,239,0)")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 80)

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#1A2226"
    ctx.font = "500 28px Cormorant Garamond, serif"
    ctx.fillText(`Фото ${this.index % (this.length / 2) + 1}`, 256, 44)

    const tex = new Texture(this.gl, { generateMipmaps: false })
    tex.image = canvas
    this.labelProgram = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: tex } },
      transparent: true,
    })
    const labelGeom = new Plane(this.gl)
    this.labelMesh = new Mesh(this.gl, { geometry: labelGeom, program: this.labelProgram })
    this.labelMesh.setParent(this.scene)
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
    this.plane.setParent(this.scene)
  }

  update(scroll: { current: number; last: number }, direction: "right" | "left") {
    this.plane.position.x = this.x - scroll.current - this.extra
    this.labelMesh.position.x = this.x - scroll.current - this.extra
    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(this.bend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)
      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.labelMesh.position.y = this.plane.position.y - this.plane.scale.y / 2 - 0.15
    this.labelMesh.position.z = this.plane.position.z
    this.labelMesh.rotation.z = this.plane.rotation.z
    this.labelMesh.scale.set(this.plane.scale.x * 0.8, 0.12, 1)

    this.speed = scroll.current - scroll.last
    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }

  onResize(screen?: { width: number; height: number }, viewport?: { width: number; height: number }) {
    if (screen) this.screen = screen
    if (viewport) this.viewport = viewport
    this.scale = (this.screen?.height || 900) / 1500
    this.plane.scale.y = ((this.viewport?.height || 1) * (900 * this.scale)) / (this.screen?.height || 900)
    this.plane.scale.x = ((this.viewport?.width || 1) * (700 * this.scale)) / (this.screen?.width || 1440)
    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

interface Props {
  images: string[]
  bend?: number
}

export default function RollingGallery({ images, bend = 3 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || images.length === 0) return

    const renderer = new Renderer({ alpha: true })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    container.appendChild(gl.canvas as HTMLCanvasElement)

    const camera = new Camera(gl)
    camera.fov = 45
    camera.position.z = 20

    const scene = new Transform()
    const planeGeometry = new Plane(gl, { heightSegments: 10, widthSegments: 10 })

    let screen = { width: container.clientWidth, height: container.clientHeight }
    renderer.setSize(screen.width, screen.height)
    camera.perspective({ aspect: screen.width / screen.height })
    const fov = (camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * camera.position.z
    let viewport = { width: height * camera.aspect, height }

    const doubled = images.concat(images)
    const medias = doubled.map((src, i) =>
      new Media({ geometry: planeGeometry, gl, image: src, index: i, length: doubled.length, scene, screen, viewport, bend })
    )

    const isMobile = screen.width <= 768
    if (isMobile) {
      medias.forEach(m => m.plane.scale.set(m.plane.scale.x * 0.7, m.plane.scale.y * 0.7, 1))
    }

    const scroll = { ease: 0.05, current: 0, target: 0, last: 0 }
    let isDown = false
    let start = 0
    let scrollPos = 0

    const onResize = () => {
      screen = { width: container.clientWidth, height: container.clientHeight }
      const mobile = screen.width <= 768
      renderer.setSize(screen.width, screen.height)
      camera.perspective({ aspect: screen.width / screen.height })
      const f = (camera.fov * Math.PI) / 180
      const h = 2 * Math.tan(f / 2) * camera.position.z
      viewport = { width: h * camera.aspect, height: h }
      medias.forEach(m => {
        m.onResize(screen, viewport)
        if (mobile) m.plane.scale.set(m.plane.scale.x * 0.7, m.plane.scale.y * 0.7, 1)
      })
    }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDown = true
      scrollPos = scroll.current
      start = 'touches' in e ? e.touches[0].clientX : e.clientX
    }
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      scroll.target = (scrollPos ?? 0) + (start - x) * 0.05
    }
    const onPointerUp = () => { isDown = false }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('touchend', onPointerUp)

    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      scroll.current = lerp(scroll.current, scroll.target, scroll.ease)
      const direction = scroll.current > scroll.last ? 'right' : 'left'
      medias.forEach(m => m.update(scroll, direction))
      renderer.render({ scene, camera })
      scroll.last = scroll.current
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas as HTMLCanvasElement)
    }
  }, [images, bend])

  return (
    <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
  )
}
