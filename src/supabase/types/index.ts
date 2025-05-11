import type { Database } from "./Database"

type Category = Database["public"]["Tables"]["category"]["Row"]
type Post = Database["public"]["Tables"]["post"]["Row"]
type Banner = Database["public"]["Tables"]["banner"]["Row"]
interface CategoryWithChildren extends Category {
    children?: Category[]
}

export type {
    Category,
    Post,
    Banner,
    CategoryWithChildren
}