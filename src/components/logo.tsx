// import darkLogo from "@/assets/logos/dark.svg";
// import logo from "@/assets/logos/main.svg";
import Image from "next/image";
import logo from "@/assets/logos/logo.png"
import darkLogo from "@/assets/logos/logo-dark.png";

export function Logo() {
  return (
    <div className="relative h-7 max-w-[10rem]">
      <Image
        src={logo}
        fill
        className="dark:hidden object-contain"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={darkLogo}
        fill
        className="hidden dark:block object-contain"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
