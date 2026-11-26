# Daygo — Privatumo politika

_Atnaujinta: 2026-11-25_
_Valdytojas: Marijus Dovydaitis („mes“, „mūsų“)_

> Tai privatumo politikos vertimas į lietuvių kalbą. Jei vertimas ir [originalas anglų kalba](/privacy) nesutampa, vadovaujamasi originalu anglų kalba.

## 1. Ką apima ši politika

Daygo yra asmeninės savijautos programėlė. Šioje politikoje paaiškinama, kokius asmens duomenis Daygo renka, kodėl, kur jie saugomi, kas juos gali matyti ir kokios yra jūsų teisės.

## 2. Kokius duomenis renkame

### 2.1 Duomenys, kuriuos pateikiate patys
- **Profilis**: amžius, lytis, pagrindinis tikslas, pasirinktinai ūgis, svoris, mitybos pastabos, miego režimas, laiko juosta.
- **Įrašai ir dienoraščiai**: nuotaika, maistas, socialinis gyvenimas, fizinis aktyvumas, simptomai, svoris, skysčių vartojimas, maisto papildai, vaistai, mėnesinės, kofeinas, alkoholis, badavimas, laisvos formos dienoraščio įrašai.
- **Nuotraukos ir failai**, kuriuos pridedate prie pokalbio žinučių (pvz., kraujo tyrimų nuotraukos). Jie analizei siunčiami į Anthropic Claude API ir mūsų serveriuose nesaugomi ilgiau, nei reikia užklausai įvykdyti.

### 2.2 Sveikatos ir išmaniųjų įrenginių duomenys
- Gavusi jūsų leidimą, Daygo jūsų įrenginyje skaito sveikatos duomenis iš **Apple Health (HealthKit)**: žingsnius ir aktyvumą, treniruotes, pulsą ir ramybės pulsą, širdies ritmo variabilumą, miegą (įskaitant miego fazes) ir pagrindines savybes (gimimo datą, biologinę lytį).
- Tai apima duomenis iš bet kurio įrenginio ar programėlės, rašančių į Apple Health – Apple Watch, Garmin, Fitbit, Whoop, Oura ir kitų.
- Iš Apple Health mes tik **skaitome**. Niekada į jį nerašome duomenų.
- Šį leidimą suteikiate aiškiai, kiekvienam duomenų tipui atskirai, ir galite bet kada jį atšaukti iOS nustatymuose → Privatumas ir saugumas → Sveikata.
- Iš HealthKit nuskaityti sveikatos duomenys lieka jūsų įrenginyje, nebent jų reikia DI atsakymui parengti – tokiu atveju aktuali jų dalis siunčiama į Anthropic Claude API (žr. 3 skyrių). HealthKit duomenų niekada nenaudojame reklamai ir niekada jų neparduodame bei neperduodame duomenų brokeriams.

### 2.3 Garmin Connect duomenys
- Jei pasirenkate **Prijungti Garmin** (įvedimo metu arba nustatymuose), prisijungiate Garmin puslapyje ir patys pasirenkate, kuo dalintis. Daygo niekada nemato jūsų Garmin slaptažodžio.
- Gavusi jūsų leidimą, Garmin mums siunčia: dienos suvestines (žingsniai, ramybės pulsas, stresas, Body Battery), miegą (trukmė, fazės ir jų laikas, miego balas), nakties širdies ritmo variabilumą ir jūsų veiklas (tipas, laikas, atstumas, trukmė, kalorijos, pulsas ir GPS maršrutas su pulsu jame).
- Kitaip nei Apple Health duomenys, Garmin duomenys pristatomi į mūsų serverius, todėl jie **saugomi mūsų Supabase duomenų bazėje** (ES), susieti su jūsų Daygo paskyra ir matomi tik jums.
- Juos naudojame tik tam, kad *jums* parodytume pasirengimą, grafikus, 3D maršrutų žemėlapius ir patarimus. Jie niekada neparduodami, neperduodami reklamuotojams ar duomenų brokeriams ir niekada nenaudojami DI modeliams mokyti ar tobulinti.
- Bet kada galite atsijungti nustatymuose → Garmin prijungtas. Atsijungus panaikinama Daygo prieiga prie Garmin ir **jūsų Garmin duomenys ištrinami iš Daygo**. Tas pats nutinka pašalinus Daygo savo Garmin Connect paskyroje.

