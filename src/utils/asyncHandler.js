const asyncHandler = (fn) => (req, res, next) => {
    try {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            if (process.env.NODE_ENV !== "production") {
                console.error("❌ Async Error:", err);
            } else {
                console.error("❌ Async Error:", err.message);
            }
            next(err);
        });
    } catch (err) {
        next(err);
    }
};

export default asyncHandler;
