import Link from "next/link";
import AcmeLogo from "@/app/ui/acme-logo";

export default function Header() {
  return (
    <div className="flex flex-row px-3 py-4 md:px-2 bg-blue-600">
      <Link
        className="flex h-30 items-end justify-start rounded-md bg-blue-600 p-4"
        href="#"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
    </div>
  );
}
