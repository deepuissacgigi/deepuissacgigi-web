import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, keywords, image }) => {
    const siteTitle = "Deepu Issac Gigi | IoT Engineer & Full Stack Developer";
    const defaultDescription = "Portfolio of Deepu Issac Gigi, a Masters student in Internet of Things (IoT) at University of Galway. Explorer of future tech, cloud architectures, and smart systems.";
    const defaultKeywords = "Deepu Issac Gigi, IoT Engineer, Full Stack Developer, University of Galway, React, Three.js, Portfolio";
    const defaultImage = "/preview.png"; // Placeholder

    return (
        <Helmet>
            <title>{title ? `${title} | Deepu Issac Gigi` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="author" content="Deepu Issac Gigi" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={title || siteTitle} />
            <meta property="twitter:description" content={description || defaultDescription} />
            <meta property="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
};

export default Seo;
