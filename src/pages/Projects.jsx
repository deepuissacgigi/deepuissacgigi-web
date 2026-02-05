import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { ExternalLink, Github, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { SEO_DATA } from '../utils/seoData';
// IMPORT THE NEW DEDICATED SCSS
import './Projects.scss';

/* 
   PROJECT DATA 
   Simple, flat data structure for the Neon Grid.
*/
const projects = [
    {
        id: '01',
        title: 'Cloud Sentinel',
        subtitle: 'Encrypted Search Architecture',
        description: 'Advanced cryptographic system enabling secure, searchable data on untrusted cloud servers. Features trace-based authorization and real-time threat detection.',
        category: 'Cybersecurity',
        image: '/assets/projects/cloud.png',
        tech: ['React', 'Python', 'AWS']
    },
    {
        id: '02',
        title: 'Nexus Home',
        subtitle: 'IoT Environmental Control',
        description: 'Android-based bridge for smart home ecosystems. Monitors ambient metrics and automates climate control using a custom Java-based sensor protocol.',
        category: 'IoT / Mobile',
        image: '/assets/projects/iot.png',
        tech: ['Java', 'Android SDK', 'MQTT']
    },
    {
        id: '03',
        title: 'Cavli Portal',
        subtitle: 'Enterprise Web Presence',
        description: 'High-performance corporate portal built for scale. Implements server-side rendering for SEO and WebGL for interactive product visualizations.',
        category: 'Enterprise',
        image: '/assets/projects/corporate.png',
        tech: ['Next.js', 'WebGL', 'Node']
    }
];

const Projects = () => {
    const [headerRef, headerVisible] = useIntersectionObserver({ triggerOnce: true });

    return (
        <div id="projects" className="section-container" style={{ padding: '8rem 0' }}>
            <SeoHead {...SEO_DATA.projects} />
            <div className="container">
                {/* Header */}
                <div ref={headerRef} className={`section-header ${headerVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ marginBottom: '4rem' }}>

                    <h2
                        className={`section-title ${headerVisible ? 'animate-glitch-reveal' : 'opacity-0'}`}
                        data-text="Featured Operations"
                    >
                        Featured Operations
                    </h2>
                    <p className="section-description">
                        Classified deployments and experimental architectures.

                    </p>
                </div>

                {/* THE NEON GRID */}
                <div className="neon-grid-container">
                    {projects.map((project, index) => (
                        <div key={project.id} className="neon-card" style={{ animationDelay: `${index * 0.15}s` }}>

                            {/* Image Header */}
                            <div className="card-image">
                                <div className="overlay"></div>
                                <div className="category-badge">{project.category}</div>
                                <img src={project.image} alt={project.title} />
                            </div>

                            {/* Content Body */}
                            <div className="card-content">
                                <h3 className="project-title">{project.title}</h3>
                                <div className="project-subtitle">{project.subtitle}</div>
                                <p className="project-desc">{project.description}</p>

                                {/* Footer Actions */}
                                <div className="card-footer">
                                    <div className="tech-stack">
                                        {/* Decorative Tech Dots */}
                                        <span className="active"></span>
                                        <span className="blue"></span>
                                        <span></span>
                                    </div>
                                    <a href="#" className="project-link">
                                        View Details <ArrowRight size={18} />
                                    </a>
                                </div>
                            </div>

                            {/* Neon Glow Bar */}
                            <div className="neon-bar"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
