import * as yup from 'yup';

export const RecipeInputSchema = yup.object().shape({
  name: yup.string().required().min(3),
  ingredients: yup.array().of(yup.string().required()).min(1),
  steps: yup.array().of(yup.string().required()).min(1),
  prepTime: yup.number().required().positive().integer(),
  cookTime: yup.number().required().positive().integer(),
  cuisineType: yup.string().required(),
  calories: yup.number().required().positive().integer(),
  imageUrl: yup.string().url(),
});

export const UserInputSchema = yup.object().shape({
  username: yup.string().required().min(3),
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
  role: yup.mixed().oneOf(['ADMIN', 'USER']).required(),
});