import type { Metadata } from "next";
import { ClinicsPage } from "@/components/pages/ClinicsPage";

export const metadata: Metadata = {
  title: "Daygo klinikoms — Jūsų pacientai tarp vizitų",
  description:
    "Daygo sujungia privačias klinikas su jų pacientais tarp vizitų: išmaniųjų laikrodžių ir tyrimų duomenys viename gydytojo vaizde, pakartotiniai tyrimai ir planai siunčiami tiesiai į paciento programėlę.",
  alternates: { canonical: "https://daygo.ai/lt/clinics", languages: { en: "https://daygo.ai/clinics", lt: "https://daygo.ai/lt/clinics" } },
};

export default function Page() {
  return <ClinicsPage lang="lt" />;
}
