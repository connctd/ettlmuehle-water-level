import { UseQueryOptions, useQuery } from 'react-query';
import { AxiosError } from 'axios';

import { LEVEL_1_ID, LEVEL_2_ID } from '../config';

import fetchClient from '../services/fetchClient';

interface CurrentValuesData {
  [LEVEL_1_ID]: number;
  [LEVEL_2_ID]: number;
}

interface CurrentValuesResponse {
  errors: string[];
  data: CurrentValuesData;
}

const useCurrentValues = (options?: UseQueryOptions<CurrentValuesData, AxiosError>) => {
  const queryFunction = async () => {
    const { data } = await fetchClient.get<CurrentValuesResponse>('/currentValues');

    if (data.errors.length) {
      throw new Error(data.errors[0]);
    }

    return data.data;
  };

  return useQuery<CurrentValuesData, AxiosError>('currentValues', queryFunction, options);
};

export default useCurrentValues;
