import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera } from '@react-three/drei'
import { geoContains, geoEquirectangular } from 'd3-geo'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { ComponentType, CSSProperties } from 'react'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import MarqueeImport from 'react-fast-marquee'
import type { MarqueeProps } from 'react-fast-marquee'
import styled, { createGlobalStyle } from 'styled-components'
import * as THREE from 'three'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import landAtlas from 'world-atlas/land-110m.json'

const Marquee = ((MarqueeImport as unknown as { default?: ComponentType<MarqueeProps> }).default ??
  MarqueeImport) as ComponentType<MarqueeProps>

const experiences = [
  {
    company: 'TDCX',
    period: 'January 2022 - Present',
    mode: 'Full-time',
    role: 'Senior Frontend Engineer',
    signal: 'Frontend ownership across product, AI, and platform systems',
    bullets: [
      'Possess ownership and lead frontend development across multiple projects, collaborating closely with UI/UX and product teams on design specifications and application capabilities.',
      'Research and develop with AI/ML teams to craft prototypes and proof-of-concepts, while joining product discussions and brainstorming sessions to improve solution quality.',
      'Develop frontend applications using modern JavaScript frameworks like ReactJS and NextJS with TypeScript, leveraging server actions and API routes to improve performance, SEO, and user experience.',
      'Implement Zod validations for form management and React Query for controlled data caching, with Zustand used to improve state management and application scalability.',
      'Improve code quality by abstracting functions, writing reusable custom React hooks, and leveraging built-in React hooks like useCallback and useMemo for better performance.',
      'Develop modern web applications using Shadcn UI with TailwindCSS, while introducing code quality standards and modern technologies for easier development.',
      'Set up monorepo project architecture and Dockerize client and server containers for CI/CD pipelines, working closely with backend teams to understand API request-response payloads.',
    ],
    projects:
      'Frontend lead on Chrome extension development, AI-powered proof-of-concepts, public-facing dashboards, and internal product systems.',
  },
  {
    company: 'Voronoi',
    period: 'December 2024 - Present',
    mode: 'Freelance',
    role: 'Web3 / DeFi Frontend Engineer',
    signal: 'Multi-chain execution interfaces',
    bullets: [
      'Architect cross-chain interfaces for EVM networks like Base and BSC, plus SVM on Solana.',
      'Manage complex wallet integrations through Privy, Dynamic, Solflare, Phantom, and Ledger hardware flows.',
      'Design execution UI/UX for TWAP and custom trading algorithms with live Alchemy and Helius RPC data.',
      'Integrate swap workflows through Uniswap V4, Raydium, and OKX Aggregator with precision, gas, wrapping, and unwrapping concerns.',
      'Move fetching to React Query with custom RPC batching and caching, reducing 429 errors and improving dashboard responsiveness by 40%.',
    ],
    projects: 'Automated trading dashboard, arbitrage trading configuration UI, company internal operations dashboard.',
  },
]

const capabilities = [
  ['Web3 Core', 'Ethers.js, @solana/web3.js, Alchemy, Helius, RPC optimization'],
  ['Protocols', 'Uniswap V4, Raydium, OKX Aggregator'],
  ['Wallets', 'Privy, Dynamic, Solflare, Phantom, Ledger hardware integration'],
  ['Frontend', 'Next.js, React, TypeScript, Zod, Styled Components'],
  ['State + Data', 'React Query, Zustand, Redux'],
  ['Systems', 'Node.js, Express, PostgreSQL, MongoDB, Prisma, Supabase'],
  ['Infra', 'Docker, monorepo architecture, CI/CD, GitHub Actions, Playwright E2E'],
]

const featuredProjects = [
  {
    title: '2AMRECORDS',
    description:
      'E-commerce clothing web store. Designed for selling premium and authentic clothing. Built with Next.js, Firebase, Stripe API as payment gateway.',
    previewUrl: 'https://2amrecords.club/',
    url: 'https://2amrecords-r2y8bx3mc-kenneth-1203.vercel.app/',
    status: 'deprecated',
    accent: '56, 189, 248',
  },
  {
    title: 'Swarass Production',
    description:
      'Single-paged application. Landing page for an event management company. Built with Next.js - SEO optimized, Framer Motion for animations and transitions.',
    previewUrl: 'https://swarass.asia/',
    url: 'https://swarass.asia/',
    status: 'live',
    accent: '190, 74, 45',
  },
  {
    title: 'Private Web3 Trading Dashboard',
    description:
      'Internal trading operations dashboard for configuring automated strategies, monitoring RPC state, and supporting EVM/SVM execution workflows. Public preview unavailable due to private infrastructure.',
    previewUrl: 'private://web3-trading-dashboard',
    status: 'private',
    accent: '126, 87, 184',
  },
]

const marqueeStacks = [
  {
    name: 'Next.js',
    src: 'https://cdn.simpleicons.org/nextdotjs/ffffff',
    accent: '100, 100, 100',
  },
  {
    name: 'TypeScript',
    src: 'https://cdn.simpleicons.org/typescript/ffffff',
    accent: '28, 153, 255',
  },
  {
    name: 'React',
    src: 'https://cdn.simpleicons.org/react/ffffff',
    accent: '61, 184, 255',
  },
  {
    name: 'Node.js',
    src: 'https://cdn.simpleicons.org/nodedotjs/ffffff',
    accent: '103, 255, 61',
  },
  {
    name: 'TailwindCSS',
    src: 'https://cdn.simpleicons.org/tailwindcss/ffffff',
    accent: '61, 142, 255',
  },
]

