import TransactionModal from "../TransactionModal";

export default function TransactionModalExample() {
  return (
    <TransactionModal
      isOpen={true}
      status="signing"
      onCancel={() => console.log("Cancel clicked")}
      onRetry={() => console.log("Retry clicked")}
    />
  );
}
