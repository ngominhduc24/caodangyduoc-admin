import type { Database } from "./Database"

type Category = Database["public"]["Tables"]["category"]["Row"]
type Post = Database["public"]["Tables"]["post"]["Row"]
interface CategoryWithChildren extends Category {
    children?: Category[]
}

export type {
    Category,
    Post,
    CategoryWithChildren
}