# Search Console setup

## Preferred (agent / Cloudflare API)
1. Create Domain property `cutrateslawn.com`
2. Add DNS TXT verification at apex
3. Verify
4. Submit `https://cutrateslawn.com/sitemap.xml`

## Manual click-path
1. https://search.google.com/search-console → Add property → Domain → `cutrateslawn.com`
2. Copy the TXT record Google shows
3. Cloudflare → DNS → Add TXT on `@` with that value
4. Verify in Search Console
5. Sitemaps → add `https://cutrateslawn.com/sitemap.xml`

Do not change A/CNAME records for the apex or www.
