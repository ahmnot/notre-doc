import { describe, it, expect } from 'vitest';
import { z } from "zod";

const Form = z.object({
  name: z.string(),
  //             ^ 🕵️‍♂️
  phoneNumber: z.string().optional(),
  //                    ^ 🕵️‍♂️
  email: z.string(),
  //              ^ 🕵️‍♂️
  website: z.string().optional(),
  //                ^ 🕵️‍♂️
});

export const validateFormInput = (values: unknown) => {
  const parsedData = Form.parse(values);

  return parsedData;
};

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

it("Should fail if you pass a phone number with too few characters", async () => {
	expect(() =>
	  validateFormInput({
		name: "Matt",
		email: "matt@example.com",
		phoneNumber: "1",
	  }),
	).toThrowError("String must contain at least 5 character(s)");
  });
  
  it("Should fail if you pass a phone number with too many characters", async () => {
	expect(() =>
	  validateFormInput({
		name: "Matt",
		email: "matt@example.com",
		phoneNumber: "1238712387612387612837612873612387162387",
	  }),
	).toThrowError("String must contain at most 20 character(s)");
  });
  
  it("Should throw when you pass an invalid email", async () => {
	expect(() =>
	  validateFormInput({
		name: "Matt",
		email: "matt",
	  }),
	).toThrowError("Invalid email");
  });
  
  it("Should throw when you pass an invalid website URL", async () => {
	expect(() =>
	  validateFormInput({
		name: "Matt",
		email: "matt@example.com",
		website: "/",
	  }),
	).toThrowError("Invalid url");
  });
  
  it("Should pass when you pass a valid website URL", async () => {
	expect(() =>
	  validateFormInput({
		name: "Matt",
		email: "matt@example.com",
		website: "https://mattpocock.com",
	  }),
	).not.toThrowError();
  });
  