import { useEffect, useState } from "react";
import ApplicationFormServices from "@/supabase/services/ApplicationFormServices";
// shadcn table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useApp } from "../context/AppProvider";
import { toast } from "sonner";

type ApplicationFormType = {
  id: number;
  full_name: string;
  dob: string;
  phone: string;
  address: string;
  education: string;
  register_location: string;
  register_major: string;
  note: string | null;
  created_at: string;
  status: "unread" | "read" | "processing" | "accepted" | "rejected";
};

const PAGE_SIZE = 15;

function ApplicationForm() {
  const [forms, setForms] = useState<ApplicationFormType[]>([]);
  const { setLoading } = useApp();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchPhone, setSearchPhone] = useState("");
  const [debouncedSearchPhone, setDebouncedSearchPhone] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedStatusFilter, setDebouncedStatusFilter] = useState("");

  // Additional filters for each column
  const [searchName, setSearchName] = useState("");
  const [debouncedSearchName, setDebouncedSearchName] = useState("");
  const [searchDob, setSearchDob] = useState("");
  const [debouncedSearchDob, setDebouncedSearchDob] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [debouncedSearchAddress, setDebouncedSearchAddress] = useState("");
  const [searchEducation, setSearchEducation] = useState("");
  const [debouncedSearchEducation, setDebouncedSearchEducation] = useState("");
  const [searchRegisterLocation, setSearchRegisterLocation] = useState("");
  const [debouncedSearchRegisterLocation, setDebouncedSearchRegisterLocation] =
    useState("");
  const [searchRegisterMajor, setSearchRegisterMajor] = useState("");
  const [debouncedSearchRegisterMajor, setDebouncedSearchRegisterMajor] =
    useState("");
  const [searchNote, setSearchNote] = useState("");
  const [debouncedSearchNote, setDebouncedSearchNote] = useState("");

  // Debounce all filters
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchPhone(searchPhone), 400);
    return () => clearTimeout(handler);
  }, [searchPhone]);
  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedStatusFilter(statusFilter),
      400
    );
    return () => clearTimeout(handler);
  }, [statusFilter]);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchName(searchName), 400);
    return () => clearTimeout(handler);
  }, [searchName]);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchDob(searchDob), 400);
    return () => clearTimeout(handler);
  }, [searchDob]);
  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedSearchAddress(searchAddress),
      400
    );
    return () => clearTimeout(handler);
  }, [searchAddress]);
  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedSearchEducation(searchEducation),
      400
    );
    return () => clearTimeout(handler);
  }, [searchEducation]);
  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedSearchRegisterLocation(searchRegisterLocation),
      400
    );
    return () => clearTimeout(handler);
  }, [searchRegisterLocation]);
  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedSearchRegisterMajor(searchRegisterMajor),
      400
    );
    return () => clearTimeout(handler);
  }, [searchRegisterMajor]);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchNote(searchNote), 400);
    return () => clearTimeout(handler);
  }, [searchNote]);

  useEffect(() => {
    let ignore = false;
    toast.promise(
      async () => {
        setLoading(true);
        const { data, count } =
          await ApplicationFormServices.getApplicationForms(
            page,
            PAGE_SIZE,
            debouncedSearchPhone,
            debouncedStatusFilter,
            debouncedSearchName,
            debouncedSearchDob,
            debouncedSearchAddress,
            debouncedSearchEducation,
            debouncedSearchRegisterLocation,
            debouncedSearchRegisterMajor,
            debouncedSearchNote
          );
        if (!ignore) {
          setForms(data || []);
          setTotalCount(count || 0);
        }
        setLoading(false);
      },
      {
        loading: "Đang tải danh sách đơn đăng ký...",
        success: "Tải danh sách thành công",
        error: "Đã có lỗi xảy ra khi tải danh sách",
      }
    );
    return () => {
      ignore = true;
    };
  }, [
    page,
    debouncedSearchPhone,
    debouncedStatusFilter,
    debouncedSearchName,
    debouncedSearchDob,
    debouncedSearchAddress,
    debouncedSearchEducation,
    debouncedSearchRegisterLocation,
    debouncedSearchRegisterMajor,
    debouncedSearchNote,
  ]);

  const handleStatusChange = async (
    id: number,
    status: ApplicationFormType["status"]
  ) => {
    setLoading(true);
    toast.promise(
      ApplicationFormServices.updateApplicationFormStatus(id, status),
      {
        loading: "Đang cập nhật trạng thái...",
        success: () => {
          setForms((prev) =>
            prev.map((form) => (form.id === id ? { ...form, status } : form))
          );
          return "Cập nhật trạng thái thành công";
        },
        error: "Đã có lỗi xảy ra khi cập nhật trạng thái",
      }
    );
    setLoading(false);
  };

  // Map status to badge color
  const statusBadgeColor: Record<ApplicationFormType["status"], string> = {
    unread: "bg-gray-300 text-gray-800",
    read: "bg-blue-200 text-blue-800",
    processing: "bg-yellow-200 text-yellow-800",
    accepted: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800",
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Function to generate pagination numbers
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Số trang hiển thị tối đa

    if (totalPages <= maxVisible) {
      // Hiển thị tất cả trang nếu số trang ít
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic phân trang phức tạp
      if (page <= 3) {
        // Gần đầu
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Gần cuối
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="max-w-5xl px-5">
      <h1 className="text-xl !font-semibold mb-4">Quản lý Đơn đăng ký</h1>

      {/* Status-color relationship note */}
      <div className="mb-2 text-sm text-gray-600 flex flex-wrap gap-3 items-center">
        <span className="font-medium">Màu ngày tạo theo trạng thái:</span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded bg-gray-300 border border-gray-400"></span>{" "}
          Chưa đọc
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded bg-blue-200 border border-blue-400"></span>{" "}
          Đã đọc
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded bg-yellow-200 border border-yellow-400"></span>{" "}
          Đang xử lý
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded bg-green-200 border border-green-400"></span>{" "}
          Đã duyệt
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded bg-red-200 border border-red-400"></span>{" "}
          Từ chối
        </span>
      </div>

      {/* All column filters */}
      <div className="mb-2 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Họ tên"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1 w-40"
        />
        <input
          type="date"
          placeholder="Ngày sinh"
          value={searchDob}
          onChange={(e) => {
            setSearchDob(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1 w-36"
        />
        <input
          type="text"
          placeholder="SĐT"
          value={searchPhone}
          onChange={(e) => {
            setSearchPhone(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1 w-32"
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={searchAddress}
          onChange={(e) => {
            setSearchAddress(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1 w-40"
        />
        {/* Trình độ select */}
        <select
          value={searchEducation}
          onChange={(e) => {
            setSearchEducation(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1 w-40"
        >
          <option value="">Tất cả trình độ</option>
          <option value="Đang là học sinh lớp 11">
            Đang là học sinh lớp 11
          </option>
          <option value="Đang là học sinh lớp 12">
            Đang là học sinh lớp 12
          </option>
        </select>
        {/* Nơi đăng ký select */}
        <select
          value={searchRegisterLocation}
          onChange={(e) => {
            setSearchRegisterLocation(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1 w-32"
        >
          <option value="">Tất cả nơi đăng ký</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>
        </select>
        {/* Ngành đăng ký select */}
        <select
          value={searchRegisterMajor}
          onChange={(e) => {
            setSearchRegisterMajor(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1 w-32"
        >
          <option value="">Tất cả ngành</option>
          <option value="Dược">Dược</option>
          <option value="Điều dưỡng">Điều dưỡng</option>
        </select>
        <input
          type="text"
          placeholder="Ghi chú"
          value={searchNote}
          onChange={(e) => {
            setSearchNote(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1 w-32"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="unread">Chưa đọc</option>
          <option value="read">Đã đọc</option>
          <option value="processing">Đang xử lý</option>
          <option value="accepted">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Trình độ</TableHead>
              <TableHead>Nơi đăng ký</TableHead>
              <TableHead>Ngành đăng ký</TableHead>
              <TableHead>Ghi chú</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form, idx) => (
              <TableRow key={form.id}>
                <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                <TableCell>
                  <span
                    className={
                      "inline-block px-2 py-1 rounded text-xs font-medium " +
                      statusBadgeColor[form.status]
                    }
                  >
                    {new Date(form.created_at).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      handleStatusChange(
                        form.id,
                        e.target.value as ApplicationFormType["status"]
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="unread">Chưa đọc</option>
                    <option value="read">Đã đọc</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="accepted">Đã duyệt</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                </TableCell>
                <TableCell>{form.full_name}</TableCell>
                <TableCell>
                  {new Date(form.dob).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>{form.phone}</TableCell>
                <TableCell>{form.address}</TableCell>
                <TableCell>{form.education}</TableCell>
                <TableCell>{form.register_location}</TableCell>
                <TableCell>{form.register_major}</TableCell>
                <TableCell>
                  {form.note && form.note.length > 30 ? (
                    <span title={form.note}>{form.note.slice(0, 30)}...</span>
                  ) : (
                    form.note
                  )}
                </TableCell>
              </TableRow>
            ))}
            {forms.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-4">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Enhanced Pagination controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Hiển thị {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, totalCount)} trong tổng số {totalCount}{" "}
            kết quả
          </div>

          <div className="flex items-center gap-2">
            {/* Previous button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Trước
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {getPaginationNumbers().map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 py-1 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                const isCurrentPage = pageNum === page;
                return (
                  <Button
                    key={pageNum}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum as number)}
                    className={`w-8 h-8 p-0 ${
                      isCurrentPage
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            {/* Next button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Sau →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;
