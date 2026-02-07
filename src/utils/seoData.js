// Centralized SEO Data Store
// Easier to manage than scattering strings across components

export const SEO_DATA = {
    home: {
        title: "Full Stack Developer & UI/UX Designer",
        description: "Deepu Issac is a Full Stack Developer specializing in React, Node.js, and modern web design. Building high-performance, interactive web experiences.",
        schema: {
            "@type": "WebSite",
            "name": "Deepu Issac Portfolio",
            "url": "https://deepuissacgigi-web.vercel.app",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://deepuissacgigi-web.vercel.app/?s={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        }
    },
    contact: {
        title: "Contact Me",
        description: "Get in touch with Deepu Issac for freelance projects, collaborations, or job opportunities. Available for React and Node.js development.",
        schema: {
            "@type": "ContactPage",
            "mainEntity": {
                "@type": "Person",
                "name": "Deepu Issac",
                "email": "deepuissacgigi@gmail.com",
                "telephone": "+49-15510437615"
            }
        }
    },
    projects: {
        title: "My Projects",
        description: "View my portfolio of web development projects including ICEFLIX, Personal Website, and more. Built with React, Sass, and modern tools.",
        schema: {
            "@type": "CollectionPage",
            "name": "Deepu Issac Projects",
            "description": "Portfolio of web development works"
        }
    }
};


