import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Data } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { CheckCircle2, Trash, XCircle } from "lucide-react";
import Domain from "./Domain";

const STORAGE_KEY = "saved-domains";

export default function SideBar({
  savedDomains,
  setSavedDomains,
}: {
  savedDomains: Data[];
  setSavedDomains: Dispatch<SetStateAction<Data[]>>;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild className="dark:text-slate-100">
        <Button variant="outline">
          Saved domains{" "}
          <span className="ml-4 px-2 py-1 rounded bg-slate-950 text-xs text-white dark:bg-slate-50 dark:text-black">
            {savedDomains.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Saved domains</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-y-2">
          {savedDomains.map(({ result, domain }, i) => (
            <Domain key={i} domain={domain} result={result}>
              <Trash
                className={`cursor-pointer hover:text-red-500`}
                onClick={() => {
                  setSavedDomains((prev) =>
                    prev.filter(({ domain: d }) => d !== domain)
                  );
                  localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                      savedDomains.filter(({ domain: d }) => d !== domain)
                    )
                  );
                }}
              />
            </Domain>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
