const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false }) // 优化性能
    if (!ctx) return

    let particles: Particle[] = []
    const mouse = { x: -1000, y: -1000, radius: 200, active: false }

    // 配置参数
    const settings = {
      particleCount: 0,
      baseSpeed: 0.6,
      friction: 0.96, // 摩擦力，用于平滑速度恢复
      mouseForce: 0.8, // 鼠标对粒子的影响力
      connectDistance: 110,
      particleColor: '#22d3ee' // cyan-400
    }

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      baseSize: number
      angle: number
      spin: number

      constructor(width: number, height: number) {
        this.x = Math.random() * width
        this.y = Math.random() * height
        // 赋予初始随机动力
        this.vx = (Math.random() - 0.5) * settings.baseSpeed * 2
        this.vy = (Math.random() - 0.5) * settings.baseSpeed * 2
        this.baseSize = Math.random() * 1.5 + 0.5
        this.size = this.baseSize
        this.angle = Math.random() * Math.PI * 2
        this.spin = (Math.random() - 0.5) * 0.02
      }

      draw() {
        if (!ctx) return

        // 计算速度对大小的影响（动感缩放）
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        const dynamicSize = this.baseSize + speed * 0.5

        ctx.fillStyle = settings.particleColor
        ctx.beginPath()
        ctx.arc(this.x, this.y, dynamicSize, 0, Math.PI * 2)
        ctx.fill()

        // 核心高亮
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(this.x, this.y, dynamicSize * 0.3, 0, Math.PI * 2)
        ctx.fill()
      }

      update(width: number, height: number) {
        // 自主漂浮逻辑：受微小正弦波动影响，看起来更像在水里漂
        this.angle += this.spin
        this.vx += Math.cos(this.angle) * 0.02
        this.vy += Math.sin(this.angle) * 0.02

        // 鼠标交互：矢量扰动
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius
          const angle = Math.atan2(dy, dx)

          // 产生一个推力加速度
          const tx = Math.cos(angle) * force * settings.mouseForce
          const ty = Math.sin(angle) * force * settings.mouseForce

          this.vx -= tx
          this.vy -= ty
        }

        // 应用速度和摩擦力
        this.x += this.vx
        this.y += this.vy
        this.vx *= settings.friction
        this.vy *= settings.friction

        // 速度下限保证粒子永远在动
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        if (speed < settings.baseSpeed) {
          const ratio = settings.baseSpeed / speed
          this.vx *= ratio
          this.vy *= ratio
        }

        // 环绕边界处理（从一边消失从另一边出现，保持连贯性）
        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }
    }

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const density = 9000
      settings.particleCount = Math.floor((canvas.width * canvas.height) / density)
      particles = []
      for (let i = 0; i < settings.particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height))
      }
    }

    const drawConnections = () => {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < settings.connectDistance) {
            const opacity = (1 - dist / settings.connectDistance) * 0.3
            ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      if (!ctx) return

      // 关键：不完全清空，而是覆盖一层透明度极低的背景色，产生“拖尾”效果
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)' // 对应 #020617，透明度控制拖尾长度
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.update(canvas.width, canvas.height)
        p.draw()
      })

      drawConnections()
      requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
      mouse.active = false
    }

    const handleResize = () => {
      init()
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    init()
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className='pointer-events-none fixed inset-0 z-0' />
}

export default ParticleBackground