### 2.4 Autentifikavimo duomenys
- Jei prisijungiate per Apple, gauname naudotojo identifikatorių ir (jei leidžiate) jūsų vardą bei privatų persiuntimo el. pašto adresą. Niekada negauname jūsų tikrojo Apple ID slaptažodžio.

### 2.5 Įrenginio ir diagnostikos duomenys
- Gamintojo lygio įrenginio identifikatorius (`identifierForVendor`), naudojamas užklausų dažniui riboti.
- Įrenginio tipas, OS versija ir programėlės versija, siunčiami strigčių ataskaitų sistemai (Sentry).
- Pranešimų (push) žetonas, jei leidžiate siųsti pranešimus.
- Programėlės naudojimo įvykiai, jei esate prisijungę: kokias programėlės dalis ir kada naudojate (pavyzdžiui: atidarėte programėlę, atidarėte pokalbį, paspaudėte siūlomą klausimą, nustatėte priminimą, atidarėte pranešimą), kartu su programėlės versija. Niekada ne sveikatos rodikliai ir niekada ne tai, ką rašote ar sakote.

### 2.6 Ko nerenkame
- Jokių reklamos identifikatorių. Jokių trečiųjų šalių sekiklių. Jokių analitikos SDK, kurie kurtų jūsų elgesio profilį (aukščiau minėti naudojimo įvykiai lieka mūsų pačių duomenų bazėje ir naudojami tik Daygo tobulinti). Jokios vietos informacijos, išskyrus jūsų laiko juostą.

## 3. Kaip naudojame jūsų duomenis

- **Programėlės veikimui.** Šiandienos įvertinimas, istorija, grafikai, priminimai.
- **DI patarimams generuoti.** Aktualią jūsų duomenų dalį siunčiame į Anthropic Claude API. Anthropic juos tvarko pagal savo komercines sąlygas ir nenaudoja savo modeliams mokyti.
- **Pranešimams siųsti.** Tik jei juos įjungėte.
- **Strigtims ir klaidoms diagnozuoti** naudojant Sentry.
- **Programėlei tobulinti.** Naudojimo įvykiai parodo, kokias funkcijas žmonės naudoja ir prie kurių grįžta. Tai grindžiama mūsų teisėtu interesu kurti naudingą produktą (BDAR 6 straipsnio 1 dalies f punktas); galite bet kada nesutikti parašę privacy@daygo.ai.

Jūsų duomenų neparduodame. Neperduodame jų reklamuotojams. Niekada nenaudojame jūsų duomenų, įskaitant Garmin ir Apple Health duomenis, DI modeliams mokyti ar tobulinti.

## 3a. DI skaidrumas

Daygo treneris yra dirbtinis intelektas, o ne žmogus ir ne gydytojas.
- **Ką jis mato:** kai su juo kalbatės arba jis rengia jūsų dienos apžvalgą, aktuali jūsų duomenų dalis – profilis, naujausi įrašai ir dienoraščio pastabos, miegas, HRV, pulsas, treniruotės, tyrimų rodikliai ir Garmin duomenys – siunčiama į Anthropic Claude API atsakymui parašyti.
- **Ką jis prisimena:** Daygo saugo sąrašą dalykų, kuriuos sužinojo apie jus iš jūsų pokalbių. Juos galite matyti, redaguoti ir ištrinti nustatymuose → Atmintis.
- **Jokio mokymo:** Anthropic šiuos duomenis tvarko pagal savo komercines sąlygas ir nenaudoja jų savo modeliams mokyti. Mes taip pat.
- **Jūsų pasirinkimas:** pradėdami naudotis treneriu sutinkate su DI duomenų tvarkymu. Sutikimą galite bet kada atšaukti nebenaudodami DI funkcijų ir ištrindami savo pokalbius bei atmintį arba ištrindami paskyrą. Įrašai, grafikai ir Apple Health ar Garmin duomenys toliau veikia ir be DI.
- DI atsakymai gali būti klaidingi. Jie nėra medicininis patarimas (žr. 9 skyrių).

## 4. Kur saugomi jūsų duomenys

- **Jūsų įrenginyje** pagal numatytuosius nustatymus (SwiftData, Keychain).
- **Mūsų Supabase projekte**, kai esate prisijungę: profilis, dienos įvertinimai, dienoraščiai, savaitės tikslai ir Garmin duomenys, jei prijungėte Garmin. Saugoma ES (AWS `eu-west-1`, Airija).
- **Perdavimo metu** į Anthropic API ir iš jo – DI funkcijoms. Anthropic užklausų duomenis saugo pagal savo komercinę sutartį ir jais nemoko modelių.
- **Apple Health duomenys** lieka jūsų įrenginyje. Juos skaitome vietoje ir perduodame tik konkrečias reikšmes, reikalingas DI atsakymui; jūsų sveikatos duomenų masiškai į savo serverius nekeliame.

