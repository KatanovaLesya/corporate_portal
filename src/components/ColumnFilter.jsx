// src/components/ColumnFilter.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ColumnFilter = ({ column, values, selected, onChange }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(values);

  // Фільтрація по введеному тексту
  useEffect(() => {
    if (!query) {
      setFiltered(values);
    } else {
      setFiltered(
        values.filter((v) =>
          v?.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, values]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {/* Поле пошуку */}
      <input
        type="text"
        placeholder={`Пошук по ${column}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "4px", fontSize: "0.9rem" }}
      />

      {/* Випадаючий список значень */}
      <select
        value={selected || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "4px", fontSize: "0.9rem" }}
      >
        <option value="">Всі</option>
        {filtered.map((val, idx) => (
          <option key={idx} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
};

ColumnFilter.propTypes = {
  column: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ColumnFilter;
