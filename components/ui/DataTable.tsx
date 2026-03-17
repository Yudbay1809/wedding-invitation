import { clsx } from "clsx";
import type { ReactNode } from "react";

export function DataTable({
  headers,
  rows
}: {
  headers: string[];
  rows: Array<Array<string | ReactNode>>;
}) {
  return (
    <div className="surface overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-sand text-graphite">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left font-semibold uppercase tracking-[0.2em] text-[0.65rem]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={clsx(index % 2 === 0 ? "bg-white" : "bg-cloud")}> 
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-graphite">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
