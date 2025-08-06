import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { supabase } from '../client';

const UpdatePost = () => {

    // make sure to be able to delete from here 
    const [postTitle, setPostTitle] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [postDesc, setPostDesc] = useState('');
    const [postTags, setPostTags] = useState([]);
    const [postStart, setPostStart] = useState('');
    const [postEnd, setPostEnd] = useState('');

    const [currentPost, setCurrentPost] = useState(null);

    // this post is already made so it already has its unique id assigned to it
    const { id } = useParams();

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

    const handleTags = (tag) => {
        setPostTags(prev =>
            prev.includes(tag)
            ? prev.filter(t => t !== tag)
            : [...prev, tag]
        );
    };

    const handleImage = (e) => {
        const fileObject = e.target.files[0];
        setPostImage(fileObject);
    }

    const updatePost = async (e) => { // wonder if i should make it so the user doesn't have to update everything for this to work
        e.preventDefault();
        
        const file_name = postImage.name
        console.log(file_name)
        const path = `placeholder/${id}-${file_name}`

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('post-database-images')
            .upload(path, postImage, {
                upsert: true
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return;
        }

        // uploadData.path is e.g. "placeholder/8363-my-photo.png"
        const storageKey = uploadData.path;

        const { data: insertData, error: insertError } = await supabase
            .from('post-database')
            .update({
                title: postTitle,
                image_path: storageKey,    // <— save the full key here
                desc: postDesc,
                start_date: postStart,
                end_date: postEnd,
                tags: postTags || []
            })
            .eq('id', id)

        if (insertError) console.error('Insert error:', insertError);

        window.location="/comm-view"
    }

    const deletePost = async (e) => {
        e.preventDefault();

        // delete post
        await supabase
            .from('post-database')
            .delete()
            .eq('id', id);

        console.log('removed post!')

        // delete image 
        await supabase
            .storage
            .from('post-database-images')
            .remove([currentPost.image_path])
            
        console.log('removed image!')

        window.location="/comm-view"
    }

    return (
        <div className="main-app">
            
            <div className="create-cntr">
                <div className="create-form">
                    <h1> UPDATE YOUR POST! </h1>

                    <h3 style={ { margin: 0} }> TITLE </h3>
                    <input
                        type="text"
                        size={15}
                        placeholder="short title describing your project!"
                        onChange={(e) => setPostTitle(e.target.value)}
                        value={postTitle}
                        />
                        
                    <h3 style={ { margin: 0} }> IMAGE </h3>
                    <input
                        type="file"
                        accept='image/*'
                        size={15}
                        onChange={handleImage}
                        />    

                    <h3 style={ { margin: 0} }> DESCRIPTION </h3>
                    <textarea 
                        name="description"
                        placeholder="write something..."
                        value={postDesc}
                        onChange={(e) => setPostDesc(e.target.value)}
                        rows={3}
                        className='create-desc'
                        />

                        <h3 style={ { margin: 0} }> TAGS </h3>
                    <div className='tag-create-cntr'>
                        {['art', 'design', 'computer science', 'engineering', 'research', 'novice', 'intermediate', 'advanced', 'other/personal']
                        .map(tag => (
                            <div key={tag}>
                                <input
                                    type="checkbox"
                                    name="tags"
                                    value={tag}
                                    checked={postTags.includes(tag)}
                                    onChange={() => handleTags(tag)}
                                />
                                <label>{tag}</label>
                            </div>
                        ))
                        }
                    </div>

                    <div className='dates-cntr'>
                        <h3 style={ { margin: 0} }> START DATE: </h3>
                        <input
                            type="date"
                            name="start-date"
                            value={postStart}
                            onChange={(e) => setPostStart(e.target.value)}
                            />

                        <h3 style={ { margin: 0} }> EXPECTED END DATE: </h3>
                        <input
                            type="date"
                            name="end-date"
                            value={postEnd}
                            onChange={(e) => setPostEnd(e.target.value)}
                            />

                    </div>
                    
                    <button className='update-btn btn-shadow' onClick={updatePost}> UPDATE YOUR POST! ✐ᝰ </button>
                    <button className='delete-btn btn-shadow' onClick={deletePost}> DELETE YOUR POST! ✖ </button>
                </div>


            </div>
        </div>
    )
}

export default UpdatePost