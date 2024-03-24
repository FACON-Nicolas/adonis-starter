import vine from '@vinejs/vine'

const loginValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .trim()
      .toLowerCase()
      .exists(
        async (query, value) =>
          !!(await query.from('users').where('email', value.trim().toLowerCase()).first())
      )
      .transform((value) => value.toLowerCase().trim()),
    password: vine.string(),
  })
)

export default loginValidator
