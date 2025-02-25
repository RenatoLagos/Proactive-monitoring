import { Link, Form } from 'react-router-dom'

export async function action() {
    console.log('NewRobot action')
    return {}    
}

export default function NewRobot() {
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

            <Form 
                className='mt-8'
                method='POST'
                action='action'
            >
                <div className='flex flex-col mb-4'>
                    <label htmlFor='name' className='text-slate-500'>Name</label>
                    <input 
                        type='text' 
                        id='name' 
                        name='name' 
                        className='border border-slate-500 rounded-md px-4 py-2'
                    />
                </div>
                <div className='flex flex-col mb-4'>
                    <label htmlFor='type' className='text-slate-500'>Status</label>
                    <select 
                        id='status' 
                        name='status' 
                        className='border border-slate-500 rounded-md px-4 py-2'
                    >
                        <option value='active'>Active</option>
                        <option value='inactive'>Inactive</option>
                    </select>
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