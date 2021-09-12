import React from 'react';
import styled from '@emotion/styled';

import { LEVEL_1_ID, LEVEL_2_ID, POLL_INTERVAL_MILLISEC } from './config';

import useCurrentValues from './hooks/useCurrentValues';
import useQuarterlyValues from './hooks/useQuarterlyValues';
import useWeeklyValues from './hooks/useWeeklyValues';
import useMonthlyValues from './hooks/useMonthlyValues';

import CurrentLevels from './views/CurrentLevels';
import QuarterHouerlyLevels from './views/QuarterHourlyLevels';
import WeeklyLevels from './views/WeeklyLevels';
import MonthlyLevels from './views/MonthlyLevels';
import CurrentStatus from './views/CurrentStatus';

import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const AppShell = styled.div`
  margin: 32px auto;
  max-width: 1100px;
`;

const App: React.FC = () => {
  const basicFetchOptions = {
    retry: false,
    refetchOnWindowFocus: false
  };

  const pollingFetchOptions = {
    ...basicFetchOptions,
    refetchInterval: POLL_INTERVAL_MILLISEC
  };

  const {
    data: currentValuesData,
    error: currentValuesError,
    isLoading: currentValuesIsLoading
  } = useCurrentValues(pollingFetchOptions);

  const {
    data: quarterlyValuesData,
    error: quarterlyValuesError,
    isLoading: quarterlyValuesIsLoading
  } = useQuarterlyValues(pollingFetchOptions);

  const {
    data: weeklyValuesData,
    error: weeklyValuesError,
    isLoading: weeklyValuesIsLoading
  } = useWeeklyValues(basicFetchOptions);

  const {
    data: monthlyValuesData,
    error: monthlyValuesError,
    isLoading: monthlyValuesIsLoading
  } = useMonthlyValues(basicFetchOptions);

  const currentValuesLoaded = currentValuesData && !currentValuesIsLoading;
  const quarterlyValuesLoaded = quarterlyValuesData && !quarterlyValuesIsLoading;
  const weeklyValuesLoaded = weeklyValuesData && !weeklyValuesIsLoading;
  const monthlyValuesLoaded = monthlyValuesData && !monthlyValuesIsLoading;

  const allDataLoaded = currentValuesLoaded && quarterlyValuesLoaded && weeklyValuesLoaded && monthlyValuesLoaded;

  let loadingSpinnerElement;

  if (!allDataLoaded) loadingSpinnerElement = <LoadingSpinner />;

  let currentStatusElement;
  let currentLevelsElement;
  let quarterHourlyLevelsElement;
  let weeklyLevelsElement;
  let monthlyLevelsElement;

  if (currentValuesError) {
    currentStatusElement = (
      <ErrorMessage data-cy="error-message-current">
        Die aktuellen Wasserstände konnten nicht geladen werden.
        Bitte versuchen Sie es später erneut.
      </ErrorMessage>
    );
  }
  if (quarterlyValuesError) {
    quarterHourlyLevelsElement = (
      <ErrorMessage data-cy="error-message-quarterly">
        Die viertelstündlichen Wasserstände konnten nicht geladen werden.
        Bitte versuchen Sie es später erneut.
      </ErrorMessage>
    );
  }

  if (weeklyValuesError) {
    weeklyLevelsElement = (
      <ErrorMessage data-cy="error-message-weekly">
        Die wöchentlichen Wasserstände konnten nicht geladen werden.
        Bitte versuchen Sie es später erneut.
      </ErrorMessage>
    );
  }

  if (monthlyValuesError) {
    monthlyLevelsElement = (
      <ErrorMessage data-cy="error-message-monthly">
        Die monatlichen Wasserstände konnten nicht geladen werden.
        Bitte versuchen Sie es später erneut.
      </ErrorMessage>
    );
  }

  if (currentValuesData) {
    currentStatusElement = <CurrentStatus level1={currentValuesData[LEVEL_1_ID]} level2={currentValuesData[LEVEL_2_ID]} />;
    currentLevelsElement = <CurrentLevels level1={currentValuesData[LEVEL_1_ID]} level2={currentValuesData[LEVEL_2_ID]} />;
  }

  if (quarterlyValuesData) quarterHourlyLevelsElement = <QuarterHouerlyLevels data={quarterlyValuesData} />;
  if (weeklyValuesData) weeklyLevelsElement = <WeeklyLevels data={weeklyValuesData} />;
  if (monthlyValuesData) monthlyLevelsElement = <MonthlyLevels data={monthlyValuesData} />;

  return (
    <AppShell>
      {currentStatusElement}
      {currentLevelsElement}
      {quarterHourlyLevelsElement}
      {weeklyLevelsElement}
      {monthlyLevelsElement}
      {loadingSpinnerElement}
    </AppShell>
  );
};

export default App;
