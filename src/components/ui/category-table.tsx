import type { Category, CategoryWithChildren } from "@/supabase/types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Link } from "react-router-dom";
import { Button } from "./button";
import { Delete, Link2 } from "lucide-react";

interface CategoryTableProps {
    categories: Category[] | CategoryWithChildren[] | null | undefined;
    handleDeleteCategory?: (id: string) => void;
}

function CategoryTable({ categories, handleDeleteCategory }: CategoryTableProps) {

    return (
        <Table className="mt-5 w-full">
            {
                categories?.length === 0 && (
                    <TableCaption>Không có danh mục nào.</TableCaption>
                )
            }
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">STT</TableHead>
                    <TableHead>Tên Danh mục</TableHead>
                    <TableHead className="text-right hidden">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    categories?.map((category, index) => (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Link to={`/category/update/${category.id}`}>
                                    <Button variant="outline">
                                        <Link2 />
                                    </Button>
                                </Link>
                                {
                                    handleDeleteCategory && (
                                        <Button variant="outline" onClick={() => handleDeleteCategory(category.id)}>
                                            <Delete />
                                        </Button>
                                    )
                                }
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

export default CategoryTable
