import moment from 'moment';
import { SINCE_DAY } from 'src/core/constants/global';
import { SinceParam } from 'src/modules/groceries/grocery.interface';

export const dateFromNow = (value: string | Date | null): string => {
  if (!value) return '';

  return moment(value).fromNow();
};

export const getSinceDay = (
  since: SinceParam | undefined,
  defaultSince?: SinceParam,
) => {
  const targetSince = since ?? defaultSince;

  const sinceDays = () => {
    switch (targetSince) {
      case SinceParam.Monthly:
        return SINCE_DAY.MONTHLY;
        break;

      case SinceParam.Weekly:
        return SINCE_DAY.WEEKLY;
        break;

      case SinceParam.Today:
        return SINCE_DAY.TODAY;
        break;

      default:
        return SINCE_DAY.WEEKLY;
        break;
    }
  };

  return sinceDays();
};
