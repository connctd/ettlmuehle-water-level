import React from 'react';
import styled from '@emotion/styled';

import Title from './components/Title';

import CurrentLevels from './views/CurrentLevels';
import QuarterHouerlyLevels from './views/QuarterHourlyLevels';
import WeeklyLevels from './views/WeeklyLevels';
import MonthlyLevels from './views/MonthlyLevels';
import CurrentStatus from './views/CurrentStatus';

const AppShell = styled.div`
  margin: 32px auto;
  max-width: 1100px;
`;

const currentData = {
  level1: 800,
  level2: 750
};

const quarterHourlyData = [
  { date: '2021-08-30T13:00:00+0200', level1: 700, level2: 650 },
  { date: '2021-08-30T13:15:00+0200', level1: 500, level2: 450 },
  { date: '2021-08-30T13:30:00+0200', level1: 550, level2: 500 },
  { date: '2021-08-30T13:45:00+0200', level1: 650, level2: 600 },
  { date: '2021-08-30T14:00:00+0200', level1: 500, level2: 450 },
  { date: '2021-08-30T14:15:00+0200', level1: 500, level2: 450 },
  { date: '2021-08-30T14:30:00+0200', level1: 550, level2: 500 },
  { date: '2021-08-30T14:45:00+0200', level1: 550, level2: 500 },
  { date: '2021-08-30T15:00:00+0200', level1: 650, level2: 600 },
  { date: '2021-08-30T15:15:00+0200', level1: 600, level2: 550 },
  { date: '2021-08-30T15:30:00+0200', level1: 800, level2: 750 },
  { date: '2021-08-30T15:45:00+0200', level1: 750, level2: 700 },
  { date: '2021-08-30T16:00:00+0200', level1: 700, level2: 650 },
  { date: '2021-08-30T16:15:00+0200', level1: 650, level2: 600 },
  { date: '2021-08-30T16:30:00+0200', level1: 700, level2: 650 },
  { date: '2021-08-30T16:45:00+0200', level1: 700, level2: 650 },
  { date: '2021-08-30T17:00:00+0200', level1: 750, level2: 700 },
  { date: '2021-08-30T17:15:00+0200', level1: 600, level2: 550 },
  { date: '2021-08-30T17:30:00+0200', level1: 650, level2: 600 },
  { date: '2021-08-30T17:45:00+0200', level1: 700, level2: 650 },
  { date: '2021-08-30T18:00:00+0200', level1: 750, level2: 700 },
  { date: '2021-08-30T18:15:00+0200', level1: 600, level2: 550 },
  { date: '2021-08-30T18:30:00+0200', level1: 550, level2: 500 },
  { date: '2021-08-30T18:45:00+0200', level1: 550, level2: 500 },
  { date: '2021-08-30T19:00:00+0200', level1: 550, level2: 500 },
  { date: '2021-08-30T19:15:00+0200', level1: 650, level2: 600 },
  { date: '2021-08-30T19:30:00+0200', level1: 750, level2: 700 },
  { date: '2021-08-30T19:45:00+0200', level1: 750, level2: 700 },
  { date: '2021-08-30T20:00:00+0200', level1: 700, level2: 650 },
  { date: '2021-08-30T20:15:00+0200', level1: 800, level2: 750 },
  { date: '2021-08-30T20:30:00+0200', level1: 750, level2: 700 },
  { date: '2021-08-30T20:45:00+0200', level1: 700, level2: 650 },
  { date: '2021-08-30T21:00:00+0200', level1: 600, level2: 550 },
  { date: '2021-08-30T21:15:00+0200', level1: 600, level2: 550 },
  { date: '2021-08-30T21:30:00+0200', level1: 650, level2: 600 },
  { date: '2021-08-30T21:45:00+0200', level1: 550, level2: 500 },
  { date: '2021-08-30T22:00:00+0200', level1: 600, level2: 550 },
  { date: '2021-08-30T22:15:00+0200', level1: 600, level2: 550 },
  { date: '2021-08-30T22:30:00+0200', level1: 650, level2: 600 },
  { date: '2021-08-30T22:45:00+0200', level1: 750, level2: 700 },
  { date: '2021-08-30T23:00:00+0200', level1: 700, level2: 650 },
  { date: '2021-08-30T23:15:00+0200', level1: 800, level2: 750 },
  { date: '2021-08-30T23:30:00+0200', level1: 850, level2: 800 },
  { date: '2021-08-30T23:45:00+0200', level1: 800, level2: 750 }
];

const weeklyData = [
  { date: '05.07.21 - 11.07.21', level1: 600, level2: 550 },
  { date: '12.07.21 - 18.07.21', level1: 700, level2: 650 },
  { date: '19.07.21 - 25.07.21', level1: 600, level2: 550 },
  { date: '26.07.21 - 01.08.21', level1: 800, level2: 750 },
  { date: '02.08.21 - 08.08.21', level1: 800, level2: 750 },
  { date: '09.08.21 - 15.08.21', level1: 700, level2: 650 }
];

const monthlyData = [
  { date: 'März 2021', level1: 800, level2: 750 },
  { date: 'April 2021', level1: 850, level2: 800 },
  { date: 'Mai 2021', level1: 800, level2: 750 },
  { date: 'Juni 2021', level1: 750, level2: 700 },
  { date: 'Juli 2021', level1: 600, level2: 550 },
  { date: 'August 2021', level1: 700, level2: 650 }
];

const App: React.FC = () => (
  <AppShell>
    <Title>Wasserstand</Title>
    <CurrentStatus
      level1={currentData.level1}
      level2={currentData.level2}
    />
    <CurrentLevels
      level1={currentData.level1 / 10}
      level2={currentData.level2 / 10}
    />
    <QuarterHouerlyLevels
      data={quarterHourlyData}
    />
    <WeeklyLevels
      data={weeklyData}
    />
    <MonthlyLevels
      data={monthlyData}
    />
  </AppShell>
);

export default App;
