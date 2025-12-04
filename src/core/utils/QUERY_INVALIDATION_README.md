# Query Invalidation by User Role

## Overview

This module provides role-based query invalidation for TanStack Query (React Query). It automatically invalidates the appropriate cache based on the user's role, ensuring data consistency and security.

## User Roles

- **SUPER_ADMIN**: Full access to all data
- **ADMIN**: Access to enterprise-level data
- **USER**: Access to their own data only

## Invalidation Strategy

### SUPER_ADMIN
- Invalidates **all** queries for the entity type
- Can see and modify all data across the system

### ADMIN
- Invalidates **list queries** for the entity type
- Can invalidate specific entities by ID
- Restricted to enterprise-level operations

### USER
- Invalidates **specific queries** by ID only
- Cannot invalidate list queries
- Can only see/modify their own data

## Usage

### Basic Usage - Invalidate All Contacts

```typescript
import { invalidateContactQueries } from "@/core/utils/query-invalidation"
import { useQueryClient } from "@tanstack/react-query"

export function useCreateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => createContact(data),
    onSuccess: () => {
      // Automatically invalidates based on user role
      invalidateContactQueries(queryClient)
    },
  })
}
```

### Invalidate Specific Contact

```typescript
export function useUpdateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateContact(id, data),
    onSuccess: (data, variables) => {
      // Invalidates specific contact based on user role
      invalidateContactQueries(queryClient, variables.id)
    },
  })
}
```

### Invalidate Multiple Entity Types

```typescript
import { invalidateMultipleQueries } from "@/core/utils/query-invalidation"

export function useComplexOperation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => complexOperation(data),
    onSuccess: () => {
      // Invalidates contacts, users, and enterprises based on role
      invalidateMultipleQueries(queryClient, ["contacts", "users", "enterprises"])
    },
  })
}
```

## API Reference

### `invalidateQueriesByRole(queryClient, entityType, options?)`

Main function for role-based query invalidation.

**Parameters:**
- `queryClient`: TanStack Query client instance
- `entityType`: `"contacts" | "users" | "enterprises"`
- `options`:
  - `specificId?`: Specific entity ID to invalidate
  - `includeRelated?`: Also invalidate related entities

**Example:**
```typescript
await invalidateQueriesByRole(queryClient, "contacts", {
  specificId: "contact-123",
  includeRelated: true
})
```

---

### `invalidateContactQueries(queryClient, contactId?)`

Shorthand for invalidating contact queries.

**Parameters:**
- `queryClient`: TanStack Query client instance
- `contactId?`: Optional specific contact ID

**Example:**
```typescript
invalidateContactQueries(queryClient)
invalidateContactQueries(queryClient, "contact-123")
```

---

### `invalidateUserQueries(queryClient, userId?)`

Shorthand for invalidating user queries.

**Parameters:**
- `queryClient`: TanStack Query client instance
- `userId?`: Optional specific user ID

---

### `invalidateEnterpriseQueries(queryClient, enterpriseId?)`

Shorthand for invalidating enterprise queries.

**Parameters:**
- `queryClient`: TanStack Query client instance
- `enterpriseId?`: Optional specific enterprise ID

---

### `invalidateMultipleQueries(queryClient, entityTypes)`

Invalidate multiple entity types at once.

**Parameters:**
- `queryClient`: TanStack Query client instance
- `entityTypes`: Array of entity types to invalidate

**Example:**
```typescript
await invalidateMultipleQueries(queryClient, ["contacts", "users"])
```

---

### `canPerformAction(action, entityType)`

Check if user can perform an action based on their role.

**Parameters:**
- `action`: `"create" | "read" | "update" | "delete"`
- `entityType`: `"contacts" | "users" | "enterprises"`

**Returns:** `boolean`

**Example:**
```typescript
if (canPerformAction("delete", "contacts")) {
  // Show delete button
}
```

## Query Keys Structure

The module provides centralized query keys:

```typescript
queryKeys.contacts.all          // All contact queries
queryKeys.contacts.lists()      // Contact list queries
queryKeys.contacts.list(filters) // Filtered contact queries
queryKeys.contacts.details()    // Contact detail queries
queryKeys.contacts.detail(id)   // Specific contact query

// Same structure for users and enterprises
queryKeys.users.*
queryKeys.enterprises.*
```

## Role-Based Behavior

### Creating a Contact

```
SUPER_ADMIN  → Invalidates all contact queries
ADMIN        → Invalidates contact list queries
USER         → Invalidates all contact queries (can create)
```

### Updating a Contact

```
SUPER_ADMIN  → Invalidates specific contact + all queries
ADMIN        → Invalidates specific contact + lists
USER         → Invalidates specific contact only
```

### Deleting a Contact

```
SUPER_ADMIN  → Invalidates all contact queries
ADMIN        → Invalidates all contact queries
USER         → Cannot delete (permission denied)
```

## Integration with Hooks

All contact hooks now use role-based invalidation:

- `useCreateContact()` - Uses `invalidateContactQueries()`
- `useUpdateContact()` - Uses `invalidateContactQueries(contactId)`
- `useDeleteContact()` - Uses `invalidateContactQueries()`
- `useImportContacts()` - Uses `invalidateContactQueries()`

## Best Practices

1. **Always use the shorthand functions** when possible:
   ```typescript
   // ✅ Good
   invalidateContactQueries(queryClient)
   
   // ❌ Avoid
   queryClient.invalidateQueries({ queryKey: contactKeys.all })
   ```

2. **Pass specific IDs when updating**:
   ```typescript
   // ✅ Good - More efficient
   invalidateContactQueries(queryClient, contactId)
   
   // ❌ Less efficient
   invalidateContactQueries(queryClient)
   ```

3. **Check permissions before showing UI**:
   ```typescript
   if (canPerformAction("delete", "contacts")) {
     return <DeleteButton />
   }
   ```

4. **Use `includeRelated` for complex operations**:
   ```typescript
   // When operation affects multiple entities
   await invalidateQueriesByRole(queryClient, "contacts", {
     includeRelated: true
   })
   ```

## Error Handling

The invalidation functions include error handling:

```typescript
try {
  await invalidateContactQueries(queryClient)
} catch (error) {
  console.error("Failed to invalidate queries:", error)
  // Fallback logic
}
```

## Performance Considerations

- **SUPER_ADMIN**: Invalidates more queries, may cause more refetches
- **ADMIN**: Balanced approach, invalidates at enterprise level
- **USER**: Most efficient, only invalidates specific queries

For large datasets, consider using:
```typescript
// Invalidate only specific contact
invalidateContactQueries(queryClient, specificContactId)
```

## Migration Guide

If you're updating existing code:

**Before:**
```typescript
queryClient.invalidateQueries({ queryKey: contactKeys.all })
```

**After:**
```typescript
invalidateContactQueries(queryClient)
```

The new approach automatically handles role-based logic without changing the call site.
