/**
 * Projects.jsx - Projects Portfolio Section
 * 
 * Features:
 * - Bento grid layout (large/medium/small cards)
 * - Tech stack icons from Devicons CDN
 * - Mouse-follow glow effect
 * - Demo and GitHub links
 */

import React from 'react';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import SeoHead from '../components/SeoHead';
import { SEO_DATA } from '../utils/seoData';
import './Projects.scss';

/* ============================================
   TECH ICONS CONFIGURATION
   Using Devicons CDN for technology logos
   ============================================ */
const techIcons = {
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
    'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    'Android': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
    'MQTT': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg',
    'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    'WebGL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
    'Node': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
    'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
};

/* ============================================
   PROJECT DATA
   Size: 'large' | 'medium' | 'small' for grid
   ============================================ */
const projects = [
    {
        id: '01',
        title: 'Cloud Sentinel',
        description: 'Advanced cryptographic system enabling secure, searchable data on untrusted cloud servers with real-time threat detection.',
        category: 'Cybersecurity',
        image: '/assets/projects/cloud.png',
        tech: ['React', 'Python', 'AWS'],
        size: 'large',
        demo: null,
        github: 'https://github.com/deepuissacgigi'
    },
    {
        id: '02',
        title: 'Nexus Home',
        description: 'Android-based bridge for smart home ecosystems. Monitors ambient metrics and automates climate control.',
        category: 'IoT / Mobile',
        image: '/assets/projects/iot.png',
        tech: ['Java', 'Android', 'MQTT'],
        size: 'medium',
        demo: null,
        github: 'https://github.com/deepuissacgigi'
    },
    {
        id: '03',
        title: 'Cavli Portal',
        description: 'High-performance corporate portal with server-side rendering and WebGL product visualizations.',
        category: 'Enterprise',
        image: '/assets/projects/corporate.png',
        tech: ['Next.js', 'WebGL', 'Node'],
        size: 'small',
        demo: 'https://www.cavliwireless.com',
        github: null
    },
    {
        id: '04',
        title: 'Neural Analytics',
        description: 'Machine learning dashboard for predictive business intelligence and automated reporting.',
        category: 'AI / ML',
        image: '/assets/projects/cloud.png',
        tech: ['Python', 'TensorFlow', 'React'],
        size: 'small',
        demo: null,
        github: 'https://github.com/deepuissacgigi'
    }
];

/* ============================================
   PROJECTS COMPONENT
   ============================================ */
const Projects = () => {
    const [headerRef, headerVisible] = useIntersectionObserver({ triggerOnce: true });

    /**
     * Track mouse position for card glow effect
     */
    const handleMouseMove = (e, cardElement) => {
        const rect = cardElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        cardElement.style.setProperty('--mouse-x', `${x}%`);
        cardElement.style.setProperty('--mouse-y', `${y}%`);
    };

    return (
        <section id="projects" className="projects-section">
            <SeoHead {...SEO_DATA.projects} />

            <div className="container">
                {/* Section Header */}
                <div
                    ref={headerRef}
                    className={`projects-header ${headerVisible ? 'animate-fade-in' : 'opacity-0'}`}
                >
                    <h2>Projects and Works</h2>
                    <p className="section-subtitle">
                        A selection of projects showcasing my expertise in design, development, and innovation.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="bento-grid">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`bento-card bento-card--${project.size}`}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Background Image */}
                            <div className="card-visual">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    loading="lazy"
                                    width="600"
                                    height="400"
                                />
                            </div>

                            {/* Hover Arrow */}
                            <div className="card-arrow">
                                <ArrowUpRight />
                            </div>

                            {/* Card Content */}
                            <div className="card-content">
                                <div className="card-meta">
                                    <span className="card-number">{project.id}</span>
                                    <span className="card-category">{project.category}</span>
                                </div>

                                <h3 className="card-title">{project.title}</h3>
                                <p className="card-description">{project.description}</p>

                                {/* Tech Stack */}
                                <div className="card-tech">
                                    {project.tech.map((t) => (
                                        <span key={t} className="tech-tag">
                                            {techIcons[t] && (
                                                <img
                                                    src={techIcons[t]}
                                                    alt={t}
                                                    className="tech-icon"
                                                    width="20"
                                                    height="20"
                                                    loading="lazy"
                                                />
                                            )}
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Project Links */}
                                <div className="card-links">
                                    {project.demo && (
                                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="card-link">
                                            <ExternalLink size={16} />
                                            <span>Live Demo</span>
                                        </a>
                                    )}
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="card-link">
                                            <Github size={16} />
                                            <span>GitHub</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
