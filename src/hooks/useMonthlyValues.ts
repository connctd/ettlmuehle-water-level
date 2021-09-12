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

export type MonthlyValuesData = DataEntry[];

interface MonthlyValuesResponse {
  errors: string[];
  data: MonthlyValuesData;
}

const currentDateTime = moment().toISOString();

const useMonthlyValues = (options?: UseQueryOptions<MonthlyValuesData, AxiosError>) => {
  const queryFunction = async () => {
    const { data } = await fetchClient.get<MonthlyValuesResponse>('/month', {
      params: {
        to: currentDateTime,
        n: 9
      }
    });

    if (data.errors.length) throw new Error(data.errors[0]);

    return data.data;
  };

  return useQuery<MonthlyValuesData, AxiosError>('monthlyValues', queryFunction, options);
};

export default useMonthlyValues;
