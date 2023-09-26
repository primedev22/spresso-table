import React, { useMemo } from "react";
import "./Table.css";

export interface TableHeader {
  name: string;
  label: string;
}

export type SortOrder = "asc" | "desc";
export type ItemsPerPage = 10 | 25 | 100;
export interface TableOptions {
  search?: string;
  sortBy?: string;
  sortOrder: "asc" | "desc";
  page?: number;
  itemsPerPage: 10 | 25 | 100;
}

interface TableProps {
  isLoading: boolean;
  headers: TableHeader[];
  items: any[];
  selectedItems: number[];
  totalItems: number;
  options: TableOptions;
  updateOptions: (options: TableOptions) => void;
  updateSelectedItems: (selectedItems: number[]) => void;
}

const Table = ({
  isLoading,
  headers,
  items,
  selectedItems,
  totalItems,
  options: { search, sortBy, sortOrder, page = 1, itemsPerPage = 10 },
  updateOptions,
  updateSelectedItems,
}: TableProps) => {
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const handleSelectItem =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        updateSelectedItems([...selectedItems, idx]);
      } else {
        updateSelectedItems(selectedItems.filter((i) => i !== idx));
      }
    };

  const updateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOptions({
      search: e.target.value,
      sortBy,
      sortOrder,
      page,
      itemsPerPage,
    });
  };

  const updateSort = (name: string) => () => {
    if (sortBy === name) {
      updateOptions({
        search,
        sortBy,
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
        page,
        itemsPerPage,
      });
    } else {
      updateOptions({
        search,
        sortBy: name,
        sortOrder: "asc",
        page,
        itemsPerPage,
      });
    }
  };

  const updatePage = (value: number) => () => {
    updateOptions({ search, sortBy, sortOrder, page: value, itemsPerPage });
  };

  const updateItemsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOptions({
      search,
      sortBy,
      sortOrder,
      page: 1,
      itemsPerPage: parseInt(e.target.value) as ItemsPerPage,
    });
  };

  if (headers.length < 4) {
    return (
      <div className="data-table">
        <h2>Should have at least 4 columns</h2>
      </div>
    );
  }

  return (
    <div className="data-table">
      <div className="table-header">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={search}
          onChange={updateSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            {headers.map(({ name, label }) => (
              <th
                key={name}
                onClick={updateSort(name)}
                className={sortBy === name ? sortOrder : ""}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={headers.length + 1}>Loading...</td>
            </tr>
          ) : (
            items.map((item, idx) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    className="check-single"
                    checked={selectedItems.includes(idx)}
                    onChange={handleSelectItem(idx)}
                  />
                </td>
                {headers.map((header) => (
                  <td key={header.name}>{item[header.name]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <select
          className="items-per-page"
          value={itemsPerPage}
          onChange={(v) => updateItemsPerPage(v)}
        >
          <option value="10">10 Items</option>
          <option value="25">25 Items</option>
          <option value="100">100 Items</option>
        </select>
        <div>
          <button
            className="prev-btn"
            disabled={page <= 1}
            onClick={updatePage(page - 1)}
          >
            Previous
          </button>
          <span className="page-num">{page}</span>
          <button
            className="next-btn"
            disabled={page >= totalPages}
            onClick={updatePage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
