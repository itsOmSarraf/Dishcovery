import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CameraIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { CookingPot } from 'lucide-react';
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
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function UploadView() {
	const form = useForm({
		defaultValues: {
			nonveg: false,
			servings: 2,
			image: ''
		}
	});
	const [fileData, setFileData] = useState('');
	function onSubmit(data) {
		const imageFile = data.image[0];
		const reader = new FileReader();
		console.log(imageFile);
		reader.onload = () => {
			const base64String = reader.result.split(',')[1];
			setFileData(base64String);
		};
		reader.readAsDataURL(imageFile);
		console.log(data);
		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>{JSON.stringify(data, null, 2)}</code>
				</pre>
			)
		});
	}
	const { toast } = useToast();
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
												capture='camera'
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
							<Button
								type='submit'
								className='my-3'>
								Cook
								<CookingPot className='ml-2 h-4 w-4' />
							</Button>
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
			<Button
				variant='outline'
				onClick={() => {
					toast({
						description: 'Getting the response soon 🍽️ '
					});
				}}>
				Show Toast
			</Button>
		</>
	);
}
