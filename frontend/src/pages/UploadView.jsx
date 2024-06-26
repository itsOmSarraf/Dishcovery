import imageCompression from 'browser-image-compression';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CameraIcon, CookingPot, Eraser } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
// import { reset } from 'react-hook-form';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export default function UploadView() {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			nonveg: false,
			servings: 2,
			image: ''
		}
	});
	const [fileData, setFileData] = useState('');
	const { toast } = useToast();

	async function onSubmit(data) {
		const imageFile = data.image[0];
		const options = {
			maxSizeMB: 0.01, // (max file size in MB)
			maxWidthOrHeight: 1200, // (max width or height in pixels)
			useWebWorker: true,
			quality: 0.6
		};
		const reader = new FileReader();

		reader.onload = async () => {
			const base64String = reader.result.split(',')[1];

			try {
				const compressedFile = await imageCompression(imageFile, options);

				// Read the compressed image as a base64 string
				const base64String = await readBase64(compressedFile);

				const response = await axios.post(
					'http://localhost:8000/api/v1/upload/gemini',
					{
						imageData: base64String,
						nonVeg: data.nonveg,
						servings: data.servings,
						typeFood: data.type_food,
						timeFood: data.time_food
					},
					{
						headers: {
							'Content-Type': 'application/json'
						}
					}
				);

				// console.log(response.data);
				setFileData(base64String);
				localStorage.setItem('recipeData', response.data.data.response);
				// console.log(response.data.data.response);
				toast({
					title: 'Upload successful',
					description: 'Image has been successfully uploaded to Gemini.'
				});
				navigate('/full');
			} catch (error) {
				console.error('Error uploading image to Gemini:', error);

				toast({
					title: 'Upload failed',
					description:
						'There was an error uploading the image. Please try again.',
					status: 'error'
				});
			}
		};

		reader.readAsDataURL(imageFile);

		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>{JSON.stringify(data, null, 2)}</code>
				</pre>
			)
		});
		const readBase64 = (file) => {
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result.split(',')[1]);
				reader.readAsDataURL(file);
			});
		};
	}

	return (
		<>
			<Navbar />
			<div className='p-4'>
				<Card className='w-full max-w-sm p-4 flex flex-col items-center'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name='image'
								render={() => (
									<FormItem className='w-[100px] flex flex-col items-center justify-center bg-[#f5e5cd] text-black shadow hover:bg-[#f5e5cd]/90 px-3 py-1 rounded-md'>
										<FormLabel
											htmlFor='picture'
											className='flex items-center'>
											<CameraIcon className='w-8 h-8' />
											Upload
										</FormLabel>
										<FormControl>
											<Input
												required
												id='picture'
												type='file'
												className='hidden'
												accept='image/*'
												capture='environment'
												{...form.register('image')}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='nonveg'
								render={({ field }) => (
									<FormItem className='mt-4 flex items-center'>
										<FormLabel className='mr-2'>Veg</FormLabel>
										<FormControl>
											<Switch
												className='mx-1'
												defaultValue='false'
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel className='ml-2'>Non-Veg</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='type_food'
								render={({ field }) => (
									<FormItem>
										<Select
											required
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className='w-[180px]'>
													<SelectValue placeholder='Select Type of Food' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value='indian'>Indian</SelectItem>
													<SelectItem value='south_indian'>
														South Indian
													</SelectItem>
													<SelectItem value='italian'>Italian</SelectItem>
													<SelectItem value='chinese'>Chinese</SelectItem>
													<SelectItem value='mexican'>Mexican</SelectItem>
													<SelectItem value='japanese'>Japanese</SelectItem>
													<SelectItem value='mediterranean'>
														Mediterranean
													</SelectItem>
													<SelectItem value='thai'>Thai</SelectItem>
													<SelectItem value='french'>French</SelectItem>
													<SelectItem value='continental'>
														Continental
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='time_food'
								render={({ field }) => (
									<FormItem>
										<Select
											required
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className='w-[180px]'>
													<SelectValue placeholder='Select Time of Food' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value='breakfast'>Breakfast</SelectItem>
													<SelectItem value='lunch'>Lunch</SelectItem>
													<SelectItem value='dinner'>Dinner</SelectItem>
													<SelectItem value='snacks'>Snacks</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='servings'
								className='flex w-full max-w-sm items-center gap-1.5 justify-evenly mt-3'
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor='serving'>How many servings?</FormLabel>
										<FormControl>
											<Input
												required
												type='number'
												className='w-[60px]'
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<div className='flex-1 '>
								<Button
									type='submit'
									className='my-3 mr-4'>
									Cook
									<CookingPot className='ml-2 h-4 w-4' />
								</Button>
								<Button
									variant='destructive'
									onClick={() => window.location.reload()}>
									Clear Form
									<Eraser className='ml-2 h-4 w-4' />
								</Button>
							</div>
						</form>
					</Form>
				</Card>
				{fileData && (
					<div className='mt-4'>
						<img
							src={`data:image/jpeg;base64,${fileData}`}
							alt='Uploaded'
							className='w-6/12 mx-auto rounded-md shadow-md'
						/>
					</div>
				)}
			</div>
		</>
	);
}
