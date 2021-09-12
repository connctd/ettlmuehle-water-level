import { UseQueryOptions, useQuery } from 'react-query';
import { AxiosError } from 'axios';
import moment from 'moment';

import { LEVEL_1_ID, LEVEL_2_ID } from '../config';

import fetchClient from '../services/fetchClient';

interface DataEntry {
  from: string;
  to: string;
  levels: {
    [LEVEL_1_ID]: number;
    [LEVEL_2_ID]: number;
  };
}

export type WeeklyValuesData = DataEntry[];

interface WeeklyValuesResponse {
  errors: string[];
  data: WeeklyValuesData;
}

const currentDateTime = moment().toISOString();
// const weekAgoDateTime = moment().subtract(1, 'weeks').toISOString();

const useWeeklyValues = (options?: UseQueryOptions<WeeklyValuesData, AxiosError>) => {
  const queryFunction = async () => {
    const { data } = await fetchClient.get<WeeklyValuesResponse>('/weeks', {
      params: {
        to: currentDateTime,
        n: 10
      }
    });

    if (data.errors.length) throw new Error(data.errors[0]);

    return data.data;
  };

  return useQuery<WeeklyValuesData, AxiosError>('weeklyValues', queryFunction, options);
};

export default useWeeklyValues;
