import { Robot } from "../types"

type RobotFormProps = {
    robot?: Robot
}

export default function RobotForm({ robot }: RobotFormProps) {
    return (
        <div className='flex flex-col mb-4'>
            <label htmlFor='name' className='text-slate-500'>Name</label>
            <input 
                type='text' 
                id='name' 
                name='name'
                placeholder='Robot Name'
                defaultValue={robot?.name}
                className='border border-slate-500 rounded-md px-4 py-2'
            />
        </div>
    )
}
