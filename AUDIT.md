# Audit critic 360° — Notelevel

**Data auditului:** 10 iulie 2026  
**Audiență:** echipa tehnică  
**Obiect:** aplicația Laravel activă din `notelevel-app`  
**Excluderi explicite:** directoarele `_backend/` și `_frontend/` nu au fost analizate și nu sunt folosite ca dovezi. Ele sunt tratate exclusiv ca surse istorice de inspirație.

> **Actualizare remediere — 10 iulie 2026:** lucrările tehnice P2 au fost implementate. Starea curentă are **51 teste trecute, 166 assertions**, Pint verde, două migrări P1/P2 aplicate și build Vite reușit. API-ul legacy are termen de retragere, colecțiile sunt paginate, autosave-ul este idempotent, sitemapul este invalidat imediat, iar canvasul are focus/dialog/motion semantics îmbunătățite. Validarea manuală cu NVDA/VoiceOver rămâne necesară deoarece browserul automat nu a fost disponibil.

In plus, de facut:
- posibilitatea de a face zoom — **planificat pentru viitor, neurgent** (asumat explicit de user pe 14 iulie 2026; niciun cod de zoom în `resources/js/canvas.js`)
- securizarea informatiilor (nimeni sa nu poata sa vada ce e acolo, sa fie criptat 100%) — **planificat pentru viitor, neurgent** (asumat explicit de user pe 14 iulie 2026; discul `tenants` stochează fișierele necriptat; recomandare: implementează backup-ul întâi, vezi P4 secțiunea 8)

> **Actualizare audit — 13 iulie 2026:** re-verificare critică a stării curente, 3 zile după remedierea P2. Verdictul **rămâne "nu este pregătită pentru producție"**.
>
> **Corecție importantă la P2-1 (marcat ✅ mai sus):** afirmația "API-ul legacy... successor link" lasă impresia că migrarea către noul flux e completă. **Nu este.** `resources/js/canvas.js` — codul care rulează efectiv în UI — nu apelează niciodată ruta nouă `documents/{document}/autosave`; fluxul real de salvare al canvasului folosește exclusiv `POST /canvas/api` (acțiunea `save`, marcată `legacy.deprecated`). Toată protecția la conflict de versiune și idempotency construită și testată în `tests/Feature/P2AutosaveTest.php` pentru ruta nouă **nu apără niciun utilizator real** — e cod mort din perspectiva UI-ului. Migrarea reală a fluxului de salvare a fost pornită azi (vezi secțiunea "Migrare autosave — status pe etape" de mai jos). **Recomandare**: orice alt ✅ din acest document ar trebui re-verificat printr-un test manual/automat al fluxului UI real, nu doar prin citirea codului backend izolat.
>
> **Descoperiri noi, neacoperite de auditul din 10 iulie:**
> - ~~Nu există procesare de plăți~~ **Rezolvat 13 iulie 2026** — vezi secțiunea 12, "Integrare Stripe", de la finalul documentului.
> - **Nicio configurație de deploy/CI** — fără `Dockerfile`/`docker-compose`/`Procfile`, fără `.github/workflows`, README încă boilerplate Laravel generic.
> - **Niciun backup configurat** — nici pachet (`spatie/laravel-backup`), nici `SoftDeletes` pe modelele cu conținut utilizator, deși politica de confidențialitate promite "backup-uri pe termen scurt".
> - **`APP_DEBUG=true` + `APP_ENV=local`** în `.env`-ul curent — de verificat explicit înainte de orice deploy real.
> - **Fără HSTS**, și **`SESSION_SECURE_COOKIE`** nesetat explicit (config depinde de infra să forțeze HTTPS).
> - **Fără rate limiting la înregistrare** — combinat cu AUTH-01 (încă deschis), permite creare în masă de conturi neverificate care lovesc imediat `/canvas/ai` și storage-ul.
> - **Fără telemetrie de erori JS** (`window.onerror`/`unhandledrejection`/Sentry) — frontend-ul de 10.700+ linii e opac în producție; există doar `OperationalAlert` pe partea PHP.
> - **21 de apeluri `renderCurrentPage().catch(error => console.error(error))`** în `canvas.js` — pattern fire-and-forget repetat masiv; o randare eșuată lasă canvasul vizual desincronizat de model, fără nicio indicație pentru utilizator. Aceeași clasă de bug ca două bug-uri de randare deja reparate azi (crash pe mobil la `/translate` prin `virtualKeyboardTarget`, și o cursă de randare la crearea formelor colorate prin AI).
> - **Fără avertisment la închiderea tab-ului cu modificări nesalvate** (`beforeunload` scrie doar în `localStorage`) — combinat cu lipsa de retry la eșecul de salvare, risc real de pierdere silențioasă a muncii utilizatorului.

> **Actualizare audit — 14 iulie 2026:** re-verificare completă, o zi după ultima actualizare. Toate elementele **P0, P1 și P2** din roadmap-ul de mai jos sunt acum ✅ **confirmate prin cod, teste automate și verificare vizuală reală în browser** (Playwright, autentificat efectiv în `/admin` și în fluxurile publice) — nu doar prin citire de cod, corectând limitarea semnalată explicit pe 13 iulie. Suita de teste: **84 teste, 267 assertions**, verde. Repository-ul are acum istoric Git real (14 commit-uri) și e împins pe `origin/main` (GitHub) — limitarea "fără metadata Git" de pe 10 iulie nu mai e valabilă.
>
> **Verdictul se schimbă din "nu este pregătită" în "pregătită condiționat"** — vezi verdictul detaliat din secțiunea 1. Blocajele de securitate/integritate a datelor din auditul inițial (SEC-01, DATA-01, AI-01, AI-02, TEST-01, AUTH-01 parțial) sunt închise. Ce rămâne deschis nu mai ține de siguranța de bază a aplicației, ci de: două cerințe explicite ale userului încă neimplementate (zoom, criptare completă a conținutului), validare manuală de accesibilitate niciodată efectuată de un om, lipsa unui backup configurat, și câteva verificări de configurare specifice mediului de producție (Forge) care nu pot fi confirmate din acest mediu de dezvoltare local.
>
> **Descoperire nouă azi — bug real de mediu, nu de cod (vezi OPS-02 mai jos):** panoul admin întorcea `500` pe *orice* pagină (`RuntimeException: The "intl" PHP extension is required`) din cauza unei nepotriviri de căutare de DLL-uri Windows între directorul Apache și directorul PHP din XAMPP — `intl` funcționa perfect în CLI (folosit de suita de teste), dar eșua silențios sub `mod_php`. Concluzia importantă: **suita de teste PHPUnit, care rulează exclusiv prin CLI, nu ar fi putut niciodată detecta acest bug** — a fost prins doar pentru că userul a accesat efectiv panoul din browser. Fix aplicat local (copiere DLL-uri ICU lângă `httpd.exe`) e specific XAMPP și **nu se aplică pe Forge** (php-fpm, altă topologie de directoare) — dar recomandarea rămâne validă acolo: verifică explicit `php -m | grep intl` cu binarul PHP folosit efectiv de php-fpm/Forge, nu doar cu binarul din CLI, înainte de a considera deploy-ul reușit.

## 1. Rezumat executiv

### Verdict

**PREGĂTITĂ CONDIȚIONAT PENTRU PRODUCȚIE** (actualizat 14 iulie 2026; verdictul inițial de mai jos, din 10 iulie, e păstrat ca istoric). Toate blocajele critice și ridicate din auditul inițial — endpoint mutabil prin GET, runtime inconsistent, integritate DB–filesystem, cost AI necontrolat, suită de teste roșie — sunt închise, verificate prin teste automate și, parțial, prin verificare manuală reală în browser. Plățile (Stripe, mod Live) și verificarea de email (Resend) sunt funcționale și testate cu date reale. Lansarea poate avea loc dacă echipa acceptă explicit riscurile reziduale enumerate în "Ce rămâne deschis" din actualizarea de 14 iulie de mai sus — în principal: lipsa unui backup configurat, validarea de accesibilitate nefăcută de un om, și lipsa criptării complete a conținutului (cerută explicit de user, neimplementată încă).

**Verdictul original, 10 iulie 2026 (istoric):** NU ESTE PREGĂTITĂ PENTRU PRODUCȚIE. Aplicația are o bază funcțională promițătoare — autentificare Laravel, administrare Filament, separare logică pe tenant, cote de plan, SEO de bază și build de producție valid — dar lansarea trebuie blocată până la rezolvarea constatărilor P0.

Blocajul principal de securitate este endpointul legacy `/canvas/api`: ruta acceptă atât `GET`, cât și `POST`, iar același dispatcher execută acțiuni de scriere și ștergere. O navigare GET autentificată poate ajunge la operații distructive fără protecția CSRF rezervată metodelor mutante. Alte riscuri importante sunt accesul utilizatorilor neverificați la API-urile canvas, lipsa tranzacțiilor între baza de date și fișiere, controlul concurent insuficient al costului AI și o suită de teste care eșuează și nu acoperă funcțiile centrale.

### Scoruri orientative

**Coloana din 10 iulie e păstrată ca istoric; coloana din 14 iulie reflectă starea curentă.**

| Domeniu | Scor (10 iul) | Scor (14 iul) | Observație curentă |
|---|---:|---:|---|
| Securitate aplicație | 4/10 | 8/10 | GET mutabil eliminat, CSP activ, escaping corect; rămâne fără rate limiting la `/register` (AUTH-02, nou) |
| Autentificare și autorizare | 6/10 | 8/10 | `verified` aplicat pe API-uri și dashboard, email real prin Resend; recuperare parolă tot indisponibilă (decizie asumată) |
| Multi-tenancy și date | 6/10 | 7/10 | Teste cross-tenant adăugate; TEN-01 (context implicit `auth()`) rămâne arhitectural neschimbat |
| AI și control cost | 5/10 | 8/10 | Rezervări atomice de buget, throttling per utilizator, toate planurile testate |
| Arhitectură și mentenanță | 4/10 | 5/10 | Migrare autosave reală completă (nu doar cod mort); canvas monolitic încă nerefactorizat (P3) |
| Testare și livrare | 3/10 | 8/10 | 84 teste, 267 assertions, verde; CI/CD tot neconfigurat formal (nevalidat pe Forge) |
| Performanță | 6/10 | 6/10 | Neschimbată; paginare adăugată la P2, restul PERF-01 rămâne |
| UX și accesibilitate | 5/10 | 6/10 | Focus/dialog/motion reparate și testate static; NVDA/VoiceOver tot nefăcut de un om |
| SEO și conținut | 7/10 | 7/10 | Neschimbată |
| Legal și confidențialitate | 3/10 | 6/10 | Politici rescrise cu identitate reală a operatorului (GREEN HORIZON CONCEPTS S.R.L.); nu acoperă încă datele din formularul de contact/newsletter (LEG-02, nou) și n-a trecut de o validare juridică umană |
| Plăți și facturare | — | 8/10 | Nou: Stripe live, webhook semnat, checkout guest, testat cu tranzacții reale |

### Distribuția constatărilor

**Actualizat 14 iulie 2026, noaptea** — include cele 4 constatări noi din verificarea de azi (AUTH-02, LEG-02, OPS-02, WEB-02), aproape toate acum închise (vezi secțiunea 15). Marea majoritate a constatărilor de mai jos sunt ✅ rezolvate — vezi starea individuală la fiecare constatare și roadmap-ul din secțiunea 8 pentru ce mai e deschis efectiv.

| Severitate | Număr total | Din care încă deschise | Semnificație |
|---|---:|---:|---|
| Critic | 1 | 0 | Poate produce pierdere de date sau compromitere semnificativă; blochează lansarea |
| Ridicat | 8 | 0 | Impact major sau probabilitate relevantă; necesită remediere înainte de producție |
| Mediu | 11 | 3 (TEN-01, PERF-01, UX-01 — accesibilitatea canvasului rămâne integral neatinsă, decizie asumată de user) | Reduce robustețea, securitatea în profunzime sau calitatea produsului |
| Scăzut | 4 | 3 (OBS-01 parțial, ARC-01, DOC-01) | Datorie tehnică ori îmbunătățire cu impact limitat |

**Notă de rigoare**: LEG-02 și OPS-02 sunt marcate rezolvate pe baza confirmării explicite a userului, nu a unei re-verificări independente de cod/infrastructură din partea acestui audit (vezi detalii la fiecare constatare, secțiunea 4).

## 2. Metodologie și limite

Auditul a inclus citirea rutelor, controllerelor, modelelor, migrărilor, serviciilor, configurației, view-urilor, JavaScript-ului și CSS-ului aplicației active. Au fost executate boot-ul Laravel, inventarul rutelor, testele PHPUnit, build-ul Vite și auditurile de dependențe.

Scala folosită:

- **Critic:** impact foarte mare și exploatare realistă sau blocaj total de lansare.
- **Ridicat:** impact mare, probabilitate medie/mare ori control esențial absent.
- **Mediu:** impact controlabil, dar relevant pentru robustețe, securitate sau experiență.
- **Scăzut:** mentenanță, claritate sau optimizare fără risc imediat major.

O constatare este marcată **confirmată** când rezultă direct din cod sau dintr-o comandă reproductibilă. Un **risc de validat dinamic** este o ipoteză susținută de implementare, dar care necesită browser, infrastructură ori trafic concurent pentru confirmare.

### Limitări

