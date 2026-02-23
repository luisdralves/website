"use client";

import { useEffect, useState } from "react";

export const SECTION_IDS = [
  "landing",
  "about",
  "projects",
  "travel",
  "photography",
  "footer",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  landing: "Landing",
  about: "About",
  projects: "Projects",
  travel: "Travel",
  photography: "Photography",
  footer: "Footer",
};

export const useActiveSection = (): SectionId => {
  const [activeSection, setActiveSection] = useState<SectionId>("landing");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const sectionId of SECTION_IDS) {
      const element = document.getElementById(sectionId);
      if (!element) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveSection(sectionId);
            }
          }
        },
        {
          // -50% top and bottom = detect when section crosses viewport center
          rootMargin: "-50% 0px -50% 0px",
          threshold: 0,
        },
      );

      observer.observe(element);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, []);

  return activeSection;
};
