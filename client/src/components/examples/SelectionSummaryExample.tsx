import SelectionSummary from "../SelectionSummary";

export default function SelectionSummaryExample() {
  return (
    <SelectionSummary
      selectedCount={5}
      maxSelection={10}
      discountPercent={15}
      onContinue={() => console.log("Continue clicked")}
    />
  );
}
