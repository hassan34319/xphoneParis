export type variant = {
  sub: string;
  price: number;
  capacity: number;
  grade: string;
  color: string;
  image: string;
  quantity: number;
};

export type product = {
  _id?: string;
  name: string;
  brand: string;
  category: string;
  tags: string[];
  desc: string;
  variants: variant[];
};
