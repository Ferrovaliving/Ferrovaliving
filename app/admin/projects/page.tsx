import type { Metadata } from "next";
import { ProjectsEditor } from "../../../components/ProjectsEditor";
import { readContent } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects" };

export default async function Page() {
  return <ProjectsEditor initial={await readContent()} />;
}
