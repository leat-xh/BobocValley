# TASK INTRODUCTIV

**Tip:** proiect de echipă (4-5 persoane) · **Tehnologii:** React / Next / Angular (la alegere)

## Obiectiv

Creați împreună o aplicație web interactivă: un oraș explorabil cu mai multe căsuțe. Fiecare membru al echipei are propria căsuță personală, cu o cameră plină de obiecte, indicii și un mini-joc. În oraș există și Casa Capcană, căsuța tuturor: dacă intri, ușa se încuie în spatele tău și nu poți ieși până nu rezolvați împreună jocurile din ea/ceva interactiv. După ce ai explorat camerele și ai scăpat din capcană, se deblochează Camera Secretă, un test final în care ghicești al cui e fiecare obiect sau replică.

Fiecare își personalizează liber camera. Tot restul (orașul, căsuțele de decor, Casa Capcană, inventarul, ciclul zi/noapte, testul final) se construiește în echipă.

## Cerințe minime

### 1. Orașul (partea comună)

- Pagina principală este un oraș cu căsuțe: câte una personală pentru fiecare membru (cu numele sau porecla deasupra), Casa Capcană, Camera Secretă și minim 2 căsuțe de decor (de exemplu Biblioteca, Cafeneaua sau Magazinul).
- Fiecare căsuță este o rută sau o componentă randată dinamic, cu buton „Înapoi în oraș". Excepție: din Casa Capcană nu ieși cu butonul, ci rezolvând jocurile.
- Căsuțele de decor oferă doar mesaje și glume. Cel puțin una ascunde un indiciu util pentru Casa Capcană.
- Camera Secretă este o clădire încuiată. Se deblochează după ce utilizatorul a câștigat mini-jocul din toate camerele personale și a scăpat din Casa Capcană.
- O mini-hartă sau o listă de progres arată ce camere au fost vizitate, câte mini-jocuri au fost câștigate și dacă ai scăpat din capcană.
- Trebuie să existe elemente interactive care ajută la progres și elemente care oferă doar mesaje de context sau distragere.

### 2. Camera personală (partea individuală)

Fiecare membru construiește o singură cameră, complet a lui, cu următoarele cerințe:

