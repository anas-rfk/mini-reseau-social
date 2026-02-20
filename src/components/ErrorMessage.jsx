function ErrorMessage({ message }) {
  return (
    <div
      style={{
        background: "#f8d7da",
        color: "#721c24",
        padding: "10px",
        borderRadius: 6,
        marginBottom: 16,
      }}
    >
      {message}
    </div>
  );
}

export default ErrorMessage;