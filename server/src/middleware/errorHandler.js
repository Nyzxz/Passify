export const notFound = (req, res) => res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });

// Standard 4-arg error middleware: must be registered last.
export const errorHandler = (err, req, res, next) => {
  const status = err.status || (err.name === "MulterError" ? 400 : 500);
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? "Something went wrong on our end" : err.message });
};
