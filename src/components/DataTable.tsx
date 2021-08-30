import React from 'react';

import { DataEntry } from '../@types/data';

import Table from './Table';

interface DataTableProps {
  dateHeader: string;
  data: DataEntry[];
  style?: object;
}

const DataTable: React.FC<DataTableProps> = ({ dateHeader, data, style }) => {
  const rows = data.map(({ date, level1, level2 }) => (
    <Table.Row key={date}>
      <Table.Cell>{date}</Table.Cell>
      <Table.Cell>{level1}</Table.Cell>
      <Table.Cell>{level2}</Table.Cell>
    </Table.Row>
  )).reverse().slice(0, 15);

  return (
    <Table style={{ ...style, marginTop: 32 }}>
      <Table.Header>
        <Table.HeaderCell>{dateHeader}</Table.HeaderCell>
        <Table.HeaderCell style={{ color: '#2E567E' }}>Pegel #1</Table.HeaderCell>
        <Table.HeaderCell style={{ color: '#C05353' }}>Pegel #2</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {rows}
      </Table.Body>
    </Table>
  );
};

export default DataTable;