const socialLinks = [
  {
    name: 'GitHub',
    label: 'Code archive',
    href: 'https://github.com/kenneth-1203',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    label: 'Professional profile',
    href: 'https://www.linkedin.com/in/kenneth-kho-b19888204',
    icon: 'linkedin',
  },
  {
    name: 'Email',
    label: 'Google mail',
    href: 'mailto:kennethk.1203@gmail.com',
    icon: 'google',
  },
]

const wordContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.036,
      delayChildren: 0.04,
    },
  },
}

const wordItem: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.62,
      ease: 'easeOut',
    },
  },
}

function AnimatedWords({
  text,
  highlight = [],
  amount = 0.45,
}: {
  text: string
  highlight?: string[]
  amount?: number
}) {
  const highlighted = useMemo(() => new Set(highlight.map((word) => word.toLowerCase())), [highlight])
  const words = useMemo(() => text.split(' '), [text])

  return (
    <WordGroup
      aria-label={text}
      variants={wordContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount }}
    >
      {words.map((word, index) => {
        const normalized = word.replace(/[^\w+#@./-]/g, '').toLowerCase()
        const content = highlighted.has(normalized) ? <mark>{word}</mark> : word

        return (
          <Fragment key={`${word}-${index}`}>
            <Word aria-hidden="true" variants={wordItem}>
              {content}
            </Word>
            {index < words.length - 1 ? ' ' : ''}
          </Fragment>
        )
      })}
    </WordGroup>
  )
}

function NetworkCore() {
  const group = useRef<THREE.Group>(null)
  const points = useMemo(() => {
    return Array.from({ length: 54 }, (_, index) => {
      const theta = index * 0.62
      const radius = 1.1 + (index % 9) * 0.105
      return new THREE.Vector3(
        Math.cos(theta) * radius,
        Math.sin(index * 0.41) * 0.52,
        Math.sin(theta) * radius,
      )
    })
  }, [])

  useFrame(({ clock, pointer }) => {
    if (!group.current) return
    group.current.rotation.y = clock.elapsedTime * 0.08 + pointer.x * 0.12
    group.current.rotation.x = -0.12 + pointer.y * 0.08
  })

  return (
    <group ref={group}>
      {points.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.014 + (index % 3) * 0.004, 12, 12]} />
          <meshBasicMaterial color={index % 7 === 0 ? '#ffffff' : '#9a9a9a'} />
        </mesh>
      ))}
      {points.slice(0, -1).map((point, index) => {
        const next = points[index + 1]
        const distance = point.distanceTo(next)
        const midpoint = point.clone().add(next).multiplyScalar(0.5)
        const direction = next.clone().sub(point).normalize()
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction,
        )

        return (
          <mesh key={`line-${index}`} position={midpoint} quaternion={quaternion}>
            <cylinderGeometry args={[0.003, 0.003, distance, 6]} />
            <meshBasicMaterial color="#565656" transparent opacity={0.5} />
          </mesh>
        )
      })}
      <mesh>
        <torusKnotGeometry args={[0.9, 0.006, 180, 8, 2, 5]} />
        <meshBasicMaterial color="#f4f4f4" transparent opacity={0.42} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <Canvas dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0.2, 4.2]} fov={42} />
      <ambientLight intensity={1.6} />
      <Float speed={1.15} rotationIntensity={0.38} floatIntensity={0.7}>
        <NetworkCore />
      </Float>
    </Canvas>
  )
}

function CursorField() {
  const [position, setPosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('pointermove', handlePointer)
    return () => window.removeEventListener('pointermove', handlePointer)
  }, [])

  return (
    <DotField
      aria-hidden="true"
      style={{ '--x': `${position.x}px`, '--y': `${position.y}px` } as CSSProperties}
    />
  )
}

function ExperienceBlock({ item, index }: { item: (typeof experiences)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 72%', 'end 28%'],
  })
  const beam = useSpring(scrollYProgress, { stiffness: 92, damping: 24, mass: 0.2 })
  const parallax = useTransform(scrollYProgress, [0, 1], [80, -80])

  return (
    <Experience ref={ref}>
      <StickyMeta>
        <span>0{index + 1}</span>
        <h3>{item.company}</h3>
        <p>{item.period}</p>
        <small>{item.mode}</small>
      </StickyMeta>
      <ExperienceBody>
        <BeamRail>
          <motion.span style={{ scaleY: beam }} />
        </BeamRail>
        <motion.div style={{ y: parallax }}>
          <Kicker>{item.signal}</Kicker>
          <h4>
            <AnimatedWords text={item.role} amount={0.55} />
          </h4>
          <ul>
            {item.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <ProjectLine>
            <b>Project trace</b>
            <span>{item.projects}</span>
          </ProjectLine>
        </motion.div>
      </ExperienceBody>
    </Experience>
  )
}

