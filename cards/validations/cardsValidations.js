import Joi from "joi";

export const createCardSchema = Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    email: Joi.string().email().required(),
    web: Joi.string().uri().optional(),
    image: Joi.object({
        url: Joi.string().uri().required(),
        alt: Joi.string().optional(),
    }),
    address: Joi.object({
        state: Joi.string().optional(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNumber: Joi.string().required(),
        zip: Joi.string().required(),
    }).required(),
});

export const updateCardSchema = Joi.object({
    title: Joi.string().optional(),
    subtitle: Joi.string().optional(),
    description: Joi.string().optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
    email: Joi.string().email().optional(),
    web: Joi.string().uri().optional(),
    image: Joi.object({
        url: Joi.string().uri().optional(),
        alt: Joi.string().optional(),
    }).optional(),
    address: Joi.object({
        state: Joi.string().optional(),
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        street: Joi.string().optional(),
        houseNumber: Joi.string().optional(),
        zip: Joi.string().optional(),
    }).optional(),
});
