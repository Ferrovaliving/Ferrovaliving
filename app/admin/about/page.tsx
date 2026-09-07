import type { Metadata } from "next";
import { AboutEditor } from "../../../components/AboutEditor";
import { readContent } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "About content" };

export default async function Page() {
  return <AboutEditor initial={await readContent()} />;
}
