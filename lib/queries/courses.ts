// lib/queries/courses.ts
import { supabase } from "@/lib/supabaseClient";

export async function getCourseById(id: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching course:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateCourse(id: string, updates: any) {
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating course:", error);
    throw new Error(error.message);
  }

  return data;
}
