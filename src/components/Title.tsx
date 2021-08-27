import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

const Text = styled.span`
  color: #717C8E;
  font-size: 28px;
  font-weight: 600;
`;

const Line = styled.div`
  flex-grow: 1;
  margin-left: 16px;
  border-bottom: dotted 1px #717C8E;
`;

const Title: React.FC = ({ children }) => (
  <Container>
    <Text>{children}</Text>
    <Line />
  </Container>
);

export default Title;
