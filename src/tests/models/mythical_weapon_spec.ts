import { MythicalWeaponsStore } from '../../models/mythical_weapon'

const store = new MythicalWeaponsStore()

describe('Mythical Weapon Model', () => {
  it('should have an index method', async () => {
    const result = await store.index
    expect(result).toBeDefined()
  })

  // it('index method should return a list of products', async () => {
  //   const result = await store.index
  //   expect(result).toEqual([])
  // })
})
