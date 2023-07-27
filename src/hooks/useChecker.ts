import { useState, useEffect } from "react";

interface Data {
  domain: string;
  result: "registered" | "available" | "error" | null;
}

interface ErrorRes {
  domain: string;
  result: "error";
  message: string;
}

const isError = (error: unknown): error is ErrorRes =>
  !!error && typeof error === "object" && "message" in error;

const extensions = [
  ".com",
  ".org",
  ".co",
  ".net",
  ".info",
  ".us",
  ".eu",
  ".blog",
];

const timeout = {
  c1: new AbortController(),
  c2: new AbortController(),
  c3: new AbortController(),
  c4: new AbortController(),
  c5: new AbortController(),
  c6: new AbortController(),
  c7: new AbortController(),
  c8: new AbortController(),
};
export default function useChecker() {
  const [domain, setDomain] = useState<string>("");
  const [data, setData] = useState<Data[]>([]);

  async function fetchData(domain: string, c: keyof typeof timeout) {
    // const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      timeout[c].abort();
    }, 5000);
    try {
      const myHeaders = new Headers();
      myHeaders.append("apikey", "95quF0aVJAEqn8Gfxc0CselXfYFOyX8e");
      const requestOptions = {
        method: "GET",
        redirect: "follow" as RequestRedirect,
        headers: myHeaders,
      };

      const res = (await (
        await fetch(`https://api.apilayer.com/whois/check?domain=${domain}`, {
          signal: timeout[c].signal,
          ...requestOptions,
        })
      ).json()) as unknown as Data;
      return { ...res, domain };
    } catch (error: any) {
      return { result: "error", domain };
    } finally {
      console.log(domain);
      clearTimeout(timeoutId);
    }
  }

  function setUnique(item: Data, index: number, self: Data[]) {
    return self.findIndex(({ domain }) => domain === item.domain) === index;
  }

  async function checkDomain() {
    setData([]);
    const res = (await Promise.all(
      extensions.map((extension, i) =>
        fetchData(
          domain + extension,
          ("c" + (i + 1)) as
            | "c1"
            | "c2"
            | "c3"
            | "c4"
            | "c5"
            | "c6"
            | "c7"
            | "c8"
        )
      )
    )) as Data[];
    console.log(res);
    setData(res);
  }

  useEffect(() => {
    if (!!domain) checkDomain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  return {
    setDomain,
    data,
    reset: () => setData([]),
  };
}
