import type { Metadata } from "next";
import { ClinicsPage } from "@/components/pages/ClinicsPage";

export const metadata: Metadata = {
  title: "Daygo for clinics — Your patients, between visits",
  description:
    "Daygo connects private clinics with their patients between visits: wearable and lab data in one clinician view, retests and plans sent straight to the patient's app.",
  alternates: { canonical: "https://daygo.ai/clinics", languages: { en: "https://daygo.ai/clinics", lt: "https://daygo.ai/lt/clinics" } },
};

export default function Page() {
  return <ClinicsPage lang="en" />;
}
