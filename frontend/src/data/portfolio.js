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
    title: 'Aspiring Full-Stack Developer',

    // SHORT HERO DESCRIPTION:
    description:
      'Fresh grad who loves turning ideas into pixel-perfect, interactive web experiences.',

    // CHANGE YOUR PORTRAIT PHOTO / HERO VIDEO HERE:
    // Place your video or image inside `frontend/public/` and update the paths below:
    heroVideoUrl: '/hero-video.mp4',
    portraitUrl: '/images/portrait.jpg',

    // CHANGE YOUR CV DOWNLOAD FILE / LINK HERE:
    cvUrl: '#contact',

    location: 'Philippines',
    email: 'renmillares111@gmail.com',
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
    { label: 'FOCUS AREAS', href: '#services' },
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
    { name: 'Mail', icon: 'Mail', url: 'mailto:renmillares111@gmail.com' },
    { name: 'Link', icon: 'Link2', url: '#projects' },
  ],

  // -------------------------------------------------------------------------
  // 5. SERVICES (Pinned Stacking Card Deck - Video 00:12 to 00:18)
  // -------------------------------------------------------------------------
  services: [
    {
      id: '01',
      title: 'Responsive Web Apps',
      description:
        'Building web apps with Vue.js and React. I focus on clean code, responsive layouts, and a smooth experience for users.',
      rotation: -2,
    },
    {
      id: '02',
      title: 'Digital Menu Websites',
      description:
        'Simple, good-looking digital menus for restaurants and cafés, built to be easy to browse on any phone.',
      rotation: 4,
    },
    {
      id: '03',
      title: 'E-Commerce Websites',
      description:
        'Online store pages with smooth navigation and a clean layout, built so shopping feels easy and simple.',
      rotation: -3,
    },
    {
      id: '04',
      title: 'UI/UX & Web Design',
      description:
        'Clean, modern interfaces designed in Figma. I focus on layouts that feel intuitive and easy to use.',
      rotation: 3,
    },
    {
      id: '05',
      title: 'Learning AI Tools',
      description:
        'Exploring AI tools to add smart features to websites and automate small, repetitive tasks.',
      cta: 'VIEW MY TOOLS',
      rotation: 0,
    },
  ],

  // -------------------------------------------------------------------------
  // 6. EXPERIENCE (Alternating Left/Right Center Timeline - Video 00:19 to 00:25)
  // -------------------------------------------------------------------------
  experience: [
    {
      side: 'left',
      period: '',
      role: 'Aspiring Full-Stack Developer',
      company: 'SELF-DIRECTED LEARNING',
      description:
        'Building personal projects to practice Vue, Tailwind CSS, and GSAP. Designing interfaces in Figma and turning them into responsive, working websites.',
    },
    {
      side: 'right',
      period: '',
      role: 'Personal Project Builder',
      company: 'HANDS-ON PRACTICE',
      description:
        'Practiced turning designs into working web pages, learning component structure, responsive layouts, and good coding habits.',
    },
    {
      side: 'left',
      period: '',
      role: 'Bachelor of Science in Computer Science',
      company: 'UNIVERSITY — PHILIPPINES',
      description:
        'Studied programming, web development, and software design, with hands-on projects throughout.',
    },
    {
      side: 'right',
      period: '',
      role: 'Capstone / Thesis Project',
      company: 'UNIVERSITY PROJECT',
      description:
        'Independently built a full-stack web system from start to finish, learning how to structure an app, connect APIs, and work with a database.',
    },
    {
      side: 'left',
      period: '',
      role: 'Peer Study & Collaboration',
      company: 'ACADEMIC PROJECTS',
      description:
        'Helped classmates with web development basics, CSS layouts, and debugging in group projects.',
    },
  ],

  // -------------------------------------------------------------------------
  // 7. POPULAR PROJECTS (Split Title + Interactive Detail Cards - Video 00:26 to 00:37)
  // -------------------------------------------------------------------------
  projects: [
    {
      id: 'govserve',
      title: 'GOVSERVE',
      subtitle: 'Social Services Management',
      badge: 'CAPSTONE PROJECT',
      overview:
        'Capstone project: a web platform for AICS medical and burial assistance, PWD and Senior Citizen benefits, Solo Parent support, and Livelihood training.',
      tech: ['Vue', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      features: [
        'Citizen portal with a personal dashboard',
        'Application and payout tracking',
        'English / Filipino language toggle',
      ],
      stats: [
        { label: 'Vue', icon: 'vue' },
        { label: 'TypeScript', icon: 'typescript' },
        { label: 'PostgreSQL', icon: 'postgresql' },
      ],
      liveUrl: 'https://social-service-management.up.railway.app/',
      imageUrl: '/images/govserve-card.png',
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
        { name: 'React', slug: 'react' },
        { name: 'Tailwind', slug: 'tailwind' },
        { name: 'GSAP', slug: 'gsap' },
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
        { name: 'PostgreSQL', slug: 'postgresql' },
        { name: 'MySQL', slug: 'mysql' },
      ],
    },
    {
      category: 'Design, Tools',
      items: [
        { name: 'Figma', slug: 'figma' },
        { name: 'Git', slug: 'git' },
        { name: 'GitHub', slug: 'github' },
        { name: 'Vercel', slug: 'vercel' },
        { name: 'Railway', slug: 'railway' },
      ],
    },
    {
      category: 'AI & Productivity',
      items: [
        { name: 'ChatGPT', slug: 'chatgpt' },
        { name: 'Claude', slug: 'claude' },
        { name: 'Gemini', slug: 'gemini' },
        { name: 'DeepSeek', slug: 'deepseek' },
        { name: 'Antigravity', slug: 'antigravity' },
      ],
    },
  ],
}