function StackMarquee() {
  const row = [...marqueeStacks, ...marqueeStacks]

  return (
    <StackBand aria-label="Primary technology stack">
      <StackMeta>
        <span>Core stack</span>
        <p>Production interface systems built with typed React architecture.</p>
      </StackMeta>
      <MarqueeLayer>
        <Marquee speed={48} gradient={false} pauseOnHover>
          {row.map((stack, index) => (
            <StackLogo key={`${stack.name}-${index}`} $accent={stack.accent}>
              <img src={stack.src} alt="" loading="lazy" />
              <span>{stack.name}</span>
            </StackLogo>
          ))}
        </Marquee>
        <Marquee speed={34} gradient={false} direction="right" pauseOnHover>
          {row
            .slice()
            .reverse()
            .map((stack, index) => (
              <StackLogo key={`${stack.name}-reverse-${index}`} $accent={stack.accent} $ghost>
                <img src={stack.src} alt="" loading="lazy" />
                <span>{stack.name}</span>
              </StackLogo>
            ))}
        </Marquee>
      </MarqueeLayer>
    </StackBand>
  )
}

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]['icon'] }) {
  if (icon === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.43-2.69 5.39-5.26 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    )
  }

  if (icon === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.68H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.42a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.03H3.54V8.98H7.1v11.47ZM22.23 0H1.76C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.81 10.23H12v3.95h5.64c-.24 1.27-.97 2.35-2.07 3.07v2.55h3.35c1.96-1.78 3.09-4.4 3.09-7.5 0-.72-.07-1.42-.2-2.07Z" />
      <path d="M12 22c2.8 0 5.15-.91 6.87-2.47l-3.35-2.55c-.93.61-2.11.97-3.52.97-2.71 0-5.01-1.79-5.83-4.2H2.71v2.63A10.37 10.37 0 0 0 12 22Z" />
      <path d="M6.17 13.75A6.11 6.11 0 0 1 5.84 12c0-.61.12-1.2.33-1.75V7.62H2.71A9.83 9.83 0 0 0 1.62 12c0 1.58.39 3.07 1.09 4.38l3.46-2.63Z" />
      <path d="M12 6.05c1.52 0 2.88.51 3.95 1.5l2.98-2.92C17.14 2.99 14.8 2 12 2a10.37 10.37 0 0 0-9.29 5.62l3.46 2.63c.82-2.41 3.12-4.2 5.83-4.2Z" />
    </svg>
  )
}

function DottedWorldMap() {
  const mapRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: mapRef,
    offset: ['start 86%', 'center 48%'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.25 })
  const rotateX = useTransform(smoothProgress, [0, 1], [58, 0])
  const rotateZ = useTransform(smoothProgress, [0, 1], [-3, 0])
  const y = useTransform(smoothProgress, [0, 1], [-74, 0])
  const scale = useTransform(smoothProgress, [0, 1], [1.08, 0.98])

  const dots = useMemo(() => {
    const topology = landAtlas as Topology<{ land: GeometryCollection }>
    const land = feature(topology, topology.objects.land)
    const projection = geoEquirectangular().fitExtent(
      [
        [24, 38],
        [976, 430],
      ],
      { type: 'Sphere' },
    )
    const projected: Array<{ x: number; y: number }> = []

    for (let lon = -180; lon <= 180; lon += 3.4) {
      for (let lat = -58; lat <= 82; lat += 3.4) {
        if (geoContains(land, [lon, lat])) {
          const point = projection([lon, lat])
          if (point) {
            projected.push({ x: point[0], y: point[1] })
          }
        }
      }
    }

    return projected
  }, [])

  const malaysia = useMemo(() => {
    const projection = geoEquirectangular().fitExtent(
      [
        [24, 38],
        [976, 430],
      ],
      { type: 'Sphere' },
    )
    const point = projection([101.6869, 3.139])
    return { x: point?.[0] ?? 785, y: point?.[1] ?? 284 }
  }, [])

  return (
    <MapShell ref={mapRef} aria-label="Dotted world map highlighting Malaysia">
      <MapScene style={{ rotateX, rotateZ, y, scale }}>
        <svg viewBox="0 0 1000 520" role="img">
          <title>Dotted world map highlighting Kuala Lumpur, Malaysia</title>
          <g className="grid">
            <path d="M0 260H1000" />
            <path d="M500 0V520" />
            <path d="M160 0V520" />
            <path d="M840 0V520" />
          </g>
          <g className="dots">
            {dots.map((dot, index) => (
              <circle key={`${dot.x}-${dot.y}-${index}`} cx={dot.x} cy={dot.y} r="1.45" />
            ))}
          </g>
          <g className="target" transform={`translate(${malaysia.x} ${malaysia.y})`}>
            <ellipse rx="58" ry="18" />
            <circle r="4" />
            <path d="M0 0V-120" />
            <foreignObject x="-82" y="-168" width="164" height="48">
              <div className="map-label">Kuala Lumpur</div>
            </foreignObject>
          </g>
        </svg>
      </MapScene>
      <MapCaption>
        <span>Origin</span>
        <strong>Malaysia</strong>
      </MapCaption>
    </MapShell>
  )
}

