import React, { useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';
import './ExperienceTimeline.scss';

const experiences = [
    {
        id: 1,
        role: "Senior UI/UX Engineer",
        company: "Cavli Wireless",
        location: "Kochi, India",
        date: "01/2021 - 07/2023",
        description: [
            "Designed, developed and maintained company website",
            "Monitored and optimized the website for user engagement",
            "Improved SEO and created interactive landing pages"
        ]
    },
    {
        id: 2,
        role: "UI Developer",
        company: "DotWibe",
        location: "Kochi, India",
        date: "11/2019 - 05/2021",
        description: [
            "Developed cross-browser and device compatible interfaces",
            "Built front-end architecture for scalability and performance",
            "Mentored college interns in HTML & CSS"
        ]
    },
    {
        id: 3,
        role: "UI Designer Intern",
        company: "Zoople",
        location: "Kochi, India",
        date: "08/2019 - 10/2019",
        description: [
            "Focused on UI design principles and implementation"
        ]
    }
];

const education = [
    {
        id: 4,
        role: "Masters in IoT and Smart Systems",
        company: "Westsächsische Hochschule Zwickau",
        location: "Zwickau, Germany",
        date: "08/2023 - Present",
        description: ["Specializing in Internet of Things and Smart Systems"]
    },
    {
        id: 5,
        role: "Bachelors in Computer Science",
        company: "Loyola Institute of Technology",
        location: "Tamil Nadu, India",
        date: "06/2015 - 06/2019",
        description: ["Foundation in Computer Science and Engineering"]
    }
];

const ExperienceTimeline = () => {
    const [activeTab, setActiveTab] = useState('experience');
    const [headerRef, headerVisible] = useIntersectionObserver({ triggerOnce: true });

    const currentData = activeTab === 'experience' ? experiences : education;
    const Icon = activeTab === 'experience' ? Briefcase : GraduationCap;

    return (
        <section className="experience-section">
            <div className="container">
                {/* Header */}
                <div
                    ref={headerRef}
                    className={`experience-header ${headerVisible ? 'animate-fade-in' : 'opacity-0'}`}
                >
                    <h2>Experience & Education</h2>
                    <p className="experience-subtitle">
                        My professional journey and academic background
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button
                        className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
                        onClick={() => setActiveTab('experience')}
                    >
                        <Briefcase size={18} />
                        Experience
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                        onClick={() => setActiveTab('education')}
                    >
                        <GraduationCap size={18} />
                        Education
                    </button>
                </div>

                {/* Cards Container */}
                <div className="cards-container" key={activeTab}>
                    {currentData.map((item, index) => (
                        <ExperienceCard
                            key={item.id}
                            data={item}
                            index={index}
                            Icon={Icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ExperienceCard = ({ data, index, Icon }) => {
    const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true, threshold: 0.1 });

    return (
        <div
            ref={ref}
            className={`experience-card ${isVisible ? 'visible' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Icon */}
            <div className="card-icon">
                <Icon size={24} />
            </div>

            {/* Content */}
            <div className="card-body">
                <div className="card-header">
                    <h3 className="card-role">{data.role}</h3>
                    <div className="card-date">
                        <Calendar size={14} />
                        {data.date}
                    </div>
                </div>

                <div className="card-company">
                    <span className="company-name">{data.company}</span>
                    <span className="company-location">
                        <MapPin size={12} />
                        {data.location}
                    </span>
                </div>

                <ul className="card-description">
                    {data.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ExperienceTimeline;
