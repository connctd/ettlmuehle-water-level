import React from 'react';
import styled from '@emotion/styled';

import Heading from '../components/Heading';

interface CurrentLevelsProps {
  level1: number;
  level2: number;
}

const Container = styled.div`
  margin-top: 32px;
`;

const Table = styled.div`
  margin-top: 32px;
  border: dotted 1px #717C8E;
  border-radius: 10px;
`;

const Row = styled.div`
  display: flex;

  &:first-of-type {
    border-bottom: dotted 1px #717C8E;
  }
`;

const Cell = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  height: 60px;
`;

const LabelCell = styled(Cell)`
  color: #444A55;
  font-size: 22px;
  font-weight: 500;
  border-right: dotted 1px #717C8E;
  `;

const ValueCell = styled(Cell)`
  color: #2D3239;
  font-size: 25px;
  font-weight: 700;
`;

const CurrentLevels: React.FC<CurrentLevelsProps> = ({ level1, level2 }) => {
  const level1cm = level1 / 10;
  const level2cm = level2 / 10;

  return (
    <Container>
      <Heading>Aktuelle Wasserstände</Heading>
      <Table>
        <Row>
          <LabelCell style={{ color: '#2E567E' }}>
            Messstelle 1
          </LabelCell>
          <ValueCell data-cy="current-level-1">
            {level1cm} cm
          </ValueCell>
        </Row>
        <Row>
          <LabelCell style={{ color: '#C05353' }}>
            Messstelle 2
          </LabelCell>
          <ValueCell data-cy="current-level-2">
            {level2cm} cm
          </ValueCell>
        </Row>
      </Table>
    </Container>
  );
};

export default CurrentLevels;
