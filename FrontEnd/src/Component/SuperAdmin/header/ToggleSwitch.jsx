export default function ToggleSwitch({ enabled, setEnabled }) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative w-11 h-6 rounded-full transition ${
        enabled ? "bg-indigo-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
          enabled ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
