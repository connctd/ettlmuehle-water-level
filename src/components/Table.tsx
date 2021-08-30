import React from 'react';
import styled from '@emotion/styled';

interface TableProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
  children: React.ReactElement<TableHeaderProps | TableBodyProps>[];
  style?: object;
}

interface TableHeaderProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> {
  children: React.ReactElement<TableHeaderCellProps>[];
}

interface TableHeaderCellProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement> {
  children: React.ReactNode;
  style?: object;
}

interface TableBodyProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> {
  children: React.ReactElement<TableRowProps> | React.ReactElement<TableRowProps>[];
}

interface TableRowProps extends
  React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
  children: React.ReactElement<TableCellProps>[];
}

interface TableCellProps
  extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement> {
  children: React.ReactNode;
  style?: object;
}

interface TableSubComponents {
  Header: React.FunctionComponent<TableHeaderProps>;
  HeaderCell: React.FunctionComponent<TableHeaderCellProps>;
  Body: React.FunctionComponent<TableBodyProps>;
  Row: React.FunctionComponent<TableRowProps>;
  Cell: React.FunctionComponent<TableCellProps>;
}

const StyledTable = styled.table(`
  table-layout: fixed;
  width: 100%;
  vertical-align: top;
`);

const StyledTableHeader = styled.thead(`
  background-color: #F5F5F5;
  border-radius: 2px;
`);

const StyledTableHeaderCell = styled.th(`
  padding: 16px;
  color: #4F4F4F;
  text-align: left;
  font-weight: 400;
  text-align: center;
  border-top: solid 1px #E4E6EA;
  border-bottom: solid 1px #E4E6EA;

  :first-of-type {
    border-left: solid 1px #E4E6EA;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  :last-of-type {
    border-right: solid 1px #E4E6EA;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
`);

const StyledTableBody = styled.tbody();

const StyledTableRow = styled.tr();

const StyledTableCell = styled.td(`
  padding: 8px;
  color: #4F4F4F;
  text-align: center;
  border-bottom: solid 1px #E4E6EA;
`);

const Table: React.FC<TableProps> & TableSubComponents = ({ children, ...rest }) => (
  <StyledTable cellSpacing={0} {...rest}>
    {React.Children.toArray(children)}
  </StyledTable>
);

Table.Header = ({ children, ...rest }) => (
  <StyledTableHeader {...rest}>
    <tr>
      {React.Children.toArray(children)}
    </tr>
  </StyledTableHeader>
);

Table.HeaderCell = ({ children, ...rest }) => (
  <StyledTableHeaderCell {...rest}>
    {children}
  </StyledTableHeaderCell>
);

Table.Body = ({ children, ...rest }) => (
  <StyledTableBody {...rest}>
    {React.Children.toArray(children)}
  </StyledTableBody>
);

Table.Row = ({ children, ...rest }) => (
  <StyledTableRow {...rest}>
    {React.Children.toArray(children)}
  </StyledTableRow>
);

Table.Cell = ({ children, ...rest }) => (
  <StyledTableCell {...rest}>
    {children}
  </StyledTableCell>
);

export default Table;
