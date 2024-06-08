import vine, {SimpleMessagesProvider} from '@vinejs/vine'

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

loginValidator.messagesProvider = new SimpleMessagesProvider({
  'email.exists': 'Email address already in use.',
  'email.email': 'Email address is not valid.',
  'email.required': 'Email address is required.',
  'email.string': 'Email address must be a string.',
  'password.required': 'Password is required.',
  'password.string': 'Password must be a string.'
})

export default loginValidator
