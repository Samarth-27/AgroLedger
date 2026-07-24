import { z } from 'zod';

const BuyerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number").optional().or(z.literal('')),
  gstNumber: z.string().regex(/^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}Z[0-9a-zA-Z]{1}$/i, "Invalid GST Number (e.g. 07AAAAA0000A1Z5)").optional().or(z.literal('')),
  panNumber: z.string().regex(/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/i, "Invalid PAN Number (e.g. ABCDE1234F)").optional().or(z.literal('')),
  address: z.string().min(5, "Address is required"),
  commissionRate: z.coerce.number().min(0, "Rate cannot be negative").default(0),
});

const data = {
  name: "Samarth jain",
  address: "Malviya nagar",
  mobile: "7878908050",
  commissionRate: "0",
  gstNumber: "27ABCDE1234F1Z5",
  panNumber: "ABCDE1234F"
};

const result = BuyerSchema.safeParse(data);
console.log(JSON.stringify(result, null, 2));
