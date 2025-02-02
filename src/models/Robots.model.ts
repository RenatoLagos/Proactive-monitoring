import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
    tableName: 'robots'
})

class Robots extends Model {
    @Column({
        type: DataType.STRING(50)
    })
    name: string

    @Default(true)
    @Column({
        type: DataType.BOOLEAN()
    })
    status: boolean
}

export default Robots