import { Link, Form, useActionData } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'

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
                <div className='flex flex-col mb-4'>
                    <label htmlFor='name' className='text-slate-500'>Name</label>
                    <input 
                        type='text' 
                        id='name' 
                        name='name'
                        placeholder='Robot Name' 
                        className='border border-slate-500 rounded-md px-4 py-2'
                    />
                </div>
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