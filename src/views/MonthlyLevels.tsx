import React from 'react';

import { DataEntry } from '../@types/data';

import SmallSection from '../components/SmallSection';
import Chart from '../components/Chart';
import DataTable from '../components/DataTable';

interface WeeklyLevelsProps {
  data: DataEntry[];
}

const MonthlyLevels: React.FC<WeeklyLevelsProps> = ({ data }) => {
  const categories = data.map((entry) => entry.date);
  const data1 = data.map((entry) => entry.level1 / 10);
  const data2 = data.map((entry) => entry.level2 / 10);

  const formattedData = data.map((entry) => ({
    date: entry.date,
    level1: entry.level1 / 10,
    level2: entry.level2 / 10
  }));

  return (
    <SmallSection
      title="Ø Wasserstände pro Monat"
      chart={(
        <Chart
          categories={categories}
          data1={data1}
          data2={data2}
        />
      )}
      table={(
        <DataTable
          dateHeader="Monate"
          data={formattedData}
        />
      )}
    />
  );
};

export default MonthlyLevels;
