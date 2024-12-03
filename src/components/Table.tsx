import React from "react";

type TableColumn = {
  header: string;
  accessor: string;
  className?: string;
};

type TableProps = {
  columns: TableColumn[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
};

const Table = ({ columns, renderRow, data }: TableProps) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-sm text-left text-gray-500">
          {columns.map((col) => (
            <th key={col.header} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  );
};

export default Table;
