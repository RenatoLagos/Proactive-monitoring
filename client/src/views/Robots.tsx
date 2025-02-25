import { Link } from 'react-router-dom';

export default function Robots() {
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
        </> 
    )
}