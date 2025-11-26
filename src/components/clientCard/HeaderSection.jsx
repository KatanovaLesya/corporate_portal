import PropTypes from "prop-types";

export default function HeaderSection({ clients, selectedClientId, setSelectedClientId, clientData }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Header Section</h3>
      <select
        value={selectedClientId}
        onChange={(e) => setSelectedClientId(e.target.value)}
        style={{ padding: "8px", borderRadius: "8px" }}
      >
        <option value="">— Оберіть клієнта —</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {clientData && (
        <div style={{ marginTop: "10px", background: "#f7f7f7", padding: "10px", borderRadius: "6px" }}>
          <p><strong>Назва:</strong> {clientData.name}</p>
          <p><strong>ЄДРПОУ:</strong> {clientData.edrpou}</p>
        </div>
      )}
    </div>
  );
}

HeaderSection.propTypes = {
  clients: PropTypes.array.isRequired,
  selectedClientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setSelectedClientId: PropTypes.func.isRequired,
  clientData: PropTypes.object,
};
