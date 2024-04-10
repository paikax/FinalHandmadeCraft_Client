import React, { useEffect } from 'react';
import Talk from 'talkjs';

function TalkJSChat() {
    useEffect(() => {
        Talk.ready.then(() => {
            const me = new Talk.User({
                id: '99', // Replace with your user ID
                name: 'Client', // Replace with your name
                email: 'client@gmail.com', // Replace with your email
                photoUrl: 'https://your-photo-url.jpg', // Replace with your photo URL
                welcomeMessage: 'Hey there! How can I help you?', // Optional welcome message
            });

            const admin = new Talk.User({
                id: '98', // Replace with your user ID
                name: 'Admin', // Replace with your name
                email: 'admin@gmail.com', // Replace with your email
                photoUrl: 'https://your-photo-url.jpg', // Replace with your photo URL
                welcomeMessage: 'Admin here?', // Optional welcome message
            });

            var session = new Talk.Session({
                appId: 'tFfHQ5OV',
                me: me,
            });
            var conversation = session.getOrCreateConversation(Talk.oneOnOneId(me, admin));
            conversation.setParticipant(me);
            conversation.setParticipant(admin);

            var inbox = session.createInbox({ selected: conversation });
            inbox.mount(document.getElementById('talkjs-container'));
        });
    }, []);

    return <div id="talkjs-container" style={{ height: '500px' }}></div>;
}

export default TalkJSChat;
