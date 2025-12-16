import ConfirmationScreen from "../ConfirmationScreen";
import { Toaster } from "@/components/ui/toaster";

export default function ConfirmationScreenExample() {
  return (
    <>
      <ConfirmationScreen
        txSignature="5wHu1qwD7HXiQ7NTBZPy6RVYJYmBqKYFnJ8RbLpKQqEpN7MkHNqCXmv9kgYvJZ3xgfNqYpUWJSGJ5QkPvYQPZ1Hk"
        burnCount={5}
        discountPercent={15}
        codeStatus="pending"
        onBurnMore={() => console.log("Burn more clicked")}
        onCheckStatus={() => console.log("Check status clicked")}
      />
      <Toaster />
    </>
  );
}
