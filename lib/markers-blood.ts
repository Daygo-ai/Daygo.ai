import type { Marker } from "./markers";

// The third batch of marker pages: the full blood count, kidney function and
// electrolytes. Ranges are the app's own (BiomarkerEntry.referenceRange).
const MEDLINEPLUS = { org: "MedlinePlus (NIH)", url: "https://medlineplus.gov/laboratorytests.html" };
const CBC = { org: "MedlinePlus (NIH): Complete Blood Count", url: "https://medlineplus.gov/lab-tests/complete-blood-count-cbc/" };
const BMP = { org: "MedlinePlus (NIH): Basic Metabolic Panel", url: "https://medlineplus.gov/lab-tests/basic-metabolic-panel-bmp/" };

export const bloodMarkers: Marker[] = [
  // ── Full blood count ────────────────────────────────────────────────
  {
    slug: "white-blood-cells",
    name: "White Blood Cells (WBC)",
    category: "Blood count",
    range: "4.0–11.0 ×10³/µL",
    interpretation: "A range, not a direction",
    summary:
      "White blood cells are your immune system's working cells. The WBC count is the total of all of them, and it's one of the first numbers a doctor looks at on a complete blood count.",
    reading:
      "This app uses 4.0–11.0 thousand cells per microlitre. A raised count most often means your body is fighting an infection or inflammation, but hard exercise, stress, smoking and steroids can push it up too. A low count can follow a viral illness, and some medications lower it. The breakdown (neutrophils, lymphocytes and so on) usually says more than the total.",
    mayHelp: [
      "Repeating the test once you're well, since a recent cold or a hard workout the day before can shift the number",
      "Not smoking, which keeps the count chronically raised",
      "Enough sleep and protein, both of which the immune system relies on",
    ],
    whenToTalkToDoctor:
      "If your count is well outside the range, stays abnormal on a repeat test, or comes with fever, night sweats, weight loss or frequent infections.",
    source: CBC,
  },
  {
    slug: "red-blood-cells",
    name: "Red Blood Cells (RBC)",
    category: "Blood count",
    range: "4.0–5.5 M/µL",
    interpretation: "A range, not a direction",
    summary:
      "Red blood cells carry oxygen from your lungs to every tissue. The RBC count is how many of them are in a microlitre of blood, and it's read together with hemoglobin and hematocrit.",
    reading:
      "This app uses 4.0–5.5 million cells per microlitre; men usually sit higher than women. A low count is one sign of anemia (from low iron, B12 or folate, or blood loss). A high count can come from dehydration, living at altitude, smoking or testosterone therapy.",
    mayHelp: [
      "Iron, B12 and folate from food (meat, fish, eggs, legumes, leafy greens) if your count is low",
      "Drinking enough before the test, since dehydration makes the count look higher than it is",
      "Checking ferritin alongside it, because low iron stores show up before the RBC count drops",
    ],
    whenToTalkToDoctor:
      "If it's low with tiredness, breathlessness or pale skin, or high without an obvious reason like altitude or dehydration.",
    source: CBC,
  },
  {
    slug: "hematocrit",
    name: "Hematocrit",
    category: "Blood count",
    range: "38–50%",
    interpretation: "A range, not a direction",
    summary:
      "Hematocrit is the share of your blood volume made up of red blood cells. It moves together with hemoglobin, so the two are almost always read side by side.",
    reading:
      "This app uses 38–50%. Below the range points to anemia or recent blood loss. Above it often just means you were dehydrated when the sample was taken, though altitude, smoking, sleep apnea and testosterone therapy can raise it too.",
    mayHelp: [
      "Being well hydrated on test day for a fair reading",
      "Correcting low iron, B12 or folate if your hematocrit is low",
      "If you use testosterone, having hematocrit checked regularly, since that is a known side effect",
    ],
    whenToTalkToDoctor:
      "If it's below 35% or above about 52%, or keeps climbing on repeat tests, since very thick blood raises the risk of clots.",
    source: CBC,
  },
  {
    slug: "mcv",
    name: "MCV (Mean Corpuscular Volume)",
    category: "Blood count",
    range: "80–100 fL",
    interpretation: "A range, not a direction",
    summary:
      "MCV is the average size of your red blood cells. It's the most useful clue to why someone is anemic, because different causes make the cells smaller or larger.",
    reading:
      "This app uses 80–100 femtolitres. Small cells (low MCV) most often mean iron deficiency; some inherited conditions like thalassemia trait do it too. Large cells (high MCV) point to low B12 or folate, regular alcohol use, thyroid or liver issues, or certain medications.",
    mayHelp: [
      "Iron-rich foods, with vitamin C, if MCV is low and ferritin confirms low iron",
      "B12 (meat, fish, dairy, or a supplement on a vegan diet) and folate (greens, legumes) if MCV is high",
      "Cutting back on alcohol, which enlarges red cells over time",
    ],
    whenToTalkToDoctor:
      "If MCV is outside the range, especially alongside low hemoglobin. The cause decides the treatment, so it's worth testing iron, B12 and folate rather than guessing.",
    source: CBC,
  },
  {
    slug: "mch",
    name: "MCH (Mean Corpuscular Hemoglobin)",
    category: "Blood count",
    range: "27–33 pg",
    interpretation: "A range, not a direction",
    summary:
      "MCH is the average amount of hemoglobin inside each red blood cell. It tracks closely with MCV: smaller cells carry less hemoglobin, larger cells carry more.",
    reading:
      "This app uses 27–33 picograms. A low MCH usually goes with iron deficiency. A high MCH usually goes with large cells from low B12 or folate. On its own, MCH rarely tells you more than MCV and hemoglobin already do.",
    mayHelp: [
      "Reading it together with MCV and ferritin rather than on its own",
      "Iron, B12 and folate from food or supplements, depending on which direction it's off",
    ],
    whenToTalkToDoctor:
      "If it's off together with low hemoglobin or an abnormal MCV, which together suggest anemia worth investigating.",
    source: CBC,
  },
  {
    slug: "mchc",
    name: "MCHC",
    category: "Blood count",
    range: "33–36 g/dL",
    interpretation: "A range, not a direction",
    summary:
      "MCHC is how concentrated the hemoglobin is inside your red blood cells. Where MCH is the amount per cell, MCHC is the amount relative to the cell's size.",
    reading:
      "This app uses 33–36 g/dL. A low MCHC means paler cells, most often from iron deficiency. A high MCHC is uncommon and can be a lab artifact (a clotted or lipemic sample) or a sign of a rare red cell shape disorder.",
    mayHelp: [
      "Checking iron and ferritin if MCHC is low",
      "Repeating the test if MCHC is high with no other abnormal results, since sample problems are a common cause",
    ],
    whenToTalkToDoctor:
      "If a high MCHC repeats, or a low MCHC comes with low hemoglobin and symptoms like tiredness.",
    source: CBC,
  },
  {
    slug: "rdw",
    name: "RDW (Red Cell Distribution Width)",
    category: "Blood count",
    range: "11.5–14.5%",
    interpretation: "Lower is generally better",
    summary:
      "RDW measures how much your red blood cells vary in size. Healthy blood has cells of a fairly even size, so a wide spread is a sign that something is affecting how they're made.",
    reading:
      "This app uses 11.5–14.5%. A high RDW often appears early in iron, B12 or folate deficiency, sometimes before hemoglobin drops. It also rises with age, inflammation and after blood loss or a transfusion. A low RDW isn't a concern.",
    mayHelp: [
      "Testing ferritin, B12 and folate to find the cause",
      "Treating the underlying deficiency, after which RDW normalises over a few months as new cells replace old ones",
    ],
    whenToTalkToDoctor:
      "If RDW is high together with an abnormal hemoglobin or MCV, or stays high without a clear reason.",
    source: CBC,
  },
  {
    slug: "platelets",
    name: "Platelets",
    category: "Blood count",
    range: "150–400 ×10³/µL",
    interpretation: "A range, not a direction",
    summary:
      "Platelets are small cell fragments that plug damaged blood vessels and start clotting. The platelet count shows whether you have enough to stop bleeding, and not so many that clots form too easily.",
    reading:
      "This app uses 150–400 thousand per microlitre. Mildly low counts can follow viral infections, heavy alcohol use or some medications. Raised counts are most often reactive: infection, inflammation, iron deficiency or recent surgery push them up temporarily.",
    mayHelp: [
      "Repeating the test after an illness, since both low and high counts often settle on their own",
      "Limiting alcohol, which suppresses platelet production",
      "Correcting iron deficiency, a common cause of a raised count",
    ],
    whenToTalkToDoctor:
      "If the count is below 100 or above 450, or you notice easy bruising, nosebleeds, bleeding gums or tiny red spots on the skin.",
    source: CBC,
  },
  {
    slug: "mpv",
    name: "MPV (Mean Platelet Volume)",
    category: "Blood count",
    range: "7.5–11.5 fL",
    interpretation: "A range, not a direction",
    summary:
      "MPV is the average size of your platelets. Young platelets are bigger, so MPV hints at whether your body is making platelets quickly or slowly.",
    reading:
      "This app uses 7.5–11.5 femtolitres. A high MPV with a low platelet count usually means platelets are being used up and replaced fast. A low MPV with a low count suggests the bone marrow is making fewer. On its own, MPV is a supporting number, not a diagnosis.",
    mayHelp: [
      "Reading it alongside your platelet count, which is where it's actually useful",
      "Repeating the test if it's the only abnormal result, since MPV varies between labs and sample handling",
    ],
    whenToTalkToDoctor:
      "Only together with an abnormal platelet count or bleeding symptoms. An isolated MPV change is rarely significant.",
    source: CBC,
  },
  {
    slug: "neutrophils",
    name: "Neutrophils",
    category: "Blood count",
    range: "40–70% · 1.5–7.7 ×10³/µL",
    interpretation: "A range, not a direction",
    summary:
      "Neutrophils are the most common white blood cells and the first responders to bacterial infection. Labs report them as a percentage of white cells and as an absolute count; the absolute count matters more.",
    reading:
      "This app uses 40–70%, or 1.5–7.7 thousand per microlitre. They rise with bacterial infection, inflammation, physical or emotional stress, hard exercise and steroids. Mildly low counts are common after viral infections and in some healthy people of African, Middle Eastern or Caribbean descent (benign ethnic neutropenia).",
    mayHelp: [
      "Repeating the test once you're well and rested",
      "Looking at the absolute count rather than the percentage, which shifts when other white cells change",
    ],
    whenToTalkToDoctor:
      "If the absolute count is below 1.0 or above 10, or you get frequent or unusually severe infections.",
    source: CBC,
  },
  {
    slug: "lymphocytes",
    name: "Lymphocytes",
    category: "Blood count",
    range: "20–40% · 1.0–4.0 ×10³/µL",
    interpretation: "A range, not a direction",
    summary:
      "Lymphocytes include T cells, B cells and natural killer cells, the part of the immune system that fights viruses and builds lasting immunity.",
    reading:
      "This app uses 20–40%, or 1.0–4.0 thousand per microlitre. They often rise during and after viral infections like colds, flu or mono. Low counts can follow intense stress, poor sleep, steroids, heavy training blocks or some infections.",
    mayHelp: [
      "Repeating the test a few weeks after an illness",
      "Prioritising sleep and recovery during hard training, both linked to healthy lymphocyte levels",
    ],
    whenToTalkToDoctor:
      "If the count is persistently high or low on repeat tests, or comes with swollen lymph nodes, night sweats or weight loss.",
    source: CBC,
  },
  {
    slug: "monocytes",
    name: "Monocytes",
    category: "Blood count",
    range: "2–10% · 0.1–0.9 ×10³/µL",
    interpretation: "A range, not a direction",
    summary:
      "Monocytes are large white blood cells that move into tissues and clean up dead cells and germs. They're a small share of your white cells, but they rise in longer-lasting infections and inflammation.",
    reading:
      "This app uses 2–10%, or 0.1–0.9 thousand per microlitre. A mild rise is common while recovering from an infection, and with chronic inflammation. Low monocytes on their own are rarely meaningful.",
    mayHelp: [
      "Retesting after you've recovered from any recent illness",
      "Looking at CRP alongside it to see whether there's ongoing inflammation",
    ],
    whenToTalkToDoctor:
      "If monocytes stay above the range for weeks without a clear reason, especially with other abnormal blood counts.",
    source: CBC,
  },
  {
    slug: "eosinophils",
    name: "Eosinophils",
    category: "Blood count",
    range: "0–6%",
    interpretation: "Lower is generally better",
    summary:
      "Eosinophils are white blood cells involved in allergic reactions and fighting parasites. Most people have only a few.",
    reading:
      "This app uses 0–6% of white cells. They commonly rise with hay fever, asthma, eczema and other allergies, and with some medications. Parasitic infections raise them too, which matters more after travel. A count of zero is normal.",
    mayHelp: [
      "Managing allergies and asthma, which usually brings a mild rise back down",
      "Mentioning recent travel or new medications to your doctor if the count is high",
    ],
    whenToTalkToDoctor:
      "If they're well above 6% (or above about 1.5 thousand per microlitre), or raised without a known allergy.",
    source: CBC,
  },
  {
    slug: "basophils",
    name: "Basophils",
    category: "Blood count",
    range: "0–2%",
    interpretation: "Lower is generally better",
    summary:
      "Basophils are the rarest white blood cells. They release histamine during allergic reactions.",
    reading:
      "This app uses 0–2% of white cells. A slight rise can come with allergies or an underactive thyroid. A count of zero is completely normal.",
    mayHelp: [
      "Nothing specific; basophils follow whatever is driving them, usually allergies",
    ],
    whenToTalkToDoctor:
      "If basophils are clearly raised on repeat tests together with other abnormal blood counts.",
    source: CBC,
  },

  // ── Kidney ──────────────────────────────────────────────────────────
  {
    slug: "creatinine",
    name: "Creatinine",
    category: "Kidney",
    range: "0.6–1.3 mg/dL",
    interpretation: "A range, not a direction",
    summary:
      "Creatinine is a waste product from normal muscle activity, filtered out by the kidneys. Because it's made at a steady rate, its blood level is the standard way to check kidney function, and it's used to calculate eGFR.",
    reading:
      "This app uses 0.6–1.3 mg/dL. Muscular people, men, and anyone who ate a lot of meat or trained hard before the test often sit near the top or slightly above without any kidney problem. Dehydration raises it too. Low creatinine usually just reflects lower muscle mass.",
    mayHelp: [
      "Being well hydrated and skipping hard exercise for a day before the test",
      "Avoiding a large meat meal the night before, and creatine supplements for a few days, if you want a clean baseline",
      "Looking at eGFR and the trend over time, which say more than one reading",
    ],
    whenToTalkToDoctor:
      "If creatinine is above the range on a repeat test, keeps rising over time, or your eGFR is below 60.",
    source: BMP,
  },
  {
    slug: "bun",
    name: "BUN (Blood Urea Nitrogen)",
    category: "Kidney",
    range: "7–20 mg/dL",
    interpretation: "A range, not a direction",
    summary:
      "BUN measures urea, the waste left when your body breaks down protein. The kidneys clear it, so BUN gives a rough view of kidney function and hydration.",
    reading:
      "This app uses 7–20 mg/dL. It rises with dehydration, a high-protein diet, intense training and some medications, as well as with reduced kidney function. A low BUN can come from a low-protein diet or overhydration and is rarely a concern.",
    mayHelp: [
      "Drinking enough fluid before the test",
      "Reading it with creatinine and the BUN/creatinine ratio, which helps tell dehydration apart from kidney issues",
    ],
    whenToTalkToDoctor:
      "If BUN is high together with high creatinine or a low eGFR, or stays high after you're well hydrated.",
    source: BMP,
  },
  {
    slug: "bun-creatinine-ratio",
    name: "BUN/Creatinine Ratio",
    category: "Kidney",
    range: "10–20",
    interpretation: "A range, not a direction",
    summary:
      "The BUN/creatinine ratio compares the two main kidney waste markers. It helps work out why one of them is abnormal, rather than measuring kidney function directly.",
    reading:
      "This app uses 10–20. A high ratio most often means dehydration, a very high protein intake, or bleeding in the upper gut. A low ratio can come with a low-protein diet or liver issues. If both BUN and creatinine are normal, the ratio rarely matters.",
    mayHelp: [
      "Hydrating well and retesting if the ratio is high",
      "Thinking about your protein intake in the days before the test",
    ],
    whenToTalkToDoctor:
      "If the ratio is abnormal together with an abnormal BUN or creatinine.",
    source: BMP,
  },

  // ── Electrolytes ────────────────────────────────────────────────────
  {
    slug: "sodium",
    name: "Sodium",
    category: "Electrolytes",
    range: "135–145 mmol/L",
    interpretation: "A range, not a direction",
    summary:
      "Sodium controls the balance of water inside and outside your cells and is essential for nerves and muscles. Your blood sodium reflects your water balance more than how much salt you eat.",
    reading:
      "This app uses 135–145 mmol/L. Low sodium can come from drinking a lot of water during long endurance events, heavy sweating, vomiting or diarrhea, and some medications (especially diuretics and antidepressants). High sodium nearly always means you were short on water.",
    mayHelp: [
      "During long runs or races, using drinks with electrolytes and drinking to thirst rather than as much as possible",
      "Replacing salt and fluid after heavy sweating or illness",
    ],
    whenToTalkToDoctor:
      "If sodium is below 130 or above 150, or you have headache, confusion, nausea or muscle cramps with an abnormal result. Very low sodium after endurance events is a medical emergency.",
    source: BMP,
  },
  {
    slug: "potassium",
    name: "Potassium",
    category: "Electrolytes",
    range: "3.5–5.0 mmol/L",
    interpretation: "A range, not a direction",
    summary:
      "Potassium keeps your heart rhythm, muscles and nerves working. Your body keeps it in a tight range, because both too little and too much affect the heart.",
    reading:
      "This app uses 3.5–5.0 mmol/L. Low potassium is common with vomiting, diarrhea, heavy sweating and diuretics. High results are often false: if the blood sample was hard to draw or sat too long, cells break and release potassium. A real high is usually linked to kidney function or medications like ACE inhibitors.",
    mayHelp: [
      "Potassium-rich foods if it's low: potatoes, beans, bananas, spinach, avocado, yogurt",
      "Retesting quickly if it's high with no other explanation, in case the sample was damaged",
      "Taking potassium supplements only on a doctor's advice",
    ],
    whenToTalkToDoctor:
      "If potassium is below 3.0 or above 5.5, or you notice palpitations or muscle weakness. A confirmed high level needs prompt attention.",
    source: BMP,
  },
  {
    slug: "chloride",
    name: "Chloride",
    category: "Electrolytes",
    range: "96–106 mmol/L",
    interpretation: "A range, not a direction",
    summary:
      "Chloride works alongside sodium to keep fluid balance and your blood's acid level in check. It usually moves in the same direction as sodium.",
    reading:
      "This app uses 96–106 mmol/L. High chloride most often goes with dehydration, low chloride with prolonged vomiting or diuretic use. On its own, chloride is rarely the number that matters; doctors read it with sodium and bicarbonate.",
    mayHelp: [
      "Staying hydrated and replacing fluids after illness",
      "Reading it alongside sodium and bicarbonate rather than alone",
    ],
    whenToTalkToDoctor:
      "If chloride is out of range together with abnormal sodium or bicarbonate.",
    source: BMP,
  },
  {
    slug: "bicarbonate",
    name: "Bicarbonate (CO₂)",
    category: "Electrolytes",
    range: "21–31 mmol/L",
    interpretation: "A range, not a direction",
    summary:
      "Bicarbonate, often listed as CO₂ or total CO₂ on lab reports, is the main buffer that keeps your blood from becoming too acidic or too alkaline.",
    reading:
      "This app uses 21–31 mmol/L. A low value means the blood is leaning acidic, which can come with kidney issues, severe diarrhea, uncontrolled diabetes or very intense exercise. A high value can follow vomiting, diuretics, or lung conditions that hold on to carbon dioxide.",
    mayHelp: [
      "Retesting at rest if you trained hard right before the blood draw",
      "Staying hydrated, especially during illness",
    ],
    whenToTalkToDoctor:
      "If it's outside the range on a repeat test, or comes with fast breathing, confusion or high blood sugar.",
    source: BMP,
  },
  {
    slug: "calcium",
    name: "Calcium",
    category: "Electrolytes",
    range: "8.5–10.5 mg/dL",
    interpretation: "A range, not a direction",
    summary:
      "Calcium in the blood is needed for nerves, muscle contraction and the heartbeat. Blood levels are tightly controlled by parathyroid hormone and vitamin D, so they don't reflect bone calcium or diet very well.",
    reading:
      "This app uses 8.5–10.5 mg/dL. About half of blood calcium is carried by albumin, so a low albumin makes calcium look falsely low. A high calcium on repeat tests is most often caused by an overactive parathyroid gland, or by too much vitamin D from supplements.",
    mayHelp: [
      "Calcium from food (dairy, fortified plant milks, tinned fish with bones, leafy greens) rather than high-dose supplements",
      "Checking vitamin D and albumin alongside it",
      "Avoiding very high-dose vitamin D supplements without testing",
    ],
    whenToTalkToDoctor:
      "If calcium is above 10.5 on a repeat test, or you have muscle cramps, tingling, unusual thirst or kidney stones with an abnormal result.",
    source: BMP,
  },
  {
    slug: "phosphate",
    name: "Phosphate",
    category: "Electrolytes",
    range: "2.5–4.5 mg/dL",
    interpretation: "A range, not a direction",
    summary:
      "Phosphate works with calcium to build bones and teeth, and it's part of how every cell stores and uses energy. The kidneys keep its blood level in balance.",
    reading:
      "This app uses 2.5–4.5 mg/dL. Mildly high phosphate is normal in teenagers and can follow a very recent meal. Persistently high phosphate is most often linked to reduced kidney function. Low phosphate can come with poor nutrition, heavy alcohol use or some antacids.",
    mayHelp: [
      "Testing fasting, since a recent meal can raise it",
      "A varied diet with enough protein; phosphate is found in meat, dairy, nuts and whole grains",
    ],
    whenToTalkToDoctor:
      "If it's abnormal together with an abnormal calcium, creatinine or eGFR.",
    source: MEDLINEPLUS,
  },
];
