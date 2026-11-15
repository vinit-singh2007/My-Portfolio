import type { Metadata } from "next";
import KaldurgBlog from "./KaldurgBlog";

export const metadata: Metadata = {
  title: "Sitting on the edge of Kaldurg",
  description:
    "A morning trek to Kaldurg Fort in Palghar, and why I came down quieter than I went up.",
};

export default function Page() {
  return <KaldurgBlog />;
}
