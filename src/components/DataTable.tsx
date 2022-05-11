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
  const renderTableCell = (value?: number) => (
    value ? (
      <Table.Cell>{value} cm</Table.Cell>
    ) : (
      <Table.Cell>---</Table.Cell>
    )
  );

  const rows = data.map(({ date, level1, level2 }, index) => (
    <Table.Row
      key={date}
      data-cy={`${dataCyPrefix}-table-row-${data.length - index}`}
    >
      <Table.Cell style={{ width: 190 }}>{date}</Table.Cell>
      {renderTableCell(level1)}
      {renderTableCell(level2)}
    </Table.Row>
  )).reverse().slice(0, 16);

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
