// src/pages/ClientsPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./ClientsPage.module.css";

const PAGE_SIZE = 50;

// 🔧 хелпер для безпечного значення
const safe = (v) => (v ? v.toString() : "-");

const ClientsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  // ---- 1. Завантаження даних ----
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await api.get("/clients", {
          params: { page, limit: PAGE_SIZE }
        });
        const clients = res.data;

        // ---- 2. Нормалізація ----
        const normalized = [];
        clients.forEach((client) => {
          // якщо клієнт має угоди → робимо рядки по угодам
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
                amountUah: safe(deal.amount) // 🔧 поки що 1:1
              });
            });
          } else {
            // клієнт без угод → рядок без угоди
            normalized.push({
              stack: safe(client.stacks?.map((s) => s.name).join(", ")),
              clientName: safe(client.name),
              edrpou: safe(client.edrpou),
              dealTitle: "-",
              startDate: "-",
              amount: "-",
              currency: "-",
              amountUah: "-"
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

    fetchClients();
  }, [page]);

  // ---- 3. Фільтрація ----
  const filteredRows = rows.filter((r) =>
    Object.entries(filters).every(([key, value]) =>
      safe(r[key]).toLowerCase().includes(value.toLowerCase())
    )
  );

  // ---- 4. Обробник для інпутів ----
  const handleFilterChange = (col, value) => {
    setFilters((prev) => ({ ...prev, [col]: value }));
  };

  return (
    <div className={styles.container}>
      <h2>Клієнти</h2>
      {loading ? (
        <div>Завантаження...</div>
      ) : (
        <>
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
                {[
                  "stack",
                  "clientName",
                  "edrpou",
                  "dealTitle",
                  "startDate",
                  "amount",
                  "currency",
                  "amountUah"
                ].map((col) => (
                  <th key={col}>
                    <input
                      type="text"
                      placeholder="Пошук..."
                      value={filters[col] || ""}
                      onChange={(e) =>
                        handleFilterChange(col, e.target.value)
                      }
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
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

          {/* ---- Пагінація ---- */}
          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Назад
            </button>
            <span>{page}</span>
            <button onClick={() => setPage((p) => p + 1)}>Вперед</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientsPage;
