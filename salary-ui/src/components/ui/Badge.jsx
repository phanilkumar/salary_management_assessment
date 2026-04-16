const STYLES = {
  full_time: "bg-green-100 text-green-700",
  part_time: "bg-yellow-100 text-yellow-700",
  contract:  "bg-purple-100 text-purple-700",
};

const LABELS = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract:  "Contract",
};

export default function Badge({ value }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        STYLES[value] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {LABELS[value] ?? value}
    </span>
  );
}
