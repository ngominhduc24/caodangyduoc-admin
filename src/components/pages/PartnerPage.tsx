import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { uploadImage } from "@/lib/cloudinary";
import { toast } from "sonner";
import { useApp } from "../context/AppProvider";
import PartnerServices from "@/supabase/services/PartnerServices";
import type { Partner } from "@/supabase/types";

interface FormSchema {
  id: number | null;
  name: string;
  image: string;
}

function PartnerPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const { loading, setLoading } = useApp();
  const form = useForm<FormSchema>({
    defaultValues: {
      id: null,
      name: "",
      image: "",
    },
  });

  const fetchPartners = async () => {
    setLoading(true);
    const { data } = await PartnerServices.getPartners(1, 100);
    setPartners(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;
    toast.promise(
      uploadImage(file).then((res) => {
        form.setValue("image", res);
        toast.success("Tải ảnh lên thành công");
        setLoading(false);
      }),
      {
        loading: "Đang tải ảnh lên...",
        success: "Tải ảnh lên thành công",
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const { name, image } = data;
    if (!name || !image) {
      toast.error("Vui lòng nhập tên và tải lên ảnh");
      setLoading(false);
      return;
    }
    toast.promise(
      PartnerServices.createPartner({ name, image }).then(() => {
        form.reset();
        toast.success("Thêm đối tác thành công");
        setLoading(false);
        fetchPartners();
      }),
      {
        loading: "Đang thêm đối tác...",
        success: "Thêm đối tác thành công",
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  const handleUpdate = async (id: number, name: string, image: string) => {
    setLoading(true);
    if (!name || !image) {
      toast.error("Vui lòng nhập tên và tải lên ảnh");
      setLoading(false);
      return;
    }
    toast.promise(
      PartnerServices.updatePartner(id.toString(), { name, image }).then(() => {
        toast.success("Cập nhật đối tác thành công");
        setLoading(false);
        fetchPartners();
      }),
      {
        loading: "Đang cập nhật đối tác...",
        success: "Cập nhật đối tác thành công",
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đối tác này?")) return;
    setLoading(true);
    toast.promise(
      PartnerServices.deletePartner(id.toString()).then(() => {
        toast.success("Xóa đối tác thành công");
        setLoading(false);
        fetchPartners();
      }),
      {
        loading: "Đang xóa đối tác...",
        success: "Xóa đối tác thành công",
        error: (err) => `Error: ${err.message}`,
      }
    );
  };

  if (!partners) return null;
  return (
    <div className="max-w-5xl min-h-screen px-5 container">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl !font-semibold">Đối tác</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()}>Thêm đối tác</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <DialogHeader>
                <DialogTitle>Thêm đối tác</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên đối tác
                  </Label>
                  <Input
                    id="name"
                    placeholder="Tên đối tác"
                    className="col-span-3"
                    {...form.register("name")}
                  />
                </div>
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
              </div>
              <DialogFooter>
                <Button disabled={loading} type="submit">
                  Thêm
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-2">
        {partners.map((partner) => (
          <div className="space-y-2" key={partner.id}>
            <div className="w-full h-40 md:h-52 lg:h-60 xl:h-72 overflow-hidden rounded-lg cursor-pointer flex items-center justify-center bg-gray-100">
              <img
                src={partner.image}
                alt={partner.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="text-lg font-semibold">{partner.name}</div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full"
                    onClick={() => {
                      form.setValue("id", partner.id);
                      form.setValue("name", partner.name);
                      form.setValue("image", partner.image);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form>
                    <DialogHeader>
                      <DialogTitle>Chỉnh sửa đối tác</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <input
                        hidden
                        type="text"
                        value={partner.id}
                        {...form.register("id")}
                      />
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Tên đối tác
                        </Label>
                        <Input
                          id="name"
                          placeholder="Tên đối tác"
                          className="col-span-3"
                          {...form.register("name")}
                        />
                      </div>
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
                    </div>
                    <DialogFooter>
                      <Button
                        disabled={loading}
                        type="button"
                        onClick={() => {
                          handleUpdate(
                            partner.id,
                            form.getValues("name") || partner.name,
                            form.getValues("image") || partner.image
                          );
                        }}
                      >
                        Update
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              disabled={loading}
              onClick={() => handleDelete(partner.id)}
            >
              Xóa
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnerPage;
