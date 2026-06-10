export type StatisticSummary = {
  label: string;
  value: number;
  helper?: string;
  format: 'currency' | 'number';
};

export type MarketExpensePoint = {
  marketId: string;
  name: string;
  marketDate: string;
  totalAmount: number;
};

export type CategoryExpensePoint = {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  itemCount: number;
};

export type ProductVariationPoint = {
  productId: string;
  productName: string;
  currentPrice: number;
  previousPrice: number;
  difference: number;
  percentage: number;
  status: 'up' | 'down' | 'equal';
};

export type StatisticsOverview = {
  summaries: StatisticSummary[];
  recentMarkets: MarketExpensePoint[];
  categoryExpenses: CategoryExpensePoint[];
  productVariations: ProductVariationPoint[];
};
