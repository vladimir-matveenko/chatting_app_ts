import rateLimit from "express-rate-limit";

export const passwordResetRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  message: {
    message: "Too many password reset requests. Please try again later.",
    code: "RESET_CODE_TOO_MANY_REQUESTS",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export const passwordResetVerifyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  message: {
    message: "Too many verification attempts. Please try again later.",
    code: "RESET_CODE_TOO_MANY_ATTEMPTS",
  },

  standardHeaders: true,
  legacyHeaders: false,
});
