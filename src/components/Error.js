export default function Error({ error }) {
  const { message } = error;
  return <p className="error">Error: 🛑 {message}</p>;
}
