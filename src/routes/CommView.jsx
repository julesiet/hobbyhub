import { useState, useEffect } from 'react';
import { supabase } from '../client';
import PostGrid from '../components/PostGrid';
import PostRow from '../components/PostRow';

const CommView = () => {

    const [defaultView, setDefaultView] = useState(true);
    const [posts, setPosts] = useState(null);
    const [filteredPosts, setFilteredPosts] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const [orderIsClicked, setOrderIsClicked] = useState(false);
    const [upvoteOrderAIsClicked, setUpvoteOrderAIsClicked] = useState(false);
    const [upvoteOrderDIsClicked, setUpvoteOrderDIsClicked] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase
                .from('post-database')
                .select()
                .order('created_at', {ascending: false});

            setPosts(data);
            setFilteredPosts(data);
        }

        fetchPosts().catch(console.error);
    }, [])

    const searchPosts = (searchValue) => {
        console.log(searchValue);

        setSearchInput(searchValue); 
        if (searchValue !== "") { 
            if (posts) {
                const filteredData = posts.filter((post) => {
                return post.title
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
                });
                console.log(filteredData);
                setFilteredPosts(filteredData);
            }
            } else {
            setFilteredPosts(posts);
        }
    }

    // section dedicated to filtering the posts
    const sortByPostDate = () => {
        setFilteredPosts((prev) => [...prev].reverse())
        setOrderIsClicked(!orderIsClicked)
    }

    const sortByUpvoteA = () => {
        if (!upvoteOrderAIsClicked) setFilteredPosts((prev) => [...prev].sort((a, b) => a.upvotes - b.upvotes))
        else setFilteredPosts(posts)

        setUpvoteOrderAIsClicked(!upvoteOrderAIsClicked)
    }

    const sortByUpvoteD = () => {
        if (!upvoteOrderDIsClicked) setFilteredPosts((prev) => [...prev].sort((a, b) => b.upvotes - a.upvotes))
        else setFilteredPosts(posts)

        setUpvoteOrderDIsClicked(!upvoteOrderDIsClicked)
    }

    return (
        <div className="main-app">

            <div className="change-view-cntr">
                <button onClick={() => setDefaultView(!defaultView)} className="change-view-btn"> { defaultView ? "LIST FORMAT ☰" : "GRID FORMAT ⊞"} </button>
            </div>

            <div className="filter-sec">

                <div className="filter-input-box">
                    <input
                        type="text"
                        placeholder="search for post titles!"
                        size={20}
                        onChange={(inputString) => searchPosts(inputString.target.value)}
                        value={searchInput}
                        className="filter-input"
                        />
                </div>

                <div className="filter-btns">
                    <label className='filter-lbl'> ORDER BY: </label>
                    <button onClick={sortByPostDate} className={ orderIsClicked ? 'btn-color-change' : 'filter-btn-def'}> OLDEST </button>
                    <button onClick={sortByUpvoteA} className={ upvoteOrderAIsClicked ? 'btn-color-change' : 'filter-btn-def'}> BY UPVOTE: ASCENDING </button>
                    <button onClick={sortByUpvoteD} className={ upvoteOrderDIsClicked ? 'btn-color-change' : 'filter-btn-def'}> BY UPVOTE: DESCENDING </button>
                </div>
            </div>

                {defaultView ? (
                    <div className='post-cntr-grid'>
                        {filteredPosts !== null ? (filteredPosts.map((post) => (
                            <PostGrid 
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                desc={post.desc}
                                tags={post.tags}
                                upvotes={post.upvotes}
                                image_path={post.image_path}
                                created_at={post.created_at}
                                />
                        ))) : 
                        <div className="loader"></div>}
                        </div>
                ): <div className='post-cntr-row'>
                    {filteredPosts !== null ? (filteredPosts.map((post) => (
                        <PostRow
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            desc={post.desc}
                            tags={post.tags}
                            upvotes={post.upvotes}
                            image_path={post.image_path}
                            created_at={post.created_at}
                        />
                        ))): <div className="loader"></div>}
                    </div>}
        </div>
    )
}

export default CommView