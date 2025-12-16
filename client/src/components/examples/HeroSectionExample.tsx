import HeroSection from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <HeroSection
      onConnectWallet={() => console.log("Connect wallet clicked")}
      isConnecting={false}
    />
  );
}