- Minim 5 obiecte interactive (poster, raft, calculator, plantă, tablou etc.). Unele oferă indicii despre tine, altele doar mesaje de distragere.
- Regula indiciilor: textele nu spun numele tău și nu sunt scrise la persoana I („Eu sunt..."). Sunt indicii, altfel textul final devine prea ușor.
- Cel puțin un obiect se deschide într-un modal pentru inspecție în detaliu (jurnal, poză, monitor, scrisoare).
- Un tablou cu o frază care te descrie.
- Un mini-joc propriu, diferit de cele ale colegilor sau ceva ce te reprezintă doar să fie interactiv.
- Aspectul camerei (culori, fundal, stil) este la libera ta alegere. Camera trebuie să arate ca tine.

### 3. Mini-jocurile

- Fiecare cameră conține un mini-joc diferit. Echipa se coordonează ca să nu existe două jocuri de același tip.
- Exemple: memory cu lucruri din viața ta, puzzle cu piese, quiz cronometrat, prinde obiectele care cad, parolă/keypad cu un cod ascuns în cameră, ordonează evenimente pe o linie a timpului.
- Elementele jocului trebuie să fie lucruri din viața ta, nu generice.
- Câștigarea jocului oferă un fragment (obiect, literă sau cod) care ajunge în inventar.
- Minim un mini-joc din echipă trebuie să fie de tip Input/Parolă (keypad sau terminal unde introduci un cod găsit în altă parte a camerei).
- Poate fi un joc mai mare și mai avansat decât 4 mai mici.

### 4. Inventar

- O zonă vizibilă permanent (sidebar sau bară de jos), comună în tot orașul.
- Când găsești un obiect util și dai click pe el, dispare din scenă și apare în inventar.
- Fragmentele câștigate din mini-jocuri apar tot acolo.
- Obiectele din inventar pot fi selectate și folosite, de exemplu un fragment selectat se potrivește în ușa Camerei Secrete, sau o cheie deschide un sertar din altă cameră.

### 5. Casa Capcană / pot fi mai multe

- Casa Capcană este casa tuturor membrilor: o construiți împreună, nu aparține unui singur coleg.
- Când utilizatorul intră, ușa se încuie în spatele lui (animație și mesaj). Nu poate ieși până nu rezolvă toate jocurile din casă.

### 6. Casa Capcană (continuare)

- Jocuri de tipuri diferite: ghicitoare, cod de seif, puzzle cu piese, labirint, quiz, caută obiectul ascuns, asociere.
- Casa are decor propriu (pivniță, bibliotecă veche, laborator etc.), minim (nr de persoane din echipă) obiecte interactive și folosește inventarul: unele puzzle-uri cer obiecte colectate din camerele personale.
- Ca să reușiți, trebuie să discutați: răspunsul puzzle-ului fiecăruia se găsește în camera altui coleg (stabiliți la kickoff cine pe cine „trimite"). În plus, cel puțin un puzzle are răspunsul decis de voi împreună (motto-ul echipei, un cod comun), pe care nu-l poate afla nimeni din afară.
- Jocurile se rezolvă în orice ordine. Ușa afișează câte mai au rămas și se deschide doar când le-ai rezolvat pe toate. Un buton „Indiciu" poate fi folosit de maxim 3 ori.
- Ieșirea din capcană oferă ultimul fragment, necesar pentru Camera Secretă.

### 7. Camera Secretă

- Se deschide doar după ce toate mini-jocurile din camerele personale au fost câștigate și ai scăpat din Casa Capcană.
- Conține 8-10 obiecte sau replici amestecate, luate din camerele echipei (fiecare membru trimite minim 2).
- Pentru fiecare, utilizatorul alege al cui este dintre numele colegilor.
- La final apare scorul și, pentru fiecare răspuns, un mesaj explicativ („Era al Anei, ea nu iese din casă fără căști!").
- Echipa scrie împreună profilul de grup afișat la final: ce au în comun și ce îi diferențiază.

## Personalizare (cel puțin 2 în fiecare cameră)

- **Drag & drop:** o piesă de decor (tablou, covor, cutie) poate fi mutată ca să dezvăluie un indiciu sau un obiect ascuns.
- **Starea vizuală a camerei:** o acțiune (aprinzi lumina, lanterna UV, pornești calculatorul) schimbă aspectul camerei și dezvăluie elemente noi.
- **Obiecte deschise** într-o fereastră suprapusă, cu detalii.
- **Sistem de mesaje** (pop-up sau toast) pentru: „Ușa este blocată", „Ai găsit un fragment!", „Cod greșit", „Ai câștigat!".

## Bonus (pentru cine dorește)

- Salvarea progresului în `localStorage`: inventar, camere vizitate, mini-jocuri câștigate, momentul zilei.
- Timer global: „Aveți 20 de minute să deschideți Camera Secretă". La 0 apare Game Over.
- Animații fluide la intrarea în cameră și la dezvăluirea elementelor ascunse.
- Sunete: muzică în oraș, efecte în mini-jocuri.
- Easter Egg: un indiciu ascuns în oraș pe care puțini îl găsesc.
- Schimb de teste: după finalizare, fiecare joacă proiectul altei echipe.

---

**Note:**
- Imaginea 3 începe în mijlocul secțiunii despre Casa Capcană (prima linie era tăiată), așa că am păstrat-o ca „continuare" a secțiunii 5. În original, ea poate fi chiar punctul 6, deoarece textul vizibil se referă la aceeași casă; antetul exact nu apare în poză.
- Câteva fragmente din imagini sunt greu lizibile (rezoluție mică), de exemplu „puzzle-uri cu obiecte" și „nr de persoane"; le-am completat după context.
