import logo from "/logo.svg";

export const Header = () => (
  <div className="flex border-b bg-neutral-50 p-3">
    <img
      src={logo}
      className="h-7 relative l-[1px] select-none"
      alt="Notation Logo"
    />
  </div>
);
