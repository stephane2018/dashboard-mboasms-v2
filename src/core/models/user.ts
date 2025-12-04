import { BaseEntity, AuthorityType } from './common';
import { Role } from '@/core/config/enum';
import { EnterpriseType } from './enterprise';
import { RechargeType } from './recharge';

// User interface
export interface UserType extends BaseEntity {
    email: string;
    phoneNumber: string;
    password: string;
    country: string;
    city: string;
    address: string;
    role: Role;
    firstName: string;
    lastName: string;
    userEnterprise: EnterpriseType;
    recharges: RechargeType[];
    enabled: boolean;
    username: string;
    authorities: AuthorityType[];
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
}
