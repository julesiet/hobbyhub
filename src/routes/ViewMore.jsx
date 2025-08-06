import { supabase } from "../client"
import { useParams } from "react-router"
import { useState, useEffect } from 'react'
import PostGrid from "../components/PostGrid"
import PostRow from "../components/PostRow"

const ViewMore = () => {

    const { id } = useParams();
    const [currentPost, setCurrentPost] = useState(null);
    const [currentComment, setCurrentComment] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase
                .from('post-database')
                .select()
                .eq('id', id)
                .single();
            
            console.log('fetched post!')
            setCurrentPost(data)
        }

        fetchPost().catch(console.error)
    }, [id])

    const handleComment = async (e) => {
        e.preventDefault();

        console.log(currentComment)

        if (currentPost.comments !== null) {
            await supabase
                .from('post-database')
                .update( { comments: [...currentPost.comments, currentComment]})
                .eq('id', id)
        } else {
            await supabase
            .from('post-database')
            .update( { comments: [currentComment]})
            .eq('id', id)
        }

    }

    return (
        <div className="main-app">

            <div className="view-more-cntr">
                <div className="preview-cntr">
                    {currentPost ? (
                        <div>
                            <PostGrid 
                                key={currentPost.id}
                                id={currentPost.id}
                                title={currentPost.title}
                                desc={currentPost.desc}
                                tags={currentPost.tags}
                                upvotes={currentPost.upvotes}
                                image_path={currentPost.image_path}
                                created_at={currentPost.created_at}
                            />
                        </div>
                    ): <div className="loader"></div>}
                </div>

                <div className="desc-section">

                    <div className="view-more-inner">

                            <div className="desc-box">
                                <h3 style={ { margin: 0} }> DESCRIPTION </h3>
                                {currentPost ? (currentPost.desc) : <div className="loader"></div>}
                            </div>
                            <div className="date-box">
                                <h3 style={ { margin: 0} }> START DATE: </h3>
                                {currentPost ? (currentPost.start_date) : <div className="loader"></div>}
                                <h3 style={ { margin: 0} }> EXP. END DATE: </h3>
                                {currentPost ? (currentPost.end_date) : <div className="loader"></div>}
                            </div>
                        
                    </div>

                    <div className="comment-section">
                            <div className="add-comment-section">
                                <h3 style={ { margin: 0} }> COMMENTS: </h3>
                                <div className="comment-form">
                                    <form onSubmit={handleComment}>

                                        <textarea
                                            name="comment"
                                            placeholder="leave a comment!"
                                            value={currentComment}
                                            onChange={(e) => setCurrentComment(e.target.value)}
                                            rows={2}
                                            className="leave-comment"
                                            />

                                        <button type="submit" className="leave-comment-btn"> post a comment! (anonymously) </button>
                                    </form>
                                </div>
                            </div>
                            <div className="display-comments">
                                {Object.is(currentPost, null) ? <div className="loader"></div> 
                                : (
                                    <div className="display-comments-inner">
                                        {currentPost.comments !== null ? (<div>
                                            {currentPost.comments.map((comment) => (
                                                <div className="comment-body"> 
                                                    <h4 className="profile-comm"> anon user </h4>
                                                    {comment}
                                                </div>
                                            ))}
                                            </div>) : <p> no comments! </p>}
                                    </div>
                                )}
                            </div>
                        </div>
                </div>
            </div>
            <div className="view-more-row">
                {currentPost ? (
                    <div>
                        <PostRow
                            key={currentPost.id + 1}
                            id={currentPost.id}
                            title={currentPost.title}
                            desc={currentPost.desc}
                            tags={currentPost.tags}
                            upvotes={currentPost.upvotes}
                            image_path={currentPost.image_path}
                            created_at={currentPost.created_at}
                        />
                    </div>
                    ): <div className="loader"></div>}
                </div>
        </div>
    )
}

export default ViewMore