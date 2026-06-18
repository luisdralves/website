import { giteaProfileUrl, githubProfileUrl, projects } from "@/content/projects";
import { Outro } from "./outro";
import { ProjectsStage } from "./projects-stage";

export const Projects = () => {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative">
      <h2 id="projects-heading" className="sr-only">
        Projects
      </h2>
      <ProjectsStage projects={projects} />
      <Outro profileUrls={[githubProfileUrl, giteaProfileUrl]} />
    </section>
  );
};
