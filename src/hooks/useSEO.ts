import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonical?: string;
}

export const useSEO = ({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonical,
}: SEOProps) => {
    useEffect(() => {
        // Update basic tags
        if (title) {
            document.title = `${title} | Elite Motors`;
        }

        const updateMetaTag = (name: string, content: string, isProperty = false) => {
            let element = document.querySelector(
                isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
            );
            if (element) {
                element.setAttribute('content', content);
            } else {
                const meta = document.createElement('meta');
                if (isProperty) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                meta.setAttribute('content', content);
                document.head.appendChild(meta);
            }
        };

        if (description) updateMetaTag('description', description);
        if (keywords) updateMetaTag('keywords', keywords);

        // Update OG tags
        if (ogTitle || title) updateMetaTag('og:title', ogTitle || title || '', true);
        if (ogDescription || description) updateMetaTag('og:description', ogDescription || description || '', true);
        if (ogImage) updateMetaTag('og:image', ogImage, true);

        // Update Twitter tags
        if (twitterTitle || title) updateMetaTag('twitter:title', twitterTitle || title || '');
        if (twitterDescription || description) updateMetaTag('twitter:description', twitterDescription || description || '');
        if (twitterImage || ogImage) updateMetaTag('twitter:image', twitterImage || ogImage || '');

        // Update Canonical
        let canonicalElement = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            if (canonicalElement) {
                canonicalElement.setAttribute('href', canonical);
            } else {
                const link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                link.setAttribute('href', canonical);
                document.head.appendChild(link);
            }
        }

        return () => {
            // Optional: Clean up or revert if necessary
        };
    }, [
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
        canonical,
    ]);
};
