import { ReactNode } from 'react';
import { AiOutlineGithub } from 'react-icons/ai';
import { Si42 } from 'react-icons/si';

interface SocialIconsProps {
  onGitClick: () => void;
  on42Click: () => void;
}

interface IconContainerProps {
	children: ReactNode;
}

const IconContainer : React.FC<IconContainerProps> = ({ children }) => (		
	<div className="flex items-center justify-center border rounded m-6 border-lilac w-10 h-10">
		{children}
	</div>
);

const SocialIcons: React.FC<SocialIconsProps> = ({ onGitClick, on42Click }) => (

	<div className="flex items-center justify-center">
		<IconContainer>
			<button onClick={onGitClick}>
			<AiOutlineGithub className="w-4 h-4 text-lilac" />
			</button>
		</IconContainer>

		<IconContainer>
			<button onClick={on42Click}>
			<Si42 className="w-4 h-4 text-lilac" />
			</button>
		</IconContainer>
	</div>
);

export default SocialIcons;