function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, -150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.35])

  return (
    <>
      <GlobalStyle />
      <CursorField />
      <Progress style={{ scaleX: progress }} />
      <Shell>
        <Nav>
          <a href="#top">Kenneth Kho</a>
          <div>
            <a href="#experience">Experience</a>
            <a href="#capabilities">Stack</a>
            <a href="#contact">Contact</a>
          </div>
        </Nav>

        <Hero id="top">
          <HeroCopy style={{ y: heroY, opacity: heroOpacity }}>
            <Eyebrow>Senior Frontend Engineer / Web3 Lead</Eyebrow>
            <h1>
              <AnimatedWords
                text="Kenneth Kho builds precision interfaces for DeFi and frontend systems."
                highlight={['precision', 'interfaces']}
                amount={0.22}
              />
            </h1>
            <HeroSub>
              Frontend architecture, multi-chain DeFi execution, reusable design
              systems, data layers, and production-grade workflows for teams that
              care about correctness under pressure.
            </HeroSub>
            <HeroActions>
              <a href="#experience">Trace experience</a>
              <a href="#capabilities">Inspect stack</a>
            </HeroActions>
          </HeroCopy>
          <Stage>
            <Scene />
          </Stage>
        </Hero>

        <StackMarquee />

        <FeatureSection>
          <FeatureIntro>
            <span>Selected work</span>
            <h2>
              <AnimatedWords text="Project surfaces built for real constraints." />
            </h2>
          </FeatureIntro>
          <ProjectGrid>
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                $accent={project.accent}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <WebsiteFrame>
                  <BrowserBar>
                    <i />
                    <i />
                    <i />
                    <span>{project.previewUrl}</span>
                  </BrowserBar>
                  <ProjectStatus $status={project.status}>{project.status}</ProjectStatus>
                  {'url' in project ? (
                    <>
                      <iframe
                        src={project.url}
                        title={`${project.title} embedded preview`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                      />
                      <FrameFallback href={project.url} target="_blank" rel="noopener noreferrer">
                        Open preview
                      </FrameFallback>
                    </>
                  ) : (
                    <PrivatePreview aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                      <strong>Private preview</strong>
                    </PrivatePreview>
                  )}
                </WebsiteFrame>
                <ProjectCopy>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </ProjectCopy>
              </ProjectCard>
            ))}
          </ProjectGrid>
        </FeatureSection>

        <SectionHead id="experience">
          <span>Experience timeline</span>
          <h2>
            <AnimatedWords text="Two current tracks. One engineering spine." />
          </h2>
        </SectionHead>

        <Timeline>
          {experiences.map((item, index) => (
            <ExperienceBlock key={item.company} item={item} index={index} />
          ))}
        </Timeline>

        <CapabilitySection id="capabilities">
          <SectionHead>
            <span>Capability map</span>
            <h2>
              <AnimatedWords text="Tools selected for reliability, speed, and system clarity." />
            </h2>
          </SectionHead>
          <CapabilityGrid>
            {capabilities.map(([title, detail], index) => (
              <Capability
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: index * 0.035 }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>
                  <AnimatedWords text={title} amount={0.7} />
                </h3>
                <p>{detail}</p>
              </Capability>
            ))}
          </CapabilityGrid>
        </CapabilitySection>

        <Closing>
          <ClosingCopy>
            <span>Available signal</span>
            <h2>
              <AnimatedWords text="Frontend depth, Web3 execution, and leadership without ceremony." />
            </h2>
            <p>Senior Frontend Engineer / Web3 Frontend Lead</p>
          </ClosingCopy>
          <DottedWorldMap />
        </Closing>

        <ContactSection id="contact" aria-label="Social contact links">
          <SocialGrid>
            {socialLinks.map((link) => (
              <SocialLink key={link.name} href={link.href} aria-label={link.name} target='_blank' rel='noopener noreferrer'>
                <SocialIcon icon={link.icon} />
                <strong>{link.name}</strong>
                <span>{link.label}</span>
              </SocialLink>
            ))}
          </SocialGrid>
          <ContactHeader>
            <span>Contact nodes</span>
            <h2>
              <AnimatedWords text="Trace the work. Start the conversation." />
            </h2>
          </ContactHeader>
        </ContactSection>
      </Shell>
    </>
  )
}

const GlobalStyle = createGlobalStyle`
  :root {
    color: #f5f5f5;
    background: #050505;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-synthesis: none;
    text-rendering: geometricPrecision;
    -webkit-font-smoothing: antialiased;
    --line: rgba(255, 255, 255, 0.14);
    --muted: rgba(255, 255, 255, 0.58);
    --soft: rgba(255, 255, 255, 0.08);
    --white: #f8f8f8;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    background: #050505;
  }

  body {
    margin: 0;
    min-width: 320px;
    background:
      radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12), transparent 34rem),
      linear-gradient(180deg, #080808 0%, #030303 100%);
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ::selection {
    color: #050505;
    background: #fff;
  }

  :where(article, a, div) {
    --card-accent: 255, 255, 255;
  }
`

const WordGroup = styled(motion.span)`
  display: block;
`

const Word = styled(motion.span)`
  display: inline-block;
  white-space: nowrap;
  will-change: transform, opacity, filter;
`

const DotField = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.28) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(360px circle at var(--x) var(--y), black 0%, black 18%, transparent 72%);
  opacity: 0.38;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(220px circle at var(--x) var(--y), rgba(255,255,255,0.18), transparent 68%);
  }
`

const Progress = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 20;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, #fff, #777, #fff);
`

const Shell = styled.main`
  position: relative;
  z-index: 1;
  width: min(100%, 1440px);
  margin: 0 auto;
  border-inline: 1px solid var(--line);
  min-height: 100svh;
`

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 12;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 18px clamp(18px, 4vw, 54px);
  border-bottom: 1px solid var(--line);
  background: rgba(5, 5, 5, 0.76);
  backdrop-filter: blur(18px);
  font: 700 11px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  div {
    display: flex;
    gap: clamp(12px, 2vw, 28px);
    color: var(--muted);
  }

  a {
    transition: color 180ms ease;
  }

  a:hover {
    color: #fff;
  }

  @media (max-width: 640px) {
    div a:nth-child(2) {
      display: none;
    }
  }
`

const Hero = styled.section`
  position: relative;
  min-height: calc(100svh - 58px);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(340px, 0.8fr);
  align-items: stretch;
  border-bottom: 1px solid var(--line);
  overflow: hidden;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
    min-height: calc(100svh - 58px);
  }
