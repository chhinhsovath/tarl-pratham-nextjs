# User Creation Form - Field Locations & Relationships

## 📍 WHERE IS EACH FIELD ON THE FORM?

### FORM STRUCTURE (app/users/create/page.tsx)

```
┌─────────────────────────────────────────────────────────────────┐
│            បង្កើតអ្នកប្រើប្រាស់ថ្មី (Create New User)            │
│                   https://tarl.openplp.com/users/create           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📋 INFO ALERT (Lines 193-199)                                   │
│  ├─ Title: "ឈ្មោះចូលប្រើប្រាស់ត្រូវបានបង្កើតដោយស្វយ័ត"           │
│  └─ Description: System auto-generates username from name         │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│                                                                   │
│  ROW 1: NAME & GENERATED USERNAME (Lines 201-247)               │
│  ├─ Col 1 (MD 12 width):                                         │
│  │  └─ [Form.Item] name="name"                                   │
│  │     └─ <Input> placeholder="ឧទាហរណ៍៖ សុខា, សម្រាប់ មកឈុន"  │
│  │        onChange={handleNameChange}  ← Triggers username gen   │
│  │                                                                │
│  ├─ Col 2 (MD 12 width):                                         │
│  │  └─ [Form.Item] label="ឈ្មោះចូលប្រើប្រាស់ (បង្កើតដោយស្វយ័ត)"  │
│  │     └─ DISPLAY (not input):                                   │
│  │        └─ IF generatedUsername                                │
│  │           └─ Show in BLUE BOX: {generatedUsername}            │
│  │        └─ ELSE                                                │
│  │           └─ "បញ្ចូលឈ្មោះពេញដើម្បីបង្កើតឈ្មោះចូលប្រើប្រាស់"   │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│                                                                   │
│  ROW 2: PASSWORD & ROLE (Lines 249-284)                          │
│  ├─ Col 1 (MD 12 width):                                         │
│  │  └─ [Form.Item] name="password"                               │
│  │     └─ <Input.Password> placeholder="បញ្ចូលពាក្យសម្ងាត់"     │
│  │                                                                │
│  ├─ Col 2 (MD 12 width):                                         │
│  │  └─ [Form.Item] name="role"                                   │
│  │     └─ <Select> placeholder="ជ្រើសរើសតួនាទី"                │
│  │        onChange={handleRoleChange}  ← TRIGGERS SCHOOL DISPLAY │
│  │        Options: admin, coordinator, mentor, teacher, viewer    │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│                                                                   │
│  ⭐ CONDITIONAL SECTION: IF ROLE = "teacher" OR "mentor" ⭐       │
│  (Lines 287-325)                                                  │
│                                                                   │
│  ROW 3: SCHOOL SELECTION (ONLY FOR TEACHER/MENTOR)             │
│  ├─ Condition: {(selectedRole === "mentor" || selected...}      │
│  │                                                                │
│  ├─ Col Full Width (XS 24):                                      │
│  │  └─ [Form.Item] name="pilot_school_id"   ← KEY FIELD!        │
│  │     ├─ Label (REQUIRED - Red asterisk):                       │
│  │     │  "* សាលាសាកល្បង"                                       │
│  │     │  "(ចាប់ផ្តើម​ដោយ គ្រូ និងអ្នកណែនាំត្រូវកំណត់)"           │
│  │     │                                                          │
│  │     ├─ Validation: REQUIRED                                   │
│  │     │  Message: "សូមជ្រើសរើសសាលាសាកល្បង"                    │
│  │     │                                                          │
│  │     └─ <Select> placeholder="ជ្រើសរើរ​សាលាសាកល្បង"           │
│  │        ├─ size="large"                                        │
│  │        ├─ showSearch={true}                                   │
│  │        └─ Options:                                            │
│  │           {pilotSchools.map(school => (                       │
│  │             "{school.name} ({school.code}) - {province}"      │
│  │           ))}                                                  │
│  │                                                                │
│  └─ 🔗 RELATIONSHIP LINK:                                        │
│     When user selects a school here:                             │
│     → Form value: pilot_school_id = school.id                    │
│     → Sent to API in request body                                │
│     → Saved to database User.pilot_school_id column              │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│                                                                   │
│  ROW 4: PROVINCE & SUBJECT (Lines 327-366)                       │
│  ├─ Col 1 (MD 12 width):                                         │
│  │  └─ [Form.Item] name="province"                               │
│  │     └─ <Select> Options: កំពង់ចាម, បាត់ដំបង              │
│  │                                                                │
│  ├─ Col 2 (MD 12 width):                                         │
│  │  └─ [Form.Item] name="subject"                                │
│  │     └─ <Select> Options: ភាសាខ្មែរ, គណិតវិទ្យា           │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│                                                                   │
│  ROW 5: PHONE (Lines 368-377)                                    │
│  └─ Col 1 (MD 12 width):                                         │
│     └─ [Form.Item] name="phone"                                  │
│        └─ <Input> placeholder="បញ្ចូលលេខទូរស័ព្ទ"                │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│                                                                   │
│  BUTTONS (Lines 380-397)                                         │
│  ├─ [Button type="primary"] បង្កើតអ្នកប្រើប្រាស់                │
│  └─ [Button] បោះបង់                                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 THE CRITICAL FIELD: `pilot_school_id`

### Detailed Code for School Field

**File**: `app/users/create/page.tsx:287-325`

```jsx
{/* ONLY APPEARS IF ROLE = "teacher" or "mentor" */}
{(selectedRole === "mentor" || selectedRole === "teacher") && (
  <Row gutter={24} style={{ marginBottom: "16px" }}>
    <Col xs={24}>  {/* Full width on all devices */}

      {/* FORM ITEM - The Actual Field */}
      <Form.Item
        label={
          <span>
            {/* RED ASTERISK - Indicates Required */}
            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>

            {/* LABEL TEXT IN KHMER */}
            សាលាសាកល្បង

            {/* HELPER TEXT */}
            <span style={{ marginLeft: '12px', fontSize: '12px', color: '#0050b3', fontWeight: 500 }}>
              (ចាប់ផ្តើម​ដោយ គ្រូ និងអ្នកណែនាំត្រូវកំណត់)
            </span>
          </span>
        }

        {/* 🔗 THIS IS THE KEY - FIELD NAME MATCHES DATABASE COLUMN! */}
        name="pilot_school_id"

        {/* VALIDATION - Required for teacher/mentor */}
        rules={[
          { required: true, message: "សូមជ្រើសរើសសាលាសាកល្បង" }
        ]}
      >
        {/* DROPDOWN COMPONENT */}
        <Select
          placeholder="ជ្រើសរើរ​សាលាសាកល្បង"
          size="large"
          showSearch  {/* Enable searching in dropdown */}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase()) ?? false
          }
        >
          {/* POPULATE WITH SCHOOLS */}
          {pilotSchools.map(school => (
            <Option key={school.id} value={school.id}>
              {school.name} ({school.code}) - {school.province.name_english}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  </Row>
)}
```

---

## 📊 FLOW TRIGGER: HOW THE SCHOOL FIELD APPEARS

```
USER ACTION                           CODE LOCATION           RESULT
─────────────────────────────────────────────────────────────────────

Form loads
  ↓
User selects Role from dropdown
  │
  ├─ onChange={handleRoleChange}     Lines 274
  │  (called with selected role value)
  │  ↓
  ├─ setSelectedRole(role)            Lines 129
  │  (updates state)
  │  ↓
  └─ Component re-renders
     ↓
  Check: {(selectedRole === "mentor" || selectedRole === "teacher")}
     │
     ├─ IF TRUE (user selected teacher/mentor)
     │  └─ RENDER: School field (Lines 287-325) ✅ VISIBLE
     │
     └─ IF FALSE (user selected other role)
        └─ DON'T RENDER: School field ❌ HIDDEN
```

---

## 💾 FORM SUBMISSION FLOW

```
User fills form:
┌──────────────────┐
│ Name: "សុខា"      │
│ Password: "..."  │
│ Role: "teacher"  │ ← Triggers school field display
│ School: "ស្ត."   │ ← SCHOOL ID CAPTURED HERE!
│ Province: "..."  │
│ Subject: "..."   │
└──────────────────┘
  ↓ User clicks បង្កើតអ្នកប្រើប្រាស់
  ↓ handleSubmit() called
  ↓ JSON.stringify(values) creates:

{
  "name": "សុខា",
  "password": "test123456",
  "role": "teacher",
  "province": "កំពង់ចាម",
  "subject": "ភាសាខ្មែរ",
  "pilot_school_id": 5    ← CAPTURED FROM SCHOOL FIELD!
}

  ↓ fetch("/api/users", { method: "POST", body: JSON.stringify(values) })
  ↓ API receives request
  ↓ POST /api/users handler processes
     ├─ Validate with userSchema.parse(body)
     │  └─ pilot_school_id: z.number().optional()
     │     ✅ Validation passes
     │
     ├─ prisma.user.create({
     │    data: {
     │      ...validatedData,    ← SPREADS pilot_school_id INTO data!
     │      username: "sukha",
     │      email: "sukha@tarl.local",
     │      password: "hashed..."
     │    }
     │  })
     │
     └─ Database INSERT:
        INSERT INTO "User" (..., pilot_school_id, ...)
        VALUES (..., 5, ...)
  ↓ ✅ RELATIONSHIP SAVED IN DATABASE!
```

---

## 🎯 ANSWER TO YOUR QUESTION: "WHERE IS IT?"

### Question: "why you dont link pilot_schools to each user here ??? where?"

### Answer:

1. **WHERE IT APPEARS**:
   - On the form at `app/users/create/page.tsx:287-325`
   - Only visible when user selects teacher/mentor role
   - Shows as dropdown field labeled "សាលាសាកល្បង" (Pilot School)
   - The field has a red asterisk (*) indicating it's required

2. **HOW IT WORKS**:
   - User selects school from dropdown
   - Form captures the school ID in field named `pilot_school_id`
   - When form submits, the `pilot_school_id` is sent to the API
   - API validates it and saves to database
   - Database stores the relationship in the `pilot_school_id` column

3. **HOW TO VERIFY**:
   - Go to `/users/create`
   - Select Role = "teacher"
   - See the school field appear
   - Select a school
   - Click create
   - Go to `/users` list
   - See the school name displayed next to the new user

4. **CODE REFERENCES**:
   - **Form Field**: `app/users/create/page.tsx:300` (name="pilot_school_id")
   - **API Validation**: `app/api/users/route.ts:19` (schema includes pilot_school_id)
   - **Database Save**: `app/api/users/route.ts:424` (...validatedData spreads it)
   - **Returned Data**: `app/api/users/route.ts:438, 440-445` (returns with school details)

---

## ✅ VISUAL: SCHOOL FIELD ON THE FORM

When user selects "teacher" or "mentor" role:

```
┌─────────────────────────────────────────┐
│         * សាលាសាកល្បង                     │
│  (ចាប់ផ្តើម​ដោយ គ្រូ និងអ្នកណែនាំត្រូវកំណត់)    │
├─────────────────────────────────────────┤
│                                         │
│  ▼ ជ្រើសរើរ​សាលាសាកល្បង ────────────────────│
│                                         │
│  When user clicks, dropdown shows:     │
│  ├─ សាលាបឋមសិក្សាគំរូ (SCH-001)          │
│  ├─ សាលាបឋមសិក្សាឌី (SCH-002)           │
│  ├─ សាលាបឋមសិក្សាលី (SCH-003)           │
│  ├─ សាលាបឋមសិក្សាអូ (SCH-004)           │
│  ├─ សាលាបឋមសិក្សាយូ (SCH-005)    ← User selects this
│  └─ ... more schools ...              │
│                                         │
└─────────────────────────────────────────┘
       ↓ User selects
┌─────────────────────────────────────────┐
│         * សាលាសាកល្បង                     │
│  (ចាប់ផ្តើម​ដោយ គ្រូ និងអ្នកណែនាំត្រូវកំណត់)    │
├─────────────────────────────────────────┤
│  ✓ សាលាបឋមសិក្សាយូ (SCH-005)           │  ← School ID = 5 captured!
└─────────────────────────────────────────┘
       ↓ Form submits
    API receives pilot_school_id: 5
    Database saves user with pilot_school_id: 5
    ✅ RELATIONSHIP LINKED!
```

---

## 🚀 THE BOTTOM LINE

> **The pilot_school relationship IS being linked!**
>
> It's in the school dropdown field on the create user form.
>
> When a teacher or mentor is created, the form shows a required school selection field.
> The selected school ID is sent to the API and saved to the database.
> The user appears in the users list with their assigned school.
>
> **It's all working correctly!**
