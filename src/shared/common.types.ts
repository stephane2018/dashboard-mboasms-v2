import type { ReactNode } from "react";
import type { CSSProperties } from "react";

export interface GenericType {
  [k: string]: string | number | boolean | null | undefined | GenericType | GenericType[];
}


export interface CommonProps {
  className?: string;
  children?: ReactNode;
  styles?: CSSProperties;
}