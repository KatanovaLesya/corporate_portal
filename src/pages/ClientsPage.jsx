// src/pages/ClientsPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./ClientsPage.module.css";
import ColumnFilter from "../components/ColumnFilter";

const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Стан для фільтрів
  const [filters, setFilters] = useState({
    stack: "",
    clientName: "",
    edrpou: "",
    dealTitle: "",
    startDate: "",
    amount: "",
    currency: "",
    amountUah: "",
  });

  // Завантаження клієнтів
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await api.get("/clients");
        setRows(res.data || []);
      } catch (err) {
        console.error("Помилка завантаження клієнтів", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Застосування фільтрів
  const filteredRows = rows.filter((row) => {
    return (
      (!filters.stack || row.stack?.includes(filters.stack)) &&
      (!filters.clientName ||
        row.clientName?.toLowerCase().includes(filters.clientName.toLowerCase())) &&
      (!filters.edrpou || row.edrpou?.includes(filters.edrpou)) &&
      (!filters.dealTitle ||
        row.dealTitle?.toLowerCase().includes(filters.dealTitle.toLowerCase())) &&
      (!filters.startDate || row.startDate?.includes(filters.startDate)) &&
      (!filters.amount || row.amount?.toString().includes(filters.amount)) &&
      (!filters.currency || row.currency?.includes(filters.currency)) &&
      (!filters.amountUah || row.amountUah?.toString().includes(filters.amountUah))
    );
  });

  // Пагінація
  const paginatedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className={styles.container}>
      <h2>Клієнти</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Стек</th>
            <th>Назва</th>
            <th>ЄДРПОУ</th>
            <th>Назва угоди</th>
            <th>Дата угоди</th>
            <th>Сума</th>
            <th>Валюта</th>
            <th>Еквівалент в UAH</th>
          </tr>
          <tr>
            <th>
              <ColumnFilter
                column="Стек"
                values={[...new Set(rows.map((r) => r.stack || "-"))]}
                selected={filters.stack}
                onChange={(val) => setFilters({ ...filters, stack: val })}
              />
            </th>
            <th>
              <ColumnFilter
                column="Назва"
                values={[...new Set(rows.map((r) => r.clientName))]}
                selected={filters.clientName}
                onChange={(val) => setFilters({ ...filters, clientName: val })}
              />
            </th>
            <th>
              <ColumnFilter
                column="ЄДРПОУ"
                values={[...new Set(rows.map((r) => r.edrpou))]}
                selected={filters.edrpou}
                onChange={(val) => setFilters({ ...filters, edrpou: val })}
              />
            </th>
            <th>
              <ColumnFilter
                column="Назва угоди"
                values={[...new Set(rows.map((r) => r.dealTitle || "-"))]}
                selected={filters.dealTitle}
                onChange={(val) => setFilters({ ...filters, dealTitle: val })}
              />
            </th>
            <th>
              <ColumnFilter
                column="Дата угоди"
                values={[...new Set(rows.map((r) => r.startDate || "-"))]}
                selected={filters.startDate}
                onChange={(val) => setFilters({ ...filters, startDate: val })}
              />
            </th>
            <th>
              <ColumnFilter
                column="Сума"
                values={[...new Set(rows.map((r) => r.amount || "-"))]}
                selected={filters.amount}
                onChange={(val) => setFilters({ ...filters, amount: val })}
              />
            </th>
            <th>
              <ColumnFilter
                column="Валюта"
                values={[...new Set(rows.map((r) => r.currency || "-"))]}
                selected={filters.currency}
                onChange={(val) => setFilters({ ...filters, currency: val })}
              />
            </th>
            <th>
              <ColumnFilter
                column="Еквівалент в UAH"
                values={[...new Set(rows.map((r) => r.amountUah || "-"))]}
                selected={filters.amountUah}
                onChange={(val) => setFilters({ ...filters, amountUah: val })}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, i) => (
            <tr key={i}>
              <td>{row.stack || "-"}</td>
              <td>{row.clientName}</td>
              <td>{row.edrpou}</td>
              <td>{row.dealTitle || "-"}</td>
              <td>{row.startDate || "-"}</td>
              <td>{row.amount || "-"}</td>
              <td>{row.currency || "-"}</td>
              <td>{row.amountUah || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагінація */}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Назад
        </button>
        <span>
          {page} / {Math.ceil(filteredRows.length / PAGE_SIZE)}
        </span>
        <button
          disabled={page >= Math.ceil(filteredRows.length / PAGE_SIZE)}
          onClick={() => setPage(page + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ClientsPage;
