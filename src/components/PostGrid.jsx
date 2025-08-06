import { useEffect, useState } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router';

const PostGrid = ( {id, image_path, title, tags, upvotes, created_at} ) => {

    // format for rendering posts in grid format
    const [toggle, setToggle] = useState(false);
    const [currentImg, setCurrentImg] = useState(null);
    const [count, setCount] = useState(upvotes);
    const [postTime, setPostTime] = useState('');

    useEffect(() => {
        if (!image_path) {
            console.log('NO PATH')
            return;
        }

        const time = new Date(created_at)

        const pstDate = time.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        })

        setPostTime(pstDate)

        const fetchImage = async () => {
            const { data, error } = await supabase
                .storage
                .from('post-database-images')
                .download(image_path);

            if (error) {
                console.error('Download error:', error);
                return;
            }
            if (!data) {
                console.error('No data returned for key', image_path);
                return;
            }

            const url = URL.createObjectURL(data);
            setCurrentImg(url);
        };

        fetchImage().catch(console.error);
    }, [image_path]);

    const updateUpvote = async (e) => {
        e.preventDefault();

        await supabase
            .from('post-database')
            .update( {upvotes: count + 1} )
            .eq('id', id)
        
        setCount((prev) => prev + 1)
    }

    return (
        <div className="post-grid">

            <div className='post-grid-upper'>
                <button className='upvote' onClick={updateUpvote}> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#203a58" viewBox="0 0 16 16">
                        <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0"/>
                    </svg>
                </button>
                <div className="dropdown">
                    <button className='extd-btn' onClick={() => setToggle(!toggle)}>
                        <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#203a58">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                        </svg>
                    </button>
                    <div className={`extd-content ${toggle ? 'show' : ''}`}>
                        <Link to={`/update/${id}`}>
                            update post! ✐ᝰ
                        </Link>
                        <Link to={`/view_more/${id}`}>
                            view more... ⌕
                        </Link>
                    </div>
                </div>
                
            </div>

            <div className="post-grid-inner">
                <img src={currentImg ? (currentImg) : 'https://placehold.jp/250x200.png'} alt='picture' width={250} height={200} className='image-cls'/>
                <h3> {title} </h3>
                <div className="post-tags">
                    {tags ? (tags.map((tag) => (
                        <button key={tag} className='post-tag-tags'> {tag} </button>
                    ))) : null}
                </div>

                <div className="upvote-sec-grid">
                    {`↑ ${upvotes}`}
                </div>

                <div className='time-cntr'>
                    {`Posted on ${postTime}`}
                </div>
            </div>

        </div>
    )
}

export default PostGrid