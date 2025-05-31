export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  language?: string;
  publishedTime?: string;
  author?: string;
  keywords?: string[];
}

/**
 * Update document head with SEO meta tags
 */
export function updateSEO(data: SEOData) {
  if (data.title) {
    document.title = data.title;
    updateMetaTag("og:title", data.title);
    updateMetaTag("twitter:title", data.title);
  }

  if (data.description) {
    updateMetaTag("description", data.description);
    updateMetaTag("og:description", data.description);
    updateMetaTag("twitter:description", data.description);
  }

  if (data.image) {
    updateMetaTag("og:image", data.image);
    updateMetaTag("twitter:image", data.image);
    updateMetaTag("twitter:card", "summary_large_image");
  }

  if (data.url) {
    updateMetaTag("og:url", data.url);
    updateLinkTag("canonical", data.url);
  }

  if (data.type) {
    updateMetaTag("og:type", data.type);
  }

  if (data.language) {
    document.documentElement.lang = data.language;
    updateMetaTag("og:locale", data.language.replace("-", "_"));
  }

  if (data.publishedTime && data.type === "article") {
    updateMetaTag("article:published_time", data.publishedTime);
  }

  if (data.author) {
    updateMetaTag("article:author", data.author);
  }

  if (data.keywords?.length) {
    updateMetaTag("keywords", data.keywords.join(", "));
  }

  // Essential Twitter meta tags
  updateMetaTag("twitter:site", "@wisata_app");
  updateMetaTag("twitter:creator", "@wisata_app");
}

/**
 * Update or create meta tag
 */
function updateMetaTag(property: string, content: string) {
  if (!content) return;

  // Try property first (for og: tags)
  let metaTag = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement;

  // Fall back to name attribute (for standard meta tags)
  if (!metaTag) {
    metaTag = document.querySelector(
      `meta[name="${property}"]`
    ) as HTMLMetaElement;
  }

  if (metaTag) {
    metaTag.content = content;
  } else {
    const tag = document.createElement("meta");

    // Use property for og: and article: tags, name for others
    if (property.startsWith("og:") || property.startsWith("article:")) {
      tag.setAttribute("property", property);
    } else {
      tag.setAttribute("name", property);
    }

    tag.content = content;
    document.head.appendChild(tag);
  }
}

/**
 * Update or create link tag
 */
function updateLinkTag(rel: string, href: string) {
  if (!href) return;

  let linkTag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (linkTag) {
    linkTag.href = href;
  } else {
    const tag = document.createElement("link");
    tag.rel = rel;
    tag.href = href;
    document.head.appendChild(tag);
  }
}

/**
 * React hook for SEO management
 */
export function useSEO(data: SEOData) {
  React.useEffect(() => {
    updateSEO(data);
  }, [data]);
}

/**
 * Generate structured data (JSON-LD) for better SEO
 */
export function generateStructuredData(data: SEOData & { content?: string }) {
  const structuredData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": data.type === "article" ? "Article" : "WebPage",
    headline: data.title,
    description: data.description,
    image: data.image,
    url: data.url,
    datePublished: data.publishedTime,
    author: {
      "@type": "Organization",
      name: data.author || "Wisata Diary",
    },
    publisher: {
      "@type": "Organization",
      name: "Wisata Diary",
      logo: {
        "@type": "ImageObject",
        url: "https://wisata.app/logo.png",
      },
    },
  };

  // Clean up undefined values
  Object.keys(structuredData).forEach((key) => {
    if (structuredData[key] === undefined) {
      delete structuredData[key];
    }
  });

  return structuredData;
}

/**
 * Insert or update structured data script tag
 */
export function updateStructuredData(data: SEOData & { content?: string }) {
  const structuredData = generateStructuredData(data);

  let scriptTag = document.querySelector('script[type="application/ld+json"]');

  if (scriptTag) {
    scriptTag.textContent = JSON.stringify(structuredData);
  } else {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}

// Import React for the hook
import React from "react";
