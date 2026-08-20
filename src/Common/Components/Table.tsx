import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found.',
  className = '',
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-ayur-sand/60 bg-white shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-[#fbf9f5] border-b border-ayur-sand/60">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-ayur-green-mid ${
                    col.headerClassName || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm font-medium text-ayur-green-mid"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-[#fbf9f5]/60 transition-colors duration-150"
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-6 py-4 text-gray-800 font-medium ${col.className || ''}`}
                    >
                      {col.render
                        ? col.render(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
