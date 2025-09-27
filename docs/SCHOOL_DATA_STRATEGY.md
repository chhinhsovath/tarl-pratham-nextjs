# 🏫 School Data Strategy - END THE CONFUSION

## 🚨 CRITICAL DECISION: Always Use `pilot_schools` Table

**TL;DR**: For TaRL application, **ALWAYS** use `pilot_schools` table. Never use `schools` table unless absolutely necessary.

## The Problem We Solved

You were getting confused between two database tables:
- `schools` - Complex, full education management schema
- `pilot_schools` - Simple, TaRL-specific pilot program data

This confusion caused:
- ❌ API endpoints returning empty data
- ❌ Frontend forms not loading school dropdowns
- ❌ Hours wasted debugging wrong table queries
- ❌ Inconsistent data between Laravel and Next.js

## The Solution: Standard Access Pattern

### ✅ ALWAYS USE THIS:

```typescript
// Import standardized functions
import { getAllPilotSchools, getPilotSchoolById, searchPilotSchools } from "@/lib/schools";

// Get all schools for dropdowns
const schools = await getAllPilotSchools();

// Get specific school
const school = await getPilotSchoolById(123);

// Search schools
const results = await searchPilotSchools("អង្គរវត្ត");
```

### ❌ NEVER DO THIS:

```typescript
// DON'T: Direct prisma access
const schools = await prisma.school.findMany(); // Wrong table!
const schools = await prisma.pilot_schools.findMany(); // Direct access - avoid

// DON'T: Mixed approaches in different files
// Some files using pilot_schools, others using schools
```

## Database Table Comparison

| Feature | `schools` Table | `pilot_schools` Table ✅ |
|---------|-----------------|-------------------------|
| **Purpose** | General education management | TaRL pilot program |
| **Schema** | Complex (provinces, classes, students) | Simple (name, location, dates) |
| **Data Source** | Your Laravel system | TaRL program data |
| **Fields** | `name`, `code`, `province_id`, `district`, `commune` | `school_name`, `school_code`, `province`, `district` |
| **Records** | Variable | 33 pilot schools |
| **Use Case** | Full school management | TaRL assessments only |

## API Strategy

### Current APIs Using Correct Pattern:
- ✅ `/api/pilot-schools` - Uses `getAllPilotSchools()`

### APIs That Need Updating:
- ⚠️ `/api/schools` - Complex management API, keep for admin features
- ⚠️ `/api/students` - Check if using correct school references
- ⚠️ `/api/classes` - Check if using correct school references

## Frontend Guidelines

### Form Dropdowns:
```typescript
// Profile setup, assessment forms, etc.
const { data: schools } = await fetch('/api/pilot-schools');
```

### School Display:
```typescript
// Always show school_name from pilot_schools
<option value={school.id}>{school.school_name}</option>
```

## File Structure

```
lib/
└── schools.ts              # ✅ Standardized access functions
app/api/
├── pilot-schools/          # ✅ TaRL program schools
│   └── route.ts
└── schools/                # ⚠️ Legacy/admin management
    └── route.ts
```

## Quick Reference Commands

```bash
# Check pilot schools count
psql -c "SELECT COUNT(*) FROM pilot_schools;"

# View pilot schools structure  
psql -c "\d pilot_schools"

# Test API endpoint
curl http://localhost:3000/api/pilot-schools | jq .
```

## Migration Strategy

1. ✅ **Created**: `/lib/schools.ts` - Standardized functions
2. ✅ **Updated**: `/api/pilot-schools` - Uses standard functions
3. 🔄 **Next**: Update other APIs to use standard functions
4. 📝 **Document**: Add warnings to legacy code

## Rules to Follow

1. **Import Rule**: Always import from `/lib/schools.ts`
2. **API Rule**: Use `/api/pilot-schools` for dropdowns
3. **Database Rule**: Query `pilot_schools` table only
4. **Naming Rule**: Use `school_name` not `name`
5. **ID Rule**: Use `pilot_school_id` in user relationships

## When This Goes Wrong

### Symptoms:
- Empty school dropdowns
- "Expected JSON but got HTML" errors
- School not found errors
- Mismatched school IDs

### Debug Steps:
1. Check which table API is querying
2. Verify field names match database schema
3. Test API endpoint directly with curl
4. Check middleware permissions

## Success Metrics

✅ **Fixed Issues:**
- Profile setup page loads 33 schools
- School dropdowns populate correctly
- No more table confusion
- Consistent data across application

---

**Remember**: When in doubt, use `pilot_schools`. It's specifically designed for your TaRL application.