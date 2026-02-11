# Security Configuration

## Security Headers (Implemented)

These headers are configured in `next.config.mjs` and protect against common web vulnerabilities:

### 1. **X-Frame-Options: DENY**
- **Prevents:** Clickjacking attacks
- **What it does:** Blocks the site from being embedded in iframes
- **Impact:** Site cannot be framed by any domain

### 2. **X-Content-Type-Options: nosniff**
- **Prevents:** MIME-type sniffing attacks
- **What it does:** Forces browsers to respect declared content types
- **Impact:** Prevents XSS via malicious file uploads

### 3. **X-XSS-Protection: 1; mode=block**
- **Prevents:** Reflected XSS attacks (legacy browsers)
- **What it does:** Enables browser's built-in XSS filter
- **Impact:** Blocks page rendering if XSS detected

### 4. **Referrer-Policy: strict-origin-when-cross-origin**
- **Prevents:** Referrer leakage
- **What it does:** Controls what referrer info is sent
- **Impact:** Privacy protection for users

### 5. **Permissions-Policy**
- **Prevents:** Unwanted feature access
- **What it does:** Disables camera, microphone, geolocation, payment APIs
- **Impact:** Reduces attack surface

### 6. **Strict-Transport-Security (HSTS)**
- **Prevents:** Man-in-the-middle attacks, protocol downgrade
- **What it does:** Forces HTTPS for 1 year
- **Impact:** All connections must use HTTPS

### 7. **Content-Security-Policy (CSP)**
- **Prevents:** XSS, data injection, malicious resource loading
- **What it does:** Whitelists allowed content sources
- **Configured:**
  - Scripts: self + inline (needed for Next.js)
  - Styles: self + inline (needed for Tailwind)
  - Images: self + data URIs + HTTPS
  - Connections: self + Supabase + threat intel tools
  - Frames: blocked
  - Forms: self only

---

## Cloudflare Security Settings

Enable these settings in your Cloudflare dashboard:

### **Security > WAF (Web Application Firewall)**
✅ Enable "OWASP Core Ruleset"
✅ Enable "Cloudflare Managed Ruleset"
✅ Set security level: "Medium" or "High"

### **Security > Bots**
✅ Enable "Bot Fight Mode" (free tier)
✅ Block: Definitely automated
✅ Challenge: Likely automated

### **Security > DDoS**
✅ Enabled by default - no action needed
✅ Automatic mitigation active

### **SSL/TLS > Overview**
✅ Set to "Full (strict)"
✅ Always Use HTTPS: ON
✅ Minimum TLS Version: 1.2

### **SSL/TLS > Edge Certificates**
✅ Enable "Automatic HTTPS Rewrites"
✅ Enable "Always Use HTTPS"
✅ Enable "HTTP Strict Transport Security (HSTS)"
  - Max Age: 12 months
  - Include subdomains: YES
  - Preload: YES (optional)

### **Speed > Optimization**
✅ Auto Minify: CSS, JavaScript, HTML
✅ Brotli: ON
✅ Early Hints: ON

### **Caching > Configuration**
✅ Browser Cache TTL: Respect Existing Headers
✅ Development Mode: OFF (only use during dev)

---

## Supabase Security Checklist

### **Authentication**
✅ Email verification: ENABLED
✅ Strong password requirements: ENABLED
✅ Rate limiting: ENABLED (default)
✅ Session timeout: Configure in settings

### **Database Security**
✅ Row Level Security (RLS): ENABLED on all tables
✅ RLS Policies: Only `auth.uid()` can access own data
✅ Database backups: ENABLED (daily)

### **API Security**
✅ Anon key used (not service key)
✅ Service key never exposed to client
✅ Environment variables in `.env.local` (gitignored)

### **RLS Policies Applied**
```sql
-- journal_entries
CREATE POLICY "Users can view own entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

-- ticket_progress
CREATE POLICY "Users can view own progress"
  ON ticket_progress FOR SELECT
  USING (auth.uid() = user_id);

-- cert_roadmap
CREATE POLICY "Users can view own roadmap"
  ON cert_roadmap FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Additional Security Recommendations

### **Before Going Live**
1. ✅ Security headers configured (DONE)
2. ⚠️ Enable Cloudflare WAF rules
3. ⚠️ Enable Cloudflare Bot Fight Mode
4. ⚠️ Force HTTPS on Cloudflare
5. ⚠️ Verify Supabase RLS policies
6. ⚠️ Enable Supabase email verification
7. ⚠️ Set up monitoring/alerts

### **Ongoing Maintenance**
- Monitor Cloudflare security events
- Review failed login attempts in Supabase
- Update dependencies regularly (`npm audit`)
- Keep Next.js and Supabase SDKs updated
- Review and tighten CSP policy over time

---

## Testing Security

### **Test Security Headers**
Visit: https://securityheaders.com/?q=your-domain.com
Goal: A+ rating

### **Test SSL Configuration**
Visit: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
Goal: A+ rating

### **Test CSP**
Use browser console to check for CSP violations:
```javascript
// Should see no CSP errors in console
```

---

## Known Limitations

1. **CSP `unsafe-inline` for scripts/styles**
   - Required for Next.js and Tailwind CSS
   - Consider nonce-based CSP in future (more complex)

2. **No Rate Limiting in Next.js**
   - Supabase handles auth rate limiting
   - Consider Upstash Redis for API rate limiting if needed

3. **Client-Side Auth**
   - Authentication is client-side (Supabase)
   - Acceptable for this use case (not handling PII beyond emails)

---

## Emergency Response

If you detect an attack:
1. Enable "Under Attack Mode" in Cloudflare
2. Check Cloudflare Security Events dashboard
3. Review Supabase auth logs
4. Temporarily disable signups if needed
5. Contact Cloudflare/Supabase support if severe

---

**Last Updated:** February 2024
**Security Audit:** Recommended every 6 months
