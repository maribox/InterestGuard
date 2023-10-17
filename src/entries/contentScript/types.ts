export interface YoutubeVideo {
    label: string;
    id: string;
    title: string;
    element: HTMLElement;
    block: boolean;
    done: boolean;
}

export enum YoutubePage {
    results, home, shorts, video, subscriptions
}

export enum GPTVersion {
    GPT_3 = "gpt-3.5-turbo",
    GPT_4 = "gpt-4"
}