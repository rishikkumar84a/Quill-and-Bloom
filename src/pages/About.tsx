import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blog-purple-light py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Quill & Bloom
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              A beautiful space for thoughtful articles and stories
            </p>
          </div>
        </section>
        
        {/* About Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-3xl">Our Story</h2>
              <p>
                Quill & Bloom was born from a passion for thoughtful writing and meaningful storytelling. 
                In a world of fleeting social media posts and clickbait headlines, we wanted to create a space 
                for deeper, more considered content.
              </p>
              
              <p>
                Our platform is designed to celebrate the art of writing and the power of ideas. Whether 
                exploring topics in creativity, personal growth, design, or work-life balance, our goal is to 
                publish content that inspires, educates, and resonates with curious minds.
              </p>
              
              <h2 className="font-serif text-3xl">Our Mission</h2>
              <p>
                At Quill & Bloom, we believe that thoughtful writing has the power to change how we see the world. 
                Our mission is to:
              </p>
              
              <ul>
                <li>Share ideas that inspire creative thinking and personal growth</li>
                <li>Explore topics with depth and nuance</li>
                <li>Connect readers with perspectives that expand their horizons</li>
                <li>Create a beautiful reading experience that respects the reader's time and attention</li>
              </ul>
              
              <h2 className="font-serif text-3xl">Meet the Writer</h2>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-8">
                <img 
                  src="/public/lovable-uploads/971852b9-1cb2-42ef-8092-2604c0fe7212.png" 
                  alt="Rishik Kumar Chaurasiya" 
                  className="w-48 h-48 object-cover rounded-full border-4 border-gray-300"
                  style={{ objectPosition: "center top" }}
                />
                <div>
                  <h3 className="font-serif text-2xl mb-2">Rishik Kumar Chaurasiya</h3>
                  <p className="text-gray-600 mb-4">Writer</p>
                  <p>
                    Rishik is a dedicated writer focusing on current technology trends, blending his passion for writing with insights into technology. His editorial journey began early in Grade 9 when he served as a sub-editor for his school magazine. Beyond writing, he delves into programming, constantly exploring new technologies and programming languages.
                  </p>
                </div>
              </div>
              
              <h2 className="font-serif text-3xl">Get in Touch</h2>
              <p>
                Have a question, suggestion, or just want to say hello? We'd love to hear from you! 
                You can reach us at <a href="mailto:helloquillandbloom@gmail.com" className="text-blog-purple hover:text-blog-purple-dark">helloquillandbloom@gmail.com</a>.
              </p>
              
              <p>
                For writers interested in contributing to Quill & Bloom, please review our 
                <a href="#" className="text-blog-purple hover:text-blog-purple-dark"> submission guidelines</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
