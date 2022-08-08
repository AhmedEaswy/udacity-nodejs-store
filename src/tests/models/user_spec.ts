import {User, UsersStore} from '../../models/user'

const store = new UsersStore()


describe('User Model', () => {
    it('Have Index Method as Return Object', async () => {
        const result = await store.index
        expect(result).toBeDefined()
    })
})

