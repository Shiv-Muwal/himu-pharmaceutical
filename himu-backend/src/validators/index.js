import { body } from "express-validator";

const strongPassword = body("password")
  .isString()
  .isLength({ min: 8, max: 128 })
  .withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must include an uppercase letter (A-Z)")
  .matches(/[a-z]/)
  .withMessage("Password must include a lowercase letter (a-z)")
  .matches(/[0-9]/)
  .withMessage("Password must include a number (0-9)")
  .matches(/[^A-Za-z0-9]/)
  .withMessage("Password must include a special character (!@#$…)");

export const registerValidation = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email address is required"),
  strongPassword,
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^\+?[0-9\s-]{10,16}$/)
    .withMessage("Enter a valid mobile number"),
  body("emailToken").trim().notEmpty().withMessage("Please verify your email with OTP"),
];

export const sendOtpValidation = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email address is required"),
];

export const verifyOtpValidation = [
  ...sendOtpValidation,
  body("otp")
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("Enter the 6-digit OTP"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const profileValidation = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("phone").optional({ checkFalsy: true }).trim().matches(/^\+?[0-9\s-]{10,16}$/).withMessage("Valid phone is required"),
];

export const passwordChangeValidation = [
  body("currentPassword").isString().notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage("New password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("New password must include an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("New password must include a lowercase letter")
    .matches(/[0-9]/)
    .withMessage("New password must include a number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("New password must include a special character"),
];

export const productValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Product name is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
  body("mrp").optional().isFloat({ min: 0 }).withMessage("Valid MRP is required"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("featured").optional().isBoolean().withMessage("Featured must be boolean"),
  body("active").optional().isBoolean().withMessage("Active must be boolean"),
];

export const productUpdateValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 200 }).withMessage("Product name must be between 2 and 200 characters"),
  body("category").optional().trim().isLength({ min: 2, max: 100 }).withMessage("Category is required"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Valid price is required"),
  body("mrp").optional().isFloat({ min: 0 }).withMessage("Valid MRP is required"),
  body("compareAtPrice").optional().isFloat({ min: 0 }).withMessage("Valid compare-at price is required"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("featured").optional().isBoolean().withMessage("Featured must be boolean"),
  body("active").optional().isBoolean().withMessage("Active must be boolean"),
];

export const orderValidation = [
  body("customer.name").trim().isLength({ min: 2, max: 100 }).withMessage("Customer name is required"),
  body("customer.phone").trim().matches(/^\+?[0-9\s-]{10,16}$/).withMessage("Valid phone is required"),
  body("customer.email").isEmail().withMessage("Valid email is required"),
  body("customer.address").trim().isLength({ min: 5, max: 300 }).withMessage("Valid address is required"),
  body("customer.city").trim().isLength({ min: 2, max: 80 }).withMessage("City is required"),
  body("customer.pincode").matches(/^[0-9]{6}$/).withMessage("Valid 6-digit pincode is required"),
  body("items").isArray({ min: 1, max: 25 }).withMessage("At least one item is required"),
  body("items.*.productId").trim().notEmpty().withMessage("Product id is required"),
  body("items.*.quantity").isInt({ min: 1, max: 20 }).withMessage("Quantity must be between 1 and 20"),
  body("paymentMethod").isIn(["cod", "whatsapp", "card"]).withMessage("Invalid payment method"),
];

export const contactValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("subject").trim().isLength({ min: 3 }).withMessage("Subject must be at least 3 characters"),
  body("message").trim().isLength({ min: 10, max: 5000 }).withMessage("Message must be between 10 and 5000 characters"),
];

export const careerValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").trim().matches(/^\+?[0-9\s-]{10,16}$/).withMessage("Valid phone is required"),
  body("position").trim().notEmpty().withMessage("Position is required"),
  body("experience").trim().notEmpty().withMessage("Experience is required"),
];

export const orderStatusValidation = [
  body("status").isIn(["Pending", "Shipped", "Delivered", "Cancelled"]).withMessage("Invalid status"),
];
