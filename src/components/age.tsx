"use client";

import { useEffect, useState } from "react";
import { ageFromBirthDate } from "@/lib/age";

export function Age({ initialAge }: { initialAge: number }) {
  const [age, setAge] = useState(initialAge);

  useEffect(() => {
    setAge(ageFromBirthDate());
  }, []);

  return <span>{age}</span>;
}
