import type { Metadata } from "next";
import { TestimonialsEditor } from "../../../components/TestimonialsEditor";
import { readContent } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Testimonials" };

export default async function Page() {
  return <TestimonialsEditor initial={await readContent()} />;
}
