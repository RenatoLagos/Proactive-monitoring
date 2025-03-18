import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import Robots from './views/Robots'
import NewRobot from './views/NewRobot'
import { action as newRobotAction} from './actions'

export const router = createBrowserRouter([	
    {
        path: '/',
        element: <Layout />,
        children: [
            {   
                index: true,
                element: <Robots />
            },
            {
                path: 'robots/new',
                element: <NewRobot />,
                action: newRobotAction
            }
        ]
    }
])