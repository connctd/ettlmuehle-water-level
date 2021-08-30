import React from 'react';
import styled from '@emotion/styled';
import { useMediaQuery } from 'react-responsive';

import Heading from './Heading';

interface SmallSectionProps {
  title: string;
  chart: React.ReactElement;
  table: React.ReactElement;
}

const Container = styled.div`
  margin-top: 64px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;

  @media screen and (min-width: 1045px) {
    flex-direction: row;
  }
`;

const SmallSection: React.FC<SmallSectionProps> = ({ title, chart, table }) => {
  const wideView = useMediaQuery({ query: '(min-width: 1045px)' });

  const tableStyle = {
    marginTop: 32,
    width: wideView ? '40%' : '100%'
  };

  const chartStyle = {
    display: 'inline-block',
    width: wideView ? '60%' : '100%',
    height: 550
  };

  const styledChart = React.cloneElement(chart, { style: chartStyle });
  const styledTable = React.cloneElement(table, { style: tableStyle });

  return (
    <Container>
      <Heading>
        {title}
      </Heading>
      <Content>
        {styledTable}
        {styledChart}
      </Content>
    </Container>
  );
};

export default SmallSection;
