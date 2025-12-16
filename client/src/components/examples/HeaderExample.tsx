import Header from "../Header";

export default function HeaderExample() {
  return (
    <Header
      walletAddress="J6wu13dKzy2PU7qQbmxkjauf8NtysUMfmVSdN36V95Mx"
      onConnectWallet={() => console.log("Connect wallet clicked")}
      onDisconnectWallet={() => console.log("Disconnect wallet clicked")}
    />
  );
}
