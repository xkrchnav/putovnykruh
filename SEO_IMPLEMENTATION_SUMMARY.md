# SEO Improvements Summary - Putovný mužský kruh

## Completed Changes (March 2026)

### ✅ 1. robots.txt with AI Crawler Support
**File:** `/public/robots.txt`

- Added comprehensive robots.txt allowing all crawlers including AI bots
- Supports: GPTBot, ClaudeBot, ChatGPT-User, CCBot, Google-Extended, PerplexityBot, Applebot-Extended, Bytespider
- Includes sitemap references for both sitemap-index.xml and sitemap-0.xml

### ✅ 2. Structured Data (Schema.org JSON-LD)
**File:** `/src/components/StructuredData.astro`

Implemented three comprehensive schemas:

#### Organization Schema
- Name, description, logo
- Area served: Blansko, Brno, Blanensko with Wikidata references
- Contact information and WhatsApp link
- Language support (Slovak, Czech)

#### LocalBusiness Schema
- Geo-coordinates (49.3626, 16.6441) targeting Blansko center
- Service area: Blansko, Brno, Adamov, okres Blansko
- Free pricing (0 CZK)
- Service description with local keywords
- Keywords: "mužský kruh Brno, mužský kruh Blansko, Blanensko, zdieľanie u ohňa"

#### Event Schema
- Next circle meeting (March 18, 2026)
- Offline event in Blansko
- Free admission
- Audience type specified
- Full location details with geo-coordinates

### ✅ 3. Enhanced Open Graph & Meta Tags
**File:** `/src/layouts/BaseLayout.astro`

#### SEO Meta Tags:
- **Keywords:** "mužský kruh Brno, mužský kruh Blansko, Blanensko, zdieľanie u ohňa, muži Blansko, stretnutia mužov Brno, mužská podpora, kruh pre mužov, osobný rast muži"
- **Geo Region:** CZ-JM (Jihomoravský kraj)
- **Geo Placename:** Blansko, Brno
- **Geo Position:** 49.3626;16.6441

#### Open Graph Tags:
- Primary locale: sk_SK
- Alternate locale: cs_CZ (for Czech searchers)
- OG image with dimensions (1200x630)
- Image alt text for accessibility
- Site name, title, description optimized

#### Twitter Cards:
- Large image card format
- Full metadata for Twitter/X sharing
- Image alt text

#### Updated Default Title:
```
Putovný mužský kruh Blansko, Brno | Zdieľanie pri ohni
```

#### Updated Default Description:
```
Mužský kruh Blansko a Brno. Bezpečný priestor pre mužov na Blanensku. 
Pravidelné stretnutia pri ohni, autentické zdieľanie, mužská podpora bez súdenia.
```

### ✅ 4. Image Alt Text Optimization

Updated all images with SEO-rich, descriptive alt attributes:

**Hero Logo:**
```
Logo Putovného mužského kruhu Blansko Brno - symbol ohňa a mužského spoločenstva
```

**Speaking Object:**
```
Hovoriaci predmet mužského kruhu - symbol pre zdieľanie a načúvanie pri ohni
```

**Fire Image:**
```
Ohnisko v lese pri mužskom kruhu na Blanensku - miesto stretnutí mužov pri ohni
```

### ✅ 5. Google Business Profile Setup Guide
**File:** `/GOOGLE_BUSINESS_SETUP.md`

Comprehensive 300+ line guide covering:
- Step-by-step Google Business Profile setup
- Business category selection (Community Organization)
- Service area configuration for Blansko/Brno region
- Photo requirements and recommendations
- Weekly posting strategy
- Review management
- Czech-specific directories (Firmy.cz, Seznam Firmy, GoOut.cz)
- Maintenance schedule
- Action item checklist

---

## Technical Implementation

### Astro Integration
- Uses Astro's built-in sitemap integration
- Structured data injected via component with `type="application/ld+json"`
- Meta tags dynamically generated using Astro.url and Astro.site
- Image optimization via astro:assets

### SEO Strategy
- **Primary Keywords:** mužský kruh Brno, mužský kruh Blansko, Blanensko, zdieľanie u ohňa
- **Geographic Target:** Blansko, Brno, Adamov, Blanensko region (Jihomoravský kraj)
- **Language:** Slovak content targeting Czech locality
- **Schema Types:** Organization + LocalBusiness + Event (triple schema for maximum visibility)

---

## Next Steps (Manual Actions Required)

### Immediate (This Week):
1. ✅ Deploy changes to production (Cloudflare)
2. ⬜ Create 1200x630px Open Graph image with logo + tagline
3. ⬜ Upload OG image to `/public/images/og-image.jpg`
4. ⬜ Set up Google Business Profile (follow GOOGLE_BUSINESS_SETUP.md)
5. ⬜ Verify Google Business Profile (phone/video)
6. ⬜ Upload 3-5 photos to Google Business Profile

### First Month:
7. ⬜ Register on Firmy.cz
8. ⬜ Register on Seznam Firmy
9. ⬜ List next event on GoOut.cz
10. ⬜ Post weekly Google Business updates (2-3x/week)
11. ⬜ Request reviews from past participants
12. ⬜ Submit to Rouming.cz community calendar

### Ongoing:
13. ⬜ Weekly: Post event updates on Google Business Profile
14. ⬜ Monthly: Upload new photos from circles
15. ⬜ Monthly: Check Google Business insights/analytics
16. ⬜ After each circle: Request Google reviews from participants

---

## Testing & Verification

### Schema Validation:
Test structured data at:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

### OG Preview:
Test social sharing at:
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

### Sitemap Check:
- Visit: https://putovnykruh.cz/sitemap-index.xml
- Submit to Google Search Console
- Submit to Seznam.cz Webmaster Tools

---

## Expected SEO Impact

### Short-term (1-3 months):
- Google Maps listing appears for "mužský kruh Blansko"
- Rich snippets show event dates in search results
- Local pack visibility for Blansko/Brno searches
- WhatsApp/Facebook shares show proper preview image

### Medium-term (3-6 months):
- Ranking for "mužský kruh Brno" and "Blanensko"
- Google Knowledge Panel may appear
- Reviews improve local SEO rankings
- Event schema generates event-rich results

### Long-term (6-12 months):
- Top 3 ranking for primary keywords in South Moravia
- Organic traffic from Czech searchers
- Natural backlinks from community sites
- Branded searches increase

---

## Files Modified

1. `/public/robots.txt` (new)
2. `/src/components/StructuredData.astro` (new)
3. `/src/layouts/BaseLayout.astro` (modified)
4. `/src/components/Hero.astro` (modified - alt text)
5. `/src/components/HowWeWork.astro` (modified - alt text)
6. `/src/components/Pillars.astro` (modified - alt text)
7. `/GOOGLE_BUSINESS_SETUP.md` (new)
8. `/SEO_IMPLEMENTATION_SUMMARY.md` (this file)

---

## Contact & Support

**Google Business Profile Support:**
- https://support.google.com/business/

**Astro SEO Documentation:**
- https://docs.astro.build/en/guides/integrations-guide/sitemap/

**Schema.org Documentation:**
- https://schema.org/Event
- https://schema.org/LocalBusiness

---

*Last updated: March 7, 2026*
*Language: Slovak (targeting Czech Blansko/Brno region)*
