import { Robot } from "../types"
import { useNavigate } from "react-router-dom"
type RobotDetailsProps = {
    robot: Robot
}

export default function RobotDetails({ robot }: RobotDetailsProps) {
    const navigate = useNavigate()
    return (
       <tr className="border-b">
           <td className="px-3 text-lg text-gray-800">
            {robot.name}
           </td>
           <td className="px-3 text-lg text-gray-800">
            {robot.status ? 'Active' : 'Solved'}
           </td>
           <td className="px-3 text-lg text-gray-800">
                <div className="flex gap-2 items-center">
                    <button onClick={() => navigate(`/robots/${robot.id}/edit`, {
                        state: {
                            robot
                        }
                    })} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>
                </div>
            </td>
       </tr>
    )
}