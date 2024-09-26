import { userAtom } from "@/State/Post/user/user";
import { BlogHomeCard } from "@/components/BlogHomeCard";
import Hero from "@/components/Hero";
import { LoadingBlog } from "@/components/LoadingBLog";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

export function Home() {
  const path = window.location.pathname;
  const user = useRecoilValue(userAtom);
  const divRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (divRef.current) {
        //@ts-ignore
        const divStart = divRef.current.offsetTop;
        // @ts-ignore
      const divEnd = divStart + divRef.current.offsetHeight;
  
      const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        if (currentScrollPos < divStart) {
          setOpacity(1);
        } else if (currentScrollPos > divEnd) {
          setOpacity(0);
        } else {
          setOpacity(1 - (currentScrollPos - divStart) / (divEnd - divStart));
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (location.hash) {
      const elem = document.getElementById(location.hash.slice(1));
      if (elem) elem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    setLoading(true);
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        setBlogs(res.data.blogs.slice(0, 6));
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);
  console.log(blogs);

  return (
    <>
      <Hero/>
      <div id="ourStory" className="w-full  flex items-center flex-col font-poppins justify-center" >
        <div className="w-full flex flex-col items-center md:min-h-screen" ref={divRef} style={{opacity: opacity}}>
        <div className="mt-[80px] px-1 md:px-0 md:mt-[200px] flex flex-col items-center justify-center min">
          <p className="text-[30px]  md:text-[40px] font-bold text-center ">
            "Unleash Your Voice: Create, Share, and Inspire with Your Stories"
          </p>
          <p className="text-[14px] px-1 md:px-0 md:text-xl md:w-[700px] text-center text-slate-600">
            Whether sharing your expertise, breaking news, or whatever’s on your mind, you’re in good company on Medium. Sign up to discover why millions of people have published their passions here.
          </p>
        </div>
        {!user.id ? (
          <div className="flex mt-[50px] gap-[10px] items-center">
            {/* <p className=" text-gray-600  md:text-[20px]">Sign up to Start writing</p> */}
            <Button className="rounded-md border-black border-2 hover:bg-white hover:text-black" onClick={() => {
                navigate("/signup");
            }}>
              Sign Up
            </Button>
          </div>
        ) : (
          <div className="mt-[20px]">
            <span>Welcome </span>
            <span className="font-bold text-2xl">{user.name}</span>{" "}
            <span>to our platform</span>
          </div>
        )}
        {!user.id && (
          <div className="flex items-center flex-col mt-[4px] gap-1">
            <p className="text-[12px] md:text-[12px] text-gray-700">
              Sign up to create your first blog.{" "}
            </p>
            <p className="text-[12px] text-gray-700 underline hover:text-black cursor-pointer">
              {" "}
              Terms & Conditions
            </p>
          </div>
        )}
        </div>
        <div className="md:mt-0 mt-[50px] flex flex-col items-center min-h-screen">
          <div className=" flex flex-col justify-center items-center gap-2">
            <p className="font-bold text-3xl md:text-5xl">Latest Posts</p>
            <p className="text-gray-500 text-center text-[16px] px-1 md:px-0">
              The most recent articles from our amazing contributors.
            </p>
          </div>
          <div className="grid grid-cols-1 px-[2vw] md:px-0 md:grid-cols-3 gap-10 my-10">
            { loading? (
                <div className="flex md:flex-row flex-col items-center gap-20 w-screen justify-center">
                <LoadingBlog />
                <LoadingBlog />
                <LoadingBlog />
                </div>
            ):blogs.map((blog: any) => {
              return (
                <BlogHomeCard
                  id={blog.id}
                  key={blog.id}
                  authorName={blog.authorName}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={blog.createdAt}
                  imagelink={blog.imagelink}
                />
              );
            })}
          </div>
        </div>
        <div className="mt-[50px] w-full  bg-black md:h-full md:p-[40px]">
          <div className="flex flex-col md:flex-col rounded-2xl  items-center justify-center">
            <div className="w-[90vw] md:w-[70%] bg-black md:h-[200px] flex flex-col items-center rounded-full  justify-center py-4 md:py-0">
              <p className="text-white font-bold text-3xl md:text-5xl ">
                "Create a blog worth sharing"
              </p>
              <p className="text-white text-[14px] px-2 md:text-[20px] md:mt-2">
                Create a unique and beautiful blog easily.
              </p>
            </div>
           
            {!user.id && path!=="/signup" && (
                <button
                  onClick={() => {
                    navigate("/signup");
                  }}
                  className="rounded-full px-2 md:p-3 bg-white text-black transition-all duration-600 md:font-semibold text-xs md:text-lg hover:bg-black border-2 py-0 border-black  hover:text-white hover:border-white hover:border-2 hover:shadow-xl hidden md:flex items-center"
                >
                  Get Started
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
