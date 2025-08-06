import { Link } from "react-router"

const Intro = () => {

    return (
        <div className="main-app">

            <div className='intro-page'>
                <div className='header-intro'>
                Imperfect Intentions
                </div>
                <div className='desc-intro-box'>
                is a web forum designed to allow users to <em>plot out carefully thought out plans + ideas to a 
                supportive user base, </em> or a <u>simple passion project</u> that you just felt needed to be said out loud.
                </div>
                <div className='desc-intro-box'>
                With a variety of tags to choose for your posts, dedicated start/end dates to keep you on track
                and a user-friendly interface to help all members navigate this website, your <strong> imperfect intentions </strong>
                will stand out in a way they have never before!
                </div>
                <div className='desc-intro-box'>
                Want to take a look around? Click the button below, or the <strong> home icon at the top of your screen </strong> 
                to view the current forum!
                </div>
                <div className='join-div'>
                <Link to="/comm-view" className='join-btn'> ENTER THE APPLICATION! </Link>
                </div>
            </div>
        </div>
    )
}

export default Intro