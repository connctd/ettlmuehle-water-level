import React from 'react';
import styled from '@emotion/styled';
import moment from 'moment';

import { DataEntry } from '../@types/data';

import Heading from '../components/Heading';
import Chart from '../components/Chart';
import DataTable from '../components/DataTable';

interface QuarterHouerlyLevelsProps {
  data: DataEntry[];
}

const Container = styled.div`
  margin-top: 32px;
`;

const QuarterHouerlyLevels: React.FC<QuarterHouerlyLevelsProps> = ({ data }) => {
  const categories = data.map((entry) => moment(entry.date).format('DD.MM.YYYY HH:mm'));
  const dataLevel1 = data.map((entry) => entry.level1 / 10);
  const dataLevel2 = data.map((entry) => entry.level2 / 10);

  const formattedData = data.map((entry) => ({
    date: moment(entry.date).format('DD.MM.YYYY - HH:mm'),
    level1: entry.level1 / 10,
    level2: entry.level2 / 10
  }));

  return (
    <Container>
      <Heading>
        Wasserstände alle 15 min.
      </Heading>
      <Chart
        categories={categories}
        data1={dataLevel1}
        data2={dataLevel2}
        zoom
        style={{
          display: 'block',
          height: 700
        }}
      />
      <DataTable
        dateHeader="Datum & Uhrzeit"
        data={formattedData}
      />
    </Container>
  );
};

export default QuarterHouerlyLevels;
