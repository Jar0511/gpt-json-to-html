import { useTranslation } from "react-i18next";
import { VscGithubInverted } from "react-icons/vsc";

const GitHubLink = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'menu' });
	return (
		<a
			href="https://github.com/Jar0511/gpt-json-to-html"
			target="_blank"
			rel="noopener noreferrer"
			className="upper-buttons cursor-pointer focusable inline-flex items-center justify-center size-[2.25rem] text-lg"
			aria-label={t("github")}
		>
			<VscGithubInverted />
		</a>
	);
};

export default GitHubLink;
