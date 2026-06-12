import { getBlogBySlug } from "@/src/website/components/blogs/blogs";
import { agency } from "@/src/app/fonts";
import BlogDetail from "@/src/website/components/blogs/blogDetailContainer/blogDetail";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) {
    return {
      title: "Blog not found",
    };
  }
  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.keywords,
    alternates: {
      canonical: `https://ksonsgroup.com/blogs/${slug}`,
    },
  };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return (
      <div
        className={`pt-50 pb-30 lg:text-[22px] text-[20px] lg:leading-[30px] leading-[28px] text-center text-[#0f3c78] ${agency.className}`}
      >
        Blog not found
      </div>
    );
  }

  return (
    <section className="bg-white pt-30 pb-20">
      <div className="app-container">
        <BlogDetail blog={blog} />
      </div>
    </section>
  );
};

export default Page;
