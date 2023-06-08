import { ApiProperty } from '@nestjs/swagger';
import { TotalWasteCost } from '../grocery.interface';

export class GroceryWasteCostVO {
  @ApiProperty()
  totalCostOfThisWeek: number;

  @ApiProperty()
  totalCostOfLastWeek: number;

  @ApiProperty()
  totalItemsOfThisWeek: number;

  @ApiProperty()
  totalItemsOfLastWeek: number;

  @ApiProperty()
  averageAccountCostOfThisWeek: number;

  @ApiProperty()
  averageAccountCostOfLastWeek: number;

  @ApiProperty()
  totalAccountItemsOfThisWeek: number;

  @ApiProperty()
  totalAccountItemsOfLastWeek: number;

  static toVO(
    thisWeekData: TotalWasteCost,
    lastWeekData: TotalWasteCost,
    thisWeekAverageData: TotalWasteCost,
    lastWeekAverageData: TotalWasteCost,
  ): GroceryWasteCostVO {
    const vo = new GroceryWasteCostVO();

    vo.totalCostOfThisWeek = thisWeekData?.totalCost || 0;
    vo.totalItemsOfThisWeek = thisWeekData?.totalItems || 0;

    vo.totalCostOfLastWeek = lastWeekData?.totalCost || 0;
    vo.totalItemsOfLastWeek = lastWeekData?.totalItems || 0;

    vo.averageAccountCostOfThisWeek = thisWeekAverageData?.totalCost || 0;
    vo.totalAccountItemsOfThisWeek = thisWeekAverageData?.totalItems || 0;

    vo.averageAccountCostOfLastWeek = lastWeekAverageData?.totalCost || 0;
    vo.totalAccountItemsOfLastWeek = lastWeekAverageData?.totalItems || 0;

    return vo;
  }
}
