import {NewPostCard, PostCard} from "../components";

export function FeedPage() {
    return (
        <div className={"flex flex-col items-center m-2 gap-5"}>
                <NewPostCard />

            <PostCard></PostCard>
        </div>
    )
}