- Browserul local interactiv nu a fost disponibil, iar cererea HTTP către instalarea XAMPP s-a închis neașteptat. UX-ul, responsive behavior, tastatura, cititoarele de ecran și fluxurile end-to-end nu au fost validate dinamic.
- Proiectul nu conține metadata Git în directorul analizat; nu au putut fi evaluate istoricul, review-urile sau disciplina de livrare.
- Nu s-au efectuat teste de penetrare active, fuzzing de upload, test concurent AI, Lighthouse, axe sau măsurători Web Vitals.
- Fișierul `.env` nu a fost inclus în raport și nu au fost expuse secrete.

## 3. Rezultatele verificărilor executabile

| Verificare | Rezultat |
|---|---|
| PHP implicit | **Eșec:** PHP 8.2.24; autoloader-ul instalat cere PHP `>=8.3.0` |
| PHP alternativ | PHP 8.3.29 pornește aplicația |
| Rute | 72 rute înregistrate pe `notelevel.test` |
| PHPUnit | **26 trecute, 1 eșuat**, 63 assertions, ~39 s |
| Cauza testului eșuat | `no such table: plans` la randarea `/` în baza SQLite `:memory:` |
| Vite production build | **Trece**, 60 module transformate în ~6,7 s |
| Bundle canvas | 182,16 kB JS (51,54 kB gzip), 68,21 kB CSS (12,51 kB gzip) |
| Composer audit | 0 advisories cunoscute |
| npm audit `--omit=dev` | 0 vulnerabilități cunoscute |

Absența advisory-urilor nu demonstrează securitatea codului propriu și nu reduce severitatea constatărilor de mai jos.

## 4. Constatări prioritare

### SEC-01 — Acțiuni mutante și distructive accesibile prin GET

**Severitate:** Critic  
**Stare:** Confirmată  
**Domeniu:** securitate, CSRF, integritatea datelor

**Dovadă:** `routes/web.php:75` definește `Route::match(['get', 'post'], '/canvas/api', ...)`. `app/Http/Controllers/CanvasApiController.php:25-52` alege acțiunea exclusiv din parametrul `action` și include `save`, `delete`, `rename`, `move_document`, ștergeri de foldere/PDF/favorite și uploaduri. Operațiile șterg efectiv fișiere și înregistrări, de exemplu la liniile 208-209, 337-340, 440-441 și 548-549.

**Impact:** o cerere GET autentificată poate modifica sau șterge date. CSRF middleware nu tratează GET ca metodă mutabilă. În funcție de politica SameSite și forma navigării, un atacator poate determina victima să deschidă un URL care execută acțiunea.

**Scenariu:** victima autentificată urmează un link către `/canvas/api?action=delete_pdf&id=...`; controllerul procesează ștergerea fără token CSRF deoarece metoda este GET.

**Remediere:** permite GET numai pentru o listă explicită de operații read-only (`list`, `list_pdfs`, `list_favourites`, `get_document`, `page_image`, `pdf_file`, `favourite_file`). Toate acțiunile mutante trebuie să fie POST/PATCH/DELETE, cu token CSRF și, ideal, rute separate. Respinge cu `405` orice combinație metodă–acțiune incorectă.

**Criteriu de verificare:** fiecare acțiune mutabilă returnează `405` pe GET și `419`/403 fără CSRF; testele confirmă că datele și fișierele rămân neschimbate.

### DEP-01 — Runtime-ul implicit nu poate porni proiectul

**Severitate:** Ridicat  
**Stare:** Confirmată  
**Domeniu:** deployment, operare

**Dovadă:** `composer.json:9` declară PHP `^8.2`, dar dependențele instalate generează un platform check pentru PHP `>=8.3`. Comanda implicită folosește PHP 8.2.24 și oprește orice comandă Artisan. Doar PHP 8.3.29 instalat separat a permis boot-ul.

**Impact:** setup-ul documentat, CI-ul sau producția pot deveni complet indisponibile, în funcție de executabilul PHP selectat.

**Remediere:** aliniază `composer.json`, `composer.lock`, imaginea/hostul de producție și CI la aceeași versiune minimă; recomandat PHP `^8.3`. Adaugă verificare explicită `php -v` și `composer check-platform-reqs` în pipeline.

**Criteriu de verificare:** `composer install`, `php artisan about`, migrarea și testele rulează cu executabilul standard al mediului curat.

### AUTH-01 — Utilizatorii neverificați pot accesa API-urile produsului

**Severitate:** Ridicat  
**Stare:** Confirmată  
**Domeniu:** autentificare, abuz, produs

**Dovadă:** dashboard-ul este în grupul `['auth', 'verified']` la `routes/web.php:48-52`, însă documentele, PDF-urile, favoritele, `/canvas/api` și `/canvas/ai` sunt numai în grupul `auth` la liniile 54-76.

**Impact:** cerința de verificare email este doar o barieră UI. Un cont neverificat poate apela direct stocarea și AI-ul, consumând resurse și ocolind intenția de onboarding.

**Remediere:** mută toate API-urile de produs în grupul `auth, verified`; exceptează explicit doar conturile demo dacă aceasta este politica dorită și testează separat rolul `guest`.

**Criteriu de verificare:** un utilizator neverificat primește redirect/403 pentru toate API-urile de produs; utilizatorul verificat și guest-ul autorizat au comportamentul documentat.

### AUTH-02 — `/register` nu are rate limiting (nou, 14 iulie 2026) — ✅ Rezolvat 14 iulie 2026

**Severitate:** Ridicat  
**Stare:** ✅ Rezolvată — verificată prin test automat  
**Domeniu:** abuz, autentificare

**Dovadă (problema originală):** `routes/auth.php:13-16` definea `POST register` fără middleware `throttle`, spre deosebire de `verification.send`/`verification.verify` care au `throttle:6,1`. Login-ul are propriul rate limiting Breeze implicit, dar înregistrarea nu.

**Impact:** creare în masă de conturi neverificate (bot/script), fiecare capabil să consume imediat cota AI (£0.10/lună) și storage-ul din planul Free, fără nicio frecare.

**Remediere aplicată:** `routes/auth.php` — `POST register` are acum `throttle:6,1`, identic cu limiterul folosit la verificarea emailului.

**Verificare:** test nou `RegistrationTest::test_registration_is_rate_limited` — 6 înregistrări succed, a 7-a de pe același "client" primește `429`. Suită completă verde (85 teste, 268 assertions).

### DATA-01 — Operațiile DB–filesystem nu sunt atomice și erorile storage sunt silențioase

**Severitate:** Ridicat  
**Stare:** Confirmată  
**Domeniu:** integritatea datelor, stocare

**Dovadă:** discul `tenants` are `throw => false` și `report => false` în `config/filesystems.php:50-55`. Salvarea canvas persistă documentul, șterge directorul și scrie paginile secvențial (`CanvasApiController.php:171-186`) fără tranzacție sau verificarea rezultatelor. Uploadurile creează mai întâi rândul și apoi scriu fișierul (`PdfController.php:40-53`; flux similar în controllerul legacy).

**Impact:** lipsa spațiului, permisiuni greșite sau I/O parțial pot returna succes cu fișiere lipsă, pot distruge versiunea anterioară ori lăsa rânduri orfane.

**Remediere:** activează excepții/reporting pentru discul privat; scrie în cale temporară, verifică rezultatul, apoi promovează atomic. Folosește tranzacție DB cu compensare filesystem și nu șterge versiunea veche înainte ca noua versiune să fie completă.

**Criteriu de verificare:** teste cu storage fake care forțează eșecul la fiecare etapă demonstrează rollback și păstrarea ultimei versiuni valide.

### AI-01 — Capul de cost AI poate fi depășit prin concurență

**Severitate:** Ridicat  
**Stare:** Confirmată ca design; exploatarea necesită test concurent  
**Domeniu:** cost, concurență

**Dovadă:** `CanvasAiController.php:66-84` însumează consumul înainte de apel. Jurnalizarea are loc ulterior la liniile 236-247. Nu există lock, rezervare sau tranzacție care să lege verificarea de consum.

**Impact:** mai multe cereri simultane pot trece toate verificarea și genera cost peste limita planului. O singură cerere poate depăși restul disponibil deoarece se verifică doar `spent >= cap`, nu costul maxim estimat al cererii.

**Remediere:** rezervă atomic un buget maxim per cerere într-o tranzacție/lock, finalizează cu costul real și eliberează diferența. Definește limită per cerere și marjă pentru rotunjiri/curs valutar.

**Criteriu de verificare:** un test paralel cu N cereri aproape de limită confirmă că suma rezervată/cheltuită nu depășește politica stabilită.

### AI-02 — Endpointul AI nu are throttling dedicat

**Severitate:** Ridicat  
**Stare:** Confirmată  
**Domeniu:** abuz, disponibilitate, cost

**Dovadă:** `/canvas/ai` este definit numai în grupul `auth` (`routes/web.php:54-76`). Throttling explicit există pentru login/verificare și demo, dar nu pentru AI.

**Impact:** rafale de cereri pot consuma conexiuni PHP și apeluri externe timp de până la 45 s (`config/ai.php:27`), chiar dacă limita monetară oprește eventual contul.

**Remediere:** adaugă limiter per utilizator și IP, limită de concurență și răspuns `429` cu retry policy; mută apelurile lungi în joburi dacă UX-ul permite.

**Criteriu de verificare:** testele dovedesc limita pe minut și concurență, fără a afecta utilizatori diferiți.

### TEST-01 — Suita de teste este roșie și nu reproduce schema aplicației

**Severitate:** Ridicat  
**Stare:** Confirmată  
**Domeniu:** testare, livrare

**Dovadă:** PHPUnit rulează SQLite `:memory:` (`phpunit.xml:26-27`), dar `Tests\Feature\ExampleTest` eșuează cu `no such table: plans`. Rezultat: 26 teste trecute, 1 eșuat. Testul accesează `/`, iar codul cere planul `premium` fără ca schema/seed-ul să fie pregătite.

**Impact:** pipeline-ul nu poate fi folosit ca gate, iar regresiile reale sunt mascate de un eșec de infrastructură repetitiv.

**Remediere:** standardizează `RefreshDatabase`, migrarea și seed-urile/fabricile minime. Elimină testele placeholder și izolează dependențele de plan în fixture-uri explicite.

**Criteriu de verificare:** suita pornește dintr-o bază goală, trece integral și nu depinde de baza locală.

### TEN-01 — Izolarea tenantului depinde implicit de contextul global `auth()`

**Severitate:** Mediu  
**Stare:** Confirmată ca risc arhitectural  
**Domeniu:** multi-tenancy

**Dovadă:** `BelongsToTenant.php:11-20` aplică filtrul și completează `user_id` numai dacă `auth()->check()` este adevărat. În CLI, joburi sau servicii fără guard autentificat, query-urile nu sunt filtrate.

**Impact:** o reutilizare viitoare din job/command poate citi toate tenanturile sau crea rânduri fără owner. Global scope-ul oferă siguranță în requesturile curente, dar nu este o frontieră de securitate completă.

**Remediere:** introdu un tenant context explicit, fail-closed când lipsește și metode administrative clar denumite pentru acces cross-tenant. Adaugă politici ca strat suplimentar la route model binding.

**Criteriu de verificare:** testele web, job și CLI demonstrează că lipsa tenantului produce eroare, nu query nefiltrat.

### API-01 — Există două suprafețe API paralele pentru aceleași entități

**Severitate:** Mediu  
**Stare:** Confirmată  
**Domeniu:** arhitectură, consistență

**Dovadă:** rutele REST pentru documents/folders/PDF/favourites coexistă cu dispatcherul legacy (`routes/web.php:62-76`). Comentariul din `CanvasApiController` declară explicit duplicarea contractelor.

**Impact:** validarea, cotele, răspunsurile și remediile de securitate pot diverge. De exemplu, o regulă adăugată într-un controller poate fi ocolită prin cealaltă suprafață.

**Remediere:** definește servicii/aplicație comune pentru operații și păstrează controllerele doar ca adaptoare temporare. Publică un plan de eliminare a contractului legacy.

**Criteriu de verificare:** aceeași operație are o singură implementare de business și teste contractuale pentru ambele adaptoare cât timp coexistă.

### VAL-01 — Validarea documentelor și a payloadurilor canvas este insuficientă

**Severitate:** Mediu  
**Stare:** Confirmată  
**Domeniu:** date, disponibilitate

**Dovadă:** `DocumentController.php:21-38` acceptă `content`, moduri, culoare și `page_count` fără reguli Laravel, dimensiuni maxime sau schemă. Update/autosave păstrează aceeași abordare la liniile 43-52 și 113-127. Endpointul legacy decodează payloaduri și imagini base64 în memorie.

**Impact:** payloaduri foarte mari, valori invalide sau structuri incompatibile pot consuma memorie, corupe documente și produce erori în client.

**Remediere:** FormRequest cu limite de bytes și număr de elemente, enum-uri, regex culoare, `page_count` bounded și schemă versionată pentru content. Impune limite și la web server/PHP.

**Criteriu de verificare:** payloadurile invalide și supradimensionate primesc 422/413 fără scrieri parțiale.

### UP-01 — Favoritele PDF nu aplică limită de mărime sau cota planului

**Severitate:** Mediu  
**Stare:** Confirmată  
**Domeniu:** upload, cote

**Dovadă:** `FavouriteController.php:20-21` validează doar `required|file|mimes:pdf`; nu aplică `max`. Planurile conțin `max_favourites` (`create_plans_table.php:19`), însă controllerul nu verifică această cotă. Fluxul legacy trebuie păstrat în aceeași politică.

