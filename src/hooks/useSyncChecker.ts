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

export default function useChecker() {
  const [domain, setDomain] = useState<string>("");
  const [data, setData] = useState<Data[]>([]);

  async function fetchData(domain: string) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("apikey", "gHq856gDHB7bZwXvYUb0AhFa785kldfS");

      const requestOptions = {
        method: "GET",
        redirect: "follow" as RequestRedirect,
        headers: myHeaders,
      };
      const res = (await (
        await fetch(
          `https://api.apilayer.com/whois/check?domain=${domain}`,
          requestOptions
        )
      ).json()) as unknown as Data;
      console.log("hello");
      if (domain.endsWith(".com")) {
        setData([{ ...res, domain }]);
      }
      return { ...res, domain };
    } catch (error) {
      console.log(error);
    }
  }

  function setUnique(item: Data, index: number, self: Data[]) {
    return self.findIndex(({ domain }) => domain === item.domain) === index;
  }

  async function checkDomain() {
    setData([]);
    await fetchData(domain + extensions[0]);
    const res = (await Promise.allSettled([
      await fetchData(domain + extensions[1]),
      await fetchData(domain + extensions[2]),
      await fetchData(domain + extensions[3]),
      await fetchData(domain + extensions[4]),
      await fetchData(domain + extensions[5]),
      await fetchData(domain + extensions[6]),
      await fetchData(domain + extensions[7]),
    ])) as { value: Data }[];
    setData((prev) => [
      ...prev,
      ...res.map(({ value }) => value).filter(setUnique),
    ]);
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
