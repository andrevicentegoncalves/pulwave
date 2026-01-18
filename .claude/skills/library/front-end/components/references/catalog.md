# Core Components Catalog

## Layout Components

### Box
Base container with token support:
```tsx
<Box
  padding="$4"
  backgroundColor="$backgroundPrimary"
  borderRadius="$lg"
>
  {children}
</Box>
```

### HStack / VStack
Flex layouts:
```tsx
<HStack gap="$3" alignItems="center">
  <Icon name="user" />
  <Text>Username</Text>
</HStack>

<VStack gap="$4" padding="$4">
  <Heading>Title</Heading>
  <Text>Content</Text>
</VStack>
```

## Interactive Components

### Button
```tsx
<Button
  onClick={handleClick}
  variant="solid"     // solid | outline | ghost | link
  size="md"           // sm | md | lg
  isLoading={loading}
  disabled={disabled}
>
  Click Me
</Button>
```

| Variant | Use For |
|---------|---------|
| `solid` | Primary actions |
| `outline` | Secondary actions |
| `ghost` | Tertiary/subtle |
| `link` | Inline actions |

### Input
```tsx
<Input
  value={value}
  onChange={setValue}
  placeholder="Enter text"
  error={touched ? errors.field : undefined}
  label="Field Name"
/>
```

## Content Components

### Card
```tsx
<Card padding="$4" gap="$3">
  <CardHeader>
    <Heading size="sm">Title</Heading>
  </CardHeader>
  <CardBody>
    <Text>Content</Text>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Text
```tsx
<Text 
  fontSize="$lg" 
  fontWeight="$semibold" 
  color="$textPrimary"
>
  Hello World
</Text>
```

### Heading
```tsx
<Heading size="xl" as="h1">Page Title</Heading>
<Heading size="lg" as="h2">Section Title</Heading>
<Heading size="md" as="h3">Subsection</Heading>
```

## Compound Components

### Tabs
```tsx
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
  <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
</Tabs>
```

### Accordion
```tsx
<Accordion>
  <Accordion.Item value="item1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Modal
```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <Button onClick={onClose}>Cancel</Button>
    <Button variant="solid">Confirm</Button>
  </Modal.Footer>
</Modal>
```
