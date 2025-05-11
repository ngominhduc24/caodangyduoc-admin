import { useBanners } from "@/hooks/useBanners"
import { Button } from "../../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { useForm } from "react-hook-form"
import { uploadImage } from "@/lib/cloudinary"
import { toast } from "sonner"
import { useApp } from "../../context/AppProvider"
import BannerServices from "@/supabase/services/BannerServices"

interface FormSchema {
    id: number | null
    image: string
    link: string
}

function Banner() {
    const { banners, refresh } = useBanners()
    const { loading, setLoading } = useApp()

    const form = useForm<FormSchema>({
        defaultValues: {
            id: null,
            image: "",
            link: "",
        },
    })

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        const file = e.target.files?.[0]
        if (!file) return
        toast.promise(
            uploadImage(file).then((res) => {
                form.setValue("image", res)
                toast.success("Tải ảnh lên thành công")
                setLoading(false)
            }),
            {
                loading: "Đang tải ảnh lên...",
                success: "Tải ảnh lên thành công",
                error: (err) => `Error: ${err.message}`,
            },
        )
    }

    const handleSubmit = async (data: any) => {
        setLoading(true)
        const { image, link } = data
        if (!image) {
            toast.error("Vui lòng tải lên ảnh")
            setLoading(false)
            return
        }
        toast.promise(
            BannerServices.create({ image, link }).then(() => {
                form.reset()
                toast.success("Thêm banner thành công")
                setLoading(false)
                refresh()
            }),
            {
                loading: "Đang thêm banner...",
                success: "Thêm banner thành công",
                error: (err) => `Error: ${err.message}`,
            },
        )
    }

    const handleUpdate = async (id: number, image: string, link: string) => {
        setLoading(true)
        if (!image) {
            toast.error("Vui lòng tải lên ảnh")
            setLoading(false)
            return
        }
        toast.promise(
            BannerServices.update({ id, image, link }).then(() => {
                toast.success("Cập nhật banner thành công")
                setLoading(false)
                refresh()
            }),
            {
                loading: "Đang cập nhật banner...",
                success: "Cập nhật banner thành công",
                error: (err) => `Error: ${err.message}`,
            },
        )
    }

    if (!banners) return null
    return (
        <div className="max-w-5xl min-h-screen px-5 container">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Banner</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            form.reset()
                        }}>Thêm banner</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Thêm banner</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="image" className="text-right">
                                        Hình ảnh
                                    </Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        onChange={handleUploadImage}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="link" className="text-right">
                                        Liên kết
                                    </Label>
                                    <Input
                                        id="link"
                                        placeholder="https://example.com"
                                        className="col-span-3"
                                        {...form.register("link")}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button disabled={loading} type="submit">Thêm</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-2">
                {banners.map((banner) => (
                    <div className="space-y-2">
                        <div className="w-full h-40 md:h-52 lg:h-60 xl:h-72 overflow-hidden rounded-lg cursor-pointer">
                            <img
                                src={banner.image}
                                alt="Banner"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={"outline"} className="w-full" onClick={() => {
                                    form.setValue("id", banner.id)
                                    form.setValue("image", banner.image)
                                    form.setValue("link", banner.link || "")
                                }}>Chỉnh sửa</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Chỉnh sửa banner
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <input hidden type="text" value={banner.id} {...form.register("id")} />
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="image" className="text-right">
                                                Hình ảnh
                                            </Label>
                                            <Input
                                                id="image"
                                                type="file"
                                                onChange={handleUploadImage}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="link" className="text-right">
                                                Liên kết
                                            </Label>
                                            <Input
                                                id="link"
                                                placeholder="https://example.com"
                                                className="col-span-3"
                                                {...form.register("link")}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button disabled={loading} type="button" onClick={() => {
                                            handleUpdate(banner.id, form.getValues("image") || banner.image, form.getValues("link"))
                                        }}>Update</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Banner
