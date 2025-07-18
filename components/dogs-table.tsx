"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Dog {
  id: number;
  created_at: string;
  name: string;
  breed: string | null;
  color: string | null;
}

export function DogsTable() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("dogs")
          .select("*")
          .order("id");

        if (error) {
          throw error;
        }

        setDogs(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dogs");
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  if (loading) {
    return <div className="p-4">Loading dogs...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (dogs.length === 0) {
    return <div className="p-4">No dogs found in the database.</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-foreground/10">
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Breed</th>
            <th className="text-left p-4">Color</th>
            <th className="text-left p-4">Created At</th>
          </tr>
        </thead>
        <tbody>
          {dogs.map((dog) => (
            <tr key={dog.id} className="border-b border-foreground/10">
              <td className="p-4">{dog.id}</td>
              <td className="p-4">{dog.name}</td>
              <td className="p-4">{dog.breed || "-"}</td>
              <td className="p-4">{dog.color || "-"}</td>
              <td className="p-4">
                {new Date(dog.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}