import ReactSelect from "react-select";
import type { SavedRecipient } from "../../types";

interface RecipientSelectProps {
  recipients: SavedRecipient[];
  onPick: (recipient: SavedRecipient) => void;
}

export const RecipientSelect = ({
  recipients,
  onPick,
}: RecipientSelectProps) => {
  const options = recipients.map((r) => ({
    value: r.id,
    label: `${r.recipient_full_name} — ${r.bank_account}`,
    recipient: r,
  }));

  return (
    <div className="mb-3">
      <label className="form-label">Odaberi sačuvanog primaoca (opciono)</label>
      <ReactSelect
        options={options}
        placeholder="Pretraži primaoce..."
        isClearable
        onChange={(option) => {
          if (option) onPick(option.recipient);
        }}
      />
    </div>
  );
};