**Impact:** un utilizator autentificat poate consuma spațiu necontrolat prin favorite, chiar dacă PDF-urile normale sunt limitate.

**Remediere:** aplică limită de număr și dimensiune, ideal o cotă totală de storage; centralizează politica pentru ambele API-uri.

**Criteriu de verificare:** uploadul peste limită este respins înainte de scriere, iar concurența nu permite depășirea cotei.

### WEB-01 — Construirea panoului de cont prin `innerHTML` include date de utilizator neescapate

**Severitate:** Mediu  
**Stare:** Confirmată; impactul cross-user trebuie validat  
**Domeniu:** XSS, frontend

**Dovadă:** `resources/js/canvas.js` construiește panoul de cont prin template atribuit lui `body.innerHTML` în zona liniilor ~9.561+, interpolând `data.name`, `data.email` și valori de plan. Numele este controlabil de utilizator și acceptă orice string până la 255 caractere (`ProfileUpdateRequest.php:20`). În alte zone există helper `escapeHtml`, deci protecția nu este uniformă.

**Impact:** cel puțin self-XSS persistent în contul propriu; impactul poate crește dacă aceleași valori sunt afișate în contexte administrative sau partajate.

**Remediere:** construiește nodurile și setează `textContent`, sau escapează central toate interpolările. Adaugă Content-Security-Policy fără `unsafe-inline` după eliminarea handlerelor/stilurilor inline.

**Criteriu de verificare:** un nume precum `<img src=x onerror=...>` este afișat literal și testele CSP/XSS nu execută script.

### AI-03 — Erorile brute ale providerului sunt propagate clientului

**Severitate:** Mediu  
**Stare:** Confirmată  
**Domeniu:** informații, UX

**Dovadă:** `AiService.php:332-333` și 456-457 returnează mesajul `error.message` primit de la provider; controllerul îl expune în răspunsurile de eroare.

**Impact:** utilizatorul poate vedea detalii de provider, model, configurare sau moderare nepotrivite pentru contractul public. Mesajele devin instabile și greu de localizat.

**Remediere:** mapează erorile la coduri interne stabile, afișează mesaje neutre și loghează detaliile cu request ID, fără conținut sensibil.

**Criteriu de verificare:** răspunsurile externe simulate nu apar textual în API; logurile păstrează diagnosticul redactat.

### PERF-01 — Operații grele sunt sincrone și colecțiile canvas sunt încărcate integral

**Severitate:** Mediu  
**Stare:** Confirmată ca design; impactul necesită profilare  
**Domeniu:** performanță

**Dovadă:** `CanvasApiController.php:76-106` încarcă toate documentele și folderele; listările PDF/favorite urmează aceeași abordare. Uploadurile, copierea fișierelor și apelurile AI sunt în requestul web. Timeoutul AI este 45 s.

**Impact:** timpul și memoria cresc liniar cu biblioteca utilizatorului; workerii PHP pot fi blocați de I/O și provider extern.

**Remediere:** paginare/cursor, câmpuri selectate, thumbnail-uri precompute, streaming și joburi pentru procesări grele. Stabilește bugete de latență și instrumentare.

**Criteriu de verificare:** teste cu biblioteci mari respectă limite definite de timp/memorie; p95 este monitorizat.

### UX-01 — Accesibilitatea canvasului nu este demonstrată

**Severitate:** Mediu  
**Stare:** Confirmată, **rămâne deschisă — deciziune explicită a userului**  
**Domeniu:** UX, accesibilitate

**Dovadă:** canvasul construiește numeroase controale, meniuri, panouri, selecții și dialoguri manual în `resources/js/canvas.js`. Există etichete ARIA punctuale, dar nu există panou dedicat de accesibilitate și nu există teste automate de accesibilitate.

**Impact:** focus trapping, ordine de tab, anunțarea erorilor, operarea fără pointer și contrastul pot eșua în fluxurile centrale.

**Decizie 14 iulie 2026 (seara):** un panou de accesibilitate fusese construit inițial în canvas (vezi prima versiune a secțiunii 15), dar userul a decis explicit să renunțe la el acolo — "acolo oricum customizezi tu, faci cum vrei tu" — și a redirecționat efortul către homepage și blog în schimb (vezi WEB-02, constatare nouă mai jos, secțiunea 15 actualizată). Codul din `resources/views/canvas/show.blade.php`, `resources/js/canvas.js` și `resources/css/canvas.css` a fost repus la starea dinainte de acel panou.

**Remediere:** audit WCAG 2.2 AA cu tastatură, NVDA/VoiceOver și axe, direct pe canvas; definește componente accesibile reutilizabile pentru dialog, menu, tabs și live regions. **Rămâne integral deschisă, asumat de user.**

**Criteriu de verificare:** toate fluxurile principale ale canvasului sunt complet operabile din tastatură, fără încălcări axe serioase și cu focus vizibil/restaurat.

### WEB-02 — Nicio opțiune de accesibilitate vizibilă pe paginile publice (nou, 14 iulie 2026) — ✅ Rezolvat 14 iulie 2026

**Severitate:** Mediu  
**Stare:** ✅ Rezolvată  
**Domeniu:** UX, accesibilitate, marketing

**Dovadă (problema originală):** homepage-ul și blog-ul (paginile pe care le vede orice vizitator, inclusiv înainte de a crea cont) nu ofereau nicio opțiune vizibilă de accesibilitate — niciun control de contrast, mărime text sau reducere mișcare, în ciuda unui hero cu carusel animat.

**Remediere aplicată:** widget flotant de accesibilitate (`marketing/partials/accessibility-widget.blade.php`), buton rotund jos-stânga cu pictograma universală de accesibilitate, prezent **doar pe homepage și blog** (nu pe `/contact` sau paginile legale — scop limitat explicit de user). Panou cu 3 comutatoare reale: contrast mare (prin variabilele CSS din `marketing.css`), text mărit, reducere mișcare (plus `@media (prefers-reduced-motion: reduce)` independent de toggle). Preferințe persistate în `localStorage`.

**Verificare** (Playwright, browser real): widget prezent pe `/` și `/blog`, absent pe `/contact` și `/privacy` — confirmat automat; cele 3 comutatoare aplică efectiv clasele pe `<html>`; Escape închide panoul; preferințele supraviețuiesc unui reload; zero erori în consolă.

**Criteriu de verificare:** toate fluxurile principale sunt complet operabile din tastatură, fără încălcări axe serioase și cu focus vizibil/restaurat — **verificat automat pentru panoul de accesibilitate; restul canvasului nerevalidat cu cititor de ecran real.**

### SEO-01 — Cache-ul sitemapului nu este invalidat la publicare

**Severitate:** Scăzut  
**Stare:** Confirmată  
**Domeniu:** SEO

**Dovadă:** `SitemapController.php:17-44` păstrează XML-ul 3.600 s; nu există invalidare observată în fluxurile de creare/editare a posturilor.

**Impact:** paginile publicate, retrase sau marcate noindex pot rămâne până la o oră într-o stare inconsistentă.

**Remediere:** invalidează cheia la schimbarea statusului, slugului, taxonomiilor sau noindex; păstrează TTL ca fallback.

**Criteriu de verificare:** după publicare/retragere, următoarea cerere sitemap reflectă imediat starea.

### LEG-01 — Politicile legale nu descriu procesarea reală a datelor

**Severitate:** Mediu  
**Stare:** Confirmată  
**Domeniu:** legal, confidențialitate

**Dovadă:** `LegalController.php:13-18`, 28-33 și 43-48 conține câte patru paragrafe generice. Politica nu identifică operatorul/datele de contact, temeiurile, retenția, transferurile, procesatorul AI, tipurile de conținut trimise, drepturile complete sau mecanismul de cookie consent. În același timp, aplicația trimite text și imagini către API-ul AI (`AiService.php`).

**Impact:** informare potențial incompletă și nealiniere între produs și promisiunile publice; risc crescut pentru utilizatori minori sau conținut educațional sensibil.

**Remediere:** review juridic pentru jurisdicțiile țintă; inventar de date/procesatori, DPA, retenție, ștergere, export, transferuri și consimțământ. Nu afirma utilizarea analytics până când implementarea și consent-ul sunt documentate.

**Criteriu de verificare:** data map-ul și configurația reală corespund textelor publice și există proceduri testate pentru solicitările persoanelor vizate.

### LEG-02 — Politica de confidențialitate nu acoperă datele din formularul de contact și newsletter (nou, 14 iulie 2026) — ✅ Rezolvat 14 iulie 2026

**Severitate:** Mediu  
**Stare:** ✅ Rezolvată — **confirmat de user**, netestat independent de audit  
**Domeniu:** legal, confidențialitate

**Dovadă (problema originală):** `LegalController::privacy()` enumera explicit tipurile de date colectate (cont, securitate, conținut notebook, PDF-uri, favorite) dar nu menționa cele două categorii noi introduse pe 14 iulie: mesajele din `/contact` (`ContactMessage`: nume, telefon, email, text liber) și adresele din formularul de newsletter (`NewsletterSubscriber`).

**Impact:** informare incompletă către utilizator despre o categorie reală de date personale colectate.

**Stare curentă:** userul a confirmat rezolvarea. **Notă de rigoare:** nu am re-verificat eu însumi textul din `/privacy` în acest pas — dacă politica nu a fost de fapt actualizată încă, semnalează, ca să reintroducem constatarea.

### OPS-02 — Extensia `intl` poate eșua silențios sub server web, deși CLI o raportează activă (nou, 14 iulie 2026) — ✅ Rezolvat 14 iulie 2026

**Severitate:** Ridicat  
**Stare:** ✅ Rezolvată pe mediul local; **verificare pe Forge confirmată de user**  
**Domeniu:** operare, deployment

**Dovadă (problema originală):** panoul `/admin` întorcea `500` (`RuntimeException: The "intl" PHP extension is required...`) pe orice pagină Filament care formata numere, deși `php -m` din CLI raporta `intl` activ. Cauza: `php_intl.dll` are nevoie de 4 DLL-uri ICU aflate lângă `php.exe`; Apache (`httpd.exe`) rulează dintr-un director diferit și nu le găsea — eșec invizibil pentru `php artisan test`, care rulează exclusiv prin CLI.

**Impact:** o extensie confirmată "activă" prin verificare CLI poate fi complet nefuncțională sub SAPI-ul real folosit de web server.

**Stare curentă:** fix local aplicat (DLL-uri ICU copiate lângă `httpd.exe`, Apache repornit) și verificat vizual atunci. Userul a confirmat separat că `intl` funcționează și pe infrastructura de producție (Forge). **Recomandare păstrată pentru viitor:** după orice schimbare de versiune PHP pe Forge, re-verifică explicit `php -m | grep intl` cu binarul folosit efectiv de php-fpm, nu doar presupune.

### OBS-01 — Lipsesc observabilitatea și obiectivele operaționale explicite

**Severitate:** Scăzut  
**Stare:** Confirmată prin absența instrumentării aplicației  
**Domeniu:** operare

**Dovadă:** nu există health checks de aplicație, metrici de business/AI, correlation IDs, alertare sau SLO-uri în codul analizat. Storage este configurat să nu arunce și să nu raporteze erori.

**Impact:** erorile de salvare, costurile AI și degradarea latenței pot rămâne nedetectate.

**Remediere:** health/readiness endpoints, logging structurat, error tracking, metrici de latență/rate/cost/storage și alerte cu runbook.

**Criteriu de verificare:** incidentele simulate generează semnal, alertă și suficiente date pentru diagnostic.

### ARC-01 — Bundle-ul canvas este monolitic și greu de testat

**Severitate:** Scăzut  
**Stare:** Confirmată  
**Domeniu:** mentenanță

**Dovadă:** `resources/js/canvas.js` are aproximativ 9.739 linii și 472.758 bytes; `resources/css/canvas.css` are aproximativ 4.084 linii și 89.888 bytes. Build-ul produce un singur chunk canvas de 182,16 kB minificat.

**Impact:** risc ridicat de regresii, ownership neclar, testare unitară dificilă și cost mare al schimbărilor.

**Remediere:** extrage incremental module pentru API, document state, autosave, AI, library, dialogs și canvas primitives; introdu teste înaintea fiecărei extracții.

**Criteriu de verificare:** modulele au interfețe explicite și teste; chunkingul și comportamentul rămân stabile.

### DOC-01 — Documentația proiectului este încă README-ul generic Laravel

**Severitate:** Scăzut  
**Stare:** Confirmată  
**Domeniu:** onboarding, operare

**Dovadă:** `README.md` descrie frameworkul Laravel, nu Notelevel, versiunile necesare, domeniul local, seed-urile, storage-ul, AI-ul sau procedura de test.

**Impact:** setup inconsistent, exact tipul de problemă observat în alegerea PHP 8.2 vs 8.3.

**Remediere:** documentează prerequisites, setup reproductibil, domenii, joburi, cron, storage link, seed, variabile AI, test/build/deploy și troubleshooting.

**Criteriu de verificare:** un dezvoltator nou pornește proiectul dintr-un checkout curat folosind numai README-ul.

## 5. Puncte pozitive confirmate

