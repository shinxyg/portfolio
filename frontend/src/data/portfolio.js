/**
 * ============================================================================
 * PORTFOLIO CONFIGURATION FILE (1:1 Video Choreography Edition)
 * ============================================================================
 * Edit the values below to change your name, role, portrait image,
 * handwritten signature SVG path, social links, and section content.
 */

export const portfolioData = {
  // -------------------------------------------------------------------------
  // 1. PERSONAL DETAILS (Change your name, title, photo, and CV here)
  // -------------------------------------------------------------------------
  personal: {
    // CHANGE YOUR NAME HERE:
    name: 'Clarence Millares',
    shortName: 'Clarence M.',

    // CHANGE YOUR ROLE / SUBTITLE HERE:
    title: 'Frontend Developer & UI/UX Engineer',

    // SHORT HERO DESCRIPTION:
    description:
      'Crafting SEO-optimized, blazing-fast web experiences engineered with modern design architecture.',

    // CHANGE YOUR PORTRAIT PHOTO / HERO VIDEO HERE:
    // Place your video or image inside `frontend/public/` and update the paths below:
    heroVideoUrl: '/hero-video.mp4',
    portraitUrl: '/portrait.jpg',

    // CHANGE YOUR CV DOWNLOAD FILE / LINK HERE:
    cvUrl: '#contact',

    location: 'Philippines',
    email: 'clarencemillares.dev@gmail.com',
  },

  // -------------------------------------------------------------------------
  // 2. HANDWRITTEN SIGNATURE SVG PATH
  // -------------------------------------------------------------------------
  // Traced directly from your uploaded handwritten signature photo.
  // Replace `viewBox` and `path` below if you ever want to change your signature.
  signature: {
    viewBox: '0 0 360 170',
    path: 'M 22 142 C 78 130, 148 92, 168 42 C 180 12, 160 6, 144 26 C 122 54, 114 106, 134 118 C 154 128, 196 104, 224 72 C 212 96, 206 112, 214 115 C 222 118, 240 96, 250 84 C 242 102, 240 114, 247 116 C 255 118, 269 100, 277 90 C 272 104, 272 114, 280 115 C 289 116, 304 102, 314 94',
  },

  // -------------------------------------------------------------------------
  // 3. NAVIGATION LINKS
  // -------------------------------------------------------------------------
  navLinks: [
    { label: 'SERVICES', href: '#services' },
    { label: 'EXPERIENCE', href: '#experience' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'CONTACT', href: '#contact' },
  ],

  // -------------------------------------------------------------------------
  // 4. SOCIAL MEDIA LINKS
  // -------------------------------------------------------------------------
  socials: [
    { name: 'GitHub', icon: 'Github', url: 'https://github.com' },
    { name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com' },
    { name: 'Mail', icon: 'Mail', url: 'mailto:clarencemillares.dev@gmail.com' },
    { name: 'Link', icon: 'Link2', url: '#projects' },
  ],

  // -------------------------------------------------------------------------
  // 5. SERVICES (Pinned Stacking Card Deck - Video 00:12 to 00:18)
  // -------------------------------------------------------------------------
  services: [
    {
      id: '01',
      title: 'High-Performance Web Apps',
      description:
        'Blazing-fast, SEO-optimized websites built with modern tech like Vue.js, React, and Next.js. I create custom web solutions designed to rank higher and load instantly.',
      rotation: -2,
    },
    {
      id: '02',
      title: 'Custom Restaurant Digital Menu',
      description:
        'Beyond templates. I build custom digital menus that reflect your restaurant’s unique brand identity, featuring rich animations and an integrated ordering system for direct customer engagement.',
      rotation: 4,
    },
    {
      id: '03',
      title: 'Immersive E-Commerce',
      description:
        'Frictionless shopping experiences. I build dynamic online stores with smooth page transitions that make your products shine, engineered for high conversion rates and effortless checkout.',
      rotation: -3,
    },
    {
      id: '04',
      title: 'UI/UX & Web Design',
      description:
        'Clean, modern interfaces that actually make sense. I design digital experiences inside Figma that feel intuitive to navigate and keep users engaged.',
      rotation: 3,
    },
    {
      id: '05',
      title: 'AI & Smart Automation',
      description:
        'Experimenting with cutting-edge AI integrations to build smarter web features and automate repetitive workflows for modern businesses.',
      cta: 'BOOK A FREE CALL',
      rotation: 0,
    },
  ],

  // -------------------------------------------------------------------------
  // 6. EXPERIENCE (Alternating Left/Right Center Timeline - Video 00:19 to 00:25)
  // -------------------------------------------------------------------------
  experience: [
    {
      side: 'left',
      period: '2025 — PRESENT',
      role: 'Freelance Frontend Developer & UI/UX Designer',
      company: 'SELF-EMPLOYED',
      description:
        'Building custom digital platforms for local and international clients. Full-cycle development from UI design in Figma to high-performance frontend systems with Vue, Tailwind CSS, and GSAP.',
    },
    {
      side: 'right',
      period: 'AUG 2025 — OCT 2025',
      role: 'Frontend Developer Internship',
      company: 'CREATIVE STUDIO — REMOTE',
      description:
        'Worked on real-world production projects turning Figma designs into responsive, accessible user interfaces. Collaborated closely with senior developers, sharpening modern component workflows and code quality.',
    },
    {
      side: 'left',
      period: '2022 — 2025',
      role: 'Bachelor of Science in Computer Science',
      company: 'UNIVERSITY — PHILIPPINES',
      description:
        'Comprehensive undergraduate program focusing on software architecture, modern web engineering, algorithms, and building high-impact interactive applications.',
    },
    {
      side: 'right',
      period: 'JUN 2024 — AUG 2024',
      role: 'Software Development Internship',
      company: 'DIGITAL SOLUTIONS',
      description:
        'Built a full-stack web system to manage client workflows and real-time dashboards. Learned how to structure scalable applications, integrate APIs cleanly, and ship production-ready features.',
    },
    {
      side: 'left',
      period: '2024 — 2025',
      role: 'Teaching Assistant & Technical Mentor',
      company: 'ACADEMIC & CAPSTONE PROJECTS',
      description:
        'Guided fellow students through web development fundamentals, modern CSS layouts, JavaScript best practices, and debugging complex frontend interfaces.',
    },
  ],

  // -------------------------------------------------------------------------
  // 7. POPULAR PROJECTS (Split Title + Interactive Detail Cards - Video 00:26 to 00:37)
  // -------------------------------------------------------------------------
  projects: [
    {
      id: 'btf-insurance',
      title: 'BTF Insurance',
      subtitle: 'Corporate Insurance Platform',
      badge: 'INSURANCE TECH',
      overview:
        'A comprehensive digital insurance portal designed for executive clarity, instant policy comparisons, and frictionless client onboarding.',
      tech: ['Vue.js', 'Tailwind CSS', 'GSAP', 'REST API'],
      features: [
        'Interactive policy calculator & quote engine',
        'Responsive client document dashboard',
        'High-speed page transitions & SEO architecture',
      ],
      stats: [
        { label: 'Vue 3', icon: 'code' },
        { label: 'Tailwind CSS', icon: 'layers' },
        { label: 'GSAP', icon: 'zap' },
      ],
      liveUrl: '#',
      visualType: 'executive',
    },
    {
      id: 'fries-lab',
      title: 'Fries Lab',
      subtitle: 'Interactive Digital Menu & Brand Experience',
      badge: 'FRIES LAB',
      overview:
        'A high-contrast, appetizing digital menu and ordering experience crafted for a modern culinary brand, complete with smooth category transitions and direct WhatsApp/cart checkout.',
      tech: ['Vue 3', 'Tailwind CSS', 'GSAP ScrollTrigger', 'Lenis'],
      features: [
        'Animated food & combo customizer',
        'Instant category filtering with zero reload',
        'Mobile-first one-tap ordering flow',
      ],
      stats: [
        { label: 'Vue 3', icon: 'code' },
        { label: 'Tailwind CSS', icon: 'layers' },
        { label: 'GSAP', icon: 'zap' },
      ],
      liveUrl: '#',
      visualType: 'frieslab',
    },
    {
      id: 'luxe-menswear',
      title: 'Atelier Menswear',
      subtitle: 'Minimalist Editorial E-Commerce',
      badge: 'FASHION STORE',
      overview:
        'Editorial e-commerce storefront blending lookbook storytelling with instant size selection, smooth slide-over cart, and ultra-clean typography.',
      tech: ['Vue 3', 'Vite', 'Tailwind CSS', 'Pinia'],
      features: [
        'Lookbook zoom & quick-add product drawers',
        'Dynamic size & fabric filter engine',
        'Sub-second route transitions',
      ],
      stats: [
        { label: 'Vue 3', icon: 'code' },
        { label: 'Tailwind CSS', icon: 'layers' },
        { label: 'Vite', icon: 'zap' },
      ],
      liveUrl: '#',
      visualType: 'fashion',
    },
  ],

  // -------------------------------------------------------------------------
  // 8. TECH STACK CATEGORIES (Video 00:38 to 00:42)
  // -------------------------------------------------------------------------
  techStackCategories: [
    {
      category: 'Frameworks & Libraries',
      items: [
        { name: 'Vue.js', slug: 'vue' },
        { name: 'Next.js', slug: 'nextjs' },
        { name: 'React', slug: 'react' },
        { name: 'Tailwind', slug: 'tailwind' },
        { name: 'GSAP', slug: 'gsap' },
        { name: 'Framer Motion', slug: 'framer' },
        { name: 'Bootstrap', slug: 'bootstrap' },
      ],
    },
    {
      category: 'Languages',
      items: [
        { name: 'JavaScript', slug: 'javascript' },
        { name: 'TypeScript', slug: 'typescript' },
      ],
    },
    {
      category: 'Backend & Database',
      items: [
        { name: 'Node.js', slug: 'nodejs' },
        { name: 'Supabase', slug: 'supabase' },
        { name: 'Firebase', slug: 'firebase' },
      ],
    },
    {
      category: 'Design, Tools',
      items: [
        { name: 'Figma', slug: 'figma' },
        { name: 'Git', slug: 'git' },
        { name: 'GitHub', slug: 'github' },
        { name: 'Vercel', slug: 'vercel' },
      ],
    },
  ],
}
