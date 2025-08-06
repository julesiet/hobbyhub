import { useState } from 'react';
import { supabase } from '../client';

const CreatePost = () => {

    const [postTitle, setPostTitle] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [postDesc, setPostDesc] = useState('');
    const [postTags, setPostTags] = useState([]);
    const [postStart, setPostStart] = useState('');
    const [postEnd, setPostEnd] = useState('');

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

    const createPost = async (e) => {
        e.preventDefault();

        const randomizedId = Math.floor(Math.random() * 10000);
        
        const file_name = postImage.name
        console.log(file_name)
        const path = `placeholder/${randomizedId}-${file_name}`

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('post-database-images')
            .upload(path, postImage);

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return;
        }

        // uploadData.path is e.g. "placeholder/8363-my-photo.png"
        const storageKey = uploadData.path;

        const { data: insertData, error: insertError } = await supabase
            .from('post-database')
            .insert({
                id: randomizedId,
                title: postTitle,
                image_path: storageKey,    // <— save the full key here
                desc: postDesc,
                start_date: postStart,
                end_date: postEnd,
                tags: postTags || []
            })
            .select();

        if (insertError) console.error('Insert error:', insertError);

        window.location="/comm-view"
    }

    return (
        <div className="main-app">
            
            <div className="create-cntr">
                <div className="create-form">
                    <h1> CREATE YOUR POST! </h1>

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
                        {['art', 'design', 'math/physics', 'computer science', 'engineering', 'research', 'novice', 'intermediate', 'advanced', 'other/personal']
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
                    
                    <button className='post-btn btn-shadow' onClick={createPost}> SHARE YOUR POST! ᯓ ✈︎ </button>
                </div>

            </div>
            
        </div>
    )
}

export default CreatePost