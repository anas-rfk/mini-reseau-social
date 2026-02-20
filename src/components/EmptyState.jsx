import { Link } from "react-router-dom";

function EmptyState({
  title = "Rien à afficher",
  description = "",
  actionLabel = "",
  actionTo = "",
}) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px dashed #bbb",
        borderRadius: 10,
        textAlign: "center",
        marginTop: 16,
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>

      {description && (
        <p style={{ marginTop: 8, color: "#555" }}>{description}</p>
      )}

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          style={{
            display: "inline-block",
            marginTop: 12,
            padding: "8px 12px",
            borderRadius: 8,
            background: "#0d6efd",
            color: "white",
            textDecoration: "none",
          }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;