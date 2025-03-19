import { Link, useLoaderData } from 'react-router-dom'
import RobotDetails from '../components/RobotDetails'
import { Robot } from '../types'

export default function Robots() {
    const robots = useLoaderData() as Robot[]
    return (
        <>
            <div className='flex justify-between items-center'>
                <h2 className='text-4xl font-black text-slate-500'>Robots</h2>
                <Link 
                    to="robots/new"
                    className='bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600'
                >
                    Add Robot
                </Link>
            </div>
            <table className='w-full mt-5 table-auto'>
                <thead>
                    <tr>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {robots.map(robot => (
                        <RobotDetails 
                            key={robot.id}
                            robot={robot}
                        />
                    ))}
                </tbody>
            </table>
        </>
    )
}