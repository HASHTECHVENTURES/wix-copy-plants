import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './userProjects.css';
import { userDetailsContext } from '../../../Context/contexts';

export default function UserProjects(props) {

    let UserDetailsState = useContext(userDetailsContext);

    const { id } = UserDetailsState.user;

    let [userProj, setUserProj] = useState({
        loadingProj: false,
        currentPage: 1,
        perPage: 10,
        loadFailed: false,
        userProject: []
    })

    useEffect(() => {
        if (id && id !== 'guest_id') {
            loadUserProject();
        } else {
            setUserProj((prev) => ({ ...prev, loadingProj: false }));
        }
    }, [id]);



    const loadUserProject = async () => {
        setUserProj((prev) => ({ ...prev, loadingProj: true, loadFailed: false }))

        try {
            const response = await axios.post('/api/my-projects/', {
                id,
                pageNum: userProj.currentPage,
                perPage: userProj.perPage
            });

            setUserProj((prev) => ({
                ...prev,
                loadingProj: false,
                loadFailed: false,
                userProject: response.data.result,
                currentPage: prev.currentPage + 1
            }));
        } catch (err) {
            console.error(err);
            setUserProj((prev) => ({ ...prev, loadingProj: false, loadFailed: true }));
        }
    }


    return (
        <div>
            <div className="projects_case_container">

                {(userProj.loadingProj) && <div className='loading-wrap'>
                    Loading...
                </div>}
                {
                    (userProj.loadFailed) && <div className="loading-failed">
                        Loading failed — check that the API is running and try again.
                    </div>
                }
                {(userProj.userProject.length > 0) ?
                    <div className="project-showcase">

                        {
                            userProj.userProject.map((e, i) => {
                                return (
                                    <div key={i} className="projectoption">
                                        <Link to={`/designer/${e._id}/${e.pages[0].pageId}/`}>
                                            <div className='projimgshowcase'>
                                                <img alt="" src={(e.prevImgUri) ? e.prevImgUri : "/assets/images/elements/html/dummyImage.jpg"} />
                                            </div>
                                            <div className='projectDetails'>
                                                <div className='projTitle'>{e.websiteName}</div>
                                                <div className='projDets'>{e.pages.length} page(s) &nbsp;&nbsp;| <div className='projStatus' >{(e.published) ? "Live" : "Unpublished"}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })
                        }

                    </div>
                    :
                    !userProj.loadingProj && !userProj.loadFailed && (
                        <div className='createFirstProject'>
                            <h4>Let's get started with your first website</h4>
                            <button onClick={props.createNewWeb}>Create my first website!</button>
                        </div>
                    )
                }

            </div>

        </div>
    )
}
