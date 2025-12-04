# Type Definitions Organization

This directory contains all TypeScript type definitions for the MboaSMS application, organized by domain.

## File Structure

### Core Files

- **`common.ts`** - Shared types used across all models
  - `BaseEntity` - Base interface with common fields (id, createdAt, updatedAt, version, archived, deleted)
  - `ApiResponse<T>` - Generic API response wrapper
  - `PaginatedResponse<T>` - Generic paginated response
  - `SortType` - Sort information
  - `PageableType` - Pagination information
  - `AuthorityType` - User authority/permission

- **`@/core/config/enum.ts`** - All enums used in the application (centralized)
  - `Gender` - MALE, FEMALE
  - `Role` - SUPER_ADMIN, ADMIN, USER
  - `RechargeStatus` - DEMANDE, APPROVED, REJECTED
  - `PaymentMethod` - CASH, MOBILE_MONEY, BANK_TRANSFER, CREDIT_CARD

### Domain-Specific Files

- **`user.ts`** - User-related types
  - `UserType` - Complete user interface with authentication fields

- **`enterprise.ts`** - Enterprise/Company types
  - `EnterpriseType` - Complete enterprise interface

- **`contact-new.ts`** - Contact management types
  - `EnterpriseContactType` - Contact interface
  - `EnterpriseContactResponseType` - API response with full details
  - `CreateContactRequestType` - Create contact payload
  - `UpdateContactRequestType` - Update contact payload
  - `PaginatedEnterpriseContactsResponseType` - Paginated contacts response

- **`group.ts`** - Group management types
  - `GroupType` - Group interface
  - `CreateGroupType` - Create group payload
  - `AddContactsToGroupType` - Add contacts to group payload
  - `PaginatedGroupResponseType` - Paginated groups response

- **`country.ts`** - Country/Location types
  - `CountryType` - Country interface (Pays)
  - `PaginatedCountryResponseType` - Paginated countries response

- **`pricing.ts`** - Pricing plan types
  - `PricingPlanType` - Pricing plan interface
  - `PricingPlanResponseType` - Array of pricing plans

- **`recharge.ts`** - Recharge/Credit types
  - `RechargeType` - Recharge interface
  - `CreateRechargeRequestType` - Create recharge payload
  - `UpdateRechargeRequestType` - Update recharge payload
  - `CreditAccountRequestType` - Credit account payload
  - `PaginatedRechargeResponseType` - Paginated recharges response

- **`history.ts`** - Message history types
  - `MessageHistoryType` - Message history interface
  - `MessageStatus` - Message status enum
  - `HistoryType` - Simplified history for UI

- **`messages.ts`** - SMS message types
  - `SendMessageRequestType` - Send message payload
  - `SendMessageResponseType` - Send message response
  - `MessageType` - Message interface
  - `GetMessageResponseType` - Paginated messages

- **`company.ts`** - Company management types
  - `CreateCompanyRequestType` - Create company payload
  - `AddUserToEnterpriseRequestType` - Add user payload
  - `PaginatedCompaniesResponseType` - Paginated companies

- **`client.ts`** - Client management types
  - `CreateClientRequestType` - Create client payload
  - `UpdateClientRequestType` - Update client payload
  - `ClientResponseType` - Client response

- **`auth.ts`** - Authentication types
  - `LoginResponse` - Login response with token
  - `BasicUserType` - Simplified user for nested data

### Legacy Files (for backward compatibility)

- `user.model.ts` - Old user model
- `contact.ts` - Old contact types (use `contact-new.ts` instead)
- `groups.ts` - Old groups types (use `group.ts` instead)
- `recharges.ts` - Old recharges types (use `recharge.ts` instead)

## Usage

### Importing Types

```typescript
// Import from index for convenience
import { 
  UserType, 
  EnterpriseType, 
  PaginatedResponse,
  Gender,
  Role 
} from '@/core/models';

// Or import directly from specific files
import { UserType } from '@/core/models/user';
import { EnterpriseType } from '@/core/models/enterprise';

// Enums are centralized in config
import { Gender, Role } from '@/core/config/enum';
```

### Extending BaseEntity

All entity types should extend `BaseEntity` to inherit common fields:

```typescript
import { BaseEntity } from '@/core/models/common';

export interface MyEntityType extends BaseEntity {
  // Your custom fields here
  name: string;
  description: string;
}
```

### Using Generic Types

The `PaginatedResponse<T>` and `ApiResponse<T>` are generic types:

```typescript
import { PaginatedResponse, ApiResponse } from '@/core/models';

// Paginated response
type ContactsPage = PaginatedResponse<EnterpriseContactType>;

// API response
type ContactResponse = ApiResponse<EnterpriseContactType>;
```

## Type Relationships

```
BaseEntity (common.ts)
    ├── UserType (user.ts)
    ├── EnterpriseType (enterprise.ts)
    │   ├── CountryType (country.ts)
    │   ├── RechargeType (recharge.ts)
    │   │   └── PricingPlanType (pricing.ts)
    │   ├── EnterpriseContactType (contact-new.ts)
    │   │   ├── UserType
    │   │   └── GroupType (group.ts)
    │   └── GroupType
    │       └── EnterpriseContactType
    ├── CountryType
    ├── PricingPlanType
    ├── RechargeType
    ├── EnterpriseContactType
    └── GroupType

Enums (@/core/config/enum.ts)
    ├── Gender
    ├── Role
    ├── RechargeStatus
    └── PaymentMethod
```

## Best Practices

1. **Use centralized enums** - Always import enums from `@/core/config/enum`
2. **Use common types** - Import `BaseEntity`, `PaginatedResponse`, etc. from `common.ts`
3. **Avoid circular dependencies** - Use string IDs or forward declarations when needed
4. **Extend BaseEntity** - All entity types should extend BaseEntity
5. **Use generic types** - Leverage `PaginatedResponse<T>` and `ApiResponse<T>`
6. **Import from index** - Use `@/core/models` for convenience imports

## Migration from Legacy Types

If you're using old type files, migrate to the new structure:

- `contact.ts` → `contact-new.ts`
- `groups.ts` → `group.ts`
- `recharges.ts` → `recharge.ts`
- `company.ts` (updated to use common types)
- Import enums from `@/core/config/enum` instead of inline definitions

The new types use shared interfaces from `common.ts` and centralized enums from `@/core/config/enum.ts` for better maintainability.
