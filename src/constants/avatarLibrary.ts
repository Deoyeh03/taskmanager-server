// Avatar Library - Curated collection of avatar options
// Using DiceBear API for diverse, customizable avatars

export interface AvatarOption {
    id: string;
    url: string;
    category: 'abstract' | 'animals' | 'characters' | 'initials';
    name: string;
}

export const avatarLibrary: AvatarOption[] = [
    // Abstract/Geometric
    { id: 'abstract-1', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Felix', category: 'abstract', name: 'Geometric Blue' },
    { id: 'abstract-2', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Aneka', category: 'abstract', name: 'Geometric Purple' },
    { id: 'abstract-3', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Midnight', category: 'abstract', name: 'Geometric Green' },
    { id: 'abstract-4', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Ocean', category: 'abstract', name: 'Geometric Teal' },

    // Fun Characters
    { id: 'char-1', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bella', category: 'characters', name: 'Adventurer 1' },
    { id: 'char-2', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Max', category: 'characters', name: 'Adventurer 2' },
    { id: 'char-3', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna', category: 'characters', name: 'Adventurer 3' },
    { id: 'char-4', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie', category: 'characters', name: 'Adventurer 4' },
    { id: 'char-5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', category: 'characters', name: 'Avatar 1' },
    { id: 'char-6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', category: 'characters', name: 'Avatar 2' },

    // Pixel Art
    { id: 'pixel-1', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Milo', category: 'characters', name: 'Pixel Hero' },
    { id: 'pixel-2', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Zoe', category: 'characters', name: 'Pixel Warrior' },
    { id: 'pixel-3', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Leo', category: 'characters', name: 'Pixel Mage' },

    // Bottts (Robots)
    { id: 'bot-1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Buster', category: 'characters', name: 'Bot Alpha' },
    { id: 'bot-2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nova', category: 'characters', name: 'Bot Beta' },
    { id: 'bot-3', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Spark', category: 'characters', name: 'Bot Gamma' },

    // Initials
    { id: 'init-1', url: 'https://api.dicebear.com/7.x/initials/svg?seed=AB&backgroundColor=6366f1', category: 'initials', name: 'Purple Initials' },
    { id: 'init-2', url: 'https://api.dicebear.com/7.x/initials/svg?seed=CD&backgroundColor=8b5cf6', category: 'initials', name: 'Violet Initials' },
    { id: 'init-3', url: 'https://api.dicebear.com/7.x/initials/svg?seed=EF&backgroundColor=3b82f6', category: 'initials', name: 'Blue Initials' },
    { id: 'init-4', url: 'https://api.dicebear.com/7.x/initials/svg?seed=GH&backgroundColor=10b981', category: 'initials', name: 'Green Initials' },

    // Fun Emoji Style
    { id: 'emoji-1', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy', category: 'characters', name: 'Happy Face' },
    { id: 'emoji-2', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool', category: 'characters', name: 'Cool Face' },
    { id: 'emoji-3', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Star', category: 'characters', name: 'Star Face' },
];

export const getAvatarsByCategory = (category: AvatarOption['category']) => {
    return avatarLibrary.filter(avatar => avatar.category === category);
};

export const getAvatarById = (id: string) => {
    return avatarLibrary.find(avatar => avatar.id === id);
};
