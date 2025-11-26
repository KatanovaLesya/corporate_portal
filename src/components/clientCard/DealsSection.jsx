import PropTypes from "prop-types";

export default function DealsSection({ client }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Deals Section</h3>
      {client?.deals?.length ? (
        <ul>
          {client.deals.map((d) => (
            <li key={d.id}>{d.title} — {d.amount} {d.currency}</li>
          ))}
        </ul>
      ) : (
        <p>Немає угод</p>
      )}
    </div>
  );
}

// ✅ Типізація пропсів
DealsSection.propTypes = {
  client: PropTypes.shape({
    deals: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        currency: PropTypes.string,
        status: PropTypes.string,
      })
    ),
  }),
};
