# Daygo — Privatumo politika

_Atnaujinta: 2026-11-28_
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
- **Sveikatos duomenų sinchronizavimas – jūsų pasirinkimas.** Daygo apie tai paklausia pradedant naudotis, o pakeisti galite bet kada nustatymuose → Privatumas → Sinchronizuoti sveikatos duomenis. Jis **išjungtas, kol patys jo neįjungiate**.
  - **Išjungus:** Apple Health duomenys lieka jūsų įrenginyje. Į Anthropic Claude API siunčiamos tik konkrečios reikšmės, reikalingos jūsų paprašytam DI atsakymui (žr. 3 skyrių).
  - **Įjungus:** jūsų Apple Health duomenys (miegas, širdies ritmo variabilumas, ramybės pulsas, treniruotės, aktyvumas), įrašai (o tyrimų rodikliai – tik jei taip pat dalinatės kraujo tyrimais su klinika) saugomi mūsų Supabase duomenų bazėje (ES), susieti su jūsų paskyra. Taip treneris, rytinė apžvalga, savaitės suvestinė ir dėsningumų paieška gali naudoti jūsų istoriją, o klinika, prie kurios prisijungėte, gali matyti tai, kuo pasirinkote su ja dalintis. Taip pat saugomi jūsų priminimai (pavadinimas, laikas, kartojimo dienos), kad jie sugrįžtų iš naujo įdiegus programėlę ir būtų vienodi visuose įrenginiuose. Kai ištrinate įrašą, tyrimo rodiklį ar priminimą, jis ištrinamas ir iš mūsų serverių; paliekame tik žymą, kad elementas su tuo ID buvo ištrintas (be turinio), kad sena kopija kitame įrenginyje jo nesugrąžintų.
  - Išjungus sinchronizavimas sustabdomas. Jei norite ištrinti ir jau įkeltus duomenis, ištrinkite paskyrą arba parašykite privacy@daygo.ai.
- HealthKit duomenų niekada nenaudojame reklamai ir niekada jų neparduodame bei neperduodame duomenų brokeriams.

### 2.3 Garmin Connect duomenys
- Jei pasirenkate **Prijungti Garmin** (įvedimo metu arba nustatymuose), prisijungiate Garmin puslapyje ir patys pasirenkate, kuo dalintis. Daygo niekada nemato jūsų Garmin slaptažodžio.
- Gavusi jūsų leidimą, Garmin mums siunčia: dienos suvestines (žingsniai, ramybės pulsas, stresas, Body Battery), miegą (trukmė, fazės ir jų laikas, miego balas), nakties širdies ritmo variabilumą ir jūsų veiklas (tipas, laikas, atstumas, trukmė, kalorijos, pulsas ir GPS maršrutas su pulsu jame).
- Kitaip nei Apple Health duomenys, Garmin duomenys pristatomi į mūsų serverius, todėl jie **saugomi mūsų Supabase duomenų bazėje** (ES), susieti su jūsų Daygo paskyra ir matomi tik jums.
- Juos naudojame tik tam, kad *jums* parodytume pasirengimą, grafikus, 3D maršrutų žemėlapius ir patarimus. Jie niekada neparduodami, neperduodami reklamuotojams ar duomenų brokeriams ir niekada nenaudojami DI modeliams mokyti ar tobulinti.
- Bet kada galite atsijungti nustatymuose → Garmin prijungtas. Atsijungus panaikinama Daygo prieiga prie Garmin ir **jūsų Garmin duomenys ištrinami iš Daygo**. Tas pats nutinka pašalinus Daygo savo Garmin Connect paskyroje.

### 2.3a Oura ir WHOOP
- Jei nustatymuose prijungiate **Oura** arba **WHOOP**, prisijungiate jų puslapyje, o Daygo gauna jūsų dienos miegą, pasirengimą ar atsigavimą, širdies ritmo variabilumą, ramybės pulsą, krūvį ir treniruotes. Šie duomenys saugomi mūsų Supabase duomenų bazėje (ES), susieti su jūsų paskyra.
- Atsijungus panaikinama Daygo prieiga ir ištrinama viskas, ką Daygo iš tos paslaugos importavo, įskaitant į jūsų dienos įrašus įrašytas reikšmes.

### 2.3b Tyrimų rodikliai (kraujo tyrimai)
- Tyrimų rodikliai išsaugomi tik sutikus su atskiru sutikimu dėl kraujo tyrimų. Jį galite atšaukti nustatymuose → Privatumas. Atšaukus nauji rodikliai nebeišsaugomi ir jūsų tyrimų rodikliai nebeperduodami DI treneriui.

### 2.3c Klinikos
- Jei prie klinikos prisijungiate su pakvietimo kodu, klinika mato tik tas kategorijas, kuriomis pasirinkote dalintis (pavyzdžiui, išmaniųjų įrenginių duomenis, savijautos įrašus ar tyrimus). Bet kada galite tai pakeisti arba nustoti dalintis. Kiekvienas gydytojo apsilankymas jūsų kortelėje registruojamas.
- DI santraukos jūsų gydytojui rengiamos tik tada, jei jūsų DI trenerio nustatymas įjungtas.

### 2.4 Autentifikavimo duomenys
- Jei prisijungiate per Apple, gauname naudotojo identifikatorių ir (jei leidžiate) jūsų vardą bei privatų persiuntimo el. pašto adresą. Niekada negauname jūsų tikrojo Apple ID slaptažodžio.
- Jei prisijungiate per Google, gauname jūsų Google paskyros identifikatorių, vardą ir el. pašto adresą. Niekada negauname jūsų Google slaptažodžio.

