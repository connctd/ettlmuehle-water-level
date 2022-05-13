import React from 'react';
import moment from 'moment';

import { LEVEL_1_ID, LEVEL_2_ID } from '../config';

import { WeeklyValuesData } from '../hooks/useWeeklyValues';
import { normalizeLevel } from '../utils/levels';

import SmallSection from '../components/SmallSection';
import Chart from '../components/Chart';
import DataTable from '../components/DataTable';

interface WeeklyLevelsProps {
  data: WeeklyValuesData;
}

const getFromToString = (from: string, to: string) => (
  `${moment(from).format('DD.MM.YY')} - ${moment(to).format('DD.MM.YY')}`
);

const WeeklyLevels: React.FC<WeeklyLevelsProps> = ({ data }) => {
  const sortedData = data.sort((a, b) => moment(a.to).unix() - moment(b.to).unix());

  const categories = sortedData.map((dataEntry) => getFromToString(dataEntry.from, dataEntry.to));
  const dataLevel1 = sortedData.map((dataEntry) => normalizeLevel(dataEntry.levels[LEVEL_1_ID]));
  const dataLevel2 = sortedData.map((dataEntry) => normalizeLevel(dataEntry.levels[LEVEL_2_ID]));

  const formattedData = sortedData.map((dataEntry) => ({
    date: getFromToString(dataEntry.from, dataEntry.to),
    level1: normalizeLevel(dataEntry.levels[LEVEL_1_ID]),
    level2: normalizeLevel(dataEntry.levels[LEVEL_2_ID])
  }));

  return (
    <SmallSection
      title="Ø Wasserstände pro Woche"
      chart={(
        <Chart
          categories={categories}
          data1={dataLevel1}
          data2={dataLevel2}
        />
      )}
      table={(
        <DataTable
          dateHeader="Woche"
          data={formattedData}
          dataCyPrefix="weekly"
        />
      )}
    />
  );
};

export default WeeklyLevels;
