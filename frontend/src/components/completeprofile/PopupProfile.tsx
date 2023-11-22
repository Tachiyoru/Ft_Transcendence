import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components";

const PopupProfile = () => {
	return (
	<Dialog open>
		<DialogContent className="bg-white text-black p-0 overflow-hidden">
		<DialogHeader className="pt-8 px-6">
			<DialogTitle className="text-2xl text-center font-bold">
			Customize your server
			</DialogTitle>
			<DialogDescription className="text-center text-zinc-500">
			Give your server a personality with a name and an image. You can always change it later.
			</DialogDescription>
		</DialogHeader>
		</DialogContent>
	</Dialog>
	)
}

export default PopupProfile