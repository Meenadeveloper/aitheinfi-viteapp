import React, { useEffect, useRef, useState } from "react";
import {  X, Phone } from "lucide-react";
import {
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,

} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import statements (these would be actual imports in your project)
import aibodybg from "../assets/images/aibody.gif";
import logo from "../assets/images/darkinfi.jpg";
import menubar from "../assets/images/menubar.svg";
import bannerbg from "../assets/images/banner.jpg";
// import person from "../assets/images/personbg.jpg";
import project1 from "../assets/images/project4.jpg";
import project2 from "../assets/images/project5.jpg";
import project3 from "../assets/images/project6.jpg";
import project4 from "../assets/images/project4.jpg";
import "../assets/css/landing.css";
import { motion, type Variants } from "framer-motion";
import type { Easing } from "framer-motion";
import musicFile from "../assets/images/music.mp3";




// Placeholder images for demo
// const aibodybg =
//   "https://via.placeholder.com/800x600/1a1a1a/ffffff?text=AI+Body+BG";
// const logo = "https://via.placeholder.com/150x25/ffffff/000000?text=LOGO";
// const menubar = "https://via.placeholder.com/24x24/ffffff/000000?text=☰";
// const bannerbg =
//   "https://via.placeholder.com/1920x1080/2a2a2a/ffffff?text=Banner+Background";
// const person = "https://via.placeholder.com/300x400/3a3a3a/ffffff?text=Person";
// const project1 =
//   "https://via.placeholder.com/400x300/4a4a4a/ffffff?text=Project+1";
// const project2 =
//   "https://via.placeholder.com/400x300/5a5a5a/ffffff?text=Project+2";
// const project3 =
//   "https://via.placeholder.com/400x300/6a6a6a/ffffff?text=Project+3";
// const project4 =
//   "https://via.placeholder.com/400x300/7a7a7a/ffffff?text=Project+4";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Type Definitions
interface NavItem {
  name: string;
  href: string;
}

interface Project {
  id: number;
  title: string;
  year: string;
  number: string;
  image: string;
  bgColor: string;
  hoverBg: string;
}

interface SocialLink {
  name: string;
  href: string;
}

// interface MousePosition {
//   x: number;
//   y: number;
// }



