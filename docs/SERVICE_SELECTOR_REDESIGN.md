# Service Selector Redesign - Planning Document

## Current Situation
- Service selector component needs to be more intuitive
- Current setup doesn't match the actual service structure

## Services Offered

### Website Services (Base Services/Tiers)
1. **Starter Website** - Base service tier
2. **Professional Website** - Base service tier  
3. **Enterprise Website** - Base service tier

### Other Services
- **Data Analytics and Business Intelligence Services** - Separate service category

### Add-ons
- Optional extra services that can be added to base services
- Users can choose add-ons after selecting a base service

## Desired User Flow

### Step 1: Select Base Service
- User chooses one of the main services:
  - Starter Website
  - Professional Website
  - Enterprise Website
  - Data Analytics & BI (or separate category)

### Step 2: Select Add-ons (Optional)
- After base service selection, show relevant add-ons
- User can choose which add-ons they want
- Only show add-ons applicable to selected service

### Step 3: Contact Info & Review (Future)
- Will be implemented later
- Not part of initial redesign

## Design Approach
- Make it feel intuitive and natural
- Clear service selection interface
- Smooth transition to add-on selection
- Visual price updates as selections change

## Open Questions for Discussion

1. **Data Analytics & BI Structure**
   - Should this be a single base service, or does it have tiers (Starter/Professional/Enterprise)?

2. **Add-on Applicability**
   - Which add-ons apply to which base services?
   - Do we have a mapping of add-ons to services, or should all add-ons be available for all services initially?

3. **Pricing Calculation**
   - For percentage-based add-ons, are they calculated on:
     - Base service price only?
     - Base service + other fixed add-ons?
   - Need clarification on calculation order

4. **UI Layout Preferences**
   - Tabs approach: Separate tabs for "Websites" vs "Data & BI"?
   - Unified grid: Show all services with category headers?
   - Cards with category sections?

5. **Service Names**
   - Confirm "Professional" (currently appears as "Proffessional" in some places)

6. **Implementation Scope**
   - Focus on 2-step flow (Service Selection → Add-ons)
   - Contact info and review will come later

## Next Steps
1. Get answers to open questions
2. Review current API structure (`/api/services`)
3. Design the new component layout
4. Implement service selection interface
5. Implement add-on selection interface with filtering
6. Add real-time price calculation and display

## Files to Review
- `components/client/service-selector.tsx` - Current implementation
- `app/api/services/route.ts` - API endpoint structure
- Need to understand how add-ons are structured in the database

---

**Created:** [Current Date]
**Status:** Planning Phase - Awaiting clarification on questions above



