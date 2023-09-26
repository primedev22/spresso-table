import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import Table, {
  TableHeader,
  TableOptions,
  SortOrder,
  ItemsPerPage,
} from "./components/Table";
import "./App.css";

const API_URL = "https://6512409eb8c6ce52b3957593.mockapi.io/customers";
const TABLE_HEADERS: TableHeader[] = [
  {
    name: "id",
    label: "ID",
  },
  {
    name: "first_name",
    label: "First Name",
  },
  {
    name: "last_name",
    label: "Last Name",
  },
  {
    name: "gender",
    label: "Gender",
  },
  {
    name: "job",
    label: "Job Title",
  },
];

function App() {
  const headers: TableHeader[] = TABLE_HEADERS;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const options = useMemo<TableOptions>(() => {
    const urlParams = {
      search: searchParams.get("search"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
      page: searchParams.get("page"),
      itemsPerPage: searchParams.get("itemsPerPage"),
    };
    const search = urlParams.search ?? "";
    const sortBy = urlParams.sortBy ?? "";
    const sortOrder: SortOrder =
      urlParams.sortOrder === "desc" ? "desc" : "asc";
    const page = urlParams.page ? parseInt(urlParams.page) : 1;
    let itemsPerPage: ItemsPerPage = 10;
    if (urlParams.itemsPerPage === "25") {
      itemsPerPage = 25;
    } else if (urlParams.itemsPerPage === "100") {
      itemsPerPage = 100;
    }
    return { search, sortBy, sortOrder, page, itemsPerPage };
  }, [searchParams]);

  const updateOptions = (updatedOptions: TableOptions) => {
    setSearchParams(
      Object.entries(updatedOptions)
        .map(([key, value]) => {
          if (!value) {
            return "";
          }
          return `${key}=${value}`;
        })
        .filter((v) => !!v)
        .join("&")
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const { page, itemsPerPage, search, sortBy, sortOrder } = options;
      setLoading(true);
      const response = await fetch(
        `${API_URL}/?page=${page}&limit=${itemsPerPage}&search=${search}&sortBy=${sortBy}&order=${sortOrder}`
      );
      const data = await response.json();
      setData(data);
      setSelectedItems([]);
      setLoading(false);
    };

    fetchData();
  }, [options]);

  return (
    <Table
      isLoading={loading}
      headers={headers}
      items={data}
      selectedItems={selectedItems}
      totalItems={100}
      options={options}
      updateOptions={updateOptions}
      updateSelectedItems={setSelectedItems}
    />
  );
}

export default App;
