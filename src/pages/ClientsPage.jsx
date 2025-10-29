import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import Select from "react-select";
import styles from "./ClientsPage.module.css";

const PAGE_SIZE = 50;

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    stack: "",
    name: "",
    edrpou: "",
    dealTitle: "",
    startDate: "",
    amount: "",
    currency: "",
    amountUah: "",
  });
  const debounceRef = useRef(null);

  // --- отримання клієнтів (як було) ---
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/clients?page=${page}&limit=${PAGE_SIZE}`);
      setClients(response.data.rows);
      setCount(response.data.count);
    } catch (error) {
      console.error("Помилка при отриманні клієнтів:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- отримання стеків (як було) ---
  const fetchStacks = async () => {
    try {
      const response = await api.get("/stacks");
      setStacks(response.data.rows);
    } catch (error) {
      console.error("Помилка при отриманні стеків:", error);
    }
  };

  // --- debounce для фільтрів ---
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchClients();
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [filters, page]);

  useEffect(() => {
    fetchStacks();
    fetchClients();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // --- стабільна локальна фільтрація ---
  const filteredClients = clients.filter((client) => {
    const stackMatch =
      !filters.stack ||
      client.stacks?.some((s) =>
        s.name?.toLowerCase().includes(filters.stack.toLowerCase())
      );

    const nameMatch =
      !filters.name ||
      client.name?.toLowerCase().includes(filters.name.toLowerCase());

    const edrpouMatch =
      !filters.edrpou ||
      client.edrpou?.toLowerCase().includes(filters.edrpou.toLowerCase());

    const dealMatch =
      !filters.dealTitle &&
      !filters.startDate &&
      !filters.amount &&
      !filters.currency &&
      !filters.amountUah
        ? true
        : client.deals?.some((deal) => {
            const dealTitleMatch =
              !filters.dealTitle ||
              deal.title
                ?.toLowerCase()
                .includes(filters.dealTitle.toLowerCase());
            const startDateMatch =
              !filters.startDate ||
              (deal.start_date &&
                deal.start_date.includes(filters.startDate));
            const amountMatch =
              !filters.amount ||
              String(deal.amount)
                ?.toLowerCase()
                .includes(filters.amount.toLowerCase());
            const currencyMatch =
              !filters.currency ||
              deal.currency?.toLowerCase() === filters.currency.toLowerCase();
            const amountUahMatch =
              !filters.amountUah ||
              String(deal.amountUah)
                ?.toLowerCase()
                .includes(filters.amountUah.toLowerCase());

            return (
              dealTitleMatch &&
              startDateMatch &&
              amountMatch &&
              currencyMatch &&
              amountUahMatch
            );
          });

    return stackMatch && nameMatch && edrpouMatch && dealMatch;
  });

  return (
    <div className={styles.wrapper}>
      <h2>Клієнти</h2>

      {/* --- Фільтри --- */}
      <div className={styles.filters}>
        <Select
          options={stacks.map((stack) => ({
            value: stack.name,
            label: stack.name,
          }))}
          placeholder="Стек"
          isClearable
          onChange={(selected) =>
            handleFilterChange("stack", selected?.value || "")
          }
        />
        <input
          placeholder="Назва"
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
        <input
          placeholder="ЄДРПОУ"
          onChange={(e) => handleFilterChange("edrpou", e.target.value)}
        />
        <input
          placeholder="Угода (назва)"
          onChange={(e) => handleFilterChange("dealTitle", e.target.value)}
        />
        <input
          type="date"
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
        />
        <input
          placeholder="Сума"
          onChange={(e) => handleFilterChange("amount", e.target.value)}
        />
        <input
          placeholder="Валюта"
          onChange={(e) => handleFilterChange("currency", e.target.value)}
        />
        <input
          placeholder="Еквівалент в UAH"
          onChange={(e) => handleFilterChange("amountUah", e.target.value)}
        />
      </div>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Стек</th>
              <th>Назва</th>
              <th>ЄДРПОУ</th>
              <th>Угоди</th>
              <th>Дата угоди</th>
              <th>Сума</th>
              <th>Валюта</th>
              <th>Еквівалент (UAH)</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client.stacks?.map((s) => s.name).join(", ") || "-"}</td>
                <td>{client.name}</td>
                <td>{client.edrpou}</td>
                <td>{client.deals?.map((d) => d.title).join(", ") || "-"}</td>
                <td>
                  {client.deals?.map((d) => d.start_date).join(", ") || "-"}
                </td>
                <td>{client.deals?.map((d) => d.amount).join(", ") || "-"}</td>
                <td>{client.deals?.map((d) => d.currency).join(", ") || "-"}</td>
                <td>
                  {client.deals?.map((d) => d.amountUah).join(", ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ⬅ Попередня
        </button>
        <span>
          Сторінка {page} з {Math.ceil(count / PAGE_SIZE) || 1}
        </span>
        <button
          onClick={() =>
            setPage((p) => (p * PAGE_SIZE < count ? p + 1 : p))
          }
          disabled={page * PAGE_SIZE >= count}
        >
          Наступна ➡
        </button>
      </div>
    </div>
  );
}
