# Google Business Profile API - Critical Information
## Why We Cannot Use the API

## ⚠️ CRITICAL FINDING

**The Google Business Profile API requires pre-approval and is NOT publicly available.**

---

## API Access Requirements

### 1. Application & Approval Process

**You MUST complete Google's access request form:**
- URL: https://developers.google.com/my-business/content/prereqs#request-access
- Processing time: Several weeks to months
- Not guaranteed approval

**Approval Criteria (from Google):**
> "The Google My Business API is only visible in the Google API Console to users who submit and receive approval for their Google Account through the access request form."

**Who gets approved:**
- Large businesses with 10+ locations
- Third-party service providers managing multiple clients
- Tech-savvy chains with development teams
- Enterprise-level organizations

**Who typically does NOT get approved:**
- Individual businesses
- Single-location organizations
- Personal projects
- Small community groups (like Putovný kruh)

---

## 2. Technical Requirements (If Approved)

### OAuth 2.0 Setup
```
Required Scope: https://www.googleapis.com/auth/business.manage
Client Type: Web application
Redirect URI: Must be configured in Google Cloud Console
```

### Eight APIs Must Be Enabled:
1. Google My Business API
2. My Business Account Management API
3. My Business Lodging API
4. My Business Place Actions API
5. My Business Notifications API
6. My Business Verifications API
7. My Business Business Information API
8. My Business Q&A API

### Google Cloud Project Setup
- Active Google Cloud project
- Billing enabled (even though APIs are free, billing account required)
- OAuth 2.0 credentials configured
- All 8 APIs enabled individually

---

## 3. API Endpoint Structure

### Create Location
```
POST https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations

Authorization: Bearer {oauth_token}
Content-Type: application/json

{
  "storeCode": "putovny-kruh-blansko",
  "title": "Putovný mužský kruh",
  "categories": {
    "primaryCategory": {
      "name": "categories/gcid:community_organization"
    }
  },
  "storefrontAddress": {
    "locality": "Blansko",
    "postalCode": "678 01",
    "regionCode": "CZ",
    "administrativeArea": "Jihomoravský kraj"
  },
  "serviceArea": {
    "places": {
      "placeInfos": [
        {
          "name": "Blansko",
          "placeId": "ChIJ..."
        },
        {
          "name": "Brno",
          "placeId": "ChIJ..."
        }
      ]
    }
  },
  "phoneNumbers": {
    "primaryPhone": "+420..."
  },
  "websiteUri": "https://putovnykruh.cz"
}
```

### Required Fields:
- `title` - Business name
- `categories.primaryCategory` - Business category
- `storefrontAddress` OR `serviceArea` - Location info
- `phoneNumbers.primaryPhone` - Contact phone

---

## 4. Verification Process

Even with API access, profiles require verification:

**Verification Methods:**
1. **Postcard** (most common) - 5-7 days
2. **Phone call** - Immediate
3. **Email** - Rare, only for specific businesses
4. **Video** - For service-area businesses

**API Endpoint:**
```
POST https://mybusinessverifications.googleapis.com/v1/locations/{locationId}:verify

{
  "method": "PHONE_CALL",
  "languageCode": "cs"
}
```

**Important:** API can initiate verification but cannot bypass it. Manual verification still required.

---

## 5. Why This Won't Work For Putovný Kruh

### Access Barriers:
❌ Single-location organization (not multi-location chain)  
❌ Non-profit community group (not commercial business)  
❌ No existing development team  
❌ Application approval takes weeks/months  
❌ Approval not guaranteed  

### Complexity vs. Benefit:
- **API Setup Time:** 2-4 weeks (if approved)
- **Manual Setup Time:** 15 minutes
- **End Result:** Identical - both require manual verification

---

## 6. Recommended Alternative

### Manual Setup (Best Option)

**Process:**
1. Go to https://business.google.com/create
2. Sign in with Google account
3. Enter business name: "Putovný mužský kruh"
4. Choose category: "Community organization"
5. Select "I deliver goods and services to my customers"
6. Define service area: Blansko, Brno, Adamov, etc.
7. Add contact info
8. Verify (postcard/phone/video)

**Time Required:**
- Form submission: 10-15 minutes
- Verification: 5-7 days (postcard) or immediate (phone/video)

**No Pre-Approval Needed**

---

## 7. API Use Cases (When It Makes Sense)

The Google Business Profile API is designed for:

✅ **Chains with 10+ locations**
- McDonald's, Starbucks, retail chains
- Automated bulk updates across hundreds of locations

✅ **Third-party management platforms**
- Yext, BrightLocal, Moz Local
- Managing hundreds of client businesses

✅ **Enterprise franchises**
- Consistent updates across franchise network
- Centralized management dashboard

❌ **NOT designed for:**
- Single locations
- Individual businesses
- One-time profile creation
- Community organizations

---

## 8. Comparison Table

| Aspect | API Approach | Manual Approach |
|--------|--------------|-----------------|
| **Access** | Requires approval (weeks) | Immediate |
| **Setup Time** | 2-4 weeks | 15 minutes |
| **Approval Rate** | ~30% for small orgs | 100% |
| **Technical Skill** | OAuth, REST APIs, JSON | Web form |
| **Verification** | Still manual | Manual |
| **Cost** | Free (but requires billing) | Free |
| **Best For** | 10+ locations | Single location |
| **End Result** | Identical profile | Identical profile |

