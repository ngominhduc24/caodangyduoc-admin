import type { Database } from "./Database";

type Category = Database["public"]["Tables"]["category"]["Row"];
type Post = Database["public"]["Tables"]["post"]["Row"];
type Banner = Database["public"]["Tables"]["banner"]["Row"];
interface CategoryWithChildren extends Category {
  children?: Category[];
}
type Partner = Database["public"]["Tables"]["partner"]["Row"];

export type { Category, Post, Banner, CategoryWithChildren, Partner };
