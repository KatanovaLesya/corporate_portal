import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";
import styles from "./ClientsPage.module.css"; 
import styles from "./Dashboard.module.css"; 

const PAGE_SIZE = 50;

export default function ClientsPage() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showOnlyWithDeals, setShowOnlyWithDeals] = useState(false);


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

  //    if (!client.deals && (!client.stacks || client.stacks.length === 0)) {
  //      return { ...client, displayDeals: [] };
//}


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
      console.log("🧱 Normalized client:", client.name, "deals:", client.deals?.map((d) => d.title),"stackDeals:", client.stacks?.flatMap((s) => s.deals?.map((d) => d.title)));
      return { ...client, displayDeals };
    });
  }
    
  // --- фільтр по еквіваленту (UAH) ---
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

      const { amountUah, dealTitle, startDate, amount, currency, ...backendFilters } = filters;

      const res = await api.get("/clients", {
        params: Object.fromEntries(
            Object.entries(backendFilters).filter(
              ([, v]) => v !== "" && v !== null && v !== undefined
            )
          ),
      });


      console.log("rawClients ===>", res.data.rows || res.data);

      const rawClients = res.data.rows || [];
      const normalized = normalizeClients(rawClients);

      // 🔍 Додаткова фільтрація по угодах після нормалізації
      const filteredByDeals = normalized.filter((client) => {
        const deals = client.displayDeals || [];

        // якщо фільтр по угодах не заданий — повертаємо клієнта як є
        const isFilteringByDeals =
          filters.dealTitle || filters.startDate || filters.amount || filters.currency || filters.amountUah;

        if (!isFilteringByDeals && deals.length === 0) return true;

        // якщо фільтри задані — перевіряємо угоди
        return deals.some((deal) => {
          const matchTitle = filters.dealTitle
            ? deal.title?.toLowerCase().includes(filters.dealTitle.toLowerCase())
            : true;

          const matchDate = filters.startDate
            ? deal.start_date?.startsWith(filters.startDate)
            : true;

          const matchAmount = filters.amount
            ? String(deal.amount).includes(String(filters.amount))
            : true;

          const matchCurrency = filters.currency
            ? deal.currency?.toLowerCase() === filters.currency.toLowerCase()
            : true;

          const matchAmountUah = filters.amountUah
            ? String(deal.amount).includes(String(filters.amountUah))
            : true;

          return (
            matchTitle &&
            matchDate &&
            matchAmount &&
            matchCurrency &&
            matchAmountUah
          );
        });
      });

      setRows(applyAmountFilter(filteredByDeals, filters));
      setCount(res.data.count || 0);

    } catch (err) {
      console.error("Помилка завантаження клієнтів:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchClients();
  }, 300); // 300 мс затримка, щоб дочекатися оновлення filters

  return () => clearTimeout(delayDebounce);
}, [filters]);


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
  const filteredRows = rows;

  const visibleRows = showOnlyWithDeals
    ? filteredRows.filter((client) => {
        const hasActiveClientDeal =
          client.displayDeals?.some((deal) => deal.status === "active");

        const hasActiveStackDeal = client.stacks?.some((stack) =>
          stack.deals?.some((deal) => deal.status === "active")
        );

        return hasActiveClientDeal || hasActiveStackDeal;
      })
    : filteredRows;


  return (
    <div>
      <h2>Клієнти</h2>

      {loading && <p>Завантаження...</p>}

      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={showOnlyWithDeals}
            onChange={(e) => setShowOnlyWithDeals(e.target.checked)}
          />
          Активні угоди
        </label>
      </div>


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
                options={Array.from(
                  new Set(
                    (rows || []).flatMap((r) => r.displayDeals?.map((d) => d.currency) || [])
                  )
                )
                  .filter(Boolean)
                  .map((c) => ({ value: c, label: c }))}
                value={filters.currency ? { value: filters.currency, label: filters.currency } : null}
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
          {visibleRows.map((row, i) => (
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
    </div>
  );
}
