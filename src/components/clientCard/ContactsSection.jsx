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
  birthday: "",
  note: ""
};

export default function ContactsSection({ client, onRefreshClient }) {
  const [mode, setMode] = useState("view"); // view | create | edit
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);


  const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Скопійовано");
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
      birthday: contact.birthday || "",
      note: contact.note || ""

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

      const normalizedData = {
        ...formData,
        phone: formData.phone || null,
        email: formData.email || null,
        telegram: formData.telegram || null,
        position: formData.position || null,
        birthday: formData.birthday || null,
        note: formData.note || null,

      };

      if (mode === "create") {
        const contactRes = await api.post("/contacts", normalizedData);

        await api.post(`/clients/${client.id}/contacts`, {
          contact_id: contactRes.data.id
        });
      }

      if (mode === "edit") {
        await api.put(`/contacts/${editingId}`, normalizedData);
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

  const contacts = client?.contacts || [];
  const primaryContact = contacts[0];
  const otherContacts = contacts.slice(1);


  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Контакти</h3>

      {contacts.length === 0 && <p>Контакти відсутні</p>}

      {/* 🟢 ПЕРШИЙ КОНТАКТ — ПОВНІСТЮ */}
      {primaryContact && (
        <div style={{ marginBottom: "12px" }}>
          <strong>{primaryContact.name}</strong>
          {primaryContact.position && <> — <em>{primaryContact.position}</em></>}

          <div style={{ marginTop: "4px" }}>
            {primaryContact.phone && (
              <>
                📞{" "}
                <a href={`tel:${primaryContact.phone}`}>{primaryContact.phone}</a>
                <button
                  onClick={() => copyToClipboard(primaryContact.phone)}
                  title="Скопіювати телефон"
                  style={{ marginLeft: "6px" }}
                >
                  📋
                </button>
              </>
            )}
          </div>

          <div>
            {primaryContact.email && (
              <>
                ✉️{" "}
                <a href={`mailto:${primaryContact.email}`}>{primaryContact.email}</a>
                <button
                  onClick={() => copyToClipboard(primaryContact.email)}
                  title="Скопіювати email"
                  style={{ marginLeft: "6px" }}
                >
                  📋
                </button>
              </>
            )}
          </div>

          <div>
            {primaryContact.telegram && (
              <>
                ✈️{" "}
                <a
                  href={`https://t.me/${primaryContact.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {primaryContact.telegram}
                </a>
              </>
            )}
          </div>

          <div>
            🎂 {formatDate(primaryContact.birthday)}
          </div>

          <button
            onClick={() => startEdit(primaryContact)}
            title="Редагувати"
            style={{ marginTop: "4px" }}
          >
            ✏️
          </button>
        </div>
      )}

      {/* 🔽 КНОПКА "ЩЕ N КОНТАКТІВ" */}
      {otherContacts.length > 0 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            padding: 0
          }}
        >
          ▸ ще {otherContacts.length} контакт{otherContacts.length > 1 ? "и" : ""}
        </button>
      )}

      {/* 🔼 РОЗГОРНУТІ КОНТАКТИ */}
      {expanded && (
        <>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
            {otherContacts.map((c) => (
              <li key={c.id} style={{ marginBottom: "8px" }}>
                <strong>{c.name}</strong>
                {c.position && <> — <em>{c.position}</em></>}

                <div>
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

                {c.note && (
                  <div style={{ marginTop: "4px", fontStyle: "italic", color: "#555" }}>
                    📝 {c.note}
                  </div>
                )}


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

          <button
            onClick={() => setExpanded(false)}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              padding: 0
            }}
          >
            ▾ згорнути
          </button>
        </>
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
          <textarea
            name="note"
            placeholder="Примітка (внутрішня)"
            value={formData.note}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", marginTop: "6px" }}
          />


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