### 2.5 Įrenginio ir diagnostikos duomenys
- Gamintojo lygio įrenginio identifikatorius (`identifierForVendor`), naudojamas užklausų dažniui riboti.
- Strigčių ataskaitos (Sentry), **tik jei jas įjungiate** nustatymuose → Privatumas: įrenginio tipas, OS ir programėlės versija bei strigties informacija. Jokių sveikatos duomenų.
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
- **Jūsų pasirinkimas:** DI duomenų tvarkymą galite bet kada įjungti arba išjungti nustatymuose → Privatumas → DI treneris. Išjungus jūsų duomenys DI nesiunčiami visai: nėra pokalbių, apžvalgų, savaitės suvestinių, tyrimų įžvalgų, foninės dėsningumų paieškos ir DI santraukų klinikai. Taip pat galite ištrinti savo pokalbius ir atmintį arba paskyrą. Įrašai, grafikai ir Apple Health ar Garmin duomenys toliau veikia ir be DI.
- DI atsakymai gali būti klaidingi. Jie nėra medicininis patarimas (žr. 9 skyrių).

## 4. Kur saugomi jūsų duomenys

- **Jūsų įrenginyje** pagal numatytuosius nustatymus (SwiftData, Keychain).
- **Mūsų Supabase projekte**, kai esate prisijungę: profilis, dienos įvertinimai, dienoraščiai, savaitės tikslai, tai, ką treneris prisimena, jūsų sutikimų pasirinkimai, Garmin, Oura ar WHOOP duomenys, jei juos prijungėte, ir jūsų Apple Health duomenys bei įrašai, jei įjungtas sveikatos duomenų sinchronizavimas (tyrimų rodikliai – tik jei taip pat dalinatės kraujo tyrimais su klinika). Saugoma ES (AWS `eu-west-1`, Airija).
- **Perdavimo metu** į Anthropic API ir iš jo – DI funkcijoms. Anthropic užklausų duomenis saugo pagal savo komercinę sutartį ir jais nemoko modelių.
- **Apple Health duomenys** lieka jūsų įrenginyje, nebent įjungiate sveikatos duomenų sinchronizavimą (žr. 2.2 skyrių).

### Kas tvarko jūsų duomenis

| Paslauga | Kam | Duomenys |
|---|---|---|
| Supabase | Duomenų bazė, prisijungimas, serverio funkcijos | Paskyra, įrašai, dienoraščiai, sinchronizuoti sveikatos duomenys, išmaniųjų įrenginių duomenys |
| Anthropic (Claude API) | DI trenerio atsakymai ir apžvalgos | Kiekvienam atsakymui reikalinga jūsų duomenų dalis |
| Garmin | Garmin duomenų šaltinis, tik jei jį prijungiate | Garmin siunčia duomenis mums; mes Garmin apie jus nieko nesiunčiame |
| Oura, WHOOP | Jų duomenų šaltinis, tik jei juos prijungiate | Jie siunčia duomenis mums; mes jiems apie jus nieko nesiunčiame |
| Google | Prisijungimas per Google, tik jei juo naudojatės | Prisijungimo identifikatorius, vardas, el. paštas |
| Apple | Prisijungimas per Apple, pranešimai, prenumeratos programėlėje, HealthKit jūsų įrenginyje | Prisijungimo identifikatorius, pranešimų žetonas, prenumeratos būsena |
| Sentry | Strigčių ataskaitos, tik jei jas įjungiate | Įrenginio tipas, OS ir programėlės versija, strigties informacija |
| Vercel | daygo.ai svetainės talpinimas | Standartiniai interneto serverio žurnalai |

Kiekvienas jų tvarko jūsų duomenis tik tam, kad teiktų savo paslaugą Daygo.

## 5. Saugojimo terminai

- Paskyros duomenys: saugomi, kol ištrinate paskyrą, tada ištrinami per 30 dienų.
- Garmin, Oura ir WHOOP duomenys: saugomi, kol prijungti; ištrinami atjungus arba ištrynus paskyrą.
- Prenumeratų įrašai: saugomi apskaitai; ištrynus paskyrą, ryšys su ja pašalinamas.
- Pranešimų istorija (naudojama tik tam, kad nesiųstume per daug pranešimų): 7 dienos, be pranešimų teksto.
- Strigčių žurnalai: 90 dienų.
- Programėlės naudojimo įvykiai: 12 mėnesių, po to ištrinami.
- Užklausų dažnio ribojimo skaitikliai: 2 dienos.

## 6. Jūsų teisės

Jūs galite:
- Matyti ir eksportuoti viską, ką apie jus turime jūsų įrenginyje ir mūsų serveriuose (programėlėje: Nustatymai → Privatumas → Eksportuoti mano duomenis; arba parašę privacy@daygo.ai). Jei dalies duomenų nepavyksta nuskaityti, programėlė apie tai praneša ir pasiūlo bandyti dar kartą, o ne pateikia neišsamų failą.
- Ištrinti savo paskyrą ir visus serveryje saugomus duomenis.
- Pataisyti tai, ką Daygo sužinojo apie jus (Nustatymai → Atmintis), arba paprašyti mūsų pataisyti kitus duomenis.
- Atjungti Garmin, Oura ar WHOOP – tada tie duomenys ištrinami iš Daygo.
- Bet kada atšaukti sutikimą dėl DI, sveikatos duomenų sinchronizavimo ar tyrimų rodiklių nustatymuose → Privatumas (žr. 2.2, 2.3b ir 3a skyrius).
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
