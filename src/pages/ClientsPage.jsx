import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import Select from "react-select";
import styles from "./ClientsPage.module.css";

const PAGE_SIZE = 50;

export default function ClientsPage() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
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

  const [stackOptions, setStackOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const debounceRef = useRef(null);

  // --- нормалізація клієнтів та їхніх угод ---
  const normalizeClients = (clients) => {
    return clients.map((client) => {
      const displayDeals = [];

      if (client.deals) {
        displayDeals.push(...client.deals.filter((d) => d.status === "active"));
      }

      if (client.stacks) {
        client.stacks.forEach((stack) => {
          if (stack.deals) {
            stack.deals
              .filter((d) => d.status === "active" && !d.client_id)
              .forEach((deal) => {
                if (stack.clients && stack.clients[0].id === client.id) {
                  displayDeals.push(deal);
                }
              });
          }
        });
      }

      return { ...client, displayDeals };
    });
  };

  // --- фільтрація ---
  const applyFilters = (clients, filters) => {
    if (!filters || Object.values(filters).every((v) => v === "")) return clients;

    return clients.filter((client) => {
      const matchStack =
        !filters.stack ||
        client.stacks?.some((s) =>
          s.name?.toLowerCase().includes(filters.stack.toLowerCase())
        );

      const matchName =
        !filters.name ||
        client.name?.toLowerCase().includes(filters.name.toLowerCase());

      const matchEdrpou =
        !filters.edrpou ||
        client.edrpou?.toLowerCase().includes(filters.edrpou.toLowerCase());

      const matchDeals = client.displayDeals.some((deal) => {
        const matchDealTitle =
          !filters.dealTitle ||
          deal.title?.toLowerCase().includes(filters.dealTitle.toLowerCase());
        const matchStartDate =
          !filters.startDate || deal.start_date?.includes(filters.startDate);
        const matchAmount =
          !filters.amount || String(deal.amount).includes(filters.amount);
        const matchCurrency =
          !filters.currency || deal.currency === filters.currency;
        const matchAmountUah =
          !filters.amountUah ||
          String(deal.amountUah)?.includes(filters.amountUah);

        return (
          matchDealTitle &&
          matchStartDate &&
          matchAmount &&
          matchCurrency &&
          matchAmountUah
        );
      });

      return matchStack && matchName && matchEdrpou && matchDeals;
    });
  };

  // --- отримання клієнтів ---
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/clients?page=${page}&limit=${PAGE_SIZE}`);
      const rawData = Array.isArray(res.data)
        ? res.data
        : res.data.rows || res.data.clients || res.data.data || [];

      const data = normalizeClients(rawData);
      const filtered = applyFilters(data, filters);

      setRows(filtered);
      setCount(res.data.count || filtered.length);

      // валютні опції
      const allCurrencies = new Set();
      data.forEach((c) =>
        c.displayDeals?.forEach((d) => d.currency && allCurrencies.add(d.currency))
      );
      setCurrencyOptions([...allCurrencies].map((c) => ({ value: c, label: c })));
    } catch (error) {
      console.error("Помилка при отриманні клієнтів:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- отримання стеків ---
  const fetchStacks = async () => {
    try {
      const res = await api.get("/stacks");
      setStackOptions(
        res.data.map((stack) => ({
          value: stack.name,
          label: stack.name,
        }))
      );
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

  // --- reset сторінки при зміні фільтрів ---
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchStacks();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.wrapper}>
      <h2>Клієнти</h2>

      {/* --- Фільтри --- */}
      <div className={styles.filters}>
        <Select
          options={stackOptions}
          placeholder="Стек"
          isClearable
          onChange={(selected) => handleFilterChange("stack", selected?.value || "")}
        />
        <input placeholder="Назва" onChange={(e) => handleFilterChange("name", e.target.value)} />
        <input placeholder="ЄДРПОУ" onChange={(e) => handleFilterChange("edrpou", e.target.value)} />
        <input placeholder="Угода (назва)" onChange={(e) => handleFilterChange("dealTitle", e.target.value)} />
        <input type="date" onChange={(e) => handleFilterChange("startDate", e.target.value)} />
        <input placeholder="Сума" onChange={(e) => handleFilterChange("amount", e.target.value)} />
        <Select
          options={currencyOptions}
          placeholder="Валюта"
          isClearable
          onChange={(selected) => handleFilterChange("currency", selected?.value || "")}
        />
        <input placeholder="Еквівалент в UAH" onChange={(e) => handleFilterChange("amountUah", e.target.value)} />
      </div>

      {/* --- Таблиця --- */}
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
              <th>Дата</th>
              <th>Сума</th>
              <th>Валюта</th>
              <th>Еквівалент (UAH)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((client) => (
              <tr key={client.id} className={styles.row}>
                <td>{client.stacks?.map((s) => s.name).join(", ") || "-"}</td>
                <td>{client.name}</td>
                <td>{client.edrpou}</td>
                <td>
                  {client.displayDeals?.length ? (
                    client.displayDeals.map((d, i) => (
                      <div key={i} className={styles.deal}>
                        {d.title || "-"}
                      </div>
                    ))
                  ) : (
                    "-"
                  )}
                </td>
                <td>{client.displayDeals?.map((d) => d.start_date).join(", ") || "-"}</td>
                <td>{client.displayDeals?.map((d) => d.amount).join(", ") || "-"}</td>
                <td>{client.displayDeals?.map((d) => d.currency).join(", ") || "-"}</td>
                <td>{client.displayDeals?.map((d) => d.amountUah).join(", ") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- Пагінація --- */}
      <div className={styles.pagination}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          ⬅ Попередня
        </button>
        <span>
          Сторінка {page} з {Math.ceil(count / PAGE_SIZE) || 1}
        </span>
        <button
          onClick={() => setPage((p) => (p * PAGE_SIZE < count ? p + 1 : p))}
          disabled={page * PAGE_SIZE >= count}
        >
          Наступна ➡
        </button>
      </div>
    </div>
  );
}
