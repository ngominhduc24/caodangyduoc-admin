import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CalendarIcon } from 'lucide-react'
import { Link } from "react-router-dom"
import { Badge } from "./badge"
import type { Post } from "@/supabase/types"

interface PostCardProps {
    post: Post
}

export default function PostCard({ post }: PostCardProps) {
    // Format the date
    const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    if (!post) return null

    return (
        <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md py-0">
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={post.thumbnail || "/placeholder.svg"}
                    alt={post.title}
                    className="object-cover transition-transform hover:scale-105"
                />
            </div>
            <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formattedDate}</span>
                </div>
                <Link to={`/post/edit/${post.id}`} className="hover:underline">
                    <h3 className="font-semibold text-lg line-clamp-2">{post.title}</h3>
                </Link>
            </CardHeader>
            <CardContent className="pt-0 flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-3">
                    {post.description || "No description available"}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                {
                    Array.isArray(post.tags) && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Badge key={String(tag)} variant="outline" className="text-xs border-orange-500">
                                    {String(tag)}
                                </Badge>
                            ))}
                        </div>
                    )
                }
            </CardFooter>
        </Card>
    )
}
