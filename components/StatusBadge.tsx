type Props = {
  status: "Pending" | "Approved" | "Rejected" | "Returned";
};

export default function StatusBadge({ status }: Props) {
  const baseStyles = "px-3 py-1 rounded-full text-sm font-medium";

  const styles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Returned: "bg-blue-100 text-blue-800",
  };

  return (
    <span className={`${baseStyles} ${styles[status]}`}>
      {status}
    </span>
  );
}