- Resursele tenant-scoped folosesc un global scope și completează automat `user_id` în requesturile autentificate (`BelongsToTenant.php:9-21`).
- Căile private includ ID-ul utilizatorului și ID-ul entității; fișierele sunt servite prin controllere autentificate, nu direct din public.
- Adminul Filament este limitat prin `User::canAccessPanel()` la rolul `admin` (`User.php:82-90`).
- Loginul are rate limiting, iar verificarea email folosește semnătură și throttling.
- Autosave-ul REST include versiune și condiție pe `user_id` (`DocumentController.php:113-136`), o bază bună pentru concurență optimistă.
- Migrațiile includ chei străine, cascade/null-on-delete și mai multe unicități per utilizator.
- SEO include sitemap, robots, canonical/OG/JSON-LD și middleware `X-Robots-Tag` pentru aplicație.
- Build-ul de producție și auditurile de dependențe trec în mediul compatibil.

## 6. Audit pe produs și fluxuri

### Ce este coerent

Produsul are o propunere recognoscibilă: canvas digital, documente/foldere, import PDF, favorite, funcții AI, demo fără fricțiune și planuri cu cote. Separarea marketing–aplicație prin `noindex` este rezonabilă după consolidarea pe un singur domeniu. Contul afișează consumul și limitele, ceea ce reduce surprizele de plan.

### Riscuri de produs

- Nu există dovezi end-to-end că trecerea demo → cont păstrează sau transferă conținutul. Fluxul actual deloghează guest-ul înainte de register (`DemoController.php:65-73`), deci trebuie decis și testat explicit ce se întâmplă cu lucrul creat.
- `max_favourites` există în schema de plan, dar nu este aplicat; promisiunea comercială și enforcementul nu sunt aliniate.
- Exportul PDF este reprezentat ca entitlement, dar trebuie testat pe ambele suprafețe API și în demo.
- Lipsesc stări produs clare pentru offline, conflict de autosave, storage failure și provider AI indisponibil.

## 7. Registru de datorie tehnică și funcționalități incomplete

Aceste elemente nu sunt prezentate automat ca vulnerabilități:

| Element | Tip | Recomandare |
|---|---|---|
| Controller legacy cu dispatcher `action` | Datorie tehnică majoră | Deprecare etapizată și servicii comune |
| API REST paralel | Migrare incompletă | Contract unic, versionat |
| `Infographics` redat ca placeholder în canvas | Funcționalitate incompletă | Ascundere până la implementare sau marcaj „coming soon” |
| README generic | Datorie operațională | Documentație Notelevel |
| Testele Example/Unit placeholder | Datorie de testare | Înlocuire cu teste de produs |
| CSS/JS canvas monolitic | Datorie de mentenanță | Modularizare incrementală |
| Curs AI configurabil static și tabel `currency_rates` separat | Posibilă dublare conceptuală | Sursă unică și timestamp al cursului |
| Comentarii care spun că adminul va fi montat ulterior, deși este montat | Datorie de claritate | Actualizare comentarii |

## 8. Roadmap de remediere

### P0 — înainte de orice lansare

1. ✅ Mutațiile prin GET din `/canvas/api` au fost eliminate; GET are allowlist read-only și teste de regresie.
2. ✅ Cerința proiectului și lockfile-ul au fost aliniate la PHP `^8.3`; platform check trece pe PHP 8.3.29.
3. ✅ Bootstrap-ul bazei de test a fost reparat; suita completă este verde.
4. ✅ **Reactivat 13 iulie 2026** (vezi secțiunea 13, "Verificare email prin Resend") — verificarea emailului este din nou obligatorie pentru `/dashboard`, cu emailuri reale trimise prin Resend. Recuperarea parolei **rămâne** indisponibilă (nu era parte din cererea curentă) — rutele `password.*` continuă să fie eliminate și testate ca atare.
5. ✅ Scrierile și ștergerile DB–filesystem sunt fail-fast și compensate; rollback-ul DB și restaurarea fișierelor sunt testate.

### P1 — înainte de producție

1. ✅ Validarea și cotele PDF/favorite sunt centralizate și aplicate pe API-ul REST și legacy.
2. ✅ AI folosește rezervări atomice persistente de buget, expirare, finalizare și throttling per utilizator.
3. ✅ Testele cross-tenant verifică listarea, modificarea, ștergerea și servirea fișierelor pentru documente, foldere, PDF-uri și favorite.
4. ✅ Datele controlate de utilizator sunt escapate în panoul Account; sunt active CSP și antete suplimentare de securitate.
5. ✅ Politicile descriu datele, AI-ul, procesatorii, retenția, drepturile, cookie-urile și pauza emailului. Este necesară validarea juridică înainte de publicare definitivă.
6. ✅ Există liveness `/up`, readiness `/health/ready`, request IDs, loguri structurate pentru storage/AI și webhook configurabil cu deduplicare pentru alerte.

### P2 — stabilizare

1. ✅ Operațiile comune pentru documente folosesc `DocumentManager`; API-ul legacy publică `Deprecation`, `Sunset` și successor link, cu termen implicit 31 decembrie 2026.
2. ✅ Listările REST și legacy sunt paginate în loturi de maximum 100; clientul canvas reunește loturile transparent. Reconstruirea sitemapului rulează în job cu retry/backoff.
3. ✅ Au fost remediate focus trapping/restoration, dialog semantics, tab states, focus vizibil și reduced motion. Testele statice sunt verzi; validarea manuală NVDA/VoiceOver rămâne o acțiune umană înainte de producție.
4. ✅ Autosave-ul cere UUID de idempotency, recunoaște replay-ul, respinge reutilizarea cheii cu alt conținut și întoarce conflictul curent fără retry distructiv.
5. ✅ Postările, categoriile și tagurile invalidează imediat cache-ul sitemapului și programează reconstruirea după commit.

### P3 — îmbunătățiri

1. Modularizează canvas JS/CSS cu teste de caracterizare. *(neînceput)*
2. Actualizează documentația și runbook-urile. *(neînceput — README tot generic)*
3. Adaugă bugete de performanță și monitorizare Web Vitals. *(neînceput)*
4. Clarifică fluxul demo → cont și funcțiile placeholder pe baza metricilor de produs. *(parțial — placeholder-ul "Infographics" încă există în bibliotecă, dar homepage-ul nu mai promite funcția, vezi secțiunea 15)*

### P4 — cerute explicit de user (actualizat 14 iulie 2026, seara)

**Rezolvate azi:**
1. ✅ **Rate limiting la `/register`** (AUTH-02) — `throttle:6,1` adăugat, test automat verde.
2. ✅ **Widget de accesibilitate pe homepage + blog** (WEB-02) — vezi secțiunea 15. Construit inițial în canvas, apoi **mutat explicit** pe paginile publice la cererea userului; canvas-ul a rămas neschimbat (UX-01 rămâne deschisă acolo, deciziune asumată). Testat automat (Playwright): prezent doar pe `/` și `/blog`, absent pe `/contact`/`/privacy`.

**Planificate pentru viitor — neurgente, asumate explicit de user:**
3. **Zoom pe canvas** — neimplementat. Fără impact de securitate/date; pur funcțional.
4. **Accesibilitatea canvasului** (UX-01) — rămâne integral deschisă; userul gestionează separat customizarea acelei zone.
5. **Criptare completă a conținutului utilizatorilor** ("nimeni să nu poată vedea ce e acolo") — neimplementat; fișierele din discul `tenants` sunt stocate în clar. Efort estimat: 1-3 săptămâni, risc real (vezi discuția separată din sesiune — cheia de criptare pierdută = date irecuperabile). Recomandare păstrată: **backup înainte de criptare**, nu invers.
6. **Backup configurat** — tot neimplementat (nici `spatie/laravel-backup`, nici `SoftDeletes` pe modelele cu conținut). Efort estimat: o jumătate de zi, risc zero (operațiune pur adăugată). Recomandare: prioritizează asta înaintea criptării, exact pentru că protejează împotriva eșecurilor viitoare, inclusiv ale criptării înseși.

Niciunul dintre punctele 3-6 de mai sus nu blochează lansarea din perspectiva acestui audit — sunt asumate explicit de user ca fiind de făcut ulterior, nu ca riscuri ignorate.

### Quick wins

- ✅ Schimbă ruta legacy din `GET|POST` în POST pentru mutații și whitelist pentru reads.
- ✅ Adaugă `verified` pe grupul API.
- ✅ Schimbă cerința PHP în `^8.3` și valideaz-o în CI.
- ✅ Folosește `textContent` pentru nume/email în panoul de cont.
- ✅ Adaugă `max` și verificarea `max_favourites` la upload.
- ✅ Activează `throw`/`report` pe storage în producție.
- Înlocuiește README-ul generic cu instrucțiuni minime reproductibile. *(încă deschis)*
- Adaugă `throttle` pe `POST /register` (AUTH-02). *(nou, încă deschis)*

## 9. Plan minim de teste necesare

### Securitate și tenancy

- Toate acțiunile mutante legacy resping GET și cer CSRF.
- Utilizatorul A nu poate lista, modifica, șterge sau descărca resursele utilizatorului B, nici prin route model binding, nici prin dispatcherul legacy.
- ID-uri inexistente și ID-uri cross-tenant produc același răspuns sigur.
- Neverified, guest, regular și admin au matricea de acces așteptată.

### Documente și storage

- Create/update/rename/move/duplicate/delete cu coliziuni și limite.
- Autosave acceptat, conflict de versiune `409`, două cereri concurente și retry idempotent.
- Eșec la scriere/copie/ștergere storage cu rollback și fără pierderea versiunii vechi.
- Payload maxim, număr maxim de pagini și imagine base64 invalidă.

### PDF și favorite

- MIME real invalid, fișier supradimensionat, număr/size quota și upload concurent.
- Page order cu duplicate, valori lipsă, negative și în afara intervalului.
- Ștergere folder cu relații și fișiere, plus recuperare la I/O failure.

### AI

- Fiecare acțiune permisă/interzisă per plan.
- Cap atins, cap aproape atins, cost necunoscut și cereri concurente.
- Timeout, 429, 5xx, răspuns malformed, schemă invalidă și indisponibilitate provider.
- Niciun mesaj brut al providerului sau conținut sensibil în răspuns/log.

### UI, accesibilitate și SEO

- Login/register/verify/demo/dashboard/account și flux complet de creare–salvare–redeschidere.
- Tastatură, focus, dialogs, menus, tabs, zoom/reflow, contrast și screen reader.
- Test XSS pentru toate valorile interpolate.
- Canonical, OG, JSON-LD, noindex, robots și sitemap după publicare/retragere.

### Acceptanță pentru lansare

Lansarea poate fi reconsiderată numai când:

1. ✅ toate elementele P0 sunt închise și demonstrate prin teste;
2. ✅ suita rulează verde într-un mediu curat (84 teste, 267 assertions) — **CI tot neconfigurat formal**, rulat doar manual;
3. ✅ testele de izolare cross-tenant și CSRF sunt verzi;
4. ✅ storage failure nu produce succes fals sau pierdere de date;
5. ✅ costul AI are limitare atomică și throttling;
6. ✅ politicile legale reflectă procesarea reală (excepție: LEG-02, datele din contact/newsletter, și lipsa unei validări juridice umane);
7. ✅ există monitorizare și procedură de rollback de bază (`/health/ready`, loguri structurate, webhook de alertă) — fără agregare/dashboard real.

**Toate cele 7 condiții sunt substanțial îndeplinite la 14 iulie 2026.** Ce nu e acoperit de nicio condiție de mai sus, dar rămâne relevant pentru decizia de lansare: backup, criptare la rest, zoom, rate limiting la înregistrare, accesibilitate validată de un om — vezi P4 în secțiunea 8.

## 10. Concluzie

**Actualizare 14 iulie 2026:** concluzia de mai jos, din 10 iulie, e păstrată ca istoric — reflecta corect starea de atunci. Starea curentă e fundamental diferită: toate blocajele descrise (endpoint GET mutabil, runtime inconsistent, atomicitate storage, acoperire de test) sunt rezolvate și verificate, plățile Stripe funcționează live cu tranzacții reale, iar verificarea de email e activă prin Resend. Notelevel a trecut de la "prototip avansat" la "produs funcțional cu plăți reale", dar nu e încă un serviciu complet operat: nu are backup, nu are criptare la rest pentru conținutul userilor, nu are CI/CD formal, iar accesibilitatea n-a fost niciodată validată de un om cu un cititor de ecran real. Recomandarea practică: **poate lansa** dacă echipa acceptă explicit aceste riscuri reziduale ca fiind cunoscute și tolerabile pe termen scurt, cu un angajament clar de a rezolva măcar backup-ul și criptarea (cerute explicit) într-un interval scurt post-lansare.

**Concluzia originală, 10 iulie 2026 (istoric):** Notelevel este mai aproape de un prototip avansat decât de un serviciu pregătit pentru producție. Fundația Laravel și modelarea domeniului sunt suficiente pentru a continua, iar build-ul și dependențele nu indică probleme imediate. Totuși, endpointul legacy mutabil prin GET, inconsistența runtime-ului, lipsa atomicității storage și acoperirea de test insuficientă fac riscul de lansare inacceptabil în forma actuală.

Ordinea corectă este: securizarea contractelor HTTP, stabilizarea mediului și a testelor, garantarea integrității/izolării datelor, apoi controlul AI și auditul UX dinamic. Refactorizarea monolitului canvas trebuie făcută ulterior, incremental, după introducerea testelor de caracterizare.

## 11. Migrare autosave — status pe etape (pornită 13 iulie 2026)

Context: vezi corecția la P2-1 de la începutul documentului. Migrarea reală a fluxului de salvare canvas de pe `/canvas/api` (legacy) pe `documents/{document}/autosave` (nou, testat) se face în etape independent-verificabile și reversibile, cu fallback pe calea legacy păstrată funcțională până la capăt.

