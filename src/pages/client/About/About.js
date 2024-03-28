import React from 'react';

const About = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="w-[1000px] mx-auto px-4 py-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl text-center font-bold text-gray-800 mb-4">
                            About Handmade Craft Ideas
                        </h1>
                        <p className="text-lg text-gray-700 mb-6">
                            Welcome to Handmade Craft Ideas, your ultimate destination for inspiration and creativity!
                            We are passionate about DIY crafts and aim to provide you with a variety of handmade craft
                            ideas to spark your imagination.
                        </p>
                        <p className="text-lg text-gray-700 mb-6">
                            Whether you're a seasoned crafter or just starting out, our goal is to empower you with
                            step-by-step tutorials, tips, and tricks to unleash your creativity and make something
                            beautiful with your own hands.
                        </p>
                        <p className="text-lg text-gray-700 mb-6">
                            At Handmade Craft Ideas, we believe that crafting is not just a hobby, but a therapeutic and
                            fulfilling experience that allows you to express yourself and create meaningful connections
                            with others. Join our community today and let's embark on this creative journey together!
                        </p>
                        <div className="flex justify-center">
                            <a
                                href="/projects"
                                className="bg-[#4a8f92] hover:bg-[#92C7CF] text-white font-bold py-2 px-4 rounded"
                            >
                                Explore Projects
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-8">
                    <div className="w-[315px] h-[397px] mr-7 px-6 py-5 rounded-lg bg-[#AAD7D9]">
                        <img src="https://th.bing.com/th/id/OIG2.ZUOrPbdERISKCJlum9Ad?pid=ImgGn" alt="" />
                        <p className="mt-2 line-clamp-2">
                            At Handmade Craft Ideas, we believe that crafting is not just a hobby, but a therapeutic and
                            fulfilling
                        </p>
                        <em className="hover:text-white hover:underline">
                            {' '}
                            <strong>+ Learn More</strong>{' '}
                        </em>
                    </div>
                    <div className="w-[315px] h-[397px] mr-7 px-6 py-5 rounded-lg bg-[#AAD7D9]">
                        <img src="https://th.bing.com/th/id/OIG2.pB0js5ydgc._per0bl3o?pid=ImgGn" alt="" />
                        <p className="mt-2 line-clamp-2">
                            At Handmade Craft Ideas, we believe that crafting is not just a hobby, but a therapeutic and
                            fulfilling
                        </p>
                        <em className="hover:text-white hover:underline">
                            {' '}
                            <strong>+ Learn More</strong>{' '}
                        </em>
                    </div>
                    <div className="w-[315px] h-[397px] px-6 py-5 rounded-lg bg-[#AAD7D9]">
                        <img src="https://th.bing.com/th/id/OIG2.mcjGkZmh5DDYfAWeyNRZ?pid=ImgGn" alt="" />
                        <p className="mt-2 line-clamp-2">
                            At Handmade Craft Ideas, we believe that crafting is not just a hobby, but a therapeutic and
                            fulfilling
                        </p>
                        <em className="hover:text-white hover:underline">
                            {' '}
                            <strong>+ Learn More</strong>{' '}
                        </em>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
