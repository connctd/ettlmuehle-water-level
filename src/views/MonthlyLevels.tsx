import React from 'react';
import moment from 'moment';

import { LEVEL_1_ID, LEVEL_2_ID } from '../config';

import { MonthlyValuesData } from '../hooks/useMonthlyValues';

import SmallSection from '../components/SmallSection';
import Chart from '../components/Chart';
import DataTable from '../components/DataTable';

interface MonthlyLevelsProps {
  data: MonthlyValuesData;
}

const MonthlyLevels: React.FC<MonthlyLevelsProps> = ({ data }) => {
  const sortedData = data.sort((a, b) => moment(a.to).unix() - moment(b.to).unix());

  const categories = sortedData.map((dataEntry) => moment(dataEntry.from).format('MM.YYYY'));
  const dataLevel1 = sortedData.map((dataEntry) => dataEntry.levels[LEVEL_1_ID] / 10);
  const dataLevel2 = sortedData.map((dataEntry) => dataEntry.levels[LEVEL_2_ID] / 10);

  const formattedData = sortedData.map((dataEntry) => ({
    date: moment(dataEntry.from).format('MM.YYYY'),
    level1: dataEntry.levels[LEVEL_1_ID] / 10,
    level2: dataEntry.levels[LEVEL_2_ID] / 10
  }));

  return (
    <SmallSection
      title="Ø Wasserstände pro Monat"
      chart={(
        <Chart
          categories={categories}
          data1={dataLevel1}
          data2={dataLevel2}
        />
      )}
      table={(
        <DataTable
          dateHeader="Monat"
          data={formattedData}
          dataCyPrefix="monthly"
        />
      )}
    />
  );
};

export default MonthlyLevels;
