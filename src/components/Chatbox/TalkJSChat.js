import React, { useEffect, useState } from 'react';
import Talk from 'talkjs';
import { useSelector } from 'react-redux';

function TalkJSChat() {
    const currentEmail = useSelector((state) => String(state.auth.login.currentUser?.email));
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));
    const currentPfp = useSelector((state) => String(state.auth.login.currentUser?.profilePhoto));
    const currentUserFirstName = useSelector((state) => String(state.auth.login.currentUser?.firstName));
    const currentUserLastName = useSelector((state) => String(state.auth.login.currentUser?.lastName));
    const userName = currentUserFirstName + ' ' + currentUserLastName;

    const [chatVisible, setChatVisible] = useState(false);

    useEffect(() => {
        if (chatVisible) {
            Talk.ready.then(() => {
                const me = new Talk.User({
                    id: currentUserID,
                    name: userName,
                    email: currentEmail,
                    photoUrl: currentPfp,
                    welcomeMessage: 'Hey there! How can I help you?',
                    role: 'user', // Set the role for the current user
                });

                const admin = new Talk.User({
                    id: 'admin',
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    photoUrl:
                        'https://t4.ftcdn.net/jpg/03/75/38/73/360_F_375387396_wSJM4Zm0kIRoG7Ej8rmkXot9gN69H4u4.jpg',
                    welcomeMessage: 'Admin here?',
                    role: 'admin', // Set the role for the admin user
                });

                const session = new Talk.Session({
                    appId: 'tFfHQ5OV',
                    me: me,
                });
                const conversation = session.getOrCreateConversation(Talk.oneOnOneId(me, admin));
                conversation.setParticipant(me);
                conversation.setParticipant(admin);

                const inbox = session.createInbox({ selected: conversation });
                inbox.mount(document.getElementById('talkjs-container'));
            });
        }
    }, [chatVisible, currentEmail, currentUserID, currentPfp]);

    const toggleChat = () => {
        setChatVisible(!chatVisible);
    };

    return (
        <div className="fixed bottom-4 right-4 z-10">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md" onClick={toggleChat}>
                {chatVisible ? 'Close' : 'Chat with Admin'}
            </button>
            {chatVisible && <div id="talkjs-container" style={{ height: '500px' }}></div>}
        </div>
    );
}

export default TalkJSChat;
