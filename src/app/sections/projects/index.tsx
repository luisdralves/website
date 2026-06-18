import { giteaProfileUrl, githubProfileUrl, projects } from "@/content/projects";
import { Outro } from "./outro";
import { ProjectsStage } from "./projects-stage";

export const Projects = () => {
  return (
    <section id="projects" className="relative">
      <ProjectsStage projects={projects} />
      <Outro profileUrls={[githubProfileUrl, giteaProfileUrl]} />
    </section>
  );
};
