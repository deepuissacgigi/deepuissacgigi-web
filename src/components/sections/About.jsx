import React, { useState, useEffect, useRef } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { MapPin, GraduationCap, Briefcase, Code, Palette, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import './About.scss';

/* Tech Stack with Icons */
const skills = [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Android', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
    { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
];

/* Animated Counter Hook */
const useCounter = (end, duration = 2000, start = 0) => {
    const [count, setCount] = useState(start);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * (end - start) + start));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isVisible, end, duration, start]);

    return [count, ref];
};

const About = () => {
    const [headerRef, headerVisible] = useIntersectionObserver({ triggerOnce: true });
    const [yearsExp, yearsRef] = useCounter(4, 1500);
    const [projects, projectsRef] = useCounter(15, 1500);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="about" className="about-section">
            <div className="container">
                {/* Header */}
                <div
                    ref={headerRef}
                    className={`about-header ${headerVisible ? 'animate-fade-in' : 'opacity-0'}`}
                >
                    <h2>About Me</h2>
                    <p className="about-subtitle">
                        Passionate about creating digital experiences
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="about-bento">
                    {/* Main Bio Card */}
                    <div className="bento-item bento-bio">
                        <div className="bio-content">
                            <span className="bio-greeting">Hi there! 👋</span>
                            <h3>I'm Deepu Issac Gigi</h3>
                            <p>
                                A motivated MSc student with a passion for innovation, seeking opportunities
                                in dynamic and challenging environments. I bridge the gap between design and
                                development, creating scalable and performant user interfaces.
                            </p>
                            <Button variant="primary" onClick={() => scrollToSection('contact')}>
                                Let's Connect <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="bento-item bento-stat" ref={yearsRef}>
                        <div className="stat-number">{yearsExp}+</div>
                        <div className="stat-label">Years of Experience</div>
                        <Briefcase className="stat-icon" size={32} />
                    </div>

                    <div className="bento-item bento-stat" ref={projectsRef}>
                        <div className="stat-number">{projects}+</div>
                        <div className="stat-label">Projects Completed</div>
                        <Code className="stat-icon" size={32} />
                    </div>

                    {/* Location Card */}
                    <div className="bento-item bento-location">
                        <MapPin className="location-icon" size={24} />
                        <div className="location-text">
                            <span className="location-city">Halle (Saale)</span>
                            <span className="location-country">Germany 🇩🇪</span>
                        </div>
                    </div>

                    {/* Education Card */}
                    <div className="bento-item bento-education">
                        <GraduationCap className="edu-icon" size={28} />
                        <div className="edu-text">
                            <span className="edu-degree">MSc IoT & Smart Systems</span>
                            <span className="edu-school">WHZ Zwickau</span>
                        </div>
                    </div>

                    {/* Skills Card */}
                    <div className="bento-item bento-skills">
                        <div className="skills-header">
                            <Palette size={20} />
                            <h4>Tech Stack</h4>
                        </div>
                        <div className="skills-grid">
                            {skills.map((skill) => (
                                <div key={skill.name} className="skill-item">
                                    <img src={skill.icon} alt={skill.name} />
                                    <span>{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
