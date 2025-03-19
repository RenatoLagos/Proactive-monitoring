import { Robot } from "../types"
import { Form, useFetcher, useNavigate } from "react-router-dom"
type RobotDetailsProps = {
    robot: Robot
}

export default function RobotDetails({ robot }: RobotDetailsProps) {
    const navigate = useNavigate()
    const fetcher = useFetcher()

    return (
        <tr className="hover:bg-gray-50 border-b border-gray-200 transition-all duration-200">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {robot.name}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <fetcher.Form method="POST">
                    <button
                        type="submit"
                        name="id"
                        value={robot.id}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            robot.status 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                        } hover:cursor-pointer`}
                    >
                        {robot.status ? 'Active' : 'Solved'}
                    </button>
                </fetcher.Form>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => navigate(`/robots/${robot.id}/edit`, {
                            state: { robot }
                        })}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-md transition-colors duration-200"
                    >
                        Edit
                    </button>
                    <Form
                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition-colors duration-200"
                        method="POST"
                        action={`/robots/${robot.id}/delete`}
                        onSubmit={(e) => {
                            if (!confirm('Are you sure you want to delete this robot?')) {
                                e.preventDefault()
                            }
                        }}
                    >
                    <input 
                        type="submit" 
                        value="Delete" 
                    />
                    </Form>
                </div>
            </td>
        </tr>
    )
}