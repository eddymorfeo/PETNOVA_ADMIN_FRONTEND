export default function DashboardPage() {
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
        Hola mundo
      </h1>
      <p className="mt-3 text-sm leading-7 text-slate-500">
        El login administrativo fue exitoso y el usuario autenticado ya está dentro
        del layout privado con sidebar.
      </p>
    </div>
  );
}