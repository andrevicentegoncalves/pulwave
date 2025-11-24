# Profile.jsx - Manual Tab Wrapping Instructions

The imports are done and the query is fixed. Now you just need to wrap the existing Card sections in Tabs.

## Current Structure (around line 390-523)

The current code has 3 Card sections:
1. Personal Information (lines ~400-432)
2. Company Details (lines ~435-448)
3. Address (lines ~451-516)

## What to Change

**Find this (around line 390):**
```javascript
<Form onSubmit={handleSubmit}>
  {/* Personal Information Section */}
  <Card header={...}>
    ...
  </Card>

  {/* Company Information Section */}
  <Card header={...}>
    ...
  </Card>

  {/* Address Section */}
  <Card header={...}>
    ...
  </Card>

  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Button type="submit"...>
  </div>
</Form>
```

**Replace with:**
```javascript
<Form onSubmit={handleSubmit}>
  <Tabs defaultTab={0}>
    <TabPanel label="Personal Info">
      {/* Personal Information Section */}
      <Card header={...}>
        ...
      </Card>
    </TabPanel>

    <TabPanel label="Professional">
      {/* Company Information Section */}
      <Card header={...}>
        ...
      </Card>
    </TabPanel>

    <TabPanel label="Address">
      {/* Address Section */}
      <Card header={...}>
        ...
      </Card>
    </TabPanel>
  </Tabs>

  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
    <Button type="submit"...>
  </div>
</Form>
```

## Key Points

1. ✅ Imports are already added
2. ✅ Query is already fixed to use `auth_user_id`
3. ⏳ Just need to add `<Tabs>` wrapper and `<TabPanel>` for each Card
4. Keep all existing Card content exactly as is
5. Keep the submit button outside the Tabs

That's it! The tab structure will work with the existing Cards.
