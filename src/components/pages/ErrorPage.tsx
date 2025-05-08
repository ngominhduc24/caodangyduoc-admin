import { Link, useRouteError } from "react-router-dom";
import { Button } from "../ui/button";

function ErrorPage() {
    const error: any = useRouteError();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
            <p className="text-lg text-gray-600 mb-2">{error?.data}</p>
            <p className="text-red-500 mb-6 font-semibold">
                <i>{error?.statusText || error?.message}</i>
            </p>
            <Link to="/" className="text-white">
                <Button>
                    Trở về trang chủ
                </Button>
            </Link>
        </div>
    );
}

export default ErrorPage;