| Etapă | Descriere | Status |
|---|---|---|
| 0 | Backend: endpoint nou `documents/{document}/pages` pentru imagini de pagină (JPEG raster), care lipsesc complet din contractul `autosave` | ✅ Făcut (13 iulie) |
| 1 | Client: `canvas.js` capătă tracking de `currentDocumentId`/`currentVersion`, fără schimbare de rețea | ✅ Făcut (13 iulie) |
| 2 | Client: autosave real de fundal, dual-write alături de salvarea explicită, în spatele unui feature flag | ✅ Făcut (13 iulie), flag ON |
| 3 | Client: promovarea autosave la calea principală de salvare; legacy devine fallback | ✅ Făcut (13 iulie), flag ON |
| 4 | Curățenie: eliminare flag-uri, monitorizare permanentă | ✅ Făcut (13 iulie) |

Detalii complete ale planului (inclusiv întrebările deschise de produs/design pentru etapele 2-3) în planul de sesiune asociat, nu duplicate aici pentru a evita divergența dintre documente pe măsură ce planul evoluează.

**Etapa 0 — detalii implementare (13 iulie 2026):**
- `DocumentController::savePages()` ([app/Http/Controllers/DocumentController.php](app/Http/Controllers/DocumentController.php)) — nou endpoint `POST documents/{document}/pages`, reutilizează `TenantStorageTransaction::replaceDirectory()` cu aceeași convenție de path ca fluxul legacy (`{userId}/documents/{documentId}/pages/{n}.jpg`), astfel încât acțiunea de citire `page_image` funcționează neschimbat indiferent de calea de salvare folosită.
- Update parțial: doar paginile trimise sunt înlocuite — paginile existente, netrimise, sunt citite și incluse în setul scris, ca `replaceDirectory` (care înlocuiește tot directorul) să nu șteargă paginile neatinse.
- Cota de pagini per plan e acum partajată printr-o metodă nouă `PlanQuotaService::canvasPagesCapExceeded()`, ca ambele căi (legacy și nouă) să numere consecvent față de aceeași limită.
- Test nou `tests/Feature/DocumentPagesEndpointTest.php` (6 teste: scriere+citire round-trip, update parțial fără pierderea paginilor vechi, respingere payload invalid, izolare cross-tenant, aplicare cotă). Suita completă rulează verde: **57 teste, 186 assertions**, fără regresii.
- Fără schimbări client în această etapă — `canvas.js` încă nu apelează noul endpoint (asta e Etapa 1+).

**Etapa 1 — detalii implementare (13 iulie 2026):**
- `canvas.js` capătă `currentDocumentId`/`currentVersion`, populate din date deja disponibile: `loadDocument()` le extrage din `file.documentUrl` (regex `id=`) și din noul câmp `version` returnat de `get_document`; `saveDrawing()` le capătă din răspunsul salvării (acum include `id`+`version`, aditiv). Resetate la `null` în `clearCurrentDocumentState()`. Persistate/restaurate prin `localStorage` alături de `currentFilename` (`saveSessionNow`/`restoreSessionData`).
- Backend: `CanvasApiController::getDocument()` și `::save()` întorc acum și `id`+`version` (aditiv — nimic din codul existent citea aceste chei, verificat prin citirea `loadDocumentData()`/`loadDocument()`).
- Rename/move/duplicate/folder-actions rămân neschimbate — id-ul documentului deschis nu se schimbă la redenumire/mutare, deci nu necesită actualizare de `currentDocumentId`.
- Verificare: suita completă de teste PHP rulează verde (57 teste, 186 assertions, fără regresii), `npm run build` trece fără erori de sintaxă. **Limitare**: nu există în acest mediu un tool de automatizare browser (ex. Playwright/chromium-cli) pentru un smoke-test real E2E — verificarea vizuală (deschidere `/demo`, desenare, salvare, confirmare `currentDocumentId` populat corect în consola browserului) rămâne de făcut manual.
- Nicio schimbare de comportament vizibilă utilizatorului în această etapă — pur pregătire de stare pentru Etapa 2.

**Etapa 2 — detalii implementare (13 iulie 2026):**
- Flag nou `config('canvas.autosave_enabled')` (env `CANVAS_AUTOSAVE_ENABLED`, **implicit `false`**), injectat în `canvas.js` prin `window.CANVAS_AUTOSAVE_ENABLED` — nicio infrastructură de feature-flag existentă găsită, deci am adăugat una minimală, urmând convenția deja folosită pentru `CANVAS_DEMO_MODE` etc.
- `canvas.js`: `scheduleServerAutosave()`/`performServerAutosave()` — autosave de fundal cu debounce propriu de 8s (separat de debounce-ul de 2s al `localStorage`), declanșat din `scheduleSessionSave()` (același punct comun folosit de toate acțiunile de editare). Rulează doar când flag-ul e activ **și** documentul are deja `currentDocumentId`/`currentVersion` cunoscute (Etapa 1) — nu creează documente noi.
- Trimite `content` (reutilizează exact serializarea vectorială din `saveDrawing`, extrasă acum într-un helper comun `buildDocumentContentPayload()`), `request_id` (UUID nou per încercare, cu fallback pentru `crypto.randomUUID()` care necesită context securizat/HTTPS — `notelevel.test` local e doar HTTP), și `guideMode` mapat (`ruled→lined`, restul neschimbat).
- Imaginile de pagină NU se trimit prin autosave — merg separat, doar paginile modificate (`dirtyPages`), către endpoint-ul din Etapa 0 (`uploadDirtyPagesToServer()`), după un autosave reușit.
- La `409 version_conflict`: autosave-ul de fundal se oprește (`serverAutosaveBlocked`), utilizatorul vede un mesaj clar în `#saveStatus` ("acest document s-a schimbat în altă parte, reîncarcă pagina") — **nicio rezolvare automată/silențioasă**. UX-ul exact (modal blocant vs. text simplu) rămâne întrebare deschisă de produs (vezi planul de sesiune); implementarea curentă e varianta minimă, sigură, non-distructivă.
- La orice altă eroare (rețea, 422, 500): eșuează silențios, se reîncearcă la următoarea editare — salvarea locală (`localStorage`) rămâne plasa de siguranță, salvarea explicită (Ctrl+S) rămâne complet neschimbată.
- **Verificare**: suita completă de teste (57 teste, 186 assertions) verde, `npm run build` trece curat. Am simulat direct (fără browser, prin `curl` cu o sesiune reală de `/demo`) exact cererile pe care le trimite noul cod: creare document → autosave (versiune incrementată corect 1→2) → upload pagini → autosave cu versiune învechită → confirmat `409` cu `version_conflict`. Toate integrările funcționează exact cum se așteaptă codul client. Documentul de test a fost șters după verificare.
- Flag-ul a fost **activat** (`CANVAS_AUTOSAVE_ENABLED=true` în `.env`) odată cu Etapa 3, la cererea explicită a userului — nu există încă utilizatori reali de protejat printr-o perioadă de "bake", deci s-a sărit direct la promovare.

**Etapa 3 — detalii implementare (13 iulie 2026):**
- `saveDrawing()` din `canvas.js` e acum un dispecer: dacă flag-ul e activ, apelează noua `saveDrawingRest()`; altfel, `saveDrawingLegacy()` (codul vechi, complet neschimbat, redenumit). Comutarea înapoi la legacy = doar `CANVAS_AUTOSAVE_ENABLED=false` + `config:clear`, fără nicio altă schimbare de cod.
- `saveDrawingRest()`: dacă documentul deschis are deja `currentDocumentId`/`currentVersion` cunoscute (Etapa 1) și numele nu s-a schimbat, salvează direct prin `autosave()` + upload de pagini modificate. Altfel (document nou sau "Save As" cu alt nume), rezolvă/creează documentul prin `POST /documents`.
- **Backend, `DocumentController::store()`** extins minimal (aditiv, nimic din contractul vechi rupt — verificat, nu exista niciun consumator al formei vechi de eroare): acceptă acum `folder` (nume, creează folderul dacă lipsește, exact ca fluxul legacy) pe lângă `folder_id` existent, și `overwrite` (dacă e `true` peste un titlu existent, actualizează acel document — `version+1` — în loc să arunce eroare; dacă e `false`, întoarce `409 {exists:true}` în loc de o eroare de validare generică, ca UI-ul de confirmare "Overwrite?" să funcționeze identic cu fluxul legacy).
- Teste noi `tests/Feature/DocumentStoreOverwriteTest.php` (creare folder după nume, respingere coliziune fără overwrite, overwrite actualizează documentul existent fără duplicat) — toate verzi.
- **Verificare end-to-end** (din nou prin `curl` cu sesiune reală `/demo`, nu doar teste unitare): creare document cu folder nou după nume → coliziune pe același nume fără overwrite → `409` → overwrite → document actualizat (`version` 1→2, același `id`, nu duplicat) → autosave pe acel document (`version` 2→3) → upload pagini → șters la final. Exact secvența pe care o execută `saveDrawingRest()` în realitate.
- Suita completă: **60 teste, 196 assertions**, toate verzi. `npm run build` trece curat.
- Codul legacy (`saveDrawingLegacy`, `CanvasApiController::save()`) rămâne complet prezent și funcțional — nu a fost șters nimic, doar ocolit condiționat de flag.

**Notă operațională — CSS lipsă în dev local (13 iulie 2026):** de mai multe ori în timpul zilei, pagina servită prin XAMPP a apărut nestilizată. Cauza, de fiecare dată: fișierul `public/hot` (marker Laravel că un server Vite dev rulează) reapărea din cauza unor procese `npm run dev` rămase pornite dintr-o sesiune anterioară de testare (via Herd), care recreau fișierul periodic. Rezolvare finală: procesele Vite dev rămase au fost oprite explicit și `public/hot` șters; `public/build` (build de producție) e sursa stabilă de assets pentru accesul prin XAMPP. **Nu porni `npm run dev`** dacă vrei ca site-ul din XAMPP să rămână stilizat corect — după orice modificare în `resources/js` sau `resources/css`, rulează `npm run build` în loc.

**Etapa 4 — detalii implementare (13 iulie 2026):**
- **Flag-ul devine implicit `true`** (`config/canvas.php`: `env('CANVAS_AUTOSAVE_ENABLED', true)`, actualizat și în `.env.example`). Deliberat **nu** a fost eliminat/hardcodat în cod — rămâne un veritabil kill-switch: `CANVAS_AUTOSAVE_ENABLED=false` + `php artisan config:clear` întoarce instant la calea legacy, fără niciun deploy de cod.
- **Decizie explicită pe soarta codului legacy**: `CanvasApiController::save()` și `saveDrawingLegacy()` din `canvas.js` **rămân în cod**, nešterse. Sunt deja marcate `legacy.deprecated` (adaugă header-e `Deprecation`/`Sunset`) și reprezintă singura cale de rollback fără deploy. Ștergerea lor e o decizie separată, ulterioară, după o perioadă reală de funcționare fără incidente — nu s-a considerat responsabil să fie șterse în aceeași sesiune în care ruta nouă a fost promovată la calea principală, indiferent de faptul că nu există încă utilizatori reali de protejat.
- **Monitorizare adăugată** (nu exista nicio infrastructură de metrici — s-au folosit loguri structurate, urmând convenția deja existentă `tenant_storage.*`): `canvas.autosave_version_conflict` (warning, la fiecare 409), `canvas.autosave_idempotency_key_reused` (warning, la fiecare 422 de tip idempotency), `canvas.autosave_pages_quota_exceeded` (info, la fiecare 402 de cotă pagini). Eșecurile reale de scriere pe disk erau deja acoperite generic de `OperationalAlert`/exception handler; ce lipsea era semnalul pentru răspunsurile "silențioase" (409/422/402), care nu sunt excepții.
- Teste noi/extinse: `P2AutosaveTest` și `DocumentPagesEndpointTest` verifică acum explicit (`Log::spy()`) că fiecare din cele 3 evenimente se loghează corect cu contextul așteptat (`document_id`, versiuni etc.).
- **Verificare**: suită completă — **60 teste, 199 assertions**, verde. `npm run build` curat. Flag confirmat `true` în pagina servită live prin XAMPP.
- **Ce rămâne, deliberat, pentru mai târziu** (nu parte din "curățenie", ci decizii separate de operare): dashboard/alertare reală pe aceste loguri (azi sunt doar scrise în `storage/logs/laravel.log`, fără agregare), și decizia de ștergere a codului legacy după o perioadă de observare.

**Fix separat, azi**: cursorul care nu clipea la focus pe inputul gol din chat-ul AI — `resources/css/canvas.css`, regula `.chat-input:empty { caret-color: transparent; }` ascundea cursorul necondiționat, inclusiv când inputul era focusat. Corectat la `.chat-input:empty:not(:focus)`, ca placeholder-ul să rămână fără cursor doar când inputul NU e focusat.

**Fix separat, azi**: meniul dropdown „AI" (`ai-menu`) rămânea deschis (`is-open`) după ce utilizatorul comuta switch-ul „Chat" din interiorul lui — codul îl redeschidea deliberat. Înlocuit cu `closeToolbarMenus()`, ca meniul să se închidă normal, la fel ca restul meniurilor din toolbar.

**Fix separat, azi**: header-ul de pe site-ul de marketing (`.site-header`) se lipea de marginile ecranului sub 900px lățime — o regulă `.header-inner { padding-inline: 0; }` din `resources/css/marketing.css` anula explicit padding-ul moștenit din `.container`. Eliminată; header-ul păstrează acum padding-ul standard (32px tabletă, 20px mobil) la orice lățime.

