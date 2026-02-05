import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const experiences = [
    {
        id: 1,
        role: "Senior UI/UX Engineer",
        company: "Cavli Wireless",
        location: "Kochi, India",
        date: "01/2021 - 07/2023",
        description: [
            "Designed, developed and maintained company website.",
            "Monitored and optimized the website, involving user engagement.",
            "Improved SEO and Made User Interactive Landing Pages for different company Products."
        ]
    },
    {
        id: 2,
        role: "UI Developer",
        company: "DotWibe",
        location: "Kochi, India",
        date: "11/2019 - 05/2021",
        description: [
            "Developed user interfaces that were cross-browser and device compatible.",
            "Developed front-end architecture that improved scalability and performance.",
            "Coached college interns with HTML & CSS."
        ]
    },
    {
        id: 3,
        role: "UI Designing",
        company: "Zoople",
        location: "Kochi, India",
        date: "08/2019 - 10/2019",
        description: [
            "Focused on UI Designing principles and implementation."
        ]
    }
];

const education = [
    {
        id: 4,
        role: "Masters in IoT and Smart Systems",
        company: "Westsächsische Hochschule Zwickau",
        location: "Zwickau, Germany",
        date: "08/2023 - Current",
        description: ["Specializing in Internet of Things and Smart Systems."]
    },
    {
        id: 5,
        role: "Bachelors in Computer Science",
        company: "Loyola Institute of Technology",
        location: "Tamil Nadu, India",
        date: "06/2015 - 06/2019",
        description: ["Foundation in Computer Science and Engineering."]
    }
];

const ExperienceTimeline = () => {
    const [headerRef, headerVisible] = useIntersectionObserver({ triggerOnce: true });

    return (
        <section className="section-container" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <div ref={headerRef} className={`section-header ${headerVisible ? 'animate-fade-in' : 'opacity-0'}`}>

                    <h2
                        className={`section-title ${headerVisible ? 'animate-glitch-reveal' : 'opacity-0'}`}
                        data-text="Experience & Education"
                    >
                        Experience & Education
                    </h2>
                    <p className="section-description">
                        A timeline of my professional journey and academic milestones.
                    </p>
                </div>

                <div className="timeline-container" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                    {/* Central Line */}
                    <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        background: 'rgba(100, 108, 255, 0.3)',
                        borderRadius: '2px'
                    }}></div>

                    {/* Works */}
                    <h3 style={{ marginLeft: '50px', marginBottom: '2rem', color: '#a5b4fc', fontSize: '1.5rem' }}>Work Experience</h3>
                    {experiences.map((exp, index) => (
                        <TimelineItem key={exp.id} data={exp} index={index} />
                    ))}

                    {/* Education */}
                    <h3 style={{ marginLeft: '50px', margin: '3rem 0 2rem', color: '#a5b4fc', fontSize: '1.5rem' }}>Education</h3>
                    {education.map((edu, index) => (
                        <TimelineItem key={edu.id} data={edu} index={index + 3} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const TimelineItem = ({ data, index }) => {
    const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true, threshold: 0.2 });

    return (
        <div
            ref={ref}
            className={`timeline-item glass-panel ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
            style={{
                marginLeft: '50px',
                marginBottom: '2rem',
                padding: '1.5rem',
                position: 'relative',
                animationDelay: `${index * 0.1}s`
            }}
        >
            {/* Dot on Line */}
            <div style={{
                position: 'absolute',
                left: '-39px',
                top: '25px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#646cff',
                boxShadow: '0 0 10px #646cff'
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}>{data.role}</h4>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{data.date}</span>
            </div>
            <h5 style={{ fontSize: '1rem', color: '#a5b4fc', marginBottom: '1rem' }}>{data.company} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>• {data.location}</span></h5>

            <ul style={{ paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                {data.description.map((desc, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{desc}</li>
                ))}
            </ul>
        </div>
    );
};

export default ExperienceTimeline;
