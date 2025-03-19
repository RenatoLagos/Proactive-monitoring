import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Robots from './views/Robots'
import NewRobot from './views/NewRobot'
import { action as newRobotAction} from './actions'
import EditRobot from './views/EditRobot'
import { robotsLoader, editRobotLoader } from './loaders/robotLoaders'

export const router = createBrowserRouter([	
    {
        path: '/',
        element: <Layout />,
        children: [
            {   
                index: true,
                element: <Robots />,
                loader: robotsLoader
            },
            {
                path: 'robots/new',
                element: <NewRobot />,
                action: newRobotAction
            },
            {
                path: 'robots/:id/edit',
                element: <EditRobot />,
                loader: editRobotLoader
            }
        ]
    }
])