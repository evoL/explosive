import explosive from "./explosive";

if (typeof window !== "undefined" && typeof window.explosive === "undefined") {
  window.explosive = explosive;
}
