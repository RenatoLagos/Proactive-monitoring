import { Table, Column, Model, DataType } from 'sequelize-typescript'

export type AlertType = 'System exception' | 'Scheduled start failure' | 'Runtime Exceeded' | 'Terminated' | null

@Table({
    tableName: 'robots',
    timestamps: true
})
export class Robots extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare id: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    declare status: boolean

    @Column({
        type: DataType.STRING,
        allowNull: true,
        validate: {
            isIn: [[null, 'System exception', 'Scheduled start failure', 'Runtime Exceeded', 'Terminated']]
        }
    })
    declare alert: AlertType

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: '4 - Low',
        validate: {
            isIn: [['1 - Critical', '2 - High', '3 - Moderate', '4 - Low']]
        }
    })
    declare priority: '1 - Critical' | '2 - High' | '3 - Moderate' | '4 - Low'

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare createdAt: Date

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare updatedAt: Date
}

export default Robots