import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Briefcase, Code2, User, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import './About.scss';

/* Tech Stack with Icons */
const skills = [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: '#F7DF1E' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#3776AB' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
    { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', color: '#F24E1E' },
    { name: 'Android', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg', color: '#3DDC84' },
];

/* Animated Counter */
const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let start;
        const animate = (time) => {
            if (!start) start = time;
            const progress = Math.min((time - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return [count, ref];
};

const About = () => {
    const [years, yearsRef] = useCounter(4, 1500);
    const [projects, projectsRef] = useCounter(15, 1500);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="about" className="about-section-v2">
            <div className="about-container">
                {/* Left Side - Main Content */}
                <div className="about-main">
                    <div className="about-label">
                        <User size={18} />
                        About Me
                    </div>

                    <h2 className="about-title">
                        I craft digital
                        <span className="gradient-text"> experiences</span>
                        <br />that inspire
                    </h2>

                    <p className="about-description">
                        A passionate MSc student specializing in IoT & Smart Systems,
                        with 4+ years of experience bridging the gap between design and development.
                        I create scalable, performant, and beautiful user interfaces.
                    </p>

                    <div className="about-meta">
                        <div className="meta-item">
                            <MapPin size={16} />
                            <span>Halle (Saale), Germany</span>
                        </div>
                        <div className="meta-item">
                            <Briefcase size={16} />
                            <span>Open to opportunities</span>
                        </div>
                    </div>

                    <Button variant="primary" onClick={() => scrollToSection('contact')}>
                        Get in Touch <ChevronRight size={18} />
                    </Button>
                </div>

                {/* Right Side - Cards */}
                <div className="about-cards">
                    {/* Stats Row */}
                    <div className="cards-row">
                        <div className="stat-card" ref={yearsRef}>
                            <div className="stat-value">{years}+</div>
                            <div className="stat-label">Years Experience</div>
                        </div>
                        <div className="stat-card" ref={projectsRef}>
                            <div className="stat-value">{projects}+</div>
                            <div className="stat-label">Projects Delivered</div>
                        </div>
                    </div>

                    {/* Skills Card */}
                    <div className="skills-card">
                        <div className="skills-header">
                            <Code2 size={18} />
                            <span>Tech Stack</span>
                        </div>
                        <div className="skills-list">
                            {skills.map((skill) => (
                                <div
                                    key={skill.name}
                                    className="skill-pill"
                                    style={{ '--skill-color': skill.color }}
                                >
                                    <img src={skill.icon} alt={skill.name} />
                                    <span>{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education Badge */}
                    <div className="edu-card">
                        <div className="edu-icon">🎓</div>
                        <div className="edu-content">
                            <span className="edu-degree">MSc IoT & Smart Systems</span>
                            <span className="edu-school">WHZ Zwickau, Germany</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
