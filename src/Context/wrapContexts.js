import React from 'react'
import PageDesignState from './PageDesign/pageDesignState';
import UserDetailsState from './UserDetails/userDetailsState';
import DragElemsState from './DragElems/dragElemsState';
import CssSheetPreviewState from './cssSheetPreview/cssSheetPreviewState';
import UserBootstrap from '../Component/auth/UserBootstrap';

export default function wrapContexts(props) {
    return (
        <>
            <CssSheetPreviewState>
                <UserDetailsState>
                    <UserBootstrap>
                        <PageDesignState>
                            <DragElemsState>
                                {props.children}
                            </DragElemsState>
                        </PageDesignState>
                    </UserBootstrap>
                </UserDetailsState>
            </CssSheetPreviewState>
        </>
    )
}
