// src/pages/ClientsPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";
import styles from "./ClientsPage.module.css";

const PAGE_SIZE = 50;

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // фільтри
  const [filters, setFilters] = useState({
    stack: null,
    clientName: null,
    edrpou: null,
    dealTitle: null,
    startDate: null,
    amount: null,
    currency: null,
    amountUah: null,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await api.get("/clients", {
          params: { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE },
        });

        console.log("API /clients:", res.data);

        setClients(res.data.rows || []);
        setTotal(res.data.count || 0);
      } catch (err) {
        console.error("Помилка завантаження клієнтів", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [page]);

  // перетворюємо клієнтів у рядки таблиці
  useEffect(() => {
    const tableRows = [];

    clients.forEach((client) => {
      const clientName = client.name;
      const edrpou = client.edrpou;

      if (client.stacks?.length) {
        client.stacks.forEach((stack) => {
          if (client.deals?.length) {
            client.deals.forEach((deal) => {
              tableRows.push({
                stack: stack.name,
                clientName,
                edrpou,
                dealTitle: deal.title,
                startDate: deal.start_date,
                amount: deal.amount,
                currency: deal.currency,
                amountUah: deal.amount,
              });
            });
          } else {
            tableRows.push({
              stack: stack.name,
              clientName,
              edrpou,
              dealTitle: "-",
              startDate: "-",
              amount: "-",
              currency: "-",
              amountUah: "-",
            });
          }
        });
      } else {
        if (client.deals?.length) {
          client.deals.forEach((deal) => {
            tableRows.push({
              stack: "-",
              clientName,
              edrpou,
              dealTitle: deal.title,
              startDate: deal.start_date,
              amount: deal.amount,
              currency: deal.currency,
              amountUah: deal.amount,
            });
          });
        } else {
          tableRows.push({
            stack: "-",
            clientName,
            edrpou,
            dealTitle: "-",
            startDate: "-",
            amount: "-",
            currency: "-",
            amountUah: "-",
          });
        }
      }
    });

    setRows(tableRows);
    setFilteredRows(tableRows);
  }, [clients]);

  // застосування фільтрів
  useEffect(() => {
    let temp = [...rows];

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        temp = temp.filter((r) =>
          r[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
        );
      }
    });

    setFilteredRows(temp);
  }, [filters, rows]);

  const handleFilterChange = (col, option) => {
    setFilters((prev) => ({ ...prev, [col]: option ? option.value : null }));
  };

  // формуємо унікальні значення для фільтрів
  const getOptions = (col) => {
    const unique = [...new Set(rows.map((r) => r[col] || "-"))];
    return unique.map((v) => ({ value: v, label: v }));
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Клієнти</h2>

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
            {Object.keys(filters).map((col) => (
              <th key={col}>
                <Select
                  options={getOptions(col)}
                  isClearable
                  placeholder="Пошук..."
                  value={filters[col] ? { value: filters[col], label: filters[col] } : null}
                  onChange={(opt) => handleFilterChange(col, opt)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((r, i) => (
            <tr key={i}>
              <td>{r.stack}</td>
              <td>{r.clientName}</td>
              <td>{r.edrpou}</td>
              <td>{r.dealTitle}</td>
              <td>{r.startDate}</td>
              <td>{r.amount}</td>
              <td>{r.currency}</td>
              <td>{r.amountUah}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Назад
        </button>
        <span>
          {page} / {Math.ceil(total / PAGE_SIZE)}
        </span>
        <button
          onClick={() => setPage((p) => (p < Math.ceil(total / PAGE_SIZE) ? p + 1 : p))}
          disabled={page >= Math.ceil(total / PAGE_SIZE)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ClientsPage;