// Global Animation Variants
const globalAnimations = {
  // Page entrance animations
  pageEnter: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 1.5,
      // ease: [0.25, 0.46, 0.45, 0.94]
      ease: "easeInOut" as Easing,
    },
  },

  // Staggered children animations
  staggerContainer: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  },

  staggerChild: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        // ease: [0.25, 0.46, 0.45, 0.94],
        ease: "easeInOut" as Easing,
      },
    },
  },

  // Hover animations
  scaleOnHover: {
    whileHover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        // ease: "easeOut",
        ease: "easeInOut" as Easing,
      },
    },
    whileTap: { scale: 0.95 },
  },

  // Text reveal animations
  textReveal: {
    initial: { y: 100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  // Slide animations
  slideFromLeft: {
    initial: { x: -100, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },

  slideFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  },

  // Fade animations with blur
  fadeInBlur: {
    initial: {
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.8,
        // ease: [0.25, 0.46, 0.45, 0.94],
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // tuple fix for TS
      },
    },
  },

  // Gradient text animations
  gradientText: {
    background: "linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
};

// Component Props Interfaces
interface NavItemProps {
  item: NavItem;
  isMobile?: boolean;
  onClick?: () => void;
}

const LandingPage: React.FC = () => {
  // State definitions with proper types
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  // const [mousePosition, setMousePosition] = useState<MousePosition>({
  //   x: 0,
  //   y: 0,
  // });

  // Ref definitions with proper types
  const bannerRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const textRevealRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.5; // set volume
        audio.loop = true;

        const playAudio = async () => {
          try {
            await audio.play();
          } catch (err) {
            console.error("Autoplay blocked by browser:", err);
          }
        };

        playAudio();
      }
    }, []);

    const handleMouseEnter = () => {
      const audio = audioRef.current;
      if (audio) {
        try {
          audio.pause();
        } catch (err) {
          console.error("Error pausing audio:", err);
        }
      }
    };

    const handleMouseLeave = () => {
      const audio = audioRef.current;
      if (audio) {
        try {
          void audio.play(); // explicitly tell TS you don't care about the Promise
        } catch (err) {
          console.error("Error playing audio:", err);
        }
      }
    };
  

  // Navigation functions
  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Data arrays with proper typing
  const navItems: NavItem[] = [
    { name: "HOME", href: "/welcome" },
    { name: "LOGIN", href: "#" },
    { name: "CHANGE UNIQECODE", href: "/" },
    { name: "CONTACT", href: "#" },
  ];

  const projects: Project[] = [
    {
      id: 1,
      title: "PACKAGING FOR CYBERPULSE",
      year: "2014-2024",
      number: "001",
      image: project4,
      bgColor: "from-pink-500 via-purple-500 to-blue-500",
      hoverBg: "from-pink-400/80 via-purple-400/80 to-blue-400/80",
    },
    {
      id: 2,
      title: "SHOPIFY STORE FOR GLITCHYGLOW",
      year: "2023-2024",
      number: "002",
      image: project1,
      bgColor: "from-cyan-500 via-blue-500 to-purple-500",
      hoverBg: "from-cyan-400/80 via-blue-400/80 to-purple-400/80",
    },
    {
      id: 3,
      title: "BRANDING FOR NEONTECH",
      year: "2022-2023",
      number: "003",
      image: project2,
      bgColor: "from-green-500 via-teal-500 to-blue-500",
      hoverBg: "from-green-400/80 via-teal-400/80 to-blue-400/80",
    },
    {
      id: 4,
      title: "UI/UX FOR FUTUREWAVE",
      year: "2023-2024",
      number: "004",
      image: project3,
      bgColor: "from-orange-500 via-red-500 to-pink-500",
      hoverBg: "from-orange-400/80 via-red-400/80 to-pink-400/80",
    },
  ];

  const socialLinks: SocialLink[] = [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Linkedin", href: "#" },
    { name: "Twitter", href: "#" },
  ];

  const menuLinks: SocialLink[] = [
    { name: "Home", href: "/welcome" },
    { name: "Login", href: "#" },
    { name: "Contact", href: "#" },
  ];

  // const utilityLinks: SocialLink[] = [
  //   { name: "Styleguide", href: "#" },
  //   { name: "Licenses", href: "#" },
  //   { name: "Changelog", href: "#" },
  //   { name: "Password Protected", href: "#" },
  //   { name: "404 Not Found Page", href: "#" },
  // ];

  // Animation variants with proper typing
  // const textVariants: TextVariants = {
  //   initial: {
  //     y: 0,
  //   },
  //   hover: {
  //     y: "-100%",
  //     transition: {
  //       duration: 0.3,
  //       ease: [0.76, 0, 0.24, 1],
  //     },
  //   },
  // };

  const textVariants: Variants = {
    initial: {
      y: 0,
    },
    hover: {
      y: "-100%",
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const textHoverVariants: Variants = {
    initial: {
      y: 100,
    },
    hover: {
      y: "0%",
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const fadeInFromRight: Variants = {
    hidden: {
      opacity: 0,
      x: 100,
      filter: "blur(10px)",
    },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: delay * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const fadeInFromLeft: Variants = {
    hidden: {
      opacity: 0,
      x: -100,
      filter: "blur(10px)",
    },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: delay * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  // Scroll and motion values with proper typing
  const { scrollYProgress: bannerProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: textProgress } = useScroll({
    target: textRevealRef,
    offset: ["start end", "end center"],
  });

  // Transform values
  const backgroundScale = useTransform(bannerProgress, [0, 1], [1, 1.2]);
  const contentY = useTransform(bannerProgress, [0, 1], [0, -50]);
  const overlayWidth = useTransform(textProgress, [0, 1], ["100%", "0%"]);
  const textOpacity = useTransform(textProgress, [0, 0.2, 1], [1, 1, 1]);
  const textY = useTransform(textProgress, [0, 1], [20, 0]);

  // InView hooks
  const isInView = useInView(sectionRef, {
    once: false,
    amount: 0.3,
    margin: "-100px 0px -100px 0px",
  });

  const isFooterInView = useInView(footerRef, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -100px 0px",
  });

  // Custom cursor animation
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Navigation component with proper typing
  const NavItem: React.FC<NavItemProps> = ({
    item,
    isMobile = false,
    onClick,
  }) => (
    <motion.a
      href={item.href}
      className={`text-white px-3 py-2 text-sm font-medium tracking-wider rounded-md relative overflow-hidden ${
        isMobile ? "block text-base" : ""
      }`}
      initial="initial"
      whileHover="hover"
      onClick={onClick}
      // {...globalAnimations.staggerChild}
    >
      <div className="relative overflow-hidden h-6">
        <motion.span className="block" variants={textVariants}>
          {item.name}
        </motion.span>
        <motion.span
          className="absolute top-0 left-0 block"
          variants={textHoverVariants}
        >
          {item.name}
        </motion.span>
      </div>
    </motion.a>
  );

  // Scrolling text constants
  const topScrollingText: string =
    "INNOVATIVE SOLUTIONS ★ INNOVATIVE SOLUTIONS ★ INNOVATIVE SOLUTIONS ★ INNOVATIVE SOLUTIONS ★ INNOVATIVE SOLUTIONS ★ INNOVATIVE SOLUTIONS ★ INNOVATIVE SOLUTIONS ★ ";
  const bottomScrollingText: string =
    "IMPRESSIVE DESIGN ★ IMPRESSIVE DESIGN ★ IMPRESSIVE DESIGN ★ IMPRESSIVE DESIGN ★ IMPRESSIVE DESIGN ★ IMPRESSIVE DESIGN ★ IMPRESSIVE DESIGN ★ IMPRESSIVE DESIGN ★ ";

  // Get current hovered project data
  const currentProject: Project | undefined = hoveredProject
    ? projects.find((p) => p.id === hoveredProject)
    : undefined;

  // Effects
  useEffect(() => {
    // GSAP horizontal scrolling animations
    const topText = topTextRef.current;
    const bottomText = bottomTextRef.current;

    if (topText) {
      gsap.to(topText, {
        xPercent: 100,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }

    if (bottomText) {
      gsap.to(bottomText, {
        xPercent: -100,
        duration: 25,
        repeat: -1,
        ease: "none",
      });
    }

    // Background zoom on scroll
    if (backgroundRef.current && bannerRef.current) {
      gsap.to(backgroundRef.current, {
        scale: 1.3,
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Mouse move handler for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (projectsSectionRef.current) {
        // const rect = projectsSectionRef.current.getBoundingClientRect();
        // const x = e.clientX - rect.left;
        // const y = e.clientY - rect.top;

        // setMousePosition({ x, y });
        cursorX.set(e.clientX - 16);
        cursorY.set(e.clientY - 16);
      }
    };

    const section = projectsSectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="min-h-screen  text-white"
      {...globalAnimations.pageEnter}
    >
      <div className="body">
        <div className="noise-background-fixed"></div>
        <div className="ai-container">
          {/* Header/Navigation */}
          <motion.header
            className="text-white"
            variants={globalAnimations.staggerContainer}
            initial="initial"
            animate="animate"
          >
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <motion.div
                  className="flex items-center"
                  variants={globalAnimations.staggerChild}
                >
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "150px", height: "70px" }}
                  />
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                  <motion.div
                    className="ml-10 flex items-baseline space-x-8"
                    variants={globalAnimations.staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {navItems.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={globalAnimations.staggerChild}
                      >
                        <NavItem item={item} />
                      </motion.div>
                    ))}
                  </motion.div>
                </nav>

                {/* Phone Number - Desktop */}
                {/* <motion.div
                  className="text-white px-3 py-2 text-sm font-medium tracking-wider rounded-md relative overflow-hidden"
                  initial="initial"
                  whileHover="hover"
                  variants={globalAnimations.staggerChild}
                >
                  <div className="hidden md:flex items-center relative overflow-hidden h-6">
                    <motion.span className="block" variants={textVariants}>
                      <div className="md:flex items-center space-x-2 cursor-pointer">
                        <span className="text-sm font-medium">
                          +34 912 123 123
                        </span>
                      </div>
                    </motion.span>
                    <motion.span
                      className="absolute top-0 left-0 block"
                      variants={textHoverVariants}
                    >
                      <div className="md:flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          +34 912 123 123
                        </span>
                      </div>
                    </motion.span>
                  </div>
                </motion.div> */}

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <motion.button
                    onClick={toggleMenu}
                    className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
                    aria-expanded={isMenuOpen}
                    {...globalAnimations.scaleOnHover}
                  >
                    <AnimatePresence mode="wait">
                      {isMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="block h-6 w-6" aria-hidden="true" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img src={menubar} alt="Menu" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="md:hidden overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800">
                    {navItems.map((item, index) => (
                      <motion.a
                        key={index}
                        href={item.href}
                        className="text-white hover:text-blue-400 hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium tracking-wider transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        {...globalAnimations.scaleOnHover}
                      >
                        {item.name}
                      </motion.a>
                    ))}

                    {/* Phone Number - Mobile */}
                    <motion.div
                      className="flex items-center space-x-2 px-3 py-2 text-white border-t border-slate-600 mt-4 pt-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: navItems.length * 0.1 }}
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        +34 912 123 123
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>

          {/* Banner Section */}
          <section
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-screen overflow-hidden bg-black neon-lines"
          >
            {/* Hidden Audio */}
            <audio ref={audioRef} src={musicFile} preload="auto" />
            {/* Top Scrolling Text */}
            <div className="absolute top-0 left-0 w-full h-10 bg-black/80 flex items-center overflow-hidden z-20">
              <div
                ref={topTextRef}
                className="whitespace-nowrap text-white text-sm font-bold tracking-wider"
                style={{ transform: "translateX(-100%)" }}
              >
                {topScrollingText}
              </div>
            </div>

            {/* Main Banner Content */}
            <motion.section
              ref={bannerRef}
              className="relative h-screen flex items-center justify-center"
              style={{ y: contentY }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 25,
                mass: 0.8,
              }}
            >
              {/* Background Image with Zoom */}
              <motion.div
                ref={backgroundRef}
                className="absolute inset-0 w-full h-full"
                style={{ scale: backgroundScale }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 30,
                  mass: 0.5,
                }}
              >
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${bannerbg})`,
                  }}
                />
              </motion.div>

              {/* Content Container */}
              <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <motion.div
                  className="space-y-6 lg:space-y-8 order-2 lg:order-1"
                  variants={globalAnimations.staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {/* Name Badge */}
                  <motion.div
                    className="inline-block bg-black/60 backdrop-blur-sm border border-cyan-400/30 px-4 lg:px-6 py-3"
                    variants={globalAnimations.staggerChild}
                  >
                    <motion.h1
                      className="text-3xl md:text-3xl lg:text-5xl font-bold text-white tracking-tight"
                      style={globalAnimations.gradientText}
                    >
                      AITHEINFI
                    </motion.h1>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    className="bg-black/40 backdrop-blur-sm border border-purple-400/20 p-4 lg:p-6"
                    variants={globalAnimations.fadeInBlur}
                  >
                    <p className="text-base lg:text-[15px] text-gray-200 leading-relaxed">
                      I specialize in crafting online spaces that stand the test
                      of time. I utilize innovative design solutions that cater
                      to your unique needs.
                    </p>
                  </motion.div>

                  {/* CTA Button */}
                  {/* <motion.button
                    className="group relative px-2 lg:px-2 py-2 lg:py-2 bg-white text-black font-bold text-base lg:text-lg tracking-wide overflow-hidden transition-all duration-300 hover:bg-cyan-400 hover:text-black w-full sm:w-auto"
                    variants={globalAnimations.staggerChild}
                    {...globalAnimations.scaleOnHover}
                  >
                    <span className="relative z-10">SAY HELLO!</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button> */}
                </motion.div>

                {/* Right Content - Profile Card */}
                {/* <motion.div
                  className="flex justify-center order-1 lg:order-2"
                  {...globalAnimations.slideFromRight}
                >
                  <motion.div
                    className="relative w-full max-w-sm mx-auto"
                    {...globalAnimations.scaleOnHover}
                  >
                    <div className="">
                      <div className="relative mb-4">
                        <div className="w-full max-w-[300px] h-100 sm:h-72 lg:h-90 overflow-hidden">
                          <div className="w-full h-full bg-black rounded-xl flex items-center justify-center overflow-hidden relative">
                            <img
                              src={person}
                              alt="Patrick Fisher"
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div> */}
              </div>
            </motion.section>

            {/* Bottom Scrolling Text */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-black/80 flex items-center overflow-hidden z-20">
              <div
                ref={bottomTextRef}
                className="whitespace-nowrap text-white text-sm font-bold tracking-wider"
                style={{ transform: "translateX(100%)" }}
              >
                {bottomScrollingText}
              </div>
            </div>
          </section>

          {/* Section 2 - Welcome */}
          <section
            ref={sectionRef}
            className="relative min-h-[fit-content] py-20 px-6"
          >
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Side - Welcome Label */}
              <motion.div
                className="flex justify-center lg:justify-start"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: isInView ? 1 : 0.5, x: isInView ? 0 : -30 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="relative">
                  <motion.h2
                    className="text-white text-lg md:text-xl font-bold tracking-[0.3em] writing-mode-vertical-rl lg:writing-mode-horizontal-tb transform lg:transform-none"
                    {...globalAnimations.scaleOnHover}
                  >
                    WELCOME
                  </motion.h2>
                </div>
              </motion.div>

              {/* Right Side - Text Reveal Animation */}
              <motion.div className="">
                <div
                  ref={textRevealRef}
                  className="animation-text-reveal-opacity relative"
                >
                  {/* Main Text */}
                  <motion.p
                    className="welcom-text text-[14px] md:text-3xl lg:text-[20px] text-bold text-white leading-relaxed font-light relative z-10"
                    style={{
                      opacity: textOpacity,
                      y: textY,
                      transform:
                        "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                      transformStyle: "preserve-3d",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 30,
                      mass: 0.8,
                    }}
                  >
                    As a freelance web developer and designer with digital
                    marketing skills, I specialize in creating{" "}
                    <motion.span
                      style={globalAnimations.gradientText}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      innovative and exceptional digital experiences
                    </motion.span>{" "}
                    for my clients. With a strong work ethic and commitment to
                    delivering results, I work closely with clients to
                    understand their needs and goals, and strive to exceed their
                    expectations with every project.
                  </motion.p>

                  {/* Overlay Animation */}
                  <motion.div
                    className="overlay-animation-text-reveal-opacity absolute top-0 bottom-0 right-0 h-full pointer-events-none z-20"
                    style={{
                      width: overlayWidth,
                      opacity: 0.8,
                      willChange: "width",
                      backgroundImage: `linear-gradient(rgba(0, 13, 33, 0.88), rgba(0, 13, 33, 0.88)), url(${aibodybg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Custom Cursor with Project Images */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-50"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
            }}
          >
            {/* Default Cursor */}
            <motion.div
              className="mix-blend-difference"
              animate={{
                scale:
                  hoveredProject && !currentProject
                    ? 1.5
                    : hoveredProject
                    ? 0
                    : 1,
                opacity: hoveredProject && currentProject ? 0 : 0.6,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />

            {/* Project Image Cursor */}
            <AnimatePresence>
              {currentProject && (
                <motion.div
                  style={{
                    boxShadow:
                      "0 0 20px rgba(139,69,255,0.6), 0 0 40px rgba(139,69,255,0.4), 0 0 60px rgba(139,69,255,0.2)",
                  }}
                  className="absolute -top-16 -left-16 w-[320px] h-[230px] overflow-hidden"
                  initial={{ scale: 0, opacity: 0, rotate: -10 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{ scale: 0, opacity: 0, rotate: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    duration: 0.3,
                  }}
                >
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Projects Section */}
          <section
            ref={projectsSectionRef}
            className="relative min-h-screen py-20 overflow-hidden cursor-none"
          >
            {/* Animated Background on Hover */}
            <motion.div
              className="absolute inset-0 opacity-0"
              animate={{
                opacity: hoveredProject ? 0.1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Section Header */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16">
              <motion.div
                className="flex justify-between items-center"
                variants={globalAnimations.staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.h2
                  className="text-[12px] md:text-[14px] font-bold text-white tracking-wider"
                  variants={globalAnimations.staggerChild}
                >
                  RECENT PROJECTS
                </motion.h2>
                <motion.div
                  className="text-gray-400 text-lg font-mono"
                  variants={globalAnimations.staggerChild}
                >
                  2025
                </motion.div>
              </motion.div>
              <motion.div
                className="w-full h-px bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-8"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
            </div>

            {/* Projects List */}
            <div className="relative z-10 max-w-7xl mx-auto px-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="group relative border-b border-gray-700 last:border-b-0"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Project Item */}
                  <div className="flex items-center justify-between py-8 md:py-12 relative overflow-hidden">
                    {/* Background Image on Hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 pointer-events-none"
                      animate={{
                        opacity: hoveredProject === project.id ? 0.15 : 0,
                        scale: hoveredProject === project.id ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${project.bgColor} mix-blend-overlay`}
                      />
                    </motion.div>

                    {/* Content */}
                    <div className="flex items-center justify-between w-full relative z-10">
                      {/* Left Side - Title and Year */}
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        <motion.h3
                          className="text-[16px] md:text-[25px] lg:text-[25px] font-bold text-white tracking-tight"
                          animate={{
                            x: hoveredProject === project.id ? 20 : 0,
                            color:
                              hoveredProject === project.id
                                ? "#ffffff"
                                : "#ffffff",
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {project.title}
                        </motion.h3>

                        <motion.div
                          className="text-gray-400 text-lg font-mono"
                          animate={{
                            x: hoveredProject === project.id ? 20 : 0,
                            opacity: hoveredProject === project.id ? 0.8 : 0.6,
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {project.year}
                        </motion.div>
                      </div>

                      {/* Right Side - Project Number */}
                      <motion.div
                        className="text-[18px] md:text-[25px] font-bold text-gray-600 font-mono"
                        animate={{
                          x: hoveredProject === project.id ? -20 : 0,
                          scale: hoveredProject === project.id ? 1.1 : 1,
                          color:
                            hoveredProject === project.id
                              ? "#ffffff"
                              : "#4b5563",
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {project.number}
                      </motion.div>
                    </div>

                    {/* Hover Indicator */}
                    <motion.div
                      className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-400"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: hoveredProject === project.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.6 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating Animation Elements */}
            <motion.div
              className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-lg"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </section>

          {/* Footer */}
          <footer
            ref={footerRef}
            className="relative pt-20 pb-8 overflow-hidden"
          >
            <div className="relative z-30 px-6">
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
                {/* Left Column */}
                <motion.div
                  className="space-y-8"
                  variants={fadeInFromLeft}
                  initial="hidden"
                  animate={isFooterInView ? "visible" : "hidden"}
                  custom={0}
                >
                  {/* Logo */}
                  <motion.div
                    className="flex items-center space-x-2"
                    variants={fadeInFromLeft}
                    custom={1}
                  >
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ width: "150px", height: "70px" }}
                    />
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    className="text-white text-[14px] leading-relaxed max-w-md"
                    variants={fadeInFromLeft}
                    custom={2}
                  >
                    Experience the power of exceptional design as I bring your
                    vision to life. Transform your brand with my innovative
                    solutions.
                  </motion.p>

                  {/* Social Links */}
                  <motion.div
                    className="flex flex-wrap gap-6"
                    variants={fadeInFromLeft}
                    custom={3}
                  >
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        className="text-white hover:text-white transition-colors duration-300 text-[14px] font-medium relative group"
                        variants={fadeInFromLeft}
                        custom={3.5 + index * 0.1}
                        {...globalAnimations.scaleOnHover}
                      >
                        {social.name}
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Right Column */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
                  variants={fadeInFromRight}
                  initial="hidden"
                  animate={isFooterInView ? "visible" : "hidden"}
                  custom={0}
                >
                  {/* Menu Column */}
                  <motion.div
                    className="space-y-6"
                    variants={fadeInFromRight}
                    custom={1}
                  >
                    <motion.h3
                      className="text-white text-xl font-bold tracking-wider"
                      variants={fadeInFromRight}
                      custom={1.2}
                    >
                      Menu
                    </motion.h3>

                    <motion.ul
                      className="space-y-4"
                      variants={fadeInFromRight}
                      custom={1.4}
                    >
                      {menuLinks.map((link, index) => (
                        <motion.li
                          key={link.name}
                          variants={fadeInFromRight}
                          custom={1.6 + index * 0.1}
                        >
                          <motion.a
                            href={link.href}
                            className="text-white hover:text-white transition-colors duration-300 text-[14px] font-medium relative group inline-block"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {link.name}
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                          </motion.a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>

                  {/* Utility Pages Column */}
                  {/* <motion.div
                    className="space-y-6"
                    variants={fadeInFromRight}
                    custom={2}
                  >
                    <motion.h3
                      className="text-white text-xl font-bold tracking-wider"
                      variants={fadeInFromRight}
                      custom={2.2}
                    >
                      Utility Pages
                    </motion.h3>

                    <motion.ul
                      className="space-y-4"
                      variants={fadeInFromRight}
                      custom={2.4}
                    >
                      {utilityLinks.map((link, index) => (
                        <motion.li
                          key={link.name}
                          variants={fadeInFromRight}
                          custom={2.6 + index * 0.1}
                        >
                          <motion.a
                            href={link.href}
                            className="text-white hover:text-white transition-colors duration-300 text-[14px] font-medium relative group inline-block"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {link.name}
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                          </motion.a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div> */}
                </motion.div>
              </div>

              {/* Gradient Divider */}
              <motion.div
                className="w-full h-[4px] bg-gradient-to-r from-purple-500 via-pink-400 to-pink-500 mb-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isFooterInView ? 1 : 0 }}
                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />

              {/* Bottom Row */}
              <motion.div
                className="flex flex-col md:flex-row justify-between items-center gap-6"
                variants={fadeInFromRight}
                initial="hidden"
                animate={isFooterInView ? "visible" : "hidden"}
                custom={4}
              >
                {/* Made by */}
                <motion.div
                  className="flex items-center space-x-2 text-gray-400"
                  variants={fadeInFromLeft}
                  custom={4.2}
                >
                  {/* <div className="w-4 h-4 bg-gray-400 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-900 rounded-sm"></div>
                  </div> */}
                  {/* <span className="text-[14px]">Made by</span>
                  <motion.span
                    className="text-white font-bold text-[14px] hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
                    {...globalAnimations.scaleOnHover}
                  >
                    Amrithaa developer
                  </motion.span> */}
                </motion.div>

                {/* Powered by */}
                <motion.div
                  className="flex items-center space-x-2 text-gray-400"
                  variants={fadeInFromRight}
                  custom={4.2}
                >
                  <span className="text-[14px]">Powered by</span>
                  <motion.span
                    className="text-white font-bold text-[14px] hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
                    {...globalAnimations.scaleOnHover}
                  >
                    Amrithaa
                  </motion.span>
                </motion.div>
              </motion.div>

              {/* Floating Animation Elements */}
              <motion.div
                className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-cyan-400/10 to-purple-400/10 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute bottom-20 left-10 w-12 h-12 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-md"
                animate={{
                  scale: [1.2, 1, 1.2],
                  x: [0, 20, 0],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
            </div>
          </footer>
        </div>
      </div>

      {/* Global CSS for animations and effects */}
      <style>{`
        // .body {
        //   position: relative;
        //   min-height: 100vh;
        //   background: #000;
        //   overflow-x: hidden;
        // }

        // .noise-background-fixed {
        //   position: fixed;
        //   top: 0;
        //   left: 0;
        //   width: 100vw;
        //   height: 100vh;
        //   background: radial-gradient(
        //       ellipse at center,
        //       rgba(139, 69, 255, 0.1) 0%,
        //       transparent 50%
        //     ),
        //     linear-gradient(
        //       45deg,
        //       rgba(6, 182, 212, 0.05) 0%,
        //       rgba(139, 69, 255, 0.05) 50%,
        //       rgba(236, 72, 153, 0.05) 100%
        //     );
        //   pointer-events: none;
        //   z-index: 1;
        // }

        // .noise-background-fixed::before {
        //   content: "";
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   width: 100%;
        //   height: 100%;
        //   background-image: radial-gradient(
        //       circle at 25% 25%,
        //       rgba(139, 69, 255, 0.1) 0%,
        //       transparent 25%
        //     ),
        //     radial-gradient(
        //       circle at 75% 75%,
        //       rgba(6, 182, 212, 0.1) 0%,
        //       transparent 25%
        //     ),
        //     radial-gradient(
        //       circle at 75% 25%,
        //       rgba(236, 72, 153, 0.1) 0%,
        //       transparent 25%
        //     ),
        //     radial-gradient(
        //       circle at 25% 75%,
        //       rgba(34, 197, 94, 0.1) 0%,
        //       transparent 25%
        //     );
        //   animation: float 20s ease-in-out infinite;
        // }

        .ai-container {
          position: relative;
          z-index: 2;
        }

        .neon-lines {
          position: relative;
        }

        // .neon-lines::before {
        //   content: "";
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   right: 0;
        //   bottom: 0;
        //   background: linear-gradient(
        //       90deg,
        //       transparent 49.5%,
        //       rgba(139, 69, 255, 0.3) 50%,
        //       transparent 50.5%
        //     ),
        //     linear-gradient(
        //       0deg,
        //       transparent 49.5%,
        //       rgba(6, 182, 212, 0.2) 50%,
        //       transparent 50.5%
        //     );
        //   background-size: 100px 100px;
        //   pointer-events: none;
        //   opacity: 0.1;
        //   animation: grid-move 10s linear infinite;
        // }

        .writing-mode-vertical-rl {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .writing-mode-horizontal-tb {
          writing-mode: horizontal-tb;
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(10px, -10px) rotate(1deg);
          }
          66% {
            transform: translate(-10px, 10px) rotate(-1deg);
          }
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(100px, 100px);
          }
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #0891b2, #7c3aed);
        }

        /* Selection styles */
        ::selection {
          background: rgba(139, 69, 255, 0.3);
          color: white;
        }

        ::-moz-selection {
          background: rgba(139, 69, 255, 0.3);
          color: white;
        }

        

        /* Responsive text sizing */
        @media (max-width: 768px) {
          .writing-mode-vertical-rl {
            writing-mode: horizontal-tb;
            text-orientation: initial;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default LandingPage;
