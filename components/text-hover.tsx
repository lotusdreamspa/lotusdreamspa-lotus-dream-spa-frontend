import { TtextHoverProps } from "@/types";

export default function TextHover({ titile1, titile2 }: TtextHoverProps) {
	return (
		<div className="group overflow-hidden cursor-pointer transition-all ease-in-out duration-200">
			<div className="transition-all  ease-in-out duration-500">
				<div className="relative w-full">
					<h1 className="translate-y-[0%] group-hover:translate-y-[-100%] absolute left-0 transition-all ease-in-out flex duration-500 w-full">
						<div className="translate-y-[0%] group-hover:translate-y-[-100%] transition-all ease-in-out duration-500 grow">
							<div className="text-center">

							{titile1}
							</div>
						</div>
					</h1>
					<h1 className="relative transition-all ease-in-out flex duration-500 w-full">
						<div className="translate-y-[100%] group-hover:translate-y-[0%] transition-all ease-in-out duration-500 grow">
							<div className="text-center">

							{titile2}
							</div>
						</div>
					</h1>
				</div>
			</div>
		</div>
	);
}