### Kas tvarko jūsų duomenis

| Paslauga | Kam | Duomenys |
|---|---|---|
| Supabase | Duomenų bazė, prisijungimas, serverio funkcijos | Paskyra, įrašai, dienoraščiai, Garmin duomenys |
| Anthropic (Claude API) | DI trenerio atsakymai ir apžvalgos | Kiekvienam atsakymui reikalinga jūsų duomenų dalis |
| Garmin | Garmin duomenų šaltinis, tik jei jį prijungiate | Garmin siunčia duomenis mums; mes Garmin apie jus nieko nesiunčiame |
| Apple | Prisijungimas per Apple, pranešimai, HealthKit jūsų įrenginyje | Prisijungimo identifikatorius, pranešimų žetonas |
| Sentry | Strigčių ataskaitos | Įrenginio tipas, OS ir programėlės versija, strigties informacija |
| Vercel | daygo.ai svetainės talpinimas | Standartiniai interneto serverio žurnalai |

Kiekvienas jų tvarko jūsų duomenis tik tam, kad teiktų savo paslaugą Daygo.

## 5. Saugojimo terminai

- Paskyros duomenys: saugomi, kol ištrinate paskyrą, tada ištrinami per 30 dienų.
- Garmin duomenys: saugomi, kol Garmin prijungtas; ištrinami atjungus Garmin arba ištrynus paskyrą.
- Strigčių žurnalai: 90 dienų.
- Programėlės naudojimo įvykiai: 12 mėnesių, po to ištrinami.
- API užklausų / atsakymų žurnalai (užklausų dažnio ribojimas): 30 dienų.

## 6. Jūsų teisės

Jūs galite:
- Matyti ir eksportuoti viską, ką apie jus turime (programėlėje: Nustatymai → Eksportuoti PDF; arba parašę privacy@daygo.ai).
- Ištrinti savo paskyrą ir visus serveryje saugomus duomenis.
- Pataisyti tai, ką Daygo sužinojo apie jus (Nustatymai → Atmintis), arba paprašyti mūsų pataisyti kitus duomenis.
- Atjungti Garmin – tada jūsų Garmin duomenys ištrinami iš Daygo.
- Bet kada atšaukti sutikimą dėl DI ar sveikatos duomenų tvarkymo (žr. 3a skyrių).
- Išjungti bet kurią duomenų rinkimo rūšį (Apple Health prieigą, Garmin, pranešimus, strigčių ataskaitas).
- (ES / JK) Nesutikti su duomenų tvarkymu, prašyti jį apriboti arba pateikti skundą vietos priežiūros institucijai (Lietuvoje – Valstybinei duomenų apsaugos inspekcijai).
- (Kalifornija / JAV) Žinoti, ką renkame, prašyti ištrinti duomenis, atsisakyti duomenų „pardavimo“ ar „dalijimosi“ – mes nedarome nei vieno, nei kito.

## 7. Vaikai

Daygo nėra skirta vaikams iki 13 metų (ES – iki 16 metų). Sąmoningai iš jų duomenų nerenkame. Sužinoję, kad taip nutiko, juos ištriname.

## 8. Saugumas

Perduodami duomenys apsaugomi TLS. Žetonai saugomi iOS Keychain. Serverio duomenys saugomi Supabase su eilučių lygio saugumo taisyklėmis, kurios kiekvieną įrašą susieja su konkrečiu naudotoju. Jokia apsauga nėra tobula – jei įtariate saugumo pažeidimą, rašykite security@daygo.ai.

## 9. Ne medicininis patarimas

Daygo yra savijautos įrankis, o ne medicinos priemonė. Jos rezultatai nėra diagnozės. Dėl bet kokių su sveikata susijusių sprendimų pasitarkite su kvalifikuotu gydytoju.

## 10. Pakeitimai

Jei padarysime esminį pakeitimą, pranešime jums programėlėje ir atnaujinsime aukščiau nurodytą datą. Toliau naudodamiesi programėle po pakeitimo jūs su juo sutinkate.

## 11. Kontaktai

privacy@daygo.ai
