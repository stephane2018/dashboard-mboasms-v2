import { BaseEntity, PaginatedResponse, ApiResponse } from './common';
import { EnterpriseContactResponseType } from './contact-new';

// Group interface
export interface GroupType extends BaseEntity {
    statusCode?: number;
    error?: string;
    message?: string;
    groupId?: string | null;
    name: string;
    code: string;
    enterprise: string;
    enterpriseContacts: EnterpriseContactResponseType[];
}

// Create Group Request
export interface CreateGroupType {
    name: string;
    code: string;
    enterpriseId: string;
}

// Add Contacts to Group Request
export interface AddContactsToGroupType {
    listContactid: string[];
}

// Paginated Group Response
export type PaginatedGroupResponseType = PaginatedResponse<GroupType>;
