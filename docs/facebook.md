# Facebook – automatické sdílení článků a termínů

Workflow `.github/workflows/facebook.yml` po každém mergi do `main` publikuje
na stránku **Putovní mužský kruh Blansko** dva typy příspěvků:

| Co přibylo v repu | Co se publikuje |
|---|---|
| `src/content/blog/*.mdx` | odkaz na nový článek (název + perex z frontmatteru) |
| `src/content/circles/*.mdx` s budoucím `startsAt` | příspěvek s termínem, místem a odkazem na přihlášku |

Úprava staršího článku nic nepublikuje — bere se jen soubor, který v daném
pushi **přibyl** (`git diff --diff-filter=A`).

## Co přes API nejde

Vytváření událostí na stránce přes Graph API **není pro běžné aplikace
dostupné**. Meta k tomu pustí jen Marketing Partnery a u objektu `Event` je
„Creating“ výslovně zakázané. Události proto zůstávají ruční:

1. v Meta Business Suite → **Události** → *Vytvořit událost*,
2. u pravidelného kruhu použij **Opakování** (např. každých 14 dní) — pak se
   událost zakládá jednou a nové termíny přibývají samy,
3. text a odkaz zkopíruj z příspěvku, který automat publikoval.

Automat tedy dělá příspěvek s odkazem na web; událost je na dva kliky navíc.

## Nastavení (jednorázově)

### 1. Aplikace Meta

1. <https://developers.facebook.com/apps> → **Create app** → typ **Business**.
2. V aplikaci nejsou potřeba žádné produkty ani App Review — stačí, že ji
   používáš ty jako správce stránky (aplikace může zůstat v režimu *Development*).
3. Poznamenej si **App ID** a **App Secret** (Settings → Basic).

### 2. Page access token

V **Graph API Explorer** (<https://developers.facebook.com/tools/explorer>):

1. vyber svou aplikaci,
2. přidej oprávnění `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`,
3. **Generate Access Token** a potvrď souhlas jako správce stránky,
4. zavolej `GET /me/accounts` — v odpovědi najdi stránku
   `Putovní mužský kruh Blansko`, její `id` a `access_token`.

Ten `access_token` je ale krátkodobý. Pro dlouhodobý ho vyměň (v terminálu):

```bash
# 1) dlouhodobý user token (60 dní)
curl "https://graph.facebook.com/v27.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=KRATKODOBY_USER_TOKEN"

# 2) page token z dlouhodobého user tokenu – ten už neexpiruje
curl "https://graph.facebook.com/v27.0/me/accounts?access_token=DLOUHODOBY_USER_TOKEN"
```

Page access token odvozený z dlouhodobého user tokenu platí, dokud uživatel
nezmění heslo nebo neodebere aplikaci oprávnění.

### 3. Secrets v GitHubu

Repo → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Hodnota |
|---|---|
| `FB_PAGE_ID` | `61596421073730` |
| `FB_PAGE_TOKEN` | page access token z kroku 2 |

Bez nich workflow proběhne, ale jen napíše `FB_PAGE_ID / FB_PAGE_TOKEN nejsou
nastavené — přeskakuji.` a skončí v pořádku.

### 4. Vyzkoušení

Actions → **Facebook – nové články a termíny** → **Run workflow** →
`dry_run: true`. V logu uvidíš přesně texty, které by se publikovaly, a nic se
neodešle. Pro ostré spuštění přepni na `false`.

## Jak to funguje uvnitř

`scripts/facebook-post.mjs`:

1. spočítá nové soubory mezi `github.event.before` a `github.sha`,
2. načte frontmatter (title, description, startsAt, place, topic),
3. počká, než Cloudflare nasadí novou verzi (odkaz musí vracet 200),
4. nechá Facebook znovu načíst OG data (`scrape=true`), aby náhledovka
   odpovídala novému OG obrázku 1200×630,
5. pošle `POST /{page-id}/feed` s `message` + `link`.

Texty se skládají v `scripts/facebook-post.mjs` — když chceš jiný tón nebo
jinou výzvu k akci, uprav je tam (drž se češtiny a stávajícího hlasu webu).

## Když se něco pokazí

| Problém | Význam | Řešení |
|---|---|---|
| `190 Invalid OAuth 2.0 Access Token` | token vypršel nebo byl odvolán | vygeneruj nový page token a přepiš secret |
| `200 Permissions error` | chybí `pages_manage_posts` | znovu autorizuj aplikaci se správnými oprávněními |
| `Web nevrací 200 pro …` | deploy ještě neproběhl nebo je URL špatná | zkontroluj build v Cloudflare, pak spusť workflow ručně |
| příspěvek se neobjevil | soubor nebyl v pushi „nový“ (jen upravený) | publikuj ručně nebo přidej nový soubor |
