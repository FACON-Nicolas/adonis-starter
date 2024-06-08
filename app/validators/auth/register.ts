import vine, { SimpleMessagesProvider } from '@vinejs/vine'

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

registerValidator.messagesProvider = new SimpleMessagesProvider({
  'email.email': 'Email address is not valid.',
  'database.unique': 'Email address already in use.',
  'email.required': 'Email address is required.',
  'email.string': 'Email address must be a string.',
  'password.required': 'Password is required.',
  'password.string': 'Password must be a string.',
  'password.minLength': 'Password must be at least 8 characters long.',
  'passwordConfirmation.sameAs': 'Passwords do not match.',
  'username.required': 'Username is required.',
  'username.string': 'Username must be a string.',
})

export default registerValidator
