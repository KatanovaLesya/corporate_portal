// src/pages/ClientsPage.jsx
import { useEffect, useState } from "react";
import Select from "react-select";
import api from "../services/api";

const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // --- фільтри ---
  const [filters, setFilters] = useState({
    stack: "",
    name: "",
    edrpou: "",
    dealTitle: "",
    startDate: "",
    amount: "",
    currency: "",
  });

  const [stacks, setStacks] = useState([]);

  // --- завантаження клієнтів ---
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await api.get("/clients", {
          params: {
            page,
            limit: PAGE_SIZE,
            ...filters,
          },
        });

        setClients(res.data.rows || []);
        setCount(res.data.count || 0);
      } catch (err) {
        console.error("Помилка завантаження клієнтів –", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [page, filters]);

  // --- завантаження стеків ---
  useEffect(() => {
    const fetchStacks = async () => {
      try {
        const res = await api.get("/stacks"); // бекенд повертає масив стеків
        setStacks(res.data || []);
      } catch (err) {
        console.error("Помилка завантаження стеків –", err);
      }
    };
    fetchStacks();
  }, []);

  // --- пагінація ---
  const totalPages = Math.ceil(count / PAGE_SIZE);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1); // скидати на першу сторінку після фільтру
  };

  return (
    <div>
      <h2>Клієнти</h2>

      {/* Таблиця */}
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>
                Стек
                <Select
                  isClearable
                  placeholder="Пошук..."
                  options={stacks.map((s) => ({ value: s.name, label: s.name }))}
                  onChange={(opt) =>
                    handleFilterChange("stack", opt ? opt.value : "")
                  }
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
                Назва угоди
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
                <input
                  placeholder="Пошук..."
                  value={filters.currency}
                  onChange={(e) =>
                    handleFilterChange("currency", e.target.value)
                  }
                />
              </th>
              <th>Еквівалент в UAH</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              if (client.deals && client.deals.length > 0) {
                return client.deals.map((deal, i) => (
                  <tr key={`${client.id}-${i}`}>
                    <td>{client.stacks?.map((s) => s.name).join(", ") || "-"}</td>
                    <td>{client.name}</td>
                    <td>{client.edrpou}</td>
                    <td>{deal.title}</td>
                    <td>{deal.start_date}</td>
                    <td>{deal.amount}</td>
                    <td>{deal.currency}</td>
                    <td>{deal.amount}</td> {/* курс 1:1 */}
                  </tr>
                ));
              }
              return (
                <tr key={client.id}>
                  <td>{client.stacks?.map((s) => s.name).join(", ") || "-"}</td>
                  <td>{client.name}</td>
                  <td>{client.edrpou}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Пагінація */}
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Назад
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ClientsPage;