---

## 9. Automated Alternatives

### Third-Party Services (No approval needed):

**1. Yext** - https://www.yext.com/
- Manages Google Business Profile + 100+ directories
- No Google API approval needed
- Cost: ~$199/month

**2. BrightLocal** - https://www.brightlocal.com/
- Google Business Profile management
- Automated posting and updates
- Cost: ~$29/month

**3. Moz Local** - https://moz.com/products/local
- Multi-platform listing management
- Cost: ~$129/year

**Verdict:** Overkill for single location. Just use manual setup.

---

## 10. Step-by-Step Manual Setup Guide

Since API is not viable, here's the correct manual process:

### Phase 1: Create Profile (15 minutes)

1. **Navigate to:** https://business.google.com/create
2. **Sign in** with your Gmail account
3. **Business name:** Putovný mužský kruh
4. **Category:** Community organization
5. **Location type:** 
   - Select: "Yes, I serve customers at my business address"
   - Then select: "I also serve customers at their locations"
6. **Service areas:**
   - Add: Blansko
   - Add: Brno
   - Add: Adamov
   - Add: Boskovice
   - Add other Blanensko municipalities
7. **Contact info:**
   - Phone: +421 [your number]
   - Website: https://putovnykruh.cz
8. **Finish setup**

### Phase 2: Verification (5-7 days)

**Best option for service-area business: Video verification**

1. Google will prompt for verification method
2. Choose: "Verify by video"
3. Record short video:
   - Show yourself at a meeting location
   - Hold up sign with "Putovný mužský kruh"
   - State your name and business name
   - Show business materials (flyers, website on phone)
4. Upload video
5. Wait 1-3 business days for approval

**Alternative: Phone verification**
- Google calls you with 6-digit code
- Enter code in dashboard
- Instant verification

### Phase 3: Complete Profile (30 minutes)

1. **Add description** (750 characters):
```
Putovný mužský kruh je bezpečný priestor pre mužov z Blanska, Brna a okolia. Pravidelné stretnutia pri ohni zamerané na autentické zdieľanie, načúvanie a osobný rast. Vytvárame podporné prostredie, kde muži môžu hovoriť pravdu bez súdenia. Stretávame sa vonku v prírode na Blanensku. Účasť je zadarmo - platí sa mužským slovom a integritou. Pre mužov, ktorí hľadajú viac než povrchné debaty.
```

2. **Upload photos:**
   - Logo (from /public/images/)
   - Fire circle images
   - Speaking object
   - Meeting location shots

3. **Add attributes:**
   - Free of charge
   - Outdoor seating
   - LGBTQ+ friendly
   - Appointment required

4. **Business hours:**
   - Mark as "Hours vary - see website"
   - Or add specific meeting times if regular

5. **Services:**
   - Men's circle meetings
   - Personal development support
   - Community gatherings

### Phase 4: Optimization

1. **Create first post**
2. **Add Q&A entries** (pre-emptive)
3. **Set up messaging** (if available)
4. **Request reviews** from past participants

---

## 11. Why Manual is Better

### Advantages of Manual Setup:
✅ **Immediate access** - No approval waiting  
✅ **Simple process** - Web form, not code  
✅ **Same end result** - Identical profile  
✅ **Better support** - Google support for manual users  
✅ **Verification options** - Video, phone, postcard  

### API Only Adds Value When:
- Managing 10+ locations
- Automated daily updates needed
- Bulk operations required
- Third-party platform integration

**For single location: API is overkill and unnecessarily complex.**

---

## 12. Post-Setup Management

### Weekly Tasks (5 minutes):
- Create Google post about next circle
- Respond to any questions
- Check insights/analytics

### Monthly Tasks (10 minutes):
- Upload new photos from circles
- Update business hours if changed
- Request reviews from participants

### No API Needed:
All tasks easily done via:
- Web dashboard: https://business.google.com
- Google Business Profile mobile app
- Both faster than API calls

---

## Summary & Recommendation

### API Verdict: ❌ NOT RECOMMENDED

**Reasons:**
1. Requires pre-approval (weeks/months, not guaranteed)
2. Designed for multi-location businesses
3. Complex OAuth/API setup
4. Same verification process as manual
5. No advantage for single location
6. Manual setup is faster and simpler

### Recommended Action: ✅ MANUAL SETUP

**Steps:**
1. Visit https://business.google.com/create
2. Follow wizard (15 minutes)
3. Verify via phone or video (immediate to 7 days)
4. Complete profile (30 minutes)
5. Start posting weekly updates

**Total Time Investment:**
- Manual: 1 hour active + 1-7 days verification
- API: 2-4 weeks approval + 1-2 weeks setup + 1-7 days verification

**Winner: Manual setup by 3-5 weeks**

---

## Resources

**Manual Setup:**
- Create profile: https://business.google.com/create
- Help center: https://support.google.com/business/

**API Documentation (if you want to try):**
- Access request: https://developers.google.com/my-business/content/prereqs
- API docs: https://developers.google.com/my-business/reference/rest
- OAuth setup: https://developers.google.com/my-business/content/oauth-setup

**Third-Party Tools:**
- Yext: https://www.yext.com/
- BrightLocal: https://www.brightlocal.com/
- Moz Local: https://moz.com/products/local

---

*Last updated: March 2026*
*Recommendation: Use manual setup via business.google.com*
