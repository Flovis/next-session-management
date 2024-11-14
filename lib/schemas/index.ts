import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'adresse e-mail est requise" })
    .email({ message: "L'adresse e-mail est invalide" }),

  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

// Add lotisssement schema
export const addLotissementSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  sousCirconscriptionId: z
    .number({
      required_error: "Selectionner une sous circonscription",
      invalid_type_error: "",
    })
    .int()
    .positive(),
});

//Add Parcelle Schema
export const addParcelleSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est du proprietaire est requis" }),
  prenom: z
    .string()
    .min(1, { message: "Le prenom est du proprietaire est requis" }),
  postNom: z
    .string()
    .min(1, { message: "Le postnom est du proprietaire est requis" }),

  lotissementId: z.number().min(1, { message: "Le lotissement est requis" }),
  file: z.string().min(1, { message: "Le fichier est requis" }),
});

//Add Field Data Schema
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["text/plain"];

// export const addFieldDataSchema = z
//   .object({
//     project_name: z.string().min(1, { message: "Le nom du projet est requis" }),
//     project_type: z
//       .string()
//       .min(1, { message: "Le type de projet est requis" }),

//     description: z
//       .string()
//       .min(10, { message: "La description doit avoir au moins 10 caractères" }),
//     date: z
//       .date({ message: "La date est requise" })
//       .refine((date) => date instanceof Date, {
//         message: "La date est invalide",
//       }),
//     file: z.custom<File | null>(
//       (val) => val instanceof File,
//       "Le fichier est requis"
//     ),

//     additional_input: z.string().optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.project_type === "2" && !data.additional_input) {
//       ctx.addIssue({
//         path: ["additional_input"],
//         message: "Ce champ est obligatoire pour ce type de projet",
//         code: z.ZodIssueCode.custom,
//       });
//     }
//   });
export const addFieldDataSchema = z
  .object({
    project_name: z.string().min(1, "Le nom du projet est obligatoire"),
    description: z.string().min(1, "La description est obligatoire"),
    project_type: z.string().min(1, "Le type de projet est obligatoire"),
    date: z
      .date({ message: "La date est requise" })
      .refine((date) => date instanceof Date, {
        message: "La date est invalide",
      }),
    file: z.custom<File | null>(
      (val) => val instanceof File,
      "Le fichier est requis"
    ),
    additional_input: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.project_type === "2" && !data.additional_input) {
      ctx.addIssue({
        path: ["additional_input"],
        message: "Ce champ est obligatoire pour ce type de projet",
        code: z.ZodIssueCode.custom,
      });
    }
  });
