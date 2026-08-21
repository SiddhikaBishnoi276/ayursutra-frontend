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
  mobileView?: 'scroll' | 'cards';
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found.',
  className = '',
  mobileView = 'scroll',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={`w-full overflow-hidden rounded-2xl border border-ayur-sand/60 bg-white p-8 text-center text-sm font-medium text-ayur-green-mid shadow-sm ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Card Transform View (only when mobileView="cards", visible on < md) */}
      {mobileView === 'cards' && (
        <div className="flex flex-col gap-3 md:hidden">
          {data.map((item) => (
            <div
              key={keyExtractor(item)}
              className="rounded-2xl border border-ayur-sand/60 bg-white p-4 shadow-2xs space-y-2.5"
            >
              {columns.map((col, cIdx) => {
                const content = col.render
                  ? col.render(item)
                  : col.accessorKey
                  ? String(item[col.accessorKey] ?? '')
                  : null;

                return (
                  <div
                    key={cIdx}
                    className="flex items-start justify-between gap-3 text-xs border-b border-gray-50 pb-2 last:border-b-0 last:pb-0"
                  >
                    <span className="font-bold text-ayur-green-mid uppercase tracking-wider text-[11px] shrink-0 max-w-[40%]">
                      {col.header}
                    </span>
                    <div className="font-medium text-gray-800 text-right flex-1 min-w-0">
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Standard / Horizontal Scroll Table (visible always when mobileView="scroll", or on md+ when mobileView="cards") */}
      <div
        className={`w-full overflow-hidden rounded-2xl border border-ayur-sand/60 bg-white shadow-sm ${
          mobileView === 'cards' ? 'hidden md:block' : 'block'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#fbf9f5] border-b border-ayur-sand/60">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-4 sm:px-6 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-wider text-ayur-green-mid ${
                      col.headerClassName || ''
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-[#fbf9f5]/60 transition-colors duration-150"
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-4 sm:px-6 py-3.5 sm:py-4 text-gray-800 font-medium ${col.className || ''}`}
                    >
                      {col.render
                        ? col.render(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
