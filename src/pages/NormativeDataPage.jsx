import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNormatives,
  createNormative,
  updateNormative,
  deleteNormative,
} from "../services/normativeService";
import styles from "./NormativeDataPage.module.css";

export default function NormativeDataPage() {
  const navigate = useNavigate();

  const [normatives, setNormatives] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    year: new Date().getFullYear(),
    value: "",
    valueType: "number",
    unit: "",
    description: "",
  });

  // Отримати параметри за роком
  const fetchData = async (year) => {
    setLoading(true);
    try {
      const data = await getNormatives(year);
      setNormatives(data);
    } catch (error) {
      console.error(error);
      setStatus("❌ Помилка при завантаженні даних");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  // Додавання / оновлення
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(formData.value) || formData.value === "") {
  setStatus("⚠️ Введіть числове значення");
  return;
}

    try {
      if (editingItem) {
        await updateNormative(editingItem.id, formData);
        setStatus("✅ Параметр оновлено");
      } else {
        await createNormative(formData);
        setStatus("✅ Новий параметр додано");
      }
      setEditingItem(null);
      setFormData({
        name: "",
        key: "",
        year: selectedYear,
        value: "",
        valueType: "number",
        unit: "",
        description: "",
      });
      await fetchData(selectedYear);
    } catch (error) {
      console.error(error);
      setStatus("❌ Помилка при збереженні");
    }
  };

  // Редагування
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
  };

  // Видалення
  const handleDelete = async (id) => {
    if (!window.confirm("Видалити цей параметр?")) return;
    try {
      await deleteNormative(id);
      setStatus("🗑️ Параметр видалено");
      await fetchData(selectedYear);
    } catch (error) {
      console.error(error);
      setStatus("❌ Помилка при видаленні");
    }
  };

  // Зміна року
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  return (
    <div className={styles.normativesPage}>
      <div className={styles.normativesHeader}>
        <h2>Нормативні параметри</h2>

        <div>
          <label>Рік: </label>
          <select className={styles.yearSelect} value={selectedYear} onChange={handleYearChange}>
            {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table className={styles.normativesTable}>
          <thead>
            <tr>
              <th>Назва</th>
              <th>Рік</th>
              <th>Ключ</th>
              <th>Значення</th>
              <th>Одиниця</th>
              <th>Опис</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {normatives.map((n) => (
              <tr key={n.id}>
                <td>{n.name}</td>
                <td>{n.year}</td>
                <td>{n.key}</td>
                <td>{n.value}</td>
                <td>{n.unit}</td>
                <td>{n.description}</td>
                <td>
                  <button onClick={() => handleEdit(n)}>✏️</button>
                  <button onClick={() => handleDelete(n.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>{editingItem ? "Редагування параметра" : "Додати новий параметр"}</h3>

      <form onSubmit={handleSubmit} className={styles.normativesForm}>
        <input
          placeholder="Назва"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Рік"
          value={selectedYear}
          className={styles.readonlyInput}
        />
        <input
          placeholder="Ключ"
          value={formData.key}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
          required
        />
        <input
          placeholder="Значення"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          required
        />
        <input
          placeholder="Одиниця виміру"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        />
        <textarea
          placeholder="Опис"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <button type="submit">
          {editingItem ? "💾 Зберегти зміни" : "➕ Додати"}
        </button>
      </form>

      {status && <p className={styles.statusMessage}>{status}</p>}
    </div>
  );
}
