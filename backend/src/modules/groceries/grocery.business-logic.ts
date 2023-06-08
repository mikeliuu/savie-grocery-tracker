import { GroceryEntity } from './grocery.entity';
import { TotalWasteCost } from './grocery.interface';

export const calculateWasteCost = (data: GroceryEntity[]): TotalWasteCost => {
  const { totalCost, totalItems } = data?.reduce(
    (acc: TotalWasteCost, cur) => {
      if (cur?.items?.length > 0) {
        const itemTotal = cur?.items?.reduce((acc, cur) => acc + cur?.price, 0);

        acc.totalCost += itemTotal;

        acc.totalItems += cur?.items?.length;
      }

      return acc;
    },
    { totalCost: 0, totalItems: 0 },
  );

  return { totalCost: +Number(totalCost).toFixed(2), totalItems };
};
