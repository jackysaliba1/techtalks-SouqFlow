const colors: Record<string, string> = {
    DRAFT: "bg-gray-200 text-gray-700",
    ACCEPTED: "bg-green-100 text-green-700",
    UNPAID: "bg-yellow-100 text-yellow-700",
    PAID: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
                colors[status] ?? "bg-blue-100 text-blue-700"
            }`}
        >
            {status}
        </span>
    );
}