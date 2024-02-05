import { useForm } from "react-hook-form";
import { AiOutlineMail } from "react-icons/ai";


interface IdataRecoverPassword {
	email: string;
}

const ForgetPassword = () => {

	const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    } = useForm<IdataRecoverPassword >();

  const submitHandler = (data: IdataRecoverPassword) => {
  };  

  return (
    <div>
      <section className='container mx-auto px-5 py-10'>
			<div className='w-full max-w-sm mx-auto'>
        <h1 className='text-2x1 text-center mb-8'>Forgot Password</h1>
        <p className="text-sm mb-8">Enter the email address you used when you joined and we’ll 
          send you instructions to reset your password.
        </p>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className='mb-2 w-full'>
                <div className='flex flex-row items-center border-b'>
                  <AiOutlineMail className= 'w-4 h-4'/>
                  <input
                  type="email"
                  id="email"

                  {...register('email', {
                    pattern: {
                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Please enter a valid email',
                    },
                    required: {
                    value: true,
                    message: 'Email is required',
                    },
                  })}

                  placeholder='Enter Email'
                  className= 'px-5 py-4 outline-none'
                  />

                </div>
                {
                  errors.email?.message && 
                  (<p className='text-red-500 text-xs mt-1'>{errors.email?.message}</p>)
                }
                <button
                type="submit"
                disabled={!isValid}
                className="border bg-gray-200 mt-6 py-2 px-10 w-full rounded mb-6 disabled:opacity-40"
                >
                Reset Password
                </button>
            </div>
          </form>

          </div>
        </section>
    </div>
  )
}

export default ForgetPassword