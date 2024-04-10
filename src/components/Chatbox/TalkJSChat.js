import React, { useEffect, useState } from 'react';
import Talk from 'talkjs';
import { useSelector } from 'react-redux';

function TalkJSChat() {
    const currentEmail = useSelector((state) => String(state.auth.login.currentUser?.email));
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));
    const [chatVisible, setChatVisible] = useState(false);

    useEffect(() => {
        if (chatVisible) {
            Talk.ready.then(() => {
                const me = new Talk.User({
                    id: currentUserID,
                    name: 'client',
                    email: currentEmail,
                    photoUrl: 'https://your-photo-url.jpg',
                    welcomeMessage: 'Hey there! How can I help you?',
                });

                const admin = new Talk.User({
                    id: '98',
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    photoUrl: 'https://your-photo-url.jpg',
                    welcomeMessage: 'Admin here?',
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
    }, [chatVisible, currentEmail, currentUserID]);

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
