import { Link, Form, useActionData } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import RobotForm from '../components/RobotForm'

export default function NewRobot() {
    const error = useActionData() as string
    
    return (
        <>
            <div className='flex justify-between items-center'>
                <h2 className='text-4xl font-black text-slate-500'>Add Robot</h2>
                <Link 
                    to="/"
                    className='bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600'
                >
                    Go back Robot List
                </Link>
            </div>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form 
                className='mt-8'
                method='POST'
            >
                <RobotForm />
                <button
                    type='submit'
                    className='bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600'
                >
                    Add Robot
                </button>
            </Form>
        </> 
    )
}