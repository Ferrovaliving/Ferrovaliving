import type { Metadata } from "next";
import { SiteEditor } from "../../../components/SiteEditor";
import { readContent } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Site content" };

export default async function Page() {
  return <SiteEditor initial={await readContent()} />;
}
