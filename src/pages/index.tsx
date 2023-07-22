import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Inter } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useChecker from "@/hooks/useChecker";
import { useDebounce } from "@/hooks/useDebounce";
import { CheckCircle2, XCircle, Heart, Trash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Skeleton from "@/components/Skeleton";

interface Data {
  domain: string;
  result: "registered" | "available" | "error" | null;
}

const inter = Inter({ subsets: ["latin"] });
const STORAGE_KEY = "saved-domains";
export default function Home() {
  const [value, setValue] = useState<string>("");
  const [savedDomains, setSavedDomains] = useState<Data[]>([]);
  const { data, setDomain, reset } = useChecker();
  const debouncedValue = useDebounce<string>(value, 2000);

  useEffect(() => {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      const domains = JSON.parse(item) as Data[];
      setSavedDomains(domains);
    }
  }, []);

  useEffect(() => {
    const validUrlRegex = /^[\w.-]+\.(?:com|net|org|co|info|us|eu|blog)$/;
    const startsWithHttpRegex = /^https?:\/\//;
    setDomain(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  return (
    <main
      className={`px-8 py-8 min-h-screen text-slate-950 ${inter.className}`}
    >
      <header className="mx-auto max-w-4xl">
        <div className="mb-8 w-full flex justify-between items-center">
          <h1 className="text-2xl text-center font-semibold">
            Domain Checker 🚀
          </h1>
          <SheetDemo
            savedDomains={savedDomains}
            setSavedDomains={setSavedDomains}
          />
        </div>

        <div className="flex gap-x-2">
          <Input
            placeholder="Type here..."
            value={value}
            onChange={(e) => {
              reset();
              setValue(e.target.value);
            }}
          />
          {/* <Button>Search</Button> */}
        </div>
      </header>
      <h2
        className={`mt-8 text-3xl text-center ${
          data[0]
            ? data[0].result === "available"
              ? "text-green-500"
              : "text-red-500"
            : "text-slate-500"
        } font-bold`}
      >
        {value ? value + ".com" : null}
      </h2>
      <div className="relative mx-auto mt-8 h-44 max-w-2xl flex flex-col gap-y-4">
        {!!value && <Skeleton />}
        {value &&
          data.map(({ domain, result }, i) => {
            if (i === 0) return;
            return (
              <div
                key={i}
                className={`relative px-4 py-2 w-full bg-white border shadow-md shadow-slate-200 rounded flex justify-between items-center z-20`}
              >
                <p className="text-lg">{domain}</p>
                <div className="flex items-center gap-x-1">
                  <div
                    className={`${
                      result === "available" ? "text-green-500" : "text-red-600"
                    }`}
                  >
                    {result === "available" ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                  </div>
                  <Heart
                    className={`cursor-pointer hover:fill-red-500 hover:text-red-500 ${
                      savedDomains.some(({ domain: d }) => d === domain) &&
                      "fill-red-500 text-red-500"
                    }`}
                    onClick={() => {
                      const newDomain = { result, domain };
                      setSavedDomains((prev) => [...prev, newDomain]);
                      localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify([...savedDomains, newDomain])
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}

function SheetDemo({
  savedDomains,
  setSavedDomains,
}: {
  savedDomains: Data[];
  setSavedDomains: Dispatch<SetStateAction<Data[]>>;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          Saved domains{" "}
          <span className="ml-4 px-2 py-1 rounded bg-slate-950 text-xs text-white">
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
            <div
              key={i}
              className={`relative px-4 py-2 bg-white border shadow-md shadow-slate-200 rounded flex justify-between items-center z-20`}
            >
              <p className="text-lg">{domain}</p>
              <div className="flex items-center gap-x-1">
                <div
                  className={`${
                    result === "available" ? "text-green-500" : "text-red-600"
                  }`}
                >
                  {result === "available" ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                </div>
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
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
