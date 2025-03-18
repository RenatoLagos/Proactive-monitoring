import { object, string, boolean } from 'valibot'

export const DraftRobotSchema = object({
    name: string(),
    status: boolean()
})