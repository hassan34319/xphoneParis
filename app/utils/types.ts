import { User } from "@prisma/client";

export type variant = {
  sub: string;
  price: number;
  capacity: number;
  grade: string;
  color: string;
  image: string;
  quantity: number;
};
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export interface NavbarProps {
  currentUser?: SafeUser | null;
}
export type product = {
  _id?: string;
  name: string;
  brand: string;
  category: string;
  tags: string[];
  desc: string;
  variants: variant[];
};
