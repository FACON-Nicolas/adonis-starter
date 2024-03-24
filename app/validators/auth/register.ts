import vine from '@vinejs/vine'

const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .trim()
      .unique(
        async (query, value) =>
          !(await query.from('users').where('email', value.toLowerCase().trim()).first())
      )
      .transform((value) => value.toLowerCase().trim()),
    password: vine.string().minLength(8),
    passwordConfirmation: vine.string().sameAs('password'),
    username: vine
      .string()
      .trim()
      .transform((value) => value.charAt(0).toUpperCase() + value.slice(1)),
  })
)

export default registerValidator
