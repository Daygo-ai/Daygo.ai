import type { Marker } from "./markers";

// The second batch of marker pages: the most-searched markers the app
// already tracks. Ranges are the app's own (BiomarkerEntry.referenceRange);
// TSH and testosterone have no single app range, so their pages say so.
const MEDLINEPLUS = { org: "MedlinePlus (NIH)", url: "https://medlineplus.gov/laboratorytests.html" };

export const coreMarkers: Marker[] = [
  {
    slug: "ferritin",
    name: "Ferritin",
    category: "Iron",
    range: "30–300 ng/mL",
    interpretation: "A range, not a direction",
    summary:
      "Ferritin is the protein that stores iron, so your ferritin level is the best single blood marker of how much iron your body has in reserve. It often drops before hemoglobin does, which makes it an early warning for iron deficiency.",
    reading:
      "This app uses 30–300 ng/mL. Below 30 usually means your iron stores are low, even if your hemoglobin is still normal, and fatigue, poor exercise tolerance and hair shedding are common at that point. Ferritin also rises with inflammation or infection, so a normal or high value can hide low iron when CRP is raised at the same time.",
    mayHelp: [
      "Iron-rich foods: red meat, shellfish, lentils, beans and dark leafy greens",
      "Pairing plant iron with vitamin C (citrus, peppers) and keeping tea and coffee away from iron-rich meals",
      "An iron supplement, but only after a test confirms low iron, since too much iron is harmful",
    ],
    whenToTalkToDoctor:
      "If ferritin is below 30 with symptoms, or above 300, especially if it keeps rising. Very high ferritin can point to inflammation, liver disease or iron overload (hemochromatosis).",
    source: MEDLINEPLUS,
  },
  {
    slug: "apob",
    name: "ApoB",
    category: "Lipids",
    range: "Under 90 mg/dL",
    interpretation: "Lower is generally better",
    summary:
      "ApoB (apolipoprotein B) counts the particles that carry cholesterol into artery walls. Each LDL, VLDL and Lp(a) particle carries exactly one ApoB, so it measures the number of potentially harmful particles rather than how much cholesterol they hold.",
    reading:
      "This app uses under 90 mg/dL. Many cardiologists see ApoB as a better predictor of heart risk than LDL, especially when the two disagree, which is common with high triglycerides, insulin resistance or diabetes. People at higher risk are often given lower targets.",
    mayHelp: [
      "Replacing saturated fat with unsaturated fats (olive oil, nuts, fish)",
      "More soluble fiber: oats, beans, lentils, psyllium",
      "Regular exercise and, if relevant, weight loss, which lower the triglyceride-rich particles ApoB also counts",
    ],
    whenToTalkToDoctor:
      "If ApoB is above 90, or high alongside a family history of early heart disease. Medication is a well-studied option when lifestyle changes aren't enough.",
    source: MEDLINEPLUS,
  },
  {
    slug: "lipoprotein-a",
    name: "Lipoprotein(a)",
    category: "Lipids",
    range: "Under 75 nmol/L",
    interpretation: "Lower is generally better",
    summary:
      "Lipoprotein(a), or Lp(a), is a cholesterol-carrying particle whose level is set almost entirely by your genes. A high Lp(a) raises heart attack and stroke risk independently of LDL, and about one in five people has it.",
    reading:
      "This app uses under 75 nmol/L. Because Lp(a) barely changes with diet or exercise, most people only need to measure it once in their life. A high result doesn't mean something is wrong today; it means your other risk factors deserve extra attention.",
    mayHelp: [
      "Lowering everything else you can: LDL or ApoB, blood pressure, smoking",
      "Telling close relatives, since Lp(a) runs in families",
      "Keeping an eye on research: several Lp(a)-lowering drugs are in late-stage trials",
    ],
    whenToTalkToDoctor:
      "If your Lp(a) is high, a doctor may aim for a lower LDL target to offset the extra risk, especially with a family history of early heart disease.",
    source: MEDLINEPLUS,
  },
  {
    slug: "tsh",
    name: "TSH",
    category: "Thyroid",
    range: "Your lab's range (commonly about 0.4–4.0 mIU/L)",
    interpretation: "A range, not a direction",
    summary:
      "TSH (thyroid-stimulating hormone) is the signal your brain sends to the thyroid. When the thyroid is underactive, TSH goes up to push it harder; when it's overactive, TSH falls. That makes TSH the standard first test for thyroid problems.",
    reading:
      "Labs use slightly different ranges, so Daygo shows the range printed on your own report. A high TSH suggests an underactive thyroid (hypothyroidism): tiredness, feeling cold, weight gain. A low TSH suggests an overactive one (hyperthyroidism): racing heart, weight loss, anxiety. Free T4 is usually checked next to confirm.",
    mayHelp: [
      "Testing at a similar time of day, since TSH is higher in the early morning",
      "Pausing biotin supplements a few days before the test, as biotin can distort thyroid results",
      "Making sure you get enough iodine and selenium through food, without high-dose supplements",
    ],
    whenToTalkToDoctor:
      "If TSH is outside your lab's range, or normal but you have clear thyroid symptoms. Thyroid conditions are common and very treatable.",
    source: MEDLINEPLUS,
  },
  {
    slug: "testosterone",
    name: "Testosterone",
    category: "Hormones",
    range: "Your lab's range (depends on sex and age)",
    interpretation: "A range, not a direction",
    summary:
      "Testosterone affects energy, muscle, bone density, mood and libido in both men and women. Levels vary a lot by sex, age and time of day, so a single number only means something next to the right reference range.",
    reading:
      "Daygo shows the range printed on your own report, because it differs by sex and lab. In men, levels are highest in the morning and can be lowered by poor sleep, excess weight, heavy drinking and very hard training. A low result is usually re-tested on a second morning before any conclusion.",
    mayHelp: [
      "Sleeping 7–9 hours: even one week of short sleep measurably lowers testosterone",
      "Strength training and losing excess body fat",
      "Testing between 7 and 10 am, when levels peak",
    ],
    whenToTalkToDoctor:
      "If two morning tests are low and you have symptoms like low energy, low libido or loss of muscle, or if a woman's level is high with irregular cycles or acne.",
    source: MEDLINEPLUS,
  },
  {
    slug: "triglycerides",
    name: "Triglycerides",
    category: "Lipids",
    range: "Under 150 mg/dL",
    interpretation: "Lower is generally better",
    summary:
      "Triglycerides are the main form of fat in your blood, used for energy. High levels are linked to heart disease and often travel with insulin resistance, excess sugar and alcohol.",
    reading:
      "Under 150 mg/dL is normal, 150–199 borderline high, and 200 or above high. Triglycerides react strongly to your last meal, so the test is most reliable after an overnight fast.",
    mayHelp: [
      "Cutting back on sugar, sweet drinks and refined carbs",
      "Drinking less alcohol, one of the strongest drivers of high triglycerides",
      "Regular exercise and oily fish (omega-3) a couple of times a week",
    ],
    whenToTalkToDoctor:
      "If triglycerides are above 200, or above 500, where the risk of pancreatitis also rises.",
    source: MEDLINEPLUS,
  },
  {
    slug: "vitamin-b12",
    name: "Vitamin B12",
    category: "Vitamins",
    range: "200–900 pg/mL",
    interpretation: "A range, not a direction",
    summary:
      "Vitamin B12 keeps your nerves and red blood cells healthy. It comes almost only from animal foods, so vegans, older adults and people taking metformin or acid-reducing drugs are most likely to run low.",
    reading:
      "This app uses 200–900 pg/mL. Values in the low-normal band (roughly 200–300) can still mean a mild deficiency, which doctors sometimes confirm with an extra test (methylmalonic acid). Tingling hands or feet, fatigue and poor memory are typical signs of low B12.",
    mayHelp: [
      "Meat, fish, eggs and dairy, or fortified foods if you eat plant-based",
      "A B12 supplement if you're vegan; it's cheap and well-absorbed",
      "Asking about absorption if you take metformin or acid-reducing medication long-term",
    ],
    whenToTalkToDoctor:
      "If B12 is below 200, or low-normal with symptoms like numbness, tingling or memory problems. Nerve damage from low B12 is preventable when caught early.",
    source: MEDLINEPLUS,
  },
  {
    slug: "crp",
    name: "CRP",
    category: "Inflammation",
    range: "Under 3 mg/L",
    interpretation: "Lower is generally better",
    summary:
      "CRP (C-reactive protein) is made by the liver when there's inflammation anywhere in the body. A high-sensitivity version (hs-CRP) picks up the low-grade, long-term inflammation linked to heart disease.",
    reading:
      "This app uses under 3 mg/L for CRP, and under 2 mg/L for hs-CRP. A cold, an injury or a hard workout can push CRP up for days, so one high reading is usually re-tested when you're well before reading anything into it.",
    mayHelp: [
      "Regular moderate exercise and enough sleep",
      "A diet rich in vegetables, fruit, fish and olive oil",
      "Losing excess weight and not smoking, both strongly tied to chronic inflammation",
    ],
    whenToTalkToDoctor:
      "If CRP stays high on repeat testing, or is very high (above 10), which usually points to an infection or inflammatory condition worth looking into.",
    source: MEDLINEPLUS,
  },
  {
    slug: "cortisol",
    name: "Cortisol",
    category: "Hormones",
    range: "5–25 mcg/dL (morning)",
    interpretation: "A range, not a direction",
    summary:
      "Cortisol is your main stress hormone. It peaks shortly after you wake up and falls through the day, helping control blood sugar, blood pressure and your response to stress.",
    reading:
      "This app uses 5–25 mcg/dL for a morning sample. Because cortisol swings so much during the day, the time of the test matters as much as the number. A single result rarely diagnoses anything; doctors use special tests when they suspect a real problem.",
    mayHelp: [
      "A steady sleep schedule: cortisol follows your body clock",
      "Morning daylight and regular exercise",
      "Managing chronic stress, with or without help",
    ],
    whenToTalkToDoctor:
      "If morning cortisol is clearly outside the range, or you have signs like unexplained weight gain with high blood pressure, or deep fatigue with dizziness and weight loss.",
    source: MEDLINEPLUS,
  },
  {
    slug: "fasting-insulin",
    name: "Fasting Insulin",
    category: "Metabolic",
    range: "2–25 mIU/mL",
    interpretation: "Lower is generally better",
    summary:
      "Insulin moves sugar from your blood into your cells. When cells stop responding well (insulin resistance), the body makes more insulin to compensate, often years before blood sugar or HbA1c rise.",
    reading:
      "This app uses 2–25 mIU/mL, the typical lab range. Many clinicians consider values in the upper part of that range an early sign of insulin resistance, especially alongside high triglycerides or weight around the waist. Combined with fasting glucose, it gives HOMA-IR.",
    mayHelp: [
      "Regular exercise, particularly strength training, which improves insulin sensitivity",
      "Fewer refined carbs and sugary drinks; more fiber and protein",
      "Enough sleep: even a few short nights reduce insulin sensitivity",
    ],
    whenToTalkToDoctor:
      "If fasting insulin is high, or high-normal with rising glucose, HbA1c or triglycerides. Insulin resistance is very reversible when caught early.",
    source: MEDLINEPLUS,
  },
  {
    slug: "alt",
    name: "ALT",
    category: "Liver",
    range: "7–56 U/L",
    interpretation: "A range, not a direction",
    summary:
      "ALT (alanine aminotransferase) is an enzyme found mainly in the liver. When liver cells are stressed or damaged, ALT leaks into the blood, which makes it the most liver-specific of the routine liver tests.",
    reading:
      "This app uses 7–56 U/L. Mildly raised ALT is common and most often linked to fatty liver, alcohol or medication. A hard workout can also raise it for a few days, since muscles contain some ALT too.",
    mayHelp: [
      "Drinking less alcohol",
      "Losing excess weight and cutting back on sugar, the main drivers of fatty liver",
      "Avoiding hard training for 2–3 days before the test",
    ],
    whenToTalkToDoctor:
      "If ALT stays above the range on repeat testing, or is several times the upper limit.",
    source: MEDLINEPLUS,
  },
  {
    slug: "ast",
    name: "AST",
    category: "Liver",
    range: "8–40 U/L",
    interpretation: "A range, not a direction",
    summary:
      "AST (aspartate aminotransferase) is an enzyme found in the liver, but also in muscles and the heart. It's read together with ALT to understand what's going on in the liver.",
    reading:
      "This app uses 8–40 U/L. Because muscles contain a lot of AST, it often rises after intense exercise, which is common in athletes. The ratio of AST to ALT gives doctors extra clues, for example about alcohol-related liver strain.",
    mayHelp: [
      "Skipping hard workouts for a few days before the test",
      "Limiting alcohol",
      "The same steps that protect the liver generally: healthy weight, less sugar",
    ],
    whenToTalkToDoctor:
      "If AST stays high on a repeat test taken after a few rest days, especially if ALT is high too.",
    source: MEDLINEPLUS,
  },
  {
    slug: "folate",
    name: "Folate",
    category: "Vitamins",
    range: "2–20 ng/mL",
    interpretation: "A range, not a direction",
    summary:
      "Folate (vitamin B9) is needed to make DNA and red blood cells. It's especially important before and during pregnancy, and low levels can cause anemia.",
    reading:
      "This app uses 2–20 ng/mL. Low folate often goes together with a poor diet or heavy drinking. It's usually checked alongside B12, because the two deficiencies cause similar anemia.",
    mayHelp: [
      "Leafy greens, beans, lentils, citrus and fortified grains",
      "Folic acid supplements if you're planning a pregnancy",
      "Drinking less alcohol, which blocks folate absorption",
    ],
    whenToTalkToDoctor:
      "If folate is low, or you're planning a pregnancy. Low folate is easy to correct.",
    source: MEDLINEPLUS,
  },
  {
    slug: "magnesium",
    name: "Magnesium",
    category: "Electrolytes",
    range: "1.6–2.6 mg/dL",
    interpretation: "A range, not a direction",
    summary:
      "Magnesium is involved in hundreds of processes, including muscle and nerve function, heart rhythm, sleep and blood sugar control.",
    reading:
      "This app uses 1.6–2.6 mg/dL. Most of your magnesium sits in bones and cells, not in the blood, so a normal blood level doesn't always mean your stores are full. Cramps, poor sleep and fatigue can hint at low magnesium.",
    mayHelp: [
      "Nuts, seeds, beans, whole grains, dark chocolate and leafy greens",
      "Being aware that heavy sweating, alcohol and some medications (diuretics, acid reducers) lower magnesium",
      "A supplement if your diet is low, keeping in mind that high doses can upset the stomach",
    ],
    whenToTalkToDoctor:
      "If magnesium is outside the range, or you have palpitations or muscle spasms. People with kidney problems should not take supplements without advice.",
    source: MEDLINEPLUS,
  },
  {
    slug: "serum-iron",
    name: "Serum Iron",
    category: "Iron",
    range: "60–170 mcg/dL",
    interpretation: "A range, not a direction",
    summary:
      "Serum iron is the amount of iron moving through your blood right now. It changes a lot during the day and after meals, so it's read together with ferritin and transferrin saturation.",
    reading:
      "This app uses 60–170 mcg/dL. On its own, serum iron can be misleading: it's higher in the morning and after iron-rich meals or supplements. Ferritin shows your stores; serum iron shows what's in transit.",
    mayHelp: [
      "Testing in the morning, fasted, with no iron supplement in the last 24 hours",
      "Iron-rich foods paired with vitamin C",
      "Reading it next to ferritin rather than alone",
    ],
    whenToTalkToDoctor:
      "If iron is low together with low ferritin, or high together with high transferrin saturation, which can point to iron overload.",
    source: MEDLINEPLUS,
  },
  {
    slug: "hemoglobin",
    name: "Hemoglobin",
    category: "Blood count",
    range: "12.0–17.5 g/dL",
    interpretation: "A range, not a direction",
    summary:
      "Hemoglobin is the protein in red blood cells that carries oxygen. Low hemoglobin is the definition of anemia, which shows up as tiredness, breathlessness and lower endurance.",
    reading:
      "This app uses 12.0–17.5 g/dL, which spans the usual ranges for women (lower) and men (higher). Endurance athletes sometimes run slightly lower because their blood volume expands. Iron, B12 and folate are the usual next tests when hemoglobin is low.",
    mayHelp: [
      "Enough iron, B12 and folate in your diet",
      "Checking ferritin: low iron stores are the most common cause of low hemoglobin",
      "Staying hydrated before the test, since dehydration can make hemoglobin look higher",
    ],
    whenToTalkToDoctor:
      "If hemoglobin is below the range, keeps falling, or is high, which can happen with dehydration, smoking, living at altitude or rarer blood conditions.",
    source: MEDLINEPLUS,
  },
  {
    slug: "free-t4",
    name: "Free T4",
    category: "Thyroid",
    range: "0.8–1.8 ng/dL",
    interpretation: "A range, not a direction",
    summary:
      "Free T4 is the main hormone your thyroid makes, in the form your body can use. It's usually checked alongside TSH to confirm whether the thyroid is under- or overactive.",
    reading:
      "This app uses 0.8–1.8 ng/dL. High TSH with low free T4 points to an underactive thyroid; low TSH with high free T4 to an overactive one. Biotin supplements can distort the result.",
    mayHelp: [
      "Stopping biotin for a few days before the test",
      "Taking thyroid medication consistently, at the same time each day, if you're on it",
      "Reading it next to TSH rather than alone",
    ],
    whenToTalkToDoctor:
      "If free T4 is outside the range, or TSH is abnormal at the same time.",
    source: MEDLINEPLUS,
  },
  {
    slug: "uric-acid",
    name: "Uric Acid",
    category: "Kidney",
    range: "3.5–7.2 mg/dL",
    interpretation: "A range, not a direction",
    summary:
      "Uric acid is a waste product from breaking down purines, found in meat, seafood, beer and sugary drinks. Too much can form crystals in the joints, which causes gout.",
    reading:
      "This app uses 3.5–7.2 mg/dL. High uric acid often goes along with high blood pressure, insulin resistance and kidney strain. Dehydration and very hard training can raise it temporarily.",
    mayHelp: [
      "Drinking enough water",
      "Less beer, spirits and sugary drinks, especially those sweetened with fructose",
      "Eating less red meat and organ meat",
    ],
    whenToTalkToDoctor:
      "If uric acid is high together with joint pain or swelling, or kidney stones.",
    source: MEDLINEPLUS,
  },
  {
    slug: "fasting-glucose",
    name: "Fasting Glucose",
    category: "Metabolic",
    range: "70–99 mg/dL",
    interpretation: "A range, not a direction",
    summary:
      "Fasting glucose is your blood sugar after at least 8 hours without food. It's one of the standard screening tests for prediabetes and diabetes.",
    reading:
      "70–99 mg/dL is normal. 100–125 mg/dL is classified as prediabetes and 126 or above, on two tests, as diabetes. A bad night's sleep, stress or illness can raise it for a day, so a single borderline result is usually repeated, often with HbA1c.",
    mayHelp: [
      "Regular exercise, including a short walk after meals",
      "Fewer refined carbs and sugary drinks",
      "Enough sleep and managing stress",
    ],
    whenToTalkToDoctor:
      "If fasting glucose is 100 or above, especially on more than one test.",
    source: MEDLINEPLUS,
  },
  {
    slug: "total-cholesterol",
    name: "Total Cholesterol",
    category: "Lipids",
    range: "125–200 mg/dL",
    interpretation: "A range, not a direction",
    summary:
      "Total cholesterol adds up all the cholesterol in your blood: LDL, HDL and the cholesterol in triglyceride-rich particles. It's a rough first look, not the full picture.",
    reading:
      "This app uses 125–200 mg/dL. Because it includes protective HDL, a high total can be fine if most of it is HDL, and a normal total can hide high LDL. LDL, HDL, triglycerides and ApoB tell you much more.",
    mayHelp: [
      "Replacing saturated fat with unsaturated fats",
      "More fiber from oats, beans and vegetables",
      "Regular exercise",
    ],
    whenToTalkToDoctor:
      "If total cholesterol is above 240, or LDL or ApoB is high, especially with a family history of heart disease.",
    source: MEDLINEPLUS,
  },
];
