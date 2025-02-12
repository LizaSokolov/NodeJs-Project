import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().required().messages({
            "string.empty": "First name is required",
        }),
        middle: Joi.string().optional().allow("").messages({
            "string.base": "Middle name must be a string",
        }),
        last: Joi.string().required().messages({
            "string.empty": "Last name is required",
        }),
    }),
    isBusiness: Joi.boolean().optional(),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Phone number must be 10 digits",
        }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
    address: Joi.object({
        state: Joi.string().optional().allow("").messages({
            "string.base": "State must be a string",
        }),
        country: Joi.string().required().messages({
            "string.empty": "Country is required",
        }),
        city: Joi.string().required().messages({
            "string.empty": "City is required",
        }),
        street: Joi.string().required().messages({
            "string.empty": "Street is required",
        }),
        houseNumber: Joi.string().required().messages({
            "string.empty": "House number is required",
        }),
    }).required(),
    image: Joi.object({
        url: Joi.string().uri().optional().allow("").messages({
            "string.uri": "Image URL must be a valid URI",
        }),
        alt: Joi.string().optional().allow("").messages({
            "string.base": "Image description must be a string",
        }),
    }),
});

export const updateUserSchema = createUserSchema.fork(Object.keys(createUserSchema.describe().keys), (schema) => schema.optional());
