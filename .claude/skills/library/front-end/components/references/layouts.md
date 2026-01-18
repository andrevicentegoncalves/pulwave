# Layout Patterns

## Page Layouts

### Standard Page
```tsx
<Screen>
  <ScreenHeader title="Page Title" />
  <ScreenContent padding="$4">
    {/* Main content */}
  </ScreenContent>
</Screen>
```

### Page with Sidebar
```tsx
<HStack>
  <Sidebar width={240}>
    <Navigation items={navItems} />
  </Sidebar>
  <Box flex={1} padding="$6">
    {/* Main content */}
  </Box>
</HStack>
```

### Dashboard Layout
```tsx
<VStack gap="$6" padding="$6">
  <PageHeader title="Dashboard" actions={<Button>Export</Button>} />
  
  <HStack gap="$4">
    <StatCard title="Users" value="1,234" />
    <StatCard title="Revenue" value="$12,345" />
    <StatCard title="Orders" value="567" />
  </HStack>
  
  <Card>
    <CardHeader>Recent Activity</CardHeader>
    <CardBody>
      <ActivityList items={activities} />
    </CardBody>
  </Card>
</VStack>
```

## Form Layouts

### Basic Form
```tsx
<VStack gap="$4" padding="$4">
  <Input label="Name" {...register('name')} />
  <Input label="Email" type="email" {...register('email')} />
  <Button type="submit" isLoading={isSubmitting}>
    Submit
  </Button>
</VStack>
```

### Two-Column Form
```tsx
<VStack gap="$4">
  <HStack gap="$4">
    <Input label="First Name" flex={1} />
    <Input label="Last Name" flex={1} />
  </HStack>
  <Input label="Email" />
  <HStack gap="$4">
    <Input label="City" flex={1} />
    <Select label="State" flex={1} />
    <Input label="ZIP" width={120} />
  </HStack>
</VStack>
```

### Settings Form
```tsx
<VStack gap="$6">
  <FormSection title="Profile">
    <Input label="Username" />
    <Textarea label="Bio" />
  </FormSection>
  
  <FormSection title="Notifications">
    <Switch label="Email notifications" />
    <Switch label="Push notifications" />
  </FormSection>
  
  <HStack justifyContent="flex-end">
    <Button variant="outline">Cancel</Button>
    <Button variant="solid">Save Changes</Button>
  </HStack>
</VStack>
```

## List Patterns

### Basic List Item
```tsx
<HStack
  padding="$4"
  gap="$3"
  alignItems="center"
  borderBottomWidth={1}
  borderColor="$borderLight"
>
  <Avatar source={{ uri: imageUrl }} size="md" />
  <VStack flex={1}>
    <Text fontWeight="$semibold">{title}</Text>
    <Text color="$textSecondary" fontSize="$sm">{subtitle}</Text>
  </VStack>
  <Icon name="chevron-right" color="$textTertiary" />
</HStack>
```

### Card Grid
```tsx
<Grid columns={3} gap="$4">
  {items.map(item => (
    <Card key={item.id}>
      <CardImage src={item.image} />
      <CardBody>
        <Heading size="sm">{item.title}</Heading>
        <Text color="$textSecondary">{item.description}</Text>
      </CardBody>
    </Card>
  ))}
</Grid>
```

## Empty State Pattern
```tsx
<VStack alignItems="center" padding="$8" gap="$4">
  <Icon name="inbox" size={48} color="$textTertiary" />
  <Heading size="md">No items yet</Heading>
  <Text color="$textSecondary" textAlign="center">
    Create your first item to get started
  </Text>
  <Button onClick={onCreate}>Create Item</Button>
</VStack>
```
