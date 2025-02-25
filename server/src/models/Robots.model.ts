import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
    tableName: 'robots'
})

class Robots extends Model {
    @Column({
        type: DataType.STRING(50)
    })
    declare name: string

    @Default(true)
    @Column({
        type: DataType.BOOLEAN()
    })
    declare status: boolean
}

export default Robots