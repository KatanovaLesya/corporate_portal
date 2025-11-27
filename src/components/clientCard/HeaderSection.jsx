import { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../services/api";
import styles from "./HeaderSection.module.css";
import PropTypes from "prop-types";

export default function HeaderSection({
  selectedClientId,
  setSelectedClientId,
  clientData,
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [noOptions, setNoOptions] = useState(false);

  // 🔍 Пошук клієнтів по назві або ЄДРПОУ
  useEffect(() => {
    const fetchClients = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/clients", {
          params: { search: searchTerm },
        });

        const data = res.data.rows || res.data || [];
        setOptions(
          data.map((client) => ({
            value: client.id,
            label: `${client.name} (${client.edrpou || "—"})`,
          }))
        );
        setNoOptions(data.length === 0);
      } catch (err) {
        console.error("Помилка при пошуку клієнтів:", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchClients, 400); // debounce 400 мс
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // 🧩 Обробка вибору клієнта
  const handleSelect = (selectedOption) => {
    setSelectedClientId(selectedOption ? selectedOption.value : "");
  };

  return (
    <div className={styles.headerSection}>
      <label className={styles.label}>Оберіть клієнта:</label>
      <Select
        classNamePrefix="react-select"
        value={
          options.find((o) => o.value === selectedClientId) || null
        }
        onChange={handleSelect}
        onInputChange={(val) => setSearchTerm(val)}
        options={options}
        isClearable
        isLoading={loading}
        isSearchable
        placeholder="Почніть вводити назву або ЄДРПОУ..."
        noOptionsMessage={() =>
          loading
            ? "Завантаження..."
            : noOptions
            ? "Нічого не знайдено"
            : "Введіть мінімум 2 символи"
        }
        styles={{
          container: (base) => ({
            ...base,
            width: "100%",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 100,
          }),
        }}
      />

      {clientData && (
        <div className={styles.clientInfo}>
          <p>
            <strong>Назва:</strong> {clientData.name}
          </p>
          <p>
            <strong>ЄДРПОУ:</strong> {clientData.edrpou || "—"}
          </p>
        </div>
      )}
    </div>
  );
}

HeaderSection.propTypes = {
  selectedClientId: PropTypes.string,
  setSelectedClientId: PropTypes.func.isRequired,
  clientData: PropTypes.object,
};
