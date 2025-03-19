import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Robots from './views/Robots'
import NewRobot from './views/NewRobot'
import EditRobot from './views/EditRobot'
import { robotsLoader, editRobotLoader } from './loaders/robotLoaders'
import { newRobotAction, editRobotAction, deleteRobotAction, updateRobotStatus } from './actions/robotActions'

export const router = createBrowserRouter([	
    {
        path: '/',
        element: <Layout />,
        children: [
            {   
                index: true,
                element: <Robots />,
                loader: robotsLoader,
                action: updateRobotStatus
            },
            {
                path: 'robots/new',
                element: <NewRobot />,
                action: newRobotAction
            },
            {
                path: 'robots/:id/edit',
                element: <EditRobot />,
                loader: editRobotLoader,
                action: editRobotAction
            },
            {
                path: 'robots/:id/delete',
                action: deleteRobotAction
            }
        ]
    }
])