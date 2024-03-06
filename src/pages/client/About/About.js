import React from 'react';

const About = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">About Handmade Craft Ideas</h1>
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
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Explore Projects
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add team member cards here */}
                        {/* Example card structure:
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src="team-member-image.jpg" alt="Team Member" className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">John Doe</h3>
                <p className="text-sm text-gray-600">Role: Founder & CEO</p>
              </div>
            </div>
            */}
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Testimonials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add testimonial cards here */}
                        {/* Example card structure:
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4">
                <p className="text-lg text-gray-800 mb-2">"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet sapien arcu."</p>
                <p className="text-sm text-gray-600">- Jane Doe</p>
              </div>
            </div>
            */}
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Have questions or suggestions? We'd love to hear from you!
                    </p>
                    <form className="max-w-lg">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Your Email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="4"
                                placeholder="Your Message"
                            ></textarea>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default About;
