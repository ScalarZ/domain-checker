export default function Skeleton() {
  return (
    <div className="absolute inset-0 flex flex-col gap-y-4">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className={`px-4 py-2 bg-white border rounded flex justify-between items-center`}
        >
          <div className="w-2/3 h-7 bg-slate-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
