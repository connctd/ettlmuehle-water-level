import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const rotate = keyframes`
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
`;

const LoadingSpinner = styled.div`
  margin: 50px auto;
  width: 30px;
  height: 30px;
  border: solid 5px #DDD;
  border-top-color: #2E567E;
  animation: ${rotate} infinite 1s linear 0s both;
  border-radius: 50%;
`;

export default LoadingSpinner;
