// export const formatDate=(arg)=> {
//       if (!arg) return "- - -";
//       let splitdate = arg.split("T")[0];
//       const [year, month, day] = splitdate.split("-");
//       return `${day}-${month}-${year}`;
//     }

export const formatDate = (arg) => {
  if (!arg) return "- - -";

  // If it's already a Date object
  if (arg instanceof Date) {
    const day = String(arg.getDate()).padStart(2, "0");
    const month = String(arg.getMonth() + 1).padStart(2, "0");
    const year = arg.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // If it's a number (timestamp)
  if (typeof arg === "number") {
    const d = new Date(arg);
    if (isNaN(d)) return "- - -";
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  }

  // If it's not a string → stop safely
  if (typeof arg !== "string") return "- - -";

  // Handle ISO string: 2024-01-15T10:20:30Z
  if (arg.includes("T")) {
    arg = arg.split("T")[0];
  }

  const parts = arg.split("-");
  if (parts.length !== 3) return "- - -";

  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};
