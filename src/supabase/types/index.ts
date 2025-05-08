import type { Database } from "./Database"

type Category = Database["public"]["Tables"]["category"]["Row"]
interface CategoryWithChildren extends Category {
    children?: Category[]
}

export type {
    Category,
    CategoryWithChildren
}