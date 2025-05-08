import Loader from "./loader"

function LoaderOverlay() {
    return (
        <div className="flex bg-transparent fixed top-10 right-10 z-50">
            <Loader />
        </div>
    )
}

export default LoaderOverlay
