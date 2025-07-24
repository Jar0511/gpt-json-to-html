import { useForm } from 'react-hook-form';

interface FormData {
	file: FileList;
}

function App() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		mode: 'onChange',
	});

	const file = watch('file');
	const selectedFileName = file?.[0]?.name;

	const onSubmit = (data: FormData) => {
		if (data.file && data.file[0]) {
			// TODO: 파일 처리 로직
			console.log('Selected file:', data.file[0]);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
			<div className="w-full max-w-2xl">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
						GPT Conversations to HTML
					</h1>
					<p className="text-xl text-gray-600">
						Transform your ChatGPT export data into beautiful HTML pages
					</p>
				</div>

				<div className="bg-white rounded-2xl shadow-xl p-8">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
							<svg
								className="mx-auto h-16 w-16 text-gray-400 mb-4"
								stroke="currentColor"
								fill="none"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
									strokeWidth={1}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M12 11v4M10 13h4"
									strokeWidth={1}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<label htmlFor="file-upload" className="cursor-pointer">
								<span className="text-lg font-medium text-gray-700 block mb-2">
									{selectedFileName || 'Choose your GPT export file'}
								</span>
								<span className="text-sm text-gray-500">
									JSON format (conversations.json)
								</span>
								<input
									{...register('file', { required: true })}
									id="file-upload"
									type="file"
									accept=".json"
									className="sr-only"
								/>
							</label>
						</div>

						<button
							type="submit"
							disabled={!isValid}
							className="w-full py-4 px-6 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
						>
							Convert to HTML
						</button>
					</form>
				</div>

				<p className="text-center text-sm text-gray-500 mt-8">
					Upload your ChatGPT conversations export and convert them into a
					beautifully formatted HTML document
				</p>
			</div>
		</div>
	);
}

export default App;
