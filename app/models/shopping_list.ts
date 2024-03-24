import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import ShoppingItem from '#models/shopping_item'

export default class ShoppingList extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description?: string

  @column({ columnName: 'user_id', serializeAs: null })
  declare userId: number

  @belongsTo(() => User)
  declare creator: BelongsTo<typeof User>

  @hasMany(() => ShoppingItem)
  declare shoppingItems: HasMany<typeof ShoppingItem>

  @manyToMany(() => User, {
    pivotTable: 'shopping_lists_contributions',
  })
  declare sharedWith: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeFetch()
  @beforeFind()
  static autoPreloading(query: ModelQueryBuilderContract<typeof ShoppingList>) {
    query.preload('creator').preload('shoppingItems')
  }
}
