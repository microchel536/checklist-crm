import Link from "next/link";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteChecklist } from "@/app/lib/actions";

export async function CreateButton() {
  return (
    <Link
      href="/checklist/create"
      className="flex h-10 items-center border-2 border-blue-600 rounded-lg px-4 text-sm font-medium hover:text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Создать чеклист</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export async function UpdateButton({ id }: { id: string }) {
  return (
    <Link href={`/checklist/${id}/edit`} className="rounded-md border p-2">
      <PencilIcon className="w-5" />
    </Link>
  );
}

export async function DeleteButton({ id }: { id: string }) {
  async function handleDeleteInvoice() {
    "use server";
    await deleteChecklist(id);
  }

  return (
    <form action={handleDeleteInvoice}>
      <button type="submit" className="rounded-md border p-2">
        <span className="sr-only">Удалить</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
