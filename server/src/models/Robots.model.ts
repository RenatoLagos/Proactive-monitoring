import { Table, Column, Model, DataType, Default, PrimaryKey, AutoIncrement } from 'sequelize-typescript'

@Table({
    tableName: 'robots',
    timestamps: true
})

class Robots extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number

    @Column({
        type: DataType.STRING(50)
    })
    declare name: string

    @Default(true)
    @Column({
        type: DataType.BOOLEAN
    })
    declare status: boolean

    @Column({
        type: DataType.DATE
    })
    declare createdAt: Date

    @Column({
        type: DataType.DATE
    })
    declare updatedAt: Date
}

export default Robots