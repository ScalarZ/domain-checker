import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Inter } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useChecker from "@/hooks/useChecker";
import { useDebounce } from "@/hooks/useDebounce";
import { CheckCircle2, XCircle, Heart, Trash } from "lucide-react";
import Skeleton from "@/components/Skeleton";
import { ModeToggle } from "@/components/ModeToggle";
import SideBar from "@/components/SideBar";
import { Data } from "@/types";
import Domain from "@/components/Domain";

const inter = Inter({ subsets: ["latin"] });
const STORAGE_KEY = "saved-domains";

export default function Home() {
  const [value, setValue] = useState<string>("");
  const [savedDomains, setSavedDomains] = useState<Data[]>([]);
  const { data, setDomain, reset } = useChecker();
  const debouncedValue = useDebounce<string>(value, 2000);

  type FetchResult = { data: any } | { error: any };

  useEffect(() => {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      const domains = JSON.parse(item) as Data[];
      setSavedDomains(domains);
    }
  }, []);

  useEffect(() => {
    if (debouncedValue) setDomain(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  return (
    <main
      className={`px-8 py-8 min-h-screen text-slate-950 ${inter.className}`}
    >
      <header className="mx-auto max-w-4xl">
        <div className="mb-8 w-full flex justify-between items-center">
          <h1 className="text-2xl text-center font-semibold dark:text-slate-100">
            Domain Checker 🚀
          </h1>
          <div className="flex items-center gap-x-2">
            <SideBar
              savedDomains={savedDomains}
              setSavedDomains={setSavedDomains}
            />
            <ModeToggle />
          </div>
        </div>
        <div className="flex gap-x-2">
          <Input
            placeholder="Type here..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            className="dark:text-white"
          />
        </div>
      </header>
      <h2
        className={`mt-8 text-3xl text-center ${
          data[0]
            ? data[0].result === "available"
              ? "text-green-500"
              : "text-red-500"
            : "text-slate-500 dark:text-slate-300"
        } font-bold`}
      >
        {value ? value + ".com" : null}
      </h2>
      <div className="relative mx-auto mt-8 h-44 max-w-2xl flex flex-col gap-y-4">
        {!value || data.length ? (
          data.map(({ domain, result }, i) => {
            return (
              <Domain key={i} domain={domain} result={result}>
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
              </Domain>
            );
          })
        ) : (
          <Skeleton />
        )}
      </div>
    </main>
  );
}
