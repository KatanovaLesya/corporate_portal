import { useEffect, useState } from "react";
import styles from "./ClientsPage.module.css";

// сервісні функції для API
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function fetchClients() {
  const res = await fetch(`${API_BASE}/clients`);
  if (!res.ok) throw new Error("Помилка завантаження клієнтів");
  return res.json();
}

async function fetchStackClients(stackId) {
  const res = await fetch(`${API_BASE}/stacks/${stackId}/clients`);
  if (!res.ok) return [];
  return res.json();
}

const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  // 1. Завантаження клієнтів
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchClients();
        setClients(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2. Побудова рядків для таблиці
  useEffect(() => {
    const buildRows = async () => {
      let allRows = [];

      for (const client of clients) {
        // якщо немає угод → просто рядок клієнта
        if (!client.deals || client.deals.length === 0) {
          allRows.push({
            client,
            stack: null,
            deal: null,
            rowSpan: 1,
          });
          continue;
        }

        for (const deal of client.deals) {
          if (deal.stackId) {
            // угода зі стеком → довантажуємо клієнтів цього стека
            const stackClients = await fetchStackClients(deal.stackId);
            const rowSpan = stackClients.length;

            stackClients.forEach((sc, idx) => {
              allRows.push({
                client: sc,
                stack: deal.stackId,
                deal,
                rowSpan: idx === 0 ? rowSpan : 0, // малюємо угоду лише в першому рядку
              });
            });
          } else {
            // індивідуальна угода
            allRows.push({
              client,
              stack: null,
              deal,
              rowSpan: 1,
            });
          }
        }
      }
      setRows(allRows);
    };

    if (clients.length > 0) buildRows();
  }, [clients]);

  // 3. Фільтрація
  const filteredRows = rows.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const field = getFieldValue(row, key);
      return field?.toString().toLowerCase().includes(value.toLowerCase());
    });
  });

  // 4. Пагінація
  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const paginatedRows = filteredRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className={styles.page}>
      <h2>Клієнти</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            {["Стек", "Назва", "ЄДРПОУ", "Назва угоди", "Дата угоди", "Сума", "Валюта", "Еквівалент в UAH"].map(
              (col) => (
                <th key={col}>
                  {col}
                  <div>
                    <input
                      type="text"
                      placeholder="Пошук..."
                      value={filters[col] || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, [col]: e.target.value })
                      }
                    />
                  </div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.stack || "-"}</td>
              <td>{row.client?.name}</td>
              <td>{row.client?.edrpou}</td>

              {row.rowSpan > 0 ? (
                <>
                  <td rowSpan={row.rowSpan}>{row.deal?.title || "-"}</td>
                  <td rowSpan={row.rowSpan}>
                    {row.deal?.start_date
                      ? new Date(row.deal.start_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td rowSpan={row.rowSpan}>{row.deal?.amount || "-"}</td>
                  <td rowSpan={row.rowSpan}>{row.deal?.currency || "-"}</td>
                  <td rowSpan={row.rowSpan}>
                    {row.deal?.amount ? row.deal.amount : "-"}
                  </td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагінація */}
      <div className={styles.pagination}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
          Назад
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))}>
          Вперед
        </button>
      </div>
    </div>
  );
};

// Хелпер для фільтрації
function getFieldValue(row, col) {
  switch (col) {
    case "Стек":
      return row.stack;
    case "Назва":
      return row.client?.name;
    case "ЄДРПОУ":
      return row.client?.edrpou;
    case "Назва угоди":
      return row.deal?.title;
    case "Дата угоди":
      return row.deal?.start_date;
    case "Сума":
      return row.deal?.amount;
    case "Валюта":
      return row.deal?.currency;
    case "Еквівалент в UAH":
      return row.deal?.amount;
    default:
      return "";
  }
}

export default ClientsPage;
