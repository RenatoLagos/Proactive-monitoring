import { object, string, boolean, number, array } from 'valibot'

export const DraftRobotSchema = object({
    name: string(),
    status: boolean()
})

export const RobotSchema = object({
    id: number(),
    name: string(),
    status: boolean()
})

export const RobotsSchema = array(RobotSchema)

export type Robot = {
    id: number;
    name: string;
    status: boolean;
}