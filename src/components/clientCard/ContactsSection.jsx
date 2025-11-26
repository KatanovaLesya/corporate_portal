import PropTypes from "prop-types";

export default function ContactsSection({ client }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Contacts Section</h3>
      {client?.contacts?.length ? (
        <ul>
          {client.contacts.map((c) => (
            <li key={c.id}>{c.name} — {c.phone}</li>
          ))}
        </ul>
      ) : (
        <p>Контакти відсутні</p>
      )}
    </div>
  );
}

// ✅ Типізація пропсів
ContactsSection.propTypes = {
  client: PropTypes.shape({
    contacts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        phone: PropTypes.string,
      })
    ),
  }),
};