`

const HeroCopy = styled(motion.div)`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(56px, 8vw, 112px) clamp(20px, 6vw, 78px);

  h1 {
    max-width: 980px;
    margin: 0;
    font-size: clamp(2.7rem, 5.5vw, 5.5rem);
    line-height: 0.9;
    letter-spacing: 0;
    font-weight: 760;
  }

  mark {
    color: transparent;
    background: linear-gradient(105deg, #ffffff, #9d9d9d 38%, #ffffff 75%);
    -webkit-background-clip: text;
    background-clip: text;
  }

  @media (max-width: 920px) {
    min-height: calc(100svh - 58px);
    background:
      linear-gradient(90deg, rgba(5,5,5,0.9), rgba(5,5,5,0.62) 64%, rgba(5,5,5,0.24)),
      linear-gradient(180deg, rgba(5,5,5,0.36), rgba(5,5,5,0.86));
  }
`

const Eyebrow = styled.span`
  margin-bottom: 26px;
  color: var(--muted);
  font: 700 12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`

const HeroSub = styled.p`
  width: min(760px, 100%);
  margin: 32px 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(1rem, 1.4vw, 1.22rem);
  line-height: 1.65;
`

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 38px;

  a {
    border: 1px solid var(--line);
    padding: 13px 17px;
    min-width: 148px;
    text-align: center;
    font: 700 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: rgba(255,255,255,0.03);
    transition: transform 180ms ease, background 180ms ease, color 180ms ease;
  }

  a:hover {
    transform: translateY(-3px);
    background: #fff;
    color: #050505;
  }
`

const Stage = styled.div`
  position: relative;
  min-height: 620px;
  border-left: 1px solid var(--line);
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 12%;
    border: 1px solid rgba(255,255,255,0.12);
    transform: rotate(10deg);
  }

  &::after {
    inset: 24%;
    transform: rotate(-16deg);
  }

  canvas {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 920px) {
    position: absolute;
    inset: 0;
    z-index: 1;
    min-height: 0;
    border-left: 0;
    border-top: 0;
    opacity: 0.78;
    pointer-events: none;

    &::before {
      inset: 20%;
    }

    &::after {
      inset: 32%;
    }
  }
`

const StackBand = styled.section`
  display: grid;
  grid-template-columns: minmax(220px, 360px) minmax(0, 1fr);
  border-bottom: 1px solid var(--line);
  background:
    linear-gradient(90deg, rgba(255,255,255,0.06), transparent 32%),
    rgba(255,255,255,0.015);
  overflow: hidden;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`

const StackMeta = styled.div`
  padding: 28px clamp(20px, 4vw, 44px);
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background:
    radial-gradient(circle at 18% 28%, rgba(103, 232, 249, 0.16), transparent 42%),
    radial-gradient(circle at 88% 78%, rgba(167, 139, 250, 0.12), transparent 46%),
    rgba(255,255,255,0.018);
  box-shadow:
    inset 0 1px 0 rgba(103, 232, 249, 0.12),
    inset -1px 0 0 rgba(167, 139, 250, 0.08);

  span {
    color: rgba(165, 243, 252, 0.78);
    font: 700 12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    color: rgba(255,255,255,0.72);
    line-height: 1.5;
  }

  @media (max-width: 820px) {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
`

const MarqueeLayer = styled.div`
  min-width: 0;
  padding: 18px 0;
  display: grid;
  gap: 12px;
  mask-image: linear-gradient(90deg, transparent, black 9%, black 91%, transparent);
`

const StackLogo = styled.div<{ $accent: string; $ghost?: boolean }>`
  --card-accent: ${({ $accent }) => $accent};
  height: 72px;
  min-width: 230px;
  margin-inline: 6px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border: 1px solid ${({ $ghost }) =>
    $ghost ? 'rgba(var(--card-accent), 0.16)' : 'rgba(var(--card-accent), 0.32)'};
  background:
    linear-gradient(135deg, rgba(var(--card-accent), ${({ $ghost }) =>
      $ghost ? '0.075' : '0.18'}), rgba(var(--card-accent), ${({ $ghost }) =>
      $ghost ? '0.035' : '0.075'}) 46%, transparent 78%),
    ${({ $ghost }) => ($ghost ? 'rgba(255,255,255,0.018)' : 'rgba(255,255,255,0.05)')};
  color: #fff;
  opacity: 0.5;
  filter: grayscale(1);
  box-shadow:
    inset 0 0 0 1px rgba(var(--card-accent), ${({ $ghost }) => ($ghost ? '0.07' : '0.12')}),
    inset 0 -18px 40px rgba(0,0,0,0.18);
  transition: border-color 180ms ease, background 180ms ease, transform 180ms ease, filter 180ms ease;

  &:hover {
    border-color: rgba(var(--card-accent), 0.82);
    background:
      linear-gradient(135deg, rgba(var(--card-accent), 0.36), rgba(var(--card-accent), 0.18) 48%, transparent 82%),
      rgba(255,255,255,0.075);
    opacity: 1;
    filter: saturate(1);
    transform: translateY(-2px);
  }

  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
    filter: ${({ $ghost }) => ($ghost ? 'grayscale(1) opacity(0.78)' : 'none')};
  }

  span {
    font: 760 15px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    min-width: 190px;
    height: 62px;
    padding: 0 18px;

    img {
      width: 26px;
      height: 26px;
    }

    span {
      font-size: 12px;
    }
  }
`

const FeatureSection = styled.section`
  border-bottom: 1px solid var(--line);
  background:
    radial-gradient(circle at 82% 18%, rgba(255,255,255,0.055), transparent 30%),
    rgba(255,255,255,0.008);
`

const FeatureIntro = styled.header`
  padding: clamp(54px, 8vw, 96px) clamp(20px, 6vw, 78px) 34px;
  border-bottom: 1px solid var(--line);

  > span {
    display: block;
    color: var(--muted);
    font: 700 12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  h2 {
    max-width: 760px;
    margin: 0;
    font-size: clamp(1.85rem, 3.8vw, 4.3rem);
    line-height: 0.98;
    letter-spacing: 0;
    color: #fff;

    ${Word} {
      color: transparent;
      background: linear-gradient(105deg, #ffffff, #9d9d9d 38%, #ffffff 75%);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }
`

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

const ProjectCard = styled(motion.article)<{ $accent: string }>`
  --project-accent: ${({ $accent }) => $accent};
  min-height: 500px;
  padding: clamp(18px, 3vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 26px;
  border-right: 1px solid var(--line);
  background:
    linear-gradient(180deg, rgba(var(--project-accent), 0.12), transparent 48%),
    rgba(255,255,255,0.014);
  transition: background 180ms ease, transform 180ms ease, border-color 180ms ease;

  &:last-child {
    border-right: 0;
  }

  &:hover {
    border-color: rgba(var(--project-accent), 0.42);
    background:
      linear-gradient(180deg, rgba(var(--project-accent), 0.18), transparent 56%),
      rgba(255,255,255,0.028);
    transform: translateY(-8px);
  }

  @media (max-width: 980px) {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--line);

    &:last-child {
      border-bottom: 0;
    }
  }
`

const WebsiteFrame = styled.div`
  position: relative;
  aspect-ratio: 16 / 8.6;
  border: 1px solid rgba(var(--project-accent), 0.34);
  background:
    radial-gradient(circle at 72% 28%, rgba(var(--project-accent), 0.2), transparent 32%),
    linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.012));
  overflow: hidden;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.04),
    0 24px 70px rgba(0,0,0,0.3);

  &::before {
    content: '';
    position: absolute;
    inset: 38px 0 0;
    pointer-events: none;
    background: linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.42));
    z-index: 2;
  }

  iframe {
    position: absolute;
    inset: 38px 0 0;
    width: 303.03%;
    height: calc((100% - 38px) * 3.0303);
    border: 0;
    background: rgba(255,255,255,0.04);
    transform: scale(0.33);
    transform-origin: top left;
  }
`

const BrowserBar = styled.div`
  height: 38px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.24);

  i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(255,255,255,0.42);
  }

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgba(255,255,255,0.5);
    font: 700 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.06em;
  }
`

const ProjectStatus = styled.span<{ $status: string }>`
  position: absolute;
  top: 52px;
  right: 14px;
  z-index: 4;
  padding: 7px 9px;
  border: 1px solid
    ${({ $status }) => {
      if ($status === 'deprecated') return 'rgba(248, 113, 113, 0.48)'
      if ($status === 'private') return 'rgba(45, 212, 191, 0.48)'
      return 'rgba(52, 211, 153, 0.48)'
    }};
  color: ${({ $status }) =>
    $status === 'deprecated'
      ? 'rgba(254, 202, 202, 0.9)'
      : $status === 'private'
        ? 'rgba(153, 246, 228, 0.9)'
        : 'rgba(167, 243, 208, 0.9)'};
  background: ${({ $status }) => {
    if ($status === 'deprecated') return 'rgba(127, 29, 29, 0.34)'
    if ($status === 'private') return 'rgba(19, 78, 74, 0.34)'
    return 'rgba(6, 78, 59, 0.34)'
  }};
  backdrop-filter: blur(12px);
  font: 800 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const PrivatePreview = styled.div`
  position: absolute;
  inset: 38px 0 0;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  grid-template-rows: 0.72fr 1fr;
  gap: 14px;
  padding: 28px;
  filter: blur(7px);
  transform: scale(1.04);
  opacity: 0.72;
  background:
    radial-gradient(circle at 68% 28%, rgba(var(--project-accent), 0.28), transparent 34%),
    linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.015));

  span {
    border: 1px solid rgba(var(--project-accent), 0.34);
    background:
      linear-gradient(135deg, rgba(var(--project-accent), 0.18), transparent),
      rgba(0,0,0,0.32);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);
  }

  span:nth-child(2) {
    grid-row: span 2;
  }

  strong {
    position: absolute;
    left: 30px;
    bottom: 24px;
    color: rgba(255,255,255,0.72);
    font: 800 13px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
`

const FrameFallback = styled.a`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 3;
  padding: 8px 10px;
  border: 1px solid rgba(var(--project-accent), 0.34);
  background: rgba(0,0,0,0.68);
  color: rgba(255,255,255,0.74);
  font: 700 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background 180ms ease, color 180ms ease;

  &:hover {
    background: #fff;
    color: #050505;
  }
`

const ProjectCopy = styled.div`
  margin-top: 4px;

  > span {
    display: block;
    margin-bottom: 18px;
    color: rgba(var(--project-accent), 0.72);
    font: 700 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  h3 {
    margin: 0 0 14px;
    font-size: clamp(1.35rem, 1.95vw, 2rem);
    line-height: 1;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: rgba(255,255,255,0.62);
    line-height: 1.55;
  }
`

const SectionHead = styled.header`
  padding: clamp(54px, 8vw, 96px) clamp(20px, 6vw, 78px) 36px;

  > span {
    display: block;
    color: var(--muted);
    font: 700 12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  h2 {
    max-width: 900px;
    margin: 0;
    font-size: clamp(1.85rem, 3.8vw, 4.3rem);
    line-height: 0.98;
    letter-spacing: 0;
    color: #fff;

    ${Word} {
      color: transparent;
      background: linear-gradient(105deg, #ffffff, #9d9d9d 38%, #ffffff 75%);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }
`

const Timeline = styled.section`
  border-top: 1px solid var(--line);
`

const Experience = styled.section`
  --experience-accent-a: 147, 197, 253;
  --experience-accent-b: 45, 212, 191;
  display: grid;
  grid-template-columns: 360px 1fr;
  min-height: 112svh;
  border-bottom: 1px solid var(--line);

  &:nth-child(2) {
    --experience-accent-a: 196, 181, 253;
    --experience-accent-b: 244, 114, 182;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`

const StickyMeta = styled.aside`
  position: sticky;
  top: 58px;
  height: calc(100svh - 58px);
  padding: 34px clamp(20px, 4vw, 44px);
  border-right: 1px solid var(--line);
  background:
    radial-gradient(circle at 18% 28%, rgba(var(--experience-accent-a), 0.16), transparent 42%),
    radial-gradient(circle at 88% 78%, rgba(var(--experience-accent-b), 0.12), transparent 46%),
    linear-gradient(180deg, rgba(255,255,255,0.045), transparent 45%),
    rgba(5,5,5,0.62);
  box-shadow:
    inset 0 1px 0 rgba(var(--experience-accent-a), 0.1),
    inset -1px 0 0 rgba(var(--experience-accent-b), 0.08);
  backdrop-filter: blur(14px);

  span {
    color: var(--muted);
    font: 700 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  h3 {
    margin: 24px 0 8px;
    font-size: clamp(2.8rem, 6vw, 5.2rem);
    line-height: 0.92;
    letter-spacing: 0;
  }

  p,
  small {
    display: block;
    color: var(--muted);
    font: 700 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @media (max-width: 860px) {
    position: sticky;
    top: 49px;
    z-index: 11;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    padding: 24px 20px;

    h3 {
      font-size: clamp(2.6rem, 14vw, 4.6rem);
    }
  }
`

const ExperienceBody = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: center;
  padding: 18vh clamp(20px, 6vw, 90px) 18vh 0;
  background:
    radial-gradient(circle at 8% 34%, rgba(var(--experience-accent-a), 0.07), transparent 36%),
    radial-gradient(circle at 92% 76%, rgba(var(--experience-accent-b), 0.055), transparent 42%);

  h4 {
    max-width: 780px;
    margin: 0 0 34px;
    font-size: clamp(2rem, 4vw, 4.4rem);
    line-height: 0.98;
    letter-spacing: 0;
  }

  ul {
    width: min(820px, 100%);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    position: relative;
    padding: 22px 0 22px 34px;
    border-top: 1px solid var(--line);
    color: rgba(255,255,255,0.72);
    font-size: clamp(1rem, 1.35vw, 1.2rem);
    line-height: 1.55;
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 30px;
    width: 9px;
    height: 9px;
    background: #fff;
    box-shadow: 0 0 28px rgba(255,255,255,0.72);
  }

  @media (max-width: 860px) {
    grid-template-columns: 42px 1fr;
    padding: 64px 20px 76px 0;
  }
`

const Kicker = styled.span`
  display: block;
  margin-bottom: 18px;
  color: transparent;
  background: linear-gradient(90deg, #fff, #8b8b8b);
  -webkit-background-clip: text;
  background-clip: text;
  font: 700 12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`

const BeamRail = styled.div`
  width: 1px;
  min-height: 100%;
  justify-self: center;
  background: rgba(255,255,255,0.12);
  transform-origin: top;

  span {
    display: block;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #fff 18%, #fff 72%, transparent);
    transform-origin: top;
    box-shadow: 0 0 22px rgba(255,255,255,0.62);
  }
`

const ProjectLine = styled.div`
  width: min(820px, 100%);
  margin-top: 32px;
  display: grid;
  grid-template-columns: 180px 1fr;
  border: 1px solid var(--line);

  b,
  span {
    padding: 18px;
  }

  b {
    border-right: 1px solid var(--line);
    font: 700 11px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  span {
    color: rgba(255,255,255,0.72);
    line-height: 1.55;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;

    b {
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }
  }
`

const CapabilitySection = styled.section`
  border-bottom: 1px solid var(--line);
`

const CapabilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(220px, 1fr));
  overflow-x: auto;
  border-top: 1px solid var(--line);
`

const Capability = styled(motion.article)`
  min-height: 430px;
  padding: 24px;
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(180deg, rgba(var(--card-accent), 0.095), transparent 54%),
    rgba(255,255,255,0.018);
  box-shadow: inset 0 1px 0 rgba(var(--card-accent), 0.12);
  transition: background 180ms ease, transform 180ms ease, border-color 180ms ease;

  &:nth-child(7n + 1) {
    --card-accent: 103, 232, 249;
  }

  &:nth-child(7n + 2) {
    --card-accent: 167, 139, 250;
  }

  &:nth-child(7n + 3) {
    --card-accent: 244, 114, 182;
  }

  &:nth-child(7n + 4) {
    --card-accent: 96, 165, 250;
  }

  &:nth-child(7n + 5) {
    --card-accent: 52, 211, 153;
  }

  &:nth-child(7n + 6) {
    --card-accent: 251, 191, 36;
  }

  &:nth-child(7n + 7) {
    --card-accent: 248, 113, 113;
  }

  > span {
    color: var(--muted);
    font: 700 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  h3 {
    margin: 38px 0 0;
    font-size: clamp(1.25rem, 1.65vw, 1.95rem);
    line-height: 0.98;
    letter-spacing: 0;
    opacity: 0.68;
    transform-origin: left top;
    transition: opacity 180ms ease, transform 180ms ease;
  }

  p {
    margin: auto 0 0;
    color: rgba(255,255,255,0.64);
    font-size: clamp(1.08rem, 1.45vw, 1.32rem);
    line-height: 1.46;
  }

  &:hover {
    border-color: rgba(var(--card-accent), 0.36);
    background:
      linear-gradient(180deg, rgba(var(--card-accent), 0.16), transparent 62%),
      rgba(255,255,255,0.06);
    transform: translateY(-8px);

    h3 {
      opacity: 1;
      transform: scale(1.035);
    }
  }
`

const Closing = styled.footer`
  min-height: 62svh;
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(360px, 1fr);
  align-items: stretch;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.08), transparent 40%),
    #050505;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

const ClosingCopy = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(70px, 10vw, 140px) clamp(20px, 7vw, 110px);

  > span {
    color: var(--muted);
    font: 700 12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  h2 {
    max-width: 760px;
    margin: 0 0 36px;
    font-size: clamp(1.85rem, 3.6vw, 4rem);
    line-height: 0.98;
    letter-spacing: 0;
    color: #fff;

    ${Word} {
      color: transparent;
      background: linear-gradient(105deg, #ffffff, #9d9d9d 38%, #ffffff 75%);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }

  p {
    width: fit-content;
    margin: 0;
    color: rgba(255,255,255,0.72);
    font: 700 13px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`

const MapShell = styled.figure`
  position: relative;
  min-height: 560px;
  margin: 0;
  border-left: 1px solid var(--line);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 68% 44%, rgba(96, 165, 250, 0.12), transparent 32%),
    linear-gradient(180deg, rgba(255,255,255,0.032), transparent 50%);
  perspective: 1100px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.12;
    mask-image: linear-gradient(90deg, transparent, black 18%, black 88%, transparent);
  }

  @media (max-width: 920px) {
    border-left: 0;
    border-top: 1px solid var(--line);
    min-height: 420px;
  }
`

const MapScene = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: min(108%, 980px);
  transform-style: preserve-3d;

  svg {
    width: 100%;
    height: auto;
    overflow: visible;
    filter: drop-shadow(0 26px 40px rgba(0,0,0,0.58));
  }

  .grid path {
    stroke: rgba(255,255,255,0.055);
    stroke-width: 1;
  }

  .dots circle {
    fill: rgba(255,255,255,0.42);
  }

  .target ellipse {
    fill: rgba(56, 189, 248, 0.14);
    stroke: rgba(56, 189, 248, 0.5);
    stroke-width: 1;
  }

  .target circle {
    fill: #dff8ff;
    filter: drop-shadow(0 0 9px rgba(56,189,248,0.95));
  }

  .target path {
    stroke: rgba(56,189,248,0.86);
    stroke-width: 2;
    filter: drop-shadow(0 0 8px rgba(56,189,248,0.78));
  }

  .map-label {
    width: max-content;
    padding: 10px 14px;
    margin: 0 auto;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 6px;
    color: rgba(255,255,255,0.9);
    background: rgba(24,24,24,0.88);
    font: 700 13px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    box-shadow: 0 12px 34px rgba(0,0,0,0.36);
  }
`

const MapCaption = styled.figcaption`
  position: absolute;
  right: clamp(18px, 4vw, 52px);
  bottom: clamp(18px, 4vw, 52px);
  z-index: 2;
  display: grid;
  gap: 8px;
  text-align: right;

  span {
    color: rgba(125, 211, 252, 0.74);
    font: 700 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  strong {
    color: #fff;
    font-size: clamp(1.4rem, 3vw, 2.6rem);
    line-height: 0.95;
    letter-spacing: 0;
  }
`

const ContactSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.05), transparent 48%),
    #050505;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

const ContactHeader = styled.header`
  padding: clamp(54px, 8vw, 96px) clamp(20px, 6vw, 78px);
  border-left: 1px solid var(--line);

  > span {
    display: block;
    margin-bottom: 18px;
    color: var(--muted);
    font: 700 12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    max-width: 720px;
    font-size: clamp(1.8rem, 3.1vw, 3.5rem);
    line-height: 0.96;
    letter-spacing: 0;
    color: #fff;

    ${Word} {
      color: transparent;
      background: linear-gradient(105deg, #ffffff, #9d9d9d 38%, #ffffff 75%);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }

  @media (max-width: 860px) {
    border-left: 0;
    border-bottom: 1px solid var(--line);
    order: -1;
  }
`

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const SocialLink = styled.a`
  min-height: 360px;
  padding: clamp(22px, 4vw, 34px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--line);
  color: #fff;
  background:
    radial-gradient(circle at 24% 16%, rgba(var(--card-accent), 0.18), transparent 38%),
    linear-gradient(180deg, rgba(255,255,255,0.045), transparent 58%),
    rgba(255,255,255,0.012);
  box-shadow: inset 0 1px 0 rgba(var(--card-accent), 0.12);
  transition:
    background 180ms ease,
    transform 180ms ease,
    color 180ms ease,
    border-color 180ms ease;

  &:nth-child(1) {
    --card-accent: 156, 163, 175;
  }

  &:nth-child(2) {
    --card-accent: 96, 165, 250;
  }

  &:nth-child(3) {
    --card-accent: 248, 113, 113;
  }

  &:last-child {
    border-right: 0;
  }

  svg {
    width: 42px;
    height: 42px;
    fill: currentColor;
    filter: grayscale(1);
    transition: transform 180ms ease, filter 180ms ease;
  }

  strong {
    margin-top: auto;
    font-size: clamp(1.8rem, 3.1vw, 3.45rem);
    line-height: 0.94;
    letter-spacing: 0;
  }

  span {
    margin-top: 18px;
    color: rgba(255,255,255,0.58);
    font: 700 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  &:hover {
    border-color: rgba(var(--card-accent), 0.55);
    background:
      radial-gradient(circle at 24% 16%, rgba(var(--card-accent), 0.22), transparent 42%),
      #fff;
    color: #050505;
    transform: translateY(-8px);

    svg {
      filter: none;
      transform: scale(1.12) rotate(-4deg);
    }

    span {
      color: rgba(5,5,5,0.62);
    }
  }

  @media (max-width: 860px) {
    min-height: 260px;
  }

  @media (max-width: 640px) {
    min-height: 210px;
    border-right: 0;
    border-bottom: 1px solid var(--line);

    &:last-child {
      border-bottom: 0;
    }
  }
`

export default App
