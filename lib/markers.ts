export type Marker = {
  slug: string;
  name: string;
  category: string;
  /** Matches the exact reference range used in the app (BiomarkerEntry.swift) */
  range: string;
  interpretation: "Lower is generally better" | "Higher is generally better" | "A range, not a direction";
  summary: string;
  reading: string;
  mayHelp: string[];
  whenToTalkToDoctor: string;
  source: { org: string; url: string };
};

// Content mirrors the app's own biomarker interpretation logic
// (BiomarkerEntry.swift) and citation list (SourcesView.swift) — kept in
// sync deliberately so the website never claims something the app itself
// doesn't already stand behind.
export const markers: Marker[] = [
  {
    slug: "vitamin-d",
    name: "Vitamin D",
    category: "Vitamins",
    range: "30–60 ng/mL",
    interpretation: "A range, not a direction",
    summary:
      "Vitamin D helps your body absorb calcium (bone health) and plays a role in immune function. Your body makes it from sun exposure on skin, and it's also in some foods and supplements.",
    reading:
      "This app uses 30–60 ng/mL as the target range — the stricter of two common clinical thresholds (the Endocrine Society uses 30 as the cutoff for sufficiency; the Institute of Medicine uses 20). If your result sits between 20 and 30, some clinicians would call that sufficient and others wouldn't — it's a genuinely contested threshold, not a settled number.",
    mayHelp: [
      "10–30 minutes of midday sun on bare skin, several times a week (varies a lot by latitude, season, and skin tone)",
      "Fatty fish (salmon, mackerel, sardines), egg yolks, and fortified foods (milk, cereal)",
      "A vitamin D3 supplement — this is one of the few vitamins where supplementation is genuinely common and well-studied, especially at higher latitudes or in winter",
    ],
    whenToTalkToDoctor:
      "If your level is well below 20 ng/mL, or you have symptoms like bone pain or muscle weakness — a doctor can advise on dosing, since too much vitamin D (from supplements, not sun) can cause its own problems.",
    source: { org: "MedlinePlus (NIH)", url: "https://medlineplus.gov/laboratorytests.html" },
  },
  {
    slug: "ldl-cholesterol",
    name: "LDL Cholesterol",
    category: "Lipids",
    range: "Under 100 mg/dL",
    interpretation: "Lower is generally better",
    summary:
      "LDL is often called \"bad\" cholesterol because it can build up in artery walls over time, which is linked to heart disease risk. Unlike most lab values, there's no healthy floor — lower is better, all the way down.",
    reading:
      "Under 100 mg/dL is the standard \"optimal\" reference range for most adults. If you have existing heart disease or diabetes, your actual target may be lower (some guidelines go as low as 70) — that's set by a clinician based on your overall risk, not a universal number.",
    mayHelp: [
      "Reducing saturated fat (fatty meat, butter, full-fat dairy) and replacing it with unsaturated fats (olive oil, nuts, fish)",
      "Soluble fiber — oats, beans, apples — which binds cholesterol in the gut",
      "Regular aerobic exercise, which tends to raise HDL and can modestly lower LDL",
    ],
    whenToTalkToDoctor:
      "If your LDL is significantly elevated, especially alongside other risk factors (family history, high blood pressure, smoking) — statins and other medications are a real, well-studied option a doctor can discuss.",
    source: { org: "American Heart Association", url: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates" },
  },
  {
    slug: "hdl-cholesterol",
    name: "HDL Cholesterol",
    category: "Lipids",
    range: "40–80 mg/dL",
    interpretation: "Higher is generally better",
    summary:
      "HDL is often called \"good\" cholesterol — it helps carry excess cholesterol away from artery walls back to the liver. Unlike LDL, higher HDL is generally protective, not a warning sign.",
    reading:
      "40–80 mg/dL is the typical adult range; below 40 is considered a risk factor for heart disease on its own, independent of your other numbers.",
    mayHelp: [
      "Regular aerobic exercise — one of the most reliable ways to raise HDL",
      "Replacing trans fats and refined carbs with unsaturated fats (olive oil, avocado, nuts)",
      "Quitting smoking, which measurably lowers HDL while you smoke",
    ],
    whenToTalkToDoctor:
      "If your HDL is persistently low despite lifestyle changes, or low alongside high LDL/triglycerides — worth a broader conversation about cardiovascular risk, not just this one number.",
    source: { org: "American Heart Association", url: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates" },
  },
  {
    slug: "egfr",
    name: "eGFR (Kidney Function)",
    category: "Kidney",
    range: "90 and above",
    interpretation: "Higher is generally better",
    summary:
      "eGFR (estimated Glomerular Filtration Rate) estimates how well your kidneys filter waste from your blood. It's calculated from a creatinine blood test plus your age and sex — not measured directly.",
    reading:
      "90 and above is considered normal, with no meaningful upper ceiling — a healthy kidney doesn't have a \"too good\" filtration rate. There's no such thing as an eGFR that's abnormally high; if you see a number well above 90, that's not a concern on its own.",
    mayHelp: [
      "Staying well-hydrated and managing blood pressure — chronically high blood pressure is one of the most common causes of declining kidney function over time",
      "Limiting NSAID painkillers (ibuprofen, naproxen) if used frequently, since they can stress the kidneys",
      "Managing blood sugar if you have diabetes — diabetes is the other leading cause of kidney decline",
    ],
    whenToTalkToDoctor:
      "If your eGFR is below 60, especially on more than one test — that's the threshold clinicians use to start investigating chronic kidney disease.",
    source: { org: "MedlinePlus (NIH)", url: "https://medlineplus.gov/laboratorytests.html" },
  },
  {
    slug: "resting-heart-rate",
    name: "Resting Heart Rate",
    category: "Vitals",
    range: "50–80 bpm",
    interpretation: "A range, not a direction",
    summary:
      "Resting heart rate is how many times your heart beats per minute while you're calm and inactive — a simple, well-studied signal of cardiovascular fitness and recovery.",
    reading:
      "50–80 bpm covers the general adult range. Well-trained endurance athletes often sit well below 50, which is normal for them, not concerning — resting heart rate trends over time (for you specifically) tend to matter more than a single number compared to a population average.",
    mayHelp: [
      "Regular aerobic exercise — one of the most reliable ways to lower resting heart rate over weeks to months as your heart gets more efficient",
      "Consistent sleep and stress management — poor sleep and chronic stress both tend to push resting heart rate up",
      "Tracking your own trend over time rather than comparing to a generic range, since your personal baseline is what actually signals overtraining, illness, or recovery",
    ],
    whenToTalkToDoctor:
      "If your resting heart rate is consistently above 100 (tachycardia) or below 50 without an athletic background, or comes with symptoms like dizziness or shortness of breath.",
    source: { org: "American Heart Association", url: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates" },
  },
  {
    slug: "hba1c",
    name: "HbA1c",
    category: "Metabolic",
    range: "4.0–5.6%",
    interpretation: "Lower is generally better",
    summary:
      "HbA1c reflects your average blood sugar over the past 2–3 months, not a single moment — it's the standard screening test for prediabetes and diabetes precisely because it can't be skewed by what you ate that morning.",
    reading:
      "4.0–5.6% is the normal range. 5.7–6.4% is generally classified as prediabetes, and 6.5% or above as diabetes — these are the standard clinical cutoffs, not app-specific interpretations.",
    mayHelp: [
      "Reducing refined carbs and added sugar, and pairing carbs with protein/fiber to blunt blood sugar spikes",
      "Regular physical activity — muscles use blood sugar more efficiently after exercise, sometimes for up to 24–48 hours",
      "Weight management if applicable — even modest weight loss measurably improves insulin sensitivity for many people",
    ],
    whenToTalkToDoctor:
      "If your HbA1c is 5.7% or above — this is exactly the range where early lifestyle intervention has the most leverage, before it progresses further.",
    source: { org: "MedlinePlus (NIH)", url: "https://medlineplus.gov/laboratorytests.html" },
  },
];

export function getMarker(slug: string): Marker | undefined {
  return markers.find((m) => m.slug === slug);
}
