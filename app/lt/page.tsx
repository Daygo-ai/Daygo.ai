import { HomePage } from "@/components/pages/HomePage";

export const metadata = {
  alternates: { canonical: "https://daygo.ai/lt", languages: { en: "https://daygo.ai", lt: "https://daygo.ai/lt" } },
};

export default function Page() {
  return <HomePage lang="lt" />;
}
