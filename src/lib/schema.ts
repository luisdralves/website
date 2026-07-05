import type { Graph, Person, ProfilePage, SoftwareApplication, WebSite } from "schema-dts";
import { footer } from "@/content/footer";
import { person } from "@/content/person";
import { type Project, projects } from "@/content/projects";
import { SITE_CREATED, SITE_DESCRIPTION_OBJECTIVE, SITE_TITLE, SITE_URL } from "@/content/site";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const WEBPAGE_ID = `${SITE_URL}/#webpage`;

const sameAs = footer.socialLinks.map((link) => link.url).filter((url) => url.startsWith("http"));

const websiteNode: WebSite = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_TITLE,
  alternateName: [person.name, new URL(SITE_URL).hostname],
  description: SITE_DESCRIPTION_OBJECTIVE,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
  image: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#website-image`,
    url: `${SITE_URL}/og-image.png`,
    caption: person.name,
  },
};

const personNode: Person = {
  "@type": "Person",
  "@id": PERSON_ID,
  url: `${SITE_URL}/`,
  name: person.name,
  alternateName: person.alternateName,
  givenName: person.givenName,
  familyName: person.familyName,
  description: SITE_DESCRIPTION_OBJECTIVE,
  jobTitle: person.jobTitle,
  email: `mailto:${person.email}`,
  image: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#person-image`,
    url: person.image,
    caption: person.name,
  },
  knowsLanguage: person.knowsLanguage,
  knowsAbout: person.knowsAbout,
  nationality: { "@type": "Country", name: person.nationality },
  homeLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: person.homeLocation.locality,
      addressCountry: person.homeLocation.countryCode,
    },
  },
  worksFor: {
    "@type": "Organization",
    name: person.worksFor.name,
    url: person.worksFor.url,
    sameAs: person.worksFor.sameAs,
  },
  // I can't express how much it pains me to refer to myself (ourselves?) in the plural
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: person.alumnusOf.name,
    alternateName: person.alumnusOf.alternateName,
    url: person.alumnusOf.url,
    sameAs: person.alumnusOf.sameAs,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: person.alumnusOf.parentOrganization.name,
      url: person.alumnusOf.parentOrganization.url,
      sameAs: person.alumnusOf.parentOrganization.sameAs,
    },
  },
  memberOf: {
    "@type": "OrganizationRole",
    roleName: person.memberOf.role,
    memberOf: {
      "@type": "Organization",
      name: person.memberOf.name,
      alternateName: person.memberOf.alternateName,
      url: person.memberOf.url,
      sameAs: person.memberOf.sameAs,
    },
  },
  sameAs,
};

const profilePageNode: ProfilePage = {
  "@type": "ProfilePage",
  "@id": WEBPAGE_ID,
  url: `${SITE_URL}/`,
  name: `${SITE_TITLE} — ${person.name}`,
  isPartOf: { "@id": WEBSITE_ID },
  inLanguage: "en",
  dateCreated: SITE_CREATED,
  dateModified: new Date().toISOString(),
  about: { "@id": PERSON_ID },
  mainEntity: { "@id": PERSON_ID },
};

const softwareApplications = projects.map(
  (project: Project): SoftwareApplication => ({
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#project-${project.name}`,
    name: project.name,
    description: project.description,
    applicationCategory: project.liveUrl ? "WebApplication" : "DeveloperApplication",
    operatingSystem: project.os ?? (project.liveUrl && "Web browser"),
    ...(project.liveUrl && { url: project.liveUrl }),
    creator: { "@id": PERSON_ID },
    keywords: project.techStack.join(", "),
    ...(project.sources && { sameAs: project.sources.map((source) => source.url) }),
    isPartOf: { "@id": WEBSITE_ID },
  }),
);

export const graph: Graph = {
  "@context": "https://schema.org",
  "@graph": [websiteNode, personNode, profilePageNode, ...softwareApplications],
};
