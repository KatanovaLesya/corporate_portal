// src/pages/ClientsPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./ClientsPage.module.css";

// допоміжна функція щоб уникнути undefined/null
const safe = (val) => (val !== null && val !== undefined ? val : "-");

const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  // ======= завантаження клієнтів =======
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clients");

      console.log("API /clients:", res.data);

      const clients = Array.isArray(res.data) ? res.data : [];

      const normalized = [];
      clients.forEach((client) => {
        if (client.deals?.length) {
          client.deals.forEach((deal) => {
            normalized.push({
              stack: safe(client.stacks?.map((s) => s.name).join(", ")),
              clientName: safe(client.name),
              edrpou: safe(client.edrpou),
              dealTitle: safe(deal.title),
              startDate: safe(deal.start_date),
              amount: safe(deal.amount),
              currency: safe(deal.currency),
              amountUah: safe(deal.amount), // поки 1:1
            });
          });
        } else {
          normalized.push({
            stack: safe(client.stacks?.map((s) => s.name).join(", ")),
            clientName: safe(client.name),
            edrpou: safe(client.edrpou),
            dealTitle: "-",
            startDate: "-",
            amount: "-",
            currency: "-",
            amountUah: "-",
          });
        }
      });

      setRows(normalized);
    } catch (err) {
      console.error("Помилка завантаження клієнтів", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ======= фільтрація =======
  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value.toLowerCase(),
    }));
  };

  const filteredRows = rows.filter((row) =>
    Object.entries(filters).every(([col, val]) =>
      row[col]?.toString().toLowerCase().includes(val)
    )
  );

  // ======= пагінація =======
  const paginatedRows = filteredRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);

  // ======= render =======
  if (loading) return <div>Завантаження...</div>;

  return (
    <div className={styles.container}>
      <h2>Клієнти</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              Стек
              <input
                type="text"
                placeholder="Пошук..."
                onChange={(e) => handleFilterChange("stack", e.target.value)}
              />
            </th>
            <th>
              Назва
              <input
                type="text"
                placeholder="Пошук..."
                onChange={(e) => handleFilterChange("clientName", e.target.value)}
              />
            </th>
            <th>
              ЄДРПОУ
              <input
                type="text"
                placeholder="Пошук..."
                onChange={(e) => handleFilterChange("edrpou", e.target.value)}
              />
            </th>
            <th>
              Назва угоди
              <input
                type="text"
                placeholder="Пошук..."
                onChange={(e) => handleFilterChange("dealTitle", e.target.value)}
              />
            </th>
            <th>
              Дата угоди
              <input
                type="text"
                placeholder="Пошук..."
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </th>
            <th>
              Сума
              <input
                type="text"
                placeholder="Пошук..."
                onChange={(e) => handleFilterChange("amount", e.target.value)}
              />
            </th>
            <th>
              Валюта
              <input
                type="text"
                placeholder="Пошук..."
                onChange={(e) => handleFilterChange("currency", e.target.value)}
              />
            </th>
            <th>
              Еквівалент в UAH
              <input
                type="text"
                placeholder="Пошук..."
                onChange={(e) =>
                  handleFilterChange("amountUah", e.target.value)
                }
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, i) => (
            <tr key={i}>
              <td>{row.stack}</td>
              <td>{row.clientName}</td>
              <td>{row.edrpou}</td>
              <td>{row.dealTitle}</td>
              <td>{row.startDate}</td>
              <td>{row.amount}</td>
              <td>{row.currency}</td>
              <td>{row.amountUah}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* пагінація */}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Назад
        </button>
        <span>
          {page} / {totalPages || 1}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ClientsPage;
