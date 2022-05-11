import React from 'react';
import styled from '@emotion/styled';
import moment from 'moment';

import { LEVEL_1_ID, LEVEL_2_ID } from '../config';

import { QuarterlyValuesData } from '../hooks/useQuarterlyValues';

import Heading from '../components/Heading';
import Chart from '../components/Chart';
import DataTable from '../components/DataTable';
import { normalizeLevel } from '../utils/levels';

interface QuarterHouerlyLevelsProps {
  data: QuarterlyValuesData;
}

const Container = styled.div`
  margin-top: 32px;
`;

const QuarterHouerlyLevels: React.FC<QuarterHouerlyLevelsProps> = ({ data }) => {
  const dataEntries = Object.entries(data);

  const categories = dataEntries.map((dataEntry) => moment(dataEntry[0]).format('DD.MM.YYYY HH:mm'));

  const dataLevel1 = dataEntries.map((dataEntry) => normalizeLevel(dataEntry[1][LEVEL_1_ID]));
  const dataLevel2 = dataEntries.map((dataEntry) => normalizeLevel(dataEntry[1][LEVEL_2_ID]));

  const formattedData = dataEntries.map((dataEntry) => ({
    date: moment(dataEntry[0]).format('DD.MM.YYYY - HH:mm'),
    level1: normalizeLevel(dataEntry[1][LEVEL_1_ID]),
    level2: normalizeLevel(dataEntry[1][LEVEL_2_ID])
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
        dataCyPrefix="quarterHourly"
      />
    </Container>
  );
};

export default QuarterHouerlyLevels;
