import React from 'react';
import styled from '@emotion/styled';

import Title from './components/Title';

import CurrentLevels from './views/CurrentLevels';

const AppShell = styled.div`
  margin: 32px auto;
  max-width: 1100px;
`;

const App: React.FC = () => (
  <AppShell>
    <Title>Wasserstand</Title>
    <CurrentLevels
      level1={375}
      level2={370}
    />
  </AppShell>
);

export default App;
