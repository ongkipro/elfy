export type CurrencyCode = 'MYR';
export type SupportedLanguage = 'EN' | 'MS';
export type SupportedCountry = 'MY';

export interface Money {
  amount: string;
  currencyCode: CurrencyCode;
}

export interface Image {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
  quantityAvailable?: number;
}

export interface Metafield {
  key: string;
  value: string;
  namespace: string;
}

export interface ShoeSizingSpec {
  eu: string;
  uk: string;
  us: string;
  cm: string;
}

export interface WatchSpecs {
  caseDiameter: string;
  lugWidth: string;
  movement: string;
  glass: string;
  waterResistance: string;
  strap: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  titleMs?: string;
  descriptionHtml: string;
  descriptionHtmlMs?: string;
  availableForSale: boolean;
  productType: 'Shoes' | 'Watches' | string;
  tags: string[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: Image;
  images: {
    nodes: Image[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: {
    nodes: ProductVariant[];
  };
  shoeSpecs?: ShoeSizingSpec[];
  watchSpecs?: WatchSpecs;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  titleMs?: string;
  description: string;
  descriptionMs?: string;
  image?: Image;
  productCount: number;
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      featuredImage: Image | null;
    };
    selectedOptions: SelectedOption[];
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: {
    nodes: CartLine[];
  };
}
