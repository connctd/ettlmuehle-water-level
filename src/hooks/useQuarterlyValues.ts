import { UseQueryOptions, useQuery } from 'react-query';
import { AxiosError } from 'axios';
import moment from 'moment';

import { LEVEL_1_ID, LEVEL_2_ID } from '../config';

import fetchClient from '../services/fetchClient';

export interface QuarterlyValuesData {
  [key: string]: {
    [LEVEL_1_ID]: number;
    [LEVEL_2_ID]: number;
  };
}

interface QuarterlyValuesResponse {
  errors: string[];
  data: QuarterlyValuesData;
}

const currentMoment = moment();
const pastMoment = moment().subtract(1, 'weeks');

const currentDateTime = currentMoment.toISOString();
const pastDateTime = pastMoment.toISOString();

const useQuarterlyValues = (options?: UseQueryOptions<QuarterlyValuesData, AxiosError>) => {
  const queryFunction = async () => {
    const { data } = await fetchClient.get<QuarterlyValuesResponse>('/quarterly', {
      params: {
        from: pastDateTime,
        to: currentDateTime
      }
    });

    if (data.errors.length) throw new Error(data.errors[0]);

    return data.data;
  };

  return useQuery<QuarterlyValuesData, AxiosError>('quarterlyValues', queryFunction, options);
};

export default useQuarterlyValues;
