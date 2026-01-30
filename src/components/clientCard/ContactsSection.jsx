import { useState } from "react";
import api from "../../services/api";
import PropTypes from "prop-types";
import toast from "react-hot-toast";



const emptyForm = {
  name: "",
  phone: "",
  email: "",
  telegram: "",
  position: "",
  birthday: ""
};

export default function ContactsSection({ client, onRefreshClient }) {
  const [mode, setMode] = useState("view"); // view | create | edit
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.error("Скопійовано");
  } catch (e) {
    toast.error("Не вдалося скопіювати");
  }
};
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("uk-UA");
  };


  const startCreate = () => {
    setMode("create");
    setFormData(emptyForm);
    setEditingId(null);
  };

  const startEdit = (contact) => {
    setMode("edit");
    setFormData({
      name: contact.name || "",
      phone: contact.phone || "",
      email: contact.email || "",
      telegram: contact.telegram || "",
      position: contact.position || "",
      birthday: contact.birthday || ""
    });
    setEditingId(contact.id);
  };

  const cancel = () => {
    setMode("view");
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveContact = async () => {

    console.log("🟡 saveContact → mode:", mode);
    console.log("🟡 client.id:", client.id);
    console.log("🟡 raw formData:", formData);

    if (!formData.name.trim()) {
      toast.error("Імʼя обовʼязкове");
      return;
    }

    try {
      setSaving(true);

      if (mode === "create") {
        // 1. Створюємо контакт
        const contactRes = await api.post("/contacts", formData);

        // 2. Привʼязуємо до клієнта
        await api.post(`/clients/${client.id}/contacts`, {
          contact_id: contactRes.data.id
        });
      }

      if (mode === "edit") {
        await api.put(`/contacts/${editingId}`, formData);
      }

      // 3. Оновлюємо клієнта
      await onRefreshClient();

      cancel();
    } catch (err) {
      console.error("Помилка збереження контакту:", err);
      toast.error("Не вдалося зберегти контакт");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Контакти</h3>

      {client?.contacts?.length ? (
        <ul>
          {client.contacts.map((c) => (
            <li key={c.id} style={{ marginBottom: "8px" }}>
              <strong>{c.name}</strong>

              {c.position && <> — <em>{c.position}</em></>}

              <div style={{ marginTop: "4px" }}>
                {c.phone && (
                  <>
                    📞{" "}
                    <a href={`tel:${c.phone}`}>{c.phone}</a>
                    <button
                      onClick={() => copyToClipboard(c.phone)}
                      title="Скопіювати телефон"
                      style={{ marginLeft: "6px" }}
                    >
                      📋
                    </button>
                  </>
                )}
              </div>

              <div>
                {c.email && (
                  <>
                    ✉️{" "}
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                    <button
                      onClick={() => copyToClipboard(c.email)}
                      title="Скопіювати email"
                      style={{ marginLeft: "6px" }}
                    >
                      📋
                    </button>
                  </>
                )}
              </div>

              <div>
                {c.telegram && (
                  <>
                    ✈️{" "}
                    <a
                      href={`https://t.me/${c.telegram.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {c.telegram}
                    </a>
                  </>
                )}
              </div>

              <div>
                🎂 {formatDate(c.birthday)}
              </div>

              <button
                onClick={() => startEdit(c)}
                title="Редагувати"
                style={{ marginTop: "4px" }}
              >
                ✏️
              </button>
            </li>

          ))}
        </ul>
      ) : (
        <p>Контакти відсутні</p>
      )}

      {mode === "view" && (
        <button onClick={startCreate}>➕ Додати контакт</button>
      )}

      {(mode === "create" || mode === "edit") && (
        <div style={{ marginTop: "15px", padding: "10px", border: "1px solid #ccc" }}>
          <h4>{mode === "create" ? "Новий контакт" : "Редагування контакту"}</h4>

          <input name="name" placeholder="Імʼя" value={formData.name} onChange={handleChange} />
          <input name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input name="telegram" placeholder="Telegram" value={formData.telegram} onChange={handleChange} />
          <input name="position" placeholder="Посада" value={formData.position} onChange={handleChange} />
          <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} />

          <div style={{ marginTop: "10px" }}>
            <button onClick={saveContact} disabled={saving}>
              {saving ? "Збереження..." : "Зберегти"}
            </button>
            <button onClick={cancel} style={{ marginLeft: "10px" }}>
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ContactsSection.propTypes = {
  client: PropTypes.object.isRequired,
  onRefreshClient: PropTypes.func.isRequired
};
