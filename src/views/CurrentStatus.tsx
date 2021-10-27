import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import CheckIcon from 'mdi-react/CheckIcon';
import AlertCircleOutlineIcon from 'mdi-react/AlertCircleOutlineIcon';
import AlertOctagramOutlineIcon from 'mdi-react/AlertOctagramOutlineIcon';

import {
  LOWEST_THRESHOLD,
  HIGHEST_THRESHOLD,
  LOW_THRESHOLD,
  HIGH_THRESHOLD
} from '../config';

interface CurrentStatusProps {
  level1: number;
  level2: number;
}

type CurrentStatusType = 'danger' | 'warning' | 'ok';

interface CurrentStatusStyleProps {
  type: CurrentStatusType;
}

function getStatusType(level1: number, level2: number): CurrentStatusType {
  if (
    level1 <= LOWEST_THRESHOLD
    || level1 >= HIGHEST_THRESHOLD
    || level2 <= LOWEST_THRESHOLD
    || level2 >= HIGHEST_THRESHOLD
  ) {
    return 'danger';
  }

  if (
    level1 <= LOW_THRESHOLD
    || level1 >= HIGH_THRESHOLD
    || level2 <= LOW_THRESHOLD
    || level2 >= HIGH_THRESHOLD
  ) {
    return 'warning';
  }

  return 'ok';
}

function getStatusTypeColor(type: CurrentStatusType) {
  switch (type) {
    case 'warning':
      return '#D9C414';
    case 'danger':
      return '#E64C3C';
    default: // ok
      return '#21CA21';
  }
}

function getAffectedLevel(level1: number, level2: number): string {
  let level1Affected = false;
  let level2Affected = false;

  if (level1 <= LOW_THRESHOLD || level1 >= HIGH_THRESHOLD) {
    level1Affected = true;
  }

  if (level2 <= LOW_THRESHOLD || level2 >= HIGH_THRESHOLD) {
    level2Affected = true;
  }

  if (level1Affected) {
    if (level2Affected) {
      return 'Beide Messstellen';
    }

    return 'Messstelle 1';
  }

  if (level2Affected) {
    return 'Messstelle 2';
  }

  return 'Keine Messtelle';
}

function getStatusText(level1: number, level2: number): string {
  const affectedLevel = getAffectedLevel(level1, level2);

  if (level1 <= LOWEST_THRESHOLD || level2 <= LOWEST_THRESHOLD) {
    return `Akuter Wassermangel: ${affectedLevel}`;
  }

  if (level1 <= LOW_THRESHOLD || level2 <= LOW_THRESHOLD) {
    return `Geringer Pegel: ${affectedLevel}`;
  }

  if (level1 >= HIGHEST_THRESHOLD || level2 >= HIGHEST_THRESHOLD) {
    return `Hochwasser: ${affectedLevel}`;
  }

  if (level1 >= HIGH_THRESHOLD || level2 >= HIGH_THRESHOLD) {
    return `Hoher Pegel: ${affectedLevel}`;
  }

  return 'Wasserstände befinden sich im normalen Bereich';
}

const Container = styled.div<CurrentStatusStyleProps>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #EDFCED;
  border: solid 1px #96EE96;
  border-radius: 10px;

  ${({ type }) => {
    if (type === 'danger') {
      return css`
        background-color: #FADEDB;
        border: solid 1px #F2A097;
      `;
    }

    if (type === 'warning') {
      return css`
        background-color: #FBF8DF;
        border: solid 1px #E4D02A;
      `;
    }

    return css`
      background-color: #EDFCED;
      border: solid 1px #96EE96;
    `;
  }}
`;

const IconCircle = styled.div<CurrentStatusStyleProps>`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  width: 59px;
  height: 59px;
  background-color: #FFF;
  border-radius: 50%;

  ${({ type }) => {
    if (type === 'danger') {
      return css`
        border: solid 1px #F2A097;
      `;
    }

    if (type === 'warning') {
      return css`
        border: solid 1px #E4D02A;
      `;
    }

    return css`
      border: solid 1px #96EE96;
    `;
  }}
`;

const StatusText = styled.div<CurrentStatusStyleProps>`
  flex-grow: 1;
  color: ${({ type }) => getStatusTypeColor(type)};
  font-size: 16px;
  font-weight: 500;
  text-align: center;

  @media screen and (min-width: 600px) {
    font-size: 22px;
  }
`;

const CurrentStatus: React.FC<CurrentStatusProps> = ({ level1, level2 }) => {
  const type = getStatusType(level1, level2);
  const typeColor = getStatusTypeColor(type);

  let Icon = CheckIcon;

  if (type === 'warning') {
    Icon = AlertCircleOutlineIcon;
  } else if (type === 'danger') {
    Icon = AlertOctagramOutlineIcon;
  }

  const text = getStatusText(level1, level2);

  return (
    <Container type={type} data-cy="current-status">
      <IconCircle type={type}>
        <Icon color={typeColor} size="43px" />
      </IconCircle>
      <StatusText type={type}>
        {text}
      </StatusText>
    </Container>
  );
};

export default CurrentStatus;
