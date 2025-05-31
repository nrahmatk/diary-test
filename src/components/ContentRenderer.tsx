import { createElement, memo, useMemo } from "react";
import OptimizedImage from "./OptimizedImage";
import { renderDiaryContent } from "../utils/cms";
import type { DiaryContent } from "../types";

interface ContentRendererProps {
  content: string;
  title?: string;
  className?: string;
}

const ContentRenderer = memo(function ContentRenderer({
  content,
  title,
}: ContentRendererProps) {
  const renderedContent = useMemo(() => {
    const diaryContent: DiaryContent = {
      id: "temp",
      content,
      created_by: null,
      created_dt: new Date().toISOString(),
      status: "published",
      meta: {
        title: title || "Untitled",
        type: "article",
        language: "id-id",
        description: "",
      },
    };
    return renderDiaryContent(diaryContent);
  }, [content, title]);

  const processedHTML = useMemo(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = renderedContent;

    const images = tempDiv.querySelectorAll("img");
    images.forEach((img, index) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `<div data-image-component="${index}" data-image-src="${
        img.src
      }" data-image-alt="${img.alt || ""}"></div>`;
      img.parentNode?.replaceChild(wrapper, img);
    });

    const embeds = tempDiv.querySelectorAll(
      ".tiktok-embed, .youtube-embed, .instagram-embed, .twitter-embed"
    );
    embeds.forEach((embed) => {
      embed.classList.add("my-6", "rounded-lg", "overflow-hidden", "shadow-sm");
    });
    const iframes = tempDiv.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.setAttribute("loading", "lazy");
    });

    return tempDiv.innerHTML;
  }, [renderedContent]);

  const parseHTMLWithComponents = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const body = doc.body;

    const elements: React.ReactNode[] = [];
    let elementIndex = 0;

    const processNode = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;

        if (element.hasAttribute("data-image-component")) {
          const src = element.getAttribute("data-image-src") || "";
          const alt = element.getAttribute("data-image-alt") || "";
          const componentIndex =
            element.getAttribute("data-image-component") || "";
          return (
            <div
              key={`image-${componentIndex}`}
              className="my-4 rounded-lg overflow-hidden"
            >
              <OptimizedImage
                src={src}
                alt={alt}
                size="md"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          );
        }
        const tagName = element.tagName.toLowerCase();
        const props: Record<string, any> = { key: elementIndex++ };
        Array.from(element.attributes).forEach((attr) => {
          if (attr.name === "class") {
            props.className = attr.value;
          } else if (attr.name === "style") {
            const styleObj: Record<string, string> = {};
            attr.value.split(";").forEach((style) => {
              const [property, value] = style.split(":").map((s) => s.trim());
              if (property && value) {
                const camelProperty = property.replace(
                  /-([a-z])/g,
                  (_, letter) => letter.toUpperCase()
                );
                styleObj[camelProperty] = value;
              }
            });
            props.style = styleObj;
          } else if (attr.name.startsWith("data-")) {
            props[attr.name] = attr.value;
          } else {
            props[attr.name] = attr.value;
          }
        });

        const children = Array.from(element.childNodes).map(processNode);

        return createElement(tagName, props, ...children);
      }

      return null;
    };

    Array.from(body.childNodes).forEach((node) => {
      const element = processNode(node);
      if (element) {
        elements.push(element);
      }
    });

    return elements;
  };

  const parsedContent = useMemo(() => {
    return parseHTMLWithComponents(processedHTML);
  }, [processedHTML]);

  return (
    <div className="prose prose-lg max-w-none">
      <div>{parsedContent}</div>
    </div>
  );
});

export default ContentRenderer;
