import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";

const PAGE_SIZE = 50;

export default function ClientsPage() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // --- фільтри ---
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

  // --- опції для стеків ---
  const [stackOptions, setStackOptions] = useState([]);

  // --- нормалізація угод ---
  function normalizeClients(clients) {
    return clients.map((client) => {
      console.log("Client:", client.name, "Deals:", client.deals);
        
      const displayDeals = [];

      // угоди, які напряму належать клієнту
      if (client.deals) {
        displayDeals.push(
          ...client.deals.filter((d) => d.status === "active")
        );
      }

      // угоди зі стеків
      if (client.stacks) {
        client.stacks.forEach((stack) => {
          console.log("  Stack:", stack.name, "Deals:", stack.deals);
          if (stack.deals) {
            stack.deals
              .filter((d) => d.status === "active" && !d.client_id)
              .forEach((deal) => {
                // показуємо тільки у першого клієнта стеку
                if (stack.clients && stack.clients[0].id === client.id) {
                  displayDeals.push(deal);
                }
              });
          }
        });
      }

      return { ...client, displayDeals };
    });
  }
    
  // --- фільтрація на фронті ---
  function applyAmountFilter(clients, filters) {
      if (!filters.amountUah) return clients; 

      return clients.map((client) => {
        const displayDeals = client.displayDeals.filter((d) => {
          const amountUah = d.amount;
          return String(amountUah).includes(filters.amountUah);
        });
        return { ...client, displayDeals };
  });
  }

  // --- завантаження клієнтів з бекенду ---
  async function fetchClients() {
    try {
      setLoading(true);
        
      const {amountUah, dealTitle, ...backendFilters} = filters;
      
      const res = await api.get("/clients", {
        params: {
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
          ...backendFilters,
        },
      });
        
      console.log("rawClients ===>", res.data.rows || res.data);

      const rawClients = res.data.rows || [];
      const normalized = normalizeClients(rawClients);

      // 🔍 Фільтр по угоді (назві)
      const filteredByDealTitle = dealTitle
        ? normalized.filter((client) => {
            // приводимо запит до нижнього регістру
            const query = dealTitle.toLowerCase();

            // 1️⃣ якщо угоди є напряму в клієнта (майже завжди порожньо)
            const hasDirectDeal =
              Array.isArray(client.deals) &&
              client.deals.some(
                (deal) =>
                  typeof deal.title === "string" &&
                  deal.title.toLowerCase().includes(query)
              );

            // 2️⃣ якщо угоди є у стеків клієнта
            const hasStackDeal =
              Array.isArray(client.stacks) &&
              client.stacks.some(
                (stack) =>
                  Array.isArray(stack.deals) &&
                  stack.deals.some(
                    (deal) =>
                      typeof deal.title === "string" &&
                      deal.title.toLowerCase().includes(query)
                  )
              );

            // 3️⃣ показуємо клієнта, якщо він має угоду напряму або через стек
            return hasDirectDeal || hasStackDeal;
          })
        : normalized;





        
      setRows(applyAmountFilter(normalized, filters));
      setCount(res.data.count || 0);
    } catch (err) {
      console.error("Помилка завантаження клієнтів:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, [page, filters]);

  // --- завантаження стеків для фільтра ---
  useEffect(() => {
    const fetchStacks = async () => {
      try {
        const res = await api.get("/stacks");
        const data = res.data.rows || res.data;
        setStackOptions(
          data.map((s) => ({
            value: s.id,
            label: s.name,
          }))
        );
      } catch (err) {
        console.error("Помилка завантаження стеків:", err);
      }
    };

    fetchStacks();
  }, []);

  // --- обробник зміни фільтра ---
  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: value || "",
    }));
  };

  // --- кількість сторінок ---
    const totalPages = Math.ceil(count / PAGE_SIZE);
    
    // --- застосування фільтра по сумі в UAH ---
    const filteredRows = applyAmountFilter(rows, filters);

  return (
    <div>
      <h2>Клієнти</h2>

      {loading && <p>Завантаження...</p>}

      <table>
        <thead>
          <tr>
            <th>
              Стек
              <Select
                options={stackOptions}
                value={
                  filters.stack
                    ? stackOptions.find((o) => o.value === filters.stack)
                    : null
                }
                onChange={(selected) =>
                  setFilters({
                    ...filters,
                    stack: selected ? selected.value : "",
                  })
                }
                isClearable
                placeholder="Пошук..."
              />
            </th>
            <th>
              Назва
              <input
                placeholder="Пошук..."
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
            </th>
            <th>
              ЄДРПОУ
              <input
                placeholder="Пошук..."
                value={filters.edrpou}
                onChange={(e) => handleFilterChange("edrpou", e.target.value)}
              />
            </th>
            <th>
              Угоди (назви)
              <input
                placeholder="Пошук..."
                value={filters.dealTitle}
                onChange={(e) =>
                  handleFilterChange("dealTitle", e.target.value)
                }
              />
            </th>
            <th>
              Дата угоди
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </th>
            <th>
              Сума
              <input
                placeholder="Пошук..."
                value={filters.amount}
                onChange={(e) => handleFilterChange("amount", e.target.value)}
              />
            </th>
            <th>
              Валюта
              <Select
                options={[...new Set(rows.flatMap((r) =>
                  r.displayDeals.map((d) => d.currency)
                ))].map((c) => ({
                  value: c,
                  label: c,
                }))}
                onChange={(opt) => handleFilterChange("currency", opt?.value)}
                isClearable
              />
            </th>
            <th>
              Еквівалент в UAH
              <input
                placeholder="Пошук..."
                value={filters.amountUah}
                onChange={(e) =>
                  handleFilterChange("amountUah", e.target.value)
                }
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, i) => (
            <tr key={i}>
              <td>
                {row.stacks && row.stacks.length > 0
                  ? row.stacks.map((s) => s.name).join(", ")
                  : "-"}
              </td>
              <td>{row.name}</td>
              <td>{row.edrpou}</td>
              <td>
                {row.displayDeals.length > 0
                  ? row.displayDeals.map((d) => d.title).join(", ")
                  : "-"}
              </td>
              <td>
                {row.displayDeals.length > 0
                  ? row.displayDeals.map((d) => d.start_date).join(", ")
                  : "-"}
              </td>
              <td>
                {row.displayDeals.length > 0
                  ? row.displayDeals.map((d) => d.amount).join(", ")
                  : "-"}
              </td>
              <td>
                {row.displayDeals.length > 0
                  ? row.displayDeals.map((d) => d.currency).join(", ")
                  : "-"}
              </td>
              <td>{row.displayDeals.length > 0
                  ? row.displayDeals.map((d) => d.amount /* курс = 1:1 */).join(", ")
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- пагінація --- */}
      <div style={{ marginTop: "10px" }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Назад
        </button>
        <span>
          {page} / {totalPages || 1}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}
