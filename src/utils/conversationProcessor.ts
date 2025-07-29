import { Conversation, SidebarItem } from '@/types/conversation';

// conversations 배열을 update_time 기준으로 정렬
export function sortConversationsByUpdateTime(
	conversations: Conversation[]
): Conversation[] {
	return conversations.sort((a, b) => {
		const timeA = a.update_time || 0;
		const timeB = b.update_time || 0;
		return timeB - timeA; // 내림차순 정렬 (최신 것이 먼저)
	});
}

// conversations를 regular와 grouped로 분리
export function splitConversations(conversations: Conversation[]) {
	const regularConversations: Conversation[] = [];
	const templateGroups = new Map<string, Conversation[]>();

	for (const conversation of conversations) {
		if (
			conversation.conversation_template_id === null ||
			conversation.conversation_template_id === undefined
		) {
			regularConversations.push(conversation);
		} else {
			const templateId = conversation.conversation_template_id;
			if (!templateGroups.has(templateId)) {
				templateGroups.set(templateId, []);
			}
			templateGroups.get(templateId)!.push(conversation);
		}
	}

	// Map을 배열의 배열로 변환하고 각 그룹의 첫 번째 아이템 update_time 기준 내림차순 정렬
	const groupedConversations = Array.from(templateGroups.values()).sort(
		(groupA, groupB) => {
			const timeA = groupA[0]?.update_time || 0;
			const timeB = groupB[0]?.update_time || 0;
			return timeB - timeA;
		}
	);

	return { regularConversations, groupedConversations };
}

// 사이드바 아이템 생성
export function createSidebarItems(
	groupedConversations: Conversation[][],
	regularConversations: Conversation[]
): SidebarItem[] {
	const sidebarItems: SidebarItem[] = [];

	// groupedConversations를 프로젝트로 추가
	groupedConversations.forEach((group, index) => {
		sidebarItems.push({
			title: `프로젝트 ${index + 1}`,
			children: group.map((item) => ({
				title: item.title || 'Untitled',
				id: item.id,
			})),
		});
	});

	// regularConversations를 개별 아이템으로 추가
	regularConversations.forEach((item) => {
		sidebarItems.push({
			title: item.title || 'Untitled',
			id: item.id,
		});
	});

	return sidebarItems;
}

// 전체 처리 프로세스
export function processConversations(conversations: Conversation[]) {
	// 1. 정렬
	const sortedConversations = sortConversationsByUpdateTime(conversations);

	// 2. 분리
	const { regularConversations, groupedConversations } =
		splitConversations(sortedConversations);

	// 3. 사이드바 아이템 생성
	const sidebarItems = createSidebarItems(
		groupedConversations,
		regularConversations
	);

	return {
		conversations: sortedConversations,
		regularConversations,
		groupedConversations,
		sidebarItems,
	};
}

// Re-export types for convenience
export type { Conversation, SidebarItem } from '@/types/conversation';
export { isSidebarProject } from '@/types/conversation';