## 12. Integrare Stripe (13 iulie 2026)

**Context**: planul Premium exista doar ca date (`Plan::price_cents`), fără nicio cale reală de plată. Userul a creat produsul în Stripe (mod **Live**, decontare în RON, preț de bază 6.99 GBP → 35 RON) și a cerut integrarea completă.

**Ce s-a construit:**
- Pachet `stripe/stripe-php` (`^20.3`) adăugat în `composer.json`.
- `config/services.php` → intrare `stripe` (`key`, `secret`, `webhook_secret`, `premium_price_id`), citite din `.env` (`STRIPE_KEY`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PREMIUM_PRICE_ID`).
- Migrare nouă: `users` capătă `stripe_customer_id`, `stripe_subscription_id`, `stripe_subscription_status`.
- `app/Http/Controllers/BillingController.php` — `checkout()` creează (sau reutilizează) un Customer Stripe pentru user, apoi o Checkout Session în mod `subscription` pentru `STRIPE_PREMIUM_PRICE_ID`, și redirecționează către pagina de plată găzduită de Stripe. `success()`/`cancel()` doar redirecționează înapoi spre `/account` cu un mesaj — **planul se activează exclusiv din webhook**, niciodată din redirect-ul de succes (Stripe poate livra webhook-ul înainte sau după redirect).
- `app/Http/Controllers/StripeWebhookController.php` — verifică semnătura (`Stripe-Signature` + `STRIPE_WEBHOOK_SECRET`), respinge cu `400` orice payload nesemnat corect. Tratează: `checkout.session.completed` (activează planul Premium + salvează `customer`/`subscription` id-uri), `customer.subscription.updated` (sincronizează statusul, retrogradează la Free dacă statusul devine `canceled`/`unpaid`/`incomplete_expired`), `customer.subscription.deleted` (retrogradează la Free). Toate evenimentele se loghează (`stripe.subscription_activated`/`_downgraded`, `stripe.webhook_signature_invalid`, etc.).
- Rute noi în `routes/web.php`: `POST /billing/checkout`, `GET /billing/success`, `GET /billing/cancel` (toate `auth`), `POST /stripe/webhook` (fără `auth` — Stripe apelează server-to-server; autenticitatea vine din semnătură, nu din sesiune). CSRF exceptat explicit pentru `stripe/webhook` în `bootstrap/app.php`.
- Butonul „Upgrade to Premium (coming soon)" din `resources/views/account/index.blade.php` e acum funcțional (POST către `billing.checkout`); adăugat și un banner pentru mesajele flash de status.
- Teste noi (`tests/Feature/StripeWebhookTest.php`): activare plan la `checkout.session.completed` (cu semnătură HMAC generată real, ca în producție), retrogradare la `customer.subscription.deleted`, respingere cu `400` la semnătură invalidă. Suită completă: **63 teste, 209 assertions**, verde.

**Ce NU am testat automat, deliberat**: `BillingController::checkout()` nu are test automat — ar apela API-ul **live** real al Stripe (creează un Customer + o Checkout Session reale în contul live), ceea ce nu e potrivit pentru o suită de teste rulată des. Verificat doar logica de business (webhook) cu chei/semnături simulate.

**Actualizare 14 iulie 2026**: webhook secret configurat (`STRIPE_WEBHOOK_SECRET` prezent în `.env`, endpoint creat în Stripe Dashboard) și testarea end-to-end reală a fost efectuată de user — ambele puncte de mai jos (1 și 2) sunt **rezolvate**.

**Ce rămâne de făcut, cu userul:**
1. ~~**Webhook secret** — încă nu există...~~ ✅ Rezolvat 14 iulie 2026.
2. ~~**Testare end-to-end**...~~ ✅ Rezolvat 14 iulie 2026.
3. Fără portal de gestionare a abonamentului (anulare/schimbare card) — userul ar trebui direcționat către Stripe Customer Portal pentru asta, neconstruit încă.

**Extindere — checkout pentru vizitatori neautentificați (13 iulie 2026):**

Butonul „Start Pro" de pe pagina principală (`resources/views/marketing/home.blade.php`) ducea către o ancoră moartă (`#start`). Cerință: să ducă direct la plată, inclusiv pentru vizitatori fără cont — Stripe le cere emailul la checkout, contul se creează abia după plată.

- **`app/Services/StripeCheckoutFulfillment.php`** (serviciu nou, comun): găsește userul după `client_reference_id` (checkout autentificat) sau după email (checkout ca vizitator) — dacă nu există cont cu acel email, îl creează (parolă aleatoare, hash-uită, `email_verified_at` setat, considerat verificat fiindcă a plătit real). Activează planul Premium și salvează datele Stripe. Folosit identic din webhook **și** din pagina de succes (idempotent — sigur de apelat de două ori pentru aceeași sesiune).
- **`BillingController::checkout()`**: pentru vizitatori, omite `customer`/`client_reference_id` din sesiunea Stripe — Stripe îi arată propriul câmp de email la checkout.
- **`BillingController::success()`**: preia sesiunea de la Stripe (API, folosind `session_id` din URL), rulează `fulfill()`. Dacă a rezultat un **cont nou**, generează un link semnat (`URL::temporarySignedRoute`, expiră în 30 min) și redirecționează acolo — user-ul e logat automat și i se cere să-și seteze parola. Dacă emailul aparținea deja unui cont existent, **nu îl loghează automat** (risc de securitate — cineva ar putea folosi linkul de succes ca să intre pe alt cont) — îi cere să se autentifice normal; planul i s-a activat oricum, din webhook.
- **`GET/POST /billing/claim/{user}`** — rută nouă, `GET` protejată de middleware-ul `signed` (Laravel respinge automat linkuri expirate/modificate cu `403`, verificat prin test). `POST` verifică explicit că userul autentificat e chiar cel din link, altfel `403` (nu poți folosi propriul link de claim ca să preiei contul altcuiva).
- Buton „Start Pro" acum funcțional pentru oricine, autentificat sau nu.
- Teste noi: `StripeCheckoutFulfillmentTest` (cont nou, cont existent găsit după email fără duplicare, `client_reference_id`, eroare când nu poate identifica userul), `BillingClaimTest` (link valid loghează și arată formularul, link expirat/modificat respins cu `403`, setarea parolei prin flux, un user nu poate revendica link-ul altui user). Suită completă: **72 teste, 231 assertions**, verde.
- **Notă de securitate importantă, deliberată**: distincția "cont nou vs. cont existent" e esențială — fără ea, oricine ar afla un `session_id` de checkout finalizat (din istoricul browserului, logs, etc.) ar putea folosi pagina de succes ca să se autologheze pe alt cont. Auto-login se întâmplă *doar* pentru conturi create chiar în acea cerere.
- **Ce nu am testat automat, deliberat**: apelurile reale către Stripe API (`checkout->sessions->create()`/`retrieve()`) din `checkout()`/`success()` — ar folosi cheile **live** reale. Testat riguros doar logica de business din jurul lor (`fulfill()`, fluxul de claim).

**Bug real găsit în producție (13 iulie 2026) — CSP bloca redirectul către Stripe:** primul test real, în producție, cu date live, a scos la iveală un bug pe care niciun test automat/local nu l-a putut prinde: `app/Http/Middleware/SecurityHeaders.php` seta `form-action 'self'` — corect pentru orice submit de formular către propriul domeniu, dar **Chrome aplică `form-action` și asupra redirectului rezultat dintr-un submit**, nu doar asupra țintei inițiale. `BillingController::checkout()` redirecționează (302) către `checkout.stripe.com` după crearea sesiunii — un domeniu diferit, nepermis de `form-action 'self'`, deci browserul bloca redirectul cu eroare CSP, silențios (zero cereri către server, exact simptomul "nu se întâmplă nimic" raportat). Corectat la `form-action 'self' https://checkout.stripe.com`. Niciun test din suită nu a putut prinde asta local, pentru că necesită o sesiune de checkout Stripe reală, reușită, care redirecționează efectiv — exact genul de apel pe care l-am marcat mai sus ca "netestat automat, deliberat". Diagnosticat prin verificare directă a Price ID-ului via API-ul Stripe (a confirmat că prețul era `one_time`, nu `recurring` — problemă separată, rezolvată între timp de user) și prin inspectarea request-ului real din DevTools (Network tab), care a arătat clar `302` către `checkout.stripe.com` blocat de CSP.

**Extindere — monedă explicită la checkout, fără switch (13 iulie 2026):** Stripe Checkout arăta implicit prețul convertit automat prin „Adaptive Pricing", plus un switch ca vizitatorul să aleagă altă monedă — nedorit; site-ul are deja propria logică de conversie (`CurrencyResolver`, afișată pe pagina de prețuri), și trebuiau să coincidă exact, fără opțiune de schimbare la checkout.

- Prețul din Stripe (`price_1TsjwwAifgQBJZvhcUfQQHMS`, recurring, bază RON 35) a primit `currency_options` pentru toate monedele pe care `CurrencyResolver` le poate întoarce, calculate cu aceleași rate din `currency_rates`: **GBP 6.99, EUR 8.18, USD 8.88, AUD 13.49, CAD 12.16** — identice cu ce vede vizitatorul deja pe pagina de prețuri. RON rămâne doar moneda de bază/decontare a contului Stripe către bancă — clienții nu sunt niciodată taxați direct în RON, fiindcă `CurrencyResolver` nu întoarce niciodată acest cod (România e mapată la EUR, confirmat anterior ca intenționat).
- `BillingController::checkout()` calculează moneda cu **exact aceeași logică** (`CurrencyResolver::resolveCurrencyCode()`) folosită la afișarea prețului pe site, o trimite explicit către Stripe (`currency` la nivel de sesiune) și dezactivează Adaptive Pricing per-sesiune (`adaptive_pricing.enabled = false`) — Stripe nu mai negociază/arată switch, arată direct moneda pe care a văzut-o deja vizitatorul.
- **Verificat printr-un apel real către API-ul Stripe** (o sesiune de checkout creată direct, cu `currency=eur`): răspunsul a confirmat `currency: eur`, `amount_total: 818` — exact cifra așteptată. Sesiunea de test a rămas neatinsă (nimeni nu introduce card), expiră automat.
- Nu am automatizat un test pentru asta în suită, din același motiv ca restul apelurilor Stripe live — ar crea sesiuni reale la fiecare rulare de teste.

## 13. Verificare email prin Resend, curățare pagină /account, ajustări pricing (13 iulie 2026)

### Verificare email reactivată (reversează P0-4 de mai sus)

**Context**: verificarea emailului fusese pauzată deliberat (vezi P0-4, secțiunea 8). Userul a cerut reactivarea ei folosind Resend ca provider SMTP, cu domeniul propriu `notelevel.com`.

- Pachet `resend/resend-php` (`^1.5`) adăugat în `composer.json`; `.env` setat cu `MAIL_MAILER=resend`, `RESEND_API_KEY`, `MAIL_FROM_ADDRESS=noreply@notelevel.com` (curățate și liniile `MAIL_*` duplicate/conflictuale rămase din configurarea inițială pe `log`).
- Domeniul `notelevel.com` verificat în Resend prin înregistrări DNS (DKIM/SPF/MX de bounce) puse pe subdomeniul `send.notelevel.com`, în cPanel-ul unde sunt găzduite nameserverele reale ale domeniului (nu în Forge, care nu gestionează DNS-ul acestui domeniu) — confirmat explicit de user ca verificat.
- `App\Models\User` implementează acum `Illuminate\Contracts\Auth\MustVerifyEmail`.
- `routes/auth.php` — rutele `verification.notice`, `verification.verify`, `verification.send` sunt readăugate (view-ul `verify-email.blade.php` existent din scaffold Breeze nu fusese șters, doar de-rutat).
- `RegisteredUserController::store()` declanșează acum `event(new Registered($user))`.
- **Detaliu important, ne-evident**: Laravel 11+/12 fără `EventServiceProvider` nu descoperă automat listener-ul implicit `Illuminate\Auth\Listeners\SendEmailVerificationNotification` decât dacă e plasat în `app/Listeners`. A fost înregistrat explicit în `AppServiceProvider::boot()` (`Event::listen(Registered::class, SendEmailVerificationNotification::class)`) — altfel evenimentul se declanșa dar niciun email nu pleca, silențios.
- `/dashboard` (`routes/web.php`) cere acum middleware `['auth', 'verified']`, nu doar `auth`.
- **Verificat că nu rupe fluxul de guest checkout Stripe**: `StripeCheckoutFulfillment::fulfill()` seta deja `email_verified_at => now()` la crearea contului (considerat verificat fiindcă a plătit real, vezi secțiunea 12) — nemodificat, deci acei useri nu sunt blocați de noul middleware `verified`.
- `LegalController` — textele din `/privacy` și `/terms` afirmau explicit "Email verification... are temporarily disabled"; corectate să menționeze doar recuperarea parolei ca indisponibilă (verificarea email nu mai e adevărat dezactivată).
- Teste: `PausedEmailFeaturesTest` rescris (verifică acum trimiterea emailului de verificare via `Notification::fake()`, blocarea `/dashboard` până la verificare, și confirmă că password reset rămâne dezactivat). `P1OperationsTest` actualizat la noul text legal.
- **Notă operațională, mediu local XAMPP**: instalarea `resend/resend-php` a eșuat inițial — `composer` din PATH rula cu PHP 8.2.24 (`Program Files\php-8.2.24`), nu cu PHP 8.3.32 din `C:\xampp\php` (cerut de `filament/actions`/`openspout`, cazul general deja documentat la DEP-01). Rulat explicit cu binarul din XAMPP. A mai fost nevoie să se activeze extensiile `intl` și `zip` (comentate implicit) în `C:\xampp\php\php.ini`. **Detaliu ne-evident**: Apache (`mod_php`) încarcă `php.ini` o singură dată la pornire — activarea extensiilor nu a avut efect până la un restart explicit al Apache (oprire forțată a proceselor `httpd.exe` + repornire), altfel `/admin/profit-margins` (Filament, folosește `Number::currency()`) continua să dea 500 cu extensiile deja "activate" pe disc.

### Butonul „Upgrade to Premium" din modalul de cont (canvas) devine funcțional

Separat de butonul de pe pagina de marketing (deja funcțional din integrarea Stripe, secțiunea 12) și de cel din fosta pagină `/account` (ștearsă, vezi mai jos) — modalul de cont din interiorul aplicației canvas (`resources/js/canvas.js`, panoul deschis din `openUserPanel()`/`renderAccountPanel()`) avea propriul buton, `<button disabled>Upgrade to Premium (coming soon)</button>`, niciodată conectat la fluxul Stripe.

- Buton activat, wired la un submit de `<form>` dinamic către `billing.checkout` (același pattern folosit deja de butonul de sign-out — creare `<form>` cu `_token` hidden, `form.submit()`), URL injectat prin `window.CANVAS_BILLING_CHECKOUT_URL` în `canvas/show.blade.php`.
- Stil CSS (`acct-upgrade-btn`) schimbat din gri/`cursor:not-allowed` în indigo activ, consistent cu badge-ul `is-premium`.

### Eliminare completă a paginii /account (la cererea explicită a userului)

**Context**: modalul de cont din canvas conținea deja toate informațiile de pe pagina separată `/account` (nume, email, plan, uz AI, cote) — userul a cerut eliminarea completă a paginii, cu tot ce depindea de ea mutat în modal.

- Șterse: ruta `GET /account`, `AccountController::index()`, view-ul `resources/views/account/index.blade.php`. Rămâne doar `account.summary` (JSON, consumat de modal).
- Linkurile „Account" din `layouts/navigation.blade.php` (dropdown desktop + meniu responsive) eliminate — pagina țintă nu mai există.
- **Ștergere cont** (fostă acțiune pe pagina `/account`, cu modal Alpine separat) mutată inline în modalul canvas: click pe „Delete Account" randează un formular de confirmare cu parolă direct în panou (`renderAccountDeleteConfirm()`), trimis prin `fetch DELETE` către `profile.destroy` cu `Accept: application/json`. Eroare de parolă greșită afișată inline, fără reload; succes → `window.location.href` spre homepage. **Nicio schimbare necesară în `ProfileController::destroy()`** — validarea eșuată răspunde deja JSON corect (`{errors:{password:[...]}}`) când requestul cere `Accept: application/json`, indiferent de error bag (`userDeletion`) folosit pentru varianta Blade/sesiune; iar `fetch` urmează transparent redirectul `Redirect::to('/')` de pe calea de succes.
- **Redirect-urile de status post-checkout Stripe** (`BillingController` — "Payment received", "Checkout cancelled", "already Premium" etc., anterior spre `route('account')`) redirecționează acum spre `route('dashboard')`. Mesajul de status (`session('status')`) e citit în `canvas/show.blade.php` prin `window.CANVAS_STATUS_MESSAGE` și afișat ca toast temporar (6s, `.canvas-status-toast`) — nu exista niciun mecanism de toast în `canvas.js`, a fost adăugat minimal, fără dependențe noi.
- Teste actualizate: `BillingClaimTest` (assertRedirect spre `dashboard` în loc de `account`).

### Ajustări pagină de prețuri (marketing)

- Badge-ul „Most popular" de pe cardul Pro eliminat (Blade + regula CSS `.popular-badge`, orfană după eliminare).
- `MarketingController::home()` trimite acum `isPremium` (`auth()->check() && auth()->user()->plan?->name === 'premium'`). Butoanele de pe cardurile Free ("Start writing free"/link spre notebook) și Pro ("Premium", submit către checkout) sunt înfășurate în `@unless($isPremium)` — dispar quand userul autentificat e deja Premium.
- „Contact us" (cardul Teams/Schools) — era `<a href="#contact">`, dar secțiunea `#contact` nu există nicăieri pe pagină (link mort). Userul a confirmat că feature-ul e "încă în construcție". Schimbat în `<button disabled title="Coming soon">`, cu stil vizual dezactivat (`opacity:0.55`, `cursor:not-allowed`, adăugat generic pe `.btn:disabled` în `marketing.css`) — rămâne vizibil, dar clar non-funcțional, indiferent de planul userului.

### Verificare

Suita completă de teste PHP a rulat verde după fiecare grupă de schimbări din această secțiune (**72 teste, 234 assertions** la final, fără regresii). `npm run build` (Vite) rulat de fiecare dată după modificări în `canvas.js`/`canvas.css`/`marketing.css` pentru ca schimbările să ajungă în bundle-ul servit prin XAMPP.

**Actualizare 14 iulie 2026**: validarea manuală în browser a fluxurilor de UI (buton upgrade din modal, ștergere cont inline, toast de status, badge/butoane dispărute la pricing) a fost efectuată de user — **rezolvat**. Recomandarea generală de validare dinamică (accesibilitate NVDA/VoiceOver, axe, Lighthouse — vezi UX-01 și secțiunea "Limitări") rămâne totuși deschisă ca elemente separate, nemenționate ca acoperite.

## 14. Formular de contact, newsletter, panou admin, bug `intl`/Apache, corectare texte homepage (14 iulie 2026)

### Formular de contact și newsletter — stocare în DB + panou admin

**Context**: cerința inițială era doar trimitere de email la `dani.iancu@yahoo.com`; userul s-a răzgândit și a cerut stocare în baza de date, vizibilă în admin.

- Tabele noi `contact_messages` (nume, prenume, email, telefon, mesaj, timestamp) și `newsletter_subscribers` (email unic, timestamp), cu modele Eloquent corespunzătoare.
- `ContactController::send()` și `NewsletterController::subscribe()` salvează în DB **și** continuă să trimită email (decizie: ambele canale, nu doar unul — nu era clar dacă emailul trebuie eliminat, păstrat ca fallback de notificare imediată).
- Newsletter: `NewsletterSubscriber::firstOrCreate()` — reabonarea cu același email nu creează duplicate și nu retrimite emailul de notificare.
- Rate limiting `throttle:5,1` pe ambele rute POST.
- Panou Filament nou, grup de navigare „Contact": `ContactMessageResource` (căutare, ștergere, bulină roșie cu numărul de mesaje în sidebar — `getNavigationBadge()`) și `NewsletterSubscriberResource`. Card nou pe Dashboard cu numărul de abonați (`DashboardStats`).
- Acces admin verificat automat (non-admin primește `403`).
- Teste noi: `ContactFormTest`, `NewsletterSubscriptionTest`, `ContactAdminResourcesTest` (12 teste). Verificare end-to-end reală prin browser (Playwright): formular completat și trimis, înregistrare confirmată direct în baza de date MySQL locală, apoi ștearsă.
- **Neacoperit de LEG-01/politica de confidențialitate** — vezi LEG-02, constatare nouă în secțiunea 4.

### Logo Notelevel în emailuri (înlocuiește logo-ul Laravel)

- Template-urile de mail Laravel (`resources/views/vendor/mail/...`, publicate explicit din vendor) foloseau implicit logo-ul Laravel (`laravel.com/img/notification-logo-v2.1.png`) ori de câte ori titlul header-ului coincidea cu `config('app.name')`.
- Corectat: `resources/views/vendor/mail/html/header.blade.php` afișează acum `https://notelevel.com/marketing/favicon.png` (PNG, nu SVG — SVG nu se randează în Gmail).
- Verificat prin randarea efectivă a `VerifyEmail` — HTML-ul generat conține `favicon.png`, fără nicio urmă de `laravel.com`.

### OPS-02 — bug `intl`/Apache găsit și reparat local (vezi constatarea completă în secțiunea 4)

Panoul `/admin` întorcea `500` pe orice pagină din cauza unei nepotriviri de căutare de DLL-uri ICU între directoarele Apache și PHP din XAMPP. Fix aplicat: copiere DLL-uri ICU lângă `httpd.exe`, urmat de restart Apache. **Fix specific mediului local XAMPP — trebuie reverificat independent pe Forge** înainte de a considera panoul admin funcțional în producție.

### Corectare texte homepage — acuratețe față de funcționalitatea reală

Verificare sistematică a copy-ului de marketing față de ce face aplicația efectiv (cod AI, cote de plan, funcții canvas), fără nicio schimbare de design:

- **Funcții AI inexistente eliminate din promisiuni**: "Create infographics" (doar placeholder „Coming soon" în bibliotecă), "Explain homework" (nu există tutoring pas-cu-pas), "Improve notes" (nu există restructurare de notițe), "Clean up drawings" (redenumit corect „Perfect Shape", funcția reală).
- **Contradicție eliminată**: hero promitea „Unlimited pages" ca beneficiu general, dar planul Free (implicit) are cap de 20 pagini — înlocuit cu „No credit card required".
- **„Basic/Advanced AI tools" corectat**: toate planurile au exact aceleași acțiuni AI (`translate`, `chat`, `read`); diferă doar plafonul lunar de cost. Copy actualizat la „AI tools, monthly usage limit" vs „AI tools, no usage limit".
- **„Unlimited notebooks" → „Unlimited pages"**: cota reală (`max_canvas_pages`) e pe pagini, nu pe număr de notebook-uri (care oricum nu e limitat pe niciun plan).
- **Nav „Templates" → „Compare"**: nu există funcție de șabloane; link-ul ducea de fapt la tabelul comparativ reMarkable vs Notelevel.
- **Card nou, cerut explicit**: „Edit & export PDFs" (înlocuiește un card AI redundant), reflectă fluxul real — import PDF, adnotare cu pen/text/shapes pe pagină, export înapoi în PDF (Premium) sau JPG.
- **Hero**: a doua pastilă adăugată, „PDF Editing", lângă „100% In-Browser".
- **Compare table, rând nou PDF** — **notă importantă**: userul a cerut inițial textul „reMarkable nu are PDF edit", dar asta e factual fals (adnotarea de PDF e una din funcțiile principale ale reMarkable). Reformulat cinstit: „PDF markup tied to the device" vs „Edit & export PDFs in any browser" — diferența reală (dependența de hardware propriu), nu o negare falsă a unei funcții reale a competitorului.
- Verificare vizuală completă prin Playwright (capturi de ecran) pentru fiecare secțiune modificată, plus fix de aliniere CSS la cardurile de pricing (butoanele nu erau la aceeași înălțime din cauza unui `justify-content: center` pe cardul întunecat).

### Verificare și livrare

Suită completă: **84 teste, 267 assertions**, verde. `npm run build` curat. Toate schimbările din această secțiune au fost commit-uite și împinse pe `origin/main` (commit `836c0c0`, 49 fișiere) — primul push real al acestui proiect din perspectiva acestui audit; repository-ul are acum istoric Git verificabil.

## 15. Rate limiting la înregistrare și panou dedicat de accesibilitate (14 iulie 2026, seara)

**Context:** din cele 7 constatări deschise raportate userului mai devreme, userul a decis: criptarea și backup-ul rămân planificate pentru viitor (neurgente, asumate explicit); politica de confidențialitate (LEG-02) și verificarea `intl` pe Forge (OPS-02) sunt confirmate rezolvate de user; rate limiting-ul la înregistrare (AUTH-02) și accesibilitatea (UX-01) trebuiau rezolvate imediat.

### AUTH-02 — rate limiting la `/register`

- `routes/auth.php`: `POST register` are acum `throttle:6,1`, identic cu limiterul deja folosit la `verification.send`/`verification.verify`.
- Test nou `RegistrationTest::test_registration_is_rate_limited` — confirmă `429` după 6 înregistrări de pe același „client" de test.

### UX-01 / WEB-02 — panou de accesibilitate: construit în canvas, apoi mutat pe homepage + blog

**Cerință inițială**: buton separat și specific pentru accesibilitate, pregătit după best practice W3C/WCAG și Google (Lighthouse).

**Prima versiune (abandonată)**: panou construit în `resources/views/canvas/show.blade.php`/`canvas.js`/`canvas.css`, integrat în infrastructura de meniuri toolbar a canvasului. Funcțional, testat cu Playwright — dar **userul a decis explicit să renunțe la el în canvas** ("acolo oricum customizezi tu, faci cum vrei tu") și să mute efortul pe paginile publice. Codul din cele 3 fișiere a fost repus exact la starea dinainte (`git checkout` din commitul anterior), deci canvas-ul e neschimbat față de dinaintea acestei sesiuni. UX-01 (accesibilitatea canvasului) **rămâne deschisă**, ca decizie asumată.

**Versiune finală, livrată** — widget de accesibilitate pe **homepage și blog, exclusiv** (nu pe `/contact`, nu pe paginile legale — scop limitat explicit):
- Partial nou, `resources/views/marketing/partials/accessibility-widget.blade.php`, inclus explicit doar în `marketing/home.blade.php`, `blog/index.blade.php`, `blog/show.blade.php` (nu în header/footer comun, ca să nu apară automat pe `/contact`/`/privacy`/`/terms`, care folosesc aceleași partial-uri de header/footer).
- Buton rotund flotant, jos-stânga, cu pictograma universală de accesibilitate (omulețul cu cerc pentru cap, aceeași siglă clasică cerută).
- Panou cu aceleași 3 comutatoare reale ca în versiunea de canvas — **high contrast** (prin variabilele CSS din `marketing.css`: `--color-text-primary`, `--color-border`, etc.), **larger text**, **reduce motion** (plus `@media (prefers-reduced-motion: reduce)` independent de toggle, cerut de Lighthouse/Google).
- Logică JS în `resources/js/marketing.js`, urmând pattern-ul defensiv deja folosit în acel fișier (`if (element) { ... }`) — nu rupe nimic pe paginile unde widget-ul nu există.
- Preferințe persistate în `localStorage` (`notelevel.a11y`).

**Verificare** (Playwright, browser real):
- Widget prezent pe `/` și `/blog` — confirmat automat.
- Widget **absent** pe `/contact` și `/privacy` — confirmat automat (exact scopul cerut).
- Cele 3 comutatoare aplică efectiv clasele pe `<html>`; `Escape` închide panoul; preferințele supraviețuiesc unui `reload`; zero erori în consolă.
- Captură de ecran confirmă vizual: buton teal jos-stânga, panou lizibil cu cele 3 comutatoare.

**Ce rămâne deschis, explicit:** accesibilitatea canvasului (UX-01) — asumată de user ca fiind gestionată separat, nu prin acest widget.

### Verificare finală

Suită completă: **85 teste, 268 assertions**, verde (neschimbată — widget-ul de pe homepage/blog nu are teste PHPUnit dedicate, fiind verificat prin browser real/Playwright). `npm run build` curat.

## 16. Download PDF pe producție, curățare branding, blocare re-import PDF, download grupat Favourites (14 iulie 2026, noaptea)

Patru cereri distincte, planificate explicit (agenți Explore + Plan în paralel) înainte de implementare — plan salvat, aprobat, apoi executat integral.

### Download PDF nu mergea pe producție

**Ipoteza inițială (din plan) era parțial greșită — corectată după test real cu userul.** Planul inițial suspecta o problemă de sesiune/proxy (`trustProxies` lipsă). Fix-urile de robustețe din acel plan (verificare `response.ok`, `trustProxies`) au fost aplicate oricum — utile, dar nu erau cauza reală. **Cauza reală**, descoperită abia după ce userul a testat fix-ul de gestionare a erorilor (care, exact cum era intenționat, a scos la iveală eroarea în loc s-o înghită silențios): `exportDocumentAsPdf()` compunea imaginea cu adnotările desenate peste pagina PDF folosind `fetch(overlayDataUrl)`, unde `overlayDataUrl` e un `data:` URI generat de `canvas.toDataURL()`. Browserele tratează `fetch()` pe un `data:` URI ca pe o cerere de rețea supusă `connect-src` din CSP — iar politica din `SecurityHeaders.php` are `connect-src 'self'` (fără `data:`), deci Chrome bloca acel fetch cu exact eroarea raportată: *„Refused to connect because it violates the document's Content Security Policy."* Descărcarea din Favourites mergea pentru că acel flux nu compune nicio adnotare, deci nu avea niciun `fetch()` pe `data:`.

**Fix real**: `dataUrlToBytes()`, helper nou care decodează base64 direct din JS (`atob` + `Uint8Array`), fără niciun `fetch()` — deci nicio verificare CSP implicată. Înlocuiește `await (await fetch(overlayDataUrl)).arrayBuffer()` din `exportDocumentAsPdf()`.

**Fix-uri de robustețe păstrate din planul inițial** (nu erau cauza, dar rămân utile): `getPdfSourceBytes()` verifică acum `response.ok` și curăță cache-ul la eșec; `exportDocumentAsPdf()` prinde orice eroare rămasă și afișează un toast (`showCanvasToast()`); `bootstrap/app.php` are acum `trustProxies(at: '*')`, care lipsea complet și e oricum o bună practică pentru Forge.

**Verificare end-to-end reală** (Playwright, cont Premium, PDF de test cu 3 pagini, desen efectiv cu pen tool pe pagina importată — exact fluxul care declanșa compoziția adnotării): descărcare PDF adnotat reușită (`test (annotated).pdf`), verificat cu `pdf-lib` că are cele 3 pagini corecte, **zero violări CSP, zero erori consolă**.

**Lecție notabilă**: ipoteza inițială din plan (bazată pe cod citit, nu pe testare live) a fost o pistă rezonabilă dar incorectă — abia fix-ul „fă eroarea vizibilă" (nu presupune cauza) a permis identificarea cauzei reale în câteva minute, în loc să continuăm să ghicim.

### Branding „Laravel" în comunicări

Codul din repo era deja curat (verificat exhaustiv — tot fluxul de email rezolvă prin `config('app.name')`). Curățenie găsită și aplicată: `resources/views/welcome.blade.php` (pagina Laravel de start, cod mort, nicio rută nu duce la ea) — ștearsă. `.env.example` — `APP_NAME=Laravel` → `APP_NAME=Notelevel`. Cauza reală probabilă rămâne la nivel de producție (`config:cache` vechi sau `.env` neactualizat pe Forge) — checklist dat userului în planul de sesiune.

### Blocarea unei pagini PDF după import (cu deblocare automată la ștergere)

- Migrare nouă `pdf_page_imports` (`pdf_id`, `page_index`, `document_id` nullable, unique pe `pdf_id`+`page_index`, `cascadeOnDelete()` pe ambele FK).
- Serviciu nou `PdfPageImportReconciler::reconcile()` — apelat după fiecare salvare reușită de document (`DocumentController::store/update/autosave`, `CanvasApiController::save()` legacy). Recalculează automat ce perechi `(pdfId, pageIndex)` există în conținutul curent și sincronizează tabelul — inserează ce-i nou, șterge ce-a dispărut. Rezolvă simultan blocarea la import ȘI deblocarea la ștergere a paginii/documentului, fără cod separat pentru fiecare caz. Cazul de conflict (două documente revendică aceeași pagină, ex. prin duplicare document) e gestionat fără eroare — nu fură blocarea, doar loghează.
- `listPdfs()`/`listFavourites()` (legacy API) extinse cu `importedPageIndices`/`isImported`, calculate cu query batch (fără N+1).
- Frontend: paginile deja importate apar vizual estompate, cu iconiță de lacăt, checkbox dezactivat, în grila de pagini PDF, în cardul principal al PDF-ului (recalculat la navigare prev/next) și în Favourites (verificat prin `sourcePdfId`/`sourcePageIndex`, nu prin id-ul propriu al favoritului). Corectat pe parcurs: importul dintr-un Favourite folosește acum identitatea PDF-ului original (nu id-ul favoritului), altfel constrângerea de cheie străină ar fi eșuat și blocarea nu s-ar fi unificat corect între cele două căi de import.
- **Verificare end-to-end reală** (Playwright, cont Premium temporar, PDF de test generat cu `pdf-lib`): upload PDF cu 3 pagini → import pagina 1 → salvare explicită (Ctrl+S) → confirmat direct în baza de date (`pdf_page_imports` are rândul) → confirmat vizual: pagina 1 estompată, cu lacăt, checkbox dezactivat; paginile 2-3 normale, selectabile. Bulk „select all" exclude corect paginile blocate.
- Teste noi `PdfPageImportReconcilerTest` (4 cazuri: creare, deblocare la ștergere pagină, deblocare la ștergere document prin cascade, conflict fără furt de blocare).

### Download grupat din Favourites (Premium)

- Checkbox multi-select adăugat în panoul Favourites (identic vizual cu cel deja existent la grila de pagini PDF), plus dropdown „Bulk action..." cu „Download selected" (Premium, gated de același `CANVAS_PDF_EXPORT_ALLOWED`) și „Delete selected" (bonus).
- `downloadSelectedFavouritesAsPdf()` — client-side, PDFLib, fără niciun endpoint nou pe backend: descarcă fiecare favorite selectat, combină toate paginile lor (`copyPages(sourceDoc, sourceDoc.getPageIndices())` — nu presupune un singur page per favorite) într-un singur document, declanșează un singur download.
- **Verificare end-to-end reală**: 2 pagini adăugate la Favourites, selectate ambele + alte 2 rămase din rulări anterioare de test (4 total), descărcare grupată → fișier `favourites.pdf` descărcat, verificat cu `pdf-lib` că are exact 4 pagini (numărul corect de favorite selectate) — confirmă fuziunea corectă a mai multor surse.

### Verificare finală

Suită completă: **92 teste, 283 assertions**, verde (+4 față de secțiunea 15 — testele reconcilerului). `npm run build` curat. Toate datele de test (cont Premium temporar, PDF-uri, favorite) șterse după verificare.

## 17. Corectare blocare pagini PDF — sincronizare imediată, nu la salvare (14 iulie 2026, noaptea târziu)

Userul a raportat, după secțiunea 16, că blocarea nu funcționa în practică: „paginile nu se blochează, aduc o pagină și mai pot aduce încă una", plus aceeași cerință pentru Favourites, plus cerința ca descărcarea din Favourites să includă adnotările reale din canvas, nu PDF-ul original needitat.

**Neînțelegere inițială, corectată explicit de user**: primul instinct a fost să interpretez „o singură pagină odată în canvas" ca blocare la nivel de **PDF întreg** (odată ce orice pagină dintr-un PDF e adusă, tot PDF-ul se blochează). Userul a corectat direct: „DOAR ACEA PAGINA ADUSA E BLOCATA, nu tot documentul" — design-ul per-pagină din secțiunea 16 era deja corect ca *domeniu* de blocare; problema reală era alta.

**Cauza reală a bug-ului #1**: `PdfPageImportReconciler::reconcile()` rula abia **după** o salvare reușită de document. Dar `DocumentController::autosave()` refuză explicit să creeze documente noi — actualizează doar unele existente. Un canvas proaspăt, nesalvat niciodată, nu are `document_id` pe server, deci autosave nu face nimic în tăcere până la un salvare explicită. Confirmat live cu Playwright: pagină importată într-un canvas complet nesalvat, așteptare 15 secunde — zero cereri de autosave, deci blocarea (legată de reconciliere) nu se activa niciodată dacă userul nu apăsa explicit Save.

**Fix real**: blocarea devine acum **imediată**, independentă de starea de salvare:
- Endpoint-uri noi `lock_pdf_page`/`unlock_pdf_page` în `CanvasApiController`, apelate sincron din `insertPdfPages()` **înainte** de randare/inserare (nu după salvare). `lockPdfPage()` respinge cu 409 `already_imported` dacă perechea `(pdf_id, page_index)` e deja blocată; altfel creează un rând cu `document_id => null` (blocare „în așteptare", fără document încă).
- `PdfPageImportReconciler::reconcile()` actualizat să **revendice** aceste blocări în așteptare la prima salvare reală (`document_id === null` → se actualizează la id-ul documentului), în loc să le trateze ca pe un conflict.
- `deleteCurrentPage()` deblochează explicit (fire-and-forget) pagina ștearsă dacă avea `sourcePdf` — nu se mai bazează doar pe reconcilierea la salvare.
- Import direct dintr-un Favourite fără PDF sursă real (upload direct) primește acum `{ skipLock: true }` — evită să trimită id-ul propriu al favoritului către endpoint-ul de blocare (care aștepta un `pdfs.id` real) și evită o violare de cheie străină la salvare.
- Teste noi `PdfPageLockEndpointTest` (5 cazuri, inclusiv unul care fixează explicit semantica corectă: blocarea paginii 0 nu blochează pagina 1 din același PDF) + test nou în `PdfPageImportReconcilerTest` (blocare în așteptare revendicată la prima salvare).

**Bug conex descoperit în timpul verificării live**: checkbox-ul unei pagini blocate era complet dezactivat (`disabled`), ceea ce împiedica greșit selectarea ei pentru alte acțiuni bulk (Favourite, Delete, Duplicate) care ar trebui să rămână disponibile — blocarea privește strict re-importul în canvas, nu interacțiunea cu pagina. **Fix**: checkbox-ul rămâne mereu selectabil; „select all" include acum și paginile blocate; doar handler-ul acțiunii bulk „Insert into canvas" mai filtrează/sare paginile blocate (cu toast explicativ), neschimbat față de secțiunea 16.

**Verificare end-to-end reală** (Playwright, cont Premium temporar, PDF de test cu 3 pagini): flux complet într-o singură sesiune — import pagină → desen efectiv cu pen tool pe pagina importată → salvare (Ctrl+S) → confirmat în DB că pagina e blocată (`pdf_page_imports`, revendicată de documentul salvat) → checkbox-ul paginii blocate selectabil (nu mai e disabled) → adăugată cu succes la Favourites prin acțiunea bulk, deși blocată → încercarea de a o re-importa prin bulk „Insert into canvas" corect sărită, cu toast → descărcare din Favourites verificată cu `pdf-lib`: PDF cu 1 pagină, conținând un **al doilea XObject imagine cu `SMask`** (canal alpha) de 1282×900 — exact dimensiunile canvas-ului — confirmând că desenul e compus peste pagina originală, nu doar PDF-ul brut needitat.

Suită completă: **98 teste, 300 assertions**, verde (+6 față de secțiunea 16). `npm run build` curat, zero erori consolă în toate verificările live. Cont de test temporar și toate datele asociate (documente, PDF, favorite, director de stocare per-tenant) șterse după verificare.
