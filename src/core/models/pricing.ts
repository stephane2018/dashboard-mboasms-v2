import { BaseEntity } from './common';

export interface PricingPlanType extends BaseEntity {
    statusCode?: number;
    error?: string | null;
    message?: string | null;
    planNameFr: string;
    planNameEn: string;
    descriptionEn: string;
    descriptionFr: string;
    minSMS: number;
    maxSMS: number;
    nbDaysToExpired: number;
    smsUnitPrice: number;
    active: boolean;
    planCode: string;
    illustrationImgUrl: string;
}

export type PricingPlanResponseType = PricingPlanType[];