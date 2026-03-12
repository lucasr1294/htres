import { redirect } from "next/navigation";

// Redirige al dashboard si el usuario está autenticado,
// o al login si no lo está
export default function HomePage() {
  redirect("/dashboard");
}
