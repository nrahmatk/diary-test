import type {
  DiaryContent,
  SEOData,
  WisataImageSize,
  TwitterImageSize,
} from "../types";
import MarkdownIt from "markdown-it";

/**
 * Wisata CDN image size formats
 */
const CDN_WISATA_IMG_SIZE: Record<string, WisataImageSize> = {
  TH: "th",
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

/**
 * Twitter CDN image size formats
 */
const CDN_TWITTER_IMG_SIZE: Record<string, TwitterImageSize> = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  THUMB: "thumb",
  ORIG: "orig",
} as const;

/**
 * Replace original image URL with size-optimized image URL.
 * Handles both Wisata CDN and Twitter CDN with fallback strategy
 */
export function getSizeOptimizedImageUrl(
  originalUrl: string,
  desiredSize: string = "md"
): string {
  if (!originalUrl) return originalUrl;

  try {
    const url = new URL(originalUrl);

    // Handle Wisata CDN
    if (url.hostname === "cdn.wisata.app") {
      const pathParts = url.pathname.split(".");
      if (pathParts.length >= 2) {
        const extension = pathParts.pop();
        const basePath = pathParts.join(".");
        const sizeParam =
          CDN_WISATA_IMG_SIZE[desiredSize.toUpperCase()] || desiredSize;
        return `${url.origin}${basePath}_${sizeParam}.${extension}`;
      }
    }

    // Handle Twitter CDN
    if (url.hostname === "pbs.twimg.com") {
      const params = new URLSearchParams(url.search);
      params.set(
        "name",
        CDN_TWITTER_IMG_SIZE[desiredSize.toUpperCase()] || "medium"
      );
      return `${url.origin}${url.pathname}?${params.toString()}`;
    }

    return originalUrl;
  } catch (error) {
    console.warn("Failed to optimize image URL:", error);
    return originalUrl;
  }
}

/**
 * Extracts SEO attributes from diary content
 */
export function getDiaryContentSEOAttributes(
  contentData: DiaryContent
): SEOData {
  if (!contentData?.meta) return {};

  const { meta } = contentData;
  return {
    title: meta.title || "Wisata Diary",
    description: meta.description || "",
    image: meta.image ? getSizeOptimizedImageUrl(meta.image, "lg") : "",
    language: meta.language || "id-id",
    type: meta.type || "article",
    url: window.location.href,
    publishedTime: contentData.created_dt,
    author: contentData.created_by || "Wisata Diary",
  };
}

/**
 * Convert diary content to renderable data
 * Processes Markdown content and converts embedded components to HTML
 */
export function renderDiaryContent(contentData: DiaryContent): string {
  if (!contentData?.content) return "";

  let content = contentData.content;

  // Clean up escaped newlines first
  content = content.replace(/\\n/g, "\n");
  // Process TikTok embeds BEFORE markdown processing
  content = content.replace(
    /<TiktokEmbed\s+url="([^"]+)"\s*\/>/g,
    (_match, url) => {
      const videoId = extractTiktokVideoId(url);
      return `<div class="tiktok-embed" data-video-id="${videoId}" data-url="${url}">
        <iframe src="https://www.tiktok.com/embed/v2/${videoId}" width="100%" height="500" frameborder="0" allowfullscreen loading="lazy"></iframe>
      </div>`;
    }
  );
  // Process YouTube embeds
  content = content.replace(
    /<YoutubeEmbed\s+url="([^"]+)"\s*\/>/g,
    (_match, url) => {
      const videoId = extractYoutubeVideoId(url);
      return `<div class="youtube-embed">
        <iframe src="https://www.youtube.com/embed/${videoId}" width="100%" height="315" frameborder="0" allowfullscreen loading="lazy"></iframe>
      </div>`;
    }
  );
  // Process Instagram embeds
  content = content.replace(
    /<InstagramEmbed\s+url="([^"]+)"\s*\/>/g,
    (_match, url) => {
      return `<div class="instagram-embed">
        <blockquote class="instagram-media" data-instgrm-permalink="${url}" loading="lazy"></blockquote>
      </div>`;
    }
  );
  // Process Twitter embeds
  content = content.replace(
    /<TwitterEmbed\s+url="([^"]+)"\s*\/>/g,
    (_match, url) => {
      return `<div class="twitter-embed">
        <blockquote class="twitter-tweet" data-theme="light">
          <a href="${url}">View Tweet</a>
        </blockquote>
      </div>`;
    }
  );

  // Convert Markdown to HTML
  content = markdownToHtml(content, contentData.meta?.title);
  // Process HTML images with optimization AFTER markdown conversion
  content = content.replace(
    /<img\s+src="([^"]+)"([^>]*)>/g,
    (_match, src, attrs) => {
      const optimizedSrc = getSizeOptimizedImageUrl(src, "md");
      const loading = attrs.includes("loading=") ? "" : ' loading="lazy"';
      const alt = attrs.includes("alt=")
        ? ""
        : ` alt="${contentData.meta?.title || "Image"}"`;
      return `<img src="${optimizedSrc}"${attrs}${loading}${alt} decoding="async">`;
    }
  );

  // Clean up extra newlines and formatting
  content = content.replace(/\n{3,}/g, "\n\n");

  return content;
}

/**
 * Convert Markdown to HTML
 * Simple markdown parser for common elements
 */
function markdownToHtml(markdown: string, defaultAlt = ""): string {
  const md = new MarkdownIt({
    html: true, // Enable HTML tags in source
    breaks: true, // Convert '\n' in paragraphs into <br>
    linkify: true, // Autoconvert URL-like text to links
  });

  // Add custom rule for images
  const defaultRender =
    md.renderer.rules.image ||
    function (tokens, idx, options, _, renderer) {
      return renderer.renderToken(tokens, idx, options);
    };

  md.renderer.rules.image = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const altIndex = token.attrIndex("alt");

    if (altIndex < 0) {
      token.attrPush(["alt", defaultAlt || ""]);
    }

    token.attrPush(["loading", "lazy"]);
    token.attrPush(["decoding", "async"]);

    return defaultRender(tokens, idx, options, env, renderer);
  };

  // Add target="_blank" to external links
  md.renderer.rules.link_open = function (tokens, idx, options, _, renderer) {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex("href");

    if (hrefIndex >= 0) {
      token.attrPush(["target", "_blank"]);
      token.attrPush(["rel", "noopener noreferrer"]);
    }

    return renderer.renderToken(tokens, idx, options);
  };

  return md.render(markdown);
}

// Helper functions for extracting video IDs
function extractTiktokVideoId(url: string): string {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : "";
}

function extractYoutubeVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : "";
}
