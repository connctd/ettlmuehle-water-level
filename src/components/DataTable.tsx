import React from 'react';

import { DataEntry } from '../@types/data';

import Table from './Table';

interface DataTableProps {
  dateHeader: string;
  data: DataEntry[];
  dataCyPrefix?: string;
  style?: object;
}

const DataTable: React.FC<DataTableProps> = ({
  dateHeader, data, dataCyPrefix, style
}) => {
  const rows = data.map(({ date, level1, level2 }, index) => {
    if (level1 === 0 && level2 === 0) return <></>;

    return (
      <Table.Row
        key={date}
        data-cy={`${dataCyPrefix}-table-row-${data.length - index}`}
      >
        <Table.Cell style={{ width: 190 }}>{date}</Table.Cell>
        <Table.Cell>{level1} cm</Table.Cell>
        <Table.Cell>{level2} cm</Table.Cell>
      </Table.Row>
    );
  }).reverse().slice(0, 16);

  return (
    <Table style={{ ...style, marginTop: 32 }}>
      <Table.Header>
        <Table.HeaderCell style={{ width: 190 }}>{dateHeader}</Table.HeaderCell>
        <Table.HeaderCell style={{ color: '#2E567E' }}>Messstelle 1</Table.HeaderCell>
        <Table.HeaderCell style={{ color: '#C05353' }}>Messstelle 2</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {rows}
      </Table.Body>
    </Table>
  );
};

export default DataTable;
