import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHead = ({
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType = 'website',
    schema,
    noIndex = false
}) => {
    const siteName = "Deepu Issac"; // Personal Brand Name
    const twitterHandle = "@i.s.s.a.c._"; // Instagram/Twitter handle
    const defaultImage = "https://yourdomain.com/og-default.png"; // Fallback image

    // CTR-Optimized Title Formula: "Main Keyword | Benefit - Brand"
    // If title is "Contact Me", full title becomes "Contact Me | Deepu Issac"
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const finalImage = ogImage || defaultImage;
    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

    // Base Schema (Organization/Person) - merged with page-specific schema
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Deepu Issac",
        "url": "https://yourdomain.com",
        "sameAs": [
            "https://www.instagram.com/i.s.s.a.c._/",
            "https://www.linkedin.com/in/deepu-issac/",
            "https://github.com/deepuissac"
        ],
        "jobTitle": "Full Stack Developer",
        "worksFor": {
            "@type": "Organization",
            "name": "Freelance"
        }
    };

    const finalSchema = schema ? [baseSchema, schema] : [baseSchema];

    return (
        <Helmet>
            {/* 1. Core Meta */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />
            <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="theme-color" content="#ffffff" />
            <html lang="en" />

            {/* 2. OpenGraph Domination (Facebook/Discord/LinkedIn) */}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={title || siteName} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="en_US" />

            {/* 3. Twitter/X Cards (Large Image for CTR) */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={twitterHandle} />
            <meta name="twitter:creator" content={twitterHandle} />
            <meta name="twitter:title" content={title || siteName} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={finalImage} />

            {/* 4. Structured Data Injection (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(finalSchema)}
            </script>
        </Helmet>
    );
};

export default SeoHead;
