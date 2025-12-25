# Deprecation Warnings & Updates

*Last Updated: January 2025*

This document tracks npm deprecation warnings and packages that need to be updated.

---

## 🔔 **Active Deprecation Warnings**

### **1. `get-random-values-esm@1.0.2`**
**Status**: ⚠️ Deprecated  
**Warning**: `use crypto.getRandomValues() instead`

**Details:**
- ✅ **Confirmed**: This is a transitive dependency (not directly in `package.json`)
- The package suggests using native `crypto.getRandomValues()` instead
- Likely coming from one of the Sanity or other packages

**Action Required:**
1. Identify which package depends on `get-random-values-esm`
2. Check if the parent package has been updated to remove this dependency
3. If not, consider:
   - Updating the parent package to latest version
   - Replacing with native `crypto.getRandomValues()` if possible
   - Waiting for upstream fix if it's a widely used package

**Priority**: Low (warning only, not breaking)  
**Impact**: Minimal - functionality still works

---

### **2. `@sanity/next-loader@1.7.5`**
**Status**: ⚠️ Deprecated  
**Warning**: `This package is deprecated. Please use 'next-sanity/live' instead`

**Details:**
- ✅ **Confirmed**: This is a transitive dependency (not directly in `package.json`)
- This is a Sanity package for Next.js integration
- The recommended replacement is `next-sanity/live`
- Likely coming from `next-sanity@^9.12.2` package

**Action Required:**
1. ✅ **Confirmed**: Not a direct dependency - it's transitive via `next-sanity`
2. Update `next-sanity` to latest version (may already include fix):
   ```bash
   npm update next-sanity
   ```
3. Check if code uses `@sanity/next-loader` directly (search codebase):
   ```bash
   grep -r "@sanity/next-loader" .
   ```
4. If found in code, migrate imports to `next-sanity/live`:
   ```typescript
   // Old:
   import { ... } from '@sanity/next-loader'
   // New:
   import { ... } from 'next-sanity/live'
   ```

**Priority**: Medium (should be updated to avoid future compatibility issues)  
**Impact**: May break in future Sanity updates if not addressed

**Files to Check:**
- `package.json` - Check for direct dependency
- Search codebase for `@sanity/next-loader` imports
- `sanity.config.ts` - Check Sanity configuration

---

## 🔍 **How to Investigate Deprecation Warnings**

### **Find Which Package Depends on Deprecated Package:**
```bash
npm ls get-random-values-esm
npm ls @sanity/next-loader
```

### **Check for Updates:**
```bash
npm outdated
```

### **Update All Packages (Careful!):**
```bash
npm update
```

---

## ✅ **Resolution Checklist**

When addressing deprecation warnings:

- [ ] Identify if it's a direct or transitive dependency
- [ ] Check if parent package has an update available
- [ ] Review breaking changes in update notes
- [ ] Test thoroughly after updating
- [ ] Update this document when resolved

---

## 📝 **Notes**

- These warnings don't break functionality but should be addressed
- Priority should be given to packages that are direct dependencies
- Transitive dependencies will be fixed when parent packages update
- Always test after updating dependencies

---

*Update this document when new deprecation warnings appear or when issues are resolved.*

